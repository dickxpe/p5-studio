import * as vscode from 'vscode';
import * as path from 'path';
import { LIVE_PANEL_VIEWTYPE } from './registry';

export interface LivePanelManagerApi {
  createPanel(editor: vscode.TextEditor, opts: { title: string; column: vscode.ViewColumn; localResourceRoots: vscode.Uri[] }): vscode.WebviewPanel;
  getPanelForDocUri(docUri: string): vscode.WebviewPanel | undefined;
  disposeForDoc(docUri: string): void;
  disposePanelsForFilePath(fsPath: string): void;
  fsPathFromTab(tab: vscode.Tab): string;
  normalizeFsPath(p?: string | null): string;
}

export function registerLivePanelManager(
  context: vscode.ExtensionContext,
  deps: {
    webviewPanelMap: Map<string, vscode.WebviewPanel>;
    getOutputChannelForDoc: (docUri: string) => vscode.OutputChannel | undefined;
    showAndTrackOutputChannel: (ch: vscode.OutputChannel) => void;
    disposeOutputForDoc: (docUri: string) => void;
  }
): LivePanelManagerApi {
  const allP5Panels = new Set<vscode.WebviewPanel>();
  const p5PanelsByPath = new Map<string, Set<vscode.WebviewPanel>>();

  function normalizeFsPath(p?: string | null): string {
    try {
      if (!p) return '';
      let n = path.normalize(p);
      if (process.platform === 'win32') n = n.toLowerCase();
      return n;
    } catch {
      return String(p || '');
    }
  }

  function addPanelForPath(fsPath: string, panel: vscode.WebviewPanel) {
    const key = normalizeFsPath(fsPath);
    if (!p5PanelsByPath.has(key)) p5PanelsByPath.set(key, new Set());
    p5PanelsByPath.get(key)!.add(panel);
  }
  function removePanelForPath(fsPath: string, panel: vscode.WebviewPanel) {
    const key = normalizeFsPath(fsPath);
    if (!p5PanelsByPath.has(key)) return;
    const set = p5PanelsByPath.get(key)!;
    set.delete(panel);
    if (set.size === 0) p5PanelsByPath.delete(key);
  }

  function disposePanelsForFilePath(fsPath: string) {
    try {
      const norm = normalizeFsPath(fsPath);
      const p5Set = p5PanelsByPath.get(norm);
      if (p5Set) {
        for (const p of Array.from(p5Set)) {
          try { p.dispose(); } catch { }
        }
      }
      // Fallback scan: any panels tagged with this path
      for (const p of Array.from(allP5Panels)) {
        try {
          const tag = normalizeFsPath((p as any)._sketchFilePath || '');
          if (tag && tag === norm) { p.dispose(); }
        } catch { }
      }
    } catch { }
  }

  function fsPathFromTab(tab: vscode.Tab): string {
    try {
      const input: any = (tab as any).input;
      if (input && input.uri && input.uri.scheme === 'file') {
        return normalizeFsPath(input.uri.fsPath);
      }
    } catch { }
    return '';
  }

  function getPanelForDocUri(docUri: string): vscode.WebviewPanel | undefined {
    return deps.webviewPanelMap.get(docUri);
  }

  function disposeForDoc(docUri: string) {
    try { deps.webviewPanelMap.get(docUri)?.dispose(); } catch { }
  }

  function createPanel(editor: vscode.TextEditor, opts: { title: string; column: vscode.ViewColumn; localResourceRoots: vscode.Uri[] }): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      LIVE_PANEL_VIEWTYPE,
      opts.title,
      opts.column,
      {
        enableScripts: true,
        localResourceRoots: opts.localResourceRoots,
        retainContextWhenHidden: true,
      }
    );

    const docUri = editor.document.uri.toString();
    const sketchFilePath = editor.document.fileName;
    // Tag + track
    (panel as any)._sketchFilePath = normalizeFsPath(sketchFilePath);
    allP5Panels.add(panel);
    addPanelForPath(sketchFilePath, panel);
    deps.webviewPanelMap.set(docUri, panel);

    // Focus output channel when panel becomes active
    try {
      panel.onDidChangeViewState(() => {
        try {
          if (panel.active) {
            const ch = deps.getOutputChannelForDoc(docUri);
            if (ch) deps.showAndTrackOutputChannel(ch);
          }
        } catch { }
      });
    } catch { }

    // Cleanup on dispose
    panel.onDidDispose(() => {
      try { removePanelForPath(sketchFilePath, panel); } catch { }
      try { allP5Panels.delete(panel); } catch { }
      try { deps.webviewPanelMap.delete(docUri); } catch { }
      try { deps.disposeOutputForDoc(docUri); } catch { }
    });

    return panel;
  }

  context.subscriptions.push({
    dispose: () => {
      // Best-effort cleanup
      p5PanelsByPath.clear();
      allP5Panels.clear();
    }
  });

  return {
    createPanel,
    getPanelForDocUri,
    disposeForDoc,
    disposePanelsForFilePath,
    fsPathFromTab,
    normalizeFsPath,
  };
}
