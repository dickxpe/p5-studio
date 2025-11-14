import * as vscode from 'vscode';

export function handleShowError(
  params: { panel: vscode.WebviewPanel; editor: vscode.TextEditor; message: any },
  deps: {
    getTime: () => string;
    formatSyntaxErrorMsg: (s: string) => string;
    outputChannel: vscode.OutputChannel;
  }
) {
  // Always prefix with timestamp and [RUNTIME ERROR] if string and not already prefixed
  let message = params.message;
  if (typeof message === 'string') {
    if (!message.startsWith('[‼️RUNTIME ERROR]')) {
      message = `[‼️RUNTIME ERROR] ${message}`;
    }
    const time = deps.getTime();
    if (!/^\d{2}:\d{2}:\d{2}/.test(message)) {
      message = `${time} ${message}`;
    }
    if (message.includes('[‼️SYNTAX ERROR')) {
      message = deps.formatSyntaxErrorMsg(message);
    }
    message = message.replace(/\[object Arguments\]/gi, 'no argument(s) ');
  }
  deps.outputChannel.appendLine(message);
  // Also fix overlay message
  const overlayMsg = typeof params.message === 'string' ? params.message.replace(/\[object Arguments\]/gi, 'no argument(s) ') : params.message;
  // Track last runtime error on the panel
  (params.panel as any)._lastRuntimeError = message;
  // Forward improved message to overlay if needed
  try {
    params.panel.webview.postMessage({ type: 'showError', message: overlayMsg });
  } catch { /* ignore */ }
}
