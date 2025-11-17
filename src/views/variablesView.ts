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
      table { border-collapse: collapse; width: 100%; font-size: 15px; margin-bottom: 10px; }
  th, td { border: 1px solid #8884; padding: 4px 8px; text-align: left; }
  th { background: #2222; color: #307dc1; }
      /* Make inputs fill the table cell */
      input[type="number"],
      input[type="text"] {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        display: block;
      }
      input[type="checkbox"] { transform: scale(1.2); }
      .error { border-color:  #FF0000; background-color: #f14c4c; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h3>Global variables</h3>
      <div id="globals-table"></div>
      <h3>Local variables</h3>
      <div id="locals-table"></div>
    </div>
    <script>
      // Acquire VS Code API once and reuse
      const vscode = window.acquireVsCodeApi ? acquireVsCodeApi() : null;
      function sendVarUpdate(name, value) {
        if (vscode) {
          vscode.postMessage({ type: 'updateGlobalVar', name: name, value: value });
        } else if (window.parent) {
          parent.postMessage({ type: 'updateGlobalVar', name: name, value: value }, '*');
        }
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
      function buildTable(targetId, vars, scope) {
        var tableDiv = document.getElementById(targetId);
        if (!tableDiv) return;
        if (!vars.length) {
          tableDiv.innerHTML = scope === 'globals' ? '<span class="muted">No global variables</span>' : '<span class="muted">No local variables</span>';
          if (scope === 'globals') _globalsIndex = new Map(); else _localsIndex = new Map();
          return;
        }
        var html = '<table><thead><tr><th>Name</th><th>Value</th><th>Type</th></tr></thead><tbody>';
        if (scope === 'globals') _globalsIndex = new Map(); else _localsIndex = new Map();
        for (var i = 0; i < vars.length; ++i) {
          var v = vars[i];
          if (scope === 'globals') _globalsIndex.set(v.name, { type: v.type }); else _localsIndex.set(v.name, { type: v.type });
          html += '<tr><td>' + v.name + '</td><td>';
          if (v.type === 'boolean') {
            html += '<input type="checkbox" data-var="' + v.name + '" data-scope="' + scope + '"' + (v.value ? ' checked' : '') + ' />';
          } else if (v.type === 'number') {
            html += '<input type="number" data-var="' + v.name + '" data-scope="' + scope + '" value="' + normalizeForInput('number', v.value) + '" step="any" />';
          } else if (v.type === 'array') {
            html += '<input type="text" data-var="' + v.name + '" data-scope="' + scope + '" data-type="array" value="' + normalizeForInput('array', v.value).replace(/"/g, '&quot;') + '" />';
          } else {
            html += '<input type="text" data-var="' + v.name + '" data-scope="' + scope + '" value="' + normalizeForInput('text', v.value) + '" />';
          }
          html += '</td><td>' + v.type + '</td></tr>';
        }
        html += '</tbody></table>';
        tableDiv.innerHTML = html;
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
