
import * as path from 'path';
import * as vscode from 'vscode';
import * as recast from 'recast';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { exec } from 'child_process';
import { writeFileSync } from 'fs';
// Modularized helpers and constants
import { debounce, getTime, getDebounceDelay, listFilesRecursively } from './utils/helpers';
import { RESERVED_GLOBALS, P5_NUMERIC_IDENTIFIERS, P5_EVENT_HANDLERS } from './constants';
import { extractGlobalVariablesWithConflicts, extractGlobalVariables, rewriteUserCodeWithWindowGlobals } from './processing/codeRewriter';
import { detectTopLevelInputs, hasNonTopInputUsage, preprocessTopLevelInputs, hasCachedInputsForKey, getCachedInputsForKey, setCachedInputsForKey, TopInputItem } from './processing/topInputs';
import { createHtml } from './webview/createHtml';
// New modularized imports
import { ensureStepHighlightDecoration, clearStepHighlight, applyStepHighlight } from './editors/stepHighlight';
import { instrumentSetupWithDelays, instrumentSetupForSingleStep } from './processing/instrumentation';
import { initOsc, OscServiceApi } from './osc/oscService';
import { registerVariablesView } from './views/variablesView';
import { registerBlockly, BlocklyApi } from './blockly/blocklyPanel';
import { registerLinting, LintApi } from './lint';
import { registerRestoreManager, RESTORE_BLOCKLY_KEY, RESTORE_LIVE_KEY, RESTORE_LIVE_ORDER_KEY } from './restore/restoreManager';

const webviewPanelMap = new Map<string, vscode.WebviewPanel>();
let activeP5Panel: vscode.WebviewPanel | null = null;

const autoReloadListenersMap = new Map<string, { changeListener?: vscode.Disposable; saveListener?: vscode.Disposable }>();

const outputChannelMap = new Map<string, vscode.OutputChannel>();
let lastActiveOutputChannel: vscode.OutputChannel | null = null; // <--- NEW

// Track whether a given sketch's debug has been "primed" (after first single-step)
const debugPrimedMap = new Map<string, boolean>();
// Track capture visibility per sketch (for dynamic icon)
const captureVisibleMap = new Map<string, boolean>();

// Project marker: whether the workspace has a .p5 file at its root
let hasP5Project: boolean = false;

// Internal: mark when we're restoring panels on activation to tweak layout behavior
let _restoringPanels = false;
// During restore, remember the intended top-row right-hand target column for LIVE P5 panels
let _restoreP5TargetColumn: vscode.ViewColumn | undefined;

// Step highlight helpers moved to ./editors/stepHighlight

function showAndTrackOutputChannel(ch: vscode.OutputChannel) {
  ch.show(true);
  lastActiveOutputChannel = ch;
}

// Get or create an output channel for a document, used for per-sketch logging and errors
function getOrCreateOutputChannel(docUri: string, fileName: string) {
  let channel = outputChannelMap.get(docUri);
  if (!channel) {
    channel = vscode.window.createOutputChannel('LIVE P5: ' + fileName);
    outputChannelMap.set(docUri, channel);
  }
  lastActiveOutputChannel = channel; // <--- track whenever retrieved
  return channel;
}

// (helpers moved to ./utils/helpers)

// (constants moved to ./constants)

// (moved to ./processing/codeRewriter)

// (moved to ./processing/codeRewriter)

// (event handlers moved to ./constants)

// (moved to ./processing/codeRewriter)

let _allowInteractiveTopInputs = true;
// Track reason for last reload/update to alter input overlay behavior
let _pendingReloadReason: 'typing' | 'save' | 'command' | undefined;

// Helper to compute initial capture visibility for a webview panel from saved state
function getInitialCaptureVisible(panel: vscode.WebviewPanel): boolean {
  try {
    for (const [key, val] of webviewPanelMap) {
      if (val === panel) {
        return !!captureVisibleMap.get(key);
      }
    }
  } catch { }
  return false;
}
// createHtml moved to './webview/createHtml'

// Instrument setup() to insert `await __sleep(delayMs)` between top-level statements/blocks.
// Returns original code if setup() cannot be found.
// Instrumentation helpers moved to ./processing/instrumentation

// --- OSC moved to ./osc/oscService ---


