import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { writeFileSync } from 'fs';
import { exec } from 'child_process';

function toLocalISOString(d: Date): string {
    const pad = (n: number, w = 2) => String(n).padStart(w, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const minute = pad(d.getMinutes());
    const second = pad(d.getSeconds());
    const ms = pad(d.getMilliseconds(), 3);
    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}`;
}

export function hideFileIfSupported(filePath: string) {
    try {
        if (process.platform === 'win32') {
            exec(`attrib +h "${filePath}"`);
        }
    } catch {
        // ignore
    }
}

async function refreshJsconfigIfMarkerPresent(context: vscode.ExtensionContext) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;
    try {
        const markerPath = path.join(workspaceFolder.uri.fsPath, '.p5');
        if (fs.existsSync(markerPath)) {
            // Try to hide the marker file on Windows if it's visible
            hideFileIfSupported(markerPath);
            const jsconfigPath = path.join(workspaceFolder.uri.fsPath, 'jsconfig.json');
            // Delete existing jsconfig.json if present
            if (fs.existsSync(jsconfigPath)) {
                try { fs.unlinkSync(jsconfigPath); } catch { /* ignore */ }
            }
            // Recreate jsconfig.json with current settings
            const now2 = new Date();
            const selectedP5VersionRJ = vscode.workspace.getConfiguration('P5Studio').get<string>('P5jsVersion', '1.11') || '1.11';
            const p5typesCandidatesRJ = (
                selectedP5VersionRJ === '1.11'
                    ? [path.join(context.extensionPath, 'assets', '1.11', 'p5types', 'global.d.ts')]
                    : [path.join(context.extensionPath, 'assets', selectedP5VersionRJ, 'p5types', 'global.d.ts')]
            );
            const p5helperCandidatesRJ = (
                selectedP5VersionRJ === '1.11'
                    ? [path.join(context.extensionPath, 'assets', '1.11', 'p5types', 'p5helper.d.ts')]
                    : [path.join(context.extensionPath, 'assets', selectedP5VersionRJ, 'p5types', 'p5helper.d.ts')]
            );
            const resolvedGlobalRJ = p5typesCandidatesRJ.find(p => { try { return fs.existsSync(p); } catch { return false; } });
            const resolvedHelperRJ = p5helperCandidatesRJ.find(p => { try { return fs.existsSync(p); } catch { return false; } });
            const jsconfig = {
                createdAt: toLocalISOString(now2),
                include: ((): string[] => {
                    const base = [
                        '*.js',
                        '**/*.js',
                        '*.ts',
                        '**/.ts',
                        'common/*.js',
                        'import/*.js',
                    ];
                    if (resolvedGlobalRJ) base.push(resolvedGlobalRJ);
                    if (resolvedHelperRJ) base.push(resolvedHelperRJ);
                    return base;
                })()
            } as any;
            writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
            if (selectedP5VersionRJ !== '1.11' && (!resolvedGlobalRJ || !resolvedHelperRJ)) {
                console.warn('[P5Studio] No p5types found for version', selectedP5VersionRJ, '- jsconfig will omit type definitions.');
            }
        }
    } catch (e) {
        console.warn('Failed to refresh jsconfig.json on activation:', e);
    }
}

async function showSetupNotificationIfNeeded() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    const config = vscode.workspace.getConfiguration('P5Studio');
    const showSetupNotification = config.get<boolean>('showSetupNotification', true);
    if (!showSetupNotification) return;

    const p5MarkerPath = path.join(workspaceFolder.uri.fsPath, '.p5');
    if (!fs.existsSync(p5MarkerPath)) {
        const action = await vscode.window.showInformationMessage(
            "This project isn't configured for P5 yet. Would you like to set it up now?",
            'Setup P5 Project',
            "Don't show again"
        );
        if (action === 'Setup P5 Project') {
            vscode.commands.executeCommand('extension.create-jsconfig');
        } else if (action === "Don't show again") {
            await config.update('showSetupNotification', false, vscode.ConfigurationTarget.Global);
        }
    }
}

export function runOnActivate(context: vscode.ExtensionContext) {
    // Run both utilities without blocking activation
    (async () => { try { await refreshJsconfigIfMarkerPresent(context); } catch { } })();
    (async () => { try { await showSetupNotificationIfNeeded(); } catch { } })();
}
