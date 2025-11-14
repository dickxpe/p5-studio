import * as vscode from 'vscode';
import { isLivePanelViewType, LIVE_PANEL_TITLE_PREFIX } from '../panels/registry';

export type ContextServiceDeps = {
  getActiveP5Panel: () => vscode.WebviewPanel | undefined;
  getDocUriForPanel: (panel: vscode.WebviewPanel) => vscode.Uri | undefined;
  updateVariablesPanel: () => void;
};

export type ContextServiceApi = {
  setContext: (key: string, val: any) => Thenable<unknown>;
  updateActiveContexts: () => void;
  setDebugPrimed: (docUri: string, value: boolean) => void;
  getDebugPrimed: (docUri: string) => boolean;
  setCaptureVisible: (docUri: string, value: boolean) => void;
  getCaptureVisible: (docUri: string) => boolean;
  clearForDoc: (docUri: string) => void;
  getInitialCaptureVisible: (panel: vscode.WebviewPanel) => boolean;
};

const debugPrimedMap = new Map<string, boolean>();
const captureVisibleMap = new Map<string, boolean>();

export function registerContextService(
  context: vscode.ExtensionContext,
  deps: ContextServiceDeps,
): ContextServiceApi {
  const setContext = (key: string, val: any) => vscode.commands.executeCommand('setContext', key, val);

  function getDocUriForActivePanel(): vscode.Uri | undefined {
    const panel = deps.getActiveP5Panel();
    if (!panel) return undefined;
    try { return deps.getDocUriForPanel(panel); } catch { return undefined; }
  }

  function updateWebviewTabFocusedContext() {
    const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
    let isP5Webview = false;
    if (activeTab) {
      try {
        console.log('[P5Studio] activeTab.label:', activeTab.label);
        console.log('[P5Studio] activeTab.input:', JSON.stringify(activeTab.input));
      } catch (e) {
        console.log('[P5Studio] Error logging activeTab.input:', e);
      }
      if (activeTab.label && activeTab.input) {
        const input = activeTab.input as { viewType?: string };
        const vt = (input && typeof input.viewType === 'string') ? String(input.viewType) : '';
        const looksLikeLiveP5 = isLivePanelViewType(vt);
        if (looksLikeLiveP5 && String(activeTab.label).startsWith(LIVE_PANEL_TITLE_PREFIX)) {
          isP5Webview = true;
        }
      }
    }
    setContext('p5WebviewTabFocused', isP5Webview);
    if (isP5Webview) {
      const uri = getDocUriForActivePanel();
      const primed = uri ? !!debugPrimedMap.get(uri.toString()) : false;
      const cap = uri ? !!captureVisibleMap.get(uri.toString()) : false;
      setContext('p5DebugPrimed', primed);
      setContext('p5CaptureVisible', cap);
      deps.updateVariablesPanel();
    } else {
      setContext('p5DebugPrimed', false);
      setContext('p5CaptureVisible', false);
      deps.updateVariablesPanel();
    }
  }

  // Watchers to keep contexts in sync with UI focus
  context.subscriptions.push(vscode.window.tabGroups.onDidChangeTabs(updateWebviewTabFocusedContext));
  context.subscriptions.push(vscode.window.tabGroups.onDidChangeTabGroups(updateWebviewTabFocusedContext));
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateWebviewTabFocusedContext));
  // Initialize
  updateWebviewTabFocusedContext();

  const api: ContextServiceApi = {
    setContext,
    updateActiveContexts: updateWebviewTabFocusedContext,
    setDebugPrimed: (docUri: string, value: boolean) => { try { debugPrimedMap.set(docUri, !!value); } catch { } },
    getDebugPrimed: (docUri: string) => { try { return !!debugPrimedMap.get(docUri); } catch { return false; } },
    setCaptureVisible: (docUri: string, value: boolean) => { try { captureVisibleMap.set(docUri, !!value); } catch { } },
    getCaptureVisible: (docUri: string) => { try { return !!captureVisibleMap.get(docUri); } catch { return false; } },
    clearForDoc: (docUri: string) => { try { debugPrimedMap.delete(docUri); captureVisibleMap.delete(docUri); } catch { } },
    getInitialCaptureVisible: (panel: vscode.WebviewPanel): boolean => {
      try {
        const uri = deps.getDocUriForPanel(panel);
        return uri ? !!captureVisibleMap.get(uri.toString()) : false;
      } catch {
        return false;
      }
    },
  };

  return api;
}
