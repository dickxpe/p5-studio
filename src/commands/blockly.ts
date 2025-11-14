import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { config as cfg } from '../config';

export function registerBlocklyCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.open-blockly-json', async () => {
      try {
        const selectedP5Version = cfg.getP5jsVersion();
        const versioned = path.join(context.extensionPath, 'assets', selectedP5Version, 'blockly_categories.json');
        const fallbackV1 = path.join(context.extensionPath, 'assets', '1.11', 'blockly_categories.json');
        const legacy = path.join(context.extensionPath, 'blockly', 'blockly_categories.json');
        const chosen = fs.existsSync(versioned) ? versioned : (fs.existsSync(fallbackV1) ? fallbackV1 : legacy);
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(chosen));
        await vscode.window.showTextDocument(doc, { preview: false });
      } catch (e) {
        vscode.window.showErrorMessage('Could not open blockly_categories.json');
      }
    })
  );
}
