import * as vscode from 'vscode';
import { registerVariablesView } from '../views/variablesView';

export type VarEntry = { name: string; value: any; type: string };
type GlobalDefs = Map<string, { type: string; initialValue?: any }>;
type LocalsHeading = 'locals' | 'variables';
export type VarState = {
  globals: VarEntry[];
  locals: VarEntry[];
  globalDefs: GlobalDefs;
  globalsSuppressed: boolean;
  pendingGlobals: VarEntry[];
  localsHeading: LocalsHeading;
  forceRevealNextGlobals: boolean;
};

export type VariablesServiceDeps = {
  getActiveP5Panel: () => vscode.WebviewPanel | undefined;
  getDocUriForPanel: (panel: vscode.WebviewPanel) => vscode.Uri | undefined;
};

export type VariablesServiceApi = {
  getGlobalsForDoc: (docUri: string) => VarEntry[];
  setGlobalsForDoc: (docUri: string, list: VarEntry[]) => void;
  primeGlobalsForDoc: (docUri: string, list: VarEntry[]) => void;
  hasGlobalDefinition: (docUri: string, name: string) => boolean;
  revealGlobalsForDoc: (docUri: string, count?: number) => void;
  setGlobalValue: (docUri: string, name: string, value: any) => void;
  getLocalsForDoc: (docUri: string) => VarEntry[];
  upsertLocalForDoc: (docUri: string, v: VarEntry) => void;
  clearForDoc: (docUri: string) => void;
  updateVariablesPanel: () => void;
  setLocalsHeadingForDoc: (docUri: string, heading: LocalsHeading) => void;
  getLocalsHeadingForDoc: (docUri: string) => LocalsHeading;
  resetValuesForDoc: (docUri: string) => void;
};

const inferType = (value: any): string => {
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'number' || t === 'boolean' || t === 'string') return t;
  return 'string';
};

