import * as path from 'path';
import * as ts from 'typescript';
import * as vscode from 'vscode';
import * as parser from './code-parser';

const outputChannel = vscode.window.createOutputChannel('LIVE P5');
const webviewPanelMap = new Map<string, vscode.WebviewPanel>();
let activeP5Panel: vscode.WebviewPanel | null = null;

const DEBOUNCE_DELAY = 150;

function debounce<Func extends (...args: any[]) => void>(fn: Func, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

async function listFilesRecursively(folderUri: vscode.Uri, extensions: string[] = []): Promise<string[]> {
  const entries = await vscode.workspace.fs.readDirectory(folderUri);
  const filePromises = entries.map(async ([name, type]) => {
    const filePath = path.join(folderUri.fsPath, name);
    const fileUri = vscode.Uri.file(filePath);
    if (type === vscode.FileType.Directory) return listFilesRecursively(fileUri, extensions);
    if (type === vscode.FileType.File && (extensions.length === 0 || extensions.includes(path.extname(name).toLowerCase()))) return [fileUri.fsPath];
    return [];
  });
  const files = await Promise.all(filePromises);
  return files.flat();
}

// ---------------- Activate ----------------
export function activate(context: vscode.ExtensionContext) {
  const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  myStatusBarItem.text = "P5 Reference";
  myStatusBarItem.command = 'extension.openP5Ref';
  myStatusBarItem.color = "#FF0000";
  myStatusBarItem.show();
  context.subscriptions.push(myStatusBarItem);

  // ---------- Commands ----------
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openP5Ref', () => {
      vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/`));
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openSelectedText', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.selection.isEmpty) return;
      const search = encodeURIComponent(editor.document.getText(editor.selection));
      vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/p5/${search}`));
    })
  );

  function getText(editor: vscode.TextEditor): string {
    const text = editor.document.getText();
    if (editor.document.languageId === 'typescript') {
      return ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    }
    return text;
  }

  function updateHasP5WebviewContext(document?: vscode.TextDocument) {
    if (!document) document = vscode.window.activeTextEditor?.document;
    if (!document) return;
    const docUri = document.uri.toString();
    const exists = webviewPanelMap.has(docUri);
    vscode.commands.executeCommand('setContext', 'hasP5Webview', exists);
  }

  const updateP5Panel = async (editor: vscode.TextEditor) => {
    const docUri = editor.document.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (!panel) return;

    const code = getText(editor);

    // Send a message to the webview to reload the sketch
    panel.webview.postMessage({ type: 'reload', code });
  };

  const updateWebview = debounce(async (document: vscode.TextDocument) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document !== document) return;
    await updateP5Panel(editor);
  }, DEBOUNCE_DELAY);

  // ---------- Live P5 Command ----------
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.live-p5', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const docUri = editor.document.uri.toString();
      const activeFilename = path.basename(editor.document.fileName);

      let panel = webviewPanelMap.get(docUri);
      if (!panel) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return;

        panel = vscode.window.createWebviewPanel(
          'extension.live-p5',
          'LIVE: ' + activeFilename,
          vscode.ViewColumn.Two,
          {
            enableScripts: true,
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, 'assets')),
              vscode.Uri.file(path.join(context.extensionPath, 'node_modules')),
              vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'common')),
            ],
            retainContextWhenHidden: true
          }
        );

        webviewPanelMap.set(docUri, panel);
        activeP5Panel = panel;

        panel.webview.onDidReceiveMessage(msg => {
          if (msg.type === 'log') {
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()} LOG]: ${msg.message.join(' ')}`);
            outputChannel.show(true);
          } else if (msg.type === 'error') {
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()} ERROR]: ${msg.message} (${msg.line}:${msg.column})`);
            outputChannel.show(true);
            panel.title = `⚠️ LIVE: ${activeFilename}`;
          }
        }, undefined, context.subscriptions);

        panel.onDidChangeViewState(e => {
          if (e.webviewPanel.active) activeP5Panel = e.webviewPanel;
        });

        panel.onDidDispose(() => {
          webviewPanelMap.delete(docUri);
          if (activeP5Panel === panel) activeP5Panel = null;
          vscode.commands.executeCommand('setContext', 'inP5Webview', false);
          updateHasP5WebviewContext(editor.document);
        });

        // Set initial HTML
        const assetsPath = vscode.Uri.file(path.join(context.extensionPath, 'assets'));
        panel.webview.html = await createHtml(getText(editor), assetsPath, panel);
      }

      vscode.commands.executeCommand('setContext', 'inP5Webview', true);
      updateHasP5WebviewContext(editor.document);

      // Trigger initial update
      await updateP5Panel(editor);
      panel.reveal(vscode.ViewColumn.Two, true);
      outputChannel.show(true);
    })
  );

  // ---------- Reload Command ----------
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.reload-p5-sketch', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const docUri = editor.document.uri.toString();
      const panel = webviewPanelMap.get(docUri);
      if (!panel) {
        vscode.window.showWarningMessage("No active P5 panel to reload.");
        return;
      }

      panel.reveal(vscode.ViewColumn.Two, true);
      await updateP5Panel(editor);
      vscode.window.showInformationMessage("P5 sketch reloaded!");
    })
  );

  // ---------- Context detection ----------
  const setCustomContext = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return vscode.commands.executeCommand('setContext', 'isP5js', false);
    const text = editor.document.getText();
    const containsP5 = /\s*function\s+setup\s*\(\s*\)\s*\{/.test(text) || /\s*function\s+draw\s*\(\s*\)\s*\{/.test(text);
    vscode.commands.executeCommand('setContext', 'isP5js', containsP5);
  };

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      setCustomContext();
      updateHasP5WebviewContext();
    }),
    vscode.workspace.onDidChangeTextDocument(event => {
      if (event.document === vscode.window.activeTextEditor?.document) {
        setCustomContext();
        updateHasP5WebviewContext(event.document);
      }
    }),
    vscode.workspace.onDidChangeTextDocument(e => updateWebview(e.document)),
    vscode.workspace.onDidSaveTextDocument(doc => updateWebview(doc))
  );

  setCustomContext();
  updateHasP5WebviewContext();
}

