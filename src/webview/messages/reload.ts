import * as vscode from 'vscode';

export async function handleReloadClicked(
  params: { panel: vscode.WebviewPanel; editor: vscode.TextEditor; preserveGlobals?: boolean },
  deps: {
    getTime: () => string;
    getOrCreateOutputChannel: (docUri: string, fileName: string) => vscode.OutputChannel;
    clearStepHighlight: (editor?: vscode.TextEditor) => void;
    blocklyClearHighlight: (docUri: string) => void;
    lintApi: {
      logAllWarningsForDocument: (doc: vscode.TextDocument) => void;
      hasSemicolonWarnings: (doc: vscode.TextDocument) => { has: boolean };
      hasUndeclaredWarnings: (doc: vscode.TextDocument) => { has: boolean };
      hasVarWarnings: (doc: vscode.TextDocument) => { has: boolean };
      hasEqualityWarnings: (doc: vscode.TextDocument) => { has: boolean };
      getStrictLevel: (rule: 'Semicolon' | 'Undeclared' | 'NoVar' | 'LooseEquality') => 'warn' | 'block' | 'ignore';
      logBlockingWarningsForDocument: (doc: vscode.TextDocument) => void;
    };
    formatSyntaxErrorMsg: (s: string) => string;
    stripLeadingTimestamp: (s: string) => string;
    createHtml: (code: string, panel: vscode.WebviewPanel, extensionPath: string, opts?: { allowInteractiveTopInputs?: boolean; initialCaptureVisible?: boolean }) => Promise<string>;
    getInitialCaptureVisible: (panel: vscode.WebviewPanel) => boolean;
    getExtensionPath: () => string;
    validateSource: (document: vscode.TextDocument, code?: string) => {
      ok: boolean;
      code: string;
      syntaxErrorMsg?: string;
      reservedConflictMsg?: string;
    };
    hasNonTopInputUsage: (code: string) => boolean;
    detectTopLevelInputs: (code: string) => Array<{ varName: string; label?: string; defaultValue?: any }>;
    hasCachedInputsForKey: (key: string, items: Array<{ varName: string; label?: string }>) => boolean;
    preprocessTopLevelInputs: (code: string, opts: { key: string; interactive: boolean }) => Promise<string>;
    getAllowInteractiveTopInputs: () => boolean;
    setAllowInteractiveTopInputs: (v: boolean) => void;
    wrapInSetupIfNeeded: (code: string) => string;
    extractGlobalVariablesWithConflicts: (code: string) => { globals: Array<{ name: string; value: any; type: string }>; conflicts: string[] };
    extractGlobalVariables: (code: string) => Array<{ name: string; value: any; type: string }>;
    rewriteUserCodeWithWindowGlobals: (code: string, globals: Array<{ name: string; value?: any }>) => string;
    getHiddenGlobalsByDirective: (code: string) => Set<string>;
    hasOnlySetup: (code: string) => boolean;
    setSteppingActive?: (docUri: string, value: boolean) => void;
  }
) {
  const { panel, editor } = params;
  const docUri = editor.document.uri.toString();
  const fileName = require('path').basename(editor.document.fileName);
  // Log reload action to output channel
  try {
    const ch = deps.getOrCreateOutputChannel(docUri, fileName);
    ch.appendLine(`${deps.getTime()} [🔄INFO] Reload`);
  } catch { /* ignore */ }

  // Clear highlights and stop stepping state
  try { deps.clearStepHighlight(editor); } catch { }
  try { deps.blocklyClearHighlight(editor.document.uri.toString()); } catch { }
  (panel as any)._steppingActive = false;
  try { deps.setSteppingActive?.(docUri, false); } catch { }
  if ((panel as any)._autoStepTimer) {
    try { clearInterval((panel as any)._autoStepTimer); } catch { }
    (panel as any)._autoStepTimer = null;
  }
  (panel as any)._autoStepMode = false;

  const rawCode = editor.document.getText();
  const drawRegex = /\bfunction\s+draw\s*\(/;

  function postGlobalsSnapshot(codeForGlobals: string) {
    const globalsInfo = deps.extractGlobalVariablesWithConflicts(codeForGlobals);
      let filteredGlobals = globalsInfo.globals.filter(g => ['number', 'string', 'boolean', 'array'].includes(g.type));
    const hiddenSet = deps.getHiddenGlobalsByDirective(editor.document.getText());
    if (hiddenSet.size > 0) {
      filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
    }
    const readOnly = deps.hasOnlySetup(editor.document.getText());
    panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
  }

  // Friendly error for inputPrompt misuse
  if (deps.hasNonTopInputUsage(rawCode)) {
    panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
    setTimeout(() => {
      panel.webview.postMessage({ type: 'showError', message: 'inputPrompt() must be used at the very top of the sketch to initialize a variable (e.g., let a = inputPrompt()); runtime prompts are not supported.' });
    }, 150);
    const outputChannel = deps.getOrCreateOutputChannel(docUri, fileName);
    outputChannel.appendLine(`${deps.getTime()} [‼️RUNTIME ERROR in ${fileName}] inputPrompt() must be used at the very top of the sketch to initialize a variable (e.g., let a = inputPrompt()); runtime prompts are not supported.`);
    return;
  }

  // Log warnings on explicit reload action
  deps.lintApi.logAllWarningsForDocument(editor.document);

  // Optionally block sketch on warning
  {
    const warnSemi = deps.lintApi.hasSemicolonWarnings(editor.document);
    const warnUnd = deps.lintApi.hasUndeclaredWarnings(editor.document);
    const warnVar = deps.lintApi.hasVarWarnings(editor.document);
    const warnEq = deps.lintApi.hasEqualityWarnings(editor.document);
    const shouldBlock = (deps.lintApi.getStrictLevel('Semicolon') === 'block' && warnSemi.has)
      || (deps.lintApi.getStrictLevel('Undeclared') === 'block' && warnUnd.has)
      || (deps.lintApi.getStrictLevel('NoVar') === 'block' && warnVar.has)
      || (deps.lintApi.getStrictLevel('LooseEquality') === 'block' && warnEq.has);
    if (shouldBlock) {
      panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
      deps.lintApi.logBlockingWarningsForDocument(editor.document);
      return;
    }
  }

  const validation = deps.validateSource(editor.document, rawCode);
  if (!validation.ok) {
    const outputChannel = deps.getOrCreateOutputChannel(docUri, fileName);
    const msg = validation.syntaxErrorMsg || validation.reservedConflictMsg || `${deps.getTime()} [‼️SYNTAX ERROR in ${fileName}]`;
    panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
    setTimeout(() => {
      panel.webview.postMessage({ type: 'syntaxError', message: deps.stripLeadingTimestamp(msg) });
    }, 150);
    outputChannel.appendLine(msg);
    (panel as any)._lastSyntaxError = msg;
    (panel as any)._lastRuntimeError = null;
    return;
  }

  // Handle top-of-file inputPrompt() placeholders
  const inputsBefore = deps.detectTopLevelInputs(rawCode);
  if (inputsBefore.length > 0) {
    const key = editor.document.fileName;
    if (deps.hasCachedInputsForKey(key, inputsBefore)) {
      const prev = deps.getAllowInteractiveTopInputs();
      deps.setAllowInteractiveTopInputs(false);
      const preprocessed = await deps.preprocessTopLevelInputs(rawCode, { key, interactive: false });
      deps.setAllowInteractiveTopInputs(prev);
      let code = deps.wrapInSetupIfNeeded(preprocessed);
      const globalsInfo = deps.extractGlobalVariablesWithConflicts(code);
      const globals = globalsInfo.globals;
      let rewrittenCode = deps.rewriteUserCodeWithWindowGlobals(code, globals);
      const hasDraw = drawRegex.test(code);
      if (!hasDraw) {
        panel.webview.html = await deps.createHtml(code, panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
        setTimeout(() => {
          try { postGlobalsSnapshot(code); } catch { }
        }, 200);
        setTimeout(() => {
          const onlySetup = deps.hasOnlySetup(editor.document.getText());
          if (onlySetup) {
            try { panel.webview.postMessage({ type: 'requestGlobalsSnapshot' }); } catch { }
          }
        }, 600);
      } else {
        panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
        setTimeout(() => {
          try { postGlobalsSnapshot(code); } catch { }
        }, 200);
      }
      return;
    } else {
      // No cache: show overlay (prefill with defaults)
      panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
      setTimeout(() => {
        panel.webview.postMessage({ type: 'showTopInputs', items: inputsBefore });
      }, 150);
      return;
    }
  }

  // No inputs: just run normally (after validation above)
  let code = deps.wrapInSetupIfNeeded(rawCode);
  const globalsInfo = deps.extractGlobalVariablesWithConflicts(code);
  const globals = globalsInfo.globals;
  let rewrittenCode = deps.rewriteUserCodeWithWindowGlobals(code, globals);
  if (params.preserveGlobals && globals.length > 0) {
    globals.forEach(g => {
      rewrittenCode = rewrittenCode.replace(new RegExp('^\\s*var\\s+' + g.name + '(\\s*=.*)?;?\\s*$', 'gm'), '');
      rewrittenCode = rewrittenCode.replace(new RegExp('^\\s*window\\.' + g.name + '\\s*=\\s*' + g.name + ';?\\s*$', 'gm'), '');
    });
  }
  const hasDraw = drawRegex.test(code);
  if (!hasDraw) {
    panel.webview.html = await deps.createHtml(code, panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
    setTimeout(() => {
      try { postGlobalsSnapshot(code); } catch { }
    }, 200);
    setTimeout(() => {
      const onlySetup = deps.hasOnlySetup(editor.document.getText());
      if (onlySetup) {
        try { panel.webview.postMessage({ type: 'requestGlobalsSnapshot' }); } catch { }
      }
    }, 600);
  } else {
    // For sketches with draw(), always reset globals to initial values on reload
    panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
    setTimeout(() => {
      try { postGlobalsSnapshot(code); } catch { }
    }, 200);
  }
}
