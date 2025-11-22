import * as vscode from 'vscode';

export type GlobalVar = { name: string; value: any; type: string };

export interface VariablesViewDeps {
  getActiveP5Panel: () => vscode.WebviewPanel | undefined;
  getDocUriForPanel: (panel: vscode.WebviewPanel | undefined) => vscode.Uri | undefined;
  getGlobalsForDoc: (docUri: string) => GlobalVar[];
  getLocalsForDoc: (docUri: string) => GlobalVar[];
  getLocalsHeadingForDoc: (docUri: string) => 'locals' | 'variables';
  getHasDrawForDoc: (docUri: string) => boolean;
  setGlobalValue: (docUri: string, name: string, value: any, opts?: { updatedAt?: number }) => void;
  setLocalValue: (docUri: string, name: string, value: any) => void;
}

let variablesPanelView: vscode.WebviewView | undefined;

export function registerVariablesView(context: vscode.ExtensionContext, deps: VariablesViewDeps) {
  function updateVariablesPanel() {
    if (!variablesPanelView) return;
    try {
      const panel = deps.getActiveP5Panel();
      let globals: GlobalVar[] = [];
      let locals: GlobalVar[] = [];
      let localsHeading: 'locals' | 'variables' = 'locals';
      let hasDraw = false;
      if (panel) {
        const docUri = deps.getDocUriForPanel(panel)?.toString();
        if (docUri) {
          globals = deps.getGlobalsForDoc(docUri) || [];
          locals = deps.getLocalsForDoc(docUri) || [];
          try {
            localsHeading = deps.getLocalsHeadingForDoc(docUri) || 'locals';
          } catch { }
          try {
            hasDraw = !!deps.getHasDrawForDoc(docUri);
          } catch { hasDraw = false; }
        }
      }
      variablesPanelView.webview.postMessage({ type: 'setVarsSplit', globals, locals, localsHeading, hasDraw });
    } catch { }
  }

  const provider: vscode.WebviewViewProvider = {
    resolveWebviewView(webviewView: vscode.WebviewView) {
      variablesPanelView = webviewView;
      webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(context.extensionPath)]
      } as any;
      // Get the configured font size from the extension setting
      webviewView.webview.html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body { margin: 0; font-family: monospace; color: var(--vscode-editor-foreground); background: transparent; font-size: 12px; }
      .wrap { padding: 8px; }
      .muted { opacity: 0.8; }
      h3 { margin: 8px 0 6px 0; color: #307dc1; }
      table { border-collapse: collapse; width: 100%; font-size: 12px; margin-bottom: 10px; table-layout: fixed; }
      th, td { border: 1px solid #8884; padding: 2px 4px; text-align: left; }
      th.name-col, td.name-col { width: 45%; }
      th.value-col, td.value-col { width: 35%; }
      th.type-col, td.type-col { width: 20%; }
      th { background: #2222; color: #307dc1; }
      /* Make inputs fill the table cell (render-only) */
      input[type="number"],
      input[type="text"],
      input[data-type="array"],
      .vscode-theme-input {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        display: block;
        background: var(--vscode-input-background);
        border: 1px solid var(--vscode-input-border, var(--vscode-input-background));
        color: var(--vscode-input-foreground);
        padding: 2px 4px;
        border-radius: 2px;
        font-size: 11px;
      }
      /* Align number spinners with VS Code theme */
      input[type="number"] {
        -moz-appearance: textfield;
        -webkit-appearance: none;
      }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
        display: none;
      }
      input[type="number"]::-moz-number-spin-box,
      input[type="number"]::-moz-number-spin-up,
      input[type="number"]::-moz-number-spin-down {
        -moz-appearance: none;
        margin: 0;
        display: none;
      }
      .number-wrapper {
        position: relative;
        width: 100%;
        display: block;
      }
      .number-wrapper input[type="number"] {
        padding-right: 18px;
      }
      .spin-buttons {
        position: absolute;
        top: 1px;
        bottom: 1px;
        right: 1px;
        width: 14px;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .spin-btn {
        flex: 1;
        border: 1px solid #3c3c3c;
        background: #313131;
        color: #2f78b9;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
      }
      .spin-btn:hover {
        background: #3b3b3b;
      }
      .spin-btn:focus-visible {
        outline: 1px solid var(--vscode-focusBorder);
      }
      .spin-btn::before {
        content: '';
        width: 0;
        height: 0;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
      }
      .spin-btn.spin-up::before {
        border-bottom: 5px solid #2f78b9;
      }
      .spin-btn.spin-down::before {
        border-top: 5px solid #2f78b9;
      }
      input[type="number"]:focus,
      input[type="text"]:focus,
      input[data-type="array"]:focus {
        outline: 1px solid var(--vscode-focusBorder);
        outline-offset: 0;
      }
      .checkbox-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 14px;
        line-height: 0;
        vertical-align: middle;
      }
      .checkbox-wrapper input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        width: 14px;
        height: 14px;
        top: 0;
        left: 0;
        margin: 0;
        cursor: pointer;
      }
      .checkbox-custom {
        width: 14px;
        height: 14px;
        border-radius: 2px;
        border: 1px solid var(--vscode-checkbox-border, var(--vscode-editorWidget-border, #3c3c3c));
        background: var(--vscode-checkbox-background, var(--vscode-editorWidget-background, #1e1e1e));
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        pointer-events: none;
      }
      .checkbox-wrapper input[type="checkbox"]:hover + .checkbox-custom {
        border-color: var(--vscode-checkbox-foreground, #2f78b9);
      }
      .checkbox-wrapper input[type="checkbox"]:focus-visible + .checkbox-custom {
        outline: 1px solid var(--vscode-focusBorder);
        outline-offset: 1px;
      }
      .checkbox-wrapper input[type="checkbox"]:checked + .checkbox-custom {
        background: var(--vscode-checkbox-foreground, #2f78b9);
        border-color: var(--vscode-checkbox-foreground, #2f78b9);
      }
      .checkbox-wrapper input[type="checkbox"]:checked + .checkbox-custom::after {
        content: '';
        width: 4px;
        height: 8px;
        border-right: 2px solid var(--vscode-editor-background, #1e1e1e);
        border-bottom: 2px solid var(--vscode-editor-background, #1e1e1e);
        transform: rotate(45deg);
        margin-bottom: 1px;
      }
      input.error,
        input[data-invalid="true"] {
        border-color: var(--vscode-inputValidation-errorBorder, #f14c4c) !important;
        background-color: var(--vscode-inputValidation-errorBackground, rgba(241,76,76,0.18)) !important;
        box-shadow: 0 0 0 1px var(--vscode-inputValidation-errorBorder, #f14c4c);
      }
</style>
  </head>
  <body>
    <div class="wrap">
      <div id="variables-empty-state" class="muted" style="display:none;">No variables</div>
      <div id="globals-table"></div>
      <div id="locals-table"></div>
    </div>
          <script>
// Acquire VS Code API once and reuse
const vscode = window.acquireVsCodeApi ? acquireVsCodeApi() : null;
const emptyStateEl = document.getElementById('variables-empty-state');
const globalsTableEl = document.getElementById('globals-table');
const localsTableEl = document.getElementById('locals-table');
var _localsHeading = 'locals';
function getColumnLabel(scope) {
  if (_localsHeading === 'variables') return 'Variable(s)';
  return scope === 'globals' ? 'Global variable(s)' : 'Local variable(s)';
}
function cloneForMessage(value) {
  if (Array.isArray(value)) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch {
      try { return value.map(function(item) { return cloneForMessage(item); }); }
      catch {
        try { return Array.from(value); }
        catch { return value; }
      }
    }
  }
  return value;
}
function markArrayInvalid(input) {
  try {
    input.classList.add('error');
    input.setAttribute('data-invalid', 'true');
    input.setAttribute('aria-invalid', 'true');
    if (!input.getAttribute('title')) {
      input.setAttribute('title', 'Enter a valid JSON array.');
    }
    if (typeof input.setCustomValidity === 'function') {
      input.setCustomValidity('Enter a valid JSON array.');
    }
  } catch { }
}
function clearArrayError(input) {
  try {
    input.classList.remove('error');
    input.removeAttribute('data-invalid');
    input.removeAttribute('aria-invalid');
    if (input.getAttribute('title') === 'Enter a valid JSON array.') {
      input.removeAttribute('title');
    }
    if (typeof input.setCustomValidity === 'function') {
      input.setCustomValidity('');
    }
  } catch { }
}
function sendVarUpdate(name, value, scope) {
  var payload = cloneForMessage(value);
  var generatedAt = Date.now();
  var scopeTag = scope === 'locals' ? 'locals' : 'globals';
  if (vscode) {
    vscode.postMessage({ type: 'updateGlobalVar', name: name, value: payload, generatedAt: generatedAt, scope: scopeTag });
  } else if (window.parent) {
    parent.postMessage({ type: 'updateGlobalVar', name: name, value: payload, generatedAt: generatedAt, scope: scopeTag }, '*');
  }
}
function makeInvalidKey(name, scope) {
  return (scope || 'globals') + '::' + name;
}
var _invalidVars = new Set();
var _invalidDrafts = new Map();
function setInvalidFlag(name, scope, isInvalid) {
  var key = makeInvalidKey(name, scope);
  if (isInvalid) _invalidVars.add(key);
  else {
    _invalidVars.delete(key);
    _invalidDrafts.delete(key);
  }
}
function setInvalidDraft(name, scope, value) {
  var key = makeInvalidKey(name, scope);
  if (typeof value === 'string' && value.length > 0) {
    _invalidDrafts.set(key, value);
  } else {
    _invalidDrafts.delete(key);
  }
}
function applyInvalidStates(tableDiv, scope) {
  if (!tableDiv) return;
  var prefix = (scope || 'globals') + '::';
  _invalidVars.forEach(function(key) {
    if (typeof key !== 'string') return;
    if (!key.startsWith(prefix)) return;
    var name = key.slice(prefix.length);
    if (!name) return;
    var input = tableDiv.querySelector('input[data-var="' + name + '"][data-scope="' + scope + '"]');
    if (input && input.getAttribute('data-type') === 'array') {
      var stored = _invalidDrafts.get(key);
      if (typeof stored === 'string') {
        if (input.value !== stored) input.value = stored;
      }
      markArrayInvalid(input);
    }
  });
}
function pruneInvalidForScope(scope, vars) {
  var keep = new Set();
  var prefix = (scope || 'globals') + '::';
  for (var i = 0; i < vars.length; ++i) {
    keep.add(makeInvalidKey(vars[i].name, scope));
  }
  Array.from(_invalidVars).forEach(function(key) {
    if (typeof key !== 'string') return;
    if (!key.startsWith(prefix)) return;
    if (!keep.has(key)) {
      _invalidVars.delete(key);
      _invalidDrafts.delete(key);
    }
  });
}
function toggleEmptyState(show) {
  if (!emptyStateEl) return false;
  if (show) {
    emptyStateEl.style.display = 'block';
    if (globalsTableEl) globalsTableEl.style.display = 'none';
    if (localsTableEl) localsTableEl.style.display = 'none';
    return true;
  }
  emptyStateEl.style.display = 'none';
  if (globalsTableEl) globalsTableEl.style.display = 'block';
  if (localsTableEl) localsTableEl.style.display = 'block';
  return false;
}
// Live-patch support to avoid rebuilding the table on each update
var _rendered = false;
var _globalsIndex = new Map(); // name -> { type }
var _localsIndex = new Map();
// Track whether current sketch has a draw() function so we can allow editing
var _hasDraw = false;
function normalizeForInput(type, v) {
  if (type === 'number') {
    var n = Number(v);
    if (Number.isNaN(n)) return '';
    return n.toString();
  }
  if (type === 'array') {
    // Render arrays without surrounding brackets for compactness
    try {
      if (!Array.isArray(v)) {
        var raw = JSON.stringify(v);
        return raw && raw.length >= 2 && raw[0] === '[' && raw[raw.length - 1] === ']'
          ? raw.slice(1, raw.length - 1)
          : raw;
      }
      var json = JSON.stringify(v);
      return json && json.length >= 2 && json[0] === '[' && json[json.length - 1] === ']'
        ? json.slice(1, json.length - 1)
        : json;
    } catch { return ''; }
  }
  if (type === 'boolean') return !!v;
  return (v === undefined || v === null) ? '' : String(v);
}
// Normalize localized decimal separators before parsing user input.
function parseNumberFieldValue(raw) {
  if (typeof raw !== 'string') {
    return { isValid: false, normalized: '', value: NaN, replaced: false };
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return { isValid: false, normalized: '', value: NaN, replaced: false };
  }
  var normalized = trimmed;
  var replaced = false;
  var commaCount = (normalized.match(/,/g) || []).length;
  var hasDot = normalized.indexOf('.') !== -1;
  if (commaCount === 1 && !hasDot) {
    if (normalized.endsWith(',')) {
      return { isValid: false, normalized: normalized, value: NaN, replaced: false };
    }
    normalized = normalized.replace(',', '.');
    replaced = true;
  }
  var value = Number(normalized);
  if (Number.isNaN(value)) {
    return { isValid: false, normalized: normalized, value: NaN, replaced: replaced };
  }
  return { isValid: true, normalized: normalized, value: value, replaced: replaced };
}
function adjustNumberValue(input, direction) {
  var rawStep = input.getAttribute('step');
  var parsedStep = Number(rawStep);
  var step = !rawStep || rawStep === 'any' || Number.isNaN(parsedStep) ? 1 : parsedStep;
  var parsedCurrent = parseNumberFieldValue(String(input.value || ''));
  var current = parsedCurrent.isValid ? parsedCurrent.value : 0;
  var next = current + direction * step;
  var valueStr = next.toString();
  input.value = valueStr;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  if (typeof input.focus === 'function') {
    try { input.focus({ preventScroll: true }); } catch { }
  }
}
function startSpinHold(input, direction) {
  // Single immediate step
  adjustNumberValue(input, direction);
  // Then continuous steps while holding
  var holdInterval = null;
  var cancel = function() {
    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
    window.removeEventListener('pointerup', cancel, true);
    window.removeEventListener('pointercancel', cancel, true);
    window.removeEventListener('pointerleave', cancel, true);
  };
  holdInterval = setInterval(function() {
    adjustNumberValue(input, direction);
  }, 120);
  window.addEventListener('pointerup', cancel, true);
  window.addEventListener('pointercancel', cancel, true);
  window.addEventListener('pointerleave', cancel, true);
}
function decorateNumberInputs(rootEl) {
  if (!rootEl) return;
  var numberInputs = rootEl.querySelectorAll('input[data-number-field="true"][data-var]:not([data-spin-wrapped="true"])');
  numberInputs.forEach(function(input) {
    // Skip read-only/disabled inputs so spinners only appear for editable ones
    if (input.hasAttribute('readonly') || input.hasAttribute('disabled')) return;
    input.setAttribute('data-spin-wrapped', 'true');
    var wrapper = document.createElement('div');
    wrapper.className = 'number-wrapper';
    var parent = input.parentNode;
    if (!parent) return;
    parent.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    var buttons = document.createElement('div');
    buttons.className = 'spin-buttons';
    var upBtn = document.createElement('button');
    upBtn.type = 'button';
    upBtn.className = 'spin-btn spin-up';
    upBtn.setAttribute('aria-label', 'Increase value');
    upBtn.setAttribute('tabindex', '-1');
    var downBtn = document.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'spin-btn spin-down';
    downBtn.setAttribute('aria-label', 'Decrease value');
    downBtn.setAttribute('tabindex', '-1');
    buttons.appendChild(upBtn);
    buttons.appendChild(downBtn);
    wrapper.appendChild(buttons);
    upBtn.addEventListener('pointerdown', function(evt) {
      evt.preventDefault();
      startSpinHold(input, 1);
    });
    downBtn.addEventListener('pointerdown', function(evt) {
      evt.preventDefault();
      startSpinHold(input, -1);
    });
  });
}
function buildTable(targetId, vars, scope) {
  var tableDiv = document.getElementById(targetId);
  if (!tableDiv) return;
  if (!vars.length) {
    tableDiv.innerHTML = '';
    if (scope === 'globals') _globalsIndex = new Map(); else _localsIndex = new Map();
    return;
  }

  var colLabel = getColumnLabel(scope);
  var html = '<table><thead><tr><th class="name-col">' + colLabel + '</th><th class="value-col">Value</th><th class="type-col">Type</th></tr></thead><tbody>';
  if (scope === 'globals') _globalsIndex = new Map(); else _localsIndex = new Map();
  for (var i = 0; i < vars.length; ++i) {

    var v = vars[i];
    if (scope === 'globals') _globalsIndex.set(v.name, { type: v.type }); else _localsIndex.set(v.name, { type: v.type });
    html += '<tr><td class="name-col">' + v.name + '</td><td class="value-col">';
    var isGlobal = scope === 'globals';
    var editable = isGlobal && _hasDraw;
    var readonlyAttr = editable ? '' : ' readonly';
    var disabledAttr = editable ? '' : ' disabled';
    if (v.type === 'boolean') {
      html += '<label class="checkbox-wrapper"><input type="checkbox" data-var="' + v.name + '" data-scope="' + scope + '"' + (v.value ? ' checked' : '') + disabledAttr + ' /><span class="checkbox-custom" aria-hidden="true"></span></label>';
    } else if (v.type === 'number') {
      html += '<input type="text" data-number-field="true" lang="en" inputmode="decimal" autocomplete="off" data-var="' + v.name + '" data-scope="' + scope + '" value="' + normalizeForInput('number', v.value) + '" step="any"' + readonlyAttr + ' />';
    } else if (v.type === 'array') {
      html += '<input type="text" data-var="' + v.name + '" data-scope="' + scope + '" data-type="array" value="' + normalizeForInput('array', v.value).replace(/"/g, '&quot;') + '"' + readonlyAttr + ' />';
    } else {
      html += '<input type="text" data-var="' + v.name + '" data-scope="' + scope + '" value="' + normalizeForInput('text', v.value) + '"' + readonlyAttr + ' />';
    }
    html += '</td><td class="type-col">' + v.type + '</td></tr>';
  }
  html += '</tbody></table>';

  tableDiv.innerHTML = html;
  decorateNumberInputs(tableDiv);
  var inputs = tableDiv.querySelectorAll('input[data-var]');
  inputs.forEach(function(input) {
    var name = input.getAttribute('data-var');
    var scopeAttr = input.getAttribute('data-scope') || 'globals';
    var isGlobal = scopeAttr === 'globals';
    var editable = isGlobal && _hasDraw;
    if (!editable) {
      return; // keep locals and no-draw sketches read-only
    }
    if (input.type === 'checkbox') {
      input.addEventListener('change', function() { sendVarUpdate(name, input.checked, scopeAttr); });
    } else if (input.getAttribute('data-number-field') === 'true') {
      let numDebounceTimer = null;
      input.addEventListener('input', function() {
        if (numDebounceTimer) clearTimeout(numDebounceTimer);
        numDebounceTimer = setTimeout(function() {
          if (input.value === '') { sendVarUpdate(name, '', scopeAttr); return; }
          var parsed = parseNumberFieldValue(String(input.value));
          if (parsed.isValid) {
            if (input.value !== parsed.normalized) input.value = parsed.normalized;
            sendVarUpdate(name, parsed.value, scopeAttr);
          } else {
            sendVarUpdate(name, '', scopeAttr);
          }
        }, 25);
      });
      input.addEventListener('change', function() {
        if (input.value === '') { sendVarUpdate(name, '', scopeAttr); return; }
        var parsed = parseNumberFieldValue(String(input.value));
        if (parsed.isValid) {
          if (input.value !== parsed.normalized) input.value = parsed.normalized;
          sendVarUpdate(name, parsed.value, scopeAttr);
        } else {
          sendVarUpdate(name, '', scopeAttr);
        }
      });
    } else if (input.getAttribute('data-type') === 'array') {
      let arrDebounceTimer = null;
      input.addEventListener('input', function() {
        if (arrDebounceTimer) clearTimeout(arrDebounceTimer);
        var rawImmediate = input.value;
        if (rawImmediate.trim() === '') {
          clearArrayError(input);
          setInvalidFlag(name, scopeAttr, false);
          setInvalidDraft(name, scopeAttr, '');
        } else {
          markArrayInvalid(input);
          setInvalidFlag(name, scopeAttr, true);
          setInvalidDraft(name, scopeAttr, rawImmediate);
        }
        arrDebounceTimer = setTimeout(function() {
          var raw = input.value;
          if (raw.trim() === '') { return; }
          try {
            // User sees array contents without brackets; wrap before parsing
            var toParse = raw.trim();
            if (toParse[0] !== '[') toParse = '[' + toParse;
            if (toParse[toParse.length - 1] !== ']') toParse = toParse + ']';
            var parsed = JSON.parse(toParse);
            if (Array.isArray(parsed)) {
              clearArrayError(input);
              setInvalidFlag(name, scopeAttr, false);
              setInvalidDraft(name, scopeAttr, '');
              sendVarUpdate(name, parsed, scopeAttr);
            } else {
              markArrayInvalid(input);
              setInvalidFlag(name, scopeAttr, true);
              setInvalidDraft(name, scopeAttr, raw);
            }
          } catch {
            markArrayInvalid(input);
            setInvalidFlag(name, scopeAttr, true);
            setInvalidDraft(name, scopeAttr, raw);
          }
        }, 150);
      });
      input.addEventListener('blur', function() {
        var raw = input.value;
        if (raw.trim() === '') { return; }
        try {
          var toParse = raw.trim();
          if (toParse[0] !== '[') toParse = '[' + toParse;
          if (toParse[toParse.length - 1] !== ']') toParse = toParse + ']';
          var parsed = JSON.parse(toParse);
          if (Array.isArray(parsed)) {
            clearArrayError(input);
            setInvalidFlag(name, scopeAttr, false);
            setInvalidDraft(name, scopeAttr, '');
            sendVarUpdate(name, parsed, scopeAttr);
          } else {
            markArrayInvalid(input);
            setInvalidFlag(name, scopeAttr, true);
            setInvalidDraft(name, scopeAttr, raw);
          }
        } catch {
          markArrayInvalid(input);
          setInvalidFlag(name, scopeAttr, true);
          setInvalidDraft(name, scopeAttr, raw);
        }
      });
    } else {
      let textDebounceTimer = null;
      input.addEventListener('input', function() {
        if (textDebounceTimer) clearTimeout(textDebounceTimer);
        textDebounceTimer = setTimeout(function() {
          sendVarUpdate(name, input.value, scopeAttr);
        }, 25);
      });
      input.addEventListener('change', function() { sendVarUpdate(name, input.value, scopeAttr); });
    }
  });
  applyInvalidStates(tableDiv, scope);
  pruneInvalidForScope(scope, vars);
  _rendered = true;
}
function patchValues(targetId, vars, scope) {
  var tableDiv = document.getElementById(targetId);
  if (!tableDiv) return;
  if (!vars.length) {
    tableDiv.innerHTML = '';
    if (scope === 'globals') _globalsIndex = new Map(); else _localsIndex = new Map();
    pruneInvalidForScope(scope, []);
    return;
  }
  var needRebuild = false;
  var indexMap = scope === 'globals' ? _globalsIndex : _localsIndex;
  if (indexMap.size !== vars.length) needRebuild = true;
  for (var i = 0; i < vars.length && !needRebuild; ++i) {
    var v = vars[i];
    var meta = indexMap.get(v.name);
    if (!meta || meta.type !== v.type) { needRebuild = true; break; }
  }
  if (needRebuild || !_rendered) { buildTable(targetId, vars, scope); return; }
  for (var j = 0; j < vars.length; ++j) {
    var vv = vars[j];
    var input = tableDiv.querySelector('input[data-var="' + vv.name + '"][data-scope="' + scope + '"]');
    if (!input) { needRebuild = true; break; }
    var key = makeInvalidKey(vv.name, scope);
    if (_invalidVars.has(key)) {
      continue;
    }
    if (input === document.activeElement) continue;
    if (vv.type === 'boolean') {
      var chk = !!vv.value;
      if (input.checked !== chk) input.checked = chk;
    } else if (vv.type === 'number') {
      var valStr = normalizeForInput('number', vv.value);
      if (input.value !== valStr) input.value = valStr;
    } else if (vv.type === 'array') {
      var arrStr = normalizeForInput('array', vv.value);
      if (input.value !== arrStr) input.value = arrStr;
      clearArrayError(input);
      setInvalidFlag(vv.name, scope, false);
      setInvalidDraft(vv.name, scope, '');
    } else {
      var tStr = normalizeForInput('text', vv.value);
      if (input.value !== tStr) input.value = tStr;
    }
  }
  if (needRebuild) buildTable(targetId, vars, scope);
  else pruneInvalidForScope(scope, vars);
}
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'setVarsSplit') {
    var globals = event.data.globals || [];
    var locals = event.data.locals || [];
    _hasDraw = !!event.data.hasDraw;
    var headingChanged = false;
    if (event.data.localsHeading === 'locals' || event.data.localsHeading === 'variables') {
      if (event.data.localsHeading !== _localsHeading) {
        _localsHeading = event.data.localsHeading;
        headingChanged = true;
      }
    }
    if (headingChanged) _rendered = false;
    if (toggleEmptyState(globals.length === 0 && locals.length === 0)) {
      _rendered = false;
      return;
    }
    toggleEmptyState(false);
    if (!_rendered) {
      buildTable('globals-table', globals, 'globals');
      buildTable('locals-table', locals, 'locals');
    } else {
      patchValues('globals-table', globals, 'globals');
      patchValues('locals-table', locals, 'locals');
    }
  }
});
</script>
  </body>
  </html>`;
      const triggerRefresh = () => { try { updateVariablesPanel(); } catch { } };
      triggerRefresh();
      setTimeout(triggerRefresh, 100);
      webviewView.onDidChangeVisibility(() => { if (webviewView.visible) triggerRefresh(); });
      webviewView.onDidDispose(() => { if (variablesPanelView === webviewView) variablesPanelView = undefined; });

      // Attach message listener for updates coming from VARIABLES panel
      webviewView.webview.onDidReceiveMessage((msg) => {
        if (msg && msg.type === 'updateGlobalVar' && msg.name) {
          try {
            const name = String(msg.name);
            const value = msg.value;
            const scope = msg.scope === 'locals' ? 'locals' : 'globals';
            const panel = deps.getActiveP5Panel();
            const docUri = panel ? deps.getDocUriForPanel(panel)?.toString() : undefined;
            if (docUri) {
              if (scope === 'globals') {
                deps.setGlobalValue(docUri, name, value, { updatedAt: msg.generatedAt });
              } else {
                deps.setLocalValue(docUri, name, value);
              }
            }
            updateVariablesPanel();
          } catch { }

          const activePanel = deps.getActiveP5Panel();
          if (activePanel && activePanel.webview && msg.scope !== 'locals') {
            activePanel.webview.postMessage({ type: 'updateGlobalVar', name: msg.name, value: msg.value, generatedAt: msg.generatedAt });
          }
        }
      });
    }
  };
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('p5studioVariablesView', provider)
  );

  return { updateVariablesPanel };
}
