import * as path from 'path';
import * as vscode from 'vscode';

const webviewPanelMap = new Map<string, vscode.WebviewPanel>();
let activeP5Panel: vscode.WebviewPanel | null = null;
const DEBOUNCE_DELAY = 150;

const autoReloadListenersMap = new Map<
  string,
  { changeListener?: vscode.Disposable; saveListener?: vscode.Disposable }
>();

function debounce<Func extends (...args: any[]) => void>(fn: Func, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function getTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// ----------------------------
// Create Webview HTML
// ----------------------------
async function createHtml(
  userCode: string,
  panel: vscode.WebviewPanel,
  extensionPath: string
) {
  const p5Path = vscode.Uri.file(path.join(extensionPath, 'assets', 'p5.min.js'));
  const p5Uri = panel.webview.asWebviewUri(p5Path);

  const reloadIconPath = vscode.Uri.file(path.join(extensionPath, 'images', 'reload.svg'));
  const reloadIconUri = panel.webview.asWebviewUri(reloadIconPath);

  const showReloadButton = vscode.workspace
    .getConfiguration('liveP5')
    .get<boolean>('showReloadButton', true);

  function escapeBackticks(str: string) {
    return str.replace(/`/g, '\\`');
  }

  const escapedCode = escapeBackticks(userCode);

  return `<!DOCTYPE html>
<html>
<head>
<style>
html,body{margin:0;padding:0;overflow:hidden;width:100%;height:100%;background:transparent;}
canvas.p5Canvas{display:block;}
#error-overlay{
  position:fixed; top:0; left:0; right:0; bottom:0;
  background:rgba(255,0,0,0.95); color:#fff; font-family:monospace; padding:10px;
  display:none; z-index:9999; white-space:pre-wrap; overflow:auto;
}
#reload-button {
  position: fixed; top: 10px; right: 10px; width: 16px; height: 16px;
  background: white; border-radius: 4px; display: ${showReloadButton ? "flex" : "none"};
  align-items: center; justify-content: center; cursor: pointer; z-index: 9999;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
#reload-button img { width: 12px; height: 12px; }
</style>
</head>
<body>
<div id="error-overlay"></div>
<div id="reload-button"><img src="${reloadIconUri}" title="Reload P5 Sketch"></div>
<script>
const vscode = acquireVsCodeApi();
window._p5Instance = null;
window._p5UserDefinedCanvas = false;
window._p5UserAutoFill = false;
window._p5UserBackground = false;
window._p5LastBackgroundArgs = null;
window._p5ErrorLogged = false;

// Notify extension that webview is loaded
window.addEventListener('DOMContentLoaded', () => {
  vscode.postMessage({ type: 'webviewLoaded' });
});

function showError(msg){
  const el = document.getElementById("error-overlay");
  if(el){el.textContent = msg; el.style.display = "block";}
  if(window._p5Instance){window._p5Instance.remove(); window._p5Instance = null;}
  document.querySelectorAll("canvas").forEach(c=>c.remove());
}
function clearError(){ const el=document.getElementById("error-overlay"); if(el){el.textContent=""; el.style.display="none";} }

(function(){
  const origLog=console.log;
  console.log=function(...args){vscode.postMessage({type:"log",message:args}); origLog.apply(console,args);}
  const origErr=console.error;
  console.error=function(...args){
    // Always prefix with [RUNTIME ERROR] and stringify arguments, including Arguments objects and Error objects
    let msg = Array.prototype.map.call(args, a => {
      if (typeof a === "string") return a;
      if (Object.prototype.toString.call(a) === "[object Arguments]") return Array.prototype.join.call(a, " ");
      if (a instanceof Error) return a.message;
      return (a && a.toString ? a.toString() : String(a));
    }).join(" ");
    if (!msg.startsWith("[RUNTIME ERROR]")) {
      msg = "[RUNTIME ERROR] " + msg;
    }
    showError(msg); // Always show in overlay
    vscode.postMessage({type:"showError",message:msg}); // Always log in output
    origErr.apply(console,args);
  }
})();

window.onerror = function(message, source, lineno, colno, error) {
  let msg = message && message.toString ? message.toString() : String(message);
  if (!msg.startsWith('[RUNTIME ERROR]')) {
    msg = '[RUNTIME ERROR] ' + msg;
  }
  showError(msg);
  vscode.postMessage({ type: 'showError', message: msg });
  return false; // Let the error propagate in the console as well
};

function runUserSketch(code){
  clearError();
  window._p5ErrorLogged = false;
  if(window._p5Instance){window._p5Instance.remove();window._p5Instance=null;}
  document.querySelectorAll("canvas").forEach(c=>c.remove());

  // Remove ALL previous <script> tags except the p5.js script
  const scripts = Array.from(document.querySelectorAll('script'));
  scripts.forEach(s => {
    if (!s.src || !s.src.includes('p5.min.js')) s.parentNode && s.parentNode.removeChild(s);
  });

  // Inject user code as a <script> tag (not Function constructor)
  const userScript = document.createElement('script');
  userScript.type = 'text/javascript';
  userScript.dataset.userCode = 'true';
  userScript.textContent = code;
  document.body.appendChild(userScript);

  window._p5Instance=new p5();
}

const p5Script=document.createElement("script");
p5Script.src="${p5Uri}";
p5Script.onload=()=>{ runUserSketch(\`${escapedCode}\`); };
p5Script.onerror=()=>{ showError("Failed to load p5.js"); };
document.body.appendChild(p5Script);

document.getElementById("reload-button").addEventListener("click",()=>{vscode.postMessage({type:"reload-button-clicked"});});

window.addEventListener("resize",()=>{ 
  if(window._p5Instance?._renderer && window._p5UserAutoFill){
    window._p5Instance.resizeCanvas(window.innerWidth,window.innerHeight);
    const bgArgs = window._p5LastBackgroundArgs || [255];
    if(window._p5UserBackground) window._p5Instance.background(...bgArgs);
  }
});

window.addEventListener("message", e => {
  const data = e.data;
  switch(data.type){
    case "reload": runUserSketch(data.code); break;
    case "stop": if(window._p5Instance){window._p5Instance.remove(); window._p5Instance=null;} document.querySelectorAll("canvas").forEach(c=>c.remove()); break;
    case "showError": showError(data.message); break;
    case "toggleReloadButton": document.getElementById("reload-button").style.display = data.show ? "flex" : "none"; break;
    case "resetErrorFlag": window._p5ErrorLogged = false; break;
    case "syntaxError": showError(data.message); break; // <-- Add this line
    case "requestLastRuntimeError":
      // If there was a runtime error, re-send it to the extension
      if (window._p5ErrorLogged && window._p5Instance == null) {
        const el = document.getElementById("error-overlay");
        if (el && el.textContent) {
          // --- FIX: Always prefix with [RUNTIME ERROR] if not present ---
          let msg = el.textContent;
          if (!msg.startsWith("[RUNTIME ERROR]")) {
            msg = "[RUNTIME ERROR] " + msg;
          }
          vscode.postMessage({type:"showError",message:msg});
        }
      }
      break;
  }
});
</script>
</body>
</html>`;
}

// ----------------------------
// Activate
// ----------------------------
export function activate(context: vscode.ExtensionContext) {
  // Create output channel and register with context to ensure it appears in Output panel
  const outputChannel = vscode.window.createOutputChannel('LIVE P5');
  context.subscriptions.push(outputChannel);

  function updateP5Context(editor?: vscode.TextEditor) {
    editor = editor || vscode.window.activeTextEditor;
    if (!editor) return vscode.commands.executeCommand('setContext', 'isP5js', false);
    const text = editor.document.getText();
    const containsP5 = /\bfunction\s+setup\s*\(/.test(text) || /\bfunction\s+draw\s*\(/.test(text);
    vscode.commands.executeCommand('setContext', 'isP5js', containsP5);
  }

  updateP5Context();

  vscode.window.onDidChangeActiveTextEditor(editor => {
    updateP5Context(editor);
    if (!editor) return;
    const docUri = editor.document.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (panel) {
      panel.reveal(panel.viewColumn, true);
      activeP5Panel = panel;
      vscode.commands.executeCommand('setContext', 'hasP5Webview', true);
    } else {
      vscode.commands.executeCommand('setContext', 'hasP5Webview', false);
    }
    if (editor) updateAutoReloadListeners(editor);
  });

  const debounceMap = new Map<string, Function>();
  function debounceDocumentUpdate(document: vscode.TextDocument, forceLog = false) {
    const docUri = document.uri.toString();
    if (!debounceMap.has(docUri)) debounceMap.set(docUri, debounce((doc, log) => updateDocumentPanel(doc, log), DEBOUNCE_DELAY));
    debounceMap.get(docUri)!(document, forceLog);
  }

  async function updateDocumentPanel(document: vscode.TextDocument, forceLog = false) {
    const docUri = document.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (!panel) return;

    const code = document.getText();
    let syntaxErrorMsg: string | null = null;
    let hadSyntaxError = false;
    try {
      new Function(code); // syntax check
      const hasSetup = /\bfunction\s+setup\s*\(/.test(code);
      const hasDraw = /\bfunction\s+draw\s*\(/.test(code);

      if (!hasSetup && !hasDraw) {
        syntaxErrorMsg = `${getTime()} [SYNTAX ERROR in ${path.basename(document.fileName)}] Missing required function: setup() or draw()`;
        panel.webview.html = await createHtml('', panel, context.extensionPath);
        hadSyntaxError = true;
      } else {
        // Always reload HTML for every code update to reset JS environment
        panel.webview.html = await createHtml(code, panel, context.extensionPath);
      }
    } catch (err: any) {
      syntaxErrorMsg = `${getTime()} [SYNTAX ERROR in ${path.basename(document.fileName)}] ${err.message}`;
      panel.webview.html = await createHtml('', panel, context.extensionPath);
      hadSyntaxError = true;
    }

    // Always show syntax errors in overlay
    if (syntaxErrorMsg) {
      setTimeout(() => {
        panel.webview.postMessage({ type: 'syntaxError', message: syntaxErrorMsg });
      }, 150);

      // Always log syntax errors, regardless of last error or forceLog
      outputChannel.show(true);
      outputChannel.appendLine(syntaxErrorMsg);
      (panel as any)._lastSyntaxError = syntaxErrorMsg;
      (panel as any)._lastRuntimeError = null;
    } else {
      (panel as any)._lastSyntaxError = null;
      (panel as any)._lastRuntimeError = null;
    }
  }

  // ----------------------------
  // LIVE P5 panel command
  // ----------------------------
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.live-p5', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const docUri = editor.document.uri.toString();
      let panel = webviewPanelMap.get(docUri);
      const code = editor.document.getText();

      if (!panel) {
        panel = vscode.window.createWebviewPanel(
          'extension.live-p5',
          'LIVE: ' + path.basename(editor.document.fileName),
          vscode.ViewColumn.Two,
          {
            enableScripts: true,
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, 'assets')),
              vscode.Uri.file(path.join(context.extensionPath, 'images'))
            ],
            retainContextWhenHidden: true
          }
        );

        webviewPanelMap.set(docUri, panel);
        activeP5Panel = panel;
        vscode.commands.executeCommand('setContext', 'hasP5Webview', true);

        panel.webview.onDidReceiveMessage(msg => {
          if (msg.type === 'log') {
            outputChannel.appendLine(`[${getTime()} LOG]: ${msg.message.join(' ')}`);
            outputChannel.show(true);
          } else if (msg.type === 'showError') {
            // Always prefix with timestamp and [RUNTIME ERROR] if not present
            let message = msg.message;
            if (typeof message === "string") {
              if (!message.startsWith("[RUNTIME ERROR]")) {
                message = `[RUNTIME ERROR] ${message}`;
              }
              // Add timestamp if not present
              const time = getTime();
              if (!/^\d{2}:\d{2}:\d{2}/.test(message)) {
                message = `${time} ${message}`;
              }
            }
            outputChannel.appendLine(message);
            outputChannel.show(true);
            const docUri = editor.document.uri.toString();
            const panel = webviewPanelMap.get(docUri);
            if (panel) (panel as any)._lastRuntimeError = message;
          } else if (msg.type === 'reload-button-clicked') {
            debounceDocumentUpdate(editor.document, false); // use false to match typing
          } else if (msg.type === 'requestLastRuntimeError') {
            // No-op in extension, handled in webview below
          }
        });

        panel.onDidDispose(() => {
          webviewPanelMap.delete(docUri);
          if (activeP5Panel === panel) activeP5Panel = null;
          vscode.commands.executeCommand('setContext', 'hasP5Webview', false);

          const listeners = autoReloadListenersMap.get(docUri);
          listeners?.changeListener?.dispose();
          listeners?.saveListener?.dispose();
          autoReloadListenersMap.delete(docUri);
        });

        // Only set HTML on first open
        panel.webview.html = await createHtml(code, panel, context.extensionPath);
        setTimeout(() => {
          panel.webview.postMessage({ type: 'reload', code });
        }, 100);
      } else {
        panel.reveal(panel.viewColumn, true);
        // Only send reload message on reveal, do not set HTML again
        setTimeout(() => {
          panel.webview.postMessage({ type: 'reload', code });
        }, 100);
      }

      updateP5Context(editor);
      if (editor) updateAutoReloadListeners(editor);
    })
  );

  // ----------------------------
  // Reload sketch command
  // ----------------------------
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.reload-p5-sketch', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      debounceDocumentUpdate(editor.document, false); // use false to match typing
    })
  );

  // ----------------------------
  // Open selected text in p5 reference
  // ----------------------------
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openSelectedText', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.selection && !editor.selection.isEmpty) {
        const search = encodeURIComponent(editor.document.getText(editor.selection));
        vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/p5/${search}`));
      }
    })
  );

  // ----------------------------
  // P5 Reference status bar button
  // ----------------------------
  const p5RefStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  p5RefStatusBar.command = 'extension.openP5Ref';
  p5RefStatusBar.text = '$(book) P5 Reference';
  p5RefStatusBar.color = '#ff0000';
  p5RefStatusBar.tooltip = 'Open P5.js Reference';
  p5RefStatusBar.show();
  context.subscriptions.push(p5RefStatusBar);

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openP5Ref', () => {
      vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/`));
    })
  );

  // ----------------------------
  // Show/hide reload button dynamically
  // ----------------------------
  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('liveP5.showReloadButton')) {
      const show = vscode.workspace.getConfiguration('liveP5').get<boolean>('showReloadButton', true);
      webviewPanelMap.forEach(panel => panel.webview.postMessage({ type: 'toggleReloadButton', show }));
    }
  });

  // ----------------------------
  // Auto-reload listeners
  // ----------------------------
  function updateAutoReloadListeners(editor: vscode.TextEditor) {
    const docUri = editor.document.uri.toString();
    const reloadWhileTyping = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadWhileTyping', true);
    const reloadOnSave = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadOnSave', true);

    const existing = autoReloadListenersMap.get(docUri);
    existing?.changeListener?.dispose();
    existing?.saveListener?.dispose();

    let changeListener: vscode.Disposable | undefined;
    let saveListener: vscode.Disposable | undefined;

    if (reloadWhileTyping) {
      changeListener = vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document.uri.toString() === docUri) debounceDocumentUpdate(e.document, false);
      });
    }
    if (reloadOnSave) {
      saveListener = vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.uri.toString() === docUri) debounceDocumentUpdate(doc, false); // use false to match typing
      });

      autoReloadListenersMap.set(docUri, { changeListener, saveListener });
    }
  }

  // Place this at the top of activate()
  const forceRuntimeLogMap = new WeakMap<vscode.TextDocument, boolean>();
}

export function deactivate() {
  webviewPanelMap.forEach(panel => panel.dispose());
  autoReloadListenersMap.forEach(listeners => {
    listeners.changeListener?.dispose();
    listeners.saveListener?.dispose();
  });
}
autoReloadListenersMap.forEach(listeners => {
  listeners.changeListener?.dispose();
  listeners.saveListener?.dispose();
});


