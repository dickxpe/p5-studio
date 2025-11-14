import * as vscode from 'vscode';

export function registerCaptureCommands(
  context: vscode.ExtensionContext,
  deps: {
    getActiveP5Panel: () => vscode.WebviewPanel | undefined;
    toggleCapture: (panel: vscode.WebviewPanel) => Promise<void>;
  }
) {
  context.subscriptions.push(vscode.commands.registerCommand('P5Studio.captureToggle', async () => {
    const panel = deps.getActiveP5Panel();
    if (!panel) return;
    await deps.toggleCapture(panel);
  }));

  context.subscriptions.push(vscode.commands.registerCommand('P5Studio.captureToggleOn', async () => {
    const panel = deps.getActiveP5Panel();
    if (!panel) return;
    await deps.toggleCapture(panel);
  }));
}
