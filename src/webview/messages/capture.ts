import * as vscode from 'vscode';

export function handleCaptureVisibilityChanged(
  params: { panel: vscode.WebviewPanel; editor: vscode.TextEditor; visible: boolean },
  deps: {
    setCaptureVisible: (docUri: string, visible: boolean) => void;
    setContext: (key: string, val: any) => Thenable<unknown> | void;
    isActivePanel: (panel: vscode.WebviewPanel) => boolean;
  }
) {
  try {
    const docUri = params.editor.document.uri.toString();
    deps.setCaptureVisible(docUri, !!params.visible);
    if (deps.isActivePanel(params.panel)) {
      deps.setContext('p5CaptureVisible', !!params.visible);
    }
  } catch {
    // ignore
  }
}
