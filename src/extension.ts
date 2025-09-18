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

// Returns the output channel for a document, creating it if needed
// Used for logging and error output per sketch
function getOrCreateOutputChannel(docUri: string, fileName: string) {
  let channel = outputChannelMap.get(docUri);
  if (!channel) {
    channel = vscode.window.createOutputChannel('LIVE P5: ' + fileName);
    outputChannelMap.set(docUri, channel);
  }
  return channel;
}

// Debounce utility: delays function execution by a given delay
// Used to avoid excessive reloads while typing
function debounce<Func extends (...args: any[]) => void>(fn: Func, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Returns current time as HH:MM:SS string for log timestamps
function getTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Reads debounce delay from user config
function getDebounceDelay() {
  return vscode.workspace.getConfiguration('liveP5').get<number>('debounceDelay', 500);
}

// Recursively lists .js/.ts files in a folder (for common/import scripts)
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

// Expanded list of reserved/built-in global names (p5.js, browser, etc.)
const RESERVED_GLOBALS = new Set([
  // p5.js color functions and color mode
  "hue", "saturation", "brightness", "red", "green", "blue", "alpha", "lightness", "colorMode", "color",
  // p5.js core properties
  "width", "height", "frameCount", "frameRate", "deltaTime", "mouseX", "mouseY", "pmouseX", "pmouseY",
  "winMouseX", "winMouseY", "pwinMouseX", "pwinMouseY", "mouseButton", "mouseIsPressed", "key", "keyCode",
  "keyIsPressed", "keyIsDown", "touches", "deviceOrientation", "accelerationX", "accelerationY", "accelerationZ",
  "pAccelerationX", "pAccelerationY", "pAccelerationZ", "rotationX", "rotationY", "rotationZ", "pRotationX",
  "pRotationY", "pRotationZ", "turnAxis", "movedX", "movedY", "movedZ", "winMouseX", "winMouseY", "pwinMouseX", "pwinMouseY",
  // p5.js structure
  "setup", "draw", "preload", "remove", "mouseMoved", "mouseDragged", "mousePressed", "mouseReleased", "mouseClicked",
  "doubleClicked", "mouseWheel", "touchStarted", "touchMoved", "touchEnded", "keyPressed", "keyReleased", "keyTyped",
  // p5.js rendering
  "createCanvas", "resizeCanvas", "noCanvas", "createGraphics", "createCapture", "createVideo", "createAudio", "loadImage",
  "image", "imageMode", "blend", "copy", "filter", "get", "loadPixels", "set", "updatePixels", "noLoop", "loop", "redraw",
  "clear", "background", "color", "fill", "noFill", "stroke", "noStroke", "strokeWeight", "strokeCap", "strokeJoin",
  "erase", "noErase", "blendMode", "drawingContext", "push", "pop", "resetMatrix", "applyMatrix", "translate", "rotate",
  "rotateX", "rotateY", "rotateZ", "scale", "shearX", "shearY", "createShader", "shader", "resetShader",
  // p5.js shapes
  "rect", "square", "ellipse", "circle", "arc", "triangle", "quad", "line", "point", "beginShape", "endShape", "vertex",
  "bezierVertex", "curveVertex", "bezier", "curve", "curveTightness", "curveDetail",
  // p5.js typography
  "text", "textFont", "textSize", "textAlign", "textStyle", "textLeading", "textWidth", "textAscent", "textDescent",
  // p5.js attributes
  "ellipseMode", "rectMode", "angleMode", "noSmooth", "smooth", "strokeCap", "strokeJoin",
  // p5.js math
  "abs", "ceil", "constrain", "dist", "exp", "floor", "lerp", "log", "mag", "map", "max", "min", "norm", "pow", "round",
  "sq", "sqrt", "createVector", "noise", "noiseDetail", "noiseSeed", "randomSeed", "random", "randomGaussian",
  // p5.js trigonometry
  "degrees", "radians", "sin", "cos", "tan", "asin", "acos", "atan", "atan2",
  // p5.js time & date
  "day", "hour", "minute", "millis", "month", "second", "year",
  // p5.js events
  "deviceMoved", "deviceTurned", "deviceShaken",
  // p5.js input
  "createInput", "createButton", "createCheckbox", "createSelect", "createSlider", "createRadio", "createColorPicker",
  // p5.js output
  "print", "println", "save", "saveCanvas", "saveFrames", "saveJSON", "saveStrings", "saveTable", "saveXML",
  // p5.js files
  "loadJSON", "loadStrings", "loadTable", "loadXML", "loadBytes", "loadFont", "loadShader", "loadImage", "loadSound",
  // p5.js sound (if p5.sound is loaded)
  "loadSound", "createAudio", "createOscillator", "createGain", "createConvolver", "createDelay", "createCompressor",
  "createPanner", "createStereoPanner", "createAnalyser", "createEnvelope", "createFFT", "createFilter", "createBiquadFilter",
  "createLowPass", "createHighPass", "createBandPass", "createPeaking", "createNotch", "createAllPass", "createLowshelf",
  "createHighshelf", "createDistortion", "createWaveShaper", "createMediaElementSource", "createMediaStreamSource",
  // p5.js dom
  "createDiv", "createSpan", "createP", "createImg", "createA", "createElement", "select", "selectAll", "removeElements",
  // p5.js misc
  "frameRate", "pixelDensity", "displayWidth", "displayHeight", "windowWidth", "windowHeight", "windowResized",
  // browser globals (partial, common)
  "window", "document", "navigator", "location", "console", "setTimeout", "setInterval", "clearTimeout", "clearInterval",
  "alert", "prompt", "confirm", "requestAnimationFrame", "cancelAnimationFrame", "localStorage", "sessionStorage",
  "fetch", "XMLHttpRequest", "Event", "addEventListener", "removeEventListener", "dispatchEvent",
  // JS built-ins
  "Array", "Object", "Function", "String", "Number", "Boolean", "Symbol", "Date", "Math", "RegExp", "Error", "EvalError",
  "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "JSON", "parseInt", "parseFloat", "isNaN",
  "isFinite", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape", "Infinity",
  "NaN", "undefined", "null", "Map", "Set", "WeakMap", "WeakSet", "Promise", "Reflect", "Proxy", "Intl", "DataView",
  "ArrayBuffer", "SharedArrayBuffer", "Atomics", "BigInt", "BigInt64Array", "BigUint64Array", "Float32Array",
  "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array",
  // VS Code injected
  "acquireVsCodeApi"
]);

// Extracts top-level global variables from user code (number, string, boolean)
// Now also returns a list of ignored/conflicting names
function extractGlobalVariablesWithConflicts(code: string): { globals: { name: string, value: any }[], conflicts: string[] } {
  const acorn = require('acorn');
  const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
  const globals: { name: string, value: any }[] = [];
  const conflicts: string[] = [];
  function extractFromDecls(decls: any[]) {
    for (const decl of decls) {
      if (decl.id && decl.id.name) {
        let value = undefined;
        if (decl.init && decl.init.type === 'Literal') {
          value = decl.init.value;
        } else if (decl.init && decl.init.type === 'UnaryExpression' && decl.init.argument.type === 'Literal') {
          value = decl.init.operator === '-' ? -decl.init.argument.value : decl.init.argument.value;
        }
        if (RESERVED_GLOBALS.has(decl.id.name)) {
          conflicts.push(decl.id.name);
        } else {
          globals.push({ name: decl.id.name, value });
        }
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
  return { globals, conflicts };
}

// Extracts top-level global variables from user code (number, string, boolean)
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
  // At the end, filter out reserved/built-in globals
  return globals.filter(g => !RESERVED_GLOBALS.has(g.name));
}

// List of p5 event handler function names
const P5_EVENT_HANDLERS = [
  "mouseMoved", "mouseDragged", "mousePressed", "mouseReleased", "mouseClicked",
  "doubleClicked", "mouseWheel", "touchStarted", "touchMoved", "touchEnded",
  "keyPressed", "keyReleased", "keyTyped", "deviceMoved", "deviceTurned", "deviceShaken"
];

// Rewrites user code so global variables are attached to window (for live editing)
// Also wraps event handlers to only run after setup has completed
function rewriteUserCodeWithWindowGlobals(code: string, globals: { name: string }[]): string {
  if (!globals.length) return code;
  const acorn = require('acorn');
  const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
  const globalNames = new Set(globals.map(g => g.name));
  const programBody = ast.program.body;
  const newBody = [];
  let setupFound = false;

  for (let i = 0; i < programBody.length; i++) {
    let stmt = programBody[i];
    // Detect setup function with createCanvas(windowWidth,windowHeight)
    if (
      stmt.type === 'FunctionDeclaration' &&
      stmt.id && stmt.id.name === 'setup' &&
      stmt.body && stmt.body.body
    ) {
      setupFound = true;
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
      // At the end of setup, set window._p5SetupDone = true;
      newSetupBody.push(
        recast.types.builders.expressionStatement(
          recast.types.builders.assignmentExpression(
            '=',
            recast.types.builders.memberExpression(
              recast.types.builders.identifier('window'),
              recast.types.builders.identifier('_p5SetupDone'),
              false
            ),
            recast.types.builders.literal(true)
          )
        )
      );
      stmt = recast.types.builders.functionDeclaration(
        stmt.id,
        stmt.params,
        recast.types.builders.blockStatement(newSetupBody)
      );
    }

    // Wrap event handler functions to guard with window._p5SetupDone
    if (
      stmt.type === 'FunctionDeclaration' &&
      stmt.id && P5_EVENT_HANDLERS.includes(stmt.id.name)
    ) {
      const origBody = stmt.body.body;
      const guardedBody = [
        recast.types.builders.ifStatement(
          recast.types.builders.unaryExpression('!',
            recast.types.builders.memberExpression(
              recast.types.builders.identifier('window'),
              recast.types.builders.identifier('_p5SetupDone'),
              false
            )
          ),
          recast.types.builders.blockStatement([
            recast.types.builders.returnStatement(null) // <-- fix: pass null as argument
          ])
        ),
        ...origBody
      ];
      stmt = recast.types.builders.functionDeclaration(
        stmt.id,
        stmt.params,
        recast.types.builders.blockStatement(guardedBody)
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

  // If no setup function, still ensure window._p5SetupDone is set to true after sketch runs
  if (!setupFound) {
    newBody.push(
      recast.types.builders.expressionStatement(
        recast.types.builders.assignmentExpression(
          '=',
          recast.types.builders.memberExpression(
            recast.types.builders.identifier('window'),
            recast.types.builders.identifier('_p5SetupDone'),
            false
          ),
          recast.types.builders.literal(true)
        )
      )
    );
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

  // Add p5.sound.min.js
  const p5SoundPath = vscode.Uri.file(path.join(extensionPath, 'assets', 'p5.sound.min.js'));
  const p5SoundUri = panel.webview.asWebviewUri(p5SoundPath);

  const p5CapturePath = vscode.Uri.file(path.join(extensionPath, 'assets', 'p5.capture.umd.min.js'));
  const p5CaptureUri = panel.webview.asWebviewUri(p5CapturePath);

  const reloadIconPath = vscode.Uri.file(path.join(extensionPath, 'images', 'reload.svg'));
  const reloadIconUri = panel.webview.asWebviewUri(reloadIconPath);

  const showReloadButton = vscode.workspace
    .getConfiguration('liveP5')
    .get<boolean>('showReloadButton', true);

  // Add: showRecordButton setting
  const showRecordButton = vscode.workspace
    .getConfiguration('liveP5')
    .get<boolean>('showRecordButton', true);

  function escapeBackticks(str: string) {
    return str.replace(/`/g, '\`');
  }

  // Detect globals and rewrite code
  const { globals, conflicts } = extractGlobalVariablesWithConflicts(userCode);
  const rewrittenCode = rewriteUserCodeWithWindowGlobals(userCode, globals);
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
      `<script src='${p5CaptureUriWithCacheBust}'></script>`;
    }
  } catch (e) { /* ignore */ }

  // In createHtml, get debounceDelay from config and pass to webview
  const debounceDelay = vscode.workspace.getConfiguration('liveP5').get<number>('debounceDelay', 500);
  // Get varDrawerDefaultState from config
  const varDrawerDefaultState = vscode.workspace.getConfiguration('liveP5').get<string>('varDrawerDefaultState', 'open');

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

  // Add record icons (inline SVGs)
  const recordRedSvg = `<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#ff3333" stroke="#b00" stroke-width="2"/></svg>`;
  const recordGraySvg = `<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#bbb" stroke="#888" stroke-width="2"/></svg>`;

  return `<!DOCTYPE html>
<!-- cache-bust: ${uniqueId} -->
<html>
<head>
${scriptTags}
<script data-user-code="true">
${escapedCode}
</script>
<style>
html,body{margin:0;padding:0;overflow:hidden;width:100%;height:100%;background:transparent;}
canvas.p5Canvas{display:block;}
#error-overlay{
  position:fixed; top:0; left:0; right:0; bottom:0;
  background:rgba(255,0,0,0.95); color:#fff; font-family:monospace; padding:10px;
  display:none; z-index: 9999; white-space:pre-wrap; overflow:auto;
}
#p5-toolbar {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  z-index: 9999;
}
#reload-button {
  width: 16px; height: 16px;
  background: white; border-radius: 4px; display: flex;
  align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
#reload-button img { width: 12px; height: 12px; }
#reload-button[style*="display: none"] { display: none !important; }
#capture-toggle-button {
  width: 16px; height: 16px;
  background: white; border-radius: 4px; display: flex;
  align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  /* Add display:none if hidden by setting */
  ${showRecordButton ? '' : 'display:none !important;'}
}
#capture-toggle-button svg { width: 12px; height: 12px; display: block; }
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
  padding: 2px 4px 2px 4px;
  font-family: monospace;
  font-size: 20px;
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
<div id="p5-toolbar">
  <div id="reload-button" style="display:${showReloadButton ? 'flex' : 'none'}"><img src="${reloadIconUri}" title="Reload P5 Sketch"></div>
  <div id="capture-toggle-button" title="Toggle P5 Capture Panel"></div>
</div>
<script>
// --- P5 Capture Toggle Button Logic ---
(function() {
  // Hide record button if setting is false
  if (!${showRecordButton}) {
    const captureBtn = document.getElementById('capture-toggle-button');
    if (captureBtn) captureBtn.style.display = "none";
    // Remove all .p5c-container divs if present, and prevent future ones from being added
    document.querySelectorAll('.p5c-container').forEach(div => div.remove());
    // Observe DOM and remove any .p5c-container that gets added later
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.p5c-container').forEach(div => div.remove());
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return;
  }
  const captureBtn = document.getElementById('capture-toggle-button');
  const reloadBtn = document.getElementById('reload-button');
  let enabled = false;
  function setIcon() {
    // REVERSED: gray when enabled (visible), red when disabled (hidden)
    captureBtn.innerHTML = enabled
      ? \`${recordGraySvg}\`
      : \`${recordRedSvg}\`;
  }
  function setCaptureVisibility() {
    // Only affect the first .p5c-container and never create or remove any divs
    const captureDiv = document.querySelector('.p5c-container');
    if (captureDiv) {
      captureDiv.style.display = enabled ? '' : 'none';
    }
  }
  // Remove all but the first .p5c-container if multiple exist (cleanup on reload)
  function removeDuplicateCaptureDivs() {
    const divs = document.querySelectorAll('.p5c-container');
    if (divs.length > 1) {
      for (let i = 1; i < divs.length; ++i) {
        divs[i].remove();
      }
    }
  }
  captureBtn.addEventListener('click', () => {
    enabled = !enabled;
    setIcon();
    setCaptureVisibility();
  });
  // Initialize as disabled (hidden)
  enabled = false;
  setIcon();
  setCaptureVisibility();
  removeDuplicateCaptureDivs();
  // If the capture div is dynamically added, observe DOM changes
  const observer = new MutationObserver(() => {
    removeDuplicateCaptureDivs();
    setCaptureVisibility();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Observe reload button visibility to update layout
  const reloadObserver = new MutationObserver(() => {
    // If reload is hidden, move capture to the right (toolbar stays at right:10px)
    if (reloadBtn && reloadBtn.style.display === "none") {
      // Only capture button is visible, so no margin needed
      captureBtn.style.marginLeft = "0px";
    } else {
      // Both visible, keep default gap
      captureBtn.style.marginLeft = "0px";
    }
  });
  if (reloadBtn) {
    reloadObserver.observe(reloadBtn, { attributes: true, attributeFilter: ['style'] });
  }
  window.addEventListener('resize', () => {
    // If reload button is visible, no margin; if not, margin-left: 0
    const reloadVisible = reloadBtn && reloadBtn.style.display !== "none";
    captureBtn.style.marginLeft = reloadVisible ? "0px" : "0px";
  });
})();
</script>
<script>
// --- Provide MEDIA_FOLDER global for user sketches ---
const MEDIA_FOLDER = ${JSON.stringify(mediaWebviewUriPrefix)};

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

// --- Add this handler for unhandled promise rejections ---
window.onunhandledrejection = function(event) {
  let msg = '';
  if (event && event.reason) {
    if (typeof event.reason === 'string') {
      msg = event.reason;
    } else if (event.reason && event.reason.message) {
      msg = event.reason.message;
    } else {
      msg = JSON.stringify(event.reason);
    }
  } else {
    msg = 'Unhandled promise rejection';
  }
  if (!msg.startsWith('[RUNTIME ERROR]')) {
    msg = '[RUNTIME ERROR] ' + msg;
  }
  showError(msg);
  vscode.postMessage({ type: 'showError', message: msg });
  // Prevent default logging to console (optional)
  // event.preventDefault();
};

function runUserSketch(code){
  clearError();
  window._p5ErrorLogged = false;
  // --- Reset setup done flag before running user code ---
  window._p5SetupDone = false;
  if(window._p5Instance){window._p5Instance.remove();window._p5Instance=null;}
  document.querySelectorAll("canvas").forEach(c=>c.remove());

  // Remove ALL previous <script> tags with data-user-code="true"
  // (No longer needed, user code is inline in HTML)
  // const scripts = Array.from(document.querySelectorAll('script[data-user-code="true"]'));
  // scripts.forEach(s => s.parentNode && s.parentNode.removeChild(s));

  // User code is already loaded as a <script> tag in HTML, so just instantiate p5
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
            codeNoGlobals = codeNoGlobals.replace(new RegExp('^\\s*window\\.'+name+'\\s*=\\s*' + name + ';?\\s*$', 'gm'), '');
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
    case "toggleRecordButton":
      {
        const captureBtn = document.getElementById('capture-toggle-button');
        // Remove any previous observer to avoid duplicates
        if (window._p5cContainerObserver) {
          window._p5cContainerObserver.disconnect();
          window._p5cContainerObserver = null;
        }
        if (captureBtn) {
          if (data.show) {
            // Always show the button and remove any .p5c-container observer
            captureBtn.style.display = "";
            // Remove all .p5c-container divs and stop removing future ones
            // (Let the normal capture logic handle visibility)
            // --- Reload the sketch to re-inject the p5c-container ---
            if (window._p5UserCode) {
              setTimeout(() => {
                vscode.postMessage({type:"reload-button-clicked", preserveGlobals: true});
              }, 0);
            }
          } else {
            captureBtn.style.display = "none";
            // Remove all .p5c-container divs and prevent future ones from being added
            document.querySelectorAll('.p5c-container').forEach(div => div.remove());
            // Set up a MutationObserver to remove future .p5c-container divs
            window._p5cContainerObserver = new MutationObserver(() => {
              document.querySelectorAll('.p5c-container').forEach(div => div.remove());
            });
            window._p5cContainerObserver.observe(document.body, { childList: true, subtree: true });
          }
        }
      }
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

// Hides the variable drawer UI in the webview
function hideDrawer() {
  const controls = document.getElementById('p5-var-controls');
  const tab = document.getElementById('p5-var-drawer-tab');
  if (!controls || !tab) return;
  if (controls) controls.classList.add('drawer-hidden');
  setTimeout(() => {
    if (controls) controls.style.display = 'none';
    if (tab) {
      tab.style.display = 'flex';
      tab.classList.add('tab-visible');
    }
  }, 200);
}

// Shows the variable drawer UI in the webview
function showDrawer() {
  const controls = document.getElementById('p5-var-controls');
  const tab = document.getElementById('p5-var-drawer-tab');
  if (!controls || !tab) return;
  if (controls) controls.style.display = 'flex';
  setTimeout(() => {
    if (controls) controls.classList.remove('drawer-hidden');
    if (tab) tab.classList.remove('tab-visible');
    setTimeout(() => { if (tab) tab.style.display = 'none'; }, 200);
  }, 10);
}

// Dynamically creates/removes the variable drawer and tab, and sets up event listeners for variable changes
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
<!-- ...rest of HTML... -->
`;
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

  // Updates the webview panel with new code, handles syntax errors, and sends global variables
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
      // --- Check for reserved global conflicts before syntax check ---
      const { globals, conflicts } = extractGlobalVariablesWithConflicts(code);
      if (conflicts.length > 0) {
        syntaxErrorMsg = `${getTime()} [SYNTAX ERROR in ${fileName}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
        // Format error message
        syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
        panel.webview.html = await createHtml('', panel, context.extensionPath);
        hadSyntaxError = true;
        throw new Error(syntaxErrorMsg);
      }

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
      const { globals: filteredGlobals } = extractGlobalVariablesWithConflicts(code);
      const filtered = filteredGlobals.filter(g => ['number', 'string', 'boolean'].includes(typeof g.value));
      setTimeout(() => {
        panel.webview.postMessage({ type: 'setGlobalVars', variables: filtered });
      }, 200);
    } catch (err: any) {
      if (!syntaxErrorMsg) {
        syntaxErrorMsg = `${getTime()} [SYNTAX ERROR in ${path.basename(document.fileName)}] ${err.message}`;
        syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
      }
      panel.webview.html = await createHtml('', panel, context.extensionPath);
      hadSyntaxError = true;
    }

    // Always show syntax errors in overlay
    if (syntaxErrorMsg) {
      ignoreLogs = true;
      // Fix [object Arguments] for overlay as well
      const overlayMsg = syntaxErrorMsg.replace(/\[object Arguments\]/gi, "no argument(s) ");
      setTimeout(() => {
        panel.webview.postMessage({ type: 'syntaxError', message: overlayMsg });
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

  // --- Ensure context key is set on activation ---
  updateReloadWhileTypingVarsAndContext();

  // Sets up listeners for reload-on-typing and reload-on-save per document
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
          // --- Check for reserved global conflicts before syntax check ---
          const { globals, conflicts } = extractGlobalVariablesWithConflicts(codeToInject);
          if (conflicts.length > 0) {
            syntaxErrorMsg = `${getTime()} [SYNTAX ERROR in ${path.basename(editor.document.fileName)}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
            syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
            codeToInject = '';
            throw new Error(syntaxErrorMsg);
          }
          new Function(code);
          codeToInject = wrapInSetupIfNeeded(code);
        } catch (err: any) {
          if (!syntaxErrorMsg) {
            syntaxErrorMsg = `${getTime()} [SYNTAX ERROR in ${path.basename(editor.document.fileName)}] ${err.message}`;
            syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
          }
          codeToInject = '';
        }
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder)
          return;
        // --- Determine include folder for this sketch ---
        const sketchFilePath = editor.document.fileName;
        const sketchDir = path.dirname(sketchFilePath);
        const includeDir = path.join(sketchDir, 'include');
        let localResourceRoots = [
          vscode.Uri.file(path.join(context.extensionPath, 'assets')),
          vscode.Uri.file(path.join(context.extensionPath, 'images')),
          vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'common')),
          vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'import')),
          vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'media')),
        ];
        // Only add includeDir if it exists
        if (fs.existsSync(includeDir) && fs.statSync(includeDir).isDirectory()) {
          localResourceRoots.push(vscode.Uri.file(includeDir));
        }
        panel = vscode.window.createWebviewPanel(
          'extension.live-p5',
          'LIVE: ' + path.basename(editor.document.fileName),
          vscode.ViewColumn.Two,
          {
            enableScripts: true,
            localResourceRoots,
            retainContextWhenHidden: true
          }
        );

        // --- Pass the sketch file path to the panel for include folder lookup ---
        (panel as any)._sketchFilePath = editor.document.fileName;

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
              // Format syntax error messages if present
              if (message.includes("[SYNTAX ERROR")) {
                message = formatSyntaxErrorMsg(message);
              }
              // Replace [object Arguments] with no argument(s)
              message = message.replace(/\[object Arguments\]/gi, "no argument(s) ");
            }
            outputChannel.appendLine(message);
            // Also fix overlay message
            const overlayMsg = typeof msg.message === "string"
              ? msg.message.replace(/\[object Arguments\]/gi, "no argument(s) ")
              : msg.message;
            const docUri = editor.document.uri.toString();
            const panel = webviewPanelMap.get(docUri);
            if (panel) (panel as any)._lastRuntimeError = message;
            // Forward improved message to overlay if needed
            if (panel) {
              panel.webview.postMessage({ type: 'showError', message: overlayMsg });
            }
          } else if (msg.type === 'reload-button-clicked') {
            // Forward preserveGlobals flag to webview, but send rewritten code
            let code = editor.document.getText();
            code = wrapInSetupIfNeeded(code);
            const globals = extractGlobalVariables(code);
            let rewrittenCode = rewriteUserCodeWithWindowGlobals(code, globals);
            if (msg.preserveGlobals && globals.length > 0) {
              // Remove global var declarations and window assignments
              globals.forEach(g => {
                rewrittenCode = rewrittenCode.replace(new RegExp('^\\s*var\\s+' + g.name + '(\\s*=.*)?;?\\s*$', 'gm'), '');
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
        const { globals } = extractGlobalVariablesWithConflicts(codeToInject);
        const filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(typeof g.value));
        setTimeout(() => {
          panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals });
        }, 200);
        if (syntaxErrorMsg) {
          setTimeout(() => {
            panel.webview.postMessage({ type: 'syntaxError', message: syntaxErrorMsg });
          }, 150);
          const outputChannel = getOrCreateOutputChannel(docUri, path.basename(editor.document.fileName));
          outputChannel.appendLine(syntaxErrorMsg);
        }
      } else {
        panel.reveal(panel.viewColumn, true);
        setTimeout(() => {
          let codeToSend = wrapInSetupIfNeeded(code);
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
        let workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        let selectedFolderUri: vscode.Uri | undefined;
        if (!workspaceFolder) {
          // Prompt user to select a folder if none is open
          const folderUris = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            openLabel: 'Select folder for new P5 project'
          });
          if (!folderUris || folderUris.length === 0) return;
          selectedFolderUri = folderUris[0];
          workspaceFolder = { uri: selectedFolderUri, name: '', index: 0 };
        }
        vscode.window.showInformationMessage('Setting up new P5 project...');
        // creates a jsconfig that tells vscode where to find the types file
        const jsconfig = {
          include: [
            "*.js",
            "**/*.js",
            "*.ts",
            "**/.ts",
            "common/*.js",
            "import/*.js",
            path.join(context.extensionPath, "p5types", "global.d.ts"),
            path.join(context.extensionPath, "p5types", "p5helper.d.ts"),
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

        // Create sketch1.js only if it doesn't exist and remember whether we created it
        const sketch1Path = path.join(workspaceFolder.uri.fsPath + "/sketches", "sketch1.js");
        const sketch1Existed = fs.existsSync(sketch1Path);

        const sketchString = `//Start coding with P5 here!
//Have a look at the P5 Reference: https://p5js.org/reference/ 
//Click the P5 button at the top to run your sketch! ⤴

noStroke();
fill("red");
circle(50, 50, 80);
fill("white");
textFont("Arial", 36);
textAlign(CENTER, CENTER);
text("P5", 50, 52);`;
        if (!sketch1Existed) {
          fs.writeFileSync(sketch1Path, sketchString);
        }

        const jsconfigPath = path.join(workspaceFolder.uri.fsPath, "jsconfig.json");
        writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
        vscode.window.showInformationMessage('P5 project setup complete!');

        // If a folder was selected via dialog, open it as the workspace
        if (selectedFolderUri) {
          await vscode.commands.executeCommand('vscode.openFolder', selectedFolderUri, false);
        } else {
          // Open sketch1.js only if it was created just now and we remain in the same workspace
          if (!sketch1Existed) {
            const doc = await vscode.workspace.openTextDocument(sketch1Path);
            await vscode.window.showTextDocument(doc, { preview: false });
          }
        }
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
    // --- Sync reloadWhileTyping context key and button icon if setting changed via settings UI ---
    if (e.affectsConfiguration('liveP5.reloadWhileTyping')) {
      updateReloadWhileTypingVarsAndContext();
      const editor = vscode.window.activeTextEditor;
      if (editor) updateAutoReloadListeners(editor);
    }
    // --- Immediately apply showReloadButton/showRecordButton changes in all open panels ---
    if (
      e.affectsConfiguration('liveP5.showReloadButton') ||
      e.affectsConfiguration('liveP5.showRecordButton')
    ) {
      for (const [docUri, panel] of webviewPanelMap.entries()) {
        // Update reload button
        const showReload = vscode.workspace.getConfiguration('liveP5').get<boolean>('showReloadButton', true);
        panel.webview.postMessage({ type: 'toggleReloadButton', show: showReload });
        // Update record button (show/hide and remove capture panel if needed)
        const showRecord = vscode.workspace.getConfiguration('liveP5').get<boolean>('showRecordButton', true);
        panel.webview.postMessage({ type: 'toggleRecordButton', show: showRecord });
      }
    }
  });

  vscode.workspace.onDidCloseTextDocument(doc => {
    const docUri = doc.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (panel) {
      panel.dispose();
    }
  });

  // --- Show notification to setup P5 project if not already set up ---
  (async function showSetupNotificationIfNeeded() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    // NEW: read setting to allow disabling the notification
    const config = vscode.workspace.getConfiguration('liveP5');
    const showSetupNotification = config.get<boolean>('showSetupNotification', true);
    if (!showSetupNotification) return;

    const jsconfigPath = path.join(workspaceFolder.uri.fsPath, "jsconfig.json");
    if (!fs.existsSync(jsconfigPath)) {
      const action = await vscode.window.showInformationMessage(
        "This project isn't configured for P5 yet. Would you like to set it up now?",
        "Setup P5 Project",
        "Don't show again"
      );
      if (action === "Setup P5 Project") {
        vscode.commands.executeCommand('extension.create-jsconfig');
      } else if (action === "Don't show again") {
        await config.update('showSetupNotification', false, vscode.ConfigurationTarget.Global);
      }
    }
  })();
}

// Helper: Wrap code in setup() if no setup/draw present
function wrapInSetupIfNeeded(code: string): string {
  const hasSetup = /\bfunction\s+setup\s*\(/.test(code);
  const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
  if (!hasSetup && !hasDraw) {
    return `function setup() {\n${code}\n}`;
  }
  return code;
}

// Helper: Format syntax error message to include "on line N" and remove (N:M)
function formatSyntaxErrorMsg(msg: string): string {
  // Match: [SYNTAX ERROR in filename] ... (N:M)
  // or: [SYNTAX ERROR in filename] ... (N)
  // or: [SYNTAX ERROR in filename] ... (N:M)
  // We want: [SYNTAX ERROR in filename on line N] ...
  const regex = /(\[SYNTAX ERROR in [^\]\s]+)\]([^\n]*?)\s*\((\d+)(?::\d+)?\)\s*$/;
  const match = msg.match(regex);
  if (match) {
    const before = match[1]; // [SYNTAX ERROR in filename
    const rest = match[2] || '';
    const line = match[3];
    // Insert on line N before the closing ]
    return msg.replace(regex, `${before} on line ${line}]${rest}`);
  }
  return msg;
}

