import * as path from 'path';
import * as vscode from 'vscode';
import * as ts from 'typescript';

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
  const ensureP5Boilerplate = (code: string) => {
    let txt = code;
    if (!/function\s+setup\s*\(/.test(txt)) txt = `function setup(){/*setup*/}\n` + txt;
    if (!/function\s+draw\s*\(/.test(txt) && /line|ellipse|rect|circle|point/.test(txt))
      txt = `function draw(){/*draw*/}\n` + txt;
    return txt;
  };

  text = ensureP5Boilerplate(text);
  const escapedCode = JSON.stringify(text);

  const p5Path = vscode.Uri.file(path.join(extensionPath, 'assets', 'p5.min.js'));
  const p5Uri = panel.webview.asWebviewUri(p5Path);

  const reloadIconPath = vscode.Uri.file(path.join(extensionPath, 'images', 'reload.svg'));
  const reloadIconUri = panel.webview.asWebviewUri(reloadIconPath);

  return `<!DOCTYPE html>
<html>
<head>
<style>
html,body{margin:0;padding:0;overflow:hidden;width:100%;height:100%;background:#fff;}
canvas.p5Canvas{display:block;}
#error-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,0,0,0.95);color:#fff;font-family:monospace;padding:16px;display:none;z-index:9999;white-space:pre-wrap;overflow:auto;}
#reload-button{position:fixed;top:10px;right:10px;width:16px;height:16px;cursor:pointer;z-index:9999;}
#reload-button img{width:100%;height:100%;}
</style>
</head>
<body>
<div id="error-overlay"></div>
<div id="reload-button"><img src="${reloadIconUri}" title="Reload P5 Sketch"></div>
<script>
const vscode = acquireVsCodeApi();
window._p5Instance=null;
window._p5Background=null;

function showError(msg){
    const el=document.getElementById('error-overlay');
    if(el){el.textContent=msg;el.style.display='block';}
    if(window._p5Instance){window._p5Instance.remove();window._p5Instance=null;}
    document.querySelectorAll('canvas').forEach(c=>c.remove());
    console.error(msg);
}
function clearError(){const el=document.getElementById('error-overlay');if(el){el.textContent='';el.style.display='none';}}

window.onerror=function(message, source, lineno, colno, error){showError('[Runtime Error] '+message+' (line '+lineno+', column '+colno+')'); return true;}
window.addEventListener('unhandledrejection', e=>showError('[Promise Error] '+(e.reason?.message||e.reason)));

(function(){
    const origLog=console.log; console.log=function(...args){vscode.postMessage({type:'log',message:args}); origLog.apply(console,args);};
    const origErr=console.error; console.error=function(...args){vscode.postMessage({type:'error',message:args.join(' ')}); origErr.apply(console,args);};
})();

function runUserSketch(userCode){
    clearError();
    document.querySelectorAll('script[data-user-code]').forEach(s=>s.remove());
    if(window._p5Instance){window._p5Instance.remove();window._p5Instance=null;}
    document.querySelectorAll('canvas').forEach(c=>c.remove());
    window._p5Background=null;

    const wrappedCode=\`\${userCode}
if(typeof setup==='function'){const userSetup=setup;setup=function(){try{createCanvas(window.innerWidth,window.innerHeight);userSetup();const c=get(0,0);window._p5Background=color(c[0],c[1],c[2],c[3]);clearError();}catch(e){showError('[Setup Error] '+(e.message||e));throw e;}}}
if(typeof draw==='function'){const userDraw=draw;draw=function(){try{userDraw();}catch(e){showError('[Draw Error] '+(e.message||e));throw e;}}}\`;

    try{
        new Function(wrappedCode);
        const s=document.createElement('script');
        s.type='text/javascript';
        s.dataset.userCode='true';
        s.textContent=wrappedCode;
        document.body.appendChild(s);
        window._p5Instance=new p5();
    }catch(e){
        let msg='[Syntax Error] '+(e.message||e);
        if(e.lineNumber) msg+=' (line '+e.lineNumber+', column '+(e.columnNumber||'?')+')';
        showError(msg);
    }
}

const p5Script=document.createElement('script');
p5Script.src='${p5Uri}';
p5Script.onload=()=>{runUserSketch(${escapedCode});};
p5Script.onerror=()=>{showError('Failed to load p5.js');};
document.body.appendChild(p5Script);

document.getElementById('reload-button').addEventListener('click',()=>{vscode.postMessage({type:'reload-button-clicked'});});

window.addEventListener('resize',()=>{
    if(window._p5Instance?._renderer){
        window._p5Instance.resizeCanvas(window.innerWidth,window.innerHeight);
        if(window._p5Background){window._p5Instance.background(window._p5Background);}else{window._p5Instance.background(255);}
    }
});

window.addEventListener('message', e=>{if(e.data.type==='reload') runUserSketch(e.data.code);});
</script>
</body>
</html>`;
}

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
  });

  const debounceMap = new Map<string, Function>();
  function updateDocumentPanel(document: vscode.TextDocument) {
    const docUri = document.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (!panel) return;
    panel.webview.postMessage({ type: 'reload', code: document.getText() });
  }
  function debounceDocumentUpdate(document: vscode.TextDocument) {
    const docUri = document.uri.toString();
    if (!debounceMap.has(docUri)) debounceMap.set(docUri, debounce(() => updateDocumentPanel(document), DEBOUNCE_DELAY));
    debounceMap.get(docUri)!();
  }

  vscode.workspace.onDidChangeTextDocument(e => debounceDocumentUpdate(e.document));
  vscode.workspace.onDidSaveTextDocument(e => debounceDocumentUpdate(e));

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
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()} LOG]: ${msg.message.join(' ')}`);
            outputChannel.show(true);
          } else if (msg.type === 'error') {
            outputChannel.appendLine(`[${new Date().toLocaleTimeString()} ERROR]: ${msg.message}`);
            outputChannel.show(true);
            panel.title = `⚠️ LIVE: ${path.basename(editor.document.fileName)}`;
          } else if (msg.type === 'reload-button-clicked') {
            panel.webview.postMessage({ type: 'reload', code: editor.document.getText() });
            vscode.window.showInformationMessage('P5 sketch reloaded!');
          }
        });

        panel.onDidDispose(() => {
          webviewPanelMap.delete(docUri);
          if (activeP5Panel === panel) activeP5Panel = null;
          vscode.commands.executeCommand('setContext', 'hasP5Webview', false);
        });

        panel.webview.html = await createHtml(editor.document.getText(), panel, context.extensionPath);
      } else {
        panel.reveal(panel.viewColumn, true);
      }

      updateP5Context(editor);
    })
  );

  // Reload button in editor tab (only for JS/TS sketches, not for webview itself)
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.reload-p5-sketch', async () => {
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
}

export function deactivate() {
  webviewPanelMap.clear();
  outputChannel.dispose();
}
