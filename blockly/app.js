/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


(function () {
  // Remove default 'do'/'then' labels from standard blocks by overriding Blockly messages early
  function overrideDoThenMessages() {
    try {
      if (!window.Blockly || !Blockly.Msg) return;
      const keys = [
        'CONTROLS_REPEAT_INPUT_DO',
        'CONTROLS_WHILEUNTIL_INPUT_DO',
        'CONTROLS_FOR_INPUT_DO',
        'CONTROLS_FOREACH_INPUT_DO',
        'CONTROLS_IF_MSG_THEN'
      ];
      keys.forEach(k => { try { Blockly.Msg[k] = ''; } catch (e) { } });
    } catch (e) { /* ignore */ }
  }
  overrideDoThenMessages();

  // Ensure custom Blockly scrollbars (especially the flyout scrollbar) match toolbox width
  function overrideScrollbarThickness(thickness) {
    try {
      if (!window.Blockly) return;
      // Core scrollbar statics across versions
      try {
        if (Blockly.Scrollbar) {
          if ('scrollbarThickness' in Blockly.Scrollbar) Blockly.Scrollbar.scrollbarThickness = thickness;
          if ('scrollbarThickness_' in Blockly.Scrollbar) Blockly.Scrollbar.scrollbarThickness_ = thickness;
          if (Blockly.ScrollbarSvg && 'scrollbarThickness' in Blockly.ScrollbarSvg) {
            Blockly.ScrollbarSvg.scrollbarThickness = thickness;
          }
        }
      } catch (e) { }
      // Flyout-specific prototypes across versions
      try { if (Blockly.Flyout && Blockly.Flyout.prototype && 'scrollbarThickness_' in Blockly.Flyout.prototype) Blockly.Flyout.prototype.scrollbarThickness_ = thickness; } catch (e) { }
      try { if (Blockly.VerticalFlyout && Blockly.VerticalFlyout.prototype) Blockly.VerticalFlyout.prototype.scrollbarThickness_ = thickness; } catch (e) { }
      try { if (Blockly.HorizontalFlyout && Blockly.HorizontalFlyout.prototype) Blockly.HorizontalFlyout.prototype.scrollbarThickness_ = thickness; } catch (e) { }
    } catch (e) { /* ignore */ }
  }
  // Match the categories (toolbox) scrollbar width (CSS now uses ~12px)
  overrideScrollbarThickness(15);
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

  // Provide custom dialogs to avoid window.prompt/alert/confirm (blocked in sandbox)
  (function installCustomDialogs() {
    function ensureHost() {
      let overlay = document.getElementById('blk-modal-overlay');
      if (overlay) return overlay;
      overlay = document.createElement('div');
      overlay.id = 'blk-modal-overlay';
      overlay.className = 'blk-modal-overlay';
      const modal = document.createElement('div');
      modal.className = 'blk-modal';
      const msg = document.createElement('div');
      msg.className = 'blk-modal-message';
      const input = document.createElement('input');
      input.className = 'blk-modal-input';
      input.type = 'text';
      input.style.display = 'none';
      const buttons = document.createElement('div');
      buttons.className = 'blk-modal-buttons';
      const okBtn = document.createElement('button'); okBtn.className = 'blk-modal-ok'; okBtn.textContent = 'OK';
      const cancelBtn = document.createElement('button'); cancelBtn.className = 'blk-modal-cancel'; cancelBtn.textContent = 'Cancel';
      buttons.appendChild(okBtn); buttons.appendChild(cancelBtn);
      modal.appendChild(msg);
      modal.appendChild(input);
      modal.appendChild(buttons);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      return overlay;
    }

    function showAlert(message, callback) {
      const overlay = ensureHost();
      const msg = overlay.querySelector('.blk-modal-message');
      const input = overlay.querySelector('.blk-modal-input');
      const ok = overlay.querySelector('.blk-modal-ok');
      const cancel = overlay.querySelector('.blk-modal-cancel');
      input.style.display = 'none';
      msg.textContent = String(message || '');
      cancel.style.display = 'none';
      overlay.style.display = 'flex';
      function done() {
        overlay.style.display = 'none';
        cancel.style.display = '';
        ok.removeEventListener('click', onOk);
        document.removeEventListener('keydown', onKey);
        try { if (callback) callback(); } catch (e) { }
      }
      function onOk() { done(); }
      function onKey(e) { if (e.key === 'Enter' || e.key === 'Escape') done(); }
      ok.addEventListener('click', onOk);
      document.addEventListener('keydown', onKey);
    }

    function showConfirm(message, callback) {
      const overlay = ensureHost();
      const msg = overlay.querySelector('.blk-modal-message');
      const input = overlay.querySelector('.blk-modal-input');
      const ok = overlay.querySelector('.blk-modal-ok');
      const cancel = overlay.querySelector('.blk-modal-cancel');
      input.style.display = 'none';
      msg.textContent = String(message || '');
      cancel.style.display = '';
      overlay.style.display = 'flex';
      function finish(result) {
        overlay.style.display = 'none';
        ok.removeEventListener('click', onOk);
        cancel.removeEventListener('click', onCancel);
        document.removeEventListener('keydown', onKey);
        try { if (callback) callback(!!result); } catch (e) { }
      }
      function onOk() { finish(true); }
      function onCancel() { finish(false); }
      function onKey(e) { if (e.key === 'Enter') finish(true); else if (e.key === 'Escape') finish(false); }
      ok.addEventListener('click', onOk);
      cancel.addEventListener('click', onCancel);
      document.addEventListener('keydown', onKey);
    }

    function showPrompt(message, defaultValue, callback) {
      const overlay = ensureHost();
      const msg = overlay.querySelector('.blk-modal-message');
      const input = overlay.querySelector('.blk-modal-input');
      const ok = overlay.querySelector('.blk-modal-ok');
      const cancel = overlay.querySelector('.blk-modal-cancel');
      msg.textContent = String(message || '');
      input.style.display = '';
      input.value = defaultValue != null ? String(defaultValue) : '';
      overlay.style.display = 'flex';
      input.focus(); input.select();
      function finish(result) {
        overlay.style.display = 'none';
        ok.removeEventListener('click', onOk);
        cancel.removeEventListener('click', onCancel);
        document.removeEventListener('keydown', onKey);
        try { if (callback) callback(result); } catch (e) { }
      }
      function onOk() { finish(input.value); }
      function onCancel() { finish(null); }
      function onKey(e) { if (e.key === 'Enter') finish(input.value); else if (e.key === 'Escape') finish(null); }
      ok.addEventListener('click', onOk);
      cancel.addEventListener('click', onCancel);
      document.addEventListener('keydown', onKey);
    }

    try {
      if (Blockly.dialog && Blockly.dialog.setPrompt) {
        Blockly.dialog.setAlert(showAlert);
        Blockly.dialog.setConfirm(showConfirm);
        Blockly.dialog.setPrompt(showPrompt);
      } else {
        // Fallback for older Blockly builds
        Blockly.alert = showAlert;
        Blockly.confirm = showConfirm;
        Blockly.prompt = showPrompt;
      }
    } catch (e) { /* ignore */ }
  })();

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
    // Post-process: convert separate var declarations + first assignment into inline init.
    // And use 'let' instead of 'var' for declarations.
    // Example: "var x;" somewhere and later "x = 0;" -> become "let x = 0;" (and remove that first assignment)
    try {
      // Collect all var declaration lines and their variables
      const declRe = /^\s*var\s+([^;]+);\s*$/gm;
      const decls = [];
      let m;
      while ((m = declRe.exec(code)) !== null) {
        const full = m[0];
        const list = m[1] || '';
        const names = list.split(',').map(s => s.trim()).filter(Boolean);
        decls.push({ index: m.index, length: full.length, names });
      }
      // Track which names we inlined and the positions of their first assignment
      const inlined = new Map(); // name -> { start, end, value }
      decls.forEach(d => {
        d.names.forEach(name => {
          if (!/^[$A-Za-z_][\w$]*$/.test(name)) return;
          if (inlined.has(name)) return;
          // Find first assignment not already declaring (avoid 'var name =')
          const assignRe = new RegExp('(^|\\n)([\\t ]*)' + name.replace(/[$]/g, '\\$&') + '\\s*=\\s*([^;]+);');
          const mm = assignRe.exec(code);
          if (mm && mm[0]) {
            // Ensure it's not a 'var name =' occurrence
            const before = code.slice(Math.max(0, (mm.index - 5)), mm.index);
            if (!/var\s+$/.test(before)) {
              const start = mm.index + mm[1].length; // after line break if any
              const indent = mm[2] || '';
              const value = (mm[3] || '').trim();
              const end = mm.index + mm[0].length;
              inlined.set(name, { start, end, indent, value });
            }
          }
        });
      });
      if (inlined.size) {
        // Rebuild code by:
        // 1) Removing/reducing var declaration lines to exclude inlined names
        // 2) Replacing the first assignment with inline 'var name = value;'
        // Step 2 first (adjust indices by building a new string)
        let rebuilt = '';
        let cursor = 0;
        const replacements = Array.from(inlined.entries()).map(([name, info]) => ({
          start: info.start, end: info.end, text: info.indent + 'let ' + name + ' = ' + info.value + ';'
        })).sort((a, b) => a.start - b.start);
        replacements.forEach(r => {
          if (r.start < cursor) return; // overlap safety
          rebuilt += code.slice(cursor, r.start) + r.text;
          cursor = r.end;
        });
        rebuilt += code.slice(cursor);
        code = rebuilt;
        // Step 1: update var declaration lines
        code = code.replace(declRe, (full, list) => {
          const names = (list || '').split(',').map(s => s.trim()).filter(Boolean);
          const kept = names.filter(n => !inlined.has(n));
          if (!kept.length) return '';
          return 'let ' + kept.join(', ') + ';';
        });
      }
    } catch (e) { /* ignore post-process errors */ }
    // Convert any for-loop headers to use let instead of var (e.g., for (var i = ...)
    try {
      code = code.replace(/\bfor\s*\(\s*var\b/g, 'for (let');
    } catch (e) { /* ignore */ }
    // Convert standalone var declarations at line start to let (e.g., "var i;" -> "let i;")
    try {
      code = code.replace(/(^|\n)([\t ]*)var\b/g, '$1$2let');
    } catch (e) { /* ignore */ }
    // Fold standalone loop var declaration into for-header: let i;\nfor (i = ...; ...; ...) -> for (let i = ...; ...; ...)
    try {
      code = code.replace(
        /(^|\n)([\t ]*)let\s+([A-Za-z_$][\w$]*)\s*;\s*\n([\t ]*)for\s*\(\s*\3\s*=\s*([^;]+);\s*([^;]*);\s*([^\)]*)\)/g,
        function (_m, p1, indentDecl, varName, indentFor, initExpr, condExpr, incrExpr) {
          const indent = indentFor || indentDecl || '';
          return `${p1}${indent}for (let ${varName} = ${initExpr}; ${condExpr}; ${incrExpr})`;
        }
      );
    } catch (e) { /* ignore */ }
    // If post-processing created leading blank lines (e.g., removed a first-line var decl),
    // trim them and shift the lineMap accordingly to keep highlights aligned.
    try {
      const parts = code.split(/\r?\n/);
      let leadEmpty = 0;
      for (let i = 0; i < parts.length; i++) {
        if ((parts[i] || '').trim().length === 0) leadEmpty++;
        else break;
      }
      if (leadEmpty > 0) {
        code = parts.slice(leadEmpty).join('\n');
        if (Array.isArray(lineMap) && lineMap.length) {
          for (let i = 0; i < lineMap.length; i++) {
            lineMap[i].line = Math.max(1, lineMap[i].line - leadEmpty);
          }
        }
      }
    } catch (e) { /* ignore */ }
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
      // Only apply a consistent color to primitive value blocks as a UX aid.
      // Do NOT override colors of other blocks (e.g., p5_setup/p5_draw)
      // with the category color from JSON; preserve the block's own color.
      if (VALUE_TYPES.indexOf(type) >= 0) {
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

  // --- Default shadows: fill required slots with typed defaults ---
  function getOptionalArrayForBlock(block) {
    try {
      if (!block || !block.type || !window.P5_PARAM_OPTIONAL) return [];
      if (typeof block.type === 'string' && block.type.startsWith('p5_auto_')) {
        const fn = block.type.slice('p5_auto_'.length);
        const arr = window.P5_PARAM_OPTIONAL[fn];
        return Array.isArray(arr) ? arr : [];
      }
    } catch (e) { }
    return [];
  }

  function getTypeArrayForBlock(block) {
    try {
      if (!block || !block.type || !window.P5_PARAM_TYPE) return [];
      if (typeof block.type === 'string' && block.type.startsWith('p5_auto_')) {
        const fn = block.type.slice('p5_auto_'.length);
        const arr = window.P5_PARAM_TYPE[fn];
        return Array.isArray(arr) ? arr : [];
      }
    } catch (e) { }
    return [];
  }

  function ensureDefaultTypedShadows(block) {
    try {
      if (!block || typeof block.getInput !== 'function') return;
      if (!(typeof block.type === 'string' && block.type.startsWith('p5_auto_'))) return;
      const optArr = getOptionalArrayForBlock(block);
      const typeArr = getTypeArrayForBlock(block);
      for (let i = 0; i < 64; i++) {
        const inpName = 'ARG' + i;
        const inp = block.getInput(inpName);
        if (!inp) break;
        const isOptional = !!optArr[i];
        if (isOptional) continue;
        try {
          const conn = inp.connection;
          if (!conn) continue;
          if (conn.targetConnection) continue; // already connected
          const kind = (typeArr[i] || 'other');
          let shadow = null;
          if (kind === 'number') {
            shadow = ws.newBlock('math_number');
            try { shadow.setFieldValue('0', 'NUM'); } catch (e) { }
          } else if (kind === 'string') {
            shadow = ws.newBlock('text');
            try { shadow.setFieldValue('abc', 'TEXT'); } catch (e) { }
          } else if (kind === 'boolean') {
            shadow = ws.newBlock('logic_boolean');
            try { shadow.setFieldValue('TRUE', 'BOOL'); } catch (e) { }
          } else {
            continue; // unknown type, skip default
          }
          // Ensure default blocks are movable (not shadow)
          try { if (typeof shadow.setShadow === 'function') shadow.setShadow(false); } catch (e) { }
          try { shadow.initSvg && shadow.initSvg(); } catch (e) { }
          try { shadow.render && shadow.render(); } catch (e) { }
          try { conn.connect(shadow.outputConnection); } catch (e) { }
        } catch (e) { /* ignore each input errors */ }
      }
    } catch (e) { /* ignore */ }
  }

  // Ensure repeat blocks have a default of 10 for the times input
  function ensureRepeatDefaults(block) {
    try {
      if (!block || !block.type) return;
      if (block.type === 'controls_repeat_ext') {
        const inp = block.getInput && block.getInput('TIMES');
        try {
          const conn = inp && inp.connection;
          if (conn && !conn.targetConnection) {
            const nb = ws.newBlock('math_number');
            try { nb.setFieldValue('10', 'NUM'); } catch (e) { }
            try { if (typeof nb.setShadow === 'function') nb.setShadow(false); } catch (e) { }
            try { nb.initSvg && nb.initSvg(); } catch (e) { }
            try { nb.render && nb.render(); } catch (e) { }
            try { conn.connect(nb.outputConnection); } catch (e) { }
          }
        } catch (e) { }
      } else if (block.type === 'controls_repeat') {
        try { if (typeof block.setFieldValue === 'function') block.setFieldValue('10', 'TIMES'); } catch (e) { }
      }
    } catch (e) { /* ignore */ }
  }

  // Ensure 'for' blocks have defaults: FROM=0, TO=1, BY=1 when empty
  function ensureForDefaults(block) {
    try {
      if (!block || block.type !== 'controls_for') return;
      function ensureNumInput(name, value) {
        try {
          const inp = block.getInput && block.getInput(name);
          const conn = inp && inp.connection;
          if (conn && !conn.targetConnection) {
            const nb = ws.newBlock('math_number');
            try { nb.setFieldValue(String(value), 'NUM'); } catch (e) { }
            try { if (typeof nb.setShadow === 'function') nb.setShadow(false); } catch (e) { }
            try { nb.initSvg && nb.initSvg(); } catch (e) { }
            try { nb.render && nb.render(); } catch (e) { }
            try { conn.connect(nb.outputConnection); } catch (e) { }
          }
        } catch (e) { /* ignore */ }
      }
      ensureNumInput('FROM', 0);
      ensureNumInput('TO', 1);
      ensureNumInput('BY', 1);
    } catch (e) { /* ignore */ }
  }

  function recolorFlyoutVisuals() {
    try {
      // Find selected category name in the toolbox
      let selectedName = null;
      try {
        const selected = document.querySelector('.blocklyTreeRow.blocklyTreeSelected .blocklyTreeLabel');
        if (selected && selected.textContent) selectedName = selected.textContent.trim();
      } catch (e) { }
      const fillColor = (selectedName && JSON_NAME_COLOUR.get(selectedName)) || VALUES_COLOR;
      // Color any SVG paths in the flyout that represent block backgrounds
      const paths = document.querySelectorAll('.blocklyFlyout .blocklyPath, .blocklyFlyout .blocklyBlockBackground');
      paths.forEach(p => { try { if (p.setAttribute) p.setAttribute('fill', fillColor); } catch (e) { } });
      // Ensure flyout text is readable
      const texts = document.querySelectorAll('.blocklyFlyout .blocklyText');
      texts.forEach(t => {
        try {
          // Hide default 'do'/'then' labels in the flyout as well
          const tx = (t.textContent || '').trim().toLowerCase();
          if (tx === 'do' || tx === 'then') {
            t.textContent = '';
          }
          t.setAttribute('fill', '#000');
        } catch (e) { }
      });
    } catch (e) { /* ignore */ }
  }

  // Recolor newly created blocks in the main workspace
  ws.addChangeListener(function (e) {
    try {
      if (e.type === Blockly.Events.BLOCK_CREATE || e.type === Blockly.Events.BLOCK_CHANGE) {
        const ids = e.ids || (e.blockId ? [e.blockId] : []);
        ids.forEach(id => {
          try {
            const b = ws.getBlockById(id);
            if (b) {
              applyBlockColorIfMapped(b);
              // Also sanitize away any 'do'/'then' label fields on this block
              try { sanitizeBlockDoThenLabels(b); } catch (e) { }
              // Fill required slots with typed default shadows
              try { ensureDefaultTypedShadows(b); } catch (e) { }
              // Ensure repeat blocks default to 10 times
              try { ensureRepeatDefaults(b); } catch (e) { }
              // Ensure for blocks default to from 0 to 1 by 1
              try { ensureForDefaults(b); } catch (e) { }
            }
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
    try { sanitizeWorkspaceDoThenLabels(); } catch (e) { }
    try {
      const all = ws.getAllBlocks(false);
      all.forEach(b => { try { ensureDefaultTypedShadows(b); ensureRepeatDefaults(b); ensureForDefaults(b); } catch (e) { } });
    } catch (e) { }
  }, 200);

  // --- Label sanitizers: remove 'do'/'then' labels from existing blocks ---
  function sanitizeBlockDoThenLabels(block) {
    try {
      if (!block || !block.inputList) return;
      block.inputList.forEach(input => {
        try {
          const row = input.fieldRow || [];
          row.forEach(field => {
            try {
              // Match label-like fields with the text 'do' or 'then'
              const val = (typeof field.getValue === 'function' ? field.getValue() : field.getText ? field.getText() : '') || '';
              const txt = ('' + val).trim().toLowerCase();
              if (txt === 'do' || txt === 'then') {
                if (typeof field.setValue === 'function') field.setValue('');
                else if (typeof field.setText === 'function') field.setText('');
              }
            } catch (e) { /* ignore field errors */ }
          });
        } catch (e) { /* ignore input errors */ }
      });
      try { if (typeof block.render === 'function') block.render(); } catch (e) { }
    } catch (e) { /* ignore */ }
  }

  function sanitizeWorkspaceDoThenLabels() {
    try {
      const all = ws.getAllBlocks(false);
      all.forEach(b => { try { sanitizeBlockDoThenLabels(b); } catch (e) { } });
    } catch (e) { /* ignore */ }
  }

  // --- Override: set default colour on Value-types or JSON mapped blocks on init ---
  try {
    VALUE_TYPES.forEach(type => {
      try {
        const def = Blockly.Blocks && Blockly.Blocks[type];
        if (def && typeof def.init === 'function') {
          const orig = def.init;
          def.init = function () {
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
          paths.forEach(p => { try { p.removeAttribute('stroke'); p.removeAttribute('stroke-width'); } catch (e) { } });
        } catch (e) { }
        // Remove any 'do'/'then' labels from blocks after load
        try { sanitizeWorkspaceDoThenLabels(); } catch (e) { }
        // Ensure default typed values on required slots after load
        try {
          const all = ws.getAllBlocks(false);
          all.forEach(b => { try { ensureDefaultTypedShadows(b); ensureRepeatDefaults(b); ensureForDefaults(b); } catch (e) { } });
        } catch (e) { }
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
            all.forEach(bl => { try { if (typeof bl.setHighlighted === 'function') bl.setHighlighted(false); } catch (e) { } });
          } catch (e) { }
          if (b) {
            // Highlight current block without relying on selection state
            try { if (typeof b.setHighlighted === 'function') b.setHighlighted(true); } catch (e) { }
            // Scroll into view
            try { b.workspace.centerOnBlock(b.id); } catch (e) { }
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
            all.forEach(bl => { try { if (typeof bl.setHighlighted === 'function') bl.setHighlighted(false); } catch (e) { } });
          } catch (e) { }
          try { if (Blockly && Blockly.common && typeof Blockly.common.setSelected === 'function') Blockly.common.setSelected(null); } catch (e) { }
          // Also clear any visual stroke outlines that may remain from earlier tests
          try {
            const paths = document.querySelectorAll('.blocklyWorkspace .blocklyPath, .blocklyWorkspace .blocklyBlockBackground');
            paths.forEach(p => { try { p.removeAttribute('stroke'); p.removeAttribute('stroke-width'); } catch (e) { } });
          } catch (e) { }
        } catch (e) { /* ignore */ }
      }
    });
  } catch (e) { /* ignore */ }

})();
