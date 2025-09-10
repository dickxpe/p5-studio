import * as path from 'path';
import * as vscode from 'vscode';
import * as recast from 'recast';
import * as fs from 'fs';
import { writeFileSync } from 'fs';

const webviewPanelMap = new Map<string, vscode.WebviewPanel>();
let activeP5Panel: vscode.WebviewPanel | null = null;

const autoReloadListenersMap = new Map<
  string,
  { changeListener?: vscode.Disposable; saveListener?: vscode.Disposable }
>();

// Map from document URI to output channel
const outputChannelMap = new Map<string, vscode.OutputChannel>();
function getOrCreateOutputChannel(docUri: string, fileName: string) {
  let channel = outputChannelMap.get(docUri);
  if (!channel) {
    channel = vscode.window.createOutputChannel('LIVE P5: ' + fileName);
    outputChannelMap.set(docUri, channel);
  }
  return channel;
}

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

// Get debounce delay from configuration
function getDebounceDelay() {
  return vscode.workspace.getConfiguration('liveP5').get<number>('debounceDelay', 500);
}

// Utility to recursively list .js/.ts files in a folder
async function listFilesRecursively(dirUri: vscode.Uri, exts: string[]): Promise<string[]> {
  let files: string[] = [];
  try {
    const entries = await vscode.workspace.fs.readDirectory(dirUri);
    for (const [name, type] of entries) {
      const entryUri = vscode.Uri.file(path.join(dirUri.fsPath, name));
      if (type === vscode.FileType.File && exts.some(ext => name.endsWith(ext))) {
        files.push(entryUri.fsPath);
      } else if (type === vscode.FileType.Directory) {
        files = files.concat(await listFilesRecursively(entryUri, exts));
      }
    }
  } catch (e) { /* ignore if folder does not exist */ }
  return files;
}

// Utility to extract global variables from user code
function extractGlobalVariables(code: string): { name: string, value: any }[] {
  const acorn = require('acorn');
  const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
  const globals: { name: string, value: any }[] = [];
  function extractFromDecls(decls: any[]) {
    for (const decl of decls) {
      if (decl.id && decl.id.name) {
        let value = undefined;
        if (decl.init && decl.init.type === 'Literal') {
          value = decl.init.value;
        } else if (decl.init && decl.init.type === 'UnaryExpression' && decl.init.argument.type === 'Literal') {
          value = decl.init.operator === '-' ? -decl.init.argument.value : decl.init.argument.value;
        }
        globals.push({ name: decl.id.name, value });
      }
    }
  }
  recast.types.visit(ast, {
    visitVariableDeclaration(path) {
      if (path.parentPath && path.parentPath.value.type === 'Program') {
        extractFromDecls(path.value.declarations);
      }
      this.traverse(path);
    }
  });
  // Fallback: also check top-level body for VariableDeclaration
  if (ast.program && Array.isArray(ast.program.body)) {
    for (const node of ast.program.body) {
      if (node.type === 'VariableDeclaration') {
        extractFromDecls(node.declarations);
      }
    }
  }
  return globals;
}

