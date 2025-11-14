import * as vscode from 'vscode';

export function handleShowInfo(msg: any) {
  if (msg && typeof msg.message === 'string') {
    try { vscode.window.showInformationMessage(msg.message); } catch { }
  }
}
