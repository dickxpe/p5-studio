import * as vscode from 'vscode';

const outputChannelMap = new Map<string, vscode.OutputChannel>();
let lastActiveOutputChannel: vscode.OutputChannel | null = null;

export function showAndTrackOutputChannel(ch: vscode.OutputChannel) {
    try { ch.show(true); } catch { }
    lastActiveOutputChannel = ch;
}

export function getOrCreateOutputChannel(docUri: string, fileName: string) {
    let channel = outputChannelMap.get(docUri);
    if (!channel) {
        channel = vscode.window.createOutputChannel('P5 STUDIO: ' + fileName);
        outputChannelMap.set(docUri, channel);
    }
    lastActiveOutputChannel = channel;
    return channel;
}

export function getLastActiveOutputChannel(): vscode.OutputChannel | null {
    return lastActiveOutputChannel;
}

export function disposeOutputForDoc(docUri: string) {
    const ch = outputChannelMap.get(docUri);
    try { ch?.dispose(); } catch { }
    outputChannelMap.delete(docUri);
    if (lastActiveOutputChannel === ch) lastActiveOutputChannel = null;
}

export function getOutputChannelForDoc(docUri: string): vscode.OutputChannel | undefined {
    return outputChannelMap.get(docUri);
}
