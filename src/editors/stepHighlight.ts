import * as vscode from 'vscode';

let stepHighlightDecoration: vscode.TextEditorDecorationType | null = null;

export function ensureStepHighlightDecoration(): vscode.TextEditorDecorationType {
    if (!stepHighlightDecoration) {
        stepHighlightDecoration = vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            backgroundColor: 'rgba(255,215,0,0.25)',
            overviewRulerColor: 'rgba(255,215,0,0.8)',
            overviewRulerLane: vscode.OverviewRulerLane.Full,
            border: '1px solid rgba(255,215,0,0.7)'
        });
    }
    return stepHighlightDecoration;
}

export function clearStepHighlight(editor?: vscode.TextEditor) {
    if (!stepHighlightDecoration) return;
    const ed = editor || vscode.window.activeTextEditor;
    if (ed && ed.document) {
        ed.setDecorations(stepHighlightDecoration, []);
    }
}

export function applyStepHighlight(editor: vscode.TextEditor, line: number) {
    const deco = ensureStepHighlightDecoration();
    const lineIdx = Math.max(0, Math.min(editor.document.lineCount - 1, line - 1));
    const range = new vscode.Range(lineIdx, 0, lineIdx, editor.document.lineAt(lineIdx).text.length);
    editor.setDecorations(deco, [range]);
    try { editor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport); } catch { }
}
