import * as recast from 'recast';
import { RESERVED_GLOBALS, P5_NUMERIC_IDENTIFIERS, P5_EVENT_HANDLERS } from '../constants';

// Extract top-level global variables and detect conflicts with reserved names
export function extractGlobalVariablesWithConflicts(code: string): { globals: { name: string, value: any, type: string }[], conflicts: string[] } {
    const acorn = require('acorn');
    const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
    const globals: { name: string, value: any, type: string }[] = [];
    const conflicts: string[] = [];
    function extractFromDecls(decls: any[]) {
        for (const decl of decls) {
            if (decl.id && decl.id.name) {
                let value = undefined;
                let type = 'other';
                if (decl.init && decl.init.type === 'Literal') {
                    value = decl.init.value;
                    type = typeof value;
                } else if (decl.init && decl.init.type === 'UnaryExpression' && decl.init.argument.type === 'Literal') {
                    value = decl.init.operator === '-' ? -decl.init.argument.value : decl.init.argument.value;
                    type = typeof value;
                } else if (decl.init && decl.init.type === 'Identifier') {
                    value = decl.init.name;
                    type = P5_NUMERIC_IDENTIFIERS.has(decl.init.name) ? 'number' : 'other';
                } else if (decl.init && decl.init.type === 'CallExpression') {
                    value = 0; type = 'number';
                } else if (decl.init) {
                    try {
                        const safeGlobals = { Math, Number, String, Boolean, Array, Object };
                        value = Function(...Object.keys(safeGlobals), `return (${recast.print(decl.init).code});`)
                            (...Object.values(safeGlobals));
                        type = typeof value;
                        if (!['number', 'string', 'boolean'].includes(type)) { value = undefined; type = 'other'; }
                    } catch { value = undefined; type = 'other'; }
                }
                if (RESERVED_GLOBALS.has(decl.id.name)) {
                    conflicts.push(decl.id.name);
                } else {
                    globals.push({ name: decl.id.name, value, type });
                }
            }
        }
    }
    recast.types.visit(ast, {
        visitVariableDeclaration(path) {
            if (path.parentPath && path.parentPath.value.type === 'Program') {
                extractFromDecls(path.value.declarations);
            }
            this.traverse(path);
        }
    });
    if (ast.program && Array.isArray(ast.program.body)) {
        for (const node of ast.program.body) {
            if (node.type === 'VariableDeclaration') { extractFromDecls(node.declarations); }
        }
    }
    return { globals, conflicts };
}

// Extract top-level global variables, excluding reserved names
export function extractGlobalVariables(code: string): { name: string, value: any, type: string }[] {
    const acorn = require('acorn');
    const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
    const globals: { name: string, value: any, type: string }[] = [];
    function extractFromDecls(decls: any[]) {
        for (const decl of decls) {
            if (decl.id && decl.id.name) {
                let value = undefined;
                let type = 'other';
                if (decl.init && decl.init.type === 'Literal') {
                    value = decl.init.value; type = typeof value;
                } else if (decl.init && decl.init.type === 'UnaryExpression' && decl.init.argument.type === 'Literal') {
                    value = decl.init.operator === '-' ? -decl.init.argument.value : decl.init.argument.value; type = typeof value;
                } else if (decl.init && decl.init.type === 'Identifier') {
                    value = decl.init.name; type = P5_NUMERIC_IDENTIFIERS.has(decl.init.name) ? 'number' : 'other';
                } else if (decl.init && decl.init.type === 'CallExpression') {
                    value = undefined; type = 'number';
                } else if (decl.init) {
                    try {
                        const safeGlobals = { Math, Number, String, Boolean, Array, Object };
                        value = Function(...Object.keys(safeGlobals), `return (${recast.print(decl.init).code});`)
                            (...Object.values(safeGlobals));
                        type = typeof value;
                        if (!['number', 'string', 'boolean'].includes(type)) { value = undefined; type = 'other'; }
                    } catch { value = undefined; type = 'other'; }
                }
                globals.push({ name: decl.id.name, value, type });
            }
        }
    }
    recast.types.visit(ast, {
        visitVariableDeclaration(path) {
            if (path.parentPath && path.parentPath.value.type === 'Program') {
                extractFromDecls(path.value.declarations);
            }
            this.traverse(path);
        }
    });
    if (ast.program && Array.isArray(ast.program.body)) {
        for (const node of ast.program.body) {
            if (node.type === 'VariableDeclaration') { extractFromDecls(node.declarations); }
        }
    }
    return globals.filter(g => !RESERVED_GLOBALS.has(g.name));
}

