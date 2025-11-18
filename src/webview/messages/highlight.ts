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
  const suppressUntilBreakpoint = !!(panel as any)._suppressHighlightUntilBreakpoint;
  let hasBreakpoint = false;
  try { hasBreakpoint = deps.hasBreakpointOnLine(docUri, line); } catch { }
  const shouldRenderHighlight = !suppressUntilBreakpoint || hasBreakpoint;
  let ed = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === docUri) || null;
  if (!ed && vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri.toString() === docUri) {
    ed = vscode.window.activeTextEditor;
  }
  if (shouldRenderHighlight) {
    if (ed && ed.document) {
      deps.applyStepHighlight(ed, line);
    } else {
      try {
        const fileName = require('path').basename(editor.document.fileName);
        const ch = deps.getOrCreateOutputChannel(docUri, fileName);
        ch.appendLine(`${deps.getTime()} [ℹ️INFO] Highlight requested but sketch editor is not visible. Open the sketch to see line highlights.`);
      } catch { }
    }
    try { deps.blocklyHighlightForLine(docUri, line); } catch { }
  }

  if ((panel as any)._autoStepMode && hasBreakpoint) {
    try {
      if ((panel as any)._autoStepTimer) {
        try { clearInterval((panel as any)._autoStepTimer); } catch { }
        (panel as any)._autoStepTimer = null;
      }
      (panel as any)._autoStepMode = false;
      (panel as any)._suppressHighlightUntilBreakpoint = false;
      const fileName = require('path').basename(editor.document.fileName);
      const ch = deps.getOrCreateOutputChannel(docUri, fileName);
      ch.appendLine(`${deps.getTime()} [⏸️INFO] Paused at breakpoint on line ${line}. Click SINGLE-STEP to advance, CONTINUE to run to the next breakpoint, or STEP-RUN to auto-step.`);
    } catch { }
  }
}

export async function handleClearHighlight(
  params: { panel: vscode.WebviewPanel; editor: vscode.TextEditor; final?: boolean },
  deps: {
    clearStepHighlight: (editor?: vscode.TextEditor) => void;
    blocklyClearHighlight: (docUri: string) => void;
    getTime: () => string;
    getOrCreateOutputChannel: (docUri: string, fileName: string) => vscode.OutputChannel;
    setDebugPrimedFalse: (docUri: string) => void;
    setPrimedContextFalse: () => void | Thenable<any>;
    setSteppingActive: (docUri: string, value: boolean) => void;
  }
) {
  const { panel, editor, final: finalFromMsg } = params;
  const docUri = editor.document.uri.toString();
  try { (panel as any)._suppressHighlightUntilBreakpoint = false; } catch { }
  let ed = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === docUri) || null;
  if (!ed && vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri.toString() === docUri) {
    ed = vscode.window.activeTextEditor;
  }
  if (ed && ed.document) { deps.clearStepHighlight(ed); }
  try { deps.blocklyClearHighlight(docUri); } catch { }
  try {
    const hasExplicitFinal = typeof finalFromMsg === 'boolean';
    const isFinal = hasExplicitFinal && finalFromMsg;
    // Only stop stepping when an explicit final=true is provided by the instrumenter.
    // Do NOT infer finalization from absence of draw(); this caused premature stops
    // during STEP-RUN when a timer tick arrived between awaited steps.
    const shouldStopStepping = isFinal;
    if (shouldStopStepping) {
      if ((panel as any)._autoStepTimer) {
        try { clearInterval((panel as any)._autoStepTimer); } catch { }
        (panel as any)._autoStepTimer = null;
      }
      (panel as any)._autoStepMode = false;
      const fileName = require('path').basename(editor.document.fileName);
      const ch = deps.getOrCreateOutputChannel(docUri, fileName);
      ch.appendLine(`${deps.getTime()} [▶️INFO] Code stepping finished.`);
      (panel as any)._steppingActive = false;
      try { deps.setSteppingActive(docUri, false); } catch { }
      deps.setDebugPrimedFalse(docUri);
      try { await deps.setPrimedContextFalse(); } catch { }
    }
  } catch { }
}
