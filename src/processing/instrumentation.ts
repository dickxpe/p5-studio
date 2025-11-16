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
        const acorn = require('acorn');
        const ast = recast.parse(code, {
            parser: {
                parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script', locations: true })
            }
        });

        const b = recast.types.builders;
        const stepMap = buildStepMap(code);

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
                                            b.property('init', b.identifier('line'), b.binaryExpression('-', b.identifier('l'), b.literal(lineOffset || 0))),
                                            b.property('init', b.identifier('column'), b.identifier('c')),
                                            b.property('init', b.identifier('endLine'), b.identifier('el')),
                                            b.property('init', b.identifier('endColumn'), b.identifier('ec'))
                                        ])]
                                    )
                                )
                            ]),
                            b.catchClause(b.identifier('_'), null, b.blockStatement([])),
                            null
                        )
                    ])
                )
            )
        );
        const clearDecl = b.variableDeclaration('const', [
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
                            b.catchClause(b.identifier('_'), null, b.blockStatement([])),
                            null
                        )
                    ])
                )
            )
        ]);
        const waitDecl = b.variableDeclaration('const', [
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
        helpers.push(highlightDecl, clearDecl, waitDecl, advanceDecl, ...exposeHelpers);

        const topLevelBody: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];

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

        // Build lookup of steps per phase for quick access.
        const topSteps = stepMap.steps.filter(s => s.phase === 'top-level');
        const setupSteps = stepMap.steps.filter(s => s.phase === 'setup');
        const drawSteps = stepMap.steps.filter(s => s.phase === 'draw');

        // Insert helpers at the very top of the program.
        (ast.program as any).body = [...helpers, ...topLevelBody];

        // Instrument setup/draw bodies to emit highlight/wait in the order given by the map.
        recast.types.visit(ast, {
            visitFunctionDeclaration(path) {
                const node: any = path.value;
                if (!node || !node.id || (node.id.name !== 'setup' && node.id.name !== 'draw')) {
                    this.traverse(path);
                    return;
                }
                node.async = true;
                const phaseSteps = node.id.name === 'setup' ? setupSteps : drawSteps;

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
                        const loc = stmt.loc && stmt.loc.start ? stmt.loc.start : null;
                        const match = loc ? phaseSteps.find(s => s.loc.line === loc.line && s.loc.column - 1 === loc.column) : undefined;
                        if (match) {
                            result.push(makeHighlightFromStep(match));
                            if (lastStep && match.loc.line === lastStep.loc.line && match.loc.column === lastStep.loc.column) {
                                // Last step: wait once more, then clear highlight automatically.
                                result.push(makeAwaitStep());
                                result.push(
                                    b.expressionStatement(
                                        b.callExpression(b.identifier('__clearHighlight'), [])
                                    )
                                );
                            } else {
                                result.push(makeAwaitStep());
                            }
                        }

                        // Recurse into nested blocks/control-flow.
                        switch (stmt.type) {
                            case 'IfStatement': {
                                if (stmt.consequent) {
                                    const bodyNodes = stmt.consequent.body && Array.isArray(stmt.consequent.body)
                                        ? stmt.consequent.body
                                        : [stmt.consequent];
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
                                    const bodyNodes = stmt.body.body && Array.isArray(stmt.body.body)
                                        ? stmt.body.body
                                        : [stmt.body];
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
                    }
                    return result;
                };

                node.body.body = injectIntoStatements(node.body.body || []);
                return false;
            }
        });

        return recast.print(ast).code;
    } catch {
        return code;
    }
}

