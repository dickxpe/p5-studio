import * as path from 'path';
import * as vscode from 'vscode';
import * as recast from 'recast';
import * as osc from 'osc';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { exec } from 'child_process';
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

// Add a set of known p5 numeric properties
const P5_NUMERIC_IDENTIFIERS = new Set([
  "width", "height", "frameCount", "frameRate", "deltaTime", "mouseX", "mouseY", "pmouseX", "pmouseY",
  "winMouseX", "winMouseY", "pwinMouseX", "pwinMouseY", "accelerationX", "accelerationY", "accelerationZ",
  "pAccelerationX", "pAccelerationY", "pAccelerationZ", "rotationX", "rotationY", "rotationZ", "pRotationX",
  "pRotationY", "pRotationZ", "movedX", "movedY", "movedZ", "displayWidth", "displayHeight", "windowWidth",
  "windowHeight"
]);

// Extract top-level global variables and detect conflicts with reserved names
function extractGlobalVariablesWithConflicts(code: string): { globals: { name: string, value: any, type: string }[], conflicts: string[] } {
  const acorn = require('acorn');
  const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
    const globals: { name: string, value: any, type: string }[] = []; 
  const conflicts: string[] = [];
  function extractFromDecls(decls: any[]) {
    for (const decl of decls) {
      if (decl.id && decl.id.name) {
  let value = undefined;
  let type = 'other';
        if (decl.init && decl.init.type === 'Literal') {
          value = decl.init.value;
          type = typeof value;
        } else if (decl.init && decl.init.type === 'UnaryExpression' && decl.init.argument.type === 'Literal') {
          value = decl.init.operator === '-' ? -decl.init.argument.value : decl.init.argument.value;
          type = typeof value;
        }
        // If initializer is an Identifier, use its name as value
        else if (decl.init && decl.init.type === 'Identifier') {
          value = decl.init.name;
          // If identifier is a known p5 numeric property, treat as number; otherwise mark as other
          type = P5_NUMERIC_IDENTIFIERS.has(decl.init.name) ? 'number' : 'other';
        }
        // If initializer is a CallExpression (e.g., random()), treat as number
        else if (decl.init && decl.init.type === 'CallExpression') {
          value = 0;
          type = 'number';
        }
        // Try to evaluate other initializers
        else if (decl.init) {
          try {
            const safeGlobals = { Math, Number, String, Boolean, Array, Object };
            value = Function(...Object.keys(safeGlobals), `return (${recast.print(decl.init).code});`)
              (...Object.values(safeGlobals));
            type = typeof value;
            // Only expose number/string/boolean; everything else is 'other'
            if (!['number', 'string', 'boolean'].includes(type)) {
              value = undefined;
              type = 'other';
            }
          } catch {
            value = undefined;
            type = 'other';
          }
        }
        if (RESERVED_GLOBALS.has(decl.id.name)) {
          conflicts.push(decl.id.name);
        } else {
          globals.push({ name: decl.id.name, value, type });
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
function extractGlobalVariables(code: string): { name: string, value: any, type: string }[] {
  const acorn = require('acorn');
  const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
  const globals: { name: string, value: any, type: string }[] = [];
  function extractFromDecls(decls: any[]) {
    for (const decl of decls) {
      if (decl.id && decl.id.name) {
  let value = undefined;
  let type = 'other';
        if (decl.init && decl.init.type === 'Literal') {
          value = decl.init.value;
          type = typeof value;
        } else if (decl.init && decl.init.type === 'UnaryExpression' && decl.init.argument.type === 'Literal') {
          value = decl.init.operator === '-' ? -decl.init.argument.value : decl.init.argument.value;
          type = typeof value;
        }
        else if (decl.init && decl.init.type === 'Identifier') {
          value = decl.init.name;
          // PATCH: If identifier is a known p5 numeric property, treat as number
          type = P5_NUMERIC_IDENTIFIERS.has(decl.init.name) ? 'number' : 'other';
        }
        else if (decl.init && decl.init.type === 'CallExpression') {
          value = undefined;
          type = 'number';
        }
        else if (decl.init) {
          try {
            const safeGlobals = { Math, Number, String, Boolean, Array, Object };
            value = Function(...Object.keys(safeGlobals), `return (${recast.print(decl.init).code});`)
              (...Object.values(safeGlobals));
            type = typeof value;
            if (!['number', 'string', 'boolean'].includes(type)) {
              value = undefined;
              type = 'other';
            }
          } catch {
            value = undefined;
            type = 'other';
          }
        }
        globals.push({ name: decl.id.name, value, type });
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
function rewriteUserCodeWithWindowGlobals(code: string, globals: { name: string, value?: any }[]): string {
  if (!globals.length) return code;
  const acorn = require('acorn');
  const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
  const globalNames = new Set(globals.map(g => g.name));
  const programBody = ast.program.body;
  const newBody = [];
  let setupFound = false;
  const globalAssignments: any[] = [];

  // Collect assignments for globals with initializers
  for (const stmt of programBody) {
    if (stmt.type === 'VariableDeclaration') {
      for (const decl of stmt.declarations) {
        if (decl.id && decl.id.name && globalNames.has(decl.id.name) && decl.init) {
          // Assignment: x = <init>;
          globalAssignments.push(
            recast.types.builders.expressionStatement(
              recast.types.builders.assignmentExpression(
                '=',
                recast.types.builders.identifier(decl.id.name),
                decl.init
              )
            )
          );
        }
      }
    }
  }

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

    // Remove initializers from global variable declarations
    if (stmt.type === 'VariableDeclaration') {
      stmt.declarations = stmt.declarations.map(decl => {
        if (decl.id && decl.id.name && globalNames.has(decl.id.name)) {
          // Remove initializer
          return Object.assign({}, decl, { init: null });
        }
        return decl;
      });
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

    // Detect setup function and inject global assignments at its start
    if (
      stmt.type === 'FunctionDeclaration' &&
      stmt.id && stmt.id.name === 'setup' &&
      stmt.body && stmt.body.body
    ) {
      setupFound = true;
      const newSetupBody = [
        ...globalAssignments, // Inject assignments at the start
        ...stmt.body.body
      ];
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
      newBody.push(stmt);
      continue;
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

    newBody.push(stmt);
  }

  // If no setup function, create one and inject global assignments
  if (!setupFound) {
    const setupBody = [
      ...globalAssignments,
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
    ];
    newBody.push(
      recast.types.builders.functionDeclaration(
        recast.types.builders.identifier('setup'),
        [],
        recast.types.builders.blockStatement(setupBody)
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
// Preprocess top-level input() placeholders with simple caching
// ----------------------------
type TopInputItem = { varName: string; label?: string; defaultValue?: any };
const _topInputCache = new Map<string, { items: TopInputItem[]; values: any[] }>();
let _allowInteractiveTopInputs = true;
// Track reason for last reload/update to alter input overlay behavior
let _pendingReloadReason: 'typing' | 'save' | 'command' | undefined;

function detectTopLevelInputs(code: string): TopInputItem[] {
  try {
    const acorn = require('acorn');
    const ast = recast.parse(code, {
      parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) }
    });
    const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
    const items: TopInputItem[] = [];
    for (let i = 0; i < body.length; i++) {
      const node = body[i];
      if (!node) break;
      if (node.type === 'EmptyStatement') { continue; }
      if (node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'Literal' && (node as any).directive) {
        // 'use strict' or similar directive — allow and continue
        continue;
      }
      if (node.type !== 'VariableDeclaration') {
        break; // Stop scanning at first non-declaration/non-directive
      }
      const decls = (node as any).declarations || [];
      for (const d of decls) {
        if (d && d.type === 'VariableDeclarator' && d.init && d.init.type === 'CallExpression') {
          const callee = d.init.callee;
          if (callee && callee.type === 'Identifier' && callee.name === 'input') {
            const varName = d.id && d.id.name ? d.id.name : `value${items.length + 1}`;
            let label: string | undefined;
            let defaultValue: any = undefined;
            const args = d.init.arguments || [];
            if (args[0] && args[0].type === 'Literal' && typeof args[0].value === 'string') label = String(args[0].value);
            if (args[1] && args[1].type === 'Literal') defaultValue = args[1].value;
            items.push({ varName, label, defaultValue });
          }
        }
      }
    }
    return items;
  } catch {
    return [];
  }
}

function hasCachedInputsForKey(key: string, items: TopInputItem[]): boolean {
  if (!key) return false;
  const cached = _topInputCache.get(key);
  if (!cached) return false;
  if (cached.items.length !== items.length) return false;
  for (let i = 0; i < items.length; i++) {
    const a = cached.items[i];
    const b = items[i];
    if (a.varName !== b.varName) return false;
    if ((a.label || '') !== (b.label || '')) return false;
  }
  return true;
}

// Detect any usage of input() that is NOT at the very top of the file
function hasNonTopInputUsage(code: string): boolean {
  try {
    const acorn = require('acorn');
    const ast = recast.parse(code, {
      parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) }
    });
    const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
    // Find the boundary of the allowed top block (directives/empties + variable declarations)
    let idx = 0;
    while (idx < body.length) {
      const node = body[idx];
      if (!node) break;
      if (node.type === 'EmptyStatement') { idx++; continue; }
      if (node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'Literal' && (node as any).directive) {
        idx++; continue;
      }
      if (node.type === 'VariableDeclaration') { idx++; continue; }
      break; // first non-allowed top node
    }
    const allowedTopEnd = idx; // statements [0, allowedTopEnd) are top block

    // Helper to decide if a CallExpression is an allowed top-level input()
    function isAllowedTopCall(node: any): boolean {
      // Must be within a VariableDeclarator.init inside one of the first allowedTopEnd VariableDeclaration statements
      // We'll walk up the parent chain using recast paths in a manual walk
      return false; // We'll do a positional check instead of parent links
    }

    // Build a set of allowed input() nodes by scanning the top block
    const allowedNodes = new Set<any>();
    for (let i = 0; i < allowedTopEnd; i++) {
      const node = body[i];
      if (node && node.type === 'VariableDeclaration') {
        const decls = (node as any).declarations || [];
        for (const d of decls) {
          if (d && d.init && d.init.type === 'CallExpression' && d.init.callee && d.init.callee.type === 'Identifier' && d.init.callee.name === 'input') {
            allowedNodes.add(d.init);
          }
        }
      }
    }

    let illegalFound = false;
    recast.types.visit(ast, {
      visitCallExpression(path) {
        try {
          const call = path.value;
          if (call && call.callee && call.callee.type === 'Identifier' && call.callee.name === 'input') {
            if (!allowedNodes.has(call)) {
              illegalFound = true;
              return false; // stop traversing further
            }
          }
        } catch {}
        this.traverse(path);
      }
    });
    return illegalFound;
  } catch {
    return false;
  }
}

async function preprocessTopLevelInputs(
  code: string,
  opts?: { key?: string; interactive?: boolean }
): Promise<string> {
  try {
    const acorn = require('acorn');
    const ast = recast.parse(code, {
      parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) }
    });
    const b = recast.types.builders;
  const body: any[] = (ast.program && Array.isArray((ast.program as any).body)) ? (ast.program as any).body : [];
    const placeholders: Array<{ decl: any; varName: string; label?: string; defaultValue?: any; }>=[];

    // Scan from the top until a non-VariableDeclaration is found
    for (let i = 0; i < body.length; i++) {
      const node = body[i];
      if (!node) break;
      if (node.type === 'EmptyStatement') { continue; }
      if (node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'Literal' && (node as any).directive) {
        // 'use strict' or similar directive — allow and continue
        continue;
      }
      if (node.type !== 'VariableDeclaration') break;
      const decls = (node as any).declarations || [];
      for (const d of decls) {
        if (d && d.type === 'VariableDeclarator' && d.init && d.init.type === 'CallExpression') {
          const callee = d.init.callee;
          if (callee && callee.type === 'Identifier' && callee.name === 'input') {
            let label: string | undefined;
            let defaultValue: any = undefined;
            const args = d.init.arguments || [];
            if (args[0] && args[0].type === 'Literal' && typeof args[0].value === 'string') {
              label = String(args[0].value);
            }
            if (args[1] && args[1].type === 'Literal') {
              defaultValue = args[1].value;
            }
            const varName = d.id && d.id.name ? d.id.name : `value${placeholders.length + 1}`;
            placeholders.push({ decl: d, varName, label, defaultValue });
          }
        }
      }
    }

    if (placeholders.length === 0) return code;

    const key = opts?.key || '';
    const interactive = typeof opts?.interactive === 'boolean' ? opts!.interactive : _allowInteractiveTopInputs;

    const items: TopInputItem[] = placeholders.map(ph => ({ varName: ph.varName, label: ph.label }));
    let values: any[] | null = null;

    if (!interactive && key && _topInputCache.has(key)) {
      const cached = _topInputCache.get(key)!;
      const sameShape = cached.items.length === items.length && cached.items.every((it, i) => it.varName === items[i].varName && (it.label || '') === (items[i].label || ''));
      if (sameShape) {
        values = cached.values.slice();
      }
    }

    if (!values) {
      values = [];
      for (const ph of placeholders) {
        const prompt = ph.label || `Enter value for ${ph.varName}`;
        const defaultStr = ph.defaultValue !== undefined ? String(ph.defaultValue) : '';
        if (!interactive) {
          // No cached values and interactive disabled: skip preprocessing
          return code;
        }
        const input = await vscode.window.showInputBox({ prompt, value: defaultStr, ignoreFocusOut: true });
        if (typeof input === 'undefined') {
          // User cancelled: abort preprocessing (keep original code)
          return code;
        }
        let typed: any = input;
        const low = input.trim().toLowerCase();
        if (low === 'true' || low === 'false') {
          typed = (low === 'true');
        } else {
          const num = Number(input);
          if (!Number.isNaN(num) && input.trim() !== '') typed = num;
        }
        values.push(typed);
      }
      if (key) _topInputCache.set(key, { items, values: values.slice() });
    }

    // Apply values
    for (let i = 0; i < placeholders.length; i++) {
      const ph = placeholders[i];
      ph.decl.init = b.literal(values[i]);
    }
    return recast.print(ast).code;
  } catch (e) {
    return code;
  }
}

// ----------------------------
// Create Webview HTML
// ----------------------------
async function createHtml(
  userCode: string,
  panel: vscode.WebviewPanel,
  extensionPath: string
) {
  // Preprocess top-of-file input() placeholders before anything else
  const key = (panel && (panel as any)._sketchFilePath) ? String((panel as any)._sketchFilePath) : '';
  userCode = await preprocessTopLevelInputs(userCode, { key, interactive: _allowInteractiveTopInputs });
  // Get the sketch filename (without extension)
  let sketchFileName = '';
  if (panel && (panel as any)._sketchFilePath) {
    sketchFileName = path.basename((panel as any)._sketchFilePath);
  }
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

  // Match overlay font size to the editor font size
  const editorFontSize = vscode.workspace.getConfiguration('editor').get<number>('fontSize', 14);

  return `<!DOCTYPE html>
<!-- cache-bust: ${uniqueId} -->
<html>
<head>
${scriptTags}
<script id="user-code-script" data-user-code="true">
${escapedCode}
</script>
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
      document.addEventListener('keydown', function esc(ev) { if (ev.key === 'Escape') { removeMenu(); document.removeEventListener('keydown', esc); } });
    }, 0);
  });
})();
</script>
<style>
:root { --overlay-font-size: ${editorFontSize}px; }
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
  opacity: 1;
  transform: translateY(0);
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {
  opacity: 1;
}

/* Hide spin buttons when input is readonly OR when the var-controls container is marked readonly.
   This covers WebKit/Blink and provides a Firefox fallback by forcing textfield appearance. */
input[readonly][type=number]::-webkit-inner-spin-button,
input[readonly][type=number]::-webkit-outer-spin-button,
#p5-var-controls.vars-readonly input[type=number]::-webkit-inner-spin-button,
#p5-var-controls.vars-readonly input[type=number]::-webkit-outer-spin-button {
  opacity: 0;
  -webkit-appearance: none;
  margin: 0;
  width: 0;
  height: 0;
}

/* Firefox: remove the number spinner arrows by using textfield appearance on readonly/readonly-container */
input[readonly][type=number],
#p5-var-controls.vars-readonly input[type=number] {
  -moz-appearance: textfield;
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
  top: 2px;
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

.arrow:hover {
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
  opacity: 1;
  transform: translateY(0);
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {
  opacity: 1;
}
  #p5-var-controls input {
  width: 63px;
}
  #p5-var-controls input[type=checkbox] {
    width: 16px;
}

/* Hide spin buttons when input is readonly OR when the var-controls container is marked readonly.
   This covers WebKit/Blink and provides a Firefox fallback by forcing textfield appearance. */
input[readonly][type=number]::-webkit-inner-spin-button,
input[readonly][type=number]::-webkit-outer-spin-button,
#p5-var-controls.vars-readonly input[type=number]::-webkit-inner-spin-button,
#p5-var-controls.vars-readonly input[type=number]::-webkit-outer-spin-button {
  opacity: 0;
  -webkit-appearance: none;
  margin: 0;
  width: 0;
  height: 0;
}

/* Firefox: remove the number spinner arrows by using textfield appearance on readonly/readonly-container */
input[readonly][type=number],
#p5-var-controls.vars-readonly input[type=number] {
  -moz-appearance: textfield;
}

</style>
</head>
<body>
<div id="error-overlay"></div>
<div id="warning-overlay"></div>
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
  const origLog=console.log;
  console.log=function(...args){vscode.postMessage({type:"log",message:args}); origLog.apply(console,args);}
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
    let raw = (event.message || 'Unknown error');
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
    window._p5Instance = new p5();
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
  case "showWarning": showWarning(data.message); break;
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
          if (!msg.startsWith("[‼️RUNTIME ERROR]")) {
            msg = "[‼️RUNTIME ERROR] " + msg;
          }
          vscode.postMessage({type:"showError",message:msg});
        }
      }
      break;
    case 'setGlobalVars':
      if (typeof data.debounceDelay === 'number') {
        window._p5DebounceDelay = data.debounceDelay;
      }
      const readOnly = !!data.readOnly;
      renderGlobalVarControls(data.variables, readOnly);
      // Store types for later use (use v.type provided by extension)
      window._p5GlobalVarTypes = {};
      data.variables.forEach(v => {
        window._p5GlobalVarTypes[v.name] = v.type || typeof v.value;
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
    case 'updateOverlayFontSize':
      if (typeof data.value === 'number') {
        document.documentElement.style.setProperty('--overlay-font-size', data.value + 'px');
      }
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
          lab.textContent = (it.label || it.varName) + ':';
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
            const v = (el.value || '').trim();
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
  controls.classList.add('drawer-hidden');
  tab.style.display = 'flex';
  tab.classList.add('tab-visible'); // Animate tab up at the same time as drawer animates down
  setTimeout(() => {
    controls.style.display = 'none';
    // Tab remains visible after animation
  }, 200);
}

// Shows the variable drawer UI in the webview
function showDrawer() {
  const controls = document.getElementById('p5-var-controls');
  const tab = document.getElementById('p5-var-drawer-tab');
  if (!controls || !tab) return;
  controls.style.display = 'flex';
  tab.classList.remove('tab-visible'); // Animate tab down at the same time as drawer animates up
  setTimeout(() => {
    tab.style.display = 'none'; // Hide tab after animation
  }, 200);
  setTimeout(() => {
    controls.classList.remove('drawer-hidden');
  }, 10);
}

// Dynamically creates/removes the variable drawer and tab, and sets up event listeners for variable changes
function renderGlobalVarControls(vars, readOnly) {
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
  // Mark controls as readonly when requested so CSS can hide number spin buttons
  controls.classList.toggle('vars-readonly', !!readOnly);
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
    if (v.type === 'number') {
      input = document.createElement('input');
      input.type = 'number';
      input.value = (typeof v.value === 'number' && !isNaN(v.value)) ? v.value : '';
      input.step = 'any';
      if (readOnly) input.readOnly = true;
    } else if (v.type === 'boolean') {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!v.value;
      if (readOnly) {
        input.disabled = true;
      } else {
        input.addEventListener('change', () => {
          updateGlobalVarInSketch(v.name, input.checked);
          vscode.postMessage({ type: 'updateGlobalVar', name: v.name, value: input.checked });
        });
      }
     // PATCH: fix vertical alignment for boolean labels
     label.style.display = 'inline-flex';
     label.style.alignItems = 'center';
     label.style.height = '22px';
     label.style.marginBottom = '0px';
     label.style.verticalAlign = 'middle';
     label.style.padding = '0 2px 0 0';
     label.style.lineHeight = '1.2';
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.value = v.value !== undefined ? v.value : '';
      if (readOnly) input.readOnly = true;
    }
    input.setAttribute('data-var', v.name);
    if (typeof v.value !== 'boolean') {
      if (!readOnly) {
        // existing debounced input logic
        const delay = (typeof window._p5VarControlDebounceDelay === 'number')
          ? window._p5VarControlDebounceDelay
          : window._p5DebounceDelay;
        const debouncedUpdate = debounceWebview(() => {
          let val = input.value;
          if (v.type === 'number') val = Number(val);
          updateGlobalVarInSketch(v.name, val);
          vscode.postMessage({ type: 'updateGlobalVar', name: v.name, value: val });
        }, delay);
        input.addEventListener('input', debouncedUpdate);
        input.addEventListener('keydown', function(ev) {
          if (ev.key === 'Enter' || ev.key === 'Return') {
            ev.preventDefault();
            let val = input.value;
            if (v.type === 'number') val = Number(val);
            updateGlobalVarInSketch(v.name, val);
            vscode.postMessage({ type: 'updateGlobalVar', name: v.name, value: val });
            input.blur();
          }
        });
      }
      // if readOnly: do not attach input/change handlers
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
  // --- Simple Semicolon Linter (Problems panel) ---
  const semicolonDiagnostics = vscode.languages.createDiagnosticCollection('semicolon-linter');
  context.subscriptions.push(semicolonDiagnostics);
  // NOTE: We'll log semicolon warnings to the per-sketch output channel on run/reload only.

  function lintSemicolons(document: vscode.TextDocument) {
    // Only lint real files; skip output, git, etc.
    if (document.uri.scheme !== 'file') return;
    // Target common JS/TS-like files; keep it simple per request
    const lang = document.languageId;
    const isJsLike = lang === 'javascript' || lang === 'typescript' || lang === 'javascriptreact' || lang === 'typescriptreact';
    if (!isJsLike) {
      semicolonDiagnostics.delete(document.uri);
      return;
    }

    const text = document.getText();
    const diagnostics: vscode.Diagnostic[] = [];

    // Try an AST-based pass for JavaScript (more accurate, still simple)
    let usedAst = false;
    if (lang === 'javascript' || lang === 'javascriptreact') {
      try {
        const acorn = require('acorn');
        let ast: any;
        try {
          ast = acorn.parse(text, { ecmaVersion: 2020, sourceType: 'module', ranges: true });
        } catch {
          ast = acorn.parse(text, { ecmaVersion: 2020, sourceType: 'script', ranges: true });
        }
        usedAst = true;
        const wantsSemicolon = new Set([
          'ExpressionStatement',
          'VariableDeclaration',
          'ReturnStatement',
          'ThrowStatement',
          'BreakStatement',
          'ContinueStatement'
        ]);

        function addDiagAt(endIndex: number) {
          // If last char is already ';', nothing to report
          if (endIndex > 0 && text[endIndex - 1] === ';') return;
          // Position at the end of the statement
          const endPos = document.positionAt(endIndex);
          // Highlight a zero-width range at end of the statement line
          const range = new vscode.Range(endPos, endPos);
          const diag = new vscode.Diagnostic(
            range,
            'Missing semicolon.',
            vscode.DiagnosticSeverity.Warning
          );
          diag.source = 'Semicolon Linter';
          diagnostics.push(diag);
        }

        function visit(node: any, parent: any = null) {
          if (!node || typeof node.type !== 'string') return;
          if (wantsSemicolon.has(node.type) && typeof node.end === 'number') {
            // Skip variable declarations that are part of a for-header (no trailing semicolon for the decl itself)
            if (
              node.type === 'VariableDeclaration' && parent && (
                (parent.type === 'ForStatement' && parent.init === node) ||
                (parent.type === 'ForInStatement' && parent.left === node) ||
                (parent.type === 'ForOfStatement' && parent.left === node)
              )
            ) {
              // no-op
            } else {
              addDiagAt(node.end);
            }
          }
          for (const key of Object.keys(node)) {
            const child = (node as any)[key];
            if (!child) continue;
            if (Array.isArray(child)) {
              for (const c of child) visit(c, node);
            } else if (typeof child === 'object' && typeof child.type === 'string') {
              visit(child, node);
            }
          }
        }
        visit(ast, null);
      } catch {
        // Fallback to heuristic line-based linter below
        usedAst = false;
      }
    }

    // Heuristic fallback (works for TS/JS and when parse fails)
    if (!usedAst) {
      const lines = text.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        // Strip single-line comments
        const slIdx = line.indexOf('//');
        if (slIdx >= 0) line = line.slice(0, slIdx);
        const trimmed = line.trimEnd();
        if (trimmed.length === 0) continue;
        // Quick skip: lines that clearly shouldn't end with semicolon
        const lower = trimmed.toLowerCase();
        const endsWith = (s: string) => trimmed.endsWith(s);
        const skipEndChars = [';', '{', '}', ',', ':', '(', ')', '[', ']', '`'];
        const skipEndings = ['=>', '++', '--', '.', '?', '??'];
        const startsWithKeywords = ['if', 'for', 'while', 'switch', 'else', 'do', 'try', 'catch', 'finally', 'class', 'interface', 'enum'];
        const startsWithTsTypes = ['type '];
        if (
          skipEndChars.some(c => endsWith(c)) ||
          skipEndings.some(s => endsWith(s)) ||
          startsWithKeywords.some(k => lower.startsWith(k + ' ')) ||
          startsWithTsTypes.some(k => lower.startsWith(k))
        ) {
          continue;
        }
        // Allow function declarations without semicolon (end with ")" and not a call-chain)
        if ((/\bfunction\b/.test(trimmed) || /^(async\s+)?\w+\s*\([^)]*\)\s*$/.test(trimmed)) && endsWith(')')) {
          continue;
        }
        // If not ending with semicolon: warn
        if (!endsWith(';')) {
          const eolPos = new vscode.Position(i, lines[i].length);
          const range = new vscode.Range(eolPos, eolPos);
          const diag = new vscode.Diagnostic(range, 'Missing semicolon.', vscode.DiagnosticSeverity.Warning);
          diag.source = 'Semicolon Linter';
          diagnostics.push(diag);
        }
      }
    }

    semicolonDiagnostics.set(document.uri, diagnostics);

  }

  function lintActiveEditor() {
    const ed = vscode.window.activeTextEditor;
    if (ed) lintSemicolons(ed.document);
  }

  function logSemicolonWarningsForDocument(document: vscode.TextDocument) {
    // Ensure diagnostics are up to date for this document
    lintSemicolons(document);
    const diags = semicolonDiagnostics.get(document.uri) || [];
    if (diags.length === 0) return;
    const uniqLines = Array.from(new Set(diags.map(d => d.range.start.line + 1))).sort((a, b) => a - b);
    const docUri = document.uri.toString();
    const fileName = path.basename(document.fileName);
    const outputChannel = getOrCreateOutputChannel(docUri, fileName);
    const warningText = `Missing semicolon on line(s): ${uniqLines.join(', ')}`;
    const fullWarning = `[⚠️WARNING in ${fileName}] ${warningText}`;
    outputChannel.appendLine(`${getTime()} ${fullWarning}`);
    // Also show the warning overlay in the corresponding webview (no timestamp)
    const panel = webviewPanelMap.get(docUri);
    const blockOnWarning = vscode.workspace.getConfiguration('liveP5').get<boolean>('BlockSketchOnWarning', true);
    if (panel && blockOnWarning) {
      panel.webview.postMessage({ type: 'showWarning', message: fullWarning });
    }
  }

  function hasSemicolonWarnings(document: vscode.TextDocument): { has: boolean; lines: number[] } {
    lintSemicolons(document);
    const diags = semicolonDiagnostics.get(document.uri) || [];
    const lines = Array.from(new Set(diags.map(d => d.range.start.line + 1))).sort((a, b) => a - b);
    return { has: diags.length > 0, lines };
  }

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
  p5RefStatusBar.text = '$(book) P5.js Reference'; // Status bar text
  p5RefStatusBar.tooltip = '$(book) Open P5.js Reference'; // Tooltip text
  p5RefStatusBar.color = '#ff0000';
  p5RefStatusBar.tooltip = '$(book) Open P5.js Reference';
  context.subscriptions.push(p5RefStatusBar);

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.openP5Ref', () => {
      vscode.env.openExternal(vscode.Uri.parse(`https://p5js.org/reference/`));
    })
  );

  // Blockly Webview: command and panel
  // Track which document opened which blockly panel (for multi-panel support)
  const blocklyPanelForDocument = new Map<string, vscode.WebviewPanel>();
  // When a blockly panel is open for a document, we keep track of outstanding extension-updates
  const ignoreDocumentChangeForBlockly = new Set<string>();
  const workspaceDebounceTimers = new Map<string, NodeJS.Timeout>();

  function extractEmbeddedWorkspaceFromCode(code: string): string | null {
    if (!code) return null;
    try {
      const m = code.match(/\/\*@BlocklyWorkspace\s*([\s\S]*?)\*\//);
      if (m && m[1]) return m[1].trim();
    } catch (e) { }
    return null;
  }

  // Compute sidecar path for a given document file path.
  // Sidecar files live in a sibling folder named `.blockly` next to the sketch.
  // Each sidecar file will be named <original-base>.blockly (no .json extension).
  function sidecarPathForFile(filePath: string) {
    try {
      const dir = path.dirname(filePath);
      const base = path.basename(filePath);
      const sidecarDir = path.join(dir, '.blockly');
      const sidecarName = base + '.blockly';
      return path.join(sidecarDir, sidecarName);
    } catch (e) {
      return null;
    }
  }

  // Remove the parent .blockly folder if it becomes empty after removing a sidecar
  function removeSidecarDirIfEmpty(sidePath: string | null) {
    try {
      if (!sidePath) return;
      const dir = path.dirname(sidePath);
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir);
      if (files.length === 0) {
        try { fs.rmdirSync(dir); } catch { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
  }

  function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  function getBlocklyHtml(panel: vscode.WebviewPanel): string {
    const webview = panel.webview;
    const nonce = getNonce();
  const exampleRoot = vscode.Uri.file(path.join(context.extensionPath, 'blockly'));
    const exampleRootUri = webview.asWebviewUri(exampleRoot);
    const indexCss = webview.asWebviewUri(vscode.Uri.file(path.join(exampleRoot.fsPath, 'index.css')));
    const toolboxJs = webview.asWebviewUri(vscode.Uri.file(path.join(exampleRoot.fsPath, 'toolbox.js')));
    const blocksJs = webview.asWebviewUri(vscode.Uri.file(path.join(exampleRoot.fsPath, 'blocks.js')));
    const generatorsJs = webview.asWebviewUri(vscode.Uri.file(path.join(exampleRoot.fsPath, 'generators.js')));
  const appJs = webview.asWebviewUri(vscode.Uri.file(path.join(exampleRoot.fsPath, 'app.js')));
  const autoBlocksJs = webview.asWebviewUri(vscode.Uri.file(path.join(exampleRoot.fsPath, 'p5_autoblocks.js')));
    const p5Js = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'assets', 'p5.min.js')));

    // Try to read the exported allowlist of blocks and extra categories from blockly_categories.json
    let allowedBlocksScript = '';
    let extraCategoriesScript = '';
    try {
      const allowPath = path.join(context.extensionPath, 'blockly', 'blockly_categories.json');
      if (fs.existsSync(allowPath)) {
        const txt = fs.readFileSync(allowPath, 'utf8');
        try {
          const obj = JSON.parse(txt);
          const allowed = new Set<string>();
          let extraCats: any[] = [];
          if (obj && Array.isArray(obj.categories)) {
            for (const cat of obj.categories) {
              if (cat && Array.isArray(cat.blocks)) {
                for (const b of cat.blocks) {
                  if (typeof b === 'string' && b.trim()) allowed.add(b);
                }
              }
            }
            // Pass entire categories array to let the webview append completely new categories
            extraCats = obj.categories;
          }
          const arr = Array.from(allowed);
          allowedBlocksScript = `<script nonce="${nonce}">\nwindow.ALLOWED_BLOCKS = ${JSON.stringify(arr)};\n</script>`;
          extraCategoriesScript = `<script nonce="${nonce}">\nwindow.EXTRA_TOOLBOX_CATEGORIES = ${JSON.stringify(extraCats)};\n</script>`;
        } catch { /* ignore parse errors */ }
      }
    } catch { /* ignore file errors */ }

    // Build a name->category map for p5 functions based on p5types/src folder structure
    function buildP5CategoryMap(): Record<string, string> {
      const map: Record<string, string> = {};
      try {
        const srcRoot = path.join(context.extensionPath, 'p5types', 'src');
        const topFolders = [
          'color','core','data','dom','events','image','io','math','typography','utilities','webgl'
        ];
        const labelForFolder: Record<string, string> = {
          color: 'Color',
          core: 'Core',
          data: 'Data',
          dom: 'DOM',
          events: 'Events',
          image: 'Image',
          io: 'IO',
          math: 'Math',
          typography: 'Typography',
          utilities: 'Utilities',
          webgl: 'WebGL',
        };

        function parseP5InstanceMethodsFromDts(text: string): string[] {
          const out = new Set<string>();
          // narrow to interface p5InstanceExtensions block if present
          const ifaceIdx = text.indexOf('interface p5InstanceExtensions');
          if (ifaceIdx >= 0) {
            const tail = text.slice(ifaceIdx);
            // crude block extraction: from first '{' after interface to next '\n}\n' or end
            const braceStart = tail.indexOf('{');
            if (braceStart >= 0) {
              const body = tail.slice(braceStart + 1);
              // match lines like: name( ... ): p5;
              const rx = /\n\s*([a-zA-Z_][\w]*)\s*\(/g;
              let m: RegExpExecArray | null;
              while ((m = rx.exec(body))) {
                const name = m[1];
                if (!name) continue;
                // ignore obvious non-methods
                if (name === 'constructor') continue;
                out.add(name);
              }
            }
          }
          return Array.from(out);
        }

        function addFile(filePath: string, label: string) {
          try {
            const text = fs.readFileSync(filePath, 'utf8');
            const names = parseP5InstanceMethodsFromDts(text);
            names.forEach(n => { if (!map[n]) map[n] = label; });
          } catch {}
        }

        topFolders.forEach(folder => {
          const abs = path.join(srcRoot, folder);
          if (!fs.existsSync(abs)) return;
          const label = labelForFolder[folder] || folder;
          const entries = fs.readdirSync(abs);
          entries.forEach(entry => {
            const full = path.join(abs, entry);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) {
              // Specialize some core subfolders to p5 reference top-level categories
              let subLabel = label;
              if (folder === 'core') {
                if (entry.toLowerCase().includes('shape')) subLabel = 'Shape';
                else if (entry.toLowerCase().includes('structure')) subLabel = 'Structure';
                else if (entry.toLowerCase().includes('transform')) subLabel = 'Transform';
                else if (entry.toLowerCase().includes('environment')) subLabel = 'Environment';
                else if (entry.toLowerCase().includes('render')) subLabel = 'Rendering';
                else if (entry.toLowerCase().includes('constants')) subLabel = 'Constants';
              } else if (folder === 'webgl') {
                subLabel = 'WebGL';
              }
              const subFiles = fs.readdirSync(full);
              subFiles.forEach(f => {
                if (f.endsWith('.d.ts')) addFile(path.join(full, f), subLabel);
              });
            } else if (entry.endsWith('.d.ts')) {
              // direct .d.ts under folder
              addFile(full, label);
            }
          });
        });
      } catch {}
      return map;
    }
    const p5CategoryMap = buildP5CategoryMap();

    // Build a name->param names map for p5 functions from p5types .d.ts
    function buildP5ParamMap(): Record<string, string[]> {
      const paramMap: Record<string, string[]> = {};
      try {
        const srcRoot = path.join(context.extensionPath, 'p5types', 'src');
        const folders = [
          'color','core','data','dom','events','image','io','math','typography','utilities','webgl'
        ];
        const dtsFiles: string[] = [];
        function collectDts(dir: string) {
          if (!fs.existsSync(dir)) return;
          const entries = fs.readdirSync(dir);
          entries.forEach((e) => {
            const full = path.join(dir, e);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) collectDts(full);
            else if (e.endsWith('.d.ts')) dtsFiles.push(full);
          });
        }
        folders.forEach(f => collectDts(path.join(srcRoot, f)));

        const ifaceStart = /interface\s+p5InstanceExtensions\b/;
        const sigRx = /\n\s*([a-zA-Z_][\w]*)\s*\(([^)]*)\)\s*:/g; // name(paramList):
        dtsFiles.forEach(file => {
          try {
            const text = fs.readFileSync(file, 'utf8');
            const idx = text.search(ifaceStart);
            if (idx < 0) return;
            const part = text.slice(idx);
            const braceStart = part.indexOf('{');
            if (braceStart < 0) return;
            // take a window of text to avoid scanning entire file
            const windowText = part.slice(braceStart + 1, part.indexOf('\n}', braceStart + 1) > 0 ? part.indexOf('\n}', braceStart + 1) : part.length);
            let m: RegExpExecArray | null;
            while ((m = sigRx.exec(windowText))) {
              const name = m[1];
              const paramsStr = m[2].trim();
              if (!name) continue;
              // Extract param names, drop types and modifiers
              const params: string[] = [];
              if (paramsStr.length > 0) {
                paramsStr.split(',').forEach(raw => {
                  let p = raw.trim();
                  if (!p) return;
                  // remove default value
                  const eqIdx = p.indexOf('=');
                  if (eqIdx >= 0) p = p.slice(0, eqIdx).trim();
                  // param may be like '...args: any[]' or 'x?: number' or 'x: number'
                  // take identifier before ':'
                  const colonIdx = p.indexOf(':');
                  if (colonIdx >= 0) p = p.slice(0, colonIdx).trim();
                  // strip decorators
                  p = p.replace(/^\.{3}/, ''); // ...rest
                  p = p.replace(/\?$/, ''); // optional marker
                  // ensure a sane label (avoid empty)
                  if (p && /^[a-zA-Z_][\w]*$/.test(p)) params.push(p);
                });
              }
              // choose the signature with the most params
              const prev = paramMap[name];
              if (!prev || (params && params.length > prev.length)) {
                if (params && params.length) paramMap[name] = params;
              }
            }
          } catch {}
        });
      } catch {}
      return paramMap;
    }
    const p5ParamMap = buildP5ParamMap();

    // Allow scripts from unpkg for the example; allow our own scripts via nonce
  const csp = `default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' https: 'unsafe-eval'; font-src ${webview.cspSource} https:; connect-src https:; media-src https: ${webview.cspSource}`;

    // Add a unique storage key for this panel (based on the document URI)
    const storageKey = panel.title.startsWith('BLOCKLY: ')
      ? 'blockly_' + encodeURIComponent(panel.title.slice(9))
      : 'blockly_default';

    // Read the user's configured blockly theme and pass it into the webview
    let configuredBlocklyTheme = 'dark';
    try {
      const cfg = vscode.workspace.getConfiguration('liveP5');
      const t = cfg.get<string>('blocklyTheme');
      if (t) configuredBlocklyTheme = t;
    } catch (e) { /* ignore */ }
    return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="Content-Security-Policy" content="${csp}">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Blockly</title>
      <link rel="stylesheet" href="${indexCss}" />
      <script nonce="${nonce}" src="https://unpkg.com/blockly/blockly_compressed.js"></script>
      <script nonce="${nonce}" src="https://unpkg.com/blockly/blocks_compressed.js"></script>
      <script nonce="${nonce}" src="https://unpkg.com/blockly/javascript_compressed.js"></script>
      <script nonce="${nonce}" src="https://unpkg.com/blockly/msg/en.js"></script>
      <script nonce="${nonce}" src="${p5Js}"></script>
    </head>
    <body>
      <div id="pageContainer">
        <div id="outputPane">
          <pre id="generatedCode"><code></code></pre>
          <div id="output"></div>
        </div>
        <div id="blocklyDiv"></div>
      </div>

    <script nonce="${nonce}" src="${toolboxJs}"></script>
  ${allowedBlocksScript}
  ${extraCategoriesScript}
    <script nonce="${nonce}" src="${blocksJs}"></script>
    <script nonce="${nonce}" src="${generatorsJs}"></script>
    <script nonce="${nonce}">
  window.P5_CATEGORY_MAP = ${JSON.stringify(p5CategoryMap)};
  window.P5_PARAM_MAP = ${JSON.stringify(p5ParamMap)};
  window.BLOCKLY_STORAGE_KEY = ${JSON.stringify(storageKey)};
  window.BLOCKLY_THEME = ${JSON.stringify(configuredBlocklyTheme)};
    </script>
    <script nonce="${nonce}" src="${autoBlocksJs}"></script>
      <script nonce="${nonce}" src="${appJs}"></script>
    </body>
    </html>`;
  }

  context.subscriptions.push(


    vscode.commands.registerCommand('extension.open-blockly', async () => {
      const originatingEditor = vscode.window.activeTextEditor;
      if (!originatingEditor) {
        vscode.window.showWarningMessage('No active editor to open Blockly for.');
        return;
      }
      const doc = originatingEditor.document;
      const docUri = doc.uri.toString();
      const text = doc.getText();
      const isEmpty = text.trim().length === 0;
      // Require a sidecar file to open Blockly (or allow opening for empty files).
      const sidecar = sidecarPathForFile(doc.fileName);
      const hasSidecar = !!(sidecar && fs.existsSync(sidecar));
      if (!isEmpty && !hasSidecar) {
        vscode.window.showInformationMessage('Blockly was not opened: The file must be empty or have a .blockly sidecar file to open.');
        return;
      }

      // If a panel already exists for this document, reveal it
      const existingPanel = blocklyPanelForDocument.get(docUri);
      if (existingPanel) {
        existingPanel.reveal(vscode.ViewColumn.Active);
        return;
      }

      const scriptName = path.basename(doc.fileName);
      const blocklyPanel = vscode.window.createWebviewPanel(
        'blocklyPanel',
        `BLOCKLY: ${scriptName}`,
        { viewColumn: vscode.ViewColumn.Active, preserveFocus: true },
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'blockly')),
            vscode.Uri.file(path.join(context.extensionPath, 'vendor')),
            vscode.Uri.file(path.join(context.extensionPath, 'assets'))
          ]
        }
      );
      blocklyPanelForDocument.set(docUri, blocklyPanel);
        // No longer block edits. Instead, we'll listen for document changes and, if the file
        // contains an embedded workspace, forward it to the Blockly webview so the workspace
        // can be restored/updated. See listener registration below.
      blocklyPanel.onDidDispose(() => {
        blocklyPanelForDocument.delete(docUri);
          // nothing else to cleanup here
      });
      blocklyPanel.webview.html = getBlocklyHtml(blocklyPanel);
          // After setting HTML, send the resolved theme to the webview so it can apply
          try {
            const cfg = vscode.workspace.getConfiguration('liveP5');
            const t = cfg.get<string>('blocklyTheme', 'dark');
            let resolved = t;
            if (t === 'auto') {
              resolved = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light';
            }
            try { blocklyPanel.webview.postMessage({ type: 'setBlocklyTheme', theme: resolved }); } catch (e) { }
          } catch (e) { }
        setTimeout(() => {
          vscode.commands.executeCommand('workbench.action.moveEditorToBelowGroup');
        }, 200);

        // After the webview is ready, prefer loading workspace from a sibling .blockly sidecar.
        // If no sidecar exists, fall back to embedded workspace and migrate it to sidecar.
        (async () => {
          try {
            const filePath = doc.fileName;
            const sidecar = sidecarPathForFile(filePath);
            let workspaceContent: string | null = null;
            if (sidecar && fs.existsSync(sidecar)) {
              try { workspaceContent = fs.readFileSync(sidecar, 'utf8'); } catch (e) { workspaceContent = null; }
            }
            if (!workspaceContent) {
              const embedded = extractEmbeddedWorkspaceFromCode(text);
              if (embedded) {
                workspaceContent = embedded;
                // Migrate: write sidecar directory and file
                try {
                  const sidecarDir = path.dirname(sidecar!);
                  fs.mkdirSync(sidecarDir, { recursive: true });
                  fs.writeFileSync(sidecar!, workspaceContent, 'utf8');
                } catch (e) { /* ignore migration errors */ }
              }
            }
            if (workspaceContent) {
              setTimeout(() => {
                try { blocklyPanel.webview.postMessage({ type: 'loadWorkspace', workspace: workspaceContent }); } catch (e) {}
              }, 300);
            }
          } catch (e) { }
        })();

        blocklyPanel.webview.onDidReceiveMessage(async msg => {
    if (msg && msg.type === 'blocklyGeneratedCode' && typeof msg.code === 'string') {
      // Always persist the export, even if the workspace and code are empty.
      let wsObj: any = null;
      try {
        if (msg.workspace && typeof msg.workspace === 'string') wsObj = JSON.parse(msg.workspace);
      } catch (e) { wsObj = null; }
      if (originatingEditor && !originatingEditor.document.isClosed) {
        try {
          const filePath = originatingEditor.document.fileName;
          const sidecar = sidecarPathForFile(filePath);
          // Write workspace to sidecar (create .blockly folder if necessary)
          if (sidecar && msg.workspace && typeof msg.workspace === 'string') {
            try {
              const sidecarDir = path.dirname(sidecar);
              fs.mkdirSync(sidecarDir, { recursive: true });
              // Prefer writing a pretty JSON representation if it's a valid object
              try {
                const pretty = wsObj ? JSON.stringify(wsObj, null, 2) : msg.workspace;
                fs.writeFileSync(sidecar, pretty, 'utf8');
              } catch (e) {
                fs.writeFileSync(sidecar, msg.workspace, 'utf8');
              }
            } catch (e) {
              // ignore
            }
          }
          // Write generated code to file WITHOUT embedded workspace comment
          let finalCode = msg.code.replace(/\/\*@BlocklyWorkspace[\s\S]*?\*\//g, '');
          // If code is empty, clear the file
          if (finalCode.trim().length === 0) {
            finalCode = '';
          } else if (!finalCode.endsWith('\n')) {
            finalCode = finalCode + '\n';
          }
          // Apply edit but ignore the resulting change event to avoid loops
          ignoreDocumentChangeForBlockly.add(docUri);
          const edit = new vscode.WorkspaceEdit();
          const fullRange = new vscode.Range(
            originatingEditor.document.positionAt(0),
            originatingEditor.document.positionAt(originatingEditor.document.getText().length)
          );
          edit.replace(originatingEditor.document.uri, fullRange, finalCode);
          const ok = await vscode.workspace.applyEdit(edit);
          if (ok) {
            try {
              await originatingEditor.document.save();
            } catch (e) { /* ignore save errors */ }
          }
          setTimeout(() => ignoreDocumentChangeForBlockly.delete(docUri), 300);
        } catch (e) { }
      }
    }
  });
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
  // Run initial semicolon lint on the active editor
  lintActiveEditor();

  vscode.window.onDidChangeActiveTextEditor(editor => {
    updateP5Context(editor);
    updateJsOrTsContext(editor);
    if (!editor) return;
    const docUri = editor.document.uri.toString();
    // Focus the corresponding Blockly panel if it exists
    const blocklyPanel = blocklyPanelForDocument.get(docUri);
    if (blocklyPanel) {
      blocklyPanel.reveal(blocklyPanel.viewColumn, true);
    }
    if (!editor) return;
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
    // ...existing code for moving editor to left column and linting...
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
            vscode.window.showTextDocument(editor.document, vscode.ViewColumn.One, false);
          });
        });
      }
    }
    lintActiveEditor();
  });

  vscode.workspace.onDidChangeTextDocument(e => {
    if (e.document === vscode.window.activeTextEditor?.document) {
      updateP5Context(vscode.window.activeTextEditor);
    }
    // Lint on text change
    lintSemicolons(e.document);
    // If this document has a Blockly panel open, forward any embedded workspace to the webview
    try {
      const docUri = e.document.uri.toString();
      const panel = blocklyPanelForDocument.get(docUri);
      if (panel) {
        if (ignoreDocumentChangeForBlockly.has(docUri)) return;
        if (workspaceDebounceTimers.has(docUri)) clearTimeout(workspaceDebounceTimers.get(docUri)!);
        workspaceDebounceTimers.set(docUri, setTimeout(() => {
          (async () => {
            try {
              const txt = e.document.getText();
              const filePath = e.document.fileName;
              const sidecar = sidecarPathForFile(filePath);
              let workspaceContent: string | null = null;
              if (sidecar && fs.existsSync(sidecar)) {
                try { workspaceContent = fs.readFileSync(sidecar, 'utf8'); } catch (e) { workspaceContent = null; }
              }
              if (!workspaceContent) {
                const embedded = extractEmbeddedWorkspaceFromCode(txt);
                if (embedded) {
                  workspaceContent = embedded;
                  // Migrate to sidecar for future stability
                  try {
                    const sidecarDir = path.dirname(sidecar!);
                    fs.mkdirSync(sidecarDir, { recursive: true });
                    fs.writeFileSync(sidecar!, workspaceContent, 'utf8');
                  } catch (e) { /* ignore */ }
                }
              }
              if (workspaceContent) {
                panel.webview.postMessage({ type: 'loadWorkspace', workspace: workspaceContent });
              }
            } catch (err) {}
          })();
        }, 350));
      }
    } catch (err) { }
  });

  // Keep sidecar files in sync when files are renamed or deleted
  context.subscriptions.push(vscode.workspace.onDidRenameFiles(async ev => {
    try {
      for (const r of ev.files) {
        const oldFs = r.oldUri.fsPath;
        const newFs = r.newUri.fsPath;
        const oldSide = sidecarPathForFile(oldFs);
        const newSide = sidecarPathForFile(newFs);
        if (oldSide && fs.existsSync(oldSide)) {
          try {
            const newDir = path.dirname(newSide!);
            fs.mkdirSync(newDir, { recursive: true });
            fs.copyFileSync(oldSide, newSide!);
            try { fs.unlinkSync(oldSide); removeSidecarDirIfEmpty(oldSide); } catch {}
          } catch (e) { /* ignore */ }
        }
      }
    } catch (e) { }
  }));

  context.subscriptions.push(vscode.workspace.onDidDeleteFiles(async ev => {
    try {
      for (const u of ev.files) {
        const fsPath = u.fsPath;
        const sc = sidecarPathForFile(fsPath);
        if (sc && fs.existsSync(sc)) {
          try { fs.unlinkSync(sc); removeSidecarDirIfEmpty(sc); } catch {}
        }
      }
    } catch (e) { }
  }));
  vscode.workspace.onDidSaveTextDocument(doc => {
    if (doc === vscode.window.activeTextEditor?.document) {
      updateP5Context(vscode.window.activeTextEditor);
    }
  });
  // Lint when a document is opened/closed
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => lintSemicolons(doc))
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument(doc => {
      semicolonDiagnostics.delete(doc.uri);
      // If the closed document is the one that opened the blocklyPanel, close the panel
      // If a blockly panel was opened for this document, close it
      const panel = blocklyPanelForDocument.get(doc.uri.toString());
      if (panel) {
        panel.dispose();
      }
    })
  );

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

    // Capture and clear the pending reason (typing/save/command)
    const reason = _pendingReloadReason;
    _pendingReloadReason = undefined;

    let code = document.getText();
    // If input() is used outside top-of-sketch, block and show friendly error
    try {
      if (hasNonTopInputUsage(code)) {
        panel.webview.html = await createHtml('', panel, context.extensionPath);
        const friendly = 'input() can only be used at the top of the sketch';
        setTimeout(() => { panel.webview.postMessage({ type: 'showError', message: friendly }); }, 150);
        const time = getTime();
        outputChannel.appendLine(`${time} [‼️RUNTIME ERROR in ${fileName}] ${friendly}`);
        (panel as any)._lastRuntimeError = `${time} [‼️RUNTIME ERROR in ${fileName}] ${friendly}`;
        return;
      }
    } catch {}
    // --- Preprocess top-level inputs before any wrapping or syntax checks on auto updates ---
    try {
      const key = document.fileName;
      const inputs = detectTopLevelInputs(code);
      if (inputs.length > 0) {
        if (reason === 'save' || reason === 'command') {
          // Always show overlay on save/command; prefill with cache if available
          let itemsToShow = inputs;
          if (hasCachedInputsForKey(key, inputs)) {
            const cached = _topInputCache.get(key);
            if (cached) {
              itemsToShow = inputs.map((it, i) => ({
                varName: it.varName,
                label: it.label,
                defaultValue: typeof cached.values[i] !== 'undefined' ? cached.values[i] : it.defaultValue
              }));
            }
          }
          panel.webview.html = await createHtml('', panel, context.extensionPath);
          setTimeout(() => { panel.webview.postMessage({ type: 'showTopInputs', items: itemsToShow }); }, 150);
          return;
        } else if (hasCachedInputsForKey(key, inputs)) {
          // typing: use cache silently
          _allowInteractiveTopInputs = false;
          try {
            code = await preprocessTopLevelInputs(code, { key, interactive: false });
          } finally {
            _allowInteractiveTopInputs = true;
          }
        } else {
          // No cached answers on typing auto-update: block and show overlay below
        }
      }
    } catch {}
    let syntaxErrorMsg: string | null = null;
    let hadSyntaxError = false;
    try {
      // --- Check for reserved global conflicts before syntax check ---
      const { globals, conflicts } = extractGlobalVariablesWithConflicts(code);
      if (conflicts.length > 0) {
        syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${fileName}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
        syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
        panel.webview.html = await createHtml('', panel, context.extensionPath);
        hadSyntaxError = true;
        throw new Error(syntaxErrorMsg);
      }

      // --- Check for syntax/reference errors BEFORE wrapping in setup ---
      new Function(code); // syntax/reference check

      // Only wrap if no errors
      const hasSetup = /\bfunction\s+setup\s*\(/.test(code);
      const hasDraw = /\bfunction\s+draw\s*\(/.test(code);

      if (!hasSetup && !hasDraw) {
        code = `function setup() {\n${code}\n}`;
      }
      // Block sketch when configured and warnings exist; otherwise run as usual
      const blockOnWarning_UD = vscode.workspace.getConfiguration('liveP5').get<boolean>('BlockSketchOnWarning', true);
      const warn_UD = hasSemicolonWarnings(document);
      if (blockOnWarning_UD && warn_UD.has) {
        panel.webview.html = await createHtml('', panel, context.extensionPath);
        logSemicolonWarningsForDocument(document);
        return;
      } else {
        // Before reloading HTML, if inputs exist but are unresolved, block and ask user to Reload
        const docKey = (panel && (panel as any)._sketchFilePath) ? String((panel as any)._sketchFilePath) : document.fileName;
        const unresolved = detectTopLevelInputs(document.getText());
        if (unresolved.length > 0 && !hasCachedInputsForKey(docKey, unresolved)) {
          panel.webview.html = await createHtml('', panel, context.extensionPath);
          setTimeout(() => { panel.webview.postMessage({ type: 'showTopInputs', items: unresolved }); }, 150);
          return;
        }
        // Always reload HTML for every code update to reset JS environment
        const key = (panel && (panel as any)._sketchFilePath) ? String((panel as any)._sketchFilePath) : '';
        const inputs = detectTopLevelInputs(code);
        if (inputs.length > 0 && !hasCachedInputsForKey(key, inputs)) {
          // Do not run sketch with unresolved inputs on auto updates. Show input UI and return.
          panel.webview.html = await createHtml('', panel, context.extensionPath);
          setTimeout(() => {
            panel.webview.postMessage({ type: 'showTopInputs', items: inputs });
          }, 150);
          return;
        }
        _allowInteractiveTopInputs = false; // suppress prompts, use cache
        try {
          panel.webview.html = await createHtml(code, panel, context.extensionPath);
        } finally {
          _allowInteractiveTopInputs = true;
        }
        // After HTML is set, send global variables
        const { globals: filteredGlobals } = extractGlobalVariablesWithConflicts(code);
        // --- PATCH: Use .type instead of typeof .value ---
        let filtered = filteredGlobals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
        // Apply @hide directive filtering based on original document text
        const hiddenSet = getHiddenGlobalsByDirective(document.getText());
        if (hiddenSet.size > 0) {
          filtered = filtered.filter(g => !hiddenSet.has(g.name));
        }
        setTimeout(() => {
          // compute readOnly based on the original document text (before we may wrap)
          const readOnly = hasOnlySetup(document.getText());
          panel.webview.postMessage({ type: 'setGlobalVars', variables: filtered, readOnly });
        }, 200);
      }
    } catch (err: any) {
      if (!syntaxErrorMsg) {
        syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${path.basename(document.fileName)}] ${err.message}`;
        syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
      }
      panel.webview.html = await createHtml('', panel, context.extensionPath);
      hadSyntaxError = true;
    }

    // Always show syntax errors in overlay
    if (syntaxErrorMsg) {
      ignoreLogs = true;
      // Fix [object Arguments] for overlay as well
      const overlayMsg = stripLeadingTimestamp(syntaxErrorMsg).replace(/\[object Arguments\]/gi, "no argument(s) ");
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

    // If requested, log semicolon warnings when the panel reloads (typing/save debounce path)
    if (forceLog) {
      try { logSemicolonWarningsForDocument(document); } catch {}
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
        if ( e.document.uri.toString() === docUri) {
          _pendingReloadReason = 'typing';
          debounceDocumentUpdate(e.document, true);
        }
      });
    }
    if (reloadOnSave) {
      saveListener = vscode.workspace.onDidSaveTextDocument(doc => {
        if (doc.uri.toString() === docUri) {
          _pendingReloadReason = 'save';
          debounceDocumentUpdate(doc, true);
        }
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
        let _inputsNeeded: TopInputItem[] = [];
        // --- Determine top-level inputs BEFORE syntax check/wrapping ---
        try {
          const inputs = detectTopLevelInputs(codeToInject);
          if (inputs.length > 0) {
            _inputsNeeded = inputs;
            codeToInject = '';
          }
        } catch {}
        try {
          // Friendly error for input() used outside top-of-sketch
          if (hasNonTopInputUsage(codeToInject)) {
            syntaxErrorMsg = `${getTime()} [‼️RUNTIME ERROR in ${path.basename(editor.document.fileName)}] input can only be used at the top`;
            codeToInject = '';
            throw new Error('input can only be used at the top');
          }
          // --- Check for reserved global conflicts before syntax check ---
          const { globals, conflicts } = extractGlobalVariablesWithConflicts(codeToInject);
          if (conflicts.length > 0) {
            syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${path.basename(editor.document.fileName)}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
            syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
            codeToInject = '';
            throw new Error(syntaxErrorMsg);
          }
          // --- Check for syntax/reference errors BEFORE wrapping in setup ---
          new Function(codeToInject); // syntax/reference check

          // Only wrap if no errors
          codeToInject = wrapInSetupIfNeeded(codeToInject);
        } catch (err: any) {
          if (!syntaxErrorMsg) {
            syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${path.basename(editor.document.fileName)}] ${err.message}`;
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
        // Ensure the originating editor has focus so the new group we create is
        // positioned relative to it.
        const originalColumn = typeof editor.viewColumn === 'number' ? (editor.viewColumn as number) : undefined;
        try {
          await vscode.window.showTextDocument(editor.document, editor.viewColumn || vscode.ViewColumn.One, false);
        } catch (e) { /* ignore */ }

        // Explicitly create a new editor group to the right. Prefer the
        // dedicated command, fall back to split editor if it's not available.
        try {
          await vscode.commands.executeCommand('workbench.action.newGroupRight');
        } catch (e) {
          try {
            await vscode.commands.executeCommand('workbench.action.splitEditorRight');
          } catch (e) { /* ignore */ }
        }
        // Give VS Code a moment to create and focus the new group, then ensure
        // focus is in the right-hand group before creating the webview. This
        // helps avoid the panel opening in the wrong group when other webviews
        // are present in the workspace (observed behavior on some layouts).
        try {
          await vscode.commands.executeCommand('workbench.action.focusRightGroup');
          // Small delay to allow the focus change to settle
          await new Promise(resolve => setTimeout(resolve, 120));
        } catch (e) { /* ignore */ }

        // Compute target column: prefer a numeric column to ensure it opens to the right
        // of the originating editor. If we have the original column, use original+1.
        let targetColumn: vscode.ViewColumn = vscode.ViewColumn.Beside;
        try {
          if (typeof originalColumn === 'number') {
            const numeric = originalColumn + 1;
            const capped = Math.min(Math.max(1, numeric), 9);
            targetColumn = capped as vscode.ViewColumn;
          }
        } catch (e) { /* ignore and use Beside */ }

        panel = vscode.window.createWebviewPanel(
          'extension.live-p5',
          'LIVE: ' + path.basename(editor.document.fileName),
          targetColumn,
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
            // Sanitize p5 guidance line from logs
            const toStr = (v: any) => typeof v === 'string' ? v : (v && v.toString ? v.toString() : String(v));
            const raw = Array.isArray(msg.message) ? msg.message.map(toStr).join(' ') : toStr(msg.message);
            // Remove any lines that start with the p5 "For more details" guidance
            let sanitized = raw
              .split(/\r?\n/)
              .filter(line => !/^\s*For more details, see:\s*/i.test(line))
              .join('\n')
              .trim();
            // Rewrite p5 guidance to include draw() for any function
            if (sanitized.includes("Did you just try to use p5.js's") &&
                sanitized.includes("into your sketch's setup() function")) {
              sanitized = sanitized.replace(/into your sketch's setup\(\) function/gi,
                "into your sketch's setup() or draw() function");
            }
            if (sanitized.length === 0) return; // If nothing left after filtering, skip logging
            outputChannel.appendLine(`${getTime()} [💭LOG]: ${sanitized}`);
            // outputChannel.show(true); // Do not focus on every log
          } else if (msg.type === 'showError') {
            // Always prefix with timestamp and [RUNTIME ERROR] if not present
            let message = msg.message;
            if (typeof message === "string") {
              if (!message.startsWith("[‼️RUNTIME ERROR]")) {
                message = `[‼️RUNTIME ERROR] ${message}`;
              }
              // Add timestamp if not present
              const time = getTime();
              if (!/^\d{2}:\d{2}:\d{2}/.test(message)) {
                message = `${time} ${message}`;
              }
              // Format syntax error messages if present
              if (message.includes("[‼️SYNTAX ERROR")) {
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
    } else if (msg.type === 'submitTopInputs') {
            // Receive values from webview, cache them, preprocess and run the sketch
            try {
              const rawCode = editor.document.getText();
              const key = editor.document.fileName;
              const items = detectTopLevelInputs(rawCode);
              if (!Array.isArray(items) || items.length === 0) {
                panel.webview.postMessage({ type: 'hideTopInputs' });
                return;
              }
              const incoming: Record<string, any> = {};
              if (Array.isArray(msg.values)) {
                for (const e of msg.values) {
                  if (e && typeof e.name === 'string') incoming[e.name] = e.value;
                }
              }
              const values: any[] = items.map(it => {
                const v = incoming[it.varName];
                if (typeof v === 'boolean') return v;
                if (typeof v === 'string') {
                  const s = v.trim();
                  const low = s.toLowerCase();
                  if (low === 'true' || low === 'false') return low === 'true';
                  const num = Number(s);
                  if (!Number.isNaN(num) && s !== '') return num;
                  return v;
                }
                if (typeof v === 'number') return v;
                return v;
              });
              _topInputCache.set(key, { items: items.map(i => ({ varName: i.varName, label: i.label })), values });

              // Preprocess non-interactively using the cache
              _allowInteractiveTopInputs = false;
              let pre = rawCode;
              try {
                pre = await preprocessTopLevelInputs(rawCode, { key, interactive: false });
              } finally {
                _allowInteractiveTopInputs = true;
              }
              // Syntax checks and run
              let code = wrapInSetupIfNeeded(pre);
              const globals = extractGlobalVariables(code);
              let rewrittenCode = rewriteUserCodeWithWindowGlobals(code, globals);
              // Reload and then send globals
              panel.webview.postMessage({ type: 'hideTopInputs' });
              const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
              if (!hasDraw) {
                panel.webview.html = await createHtml(code, panel, context.extensionPath);
                setTimeout(() => {
                  const { globals } = extractGlobalVariablesWithConflicts(code);
                  let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                  const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                  if (hiddenSet.size > 0) {
                    filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                  }
                  const readOnly = hasOnlySetup(editor.document.getText());
                  panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                }, 200);
              } else {
                panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
                setTimeout(() => {
                  const { globals } = extractGlobalVariablesWithConflicts(code);
                  let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                  const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                  if (hiddenSet.size > 0) {
                    filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                  }
                  const readOnly = hasOnlySetup(editor.document.getText());
                  panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                }, 200);
              }
            } catch (e) {
              panel.webview.postMessage({ type: 'showError', message: 'Failed to apply input values: ' + e });
            }
          } else if (msg.type === 'reload-button-clicked') {
            // Enforce reserved-name conflicts on reload as well (consistent with first open)
            const docUri = editor.document.uri.toString();
            const fileName = path.basename(editor.document.fileName);
            const rawCode = editor.document.getText();
            // Friendly error for input misuse
            if (hasNonTopInputUsage(rawCode)) {
              panel.webview.html = await createHtml('', panel, context.extensionPath);
              setTimeout(() => {
                panel.webview.postMessage({ type: 'showError', message: 'input can only be used at the top' });
              }, 150);
              const outputChannel = getOrCreateOutputChannel(docUri, fileName);
              outputChannel.appendLine(`${getTime()} [‼️RUNTIME ERROR in ${fileName}] input can only be used at the top`);
              return;
            }
            // Log semicolon warnings on explicit reload action
            logSemicolonWarningsForDocument(editor.document);
            // Optionally block sketch on warning
            {
              const blockOnWarning = vscode.workspace.getConfiguration('liveP5').get<boolean>('BlockSketchOnWarning', true);
              const warn = hasSemicolonWarnings(editor.document);
              if (blockOnWarning && warn.has) {
                panel.webview.html = await createHtml('', panel, context.extensionPath);
                return;
              }
            }
            const { conflicts } = extractGlobalVariablesWithConflicts(rawCode);
            if (conflicts.length > 0) {
              const outputChannel = getOrCreateOutputChannel(docUri, fileName);
              let syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${fileName}] Reserved variable name(s) used: ${conflicts.join(', ')}`;
              syntaxErrorMsg = formatSyntaxErrorMsg(syntaxErrorMsg);
              // Replace HTML with empty sketch so nothing runs, then show overlay
              panel.webview.html = await createHtml('', panel, context.extensionPath);
              setTimeout(() => {
                panel.webview.postMessage({ type: 'syntaxError', message: stripLeadingTimestamp(syntaxErrorMsg) });
              }, 150);
              outputChannel.appendLine(syntaxErrorMsg);
              (panel as any)._lastSyntaxError = syntaxErrorMsg;
              (panel as any)._lastRuntimeError = null;
              return;
            }
            // Handle top-of-file input() placeholders: on webview Reload use cached values silently; if no cache, show overlay
            const inputsBefore = detectTopLevelInputs(rawCode);
            if (inputsBefore.length > 0) {
              const key = editor.document.fileName;
              if (hasCachedInputsForKey(key, inputsBefore)) {
                _allowInteractiveTopInputs = false;
                const preprocessed = await preprocessTopLevelInputs(rawCode, { key, interactive: false });
                _allowInteractiveTopInputs = true;
                let code = wrapInSetupIfNeeded(preprocessed);
                const globals = extractGlobalVariables(code);
                let rewrittenCode = rewriteUserCodeWithWindowGlobals(code, globals);
                const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
                if (!hasDraw) {
                  panel.webview.html = await createHtml(code, panel, context.extensionPath);
                  setTimeout(() => {
                    const { globals } = extractGlobalVariablesWithConflicts(code);
                    let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                    const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                    if (hiddenSet.size > 0) {
                      filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                    }
                    const readOnly = hasOnlySetup(editor.document.getText());
                    panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                  }, 200);
                } else {
                  panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
                  setTimeout(() => {
                    const { globals } = extractGlobalVariablesWithConflicts(code);
                    let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                    const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                    if (hiddenSet.size > 0) {
                      filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                    }
                    const readOnly = hasOnlySetup(editor.document.getText());
                    panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
                  }, 200);
                }
                return;
              } else {
                // No cache: show overlay (prefill with defaults)
                panel.webview.html = await createHtml('', panel, context.extensionPath);
                setTimeout(() => {
                  panel.webview.postMessage({ type: 'showTopInputs', items: inputsBefore });
                }, 150);
                return;
              }
            }
            // No inputs: just run normally
            let code = wrapInSetupIfNeeded(rawCode);
            const globals = extractGlobalVariables(code);
            let rewrittenCode = rewriteUserCodeWithWindowGlobals(code, globals);
            if (msg.preserveGlobals && globals.length > 0) {
              globals.forEach(g => {
                rewrittenCode = rewrittenCode.replace(new RegExp('^\\s*var\\s+' + g.name + '(\\s*=.*)?;?\\s*$', 'gm'), '');
                rewrittenCode = rewrittenCode.replace(new RegExp('^\\s*window\\.' + g.name + '\\s*=\\s*' + g.name + ';?\\s*$', 'gm'), '');
              });
            }
            const hasDraw = /\bfunction\s+draw\s*\(/.test(code);
            if (!hasDraw) {
              panel.webview.html = await createHtml(code, panel, context.extensionPath);
              setTimeout(() => {
                const { globals } = extractGlobalVariablesWithConflicts(code);
                let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                if (hiddenSet.size > 0) {
                  filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                }
                const readOnly = hasOnlySetup(editor.document.getText());
                panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
              }, 200);
            } else {
              // For sketches with draw(), we want the reload button to reset globals to their original initial values.
              // Do NOT ask the webview to preserve the current runtime globals; perform a normal reload and then
              // send the original initial values (from source) so the drawer is updated/reset.
              panel.webview.postMessage({ type: 'reload', code: rewrittenCode, preserveGlobals: false });
              setTimeout(() => {
                const { globals } = extractGlobalVariablesWithConflicts(code);
                let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
                const hiddenSet = getHiddenGlobalsByDirective(editor.document.getText());
                if (hiddenSet.size > 0) {
                  filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
                }
                const readOnly = hasOnlySetup(editor.document.getText());
                panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
              }, 200);
            }
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
              // Use the provided fileName as default if available
              let defaultFileName = msg.fileName || 'sketch.png';
              // Prompt user for file path
              const uri = await vscode.window.showSaveDialog({
                filters: { 'PNG Image': ['png'] },
                saveLabel: 'Save Canvas Image',
                defaultUri: vscode.Uri.file(path.join(
                  vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
                  defaultFileName
                ))
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
                  // Open the folder and highlight the file
                  vscode.commands.executeCommand('revealFileInOS', uri);
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

        // If inputs are present, always show UI (prefill from cache if available) and stop
        if (_inputsNeeded && _inputsNeeded.length > 0) {
          const key = editor.document.fileName;
          let itemsToShow = _inputsNeeded;
          if (hasCachedInputsForKey(key, _inputsNeeded)) {
            const cached = _topInputCache.get(key);
            if (cached) {
              itemsToShow = _inputsNeeded.map((it, i) => ({
                varName: it.varName,
                label: it.label,
                defaultValue: typeof cached.values[i] !== 'undefined' ? cached.values[i] : it.defaultValue
              }));
            }
          }
          panel.webview.html = await createHtml('', panel, context.extensionPath);
          setTimeout(() => {
            panel.webview.postMessage({ type: 'showTopInputs', items: itemsToShow });
          }, 150);
          return;
        }

        // Only set HTML on first open, but optionally block on warnings
        const blockOnWarning_IO = vscode.workspace.getConfiguration('liveP5').get<boolean>('BlockSketchOnWarning', true);
        const warn_IO = hasSemicolonWarnings(editor.document);
        if (blockOnWarning_IO && warn_IO.has) {
          panel.webview.html = await createHtml('', panel, context.extensionPath);
          logSemicolonWarningsForDocument(editor.document);
        } else {
          panel.webview.html = await createHtml(codeToInject, panel, context.extensionPath);
          // Log semicolon warnings when running the sketch (initial open)
          logSemicolonWarningsForDocument(editor.document);
        }
        // Send global variables immediately after setting HTML
        const { globals } = extractGlobalVariablesWithConflicts(codeToInject);
        // --- PATCH: Use .type instead of typeof .value ---
        let filteredGlobals = globals.filter(g => ['number', 'string', 'boolean'].includes(g.type));
        // Apply @hide directive filtering based on original editor code
        {
          const hiddenSet = getHiddenGlobalsByDirective(code);
          if (hiddenSet.size > 0) {
            filteredGlobals = filteredGlobals.filter(g => !hiddenSet.has(g.name));
          }
        }
        setTimeout(() => {
          const readOnly = hasOnlySetup(code); // use original editor code to decide
          panel.webview.postMessage({ type: 'setGlobalVars', variables: filteredGlobals, readOnly });
        }, 200);
        if (syntaxErrorMsg) {
          setTimeout(() => {
            panel.webview.postMessage({ type: 'syntaxError', message: stripLeadingTimestamp(syntaxErrorMsg) });
          }, 150);
          const outputChannel = getOrCreateOutputChannel(docUri, path.basename(editor.document.fileName));
          outputChannel.appendLine(syntaxErrorMsg);
        }
      } else {
        panel.reveal(panel.viewColumn, true);
        setTimeout(() => {
          let codeToSend = editor.document.getText();
          // --- Check for syntax/reference errors BEFORE wrapping in setup ---
          try {
            new Function(codeToSend);
            codeToSend = wrapInSetupIfNeeded(codeToSend);
            // Optionally block on semicolon warnings
            const blockOnWarning_RO = vscode.workspace.getConfiguration('liveP5').get<boolean>('BlockSketchOnWarning', true);
            const warn_RO = hasSemicolonWarnings(editor.document);
            if (blockOnWarning_RO && warn_RO.has) {
              (async () => {
                panel.webview.html = await createHtml('', panel, context.extensionPath);
                logSemicolonWarningsForDocument(editor.document);
              })();
            } else {
              panel.webview.postMessage({ type: 'reload', code: codeToSend });
              // Log semicolon warnings on explicit open -> reload path
              logSemicolonWarningsForDocument(editor.document);
            }
          } catch (err: any) {
            // If error, send empty code and show error
            panel.webview.postMessage({ type: 'reload', code: '' });
            const syntaxErrorMsg = `${getTime()} [‼️SYNTAX ERROR in ${path.basename(editor.document.fileName)}] ${err.message}`;
            panel.webview.postMessage({ type: 'syntaxError', message: stripLeadingTimestamp(formatSyntaxErrorMsg(syntaxErrorMsg)) });
            const outputChannel = getOrCreateOutputChannel(docUri, path.basename(editor.document.fileName));
            outputChannel.appendLine(formatSyntaxErrorMsg(syntaxErrorMsg));
          }
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
      if (!editor) {
        // Try to reload the currently active webview panel's sketch if no editor is focused
        if (activeP5Panel) {
          // Find the document URI for the active panel
          const docUri = [...webviewPanelMap.entries()].find(([_, panel]) => panel === activeP5Panel)?.[0];
          if (docUri) {
            const doc = vscode.workspace.textDocuments.find(d => d.uri.toString() === docUri);
            if (doc) {
              // Log semicolon warnings on explicit reload command
              logSemicolonWarningsForDocument(doc);
              _pendingReloadReason = 'command';
              debounceDocumentUpdate(doc, false);
            }
          }
        }
        return;
      }
      // Log semicolon warnings on explicit reload command
      logSemicolonWarningsForDocument(editor.document);
      _pendingReloadReason = 'command';
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
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select folder for new P5 project'
          });
          if (!folderUris || folderUris.length === 0) return;
          selectedFolderUri = folderUris[0];
          workspaceFolder = { uri: selectedFolderUri, name: '', index: 0 };
        }
        vscode.window.showInformationMessage('Setting up new P5 project...');
        // creates a jsconfig that tells vscode where to find the types file
        const now = new Date();
        const jsconfig = {
          createdAt: toLocalISOString(now),
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

  // Also create/overwrite a .p5 marker file at the project root
        const p5MarkerPath = path.join(workspaceFolder.uri.fsPath, ".p5");
        try {
          // Read extension version from the extension's package.json
          const pkgPath = path.join(context.extensionPath, "package.json");
          let version = "unknown";
          try {
            const pkgRaw = fs.readFileSync(pkgPath, "utf8");
            const pkgJson = JSON.parse(pkgRaw);
            if (pkgJson && typeof pkgJson.version === "string") {
              version = pkgJson.version;
            }
          } catch {
            // ignore read/parse errors and keep version as 'unknown'
          }
          const now = new Date();
          const marker = {
            version,
             createdAt: toLocalISOString(now),
          };
          fs.writeFileSync(p5MarkerPath, JSON.stringify(marker, null, 2) + "\n");
          // Try to hide the .p5 file on Windows
          hideFileIfSupported(p5MarkerPath);
        } catch (err) {
          console.warn("Failed to write .p5 marker file:", err);
        }
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

    // Update overlay font size if the editor font size changes
    if (e.affectsConfiguration('editor.fontSize')) {
      const newSize = vscode.workspace.getConfiguration('editor').get<number>('fontSize', 14);
      for (const [, panel] of webviewPanelMap.entries()) {
        panel.webview.postMessage({ type: 'updateOverlayFontSize', value: newSize });
      }
    }

    // Update Blockly theme when setting changes
    if (e.affectsConfiguration('liveP5.blocklyTheme')) {
      try {
        const cfg = vscode.workspace.getConfiguration('liveP5');
        const t = cfg.get<string>('blocklyTheme', 'dark');
        let resolved = t;
        if (t === 'auto') {
          resolved = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light';
        }
        for (const [, panel] of blocklyPanelForDocument.entries()) {
          try { panel.webview.postMessage({ type: 'setBlocklyTheme', theme: resolved }); } catch (e) { }
        }
      } catch (e) { }
    }
  });

  // If the user switches the VS Code color theme and the blocklyTheme config
  // is 'auto', update Blockly panels to match.
  context.subscriptions.push(vscode.window.onDidChangeActiveColorTheme(theme => {
    try {
      const cfg = vscode.workspace.getConfiguration('liveP5');
      const t = cfg.get<string>('blocklyTheme', 'dark');
      if (t === 'auto') {
  const resolved = theme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light';
        for (const [, panel] of blocklyPanelForDocument.entries()) {
          try { panel.webview.postMessage({ type: 'setBlocklyTheme', theme: resolved }); } catch (e) { }
        }
      }
    } catch (e) { }
  }));

  vscode.workspace.onDidCloseTextDocument(doc => {
    const docUri = doc.uri.toString();
    const panel = webviewPanelMap.get(docUri);
    if (panel) {
      panel.dispose();
    }
  });

  // --- On activation: if .p5 exists, refresh jsconfig.json (delete and recreate) ---
  (async function refreshJsconfigIfMarkerPresent() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;
    try {
      const markerPath = path.join(workspaceFolder.uri.fsPath, ".p5");
      if (fs.existsSync(markerPath)) {
        // Try to hide the marker file on Windows if it's visible
        hideFileIfSupported(markerPath);
        const jsconfigPath = path.join(workspaceFolder.uri.fsPath, "jsconfig.json");
        // Delete existing jsconfig.json if present
        if (fs.existsSync(jsconfigPath)) {
          try {
            fs.unlinkSync(jsconfigPath);
            //vscode.window.showInformationMessage('LIVE P5: Removed existing jsconfig.json');
          } catch {
            // ignore
          }
        }
        // Recreate jsconfig.json with current settings
        const now2 = new Date();
        const jsconfig = {
           createdAt: toLocalISOString(now2),
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
        writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));
      //  vscode.window.showInformationMessage('LIVE P5: Created fresh jsconfig.json');
      }
    } catch (e) {
      console.warn('Failed to refresh jsconfig.json on activation:', e);
    }
  })();

  // Helper to hide a file on Windows (attrib +h). No-op on other platforms.
  function hideFileIfSupported(filePath: string) {
    try {
      if (process.platform === 'win32') {
        exec(`attrib +h "${filePath}"`);
      }
    } catch {
      // ignore
    }
  }

  // --- Show notification to setup P5 project if not already set up ---
  (async function showSetupNotificationIfNeeded() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    // NEW: read setting to allow disabling the notification
    const config = vscode.workspace.getConfiguration('liveP5');
    const showSetupNotification = config.get<boolean>('showSetupNotification', true);
    if (!showSetupNotification) return;

    const p5MarkerPath = path.join(workspaceFolder.uri.fsPath, ".p5");
    if (!fs.existsSync(p5MarkerPath)) {
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

  // --- Duplicate file command for explorer context menu ---
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.duplicateFile', async (fileUri: vscode.Uri) => {
      try {
        // If not invoked from context menu, prompt for file
        if (!fileUri) {
          const picked = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select file to duplicate'
          });
          if (!picked || picked.length === 0) return;
          fileUri = picked[0];
        }
        const oldPath = fileUri.fsPath;
        const dir = path.dirname(oldPath);
        const base = path.basename(oldPath);
        const ext = path.extname(base);
        const nameNoExt = base.slice(0, base.length - ext.length);

        // If filename ends with a number, increment it
        let match = nameNoExt.match(/^(.*?)(\d+)$/);
        let newBase: string;
        if (match) {
          const prefix = match[1];
          const num = parseInt(match[2], 10);
          let nextNum = num + 1;
          let candidate = `${prefix}${nextNum}${ext}`;
          // Find next available number
          while (fs.existsSync(path.join(dir, candidate))) {
            nextNum++;
            candidate = `${prefix}${nextNum}${ext}`;
          }
          newBase = candidate;
        } else {
          // Fallback: filename, filename-2, filename-3, etc.
          let candidate = `${nameNoExt}${ext}`;
          let counter = 1;
          while (fs.existsSync(path.join(dir, candidate))) {
            candidate = `${nameNoExt}-${counter}${ext}`;
            counter++;
          }
          newBase = candidate;
        }

        const newName = await vscode.window.showInputBox({
          prompt: 'Duplicate file as...',
          value: newBase,
          validateInput: (val) => {
            if (!val || val.trim() === '') return 'File name required';
            if (fs.existsSync(path.join(dir, val))) return 'File already exists';
            return null;
          }
        });
        if (!newName) return;
        const newPath = path.join(dir, newName);
        await vscode.workspace.fs.copy(fileUri, vscode.Uri.file(newPath));
        // If a sidecar exists for the source file, copy it for the duplicate
        try {
          const srcSide = sidecarPathForFile(fileUri.fsPath);
          if (srcSide && fs.existsSync(srcSide)) {
            const destSide = sidecarPathForFile(newPath);
            if (destSide) {
              fs.mkdirSync(path.dirname(destSide), { recursive: true });
              fs.copyFileSync(srcSide, destSide);
            }
          }
        } catch (e) { /* ignore */ }
        // Optionally open the new file
        const doc = await vscode.workspace.openTextDocument(newPath);
        await vscode.window.showTextDocument(doc, { preview: false });
      } catch (e: any) {
        vscode.window.showErrorMessage('Failed to duplicate file: ' + (e.message || e));
      }
    })
  );

  // Decouple Blockly: remove the sidecar for a file after user confirmation
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.decouple-blockly', async (fileUri: vscode.Uri) => {
      try {
        // If not invoked from context menu, prompt for file
        if (!fileUri) {
          const picked = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select file to decouple from Blockly'
          });
          if (!picked || picked.length === 0) return;
          fileUri = picked[0];
        }
        const side = sidecarPathForFile(fileUri.fsPath);
        if (!side || !fs.existsSync(side)) {
          vscode.window.showInformationMessage('No Blockly workspace sidecar found for this file.');
          return;
        }
        const confirm = await vscode.window.showWarningMessage(
          `Delete Blockly workspace sidecar for '${path.basename(fileUri.fsPath)}'?`,
          { modal: true },
          'Delete'
        );
        if (confirm === 'Delete') {
          try {
            fs.unlinkSync(side);
            try { removeSidecarDirIfEmpty(side); } catch {}
            vscode.window.showInformationMessage('Blockly workspace decoupled (sidecar deleted).');
          } catch (e: any) {
            vscode.window.showErrorMessage('Failed to delete sidecar: ' + (e.message || e));
          }
        }
      } catch (e: any) {
        vscode.window.showErrorMessage('Failed to decouple Blockly: ' + (e.message || e));
      }
    })
  );

  // Best-effort: when files are created via external copy/paste operations, try to
  // detect if they are duplicates of an existing file and copy its sidecar.
  // We do this by computing a content hash for the created file and comparing it
  // with candidate workspace files (limited to common script extensions) to find
  // an exact match. If found, copy the matching file's sidecar.
  context.subscriptions.push(vscode.workspace.onDidCreateFiles(async ev => {
    try {
      for (const created of ev.files) {
        const createdFs = created.fsPath;
        let createdBuffer: Buffer | null = null;
        try { createdBuffer = fs.readFileSync(createdFs); } catch { createdBuffer = null; }
        if (!createdBuffer) continue;
        const hash = crypto.createHash('sha1').update(createdBuffer).digest('hex');
        // Search workspace for candidate script files (js/ts/jsx/tsx)
        const patterns = ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'];
        let candidates: vscode.Uri[] = [];
        for (const p of patterns) {
          try {
            const found = await vscode.workspace.findFiles(p, '**/.blockly/**', 200);
            candidates = candidates.concat(found);
          } catch { }
        }
        // Compare hashes with candidates
        for (const cand of candidates) {
          try {
            const candFs = cand.fsPath;
            if (candFs === createdFs) continue;
            const candBuffer = fs.readFileSync(candFs);
            const candHash = crypto.createHash('sha1').update(candBuffer).digest('hex');
            if (candHash === hash) {
              const srcSide = sidecarPathForFile(candFs);
              const destSide = sidecarPathForFile(createdFs);
              if (srcSide && fs.existsSync(srcSide) && destSide) {
                try {
                  fs.mkdirSync(path.dirname(destSide), { recursive: true });
                  fs.copyFileSync(srcSide, destSide);
                } catch { }
              }
              break; // done for this created file
            }
          } catch { }
        }
      }
    } catch (e) { }
  }));
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
  const regex = /(\[‼️SYNTAX ERROR in [^\]\s]+)\]([^\n]*?)\s*\((\d+)(?::\d+)?\)\s*$/;
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