// Rewrite user code to replace all references to globals with window.<varname>
function rewriteUserCodeWithWindowGlobals(code: string, globals: { name: string }[]): string {
  if (!globals.length) return code;
  const acorn = require('acorn');
  const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
  const globalNames = new Set(globals.map(g => g.name));
  const programBody = ast.program.body;
  const newBody = [];
  for (let i = 0; i < programBody.length; i++) {
    let stmt = programBody[i];
    // Detect setup function with createCanvas(windowWidth,windowHeight)
    if (
      stmt.type === 'FunctionDeclaration' &&
      stmt.id && stmt.id.name === 'setup' &&
      stmt.body && stmt.body.body
    ) {
      const newSetupBody = [];
      for (let j = 0; j < stmt.body.body.length; j++) {
        const b = stmt.body.body[j];
        newSetupBody.push(b);
        if (
          b.type === 'ExpressionStatement' &&
          b.expression.type === 'CallExpression' &&
          b.expression.callee.name === 'createCanvas' &&
          b.expression.arguments.length === 2 &&
          b.expression.arguments[0].name === 'windowWidth' &&
          b.expression.arguments[1].name === 'windowHeight'
        ) {
          // Inject resizeCanvas(window.innerWidth, window.innerHeight) immediately after createCanvas
          newSetupBody.push(
            recast.types.builders.expressionStatement(
              recast.types.builders.callExpression(
                recast.types.builders.identifier('resizeCanvas'),
                [
                  recast.types.builders.memberExpression(recast.types.builders.identifier('window'), recast.types.builders.identifier('innerWidth'), false),
                  recast.types.builders.memberExpression(recast.types.builders.identifier('window'), recast.types.builders.identifier('innerHeight'), false)
                ]
              )
            )
          );
        }
      }
      stmt = recast.types.builders.functionDeclaration(
        stmt.id,
        stmt.params,
        recast.types.builders.blockStatement(newSetupBody)
      );
    }
    if (stmt.type === 'VariableDeclaration' && (stmt.kind === 'let' || stmt.kind === 'const')) {
      if (stmt.declarations.some(decl => decl.id && decl.id.name && globalNames.has(decl.id.name))) {
        stmt = Object.assign({}, stmt, { kind: 'var' });
      }
    }
    newBody.push(stmt);
    if (stmt.type === 'VariableDeclaration') {
      for (const decl of stmt.declarations) {
        if (decl.id && decl.id.name && globalNames.has(decl.id.name)) {
          newBody.push(recast.types.builders.expressionStatement(
            recast.types.builders.assignmentExpression('=',
              recast.types.builders.memberExpression(
                recast.types.builders.identifier('window'),
                recast.types.builders.identifier(decl.id.name),
                false
              ),
              recast.types.builders.identifier(decl.id.name)
            )
          ));
        }
      }
    }
  }
  ast.program.body = newBody;
  recast.types.visit(ast, {
    visitIdentifier(path) {
      const name = path.value.name;
      if (
        globalNames.has(name) &&
        !(path.parentPath && path.parentPath.value &&
          path.parentPath.value.type === 'MemberExpression' &&
          path.parentPath.value.property === path.value &&
          path.parentPath.value.object.type === 'Identifier' &&
          path.parentPath.value.object.name === 'window') &&
        !(path.parentPath && path.parentPath.value &&
          ((path.parentPath.value.type === 'VariableDeclarator' && path.parentPath.value.id === path.value) ||
            (path.parentPath.value.type === 'FunctionDeclaration' && path.parentPath.value.id === path.value) ||
            (path.parentPath.value.type === 'FunctionExpression' && path.parentPath.value.id === path.value) ||
            (path.parentPath.value.type === 'ClassDeclaration' && path.parentPath.value.id === path.value)))
      ) {
        return recast.types.builders.memberExpression(
          recast.types.builders.identifier('window'),
          recast.types.builders.identifier(name),
          false
        );
      }
      this.traverse(path);
    }
  });
  const rewritten = recast.print(ast).code;
  // DEBUG: log rewritten code
  console.log('REWRITTEN CODE:', rewritten);
  return rewritten;
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

  // Detect globals and rewrite code
  const globals = extractGlobalVariables(userCode);
  const rewrittenCode = rewriteUserCodeWithWindowGlobals(userCode, globals);
  const escapedCode = escapeBackticks(rewrittenCode);

  const uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 8);
  const p5UriWithCacheBust = vscode.Uri.parse(p5Uri.toString() + `?v=${uniqueId}`);

  // --- Inject common and import scripts ---
  let scriptTags = '';
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
      const folders = ['common', 'import'];
      let allFiles: string[] = [];
      for (const folder of folders) {
        const dir = path.join(workspaceFolder.uri.fsPath, folder);
        const files = await listFilesRecursively(vscode.Uri.file(dir), ['.js', '.ts']);
        allFiles = allFiles.concat(files);
      }
      // Ensure p5.min.js is always loaded first
      scriptTags = `<script src='${p5UriWithCacheBust}'></script>\n` +
        allFiles.map(s => `<script src='${panel.webview.asWebviewUri(vscode.Uri.file(s))}'></script>`).join('\n');
    } else {
      // Fallback: just p5
      scriptTags = `<script src='${p5UriWithCacheBust}'></script>`;
    }
  } catch (e) { /* ignore */ }

  // In createHtml, get debounceDelay from config and pass to webview
  const debounceDelay = vscode.workspace.getConfiguration('liveP5').get<number>('debounceDelay', 500);
  // Get varDrawerDefaultState from config
  const varDrawerDefaultState = vscode.workspace.getConfiguration('liveP5').get<string>('varDrawerDefaultState', 'open');

  return `<!DOCTYPE html>
<!-- cache-bust: ${uniqueId} -->
<html>
<head>
${scriptTags}
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
#p5-var-controls {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: #1f1f1f;
  z-index: 10000;
  padding: 4px 12px;
  font-family: monospace;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
  max-height: calc(3 * 2.5em);
  overflow-y: auto;
  transition: transform 0.2s cubic-bezier(.4,0,.2,1), box-shadow 0.2s;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.2);
}
#p5-var-controls.drawer-hidden {
  transform: translateY(100%);
  box-shadow: none;
}
#p5-var-controls .drawer-toggle {
  position: absolute;
  top: 8px;
  right: 4px;
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  z-index: 10001;
  padding: 2px 4px;
  transition: color 0.2s;
}
#p5-var-controls .drawer-toggle:hover {
  color: #ff0;
}
#p5-var-drawer-tab {
  display: none;
  position: fixed;
  right: 0px;
  bottom: 0;
  background: #1f1f1f;
  color: #fff;
  border-radius: 6px 0px 0px 0px;
  padding: 2px 4px 2px 4px;
  font-family: monospace;
  font-size: 18px;
  z-index: 10001;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  min-width: 24px;
  min-height: 33px;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.2s cubic-bezier(.4,0,.2,1), transform 0.2s cubic-bezier(.4,0,.2,1);
}
#p5-var-drawer-tab.tab-visible {
  opacity: 1;
  transform: translateY(0);
}
#p5-var-controls input {
  width: 60px;
}
#p5-var-controls label {
  margin-right: 8px;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  height: 32px;
}
#p5-var-controls input[type="checkbox"] {
  width: 16px;
  min-width: 16px;
  max-width: 16px;
  height: 16px;
  min-height: 16px;
  max-height: 16px;
  accent-color: #fff;
  color-scheme: light;
  margin: 0 2px;
  vertical-align: middle;
  display: inline-block;
}
</style>
</head>
<body>
<div id="error-overlay"></div>
<div id="reload-button"><img src="${reloadIconUri}" title="Reload P5 Sketch"></div>
<script>
window._p5UserCode = ${JSON.stringify(escapedCode)};
const vscode = acquireVsCodeApi();
window._p5Instance = null;
window._p5UserDefinedCanvas = false;
window._p5UserAutoFill = false;
window._p5UserBackground = false;
window._p5LastBackgroundArgs = null;
window._p5ErrorLogged = false;
window._p5ErrorActive = false;

// Debounce utility for webview
function debounceWebview(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}
window._p5DebounceDelay = ${debounceDelay};
window._p5VarDrawerDefaultState = "${varDrawerDefaultState}";

// Notify extension that webview is loaded
window.addEventListener('DOMContentLoaded', () => {
  vscode.postMessage({ type: 'webviewLoaded' });
});

function showError(msg){
  window._p5ErrorActive = true;
  const el = document.getElementById("error-overlay");
  if(el){el.textContent = msg; el.style.display = "block";}
  if(window._p5Instance){window._p5Instance.remove(); window._p5Instance = null;}
  document.querySelectorAll("canvas").forEach(c=>c.remove());
  // Prevent p5.js from calling user draw/setup again
  window.draw = undefined;
  window.setup = undefined;
}
function clearError(){
  window._p5ErrorActive = false;
  const el=document.getElementById("error-overlay");
  if(el){el.textContent=""; el.style.display="none";}
}

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

  // Remove ALL previous <script> tags with data-user-code="true"
  const scripts = Array.from(document.querySelectorAll('script[data-user-code="true"]'));
  scripts.forEach(s => s.parentNode && s.parentNode.removeChild(s));

  // Inject user code as a <script> tag (not Function constructor)
  const userScript = document.createElement('script');
  userScript.type = 'text/javascript';
  userScript.dataset.userCode = 'true';
  userScript.textContent = code;
  document.body.appendChild(userScript);

  // Attach globals to window for live editing
  if (window._p5GlobalVarTypes) {
    Object.keys(window._p5GlobalVarTypes).forEach(function(name) {
      try {
        if (typeof window[name] === 'undefined' && typeof eval(name) !== 'undefined') {
          window[name] = eval(name);
        }
      } catch (e) {}
    });
  }

  window._p5Instance=new p5();
}

function waitForP5AndRunSketch() {
  if (window.p5) {
    runUserSketch(window._p5UserCode);
  } else {
    setTimeout(waitForP5AndRunSketch, 10);
  }
}
waitForP5AndRunSketch();

document.getElementById("reload-button").addEventListener("click",()=>{
  vscode.postMessage({type:"reload-button-clicked", preserveGlobals: true});
});

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
    case "reload":
      if (data.preserveGlobals) {
        // Save current global values
        const prevGlobals = {};
        if (window._p5GlobalVarTypes) {
          Object.keys(window._p5GlobalVarTypes).forEach(name => {
            prevGlobals[name] = window[name];
          });
        }
        // Remove global var declarations and window assignments from code
        let codeNoGlobals = data.code;
        if (window._p5GlobalVarTypes) {
          Object.keys(window._p5GlobalVarTypes).forEach(name => {
            // Remove lines like 'var x = ...;' or 'var x;' (with or without semicolon)
            codeNoGlobals = codeNoGlobals.replace(new RegExp('^\\s*var\\s+'+name+'(\\s*=.*)?;?\\s*$', 'gm'), '');
            // Remove lines like 'window.x = x;' (with or without semicolon)
            codeNoGlobals = codeNoGlobals.replace(new RegExp('^\\s*window\\.'+name+'\\s*=\\s*'+name+';?\\s*$', 'gm'), '');
          });
        }
        runUserSketch(codeNoGlobals);
        // Restore global values
        if (window._p5GlobalVarTypes) {
          Object.keys(prevGlobals).forEach(name => {
            window[name] = prevGlobals[name];
          });
        }
      } else {
        runUserSketch(data.code);
      }
      break;
    case "stop": if(window._p5Instance){window._p5Instance.remove(); window._p5Instance=null;} document.querySelectorAll("canvas").forEach(c=>c.remove()); break;
    case "showError": showError(data.message); break;
    case "toggleReloadButton": document.getElementById("reload-button").style.display = data.show ? "flex" : "none"; break;
    case "resetErrorFlag": window._p5ErrorLogged = false; break;
    case "syntaxError": showError(data.message); break;
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
    case 'setGlobalVars':
      if (typeof data.debounceDelay === 'number') {
        window._p5DebounceDelay = data.debounceDelay;
      }
      renderGlobalVarControls(data.variables);
      // Store types for later use
      window._p5GlobalVarTypes = {};
      data.variables.forEach(v => {
        window._p5GlobalVarTypes[v.name] = typeof v.value;
      });
      break;
    case 'updateGlobalVar':
      updateGlobalVarInSketch(data.name, data.value);
      break;
  }
});

function updateGlobalVarInSketch(name, value) {
  if (typeof window[name] !== 'undefined') {
    let type = (window._p5GlobalVarTypes && window._p5GlobalVarTypes[name]) || typeof window[name];
    if (type === 'number') {
      let num = Number(value);
      if (!isNaN(num)) window[name] = num;
    } else if (type === 'boolean') {
      window[name] = (value === 'true' || value === true);
    } else {
      window[name] = value;
    }
  }
}

// Drawer logic (removed static references, now handled in renderGlobalVarControls)
// Set initial drawer state based on config (removed static logic, now handled in renderGlobalVarControls)

function hideDrawer() {
  const controls = document.getElementById('p5-var-controls');
  const tab = document.getElementById('p5-var-drawer-tab');
  if (!controls || !tab) return;
  controls.classList.add('drawer-hidden');
  setTimeout(() => {
    controls.style.display = 'none';
    tab.style.display = 'flex';
    tab.classList.add('tab-visible');
  }, 200);
}
function showDrawer() {
  const controls = document.getElementById('p5-var-controls');
  const tab = document.getElementById('p5-var-drawer-tab');
  if (!controls || !tab) return;
  controls.style.display = 'flex';
  setTimeout(() => {
    controls.classList.remove('drawer-hidden');
    tab.classList.remove('tab-visible');
    setTimeout(() => { tab.style.display = 'none'; }, 200);
  }, 10);
}

function renderGlobalVarControls(vars) {
  let controls = document.getElementById('p5-var-controls');
  let tab = document.getElementById('p5-var-drawer-tab');
  if (!vars || vars.length === 0) {
    if (controls) controls.remove();
    if (tab) tab.remove();
    return;
  }
  // If controls/tab do not exist, create and append them
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'p5-var-controls';
    controls.style.display = 'none';
    controls.innerHTML = '<button class="drawer-toggle" title="Hide controls">&#x25BC;</button>';
    document.body.appendChild(controls);
  }
  if (!tab) {
    tab = document.createElement('div');
    tab.id = 'p5-var-drawer-tab';
    tab.innerHTML = '<span class="arrow">&#x25B2;</span>';
    document.body.appendChild(tab);
  }
  controls.innerHTML = '<button class="drawer-toggle" title="Hide controls">&#x25BC;</button>';
  if (window._p5VarDrawerDefaultState === 'collapsed') {
    tab.style.display = 'flex';
    tab.classList.add('tab-visible');
    controls.classList.add('drawer-hidden');
    controls.style.display = 'none';
  } else {
    tab.style.display = 'none';
    tab.classList.remove('tab-visible');
    controls.classList.remove('drawer-hidden');
    controls.style.display = 'flex';
  }
  const drawerToggleBtn = controls.querySelector('.drawer-toggle');
  drawerToggleBtn.addEventListener('click', hideDrawer);
  vars.forEach(v => {
    const label = document.createElement('label');
    label.textContent = v.name + ': ';
    let input;
    if (typeof v.value === 'number') {
      input = document.createElement('input');
      input.type = 'number';
      input.value = v.value;
      if (!Number.isInteger(v.value)) {
        input.step = 'any'; // allow decimals
      }
    } else if (typeof v.value === 'boolean') {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = v.value;
      input.addEventListener('change', () => {
        updateGlobalVarInSketch(v.name, input.checked);
        vscode.postMessage({ type: 'updateGlobalVar', name: v.name, value: input.checked });
      });
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.value = v.value !== undefined ? v.value : '';
    }
    input.setAttribute('data-var', v.name);
    if (typeof v.value !== 'boolean') {
      // Use debounced input event for instant feedback
      const debouncedUpdate = debounceWebview(() => {
        updateGlobalVarInSketch(v.name, input.value);
        vscode.postMessage({ type: 'updateGlobalVar', name: v.name, value: input.value });
      }, window._p5DebounceDelay);
      input.addEventListener('input', debouncedUpdate);
    }
    label.appendChild(input);
    controls.appendChild(label);
  });
  // Re-attach drawer logic if needed
  controls.querySelector('.drawer-toggle').addEventListener('click', hideDrawer);
  tab.addEventListener('click', showDrawer);
}
</script>
</body>
</html>`;
}

