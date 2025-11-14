import * as recast from 'recast';

// Instrument setup() to insert `await __sleep(delayMs)` between top-level statements/blocks.
// Returns original code if setup() cannot be found.
export function instrumentSetupWithDelays(code: string, delayMs: number): string {
    try {
        const acorn = require('acorn');
        const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });

        let changed = false;
        recast.types.visit(ast, {
            visitFunctionDeclaration(path) {
                const node: any = path.value;
                if (node.id && node.id.name === 'setup' && node.body && Array.isArray(node.body.body)) {
                    // Ensure async
                    node.async = true;
                    const b = recast.types.builders;
                    // const __sleep = (ms) => new Promise(r => setTimeout(r, ms));
                    const sleepDecl = b.variableDeclaration('const', [
                        b.variableDeclarator(
                            b.identifier('__sleep'),
                            b.arrowFunctionExpression(
                                [b.identifier('ms')],
                                b.newExpression(
                                    b.identifier('Promise'),
                                    [b.arrowFunctionExpression(
                                        [b.identifier('r')],
                                        b.callExpression(
                                            b.identifier('setTimeout'),
                                            [b.identifier('r'), b.identifier('ms')]
                                        )
                                    )]
                                )
                            )
                        )
                    ]);
                    const makeAwaitStmt = () => b.expressionStatement(
                        b.awaitExpression(
                            b.callExpression(b.identifier('__sleep'), [b.literal(delayMs)])
                        )
                    );

                    // Add an await at the start of every loop body inside setup(), but do not descend into nested functions
                    recast.types.visit(node.body, {
                        visitFunctionDeclaration(p) { return false; },
                        visitFunctionExpression(p) { return false; },
                        visitArrowFunctionExpression(p) { return false; },
                        visitForStatement(p) {
                            const loop: any = p.value;
                            if (loop.body && loop.body.type === 'BlockStatement') {
                                loop.body.body.unshift(makeAwaitStmt());
                            } else if (loop.body) {
                                loop.body = b.blockStatement([makeAwaitStmt(), loop.body]);
                            }
                            this.traverse(p);
                        },
                        visitWhileStatement(p) {
                            const loop: any = p.value;
                            if (loop.body && loop.body.type === 'BlockStatement') {
                                loop.body.body.unshift(makeAwaitStmt());
                            } else if (loop.body) {
                                loop.body = b.blockStatement([makeAwaitStmt(), loop.body]);
                            }
                            this.traverse(p);
                        },
                        visitDoWhileStatement(p) {
                            const loop: any = p.value;
                            if (loop.body && loop.body.type === 'BlockStatement') {
                                loop.body.body.unshift(makeAwaitStmt());
                            } else if (loop.body) {
                                loop.body = b.blockStatement([makeAwaitStmt(), loop.body]);
                            }
                            this.traverse(p);
                        },
                        visitForInStatement(p) {
                            const loop: any = p.value;
                            if (loop.body && loop.body.type === 'BlockStatement') {
                                loop.body.body.unshift(makeAwaitStmt());
                            } else if (loop.body) {
                                loop.body = b.blockStatement([makeAwaitStmt(), loop.body]);
                            }
                            this.traverse(p);
                        },
                        visitForOfStatement(p) {
                            const loop: any = p.value;
                            if (loop.body && loop.body.type === 'BlockStatement') {
                                loop.body.body.unshift(makeAwaitStmt());
                            } else if (loop.body) {
                                loop.body = b.blockStatement([makeAwaitStmt(), loop.body]);
                            }
                            this.traverse(p);
                        },
                    });

                    const orig = node.body.body.slice();
                    const interleaved: any[] = [sleepDecl];
                    for (let i = 0; i < orig.length; i++) {
                        interleaved.push(orig[i]);
                        interleaved.push(makeAwaitStmt());
                    }
                    node.body.body = interleaved;
                    changed = true;
                    return false; // do not traverse into this function further
                }
                this.traverse(path);
            }
        });
        if (!changed) return code;
        return recast.print(ast).code;
    } catch (e) {
        return code;
    }
}

