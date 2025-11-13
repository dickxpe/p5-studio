import * as vscode from 'vscode';

export const RESTORE_LIVE_KEY = 'P5Studio.restoreLiveDocs';
export const RESTORE_LIVE_ORDER_KEY = 'P5Studio.restoreLiveDocsOrder';
export const RESTORE_BLOCKLY_KEY = 'P5Studio.restoreBlocklyDocs';

export type RestoreManagerApi = {
    getRestoreList: (key: string) => string[];
    setRestoreList: (key: string, list: string[]) => Promise<void>;
    addToRestore: (key: string, fsPath: string) => Promise<void>;
    removeFromRestore: (key: string, fsPath: string) => Promise<void>;
    moveToOrderEnd: (fsPath: string) => Promise<void>;
    migrate: () => Promise<void>;
    removeFromOrder: (fsPath: string) => Promise<void>;
};

export function registerRestoreManager(context: vscode.ExtensionContext): RestoreManagerApi {
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
    function getRestoreList(key: string): string[] {
        try {
            const arr = context.workspaceState.get<string[]>(key, []) || [];
            return Array.from(new Set(arr.filter(Boolean)));
        } catch {
            return [];
        }
    }

    async function setRestoreList(key: string, list: string[]) {
        try {
            await context.workspaceState.update(key, Array.from(new Set(list.filter(Boolean))));
        } catch { /* ignore */ }
    }

    async function addToRestore(key: string, fsPath: string) {
        try {
            if (!isInWorkspace(fsPath)) return;
            const list = getRestoreList(key);
            if (!list.includes(fsPath)) list.push(fsPath);
            await setRestoreList(key, list);
        } catch { /* ignore */ }
    }

    async function removeFromRestore(key: string, fsPath: string) {
        try {
            const list = getRestoreList(key).filter(p => p !== fsPath);
            await setRestoreList(key, list);
        } catch { /* ignore */ }
    }

    async function moveToOrderEnd(fsPath: string) {
        try {
            if (!isInWorkspace(fsPath)) return;
            const curr = getRestoreList(RESTORE_LIVE_ORDER_KEY);
            const filtered = curr.filter(p => p !== fsPath);
            filtered.push(fsPath);
            await setRestoreList(RESTORE_LIVE_ORDER_KEY, filtered);
        } catch { /* ignore */ }
    }

    async function removeFromOrder(fsPath: string) {
        try {
            const curr = getRestoreList(RESTORE_LIVE_ORDER_KEY).filter(p => p !== fsPath);
            await setRestoreList(RESTORE_LIVE_ORDER_KEY, curr);
        } catch { /* ignore */ }
    }

    async function migrate() {
        try {
            const migrateKey = 'P5Studio.restoreMigratedToWorkspace';
            const already = context.workspaceState.get<boolean>(migrateKey, false);
            if (!already) {
                const inWs = (p: string) => !!p && isInWorkspace(p);
                const fromGlobal = (k: string) => (context.globalState.get<string[]>(k, []) || []).filter(inWs);
                const live = fromGlobal(RESTORE_LIVE_KEY);
                const liveOrder = fromGlobal(RESTORE_LIVE_ORDER_KEY);
                const blk = fromGlobal(RESTORE_BLOCKLY_KEY);
                if (live.length) await context.workspaceState.update(RESTORE_LIVE_KEY, Array.from(new Set(live)));
                if (liveOrder.length) await context.workspaceState.update(RESTORE_LIVE_ORDER_KEY, Array.from(new Set(liveOrder)));
                if (blk.length) await context.workspaceState.update(RESTORE_BLOCKLY_KEY, Array.from(new Set(blk)));
                // Clear global to prevent cross-project bleed in future
                await context.globalState.update(RESTORE_LIVE_KEY, []);
                await context.globalState.update(RESTORE_LIVE_ORDER_KEY, []);
                await context.globalState.update(RESTORE_BLOCKLY_KEY, []);
                await context.workspaceState.update(migrateKey, true);
            }
        } catch { /* ignore migration issues */ }
    }

    return { getRestoreList, setRestoreList, addToRestore, removeFromRestore, moveToOrderEnd, migrate, removeFromOrder };
}
