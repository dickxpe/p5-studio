import * as recast from 'recast';
import { buildStepMap } from './stepMap';

// Step-run: still no-op for now (we only use single-step instrumentation).
export function instrumentSetupWithDelays(code: string, _delayMs: number): string {
    return code;
}

// Single-step instrumentation using the declarative step map.
// We inject minimal helpers and highlight calls in setup()/draw() only;
// the webview drives stepping with `step-advance` messages.
export function instrumentSetupForSingleStep(code: string, lineOffset: number, opts?: { disableTopLevelPreSteps?: boolean }): string {
    try {
        const acornParser = require('recast/parsers/acorn');
        const ast = recast.parse(code, {
            parser: {
                parse: (src: string) => acornParser.parse(src, { ecmaVersion: 2020, sourceType: 'script', locations: true })
            }
        });

        const b = recast.types.builders;
        const stepMap = buildStepMap(code);
        const normalizedOffset = typeof lineOffset === 'number' ? lineOffset : 0;
        const topLevelBody: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
        const hasSetupFunctionDecl = topLevelBody.some((n: any) => n && n.type === 'FunctionDeclaration' && n.id && n.id.name === 'setup');

        const getExecutableLoc = (node: any) => {
            if (!node) return null;
            switch (node.type) {
                case 'ExpressionStatement':
                    if (node.expression && node.expression.loc) return node.expression.loc;
                    break;
                case 'VariableDeclaration': {
                    const withLoc = (node.declarations || []).find((d: any) => (d && d.init && d.init.loc) || (d && d.id && d.id.loc));
                    if (withLoc) {
                        if (withLoc.init && withLoc.init.loc) return withLoc.init.loc;
                        if (withLoc.id && withLoc.id.loc) return withLoc.id.loc;
                    }
                    break;
                }
                case 'ReturnStatement':
                case 'ThrowStatement':
                    if (node.argument && node.argument.loc) return node.argument.loc;
                    break;
            }
            return node.loc || null;
        };

        const toDocumentLine = (identifier: string) => {
            if (!normalizedOffset) return b.identifier(identifier);
            return b.callExpression(
                b.memberExpression(b.identifier('Math'), b.identifier('max')),
                [
                    b.binaryExpression('-', b.identifier(identifier), b.literal(normalizedOffset)),
                    b.literal(1)
                ]
            );
        };

        // Build lookup of steps per phase for quick access.
        const topSteps = stepMap.steps.filter(s => s.phase === 'top-level');
        const setupSteps = stepMap.steps.filter(s => s.phase === 'setup');
        const drawSteps = stepMap.steps.filter(s => s.phase === 'draw');
        const functionStepsByName = new Map<string, any[]>();
        for (const step of stepMap.steps) {
            if (step.phase === 'function' && step.functionName) {
                if (!functionStepsByName.has(step.functionName)) {
                    functionStepsByName.set(step.functionName, []);
                }
                functionStepsByName.get(step.functionName)!.push(step);
            }
        }
        const asyncFunctionNames = new Set(Array.from(functionStepsByName.keys()));

        const markSetupDoneExpr = () => b.expressionStatement(
            b.assignmentExpression('=',
                b.memberExpression(b.identifier('window'), b.identifier('__liveP5SetupDone')),
                b.literal(true)
            )
        );
        const setFrameWaitExpr = (value: boolean) => b.expressionStatement(
            b.assignmentExpression('=',
                b.memberExpression(b.identifier('window'), b.identifier('__liveP5ShouldWaitForFrame')),
                b.literal(value)
            )
        );
        const setFrameInProgressExpr = (value: boolean) => b.expressionStatement(
            b.assignmentExpression('=',
                b.memberExpression(b.identifier('window'), b.identifier('__liveP5FrameInProgress')),
                b.literal(value)
            )
        );

        // Controller helpers placed at top of program so both setup and draw can use them.
        const helpers: any[] = [];
        const highlightDecl = b.expressionStatement(
            b.assignmentExpression('=',
                b.memberExpression(b.identifier('window'), b.identifier('__highlight')),
                b.arrowFunctionExpression(
                    [b.identifier('l'), b.identifier('c'), b.identifier('el'), b.identifier('ec')],
                    b.blockStatement([
                        b.tryStatement(
                            b.blockStatement([
                                b.expressionStatement(
                                    b.callExpression(
                                        b.memberExpression(b.identifier('vscode'), b.identifier('postMessage')),
                                        [b.objectExpression([
                                            b.property('init', b.identifier('type'), b.literal('highlightLine')),
                                            b.property('init', b.identifier('line'), toDocumentLine('l')),
                                            b.property('init', b.identifier('column'), b.identifier('c')),
                                            b.property('init', b.identifier('endLine'), toDocumentLine('el')),
                                            b.property('init', b.identifier('endColumn'), b.identifier('ec'))
                                        ])]
                                    )
                                )
                            ]),
                            b.catchClause(b.identifier('_'), null, b.blockStatement([]))
                        )
                    ])
                )
            )
        );
        const clearDecl = b.variableDeclaration('var', [
            b.variableDeclarator(
                b.identifier('__clearHighlight'),
                b.arrowFunctionExpression(
                    [],
                    b.blockStatement([
                        b.tryStatement(
                            b.blockStatement([
                                b.expressionStatement(
                                    b.callExpression(
                                        b.memberExpression(b.identifier('vscode'), b.identifier('postMessage')),
                                        [b.objectExpression([b.property('init', b.identifier('type'), b.literal('clearHighlight'))])]
                                    )
                                )
                            ]),
                            b.catchClause(b.identifier('_'), null, b.blockStatement([]))
                        )
                    ])
                )
            )
        ]);
        const waitDecl = b.variableDeclaration('var', [
            b.variableDeclarator(
                b.identifier('__waitStep'),
                b.arrowFunctionExpression(
                    [],
                    b.newExpression(b.identifier('Promise'), [
                        b.arrowFunctionExpression([b.identifier('rs')],
                            b.blockStatement([
                                b.expressionStatement(
                                    b.assignmentExpression('=',
                                        b.memberExpression(b.identifier('window'), b.identifier('__liveP5StepResolve')),
                                        b.identifier('rs')
                                    )
                                )
                            ])
                        )
                    ])
                )
            )
        ]);
        const advanceDecl = b.expressionStatement(
            b.assignmentExpression('=',
                b.memberExpression(b.identifier('window'), b.identifier('__liveP5StepAdvance')),
                b.functionExpression(null, [],
                    b.blockStatement([
                        b.variableDeclaration('const', [
                            b.variableDeclarator(
                                b.identifier('r'),
                                b.memberExpression(b.identifier('window'), b.identifier('__liveP5StepResolve'))
                            )
                        ]),
                        b.expressionStatement(
                            b.assignmentExpression('=',
                                b.memberExpression(b.identifier('window'), b.identifier('__liveP5StepResolve')),
                                b.literal(null)
                            )
                        ),
                        b.ifStatement(
                            b.identifier('r'),
                            b.blockStatement([b.expressionStatement(b.callExpression(b.identifier('r'), []))])
                        )
                    ])
                )
            )
        );
        const exposeHelpers = [
            b.expressionStatement(
                b.assignmentExpression('=',
                    b.memberExpression(b.identifier('window'), b.identifier('__liveP5Highlight')),
                    b.memberExpression(b.identifier('window'), b.identifier('__highlight'))
                )
            ),
            b.expressionStatement(
                b.assignmentExpression('=',
                    b.memberExpression(b.identifier('window'), b.identifier('__liveP5ClearHighlight')),
                    b.identifier('__clearHighlight')
                )
            ),
            b.expressionStatement(
                b.assignmentExpression('=',
                    b.memberExpression(b.identifier('window'), b.identifier('__liveP5WaitStep')),
                    b.identifier('__waitStep')
                )
            )
        ];
        const setupDoneInit = b.expressionStatement(
            b.assignmentExpression('=',
                b.memberExpression(b.identifier('window'), b.identifier('__liveP5SetupDone')),
                hasSetupFunctionDecl ? b.literal(false) : b.literal(true)
            )
        );
        const frameWaitInit = setFrameWaitExpr(true);
        const frameInProgressInit = setFrameInProgressExpr(false);
        helpers.push(highlightDecl, clearDecl, waitDecl, advanceDecl, setupDoneInit, frameWaitInit, frameInProgressInit, ...exposeHelpers);

        // Helper to create a highlight call from a StepTarget.
        const makeHighlightFromStep = (step: { loc: { line: number; column: number; endLine: number; endColumn: number } }) =>
            b.expressionStatement(
                b.callExpression(
                    b.memberExpression(b.identifier('window'), b.identifier('__highlight')),
                    [
                        b.literal(step.loc.line),
                        b.literal(step.loc.column),
                        b.literal(step.loc.endLine),
                        b.literal(step.loc.endColumn)
                    ]
                )
            );
        const makeAwaitStep = () =>
            b.expressionStatement(
                b.awaitExpression(b.callExpression(b.identifier('__waitStep'), []))
            );

        // Insert helpers at the very top of the program.
        (ast.program as any).body = [...helpers, ...topLevelBody];

        // Instrument setup/draw/custom bodies to emit highlight/wait in the order given by the map.
        recast.types.visit(ast, {
            visitFunctionDeclaration(path) {
                const node: any = path.value;
                if (!node || !node.id || (node.id.name !== 'setup' && node.id.name !== 'draw' && !asyncFunctionNames.has(node.id.name))) {
                    this.traverse(path);
                    return;
                }
                node.async = true;
                let phaseSteps: any[];
                if (node.id.name === 'setup') phaseSteps = setupSteps;
                else if (node.id.name === 'draw') phaseSteps = drawSteps;
                else phaseSteps = functionStepsByName.get(node.id.name) || [];

                if (node.id.name === 'draw') {
                    const setupGuard = b.ifStatement(
                        b.unaryExpression('!', b.memberExpression(b.identifier('window'), b.identifier('__liveP5SetupDone'))),
                        b.blockStatement([b.returnStatement(null)])
                    );
                    const inProgressGuard = b.ifStatement(
                        b.memberExpression(b.identifier('window'), b.identifier('__liveP5FrameInProgress')),
                        b.blockStatement([b.returnStatement(null)])
                    );
                    const frameWaitGuard = b.ifStatement(
                        b.unaryExpression('!', b.memberExpression(b.identifier('window'), b.identifier('__liveP5ShouldWaitForFrame'))),
                        b.blockStatement([
                            setFrameWaitExpr(true)
                        ]),
                        b.blockStatement([
                            b.expressionStatement(b.awaitExpression(b.callExpression(b.identifier('__waitStep'), []))),
                            setFrameWaitExpr(true)
                        ])
                    );
                    const startFrame = setFrameInProgressExpr(true);
                    const existingBody = node.body && Array.isArray(node.body.body) ? node.body.body : [];
                    node.body.body = [setupGuard, inProgressGuard, frameWaitGuard, startFrame, ...existingBody];
                }

                // For setup: emit top-level steps first, then setup body.
                if (node.id.name === 'setup' && topSteps.length > 0 && !opts?.disableTopLevelPreSteps) {
                    const injected: any[] = [];
                    for (const step of topSteps) {
                        injected.push(makeHighlightFromStep(step));
                        injected.push(makeAwaitStep());
                    }
                    node.body.body = [...injected, ...node.body.body];
                }

                // Recursively walk the function body and inject highlight/await before each mapped step.
                const allPhaseSteps = phaseSteps.slice().sort((a, b) => a.loc.line - b.loc.line || a.loc.column - b.loc.column);
                const lastStep = allPhaseSteps[allPhaseSteps.length - 1];

                const injectIntoStatements = (stmts: any[]): any[] => {
                    const result: any[] = [];
                    for (const stmt of stmts) {
                        if (!stmt) continue;
                        const postActions: any[] = [];

                        if (asyncFunctionNames.size > 0) {
                            if (stmt.type === 'ExpressionStatement' && stmt.expression) {
                                if (stmt.expression.type === 'CallExpression') {
                                    const cal = stmt.expression.callee;
                                    if (cal && cal.type === 'Identifier' && asyncFunctionNames.has(cal.name)) {
                                        const originalCall = stmt.expression;
                                        const awaited = b.awaitExpression(originalCall);
                                        awaited.loc = originalCall.loc;
                                        stmt.expression = awaited;
                                    }
                                }
                            } else if (stmt.type === 'ReturnStatement' && stmt.argument) {
                                if (stmt.argument.type === 'CallExpression') {
                                    const cal = stmt.argument.callee;
                                    if (cal && cal.type === 'Identifier' && asyncFunctionNames.has(cal.name)) {
                                        const originalReturnCall = stmt.argument;
                                        const awaitedReturn = b.awaitExpression(originalReturnCall);
                                        awaitedReturn.loc = originalReturnCall.loc;
                                        stmt.argument = awaitedReturn;
                                    }
                                }
                            }
                        }
                        const execLoc = getExecutableLoc(stmt);
                        const loc = execLoc && execLoc.start ? execLoc.start : null;
                        const match = loc ? phaseSteps.find(s => s.loc.line === loc.line && s.loc.column - 1 === loc.column) : undefined;
                        if (match) {
                            result.push(makeHighlightFromStep(match));
                            if (lastStep && match.loc.line === lastStep.loc.line && match.loc.column === lastStep.loc.column) {
                                // Last step: wait once more, then clear highlight automatically.
                                result.push(makeAwaitStep());
                                if (node.id.name === 'setup') {
                                    postActions.push(markSetupDoneExpr());
                                    postActions.push(setFrameWaitExpr(false));
                                }
                                result.push(
                                    b.expressionStatement(
                                        b.callExpression(b.identifier('__clearHighlight'), [])
                                    )
                                );
                                if (node.id.name === 'draw') {
                                    postActions.push(setFrameWaitExpr(false));
                                    postActions.push(setFrameInProgressExpr(false));
                                }
                            } else {
                                result.push(makeAwaitStep());
                            }
                        }

                        // Recurse into nested blocks/control-flow.
                        switch (stmt.type) {
                            case 'IfStatement': {
                                if (stmt.consequent) {
                                    const bodyNodes = (stmt.consequent.body && Array.isArray(stmt.consequent.body)) ? stmt.consequent.body : [stmt.consequent];
                                    stmt.consequent.body = injectIntoStatements(bodyNodes);
                                }
                                if (stmt.alternate) {
                                    if (stmt.alternate.body && Array.isArray(stmt.alternate.body)) {
                                        stmt.alternate.body = injectIntoStatements(stmt.alternate.body);
                                    } else {
                                        const altInjected = injectIntoStatements([stmt.alternate]);
                                        stmt.alternate = altInjected[0] || stmt.alternate;
                                    }
                                }
                                result.push(stmt);
                                break;
                            }
                            case 'BlockStatement': {
                                stmt.body = injectIntoStatements(stmt.body || []);
                                result.push(stmt);
                                break;
                            }
                            case 'ForStatement':
                            case 'ForInStatement':
                            case 'ForOfStatement':
                            case 'WhileStatement':
                            case 'DoWhileStatement': {
                                if (stmt.body) {
                                    const bodyNodes = (stmt.body.body && Array.isArray(stmt.body.body)) ? stmt.body.body : [stmt.body];
                                    const injectedBody = injectIntoStatements(bodyNodes);
                                    if (Array.isArray(stmt.body.body)) stmt.body.body = injectedBody;
                                    else stmt.body = injectedBody[0] || stmt.body;
                                }
                                result.push(stmt);
                                break;
                            }
                            case 'SwitchStatement': {
                                for (const cs of stmt.cases || []) {
                                    cs.consequent = injectIntoStatements(cs.consequent || []);
                                }
                                result.push(stmt);
                                break;
                            }
                            default:
                                result.push(stmt);
                        }

                        if (postActions.length > 0) {
                            result.push(...postActions);
                        }
                    }
                    return result;
                };

                node.body.body = injectIntoStatements(node.body.body || []);
                if (node.id.name === 'setup') {
                    node.body.body.push(markSetupDoneExpr());
                    node.body.body.push(setFrameWaitExpr(false));
                } else if (node.id.name === 'draw') {
                    node.body.body.push(setFrameWaitExpr(false));
                    node.body.body.push(setFrameInProgressExpr(false));
                }
                return false;
            }
        });

        return recast.print(ast).code;
    } catch {
        return code;
    }
}

