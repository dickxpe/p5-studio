import * as vscode from 'vscode';
import * as path from 'path';

export async function saveCanvasPngDataUrl(
    dataUrl: string,
    opts?: { defaultFileName?: string; getDefaultFolder?: () => string | undefined }
) {
    try {
        const defaultFileName = opts?.defaultFileName || 'sketch.png';
        const defaultFolder = opts?.getDefaultFolder ? opts.getDefaultFolder() : (vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');
        const uri = await vscode.window.showSaveDialog({
            filters: { 'PNG Image': ['png'] },
            saveLabel: 'Save Canvas Image',
            defaultUri: vscode.Uri.file(path.join(defaultFolder || '', defaultFileName))
        });
        if (!uri) return;
        const base64 = (dataUrl || '').replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64, 'base64');
        await vscode.workspace.fs.writeFile(uri, buffer);
        const fileName = uri.fsPath.split(/[\\/]/).pop() || uri.fsPath;
        vscode.window.showInformationMessage(`Canvas image saved: ${fileName}`, 'Open Location').then(selection => {
            if (selection === 'Open Location') {
                vscode.commands.executeCommand('revealFileInOS', uri);
            }
        });
    } catch (e: any) {
        vscode.window.showErrorMessage('Failed to save image: ' + (e?.message || e));
    }
}

export async function copyCanvasPngDataUrl(_dataUrl?: string) {
    try {
        // VS Code extension API does not support writing images to clipboard yet.
        // The webview tries Clipboard API first; this is a fallback.
        vscode.window.showWarningMessage('Copy image from extension is not supported. Use the webview Copy or Save as PNG.');
    } catch { /* ignore */ }
}
