import * as vscode from 'vscode';

export function handleSetGlobalVars(
  params: {
    panel: vscode.WebviewPanel;
    editor: vscode.TextEditor;
    variables: Array<{ name: string; value: any; type: string }>;
  },
  deps: {
    setVarsForDoc: (docUri: string, list: Array<{ name: string; value: any; type: string }>) => void;
    updateVariablesPanel: () => void;
    isActivePanel: (panel: vscode.WebviewPanel) => boolean;
  }
) {
  try {
    const thisDocUri = params.editor.document.uri.toString();
    const list = Array.isArray(params.variables) ? params.variables : [];
    deps.setVarsForDoc(thisDocUri, list);
    if (deps.isActivePanel(params.panel)) {
      deps.updateVariablesPanel();
    }
  } catch {
    deps.updateVariablesPanel();
  }
}

export function handleUpdateGlobalVar(
  params: {
    panel: vscode.WebviewPanel;
    editor: vscode.TextEditor;
    name: string;
    value: any;
  },
  deps: {
    getVarsForDoc: (docUri: string) => Array<{ name: string; value: any; type: string }>;
    setVarsForDoc: (docUri: string, list: Array<{ name: string; value: any; type: string }>) => void;
    updateVariablesPanel: () => void;
    isActivePanel: (panel: vscode.WebviewPanel) => boolean;
  }
) {
  try {
    const thisDocUri = params.editor.document.uri.toString();
    const arr = deps.getVarsForDoc(thisDocUri) || [];
    const idx = arr.findIndex(v => v.name === params.name);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], value: params.value };
      deps.setVarsForDoc(thisDocUri, arr);
      if (deps.isActivePanel(params.panel)) deps.updateVariablesPanel();
    }
  } catch {
    deps.updateVariablesPanel();
  }
}
