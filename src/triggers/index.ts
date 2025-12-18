import * as vscode from 'vscode';
import { registerTriggersView } from '../views/triggersView';
import type { TriggerDef } from '../processing/triggers';

export type TriggersServiceDeps = {
  getActiveP5Panel: () => vscode.WebviewPanel | undefined;
  getDocUriForPanel: (panel: vscode.WebviewPanel) => vscode.Uri | undefined;
  invokeTrigger: (panel: vscode.WebviewPanel, fnName: string, args: any[]) => void;
};

export type TriggersServiceApi = {
  getTriggersForDoc: (docUri: string) => TriggerDef[];
  setTriggersForDoc: (docUri: string, triggers: TriggerDef[]) => void;
  clearForDoc: (docUri: string) => void;
  updateTriggersPanel: () => void;
};

export function registerTriggersService(
  context: vscode.ExtensionContext,
  deps: TriggersServiceDeps,
): TriggersServiceApi {
  const latestByDoc = new Map<string, TriggerDef[]>();
  const ensure = (docUri: string): TriggerDef[] => {
    if (!latestByDoc.has(docUri)) latestByDoc.set(docUri, []);
    return latestByDoc.get(docUri)!;
  };

  const { updateTriggersPanel } = registerTriggersView(context, {
    getActiveP5Panel: () => deps.getActiveP5Panel(),
    getDocUriForPanel: (p) => (p ? deps.getDocUriForPanel(p) : undefined),
    getTriggersForDoc: (docUri: string) => ensure(docUri),
    invokeTrigger: (panel, fnName, args) => deps.invokeTrigger(panel, fnName, args),
  });

  return {
    getTriggersForDoc: (docUri: string) => ensure(docUri),
    setTriggersForDoc: (docUri: string, triggers: TriggerDef[]) => {
      const next = Array.isArray(triggers)
        ? triggers.filter(t => !!t && typeof t.fnName === 'string').map(t => ({
          id: String(t.id || ''),
          label: String(t.label || t.fnName || ''),
          fnName: String(t.fnName),
          params: Array.isArray(t.params) ? t.params.map(p => String(p)) : [],
        }))
        : [];
      latestByDoc.set(docUri, next);
    },
    clearForDoc: (docUri: string) => {
      latestByDoc.delete(docUri);
    },
    updateTriggersPanel: () => updateTriggersPanel(),
  };
}
