/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


(function(){
  // Define a dark theme for Blockly and register it
  let darkTheme = undefined;
  try {
    darkTheme = Blockly.Theme.defineTheme('dark', {
      name: 'dark',
      base: Blockly.Themes.Classic,
      componentStyles: {
        workspaceBackgroundColour: '#1e1e1e',
        toolboxBackgroundColour: '#333',
        toolboxForegroundColour: '#fff',
        flyoutBackgroundColour: '#252526',
        flyoutForegroundColour: '#ccc',
        flyoutOpacity: 1,
        scrollbarColour: '#797979',
        insertionMarkerColour: '#fff',
        insertionMarkerOpacity: 0.3,
        scrollbarOpacity: 0.4,
        cursorColour: '#d0d0d0',
      },
    });
  } catch (e) { /* ignore if Blockly.Theme is unavailable */ }
  // Define a light theme override so we can ensure toolbox/category labels are black
  let lightTheme = undefined;
  try {
    lightTheme = Blockly.Theme.defineTheme('light', {
      name: 'light',
      base: Blockly.Themes.Classic,
      componentStyles: {
        workspaceBackgroundColour: '#ffffff',
        toolboxBackgroundColour: '#f3f3f3',
        // Make toolbox/category labels clearly black in light theme
        toolboxForegroundColour: '#000000',
        flyoutBackgroundColour: '#ffffff',
        flyoutForegroundColour: '#000000',
        flyoutOpacity: 1,
        scrollbarColour: '#bfbfbf',
        insertionMarkerColour: '#000000',
        insertionMarkerOpacity: 0.3,
        scrollbarOpacity: 0.4,
        cursorColour: '#000000',
      },
    });
  } catch (e) { /* ignore if Blockly.Theme is unavailable */ }
  // Choose theme based on host-provided preference (window.BLOCKLY_THEME)
  let chosenTheme = undefined;
  try {
    const desired = (window.BLOCKLY_THEME || 'dark');
    if (desired === 'dark') {
      chosenTheme = darkTheme || ((Blockly.Theme && Blockly.Theme.getTheme) ? Blockly.Theme.getTheme('dark') : undefined);
    } else {
      // 'light' or 'auto' (or any other value) falls back to default Blockly theme
      chosenTheme = undefined;
    }
  } catch (e) { chosenTheme = undefined; }

  const ws = Blockly.inject('blocklyDiv', {
    toolbox: window.toolbox,
    media: 'https://unpkg.com/blockly/media/',
    theme: chosenTheme,
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

  // Theme helpers
  let _mq = null;
  function applyThemeByName(name) {
    try {
      let themeObj = null;
      if (name === 'dark') {
        themeObj = darkTheme || ((Blockly.Theme && Blockly.Theme.getTheme) ? Blockly.Theme.getTheme('dark') : null) || Blockly.Themes.Classic;
      } else {
        // Use explicit lightTheme if we defined one, otherwise fall back to classic
        themeObj = lightTheme || ((Blockly.Theme && Blockly.Theme.getTheme) ? Blockly.Theme.getTheme('classic') : null) || Blockly.Themes.Classic;
      }
      try { ws.setTheme(themeObj); } catch (e) { try { Blockly.getMainWorkspace().setTheme(themeObj); } catch (e) { /* ignore */ } }
      // Toggle body class so CSS can adjust scrollbars and other UI for light/dark
      try {
        if (typeof document !== 'undefined' && document && document.body) {
          if (name === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
          } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
          }
        }
      } catch (e) { /* ignore DOM errors */ }
    } catch (e) { /* ignore */ }
  }

  function applyAutoTheme() {
    try {
      if (window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        if (_mq && _mq.removeEventListener) _mq.removeEventListener('change', onMqChange);
        _mq = mq;
        applyThemeByName(mq.matches ? 'dark' : 'light');
        if (mq.addEventListener) mq.addEventListener('change', onMqChange);
        else if (mq.addListener) mq.addListener(onMqChange);
      } else {
        applyThemeByName('light');
      }
    } catch (e) { applyThemeByName('classic'); }
  }

  function onMqChange(e) {
  try { applyThemeByName(e.matches ? 'dark' : 'light'); } catch (e) { }
  }

  // Listen for messages from the extension (e.g., loadWorkspace)
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (!msg) return;
    // Allow dynamic theme updates from the extension
    if (msg.type === 'setBlocklyTheme' && msg.theme) {
      try {
        if (msg.theme === 'auto') {
          applyAutoTheme();
        } else {
          applyThemeByName(msg.theme === 'dark' ? 'dark' : 'light');
        }
      } catch (e) { /* ignore */ }
      return;
    }
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

  // Apply initial theme preference from host (supports 'dark', 'light', or 'auto')
  try {
    const pref = window.BLOCKLY_THEME || 'dark';
    if (pref === 'auto') applyAutoTheme();
    else applyThemeByName(pref === 'dark' ? 'dark' : 'light');
  } catch (e) { /* ignore */ }

})();
