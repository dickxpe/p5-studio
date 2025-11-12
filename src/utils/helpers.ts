import * as path from 'path';
import * as vscode from 'vscode';

// Debounce utility to delay function execution
export function debounce<Func extends (...args: any[]) => void>(fn: Func, delay: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<Func>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// Get current time as HH:MM:SS string for log timestamps
export function getTime(): string {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// Read debounce delay from user config
export function getDebounceDelay() {
    return vscode.workspace.getConfiguration('P5Studio').get<number>('debounceDelay', 500);
}

// Recursively list .js/.ts files in a folder (for script imports)
export async function listFilesRecursively(dirUri: vscode.Uri, exts: string[]): Promise<string[]> {
    let files: string[] = [];
    try {
        const entries = await vscode.workspace.fs.readDirectory(dirUri);
        for (const [name, type] of entries) {
            const entryUri = vscode.Uri.file(path.join(dirUri.fsPath, name));
            if (type === vscode.FileType.File && exts.some(ext => name.endsWith(ext))) {
                files.push(entryUri.fsPath);
            } else if (type === vscode.FileType.Directory) {
                files = files.concat(await listFilesRecursively(entryUri, exts));
            }
        }
    } catch (e) { /* ignore */ }
    return files;
}
