/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


(function(){
  const ws = Blockly.inject('blocklyDiv', {
    toolbox: window.toolbox,
    media: 'https://unpkg.com/blockly/media/',
  });

  // Bump storage version when block schema changes to avoid restore errors
  const STORAGE_VERSION = 'v2';
  const storageKey = 'mainWorkspace_' + STORAGE_VERSION;
  function save(workspace) {
    const data = Blockly.serialization.workspaces.save(workspace);
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch(_) {}
  }
  function load(workspace) {
    let data = null; try { data = localStorage.getItem(storageKey); } catch(_) {}
    if (!data) return;
    Blockly.Events.disable();
    try {
      Blockly.serialization.workspaces.load(JSON.parse(data), workspace, false);
    } catch (e) {
      try {
        console.warn('[B5] Failed to restore workspace; clearing saved state. Reason:', e && e.message ? e.message : e);
        localStorage.removeItem(storageKey);
      } catch(_) {}
    } finally {
      Blockly.Events.enable();
    }
  }

  load(ws);

  // Helper to send code to VS Code extension
  function postCodeToExtension(code) {
    if (window.vscode && typeof window.vscode.postMessage === 'function') {
      window.vscode.postMessage({ type: 'blocklyGeneratedCode', code });
    }
  }

  // Try to acquire VS Code API
  if (!window.vscode && typeof acquireVsCodeApi === 'function') {
    window.vscode = acquireVsCodeApi();
  }

  function getGeneratedCode() {
    return javascript.javascriptGenerator.workspaceToCode(ws);
  }

  // Send code to extension on every change
  ws.addChangeListener((e) => {
    if (!e.isUiEvent && e.type !== Blockly.Events.FINISHED_LOADING && !ws.isDragging()) {
      const code = getGeneratedCode();
      postCodeToExtension(code);
    }
    if (!e.isUiEvent) save(ws);
  });

  // Send initial code after load
  setTimeout(() => {
    const code = getGeneratedCode();
    postCodeToExtension(code);
  }, 100);

})();
