import * as path from 'path';
import * as vscode from 'vscode';
import type { WebviewToExtensionMessage, ExtensionToWebviewMessage } from './webview/messageTypes';
import { postMessage as sendToWebview } from './webview/router';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { writeFileSync } from 'fs';
// Modularized helpers and constants
import { getTime, toLocalISOString } from './utils/helpers';
import { RESERVED_GLOBALS } from './constants';
import { extractGlobalVariablesWithConflicts, extractGlobalVariables, rewriteUserCodeWithWindowGlobals } from './processing/codeRewriter';
import { detectTopLevelInputs, hasNonTopInputUsage, preprocessTopLevelInputs, hasCachedInputsForKey, getCachedInputsForKey, setCachedInputsForKey } from './processing/topInputs';
import { createHtml } from './webview/createHtml';
import { rewriteFrameCountRefs, wrapInSetupIfNeeded, formatSyntaxErrorMsg, stripLeadingTimestamp, hasOnlySetup, getHiddenGlobalsByDirective } from './processing/astHelpers';
import { clearStepHighlight, applyStepHighlight } from './editors/stepHighlight';
import { instrumentSetupForSingleStep } from './processing/instrumentation';
import { initOsc, OscServiceApi } from './osc/oscService';
import { registerVariablesService, VariablesServiceApi } from './variables';
import { registerBlockly, BlocklyApi } from './blockly/blocklyPanel';
import { registerLinting, LintApi } from './lint';
import { registerRestoreManager, RESTORE_BLOCKLY_KEY, RESTORE_LIVE_KEY, RESTORE_LIVE_ORDER_KEY } from './restore/restoreManager';
import { registerAutoReload, AutoReloadApi } from './reload/autoReload';
import { runOnActivate, hideFileIfSupported } from './project/setup';
import { getOrCreateOutputChannel, showAndTrackOutputChannel, getOutputChannelForDoc, disposeOutputForDoc, getLastActiveOutputChannel } from './logging/output';
import { registerLivePanelManager, LivePanelManagerApi } from './panels/livePanel';
import { livePanelTitleForFile, LIVE_PANEL_TITLE_PREFIX } from './panels/registry';
import { resolveLiveAssets } from './assets/resolver';
import { config as cfg } from './config/index';
import { setHtmlAndPost } from './webview/helpers';
import { prepareSketch, validateSource, ReloadReason } from './processing/sketchPrep';
// Commands groups
import { registerDebugCommands } from './commands/debug';
import { registerCaptureCommands } from './commands/capture';
import { registerUICommands } from './commands/ui';
import { registerHelpCommands } from './commands/help';
import { registerBlocklyCommands } from './commands/blockly';
import { registerLiveCommands } from './commands/live';
import { handleSetGlobalVars, handleUpdateGlobalVar } from './webview/messages/vars';
import { handleCaptureVisibilityChanged } from './webview/messages/capture';
import { handleLog } from './webview/messages/log';
import { handleShowError } from './webview/messages/error';
import { handleShowInfo } from './webview/messages/info';
import { handleOscSend } from './webview/messages/osc';
import { handleFocusScriptTab } from './webview/messages/focus';
import { handleCopyCanvasImage } from './webview/messages/image';
import { handleSubmitTopInputs } from './webview/messages/inputs';
import { handleReloadClicked } from './webview/messages/reload';
import { handleStepRunClicked, handleSingleStepClicked } from './webview/messages/step';
import { handleHighlightLine, handleClearHighlight } from './webview/messages/highlight';
import { handleSaveCanvasImage } from './webview/messages/saveImage';
import { hasBreakpointOnLine } from './debug/breakpoints';
import { registerContextService, ContextServiceApi } from './context';
import { registerLayoutRestore, LayoutRestoreApi } from './layout';

const webviewPanelMap = new Map<string, vscode.WebviewPanel>();
let activeP5Panel: vscode.WebviewPanel | null = null;

// Context service for context keys and focus watchers
let contextService: ContextServiceApi;

// Project marker: whether the workspace has a .p5 file at its root
let hasP5Project: boolean = false;

// Layout/Restore service for panel positioning and startup restore
let layoutService: LayoutRestoreApi;

// Step highlight helpers
let _allowInteractiveTopInputs = true;
// Track reason for last reload/update to alter input overlay behavior
let _pendingReloadReason: 'typing' | 'save' | 'command' | undefined;

// Helper to compute initial capture visibility for a webview panel from saved state
function getInitialCaptureVisible(panel: vscode.WebviewPanel): boolean {
  try { return contextService?.getInitialCaptureVisible(panel) || false; } catch { return false; }
}

// Command to clear highlight, for use with keybinding
function registerClearHighlightCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('p5studio.clearHighlightEsc', async () => {
    clearStepHighlight(vscode.window.activeTextEditor);
  }));
}

