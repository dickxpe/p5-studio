import * as path from 'path';
import * as vscode from 'vscode';
import * as recast from 'recast';
import * as osc from 'osc';
import * as fs from 'fs';
import { writeFileSync } from 'fs';

const webviewPanelMap = new Map<string, vscode.WebviewPanel>();
let activeP5Panel: vscode.WebviewPanel | null = null;

const autoReloadListenersMap = new Map<
  string,
  { changeListener?: vscode.Disposable; saveListener?: vscode.Disposable }
>();

const outputChannelMap = new Map<string, vscode.OutputChannel>();
let lastActiveOutputChannel: vscode.OutputChannel | null = null; // <--- NEW

function showAndTrackOutputChannel(ch: vscode.OutputChannel) {
  ch.show(true);
  lastActiveOutputChannel = ch;
}

// Get or create an output channel for a document, used for per-sketch logging and errors
function getOrCreateOutputChannel(docUri: string, fileName: string) {
  let channel = outputChannelMap.get(docUri);
  if (!channel) {
    channel = vscode.window.createOutputChannel('LIVE P5: ' + fileName);
    outputChannelMap.set(docUri, channel);
  }
  lastActiveOutputChannel = channel; // <--- track whenever retrieved
  return channel;
}

// Debounce utility to delay function execution, used to avoid excessive reloads
function debounce<Func extends (...args: any[]) => void>(fn: Func, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<Func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Get current time as HH:MM:SS string for log timestamps
function getTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Read debounce delay from user config
function getDebounceDelay() {
  return vscode.workspace.getConfiguration('liveP5').get<number>('debounceDelay', 500);
}

// Recursively list .js/.ts files in a folder (for script imports)
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
  } catch (e) { }
  return files;
}

// Set of reserved/built-in global names (p5.js, browser, JS built-ins, etc.)
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

// Extract top-level global variables and detect conflicts with reserved names
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
  if (ast.program && Array.isArray(ast.program.body)) {
    for (const node of ast.program.body) {
      if (node.type === 'VariableDeclaration') {
        extractFromDecls(node.declarations);
      }
    }
  }
  return { globals, conflicts };
}

// Extract top-level global variables, excluding reserved names
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
  if (ast.program && Array.isArray(ast.program.body)) {
    for (const node of ast.program.body) {
      if (node.type === 'VariableDeclaration') {
        extractFromDecls(node.declarations);
      }
    }
  }
  return globals.filter(g => !RESERVED_GLOBALS.has(g.name));
}

// List of p5 event handler function names
const P5_EVENT_HANDLERS = [
  "mouseMoved", "mouseDragged", "mousePressed", "mouseReleased", "mouseClicked",
  "doubleClicked", "mouseWheel", "touchStarted", "touchMoved", "touchEnded",
  "keyPressed", "keyReleased", "keyTyped", "deviceMoved", "deviceTurned", "deviceShaken"
];

