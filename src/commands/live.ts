import * as vscode from 'vscode';

export function registerLiveCommands(
    context: vscode.ExtensionContext,
    deps: {
        openLive: () => Promise<void>;
    }
) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.live-p5', async () => {
            await deps.openLive();
        })
    );
}
