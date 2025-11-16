import * as recast from 'recast';

export type StepPhase = 'top-level' | 'setup' | 'draw' | 'function';

export interface StepLoc {
    line: number;
    column: number;
    endLine: number;
    endColumn: number;
}

export interface StepTarget {
    id: number;
    phase: StepPhase;
    loc: StepLoc;
    // For function steps, name of the function
    functionName?: string;
}

export interface StepMap {
    steps: StepTarget[];
}

// Build a simple step map from the original source code.
// This does NOT transform or rewrite code; it only inspects it.
export function buildStepMap(code: string): StepMap {
    try {
        const acorn = require('acorn');
        const ast = recast.parse(code, {
            parser: {
                parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script', locations: true })
            }
        });
        const steps: StepTarget[] = [];
        const b: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];

        let id = 1;

        const pushStep = (phase: StepPhase, node: any, functionName?: string) => {
            if (!node || !node.loc) return;
            const loc = node.loc;
            const start = loc.start || { line: 1, column: 0 };
            const end = loc.end || start;
            steps.push({
                id: id++,
                phase,
                loc: {
                    line: start.line,
                    column: start.column + 1,
                    endLine: end.line,
                    endColumn: end.column + 1,
                },
                functionName,
            });
        };

        // First pass: find setup and draw functions, and other top-level functions.
        const setupFns: any[] = [];
        const drawFns: any[] = [];
        const otherFns: any[] = [];

        for (const n of b) {
            if (!n || n.type !== 'FunctionDeclaration') continue;
            if (!n.id || typeof n.id.name !== 'string') continue;
            if (n.id.name === 'setup') setupFns.push(n);
            else if (n.id.name === 'draw') drawFns.push(n);
            else otherFns.push(n);
        }

        const hasSetup = setupFns.length > 0;

        // Recursively collect steps for simple statements inside blocks/control-flow.
        const collectStatements = (nodes: any[], phase: StepPhase, functionName?: string) => {
            for (const node of nodes) {
                if (!node || node.type === 'EmptyStatement') continue;

                switch (node.type) {
                    case 'IfStatement': {
                        // Do not step on the header; step into branch bodies only.
                        if (node.consequent && Array.isArray(node.consequent.body)) {
                            collectStatements(node.consequent.body, phase, functionName);
                        } else if (node.consequent) {
                            collectStatements([node.consequent], phase, functionName);
                        }
                        if (node.alternate) {
                            if (Array.isArray(node.alternate.body)) collectStatements(node.alternate.body, phase, functionName);
                            else collectStatements([node.alternate], phase, functionName);
                        }
                        break;
                    }
                    case 'BlockStatement': {
                        collectStatements(node.body || [], phase, functionName);
                        break;
                    }
                    case 'ForStatement':
                    case 'ForInStatement':
                    case 'ForOfStatement':
                    case 'WhileStatement':
                    case 'DoWhileStatement': {
                        pushStep(phase, node, functionName);
                        if (node.body) {
                            const bodyNodes = node.body.body && Array.isArray(node.body.body) ? node.body.body : [node.body];
                            collectStatements(bodyNodes, phase, functionName);
                        }
                        break;
                    }
                    case 'SwitchStatement': {
                        pushStep(phase, node, functionName);
                        for (const cs of node.cases || []) {
                            collectStatements(cs.consequent || [], phase, functionName);
                        }
                        break;
                    }
                    default: {
                        // Simple statement.
                        pushStep(phase, node, functionName);
                        break;
                    }
                }
            }
        };

        // Phase 1: top-level non-function statements in order
        collectStatements(b.filter((n: any) => n && n.type !== 'FunctionDeclaration'), 'top-level');

        // Phase 2: setup body statements (if any)
        for (const fn of setupFns) {
            const body = fn.body && Array.isArray(fn.body.body) ? fn.body.body : [];
            collectStatements(body, 'setup');
        }

        // Phase 3: draw body statements (if any)
        for (const fn of drawFns) {
            const body = fn.body && Array.isArray(fn.body.body) ? fn.body.body : [];
            collectStatements(body, 'draw');
        }

        // Phase 4: custom function bodies (for later step-into support)
        for (const fn of otherFns) {
            const name = fn.id && fn.id.name ? fn.id.name : undefined;
            const body = fn.body && Array.isArray(fn.body.body) ? fn.body.body : [];
            collectStatements(body, 'function', name);
        }

        return { steps };
    } catch {
        return { steps: [] };
    }
}