// ----------------------------
// Activate
// ----------------------------
export function activate(context: vscode.ExtensionContext) {
  // Create output channel and register with context to ensure it appears in Output panel

  function updateP5Context(editor?: vscode.TextEditor) {
    editor = editor || vscode.window.activeTextEditor;
    if (!editor) return vscode.commands.executeCommand('setContext', 'isP5js', false);
    const isJsOrTs = ['javascript', 'typescript'].includes(editor.document.languageId);
    vscode.commands.executeCommand('setContext', 'isP5js', isJsOrTs);
  }

  // P5 Reference status bar button
  const p5RefStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  p5RefStatusBar.command = 'extension.openP5Ref';
  p5RefStatusBar.text = '$(book) P5 Reference'; // Status bar text
  p5RefStatusBar.tooltip = '$(book) Open P5.js Reference'; // Tooltip text
  p5RefStatusBar.color = '#ff0000';
  p5RefStatusBar.tooltip = '$(book) Open P5.js Reference';
  context.subscriptions.push(p5RefStatusBar);

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openP5Ref', () => {
      vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/`));
    })
  );


  function updateJsOrTsContext(editor?: vscode.TextEditor) {
    editor = editor || vscode.window.activeTextEditor;
    const isJsOrTs = !!editor && ['javascript', 'typescript'].includes(editor.document.languageId);
    vscode.commands.executeCommand('setContext', 'isJsOrTs', isJsOrTs);
    if (isJsOrTs) {
      p5RefStatusBar.show();
    } else {
      p5RefStatusBar.hide();
    }
  }

  updateP5Context();
  updateJsOrTsContext();

  vscode.window.onDidChangeActiveTextEditor(editor => {
    updateP5Context(editor);
    updateJsOrTsContext(editor);
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
    // Focus the output channel for the active sketch
    const channel = outputChannelMap.get(docUri);
    if (channel) channel.show(true);
  });

  vscode.workspace.onDidChangeTextDocument(e => {
    if (e.document === vscode.window.activeTextEditor?.document) {
      updateP5Context(vscode.window.activeTextEditor);
    }
  });
  vscode.workspace.onDidSaveTextDocument(doc => {
    if (doc === vscode.window.activeTextEditor?.document) {
      updateP5Context(vscode.window.activeTextEditor);
    }
  });

  const debounceMap = new Map<string, Function>();
  function debounceDocumentUpdate(document: vscode.TextDocument, forceLog = false) {
    const docUri = document.uri.toString();
    if (!debounceMap.has(docUri)) debounceMap.set(docUri, debounce((doc, log) => updateDocumentPanel(doc, log), getDebounceDelay()));
    debounceMap.get(docUri)!(document, forceLog);
  }

  // Add a flag to ignore logs after a syntax error
  let ignoreLogs = false;

  async function updateDocumentPanel(document: vscode.TextDocument, forceLog = false) {
    const docUri = document.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (!panel) return;
    const fileName = path.basename(document.fileName);
    const outputChannel = getOrCreateOutputChannel(docUri, fileName);

    let code = document.getText();
    let syntaxErrorMsg: string | null = null;
    let hadSyntaxError = false;
    try {
      new Function(code); // syntax check
      const hasSetup = /\bfunction\s+setup\s*\(/.test(code);
      const hasDraw = /\bfunction\s+draw\s*\(/.test(code);

      if (!hasSetup && !hasDraw) {
        // Wrap code in a setup function
        code = `function setup() {\n${code}\n}`;
      }
      // Always reload HTML for every code update to reset JS environment
      panel.webview.html = await createHtml(code, panel, context.extensionPath);
      // After HTML is set, send global variables
      let globals = extractGlobalVariables(code);
      // Only keep number, string, boolean
      globals = globals.filter(g => ['number', 'string', 'boolean'].includes(typeof g.value));
      setTimeout(() => {
        panel.webview.postMessage({ type: 'setGlobalVars', variables: globals });
      }, 200);
    } catch (err: any) {
      syntaxErrorMsg = `${getTime()} [SYNTAX ERROR in ${path.basename(document.fileName)}] ${err.message}`;
      panel.webview.html = await createHtml('', panel, context.extensionPath);
      hadSyntaxError = true;
    }

    // Always show syntax errors in overlay
    if (syntaxErrorMsg) {
      ignoreLogs = true;
      setTimeout(() => {
        panel.webview.postMessage({ type: 'syntaxError', message: syntaxErrorMsg });
      }, 150);
      outputChannel.appendLine(syntaxErrorMsg);
      // outputChannel.show(true); // Do not focus on every error
      (panel as any)._lastSyntaxError = syntaxErrorMsg;
      (panel as any)._lastRuntimeError = null;
    } else {
      ignoreLogs = false;
      (panel as any)._lastSyntaxError = null;
      (panel as any)._lastRuntimeError = null;
    }
  }

  // Track reloadWhileTyping and reloadOnSave as top-level variables
  let reloadWhileTyping = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadWhileTyping', true);
  let reloadOnSave = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadOnSave', true);

  // Helper to update reloadWhileTyping/reloadOnSave variables and context key
  async function updateReloadWhileTypingVarsAndContext() {
    reloadWhileTyping = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadWhileTyping', true);
    reloadOnSave = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadOnSave', true);
    await vscode.commands.executeCommand('setContext', 'liveP5ReloadWhileTypingEnabled', reloadWhileTyping);
  }

  // Restore updateAutoReloadListeners function inside activate for correct scope
  function updateAutoReloadListeners(editor: vscode.TextEditor) {
    const docUri = editor.document.uri.toString();
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
    }
    autoReloadListenersMap.set(docUri, { changeListener, saveListener });
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
      let code = editor.document.getText();

      if (!panel) {
        // Check for syntax errors before setting HTML
        let syntaxErrorMsg: string | null = null;
        let codeToInject = code;
        try {
          new Function(code);
          const hasSetup = /\bfunction\s+setup\s*\(/.test(code);
          const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
          if (!hasSetup && !hasDraw) {
            // Wrap code in a setup function
            codeToInject = `function setup() {\n${code}\n}`;
          }
        } catch (err: any) {
          syntaxErrorMsg = `${getTime()} [SYNTAX ERROR in ${path.basename(editor.document.fileName)}] ${err.message}`;
          codeToInject = '';
        }
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder)
          return;
        panel = vscode.window.createWebviewPanel(
          'extension.live-p5',
          'LIVE: ' + path.basename(editor.document.fileName),
          vscode.ViewColumn.Two,
          {
            enableScripts: true,
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, 'assets')),
              vscode.Uri.file(path.join(context.extensionPath, 'images')),
              vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'common')),
              vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'import')),
            ],
            retainContextWhenHidden: true
          }
        );

        // Focus the output channel for the new sketch immediately
        const docUri = editor.document.uri.toString();
        const fileName = path.basename(editor.document.fileName);
        const outputChannel = getOrCreateOutputChannel(docUri, fileName);
        outputChannel.show(true);

        webviewPanelMap.set(docUri, panel);
        activeP5Panel = panel;
        vscode.commands.executeCommand('setContext', 'hasP5Webview', true);

        panel.webview.onDidReceiveMessage(msg => {
          const fileName = path.basename(editor.document.fileName);
          const docUri = editor.document.uri.toString();
          const outputChannel = getOrCreateOutputChannel(docUri, fileName);
          if (msg.type === 'log') {
            if (ignoreLogs) return;
            outputChannel.appendLine(`${getTime()} [LOG]: ${msg.message.join(' ')}`);
            // outputChannel.show(true); // Do not focus on every log
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
            // outputChannel.show(true); // Do not focus on every error
            const docUri = editor.document.uri.toString();
            const panel = webviewPanelMap.get(docUri);
            if (panel) (panel as any)._lastRuntimeError = message;
          } else if (msg.type === 'reload-button-clicked') {
            // Forward preserveGlobals flag to webview, but send rewritten code
            let code = editor.document.getText();
            const globals = extractGlobalVariables(code);
            let rewrittenCode = rewriteUserCodeWithWindowGlobals(code, globals);
            if (msg.preserveGlobals && globals.length > 0) {
              // Remove global var declarations and window assignments
              globals.forEach(g => {
                // Remove lines like 'var x = ...;' or 'var x;' (with or without semicolon)
                rewrittenCode = rewrittenCode.replace(new RegExp('^\\s*var\\s+' + g.name + '(\\s*=.*)?;?\\s*$', 'gm'), '');
                // Remove lines like 'window.x = x;' (with or without semicolon)
                rewrittenCode = rewrittenCode.replace(new RegExp('^\\s*window\\.' + g.name + '\\s*=\\s*' + g.name + ';?\\s*$', 'gm'), '');
              });
            }
            panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: msg.preserveGlobals });
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
          // Dispose output channel when panel is closed
          const channel = outputChannelMap.get(docUri);
          if (channel) {
            channel.dispose();
            outputChannelMap.delete(docUri);
          }
        });

        panel.onDidChangeViewState(e => {
          if (e.webviewPanel.active) {
            const channel = outputChannelMap.get(docUri);
            if (channel) channel.show(true);
          }
        });

        // Only set HTML on first open
        panel.webview.html = await createHtml(codeToInject, panel, context.extensionPath);
        // Send global variables immediately after setting HTML
        let globals = extractGlobalVariables(codeToInject);
        globals = globals.filter(g => ['number', 'string', 'boolean'].includes(typeof g.value));
        setTimeout(() => {
          panel.webview.postMessage({ type: 'setGlobalVars', variables: globals });
        }, 200);
        if (syntaxErrorMsg) {
          setTimeout(() => {
            panel.webview.postMessage({ type: 'syntaxError', message: syntaxErrorMsg });
          }, 150);
        }
      } else {
        panel.reveal(panel.viewColumn, true);
        // Only send reload message on reveal, do not set HTML again
        setTimeout(() => {
          let codeToSend = code;
          const hasSetup = /\bfunction\s+setup\s*\(/.test(code);
          const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
          if (!hasSetup && !hasDraw) {
            codeToSend = `function setup() {\n${code}\n}`;
          }
          panel.webview.postMessage({ type: 'reload', code: codeToSend });
        }, 100);
      }

      updateP5Context(editor);
      if (editor) updateAutoReloadListeners(editor);
    })
  );

  // Register reload-p5-sketch command
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.reload-p5-sketch', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      debounceDocumentUpdate(editor.document, false); // use false to match typing
    })
  );

  // Register toggleReloadWhileTypingOn command
  context.subscriptions.push(
    vscode.commands.registerCommand('liveP5.toggleReloadWhileTypingOn', async () => {
      const config = vscode.workspace.getConfiguration('liveP5');
      await config.update('reloadWhileTyping', false, vscode.ConfigurationTarget.Global);
      await updateReloadWhileTypingVarsAndContext();
      const editor = vscode.window.activeTextEditor;
      if (editor) updateAutoReloadListeners(editor);
      vscode.window.showInformationMessage('Reload on typing is now disabled.');
    })
  );
  // Register toggleReloadWhileTypingOff command
  context.subscriptions.push(
    vscode.commands.registerCommand('liveP5.toggleReloadWhileTypingOff', async () => {
      const config = vscode.workspace.getConfiguration('liveP5');
      await config.update('reloadWhileTyping', true, vscode.ConfigurationTarget.Global);
      await updateReloadWhileTypingVarsAndContext();
      const editor = vscode.window.activeTextEditor;
      if (editor) updateAutoReloadListeners(editor);
      vscode.window.showInformationMessage('Reload on typing is now enabled.');
    })
  );
  // Register openSelectedText command
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openSelectedText', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.selection && !editor.selection.isEmpty) {
        const search = encodeURIComponent(editor.document.getText(editor.selection));
        vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/p5/${search}`));
      }
    })
  );

  // Register create-jsconfig command
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.create-jsconfig', async () => {
      try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return;
        // creates a jsconfig that tells vscode where to find the types file
        const jsconfig = {
          include: [
            "*.js",
            "**/*.js",
            "*.ts",
            "¨**/.ts",
            path.join(context.extensionPath, "p5types", "global.d.ts")
          ]
        };
        fs.mkdirSync(workspaceFolder.uri.fsPath + "/common", { recursive: true });
        fs.mkdirSync(workspaceFolder.uri.fsPath + "/import", { recursive: true });
        fs.mkdirSync(workspaceFolder.uri.fsPath + "/media", { recursive: true });
        fs.mkdirSync(workspaceFolder.uri.fsPath + "/sketches", { recursive: true });
        // Create empty utils.js if not exists
        const utilsPath = path.join(workspaceFolder.uri.fsPath, "common", "utils.js");
        if (!fs.existsSync(utilsPath)) {
          fs.writeFileSync(utilsPath, "");
        }
        // Create sketch1.js in sketches if not exists
        const sketch1Path = path.join(workspaceFolder.uri.fsPath, "sketches", "sketch1.js");
        if (!fs.existsSync(sketch1Path)) {
          fs.writeFileSync(sketch1Path, "function setup() {\n  //Start coding with P5 here!\n}\n");
        }
        const jsconfigPath = path.join(workspaceFolder.uri.fsPath, "jsconfig.json");
        writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
      } catch (e) {
        console.error(e);
      }
    })
  );

  // Listen for debounceDelay config changes
  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('liveP5.debounceDelay')) {
      debounceMap.clear(); // Clear so new debounceDelay is used on next change
    }
  });

  vscode.workspace.onDidCloseTextDocument(doc => {
    const docUri = doc.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (panel) {
      panel.dispose();
    }
  });
}


