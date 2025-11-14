import * as vscode from 'vscode';
import { registerVariablesView } from '../views/variablesView';

export type VarEntry = { name: string; value: any; type: string };

export type VariablesServiceDeps = {
  getActiveP5Panel: () => vscode.WebviewPanel | undefined;
  getDocUriForPanel: (panel: vscode.WebviewPanel) => vscode.Uri | undefined;
};

export type VariablesServiceApi = {
  getVarsForDoc: (docUri: string) => VarEntry[];
  setVarsForDoc: (docUri: string, list: VarEntry[]) => void;
  clearForDoc: (docUri: string) => void;
  updateVariablesPanel: () => void;
};

export function registerVariablesService(
  context: vscode.ExtensionContext,
  deps: VariablesServiceDeps,
): VariablesServiceApi {
  const latestGlobalVarsByDoc = new Map<string, VarEntry[]>();

  const { updateVariablesPanel } = registerVariablesView(context, {
    getActiveP5Panel: () => deps.getActiveP5Panel(),
    getDocUriForPanel: (p) => deps.getDocUriForPanel(p),
    getVarsForDoc: (docUri: string) => latestGlobalVarsByDoc.get(docUri) || [],
    setVarsForDoc: (docUri: string, list: VarEntry[]) => { latestGlobalVarsByDoc.set(docUri, list); },
  });

  return {
    getVarsForDoc: (docUri: string) => latestGlobalVarsByDoc.get(docUri) || [],
    setVarsForDoc: (docUri: string, list: VarEntry[]) => { latestGlobalVarsByDoc.set(docUri, list); },
    clearForDoc: (docUri: string) => { try { latestGlobalVarsByDoc.delete(docUri); } catch { } },
    updateVariablesPanel,
  };
}
