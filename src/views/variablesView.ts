import * as vscode from 'vscode';

export type GlobalVar = { name: string; value: any; type: string };

export interface VariablesViewDeps {
  getActiveP5Panel: () => vscode.WebviewPanel | undefined;
  getDocUriForPanel: (panel: vscode.WebviewPanel | undefined) => vscode.Uri | undefined;
  getGlobalsForDoc: (docUri: string) => GlobalVar[];
  getLocalsForDoc: (docUri: string) => GlobalVar[];
  setGlobalValue: (docUri: string, name: string, value: any) => void;
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
      if (panel) {
        const docUri = deps.getDocUriForPanel(panel)?.toString();
        if (docUri) {
          globals = deps.getGlobalsForDoc(docUri) || [];
          locals = deps.getLocalsForDoc(docUri) || [];
        }
      }
      variablesPanelView.webview.postMessage({ type: 'setVarsSplit', globals, locals });
    } catch { }
  }

  const provider: vscode.WebviewViewProvider = {
    resolveWebviewView(webviewView: vscode.WebviewView) {
      variablesPanelView = webviewView;
      webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(context.extensionPath)]
      } as any;
      webviewView.webview.html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body { margin: 0; font-family: monospace; color: var(--vscode-editor-foreground); background: transparent; }
      .wrap { padding: 8px; }
      .muted { opacity: 0.8; }
      h3 { margin: 8px 0 6px 0; color: #307dc1; }
        table { border-collapse: collapse; width: 100%; font-size: 15px; margin-bottom: 10px; table-layout: fixed; }
      th, td { border: 1px solid #8884; padding: 4px 8px; text-align: left; }
      th.name-col, td.name-col { width: 45%; }
      th.value-col, td.value-col { width: 35%; }
      th.type-col, td.type-col { width: 20%; }
  th { background: #2222; color: #307dc1; }
      /* Make inputs fill the table cell */
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
        padding: 4px 6px;
        border-radius: 2px;
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
        padding-right: 28px;
      }
      .spin-buttons {
        position: absolute;
        top: 2px;
        bottom: 2px;
        right: 2px;
        width: 24px;
        display: flex;
        flex-direction: column;
        gap: 2px;
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
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
      }
      .spin-btn.spin-up::before {
        border-bottom: 7px solid #2f78b9;
      }
      .spin-btn.spin-down::before {
        border-top: 7px solid #2f78b9;
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
        height: 16px;
        line-height: 0;
        vertical-align: middle;
      }
      .checkbox-wrapper input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        width: 16px;
        height: 16px;
        top: 0;
        left: 0;
        margin: 0;
        cursor: pointer;
      }
      .checkbox-custom {
        width: 16px;
        height: 16px;
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
      .error {
        border-color: var(--vscode-inputValidation-errorBorder, #f14c4c);
        background-color: var(--vscode-inputValidation-errorBackground, rgba(241,76,76,0.15));
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
      function sendVarUpdate(name, value) {
        if (vscode) {
          vscode.postMessage({ type: 'updateGlobalVar', name: name, value: value });
        } else if (window.parent) {
          parent.postMessage({ type: 'updateGlobalVar', name: name, value: value }, '*');
        }
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
      function normalizeForInput(type, v) {
        if (type === 'number') {
          var n = Number(v);
          return Number.isNaN(n) ? '' : String(n);
        }
        if (type === 'array') {
          try {
            return JSON.stringify(v);
          } catch { return ''; }
        }
        if (type === 'boolean') return !!v;
        return (v === undefined || v === null) ? '' : String(v);
      }
      function adjustNumberValue(input, direction) {
        var rawStep = input.getAttribute('step');
        var parsedStep = Number(rawStep);
        var step = !rawStep || rawStep === 'any' || Number.isNaN(parsedStep) ? 1 : parsedStep;
        var current = Number(input.value);
        if (input.value === '' || Number.isNaN(current)) current = 0;
        var next = current + direction * step;
        var valueStr = String(next);
        input.value = valueStr;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        if (typeof input.focus === 'function') {
          try { input.focus({ preventScroll: true }); } catch { }
        }
      }
      function decorateNumberInputs(rootEl) {
        if (!rootEl) return;
        var numberInputs = rootEl.querySelectorAll('input[type="number"][data-var]:not([data-spin-wrapped="true"])');
        numberInputs.forEach(function(input) {
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
          var downBtn = document.createElement('button');
          downBtn.type = 'button';
          downBtn.className = 'spin-btn spin-down';
          downBtn.setAttribute('aria-label', 'Decrease value');
          buttons.appendChild(upBtn);
          buttons.appendChild(downBtn);
          wrapper.appendChild(buttons);
          upBtn.addEventListener('pointerdown', function(evt) {
            evt.preventDefault();
            adjustNumberValue(input, 1);
          });
          downBtn.addEventListener('pointerdown', function(evt) {
            evt.preventDefault();
            adjustNumberValue(input, -1);
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
        var colLabel = scope === 'globals' ? 'Global variable(s)' : 'Local variable(s)';
        var html = '<table><thead><tr><th class="name-col">' + colLabel + '</th><th class="value-col">Value</th><th class="type-col">Type</th></tr></thead><tbody>';
        if (scope === 'globals') _globalsIndex = new Map(); else _localsIndex = new Map();
        for (var i = 0; i < vars.length; ++i) {
          var v = vars[i];
          if (scope === 'globals') _globalsIndex.set(v.name, { type: v.type }); else _localsIndex.set(v.name, { type: v.type });
          html += '<tr><td class="name-col">' + v.name + '</td><td class="value-col">';
          if (v.type === 'boolean') {
            html += '<label class="checkbox-wrapper"><input type="checkbox" data-var="' + v.name + '" data-scope="' + scope + '"' + (v.value ? ' checked' : '') + ' /><span class="checkbox-custom" aria-hidden="true"></span></label>';
          } else if (v.type === 'number') {
            html += '<input type="number" data-var="' + v.name + '" data-scope="' + scope + '" value="' + normalizeForInput('number', v.value) + '" step="any" />';
          } else if (v.type === 'array') {
            html += '<input type="text" data-var="' + v.name + '" data-scope="' + scope + '" data-type="array" value="' + normalizeForInput('array', v.value).replace(/"/g, '&quot;') + '" />';
          } else {
            html += '<input type="text" data-var="' + v.name + '" data-scope="' + scope + '" value="' + normalizeForInput('text', v.value) + '" />';
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
          if (input.type === 'checkbox') {
            // Checkbox: change is fine (no continuous intermediate states)
            input.addEventListener('change', function() { sendVarUpdate(name, input.checked); });
          } else if (input.type === 'number') {
            // Number: send on every increment/decrement or typed change
            let numDebounceTimer = null;
            input.addEventListener('input', function() {
              if (numDebounceTimer) clearTimeout(numDebounceTimer);
              numDebounceTimer = setTimeout(function() {
                if (input.value === '') { sendVarUpdate(name, ''); return; }
                var num = Number(input.value);
                if (!Number.isNaN(num)) sendVarUpdate(name, num); else sendVarUpdate(name, '');
              }, 25);
            });
            // Also fire a final confirmation on blur (optional redundancy)
            input.addEventListener('change', function() {
              if (input.value === '') { sendVarUpdate(name, ''); return; }
              var num = Number(input.value);
              if (!Number.isNaN(num)) sendVarUpdate(name, num); else sendVarUpdate(name, '');
            });
          } else if (input.getAttribute('data-type') === 'array') {
            // Array: treat value as JSON; validate on change
            let arrDebounceTimer = null;
            input.addEventListener('input', function() {
              if (arrDebounceTimer) clearTimeout(arrDebounceTimer);
              arrDebounceTimer = setTimeout(function() {
                var raw = input.value;
                if (raw.trim() === '') { return; }
                try {
                  var parsed = JSON.parse(raw);
                  if (Array.isArray(parsed)) {
                    input.classList.remove('error');
                    sendVarUpdate(name, parsed);
                  } else {
                    input.classList.add('error');
                  }
                } catch {
                  input.classList.add('error');
                }
              }, 150);
            });
            input.addEventListener('blur', function() {
              var raw = input.value;
              if (raw.trim() === '') { return; }
              try {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                  input.classList.remove('error');
                  sendVarUpdate(name, parsed);
                } else {
                  input.classList.add('error');
                }
              } catch {
                input.classList.add('error');
              }
            });
          } else {
            // Text: live updates while typing
            let textDebounceTimer = null;
            input.addEventListener('input', function() {
              if (textDebounceTimer) clearTimeout(textDebounceTimer);
              textDebounceTimer = setTimeout(function() {
                sendVarUpdate(name, input.value);
              }, 25);
            });
            // Optional final send on change (kept for consistency; cheap)
            input.addEventListener('change', function() { sendVarUpdate(name, input.value); });
          }
        });
        _rendered = true;
      }
      function patchValues(targetId, vars, scope) {
        var tableDiv = document.getElementById(targetId);
        if (!tableDiv) return;
        if (!vars.length) {
          tableDiv.innerHTML = '';
          if (scope === 'globals') _globalsIndex = new Map(); else _localsIndex = new Map();
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
          var input = tableDiv.querySelector('input[data-var="' + vv.name + '"]');
          if (!input) { needRebuild = true; break; }
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
            input.classList.remove('error');
          } else {
            var tStr = normalizeForInput('text', vv.value);
            if (input.value !== tStr) input.value = tStr;
          }
        }
        if (needRebuild) buildTable(targetId, vars, scope);
      }
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'setVarsSplit') {
          var globals = event.data.globals || [];
          var locals = event.data.locals || [];
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
      // On first load, show latest vars if available
      setTimeout(updateVariablesPanel, 100);

      // Attach message listener for updates coming from VARIABLES panel
      webviewView.webview.onDidReceiveMessage((msg) => {
        if (msg && msg.type === 'updateGlobalVar' && msg.name) {
          try {
            const name = String(msg.name);
            const value = msg.value;
            const panel = deps.getActiveP5Panel();
            const docUri = panel ? deps.getDocUriForPanel(panel)?.toString() : undefined;
            if (docUri) {
              // Try updating global first; otherwise treat as local
              deps.setGlobalValue(docUri, name, value);
              deps.setLocalValue(docUri, name, value);
            }
            updateVariablesPanel();
          } catch { }

          const activePanel = deps.getActiveP5Panel();
          if (activePanel && activePanel.webview) {
            activePanel.webview.postMessage({ type: 'updateGlobalVar', name: msg.name, value: msg.value });
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