// Helper: Remove a leading timestamp like "HH:MM:SS " from a message (for clean overlay text)
function stripLeadingTimestamp(msg: string): string {
  return typeof msg === 'string' ? msg.replace(/^\s*\d{2}:\d{2}:\d{2}\s+/, '') : msg;
}

// Helper to check SingleP5Panel setting
function isSingleP5PanelEnabled() {
  return vscode.workspace.getConfiguration('liveP5').get<boolean>('SingleP5Panel', false);
}

// NEW: helper to detect whether the user's code defines only a single top-level `setup` function
function hasOnlySetup(code: string): boolean {
	// parse AST and check top-level FunctionDeclaration nodes
	try {
		const acorn = require('acorn');
		const ast = recast.parse(code, { parser: { parse: (src: string) => acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script' }) } });
		if (!ast.program || !Array.isArray(ast.program.body)) return false;
		let hasSetup = false;
		for (const node of ast.program.body) {
			if (node.type === 'FunctionDeclaration') {
				if (node.id && node.id.name === 'setup') hasSetup = true;
				else return false; // found another top-level function besides setup
			}
		}
		return hasSetup;
	} catch {
		return false;
	}
}

// Helper: Format a local ISO-like string without timezone offset, e.g. 2025-10-16T14:05:00.000
function toLocalISOString(d: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  const second = pad(d.getSeconds());
  const ms = pad(d.getMilliseconds(), 3);
  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}`;
}

// Detect hidden globals via //@hide or // @hide directives immediately above top-level declarations
function getHiddenGlobalsByDirective(code: string): Set<string> {
  const hidden = new Set<string>();
  try {
    const acorn = require('acorn');
    const ast = acorn.parse(code, { ecmaVersion: 2020, sourceType: 'script', locations: true });
    const lines = code.split(/\r?\n/);
    const isHideComment = (line: string) => /^(\s*\/\/\s*@hide\b|\s*\/\/@hide\b)/i.test(line);

    function collectNamesFromPattern(pattern: any, acc: Set<string>) {
      if (!pattern) return;
      if (pattern.type === 'Identifier') {
        acc.add(pattern.name);
      } else if (pattern.type === 'ObjectPattern') {
        for (const prop of pattern.properties || []) {
          if (prop.type === 'Property') collectNamesFromPattern(prop.value, acc);
          else if (prop.type === 'RestElement') collectNamesFromPattern(prop.argument, acc);
        }
      } else if (pattern.type === 'ArrayPattern') {
        for (const el of pattern.elements || []) {
          if (!el) continue;
          if (el.type === 'RestElement') collectNamesFromPattern(el.argument, acc);
          else collectNamesFromPattern(el, acc);
        }
      } else if (pattern.type === 'RestElement') {
        collectNamesFromPattern(pattern.argument, acc);
      }
    }

    for (const node of (ast as any).body || []) {
      if (node && node.type === 'VariableDeclaration' && node.loc && node.loc.start && typeof node.loc.start.line === 'number') {
        const startLine: number = node.loc.start.line; // 1-based
        const prevIdx = startLine - 2;
        if (prevIdx >= 0) {
          const prevLine = lines[prevIdx];
          if (isHideComment(prevLine)) {
            for (const decl of node.declarations || []) {
              if (decl.id) collectNamesFromPattern(decl.id, hidden);
            }
          }
        }
      }
    }
  } catch {
    // ignore parse errors; no hidden vars
  }
  return hidden;
}

