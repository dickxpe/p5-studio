/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


(function(){
  const ws = Blockly.inject('blocklyDiv', {
    toolbox: window.toolbox,
    media: 'https://unpkg.com/blockly/media/',
  });

  // Use the storage key provided by the extension for this panel
  const storageKey = window.BLOCKLY_STORAGE_KEY || 'mainWorkspace_v2';
  // Persisting workspace to localStorage has been disabled; the extension now embeds
  // workspace JSON inline in the file (/*@BlocklyWorkspace ... */). The webview
  // receives that JSON via a 'loadWorkspace' message from the extension and will
  // load it when provided. save() is intentionally a no-op because the extension
  // receives serialized workspace on changes and embeds it into the file.
  function save(workspace) {
    // no-op: persistence handled by the extension via embedded workspace JSON
  }

  // Helper to send code to VS Code extension
  function postCodeToExtension(code) {
    if (window.vscode && typeof window.vscode.postMessage === 'function') {
      // Send the generated code as-is along with serialized workspace
      const codeText = code;
      let workspaceObj = null;
      try { workspaceObj = Blockly.serialization.workspaces.save(ws); } catch (e) { workspaceObj = null; }
      const workspaceJson = workspaceObj ? JSON.stringify(workspaceObj) : null;
      window.vscode.postMessage({ type: 'blocklyGeneratedCode', code: codeText, workspace: workspaceJson });
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

  // Do not send initial code immediately — the extension will send the sidecar workspace
  // shortly after the webview is created. Sending an initial export before the
  // workspace has been loaded causes the extension to overwrite the file with an
  // empty workspace. Instead, we will explicitly post code back to the extension
  // after we successfully load a workspace from an extension message (see below).

  // Listen for messages from the extension (e.g., loadWorkspace)
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (!msg) return;
    if (msg.type === 'loadWorkspace' && msg.workspace) {
      try {
        const obj = JSON.parse(msg.workspace);
        Blockly.Events.disable();
        Blockly.serialization.workspaces.load(obj, ws, true);
        Blockly.Events.enable();
          // After loading the workspace from the extension sidecar, send the generated
          // code + serialized workspace back to the extension so it can persist any
          // changes or keep sidecar/file in sync. This avoids an initial empty write.
          try {
            const code = getGeneratedCode();
            // Mark this export as the initial load so the extension can ignore it
            // and avoid overwriting the user's file when the workspace is first loaded.
            if (window.vscode && typeof window.vscode.postMessage === 'function') {
              let workspaceObj = null;
              try { workspaceObj = Blockly.serialization.workspaces.save(ws); } catch (e) { workspaceObj = null; }
              const workspaceJson = workspaceObj ? JSON.stringify(workspaceObj) : null;
              window.vscode.postMessage({ type: 'blocklyGeneratedCode', code: code, workspace: workspaceJson, initialLoad: true });
            }
          } catch (e) { /* ignore */ }
        // Do not persist to localStorage; persistence is handled by the extension via
        // the embedded /*@BlocklyWorkspace ... */ JSON in the file.
      } catch (e) {
        console.warn('[B5] failed to load workspace from extension message', e);
      }
    }
  });

})();