export function registerVariablesService(
  context: vscode.ExtensionContext,
  deps: VariablesServiceDeps,
): VariablesServiceApi {
  const latestVarsByDoc = new Map<string, VarState>();
  const ensure = (docUri: string): VarState => {
    if (!latestVarsByDoc.has(docUri)) {
      latestVarsByDoc.set(docUri, {
        globals: [],
        locals: [],
        globalDefs: new Map(),
        globalsSuppressed: false,
        pendingGlobals: [],
        localsHeading: 'locals',
        forceRevealNextGlobals: false,
      });
    }
    return latestVarsByDoc.get(docUri)!;
  };

  const upsertEntry = (list: VarEntry[], entry: VarEntry) => {
    const idx = list.findIndex(v => v.name === entry.name);
    if (idx >= 0) list[idx] = entry;
    else list.push(entry);
  };

  const setGlobalValueInternal = (docUri: string, name: string, value: any) => {
    const st = ensure(docUri);
    const hinted = st.globalDefs.get(name)?.type
      || st.globals.find(v => v.name === name)?.type
      || st.pendingGlobals.find(v => v.name === name)?.type
      || inferType(value);
    const nextEntry: VarEntry = { name, value, type: hinted };

    const visibleIdx = st.globals.findIndex(v => v.name === name);
    if (visibleIdx >= 0) {
      st.globals[visibleIdx] = nextEntry;
    } else if (st.globalsSuppressed) {
      upsertEntry(st.pendingGlobals, nextEntry);
    } else {
      upsertEntry(st.globals, nextEntry);
    }
    const def = st.globalDefs.get(name) || { type: hinted };
    st.globalDefs.set(name, { type: hinted || def.type, initialValue: typeof def.initialValue !== 'undefined' ? def.initialValue : value });
  };

  const setLocalValueInternal = (docUri: string, name: string, value: any) => {
    const st = ensure(docUri);
    const idx = st.locals.findIndex(v => v.name === name);
    const type = inferType(value);
    if (idx >= 0) st.locals[idx] = { ...st.locals[idx], value, type: st.locals[idx].type || type };
    else st.locals.push({ name, value, type });
  };

  const { updateVariablesPanel } = registerVariablesView(context, {
    getActiveP5Panel: () => deps.getActiveP5Panel(),
    getDocUriForPanel: (p) => deps.getDocUriForPanel(p),
    getGlobalsForDoc: (docUri: string) => ensure(docUri).globals,
    getLocalsForDoc: (docUri: string) => ensure(docUri).locals,
    getLocalsHeadingForDoc: (docUri: string) => ensure(docUri).localsHeading,
    setGlobalValue: setGlobalValueInternal,
    setLocalValue: setLocalValueInternal,
  });

  return {
    getGlobalsForDoc: (docUri: string) => ensure(docUri).globals,
    setGlobalsForDoc: (docUri: string, list: VarEntry[]) => {
      const st = ensure(docUri);
      const next = Array.isArray(list) ? list.slice() : [];
      if (st.forceRevealNextGlobals) {
        st.globalsSuppressed = false;
        st.forceRevealNextGlobals = false;
      }
      st.globalDefs = new Map();
      for (const entry of next) {
        if (entry && entry.name) {
          st.globalDefs.set(entry.name, { type: entry.type || inferType(entry.value), initialValue: entry.value });
        }
      }
      if (st.globalsSuppressed) {
        st.pendingGlobals = next;
        return;
      }
      st.pendingGlobals = [];
      st.globals = next;
      st.globalsSuppressed = false;
    },
    primeGlobalsForDoc: (docUri: string, list: VarEntry[]) => {
      const st = ensure(docUri);
      const snapshot = Array.isArray(list) ? list.slice() : [];
      st.globals = [];
      st.locals = [];
      st.globalDefs = new Map();
      st.globalsSuppressed = true;
      st.pendingGlobals = snapshot;
      st.forceRevealNextGlobals = false;
      for (const entry of snapshot) {
        if (entry && entry.name) {
          st.globalDefs.set(entry.name, { type: entry.type || inferType(entry.value), initialValue: entry.value });
        }
      }
    },
    hasGlobalDefinition: (docUri: string, name: string) => ensure(docUri).globalDefs.has(name),
    revealGlobalsForDoc: (docUri: string, count?: number) => {
      const st = ensure(docUri);
      const totalPending = st.pendingGlobals.length;
      if (totalPending === 0) {
        st.globalsSuppressed = false;
        return;
      }
      const toReveal = typeof count === 'number' && count > 0
        ? Math.min(count, totalPending)
        : totalPending;
      const released = st.pendingGlobals.splice(0, toReveal);
      for (const entry of released) {
        if (typeof entry.value === 'undefined') {
          const initial = st.globalDefs.get(entry.name)?.initialValue;
          entry.value = initial;
        }
        upsertEntry(st.globals, entry);
      }
      st.globalsSuppressed = st.pendingGlobals.length > 0;
    },
    setGlobalValue: setGlobalValueInternal,
    getLocalsForDoc: (docUri: string) => ensure(docUri).locals,
    upsertLocalForDoc: (docUri: string, v: VarEntry) => {
      const st = ensure(docUri);
      const idx = st.locals.findIndex(x => x.name === v.name);
      if (idx >= 0) st.locals[idx] = { ...st.locals[idx], value: v.value, type: v.type || st.locals[idx].type };
      else st.locals.push(v);
    },
    clearForDoc: (docUri: string) => { try { latestVarsByDoc.delete(docUri); } catch { } },
    updateVariablesPanel,
    setLocalsHeadingForDoc: (docUri: string, heading: LocalsHeading) => {
      const st = ensure(docUri);
      st.localsHeading = heading === 'variables' ? 'variables' : 'locals';
    },
    getLocalsHeadingForDoc: (docUri: string) => ensure(docUri).localsHeading,
    resetValuesForDoc: (docUri: string) => {
      const st = ensure(docUri);
      st.globals = [];
      st.locals = [];
      st.pendingGlobals = [];
      st.globalsSuppressed = true;
      st.forceRevealNextGlobals = true;
    },
  };
}
