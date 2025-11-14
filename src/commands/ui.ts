import * as vscode from 'vscode';
import { config as cfg } from '../config';

export function registerUICommands(
  context: vscode.ExtensionContext,
  deps: {
    LIVE_PANEL_TITLE_PREFIX: string;
    webviewPanelMap: Map<string, vscode.WebviewPanel>;
  }
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.toggleDebugButtonsOn', async () => {
      const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
      if (activeTab && activeTab.label && activeTab.label.startsWith(deps.LIVE_PANEL_TITLE_PREFIX)) {
        for (const [, panel] of deps.webviewPanelMap.entries()) {
          if (panel.title === activeTab.label) {
            await cfg.setShowDebugButton(true);
            panel.webview.postMessage({ type: 'toggleDebugButtons', show: true });
            break;
          }
        }
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('P5Studio.toggleDebugButtonsOff', async () => {
      const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
      if (activeTab && activeTab.label && activeTab.label.startsWith(deps.LIVE_PANEL_TITLE_PREFIX)) {
        for (const [, panel] of deps.webviewPanelMap.entries()) {
          if (panel.title === activeTab.label) {
            await cfg.setShowDebugButton(false);
            panel.webview.postMessage({ type: 'toggleDebugButtons', show: false });
            break;
          }
        }
      }
    })
  );
}
