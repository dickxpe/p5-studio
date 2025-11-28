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
    const addRoot = (dir: string) => {
      try {
        const normalized = path.normalize(dir);
        roots.push(vscode.Uri.file(normalized));
        if (process.platform === 'win32') {
          const lower = normalized.toLowerCase();
          if (lower !== normalized) {
            roots.push(vscode.Uri.file(lower));
          }
        }
      } catch { /* ignore invalid root */ }
    };
    addRoot(path.join(context.extensionPath, 'assets'));
    addRoot(path.join(context.extensionPath, 'assets', selectedP5VersionForRoots));
    addRoot(path.join(context.extensionPath, 'images'));
    addRoot(workspaceFolder.uri.fsPath);
    addRoot(path.join(workspaceFolder.uri.fsPath, 'common'));
    addRoot(path.join(workspaceFolder.uri.fsPath, 'import'));
    addRoot(path.join(workspaceFolder.uri.fsPath, 'media'));
    // Include folders relevant to the sketch (current dir, parent include, workspace include)
    try {
      const sketchFilePath = editor.document.fileName;
      const sketchDir = path.dirname(sketchFilePath);
      const includeCandidates = new Set<string>();
      includeCandidates.add(sketchDir);
      includeCandidates.add(path.join(sketchDir, 'include'));
      const parentDir = path.dirname(sketchDir);
      if (parentDir && parentDir !== sketchDir) {
        includeCandidates.add(parentDir);
        includeCandidates.add(path.join(parentDir, 'include'));
      }
      includeCandidates.add(path.join(workspaceFolder.uri.fsPath, 'include'));
      for (const dir of includeCandidates) {
        addRoot(dir);
      }
    } catch { /* ignore */ }
  } catch { /* ignore */ }
  return roots;
}
