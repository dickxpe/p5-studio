import * as vscode from 'vscode';
import type { ExtensionToWebviewMessage } from './messageTypes';
import { createHtml } from './createHtml';

export interface HtmlAndPostOptions {
    code: string;
    extensionPath: string;
    allowInteractiveTopInputs?: boolean;
    initialCaptureVisible?: boolean;
    p5Version?: string;
}

export interface FollowupMessage {
    delayMs: number;
    message: ExtensionToWebviewMessage;
}

export async function setHtmlAndPost(
    panel: vscode.WebviewPanel,
    options: HtmlAndPostOptions,
    followups: FollowupMessage[] = [],
    postMessage: (panel: vscode.WebviewPanel, msg: ExtensionToWebviewMessage) => void,
): Promise<void> {
    const { code, extensionPath, allowInteractiveTopInputs, initialCaptureVisible, p5Version } = options;
    const html = await createHtml(code, panel, extensionPath, {
        allowInteractiveTopInputs,
        initialCaptureVisible,
        p5Version,
    });
    panel.webview.html = html;

    if (!followups.length) return;

    for (const f of followups) {
        const delay = typeof f.delayMs === 'number' ? f.delayMs : 0;
        setTimeout(() => {
            try { postMessage(panel, f.message); } catch { }
        }, delay);
    }
}