// Rewrite user code so global variables are attached to window and event handlers are guarded
function rewriteUserCodeWithWindowGlobals(code: string, globals: { name: string }[]): string {
  if (!globals.length) return code;
  const acorn = require('acorn');
  const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
  const globalNames = new Set(globals.map(g => g.name));
  const programBody = ast.program.body;
  const newBody = [];
  let setupFound = false;


  // Insert window.<global> = undefined for all globals at the very top
  for (const g of globals) {
    newBody.push(
      recast.types.builders.expressionStatement(
        recast.types.builders.assignmentExpression(
          '=',
          recast.types.builders.memberExpression(
            recast.types.builders.identifier('window'),
            recast.types.builders.identifier(g.name),
            false
          ),
          recast.types.builders.identifier('undefined')
        )
      )
    );
  }

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

    if (stmt.type === 'VariableDeclaration') {
      // Always convert to var for globals
      if ((stmt.kind === 'let' || stmt.kind === 'const') && stmt.declarations.some(decl => decl.id && decl.id.name && globalNames.has(decl.id.name))) {
        stmt = Object.assign({}, stmt, { kind: 'var' });
      }
      newBody.push(stmt);
      // For each declared global, assign to window
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
      continue;
    }
    newBody.push(stmt);
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
        // Not already window.foo
        !(path.parentPath && path.parentPath.value &&
          path.parentPath.value.type === 'MemberExpression' &&
          path.parentPath.value.property === path.value &&
          path.parentPath.value.object.type === 'Identifier' &&
          path.parentPath.value.object.name === 'window') &&
        // Not a declaration/definition
        !(path.parentPath && path.parentPath.value &&
          ((path.parentPath.value.type === 'VariableDeclarator' && path.parentPath.value.id === path.value) ||
            (path.parentPath.value.type === 'FunctionDeclaration' && path.parentPath.value.id === path.value) ||
            (path.parentPath.value.type === 'FunctionExpression' && path.parentPath.value.id === path.value) ||
            (path.parentPath.value.type === 'ClassDeclaration' && path.parentPath.value.id === path.value))) &&
        // Not this.foo or this.window.foo
        !(path.parentPath && path.parentPath.value &&
          path.parentPath.value.type === 'MemberExpression' &&
          path.parentPath.value.property === path.value &&
          ((path.parentPath.value.object.type === 'ThisExpression') ||
            (path.parentPath.value.object.type === 'MemberExpression' &&
              path.parentPath.value.object.object && path.parentPath.value.object.object.type === 'ThisExpression' &&
              path.parentPath.value.object.property && path.parentPath.value.object.property.name === 'window')))
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
  // const showRecordButton = vscode.workspace
  //   .getConfiguration('liveP5')
  //   .get<boolean>('showRecordButton', true);

  // Only show if config is true AND code contains draw function
  const showRecordButtonConfig = vscode.workspace
    .getConfiguration('liveP5')
    .get<boolean>('showRecordButton', true);
  const hasDrawFunction = /\bfunction\s+draw\s*\(/.test(userCode);
  const showRecordButton = showRecordButtonConfig && hasDrawFunction;

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
  const varControlDebounceDelay = vscode.workspace.getConfiguration('liveP5').get<number>('varControlDebounceDelay', 300);
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
<script>
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
        vscode.postMessage({ type: 'saveCanvasImage', dataUrl });
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
      document.addEventListener('keydown', function esc(ev) { if (ev.key === 'Escape') { removeMenu(); document.removeEventListener('keydown', esc); } });
    }, 0);
  });
})();
</script>
<style>
html,body{margin:0;padding:0;overflow:hidden;width:100%;height:100%;background:transparent;}
canvas.p5Canvas{
  display:block;
  /* --- Add drop shadow below --- */
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.35);
}
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
  height: 22px;
  margin-bottom: 0px;
  padding: 0 2px 0 0;
  line-height: 1.2;
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
// --- Prevent default VSCode context menu except on canvas ---
document.addEventListener('contextmenu', function(e) {
  // Allow context menu only on canvas with class 'p5Canvas'
  if (!(e.target && e.target.classList && e.target.classList.contains('p5Canvas'))) {
    e.preventDefault();
  }
});
</script>
<script>
// --- P5 Capture Toggle Button Logic ---
(function() {
  // Hide record button if setting is false or draw function is missing
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
window._p5VarControlDebounceDelay = ${varControlDebounceDelay};
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
    case 'updateVarDebounceDelay':
      if (typeof data.value === 'number') window._p5VarControlDebounceDelay = data.value;
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
      // --- BEGIN PATCH: set step and rounding based on initial value ---
      if (Number.isInteger(v.value)) {
        input.step = '1';
        input.value = Math.floor(v.value);
        input.addEventListener('blur', () => {
          input.value = String(Math.floor(Number(input.value) || 0));
        });
      } else {
        // Determine decimal precision from initial value
        const match = String(v.value).match(/\.(\d+)?/);
        let precision = match && match[1] ? match[1].length : 2;
        input.step = (precision > 0) ? (1 / Math.pow(10, precision)).toString() : 'any';
        // Always show the value with the same precision as initial value
        input.value = v.value.toFixed(precision);
        input.addEventListener('blur', () => {
          let num = Number(input.value);
          if (!isNaN(num)) input.value = num.toFixed(precision);
        });
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
      const delay = (typeof window._p5VarControlDebounceDelay === 'number')
        ? window._p5VarControlDebounceDelay
        : window._p5DebounceDelay;
      const debouncedUpdate = debounceWebview(() => {
        updateGlobalVarInSketch(v.name, input.value);
        vscode.postMessage({ type: 'updateGlobalVar', name: v.name, value: input.value });
      }, delay);
      input.addEventListener('input', debouncedUpdate);

      // --- PATCH: Lose focus on Enter/Return key ---
      input.addEventListener('keydown', function(ev) {
        if (ev.key === 'Enter' || ev.key === 'Return') {
          ev.preventDefault();
          input.blur();
        }
      });
      // --- END PATCH ---
    }
    label.appendChild(input);
    controls.appendChild(label);
  });
  // Re-attach drawer logic if needed
  controls.querySelector('.drawer-toggle').addEventListener('click', hideDrawer);
  tab.addEventListener('click', showDrawer);

  // Start syncing drawer with global variable values
  if (window._p5DrawerSyncInterval) clearInterval(window._p5DrawerSyncInterval);
  window._p5DrawerSyncInterval = setInterval(syncDrawerWithGlobals, 200);
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

