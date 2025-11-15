import * as vscode from 'vscode';
import * as path from 'path';
import { config as cfg, StrictLevel } from '../config/index';
import { postMessage as sendToWebview } from '../webview/router';

// StrictLevel now provided by config facade

export type LintApi = {
    // diagnostics lifecycle
    clearDiagnosticsForDocument: (uri: vscode.Uri) => void;
    // settings
    getStrictLevel: (kind: 'Semicolon' | 'Undeclared' | 'NoVar' | 'LooseEquality') => StrictLevel;
    // run lints
    lintSemicolons: (document: vscode.TextDocument) => void;
    lintUndeclaredVariables: (document: vscode.TextDocument) => void;
    lintNoVar: (document: vscode.TextDocument) => void;
    lintLooseEquality: (document: vscode.TextDocument) => void;
    lintAll: (document: vscode.TextDocument) => void;
    // query helpers
    hasSemicolonWarnings: (document: vscode.TextDocument) => { has: boolean; lines: number[] };
    hasUndeclaredWarnings: (document: vscode.TextDocument) => { has: boolean; items: Array<{ name: string; line: number }> };
    hasVarWarnings: (document: vscode.TextDocument) => { has: boolean; lines: number[] };
    hasEqualityWarnings: (document: vscode.TextDocument) => { has: boolean; eqLines: number[]; neqLines: number[] };
    // logging
    logSemicolonWarningsForDocument: (document: vscode.TextDocument) => void;
    logUndeclaredWarningsForDocument: (document: vscode.TextDocument) => void;
    logVarWarningsForDocument: (document: vscode.TextDocument) => void;
    logEqualityWarningsForDocument: (document: vscode.TextDocument) => void;
    logBlockingWarningsForDocument: (document: vscode.TextDocument) => void;
    // helpers
    shouldBlockDocument: (document: vscode.TextDocument) => boolean;
    logAllWarningsForDocument: (document: vscode.TextDocument) => void;
};

