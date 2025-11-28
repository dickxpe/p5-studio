import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { buildLiveLocalResourceRoots } from '../panels/registry';
import { config as cfg } from '../config';

export interface LiveAssetResolution {
    localResourceRoots: vscode.Uri[];
    selectedVersion: string;
    versionLabel: string;
}

export function resolveLiveAssets(
    context: vscode.ExtensionContext,
    editor: vscode.TextEditor,
    opts?: { output?: vscode.OutputChannel; getTime?: () => string }
): LiveAssetResolution {
    const selected = cfg.getP5jsVersion();

    let versionLabel = selected;
    try {
        let p5PathFs = path.join(context.extensionPath, 'assets', selected, 'p5.min.js');
        if (!fs.existsSync(p5PathFs)) {
            if (selected === '1.11') {
                const legacy = path.join(context.extensionPath, 'assets', 'p5.min.js');
                if (fs.existsSync(legacy)) {
                    p5PathFs = legacy;
                    versionLabel = 'legacy (unversioned fallback for 1.11)';
                }
            } else {
                versionLabel = selected + ' (missing)';
            }
        }
    } catch { /* ignore fs errors */ }

    const localResourceRoots = buildLiveLocalResourceRoots(context, editor);

    if (opts?.output) {
        try {
            const t = opts.getTime ? opts.getTime() : new Date().toLocaleTimeString();
            opts.output.appendLine(`${t} [ℹ️INFO] Using p5.js version ${versionLabel}`);
            // Warn about missing p5types for 2.1+ to inform users editor type definitions might be disabled
            try {
                const typesDir = path.join(context.extensionPath, 'assets', selected, 'p5types');
                if (selected !== '1.11' && !fs.existsSync(typesDir)) {
                    opts.output.appendLine(`${t} [⚠️WARN] No p5types found for version ${selected}; editor type definitions will be disabled.`);
                }
            } catch { }
        } catch { }
    }

    return { localResourceRoots, selectedVersion: selected, versionLabel };
}

// Helper to build p5-related script URIs for the webview, honoring versioned assets
// and falling back to legacy unversioned files for 1.11 when necessary.
export function getP5AssetUris(
    panel: vscode.WebviewPanel,
    extensionPath: string,
    opts?: { version?: string }
): { p5Uri: vscode.Uri; p5SoundUri: vscode.Uri; p5CaptureUri: vscode.Uri } {
    const selected = opts?.version || cfg.getP5jsVersion();

    function resolveAsset(fsRelPathVersioned: string, legacyRelPath: string) {
        try {
            const versioned = path.join(extensionPath, 'assets', selected, fsRelPathVersioned);
            if (fs.existsSync(versioned)) return versioned;
            if (selected === '1.11') {
                const legacy = path.join(extensionPath, 'assets', legacyRelPath);
                if (fs.existsSync(legacy)) return legacy;
            }
            return versioned; // return versioned path even if missing, to surface 404 in webview
        } catch {
            // On any error, fall back to versioned path to keep behavior consistent
            return path.join(extensionPath, 'assets', selected, fsRelPathVersioned);
        }
    }

    const p5Fs = resolveAsset('p5.min.js', 'p5.min.js');
    const p5SoundFs = resolveAsset('p5.sound.min.js', 'p5.sound.min.js');
    const p5CaptureFs = resolveAsset('p5.capture.umd.min.js', 'p5.capture.umd.min.js');

    const p5Uri = panel.webview.asWebviewUri(vscode.Uri.file(p5Fs));
    const p5SoundUri = panel.webview.asWebviewUri(vscode.Uri.file(p5SoundFs));
    const p5CaptureUri = panel.webview.asWebviewUri(vscode.Uri.file(p5CaptureFs));

    return { p5Uri, p5SoundUri, p5CaptureUri };
}
