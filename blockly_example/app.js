/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

(function(){
  const codeEl = document.querySelector('#generatedCode code');
  const outputEl = document.getElementById('output');

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

  function runCode(){
    const code = javascript.javascriptGenerator.workspaceToCode(ws);
    codeEl.textContent = code;
    outputEl.innerHTML = '';
    // Try to remove previous p5 sketch/canvas if any
    try { if (typeof remove === 'function') remove(); } catch(_) {}
    try { document.querySelectorAll('canvas').forEach(c => c.remove()); } catch(_) {}
    try { eval(code); } catch(e) { console.error(e); }
  }

  load(ws);
  runCode();

  ws.addChangeListener((e) => { if (!e.isUiEvent) save(ws); });
  ws.addChangeListener((e) => {
    if (e.isUiEvent || e.type === Blockly.Events.FINISHED_LOADING || ws.isDragging()) return;
    runCode();
  });
})();
