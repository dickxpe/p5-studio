import * as vscode from 'vscode';

export type GlobalVar = { name: string; value: any; type: string };

export interface VariablesViewDeps {
    getActiveP5Panel: () => vscode.WebviewPanel | undefined;
    getDocUriForPanel: (panel: vscode.WebviewPanel | undefined) => vscode.Uri | undefined;
    getVarsForDoc: (docUri: string) => GlobalVar[];
    setVarsForDoc: (docUri: string, list: GlobalVar[]) => void;
}

let variablesPanelView: vscode.WebviewView | undefined;

export function registerVariablesView(context: vscode.ExtensionContext, deps: VariablesViewDeps) {
    function updateVariablesPanel() {
        if (!variablesPanelView) return;
        try {
            const panel = deps.getActiveP5Panel();
            let vars: GlobalVar[] = [];
            if (panel) {
                const docUri = deps.getDocUriForPanel(panel)?.toString();
                if (docUri) {
                    vars = deps.getVarsForDoc(docUri) || [];
                }
            }
            variablesPanelView.webview.postMessage({ type: 'setGlobalVars', variables: vars });
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
      table { border-collapse: collapse; width: 100%; font-size: 15px; }
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
    </style>
  </head>
  <body>
    <div class="wrap">
      <div id="vars-table"></div>
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
      var _varsRendered = false;
      var _varsIndex = new Map(); // name -> { type }
      function normalizeForInput(type, v) {
        if (type === 'number') {
          var n = Number(v);
          return Number.isNaN(n) ? '' : String(n);
        }
        if (type === 'boolean') return !!v;
        return (v === undefined || v === null) ? '' : String(v);
      }
      function buildTable(vars) {
        var tableDiv = document.getElementById('vars-table');
        if (!tableDiv) return;
        if (!vars.length) {
          tableDiv.innerHTML = '<span class="muted">No global variables</span>';
          _varsRendered = true; _varsIndex = new Map();
          return;
        }
        var html = '<table><thead><tr><th>Name</th><th>Value</th><th>Type</th></tr></thead><tbody>';
        _varsIndex = new Map();
        for (var i = 0; i < vars.length; ++i) {
          var v = vars[i];
          _varsIndex.set(v.name, { type: v.type });
          html += '<tr><td>' + v.name + '</td><td>';
          if (v.type === 'boolean') {
            html += '<input type="checkbox" data-var="' + v.name + '"' + (v.value ? ' checked' : '') + ' />';
          } else if (v.type === 'number') {
            html += '<input type="number" data-var="' + v.name + '" value="' + normalizeForInput('number', v.value) + '" step="any" />';
          } else {
            html += '<input type="text" data-var="' + v.name + '" value="' + normalizeForInput('text', v.value) + '" />';
          }
          html += '</td><td>' + v.type + '</td></tr>';
        }
        html += '</tbody></table>';
        tableDiv.innerHTML = html;
        var inputs = tableDiv.querySelectorAll('input[data-var]');
        inputs.forEach(function(input) {
          var name = input.getAttribute('data-var');
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
        _varsRendered = true;
      }
      function patchValues(vars) {
        var tableDiv = document.getElementById('vars-table');
        if (!tableDiv) return;
        var needRebuild = false;
        // Fast check: if count differs, rebuild
        if (_varsIndex.size !== vars.length) needRebuild = true;
        for (var i = 0; i < vars.length && !needRebuild; ++i) {
          var v = vars[i];
          var meta = _varsIndex.get(v.name);
          if (!meta || meta.type !== v.type) { needRebuild = true; break; }
        }
        if (needRebuild || !_varsRendered) { buildTable(vars); return; }
        // Patch existing inputs
        for (var j = 0; j < vars.length; ++j) {
          var vv = vars[j];
          var input = tableDiv.querySelector('input[data-var="' + vv.name + '"]');
          if (!input) { needRebuild = true; break; }
          if (input === document.activeElement) continue; // don't clobber while typing
          if (vv.type === 'boolean') {
            var chk = !!vv.value;
            if (input.checked !== chk) input.checked = chk;
          } else if (vv.type === 'number') {
            var valStr = normalizeForInput('number', vv.value);
            if (input.value !== valStr) input.value = valStr;
          } else {
            var tStr = normalizeForInput('text', vv.value);
            if (input.value !== tStr) input.value = tStr;
          }
        }
        if (needRebuild) buildTable(vars);
      }
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'setGlobalVars') {
          var vars = event.data.variables || [];
          if (!_varsRendered) buildTable(vars); else patchValues(vars);
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
                            const list = [...(deps.getVarsForDoc(docUri) || [])];
                            const idx = list.findIndex(v => v.name === name);
                            if (idx >= 0) {
                                list[idx] = { ...list[idx], value };
                            } else {
                                const t = typeof value;
                                const type = (t === 'boolean' || t === 'number') ? t : 'string';
                                list.push({ name, value, type });
                            }
                            deps.setVarsForDoc(docUri, list);
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
