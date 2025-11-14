import * as vscode from 'vscode';
import { config as cfg } from '../config';

export function registerHelpCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openP5Ref', () => {
      try {
        const version = cfg.getP5jsVersion();
        const base = (version === '2.1') ? 'https://beta.p5js.org/reference/' : 'https://p5js.org/reference/';
        vscode.env.openExternal(vscode.Uri.parse(base));
      } catch {
        vscode.env.openExternal(vscode.Uri.parse('https://p5js.org/reference/'));
      }
    })
  );
}
