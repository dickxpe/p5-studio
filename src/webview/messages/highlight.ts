import * as vscode from 'vscode';

export function handleHighlightLine(
  params: { panel: vscode.WebviewPanel; editor: vscode.TextEditor; line?: number },
  deps: {
    getTime: () => string;
    getOrCreateOutputChannel: (docUri: string, fileName: string) => vscode.OutputChannel;
    applyStepHighlight: (editor: vscode.TextEditor, line: number) => void;
    hasBreakpointOnLine: (docUriStr: string, line1Based: number) => boolean;
    blocklyHighlightForLine: (docUri: string, line: number) => void;
  }
) {
  const { panel, editor } = params;
  const docUri = editor.document.uri.toString();
  const line = typeof params.line === 'number' ? params.line : 1;
  let ed = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === docUri) || null;
  if (!ed && vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri.toString() === docUri) {
    ed = vscode.window.activeTextEditor;
  }
  if (ed && ed.document) {
    console.log(`[handleHighlightLine] Highlighting line: ${line}`);
    deps.applyStepHighlight(ed, line);
    try {
      if ((panel as any)._autoStepMode && deps.hasBreakpointOnLine(docUri, line)) {
        if ((panel as any)._autoStepTimer) {
          try { clearInterval((panel as any)._autoStepTimer); } catch { }
          (panel as any)._autoStepTimer = null;
        }
        (panel as any)._autoStepMode = false;
        const fileName = require('path').basename(editor.document.fileName);
        const ch = deps.getOrCreateOutputChannel(docUri, fileName);
        ch.appendLine(`${deps.getTime()} [⏸️INFO] Paused at breakpoint on line ${line}. Click SINGLE-STEP to advance or STEP-RUN to resume.`);
      }
    } catch { }
  } else {
    try {
      const fileName = require('path').basename(editor.document.fileName);
      const ch = deps.getOrCreateOutputChannel(docUri, fileName);
      ch.appendLine(`${deps.getTime()} [ℹ️INFO] Highlight requested but sketch editor is not visible. Open the sketch to see line highlights.`);
    } catch { }
  }
  try { deps.blocklyHighlightForLine(docUri, line); } catch { }
}

export async function handleClearHighlight(
  params: { panel: vscode.WebviewPanel; editor: vscode.TextEditor },
  deps: {
    clearStepHighlight: (editor?: vscode.TextEditor) => void;
    blocklyClearHighlight: (docUri: string) => void;
    getTime: () => string;
    getOrCreateOutputChannel: (docUri: string, fileName: string) => vscode.OutputChannel;
    setDebugPrimedFalse: (docUri: string) => void;
    setPrimedContextFalse: () => void | Thenable<any>;
  }
) {
  const { panel, editor } = params;
  const docUri = editor.document.uri.toString();
  let ed = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === docUri) || null;
  if (!ed && vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri.toString() === docUri) {
    ed = vscode.window.activeTextEditor;
  }
  if (ed && ed.document) { deps.clearStepHighlight(ed); }
  try { deps.blocklyClearHighlight(docUri); } catch { }
  try {
    const codeText = editor.document.getText();
    const hasDraw = /\bfunction\s+draw\s*\(/.test(codeText);
    if (!hasDraw) {
      const fileName = require('path').basename(editor.document.fileName);
      const ch = deps.getOrCreateOutputChannel(docUri, fileName);
      ch.appendLine(`${deps.getTime()} [▶️INFO] Code stepping finished.`);
      (panel as any)._steppingActive = false;
      deps.setDebugPrimedFalse(docUri);
      try { await deps.setPrimedContextFalse(); } catch { }
    }
  } catch { }
}
