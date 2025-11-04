/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


(function(){
  // Build color maps from JSON categories (name -> colour, blockType -> colour)
  function buildJsonColorMaps() {
    const nameToColour = new Map();
    const blockToColour = new Map();
    try {
      const cats = window.EXTRA_TOOLBOX_CATEGORIES;
      if (Array.isArray(cats)) {
        cats.forEach(c => {
          if (!c || typeof c.name !== 'string') return;
          const col = c.colour || c.color; // support alt spelling if provided
          if (col) nameToColour.set(c.name, col);
          if (Array.isArray(c.blocks) && col) {
            c.blocks.forEach(t => { if (typeof t === 'string') blockToColour.set(t, col); });
          }
        });
      }
    } catch (e) { /* ignore */ }
    return { nameToColour, blockToColour };
  }

  const { nameToColour: JSON_NAME_COLOUR, blockToColour: JSON_BLOCK_COLOUR } = buildJsonColorMaps();
  // Define a dark theme for Blockly and register it
  let darkTheme = undefined;
  try {
    darkTheme = Blockly.Theme.defineTheme('dark', {
      name: 'dark',
      base: Blockly.Themes.Classic,
      categoryStyles: {
        value_category: { colour: '#5ec453' },
        debug_category: { colour: '#ec43f5' }
      },
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
      categoryStyles: {
        value_category: { colour: '#5ec453' },
        debug_category: { colour: '#ec43f5' }
      },
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
    // Temporarily inject a statement prefix that tags each top-level statement with its originating block id.
    const gen = javascript.javascriptGenerator;
    const prevPrefix = gen.STATEMENT_PREFIX;
    // %1 will be replaced by block.id by Blockly's generator
    gen.STATEMENT_PREFIX = '/*@b:%1*/\n';
    let code = gen.workspaceToCode(ws);
    // Build a line -> blockId map by scanning for our markers and produce the final code without markers.
    // Robust to markers with quoted ids (Blockly wraps %1 in quotes) and markers inline with code.
    const lineMap = [];
    const inLines = code.split(/\r?\n/);
    const outLines = [];
    let pendingBlockId = null; // carry to next non-empty line if marker line is empty
    const markerRe = /\/\*@b:(?:'([^']+)'|([^*]+))\*\//g; // captures id in group 1 (quoted) or 2 (raw)
    for (let i = 0; i < inLines.length; i++) {
      const original = inLines[i] || '';
      let idOnThisLine = null;
      // Extract last marker id found on this line (if multiple, last wins)
      let mm;
      while ((mm = markerRe.exec(original)) !== null) {
        const raw = (mm[1] || mm[2] || '').trim();
        // Strip any surrounding quotes just in case
        const clean = raw.replace(/^['"]|['"]$/g, '');
        idOnThisLine = clean;
      }
      // Remove all markers from the emitted code
      const stripped = original.replace(markerRe, '');
      // If there was a marker on this line, prefer it over any previous pending id
      if (idOnThisLine) pendingBlockId = idOnThisLine;
      // If the remaining line has non-whitespace content, emit it and map if we have a pending id
      if (stripped.trim().length > 0) {
        if (pendingBlockId) {
          lineMap.push({ line: outLines.length + 1, blockId: pendingBlockId });
          pendingBlockId = null;
        }
        outLines.push(stripped);
      } else {
        // No content after stripping; do not emit a line, keep pending id for next non-empty
      }
    }
    code = outLines.join('\n');
    // Restore previous prefix
    gen.STATEMENT_PREFIX = prevPrefix;
    return { code, lineMap };
  }

  // Send code to extension on every change
  ws.addChangeListener((e) => {
    if (!e.isUiEvent && e.type !== Blockly.Events.FINISHED_LOADING && !ws.isDragging()) {
      // Always export code, even if workspace is empty
      const res = getGeneratedCode();
      let code = res && res.code != null ? res.code : '';
      // If workspace is empty or code is only whitespace, send empty string
      if (ws.getAllBlocks(false).length === 0 || !code.trim()) {
        code = '';
      }
      if (res && Array.isArray(res.lineMap)) {
        if (window.vscode && typeof window.vscode.postMessage === 'function') {
          let workspaceObj = null;
          try { workspaceObj = Blockly.serialization.workspaces.save(ws); } catch (e) { workspaceObj = null; }
          const workspaceJson = workspaceObj ? JSON.stringify(workspaceObj) : null;
          window.vscode.postMessage({ type: 'blocklyGeneratedCode', code, workspace: workspaceJson, lineMap: res.lineMap });
        } else {
          postCodeToExtension(code);
        }
      } else {
        postCodeToExtension(code);
      }
    }
    if (!e.isUiEvent) save(ws);
  });

  // --- Coloring helpers (Values fallback + JSON overrides) ---
  const VALUES_COLOR = '#5ec453';
  const VALUE_TYPES = ['math_number', 'text', 'logic_boolean'];

  function applyBlockColorIfMapped(block) {
    try {
      if (!block || !block.type) return;
      const type = block.type;
      const col = JSON_BLOCK_COLOUR.get(type);
      if (col) {
        block.setColour(col);
      } else if (VALUE_TYPES.indexOf(type) >= 0) {
        block.setColour(VALUES_COLOR);
      }
    } catch (e) { /* ignore */ }
  }

  function recolorWorkspaceValueBlocks() {
    try {
      const all = ws.getAllBlocks(false);
      all.forEach(b => applyBlockColorIfMapped(b));
    } catch (e) { /* ignore */ }
  }

  function recolorFlyoutVisuals() {
    try {
      // Find selected category name in the toolbox
      let selectedName = null;
      try {
        const selected = document.querySelector('.blocklyTreeRow.blocklyTreeSelected .blocklyTreeLabel');
        if (selected && selected.textContent) selectedName = selected.textContent.trim();
      } catch (e) {}
      const fillColor = (selectedName && JSON_NAME_COLOUR.get(selectedName)) || VALUES_COLOR;
      // Color any SVG paths in the flyout that represent block backgrounds
      const paths = document.querySelectorAll('.blocklyFlyout .blocklyPath, .blocklyFlyout .blocklyBlockBackground');
      paths.forEach(p => { try { if (p.setAttribute) p.setAttribute('fill', fillColor); } catch (e) {} });
      // Ensure flyout text is readable
      const texts = document.querySelectorAll('.blocklyFlyout .blocklyText');
      texts.forEach(t => { try { t.setAttribute('fill', '#000'); } catch (e) {} });
    } catch (e) { /* ignore */ }
  }

  // Recolor newly created blocks in the main workspace
  ws.addChangeListener(function(e) {
    try {
      if (e.type === Blockly.Events.BLOCK_CREATE || e.type === Blockly.Events.BLOCK_CHANGE) {
        const ids = e.ids || (e.blockId ? [e.blockId] : []);
        ids.forEach(id => {
          try {
            const b = ws.getBlockById(id);
            if (b) applyBlockColorIfMapped(b);
          } catch (err) { /* ignore */ }
        });
      } else if (e.type === Blockly.Events.UI && e.element === 'category') {
        // When a category is selected, recolor flyout visuals shortly after render
        setTimeout(recolorFlyoutVisuals, 50);
      }
    } catch (err) { /* ignore */ }
  });

  // Apply initial recolor pass
  setTimeout(() => {
    recolorWorkspaceValueBlocks();
    recolorFlyoutVisuals();
  }, 200);

  // --- Override: set default colour on Value-types or JSON mapped blocks on init ---
  try {
    VALUE_TYPES.forEach(type => {
      try {
        const def = Blockly.Blocks && Blockly.Blocks[type];
        if (def && typeof def.init === 'function') {
          const orig = def.init;
          def.init = function() {
            try { orig.call(this); } catch (e) { /* ignore */ }
            try { applyBlockColorIfMapped(this); } catch (e) { /* ignore */ }
          };
        }
      } catch (e) { /* ignore per-type errors */ }
    });
  } catch (e) { /* ignore */ }

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
        // Ensure any lingering outline strokes from previous sessions are cleared
        try {
          const paths = document.querySelectorAll('.blocklyWorkspace .blocklyPath, .blocklyWorkspace .blocklyBlockBackground');
          paths.forEach(p => { try { p.removeAttribute('stroke'); p.removeAttribute('stroke-width'); } catch (e) {} });
        } catch (e) {}
          // After loading the workspace from the extension sidecar, send the generated
          // code + serialized workspace back to the extension so it can persist any
          // changes or keep sidecar/file in sync. This avoids an initial empty write.
          try {
            const res = getGeneratedCode();
            const code = res && res.code != null ? res.code : '';
            // Mark this export as the initial load so the extension can ignore it
            // and avoid overwriting the user's file when the workspace is first loaded.
            if (window.vscode && typeof window.vscode.postMessage === 'function') {
              let workspaceObj = null;
              try { workspaceObj = Blockly.serialization.workspaces.save(ws); } catch (e) { workspaceObj = null; }
              const workspaceJson = workspaceObj ? JSON.stringify(workspaceObj) : null;
              window.vscode.postMessage({ type: 'blocklyGeneratedCode', code: code, workspace: workspaceJson, lineMap: (res && res.lineMap) || null, initialLoad: true });
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

  // --- Highlight a block when the extension asks (during step-run/single-step) ---
  try {
    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (!msg) return;
      if (msg.type === 'highlightBlocklyBlock') {
        try {
          const id = msg.blockId;
          const b = id ? ws.getBlockById(id) : null;
          // Clear highlight from all blocks first to ensure a single active highlight
          try {
            const all = ws.getAllBlocks(false);
            all.forEach(bl => { try { if (typeof bl.setHighlighted === 'function') bl.setHighlighted(false); } catch (e) {} });
          } catch (e) {}
          if (b) {
            // Highlight current block without relying on selection state
            try { if (typeof b.setHighlighted === 'function') b.setHighlighted(true); } catch (e) {}
            // Scroll into view
            try { b.workspace.centerOnBlock(b.id); } catch (e) {}
          }
        } catch (e) { /* ignore */ }
      } else if (msg.type === 'highlightAllBlocks') {
        try {
          const all = ws.getAllBlocks(false);
          all.forEach(b => {
            try {
              const root = (typeof b.getSvgRoot === 'function') ? b.getSvgRoot() : (b.svgGroup_ || null);
              if (!root) return;
              const pathEl = root.querySelector('.blocklyPath, .blocklyBlockBackground');
              if (pathEl && pathEl.setAttribute) {
                // Apply a bright yellow stroke to simulate highlight
                pathEl.setAttribute('stroke', '#ffd700');
                pathEl.setAttribute('stroke-width', '3');
              }
            } catch (e) { /* per-block ignore */ }
          });
        } catch (e) { /* ignore */ }
      } else if (msg.type === 'clearAllBlockHighlights') {
        try {
          // Remove the highlight stroke from all block backgrounds
          const paths = document.querySelectorAll('.blocklyWorkspace .blocklyPath, .blocklyWorkspace .blocklyBlockBackground');
          paths.forEach(p => {
            try {
              if (p.removeAttribute) {
                p.removeAttribute('stroke');
                p.removeAttribute('stroke-width');
              }
            } catch (e) { /* ignore */ }
          });
        } catch (e) { /* ignore */ }
      } else if (msg.type === 'clearBlocklyHighlight') {
        try {
          // Turn off highlight from all blocks and clear selection
          try {
            const all = ws.getAllBlocks(false);
            all.forEach(bl => { try { if (typeof bl.setHighlighted === 'function') bl.setHighlighted(false); } catch (e) {} });
          } catch (e) {}
          try { if (Blockly && Blockly.common && typeof Blockly.common.setSelected === 'function') Blockly.common.setSelected(null); } catch (e) {}
          // Also clear any visual stroke outlines that may remain from earlier tests
          try {
            const paths = document.querySelectorAll('.blocklyWorkspace .blocklyPath, .blocklyWorkspace .blocklyBlockBackground');
            paths.forEach(p => { try { p.removeAttribute('stroke'); p.removeAttribute('stroke-width'); } catch (e) {} });
          } catch (e) {}
        } catch (e) { /* ignore */ }
      }
    });
  } catch (e) { /* ignore */ }

})();