// --- OSC SETUP ---
// Read from config, fallback to defaults if not set
function getOscConfig() {
  const config = vscode.workspace.getConfiguration('liveP5');
  return {
    remoteAddress: config.get<string>('oscRemoteAddress', '127.0.0.1'),
    remotePort: config.get<number>('oscRemotePort', 57120),
    localPort: config.get<number>('oscLocalPort', 57121)
  };
}

let oscPort: osc.UDPPort | null = null;
// Setup OSC UDP port for sending/receiving OSC messages
function setupOscPort() {
  if (oscPort) {
    try { oscPort.close(); } catch { }
    oscPort = null;
  }
  const { remoteAddress, remotePort, localPort } = getOscConfig();
  oscPort = new osc.UDPPort({
    localAddress: "127.0.0.1", // Use 127.0.0.1 for local loopback to ensure self-sending works
    localPort,
    remoteAddress,
    remotePort,
    metadata: true
  });
  oscPort.open();

  oscPort.on("ready", function () {
    // Enable loopback for self-sent messages (for some platforms, not always needed)
    // No-op: osc.js will deliver messages sent to remoteAddress:remotePort if that matches localAddress:localPort
  });

  oscPort.on("message", function (oscMsg: any) {
    if (activeP5Panel) {
      activeP5Panel.webview.postMessage({
        type: "oscReceive",
        address: oscMsg.address,
        args: oscMsg.args
      });
    }
  });
}
setupOscPort();

