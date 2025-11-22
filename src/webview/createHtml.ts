import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { preprocessTopLevelInputs } from '../processing/topInputs';
import { extractGlobalVariablesWithConflicts, rewriteUserCodeWithWindowGlobals } from '../processing/codeRewriter';
import { listFilesRecursively } from '../utils/helpers';
import { config as cfg } from '../config/index';
import { getP5AssetUris } from '../assets/resolver';

export async function createHtml(
  userCode: string,
  panel: vscode.WebviewPanel,
  extensionPath: string,
  opts?: { allowInteractiveTopInputs?: boolean; initialCaptureVisible?: boolean; p5Version?: string }
): Promise<string> {
  const allowInteractive = typeof opts?.allowInteractiveTopInputs === 'boolean' ? opts!.allowInteractiveTopInputs! : true;
  const initialCaptureVisible = !!(opts && opts.initialCaptureVisible);
  // Preprocess top-of-file inputPrompt() placeholders before anything else
  const key = (panel && (panel as any)._sketchFilePath) ? String((panel as any)._sketchFilePath) : '';
  userCode = await preprocessTopLevelInputs(userCode, { key, interactive: allowInteractive });
  // Get the sketch filename (without extension)
  let sketchFileName = '';
  if (panel && (panel as any)._sketchFilePath) {
    sketchFileName = path.basename((panel as any)._sketchFilePath);
  }
  // Resolve p5 asset URIs via centralized resolver helper, honoring an explicit version when provided
  const { p5Uri, p5SoundUri, p5CaptureUri } = getP5AssetUris(panel, extensionPath, opts?.p5Version ? { version: opts.p5Version } : undefined);

  const stepRunDelayMs = cfg.getStepRunDelayMs();
  const showDebugButton = cfg.getShowDebugButton();
  const showFPS = cfg.getShowFPS();

  function escapeBackticks(str: string) {
    return str.replace(/`/g, '\\`');
  }

  // Sanitize user code: replace literal two-character "\\" + "n" sequences
  // in string literals with a space, but do NOT touch actual backslash
  // characters like "\\" that are already correctly escaped.
  function sanitizeUserCode(code: string): string {
    // This regex replaces \n in single/double/backtick-quoted string literals with a space
    return code.replace(/(['"`])((?:\\\1|.)*?)\\n((?:\\\1|.)*?)\1/g, (match, quote, before, after) => {
      return quote + before.replace(/\\n/g, ' ') + after + quote;
    });
  }
  const sanitizedCode = sanitizeUserCode(userCode);
  // Detect globals and rewrite code
  const { globals, conflicts } = extractGlobalVariablesWithConflicts(sanitizedCode);
  const rewrittenCode = rewriteUserCodeWithWindowGlobals(sanitizedCode, globals);
  const escapedCode = escapeBackticks(rewrittenCode);

  const uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 8);
  const p5UriWithCacheBust = vscode.Uri.parse(p5Uri.toString() + `?v=${uniqueId}`);
  const p5SoundUriWithCacheBust = vscode.Uri.parse(p5SoundUri.toString() + `?v=${uniqueId}`);
  const p5CaptureUriWithCacheBust = vscode.Uri.parse(p5CaptureUri.toString() + `?v=${uniqueId}`);
  // --- Inject common, import, and include scripts ---
  let scriptTags = '';
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    // --- Determine sketch file's folder for "include" ---
    let includeFiles: string[] = [];
    if (panel && (panel as any)._sketchFilePath) {
      const sketchDir = path.dirname((panel as any)._sketchFilePath);
      const includeDir = path.join(sketchDir, 'include');
      // Only try to list files if the include folder exists
      if (fs.existsSync(includeDir) && fs.statSync(includeDir).isDirectory()) {
        includeFiles = await listFilesRecursively(vscode.Uri.file(includeDir), ['.js', '.ts']);
      }
    }
    if (workspaceFolder) {
      // --- Collect import, common, and include scripts in the requested order ---
      const importDir = path.join(workspaceFolder.uri.fsPath, 'import');
      const commonDir = path.join(workspaceFolder.uri.fsPath, 'common');
      const importFiles = await listFilesRecursively(vscode.Uri.file(importDir), ['.js', '.ts']);
      const commonFiles = await listFilesRecursively(vscode.Uri.file(commonDir), ['.js', '.ts']);
      // includeFiles already set above

      const allFiles = [...importFiles, ...commonFiles, ...includeFiles];

      scriptTags = `<script src='${p5UriWithCacheBust}'></script>\n` +
        `<script src='${p5SoundUriWithCacheBust}'></script>\n` +
        `<script src='${p5CaptureUriWithCacheBust}'></script>\n` +
        allFiles.map(s => `<script src='${panel.webview.asWebviewUri(vscode.Uri.file(s))}'></script>`).join('\n');
    } else {
      // Fallback: just p5 and p5.sound
      scriptTags = `<script src='${p5UriWithCacheBust}'></script>\n` +
        `<script src='${p5SoundUriWithCacheBust}'></script>`;
      // capture is optional in fallback
    }
  } catch (e) { /* ignore */ }

  // In createHtml, get debounceDelay from config and pass to webview
  const debounceDelay = cfg.getDebounceDelay();
  const varControlDebounceDelay = cfg.getVariablePanelDebounceDelay();

  // Get the webview URI for the media folder (if it exists)
  let mediaWebviewUriPrefix = '';
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
      const mediaFolder = path.join(workspaceFolder.uri.fsPath, 'media');
      const mediaUri = vscode.Uri.file(mediaFolder);
      mediaWebviewUriPrefix = panel.webview.asWebviewUri(mediaUri).toString();
    }
  } catch (e) { /* ignore */ }

  // --- NEW: Get the webview URI for the include folder (if it exists) ---
  let includeWebviewUriPrefix = '';
  try {
    if (panel && (panel as any)._sketchFilePath) {
      const sketchDir = path.dirname((panel as any)._sketchFilePath);
      const includeDir = path.join(sketchDir, 'include');
      if (fs.existsSync(includeDir) && fs.statSync(includeDir).isDirectory()) {
        const includeUri = vscode.Uri.file(includeDir);
        includeWebviewUriPrefix = panel.webview.asWebviewUri(includeUri).toString();
      }
    }
  } catch (e) { /* ignore */ }

  // Match overlay font size to the editor font size
  const editorFontSize = vscode.workspace.getConfiguration('editor').get<number>('fontSize', 14);

  return `<!DOCTYPE html>
<!-- cache-bust: ${uniqueId} -->
<html>
<head>
${scriptTags}
<script>
// Provide the sketch filename (without extension) to the webview
window._p5SketchFileName = ${JSON.stringify(sketchFileName)};
window._p5UserCode = \`${escapedCode}\`;
// --- output() alias for console.log ---
window.output = function(...args) { console.log(...args); };
// --- Provide MEDIA_FOLDER and INCLUDE_FOLDER globals for user sketches ---
// Always ensure trailing slash so MEDIA_FOLDER + "file.png" works.
(function() {
  function ensureTrailingSlash(str) {
    if (!str) return "";
    return str.endsWith("/") ? str : str + "/";
  }
  window.MEDIA_FOLDER = ensureTrailingSlash(${JSON.stringify(mediaWebviewUriPrefix)});
  window.INCLUDE_FOLDER = ensureTrailingSlash(${JSON.stringify(includeWebviewUriPrefix)});
})();
</script>
<script>
// --- OSC SEND/RECEIVE API for user sketches ---
window.sendOSC = function(address, args) {
  if (typeof vscode !== "undefined" && address) {
    vscode.postMessage({ type: "oscSend", address, args: Array.isArray(args) ? args : [] });
  }
};
// --- OSC START/STOP API for user sketches ---
window.startOSC = function(localAddress, localPort, remoteAddress, remotePort) {
  if (typeof vscode !== "undefined") {
    vscode.postMessage({
      type: "startOSC",
      localAddress: localAddress,
      localPort: localPort,
      remoteAddress: remoteAddress,
      remotePort: remotePort
    });
  }
};
window.stopOSC = function() {
  if (typeof vscode !== "undefined") {
    vscode.postMessage({ type: "stopOSC" });
  }
};
// Helper: normalize OSC args (supports osc.js metadata objects)
// Example inputs: 42, [1,2], [{type:'i', value: 3}] -> returns plain JS values array
window.oscArgsToArray = function(args) {
  const list = Array.isArray(args) ? args : [args];
  return list.map(arg => (arg && typeof arg === 'object' && 'value' in arg) ? arg.value : arg);
};
// Only window.receivedOSC(address, args) is supported for incoming OSC messages.
window.addEventListener("message", function(e) {
  if (e.data && e.data.type === "oscReceive") {
    if (typeof window.receivedOSC === "function") {
      window.receivedOSC(e.data.address, e.data.args);
    }
  }
});
// --- Custom context menu for "Save As png..." and "Copy image" on canvas ---
(function() {
  // Inject style for custom context menu hover effect
  if (!document.getElementById('p5-custom-menu-style')) {
    const style = document.createElement('style');
    style.id = 'p5-custom-menu-style';
  style.textContent = \`
      .p5-custom-context-menu {
        position: fixed;
        background: #1F1F1F;
        color: #cccccc;
        padding: 0;
        border: 2px solid #454545;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        z-index: 10001;
        font-family: monospace;
        user-select: none;
     min-width: 120px;
        overflow: hidden;
      }
      .p5-custom-context-menu-item {
        padding: 5px 16px;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        border-radius: 5px;
        margin: 1px 2px;
        font-size: 13px;
      }
      .p5-custom-context-menu-item:hover {
        background: #0078D4 !important;
        color: #fff !important;
      }
  \`;
    document.head.appendChild(style);
  }
  let customMenu = null;
  document.addEventListener('contextmenu', function(e) {
    // Only show on canvas (p5Canvas)
    const canvas = e.target && e.target.classList && e.target.classList.contains('p5Canvas') ? e.target : null;
    if (!canvas) return;
    e.preventDefault();
    // Remove any existing menu
    if (customMenu) customMenu.remove();
    customMenu = document.createElement('div');
    customMenu.className = 'p5-custom-context-menu';
    customMenu.style.left = e.clientX + 'px';
    customMenu.style.top = e.clientY + 'px';

    // Helper: get a PNG dataUrl of the canvas at its display size (not upscaled by CSS)
    function getCanvasDataUrlAtDisplaySize() {
      // If canvas width/height != clientWidth/clientHeight, draw to a temp canvas at display size
      const c = canvas;
      const cssW = c.clientWidth;
      const cssH = c.clientHeight;
      const pxW = c.width;
      const pxH = c.height;
      if (pxW === cssW && pxH === cssH) {
        return c.toDataURL('image/png');
      }
      // Downscale to display size
      const tmp = document.createElement('canvas');
      tmp.width = cssW;
      tmp.height = cssH;
      const ctx = tmp.getContext('2d');
      ctx.drawImage(c, 0, 0, pxW, pxH, 0, 0, cssW, cssH);
      return tmp.toDataURL('image/png');
    }

    // Save as png...
    const saveItem = document.createElement('div');
    saveItem.className = 'p5-custom-context-menu-item';
    saveItem.textContent = 'Save as png...';
    saveItem.addEventListener('mousedown', function(ev) { ev.stopPropagation(); ev.preventDefault(); });
    saveItem.addEventListener('click', function() {
      try {
        const dataUrl = getCanvasDataUrlAtDisplaySize();
        // Use the sketch filename (without extension) if available
        let fileName = (window._p5SketchFileName || '').replace(/\.[^.]+$/, '') || 'sketch';
        fileName = fileName + '.png';
        vscode.postMessage({ type: 'saveCanvasImage', dataUrl, fileName });
      } catch (err) {
        vscode.postMessage({ type: 'showError', message: 'Failed to export image: ' + err });
      }
      customMenu.remove();
    });

    // Copy image
    const copyItem = document.createElement('div');
    copyItem.className = 'p5-custom-context-menu-item';
    copyItem.textContent = 'Copy image';
    copyItem.addEventListener('mousedown', function(ev) { ev.stopPropagation(); ev.preventDefault(); });
    copyItem.addEventListener('click', async function() {
      try {
        const dataUrl = getCanvasDataUrlAtDisplaySize();
        // Try using Clipboard API if available
  if (navigator.clipboard && window.ClipboardItem) {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const item = new window.ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          // Show notification in webview (since VSCode API not available here)
          var cssW = canvas.clientWidth;
          var cssH = canvas.clientHeight;
          vscode.postMessage({ type: 'showInfo', message: 'Canvas image copied to clipboard (' + cssW + ' x ' + cssH + ')' });
        } else {
          vscode.postMessage({ type: 'copyCanvasImage', dataUrl });
        }
      } catch (err) {
        vscode.postMessage({ type: 'showError', message: 'Failed to copy image: ' + err });
      }
      customMenu.remove();
    });

    customMenu.appendChild(saveItem);
    customMenu.appendChild(copyItem);
    document.body.appendChild(customMenu);

    // Remove menu on click elsewhere or escape
    function removeMenu() { if (customMenu) { customMenu.remove(); customMenu = null; } }
    setTimeout(() => {
  document.addEventListener('mousedown', removeMenu, { once: true });
  document.addEventListener('keydown', function esc(ev) { if (ev && ev.key === 'Escape') { removeMenu(); document.removeEventListener('keydown', esc); } });
    }, 0);
  });
})();
</script>
<style>
:root { --overlay-font-size: ${editorFontSize}px; --toolbar-scale: 1.5; }
html,body{margin:0;padding:0;overflow:hidden;width:100%;height:100%;background:transparent;}
canvas.p5Canvas{
  display:block;
  /* --- Add drop shadow below --- */
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.35);
}
#error-overlay{
  position:fixed; top:0; left:0; right:0; bottom:0;
  background: #1f1f1f; color:#f22268; font-family:monospace; padding:10px; font-size: var(--overlay-font-size);
  display:none; z-index: 9999; white-space:pre-wrap; overflow:auto;
}
/* Warning overlay (yellow text) */
#warning-overlay{
  position:fixed; top:0; left:0; right:0; bottom:0;
  background: #1f1f1f; color:#ffeb3b; font-family:monospace; padding:10px; font-size: var(--overlay-font-size);
  display:none; z-index: 9998; white-space:pre-wrap; overflow:auto;
}
/* Warning overlay (yellow text) */
#warning-overlay{
  position:fixed; top:0; left:0; right:0; bottom:0;
  background: #1f1f1f; color:#ffeb3b; font-family:monospace; padding:10px;
  display:none; z-index: 9998; white-space:pre-wrap; overflow:auto;
}
/* Inputs overlay */
#inputs-overlay{
  position:fixed; top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.7); color:#fff; font-family:monospace; padding:16px;
  display:none; z-index: 10002; overflow:auto;
}
#inputs-overlay .panel{
  max-width: 520px; margin: 40px auto; background:#1f1f1f; border:1px solid #444; border-radius:8px; padding:16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
}
#inputs-overlay h2{ margin:0 0 8px 0; font-size: 18px; }
#inputs-overlay p{ margin:0 0 12px 0; color:#ddd; }
#inputs-overlay .input-row{ display:flex; align-items:center; gap:8px; margin:6px 0; }
#inputs-overlay .input-row label{ width: 180px; text-align:right; color:#ddd; }
#inputs-overlay .input-row input[type="text"],
#inputs-overlay .input-row input[type="number"]{
  flex:1; padding:6px 8px; border-radius:4px; border:1px solid #555; background:#222; color:#fff;
}
#inputs-overlay .buttons{ display:flex; justify-content:flex-end; gap:8px; margin-top:14px; }
#inputs-overlay button{ padding:6px 10px; border-radius:4px; border:1px solid #555; background:#2b2b2b; color:#fff; cursor:pointer; }
#inputs-overlay button.primary{ background:#0078D4; border-color:#0078D4; }
#inputs-overlay button:hover{ filter: brightness(1.1); }

#p5-toolbar { /* removed toolbar */ }
/* FPS indicator */
#fps-indicator {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 10004;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-family: monospace;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  user-select: none;
  pointer-events: none; /* don't block clicks */
  display: none;
}
#p5-var-controls {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: #1f1f1f;
  z-index: 10000;
  padding: 4px 12px 2px 12px;
  font-family: monospace;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4px 10px;
  max-height: calc(3 * 2.0em);
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
  top: 4px;
  right: 4px;
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
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
  padding: 0px 4px 2px 4px;
  font-family: monospace;
  font-size: 20px;
  z-index: 10001;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  min-width: 24px;
  min-height: 28px;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.2s cubic-bezier(.4,0,.2,1), transform 0.2s cubic-bezier(.4,0,.2,1);
}
#p5-var-drawer-tab.tab-visible {
  display: flex !important;
  opacity: 1;
  transform: translateY(0%);
}
</style>
</head>
<body>
<div id="error-overlay"></div>
<div id="warning-overlay"></div>
<div id="fps-indicator" style="display:${showFPS ? 'block' : 'none'}"></div>
<div id="inputs-overlay" aria-hidden="true">
  <div class="panel">
    <h2>Sketch inputs</h2>
    <p>Enter values for top-of-sketch inputs before running.</p>
    <div id="inputs-container"></div>
    <div class="buttons">
      <button id="inputs-submit" class="primary" disabled>Run</button>
    </div>
  </div>
  </div>
<!-- In-webview toolbar removed; actions are now provided via editor title bar buttons -->
<script>
// --- Prevent default VSCode context menu except on canvas ---
document.addEventListener('contextmenu', function(e) {
  // Allow context menu only on canvas with class 'p5Canvas'
  if (!(e.target && e.target.classList && e.target.classList.contains('p5Canvas'))) {
    e.preventDefault();
  }
});
</script>
<script>
// Capture visibility toggle (no in-webview toolbar)
(function() {
  window._p5CaptureVisible = ${initialCaptureVisible ? 'true' : 'false'};
  // Reset capture UI/timer by removing existing containers
  function resetCaptureUIAndTimer() {
    try {
      const containers = document.querySelectorAll('.p5c-container');
      containers.forEach(el => el.remove());
      if (typeof window._applyCaptureVisibility === 'function') {
        try { window._applyCaptureVisibility(); } catch {}
      }
    } catch {}
  }
  function applyCaptureVisibility() {
    try {
      // Remove any duplicate capture panel before showing/hiding
      const containers = document.querySelectorAll('.p5c-container');
      if (containers.length > 1) {
        // Keep the first, remove the rest
        for (let i = 1; i < containers.length; i++) {
          containers[i].remove();
        }
      }
      const div = document.querySelector('.p5c-container');
      if (div) div.style.display = window._p5CaptureVisible ? '' : 'none';
    } catch {}
  }
  // Observe DOM to apply visibility when capture DOM appears
  const obs = new MutationObserver(applyCaptureVisibility);
  obs.observe(document.body, { childList: true, subtree: true });
  window._applyCaptureVisibility = applyCaptureVisibility;
  // On reload, remove all but one capture panel if any exist
  document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.p5c-container');
    if (containers.length > 1) {
      for (let i = 1; i < containers.length; i++) {
        containers[i].remove();
      }
    }
  });
  // Expose reset helper
  window._resetCaptureUIAndTimer = resetCaptureUIAndTimer;
  // Apply initial visibility on load
  try { applyCaptureVisibility(); } catch {}
})();
</script>
<script>
// --- Provide MEDIA_FOLDER global for user sketches ---
const MEDIA_FOLDER = ${JSON.stringify(mediaWebviewUriPrefix)};
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
window._p5VarControlDebounceDelay = ${varControlDebounceDelay};

// Notify extension that webview is loaded
window.addEventListener('DOMContentLoaded', () => {
  vscode.postMessage({ type: 'webviewLoaded' });
  // Ensure capture toggle icon matches preserved visibility state after reload
  try { vscode.postMessage({ type: 'captureVisibilityChanged', visible: !!window._p5CaptureVisible }); } catch {}
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
  const wl=document.getElementById("warning-overlay");
  if(wl){wl.textContent=""; wl.style.display="none";}
}
function showWarning(msg){
  const wl = document.getElementById('warning-overlay');
  if (wl) { wl.textContent = msg; wl.style.display = 'block'; }
}
// Suppress benign internal p5 error that can appear after another error
function _p5ShouldSuppressError(raw){
  try{
    const msg = (raw==null?"":String(raw));
    // Check both with and without our [RUNTIME ERROR] prefix
    return /(^|\s)\[?‼️RUNTIME ERROR\]?\s*this\._decrementPreload is not a function/i.test(msg)
      || /this\._decrementPreload is not a function/i.test(msg)
      || /_decrementPreload/.test(msg);
  }catch{ return false; }
}

(function(){
  const origLog = console.log;
  console.log = function(...args){
    try { vscode.postMessage({ type: "log", message: args }); } catch { }
    origLog.apply(console, args);
  };
  window.output = function(...args){
    try { vscode.postMessage({ type: "log", message: args, focus: true }); } catch { }
    origLog.apply(console, args);
  };
  const origErr=console.error;
  console.error=function(...args){
    // Always prefix with [‼️RUNTIME ERROR] and stringify arguments, including Arguments objects and Error objects
    let msg = Array.prototype.map.call(args, a => {
      if (typeof a === "string") return a;
      if (Object.prototype.toString.call(a) === "[object Arguments]") return Array.prototype.join.call(a, " ");
      if (a instanceof Error) return a.message;
      return (a && a.toString ? a.toString() : String(a));
    }).join(" ");
    // Suppress only the specific benign p5 internal error
    if (_p5ShouldSuppressError(msg)) { origErr.apply(console,args); return; }
    if (!msg.startsWith("[RUNTIME ERROR]")) {
      msg = "[‼️RUNTIME ERROR] " + msg;
    }
    showError(msg); // Always show in overlay
    vscode.postMessage({type:"showError",message:msg}); // Always log in output
    origErr.apply(console,args);
  }
})();

window.onerror = function(message, source, lineno, colno, error) {
  let msg = message && message.toString ? message.toString() : String(message);
  // Normalize the noisy appendChild/SyntaxError into a clearer message
  if (msg && msg.indexOf("Failed to execute 'appendChild' on 'Node': Invalid or unexpected token") !== -1) {
    msg = 'Uncaught SyntaxError: Invalid or unexpected character';
  }
  if (_p5ShouldSuppressError(msg)) {
    // Let it go to the browser console but do not show overlay or VS Code output
    return false;
  }
  if (!msg.startsWith('[RUNTIME ERROR]')) {
    msg = '[‼️RUNTIME ERROR] ' + msg;
  }
  showError(msg);
  vscode.postMessage({ type: 'showError', message: msg });
  return false; // Let the error propagate in the console as well
};

// --- FPS indicator updater ---
(function(){
  const el = document.getElementById('fps-indicator');
  if (!el) return;
  let lastTs = performance.now();
  function tick(ts){
    try {
      // Prefer p5's deltaTime if available; otherwise, use rAF delta
      let dt = 0;
      if (window._p5Instance && typeof window._p5Instance.deltaTime === 'number' && window._p5Instance.deltaTime > 0) {
        dt = window._p5Instance.deltaTime;
      } else if (typeof window.deltaTime === 'number' && window.deltaTime > 0) {
        dt = window.deltaTime;
      } else {
        dt = ts - lastTs;
      }
      let text = '';
      if (dt > 0 && isFinite(dt)) {
        const fps = Math.round(1000 / dt);
        if (fps > 0 && fps <= 240) text = fps + ' fps';
      }
      if (el.style.display !== 'none') {
        el.textContent = text;
      }
    } catch {}
    lastTs = ts;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// --- Add this handler for unhandled promise rejections ---
window.onunhandledrejection = function(event) {
  let msg = '';
  if (event && event.reason) {
    if (typeof event.reason === 'string') {
      msg = event.reason;
    } else if (event.reason && event.reason.message) {
      msg = event.reason.message;
    } else {
      try { msg = JSON.stringify(event.reason); } catch { msg = String(event.reason); }
    }
  } else {
    msg = 'Unhandled promise rejection';
  }
  if (_p5ShouldSuppressError(msg)) {
    return; // do not show overlay or postMessage for this specific error
  }
  if (!msg.startsWith('[‼️RUNTIME ERROR]')) {
    msg = '[‼️RUNTIME ERROR] ' + msg;
  }
  showError(msg);
  vscode.postMessage({ type: 'showError', message: msg });
  // Prevent default logging to console (optional)
  // event.preventDefault();
};

function runUserSketch(code){
  clearError();
  window._p5ErrorLogged = false;
  window._p5SetupDone = false;
  window._p5PostedAfterSetup = false;
  window._p5LoopPaused = false;
  if(window._p5Instance){window._p5Instance.remove();window._p5Instance=null;}
  document.querySelectorAll("canvas").forEach(c=>c.remove());

  // Remove previous user code script if present
  const prevScript = document.getElementById('user-code-script');
  if (prevScript) prevScript.remove();

  // Inject user code as a new script tag and attach error handler
  const script = document.createElement('script');
  script.id = 'user-code-script';
  script.type = 'text/javascript';
  script.setAttribute('data-user-code', 'true');
  script.textContent = code;
  script.onerror = function(event) {
    let raw = 'Unknown error';
    if (_p5ShouldSuppressError(raw)) { return; }
    let msg = '[‼️RUNTIME ERROR] ' + raw;
    showError(msg);
    if (typeof vscode !== "undefined") {
      vscode.postMessage({ type: "showError", message: msg });
    }
    window._p5Instance = null;
  };
  document.head.appendChild(script);

  try {
  window._p5Instance = new window.p5();
    try { applyDrawLoopState(); } catch {}
    // After p5 starts, poll for setup completion once and push all current globals to VARIABLES panel
    try {
      if (window._p5SetupWatcher) { try { clearInterval(window._p5SetupWatcher); } catch {} }
      window._p5SetupWatcher = setInterval(() => {
        try {
          if (window._p5SetupDone && !window._p5PostedAfterSetup) {
            window._p5PostedAfterSetup = true;
            if (window._p5GlobalVarTypes) {
              Object.keys(window._p5GlobalVarTypes).forEach(name => {
                try {
                  let val = window[name];
                  // Normalize by declared type
                  const t = window._p5GlobalVarTypes[name] || typeof val;
                  if (t === 'number') {
                    const n = Number(val);
                    if (!Number.isNaN(n)) val = n;
                  } else if (t === 'boolean') {
                    val = (val === true || val === 'true' || val === 1 || val === '1');
                  } else if (t !== 'string') {
                    // Skip complex types for the VARIABLES panel
                    return;
                  }
                  const generatedAt = Date.now();
                  try {
                    if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
                    window._p5VarUpdateTimes[name] = generatedAt;
                  } catch {}
                  try { vscode.postMessage({ type: 'updateGlobalVar', name, value: cloneValueForPost(val), generatedAt }); } catch {}
                } catch {}
              });
            }
            try { if (window._p5SetupWatcher) { clearInterval(window._p5SetupWatcher); window._p5SetupWatcher = null; } } catch {}
          }
        } catch {}
      }, 50);
    } catch {}
  } catch (err) {
    let raw = (err && err.message ? err.message : String(err));
    if (_p5ShouldSuppressError(raw)) { return; }
    let msg = '[‼️RUNTIME ERROR] ' + raw;
    showError(msg);
    if (typeof vscode !== "undefined") {
      vscode.postMessage({ type: "showError", message: msg });
    }
    window._p5Instance = null;
  }
}

function waitForP5AndRunSketch() {
  // If there's no user code (e.g., a syntax error path injected empty code),
  // don't instantiate p5 to prevent runtime errors like _decrementPreload.
  const hasCode = typeof window._p5UserCode === 'string' && window._p5UserCode.trim().length > 0;
  if (!hasCode) {
    return; // Extension will display the syntax error overlay separately.
  }
  // Defer running until p5 is loaded AND variables have been sent so watchers are installed,
  // to ensure we capture final values after setup-only sketches.
  window._p5WaitStart = window._p5WaitStart || performance.now();
  const MAX_WAIT_MS = 1200; // safety cap
  const watchersReady = !!window._p5VarWatchersReady; // set when 'setGlobalVars' arrives
  if (window.p5 && (watchersReady || (performance.now() - window._p5WaitStart) > MAX_WAIT_MS)) {
    runUserSketch(window._p5UserCode);
  } else {
    setTimeout(waitForP5AndRunSketch, 10);
  }
}
waitForP5AndRunSketch();

// Toolbar buttons removed; actions triggered via VS Code title bar commands.

window.addEventListener("resize",()=>{ 
  if(window._p5Instance?._renderer && window._p5UserAutoFill){
    window._p5Instance.resizeCanvas(window.innerWidth,window.innerHeight);
    const bgArgs = window._p5LastBackgroundArgs || [255];
    if(window._p5UserBackground) window._p5Instance.background(...bgArgs);
  }
});

window._p5LoopPaused = false;
function applyDrawLoopState(){
  try {
    if (!window._p5Instance) return;
    if (window._p5LoopPaused) {
      if (typeof window._p5Instance.noLoop === 'function') { window._p5Instance.noLoop(); }
    } else {
      if (typeof window._p5Instance.loop === 'function') { window._p5Instance.loop(); }
    }
  } catch {}
}

window.addEventListener("message", e => {
  const data = e.data;
  switch(data.type){
    case "invokeReload":
      vscode.postMessage({type:"reload-button-clicked", preserveGlobals: true});
      break;
    case "invokeStepRun":
      vscode.postMessage({type:"step-run-clicked"});
      break;
    case "invokeContinue":
      vscode.postMessage({type:"continue-clicked"});
      break;
    case "invokeSingleStep":
      vscode.postMessage({type:"single-step-clicked"});
      break;
    case "pauseDrawLoop":
      window._p5LoopPaused = true;
      applyDrawLoopState();
      break;
    case "resumeDrawLoop":
      window._p5LoopPaused = false;
      applyDrawLoopState();
      break;
    case "toggleCaptureVisibility":
      window._p5CaptureVisible = !window._p5CaptureVisible;
      if (typeof window._applyCaptureVisibility === 'function') {
        try { window._applyCaptureVisibility(); } catch {}
      }
      try { vscode.postMessage({ type: 'captureVisibilityChanged', visible: !!window._p5CaptureVisible }); } catch {}
      break;
    case "reload":
      // Always reset capture UI/timer on reload so the panel timer shows fresh
  try { if (typeof window._resetCaptureUIAndTimer === 'function') window._resetCaptureUIAndTimer(); } catch {}
  if (data.preserveGlobals) {
        // Reset stepping control flags before reloading
        try {
          window.__liveP5Gate = null;
          window.__liveP5DrawBusy = false;
          window.__liveP5FrameCounter = 0;
          window.__liveP5StepResolve = null;
          window.__liveP5StepAdvance = null;
          window.__liveP5Stepping = false;
        } catch {}
        // Save current global values
  const prevGlobals = {};
        if (window._p5GlobalVarTypes) {
          Object.keys(window._p5GlobalVarTypes).forEach(name => {
            prevGlobals[name] = window[name];
          });
        }
        // Remove global var declarations and window assignments from code
  let codeNoGlobals = String(data.code);
        if (window._p5GlobalVarTypes) {
          Object.keys(window._p5GlobalVarTypes).forEach(name => {
            // Remove lines like 'var x = ...;' or 'var x;' (with or without semicolon)
            codeNoGlobals = codeNoGlobals.replace(new RegExp('^\\s*var\\s+'+name+'(\\s*=.*)?;?\\s*$', 'gm'), '');
            // Remove lines like 'window.x = x;' (with or without semicolon)
            codeNoGlobals = codeNoGlobals.replace(new RegExp('^\\s*window\\\.'+name+'\\s*=\\s*' + name + ';?\\s*$', 'gm'), '');
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
        // Reset stepping control flags before reloading
        try {
          window.__liveP5Gate = null;
          window.__liveP5DrawBusy = false;
          window.__liveP5FrameCounter = 0;
          window.__liveP5StepResolve = null;
          window.__liveP5StepAdvance = null;
          window.__liveP5Stepping = false;
        } catch {}
  runUserSketch(String(data.code));
      }
      break;
    case "stop":
      try {
        window.__liveP5Gate = null;
        window.__liveP5DrawBusy = false;
        window.__liveP5FrameCounter = 0;
        window.__liveP5StepResolve = null;
        window.__liveP5StepAdvance = null;
        window.__liveP5Stepping = false;
      } catch {}
  try { if (typeof window._resetCaptureUIAndTimer === 'function') window._resetCaptureUIAndTimer(); } catch {}
  if(window._p5Instance){window._p5Instance.remove(); window._p5Instance=null;}
      document.querySelectorAll("canvas").forEach(c=>c.remove());
      break;
  case "showError": showError(data.message); break;
  case "showWarning": showWarning(data.message); break;
    // Removed toolbar toggle handlers (reload/debug buttons handled via title bar)
  case "resetErrorFlag": window._p5ErrorLogged = false; break;
    case "syntaxError": showError(data.message); break;
    case "requestLastRuntimeError":
      // If there was a runtime error, re-send it to the extension
      if (window._p5ErrorLogged && window._p5Instance == null) {
        const el = document.getElementById("error-overlay");
        if (el && el.textContent) {
          // --- FIX: Always prefix with [RUNTIME ERROR] if not present ---
          let msg = el.textContent || '';
          if (typeof msg !== 'string') { try { msg = String(msg); } catch { msg = '' + msg; } }
          if (!msg.startsWith("[‼️RUNTIME ERROR]")) {
            msg = "[‼️RUNTIME ERROR] " + msg;
          }
          vscode.postMessage({type:"showError",message:msg});
        }
      }
      break;
    case 'step-advance':
      try {
        if (typeof window.__liveP5StepAdvance === 'function') {
          // If there is an active step resolver, advance; otherwise clear highlight once.
          if (window.__liveP5StepResolve) {
            window.__liveP5StepAdvance();
          } else if (typeof window.__liveP5ClearHighlight === 'function') {
            window.__liveP5ClearHighlight();
          }
        } else if (typeof window.__liveP5ClearHighlight === 'function') {
          window.__liveP5ClearHighlight();
        }
      } catch (e) { }
      break;
    case 'setGlobalVars':
      if (typeof data.debounceDelay === 'number') {
        window._p5DebounceDelay = data.debounceDelay;
      }
      const readOnly = !!data.readOnly;
      const suppressPanel = !!data.suppressPanel;
      // Store types and update timestamps for later use before rendering
      window._p5GlobalVarTypes = {};
      if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
      (data.variables || []).forEach((v) => {
        if (!v || !v.name) return;
        const incomingType = v.type || (Array.isArray(v.value) ? 'array' : typeof v.value);
        window._p5GlobalVarTypes[v.name] = incomingType;
        if (typeof v.updatedAt === 'number') {
          window._p5VarUpdateTimes[v.name] = v.updatedAt;
        }
      });
      renderGlobalVarControls(data.variables, readOnly, { suppressPanel });
      // Install watchers so changes from the sketch propagate live to the VARIABLES panel
  try { if (typeof window._installGlobalVarWatchers === 'function') window._installGlobalVarWatchers(data.variables); } catch {}
      // Start rAF-based polling to ensure live updates even when accessors cannot be defined
  try { if (typeof window._startGlobalVarPolling === 'function') window._startGlobalVarPolling(data.variables); } catch {}
      // Signal that watchers are ready so we can start the sketch safely
  try { window._p5VarWatchersReady = true; } catch {}
      break;
    case 'updateGlobalVar':
      updateGlobalVarInSketch(data.name, data.value);
      break;
    case 'requestGlobalsSnapshot':
      try {
        // If we've already posted final values after setup, skip duplicate snapshot
        if (window._p5PostedAfterSetup) break;
        if (window._p5GlobalVarTypes) {
          Object.keys(window._p5GlobalVarTypes).forEach(name => {
            try {
              let val = window[name];
              const t = (window._p5GlobalVarTypes && window._p5GlobalVarTypes[name]) || typeof val;
              if (t === 'number') {
                const n = Number(val);
                if (!Number.isNaN(n)) val = n;
              } else if (t === 'boolean') {
                val = (val === true || val === 'true' || val === 1 || val === '1');
              } else if (t === 'array' || Array.isArray(val)) {
                val = cloneValueForPost(val);
              } else if (t !== 'string') {
                return;
              }
              const generatedAt = Date.now();
              try {
                if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
                window._p5VarUpdateTimes[name] = generatedAt;
              } catch {}
              try { vscode.postMessage({ type: 'updateGlobalVar', name, value: cloneValueForPost(val), generatedAt }); } catch {}
            } catch {}
          });
        }
      } catch {}
      break;
    case "toggleRecordButton": {
      // Now only sets internal capture visibility flag (no button UI)
      window._p5CaptureVisible = !!data.show;
      if (typeof window._applyCaptureVisibility === 'function') {
        try { window._applyCaptureVisibility(); } catch {}
      }
      break;
    }
    case 'updateVarDebounceDelay':
  if (typeof data.value === 'number') window._p5VarControlDebounceDelay = data.value;
      break;
    case 'updateOverlayFontSize':
      if (typeof data.value === 'number') {
        document.documentElement.style.setProperty('--overlay-font-size', data.value + 'px');
      }
      break;
    case 'toggleFPS':
      try {
        const el = document.getElementById('fps-indicator');
        if (el) {
          el.style.display = data.show ? 'block' : 'none';
          if (!data.show) el.textContent = '';
        }
      } catch {}
      break;
    case 'showTopInputs':
      try {
        if (!data || !Array.isArray(data.items)) return;
        const overlay = document.getElementById('inputs-overlay');
        const container = document.getElementById('inputs-container');
        const btnSubmit = document.getElementById('inputs-submit');
        if (!overlay || !container) return;
        container.innerHTML = '';
  data.items.forEach((it) => {
          const row = document.createElement('div');
          row.className = 'input-row';
          const lab = document.createElement('label');
          lab.textContent = ((it && it.label) || (it && it.varName)) + ':';
          lab.htmlFor = 'topin_' + it.varName;
          let inputEl;
          if (typeof it.defaultValue === 'boolean') {
            inputEl = document.createElement('input');
            inputEl.type = 'checkbox';
            inputEl.id = 'topin_' + it.varName;
            inputEl.checked = !!it.defaultValue;
          } else {
            inputEl = document.createElement('input');
            inputEl.type = (typeof it.defaultValue === 'number') ? 'number' : 'text';
            inputEl.id = 'topin_' + it.varName;
            if (typeof it.defaultValue !== 'undefined' && it.defaultValue !== null) {
              inputEl.value = String(it.defaultValue);
            } else {
              inputEl.value = '';
            }
          }
          inputEl.setAttribute('data-name', it.varName);
          row.appendChild(lab);
          row.appendChild(inputEl);
          container.appendChild(row);
        });
        // Validation: enable Run only when all non-checkbox fields are filled (non-empty and valid number for numeric fields)
        function allValid() {
          let ok = true;
          container.querySelectorAll('[data-name]').forEach((el) => {
            if (!ok) return;
            if (el.type === 'checkbox') { ok = true; return; }
            const v = ((el.value || '').trim());
            if (v.length === 0) { ok = false; return; }
            if (el.type === 'number') {
              const n = Number(v);
              if (Number.isNaN(n)) { ok = false; return; }
            }
          });
          return ok;
        }
        function wireValidation() {
          if (!btnSubmit) return;
          const update = () => { btnSubmit.disabled = !allValid(); };
          container.querySelectorAll('[data-name]').forEach((el) => {
            el.addEventListener('input', update);
            el.addEventListener('change', update);
          });
          // initial state
          update();
        }
        wireValidation();
        if (btnSubmit) {
          btnSubmit.onclick = () => {
            if (btnSubmit.disabled) return;
            const values = [];
            container.querySelectorAll('[data-name]').forEach((el) => {
              const name = el.getAttribute('data-name');
              let value;
              if (el.type === 'checkbox') value = !!el.checked;
              else value = el.value;
              values.push({ name, value });
            });
            vscode.postMessage({ type: 'submitTopInputs', values });
          };
        }
        overlay.style.display = 'block';
        overlay.setAttribute('aria-hidden', 'false');
      } catch {}
      break;
    case 'hideTopInputs': {
  const overlay = document.getElementById('inputs-overlay');
  if (overlay) { overlay.style.display = 'none'; overlay.setAttribute('aria-hidden', 'true'); }
      break;
    }
  }
});

function updateGlobalVarInSketch(name, value) {
  // Always set window[name]; rewritten code references window.<name>
  let type = ((window._p5GlobalVarTypes && window._p5GlobalVarTypes[name]) || typeof window[name]);
  if (type === 'number') {
    const num = Number(value);
    if (!isNaN(num)) {
  window[name] = num;
  try { if (window._p5VarPollLast) window._p5VarPollLast[name] = num; } catch {}
  try {
    if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
    window._p5VarUpdateTimes[name] = Date.now();
  } catch {}
    }
  } else if (type === 'boolean') {
    const b = (value === 'true' || value === true);
  window[name] = b;
  try { if (window._p5VarPollLast) window._p5VarPollLast[name] = b; } catch {}
  try {
    if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
    window._p5VarUpdateTimes[name] = Date.now();
  } catch {}
  } else if (type === 'array' || Array.isArray(value)) {
  window[name] = value;
    try {
      if (window._p5VarPollLast) {
        let serialized = null;
        try { serialized = JSON.stringify(value); }
        catch { serialized = null; }
        window._p5VarPollLast[name] = serialized;
      }
    } catch {}
    try {
      if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
      window._p5VarUpdateTimes[name] = Date.now();
    } catch {}
  } else {
  window[name] = value;
  try { if (window._p5VarPollLast) window._p5VarPollLast[name] = value; } catch {}
  try {
    if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
    window._p5VarUpdateTimes[name] = Date.now();
  } catch {}
  }
}

// Live watchers for global variables so the VARIABLES panel updates when the sketch changes values
(function setupVarWatchers(){
  // Backing store for accessor properties
  if (!window._p5GlobalVarValues) window._p5GlobalVarValues = {};
  if (!window._p5VarWatchInstalled) window._p5VarWatchInstalled = {};
  if (!window._p5LastPostedValues) window._p5LastPostedValues = {};
  if (!window._p5VarPollNames) window._p5VarPollNames = new Set();
  if (!window._p5VarPollLast) window._p5VarPollLast = {};
  if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
  window._p5VarPollRaf = window._p5VarPollRaf || null;

  // Debounced emitter for updateGlobalVar
  if (typeof window._p5VarControlDebounceDelay !== 'number') window._p5VarControlDebounceDelay = 50;
  let _debounceTimer = null;
  let _pendingUpdates = new Map(); // name -> latest value
  let _pendingUpdateTimes = new Map(); // name -> timestamp
  function queueUpdate(name, value) {
    try { _pendingUpdates.set(name, cloneValueForPost(value)); } catch {}
    const now = Date.now();
    try {
      _pendingUpdateTimes.set(name, now);
      if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
      window._p5VarUpdateTimes[name] = now;
    } catch {}
    if (_debounceTimer) return;
  const delay = (typeof window._p5VarControlDebounceDelay === 'number' ? window._p5VarControlDebounceDelay : 50);
    _debounceTimer = setTimeout(() => {
      try {
  _pendingUpdates.forEach((val, key) => {
          const generatedAt = _pendingUpdateTimes.get(key) || Date.now();
          try { vscode.postMessage({ type: 'updateGlobalVar', name: key, value: cloneValueForPost(val), generatedAt }); } catch {}
        });
      } catch {}
      _pendingUpdates.clear();
      _pendingUpdateTimes.clear();
      _debounceTimer = null;
    }, delay);
  }

  function coerceByType(name, value) {
  const t = ((window._p5GlobalVarTypes && window._p5GlobalVarTypes[name]) || typeof value);
    if (t === 'number') {
      const n = Number(value);
      return Number.isNaN(n) ? value : n;
    }
    if (t === 'boolean') {
      return (value === true || value === 'true' || value === 1 || value === '1');
    }
    return value;
  }

  // Install watchers for new variables
  window._installGlobalVarWatchers = function(vars) {
    if (!Array.isArray(vars)) return;
  vars.forEach((v) => {
      const name = v && v.name;
      if (!name) return;
  if (window._p5VarWatchInstalled[name]) return; // avoid redefining
      try {
        // Capture current value as initial backing value
  let curr = (typeof window[name] !== 'undefined') ? window[name] : v.value;
  window._p5GlobalVarValues[name] = coerceByType(name, curr);
  if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
  if (typeof window._p5VarUpdateTimes[name] !== 'number') {
    window._p5VarUpdateTimes[name] = Date.now();
  }
  const desc = Object.getOwnPropertyDescriptor(window, name);
        // Define accessor only if configurable or not defined on window, to avoid errors
        if (!desc || desc.configurable !== false) {
          Object.defineProperty(window, name, {
            configurable: true,
            enumerable: true,
            get() {
              return window._p5GlobalVarValues[name];
            },
            set(val) {
              const newVal = coerceByType(name, val);
              const prev = window._p5GlobalVarValues[name];
              window._p5GlobalVarValues[name] = newVal;
              // Only notify if actually changed (strict equality for primitives)
              if (prev !== newVal) {
                queueUpdate(name, newVal);
                window._p5LastPostedValues[name] = cloneValueForPost(newVal);
              }
            }
          });
          window._p5VarWatchInstalled[name] = true;
        }
      } catch {}
    });
  };

  // rAF-based poller as a fallback when accessors can't be defined on window (e.g., non-configurable globals)
  function tickPoller() {
    try {
      // Only check simple primitives
  window._p5VarPollNames.forEach((name) => {
        try {
          const t = ((window._p5GlobalVarTypes && window._p5GlobalVarTypes[name]) || typeof window[name]);
          let curr = window[name];
          if (t === 'number') {
            const n = Number(curr);
            if (!Number.isNaN(n)) curr = n;
          } else if (t === 'boolean') {
            curr = (curr === true || curr === 'true' || curr === 1 || curr === '1');
          } else if (t === 'array' || Array.isArray(curr)) {
            let serialized = null;
            try { serialized = JSON.stringify(curr); }
            catch { serialized = null; }
            const prevSerialized = window._p5VarPollLast[name];
            if (serialized !== prevSerialized) {
              window._p5VarPollLast[name] = serialized;
              queueUpdate(name, curr);
            }
            return;
          } else if (t !== 'string') {
            // Skip complex types
            return;
          }
          const prev = window._p5VarPollLast[name];
          if (prev !== curr) {
            window._p5VarPollLast[name] = curr;
            queueUpdate(name, curr);
          }
        } catch {}
      });
    } catch {}
  window._p5VarPollRaf = requestAnimationFrame(tickPoller);
  }

  window._startGlobalVarPolling = function(vars) {
    try {
      if (Array.isArray(vars)) {
  vars.forEach((v) => { if (v && v.name) window._p5VarPollNames.add(v.name); });
      }
      // Seed last values to avoid immediate spam
      if (Array.isArray(vars)) {
  vars.forEach((v) => {
          if (v && v.name) {
            const val = window[v.name];
            if (Array.isArray(val)) {
              try { window._p5VarPollLast[v.name] = JSON.stringify(val); }
              catch { window._p5VarPollLast[v.name] = null; }
            } else {
              window._p5VarPollLast[v.name] = val;
            }
          }
        });
      }
    } catch {}
    if (!window._p5VarPollRaf) {
      window._p5VarPollRaf = requestAnimationFrame(tickPoller);
    }
  };
})();

// Hides the variable drawer UI in the webview
function hideDrawer() {
  const controls = document.getElementById('p5-var-controls');
  const tab = document.getElementById('p5-var-drawer-tab');
  if (!controls || !tab) return;
  // Ensure controls stay in DOM (so height animation works) but slide out
  controls.classList.add('drawer-hidden');
  controls.style.display = 'flex';
  tab.style.display = 'flex';
  tab.classList.add('tab-visible');
}

// Shows the variable drawer UI in the webview
function showDrawer() {
  const controls = document.getElementById('p5-var-controls');
  const tab = document.getElementById('p5-var-drawer-tab');
  if (!controls || !tab) return;
  controls.style.display = 'flex';
  controls.classList.remove('drawer-hidden');
  tab.classList.remove('tab-visible');
  // Give animation a frame to apply; then hide tab fully
  setTimeout(() => { tab.style.display = 'none'; }, 200);
}

function cloneValueForPost(value) {
  if (Array.isArray(value)) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch {
      try { return value.map((item) => cloneValueForPost(item)); }
      catch {
        try { return Array.from(value); }
        catch { return value; }
      }
    }
  }
  return value;
}

// Dynamically creates/removes the variable drawer and tab, and sets up event listeners for variable changes
function renderGlobalVarControls(vars, readOnly, opts) {
  const suppressPanel = !!(opts && opts.suppressPanel);
  // Send globals to the extension for the VARIABLES panel,
  // but enrich values with current runtime values if available so we don't revert to initial code values.
  if (!suppressPanel && typeof vscode !== 'undefined' && Array.isArray(vars)) {
    try {
      const snapshotTime = Date.now();
      const list = vars.map((v) => {
        const name = v && v.name;
        if (!name) return v;
  let t = ((window._p5GlobalVarTypes && window._p5GlobalVarTypes[name]) || v.type || typeof window[name]);
  let val = (typeof window[name] !== 'undefined') ? window[name] : v.value;
        if (Array.isArray(val)) {
          t = 'array';
        }
        if (t === 'number') {
          const n = Number(val);
          if (!Number.isNaN(n)) val = n;
        } else if (t === 'boolean') {
          val = (val === true || val === 'true' || val === 1 || val === '1');
        } else if (t !== 'string') {
          // keep original for complex types
        }
        const safeVal = cloneValueForPost(val);
        const type = Array.isArray(val) ? 'array' : t;
        if (!window._p5VarUpdateTimes) window._p5VarUpdateTimes = {};
        const lastUpdate = (window._p5VarUpdateTimes && typeof window._p5VarUpdateTimes[name] === 'number')
          ? window._p5VarUpdateTimes[name]
          : snapshotTime;
        window._p5VarUpdateTimes[name] = lastUpdate;
        return { ...v, value: safeVal, type, updatedAt: lastUpdate };
      });
  vscode.postMessage({ type: 'setGlobalVars', variables: list, generatedAt: snapshotTime });
    } catch {}
  }
  // Remove/hide any existing drawer UI if present
  const controls = document.getElementById('p5-var-controls');
  const tab = document.getElementById('p5-var-drawer-tab');
  if (controls) controls.remove();
  if (tab) tab.remove();
  // Do not create or show the drawer anymore
}

// Function to sync drawer inputs with global variable values
function syncDrawerWithGlobals() {
  if (!window._p5GlobalVarTypes) return;
  const controls = document.getElementById('p5-var-controls');
  if (!controls) return;
  Object.keys(window._p5GlobalVarTypes).forEach(name => {
  const type = window._p5GlobalVarTypes[name];
    const input = controls.querySelector('input[data-var="' + name + '"]');
    if (!input) return;
    let globalVal = window[name];
    if (type === 'number') {
      // --- PATCH: match input formatting to initial value ---
      if (input !== document.activeElement) {
        let step = input.step;
        if (step === '1') {
          // Integer: always show floored value
          if (input.value !== String(Math.floor(globalVal))) input.value = Math.floor(globalVal);
        } else if (step && step !== 'any') {
          // Decimal: use precision from step
          let precision = 0;
          if (step.indexOf('.') !== -1) precision = step.split('.')[1].length;
          if (typeof globalVal === 'number' && !isNaN(globalVal)) {
            let valStr = Number(globalVal).toFixed(precision);
            if (input.value !== valStr) input.value = valStr;
          }
        } else {
          // Fallback
          if (input.value !== String(globalVal)) input.value = globalVal;
        }
      }
      // --- END PATCH ---
    } else if (type === 'boolean') {
      if (input.checked !== !!globalVal) input.checked = !!globalVal;
    } else {
      if (input !== document.activeElement) {
        if (input.value !== String(globalVal)) input.value = globalVal;
      }
    }
  });
}
</script>
</body>
</html>`;
}
