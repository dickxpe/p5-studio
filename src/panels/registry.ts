import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { config as cfg } from '../config';

export const LIVE_PANEL_VIEWTYPE = 'extension.live-p5';
export const BLOCKLY_PANEL_VIEWTYPE = 'blocklyPanel';

export const LIVE_PANEL_TITLE_PREFIX = 'LIVE: ';
export const BLOCKLY_PANEL_TITLE_PREFIX = 'BLOCKLY: ';

export function isLivePanelViewType(vt: string | undefined | null): boolean {
  const s = String(vt || '');
  return s === LIVE_PANEL_VIEWTYPE || s.endsWith(LIVE_PANEL_VIEWTYPE) || s.endsWith('.live-p5');
}

export function isLivePanelTab(tab: vscode.Tab | undefined | null): boolean {
  try {
    if (!tab) return false;
    const input: any = (tab as any).input;
    const vt = input && typeof input.viewType === 'string' ? String(input.viewType) : '';
    if (isLivePanelViewType(vt)) return true;
    const label = (tab as any).label ? String((tab as any).label) : '';
    return !!(label && label.startsWith(LIVE_PANEL_TITLE_PREFIX));
  } catch { return false; }
}

export function livePanelTitleForFile(fsPath: string): string {
  return LIVE_PANEL_TITLE_PREFIX + path.basename(fsPath || '');
}

export function blocklyPanelTitleForFile(fsPath: string): string {
  return BLOCKLY_PANEL_TITLE_PREFIX + path.basename(fsPath || '');
}

export function buildLiveLocalResourceRoots(context: vscode.ExtensionContext, editor: vscode.TextEditor): vscode.Uri[] {
  const roots: vscode.Uri[] = [];
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return roots;
    const selectedP5VersionForRoots = cfg.getP5jsVersion();
    roots.push(
      vscode.Uri.file(path.join(context.extensionPath, 'assets')),
      vscode.Uri.file(path.join(context.extensionPath, 'assets', selectedP5VersionForRoots)),
      vscode.Uri.file(path.join(context.extensionPath, 'images')),
      vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'common')),
      vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'import')),
      vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'media')),
    );
    // Include folder next to the sketch, if present
    try {
      const sketchFilePath = editor.document.fileName;
      const sketchDir = path.dirname(sketchFilePath);
      const includeDir = path.join(sketchDir, 'include');
      if (fs.existsSync(includeDir) && fs.statSync(includeDir).isDirectory()) {
        roots.push(vscode.Uri.file(includeDir));
      }
    } catch { /* ignore */ }
  } catch { /* ignore */ }
  return roots;
}
