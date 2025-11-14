import * as recast from 'recast';

export function rewriteFrameCountRefs(code: string): string {
    try {
        const acorn = require('acorn');
        const ast = recast.parse(code, {
            parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) }
        });
        const b = recast.types.builders;

        function isPropertyKey(path: any) {
            const parent = path.parent && path.parent.value;
            return parent && parent.type === 'Property' && parent.key === path.value && parent.computed === false;
        }
        function isMemberUncomputedProperty(path: any) {
            const parent = path.parent && path.parent.value;
            return parent && parent.type === 'MemberExpression' && parent.property === path.value && parent.computed === false;
        }
        function isFunctionParam(path: any) {
            const parent = path.parent && path.parent.value;
            if (!parent) return false;
            if (parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression' || parent.type === 'ArrowFunctionExpression') {
                return Array.isArray(parent.params) && parent.params.includes(path.value);
            }
            return false;
        }
        function isVarDeclaratorId(path: any) {
            const parent = path.parent && path.parent.value;
            return parent && parent.type === 'VariableDeclarator' && parent.id === path.value;
        }

        recast.types.visit(ast, {
            visitIdentifier(path) {
                const id: any = path.value;
                if (id && id.name === 'frameCount') {
                    if (isPropertyKey(path) || isMemberUncomputedProperty(path) || isFunctionParam(path) || isVarDeclaratorId(path)) {
                        return false;
                    }
                    const replacement = b.memberExpression(b.identifier('window'), b.identifier('__liveP5FrameCounter'));
                    path.replace(replacement);
                    return false;
                }
                this.traverse(path);
            },
            visitMemberExpression(path) {
                const me: any = path.value;
                const isWindowFrameCount = !!(me && me.object && me.object.type === 'Identifier' && me.object.name === 'window' && me.property && !me.computed && me.property.type === 'Identifier' && me.property.name === 'frameCount');
                if (isWindowFrameCount) {
                    path.get('property').replace(recast.types.builders.identifier('__liveP5FrameCounter'));
                    return false;
                }
                this.traverse(path);
            }
        });
        return recast.print(ast).code;
    } catch {
        return code;
    }
}

export function wrapInSetupIfNeeded(code: string): string {
    const hasSetup = /\bfunction\s+setup\s*\(/.test(code);
    if (hasSetup) return code;
    try {
        const acorn = require('acorn');
        const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
        const b = recast.types.builders;
        const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
        const moved: any[] = [];
        const retained: any[] = [];

        const P5_CALL_NAMES = new Set([
            'createCanvas', 'resizeCanvas', 'noCanvas', 'createGraphics', 'createCapture', 'createVideo', 'createAudio', 'background',
            'colorMode', 'image', 'loadImage', 'loadJSON', 'loadTable', 'loadXML', 'loadFont', 'loadSound', 'createDiv', 'createSpan', 'createP', 'createImg',
        ]);

        function containsP5Call(node: any): boolean {
            let found = false;
            recast.types.visit(node, {
                visitCallExpression(p) {
                    try {
                        const cal = p.value.callee;
                        if (cal && cal.type === 'Identifier' && P5_CALL_NAMES.has(cal.name)) { found = true; return false; }
                    } catch { }
                    this.traverse(p);
                }
            });
            return found;
        }

        for (const stmt of body) {
            if (!stmt) continue;
            const t = stmt.type;
            if (t === 'FunctionDeclaration' || t === 'ClassDeclaration' || t === 'ImportDeclaration' || t === 'ExportNamedDeclaration' || t === 'ExportDefaultDeclaration') {
                retained.push(stmt);
                continue;
            }
            if (t === 'VariableDeclaration') {
                const orig: any = stmt;
                const newDecls: any[] = [];
                let kind: 'var' | 'let' | 'const' = orig.kind || 'var';
                let changedKindToVar = false;
                for (const d of (orig.declarations || [])) {
                    if (!d || d.type !== 'VariableDeclarator' || !d.id) { newDecls.push(d); continue; }
                    if (d.init && containsP5Call(d.init)) {
                        newDecls.push(Object.assign({}, d, { init: null }));
                        moved.push(b.expressionStatement(b.assignmentExpression('=', d.id, d.init)));
                        if (kind !== 'var') { changedKindToVar = true; }
                    } else {
                        newDecls.push(d);
                    }
                }
                const retainedDecl = b.variableDeclaration(changedKindToVar ? 'var' : kind, newDecls);
                retained.push(retainedDecl);
                continue;
            }
            moved.push(stmt);
        }

        const setupBody = moved.length > 0 ? moved : [];
        const setupFn = b.functionDeclaration(b.identifier('setup'), [], b.blockStatement(setupBody));
        ast.program.body = [setupFn, ...retained];
        return recast.print(ast).code;
    } catch {
        const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
        if (!hasDraw) {
            return `function setup() {\n${code}\n}`;
        }
        return `function setup() { }\n${code}`;
    }
}

export function formatSyntaxErrorMsg(msg: string): string {
    const regex = /(\[‼️SYNTAX ERROR in [^\]\s]+)\]([^\n]*?)\s*\((\d+)(?::\d+)?\)\s*$/;
    const match = msg.match(regex);
    if (match) {
        const before = match[1];
        const rest = match[2] || '';
        const line = match[3];
        return msg.replace(regex, `${before} on line ${line}]${rest}`);
    }
    return msg;
}