// Command to clear highlight, for use with keybinding
function registerClearHighlightCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('p5studio.clearHighlightEsc', async () => {
    clearStepHighlight(vscode.window.activeTextEditor);
    // Do NOT reload or re-inject code when clearing highlight with ESC
  }));
}
// Register ESC key to clear highlight
function registerEscKeybinding(context: vscode.ExtensionContext) {
  // This function is obsolete. Keybindings must be declared in package.json only.
}
// ----------------------------
// Activate
// ----------------------------
export function activate(context: vscode.ExtensionContext) {
  // --- VARIABLES PANEL RELAY LOGIC ---
  // These must be defined at the extension activation scope
  // so they can be accessed from message handlers and the provider
  // Track variables per sketch (doc URI) so switching tabs updates the VARIABLES panel accordingly
  const latestGlobalVarsByDoc = new Map<string, { name: string, value: any, type: string }[]>();
  // Initialize OSC service with broadcast to all open P5 panels
  let oscService: OscServiceApi | null = null;
  const broadcastOscToPanels = (address: string, args: any[]) => {
    for (const [, panel] of webviewPanelMap.entries()) {
      try {
        panel.webview.postMessage({ type: 'oscReceive', address, args });
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
    try { panel.webview.postMessage({ type: 'invokeStepRun' }); } catch { }
  }
  async function invokeSingleStep(panel: vscode.WebviewPanel, editor: vscode.TextEditor) {
    try { panel.webview.postMessage({ type: 'invokeSingleStep' }); } catch { }
  }
  async function invokeReload(panel: vscode.WebviewPanel) {
    try { panel.webview.postMessage({ type: 'invokeReload' }); } catch { }
  }
  async function toggleCapture(panel: vscode.WebviewPanel) {
    panel.webview.postMessage({ type: 'toggleCaptureVisibility' });
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

  // Register VARIABLES view provider (moved to views/variablesView)
  const { updateVariablesPanel } = registerVariablesView(context, {
    getActiveP5Panel: () => getActiveP5Panel(),
    getDocUriForPanel: (p) => getDocUriForPanel(p),
    getVarsForDoc: (docUri: string) => latestGlobalVarsByDoc.get(docUri) || [],
    setVarsForDoc: (docUri: string, list) => { latestGlobalVarsByDoc.set(docUri, list); }
  });

  context.subscriptions.push(vscode.commands.registerCommand('P5Studio.stepRun', async () => {
    let editor = vscode.window.activeTextEditor;
    const panel = getActiveP5Panel();
    if (!panel) return;
    if (!editor) {
      const uri = getDocUriForPanel(panel);
      if (uri) {
        try { editor = await vscode.window.showTextDocument(uri, { preview: true, preserveFocus: true }); } catch { /* ignore */ }
      }
    }
    if (!editor) return;
    await invokeStepRun(panel, editor);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('P5Studio.singleStep', async () => {
    let editor = vscode.window.activeTextEditor;
    const panel = getActiveP5Panel();
    if (!panel) return;
    if (!editor) {
      const uri = getDocUriForPanel(panel);
      if (uri) {
        try { editor = await vscode.window.showTextDocument(uri, { preview: true, preserveFocus: true }); } catch { /* ignore */ }
      }
    }
    if (!editor) return;
    await invokeSingleStep(panel, editor);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('P5Studio.captureToggle', async () => {
    const panel = getActiveP5Panel();
    if (!panel) return;
    await toggleCapture(panel);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('P5Studio.captureToggleOn', async () => {
    const panel = getActiveP5Panel();
    if (!panel) return;
    await toggleCapture(panel);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('P5Studio.reloadWebpanel', async () => {
    const panel = getActiveP5Panel();
    if (!panel) return;
    // Reset primed state on reload for the active panel
    try {
      const uri = getDocUriForPanel(panel);
      if (uri) {
        debugPrimedMap.set(uri.toString(), false);
        vscode.commands.executeCommand('setContext', 'p5DebugPrimed', false);
        // Preserve capture visibility state on reload; webview will apply its current state
        // and report it back when needed. Do not override p5CaptureVisible here.
      }
    } catch { }
    await invokeReload(panel);
  }));
  // Prime-once command: performs a single step, then reveals the step buttons for this panel
  context.subscriptions.push(vscode.commands.registerCommand('P5Studio.debugPrime', async () => {
    const panel = getActiveP5Panel();
    if (!panel) return;
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      const uri = getDocUriForPanel(panel);
      if (uri) {
        try { editor = await vscode.window.showTextDocument(uri, { preview: true, preserveFocus: true }); } catch { /* ignore */ }
      }
    }
    if (!editor) return;
    await invokeSingleStep(panel, editor);
    try {
      const docUri = editor.document.uri.toString();
      debugPrimedMap.set(docUri, true);
      vscode.commands.executeCommand('setContext', 'p5DebugPrimed', true);
    } catch { }
  }));
  registerClearHighlightCommand(context);

  // Helper to update the p5WebviewTabFocused context key
  function updateP5WebviewTabContext() {
    const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
    let isP5Webview = false;
    if (activeTab) {
      // Log label and input for debugging
      try {
        console.log('[P5Studio] activeTab.label:', activeTab.label);
        console.log('[P5Studio] activeTab.input:', JSON.stringify(activeTab.input));
      } catch (e) {
        console.log('[P5Studio] Error logging activeTab.input:', e);
      }
      if (activeTab.label && activeTab.input) {
        const input = activeTab.input as { viewType?: string };
        const vt = (input && typeof input.viewType === 'string') ? String(input.viewType) : '';
        // Be resilient to VS Code internals: sometimes the viewType may be wrapped (e.g., 'mainThreadWebview-...')
        const looksLikeLiveP5 = vt === 'extension.live-p5' || vt.endsWith('extension.live-p5') || vt.endsWith('.live-p5');
        if (looksLikeLiveP5 && String(activeTab.label).startsWith('LIVE:')) {
          isP5Webview = true;
        }
      }
    }
    vscode.commands.executeCommand('setContext', 'p5WebviewTabFocused', isP5Webview);
    // Also update the primed visibility context for the focused panel
    if (isP5Webview) {
      const panel = getActiveP5Panel();
      if (panel) {
        const uri = getDocUriForPanel(panel);
        const primed = uri ? !!debugPrimedMap.get(uri.toString()) : false;
        vscode.commands.executeCommand('setContext', 'p5DebugPrimed', primed);
        const cap = uri ? !!captureVisibleMap.get(uri.toString()) : false;
        vscode.commands.executeCommand('setContext', 'p5CaptureVisible', cap);
        // Update VARIABLES panel content to match the newly focused webpanel
        updateVariablesPanel();
      } else {
        vscode.commands.executeCommand('setContext', 'p5DebugPrimed', false);
        vscode.commands.executeCommand('setContext', 'p5CaptureVisible', false);
        updateVariablesPanel();
      }
    } else {
      vscode.commands.executeCommand('setContext', 'p5DebugPrimed', false);
      vscode.commands.executeCommand('setContext', 'p5CaptureVisible', false);
      updateVariablesPanel();
    }
  }

  // Listen for tab group changes
  context.subscriptions.push(
    vscode.window.tabGroups.onDidChangeTabs(() => {
      updateP5WebviewTabContext();
    })
  );
  // Also listen for active tab group changes (captures focus changes between webviews)
  context.subscriptions.push(
    vscode.window.tabGroups.onDidChangeTabGroups(() => {
      updateP5WebviewTabContext();
    })
  );
  // Listen for active editor changes (for when webview is focused)
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      updateP5WebviewTabContext();
    })
  );
  // Also update on activation
  updateP5WebviewTabContext();
  // Register the debug toggle button command for the tab group
  // Register two commands for debug toggle (on/off)
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.toggleDebugButtonsOn', async () => {
      const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
      if (activeTab && activeTab.label && activeTab.label.startsWith('LIVE:')) {
        for (const [, panel] of webviewPanelMap.entries()) {
          if (panel.title === activeTab.label) {
            const config = vscode.workspace.getConfiguration('P5Studio');
            await config.update('ShowDebugButton', true, vscode.ConfigurationTarget.Global);
            panel.webview.postMessage({ type: 'toggleDebugButtons', show: true });
            break;
          }
        }
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.toggleDebugButtonsOff', async () => {
      const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
      if (activeTab && activeTab.label && activeTab.label.startsWith('LIVE:')) {
        for (const [, panel] of webviewPanelMap.entries()) {
          if (panel.title === activeTab.label) {
            const config = vscode.workspace.getConfiguration('P5Studio');
            await config.update('ShowDebugButton', false, vscode.ConfigurationTarget.Global);
            panel.webview.postMessage({ type: 'toggleDebugButtons', show: false });
            break;
          }
        }
      }
    })
  );
  // Note: we proactively close any auto-restored LIVE/Blockly tabs on activation below
  // so we can fully control restore order and tracking in our custom flow.

  // --- Lightweight restore: reopen relevant webviews on activation without serialization ---
  // We remember which documents had a LIVE P5 webview or a Blockly webview open
  // and simply re-run the corresponding open command for those files on startup.
  // Restore keys moved to src/restore/restoreManager
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
  // Restore helpers moved to src/restore/restoreManager

  // One-time restore migration handled later in restore IIFE

  // Register Blockly feature and obtain API hooks
  const blocklyApi: BlocklyApi = registerBlockly(context, {
    addToRestore: restore.addToRestore,
    removeFromRestore: restore.removeFromRestore,
    RESTORE_BLOCKLY_KEY,
    updateP5WebviewTabContext,
  });
  // Variables view provider registered via registerVariablesView
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

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openP5Ref', () => {
      try {
        const version = vscode.workspace.getConfiguration('P5Studio').get<string>('P5jsVersion', '1.11') || '1.11';
        const base = (version === '2.1') ? 'https://beta.p5js.org/reference/' : 'https://p5js.org/reference/';
        vscode.env.openExternal(vscode.Uri.parse(base));
      } catch {
        vscode.env.openExternal(vscode.Uri.parse('https://p5js.org/reference/'));
      }
    })
  );

  // Convenience: open the JSON that defines the Blockly toolbox (version-aware)
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.open-blockly-json', async () => {
      try {
        const selectedP5Version = vscode.workspace.getConfiguration('P5Studio').get<string>('P5jsVersion', '1.11') || '1.11';
        // Prefer assets/<version>/blockly_categories.json; fallback to assets/1.11; finally attempt legacy path if present
        const versioned = path.join(context.extensionPath, 'assets', selectedP5Version, 'blockly_categories.json');
        const fallbackV1 = path.join(context.extensionPath, 'assets', '1.11', 'blockly_categories.json');
        const legacy = path.join(context.extensionPath, 'blockly', 'blockly_categories.json');
        const chosen = fs.existsSync(versioned) ? versioned : (fs.existsSync(fallbackV1) ? fallbackV1 : legacy);
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(chosen));
        await vscode.window.showTextDocument(doc, { preview: false });
      } catch (e) {
        vscode.window.showErrorMessage('Could not open blockly_categories.json');
      }
    })
  );

  // Track all open panels to robustly close them on document close (even if untracked)
  const allP5Panels = new Set<vscode.WebviewPanel>();
  const p5PanelsByPath = new Map<string, Set<vscode.WebviewPanel>>();

  // Normalize filesystem paths for use as map keys (fix Windows drive-letter/case issues)
  function normalizeFsPath(p: string | undefined | null): string {
    try {
      if (!p) return '';
      let n = path.normalize(p);
      if (process.platform === 'win32') n = n.toLowerCase();
      return n;
    } catch {
      return String(p || '');
    }
  }

  // Dispose all panels bound to a normalized fsPath (map + fallback scan)
  function disposePanelsForPath(fsPathNormalized: string) {
    try {
      const p5Set = p5PanelsByPath.get(fsPathNormalized);
      if (p5Set) { for (const p of Array.from(p5Set)) { try { p.dispose(); } catch { } } }
      // Fallback: scan all tracked panels and dispose any tagged with this path
      for (const p of Array.from(allP5Panels)) {
        try { const tag = normalizeFsPath((p as any)._sketchFilePath || ''); if (tag && tag === fsPathNormalized) { p.dispose(); } } catch { }
      }
      try { blocklyApi.disposePanelsForFilePath(fsPathNormalized); } catch { }
    } catch { }
  }

  // Extract a file fsPath from a Tab (only for text tabs). Returns normalized path or ''
  function fsPathFromTab(tab: vscode.Tab): string {
    try {
      const input: any = (tab as any).input;
      // TabInputText has .uri
      if (input && input.uri && input.uri.scheme === 'file') {
        return normalizeFsPath(input.uri.fsPath);
      }
      // Ignore diffs and others for now
    } catch { }
    return '';
  }

  function addPanelForPath(map: Map<string, Set<vscode.WebviewPanel>>, fsPath: string, panel: vscode.WebviewPanel) {
    const key = normalizeFsPath(fsPath);
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)!.add(panel);
  }
  function removePanelForPath(map: Map<string, Set<vscode.WebviewPanel>>, fsPath: string, panel: vscode.WebviewPanel) {
    const key = normalizeFsPath(fsPath);
    if (!map.has(key)) return;
    const set = map.get(key)!;
    set.delete(panel);
    if (set.size === 0) map.delete(key);
  }

  // Check if a VS Code editor breakpoint exists on a given 1-based line for the provided document URI string
  function hasBreakpointOnLine(docUriStr: string, line1Based: number): boolean {
    try {
      const bps = vscode.debug.breakpoints || [];
      for (const bp of bps) {
        // Only consider enabled SourceBreakpoints on this document
        if (bp.enabled && bp instanceof vscode.SourceBreakpoint) {
          const loc = bp.location;
          if (loc && loc.uri && loc.uri.toString() === docUriStr) {
            // Breakpoint ranges are 0-based; convert incoming to 0-based
            const bpLine0 = loc.range.start.line;
            if (bpLine0 === (line1Based - 1)) return true;
          }
        }
      }
    } catch { }
    return false;
  }



  // Rewrite references to global p5 frameCount so stepping can use a custom counter.
  // Replaces bare `frameCount` and `window.frameCount` with `window.__liveP5FrameCounter` in user code.
  function rewriteFrameCountRefs(code: string): string {
    try {
      const acorn = require('acorn');
      const ast = recast.parse(code, {
        parser: {
          parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' })
        }
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
            // Skip keys, member properties, function params, and variable declaration identifiers
            if (isPropertyKey(path) || isMemberUncomputedProperty(path) || isFunctionParam(path) || isVarDeclaratorId(path)) {
              return false;
            }
            // Replace bare identifier with window.__liveP5FrameCounter
            const replacement = b.memberExpression(b.identifier('window'), b.identifier('__liveP5FrameCounter'));
            path.replace(replacement);
            return false;
          }
          this.traverse(path);
        },
        visitMemberExpression(path) {
          const me: any = path.value;
          if (
            me &&
            me.object && me.object.type === 'Identifier' && me.object.name === 'window' &&
            me.property && !me.computed && me.property.type === 'Identifier' && me.property.name === 'frameCount'
          ) {
            // Replace window.frameCount -> window.__liveP5FrameCounter
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

  // Blockly command and panel moved to ./blockly/blocklyPanel via registerBlockly


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
    context.subscriptions.push(
      watcher.onDidCreate(() => updateP5ProjectContext()),
      watcher.onDidDelete(() => updateP5ProjectContext()),
      watcher.onDidChange(() => updateP5ProjectContext()),
      watcher
    );
  } catch { /* ignore */ }
  context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(() => updateP5ProjectContext()));

  // Attempt to restore previously open webviews (without using webview serialization)
  (async () => {
    try {
      // Ensure restore migration has run before reading lists
      try { await restore.migrate(); } catch { }
      // Pre-sweep: close any auto-restored P5/Blockly tabs so we fully control restore and tracking
      try {
        const groups: readonly vscode.TabGroup[] = (vscode.window.tabGroups as any).all || [vscode.window.tabGroups.activeTabGroup];
        const toClose: vscode.Tab[] = [] as any;
        for (const g of groups || []) {
          for (const t of (g?.tabs || [])) {
            try {
              const input: any = (t as any).input;
              const vt = input && typeof input.viewType === 'string' ? String(input.viewType) : '';
              if (vt === 'extension.live-p5' || vt === 'blocklyPanel') {
                toClose.push(t as any);
              }
            } catch { }
          }
        }
        if (toClose.length) {
          try { await (vscode.window.tabGroups as any).close(toClose, true); } catch { /* ignore */ }
        }
      } catch { /* ignore */ }
      _restoringPanels = true;
      // Restore LIVE P5 panels
      const liveDocs = restore.getRestoreList(RESTORE_LIVE_KEY)
        .filter(p => typeof p === 'string' && p)
        .filter(p => fs.existsSync(p) && isInWorkspace(p));
      const uniqueLive = Array.from(new Set(liveDocs));
      if (uniqueLive.length) {
        // Reorder by saved order (preserve any unknowns at the end in original order)
        const savedOrder = restore.getRestoreList(RESTORE_LIVE_ORDER_KEY).filter(p => fs.existsSync(p) && isInWorkspace(p));
        const orderIndex = new Map<string, number>();
        savedOrder.forEach((p, i) => orderIndex.set(p, i));
        uniqueLive.sort((a, b) => {
          const ia = orderIndex.has(a) ? (orderIndex.get(a) as number) : Number.MAX_SAFE_INTEGER;
          const ib = orderIndex.has(b) ? (orderIndex.get(b) as number) : Number.MAX_SAFE_INTEGER;
          if (ia !== ib) return ia - ib;
          return 0;
        });
        // Prepare a stable top-row right-hand group anchor for P5 restore
        await (async function prepareP5RestoreTargetGroup() {
          try {
            // Start from the top-left group
            await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
            // Try to move right once; if there's no group, create one and focus it
            const before = vscode.window.tabGroups.activeTabGroup;
            await vscode.commands.executeCommand('workbench.action.focusRightGroup');
            let after = vscode.window.tabGroups.activeTabGroup;
            // If we couldn't move right (no change), create a right group in the top row
            if (!after || (before && after.viewColumn === before.viewColumn)) {
              try { await vscode.commands.executeCommand('workbench.action.newGroupRight'); }
              catch {
                try { await vscode.commands.executeCommand('workbench.action.splitEditorRight'); } catch { }
              }
              await vscode.commands.executeCommand('workbench.action.focusRightGroup');
              await new Promise(r => setTimeout(r, 100));
              after = vscode.window.tabGroups.activeTabGroup;
            }
            if (after && typeof after.viewColumn === 'number') {
              _restoreP5TargetColumn = after.viewColumn as vscode.ViewColumn;
            }
          } catch {
            _restoreP5TargetColumn = vscode.ViewColumn.Beside;
          }
        })();
        const single = isSingleP5PanelEnabled();
        const targets = single ? [uniqueLive[uniqueLive.length - 1]] : uniqueLive;
        for (const fsPath of targets) {
          try {
            if (!fs.existsSync(fsPath)) continue;
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
            await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: false, viewColumn: vscode.ViewColumn.One });
            await vscode.commands.executeCommand('extension.live-p5');
            // Small delay between openings to reduce focus thrash
            await new Promise(r => setTimeout(r, 150));
          } catch { /* ignore per-doc errors */ }
        }
      }

      // Restore Blockly panels
      const blkDocs = restore.getRestoreList(RESTORE_BLOCKLY_KEY)
        .filter(p => typeof p === 'string' && p)
        .filter(p => fs.existsSync(p) && isInWorkspace(p));
      const uniqueBlk = Array.from(new Set(blkDocs));
      for (const fsPath of uniqueBlk) {
        try {
          if (!fs.existsSync(fsPath)) continue;
          const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
          await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: false, viewColumn: vscode.ViewColumn.One });
          await vscode.commands.executeCommand('extension.open-blockly');
          await new Promise(r => setTimeout(r, 150));
        } catch { /* ignore per-doc errors */ }
      }
    } catch { /* ignore restore errors */ }
    finally {
      _restoringPanels = false;
    }
  })();

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
    if (editor) updateAutoReloadListeners(editor);
    // Track the last editor for highlight clearing
    _lastStepHighlightEditor = editor;
    // Focus the output channel for the active sketch
    const channel = outputChannelMap.get(docUri);
    if (channel) showAndTrackOutputChannel(channel);
    // ...existing code for moving editor to left column and linting...
    if (
      editor.viewColumn &&
      editor.viewColumn !== vscode.ViewColumn.One &&
      editor.document.uri.scheme === 'file' &&
      vscode.window.activeTextEditor &&
      vscode.window.activeTextEditor.document.uri.toString() === editor.document.uri.toString()
    ) {
      const alreadyOpenInLeft = vscode.window.visibleTextEditors.some(
        e => e.document.uri.toString() === editor.document.uri.toString() && e.viewColumn === vscode.ViewColumn.One
      );
      if (!alreadyOpenInLeft) {
        vscode.window.showTextDocument(editor.document, vscode.ViewColumn.One, false).then(() => {
          const closePromises: Thenable<any>[] = [];
          vscode.window.visibleTextEditors.forEach(e => {
            if (
              e.document.uri.toString() === editor.document.uri.toString() &&
              e.viewColumn !== vscode.ViewColumn.One
            ) {
              closePromises.push(
                vscode.window.showTextDocument(e.document, e.viewColumn, false).then(() => {
                  return vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                })
              );
            }
          });

          Promise.all(closePromises).then(() => {
            vscode.window.showTextDocument(editor.document, vscode.ViewColumn.One, false);
          });
        });
      }
    }
    lintActiveEditor();
  });

  vscode.workspace.onDidChangeTextDocument(e => {
    if (e.document === vscode.window.activeTextEditor?.document) {
      updateP5Context(vscode.window.activeTextEditor);
      // Stop highlighting as soon as code is changed
      clearStepHighlight(vscode.window.activeTextEditor);
    }
    // Lint on text change only for documents with an open LIVE P5 panel
    try {
      const docUri = e.document.uri.toString();
      if (webviewPanelMap.has(docUri)) {
        lintApi.lintAll(e.document);
      }
    } catch { /* ignore lint errors */ }
    // Blockly workspace forwarding handled within the blockly module
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
      // Deterministic cleanup: close all P5/Blockly panels bound to this exact file path
      try { disposePanelsForPath(normalizeFsPath(doc.fileName)); } catch { /* ignore */ }
    })
  );

  // Also watch tab closures: when the last tab of a script is closed (even if the
  // TextDocument hasn't emitted close yet due to other editors), dispose its panels.
  context.subscriptions.push(
    vscode.window.tabGroups.onDidChangeTabs(ev => {
      // Collect candidate file paths from closed tabs
      const candidates = new Set<string>();
      for (const t of ev.closed || []) {
        const fp = fsPathFromTab(t);
        if (fp) candidates.add(fp);
      }
      if (!candidates.size) return;
      // Helper: check if any tab remains for a given fsPath
      const anyTabFor = (fsPathNorm: string) => {
        try {
          const groups: readonly vscode.TabGroup[] = (vscode.window.tabGroups as any).all || [vscode.window.tabGroups.activeTabGroup];
          for (const g of groups || []) {
            for (const tab of (g?.tabs || [])) {
              const fp2 = fsPathFromTab(tab);
              if (fp2 && fp2 === fsPathNorm) return true;
            }
          }
        } catch { }
        return false;
      };
      for (const p of candidates) {
        if (!anyTabFor(p)) {
          // No more editor tabs for this file: dispose panels
          disposePanelsForPath(p);
        }
      }
    })
  );

  const debounceMap = new Map<string, Function>();
  // Debounce document updates to avoid excessive reloads
  function debounceDocumentUpdate(document: vscode.TextDocument, forceLog = false) {
    const docUri = document.uri.toString();
    if (!debounceMap.has(docUri)) debounceMap.set(docUri, debounce((doc, log) => updateDocumentPanel(doc, log), getDebounceDelay()));
    debounceMap.get(docUri)!(document, forceLog);
  }

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

    let code = document.getText();
    // If inputPrompt() is used outside top-of-sketch, block and show friendly error
    try {
      if (hasNonTopInputUsage(code)) {
        panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
        const friendly = 'inputPrompt() can only be used at the very top of the sketch to initialize a variable, e.g.: let a = inputPrompt(); ';
        setTimeout(() => { panel.webview.postMessage({ type: 'showError', message: friendly }); }, 150);
        const time = getTime();
        outputChannel.appendLine(`${time} [‼️RUNTIME ERROR in ${fileName}] ${friendly}`);
        (panel as any)._lastRuntimeError = `${time} [‼️RUNTIME ERROR in ${fileName}] ${friendly}`;
        return;
      }
    } catch { }
    // --- Preprocess top-level inputs before any wrapping or syntax checks on auto updates ---
    try {
      const key = document.fileName;
      const inputs = detectTopLevelInputs(code);
      if (inputs.length > 0) {
        if (reason === 'save' || reason === 'command') {
          // Always show overlay on save/command; prefill with cache if available
          let itemsToShow = inputs;
          if (hasCachedInputsForKey(key, inputs)) {
            const cached = getCachedInputsForKey(key);
            if (cached) {
              itemsToShow = inputs.map((it, i) => ({
                varName: it.varName,
                label: it.label,
                defaultValue: typeof cached.values[i] !== 'undefined' ? cached.values[i] : it.defaultValue
              }));
            }
          }
          panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
          setTimeout(() => { panel.webview.postMessage({ type: 'showTopInputs', items: itemsToShow }); }, 150);
          return;
        } else if (hasCachedInputsForKey(key, inputs)) {
          // typing: use cache silently
          _allowInteractiveTopInputs = false;
          try {
            code = await preprocessTopLevelInputs(code, { key, interactive: false });
          } finally {
            _allowInteractiveTopInputs = true;
          }
        } else {
          // No cached answers on typing auto-update: block and show overlay below
        }
      }
    } catch { }
    let syntaxErrorMsg: string | null = null;
    let hadSyntaxError = false;
    try {
      // --- Check for reserved global conflicts before syntax check ---
      const { globals, conflicts } = extractGlobalVariablesWithConflicts(code);
      if (conflicts.length > 0) {
        syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${fileName}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
        syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
        panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
        hadSyntaxError = true;
        throw new Error(syntaxErrorMsg);
      }

      // --- Check for syntax/reference errors BEFORE wrapping in setup ---
      new Function(code); // syntax/reference check

      // Only wrap/massage top-level statements if no errors
      code = wrapInSetupIfNeeded(code);
      // Block sketch when configured and warnings exist; otherwise run as usual
      const cfgUD = vscode.workspace.getConfiguration('P5Studio');
      const warnSemi_UD = lintApi.hasSemicolonWarnings(document);
      const warnUnd_UD = lintApi.hasUndeclaredWarnings(document);
      const warnVar_UD = lintApi.hasVarWarnings(document);
      const warnEq_UD = lintApi.hasEqualityWarnings(document);
      const shouldBlockUD = (lintApi.getStrictLevel('Semicolon') === 'block' && warnSemi_UD.has)
        || (lintApi.getStrictLevel('Undeclared') === 'block' && warnUnd_UD.has)
        || (lintApi.getStrictLevel('NoVar') === 'block' && warnVar_UD.has)
        || (lintApi.getStrictLevel('LooseEquality') === 'block' && warnEq_UD.has);
      if (shouldBlockUD) {
        // Suppress overlay during live typing; only show on explicit reload/save/command
        if (reason === 'typing') {
          // Still log warnings to the Output channel if requested
          if (forceLog) {
            try { lintApi.logSemicolonWarningsForDocument(document); } catch { }
            try { lintApi.logUndeclaredWarningsForDocument(document); } catch { }
            try { lintApi.logVarWarningsForDocument(document); } catch { }
            try { lintApi.logEqualityWarningsForDocument(document); } catch { }
          }
          return;
        } else {
          panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
          lintApi.logBlockingWarningsForDocument(document);
          return;
        }
      } else {
        // Before reloading HTML, if inputs exist but are unresolved, block and ask user to Reload
        const docKey = (panel && (panel as any)._sketchFilePath) ? String((panel as any)._sketchFilePath) : document.fileName;
        const unresolved = detectTopLevelInputs(document.getText());
        if (unresolved.length > 0 && !hasCachedInputsForKey(docKey, unresolved)) {
          panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
          setTimeout(() => { panel.webview.postMessage({ type: 'showTopInputs', items: unresolved }); }, 150);
          return;
        }
        // Always reload HTML for every code update to reset JS environment
        const key = (panel && (panel as any)._sketchFilePath) ? String((panel as any)._sketchFilePath) : '';
        const inputs = detectTopLevelInputs(code);
        if (inputs.length > 0 && !hasCachedInputsForKey(key, inputs)) {
          // Do not run sketch with unresolved inputs on auto updates. Show input UI and return.
          panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
          setTimeout(() => {
            panel.webview.postMessage({ type: 'showTopInputs', items: inputs });
          }, 150);
          return;
        }
        _allowInteractiveTopInputs = false; // suppress prompts, use cache
        try {
          panel.webview.html = await createHtml(code, panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
        } finally {
          _allowInteractiveTopInputs = true;
        }
        // After HTML is set, send global variables
        const { globals: filteredGlobals } = extractGlobalVariablesWithConflicts(code);
        // --- PATCH: Use .type instead of typeof .value ---
        let filtered = filteredGlobals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
        // Apply @hide directive filtering based on original document text
        const hiddenSet = getHiddenGlobalsByDirective(document.getText());
        if (hiddenSet.size > 0) {
          filtered = filtered.filter(g => !hiddenSet.has(g.name));
        }
        setTimeout(() => {
          // compute readOnly based on the original document text (before we may wrap)
          const readOnly = hasOnlySetup(document.getText());
          panel.webview.postMessage({ type: 'setGlobalVars', variables: filtered, readOnly });
        }, 200);
        // For setup-only sketches, request a snapshot after setup finishes to ensure final values are reflected
        setTimeout(() => {
          const onlySetup = hasOnlySetup(document.getText());
          if (onlySetup) {
            try { panel.webview.postMessage({ type: 'requestGlobalsSnapshot' }); } catch { }
          }
        }, 600);
      }
    } catch (err: any) {
      if (!syntaxErrorMsg) {
        syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${path.basename(document.fileName)}] ${err.message}`;
        syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
      }
      panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
      hadSyntaxError = true;
    }

    // Always show syntax errors in overlay
    if (syntaxErrorMsg) {
      ignoreLogs = true;
      // Fix [object Arguments] for overlay as well
      const overlayMsg = stripLeadingTimestamp(syntaxErrorMsg).replace(/\[object Arguments\]/gi, "no argument(s) ");
      setTimeout(() => {
        panel.webview.postMessage({ type: 'syntaxError', message: overlayMsg });
      }, 150);
      outputChannel.appendLine(syntaxErrorMsg);
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
      try { lintApi.logSemicolonWarningsForDocument(document); } catch { }
      try { lintApi.logUndeclaredWarningsForDocument(document); } catch { }
      try { lintApi.logVarWarningsForDocument(document); } catch { }
      try { lintApi.logEqualityWarningsForDocument(document); } catch { }
    }
  }

  // Track reloadWhileTyping and reloadOnSave settings
  let reloadWhileTyping = vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadWhileTyping', true);
  let reloadOnSave = vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadOnSave', true);

  // Update reloadWhileTyping/reloadOnSave variables and context key

  async function updateReloadWhileTypingVarsAndContext() {
    reloadWhileTyping = vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadWhileTyping', true);
    reloadOnSave = vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadOnSave', true);
    await vscode.commands.executeCommand('setContext', 'liveP5ReloadWhileTypingEnabled', reloadWhileTyping);
  }

  // Re-apply auto-reload listeners for all open editors/panels
  function refreshAutoReloadListenersForAllOpenEditors() {
    try {
      const editors = vscode.window.visibleTextEditors || [];
      const seen = new Set<string>();
      for (const ed of editors) {
        if (!ed || !ed.document) continue;
        const uri = ed.document.uri.toString();
        seen.add(uri);
        updateAutoReloadListeners(ed);
      }
      // Dispose listeners for any document that no longer has a visible editor
      for (const [docUri, listeners] of autoReloadListenersMap.entries()) {
        if (!seen.has(docUri)) {
          try { listeners.changeListener?.dispose(); } catch { }
          try { listeners.saveListener?.dispose(); } catch { }
          autoReloadListenersMap.delete(docUri);
        }
      }
    } catch { /* ignore */ }
  }

  // --- Ensure context key is set on activation ---
  updateReloadWhileTypingVarsAndContext();

  // Set up listeners for reload-on-typing and reload-on-save per document
  function updateAutoReloadListeners(editor: vscode.TextEditor) {
    const docUri = editor.document.uri.toString();
    const existing = autoReloadListenersMap.get(docUri);
    existing?.changeListener?.dispose();
    existing?.saveListener?.dispose();

    let changeListener: vscode.Disposable | undefined;
    let saveListener: vscode.Disposable | undefined;


    if (reloadWhileTyping) {
      changeListener = vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document.uri.toString() === docUri) {
          _pendingReloadReason = 'typing';
          debounceDocumentUpdate(e.document, true);
        }
      });
    }
    if (reloadOnSave) {
      saveListener = vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.uri.toString() === docUri) {
          _pendingReloadReason = 'save';
          debounceDocumentUpdate(doc, true);
        }
      });
    }
    autoReloadListenersMap.set(docUri, { changeListener, saveListener });
  }

  // ----------------------------
  // LIVE P5 panel command
  // ----------------------------
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.live-p5', async () => {
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

        let syntaxErrorMsg: string | null = null;
        let codeToInject = code;
        let _inputsNeeded: TopInputItem[] = [];
        // --- Determine top-level inputs BEFORE syntax check/wrapping ---
        try {
          const inputs = detectTopLevelInputs(codeToInject);
          if (inputs.length > 0) {
            _inputsNeeded = inputs;
            codeToInject = '';
          }
        } catch { }
        try {
          // Friendly error for inputPrompt() used outside top-of-sketch
          if (hasNonTopInputUsage(codeToInject)) {
            syntaxErrorMsg = `${getTime()} [‼️RUNTIME ERROR in ${path.basename(editor.document.fileName)}] inputPrompt() must be used at the very top of the sketch to initialize a variable e.g.: let a = inputPrompt());`;
            codeToInject = '';
            throw new Error('inputPrompt must initialize a top-level variable');
          }
          // --- Check for reserved global conflicts before syntax check ---
          const { globals, conflicts } = extractGlobalVariablesWithConflicts(codeToInject);
          if (conflicts.length > 0) {
            syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${path.basename(editor.document.fileName)}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
            syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
            codeToInject = '';
            throw new Error(syntaxErrorMsg);
          }
          // --- Check for syntax/reference errors BEFORE wrapping in setup ---
          new Function(codeToInject); // syntax/reference check

          // Only wrap if no errors
          codeToInject = wrapInSetupIfNeeded(codeToInject);
        } catch (err: any) {
          if (!syntaxErrorMsg) {
            syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${path.basename(editor.document.fileName)}] ${err.message}`;
            syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
          }
          codeToInject = '';
        }
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder)
          return;
        // --- Determine include folder for this sketch ---
        const sketchFilePath = editor.document.fileName;
        const sketchDir = path.dirname(sketchFilePath);
        const includeDir = path.join(sketchDir, 'include');
        // Allow webview to load assets from the selected version folder (no hard-coded 1.11 when 2.1 is chosen)
        const selectedP5VersionForRoots = vscode.workspace.getConfiguration('P5Studio').get<string>('P5jsVersion', '1.11') || '1.11';
        let localResourceRoots = [
          vscode.Uri.file(path.join(context.extensionPath, 'assets')),
          vscode.Uri.file(path.join(context.extensionPath, 'assets', selectedP5VersionForRoots)),
          vscode.Uri.file(path.join(context.extensionPath, 'images')),
          vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'common')),
          vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'import')),
          vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'media')),
        ];
        // Only add includeDir if it exists
        if (fs.existsSync(includeDir) && fs.statSync(includeDir).isDirectory()) {
          localResourceRoots.push(vscode.Uri.file(includeDir));
        }
        // Ensure the originating editor has focus so the new group we create is
        // positioned relative to it.
        const originalColumn = typeof editor.viewColumn === 'number' ? (editor.viewColumn as number) : undefined;
        try {
          await vscode.window.showTextDocument(editor.document, editor.viewColumn || vscode.ViewColumn.One, false);
        } catch (e) { /* ignore */ }

        let targetColumn: vscode.ViewColumn = vscode.ViewColumn.Beside;
        if (!_restoringPanels) {
          // Manual open: anchor to the top row by starting from the first editor group,
          // then move right (create one if needed) and target that column.
          try {
            await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
            const before = vscode.window.tabGroups.activeTabGroup;
            await vscode.commands.executeCommand('workbench.action.focusRightGroup');
            let after = vscode.window.tabGroups.activeTabGroup;
            if (!after || (before && after.viewColumn === before.viewColumn)) {
              // No right group on the top row; create one and focus it
              try { await vscode.commands.executeCommand('workbench.action.newGroupRight'); }
              catch { try { await vscode.commands.executeCommand('workbench.action.splitEditorRight'); } catch { /* ignore */ } }
              await vscode.commands.executeCommand('workbench.action.focusRightGroup');
              await new Promise(r => setTimeout(r, 100));
              after = vscode.window.tabGroups.activeTabGroup;
            }
            if (after && typeof after.viewColumn === 'number') {
              targetColumn = after.viewColumn as vscode.ViewColumn;
            }
          } catch { /* ignore; keep default Beside */ }
        } else {
          // During restore, place panels in the top-row right-hand group we prepared earlier.
          try {
            const col = _restoreP5TargetColumn;
            if (typeof col === 'number') {
              // Start from the top-left group and move right (col - 1) times
              await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
              let steps = Math.max(0, (col as number) - 1);
              while (steps-- > 0) {
                await vscode.commands.executeCommand('workbench.action.focusRightGroup');
              }
              targetColumn = col as vscode.ViewColumn;
            } else {
              // Fallback: create/focus a right-hand group from the top-left anchor
              await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
              const before = vscode.window.tabGroups.activeTabGroup;
              await vscode.commands.executeCommand('workbench.action.focusRightGroup');
              let after = vscode.window.tabGroups.activeTabGroup;
              if (!after || (before && after.viewColumn === before.viewColumn)) {
                try { await vscode.commands.executeCommand('workbench.action.newGroupRight'); }
                catch {
                  try { await vscode.commands.executeCommand('workbench.action.splitEditorRight'); } catch { }
                }
                await vscode.commands.executeCommand('workbench.action.focusRightGroup');
                await new Promise(r => setTimeout(r, 100));
                after = vscode.window.tabGroups.activeTabGroup;
              }
              targetColumn = (after && (after.viewColumn as vscode.ViewColumn)) || vscode.ViewColumn.Beside;
              _restoreP5TargetColumn = targetColumn;
            }
          } catch {
            targetColumn = vscode.ViewColumn.Active;
          }
        }

        panel = vscode.window.createWebviewPanel(
          'extension.live-p5',
          'LIVE: ' + path.basename(editor.document.fileName),
          targetColumn,
          {
            enableScripts: true,
            localResourceRoots,
            retainContextWhenHidden: true
          }
        );

        // --- Pass the sketch file path to the panel for include folder lookup ---
        (panel as any)._sketchFilePath = normalizeFsPath(editor.document.fileName);
        allP5Panels.add(panel);
        addPanelForPath(p5PanelsByPath, editor.document.fileName, panel);


        // Focus the output channel for the new sketch immediately
        const docUri = editor.document.uri.toString();
        const fileName = path.basename(editor.document.fileName);
        const outputChannel = getOrCreateOutputChannel(docUri, fileName);
        showAndTrackOutputChannel(outputChannel); // <--- replaced direct show
        // --- LOG ACTIVE p5.js VERSION + RESOLVED ASSET PATHS ---
        try {
          const selectedP5Version = vscode.workspace.getConfiguration('P5Studio').get<string>('P5jsVersion', '1.11') || '1.11';
          let resolvedVersionLabel = selectedP5Version;
          let p5PathFs = path.join(context.extensionPath, 'assets', selectedP5Version, 'p5.min.js');
          if (!fs.existsSync(p5PathFs)) {
            if (selectedP5Version === '1.11') {
              const legacy = path.join(context.extensionPath, 'assets', 'p5.min.js');
              p5PathFs = legacy;
              resolvedVersionLabel = 'legacy (unversioned fallback for 1.11)';
            } else {
              // No fallback to 1.11 when 2.1 is selected
              resolvedVersionLabel = selectedP5Version + ' (missing)';
            }
          }
          // Provide a relative path (trim extension root) for readability
          let displayPath = p5PathFs;
          const extRoot = context.extensionPath.replace(/\\/g, '/');
          const normDisplay = p5PathFs.replace(/\\/g, '/');
          if (normDisplay.startsWith(extRoot)) {
            displayPath = normDisplay.substring(extRoot.length + 1);
          }
          outputChannel.appendLine(`${getTime()} [ℹ️INFO] Using p5.js version ${resolvedVersionLabel}`);
          // If the selected version's p5types are missing (2.1+), warn and note that editor types are disabled
          try {
            const typesDir = path.join(context.extensionPath, 'assets', selectedP5Version, 'p5types');
            if (selectedP5Version !== '1.11' && !fs.existsSync(typesDir)) {
              outputChannel.appendLine(`${getTime()} [⚠️WARN] No p5types found for version ${selectedP5Version}; editor type definitions will be disabled.`);
            }
          } catch { }
        } catch { /* ignore logging errors */ }

        webviewPanelMap.set(docUri, panel);
        captureVisibleMap.set(docUri, false);
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
        debugPrimedMap.set(docUri, false);
        panel.onDidDispose(() => {
          debugPrimedMap.delete(docUri);
          captureVisibleMap.delete(docUri);
          try { latestGlobalVarsByDoc.delete(docUri); } catch { }
          if (activeP5Panel === panel) {
            vscode.commands.executeCommand('setContext', 'p5DebugPrimed', false);
            vscode.commands.executeCommand('setContext', 'p5CaptureVisible', false);
            // If the disposed panel was active, refresh VARIABLES panel to reflect no active sketch
            updateVariablesPanel();
          }
        });

        panel.webview.onDidReceiveMessage(async msg => {
          if (msg.type === 'setGlobalVars') {
            // Relay to VARIABLES panel
            try {
              const thisDocUri = editor.document.uri.toString();
              const list = Array.isArray(msg.variables) ? msg.variables : [];
              latestGlobalVarsByDoc.set(thisDocUri, list);
              if (activeP5Panel === panel) {
                updateVariablesPanel();
              }
            } catch { updateVariablesPanel(); }
            return;
          } else if (msg.type === 'updateGlobalVar') {
            // Forward update to VARIABLES panel (for live value update)
            try {
              const thisDocUri = editor.document.uri.toString();
              const arr = latestGlobalVarsByDoc.get(thisDocUri) || [];
              const idx = arr.findIndex(v => v.name === msg.name);
              if (idx !== -1) {
                arr[idx] = { ...arr[idx], value: msg.value };
                latestGlobalVarsByDoc.set(thisDocUri, arr);
                if (activeP5Panel === panel) updateVariablesPanel();
              }
            } catch { updateVariablesPanel(); }
            return;
          }
          // Focus the script tab if requested from the webview
          if (msg.type === 'focus-script-tab') {
            // Intentionally ignored to keep focus on the webpanel tab per latest UX
            return;
          }
          if (msg.type === 'captureVisibilityChanged') {
            try {
              const docUri = editor.document.uri.toString();
              captureVisibleMap.set(docUri, !!msg.visible);
              if (activeP5Panel === panel) {
                vscode.commands.executeCommand('setContext', 'p5CaptureVisible', !!msg.visible);
              }
            } catch { }
            return;
          }
          const fileName = path.basename(editor.document.fileName);
          const docUri = editor.document.uri.toString();
          const outputChannel = getOrCreateOutputChannel(docUri, fileName);
          if (msg.type === 'log') {
            if (ignoreLogs) return;
            // Sanitize p5 guidance line from logs
            const toStr = (v: any) => typeof v === 'string' ? v : (v && v.toString ? v.toString() : String(v));
            const raw = Array.isArray(msg.message) ? msg.message.map(toStr).join(' ') : toStr(msg.message);
            // Remove any lines that start with the p5 "For more details" guidance
            let sanitized = raw
              .split(/\r?\n/)
              .filter(line => !/^\s*For more details, see:\s*/i.test(line))
              .join('\n')
              .trim();
            // Rewrite p5 guidance to include draw() for any function
            if (sanitized.includes("Did you just try to use p5.js's") &&
              sanitized.includes("into your sketch's setup() function")) {
              sanitized = sanitized.replace(/into your sketch's setup\(\) function/gi,
                "into your sketch's setup() or draw() function");
            }
            if (sanitized.length === 0) return; // If nothing left after filtering, skip logging
            outputChannel.appendLine(`${getTime()} [💭LOG]: ${sanitized}`);
            // outputChannel.show(true); // Do not focus on every log
          } else if (msg.type === 'showError') {
            // Always prefix with timestamp and [RUNTIME ERROR] if not present
            let message = msg.message;
            if (typeof message === "string") {
              if (!message.startsWith("[‼️RUNTIME ERROR]")) {
                message = `[‼️RUNTIME ERROR] ${message}`;
              }
              // Add timestamp if not present
              const time = getTime();
              if (!/^\d{2}:\d{2}:\d{2}/.test(message)) {
                message = `${time} ${message}`;
              }
              // Format syntax error messages if present
              if (message.includes("[‼️SYNTAX ERROR")) {
                message = formatSyntaxErrorMsg(message);
              }
              // Replace [object Arguments] with no argument(s)
              message = message.replace(/\[object Arguments\]/gi, "no argument(s) ");
            }
            outputChannel.appendLine(message);
            // Also fix overlay message
            const overlayMsg = typeof msg.message === "string"
              ? msg.message.replace(/\[object Arguments\]/gi, "no argument(s) ")
              : msg.message;
            const docUri = editor.document.uri.toString();
            const panel = webviewPanelMap.get(docUri);
            if (panel) (panel as any)._lastRuntimeError = message;
            // Forward improved message to overlay if needed
            if (panel) {
              panel.webview.postMessage({ type: 'showError', message: overlayMsg });
            }
          } else if (msg.type === 'submitTopInputs') {
            // Receive values from webview, cache them, preprocess and run the sketch
            try {
              const rawCode = editor.document.getText();
              const key = editor.document.fileName;
              const items = detectTopLevelInputs(rawCode);
              if (!Array.isArray(items) || items.length === 0) {
                panel.webview.postMessage({ type: 'hideTopInputs' });
                return;
              }
              const incoming: Record<string, any> = {};
              if (Array.isArray(msg.values)) {
                for (const e of msg.values) {
                  if (e && typeof e.name === 'string') incoming[e.name] = e.value;
                }
              }
              const values: any[] = items.map(it => {
                const v = incoming[it.varName];
                if (typeof v === 'boolean') return v;
                if (typeof v === 'string') {
                  const s = v.trim();
                  const low = s.toLowerCase();
                  if (low === 'true' || low === 'false') return low === 'true';
                  const num = Number(s);
                  if (!Number.isNaN(num) && s !== '') return num;
                  return v;
                }
                if (typeof v === 'number') return v;
                return v;
              });
              setCachedInputsForKey(key, items.map(i => ({ varName: i.varName, label: i.label })), values);

              // Preprocess non-interactively using the cache
              _allowInteractiveTopInputs = false;
              let pre = rawCode;
              try {
                pre = await preprocessTopLevelInputs(rawCode, { key, interactive: false });
              } finally {
                _allowInteractiveTopInputs = true;
              }
              // Syntax checks and run
              let code = wrapInSetupIfNeeded(pre);
              const globals = extractGlobalVariables(code);
              let rewrittenCode = rewriteUserCodeWithWindowGlobals(code, globals);
              // Reload and then send globals
              panel.webview.postMessage({ type: 'hideTopInputs' });
              const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
              if (!hasDraw) {
                panel.webview.html = await createHtml(code, panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
                setTimeout(() => {
                  const { globals } = extractGlobalVariablesWithConflicts(code);
                  let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                  const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                  if (hiddenSet.size > 0) {
                    filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                  }
                  const readOnly = hasOnlySetup(editor.document.getText());
                  panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                }, 200);
              } else {
                panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
                setTimeout(() => {
                  const { globals } = extractGlobalVariablesWithConflicts(code);
                  let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                  const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                  if (hiddenSet.size > 0) {
                    filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                  }
                  const readOnly = hasOnlySetup(editor.document.getText());
                  panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                }, 200);
              }
            } catch (e) {
              panel.webview.postMessage({ type: 'showError', message: 'Failed to apply input values: ' + e });
            }
          } else if (msg.type === 'reload-button-clicked') {
            // Log reload action to output channel
            try {
              const docUri = editor.document.uri.toString();
              const fileName = path.basename(editor.document.fileName);
              const ch = getOrCreateOutputChannel(docUri, fileName);
              ch.appendLine(`${getTime()} [🔄INFO] Reload`);
            } catch { }
            // Always clear highlight and stop stepping/auto-step on reload
            const ed = editor;
            if (ed && ed.document && ed.document.uri.toString() === editor.document.uri.toString()) {
              clearStepHighlight(ed);
            }
            // Also clear any Blockly block highlight tied to this document
            try { blocklyApi.clearHighlight(editor.document.uri.toString()); } catch { }
            (panel as any)._steppingActive = false;
            if ((panel as any)._autoStepTimer) {
              try { clearInterval((panel as any)._autoStepTimer); } catch { }
              (panel as any)._autoStepTimer = null;
            }
            (panel as any)._autoStepMode = false;
            // Enforce reserved-name conflicts on reload as well (consistent with first open)
            const docUri = editor.document.uri.toString();
            const fileName = path.basename(editor.document.fileName);
            const rawCode = editor.document.getText();
            // Friendly error for inputPrompt misuse
            if (hasNonTopInputUsage(rawCode)) {
              panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
              setTimeout(() => {
                panel.webview.postMessage({ type: 'showError', message: 'inputPrompt() must be used at the very top of the sketch to initialize a variable (e.g., let a = inputPrompt()); runtime prompts are not supported.' });
              }, 150);
              const outputChannel = getOrCreateOutputChannel(docUri, fileName);
              outputChannel.appendLine(`${getTime()} [‼️RUNTIME ERROR in ${fileName}] inputPrompt() must be used at the very top of the sketch to initialize a variable (e.g., let a = inputPrompt()); runtime prompts are not supported.`);
              return;
            }
            // Log warnings on explicit reload action
            lintApi.logSemicolonWarningsForDocument(editor.document);
            lintApi.logUndeclaredWarningsForDocument(editor.document);
            lintApi.logVarWarningsForDocument(editor.document);
            lintApi.logEqualityWarningsForDocument(editor.document);
            // Optionally block sketch on warning
            {
              const warnSemi = lintApi.hasSemicolonWarnings(editor.document);
              const warnUnd = lintApi.hasUndeclaredWarnings(editor.document);
              const warnVar = lintApi.hasVarWarnings(editor.document);
              const warnEq = lintApi.hasEqualityWarnings(editor.document);
              const shouldBlock = (lintApi.getStrictLevel('Semicolon') === 'block' && warnSemi.has)
                || (lintApi.getStrictLevel('Undeclared') === 'block' && warnUnd.has)
                || (lintApi.getStrictLevel('NoVar') === 'block' && warnVar.has)
                || (lintApi.getStrictLevel('LooseEquality') === 'block' && warnEq.has);
              if (shouldBlock) {
                panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
                lintApi.logBlockingWarningsForDocument(editor.document);
                return;
              }
            }
            const { conflicts } = extractGlobalVariablesWithConflicts(rawCode);
            if (conflicts.length > 0) {
              const outputChannel = getOrCreateOutputChannel(docUri, fileName);
              let syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${fileName}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
              syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
              // Replace HTML with empty sketch so nothing runs, then show overlay
              panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
              setTimeout(() => {
                panel.webview.postMessage({ type: 'syntaxError', message: stripLeadingTimestamp(syntaxErrorMsg) });
              }, 150);
              outputChannel.appendLine(syntaxErrorMsg);
              (panel as any)._lastSyntaxError = syntaxErrorMsg;
              (panel as any)._lastRuntimeError = null;
              return;
            }
            // Handle top-of-file inputPrompt() placeholders: on webview Reload use cached values silently; if no cache, show overlay
            const inputsBefore = detectTopLevelInputs(rawCode);
            if (inputsBefore.length > 0) {
              const key = editor.document.fileName;
              if (hasCachedInputsForKey(key, inputsBefore)) {
                _allowInteractiveTopInputs = false;
                const preprocessed = await preprocessTopLevelInputs(rawCode, { key, interactive: false });
                _allowInteractiveTopInputs = true;
                let code = wrapInSetupIfNeeded(preprocessed);
                const globals = extractGlobalVariables(code);
                let rewrittenCode = rewriteUserCodeWithWindowGlobals(code, globals);
                const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
                if (!hasDraw) {
                  panel.webview.html = await createHtml(code, panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
                  setTimeout(() => {
                    const { globals } = extractGlobalVariablesWithConflicts(code);
                    let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                    const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                    if (hiddenSet.size > 0) {
                      filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                    }
                    const readOnly = hasOnlySetup(editor.document.getText());
                    panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                  }, 200);
                  setTimeout(() => {
                    const onlySetup = hasOnlySetup(editor.document.getText());
                    if (onlySetup) {
                      try { panel.webview.postMessage({ type: 'requestGlobalsSnapshot' }); } catch { }
                    }
                  }, 600);
                } else {
                  panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
                  setTimeout(() => {
                    const { globals } = extractGlobalVariablesWithConflicts(code);
                    let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                    const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                    if (hiddenSet.size > 0) {
                      filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                    }
                    const readOnly = hasOnlySetup(editor.document.getText());
                    panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                  }, 200);
                }
                return;
              } else {
                // No cache: show overlay (prefill with defaults)
                panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
                setTimeout(() => {
                  panel.webview.postMessage({ type: 'showTopInputs', items: inputsBefore });
                }, 150);
                return;
              }
            }
            // No inputs: just run normally
            let code = wrapInSetupIfNeeded(rawCode);
            const globals = extractGlobalVariables(code);
            let rewrittenCode = rewriteUserCodeWithWindowGlobals(code, globals);
            if (msg.preserveGlobals && globals.length > 0) {
              globals.forEach(g => {
                rewrittenCode = rewrittenCode.replace(new RegExp('^\\s*var\\s+' + g.name + '(\\s*=.*)?;?\\s*$', 'gm'), '');
                rewrittenCode = rewrittenCode.replace(new RegExp('^\\s*window\\.' + g.name + '\\s*=\\s*' + g.name + ';?\\s*$', 'gm'), '');
              });
            }
            const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
            if (!hasDraw) {
              panel.webview.html = await createHtml(code, panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
              setTimeout(() => {
                const { globals } = extractGlobalVariablesWithConflicts(code);
                let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                if (hiddenSet.size > 0) {
                  filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                }
                const readOnly = hasOnlySetup(editor.document.getText());
                panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
              }, 200);
              setTimeout(() => {
                const onlySetup = hasOnlySetup(editor.document.getText());
                if (onlySetup) {
                  try { panel.webview.postMessage({ type: 'requestGlobalsSnapshot' }); } catch { }
                }
              }, 600);
              setTimeout(() => {
                const onlySetup = hasOnlySetup(editor.document.getText());
                if (onlySetup) {
                  try { panel.webview.postMessage({ type: 'requestGlobalsSnapshot' }); } catch { }
                }
              }, 600);
            } else {
              // For sketches with draw(), we want the reload button to reset globals to their original initial values.
              // Do NOT ask the webview to preserve the current runtime globals; perform a normal reload and then
              // send the original initial values (from source) so the drawer is updated/reset.
              panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
              setTimeout(() => {
                const { globals } = extractGlobalVariablesWithConflicts(code);
                let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                if (hiddenSet.size > 0) {
                  filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                }
                const readOnly = hasOnlySetup(editor.document.getText());
                panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
              }, 200);
            }
          }
          // --- STEP RUN HANDLER (merged with single-step instrumentation + auto-advance) ---
          else if (msg.type === 'step-run-clicked') {
            const docUri = editor.document.uri.toString();
            const fileName = path.basename(editor.document.fileName);
            const rawCode = editor.document.getText();
            const delayMs = vscode.workspace.getConfiguration('P5Studio').get<number>('stepRunDelayMs', 500);
            // If already stepping, just enable auto-advance from current position
            if ((panel as any)._steppingActive) {
              // If switching from single-step to step-run, log the transition
              if (!(panel as any)._autoStepMode) {
                try {
                  const ch = getOrCreateOutputChannel(docUri, fileName);
                  ch.appendLine(`${getTime()} [▶️INFO] Switched to STEP-RUN: continuing from current statement with ${delayMs}ms delay.`);
                } catch { }
              }
              // Stop any previous timer before starting a new one
              if ((panel as any)._autoStepTimer) {
                try { clearInterval((panel as any)._autoStepTimer); } catch { }
                (panel as any)._autoStepTimer = null;
              }
              (panel as any)._autoStepMode = true;
              (panel as any)._autoStepTimer = setInterval(() => {
                try { panel.webview.postMessage({ type: 'step-advance' }); } catch { }
              }, delayMs);
              return;
            }
            // Not stepping yet: instrument with single-step and start auto-advance
            // Friendly error for input misuse
            if (hasNonTopInputUsage(rawCode)) {
              panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
              setTimeout(() => {
                panel.webview.postMessage({ type: 'showError', message: 'input can only be used at the top' });
              }, 150);
              const outputChannel = getOrCreateOutputChannel(docUri, fileName);
              outputChannel.appendLine(`${getTime()} [‼️RUNTIME ERROR in ${fileName}] input can only be used at the top`);
              return;
            }
            // Log warnings on explicit action
            lintApi.logSemicolonWarningsForDocument(editor.document);
            lintApi.logUndeclaredWarningsForDocument(editor.document);
            lintApi.logVarWarningsForDocument(editor.document);
            lintApi.logEqualityWarningsForDocument(editor.document);
            // Optionally block sketch on warning
            {
              const blockOnWarning = vscode.workspace.getConfiguration('P5Studio').get<boolean>('BlockSketchOnWarning', true);
              const warnSemi = lintApi.hasSemicolonWarnings(editor.document);
              const warnUnd = lintApi.hasUndeclaredWarnings(editor.document);
              const warnVar = lintApi.hasVarWarnings(editor.document);
              const warnEq = lintApi.hasEqualityWarnings(editor.document);
              if (blockOnWarning && (warnSemi.has || warnUnd.has || warnVar.has || warnEq.has)) {
                panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
                lintApi.logBlockingWarningsForDocument(editor.document);
                return;
              }
            }
            // Reserved-name conflicts block execution
            const { conflicts } = extractGlobalVariablesWithConflicts(rawCode);
            if (conflicts.length > 0) {
              const outputChannel = getOrCreateOutputChannel(docUri, fileName);
              let syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${fileName}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
              syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
              panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
              setTimeout(() => {
                panel.webview.postMessage({ type: 'syntaxError', message: stripLeadingTimestamp(syntaxErrorMsg) });
              }, 150);
              outputChannel.appendLine(syntaxErrorMsg);
              (panel as any)._lastSyntaxError = syntaxErrorMsg;
              (panel as any)._lastRuntimeError = null;
              return;
            }
            // Handle top-level inputPrompt() placeholders with cache-aware preprocessing
            const inputsBefore = detectTopLevelInputs(rawCode);
            let codeForRun = rawCode;
            if (inputsBefore.length > 0) {
              const key = editor.document.fileName;
              if (hasCachedInputsForKey(key, inputsBefore)) {
                _allowInteractiveTopInputs = false;
                codeForRun = await preprocessTopLevelInputs(rawCode, { key, interactive: false });
                _allowInteractiveTopInputs = true;
              } else {
                panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
                setTimeout(() => {
                  panel.webview.postMessage({ type: 'showTopInputs', items: inputsBefore });
                }, 150);
                return;
              }
            }
            let wrapped = wrapInSetupIfNeeded(codeForRun);
            // Replace p5 frameCount references with custom counter for stable stepping
            wrapped = rewriteFrameCountRefs(wrapped);
            const didWrap = wrapped !== codeForRun;
            // Compute global variables BEFORE instrumentation for accurate offset and rewrite
            const preGlobals = extractGlobalVariables(wrapped);
            const lineOffsetTotal = (didWrap ? 1 : 0);
            let instrumented = instrumentSetupForSingleStep(wrapped, lineOffsetTotal, { disableTopLevelPreSteps: didWrap });
            const globals = preGlobals;
            let rewrittenCode = rewriteUserCodeWithWindowGlobals(instrumented, globals);
            const hasDraw = /\bfunction\s+draw\s*\(/.test(wrapped);
            try {
              const ch = getOrCreateOutputChannel(docUri, fileName);
              ch.appendLine(`${getTime()} [▶️INFO] STEP-RUN started: auto-advancing with ${delayMs}ms delay.`);
            } catch { }
            const afterLoad = () => {
              const { globals } = extractGlobalVariablesWithConflicts(wrapped);
              let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
              const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
              if (hiddenSet.size > 0) {
                filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
              }
              const readOnly = hasOnlySetup(editor.document.getText());
              panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
              (panel as any)._steppingActive = true;
              // Start auto-advance timer
              if ((panel as any)._autoStepTimer) {
                try { clearInterval((panel as any)._autoStepTimer); } catch { }
                (panel as any)._autoStepTimer = null;
              }
              (panel as any)._autoStepMode = true;
              (panel as any)._autoStepTimer = setInterval(() => {
                try { panel.webview.postMessage({ type: 'step-advance' }); } catch { }
              }, delayMs);
            };
            if (!hasDraw) {
              panel.webview.html = await createHtml(instrumented, panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
              setTimeout(afterLoad, 200);
            } else {
              panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
              setTimeout(afterLoad, 200);
            }
          }
          // --- SINGLE STEP HANDLER ---
          else if (msg.type === 'single-step-clicked') {
            const docUri = editor.document.uri.toString();
            const fileName = path.basename(editor.document.fileName);
            const rawCode = editor.document.getText();
            const isStepping = !!(panel as any)._steppingActive;
            let logSingleStepStart = false;
            let switchedFromAutoStep = false;
            // If auto-step is currently running, stop it to switch to manual stepping
            let wasAutoStepMode = (panel as any)._autoStepMode;
            if ((panel as any)._autoStepTimer) {
              try { clearInterval((panel as any)._autoStepTimer); } catch { }
              (panel as any)._autoStepTimer = null;
              (panel as any)._autoStepMode = false;
              // Only log if switching from step-run to single-step
              if (wasAutoStepMode) {
                switchedFromAutoStep = true;
              }
            }
            if (isStepping) {
              // If we just switched from auto-step to manual single-step, log the transition
              if (switchedFromAutoStep) {
                try {
                  const ch = getOrCreateOutputChannel(docUri, fileName);
                  ch.appendLine(`${getTime()} [⏯️INFO] Switched to SINGLE-STEP, click again to step trough statements.`);
                } catch { }
              }
              // Advance to next statement in the webview
              panel.webview.postMessage({ type: 'step-advance' });
              return;
            }
            // Log single-step mode start (merged)
            logSingleStepStart = true;
            if (logSingleStepStart) {
              try {
                const ch = getOrCreateOutputChannel(docUri, fileName);
                if (switchedFromAutoStep) {
                  ch.appendLine(`${getTime()} [⏯️INFO] Switched to SINGLE-STEP, click again to step trough statements.`);
                } else {
                  ch.appendLine(`${getTime()} [⏯️INFO] SINGLE-STEP started, click again to step trough statements.`);
                }
              } catch { }
            }
            // First click: enter stepping mode by instrumenting setup()
            // Friendly error for input misuse
            if (hasNonTopInputUsage(rawCode)) {
              panel.webview.html = await createHtml('', panel, context.extensionPath, { allowInteractiveTopInputs: _allowInteractiveTopInputs, initialCaptureVisible: getInitialCaptureVisible(panel) });
              setTimeout(() => {
                panel.webview.postMessage({ type: 'showError', message: 'input can only be used at the top' });
              }, 150);
              const outputChannel = getOrCreateOutputChannel(docUri, fileName);
              outputChannel.appendLine(`${getTime()} [‼️RUNTIME ERROR in ${fileName}] input can only be used at the top`);
              return;
            }
            // Warnings on explicit action
            lintApi.logSemicolonWarningsForDocument(editor.document);
            lintApi.logUndeclaredWarningsForDocument(editor.document);
            lintApi.logVarWarningsForDocument(editor.document);
            lintApi.logEqualityWarningsForDocument(editor.document);
            {
              const warnSemi = lintApi.hasSemicolonWarnings(editor.document);
              const warnUnd = lintApi.hasUndeclaredWarnings(editor.document);
              const warnVar = lintApi.hasVarWarnings(editor.document);
              const shouldBlock = (lintApi.getStrictLevel('Semicolon') === 'block' && warnSemi.has)
                || (lintApi.getStrictLevel('Undeclared') === 'block' && warnUnd.has)
                || (lintApi.getStrictLevel('NoVar') === 'block' && warnVar.has);
              if (shouldBlock) {
                panel.webview.html = await createHtml('', panel, context.extensionPath);
                lintApi.logBlockingWarningsForDocument(editor.document);
                return;
              }
            }
            const { conflicts } = extractGlobalVariablesWithConflicts(rawCode);
            if (conflicts.length > 0) {
              const outputChannel = getOrCreateOutputChannel(docUri, fileName);
              let syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${fileName}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
              syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
              panel.webview.html = await createHtml('', panel, context.extensionPath);
              setTimeout(() => {
                panel.webview.postMessage({ type: 'syntaxError', message: stripLeadingTimestamp(syntaxErrorMsg) });
              }, 150);
              outputChannel.appendLine(syntaxErrorMsg);
              (panel as any)._lastSyntaxError = syntaxErrorMsg;
              (panel as any)._lastRuntimeError = null;
              return;
            }
            // Handle top-level inputPrompt() placeholders
            let codeForRun = rawCode;
            const inputsBefore = detectTopLevelInputs(rawCode);
            if (inputsBefore.length > 0) {
              const key = editor.document.fileName;
              if (hasCachedInputsForKey(key, inputsBefore)) {
                _allowInteractiveTopInputs = false;
                codeForRun = await preprocessTopLevelInputs(rawCode, { key, interactive: false });
                _allowInteractiveTopInputs = true;
              } else {
                panel.webview.html = await createHtml('', panel, context.extensionPath);
                setTimeout(() => {
                  panel.webview.postMessage({ type: 'showTopInputs', items: inputsBefore });
                }, 150);
                return;
              }
            }
            let wrapped = wrapInSetupIfNeeded(codeForRun);
            // Replace p5 frameCount references with custom counter for stable stepping
            wrapped = rewriteFrameCountRefs(wrapped);
            const didWrap = wrapped !== codeForRun;
            // Compute global variables BEFORE instrumentation for accurate offset and rewrite
            const preGlobals = extractGlobalVariables(wrapped);
            const lineOffsetTotal = (didWrap ? 1 : 0);
            let instrumented = instrumentSetupForSingleStep(wrapped, lineOffsetTotal, { disableTopLevelPreSteps: didWrap });
            const globals = preGlobals;
            let rewrittenCode = rewriteUserCodeWithWindowGlobals(instrumented, globals);
            const hasDraw = /\bfunction\s+draw\s*\(/.test(wrapped);
            if (!hasDraw) {
              panel.webview.html = await createHtml(instrumented, panel, context.extensionPath);
              setTimeout(() => {
                const { globals } = extractGlobalVariablesWithConflicts(wrapped);
                let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                if (hiddenSet.size > 0) {
                  filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                }
                const readOnly = hasOnlySetup(editor.document.getText());
                panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                (panel as any)._steppingActive = true;
                // No auto-advance: the first click should execute the first statement
              }, 200);
            } else {
              panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
              setTimeout(() => {
                const { globals } = extractGlobalVariablesWithConflicts(wrapped);
                let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                if (hiddenSet.size > 0) {
                  filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                }
                const readOnly = hasOnlySetup(editor.document.getText());
                panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                (panel as any)._steppingActive = true;
                // No auto-advance
              }, 200);
            }
          }
          // --- HIGHLIGHT CURRENT LINE HANDLER ---
          else if (msg.type === 'highlightLine') {
            const docUri = editor.document.uri.toString();
            // Prefer a currently visible editor for this document over the captured reference
            const ed = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === docUri)
              || (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri.toString() === docUri
                ? vscode.window.activeTextEditor
                : null);
            if (ed && ed.document) {
              const line = typeof msg.line === 'number' ? msg.line : 1;
              applyStepHighlight(ed, line);
              // If we're auto-stepping and a breakpoint exists on this line, pause auto-advance
              try {
                if ((panel as any)._autoStepMode && hasBreakpointOnLine(docUri, line)) {
                  if ((panel as any)._autoStepTimer) {
                    try { clearInterval((panel as any)._autoStepTimer); } catch { }
                    (panel as any)._autoStepTimer = null;
                  }
                  (panel as any)._autoStepMode = false;
                  const fileName = path.basename(editor.document.fileName);
                  const ch = getOrCreateOutputChannel(docUri, fileName);
                  ch.appendLine(`${getTime()} [⏸️INFO] Paused at breakpoint on line ${line}. Click SINGLE-STEP to advance or STEP-RUN to resume.`);
                }
              } catch { }
            } else {
              // Editor not visible: emit a lightweight note to the per-sketch channel once
              try {
                const fileName = path.basename(editor.document.fileName);
                const ch = getOrCreateOutputChannel(docUri, fileName);
                ch.appendLine(`${getTime()} [ℹ️INFO] Highlight requested but sketch editor is not visible. Open the sketch to see line highlights.`);
              } catch { }
            }
            // Also reflect highlight in Blockly view (if present)
            try {
              const line = typeof msg.line === 'number' ? msg.line : 1;
              blocklyApi.highlightForLine(docUri, line);
            } catch { }
          }
          // --- CLEAR HIGHLIGHT HANDLER ---
          else if (msg.type === 'clearHighlight') {
            const docUri = editor.document.uri.toString();
            const ed = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === docUri)
              || (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri.toString() === docUri
                ? vscode.window.activeTextEditor
                : null);
            if (ed && ed.document) { clearStepHighlight(ed); }
            // Also clear block highlight in Blockly (if open)
            try { blocklyApi.clearHighlight(docUri); } catch { }
            // Only mark stepping finished if there is no draw() in the user's code
            try {
              const codeText = editor.document.getText();
              const hasDraw = /\bfunction\s+draw\s*\(/.test(codeText);
              if (!hasDraw) {
                const fileName = path.basename(editor.document.fileName);
                const ch = getOrCreateOutputChannel(docUri, fileName);
                ch.appendLine(`${getTime()} [▶️INFO] Code stepping finished.`);
                (panel as any)._steppingActive = false;
                // Reset primed state so debug button returns
                try {
                  debugPrimedMap.set(docUri, false);
                  vscode.commands.executeCommand('setContext', 'p5DebugPrimed', false);
                } catch { }
              }
              // If draw() exists, keep stepping active to continue into draw frames
            } catch { }
          }
          // --- OSC SEND HANDLER ---
          else if (msg.type === 'oscSend') {
            try { oscService?.send(msg.address, msg.args || []); } catch { }
            return;
          }
          // --- SAVE CANVAS IMAGE HANDLER ---
          else if (msg.type === 'saveCanvasImage') {
            try {
              // Use the provided fileName as default if available
              let defaultFileName = msg.fileName || 'sketch.png';
              // Prompt user for file path
              const uri = await vscode.window.showSaveDialog({
                filters: { 'PNG Image': ['png'] },
                saveLabel: 'Save Canvas Image',
                defaultUri: vscode.Uri.file(path.join(
                  vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
                  defaultFileName
                ))
              });
              if (!uri) return;
              // Decode base64 data URL
              const base64 = msg.dataUrl.replace(/^data:image\/png;base64,/, '');
              const buffer = Buffer.from(base64, 'base64');

              await vscode.workspace.fs.writeFile(uri, buffer);
              // Show clickable filename in info message
              const fileName = uri.fsPath.split(/[\\/]/).pop() || uri.fsPath;
              vscode.window.showInformationMessage(
                `Canvas image saved: ${fileName}`,
                'Open Location'
              ).then(selection => {
                if (selection === 'Open Location') {
                  // Open the folder and highlight the file
                  vscode.commands.executeCommand('revealFileInOS', uri);
                }
              });
            } catch (e) {
              vscode.window.showErrorMessage('Failed to save image: ' + e);
            }
          }
          // --- COPY CANVAS IMAGE HANDLER (no-op, handled in webview) ---
          else if (msg.type === 'copyCanvasImage') {
            vscode.window.showWarningMessage('Copy image is only supported in browsers with Clipboard API.');
          }
          // --- SHOW INFO MESSAGE FROM WEBVIEW ---
          else if (msg.type === 'showInfo' && typeof msg.message === 'string') {
            vscode.window.showInformationMessage(msg.message);
          }
        });

        panel.onDidDispose(async () => {
          webviewPanelMap.delete(docUri);
          if (activeP5Panel === panel) activeP5Panel = null;
          vscode.commands.executeCommand('setContext', 'hasP5Webview', false);
          const listeners = autoReloadListenersMap.get(docUri);
          listeners?.changeListener?.dispose();
          listeners?.saveListener?.dispose();
          autoReloadListenersMap.delete(docUri);
          allP5Panels.delete(panel);
          try { removePanelForPath(p5PanelsByPath, (panel as any)._sketchFilePath || editor.document.fileName, panel); } catch { }
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
          const channel = outputChannelMap.get(docUri);
          if (channel) {
            channel.dispose();
            outputChannelMap.delete(docUri);
          }
        });

        panel.onDidChangeViewState(async e => {
          if (e.webviewPanel.active) {
            const channel = outputChannelMap.get(docUri);
            if (channel) showAndTrackOutputChannel(channel); // <--- in panel.onDidChangeViewState
            // Update restore order to reflect recent activation
            try { await restore.moveToOrderEnd(editor.document.fileName); } catch { }
          }
        });

        // If inputs are present, always show UI (prefill from cache if available) and stop
        if (_inputsNeeded && _inputsNeeded.length > 0) {
          const key = editor.document.fileName;
          let itemsToShow = _inputsNeeded;
          if (hasCachedInputsForKey(key, _inputsNeeded)) {
            const cached = getCachedInputsForKey(key);
            if (cached) {
              itemsToShow = _inputsNeeded.map((it, i) => ({
                varName: it.varName,
                label: it.label,
                defaultValue: typeof cached.values[i] !== 'undefined' ? cached.values[i] : it.defaultValue
              }));
            }
          }
          panel.webview.html = await createHtml('', panel, context.extensionPath);
          setTimeout(() => {
            panel.webview.postMessage({ type: 'showTopInputs', items: itemsToShow });
          }, 150);
          return;
        }

        // Only set HTML on first open, but optionally block on warnings
        const warnSemi_IO = lintApi.hasSemicolonWarnings(editor.document);
        const warnUnd_IO = lintApi.hasUndeclaredWarnings(editor.document);
        const warnVar_IO = lintApi.hasVarWarnings(editor.document);
        const shouldBlockIO = (lintApi.getStrictLevel('Semicolon') === 'block' && warnSemi_IO.has)
          || (lintApi.getStrictLevel('Undeclared') === 'block' && warnUnd_IO.has)
          || (lintApi.getStrictLevel('NoVar') === 'block' && warnVar_IO.has);
        if (shouldBlockIO) {
          panel.webview.html = await createHtml('', panel, context.extensionPath);
          lintApi.logBlockingWarningsForDocument(editor.document);
        } else {
          panel.webview.html = await createHtml(codeToInject, panel, context.extensionPath);
          // Log warnings when running the sketch (initial open)
          lintApi.logSemicolonWarningsForDocument(editor.document);
          lintApi.logUndeclaredWarningsForDocument(editor.document);
          lintApi.logVarWarningsForDocument(editor.document);
        }
        // Send global variables immediately after setting HTML
        const { globals } = extractGlobalVariablesWithConflicts(codeToInject);
        // --- PATCH: Use .type instead of typeof .value ---
        let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
        // Apply @hide directive filtering based on original editor code
        {
          const hiddenSet = getHiddenGlobalsByDirective(code);
          if (hiddenSet.size > 0) {
            filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
          }
        }
        setTimeout(() => {
          const readOnly = hasOnlySetup(code); // use original editor code to decide
          panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
        }, 200);
        if (syntaxErrorMsg) {
          setTimeout(() => {
            panel.webview.postMessage({ type: 'syntaxError', message: stripLeadingTimestamp(syntaxErrorMsg) });
          }, 150);
          const outputChannel = getOrCreateOutputChannel(docUri, path.basename(editor.document.fileName));
          outputChannel.appendLine(syntaxErrorMsg);
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
                panel.webview.html = await createHtml('', panel, context.extensionPath);
                lintApi.logBlockingWarningsForDocument(editor.document);
              })();
            } else {
              panel.webview.postMessage({ type: 'reload', code: codeToSend });
              // Log warnings on explicit open -> reload path
              lintApi.logSemicolonWarningsForDocument(editor.document);
              lintApi.logUndeclaredWarningsForDocument(editor.document);
              lintApi.logVarWarningsForDocument(editor.document);
            }
          } catch (err: any) {
            // If error, send empty code and show error
            panel.webview.postMessage({ type: 'reload', code: '' });
            const syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${path.basename(editor.document.fileName)}] ${err.message}`;
            panel.webview.postMessage({ type: 'syntaxError', message: stripLeadingTimestamp(formatSyntaxErrorMsg(syntaxErrorMsg)) });
            const outputChannel = getOrCreateOutputChannel(docUri, path.basename(editor.document.fileName));
            outputChannel.appendLine(formatSyntaxErrorMsg(syntaxErrorMsg));
          }
        }, 100);
      }

      updateP5Context(editor);
      if (editor) updateAutoReloadListeners(editor);
    })
  );

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
              // Log warnings on explicit reload command
              lintApi.logSemicolonWarningsForDocument(doc);
              lintApi.logUndeclaredWarningsForDocument(doc);
              lintApi.logVarWarningsForDocument(doc);
              _pendingReloadReason = 'command';
              debounceDocumentUpdate(doc, false);
            }
          }
        }
        return;
      }
      // Log warnings on explicit reload command
      lintApi.logSemicolonWarningsForDocument(editor.document);
      lintApi.logUndeclaredWarningsForDocument(editor.document);
      lintApi.logVarWarningsForDocument(editor.document);
      _pendingReloadReason = 'command';
      debounceDocumentUpdate(editor.document, false); // use false to match typing
    })
  );

  // Command to disable reload while typing
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.toggleReloadWhileTypingOn', async () => {
      const config = vscode.workspace.getConfiguration('P5Studio');
      await config.update('reloadWhileTyping', false, vscode.ConfigurationTarget.Global);
      await updateReloadWhileTypingVarsAndContext();
      refreshAutoReloadListenersForAllOpenEditors();
      vscode.window.showInformationMessage('Reload on typing is now disabled.');
    })
  );
  // Command to enable reload while typing
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.toggleReloadWhileTypingOff', async () => {
      const config = vscode.workspace.getConfiguration('P5Studio');
      await config.update('reloadWhileTyping', true, vscode.ConfigurationTarget.Global);
      await updateReloadWhileTypingVarsAndContext();
      refreshAutoReloadListenersForAllOpenEditors();
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
          const version = vscode.workspace.getConfiguration('P5Studio').get<string>('P5jsVersion', '1.11') || '1.11';
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
            openLabel: 'Select folder for new P5 project'
          });
          if (!folderUris || folderUris.length === 0) return;
          selectedFolderUri = folderUris[0];
          workspaceFolder = { uri: selectedFolderUri, name: '', index: 0 };
        }
        vscode.window.showInformationMessage('Setting up new P5 project...');
        // creates a jsconfig that tells vscode where to find the types file
        const now = new Date();
        // Resolve p5types global.d.ts & p5helper.d.ts in versioned assets if present
        const selectedP5VersionCJ = vscode.workspace.getConfiguration('P5Studio').get<string>('P5jsVersion', '1.11') || '1.11';
        const p5typesCandidatesCJ = (
          selectedP5VersionCJ === '1.11'
            ? [path.join(context.extensionPath, 'assets', '1.11', 'p5types', 'global.d.ts')]
            : [path.join(context.extensionPath, 'assets', selectedP5VersionCJ, 'p5types', 'global.d.ts')]
        );
        const p5helperCandidatesCJ = (
          selectedP5VersionCJ === '1.11'
            ? [path.join(context.extensionPath, 'assets', '1.11', 'p5types', 'p5helper.d.ts')]
            : [path.join(context.extensionPath, 'assets', selectedP5VersionCJ, 'p5types', 'p5helper.d.ts')]
        );
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

  // Listen for OSC config changes and re-create port if needed (delegated to oscService)
  vscode.workspace.onDidChangeConfiguration(e => {
    try { oscService?.handleConfigChange(e); } catch { }
  });

  // Listen for debounceDelay config changes and update debounce logic
  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('P5Studio.debounceDelay')) {
      debounceMap.clear();
    }
    if (e.affectsConfiguration('P5Studio.variablePanelDebounceDelay')) {
      const newDelay = vscode.workspace.getConfiguration('P5Studio').get<number>('variablePanelDebounceDelay', 500);
      for (const [, panel] of webviewPanelMap.entries()) {
        panel.webview.postMessage({ type: 'updateVarDebounceDelay', value: newDelay });
      }
    }
    // --- Sync reloadWhileTyping/reloadOnSave if changed via settings UI ---
    if (e.affectsConfiguration('P5Studio.reloadWhileTyping') || e.affectsConfiguration('P5Studio.reloadOnSave')) {
      updateReloadWhileTypingVarsAndContext();
      refreshAutoReloadListenersForAllOpenEditors();
    }
    // Toolbar in webview removed; no need to sync showReloadButton/ShowDebugButton settings to webview DOM.

    // --- Immediately apply showFPS changes in all open panels ---
    if (e.affectsConfiguration('P5Studio.showFPS')) {
      const show = vscode.workspace.getConfiguration('P5Studio').get<boolean>('showFPS', false);
      for (const [, panel] of webviewPanelMap.entries()) {
        try { panel.webview.postMessage({ type: 'toggleFPS', show }); } catch { }
      }
    }

    // Update overlay font size if the editor font size changes
    if (e.affectsConfiguration('editor.fontSize')) {
      const newSize = vscode.workspace.getConfiguration('editor').get<number>('fontSize', 14);
      for (const [, panel] of webviewPanelMap.entries()) {
        panel.webview.postMessage({ type: 'updateOverlayFontSize', value: newSize });
      }
    }

    // Blockly theme updates are handled within the blockly module
  });

  // Blockly theme sync with VS Code theme handled within the blockly module

  // (Removed duplicate close handler; unified logic exists earlier with per-path disposal)

  // --- On activation: if .p5 exists, refresh jsconfig.json (delete and recreate) ---
  (async function refreshJsconfigIfMarkerPresent() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;
    try {
      const markerPath = path.join(workspaceFolder.uri.fsPath, ".p5");
      if (fs.existsSync(markerPath)) {
        // Try to hide the marker file on Windows if it's visible
        hideFileIfSupported(markerPath);
        const jsconfigPath = path.join(workspaceFolder.uri.fsPath, "jsconfig.json");
        // Delete existing jsconfig.json if present
        if (fs.existsSync(jsconfigPath)) {
          try {
            fs.unlinkSync(jsconfigPath);
            //vscode.window.showInformationMessage('LIVE P5: Removed existing jsconfig.json');
          } catch {
            // ignore
          }
        }
        // Recreate jsconfig.json with current settings
        const now2 = new Date();
        const selectedP5VersionRJ = vscode.workspace.getConfiguration('P5Studio').get<string>('P5jsVersion', '1.11') || '1.11';
        const p5typesCandidatesRJ = (
          selectedP5VersionRJ === '1.11'
            ? [path.join(context.extensionPath, 'assets', '1.11', 'p5types', 'global.d.ts')]
            : [path.join(context.extensionPath, 'assets', selectedP5VersionRJ, 'p5types', 'global.d.ts')]
        );
        const p5helperCandidatesRJ = (
          selectedP5VersionRJ === '1.11'
            ? [path.join(context.extensionPath, 'assets', '1.11', 'p5types', 'p5helper.d.ts')]
            : [path.join(context.extensionPath, 'assets', selectedP5VersionRJ, 'p5types', 'p5helper.d.ts')]
        );
        const resolvedGlobalRJ = p5typesCandidatesRJ.find(p => { try { return fs.existsSync(p); } catch { return false; } });
        const resolvedHelperRJ = p5helperCandidatesRJ.find(p => { try { return fs.existsSync(p); } catch { return false; } });
        const jsconfig = {
          createdAt: toLocalISOString(now2),
          include: ((): (string)[] => {
            const base = [
              "*.js",
              "**/*.js",
              "*.ts",
              "**/.ts",
              "common/*.js",
              "import/*.js",
            ];
            if (resolvedGlobalRJ) base.push(resolvedGlobalRJ);
            if (resolvedHelperRJ) base.push(resolvedHelperRJ);
            return base;
          })()
        };
        writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
        if (selectedP5VersionRJ !== '1.11' && (!resolvedGlobalRJ || !resolvedHelperRJ)) {
          console.warn('[P5Studio] No p5types found for version', selectedP5VersionRJ, '- jsconfig will omit type definitions.');
        }
        //  vscode.window.showInformationMessage('LIVE P5: Created fresh jsconfig.json');
      }
    } catch (e) {
      console.warn('Failed to refresh jsconfig.json on activation:', e);
    }
  })();

  // Helper to hide a file on Windows (attrib +h). No-op on other platforms.
  function hideFileIfSupported(filePath: string) {
    try {
      if (process.platform === 'win32') {
        exec(`attrib +h "${filePath}"`);
      }
    } catch {
      // ignore
    }
  }

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

  // --- Show notification to setup P5 project if not already set up ---
  (async function showSetupNotificationIfNeeded() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    // NEW: read setting to allow disabling the notification
    const config = vscode.workspace.getConfiguration('P5Studio');
    const showSetupNotification = config.get<boolean>('showSetupNotification', true);
    if (!showSetupNotification) return;

    const p5MarkerPath = path.join(workspaceFolder.uri.fsPath, ".p5");
    if (!fs.existsSync(p5MarkerPath)) {
      const action = await vscode.window.showInformationMessage(
        "This project isn't configured for P5 yet. Would you like to set it up now?",
        "Setup P5 Project",
        "Don't show again"
      );
      if (action === "Setup P5 Project") {
        vscode.commands.executeCommand('extension.create-jsconfig');
      } else if (action === "Don't show again") {
        await config.update('showSetupNotification', false, vscode.ConfigurationTarget.Global);
      }
    }
  })();

  // --- NEW: Scroll LIVE P5 output to end command ---
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.scrollOutputToEnd', async () => {
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
            openLabel: 'Select file to duplicate'
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

  // Decouple Blockly command moved into the blockly module

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

// Helper: Wrap code in setup() if no setup/draw present
function wrapInSetupIfNeeded(code: string): string {
  // If user already defines setup(), we leave code untouched.
  const hasSetup = /\bfunction\s+setup\s*\(/.test(code);
  if (hasSetup) return code;

  // Parse AST and collect top-level non-function, non-class, non-import statements to move.
  // Even if draw() exists, we still want those imperative statements to run inside setup() so p5 APIs are available.
  try {
    const acorn = require('acorn');
    const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
    const b = recast.types.builders;
    const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
    const moved: any[] = [];
    const retained: any[] = [];

    const P5_CALL_NAMES = new Set([
      'createCanvas', 'resizeCanvas', 'noCanvas', 'createGraphics', 'createCapture', 'createVideo', 'createAudio', 'background',
      'colorMode', 'image', 'loadImage', 'loadJSON', 'loadTable', 'loadXML', 'loadFont', 'loadSound', 'createDiv', 'createSpan', 'createP', 'createImg'
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
      // Always retain declarations (functions/classes/import/export) & variable declarations so globals still detected.
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
            // Move initializer into setup as an assignment, and keep declaration without init at top-level.
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
      // Move executable/non-declaration statements (expressions, loops, etc.) into setup.
      moved.push(stmt);
    }

    // If there is nothing to move (e.g., only draw() function defined) we still synthesize an empty setup so p5 creates its environment first.
    const setupBody = moved.length > 0 ? moved : [];
    // Ensure we still signal _p5SetupDone like rewriteUserCodeWithWindowGlobals will append later.
    const setupFn = b.functionDeclaration(b.identifier('setup'), [], b.blockStatement(setupBody));
    ast.program.body = [setupFn, ...retained];
    return recast.print(ast).code;
  } catch {
    // Fallback: naive wrap only if no setup and no draw, preserving previous behavior.
    const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
    if (!hasDraw) {
      return `function setup() {\n${code}\n}`;
    }
    // If draw exists but parse failed, prepend empty setup.
    return `function setup() { }\n${code}`;
  }
}

// Helper: Format syntax error message to include "on line N" and remove (N:M)
function formatSyntaxErrorMsg(msg: string): string {
  // Match: [SYNTAX ERROR in filename] ... (N:M)
  // or: [SYNTAX ERROR in filename] ... (N)
  // or: [SYNTAX ERROR in filename] ... (N:M)
  // We want: [SYNTAX ERROR in filename on line N] ...
  const regex = /(\[‼️SYNTAX ERROR in [^\]\s]+)\]([^\n]*?)\s*\((\d+)(?::\d+)?\)\s*$/;
  const match = msg.match(regex);
  if (match) {
    const before = match[1]; // [SYNTAX ERROR in filename
    const rest = match[2] || '';
    const line = match[3];
    // Insert on line N before the closing ]
    return msg.replace(regex, `${before} on line ${line}]${rest}`);
  }
  return msg;
}

// Helper: Remove a leading timestamp like "HH:MM:SS " from a message (for clean overlay text)
function stripLeadingTimestamp(msg: string): string {
  return typeof msg === 'string' ? msg.replace(/^\s*\d{2}:\d{2}:\d{2}\s+/, '') : msg;
}

// Helper to check SingleP5Panel setting
function isSingleP5PanelEnabled() {
  return vscode.workspace.getConfiguration('P5Studio').get<boolean>('SingleP5Panel', false);
}

// NEW: helper to detect whether the user's code defines only a single top-level `setup` function
function hasOnlySetup(code: string): boolean {
  // parse AST and check top-level FunctionDeclaration nodes
  try {
    const acorn = require('acorn');
    const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
    if (!ast.program || !Array.isArray(ast.program.body)) return false;
    let hasSetup = false;
    for (const node of ast.program.body) {
      if (node.type === 'FunctionDeclaration') {
        if (node.id && node.id.name === 'setup') hasSetup = true;
        else return false; // found another top-level function besides setup
      }
    }
    return hasSetup;
  } catch {
    return false;
  }
}

// Helper: Format a local ISO-like string without timezone offset, e.g. 2025-10-16T14:05:00.000
function toLocalISOString(d: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  const second = pad(d.getSeconds());
  const ms = pad(d.getMilliseconds(), 3);
  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}`;
}

// Detect hidden globals via //@hide or // @hide directives immediately above top-level declarations
function getHiddenGlobalsByDirective(code: string): Set<string> {
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
        const startLine: number = node.loc.start.line; // 1-based
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