// Instrument setup() for single-step execution. Before each statement in setup() (and inside loop/if blocks),
// insert a call to __highlight(line/col) and `await __waitStep()` so each click advances to the next statement.
export function instrumentSetupForSingleStep(code: string, lineOffset: number, opts?: { disableTopLevelPreSteps?: boolean }): string {
    try {
        const acorn = require('acorn');
        const ast = recast.parse(code, {
            parser: {
                parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script', locations: true })
            }
        });

        const b = recast.types.builders;
        let changed = false;

        // Collect names of user-defined functions (exclude setup/draw) so we can await their calls to enable step-into
        const userFunctionNames = new Set<string>();
        try {
            const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
            for (const n of body) {
                if (n && n.type === 'FunctionDeclaration' && n.id && typeof n.id.name === 'string') {
                    const nm = n.id.name;
                    if (nm !== 'setup' && nm !== 'draw') userFunctionNames.add(nm);
                }
            }
        } catch { /* ignore */ }

        // Collect top-level statements (non-function) to highlight before entering setup()
        // We don't re-execute them (they already ran on load); we only highlight + await
        const topLevelPreSteps: any[] = [];
        try {
            if (!opts || !opts.disableTopLevelPreSteps) {
                const programBody: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
                for (const stmt of programBody) {
                    if (!stmt || typeof stmt.type !== 'string') continue;
                    // Skip function declarations (including setup/draw and helpers)
                    if (stmt.type === 'FunctionDeclaration') continue;
                    // Skip empty statements
                    if (stmt.type === 'EmptyStatement') continue;
                    // Include directives (e.g., 'use strict') as a single highlight step
                    const hi = ((): any => {
                        const loc = stmt && (stmt as any).loc ? (stmt as any).loc : null;
                        if (!loc) return null;
                        const start = loc.start || { line: 1, column: 0 };
                        const end = loc.end || start;
                        return b.expressionStatement(
                            b.callExpression(b.identifier('__highlight'), [
                                b.literal(start.line),
                                b.literal(start.column + 1),
                                b.literal(end.line),
                                b.literal(end.column + 1)
                            ])
                        );
                    })();
                    if (hi) {
                        topLevelPreSteps.push(hi);
                        // await gate to advance to next top-level statement
                        topLevelPreSteps.push(
                            b.expressionStatement(b.awaitExpression(b.callExpression(b.identifier('__waitStep'), [])))
                        );
                    }
                }
            }
        } catch { /* ignore */ }

        // Determine whether a setup() function exists
        let hasSetupFunction = false;
        try {
            const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
            hasSetupFunction = body.some(n => n && n.type === 'FunctionDeclaration' && n.id && n.id.name === 'setup');
        } catch { hasSetupFunction = false; }

        const makeHighlightFor = (node: any) => {
            if (!node || !node.loc) return null;

            // For loop statements, prefer highlighting the first body statement
            if ((node.type === 'ForStatement'
                || node.type === 'WhileStatement'
                || node.type === 'DoWhileStatement') &&
                node.body &&
                node.body.type === 'BlockStatement' &&
                Array.isArray(node.body.body) &&
                node.body.body.length > 0 &&
                node.body.body[0] &&
                node.body.body[0].loc) {
                const innerLoc = node.body.body[0].loc;
                const startInner = innerLoc.start || { line: 1, column: 0 };
                const endInner = innerLoc.end || startInner;
                return b.expressionStatement(
                    b.callExpression(b.identifier('__highlight'), [
                        b.literal(startInner.line),
                        b.literal(startInner.column + 1),
                        b.literal(endInner.line),
                        b.literal(endInner.column + 1)
                    ])
                );
            }

            const loc = node.loc;
            const start = loc.start || { line: 1, column: 0 };
            const end = loc.end || start;
            return b.expressionStatement(
                b.callExpression(b.identifier('__highlight'), [
                    b.literal(start.line), b.literal(start.column + 1), b.literal(end.line), b.literal(end.column + 1)
                ])
            );
        };
        // Global helper calls guarded by stepping flag
        const makeGlobalHighlightFor = (node: any) => {
            const loc = node && node.loc ? node.loc : null;
            if (!loc) return null;
            const start = loc.start || { line: 1, column: 0 };
            const end = loc.end || start;
            return b.ifStatement(
                b.memberExpression(b.identifier('window'), b.identifier('__liveP5Stepping')),
                b.blockStatement([
                    b.expressionStatement(
                        b.callExpression(
                            b.memberExpression(b.identifier('window'), b.identifier('__liveP5Highlight')),
                            [b.literal(start.line), b.literal(start.column + 1), b.literal(end.line), b.literal(end.column + 1)]
                        )
                    )
                ])
            );
        };
        const makeAwaitStep = () => b.expressionStatement(b.awaitExpression(b.callExpression(b.identifier('__waitStep'), [])));
        const makeGlobalAwaitStep = () => b.ifStatement(
            b.memberExpression(b.identifier('window'), b.identifier('__liveP5Stepping')),
            b.blockStatement([
                b.expressionStatement(
                    b.awaitExpression(
                        b.callExpression(
                            b.memberExpression(b.identifier('window'), b.identifier('__liveP5WaitStep')),
                            []
                        )
                    )
                )
            ])
        );

        function instrumentBlock(block: any): any {
            if (!block || block.type !== 'BlockStatement' || !Array.isArray(block.body)) return block;
            const newBody: any[] = [];
            for (const stmt of block.body) {
                // Don't instrument nested function declarations
                if (stmt && (stmt.type === 'FunctionDeclaration' || stmt.type === 'FunctionExpression')) {
                    newBody.push(stmt);
                    continue;
                }
                // For loop statements, skip highlighting the loop header itself
                if (stmt && (
                    stmt.type === 'ForStatement'
                    || stmt.type === 'WhileStatement'
                    || stmt.type === 'DoWhileStatement'
                    || stmt.type === 'ForInStatement'
                    || stmt.type === 'ForOfStatement')) {
                    newBody.push(instrumentNode(stmt));
                    continue;
                }
                const hi = makeHighlightFor(stmt);
                if (hi) newBody.push(hi);
                newBody.push(makeAwaitStep());
                newBody.push(instrumentNode(stmt));
            }
            block.body = newBody;
            return block;
        }
        function instrumentBlockGlobal(block: any): any {
            if (!block || block.type !== 'BlockStatement' || !Array.isArray(block.body)) return block;
            const newBody: any[] = [];
            for (const stmt of block.body) {
                if (stmt && (stmt.type === 'FunctionDeclaration' || stmt.type === 'FunctionExpression')) {
                    newBody.push(stmt);
                    continue;
                }
                const hi = makeGlobalHighlightFor(stmt);
                if (hi) newBody.push(hi);
                newBody.push(makeGlobalAwaitStep());
                newBody.push(instrumentNodeGlobal(stmt));
            }
            block.body = newBody;
            return block;
        }

        function ensureBlockGlobal(node: any, prop: string) {
            if (!node[prop]) return;
            if (node[prop].type !== 'BlockStatement') {
                node[prop] = b.blockStatement([node[prop]]);
            }
            node[prop] = instrumentBlockGlobal(node[prop]);
        }

        function instrumentNodeGlobal(node: any): any {
            if (!node || typeof node.type !== 'string') return node;
            switch (node.type) {
                case 'BlockStatement':
                    return instrumentBlockGlobal(node);
                case 'IfStatement':
                    if (node.consequent) {
                        if (node.consequent.type !== 'BlockStatement') node.consequent = b.blockStatement([node.consequent]);
                        node.consequent = instrumentBlockGlobal(node.consequent);
                    }
                    if (node.alternate) {
                        if (node.alternate.type !== 'BlockStatement' && node.alternate.type !== 'IfStatement') {
                            node.alternate = b.blockStatement([node.alternate]);
                        }
                        if (node.alternate.type === 'BlockStatement') node.alternate = instrumentBlockGlobal(node.alternate);
                        else node.alternate = instrumentNodeGlobal(node.alternate);
                    }
                    return node;
                case 'ForStatement':
                case 'WhileStatement':
                case 'DoWhileStatement':
                case 'ForInStatement':
                case 'ForOfStatement':
                    ensureBlockGlobal(node, 'body');
                    return node;
                case 'SwitchStatement':
                    if (Array.isArray(node.cases)) {
                        for (const c of node.cases) {
                            if (Array.isArray(c.consequent)) {
                                const newCons: any[] = [];
                                for (const s of c.consequent) {
                                    const hi = makeGlobalHighlightFor(s);
                                    if (hi) newCons.push(hi);
                                    newCons.push(makeGlobalAwaitStep());
                                    newCons.push(instrumentNodeGlobal(s));
                                }
                                c.consequent = newCons;
                            }
                        }
                    }
                    return node;
                default:
                    return node;
            }
        }

        function ensureBlock(node: any, prop: string) {
            if (!node[prop]) return;
            if (node[prop].type !== 'BlockStatement') {
                node[prop] = b.blockStatement([node[prop]]);
            }
            node[prop] = instrumentBlock(node[prop]);
        }

        function instrumentNode(node: any): any {
            if (!node || typeof node.type !== 'string') return node;
            switch (node.type) {
                case 'BlockStatement':
                    return instrumentBlock(node);
                case 'ExpressionStatement': {
                    // If this is a direct call to a known user-defined function, rewrite to `await func(...)` to step-into
                    try {
                        const expr = node.expression;
                        if (expr && expr.type === 'CallExpression' && expr.callee && expr.callee.type === 'Identifier') {
                            const name = expr.callee.name;
                            if (userFunctionNames.has(name)) {
                                // Wrap call in await
                                const awaited = b.expressionStatement(
                                    b.awaitExpression(
                                        b.callExpression(b.identifier(name), expr.arguments || [])
                                    )
                                );
                                return awaited;
                            }
                        }
                    } catch { /* fallthrough to default instrumentation */ }
                    return node;
                }
                case 'IfStatement':
                    if (node.consequent) {
                        if (node.consequent.type !== 'BlockStatement') node.consequent = b.blockStatement([node.consequent]);
                        node.consequent = instrumentBlock(node.consequent);
                    }
                    if (node.alternate) {
                        if (node.alternate.type !== 'BlockStatement' && node.alternate.type !== 'IfStatement') {
                            node.alternate = b.blockStatement([node.alternate]);
                        }
                        if (node.alternate.type === 'BlockStatement') node.alternate = instrumentBlock(node.alternate);
                        else node.alternate = instrumentNode(node.alternate);
                    }
                    return node;
                case 'ForStatement':
                case 'WhileStatement':
                case 'DoWhileStatement':
                case 'ForInStatement':
                case 'ForOfStatement':
                    ensureBlock(node, 'body');
                    return node;
                case 'SwitchStatement':
                    if (Array.isArray(node.cases)) {
                        for (const c of node.cases) {
                            if (Array.isArray(c.consequent)) {
                                const newCons: any[] = [];
                                for (const s of c.consequent) {
                                    const hi = makeHighlightFor(s);
                                    if (hi) newCons.push(hi);
                                    newCons.push(makeAwaitStep());
                                    newCons.push(instrumentNode(s));
                                }
                                c.consequent = newCons;
                            }
                        }
                    }
                    return node;
                default:
                    return node;
            }
        }

        recast.types.visit(ast, {
            visitFunctionDeclaration(path) {
                const node: any = path.value;
                if (node.id && (node.id.name === 'setup' || node.id.name === 'draw') && node.body && Array.isArray(node.body.body)) {
                    node.async = true;
                    // Controller helpers at the top of setup/draw
                    const highlightDecl = b.variableDeclaration('const', [
                        b.variableDeclarator(
                            b.identifier('__highlight'),
                            b.arrowFunctionExpression(
                                [b.identifier('l'), b.identifier('c'), b.identifier('el'), b.identifier('ec')],
                                b.blockStatement([
                                    b.tryStatement(
                                        b.blockStatement([
                                            b.expressionStatement(
                                                b.callExpression(b.memberExpression(b.identifier('vscode'), b.identifier('postMessage')),
                                                    [b.objectExpression([
                                                        b.property('init', b.identifier('type'), b.literal('highlightLine')),
                                                        // Apply line offset from wrapper if present; clamp in extension when applying
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
                    ]);
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
                            b.arrowFunctionExpression([],
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

                    const original = node.body.body.slice();
                    const prelude = [highlightDecl, clearDecl, waitDecl, advanceDecl];
                    // Mark stepping session active so user functions can step-in
                    prelude.push(
                        b.expressionStatement(
                            b.assignmentExpression('=',
                                b.memberExpression(b.identifier('window'), b.identifier('__liveP5Stepping')),
                                b.literal(true)
                            )
                        )
                    );
                    // Export helpers on window so other functions can use them during stepping
                    prelude.push(
                        b.expressionStatement(
                            b.assignmentExpression('=',
                                b.memberExpression(b.identifier('window'), b.identifier('__liveP5Highlight')),
                                b.identifier('__highlight')
                            )
                        )
                    );
                    prelude.push(
                        b.expressionStatement(
                            b.assignmentExpression('=',
                                b.memberExpression(b.identifier('window'), b.identifier('__liveP5ClearHighlight')),
                                b.identifier('__clearHighlight')
                            )
                        )
                    );
                    prelude.push(
                        b.expressionStatement(
                            b.assignmentExpression('=',
                                b.memberExpression(b.identifier('window'), b.identifier('__liveP5WaitStep')),
                                b.identifier('__waitStep')
                            )
                        )
                    );
                    // Gate: prevent draw() from running before setup() has fully finished stepping
                    const setGateSetup = b.expressionStatement(
                        b.assignmentExpression('=',
                            b.memberExpression(b.identifier('window'), b.identifier('__liveP5Gate')),
                            b.literal('setup')
                        )
                    );
                    const clearGate = b.expressionStatement(
                        b.assignmentExpression('=',
                            b.memberExpression(b.identifier('window'), b.identifier('__liveP5Gate')),
                            b.literal(null)
                        )
                    );
                    // If any gate is set (e.g., top-level stepping or setup stepping), skip draw() this frame
                    const drawGateGuard = b.ifStatement(
                        b.memberExpression(b.identifier('window'), b.identifier('__liveP5Gate')),
                        b.blockStatement([b.returnStatement(null)])
                    );
                    const drawBusyGuard = b.ifStatement(
                        b.memberExpression(b.identifier('window'), b.identifier('__liveP5DrawBusy')),
                        b.blockStatement([b.returnStatement(null)])
                    );
                    const setDrawBusy = b.expressionStatement(
                        b.assignmentExpression('=',
                            b.memberExpression(b.identifier('window'), b.identifier('__liveP5DrawBusy')),
                            b.literal(true)
                        )
                    );
                    const clearDrawBusy = b.expressionStatement(
                        b.assignmentExpression('=',
                            b.memberExpression(b.identifier('window'), b.identifier('__liveP5DrawBusy')),
                            b.literal(false)
                        )
                    );
                    // frame counter: init in setup, increment in accepted draw frames
                    const initFrameCounter = b.expressionStatement(
                        b.assignmentExpression('=',
                            b.memberExpression(b.identifier('window'), b.identifier('__liveP5FrameCounter')),
                            b.literal(0)
                        )
                    );
                    const incFrameCounter = b.expressionStatement(
                        b.assignmentExpression('=',
                            b.memberExpression(b.identifier('window'), b.identifier('__liveP5FrameCounter')),
                            b.binaryExpression('+',
                                b.logicalExpression('||',
                                    b.memberExpression(b.identifier('window'), b.identifier('__liveP5FrameCounter')),
                                    b.literal(0)
                                ),
                                b.literal(1)
                            )
                        )
                    );
                    // Instrument the original body statements
                    const instrumentedBlock = instrumentBlock(b.blockStatement(original));
                    // No additional setup entry step: stepping starts at first instrumented statement
                    const entryStep: any[] = [];
                    // Append a final clear highlight call when function finishes (setup or draw)
                    const callClear = b.expressionStatement(b.callExpression(b.identifier('__clearHighlight'), []));
                    if (node.id && node.id.name === 'setup') {
                        // setup(): set gate before any stepping, show top-level highlights first, then clear gate at the very end
                        node.body.body = [...prelude, initFrameCounter, setGateSetup, ...topLevelPreSteps, ...entryStep, ...instrumentedBlock.body, clearGate, callClear];
                    } else {
                        // draw(): optionally show top-level highlights once when no setup() exists; otherwise honor setup gate
                        const topOnceGuard = b.ifStatement(
                            b.unaryExpression('!',
                                b.memberExpression(b.identifier('window'), b.identifier('__liveP5TopPreDone'))
                            ),
                            b.blockStatement([
                                ...topLevelPreSteps,
                                b.expressionStatement(
                                    b.assignmentExpression('=',
                                        b.memberExpression(b.identifier('window'), b.identifier('__liveP5TopPreDone')),
                                        b.literal(true)
                                    )
                                )
                            ])
                        );
                        // Ensure that when there is no setup(), the top-level pre-steps are also protected
                        // by the draw-busy guard to avoid overlapping awaits across frames.
                        node.body.body = hasSetupFunction
                            ? [...prelude, drawGateGuard, drawBusyGuard, setDrawBusy, incFrameCounter, ...entryStep, ...instrumentedBlock.body, clearDrawBusy]
                            : [...prelude, drawBusyGuard, setDrawBusy, topOnceGuard, incFrameCounter, ...entryStep, ...instrumentedBlock.body, clearDrawBusy];
                    }
                    changed = true;
                    return false;
                }
                // Instrument user-defined functions (non-setup/draw) to enable stepping into them
                try {
                    if (node.body && Array.isArray(node.body.body)) {
                        node.async = true;
                        node.body = instrumentBlockGlobal(node.body);
                        changed = true;
                        return false;
                    }
                } catch { }
                this.traverse(path);
            }
            ,
            visitFunctionExpression(path) {
                const node: any = path.value;
                try {
                    if (node.body) {
                        // Ensure block body for consistent instrumentation
                        if (node.body.type !== 'BlockStatement') {
                            node.body = b.blockStatement([b.returnStatement(node.body)]);
                        }
                        node.async = true;
                        node.body = instrumentBlockGlobal(node.body);
                        changed = true;
                        return false;
                    }
                } catch { }
                this.traverse(path);
            }
            ,
            visitArrowFunctionExpression(path) {
                const node: any = path.value;
                try {
                    if (node.body) {
                        if (node.body.type !== 'BlockStatement') {
                            node.body = b.blockStatement([b.returnStatement(node.body)]);
                        }
                        node.async = true;
                        node.body = instrumentBlockGlobal(node.body);
                        changed = true;
                        return false;
                    }
                } catch { }
                this.traverse(path);
            }
        });

        if (!changed) return code;
        return recast.print(ast).code;
    } catch (e) {
        return code;
    }
}
