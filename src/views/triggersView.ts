import * as vscode from 'vscode';
import type { TriggerDef } from '../processing/triggers';

export interface TriggersViewDeps {
  getActiveP5Panel: () => vscode.WebviewPanel | undefined;
  getDocUriForPanel: (panel: vscode.WebviewPanel | undefined) => vscode.Uri | undefined;
  getTriggersForDoc: (docUri: string) => TriggerDef[];
  invokeTrigger: (panel: vscode.WebviewPanel, fnName: string, args: any[]) => void;
}

let triggersPanelView: vscode.WebviewView | undefined;

export function registerTriggersView(context: vscode.ExtensionContext, deps: TriggersViewDeps) {
  function updateTriggersPanel() {
    if (!triggersPanelView) return;
    try {
      const panel = deps.getActiveP5Panel();
      let triggers: TriggerDef[] = [];
      if (panel) {
        const docUri = deps.getDocUriForPanel(panel)?.toString();
        if (docUri) {
          triggers = deps.getTriggersForDoc(docUri) || [];
        }
      }
      triggersPanelView.webview.postMessage({ type: 'setTriggers', triggers });
    } catch { }
  }

  const provider: vscode.WebviewViewProvider = {
    resolveWebviewView(webviewView: vscode.WebviewView) {
      triggersPanelView = webviewView;
      webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(context.extensionPath)]
      } as any;

      webviewView.webview.html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      html, body { margin: 0 !important; padding: 0 !important; }
      body { font-family: monospace; color: var(--vscode-editor-foreground); background: transparent; font-size: 12px; }
    .wrap { padding: 8px !important; }
      .muted { opacity: 0.8; }
      .row { display: grid; grid-template-columns: max-content 1fr; align-items: center; column-gap: 6px; margin-bottom: 6px; min-width: 0; }
      .btn { justify-self: start; min-width: 100px; padding: 2px 6px; border-radius: 2px; border: 1px solid var(--vscode-button-border, transparent); background: var(--vscode-button-background); color: var(--vscode-button-foreground); cursor: pointer; white-space: nowrap; }
      .btn:hover { background: var(--vscode-button-hoverBackground); }
      .btn:focus-visible { outline: 1px solid var(--vscode-focusBorder); outline-offset: 1px; }
      .inputs { min-width: 0; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 6px; }
      input { width: 100%; min-width: 0; box-sizing: border-box; display: block; background: var(--vscode-input-background); border: 1px solid var(--vscode-input-border, var(--vscode-input-background)); color: var(--vscode-input-foreground); padding: 2px 4px; border-radius: 2px; font-size: 11px; }
      input:focus { outline: 1px solid var(--vscode-focusBorder); outline-offset: 0; }
      #empty { display:none; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div id="empty" class="muted">No triggers</div>
      <div id="list"></div>
    </div>
    <script>
      const vscode = window.acquireVsCodeApi ? acquireVsCodeApi() : null;
      const emptyEl = document.getElementById('empty');
      const listEl = document.getElementById('list');

      function getState() {
        if (!vscode || typeof vscode.getState !== 'function') return { values: {} };
        const s = vscode.getState();
        if (s && typeof s === 'object') {
          if (!s.values || typeof s.values !== 'object') s.values = {};
          return s;
        }
        return { values: {} };
      }

      function setState(next) {
        if (!vscode || typeof vscode.setState !== 'function') return;
        try { vscode.setState(next); } catch {}
      }

      function parseInputValue(raw) {
        const s = String(raw ?? '').trim();
        if (s === '') return undefined;
        if (s === 'true') return true;
        if (s === 'false') return false;
        if (s === 'null') return null;
        // Numbers: support decimals, comma decimal separator, and scientific notation.
        // Only coerce when the whole string is numeric-looking.
        let numCandidate = s;
        const commaCount = (numCandidate.match(/,/g) || []).length;
        const hasDot = numCandidate.indexOf('.') !== -1;
        if (commaCount === 1 && !hasDot) {
          numCandidate = numCandidate.replace(',', '.');
        }
        if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(numCandidate)) {
          const n = Number(numCandidate);
          if (Number.isFinite(n)) return n;
        }
        // JSON object/array/string
        if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']')) || (s.startsWith('"') && s.endsWith('"'))) {
          try { return JSON.parse(s); } catch { }
        }
        return s;
      }

      function render(triggers) {
        if (!Array.isArray(triggers) || triggers.length === 0) {
          listEl.innerHTML = '';
          emptyEl.style.display = 'block';
          return;
        }
        emptyEl.style.display = 'none';

        const state = getState();
        const frag = document.createDocumentFragment();
        triggers.forEach(t => {
          const row = document.createElement('div');
          row.className = 'row';

          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.type = 'button';
          btn.textContent = t.label || t.fnName || 'Trigger';

          const inputsWrap = document.createElement('div');
          inputsWrap.className = 'inputs';

          const triggerKey = String(t.id || t.fnName || t.label || '');
          const saved = (state.values && triggerKey && Array.isArray(state.values[triggerKey]))
            ? state.values[triggerKey]
            : [];

          const params = Array.isArray(t.params) ? t.params : [];
          params.forEach((p, idx) => {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.setAttribute('data-arg-idx', String(idx));
            inp.placeholder = String(p || ('arg' + idx));
            if (typeof saved[idx] === 'string') inp.value = saved[idx];
            inp.addEventListener('input', () => {
              const s2 = getState();
              const arr = (s2.values && triggerKey && Array.isArray(s2.values[triggerKey]))
                ? s2.values[triggerKey]
                : [];
              arr[idx] = String(inp.value ?? '');
              if (!s2.values || typeof s2.values !== 'object') s2.values = {};
              s2.values[triggerKey] = arr;
              setState(s2);
            });
            inputsWrap.appendChild(inp);
          });

          btn.addEventListener('click', () => {
            const args = [];
            const inputs = inputsWrap.querySelectorAll('input[data-arg-idx]');
            inputs.forEach(inp => {
              args.push(parseInputValue(inp.value));
            });

            // Persist current raw input strings so a refresh won't clear the UI.
            const s2 = getState();
            const rawArr = [];
            inputs.forEach(inp => rawArr.push(String(inp.value ?? '')));
            if (!s2.values || typeof s2.values !== 'object') s2.values = {};
            if (triggerKey) s2.values[triggerKey] = rawArr;
            setState(s2);

            const fnName = String(t.fnName || '');
            if (!fnName) return;
            if (vscode) vscode.postMessage({ type: 'invokeTrigger', fnName, args });
          });

          row.appendChild(btn);
          row.appendChild(inputsWrap);
          frag.appendChild(row);
        });

        listEl.innerHTML = '';
        listEl.appendChild(frag);
      }

      window.addEventListener('message', (event) => {
        const data = event.data;
        if (data && data.type === 'setTriggers') {
          render(data.triggers || []);
        }
      });
    </script>
  </body>
</html>`;

      const triggerRefresh = () => { try { updateTriggersPanel(); } catch { } };
      triggerRefresh();
      setTimeout(triggerRefresh, 100);
      webviewView.onDidChangeVisibility(() => { if (webviewView.visible) triggerRefresh(); });
      webviewView.onDidDispose(() => { if (triggersPanelView === webviewView) triggersPanelView = undefined; });

      webviewView.webview.onDidReceiveMessage((msg) => {
        if (msg && msg.type === 'invokeTrigger' && msg.fnName) {
          try {
            const fnName = String(msg.fnName);
            const args = Array.isArray(msg.args) ? msg.args : [];
            const panel = deps.getActiveP5Panel();
            if (panel) {
              deps.invokeTrigger(panel, fnName, args);
            }
          } catch { }
        }
      });
    }
  };

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('p5studioTriggersView', provider)
  );

  return { updateTriggersPanel };
}