// ----------------------------
// Activate
// ----------------------------
export function activate(context: vscode.ExtensionContext) {
  // Make p5/builtin globals visible to the linter via globalThis hook
  try { (globalThis as any).RESERVED_GLOBALS = RESERVED_GLOBALS; } catch { }
  // VARIABLES SERVICE
  let variablesService: VariablesServiceApi;
  // Initialize OSC service with broadcast to all open P5 panels
  let oscService: OscServiceApi | null = null;
  const broadcastOscToPanels = (address: string, args: any[]) => {
    for (const [, panel] of webviewPanelMap.entries()) {
      try {
        sendToWebview(panel, { type: 'oscReceive', address, args });
      } catch { }
    }
  };
  oscService = initOsc(broadcastOscToPanels);
  // Helper: find active P5 panel
  function getActiveP5Panel(): vscode.WebviewPanel | undefined {
    // 1) If a webview tab is focused, resolve by matching the tab label to a panel title
    try {
      const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
      const activeLabel = activeTab && activeTab.label ? String(activeTab.label) : '';
      if (activeLabel) {
        for (const [, p] of webviewPanelMap.entries()) {
          try { if (p.title === activeLabel) return p; } catch { }
        }
      }
    } catch { }
    // 2) If an editor is active, find by its URI
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const p = webviewPanelMap.get(activeEditor.document.uri.toString());
      if (p) return p;
    }
    // 3) Fall back to the last known active panel
    if (activeP5Panel) return activeP5Panel || undefined;
    return undefined;
  }

  async function invokeStepRun(panel: vscode.WebviewPanel, editor: vscode.TextEditor) {
    try { sendToWebview(panel, { type: 'invokeStepRun' }); } catch { }
  }
  async function invokeSingleStep(panel: vscode.WebviewPanel, editor: vscode.TextEditor) {
    try { sendToWebview(panel, { type: 'invokeSingleStep' }); } catch { }
  }
  async function invokeReload(panel: vscode.WebviewPanel) {
    try { sendToWebview(panel, { type: 'invokeReload' }); } catch { }
  }
  async function toggleCapture(panel: vscode.WebviewPanel) {
    sendToWebview(panel, { type: 'toggleCaptureVisibility' });
  }

  // Register commands for editor/title buttons
  // Map a webview panel back to its originating document URI
  function getDocUriForPanel(panel: vscode.WebviewPanel | undefined): vscode.Uri | undefined {
    if (!panel) return undefined;
    for (const [uriStr, p] of webviewPanelMap.entries()) {
      if (p === panel) {
        try { return vscode.Uri.parse(uriStr); } catch { return undefined; }
      }
    }
    return undefined;
  }

  // Initialize VARIABLES service (wraps view + storage)
  variablesService = registerVariablesService(context, {
    getActiveP5Panel: () => getActiveP5Panel(),
    getDocUriForPanel: (p) => getDocUriForPanel(p),
  });
  const updateVariablesPanel = () => { try { variablesService.updateVariablesPanel(); } catch { } };

  // Initialize context service now that we can update the VARIABLES panel
  contextService = registerContextService(context, {
    getActiveP5Panel: () => getActiveP5Panel(),
    getDocUriForPanel: (p) => getDocUriForPanel(p),
    updateVariablesPanel: () => updateVariablesPanel(),
  });

  // Register command groups
  registerDebugCommands(context, {
    getActiveP5Panel: () => getActiveP5Panel(),
    getDocUriForPanel: (p) => getDocUriForPanel(p),
    invokeStepRun: (panel, editor) => invokeStepRun(panel, editor),
    invokeSingleStep: (panel, editor) => invokeSingleStep(panel, editor),
    contextService,
  });
  registerCaptureCommands(context, {
    getActiveP5Panel: () => getActiveP5Panel(),
    toggleCapture: (panel) => toggleCapture(panel),
  });
  registerUICommands(context, {
    LIVE_PANEL_TITLE_PREFIX,
    webviewPanelMap,
  });
  registerHelpCommands(context);
  registerBlocklyCommands(context);

  context.subscriptions.push(vscode.commands.registerCommand('P5Studio.reloadWebpanel', async () => {
    const panel = getActiveP5Panel();
    if (!panel) return;
    // Reset primed state on reload for the active panel
    try {
      const uri = getDocUriForPanel(panel);
      if (uri) {
        contextService.setDebugPrimed(uri.toString(), false);
        contextService.setContext('p5DebugPrimed', false);
      }
    } catch { }
    await invokeReload(panel);
  }));
  registerClearHighlightCommand(context);

  // Helper to update the p5WebviewTabFocused context key
  function updateP5WebviewTabContext() {
    try { contextService?.updateActiveContexts(); } catch { }
  }

  // --- Lightweight restore manager ---
  const restore = registerRestoreManager(context);

  // Workspace-aware helpers (avoid cross-project restore)
  function workspaceRoots(): string[] {
    try { return (vscode.workspace.workspaceFolders || []).map(f => f.uri.fsPath); } catch { return []; }
  }
  function isInWorkspace(fsPath: string): boolean {
    try {
      if (!fsPath) return false;
      const roots = workspaceRoots();
      if (!roots.length) return false;
      const norm = fsPath.replace(/\\/g, '/').toLowerCase();
      return roots.some(r => norm.startsWith(r.replace(/\\/g, '/').toLowerCase() + '/'));
    } catch { return false; }
  }

  // Register Blockly feature and obtain API hooks
  const blocklyApi: BlocklyApi = registerBlockly(context, {
    addToRestore: restore.addToRestore,
    removeFromRestore: restore.removeFromRestore,
    RESTORE_BLOCKLY_KEY,
    updateP5WebviewTabContext,
  });

  // Linting: delegated to src/lint
  const lintApi: LintApi = registerLinting(context, {
    getOrCreateOutputChannel,
    getPanelForDocUri: (docUri: string) => webviewPanelMap.get(docUri),
    getTime,
  });

  // Cleanup: clear any pre-existing lint diagnostics for documents without a LIVE P5 panel
  try {
    for (const doc of vscode.workspace.textDocuments || []) {
      const uriStr = doc.uri.toString();
      if (doc.uri.scheme === 'file' && !webviewPanelMap.has(uriStr)) {
        try { lintApi.clearDiagnosticsForDocument(doc.uri); } catch { }
      }
    }
  } catch { /* ignore */ }

  function lintActiveEditor() {
    const ed = vscode.window.activeTextEditor;
    if (ed) {
      // Only lint documents that have an associated LIVE P5 panel
      const docUri = ed.document.uri.toString();
      if (webviewPanelMap.has(docUri)) {
        lintApi.lintAll(ed.document);
      }
    }
  }

  // Helper to update context key for p5.js file detection
  function updateP5Context(editor?: vscode.TextEditor) {
    editor = editor || vscode.window.activeTextEditor;
    if (!editor) return vscode.commands.executeCommand('setContext', 'isP5js', false);
    const isJsOrTs = ['javascript', 'typescript'].includes(editor.document.languageId);
    vscode.commands.executeCommand('setContext', 'isP5js', isJsOrTs);
  }

  // Status bar button for P5 Reference
  const p5RefStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  p5RefStatusBar.command = 'extension.openP5Ref';
  p5RefStatusBar.text = '$(book) P5.js Reference'; // Status bar text
  p5RefStatusBar.tooltip = '$(book) Open P5.js Reference'; // Tooltip text
  p5RefStatusBar.color = '#ff0000';
  p5RefStatusBar.tooltip = '$(book) Open P5.js Reference';
  context.subscriptions.push(p5RefStatusBar);

  // Track all open panels to robustly close them on document close (even if untracked)
  const panelManager: LivePanelManagerApi = registerLivePanelManager(context, {
    webviewPanelMap,
    getOutputChannelForDoc,
    showAndTrackOutputChannel,
    disposeOutputForDoc,
  });

  // Helper to update context key for JS/TS file detection and show/hide status bar
  function updateJsOrTsContext(editor?: vscode.TextEditor) {
    editor = editor || vscode.window.activeTextEditor;
    const isJsOrTs = !!editor && ['javascript', 'typescript'].includes(editor.document.languageId);
    vscode.commands.executeCommand('setContext', 'isJsOrTs', isJsOrTs);
    // Show status bar only when in JS/TS AND the workspace is a P5 project (.p5 exists)
    if (isJsOrTs && hasP5Project) p5RefStatusBar.show(); else p5RefStatusBar.hide();
  }

  updateP5Context();
  updateJsOrTsContext();
  // Run initial semicolon lint on the active editor
  lintActiveEditor();

  // Detect whether the workspace has a .p5 marker and set context
  function updateP5ProjectContext() {
    try {
      let found = false;
      const folders = vscode.workspace.workspaceFolders || [];
      for (const f of folders) {
        const markerPath = path.join(f.uri.fsPath, '.p5');
        if (fs.existsSync(markerPath)) { found = true; break; }
      }
      hasP5Project = found;
      vscode.commands.executeCommand('setContext', 'hasP5Project', hasP5Project);
      // Re-evaluate status bar visibility
      updateJsOrTsContext();
    } catch { /* ignore */ }
  }
  updateP5ProjectContext();
  // Watch for .p5 creation/deletion and workspace folder changes
  try {
    const watcher = vscode.workspace.createFileSystemWatcher('**/.p5');
    context.subscriptions.push(watcher.onDidCreate(() => updateP5ProjectContext()));
    context.subscriptions.push(watcher.onDidDelete(() => updateP5ProjectContext()));
    context.subscriptions.push(watcher.onDidChange(() => updateP5ProjectContext()));
    context.subscriptions.push(watcher);
  } catch { /* ignore */ }
  context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(() => updateP5ProjectContext()));

  // Layout/Restore service wiring and startup restore
  layoutService = registerLayoutRestore(context, {
    restore: { migrate: restore.migrate, getRestoreList: restore.getRestoreList },
    RESTORE_LIVE_KEY,
    RESTORE_BLOCKLY_KEY,
    RESTORE_LIVE_ORDER_KEY,
    isInWorkspace: (p) => isInWorkspace(p),
    isSingleP5PanelEnabled: () => isSingleP5PanelEnabled(),
    openLiveForFsPath: async (fsPath: string) => {
      if (!fs.existsSync(fsPath)) return;
      const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
      await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: false, viewColumn: vscode.ViewColumn.One });
      await vscode.commands.executeCommand('extension.live-p5');
    },
    openBlocklyForFsPath: async (fsPath: string) => {
      if (!fs.existsSync(fsPath)) return;
      const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
      await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: false, viewColumn: vscode.ViewColumn.One });
      await vscode.commands.executeCommand('extension.open-blockly');
    },
  });
  // Kick off restore asynchronously
  (async () => { try { await layoutService.beginRestore(); } catch { } })();

  let _lastStepHighlightEditor: vscode.TextEditor | undefined;
  vscode.window.onDidChangeActiveTextEditor(editor => {
    // Clear highlight in the previously active editor (if any)
    if (_lastStepHighlightEditor && _lastStepHighlightEditor !== editor) {
      clearStepHighlight(_lastStepHighlightEditor);
    }
    updateP5Context(editor);
    updateJsOrTsContext(editor);
    if (!editor) return;
    const docUri = editor.document.uri.toString();
    if (!editor) return;
    const panel = webviewPanelMap.get(docUri);
    if (panel) {
      panel.reveal(panel.viewColumn, true);
      activeP5Panel = panel;
      vscode.commands.executeCommand('setContext', 'hasP5Webview', true);
    } else {
      vscode.commands.executeCommand('setContext', 'hasP5Webview', false);
    }
    if (editor && autoReload) autoReload.setupAutoReloadForDoc(editor);
    // Track the last editor for highlight clearing
    _lastStepHighlightEditor = editor;
    // Focus the output channel for the active sketch
    try {
      const ch = getOutputChannelForDoc(docUri);
      if (ch) showAndTrackOutputChannel(ch);
    } catch { }
    // Move editor to left column if needed (centralized in layout service)
    layoutService.ensureEditorInLeftColumn(editor).catch(() => undefined);
    lintActiveEditor();
  });

  vscode.workspace.onDidChangeTextDocument(e => {
    if (e.document === vscode.window.activeTextEditor?.document) {
      updateP5Context(vscode.window.activeTextEditor);
      // Stop highlighting as soon as code is changed
      clearStepHighlight(vscode.window.activeTextEditor);
    }

    // Lint on every text change in the script editor
    try {
      // Cheap early-out: if all strict levels are "ignore", skip linting entirely
      const strictKinds: Array<'Semicolon' | 'Undeclared' | 'NoVar' | 'LooseEquality'> = ['Semicolon', 'Undeclared', 'NoVar', 'LooseEquality'];
      const anyEnabled = strictKinds.some(k => lintApi.getStrictLevel(k) !== 'ignore');
      if (!anyEnabled) {
        return;
      }

      lintApi.lintAll(e.document);
    } catch { /* ignore lint errors */ }
  });
  // Sidecar file syncing moved into blockly module
  vscode.workspace.onDidSaveTextDocument(doc => {
    if (doc === vscode.window.activeTextEditor?.document) {
      updateP5Context(vscode.window.activeTextEditor);
    }
  });
  // Lint when a document is opened/closed
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => {
      try {
        const docUri = doc.uri.toString();
        if (webviewPanelMap.has(docUri)) {
          lintApi.lintAll(doc);
        }
      } catch { /* ignore lint errors */ }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument(async doc => {
      lintApi.clearDiagnosticsForDocument(doc.uri);
      // Blockly panels are managed by the blockly module
      // Also close the corresponding LIVE P5 panel for this document, if present
      try {
        const p5Panel = webviewPanelMap.get(doc.uri.toString());
        if (p5Panel) {
          p5Panel.dispose();
        }
      } catch { /* ignore */ }
      // Dispose per-doc output channel as well
      try { disposeOutputForDoc(doc.uri.toString()); } catch { }
      // Deterministic cleanup: close all P5/Blockly panels bound to this exact file path
      try { panelManager.disposePanelsForFilePath(doc.fileName); } catch { /* ignore */ }
    })
  );

  // Also watch tab closures: when the last tab of a script is closed (even if the
  // TextDocument hasn't emitted close yet due to other editors), dispose its panels.
  context.subscriptions.push(
    vscode.window.tabGroups.onDidChangeTabs(ev => {
      // Collect candidate file paths from closed tabs
      const candidates = new Set<string>();
      for (const t of ev.closed || []) {
        const fp = panelManager.fsPathFromTab(t);
        if (fp) candidates.add(fp);
      }
      if (!candidates.size) return;
      // Helper: check if any tab remains for a given fsPath
      const anyTabFor = (fsPathNorm: string) => {
        try {
          const groups: readonly vscode.TabGroup[] = (vscode.window.tabGroups as any).all || [vscode.window.tabGroups.activeTabGroup];
          for (const g of groups || []) {
            for (const tab of (g?.tabs || [])) {
              const fp2 = panelManager.fsPathFromTab(tab);
              if (fp2 && fp2 === fsPathNorm) return true;
            }
          }
        } catch { }
        return false;
      };
      for (const p of candidates) {
        if (!anyTabFor(p)) {
          // No more editor tabs for this file: dispose panels
          panelManager.disposePanelsForFilePath(p);
          // Also dispose the associated output channel for this file
          try { disposeOutputForDoc(vscode.Uri.file(p).toString()); } catch { }
        }
      }
    })
  );

  // Auto-reload API instance (initialized after updateDocumentPanel is declared)
  let autoReload: AutoReloadApi;

  // Flag to ignore logs after a syntax error
  let ignoreLogs = false;

  // Update the webview panel with new code, handle syntax errors, and send global variables
  async function updateDocumentPanel(document: vscode.TextDocument, forceLog = false) {
    const docUri = document.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (!panel) return;
    const fileName = path.basename(document.fileName);
    const outputChannel = getOrCreateOutputChannel(docUri, fileName);

    // Proactively clear any Blockly block highlight for this document before reloading
    try { blocklyApi.clearHighlight(docUri); } catch { }

    // Capture and clear the pending reason (typing/save/command)
    const reason = _pendingReloadReason;
    _pendingReloadReason = undefined;

    const prep = await prepareSketch({
      document,
      reason: reason as ReloadReason,
      lint: {
        hasSemicolonWarnings: d => lintApi.hasSemicolonWarnings(d),
        hasUndeclaredWarnings: d => lintApi.hasUndeclaredWarnings(d),
        hasVarWarnings: d => lintApi.hasVarWarnings(d),
        hasEqualityWarnings: d => lintApi.hasEqualityWarnings(d),
        getStrictLevel: k => lintApi.getStrictLevel(k),
      },
      allowInteractiveTopInputs: _allowInteractiveTopInputs,
    });

    let syntaxErrorMsg: string | null = null;

    if (prep.inputsOverlay && prep.inputsOverlay.length > 0) {
      await setHtmlAndPost(panel, {
        code: '',
        extensionPath: context.extensionPath,
        allowInteractiveTopInputs: _allowInteractiveTopInputs,
        initialCaptureVisible: getInitialCaptureVisible(panel),
        p5Version: (panel as any)._p5Version,
      }, [
        { delayMs: 150, message: { type: 'showTopInputs', items: prep.inputsOverlay } as ExtensionToWebviewMessage },
      ], sendToWebview);
      return;
    }

    if (prep.runtimeErrorMsg) {
      const friendly = prep.runtimeErrorMsg;
      await setHtmlAndPost(panel, {
        code: '',
        extensionPath: context.extensionPath,
        allowInteractiveTopInputs: _allowInteractiveTopInputs,
        initialCaptureVisible: getInitialCaptureVisible(panel),
        p5Version: (panel as any)._p5Version,
      }, [
        { delayMs: 150, message: { type: 'showError', message: friendly } as ExtensionToWebviewMessage },
      ], sendToWebview);
      if (require('./config/index').getLogWarningsToOutput()) {
        outputChannel.appendLine(friendly);
      }
      (panel as any)._lastRuntimeError = friendly;
      return;
    }

    if (prep.blockOnLint) {
      if (reason === 'typing') {
        if (forceLog) {
          try { lintApi.logAllWarningsForDocument(document); } catch { }
        }
        return;
      }
      await setHtmlAndPost(panel, {
        code: '',
        extensionPath: context.extensionPath,
        allowInteractiveTopInputs: _allowInteractiveTopInputs,
        initialCaptureVisible: getInitialCaptureVisible(panel),
        p5Version: (panel as any)._p5Version,
      }, [], sendToWebview);
      lintApi.logBlockingWarningsForDocument(document);
      return;
    }

    if (!prep.ok) {
      syntaxErrorMsg = prep.syntaxErrorMsg || null;
      await setHtmlAndPost(panel, {
        code: '',
        extensionPath: context.extensionPath,
        allowInteractiveTopInputs: _allowInteractiveTopInputs,
        initialCaptureVisible: getInitialCaptureVisible(panel),
        p5Version: (panel as any)._p5Version,
      }, [], sendToWebview);
    } else {
      const code = prep.codeToInject;
      _allowInteractiveTopInputs = false;
      try {
        panel.webview.html = await createHtml(code, panel, context.extensionPath, {
          allowInteractiveTopInputs: _allowInteractiveTopInputs,
          initialCaptureVisible: getInitialCaptureVisible(panel),
          p5Version: (panel as any)._p5Version,
        });
      } finally {
        _allowInteractiveTopInputs = true;
      }
      if (prep.globals) {
        setTimeout(() => {
          sendToWebview(panel, {
            type: 'setGlobalVars',
            variables: prep.globals!.variables.map(g => ({ name: g.name, type: g.type, value: undefined })),
            readOnly: prep.globals!.readOnly,
          });
        }, 200);
        setTimeout(() => {
          if (prep.globals && prep.globals.readOnly) {
            try { sendToWebview(panel, { type: 'requestGlobalsSnapshot' }); } catch { }
          }
        }, 600);
      }
    }

    if (syntaxErrorMsg) {
      ignoreLogs = true;
      // Fix [object Arguments] for overlay as well
      const overlayMsg = stripLeadingTimestamp(syntaxErrorMsg).replace(/\[object Arguments\]/gi, "no argument(s) ");
      setTimeout(() => {
        sendToWebview(panel, { type: 'syntaxError', message: overlayMsg });
      }, 150);
      if (require('./config/index').getLogWarningsToOutput()) {
        outputChannel.appendLine(syntaxErrorMsg);
      }
      // outputChannel.show(true); // Do not focus on every error
      (panel as any)._lastSyntaxError = syntaxErrorMsg;
      (panel as any)._lastRuntimeError = null;
    } else {
      ignoreLogs = false;
      (panel as any)._lastSyntaxError = null;
      (panel as any)._lastRuntimeError = null;
    }

    // If requested, log semicolon warnings when the panel reloads (typing/save debounce path)
    if (forceLog) {
      try { lintApi.logAllWarningsForDocument(document); } catch { }
    }
  }

  // Initialize auto-reload module now that updateDocumentPanel exists
  autoReload = registerAutoReload(context, {
    updateDocumentPanel: (doc, log) => updateDocumentPanel(doc, log),
    setPendingReason: (r) => { _pendingReloadReason = r; }
  });
  // Ensure context key is set on activation
  (async () => { try { await autoReload.updateConfig(); } catch { } })();

  // ----------------------------
  // LIVE P5 panel command
  // ----------------------------
  registerLiveCommands(context, {
    openLive: async () => {
      if (!hasP5Project) {
        vscode.window.showInformationMessage('This feature is available in P5 projects. Create a project (adds .p5) via "P5 Studio Setup new project".');
        return;
      }
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const docUri = editor.document.uri.toString();
      let panel = webviewPanelMap.get(docUri);
      let code = editor.document.getText();

      // --- NEW: SingleP5Panel logic ---
      if (isSingleP5PanelEnabled()) {
        // Close all other panels before opening a new one
        for (const [uri, p] of webviewPanelMap.entries()) {
          if (uri !== docUri) {
            p.dispose();
            // The panel.onDidDispose will remove from map
          }
        }
      }

      if (!panel) {
        // Check for syntax errors before setting HTML

        const prep = await prepareSketch({
          document: editor.document,
          reason: 'open',
          lint: {
            hasSemicolonWarnings: d => lintApi.hasSemicolonWarnings(d),
            hasUndeclaredWarnings: d => lintApi.hasUndeclaredWarnings(d),
            hasVarWarnings: d => lintApi.hasVarWarnings(d),
            hasEqualityWarnings: d => lintApi.hasEqualityWarnings(d),
            getStrictLevel: k => lintApi.getStrictLevel(k),
          },
          allowInteractiveTopInputs: _allowInteractiveTopInputs,
        });

        let syntaxErrorMsg: string | null = prep.syntaxErrorMsg || null;
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return;
        const { localResourceRoots, selectedVersion } = resolveLiveAssets(context, editor);
        // Ensure the originating editor has focus so the new group we create is
        // positioned relative to it.
        const originalColumn = typeof editor.viewColumn === 'number' ? (editor.viewColumn as number) : undefined;
        try {
          await vscode.window.showTextDocument(editor.document, editor.viewColumn || vscode.ViewColumn.One, false);
        } catch (e) { /* ignore */ }

        const targetColumn: vscode.ViewColumn = await layoutService.computeTargetColumnForLive();

        panel = panelManager.createPanel(editor, {
          title: livePanelTitleForFile(editor.document.fileName),
          column: targetColumn,
          localResourceRoots,
        });
        try { (panel as any)._p5Version = selectedVersion; } catch { }

        // Focus the output channel for the new sketch immediately
        const docUri = editor.document.uri.toString();
        const fileName = path.basename(editor.document.fileName);
        const outputChannel = getOrCreateOutputChannel(docUri, fileName);
        showAndTrackOutputChannel(outputChannel); // <--- replaced direct show
        // --- LOG ACTIVE p5.js VERSION + WARNINGS via resolver ---
        try { resolveLiveAssets(context, editor, { output: outputChannel, getTime }); } catch { }

        contextService.setCaptureVisible(docUri, false);
        try {
          await restore.addToRestore(RESTORE_LIVE_KEY, editor.document.fileName);
          await restore.moveToOrderEnd(editor.document.fileName);
        } catch { }
        activeP5Panel = panel;
        try {
          panel.onDidChangeViewState(() => {
            try {
              if (panel.active) {
                activeP5Panel = panel;
                // Keep VARIABLES panel in sync with the newly active webview tab
                updateVariablesPanel();
              }
            } catch { }
          });
        } catch { }
        vscode.commands.executeCommand('setContext', 'hasP5Webview', true);
        // Initialize primed state for this sketch
        contextService.setDebugPrimed(docUri, false);
        panel.onDidDispose(() => {
          contextService.clearForDoc(docUri);
          try { variablesService.clearForDoc(docUri); } catch { }
          try { disposeOutputForDoc(docUri); } catch { }
          if (activeP5Panel === panel) {
            vscode.commands.executeCommand('setContext', 'p5DebugPrimed', false);
            vscode.commands.executeCommand('setContext', 'p5CaptureVisible', false);
            // If the disposed panel was active, refresh VARIABLES panel to reflect no active sketch
            updateVariablesPanel();
          }
        });

        ; (require('./webview/router') as any).registerWebviewRouter(panel, async (msg: WebviewToExtensionMessage) => {
          if (msg.type === 'setGlobalVars') {
            handleSetGlobalVars({ panel, editor, variables: msg.variables }, {
              setVarsForDoc: (docUri, list) => variablesService.setVarsForDoc(docUri, list),
              updateVariablesPanel,
              isActivePanel: (p) => activeP5Panel === p,
            });
            return;
          } else if (msg.type === 'updateGlobalVar') {
            handleUpdateGlobalVar({ panel, editor, name: msg.name, value: msg.value }, {
              getVarsForDoc: (docUri) => variablesService.getVarsForDoc(docUri),
              setVarsForDoc: (docUri, list) => variablesService.setVarsForDoc(docUri, list),
              updateVariablesPanel,
              isActivePanel: (p) => activeP5Panel === p,
            });
            return;
          }
          // Focus the script tab if requested from the webview
          if (msg.type === 'focus-script-tab') {
            handleFocusScriptTab();
            return;
          }
          if (msg.type === 'captureVisibilityChanged') {
            handleCaptureVisibilityChanged({ panel, editor, visible: !!msg.visible }, {
              setCaptureVisible: (docUri, vis) => contextService.setCaptureVisible(docUri, vis),
              setContext: (k, v) => contextService.setContext(k, v),
              isActivePanel: (p) => activeP5Panel === p,
            });
            return;
          }
          const fileName = path.basename(editor.document.fileName);
          const docUri = editor.document.uri.toString();
          const outputChannel = getOrCreateOutputChannel(docUri, fileName);
          if (msg.type === 'log') {
            handleLog({ message: msg.message }, {
              canLog: () => !ignoreLogs,
              outputChannel,
              getTime,
            });
          } else if (msg.type === 'showError') {
            handleShowError({ panel, editor, message: msg.message }, {
              getTime,
              formatSyntaxErrorMsg,
              outputChannel,
            });
          } else if (msg.type === 'submitTopInputs') {
            await handleSubmitTopInputs({ panel, editor, values: msg.values }, {
              detectTopLevelInputs,
              preprocessTopLevelInputs,
              setCachedInputsForKey,
              wrapInSetupIfNeeded,
              extractGlobalVariables,
              extractGlobalVariablesWithConflicts,
              rewriteUserCodeWithWindowGlobals,
              createHtml: (code: string, p: vscode.WebviewPanel, extPath: string, opts?: any) => createHtml(code, p, extPath, { ...(opts || {}), p5Version: (p as any)._p5Version }),
              getInitialCaptureVisible: (p) => getInitialCaptureVisible(p),
              getExtensionPath: () => context.extensionPath,
              getHiddenGlobalsByDirective,
              hasOnlySetup,
              getAllowInteractiveTopInputs: () => _allowInteractiveTopInputs,
              setAllowInteractiveTopInputs: (v: boolean) => { _allowInteractiveTopInputs = v; },
            });
          } else if (msg.type === 'reload-button-clicked') {
            await handleReloadClicked({ panel, editor, preserveGlobals: !!msg.preserveGlobals }, {
              getTime,
              getOrCreateOutputChannel,
              clearStepHighlight,
              blocklyClearHighlight: (docUri: string) => { try { blocklyApi.clearHighlight(docUri); } catch { } },
              lintApi,
              formatSyntaxErrorMsg,
              stripLeadingTimestamp,
              createHtml: (code: string, p: vscode.WebviewPanel, extPath: string, opts?: any) => createHtml(code, p, extPath, { ...(opts || {}), p5Version: (p as any)._p5Version }),
              getInitialCaptureVisible: (p) => getInitialCaptureVisible(p),
              getExtensionPath: () => context.extensionPath,
              validateSource,
              hasNonTopInputUsage,
              detectTopLevelInputs,
              hasCachedInputsForKey,
              preprocessTopLevelInputs,
              getAllowInteractiveTopInputs: () => _allowInteractiveTopInputs,
              setAllowInteractiveTopInputs: (v: boolean) => { _allowInteractiveTopInputs = v; },
              wrapInSetupIfNeeded,
              extractGlobalVariablesWithConflicts,
              extractGlobalVariables,
              rewriteUserCodeWithWindowGlobals,
              getHiddenGlobalsByDirective,
              hasOnlySetup,
            });
          }
          // --- STEP RUN HANDLER (merged with single-step instrumentation + auto-advance) ---
          else if (msg.type === 'step-run-clicked') {
            await handleStepRunClicked({ panel, editor }, {
              getTime,
              getOrCreateOutputChannel,
              lintApi,
              hasNonTopInputUsage,
              detectTopLevelInputs,
              hasCachedInputsForKey,
              preprocessTopLevelInputs,
              wrapInSetupIfNeeded,
              rewriteFrameCountRefs,
              instrumentSetupForSingleStep,
              extractGlobalVariablesWithConflicts,
              extractGlobalVariables,
              rewriteUserCodeWithWindowGlobals,
              getHiddenGlobalsByDirective,
              hasOnlySetup,
              createHtml: (code: string, p: vscode.WebviewPanel, extPath: string, opts?: any) => createHtml(code, p, extPath, { ...(opts || {}), p5Version: (p as any)._p5Version }),
              getInitialCaptureVisible: (p) => getInitialCaptureVisible(p),
              getExtensionPath: () => context.extensionPath,
              getAllowInteractiveTopInputs: () => _allowInteractiveTopInputs,
              setAllowInteractiveTopInputs: (v: boolean) => { _allowInteractiveTopInputs = v; },
            });
          }
          // --- SINGLE STEP HANDLER ---
          else if (msg.type === 'single-step-clicked') {
            await handleSingleStepClicked({ panel, editor }, {
              getTime,
              getOrCreateOutputChannel,
              lintApi,
              hasNonTopInputUsage,
              detectTopLevelInputs,
              hasCachedInputsForKey,
              preprocessTopLevelInputs,
              wrapInSetupIfNeeded,
              rewriteFrameCountRefs,
              instrumentSetupForSingleStep,
              extractGlobalVariablesWithConflicts,
              extractGlobalVariables,
              rewriteUserCodeWithWindowGlobals,
              getHiddenGlobalsByDirective,
              hasOnlySetup,
              createHtml: (code: string, p: vscode.WebviewPanel, extPath: string, opts?: any) => createHtml(code, p, extPath, { ...(opts || {}), p5Version: (p as any)._p5Version }),
              getInitialCaptureVisible: (p) => getInitialCaptureVisible(p),
              getExtensionPath: () => context.extensionPath,
            });
          }
          // --- HIGHLIGHT CURRENT LINE HANDLER ---
          else if (msg.type === 'highlightLine') {
            await handleHighlightLine({ panel, editor, line: msg.line }, {
              getTime,
              getOrCreateOutputChannel,
              applyStepHighlight,
              hasBreakpointOnLine: (docUriStr, line1) => hasBreakpointOnLine(docUriStr, line1),
              blocklyHighlightForLine: (docUri: string, line: number) => { try { blocklyApi.highlightForLine(docUri, line); } catch { } },
            });
          }
          // --- CLEAR HIGHLIGHT HANDLER ---
          else if (msg.type === 'clearHighlight') {
            await handleClearHighlight({ panel, editor }, {
              clearStepHighlight,
              blocklyClearHighlight: (docUri: string) => { try { blocklyApi.clearHighlight(docUri); } catch { } },
              getTime,
              getOrCreateOutputChannel,
              setDebugPrimedFalse: (docUri: string) => { try { contextService.setDebugPrimed(docUri, false); } catch { } },
              setPrimedContextFalse: () => contextService.setContext('p5DebugPrimed', false),
            });
          }
          // --- OSC SEND HANDLER ---
          else if (msg.type === 'oscSend') {
            handleOscSend({ address: msg.address, args: msg.args }, { oscService });
            return;
          }
          // --- SAVE CANVAS IMAGE HANDLER ---
          else if (msg.type === 'saveCanvasImage') {
            await handleSaveCanvasImage({ dataUrl: msg.dataUrl, fileName: msg.fileName }, {
              getDefaultFolder: () => vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
            });
          }
          // --- COPY CANVAS IMAGE HANDLER (fallback when webview clipboard is unavailable) ---
          else if (msg.type === 'copyCanvasImage') {
            handleCopyCanvasImage(msg.dataUrl);
          }
          // --- SHOW INFO MESSAGE FROM WEBVIEW ---
          else if (msg.type === 'showInfo' && typeof msg.message === 'string') {
            handleShowInfo(msg);
          }
        });

        panel.onDidDispose(async () => {
          webviewPanelMap.delete(docUri);
          if (activeP5Panel === panel) activeP5Panel = null;
          vscode.commands.executeCommand('setContext', 'hasP5Webview', false);
          try { autoReload.disposeForDoc(docUri); } catch { }
          try {
            await restore.removeFromRestore(RESTORE_LIVE_KEY, editor.document.fileName);
            await restore.removeFromOrder(editor.document.fileName);
          } catch { }
          // Clear any step highlight when panel is closed
          try {
            const edToClear = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === docUri);
            if (edToClear) clearStepHighlight(edToClear);
          } catch { }
          // Also clear any Blockly block highlight for this document when the LIVE P5 panel closes
          try { blocklyApi.clearHighlight(docUri); } catch { }
          (panel as any)._steppingActive = false;
          // Stop auto-step timer if running
          if ((panel as any)._autoStepTimer) {
            try { clearInterval((panel as any)._autoStepTimer); } catch { }
            (panel as any)._autoStepTimer = null;
          }
          (panel as any)._autoStepMode = false;
          // Dispose output channel when panel is closed
          try { (require('./logging/output') as any).disposeOutputForDoc?.(docUri); } catch { }
        });

        panel.onDidChangeViewState(async e => {
          if (e.webviewPanel.active) {
            try {
              const ch = (require('./logging/output') as any).getOutputChannelForDoc?.(docUri);
              if (ch) showAndTrackOutputChannel(ch); // <--- in panel.onDidChangeViewState
            } catch { }
            // Update restore order to reflect recent activation
            try { await restore.moveToOrderEnd(editor.document.fileName); } catch { }
          }
        });

        if (prep.inputsOverlay && prep.inputsOverlay.length > 0) {
          const key = editor.document.fileName;
          let itemsToShow = prep.inputsOverlay;
          if (hasCachedInputsForKey(key, prep.inputsOverlay)) {
            const cached = getCachedInputsForKey(key);
            if (cached) {
              itemsToShow = prep.inputsOverlay.map((it, i) => ({
                varName: it.varName,
                label: it.label,
                defaultValue: typeof cached.values[i] !== 'undefined' ? cached.values[i] : it.defaultValue,
              }));
            }
          }
          await setHtmlAndPost(panel, {
            code: '',
            extensionPath: context.extensionPath,
            allowInteractiveTopInputs: _allowInteractiveTopInputs,
            initialCaptureVisible: getInitialCaptureVisible(panel),
            p5Version: (panel as any)._p5Version,
          }, [
            { delayMs: 150, message: { type: 'showTopInputs', items: itemsToShow } as ExtensionToWebviewMessage },
          ], sendToWebview);
          return;
        }

        if (prep.blockOnLint) {
          await setHtmlAndPost(panel, {
            code: '',
            extensionPath: context.extensionPath,
            allowInteractiveTopInputs: _allowInteractiveTopInputs,
            initialCaptureVisible: getInitialCaptureVisible(panel),
            p5Version: (panel as any)._p5Version,
          }, [], sendToWebview);
          lintApi.logBlockingWarningsForDocument(editor.document);
        } else {
          await setHtmlAndPost(panel, {
            code: prep.ok ? prep.codeToInject : '',
            extensionPath: context.extensionPath,
            allowInteractiveTopInputs: _allowInteractiveTopInputs,
            initialCaptureVisible: getInitialCaptureVisible(panel),
            p5Version: (panel as any)._p5Version,
          }, [], sendToWebview);
          lintApi.logSemicolonWarningsForDocument(editor.document);
          lintApi.logUndeclaredWarningsForDocument(editor.document);
          lintApi.logVarWarningsForDocument(editor.document);
        }

        if (prep.globals && prep.ok && !prep.blockOnLint) {
          const varsPayload = prep.globals.variables.map(g => ({ name: g.name, type: g.type, value: undefined }));
          setTimeout(() => {
            sendToWebview(panel, { type: 'setGlobalVars', variables: varsPayload, readOnly: prep.globals!.readOnly });
          }, 200);
        }

        if (syntaxErrorMsg) {
          setTimeout(() => {
            sendToWebview(panel, { type: 'syntaxError', message: stripLeadingTimestamp(syntaxErrorMsg) });
          }, 150);
          const outputChannel = getOrCreateOutputChannel(docUri, path.basename(editor.document.fileName));
          if (require('./config/index').getLogWarningsToOutput()) {
            outputChannel.appendLine(syntaxErrorMsg);
          }
        }
      } else {
        panel.reveal(panel.viewColumn, true);
        setTimeout(() => {
          let codeToSend = editor.document.getText();
          // --- Check for syntax/reference errors BEFORE wrapping in setup ---
          try {
            new Function(codeToSend);
            codeToSend = wrapInSetupIfNeeded(codeToSend);
            // Optionally block on semicolon warnings
            const warnSemi_RO = lintApi.hasSemicolonWarnings(editor.document);
            const warnUnd_RO = lintApi.hasUndeclaredWarnings(editor.document);
            const warnVar_RO = lintApi.hasVarWarnings(editor.document);
            const shouldBlockRO = (lintApi.getStrictLevel('Semicolon') === 'block' && warnSemi_RO.has)
              || (lintApi.getStrictLevel('Undeclared') === 'block' && warnUnd_RO.has)
              || (lintApi.getStrictLevel('NoVar') === 'block' && warnVar_RO.has);
            if (shouldBlockRO) {
              (async () => {
                panel.webview.html = await createHtml('', panel, context.extensionPath, { p5Version: (panel as any)._p5Version });
                lintApi.logBlockingWarningsForDocument(editor.document);
              })();
            } else {
              sendToWebview(panel, { type: 'reload', code: codeToSend });
              // Log warnings on explicit open -> reload path
              lintApi.logSemicolonWarningsForDocument(editor.document);
              lintApi.logUndeclaredWarningsForDocument(editor.document);
              lintApi.logVarWarningsForDocument(editor.document);
            }
          } catch (err: any) {
            // If error, send empty code and show error
            sendToWebview(panel, { type: 'reload', code: '' });
            const syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${path.basename(editor.document.fileName)}] ${err.message}`;
            sendToWebview(panel, { type: 'syntaxError', message: stripLeadingTimestamp(formatSyntaxErrorMsg(syntaxErrorMsg)) });
            const outputChannel = getOrCreateOutputChannel(docUri, path.basename(editor.document.fileName));
            if (require('./config/index').getLogWarningsToOutput()) {
              outputChannel.appendLine(formatSyntaxErrorMsg(syntaxErrorMsg));
            }
          }
        }, 100);
      }

      updateP5Context(editor);
      if (editor && autoReload) autoReload.setupAutoReloadForDoc(editor);
    }
  });

  // Command to reload the current P5 sketch
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.reload-p5-sketch', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        // Try to reload the currently active webview panel's sketch if no editor is focused
        if (activeP5Panel) {
          // Find the document URI for the active panel
          const docUri = [...webviewPanelMap.entries()].find(([_, panel]) => panel === activeP5Panel)?.[0];
          if (docUri) {
            const doc = vscode.workspace.textDocuments.find(d => d.uri.toString() === docUri);
            if (doc) {
              // Log all warnings on explicit reload command
              lintApi.logAllWarningsForDocument(doc);
              _pendingReloadReason = 'command';
              autoReload.debounceUpdate(doc, false);
            }
          }
        }
        return;
      }
      // Log all warnings on explicit reload command
      lintApi.logAllWarningsForDocument(editor.document);
      _pendingReloadReason = 'command';
      autoReload.debounceUpdate(editor.document, false); // use false to match typing
    })
  );

  // Command to disable reload while typing
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.toggleReloadWhileTypingOn', async () => {
      await cfg.setReloadWhileTyping(false);
      await autoReload.updateConfig();
      autoReload.refreshAll();
      vscode.window.showInformationMessage('Reload on typing is now disabled.');
    })
  );
  // Command to enable reload while typing
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.toggleReloadWhileTypingOff', async () => {
      await cfg.setReloadWhileTyping(true);
      await autoReload.updateConfig();
      autoReload.refreshAll();
      vscode.window.showInformationMessage('Reload on typing is now enabled.');
    })
  );
  // Command to open selected text in the P5 reference
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openSelectedText', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.selection && !editor.selection.isEmpty) {
        const search = encodeURIComponent(editor.document.getText(editor.selection));
        try {
          const version = cfg.getP5jsVersion();
          const base = (version === '2.1') ? 'https://beta.p5js.org/reference/' : 'https://p5js.org/reference/';
          vscode.env.openExternal(vscode.Uri.parse(`${base}p5/${search}`));
        } catch {
          vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/p5/${search}`));
        }
      }
    })
  );

  // Command to create jsconfig.json and setup a new P5 project
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.create-jsconfig', async () => {
      try {
        let workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        let selectedFolderUri: vscode.Uri | undefined;
        if (!workspaceFolder) {
          // Prompt user to select a folder if none is open
          const folderUris = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select folder for new P5 project',
          });
          if (!folderUris || folderUris.length === 0) return;
          selectedFolderUri = folderUris[0];
          workspaceFolder = { uri: selectedFolderUri, name: '', index: 0 };
        }
        vscode.window.showInformationMessage('Setting up new P5 project...');
        // creates a jsconfig that tells vscode where to find the types file
        const now = new Date();
        // Resolve p5types global.d.ts & p5helper.d.ts in versioned assets if present
        const selectedP5VersionCJ = cfg.getP5jsVersion();
        let p5typesCandidatesCJ: string[];
        if (selectedP5VersionCJ === '1.11') {
          p5typesCandidatesCJ = [path.join(context.extensionPath, 'assets', '1.11', 'p5types', 'global.d.ts')];
        } else {
          p5typesCandidatesCJ = [path.join(context.extensionPath, 'assets', selectedP5VersionCJ, 'p5types', 'global.d.ts')];
        }
        let p5helperCandidatesCJ: string[];
        if (selectedP5VersionCJ === '1.11') {
          p5helperCandidatesCJ = [path.join(context.extensionPath, 'assets', '1.11', 'p5types', 'p5helper.d.ts')];
        } else {
          p5helperCandidatesCJ = [path.join(context.extensionPath, 'assets', selectedP5VersionCJ, 'p5types', 'p5helper.d.ts')];
        }
        const resolvedGlobalCJ = p5typesCandidatesCJ.find(p => { try { return fs.existsSync(p); } catch { return false; } });
        const resolvedHelperCJ = p5helperCandidatesCJ.find(p => { try { return fs.existsSync(p); } catch { return false; } });
        const jsconfig = {
          createdAt: toLocalISOString(now),
          include: ((): (string)[] => {
            const base = [
              "*.js",
              "**/*.js",
              "*.ts",
              "**/.ts",
              "common/*.js",
              "import/*.js",
            ];
            if (resolvedGlobalCJ) base.push(resolvedGlobalCJ);
            if (resolvedHelperCJ) base.push(resolvedHelperCJ);
            return base;
          })()
        };
        // If 2.1 selected and types missing, log a warning (no popup)
        if (selectedP5VersionCJ !== '1.11' && (!resolvedGlobalCJ || !resolvedHelperCJ)) {
          console.warn('[P5Studio] No p5types found for version', selectedP5VersionCJ, '- jsconfig will omit type definitions.');
        }
        fs.mkdirSync(workspaceFolder.uri.fsPath + "/common", { recursive: true });
        fs.mkdirSync(workspaceFolder.uri.fsPath + "/import", { recursive: true });
        fs.mkdirSync(workspaceFolder.uri.fsPath + "/media", { recursive: true });
        fs.mkdirSync(workspaceFolder.uri.fsPath + "/sketches", { recursive: true });

        // Create empty utils.js if not exists
        const utilsPath = path.join(workspaceFolder.uri.fsPath, "common", "utils.js");
        if (!fs.existsSync(utilsPath)) {
          fs.writeFileSync(utilsPath, "");
        }

        // Create sketch1.js only if it doesn't exist and remember whether we created it
        const sketch1Path = path.join(workspaceFolder.uri.fsPath + "/sketches", "sketch1.js");
        const sketch1Existed = fs.existsSync(sketch1Path);

        const sketchString = `//Start coding with P5 here!
          //Have a look at the P5 Reference: https://p5js.org/reference/ 
          //Click the P5 button at the top to run your sketch! ⤴

          noStroke();
          fill("red");
          circle(50, 50, 80);
          fill("white");
          textFont("Arial", 36);
          textAlign(CENTER, CENTER);
          text("P5", 50, 52);`;
        if (!sketch1Existed) {
          fs.writeFileSync(sketch1Path, sketchString);
        }

        const jsconfigPath = path.join(workspaceFolder.uri.fsPath, "jsconfig.json");
        writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));

        // Also create/overwrite a .p5 marker file at the project root
        const p5MarkerPath = path.join(workspaceFolder.uri.fsPath, ".p5");
        try {
          // Read extension version from the extension's package.json
          const pkgPath = path.join(context.extensionPath, "package.json");
          let version = "unknown";
          try {
            const pkgRaw = fs.readFileSync(pkgPath, "utf8");
            const pkgJson = JSON.parse(pkgRaw);
            if (pkgJson && typeof pkgJson.version === "string") {
              version = pkgJson.version;
            }
          } catch {
            // ignore read/parse errors and keep version as 'unknown'
          }
          const now = new Date();
          const marker = {
            version,
            createdAt: toLocalISOString(now),
          };
          fs.writeFileSync(p5MarkerPath, JSON.stringify(marker, null, 2) + "\n");
          // Try to hide the .p5 file on Windows
          hideFileIfSupported(p5MarkerPath);
        } catch (err) {
          console.warn("Failed to write .p5 marker file:", err);
        }
        vscode.window.showInformationMessage('P5 project setup complete!');

        // If a folder was selected via dialog, open it as the workspace
        if (selectedFolderUri) {
          await vscode.commands.executeCommand('vscode.openFolder', selectedFolderUri, false);
        } else {
          // Open sketch1.js only if it was created just now and we remain in the same workspace
          if (!sketch1Existed) {
            const doc = await vscode.workspace.openTextDocument(sketch1Path);
            await vscode.window.showTextDocument(doc, { preview: false });
          }
        }
      } catch (e) {
        console.error(e);
      }
    })
  );

  // Simple debouncers for config-driven broadcasts
  let _varPanelDebounceTimer: NodeJS.Timeout | undefined;
  let _showFpsDebounceTimer: NodeJS.Timeout | undefined;
  let _overlayFontDebounceTimer: NodeJS.Timeout | undefined;

  // Centralized configuration change handler
  vscode.workspace.onDidChangeConfiguration(e => {
    try {
      // OSC config changes
      try { oscService?.handleConfigChange(e); } catch { }

      // Debounce delay for auto-reload
      if (e.affectsConfiguration('P5Studio.debounceDelay')) {
        try { autoReload.clearDebounceCache(); } catch { }
      }

      // Variable panel debounce delay (debounced broadcast)
      if (e.affectsConfiguration('P5Studio.variablePanelDebounceDelay')) {
        const newDelay = cfg.getVariablePanelDebounceDelay();
        if (_varPanelDebounceTimer) clearTimeout(_varPanelDebounceTimer);
        _varPanelDebounceTimer = setTimeout(() => {
          for (const [, panel] of webviewPanelMap.entries()) {
            try { sendToWebview(panel, { type: 'updateVarDebounceDelay', value: newDelay }); } catch { }
          }
        }, 150);
      }

      // Sync reloadWhileTyping/reloadOnSave when changed via settings UI
      if (e.affectsConfiguration('P5Studio.reloadWhileTyping') || e.affectsConfiguration('P5Studio.reloadOnSave')) {
        (async () => { try { await autoReload.updateConfig(); } catch { } })();
        autoReload.refreshAll();
      }

      // Immediately apply showFPS changes in all open panels (debounced)
      if (e.affectsConfiguration('P5Studio.showFPS')) {
        const show = cfg.getShowFPS();
        if (_showFpsDebounceTimer) clearTimeout(_showFpsDebounceTimer);
        _showFpsDebounceTimer = setTimeout(() => {
          for (const [, panel] of webviewPanelMap.entries()) {
            try { sendToWebview(panel, { type: 'toggleFPS', show }); } catch { }
          }
        }, 100);
      }

      // Update overlay font size if the editor font size changes (debounced)
      if (e.affectsConfiguration('editor.fontSize')) {
        const newSize = vscode.workspace.getConfiguration('editor').get<number>('fontSize', 14);
        if (_overlayFontDebounceTimer) clearTimeout(_overlayFontDebounceTimer);
        _overlayFontDebounceTimer = setTimeout(() => {
          for (const [, panel] of webviewPanelMap.entries()) {
            try { sendToWebview(panel, { type: 'updateOverlayFontSize', value: newSize }); } catch { }
          }
        }, 100);
      }
    } catch {
      // ignore config handler errors
    }
  });

  // Project setup utilities (refresh jsconfig, setup prompt)
  runOnActivate(context);

  // Helper: compute Blockly sidecar path for a given file path
  function getBlocklySidecarPath(filePath: string): string | null {
    try {
      const dir = path.dirname(filePath);
      const base = path.basename(filePath);
      const sidecarDir = path.join(dir, '.blockly');
      const sidecarName = base + '.blockly';
      return path.join(sidecarDir, sidecarName);
    } catch {
      return null;
    }
  }

  // --- NEW: Scroll LIVE P5 output to end command ---
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.scrollOutputToEnd', async () => {
      const lastActiveOutputChannel = getLastActiveOutputChannel();
      if (!lastActiveOutputChannel) {
        vscode.window.showInformationMessage('No LIVE P5 output channel active.');
        return;
      }
      showAndTrackOutputChannel(lastActiveOutputChannel);
      setTimeout(() => vscode.commands.executeCommand('cursorBottom'), 30);
    })
  );

  // --- Duplicate file command for explorer context menu ---
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.duplicateFile', async (fileUri: vscode.Uri) => {
      try {
        // If not invoked from context menu, prompt for file
        if (!fileUri) {
          const picked = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select file to duplicate',
          });
          if (!picked || picked.length === 0) return;
          fileUri = picked[0];
        }
        const oldPath = fileUri.fsPath;
        const dir = path.dirname(oldPath);
        const base = path.basename(oldPath);
        const ext = path.extname(base);
        const nameNoExt = base.slice(0, base.length - ext.length);

        // If filename ends with a number, increment it
        let match = nameNoExt.match(/^(.*?)(\d+)$/);
        let newBase: string;
        if (match) {
          const prefix = match[1];
          const num = parseInt(match[2], 10);
          let nextNum = num + 1;
          let candidate = `${prefix}${nextNum}${ext}`;
          // Find next available number
          while (fs.existsSync(path.join(dir, candidate))) {
            nextNum++;
            candidate = `${prefix}${nextNum}${ext}`;
          }
          newBase = candidate;
        } else {
          // Fallback: filename, filename-2, filename-3, etc.
          let candidate = `${nameNoExt}${ext}`;
          let counter = 1;
          while (fs.existsSync(path.join(dir, candidate))) {
            candidate = `${nameNoExt}-${counter}${ext}`;
            counter++;
          }
          newBase = candidate;
        }

        const newName = await vscode.window.showInputBox({
          prompt: 'Duplicate file as...',
          value: newBase,
          validateInput: (val) => {
            if (!val || val.trim() === '') return 'File name required';
            if (fs.existsSync(path.join(dir, val))) return 'File already exists';
            return null;
          }
        });
        if (!newName) return;
        const newPath = path.join(dir, newName);
        await vscode.workspace.fs.copy(fileUri, vscode.Uri.file(newPath));
        // If a sidecar exists for the source file, copy it for the duplicate
        try {
          const srcSide = getBlocklySidecarPath(fileUri.fsPath);
          if (srcSide && fs.existsSync(srcSide)) {
            const destSide = getBlocklySidecarPath(newPath);
            if (destSide) {
              fs.mkdirSync(path.dirname(destSide), { recursive: true });
              fs.copyFileSync(srcSide, destSide);
            }
          }
        } catch (e) { /* ignore */ }
        // Optionally open the new file
        const doc = await vscode.workspace.openTextDocument(newPath);
        await vscode.window.showTextDocument(doc, { preview: false });
      } catch (e: any) {
        vscode.window.showErrorMessage('Failed to duplicate file: ' + (e.message || e));
      }
    })
  );

  // Best-effort: when files are created via external copy/paste operations, try to
  // detect if they are duplicates of an existing file and copy its sidecar.
  // We do this by computing a content hash for the created file and comparing it
  // with candidate workspace files (limited to common script extensions) to find
  // an exact match. If found, copy the matching file's sidecar.
  context.subscriptions.push(vscode.workspace.onDidCreateFiles(async ev => {
    try {
      for (const created of ev.files) {
        const createdFs = created.fsPath;
        let createdBuffer: Buffer | null = null;
        try { createdBuffer = fs.readFileSync(createdFs); } catch { createdBuffer = null; }
        if (!createdBuffer) continue;
        const hash = crypto.createHash('sha1').update(createdBuffer).digest('hex');
        // Search workspace for candidate script files (js/ts/jsx/tsx)
        const patterns = ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'];
        let candidates: vscode.Uri[] = [];
        for (const p of patterns) {
          try {
            const found = await vscode.workspace.findFiles(p, '**/.blockly/**', 200);
            candidates = candidates.concat(found);
          } catch { }
        }
        // Compare hashes with candidates
        for (const cand of candidates) {
          try {
            const candFs = cand.fsPath;
            if (candFs === createdFs) continue;
            const candBuffer = fs.readFileSync(candFs);
            const candHash = crypto.createHash('sha1').update(candBuffer).digest('hex');
            if (candHash === hash) {
              const srcSide = getBlocklySidecarPath(candFs);
              const destSide = getBlocklySidecarPath(createdFs);
              if (srcSide && fs.existsSync(srcSide) && destSide) {
                try {
                  fs.mkdirSync(path.dirname(destSide), { recursive: true });
                  fs.copyFileSync(srcSide, destSide);
                } catch { }
              }
              break; // done for this created file
            }
          } catch { }
        }
      }
    } catch (e) { }
  }));
}

// Helper to check SingleP5Panel setting
function isSingleP5PanelEnabled() {
  return cfg.getSingleP5Panel();
}

