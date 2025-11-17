import * as vscode from 'vscode';
import { registerVariablesView } from '../views/variablesView';

export type VarEntry = { name: string; value: any; type: string };
export type VarState = { globals: VarEntry[]; locals: VarEntry[] };

export type VariablesServiceDeps = {
  getActiveP5Panel: () => vscode.WebviewPanel | undefined;
  getDocUriForPanel: (panel: vscode.WebviewPanel) => vscode.Uri | undefined;
};

export type VariablesServiceApi = {
  getGlobalsForDoc: (docUri: string) => VarEntry[];
  setGlobalsForDoc: (docUri: string, list: VarEntry[]) => void;
  getLocalsForDoc: (docUri: string) => VarEntry[];
  upsertLocalForDoc: (docUri: string, v: VarEntry) => void;
  clearForDoc: (docUri: string) => void;
  updateVariablesPanel: () => void;
};

export function registerVariablesService(
  context: vscode.ExtensionContext,
  deps: VariablesServiceDeps,
): VariablesServiceApi {
  const latestVarsByDoc = new Map<string, VarState>();
  const ensure = (docUri: string): VarState => {
    if (!latestVarsByDoc.has(docUri)) latestVarsByDoc.set(docUri, { globals: [], locals: [] });
    return latestVarsByDoc.get(docUri)!;
  };

  const { updateVariablesPanel } = registerVariablesView(context, {
    getActiveP5Panel: () => deps.getActiveP5Panel(),
    getDocUriForPanel: (p) => deps.getDocUriForPanel(p),
    getGlobalsForDoc: (docUri: string) => ensure(docUri).globals,
    getLocalsForDoc: (docUri: string) => ensure(docUri).locals,
    setGlobalValue: (docUri: string, name: string, value: any) => {
      const st = ensure(docUri);
      const i = st.globals.findIndex(v => v.name === name);
      if (i >= 0) st.globals[i] = { ...st.globals[i], value };
    },
    setLocalValue: (docUri: string, name: string, value: any) => {
      const st = ensure(docUri);
      const i = st.locals.findIndex(v => v.name === name);
      if (i >= 0) st.locals[i] = { ...st.locals[i], value };
      else st.locals.push({ name, value, type: Array.isArray(value) ? 'array' : (typeof value === 'boolean' || typeof value === 'number') ? typeof value : 'string' });
    },
  });

  return {
    getGlobalsForDoc: (docUri: string) => ensure(docUri).globals,
    setGlobalsForDoc: (docUri: string, list: VarEntry[]) => { ensure(docUri).globals = Array.isArray(list) ? list.slice() : []; },
    getLocalsForDoc: (docUri: string) => ensure(docUri).locals,
    upsertLocalForDoc: (docUri: string, v: VarEntry) => {
      const st = ensure(docUri);
      const idx = st.locals.findIndex(x => x.name === v.name);
      if (idx >= 0) st.locals[idx] = { ...st.locals[idx], value: v.value, type: v.type || st.locals[idx].type };
      else st.locals.push(v);
    },
    clearForDoc: (docUri: string) => { try { latestVarsByDoc.delete(docUri); } catch { } },
    updateVariablesPanel,
  };
}