// Rewrite user code so global variables are attached to window and event handlers are guarded
export function rewriteUserCodeWithWindowGlobals(code: string, globals: { name: string, value?: any }[]): string {
    if (!globals.length) return code;
    const acorn = require('acorn');
    const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
    const globalNames = new Set(globals.map(g => g.name));
    const programBody = (ast as any).program.body;
    const newBody: any[] = [];
    let setupFound = false;
    const globalAssignments: any[] = [];

    // Collect assignments for globals with initializers
    for (const stmt of programBody) {
        if (stmt.type === 'VariableDeclaration') {
            for (const decl of stmt.declarations) {
                if (decl.id && decl.id.name && globalNames.has(decl.id.name) && decl.init) {
                    globalAssignments.push(recast.types.builders.expressionStatement(recast.types.builders.assignmentExpression('=', recast.types.builders.identifier(decl.id.name), decl.init)));
                }
            }
        }
    }

    // Insert window.<global> = undefined for all globals at the very top
    for (const g of globals) {
        newBody.push(recast.types.builders.expressionStatement(recast.types.builders.assignmentExpression('=', recast.types.builders.memberExpression(recast.types.builders.identifier('window'), recast.types.builders.identifier(g.name), false), recast.types.builders.identifier('undefined'))));
    }

    for (let i = 0; i < programBody.length; i++) {
        let stmt = programBody[i];
        if (stmt.type === 'VariableDeclaration') {
            stmt.declarations = stmt.declarations.map((decl: any) => {
                if (decl.id && decl.id.name && globalNames.has(decl.id.name)) { return Object.assign({}, decl, { init: null }); }
                return decl;
            });
            if ((stmt.kind === 'let' || stmt.kind === 'const') && stmt.declarations.some((decl: any) => decl.id && decl.id.name && globalNames.has(decl.id.name))) {
                stmt = Object.assign({}, stmt, { kind: 'var' });
            }
            newBody.push(stmt);
            for (const decl of stmt.declarations) {
                if (decl.id && decl.id.name && globalNames.has(decl.id.name)) {
                    newBody.push(recast.types.builders.expressionStatement(recast.types.builders.assignmentExpression('=', recast.types.builders.memberExpression(recast.types.builders.identifier('window'), recast.types.builders.identifier(decl.id.name), false), recast.types.builders.identifier(decl.id.name))));
                }
            }
            continue;
        }

        if (stmt.type === 'FunctionDeclaration' && stmt.id && stmt.id.name === 'setup' && stmt.body && stmt.body.body) {
            setupFound = true;
            const originalStmt: any = stmt;
            const newSetupBody = [...globalAssignments, ...stmt.body.body];
            newSetupBody.push(recast.types.builders.expressionStatement(recast.types.builders.assignmentExpression('=', recast.types.builders.memberExpression(recast.types.builders.identifier('window'), recast.types.builders.identifier('_p5SetupDone'), false), recast.types.builders.literal(true))));
            let newFn = recast.types.builders.functionDeclaration(stmt.id, stmt.params, recast.types.builders.blockStatement(newSetupBody));
            (newFn as any).async = !!(originalStmt as any).async;
            stmt = newFn as any;
            newBody.push(stmt);
            continue;
        }

        if (stmt.type === 'FunctionDeclaration' && stmt.id && P5_EVENT_HANDLERS.includes(stmt.id.name)) {
            const originalStmt: any = stmt;
            const origBody = stmt.body.body;
            const guardedBody = [recast.types.builders.ifStatement(recast.types.builders.unaryExpression('!', recast.types.builders.memberExpression(recast.types.builders.identifier('window'), recast.types.builders.identifier('_p5SetupDone'), false)), recast.types.builders.blockStatement([recast.types.builders.returnStatement(null)])), ...origBody];
            let newFn = recast.types.builders.functionDeclaration(stmt.id, stmt.params, recast.types.builders.blockStatement(guardedBody));
            (newFn as any).async = !!(originalStmt as any).async;
            stmt = newFn as any;
        }
        newBody.push(stmt);
    }

    if (!setupFound) {
        const setupBody = [...globalAssignments, recast.types.builders.expressionStatement(recast.types.builders.assignmentExpression('=', recast.types.builders.memberExpression(recast.types.builders.identifier('window'), recast.types.builders.identifier('_p5SetupDone'), false), recast.types.builders.literal(true)))];
        newBody.push(recast.types.builders.functionDeclaration(recast.types.builders.identifier('setup'), [], recast.types.builders.blockStatement(setupBody)));
    }

    (ast as any).program.body = newBody;

    recast.types.visit(ast, {
        visitIdentifier(path) {
            const name = (path.value as any).name;
            const isGlobalName = (globalNames as any).has(name);
            const isMemberOfWindow = !!(path.parentPath && path.parentPath.value && path.parentPath.value.type === 'MemberExpression' && (path.parentPath.value as any).property === path.value && (path.parentPath.value as any).object.type === 'Identifier' && (path.parentPath.value as any).object.name === 'window');
            const isDeclarationId = !!(path.parentPath && path.parentPath.value && (((path.parentPath.value as any).type === 'VariableDeclarator' && (path.parentPath.value as any).id === path.value) || ((path.parentPath.value as any).type === 'FunctionDeclaration' && (path.parentPath.value as any).id === path.value) || ((path.parentPath.value as any).type === 'FunctionExpression' && (path.parentPath.value as any).id === path.value) || ((path.parentPath.value as any).type === 'ClassDeclaration' && (path.parentPath.value as any).id === path.value)));
            const isThisMemberWindowProperty = !!(path.parentPath && path.parentPath.value && path.parentPath.value.type === 'MemberExpression' && (path.parentPath.value as any).property === path.value && (((path.parentPath.value as any).object.type === 'ThisExpression') || ((path.parentPath.value as any).object.type === 'MemberExpression' && (path.parentPath.value as any).object.object && (path.parentPath.value as any).object.object.type === 'ThisExpression' && (path.parentPath.value as any).object.property && (path.parentPath.value as any).object.property.name === 'window')));
            if (isGlobalName && !isMemberOfWindow && !isDeclarationId && !isThisMemberWindowProperty) {
                return recast.types.builders.memberExpression(recast.types.builders.identifier('window'), recast.types.builders.identifier(name), false);
            }
            this.traverse(path);
        }
    });
    const rewritten = recast.print(ast).code;
    try { console.log('REWRITTEN CODE:', rewritten); } catch { }
    return rewritten;
}