// ---------------- createHtml ----------------
async function createHtml(text: string, assetsPath: vscode.Uri, panel: vscode.WebviewPanel) {
  // Ensure setup() exists
  if (!/function\s+setup\s*\(/.test(text)) {
    text = `function setup() { createCanvas(window.innerWidth, window.innerHeight); background(255); }\n` + text;
  }

  // Ensure createCanvas() exists
  if (!/createCanvas\s*\(/.test(text)) {
    text = text.replace(/function\s+setup\s*\(\)\s*\{/, match => `${match}\n createCanvas(window.innerWidth, window.innerHeight);`);
  }

  // Ensure background() exists
  if (!/background\s*\(/.test(text)) {
    text = text.replace(/createCanvas\s*\([^\)]*\)\s*;?/, match => `${match}\n background(255);`);
  }

  // Parse the code
  const code = parser.parseCode(text);

  // Scripts to include
  const scripts: string[] = [path.join(assetsPath.path, 'p5.min.js')];

  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
      const commonFiles = await listFilesRecursively(
        vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, "common")),
        [".ts", ".js"]
      );
      commonFiles.forEach(file => scripts.push(file));
    }

    const scriptTags = scripts
      .map(s => panel.webview.asWebviewUri(vscode.Uri.file(s)))
      .map(uri => `<script src="${uri}"></script>`)
      .join('\n');

    // Return HTML
    return `<!DOCTYPE html>
<html>
<head>
${scriptTags}
<style>
html, body { margin: 0; padding: 0; overflow: hidden; height: 100%; width: 100%; }
canvas.p5Canvas { display: block; }
</style>
</head>
<body></body>
<script>
const vscode = acquireVsCodeApi();

// Save user setup/draw if needed
window.userCode = \`${code}\`;

// Function to create new P5 instance
function createP5Instance(userCode) {
    // Remove old instance and canvas
    if (window._p5Instance) {
        try { window._p5Instance.remove(); } catch {}
        window._p5Instance = null;
    }
    document.querySelectorAll('canvas').forEach(c => c.remove());
    document.querySelectorAll('script[data-user-code]').forEach(s => s.remove());

    // Inject user code
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.dataset.userCode = 'true';
    s.textContent = userCode + \`\\n//# sourceURL=userSketch_\${Date.now()}.js\`;
    document.body.appendChild(s);

    // Create new P5 instance
    window._p5Instance = new p5();

    // Resize canvas to fit webview
    const p = window._p5Instance;
    if (p._renderer) {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    }
}

// Listen for reload messages
window.addEventListener('message', event => {
    const msg = event.data;
    if (msg.type === 'reload') {
        try {
            createP5Instance(msg.code);
        } catch(e) {
            vscode.postMessage({ type: 'error', message: e.message });
        }
    }
});

// Initial P5 instance
createP5Instance(window.userCode);

// Resize listener for dynamic panel size changes
window.addEventListener('resize', () => {
    if (!window._p5Instance?._renderer) return;
    const p = window._p5Instance;
    p.resizeCanvas(window.innerWidth, window.innerHeight);
});
</script>
</html>`;
  } catch (err: any) {
    outputChannel.appendLine(`[Error in createHtml]: ${err.message}`);
    outputChannel.show(true);
    return `<body><h2>Error loading sketch</h2></body>`;
  }
}


// ---------------- Deactivate ----------------
export function deactivate(): void {
  webviewPanelMap.clear();
  outputChannel.dispose();
}