export function registerLinting(
    context: vscode.ExtensionContext,
    deps: {
        getOrCreateOutputChannel: (docUri: string, fileName: string) => vscode.OutputChannel;
        getPanelForDocUri: (docUri: string) => vscode.WebviewPanel | undefined;
        getTime: () => string;
    }
): LintApi {
    const semicolonDiagnostics = vscode.languages.createDiagnosticCollection('semicolon-linter');
    const undeclaredDiagnostics = vscode.languages.createDiagnosticCollection('undeclared-variable');
    const noVarDiagnostics = vscode.languages.createDiagnosticCollection('no-var');
    const equalityDiagnostics = vscode.languages.createDiagnosticCollection('loose-equality');
    context.subscriptions.push(semicolonDiagnostics, undeclaredDiagnostics, noVarDiagnostics, equalityDiagnostics);

    function getStrictLevel(kind: 'Semicolon' | 'Undeclared' | 'NoVar' | 'LooseEquality'): StrictLevel {
        return cfg.getStrictLevel(kind);
    }

    function lintSemicolons(document: vscode.TextDocument) {
        if (document.uri.scheme !== 'file') return;
        const lang = document.languageId;
        const isJsLike = lang === 'javascript' || lang === 'typescript' || lang === 'javascriptreact' || lang === 'typescriptreact';
        if (!isJsLike) { semicolonDiagnostics.delete(document.uri); return; }
        const level = getStrictLevel('Semicolon');
        if (level === 'ignore') { semicolonDiagnostics.delete(document.uri); return; }
        const text = document.getText();
        const diagnostics: vscode.Diagnostic[] = [];
        // Prefer TS AST only for JavaScript/JSX; for TypeScript we defer to the
        // simpler line-based heuristic to avoid noisy false positives.
        let usedAst = false;
        if (lang === 'javascript' || lang === 'javascriptreact') {
            try {
                const ts = require('typescript');
                const scriptKind = ((): any => {
                    if (lang === 'javascriptreact') return ts.ScriptKind.JSX;
                    return ts.ScriptKind.JS;
                })();
                const sf = ts.createSourceFile(document.fileName, text, ts.ScriptTarget.Latest, true, scriptKind);
                usedAst = true;
                const wants = new Set<number>([
                    ts.SyntaxKind.ExpressionStatement,
                    ts.SyntaxKind.VariableStatement,
                    ts.SyntaxKind.ReturnStatement,
                    ts.SyntaxKind.ThrowStatement,
                    ts.SyntaxKind.BreakStatement,
                    ts.SyntaxKind.ContinueStatement
                ]);
                // Parents to skip: inside object/array literals, class members, etc.
                const skipParents = new Set<number>([
                    ts.SyntaxKind.ObjectLiteralExpression,
                    ts.SyntaxKind.ArrayLiteralExpression,
                    ts.SyntaxKind.PropertyAssignment,
                    ts.SyntaxKind.ShorthandPropertyAssignment,
                    ts.SyntaxKind.MethodDeclaration,
                    ts.SyntaxKind.GetAccessor,
                    ts.SyntaxKind.SetAccessor,
                    ts.SyntaxKind.PropertyDeclaration,
                    ts.SyntaxKind.EnumDeclaration,
                    ts.SyntaxKind.EnumMember
                ]);
                function addDiagAt(endIndex: number) {
                    if (endIndex > 0 && text[endIndex - 1] === ';') return;
                    const endPos = document.positionAt(endIndex);
                    const range = new vscode.Range(endPos, endPos);
                    const diag = new vscode.Diagnostic(range, 'Missing semicolon.', vscode.DiagnosticSeverity.Warning);
                    diag.source = 'Semicolon Linter';
                    diagnostics.push(diag);
                }
                function walk(node: any) {
                    try {
                        if (!node) return;
                        const kind = node.kind;
                        if (wants.has(kind)) {
                            const parent = (node as any).parent;
                            const grand = parent && (parent as any).parent;
                            if (
                                (parent && skipParents.has(parent.kind)) ||
                                (grand && skipParents.has(grand.kind))
                            ) {
                                // e.g. object literal property or nested inside one; no semicolon required
                                // Skip to avoid false positives like last property in an object literal
                            } else {
                                const end = node.getEnd();
                                addDiagAt(end);
                            }
                        }
                    } catch { }
                    try { node.forEachChild((c: any) => walk(c)); } catch { }
                }
                walk(sf);
            } catch { usedAst = false; }
        }

        if (!usedAst && (lang === 'javascript' || lang === 'javascriptreact')) {
            try {
                const acorn = require('acorn');
                const ast: any = acorn.parse(text, { ecmaVersion: 2020, sourceType: 'script', ranges: true });
                usedAst = true;
                const wantsSemicolon = new Set(['ExpressionStatement', 'VariableDeclaration', 'ReturnStatement', 'ThrowStatement', 'BreakStatement', 'ContinueStatement']);
                function addDiagAt(endIndex: number) {
                    if (endIndex > 0 && text[endIndex - 1] === ';') return;
                    const endPos = document.positionAt(endIndex);
                    const range = new vscode.Range(endPos, endPos);
                    const diag = new vscode.Diagnostic(range, 'Missing semicolon.', vscode.DiagnosticSeverity.Warning);
                    diag.source = 'Semicolon Linter';
                    diagnostics.push(diag);
                }
                function visit(node: any, parent: any = null) {
                    if (!node || typeof node.type !== 'string') return;
                    if (wantsSemicolon.has(node.type) && typeof node.end === 'number') {
                        if (node.type === 'VariableDeclaration' && parent && (
                            (parent.type === 'ForStatement' && parent.init === node) ||
                            (parent.type === 'ForInStatement' && parent.left === node) ||
                            (parent.type === 'ForOfStatement' && parent.left === node)
                        )) {
                            // skip
                        } else {
                            addDiagAt(node.end);
                        }
                    }
                    for (const key of Object.keys(node)) {
                        const child = (node as any)[key];
                        if (!child) continue;
                        if (Array.isArray(child)) child.forEach(c => visit(c, node));
                        else if (typeof child === 'object' && typeof (child as any).type === 'string') visit(child, node);
                    }
                }
                visit(ast, null);
            } catch { usedAst = false; }
        }

        if (!usedAst) {
            const lines = text.split(/\r?\n/);
            let paren = 0, bracket = 0, brace = 0, inTemplate = false;
            const isEscaped = (s: string, i: number): boolean => i > 0 && s[i - 1] === '\\' && !isEscaped(s, i - 1);
            const hasAssignmentInStatement = (linesArr: string[], currentIndex: number): boolean => {
                // Look backwards from the current line, within the same logical statement,
                // for an '=' that isn't part of an '=>' arrow function.
                for (let k = currentIndex; k >= 0; k--) {
                    const rawLine = linesArr[k];
                    let line = rawLine;
                    const slIdx = line.indexOf('//');
                    if (slIdx >= 0) line = line.slice(0, slIdx);
                    const trimmedLine = line.trim();
                    if (!trimmedLine) break; // stop at blank line: new statement block
                    if (/[;}]\s*$/.test(trimmedLine) && k !== currentIndex) {
                        // Previous statement terminated; don't cross this boundary
                        break;
                    }
                    if (/=([^=>]|$)/.test(trimmedLine)) return true;
                }
                return false;
            };

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                const slIdx = line.indexOf('//');
                if (slIdx >= 0) line = line.slice(0, slIdx);

                // Track basic nesting and template literals to detect obvious continuations
                for (let j = 0; j < line.length; j++) {
                    const ch = line[j];
                    if (ch === '`' && !isEscaped(line, j)) inTemplate = !inTemplate;
                    if (inTemplate) continue;
                    if (ch === '(') paren++; else if (ch === ')') paren = Math.max(0, paren - 1);
                    else if (ch === '[') bracket++; else if (ch === ']') bracket = Math.max(0, bracket - 1);
                    else if (ch === '{') brace++; else if (ch === '}') brace = Math.max(0, brace - 1);
                }

                const raw = line;
                const trimmed = line.trimEnd();
                if (trimmed.length === 0) continue;

                const lower = trimmed.toLowerCase();
                const endsWith = (s: string) => trimmed.endsWith(s);

                // Quick skip for lines that clearly aren't standalone statements
                const skipEndChars = [';', '{', ',', ':', '(', ')', '[', ']', '`'];
                const skipEndings = ['=>', '++', '--', '.', '?', '?.', '??', '||', '&&', '+', '-', '*', '/', '%', '=', '+=', '-=', '*=', '/=', '%=', '?:', ','];
                const startsWithKeywords = ['if', 'for', 'while', 'switch', 'else', 'do', 'try', 'catch', 'finally', 'class', 'interface', 'enum'];
                const startsWithTsTypes = ['type '];

                // We intentionally do NOT treat '}' and ']' as automatic continuations,
                // because lines like `foo = { ... }` or `bar = [ ... ]` should still
                // be checked for a trailing semicolon.
                const continued = (paren + bracket) > 0 || skipEndChars.some(c => endsWith(c)) || skipEndings.some(s => endsWith(s));
                if (continued || startsWithKeywords.some(k => lower.startsWith(k + ' ')) || startsWithTsTypes.some(k => lower.startsWith(k))) {
                    continue;
                }

                // Heuristic: skip lines that look like object literal properties, e.g. "foo: bar" or "foo," etc.
                // But do NOT skip if the line also looks like it is part of an assignment,
                // such as `usedConfig = { foo: bar }`.
                const noTrailing = trimmed.replace(/[;,]$/, '');
                const hasAssignmentLike = /[=]([^=>]|$)/.test(noTrailing);
                const propertyLike = /:\s*[^:]+$/.test(noTrailing) && !/^\s*(if|for|while|switch|return|throw|case)\b/.test(lower);
                if (propertyLike && !hasAssignmentLike) {
                    continue;
                }

                // Special case: lines ending with '}' or ']' that are likely
                // to be the end of an assignment or expression should still
                // require a semicolon. Example:
                //   usedConfig = { ... }   // should warn
                // but not for compact control/try forms on a single line
                // such as:
                //   if (cond) { ... }
                //   while (cond) { ... }
                //   for (...) { ... }
                //   try { ... } catch { }
                const endsWithBraceOrBracket = /[\]}]$/.test(trimmed);
                const assignmentInStatement = hasAssignmentInStatement(lines, i);

                // Skip compact single-line control/try statements that already
                // contain their own braces, e.g. `if (...) { ... }` or
                // a trailing `catch { ... }` block.
                const isCompactControl = /^\s*(if|for|while|switch|try|catch|finally)\b[\s\S]*[\]}]\s*$/.test(trimmed)
                    || /^\s*\}\s*catch\b[\s\S]*$/.test(trimmed);

                if (!isCompactControl && !endsWith(';') && (!endsWithBraceOrBracket || assignmentInStatement)) {
                    const eolPos = new vscode.Position(i, raw.length);
                    const range = new vscode.Range(eolPos, eolPos);
                    const diag = new vscode.Diagnostic(range, 'Missing semicolon.', vscode.DiagnosticSeverity.Warning);
                    diag.source = 'Semicolon Linter';
                    diagnostics.push(diag);
                }
            }
        }

        semicolonDiagnostics.set(document.uri, diagnostics);
    }

    function logSemicolonWarningsForDocument(document: vscode.TextDocument) {
        lintSemicolons(document);
        const diags = semicolonDiagnostics.get(document.uri) || [];
        if (diags.length === 0) return;
        const uniqLines = Array.from(new Set(diags.map(d => d.range.start.line + 1))).sort((a, b) => a - b);
        const docUri = document.uri.toString();
        const fileName = path.basename(document.fileName);
        const outputChannel = deps.getOrCreateOutputChannel(docUri, fileName);
        const warningText = `Missing semicolon on line(s): ${uniqLines.join(', ')}`;
        const fullWarning = `[⚠️WARNING in ${fileName}] ${warningText}`;
        if (cfg.getLogWarningsToOutput()) {
            outputChannel.appendLine(`${deps.getTime()} ${fullWarning}`);
        }
        const panel = deps.getPanelForDocUri(docUri);
        const level = getStrictLevel('Semicolon');
        if (panel && level === 'block') sendToWebview(panel, { type: 'showWarning', message: fullWarning });
    }

    function hasSemicolonWarnings(document: vscode.TextDocument) {
        lintSemicolons(document);
        const diags = semicolonDiagnostics.get(document.uri) || [];
        const lines = Array.from(new Set(diags.map(d => d.range.start.line + 1))).sort((a, b) => a - b);
        return { has: diags.length > 0, lines };
    }

    function lintUndeclaredVariables(document: vscode.TextDocument) {
        try {
            if (document.uri.scheme !== 'file') return;
            const lang = document.languageId;
            const isJsLike = lang === 'javascript' || lang === 'typescript' || lang === 'javascriptreact' || lang === 'typescriptreact';
            if (!isJsLike) { undeclaredDiagnostics.delete(document.uri); return; }
            const level = getStrictLevel('Undeclared');
            if (level === 'ignore') { undeclaredDiagnostics.delete(document.uri); return; }
            const text = document.getText();
            const diagnostics: vscode.Diagnostic[] = [];
            const ts = require('typescript');
            const scriptKind = ((): any => {
                if (lang === 'typescript') return ts.ScriptKind.TS;
                if (lang === 'typescriptreact') return ts.ScriptKind.TSX;
                if (lang === 'javascriptreact') return ts.ScriptKind.JSX;
                return ts.ScriptKind.JS;
            })();
            const sf = ts.createSourceFile(document.fileName, text, ts.ScriptTarget.Latest, true, scriptKind);
            const declared = new Set<string>();
            const addName = (id: any) => { try { if (id && id.escapedText) declared.add(String(id.escapedText)); } catch { } };
            function addFromBindingName(name: any) {
                try {
                    if (!name) return;
                    if (ts.isIdentifier(name)) addName(name);
                    else if (ts.isArrayBindingPattern(name)) name.elements.forEach((e: any) => addFromBindingName(e.name));
                    else if (ts.isObjectBindingPattern(name)) name.elements.forEach((e: any) => addFromBindingName(e.name));
                } catch { }
            }
            function collect(node: any) {
                try {
                    if (!node) return;
                    switch (node.kind) {
                        case ts.SyntaxKind.VariableDeclarationList: node.declarations?.forEach((d: any) => addFromBindingName(d.name)); break;
                        case ts.SyntaxKind.VariableStatement: node.declarationList?.declarations?.forEach((d: any) => addFromBindingName(d.name)); break;
                        case ts.SyntaxKind.FunctionDeclaration: if (node.name) addName(node.name); node.parameters?.forEach((p: any) => addFromBindingName(p.name)); break;
                        case ts.SyntaxKind.FunctionExpression:
                        case ts.SyntaxKind.ArrowFunction: node.parameters?.forEach((p: any) => addFromBindingName(p.name)); break;
                        case ts.SyntaxKind.ClassDeclaration:
                        case ts.SyntaxKind.EnumDeclaration:
                        case ts.SyntaxKind.InterfaceDeclaration:
                        case ts.SyntaxKind.TypeAliasDeclaration:
                        case ts.SyntaxKind.ModuleDeclaration: if (node.name) addName(node.name); break;
                        case ts.SyntaxKind.ImportDeclaration: {
                            try {
                                const clause = node.importClause;
                                if (clause) {
                                    if (clause.name) addName(clause.name);
                                    const ns = clause.namedBindings;
                                    if (ns && ts.isNamespaceImport(ns) && ns.name) addName(ns.name);
                                    if (ns && ts.isNamedImports(ns)) ns.elements?.forEach((el: any) => addName(el.name));
                                }
                            } catch { }
                            break;
                        }
                        case ts.SyntaxKind.CatchClause: { try { if (node.variableDeclaration?.name) addFromBindingName(node.variableDeclaration.name); } catch { } break; }
                    }
                } catch { }
                try { node.forEachChild(collect); } catch { }
            }
            collect(sf);
            const IGNORE_NAMES = new Set(['this', 'super', 'arguments']);
            const skipParentKinds = new Set<number>([
                ts.SyntaxKind.PropertyDeclaration,
                ts.SyntaxKind.PropertySignature,
                ts.SyntaxKind.MethodDeclaration,
                ts.SyntaxKind.MethodSignature,
                ts.SyntaxKind.PropertyAssignment,
                ts.SyntaxKind.GetAccessor,
                ts.SyntaxKind.SetAccessor,
                ts.SyntaxKind.ImportSpecifier,
                ts.SyntaxKind.ExportSpecifier,
                ts.SyntaxKind.ShorthandPropertyAssignment,
                ts.SyntaxKind.BindingElement,
                ts.SyntaxKind.Parameter,
                ts.SyntaxKind.TypeReference,
                ts.SyntaxKind.TypeAliasDeclaration,
                ts.SyntaxKind.InterfaceDeclaration,
                ts.SyntaxKind.TypeLiteral,
                ts.SyntaxKind.QualifiedName,
                ts.SyntaxKind.EnumMember,
                ts.SyntaxKind.ModuleDeclaration,
                ts.SyntaxKind.LabeledStatement,
            ]);
            const reported = new Set<string>();
            function maybeReport(id: any) {
                try {
                    const name = String(id.escapedText || '');
                    if (!name) return;
                    if (IGNORE_NAMES.has(name)) return;
                    if ((globalThis as any).RESERVED_GLOBALS?.has?.(name)) return; // optional, in-case constants injected
                    const parent = id.parent;
                    if (parent && (
                        (ts.isCallExpression(parent) && parent.expression === id) ||
                        (ts.isNewExpression(parent) && parent.expression === id) ||
                        (ts.isTaggedTemplateExpression(parent) && parent.tag === id)
                    )) { return; }
                    if (parent && ts.isPropertyAccessExpression(parent) && parent.name === id) return;
                    if (parent && parent.kind === ts.SyntaxKind.PropertyAssignment && parent.name === id) return;
                    if (parent && skipParentKinds.has(parent.kind)) return;
                    if (!declared.has(name)) {
                        const start = id.getStart(sf);
                        const end = id.getEnd();
                        const startPos = document.positionAt(start);
                        const endPos = document.positionAt(end);
                        const range = new vscode.Range(startPos, endPos);
                        const diag = new vscode.Diagnostic(range, `Undeclared variable: ${name}`, vscode.DiagnosticSeverity.Warning);
                        diag.source = 'Undeclared Variable';
                        diagnostics.push(diag);
                    }
                } catch { }
            }
            function walkRefs(node: any) {
                try { if (ts.isIdentifier(node)) maybeReport(node); } catch { }
                try { node.forEachChild(walkRefs); } catch { }
            }
            walkRefs(sf);
            undeclaredDiagnostics.set(document.uri, diagnostics);
        } catch { try { undeclaredDiagnostics.delete(document.uri); } catch { } }
    }

    function logUndeclaredWarningsForDocument(document: vscode.TextDocument) {
        lintUndeclaredVariables(document);
        const diags = undeclaredDiagnostics.get(document.uri) || [];
        if (diags.length === 0) return;
        const docUri = document.uri.toString();
        const fileName = path.basename(document.fileName);
        const outputChannel = deps.getOrCreateOutputChannel(docUri, fileName);
        const map = new Map<string, number[]>();
        for (const d of diags) {
            try {
                const msg = String(d.message || '');
                const m = msg.match(/Undeclared variable:\s*(.+)$/i);
                const name = m && m[1] ? m[1].trim() : '';
                const line = (d.range?.start?.line ?? 0) + 1;
                if (!map.has(name)) map.set(name, []);
                map.get(name)!.push(line);
            } catch { }
        }
        const parts: string[] = [];
        for (const [name, lines] of map.entries()) {
            const uniq = Array.from(new Set(lines)).sort((a, b) => a - b);
            if (name) parts.push(`${name} (line${uniq.length > 1 ? 's' : ''}: ${uniq.join(', ')})`);
        }
        const warningText = parts.length > 0
            ? `Undeclared variable(s): ${parts.join(', ')}`
            : `Undeclared variable(s) detected.`;
        const fullWarning = `[⚠️WARNING in ${fileName}] ${warningText}`;
        outputChannel.appendLine(`${deps.getTime()} ${fullWarning}`);
        const panel = deps.getPanelForDocUri(docUri);
        const level = getStrictLevel('Undeclared');
        if (panel && level === 'block') sendToWebview(panel, { type: 'showWarning', message: fullWarning });
    }

    function hasUndeclaredWarnings(document: vscode.TextDocument) {
        lintUndeclaredVariables(document);
        const diags = undeclaredDiagnostics.get(document.uri) || [];
        const items: Array<{ name: string; line: number }> = [];
        for (const d of diags) {
            try {
                const msg = String(d.message || '');
                const m = msg.match(/Undeclared variable:\s*(.+)$/i);
                const name = m && m[1] ? m[1].trim() : '';
                items.push({ name, line: (d.range?.start?.line ?? 0) + 1 });
            } catch { }
        }
        return { has: items.length > 0, items };
    }

    function lintNoVar(document: vscode.TextDocument) {
        try {
            if (document.uri.scheme !== 'file') return;
            const lang = document.languageId;
            const isJsLike = lang === 'javascript' || lang === 'typescript' || lang === 'javascriptreact' || lang === 'typescriptreact';
            if (!isJsLike) { noVarDiagnostics.delete(document.uri); return; }
            const level = getStrictLevel('NoVar');
            if (level === 'ignore') { noVarDiagnostics.delete(document.uri); return; }
            const text = document.getText();
            const diagnostics: vscode.Diagnostic[] = [];
            const ts = require('typescript');
            const scriptKind = ((): any => {
                if (lang === 'typescript') return ts.ScriptKind.TS;
                if (lang === 'typescriptreact') return ts.ScriptKind.TSX;
                if (lang === 'javascriptreact') return ts.ScriptKind.JSX;
                return ts.ScriptKind.JS;
            })();
            const sf = ts.createSourceFile(document.fileName, text, ts.ScriptTarget.Latest, true, scriptKind);
            function maybeReportList(list: any) {
                try {
                    if (!list) return;
                    const isVar = (list.flags & (ts.NodeFlags.Let | ts.NodeFlags.Const)) === 0;
                    if (isVar) {
                        const start = list.getStart(sf);
                        const end = start + 3;
                        const startPos = document.positionAt(start);
                        const endPos = document.positionAt(Math.min(end, text.length));
                        const range = new vscode.Range(startPos, endPos);
                        const diag = new vscode.Diagnostic(range, 'Avoid var; use let instead.', vscode.DiagnosticSeverity.Warning);
                        diag.source = 'No-var Linter';
                        diagnostics.push(diag);
                    }
                } catch { }
            }
            function visit(node: any) {
                try {
                    if (ts.isVariableStatement(node) && node.declarationList) {
                        maybeReportList(node.declarationList);
                    } else if (ts.isVariableDeclarationList(node)) {
                        maybeReportList(node);
                    }
                } catch { }
                try { node.forEachChild(visit); } catch { }
            }
            visit(sf);
            noVarDiagnostics.set(document.uri, diagnostics);
        } catch { try { noVarDiagnostics.delete(document.uri); } catch { } }
    }

    function logVarWarningsForDocument(document: vscode.TextDocument) {
        lintNoVar(document);
        const diags = noVarDiagnostics.get(document.uri) || [];
        if (diags.length === 0) return;
        const docUri = document.uri.toString();
        const fileName = path.basename(document.fileName);
        const outputChannel = deps.getOrCreateOutputChannel(docUri, fileName);
        const uniqLines = Array.from(new Set(diags.map(d => (d.range?.start?.line ?? 0) + 1))).sort((a, b) => a - b);
        const warningText = `Avoid var; use let instead on line(s): ${uniqLines.join(', ')}`;
        const fullWarning = `[⚠️WARNING in ${fileName}] ${warningText}`;
        outputChannel.appendLine(`${deps.getTime()} ${fullWarning}`);
        const panel = deps.getPanelForDocUri(docUri);
        const level = getStrictLevel('NoVar');
        if (panel && level === 'block') panel.webview.postMessage({ type: 'showWarning', message: fullWarning });
    }

    function hasVarWarnings(document: vscode.TextDocument) {
        lintNoVar(document);
        const diags = noVarDiagnostics.get(document.uri) || [];
        const lines = Array.from(new Set(diags.map(d => (d.range?.start?.line ?? 0) + 1))).sort((a, b) => a - b);
        return { has: diags.length > 0, lines };
    }

    function lintLooseEquality(document: vscode.TextDocument) {
        try {
            if (document.uri.scheme !== 'file') return;
            const lang = document.languageId;
            const isJsLike = lang === 'javascript' || lang === 'typescript' || lang === 'javascriptreact' || lang === 'typescriptreact';
            if (!isJsLike) { equalityDiagnostics.delete(document.uri); return; }
            const level = getStrictLevel('LooseEquality');
            if (level === 'ignore') { equalityDiagnostics.delete(document.uri); return; }
            const text = document.getText();
            const diagnostics: vscode.Diagnostic[] = [];
            const ts = require('typescript');
            const scriptKind = ((): any => {
                if (lang === 'typescript') return ts.ScriptKind.TS;
                if (lang === 'typescriptreact') return ts.ScriptKind.TSX;
                if (lang === 'javascriptreact') return ts.ScriptKind.JSX;
                return ts.ScriptKind.JS;
            })();
            const sf = ts.createSourceFile(document.fileName, text, ts.ScriptTarget.Latest, true, scriptKind);
            function visit(node: any) {
                try {
                    if (ts.isBinaryExpression(node)) {
                        const op = node.operatorToken?.kind;
                        if (op === ts.SyntaxKind.EqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsToken) {
                            const start = node.operatorToken.getStart(sf);
                            const end = node.operatorToken.getEnd();
                            const startPos = document.positionAt(start);
                            const endPos = document.positionAt(end);
                            const range = new vscode.Range(startPos, endPos);
                            const msg = op === ts.SyntaxKind.EqualsEqualsToken ? "Use '===' instead of '=='" : "Use '!==' instead of '!='";
                            const diag = new vscode.Diagnostic(range, msg, vscode.DiagnosticSeverity.Warning);
                            diag.source = 'Equality Linter';
                            diagnostics.push(diag);
                        }
                    }
                } catch { }
                try { node.forEachChild(visit); } catch { }
            }
            visit(sf);
            equalityDiagnostics.set(document.uri, diagnostics);
        } catch { try { equalityDiagnostics.delete(document.uri); } catch { } }
    }

    function logEqualityWarningsForDocument(document: vscode.TextDocument) {
        lintLooseEquality(document);
        const diags = equalityDiagnostics.get(document.uri) || [];
        if (diags.length === 0) return;
        const docUri = document.uri.toString();
        const fileName = path.basename(document.fileName);
        const outputChannel = deps.getOrCreateOutputChannel(docUri, fileName);
        const { eqLines, neqLines } = hasEqualityWarnings(document);
        const level = getStrictLevel('LooseEquality');
        if (level !== 'ignore' && cfg.getLogWarningsToOutput()) {
            if (eqLines.length) outputChannel.appendLine(`${deps.getTime()} [⚠️WARNING in ${fileName}] Use '===' instead of '==' on line(s): ${eqLines.join(', ')}`);
            if (neqLines.length) outputChannel.appendLine(`${deps.getTime()} [⚠️WARNING in ${fileName}] Use '!==' instead of '!=' on line(s): ${neqLines.join(', ')}`);
        }
    }

    function hasEqualityWarnings(document: vscode.TextDocument) {
        lintLooseEquality(document);
        const diags = equalityDiagnostics.get(document.uri) || [];
        const eqLines: number[] = [];
        const neqLines: number[] = [];
        for (const d of diags) {
            const line = (d.range?.start?.line ?? 0) + 1;
            if (/!==/.test(d.message)) neqLines.push(line);
            else if (/===/.test(d.message)) eqLines.push(line);
        }
        return { has: diags.length > 0, eqLines: Array.from(new Set(eqLines)).sort((a, b) => a - b), neqLines: Array.from(new Set(neqLines)).sort((a, b) => a - b) };
    }

    type LintCacheEntry = {
        version: number;
        semi: ReturnType<typeof hasSemicolonWarnings>;
        und: ReturnType<typeof hasUndeclaredWarnings>;
        nov: ReturnType<typeof hasVarWarnings>;
        eq: ReturnType<typeof hasEqualityWarnings>;
    };

    const lintCache = new Map<string, LintCacheEntry>();

    function getLintSnapshot(document: vscode.TextDocument): LintCacheEntry {
        const key = document.uri.toString();
        const existing = lintCache.get(key);
        if (existing && existing.version === document.version) {
            return existing;
        }
        const semi = hasSemicolonWarnings(document);
        const und = hasUndeclaredWarnings(document);
        const nov = hasVarWarnings(document);
        const eq = hasEqualityWarnings(document);
        const snapshot: LintCacheEntry = { version: document.version, semi, und, nov, eq };
        lintCache.set(key, snapshot);
        return snapshot;
    }

    function shouldBlockDocument(document: vscode.TextDocument): boolean {
        const snap = getLintSnapshot(document);
        return (
            (getStrictLevel('Semicolon') === 'block' && snap.semi.has) ||
            (getStrictLevel('Undeclared') === 'block' && snap.und.has) ||
            (getStrictLevel('NoVar') === 'block' && snap.nov.has) ||
            (getStrictLevel('LooseEquality') === 'block' && snap.eq.has)
        );
    }

    function logBlockingWarningsForDocument(document: vscode.TextDocument) {
        const docUri = document.uri.toString();
        const fileName = path.basename(document.fileName);
        const outputChannel = deps.getOrCreateOutputChannel(docUri, fileName);
        const snap = getLintSnapshot(document);
        const semi = snap.semi;
        const und = snap.und;
        const nov = snap.nov;
        const lines = semi.lines;
        const semiMsg = semi.has ? `[⚠️WARNING in ${fileName}] Missing semicolon on line(s): ${lines.join(', ')}` : '';
        const undParts: string[] = [];
        for (const it of und.items) {
            if (!it.name) continue;
            undParts.push(`${it.name} (line ${it.line})`);
        }
        const undMsg = und.has ? `[⚠️WARNING in ${fileName}] Undeclared variable(s): ${undParts.join(', ')}` : '';
        const novMsg = nov.has ? `[⚠️WARNING in ${fileName}] Avoid var; use let instead on line(s): ${nov.lines.join(', ')}` : '';
        const eq = snap.eq;
        const eqMsgEq = eq.eqLines.length ? `[⚠️WARNING in ${fileName}] Use '===' instead of '==' on line(s): ${eq.eqLines.join(', ')}` : '';
        const eqMsgNeq = eq.neqLines.length ? `[⚠️WARNING in ${fileName}] Use '!==' instead of '!=' on line(s): ${eq.neqLines.join(', ')}` : '';

        if (cfg.getLogWarningsToOutput()) {
            if (semiMsg) outputChannel.appendLine(`${deps.getTime()} ${semiMsg}`);
            if (undMsg) outputChannel.appendLine(`${deps.getTime()} ${undMsg}`);
            if (novMsg) outputChannel.appendLine(`${deps.getTime()} ${novMsg}`);
            if (eqMsgEq) outputChannel.appendLine(`${deps.getTime()} ${eqMsgEq}`);
            if (eqMsgNeq) outputChannel.appendLine(`${deps.getTime()} ${eqMsgNeq}`);
        }

        const panel = deps.getPanelForDocUri(docUri);
        const lvlSemi = getStrictLevel('Semicolon');
        const lvlUnd = getStrictLevel('Undeclared');
        const lvlNoVar = getStrictLevel('NoVar');
        const lvlLoose = getStrictLevel('LooseEquality');
        const overlayParts = [
            (lvlSemi === 'block') ? semiMsg : '',
            (lvlUnd === 'block') ? undMsg : '',
            (lvlNoVar === 'block') ? novMsg : '',
            (lvlLoose === 'block') ? [eqMsgEq, eqMsgNeq].filter(Boolean).join('\n') : ''
        ].filter(Boolean);
        const overlay = overlayParts.join('\n');
        if (panel && overlay) sendToWebview(panel, { type: 'showWarning', message: overlay });
    }

    function logAllWarningsForDocument(document: vscode.TextDocument) {
        logSemicolonWarningsForDocument(document);
        logUndeclaredWarningsForDocument(document);
        logVarWarningsForDocument(document);
        logEqualityWarningsForDocument(document);
    }

    function lintAll(document: vscode.TextDocument) {
        lintSemicolons(document);
        lintUndeclaredVariables(document);
        lintNoVar(document);
        lintLooseEquality(document);
    }

    function clearDiagnosticsForDocument(uri: vscode.Uri) {
        try { semicolonDiagnostics.delete(uri); } catch { }
        try { undeclaredDiagnostics.delete(uri); } catch { }
        try { noVarDiagnostics.delete(uri); } catch { }
        try { equalityDiagnostics.delete(uri); } catch { }
    }

    return {
        clearDiagnosticsForDocument,
        getStrictLevel,
        lintSemicolons,
        lintUndeclaredVariables,
        lintNoVar,
        lintLooseEquality,
        lintAll,
        hasSemicolonWarnings,
        hasUndeclaredWarnings,
        hasVarWarnings,
        hasEqualityWarnings,
        logSemicolonWarningsForDocument,
        logUndeclaredWarningsForDocument,
        logVarWarningsForDocument,
        logEqualityWarningsForDocument,
        logBlockingWarningsForDocument,
        shouldBlockDocument,
        logAllWarningsForDocument,
    };
}
