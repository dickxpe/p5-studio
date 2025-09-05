import * as path from 'path';
import * as vscode from 'vscode';
import * as ts from 'typescript';

const outputChannel = vscode.window.createOutputChannel('LIVE P5');
const webviewPanelMap = new Map<string, vscode.WebviewPanel>();
let activeP5Panel: vscode.WebviewPanel | null = null;
const DEBOUNCE_DELAY = 150;

const autoReloadListenersMap = new Map<
  string,
  { changeListener?: vscode.Disposable; saveListener?: vscode.Disposable }
>();

const diagnosticsCollection = vscode.languages.createDiagnosticCollection('liveP5');

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
// Syntax check and line detection
// ----------------------------
function checkSyntax(code: string): { valid: boolean; message?: string; line?: number } {
  const result = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext },
    reportDiagnostics: true
  });

  if (!result.diagnostics || result.diagnostics.length === 0) return { valid: true };

  const diag = result.diagnostics[0];
  const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
  const line = diag.start !== undefined && diag.file
    ? diag.file.getLineAndCharacterOfPosition(diag.start).line + 1
    : 1;

  return { valid: false, message, line };
}



// ----------------------------
// Create Webview HTML
// ----------------------------
async function createHtml(
  text: string,
  panel: vscode.WebviewPanel,
  extensionPath: string,
  initialError?: { message: string; line: number; fileName: string }
) {
  const ensureP5Boilerplate = (code: string) => {
    let txt = code;
    if (!/function\s+setup\s*\(/.test(txt)) txt = `function setup(){/*setup*/}\n` + txt;
    if (!/function\s+draw\s*\(/.test(txt) && /line|ellipse|rect|circle|point/.test(txt))
      txt = `function draw(){/*draw*/}\n` + txt;
    return txt;
  };
  text = ensureP5Boilerplate(text);

  function escapeBackticks(str: string) {
    return str.replace(/`/g, "\\`");
  }
  const escapedCode = escapeBackticks(text);

  const fileName = path.basename(panel.title.replace(/^LIVE: /, "") || "sketch.js");
  const initialErrorMessage = initialError ? escapeBackticks(initialError.message) : "";
  const initialErrorLine = initialError ? initialError.line : 1;

  const p5Path = vscode.Uri.file(path.join(extensionPath, "assets", "p5.min.js"));
  const p5Uri = panel.webview.asWebviewUri(p5Path);
  const reloadIconPath = vscode.Uri.file(path.join(extensionPath, "images", "reload.svg"));
  const reloadIconUri = panel.webview.asWebviewUri(reloadIconPath);
  const showReloadButton = vscode.workspace
    .getConfiguration("liveP5")
    .get<boolean>("showReloadButton", true);

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

// --- Error utils ---
function getTime(){ return new Date().toTimeString().split(" ")[0]; }
function sanitizeMessage(msg){ if(!msg) return msg; return msg.replace(/\\[object Arguments\\]/g,"MISSING ARGUMENT(S) "); }
function formatError(msg,type="RUNTIME ERROR",file="${fileName}",line="?"){ return \`[\${getTime()} \${type} on Line \${line} in \${file}] \${sanitizeMessage(msg)}\`; }
function showError(msg){
  let overlayMsg = msg.replace(/^\\[\\d{2}:\\d{2}:\\d{2} /,"[");
  const el=document.getElementById("error-overlay"); if(el){el.textContent=overlayMsg; el.style.display="block";}
  if(window._p5Instance){window._p5Instance.remove();window._p5Instance=null;}
  document.querySelectorAll("canvas").forEach(c=>c.remove());
}
function clearError(){ const el=document.getElementById("error-overlay"); if(el){el.textContent=""; el.style.display="none";} }

// --- Show initial syntax error ---
document.addEventListener("DOMContentLoaded",()=>{
  if("${initialErrorMessage}"){
    const msg = formatError("${initialErrorMessage}","SYNTAX ERROR","${fileName}",${initialErrorLine});
    showError(msg);
    vscode.postMessage({type:"showError",message:msg});
  }
});

// --- Console passthrough ---
(function(){
  const origLog=console.log;
  console.log=function(...args){vscode.postMessage({type:"log",message:args}); origLog.apply(console,args);};
  const origErr=console.error;
  console.error=function(...args){
    let msg=args.join(" ");
    const full=formatError(msg,"RUNTIME ERROR","${fileName}","?");
    showError(full);
    vscode.postMessage({type:"showError",message:full});
    origErr.apply(console,args);
  };
})();

// --- Run sketch ---
function runUserSketch(code){
  clearError();
  if(window._p5Instance){window._p5Instance.remove();window._p5Instance=null;}
  document.querySelectorAll("canvas").forEach(c=>c.remove());

  try{ new Function(code); }
  catch(e){
    let lineNum="?";
    const lines=code.split("\\n");
    for(let i=0;i<lines.length;i++){
      try{ new Function(lines.slice(0,i+1).join("\\n")); }
      catch{ lineNum=i+1; break; }
    }
    const msg=formatError(e.message,"SYNTAX ERROR","${fileName}",lineNum);
    showError(msg);
    vscode.postMessage({type:"showError",message:msg});
    return;
  }

  try{
    const proto=p5.prototype;
    const origCreateCanvas=proto.createCanvas;
    proto.createCanvas=function(w,h,...args){
      window._p5UserDefinedCanvas=true;
      if(w===window.innerWidth && h===window.innerHeight){ window._p5UserAutoFill=true; }
      return origCreateCanvas.call(this,w,h,...args);
    };
    const origBackground=proto.background;
    proto.background=function(...args){
      window._p5UserBackground=true;
      window._p5LastBackgroundArgs=args;
      return origBackground.apply(this,args);
    };

    const wrappedCode = \`
      \${code}

      if(typeof setup==='function'){
        const userSetup=setup;
        setup=function(){
          try{
            userSetup();
            if(!window._p5UserDefinedCanvas && typeof createCanvas==='function'){
              createCanvas(window.innerWidth,window.innerHeight);
              window._p5UserAutoFill=true;
            }
            if(!window._p5UserBackground && typeof background==='function'){
              background(255);
              window._p5LastBackgroundArgs=[255];
            }
            clearError();
          }catch(e){ const msg=formatError(e.message,"SETUP ERROR","${fileName}",getLineNumberFromStack(e)); showError(msg); vscode.postMessage({type:"showError",message:msg}); throw e;}
        }
      }

      if(typeof draw==='function'){
        const userDraw=draw;
        draw=function(){
          try{ userDraw(); }catch(e){ const msg=formatError(e.message,"DRAW ERROR","${fileName}",getLineNumberFromStack(e)); showError(msg); vscode.postMessage({type:"showError",message:msg}); throw e;}
        }
      }
    \`;

    const s=document.createElement("script");
    s.type="text/javascript"; s.dataset.userCode="true"; s.textContent=wrappedCode;
    document.body.appendChild(s);

    window._p5Instance=new p5();

  }catch(e){
    const msg=formatError(e.message,"RUNTIME ERROR","${fileName}",getLineNumberFromStack(e));
    showError(msg); vscode.postMessage({type:"showError",message:msg});
  }
}

function getLineNumberFromStack(e){
  if(!e||!e.stack) return "?";
  const m=e.stack.match(/:(\\d+):\\d+/);
  return m?parseInt(m[1],10):"?";
}

// --- Load p5.js ---
const p5Script=document.createElement("script");
p5Script.src="${p5Uri}";
p5Script.onload=()=>{ runUserSketch(\`${escapedCode}\`); };
p5Script.onerror=()=>{ showError("Failed to load p5.js"); };
document.body.appendChild(p5Script);

// --- Reload button ---
document.getElementById("reload-button").addEventListener("click",()=>{vscode.postMessage({type:"reload-button-clicked"});});

// --- Resize ---
window.addEventListener("resize",()=>{
  if(window._p5Instance?._renderer && window._p5UserAutoFill){
    window._p5Instance.resizeCanvas(window.innerWidth,window.innerHeight);
    const bgArgs = window._p5LastBackgroundArgs || [255];
    if(window._p5UserBackground) window._p5Instance.background(...bgArgs);
  }
});

// --- Messages from extension ---
window.addEventListener("message",e=>{
  const data=e.data;
  switch(data.type){
    case "reload": runUserSketch(data.code); break;
    case "stop": if(window._p5Instance){window._p5Instance.remove();window._p5Instance=null;} document.querySelectorAll("canvas").forEach(c=>c.remove()); break;
    case "toggleReloadButton": const btn=document.getElementById("reload-button"); if(btn) btn.style.display=data.show?"flex":"none"; break;
    case "showError": showError(data.message); break;
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

  function debounceDocumentUpdate(document: vscode.TextDocument) {
    const docUri = document.uri.toString();
    if (!debounceMap.has(docUri)) debounceMap.set(docUri, debounce(() => updateDocumentPanel(document), DEBOUNCE_DELAY));
    debounceMap.get(docUri)!();
  }

  function updateDocumentPanel(document: vscode.TextDocument) {
    const docUri = document.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (!panel) return;

    const code = document.getText();

    // Syntax check against original code
    const result = checkSyntax(code);
    const fileName = path.basename(document.fileName);
    const uri = document.uri;

    if (result.valid) {
      diagnosticsCollection.delete(uri);
      panel.webview.postMessage({ type: 'reload', code });
    } else {
      const line = (result.line ?? 1) - 1; // zero-indexed for VS Code
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(line, 0, line, Number.MAX_VALUE),
        result.message ?? 'Syntax Error',
        vscode.DiagnosticSeverity.Error
      );
      diagnosticsCollection.set(uri, [diagnostic]);

      panel.webview.postMessage({ type: 'stop' });
      const msg = `[${getTime()} SYNTAX ERROR on Line ${result.line} in ${fileName}] ${result.message}`;
      panel.webview.postMessage({ type: 'showError', message: msg });
      outputChannel.appendLine(msg);
      outputChannel.show(true);

      vscode.window.showTextDocument(uri, { preview: true }).then(editor => {
        editor.revealRange(diagnostic.range, vscode.TextEditorRevealType.InCenter);
        editor.selection = new vscode.Selection(diagnostic.range.start, diagnostic.range.start);
      });
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
            outputChannel.appendLine(msg.message);
            outputChannel.show(true);
          } else if (msg.type === 'reload-button-clicked') {
            panel?.webview.postMessage({ type: 'reload', code: editor.document.getText() });
            vscode.window.showInformationMessage('P5 sketch reloaded!');
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

        panel.webview.html = await createHtml(editor.document.getText(), panel, context.extensionPath);
      } else {
        panel.reveal(panel.viewColumn, true);
      }

      updateP5Context(editor);
      if (editor) updateAutoReloadListeners(editor);
    })
  );

  // ----------------------------
  // Reload sketch command
  // ----------------------------
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.reload-p5-sketch', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const docUri = editor.document.uri.toString();
      const panel = webviewPanelMap.get(docUri);
      if (!panel) {
        vscode.window.showWarningMessage('No active P5 panel to reload.');
        return;
      }
      panel.webview.postMessage({ type: 'reload', code: editor.document.getText() });
      vscode.window.showInformationMessage('P5 sketch reloaded!');
    })
  );

  // ----------------------------
  // Open selected text in p5 reference
  // ----------------------------
  const openSelectedTextCommand = vscode.commands.registerCommand('extension.openSelectedText', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.selection && !editor.selection.isEmpty) {
      const search = encodeURIComponent(editor.document.getText(editor.selection));
      vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/p5/${search}`));
    }
  });
  context.subscriptions.push(openSelectedTextCommand);

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
  // Auto-reload listeners (using your booleans)
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
        if (e.document.uri.toString() === docUri) debounceDocumentUpdate(e.document);
      });
    }
    if (reloadOnSave) {
      saveListener = vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.uri.toString() === docUri) updateDocumentPanel(doc);
      });
    }

    autoReloadListenersMap.set(docUri, { changeListener, saveListener });
  }

  context.subscriptions.push(diagnosticsCollection);
}

export function deactivate() {
  webviewPanelMap.forEach(panel => panel.dispose());
  outputChannel.dispose();
  autoReloadListenersMap.forEach(listeners => {
    listeners.changeListener?.dispose();
    listeners.saveListener?.dispose();
  });
  diagnosticsCollection.clear();
}
