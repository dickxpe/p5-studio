import * as vscode from 'vscode';
import { config as cfg } from '../../config';

export async function handleStepRunClicked(
  params: { panel: vscode.WebviewPanel; editor: vscode.TextEditor },
  deps: {
    getTime: () => string;
    getOrCreateOutputChannel: (docUri: string, fileName: string) => vscode.OutputChannel;
    lintApi: {
      logSemicolonWarningsForDocument: (doc: vscode.TextDocument) => void;
      logUndeclaredWarningsForDocument: (doc: vscode.TextDocument) => void;
      logVarWarningsForDocument: (doc: vscode.TextDocument) => void;
      logEqualityWarningsForDocument: (doc: vscode.TextDocument) => void;
      hasSemicolonWarnings: (doc: vscode.TextDocument) => { has: boolean };
      hasUndeclaredWarnings: (doc: vscode.TextDocument) => { has: boolean };
      hasVarWarnings: (doc: vscode.TextDocument) => { has: boolean };
      hasEqualityWarnings: (doc: vscode.TextDocument) => { has: boolean };
      getStrictLevel: (rule: 'Semicolon' | 'Undeclared' | 'NoVar' | 'LooseEquality') => 'warn' | 'block' | 'ignore';
      logBlockingWarningsForDocument: (doc: vscode.TextDocument) => void;
    };
    hasNonTopInputUsage: (code: string) => boolean;
    detectTopLevelInputs: (code: string) => Array<{ varName: string; label?: string; defaultValue?: any }>;
    hasCachedInputsForKey: (key: string, items: Array<{ varName: string; label?: string }>) => boolean;
    preprocessTopLevelInputs: (code: string, opts: { key: string; interactive: boolean }) => Promise<string>;
    wrapInSetupIfNeeded: (code: string) => string;
    rewriteFrameCountRefs: (code: string) => string;
    instrumentSetupForSingleStep: (code: string, lineOffset: number, opts?: { disableTopLevelPreSteps?: boolean }) => string;
    extractGlobalVariablesWithConflicts: (code: string) => { globals: Array<{ name: string; value: any; type: string }>; conflicts: string[] };
    extractGlobalVariables: (code: string) => Array<{ name: string; value: any; type: string }>;
    rewriteUserCodeWithWindowGlobals: (code: string, globals: Array<{ name: string; value?: any }>) => string;
    getHiddenGlobalsByDirective: (code: string) => Set<string>;
    hasOnlySetup: (code: string) => boolean;
    createHtml: (code: string, panel: vscode.WebviewPanel, extensionPath: string, opts?: { allowInteractiveTopInputs?: boolean; initialCaptureVisible?: boolean }) => Promise<string>;
    getInitialCaptureVisible: (panel: vscode.WebviewPanel) => boolean;
    getExtensionPath: () => string;
    getAllowInteractiveTopInputs: () => boolean;
    setAllowInteractiveTopInputs: (v: boolean) => void;
  }
) {
  const { panel, editor } = params;
  const docUri = editor.document.uri.toString();
  const fileName = require('path').basename(editor.document.fileName);
  const rawCode = editor.document.getText();
  const delayMs = cfg.getStepRunDelayMs();

  // If already stepping, enable auto-advance from current position
  if ((panel as any)._steppingActive) {
    if (!(panel as any)._autoStepMode) {
      try { const ch = deps.getOrCreateOutputChannel(docUri, fileName); ch.appendLine(`${deps.getTime()} [▶️INFO] Switched to STEP-RUN: continuing from current statement with ${delayMs}ms delay.`); } catch { }
    }
    if ((panel as any)._autoStepTimer) { try { clearInterval((panel as any)._autoStepTimer); } catch { } (panel as any)._autoStepTimer = null; }
    (panel as any)._autoStepMode = true;
    (panel as any)._autoStepTimer = setInterval(() => { try { panel.webview.postMessage({ type: 'step-advance' }); } catch { } }, delayMs);
    return;
  }

  // Not stepping yet: instrument with single-step and start auto-advance
  if (deps.hasNonTopInputUsage(rawCode)) {
    panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
    setTimeout(() => { panel.webview.postMessage({ type: 'showError', message: 'input can only be used at the top' }); }, 150);
    try { const ch = deps.getOrCreateOutputChannel(docUri, fileName); ch.appendLine(`${deps.getTime()} [‼️RUNTIME ERROR in ${fileName}] input can only be used at the top`); } catch { }
    return;
  }
  // Log warnings
  deps.lintApi.logSemicolonWarningsForDocument(editor.document);
  deps.lintApi.logUndeclaredWarningsForDocument(editor.document);
  deps.lintApi.logVarWarningsForDocument(editor.document);
  deps.lintApi.logEqualityWarningsForDocument(editor.document);
  // Optionally block on warning
  {
    const blockOnWarning = cfg.getBlockSketchOnWarning();
    const warnSemi = deps.lintApi.hasSemicolonWarnings(editor.document);
    const warnUnd = deps.lintApi.hasUndeclaredWarnings(editor.document);
    const warnVar = deps.lintApi.hasVarWarnings(editor.document);
    const warnEq = deps.lintApi.hasEqualityWarnings(editor.document);
    if (blockOnWarning && (warnSemi.has || warnUnd.has || warnVar.has || warnEq.has)) {
      panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
      deps.lintApi.logBlockingWarningsForDocument(editor.document);
      return;
    }
  }
  // Reserved-name conflicts block execution
  const { conflicts } = deps.extractGlobalVariablesWithConflicts(rawCode);
  if (conflicts.length > 0) {
    let syntaxErrorMsg = `${deps.getTime()} [‼️SYNTAX ERROR in ${fileName}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
    syntaxErrorMsg = require('util').isFunction((deps as any).formatSyntaxErrorMsg) ? (deps as any).formatSyntaxErrorMsg(syntaxErrorMsg) : syntaxErrorMsg;
    panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
    setTimeout(() => { panel.webview.postMessage({ type: 'syntaxError', message: syntaxErrorMsg.replace(/^\d{2}:\d{2}:\d{2}\s+/, '') }); }, 150);
    try { const ch = deps.getOrCreateOutputChannel(docUri, fileName); ch.appendLine(syntaxErrorMsg); } catch { }
    (panel as any)._lastSyntaxError = syntaxErrorMsg;
    (panel as any)._lastRuntimeError = null;
    return;
  }

  // Handle top-level inputPrompt() placeholders with cache-aware preprocessing
  const inputsBefore = deps.detectTopLevelInputs(rawCode);
  let codeForRun = rawCode;
  if (inputsBefore.length > 0) {
    const key = editor.document.fileName;
    if (deps.hasCachedInputsForKey(key, inputsBefore)) {
      const prev = deps.getAllowInteractiveTopInputs();
      deps.setAllowInteractiveTopInputs(false);
      codeForRun = await deps.preprocessTopLevelInputs(rawCode, { key, interactive: false });
      deps.setAllowInteractiveTopInputs(prev);
    } else {
      panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
      setTimeout(() => { panel.webview.postMessage({ type: 'showTopInputs', items: inputsBefore }); }, 150);
      return;
    }
  }

  let wrapped = deps.wrapInSetupIfNeeded(codeForRun);
  wrapped = deps.rewriteFrameCountRefs(wrapped);
  const didWrap = wrapped !== codeForRun;
  const preGlobals = deps.extractGlobalVariables(wrapped);
  const lineOffsetTotal = (didWrap ? 1 : 0);
  let instrumented = deps.instrumentSetupForSingleStep(wrapped, lineOffsetTotal, { disableTopLevelPreSteps: didWrap });
  const globals = preGlobals;
  let rewrittenCode = deps.rewriteUserCodeWithWindowGlobals(instrumented, globals);
  const hasDraw = /\bfunction\s+draw\s*\(/.test(wrapped);
  try { const ch = deps.getOrCreateOutputChannel(docUri, fileName); ch.appendLine(`${deps.getTime()} [▶️INFO] STEP-RUN started: auto-advancing with ${delayMs}ms delay.`); } catch { }
  const afterLoad = () => {
    const { globals } = deps.extractGlobalVariablesWithConflicts(wrapped);
    let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
    const hiddenSet = deps.getHiddenGlobalsByDirective(editor.document.getText());
    if (hiddenSet.size > 0) { filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name)); }
    const readOnly = deps.hasOnlySetup(editor.document.getText());
    panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
    (panel as any)._steppingActive = true;
    if ((panel as any)._autoStepTimer) { try { clearInterval((panel as any)._autoStepTimer); } catch { } (panel as any)._autoStepTimer = null; }
    (panel as any)._autoStepMode = true;
    (panel as any)._autoStepTimer = setInterval(() => { try { panel.webview.postMessage({ type: 'step-advance' }); } catch { } }, delayMs);
  };
  if (!hasDraw) {
    panel.webview.html = await deps.createHtml(instrumented, panel, deps.getExtensionPath(), { allowInteractiveTopInputs: deps.getAllowInteractiveTopInputs(), initialCaptureVisible: deps.getInitialCaptureVisible(panel) });
    setTimeout(afterLoad, 200);
  } else {
    panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
    setTimeout(afterLoad, 200);
  }
}

export async function handleSingleStepClicked(
  params: { panel: vscode.WebviewPanel; editor: vscode.TextEditor },
  deps: {
    getTime: () => string;
    getOrCreateOutputChannel: (docUri: string, fileName: string) => vscode.OutputChannel;
    lintApi: {
      logSemicolonWarningsForDocument: (doc: vscode.TextDocument) => void;
      logUndeclaredWarningsForDocument: (doc: vscode.TextDocument) => void;
      logVarWarningsForDocument: (doc: vscode.TextDocument) => void;
      hasSemicolonWarnings: (doc: vscode.TextDocument) => { has: boolean };
      hasUndeclaredWarnings: (doc: vscode.TextDocument) => { has: boolean };
      hasVarWarnings: (doc: vscode.TextDocument) => { has: boolean };
      getStrictLevel: (rule: 'Semicolon' | 'Undeclared' | 'NoVar') => 'warn' | 'block' | 'ignore';
      logBlockingWarningsForDocument: (doc: vscode.TextDocument) => void;
    };
    hasNonTopInputUsage: (code: string) => boolean;
    detectTopLevelInputs: (code: string) => Array<{ varName: string; label?: string; defaultValue?: any }>;
    hasCachedInputsForKey: (key: string, items: Array<{ varName: string; label?: string }>) => boolean;
    preprocessTopLevelInputs: (code: string, opts: { key: string; interactive: boolean }) => Promise<string>;
    wrapInSetupIfNeeded: (code: string) => string;
    rewriteFrameCountRefs: (code: string) => string;
    instrumentSetupForSingleStep: (code: string, lineOffset: number, opts?: { disableTopLevelPreSteps?: boolean }) => string;
    extractGlobalVariablesWithConflicts: (code: string) => { globals: Array<{ name: string; value: any; type: string }>; conflicts: string[] };
    extractGlobalVariables: (code: string) => Array<{ name: string; value: any; type: string }>;
    rewriteUserCodeWithWindowGlobals: (code: string, globals: Array<{ name: string; value?: any }>) => string;
    getHiddenGlobalsByDirective: (code: string) => Set<string>;
    hasOnlySetup: (code: string) => boolean;
    createHtml: (code: string, panel: vscode.WebviewPanel, extensionPath: string, opts?: { allowInteractiveTopInputs?: boolean; initialCaptureVisible?: boolean }) => Promise<string>;
    getInitialCaptureVisible: (panel: vscode.WebviewPanel) => boolean;
    getExtensionPath: () => string;
  }
) {
  const { panel, editor } = params;
  const docUri = editor.document.uri.toString();
  const fileName = require('path').basename(editor.document.fileName);
  const rawCode = editor.document.getText();

  let wasAutoStepMode = (panel as any)._autoStepMode;
  if ((panel as any)._autoStepTimer) {
    try { clearInterval((panel as any)._autoStepTimer); } catch { }
    (panel as any)._autoStepTimer = null;
    (panel as any)._autoStepMode = false;
  }
  const isStepping = !!(panel as any)._steppingActive;
  if (isStepping) {
    if (wasAutoStepMode) {
      try { const ch = deps.getOrCreateOutputChannel(docUri, fileName); ch.appendLine(`${deps.getTime()} [⏯️INFO] Switched to SINGLE-STEP, click again to step trough statements.`); } catch { }
    }
    panel.webview.postMessage({ type: 'step-advance' });
    return;
  }

  // Start stepping
  try {
    const ch = deps.getOrCreateOutputChannel(docUri, fileName);
    if (wasAutoStepMode) ch.appendLine(`${deps.getTime()} [⏯️INFO] Switched to SINGLE-STEP, click again to step trough statements.`);
    else ch.appendLine(`${deps.getTime()} [⏯️INFO] SINGLE-STEP started, click again to step trough statements.`);
  } catch { }

  if (deps.hasNonTopInputUsage(rawCode)) {
    panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath());
    setTimeout(() => { panel.webview.postMessage({ type: 'showError', message: 'input can only be used at the top' }); }, 150);
    try { const ch = deps.getOrCreateOutputChannel(docUri, fileName); ch.appendLine(`${deps.getTime()} [‼️RUNTIME ERROR in ${fileName}] input can only be used at the top`); } catch { }
    return;
  }
  deps.lintApi.logSemicolonWarningsForDocument(editor.document);
  deps.lintApi.logUndeclaredWarningsForDocument(editor.document);
  deps.lintApi.logVarWarningsForDocument(editor.document);
  {
    const warnSemi = deps.lintApi.hasSemicolonWarnings(editor.document);
    const warnUnd = deps.lintApi.hasUndeclaredWarnings(editor.document);
    const warnVar = deps.lintApi.hasVarWarnings(editor.document);
    const shouldBlock = (deps.lintApi.getStrictLevel('Semicolon') === 'block' && warnSemi.has)
      || (deps.lintApi.getStrictLevel('Undeclared') === 'block' && warnUnd.has)
      || (deps.lintApi.getStrictLevel('NoVar') === 'block' && warnVar.has);
    if (shouldBlock) {
      panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath());
      deps.lintApi.logBlockingWarningsForDocument(editor.document);
      return;
    }
  }
  const { conflicts } = deps.extractGlobalVariablesWithConflicts(rawCode);
  if (conflicts.length > 0) {
    let syntaxErrorMsg = `${deps.getTime()} [‼️SYNTAX ERROR in ${fileName}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
    panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath());
    setTimeout(() => { panel.webview.postMessage({ type: 'syntaxError', message: syntaxErrorMsg.replace(/^\d{2}:\d{2}:\d{2}\s+/, '') }); }, 150);
    try { const ch = deps.getOrCreateOutputChannel(docUri, fileName); ch.appendLine(syntaxErrorMsg); } catch { }
    (panel as any)._lastSyntaxError = syntaxErrorMsg;
    (panel as any)._lastRuntimeError = null;
    return;
  }

  let codeForRun = rawCode;
  const inputsBefore = deps.detectTopLevelInputs(rawCode);
  if (inputsBefore.length > 0) {
    const key = editor.document.fileName;
    if (deps.hasCachedInputsForKey(key, inputsBefore)) {
      codeForRun = await deps.preprocessTopLevelInputs(rawCode, { key, interactive: false });
    } else {
      panel.webview.html = await deps.createHtml('', panel, deps.getExtensionPath());
      setTimeout(() => { panel.webview.postMessage({ type: 'showTopInputs', items: inputsBefore }); }, 150);
      return;
    }
  }

  let wrapped = deps.wrapInSetupIfNeeded(codeForRun);
  wrapped = deps.rewriteFrameCountRefs(wrapped);
  const didWrap = wrapped !== codeForRun;
  const preGlobals = deps.extractGlobalVariables(wrapped);
  const lineOffsetTotal = (didWrap ? 1 : 0);
  let instrumented = deps.instrumentSetupForSingleStep(wrapped, lineOffsetTotal, { disableTopLevelPreSteps: didWrap });
  const globals = preGlobals;
  let rewrittenCode = deps.rewriteUserCodeWithWindowGlobals(instrumented, globals);
  const hasDraw = /\bfunction\s+draw\s*\(/.test(wrapped);
  if (!hasDraw) {
    panel.webview.html = await deps.createHtml(instrumented, panel, deps.getExtensionPath());
    setTimeout(() => {
      const { globals } = deps.extractGlobalVariablesWithConflicts(wrapped);
      let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
      const hiddenSet = deps.getHiddenGlobalsByDirective(editor.document.getText());
      if (hiddenSet.size > 0) { filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name)); }
      const readOnly = deps.hasOnlySetup(editor.document.getText());
      panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
      (panel as any)._steppingActive = true;
    }, 200);
  } else {
    panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
    setTimeout(() => {
      const { globals } = deps.extractGlobalVariablesWithConflicts(wrapped);
      let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
      const hiddenSet = deps.getHiddenGlobalsByDirective(editor.document.getText());
      if (hiddenSet.size > 0) { filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name)); }
      const readOnly = deps.hasOnlySetup(editor.document.getText());
      panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
      (panel as any)._steppingActive = true;
    }, 200);
  }
}