// ----------------------------
// Activate
// ----------------------------
export function activate(context: vscode.ExtensionContext) {
  // Create output channel and register with context to ensure it appears in Output panel

  // Helper to update context key for p5.js file detection
  function updateP5Context(editor?: vscode.TextEditor) {
    editor = editor || vscode.window.activeTextEditor;
    if (!editor) return vscode.commands.executeCommand('setContext', 'isP5js', false);
    const isJsOrTs = ['javascript', 'typescript'].includes(editor.document.languageId);
    vscode.commands.executeCommand('setContext', 'isP5js', isJsOrTs);
  }

  // Status bar button for P5 Reference
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


  // Helper to update context key for JS/TS file detection and show/hide status bar
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
    if (channel) showAndTrackOutputChannel(channel);

    // --- Move editor to left column if not already there, but never for webview panels ---
    // Only move if the document is a file, is the currently active editor, and NOT already open in the left column
    if (
      editor.viewColumn &&
      editor.viewColumn !== vscode.ViewColumn.One &&
      editor.document.uri.scheme === 'file' &&
      vscode.window.activeTextEditor &&
      vscode.window.activeTextEditor.document.uri.toString() === editor.document.uri.toString()
    ) {
      const alreadyOpenInLeft = vscode.window.visibleTextEditors.some(
        e => e.document.uri.toString() === editor.document.uri.toString() && e.viewColumn === vscode.ViewColumn.One
      );
      if (!alreadyOpenInLeft) {
        vscode.window.showTextDocument(editor.document, vscode.ViewColumn.One, false).then(() => {
          // Close all other editors for this file except the one in the left column
          const closePromises: Thenable<any>[] = [];
          vscode.window.visibleTextEditors.forEach(e => {
            if (
              e.document.uri.toString() === editor.document.uri.toString() &&
              e.viewColumn !== vscode.ViewColumn.One
            ) {
              closePromises.push(
                vscode.window.showTextDocument(e.document, e.viewColumn, false).then(() => {
                  return vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                })
              );
            }
          });
          Promise.all(closePromises).then(() => {
            // After closing, focus the left column editor
            vscode.window.showTextDocument(editor.document, vscode.ViewColumn.One, false);
          });
        });
      }
    }
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
  // Debounce document updates to avoid excessive reloads
  function debounceDocumentUpdate(document: vscode.TextDocument, forceLog = false) {
    const docUri = document.uri.toString();
    if (!debounceMap.has(docUri)) debounceMap.set(docUri, debounce((doc, log) => updateDocumentPanel(doc, log), getDebounceDelay()));
    debounceMap.get(docUri)!(document, forceLog);
  }

  // Flag to ignore logs after a syntax error
  let ignoreLogs = false;

  // Update the webview panel with new code, handle syntax errors, and send global variables
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

  // Track reloadWhileTyping and reloadOnSave settings
  let reloadWhileTyping = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadWhileTyping', true);
  let reloadOnSave = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadOnSave', true);

  // Update reloadWhileTyping/reloadOnSave variables and context key
  async function updateReloadWhileTypingVarsAndContext() {
    reloadWhileTyping = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadWhileTyping', true);
    reloadOnSave = vscode.workspace.getConfiguration('liveP5').get<boolean>('reloadOnSave', true);
    await vscode.commands.executeCommand('setContext', 'liveP5ReloadWhileTypingEnabled', reloadWhileTyping);
  }

  // --- Ensure context key is set on activation ---
  updateReloadWhileTypingVarsAndContext();

  // Set up listeners for reload-on-typing and reload-on-save per document
  function updateAutoReloadListeners(editor: vscode.TextEditor) {
    const docUri = editor.document.uri.toString();
    const existing = autoReloadListenersMap.get(docUri);
    existing?.changeListener?.dispose();
    existing?.saveListener?.dispose();

    let changeListener: vscode.Disposable | undefined;
    let saveListener: vscode.Disposable | undefined;

    if (reloadWhileTyping) {
      changeListener = vscode.workspace.onDidChangeTextDocument(e => {
        if ( e.document.uri.toString() === docUri) debounceDocumentUpdate(e.document, false);
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

      // --- NEW: SingleP5Panel logic ---
      if (isSingleP5PanelEnabled()) {
        // Close all other panels before opening a new one
        for (const [ uri, p] of webviewPanelMap.entries()) {
          if (uri !== docUri) {
            p.dispose();
            // The panel.onDidDispose will remove from map
          }
        }
      }

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
        showAndTrackOutputChannel(outputChannel); // <--- replaced direct show

        webviewPanelMap.set(docUri, panel);
        activeP5Panel = panel;
        vscode.commands.executeCommand('setContext', 'hasP5Webview', true);

        panel.webview.onDidReceiveMessage(async msg => {
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
          // --- OSC SEND HANDLER ---
          else if (msg.type === 'oscSend') {
            try {
              if (!oscPort) setupOscPort();
              oscPort!.send({
                address: msg.address,
                args: (msg.args || []).map((a: any) => {
                  if (typeof a === "number") return { type: "f", value: a };
                  if (typeof a === "string") return { type: "s", value: a };
                  if (typeof a === "boolean") return { type: a ? "T" : "F", value: a };
                  return { type: "s", value: String(a) };
                })
              });
            } catch (e) {
              console.error("OSC send error:", e);
            }
            return;
          }
          // --- SAVE CANVAS IMAGE HANDLER ---
          else if (msg.type === 'saveCanvasImage') {

            try {
              // Prompt user for file path
              const uri = await vscode.window.showSaveDialog({
                filters: { 'PNG Image': ['png'] },
                saveLabel: 'Save Canvas Image'
              });
              if (!uri) return;
              // Decode base64 data URL
              const base64 = msg.dataUrl.replace(/^data:image\/png;base64,/, '');
              const buffer = Buffer.from(base64, 'base64');

              await vscode.workspace.fs.writeFile(uri, buffer);
              // Show clickable filename in info message
              const fileName = uri.fsPath.split(/[\\/]/).pop() || uri.fsPath;
              vscode.window.showInformationMessage(
                `Canvas image saved: ${fileName}`,
                'Open Location'
              ).then(selection => {
                if (selection === 'Open Location') {
                  vscode.env.openExternal(uri);
                }
              });
            } catch (e) {
              vscode.window.showErrorMessage('Failed to save image: ' + e);
            }
          }
          // --- COPY CANVAS IMAGE HANDLER (no-op, handled in webview) ---
          else if (msg.type === 'copyCanvasImage') {
            vscode.window.showWarningMessage('Copy image is only supported in browsers with Clipboard API.');
          }
          // --- SHOW INFO MESSAGE FROM WEBVIEW ---
          else if (msg.type === 'showInfo' && typeof msg.message === 'string') {
            vscode.window.showInformationMessage(msg.message);
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
            if (channel) showAndTrackOutputChannel(channel); // <--- in panel.onDidChangeViewState
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

  // Command to reload the current P5 sketch
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.reload-p5-sketch', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      debounceDocumentUpdate(editor.document, false); // use false to match typing
    })
  );

  // Command to disable reload while typing
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
  // Command to enable reload while typing
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
  // Command to open selected text in the P5 reference
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openSelectedText', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.selection && !editor.selection.isEmpty) {
        const search = encodeURIComponent(editor.document.getText(editor.selection));
        vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/p5/${search}`));
      }
    })
  );

  // Command to create jsconfig.json and setup a new P5 project
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

  // Listen for OSC config changes and re-create port if needed
  vscode.workspace.onDidChangeConfiguration(e => {
    if (
      e.affectsConfiguration('liveP5.oscRemoteAddress') ||
      e.affectsConfiguration('liveP5.oscRemotePort') ||
      e.affectsConfiguration('liveP5.oscLocalPort')
    ) {
      setupOscPort();
    }
  });

  // Listen for debounceDelay config changes and update debounce logic
  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('liveP5.debounceDelay')) {
      debounceMap.clear();
    }
    if (e.affectsConfiguration('liveP5.varControlDebounceDelay')) {
      const newDelay = vscode.workspace.getConfiguration('liveP5').get<number>('varControlDebounceDelay', 300);
      for (const [, panel] of webviewPanelMap.entries()) {
        panel.webview.postMessage({ type: 'updateVarDebounceDelay', value: newDelay });
      }
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
        // Only show if config is true AND the code has a draw function
        const showRecordConfig = vscode.workspace.getConfiguration('liveP5').get<boolean>('showRecordButton', true);
        let code = '';
        const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === docUri);
        if (editor) code = editor.document.getText();
        const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
        const showRecord = showRecordConfig && hasDraw;
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

  // --- NEW: Scroll LIVE P5 output to end command ---
  context.subscriptions.push(
    vscode.commands.registerCommand('liveP5.scrollOutputToEnd', async () => {
      if (!lastActiveOutputChannel) {
        vscode.window.showInformationMessage('No LIVE P5 output channel active.');
        return;
      }
      showAndTrackOutputChannel(lastActiveOutputChannel);
      setTimeout(() => vscode.commands.executeCommand('cursorBottom'), 30);
    })
  );
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

// Helper to check SingleP5Panel setting
function isSingleP5PanelEnabled() {
  return vscode.workspace.getConfiguration('liveP5').get<boolean>('SingleP5Panel', false);
}

