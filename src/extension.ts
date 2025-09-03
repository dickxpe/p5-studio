import * as path from 'path';
import * as vscode from 'vscode';
import * as ts from 'typescript';
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

function getText(editor: vscode.TextEditor): string {
  const text = editor.document.getText();
  if (editor.document.languageId === 'typescript') {
    try {
      return ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    } catch (e: any) {
      outputChannel.appendLine(`[TS Transpile Error]: ${e?.message ?? e}`);
      return text;
    }
  }
  return text;
}

async function createHtml(text: string, panel: vscode.WebviewPanel, extensionPath: string) {
  if (!/function\s+setup\s*\(/.test(text)) {
    text = `function setup() { createCanvas(window.innerWidth, window.innerHeight); background(255); }\n` + text;
  }
  if (!/createCanvas\s*\(/.test(text)) {
    text = text.replace(/function\s+setup\s*\(\)\s*\{/, match => `${match}\n createCanvas(window.innerWidth, window.innerHeight);`);
  }
  if (!/background\s*\(/.test(text)) {
    text = text.replace(/createCanvas\s*\([^\)]*\)\s*;?/, match => `${match}\n background(255);`);
  }

  const code = parser.parseCode(text);
  const escapedCode = JSON.stringify(code);

  const p5Path = vscode.Uri.file(path.join(extensionPath, 'assets', 'p5.min.js'));
  const p5Uri = panel.webview.asWebviewUri(p5Path);

  return `<!DOCTYPE html>
<html>
<head>
<style>
html, body { margin:0; padding:0; overflow:hidden; height:100%; width:100%; }
canvas.p5Canvas { display:block; }
#error-overlay { position:fixed; top:0; left:0; right:0; background:rgba(255,0,0,0.9); color:#fff; font-family:monospace; padding:8px 12px; display:none; z-index:9999; white-space:pre-wrap; }
</style>
</head>
<body>
<div id="error-overlay"></div>
<script>
const vscode = acquireVsCodeApi();
window._p5Instance = null;

// Forward console messages to VS Code
(function() {
    const originalLog = console.log;
    console.log = function(...args) {
        vscode.postMessage({ type: 'log', message: args });
        originalLog.apply(console, args);
    };
    const originalError = console.error;
    console.error = function(...args) {
        vscode.postMessage({ type: 'error', message: args.join(' ') });
        originalError.apply(console, args);
    };
    const originalWarn = console.warn;
    console.warn = function(...args) {
        vscode.postMessage({ type: 'log', message: args });
        originalWarn.apply(console, args);
    };
})();

function runUserSketch(userCode) {
    document.querySelectorAll('script[data-user-code]').forEach(s => s.remove());
    if(window._p5Instance) window._p5Instance.remove();

    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.dataset.userCode = 'true';
    s.textContent = userCode + "\\n//# sourceURL=userSketch_" + Date.now() + ".js";
    document.body.appendChild(s);

    window._p5Instance = new p5();
    if(window._p5Instance._renderer) window._p5Instance.resizeCanvas(window.innerWidth, window.innerHeight);
}

// Load p5.js first, then user sketch
const p5Script = document.createElement('script');
p5Script.src = '${p5Uri}';
p5Script.onload = () => { runUserSketch(${escapedCode}); };
p5Script.onerror = () => {
    const el = document.getElementById('error-overlay');
    if(el) { el.textContent = 'Failed to load p5.js'; el.style.display = 'block'; }
};
document.body.appendChild(p5Script);

// Listen for reload messages
window.addEventListener('message', event => {
    if(event.data.type === 'reload') runUserSketch(event.data.code);
});

// Resize canvas on panel resize
window.addEventListener('resize', () => {
    if(window._p5Instance?._renderer) window._p5Instance.resizeCanvas(window.innerWidth, window.innerHeight);
});
</script>
</body>
</html>`;
}

export function activate(context: vscode.ExtensionContext) {

  function updateP5Context() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return vscode.commands.executeCommand('setContext', 'isP5js', false);
    const text = editor.document.getText();
    const containsP5 = /\bfunction\s+setup\s*\(/.test(text) || /\bfunction\s+draw\s*\(/.test(text);
    vscode.commands.executeCommand('setContext', 'isP5js', containsP5);
  }

  updateP5Context();

  vscode.window.onDidChangeActiveTextEditor(() => {
    updateP5Context();
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const docUri = editor.document.uri.toString();
      vscode.commands.executeCommand('setContext', 'hasP5Webview', webviewPanelMap.has(docUri));
    } else vscode.commands.executeCommand('setContext', 'hasP5Webview', false);
  });

  // --- Live update while typing ---
  const updateWebview = debounce(() => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const docUri = editor.document.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (!panel) return;

    panel.webview.postMessage({ type: 'reload', code: getText(editor) });
  }, DEBOUNCE_DELAY);

  vscode.workspace.onDidChangeTextDocument(updateWebview);
  vscode.workspace.onDidSaveTextDocument(updateWebview);

  // --- LIVE P5 Command ---
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.live-p5', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const docUri = editor.document.uri.toString();

      let panel = webviewPanelMap.get(docUri);
      if (!panel) {
        panel = vscode.window.createWebviewPanel(
          'extension.live-p5',
          'LIVE: ' + path.basename(editor.document.fileName),
          vscode.ViewColumn.Two,
          { enableScripts: true, localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'assets'))], retainContextWhenHidden: true }
        );
        webviewPanelMap.set(docUri, panel);
        activeP5Panel = panel;

        panel.webview.onDidReceiveMessage(msg => {
          if (msg.type === 'log') {
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()} LOG]: ${msg.message.join(' ')}`);
            outputChannel.show(true);
          } else if (msg.type === 'error') {
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()} ERROR]: ${msg.message}`);
            outputChannel.show(true);
            panel.title = `⚠️ LIVE: ${path.basename(editor.document.fileName)}`;
          }
        });

        panel.onDidDispose(() => {
          webviewPanelMap.delete(docUri);
          if (activeP5Panel === panel) activeP5Panel = null;
          vscode.commands.executeCommand('setContext', 'hasP5Webview', false);
        });

        panel.webview.html = await createHtml(getText(editor), panel, context.extensionPath);
      }

      vscode.commands.executeCommand('setContext', 'hasP5Webview', true);
      panel.reveal(vscode.ViewColumn.Two, true);
    })
  );

  // --- Reload Command ---
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.reload-p5-sketch', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const docUri = editor.document.uri.toString();
      const panel = webviewPanelMap.get(docUri);
      if (!panel) { vscode.window.showWarningMessage('No active P5 panel to reload.'); return; }
      panel.webview.postMessage({ type: 'reload', code: getText(editor) });
      vscode.window.showInformationMessage('P5 sketch reloaded!');
    })
  );
}

export function deactivate() {
  webviewPanelMap.clear();
  outputChannel.dispose();
}
