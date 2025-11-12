import * as vscode from 'vscode';
import * as recast from 'recast';

export type TopInputItem = { varName: string; label?: string; defaultValue?: any };

// Internal cache for top-level inputs per sketch key
const _topInputCache = new Map<string, { items: TopInputItem[]; values: any[] }>();

export function hasCachedInputsForKey(key: string, items: TopInputItem[]): boolean {
    if (!key) return false;
    const cached = _topInputCache.get(key);
    if (!cached) return false;
    if (cached.items.length !== items.length) return false;
    for (let i = 0; i < items.length; i++) {
        const a = cached.items[i];
        const b = items[i];
        if (a.varName !== b.varName) return false;
        if ((a.label || '') !== (b.label || '')) return false;
    }
    return true;
}

// Expose read/write helpers for the input cache so the extension can prefill overlays and store values.
export function getCachedInputsForKey(key: string): { items: TopInputItem[]; values: any[] } | undefined {
    if (!key) return undefined;
    return _topInputCache.get(key);
}

export function setCachedInputsForKey(key: string, items: TopInputItem[], values: any[]): void {
    if (!key) return;
    _topInputCache.set(key, { items, values });
}

export function detectTopLevelInputs(code: string): TopInputItem[] {
    try {
        const acorn = require('acorn');
        const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
        const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
        const items: TopInputItem[] = [];
        for (let i = 0; i < body.length; i++) {
            const node = body[i];
            if (!node) break;
            if (node.type === 'EmptyStatement') { continue; }
            if (node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'Literal' && (node as any).directive) { continue; }
            if (node.type !== 'VariableDeclaration') { break; }
            const decls = (node as any).declarations || [];
            for (const d of decls) {
                if (d && d.type === 'VariableDeclarator' && d.init && d.init.type === 'CallExpression') {
                    const callee = d.init.callee;
                    if (callee && callee.type === 'Identifier' && callee.name === 'inputPrompt') {
                        const varName = d.id && d.id.name ? d.id.name : `value${items.length + 1}`;
                        let label: string | undefined;
                        let defaultValue: any = undefined;
                        const args = d.init.arguments || [];
                        if (args[0] && args[0].type === 'Literal' && typeof args[0].value === 'string') label = String(args[0].value);
                        if (args[1] && args[1].type === 'Literal') defaultValue = args[1].value;
                        items.push({ varName, label, defaultValue });
                    }
                }
            }
        }
        return items;
    } catch {
        return [];
    }
}

// Detect any usage of inputPrompt() that is NOT at the very top of the file
export function hasNonTopInputUsage(code: string): boolean {
    try {
        const acorn = require('acorn');
        const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
        const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
        let idx = 0;
        while (idx < body.length) {
            const node = body[idx];
            if (!node) break;
            if (node.type === 'EmptyStatement') { idx++; continue; }
            if (node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'Literal' && (node as any).directive) { idx++; continue; }
            if (node.type === 'VariableDeclaration') { idx++; continue; }
            break;
        }
        const allowedNodes = new Set<any>();
        for (let i = 0; i < idx; i++) {
            const node = body[i];
            if (node && node.type === 'VariableDeclaration') {
                const decls = (node as any).declarations || [];
                for (const d of decls) {
                    if (d && d.init && d.init.type === 'CallExpression' && d.init.callee && d.init.callee.type === 'Identifier' && d.init.callee.name === 'inputPrompt') {
                        allowedNodes.add(d.init);
                    }
                }
            }
        }
        let illegalFound = false;
        recast.types.visit(ast, {
            visitCallExpression(path) {
                try {
                    const call = path.value;
                    if (call && (call as any).callee && (call as any).callee.type === 'Identifier' && (call as any).callee.name === 'inputPrompt') {
                        if (!allowedNodes.has(call)) { illegalFound = true; return false; }
                    }
                } catch { }
                this.traverse(path);
            }
        });
        return illegalFound;
    } catch {
        return false;
    }
}

export async function preprocessTopLevelInputs(
    code: string,
    opts?: { key?: string; interactive?: boolean }
): Promise<string> {
    try {
        const acorn = require('acorn');
        const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
        const b = recast.types.builders;
        const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
        const placeholders: Array<{ decl: any; varName: string; label?: string; defaultValue?: any; }> = [];

        for (let i = 0; i < body.length; i++) {
            const node = body[i];
            if (!node) break;
            if (node.type === 'EmptyStatement') { continue; }
            if (node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'Literal' && (node as any).directive) { continue; }
            if (node.type !== 'VariableDeclaration') break;
            const decls = (node as any).declarations || [];
            for (const d of decls) {
                if (d && d.type === 'VariableDeclarator' && d.init && d.init.type === 'CallExpression') {
                    const callee = d.init.callee;
                    if (callee && callee.type === 'Identifier' && callee.name === 'inputPrompt') {
                        let label: string | undefined;
                        let defaultValue: any = undefined;
                        const args = d.init.arguments || [];
                        if (args[0] && args[0].type === 'Literal' && typeof args[0].value === 'string') { label = String(args[0].value); }
                        if (args[1] && args[1].type === 'Literal') { defaultValue = args[1].value; }
                        const varName = d.id && d.id.name ? d.id.name : `value${placeholders.length + 1}`;
                        placeholders.push({ decl: d, varName, label, defaultValue });
                    }
                }
            }
        }

        if (placeholders.length === 0) return code;

        const key = opts?.key || '';
        const interactive = typeof opts?.interactive === 'boolean' ? opts!.interactive! : true;

        const items: TopInputItem[] = placeholders.map(ph => ({ varName: ph.varName, label: ph.label }));
        let values: any[] | null = null;

        if (!interactive && key && _topInputCache.has(key)) {
            const cached = _topInputCache.get(key)!;
            const sameShape = cached.items.length === items.length && cached.items.every((it, i) => it.varName === items[i].varName && (it.label || '') === (items[i].label || ''));
            if (sameShape) { values = cached.values.slice(); }
        }

        if (!values) {
            values = [];
            for (const ph of placeholders) {
                const prompt = ph.label || `Enter value for ${ph.varName}`;
                const defaultStr = ph.defaultValue !== undefined ? String(ph.defaultValue) : '';
                if (!interactive) {
                    return code;
                }
                const input = await vscode.window.showInputBox({ prompt, value: defaultStr, ignoreFocusOut: true });
                if (typeof input === 'undefined') { return code; }
                let typed: any = input;
                const low = input.trim().toLowerCase();
                if (low === 'true' || low === 'false') { typed = (low === 'true'); }
                else {
                    const num = Number(input);
                    if (!Number.isNaN(num) && input.trim() !== '') typed = num;
                }
                values.push(typed);
            }
            if (key) _topInputCache.set(key, { items, values: values.slice() });
        }

        for (let i = 0; i < placeholders.length; i++) {
            const ph = placeholders[i];
            ph.decl.init = b.literal(values[i]);
        }
        return recast.print(ast).code;
    } catch {
        return code;
    }
}
