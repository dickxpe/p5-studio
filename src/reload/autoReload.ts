import * as vscode from 'vscode';
import { debounce, getDebounceDelay } from '../utils/helpers';

export type AutoReloadApi = {
    setupAutoReloadForDoc: (editor: vscode.TextEditor) => void;
    refreshAll: () => void;
    updateConfig: () => Promise<void>;
    debounceUpdate: (document: vscode.TextDocument, forceLog?: boolean) => void;
    disposeForDoc: (docUri: string) => void;
    clearDebounceCache: () => void;
};

export function registerAutoReload(
    context: vscode.ExtensionContext,
    deps: {
        updateDocumentPanel: (document: vscode.TextDocument, forceLog: boolean) => void;
        setPendingReason: (r: 'typing' | 'save' | 'command' | undefined) => void;
    }
): AutoReloadApi {
    const listenersByDoc = new Map<string, { changeListener?: vscode.Disposable; saveListener?: vscode.Disposable }>();
    const debounceMap = new Map<string, Function>();

    let reloadWhileTyping = vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadWhileTyping', true);
    let reloadOnSave = vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadOnSave', true);

    async function updateConfig() {
        try {
            reloadWhileTyping = vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadWhileTyping', true);
            reloadOnSave = vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadOnSave', true);
            await vscode.commands.executeCommand('setContext', 'liveP5ReloadWhileTypingEnabled', reloadWhileTyping);
        } catch { /* ignore */ }
    }

    function debounceUpdate(document: vscode.TextDocument, forceLog: boolean = false) {
        try {
            const docUri = document.uri.toString();
            if (!debounceMap.has(docUri)) {
                debounceMap.set(docUri, debounce((doc: vscode.TextDocument, log: boolean) => deps.updateDocumentPanel(doc, log), getDebounceDelay()));
            }
            debounceMap.get(docUri)!(document, forceLog);
        } catch { /* ignore */ }
    }

    function setupAutoReloadForDoc(editor: vscode.TextEditor) {
        try {
            const docUri = editor.document.uri.toString();
            const existing = listenersByDoc.get(docUri);
            existing?.changeListener?.dispose();
            existing?.saveListener?.dispose();

            let changeListener: vscode.Disposable | undefined;
            let saveListener: vscode.Disposable | undefined;

            if (reloadWhileTyping) {
                changeListener = vscode.workspace.onDidChangeTextDocument(e => {
                    try {
                        if (e.document.uri.toString() === docUri) {
                            deps.setPendingReason('typing');
                            debounceUpdate(e.document, true);
                        }
                    } catch { }
                });
            }
            if (reloadOnSave) {
                saveListener = vscode.workspace.onDidSaveTextDocument(doc => {
                    try {
                        if (doc.uri.toString() === docUri) {
                            deps.setPendingReason('save');
                            debounceUpdate(doc, true);
                        }
                    } catch { }
                });
            }
            listenersByDoc.set(docUri, { changeListener, saveListener });
        } catch { /* ignore */ }
    }

    function refreshAll() {
        try {
            const editors = vscode.window.visibleTextEditors || [];
            const seen = new Set<string>();
            for (const ed of editors) {
                if (!ed || !ed.document) continue;
                const uri = ed.document.uri.toString();
                seen.add(uri);
                setupAutoReloadForDoc(ed);
            }
            // Dispose for docs not visible anymore
            for (const [docUri, ls] of listenersByDoc.entries()) {
                if (!seen.has(docUri)) {
                    try { ls.changeListener?.dispose(); } catch { }
                    try { ls.saveListener?.dispose(); } catch { }
                    listenersByDoc.delete(docUri);
                }
            }
        } catch { /* ignore */ }
    }

    function disposeForDoc(docUri: string) {
        try {
            const ls = listenersByDoc.get(docUri);
            try { ls?.changeListener?.dispose(); } catch { }
            try { ls?.saveListener?.dispose(); } catch { }
            listenersByDoc.delete(docUri);
            // Also clear any per-doc debouncer
            try { debounceMap.delete(docUri); } catch { }
        } catch { /* ignore */ }
    }

    function clearDebounceCache() {
        try { debounceMap.clear(); } catch { }
    }

    context.subscriptions.push({
        dispose: () => {
            try {
                for (const [, ls] of listenersByDoc) {
                    try { ls.changeListener?.dispose(); } catch { }
                    try { ls.saveListener?.dispose(); } catch { }
                }
                listenersByDoc.clear();
                debounceMap.clear();
            } catch { }
        }
    });

    return { setupAutoReloadForDoc, refreshAll, updateConfig, debounceUpdate, disposeForDoc, clearDebounceCache };
}
