import * as path from 'path';
import * as vscode from 'vscode';
import * as ts from 'typescript';
import * as parser from './code-parser';

const outputChannel = vscode.window.createOutputChannel('LIVE P5');
const webviewPanelMap = new Map<string, vscode.WebviewPanel>();
let activeP5Panel: vscode.WebviewPanel | null = null;
const DEBOUNCE_DELAY = 150;

// --- Debounce helper ---
function debounce<Func extends (...args: any[]) => void>(fn: Func, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// --- Get code from editor (transpile TS if needed) ---
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
  function ensureP5Boilerplate(code: string): string {
    let text = code;
    const hasSetup = /function\s+setup\s*\(/.test(text);
    const hasDraw = /function\s+draw\s*\(/.test(text);

    if (!hasSetup) {
      text = `function setup() {\n  // setup will be wrapped\n}\n\n` + text;
    }
    if (!hasDraw && /line|ellipse|rect|circle|point/.test(text)) {
      text = `function draw() {\n  // draw will be wrapped\n}\n\n` + text;
    }
    return text;
  }

  text = ensureP5Boilerplate(text);
  const escapedCode = JSON.stringify(text);

  const p5Path = vscode.Uri.file(path.join(extensionPath, 'assets', 'p5.min.js'));
  const p5Uri = panel.webview.asWebviewUri(p5Path);

  return `<!DOCTYPE html>
<html>
<head>
<style>
html, body { margin:0; padding:0; overflow:hidden; height:100%; width:100%; background:#fff; }
canvas.p5Canvas { display:block; }
#error-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(255,0,0,0.95); color:#fff; font-family:monospace; padding:16px; display:none; z-index:9999; white-space:pre-wrap; overflow:auto; }
</style>
</head>
<body>
<div id="error-overlay"></div>
<script>
const vscode = acquireVsCodeApi();
window._p5Instance = null;
window._p5Background = null;

function showError(msg) {
    const el = document.getElementById('error-overlay');
    if (el) {
        el.textContent = msg;
        el.style.display = 'block';
    }
    if (window._p5Instance) {
        window._p5Instance.remove();
        window._p5Instance = null;
    }
    document.querySelectorAll('canvas').forEach(c => c.remove());
    console.error(msg);
}

function clearError() {
    const el = document.getElementById('error-overlay');
    if (el) {
        el.textContent = '';
        el.style.display = 'none';
    }
}

// --- Global error handlers ---
window.onerror = function(message, source, lineno, colno, error) {
    showError('[Runtime Error] ' + message + ' (line ' + lineno + ', column ' + colno + ')');
    return true;
};
window.addEventListener('unhandledrejection', function(event) {
    showError('[Promise Error] ' + (event.reason?.message || event.reason));
});

// --- Forward console messages to VSCode ---
(function(){
    const originalLog = console.log;
    console.log = function(...args){ vscode.postMessage({ type:'log', message: args }); originalLog.apply(console,args); };
    const originalError = console.error;
    console.error = function(...args){ vscode.postMessage({ type:'error', message: args.join(' ') }); originalError.apply(console,args); };
    const originalWarn = console.warn;
    console.warn = function(...args){ vscode.postMessage({ type:'log', message: args }); originalWarn.apply(console,args); };
})();

// --- Run user sketch ---
function runUserSketch(userCode){
    clearError(); // Clear old errors on reload

    document.querySelectorAll('script[data-user-code]').forEach(s=>s.remove());
    if(window._p5Instance){ window._p5Instance.remove(); window._p5Instance = null; }
    document.querySelectorAll('canvas').forEach(c => c.remove());
    window._p5Background = null;

    const wrappedCode = \`
\${userCode}

// Wrap setup
if(typeof setup==='function'){
    const userSetup = setup;
    setup = function(){
        try {
            createCanvas(window.innerWidth, window.innerHeight);
            userSetup();
            const c = get(0,0);
            window._p5Background = color(c[0],c[1],c[2],c[3]);
            clearError();
        } catch(e){
            showError('[Setup Error] ' + (e.message||e));
            throw e;
        }
    }
}

// Wrap draw
if(typeof draw==='function'){
    const userDraw = draw;
    draw = function(){
        try{
            userDraw();
        } catch(e){
            showError('[Draw Error] ' + (e.message||e));
            throw e;
        }
    }
}
\`;

    try {
        // ✅ Syntax check before injecting
        new Function(wrappedCode);

        // Append script only if syntax is valid
        const s = document.createElement('script');
        s.type='text/javascript';
        s.dataset.userCode='true';
        s.textContent = wrappedCode;
        document.body.appendChild(s);

        window._p5Instance = new p5();
    } catch(e) {
        // Include line/column if available from SyntaxError
        let msg = '[Syntax Error] ' + (e.message || e);
        if (e.lineNumber) msg += ' (line ' + e.lineNumber + ', column ' + (e.columnNumber || '?') + ')';
        showError(msg);
    }
}

// --- Load p5.js ---
const p5Script = document.createElement('script');
p5Script.src='${p5Uri}';
p5Script.onload=()=>{ runUserSketch(${escapedCode}); };
p5Script.onerror=()=>{ showError('Failed to load p5.js'); };
document.body.appendChild(p5Script);

// --- Handle reload messages from VS Code ---
window.addEventListener('message', event=>{
    if(event.data.type==='reload') runUserSketch(event.data.code);
});

// --- Resize canvas and reapply background ---
window.addEventListener('resize',()=>{
    if(window._p5Instance?._renderer){
        window._p5Instance.resizeCanvas(window.innerWidth, window.innerHeight);
        if(window._p5Background){
            window._p5Instance.background(window._p5Background);
        } else {
            window._p5Instance.background(255);
        }
    }
});
</script>
</body>
</html>`;
}



// --- Activate extension ---
export function activate(context: vscode.ExtensionContext) {

  // --- Context detection ---
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

  // --- Debounce per document for live update ---
  const debounceMap = new Map<string, Function>();
  function updateDocumentPanel(document: vscode.TextDocument) {
    const docUri = document.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (!panel) return;
    panel.webview.postMessage({ type: 'reload', code: document.getText() });
  }
  function debounceDocumentUpdate(document: vscode.TextDocument) {
    updateP5Context();
    const docUri = document.uri.toString();
    if (!debounceMap.has(docUri)) {
      debounceMap.set(docUri, debounce(() => updateDocumentPanel(document), DEBOUNCE_DELAY));
    }
    debounceMap.get(docUri)!();
  }

  vscode.workspace.onDidChangeTextDocument(e => debounceDocumentUpdate(e.document));
  vscode.workspace.onDidSaveTextDocument(e => debounceDocumentUpdate(e));

  // --- LIVE P5 command ---
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

  // --- Reload button ---
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

// --- Deactivate ---
export function deactivate() {
  webviewPanelMap.clear();
  outputChannel.dispose();
}