export function stripLeadingTimestamp(msg: string): string {
    return typeof msg === 'string' ? msg.replace(/^\s*\d{2}:\d{2}:\d{2}\s+/, '') : msg;
}

export function hasOnlySetup(code: string): boolean {
    try {
        const acorn = require('acorn');
        const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
        if (!ast.program || !Array.isArray(ast.program.body)) return false;
        let hasSetup = false;
        for (const node of ast.program.body as any[]) {
            if ((node as any).type === 'FunctionDeclaration') {
                if ((node as any).id && (node as any).id.name === 'setup') hasSetup = true;
                else return false;
            }
        }
        return hasSetup;
    } catch {
        return false;
    }
}

export function getHiddenGlobalsByDirective(code: string): Set<string> {
    const hidden = new Set<string>();
    try {
        const acorn = require('acorn');
        const ast = acorn.parse(code, { ecmaVersion: 2020, sourceType: 'script', locations: true });
        const lines = code.split(/\r?\n/);
        const isHideComment = (line: string) => /^(\s*\/\/\s*@hide\b|\s*\/\/@hide\b)/i.test(line);

        function collectNamesFromPattern(pattern: any, acc: Set<string>) {
            if (!pattern) return;
            if (pattern.type === 'Identifier') {
                acc.add(pattern.name);
            } else if (pattern.type === 'ObjectPattern') {
                for (const prop of pattern.properties || []) {
                    if (prop.type === 'Property') collectNamesFromPattern(prop.value, acc);
                    else if (prop.type === 'RestElement') collectNamesFromPattern(prop.argument, acc);
                }
            } else if (pattern.type === 'ArrayPattern') {
                for (const el of pattern.elements || []) {
                    if (!el) continue;
                    if (el.type === 'RestElement') collectNamesFromPattern(el.argument, acc);
                    else collectNamesFromPattern(el, acc);
                }
            } else if (pattern.type === 'RestElement') {
                collectNamesFromPattern(pattern.argument, acc);
            }
        }

        for (const node of (ast as any).body || []) {
            if (node && node.type === 'VariableDeclaration' && node.loc && node.loc.start && typeof node.loc.start.line === 'number') {
                const startLine: number = node.loc.start.line;
                const prevIdx = startLine - 2;
                if (prevIdx >= 0) {
                    const prevLine = lines[prevIdx];
                    if (isHideComment(prevLine)) {
                        for (const decl of node.declarations || []) {
                            if (decl.id) collectNamesFromPattern(decl.id, hidden);
                        }
                    }
                }
            }
        }
    } catch {
        // ignore parse errors; no hidden vars
    }
    return hidden;
}
