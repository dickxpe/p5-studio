import * as vscode from 'vscode';
import type { WebviewToExtensionMessage, ExtensionToWebviewMessage } from './messageTypes';
import type { ExtensionToBlocklyMessage, BlocklyToExtensionMessage } from '../blockly/messageTypes';

export type WebviewMessage = WebviewToExtensionMessage;

export function registerWebviewRouter(
  panel: vscode.WebviewPanel,
  handler: (msg: WebviewMessage) => void | Promise<void>,
): vscode.Disposable {
  return panel.webview.onDidReceiveMessage(handler);
}

export function postMessage(
  panel: vscode.WebviewPanel,
  msg: ExtensionToWebviewMessage
): Thenable<boolean> {
  return panel.webview.postMessage(msg);
}

export function postBlocklyMessage(
  panel: vscode.WebviewPanel,
  msg: ExtensionToBlocklyMessage
): Thenable<boolean> {
  return panel.webview.postMessage(msg);
}

export function registerBlocklyRouter(
  panel: vscode.WebviewPanel,
  handler: (msg: BlocklyToExtensionMessage) => void | Promise<void>,
): vscode.Disposable {
  return panel.webview.onDidReceiveMessage(handler);
}
