import * as vscode from 'vscode';

export function handleSetGlobalVars(
  params: {
    panel: vscode.WebviewPanel;
    editor: vscode.TextEditor;
    variables: Array<{ name: string; value: any; type: string }>;
  },
  deps: {
    setGlobalsForDoc: (docUri: string, list: Array<{ name: string; value: any; type: string }>) => void;
    updateVariablesPanel: () => void;
    isActivePanel: (panel: vscode.WebviewPanel) => boolean;
  }
) {
  try {
    const thisDocUri = params.editor.document.uri.toString();
    const list = Array.isArray(params.variables) ? params.variables : [];
    deps.setGlobalsForDoc(thisDocUri, list);
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
    getGlobalsForDoc: (docUri: string) => Array<{ name: string; value: any; type: string }>;
    getLocalsForDoc: (docUri: string) => Array<{ name: string; value: any; type: string }>;
    setGlobalValue: (docUri: string, name: string, value: any) => void;
    upsertLocal: (docUri: string, v: { name: string; value: any; type: string }) => void;
    updateVariablesPanel: () => void;
    isActivePanel: (panel: vscode.WebviewPanel) => boolean;
  }
) {
  try {
    const thisDocUri = params.editor.document.uri.toString();
    const globals = deps.getGlobalsForDoc(thisDocUri) || [];
    const isGlobal = globals.some(v => v.name === params.name);
    if (isGlobal) {
      deps.setGlobalValue(thisDocUri, params.name, params.value);
    } else {
      let type = 'string';
      try {
        if (Array.isArray(params.value)) type = 'array';
        else if (typeof params.value === 'number') type = 'number';
        else if (typeof params.value === 'boolean') type = 'boolean';
      } catch { }
      deps.upsertLocal(thisDocUri, { name: String(params.name), value: params.value, type });
    }
    if (deps.isActivePanel(params.panel)) deps.updateVariablesPanel();
  } catch {
    deps.updateVariablesPanel();
  }
}
