/**
 * Auto-generate Blockly blocks for all p5.js functions available in global mode.
 * Enumerates a temporary p5 instance and creates blocks: p5_auto_<name>
 */
(function(){
  // Build an allowlist Set from window.ALLOWED_BLOCKS if present
  var _ALLOWED_SET = null;
  try {
    if (window && Array.isArray(window.ALLOWED_BLOCKS)) {
      _ALLOWED_SET = new Set(window.ALLOWED_BLOCKS);
    }
  } catch(_) {}
  function isAllowedBlock(type){
    if (!_ALLOWED_SET) return true; // no filter
    try { return _ALLOWED_SET.has(type); } catch(_) { return true; }
  }
  // --- Always register setup and draw blocks ---
  if (typeof Blockly !== 'undefined' && Blockly.Blocks) {
    // List of common p5 event/lifecycle functions to add as blocks
    const p5Events = [
      'setup', 'draw',
      'mouseMoved', 'mouseDragged', 'mousePressed', 'mouseReleased', 'mouseClicked',
      'doubleClicked', 'mouseWheel',
      'keyPressed', 'keyReleased', 'keyTyped',
      'windowResized', 'preload', 'touchStarted', 'touchMoved', 'touchEnded',
      'deviceMoved', 'deviceTurned', 'deviceShaken',
      'resized', 'focused', 'unfocused', 'blurred', 'entered', 'exited',
      // Add more as needed
    ];
    p5Events.forEach(fn => {
      const blockType = `p5_${fn}`;
      if (!Blockly.Blocks[blockType]) {
        Blockly.Blocks[blockType] = {
          init: function() {
            this.appendDummyInput().appendField(fn + '()');
            this.appendStatementInput('DO').setCheck(null);
            this.setNextStatement(true, null);
            this.setColour('#BA68C8');
            this.setTooltip(`p5.js ${fn}() function`);
            this.setHelpUrl(`https://p5js.org/reference/#/p5/${fn}`);
          }
        };
      }
    });
    Blockly.Blocks['p5_draw'] = {
      init: function() {
        this.appendDummyInput().appendField('draw');
        this.appendStatementInput('DO').setCheck(null);
        this.setNextStatement(true, null);
        this.setColour('#BA68C8');
        this.setTooltip('p5.js draw() function');
        this.setHelpUrl('https://p5js.org/reference/#/p5/draw');
      }
    };
    Blockly.Blocks['p5_setup'] = {
      init: function() {
  this.appendDummyInput().appendField('setup');
  this.appendStatementInput('DO').setCheck(null);
        this.setNextStatement(true, null);
        this.setColour('#BA68C8');
        this.setTooltip('p5.js setup() function');
        this.setHelpUrl('https://p5js.org/reference/#/p5/setup');
      }
    };
    Blockly.Blocks['p5_auto_draw'] = {
      init: function() {
  this.appendDummyInput().appendField('draw');
  this.appendStatementInput('DO').setCheck(null);
        this.setNextStatement(true, null);
        this.setColour('#BA68C8');
        this.setTooltip('p5.js draw() function');
        this.setHelpUrl('https://p5js.org/reference/#/p5/draw');
      }
    };
    try {
      console.log('[B5] Explicitly registered p5_setup and p5_draw blocks');
    } catch(_) {}
  }
  // Debug: log registration status of key blocks
  const keyBlocks = ['p5_draw', 'p5_setup', 'p5_createCanvas', 'p5_background'];
  keyBlocks.forEach(type => {
    if (Blockly.Blocks && Blockly.Blocks[type]) {
      console.log(`[B5] Registered block: ${type}`);
    } else {
      console.warn(`[B5] Block NOT registered: ${type}`);
    }
  });
  // Prefer the function list from the type map provided by the host
  function enumerateFromTypeMap(){
    try {
      const catMap = (window && window.P5_CATEGORY_MAP) || {};
      const names = Object.keys(catMap || {});
      return names.filter(n => typeof n === 'string' && /^[a-z][A-Za-z0-9_]*$/.test(n));
    } catch(_) { return []; }
  }

  const exclude = new Set([
    'constructor','_setup','_draw','_onresize','_onmousedown','_onmouseup','_onmousemove','_onkeydown','_onkeyup','_onkeypress',
    // noisy or internal-ish
    '__defineSetter__','__defineGetter__','__lookupGetter__','__lookupSetter__','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','toLocaleString','toString','valueOf'
  ]);
  const names = enumerateFromTypeMap();

  // Filter to likely p5 API: lowercase names, exclude internal/underscored
  const api = names.filter(n => typeof n === 'string' && /^[a-z][A-Za-z0-9_]*$/.test(n) && !n.startsWith('_') && !exclude.has(n));
  api.sort();
  try { console.log('[B5] p5 auto-blocks: discovered functions =', api.length); } catch(_) {}

  // Build blocks and generators dynamically
  const blocks = [];
  const categoryContents = [];
  const groupedContents = {}; // category -> array of toolbox entries

  // Category color mapping (same as toolbox)
  const CATEGORY_COLORS = {
    'Color': '#F06292',
    'Structure': '#BA68C8',
    'Shape': '#64B5F6',
    'Transform': '#4DB6AC',
    'Environment': '#81C784',
    'Rendering': '#AED581',
    'Data': '#FFD54F',
    'DOM': '#FFB74D',
    'Events': '#FF8A65',
    'Image': '#A1887F',
    'IO': '#90A4AE',
    'Math': '#9575CD',
    'Typography': '#4FC3F7',
    'Utilities': '#4DB6AC',
    'WebGL': '#7986CB',
    'Core': '#90CAF9',
    'Uncategorized': '#B0BEC5',
    'Constants': '#E0E0E0'
  };

  api.forEach(name => {
    try {
      const paramMap = (window && window.P5_PARAM_MAP) || {};
      const catMap = (window && window.P5_CATEGORY_MAP) || {};
      const paramNames = Array.isArray(paramMap[name]) ? paramMap[name] : [];
      let arity = paramNames.length; // do not rely on fn.length (no p5 instance needed)
      if (arity > 8) arity = 8;
      const type = 'p5_auto_' + name;

      // Determine category and color
      const category = catMap[name] || 'Uncategorized';
      const blockColor = CATEGORY_COLORS[category] || 15;

      // Multi-line: function name on top, each parameter on its own line
      const blockDef = {
        type,
        message0: name,
        previousStatement: null,
        nextStatement: null,
        colour: blockColor,
        tooltip: 'p5.' + name,
        inputsInline: false
      };
      const inputNames = [];
      for (let i = 0; i < arity; i++) {
        const label = (paramNames[i] || ('arg' + (i+1))).replace(/_/g, ' ');
        const keyM = 'message' + (i + 1);
        const keyA = 'args' + (i + 1);
        blockDef[keyM] = label + ' %1';
        const inpName = 'ARG' + i;
        inputNames.push(inpName);
        blockDef[keyA] = [ { type: 'input_value', name: inpName } ];
      }
      blocks.push(blockDef);

      // Register generator
      // Always register a generator for every block, even if javascriptGenerator is not yet loaded
      function registerGenerator() {
        if (!(window.javascript && javascript.javascriptGenerator)) return;
        const gen = javascript.javascriptGenerator;
        const Order = gen.Order || javascript.Order;
        gen.forBlock[type] = function(block, generator){
          const args = [];
          // Only use inputs that actually exist on the block
          for (let i = 0; i < 32; i++) {
            if (!block.getInput('ARG' + i)) break;
            const code = generator.valueToCode(block, 'ARG' + i, Order ? Order.NONE : gen.ORDER_NONE);
            args.push(code);
          }
          // Remove trailing empty/undefined args (optional params)
          let lastNonEmpty = args.length - 1;
          while (lastNonEmpty >= 0 && (!args[lastNonEmpty] || args[lastNonEmpty].trim() === '')) {
            lastNonEmpty--;
          }
          const trimmedArgs = args.slice(0, lastNonEmpty + 1).map(a => a || '');
          return name + '(' + trimmedArgs.join(', ') + ');\n';
        };
      }
      // If generator is available now, register immediately; otherwise, defer until ready
      if (window.javascript && javascript.javascriptGenerator) {
        registerGenerator();
      } else {
        // Defer registration until javascriptGenerator is loaded
        (window._p5AutoBlockGenQueue = window._p5AutoBlockGenQueue || []).push(registerGenerator);
      }
// If any generators were queued before javascriptGenerator loaded, register them now
if (window._p5AutoBlockGenQueue && window.javascript && javascript.javascriptGenerator) {
  window._p5AutoBlockGenQueue.forEach(fn => { try { fn(); } catch(_) {} });
  window._p5AutoBlockGenQueue = [];
}

      // Toolbox entry (respect allowlist)
      const inputs = {};
      inputNames.forEach(n => {
        inputs[n] = { shadow: { type: 'math_number', fields: { NUM: 0 } } };
      });
      const entry = { kind: 'block', type };
      if (isAllowedBlock(type)) {
        categoryContents.push(entry);
      }
      // Group by official p5 category if mapping provided
      try {
        const catMap = (window && window.P5_CATEGORY_MAP) || {};
        const category = catMap[name] || 'Uncategorized';
        if (!groupedContents[category]) groupedContents[category] = [];
        if (isAllowedBlock(type)) groupedContents[category].push(entry);
      } catch(_) {}
    } catch(_) {}
  });

  try { if (blocks.length) Blockly.defineBlocksWithJsonArray(blocks); } catch(_) {}

  // ---- Globals and constants ----
  const NUM_GLOBALS = [
    'width','height','frameCount','frameRate','deltaTime','mouseX','mouseY','pmouseX','pmouseY',
    'winMouseX','winMouseY','pwinMouseX','pwinMouseY','accelerationX','accelerationY','accelerationZ',
    'pAccelerationX','pAccelerationY','pAccelerationZ','rotationX','rotationY','rotationZ','pRotationX',
    'pRotationY','pRotationZ','movedX','movedY','movedZ','displayWidth','displayHeight','windowWidth','windowHeight'
  ];
  const BOOL_GLOBALS = [ 'mouseIsPressed','keyIsPressed' ];
  const STR_GLOBALS = [ 'key','mouseButton' ];

  // Do not filter known globals by current existence; many are defined after setup() or first draw.
  // Provide them unconditionally so users can wire them where appropriate.
  const numOpts = NUM_GLOBALS.map(n => [n, n]);
  const boolOpts = BOOL_GLOBALS.map(n => [n, n]);
  const strOpts = STR_GLOBALS.map(n => [n, n]);

  const CONSTS = [];
  try {
    const candidates = Object.getOwnPropertyNames(window).concat((window.p5 && window.p5.prototype) ? Object.getOwnPropertyNames(window.p5.prototype) : []);
    const uniq = Array.from(new Set(candidates));
    uniq.forEach(n => {
      try {
        if (/^[A-Z0-9_]+$/.test(n) && typeof window[n] !== 'function') {
          const val = window[n];
          if (['number','string','boolean'].includes(typeof val)) CONSTS.push(n);
        }
      } catch(_) {}
    });
  } catch(_) {}
  // ensure some known ones
  ['PI','TWO_PI','HALF_PI','QUARTER_PI','TAU','DEGREES','RADIANS','DEG_TO_RAD','RAD_TO_DEG'].forEach(n => { if (!CONSTS.includes(n)) CONSTS.push(n); });
  CONSTS.sort();
  const constOpts = CONSTS.map(n => [n, n]);

  const extraBlocks = [];
  if (numOpts.length) extraBlocks.push({
    type: 'p5_global_number',
    message0: 'p5 number %1',
    args0: [ { type: 'field_dropdown', name: 'NAME', options: numOpts } ],
    output: 'Number',
    colour: 30,
    tooltip: 'p5 numeric global',
  });
  if (boolOpts.length) extraBlocks.push({
    type: 'p5_global_boolean',
    message0: 'p5 boolean %1',
    args0: [ { type: 'field_dropdown', name: 'NAME', options: boolOpts } ],
    output: 'Boolean',
    colour: 30,
    tooltip: 'p5 boolean global',
  });
  if (strOpts.length) extraBlocks.push({
    type: 'p5_global_string',
    message0: 'p5 string %1',
    args0: [ { type: 'field_dropdown', name: 'NAME', options: strOpts } ],
    output: 'String',
    colour: 30,
    tooltip: 'p5 string global',
  });
  if (constOpts.length) extraBlocks.push({
    type: 'p5_constant',
    message0: 'p5 constant %1',
    args0: [ { type: 'field_dropdown', name: 'NAME', options: constOpts } ],
    output: null,
    colour: 10,
    tooltip: 'p5 constant',
  });

  try { if (extraBlocks.length) Blockly.defineBlocksWithJsonArray(extraBlocks); } catch(_) {}
  if (window.javascript && javascript.javascriptGenerator) {
    const gen = javascript.javascriptGenerator;
    gen.forBlock['p5_global_number'] = (b)=> [b.getFieldValue('NAME') || '0', gen.ORDER_ATOMIC];
    gen.forBlock['p5_global_boolean'] = (b)=> [b.getFieldValue('NAME') || 'false', gen.ORDER_ATOMIC];
    gen.forBlock['p5_global_string'] = (b)=> [b.getFieldValue('NAME') || "''", gen.ORDER_ATOMIC];
    gen.forBlock['p5_constant'] = (b)=> [b.getFieldValue('NAME') || '0', gen.ORDER_ATOMIC];
  }

  // Add a toolbox category at the end
  try {
    if (!window.toolbox) window.toolbox = { kind: 'categoryToolbox', contents: [] };
    const JSON_ONLY = !!(window && window.BLOCKLY_JSON_ONLY);
    if (JSON_ONLY) {
      // Strict JSON: build toolbox only from EXTRA_TOOLBOX_CATEGORIES
      try {
        const cats = window.EXTRA_TOOLBOX_CATEGORIES || [];
        const contents = [];
        cats.forEach(cat => {
          try {
            if (!cat || typeof cat.name !== 'string') return;
            const entry = {
              kind: 'category',
              name: cat.name,
              colour: cat.colour || cat.color || '#9E9E9E',
              categorystyle: cat.categorystyle,
              contents: []
            };
            if (cat.custom) {
              entry.custom = cat.custom;
              entry.contents = [];
            } else if (Array.isArray(cat.blocks)) {
              entry.contents = cat.blocks
                .filter(t => typeof t === 'string' && (!Blockly.Blocks || !!Blockly.Blocks[t]) && isAllowedBlock(t))
                .map(t => ({ kind: 'block', type: t }));
            }
            contents.push(entry);
          } catch(_) {}
        });
        window.toolbox.contents = contents;
        // Update toolbox if workspace exists
        try { const ws = Blockly.getMainWorkspace && Blockly.getMainWorkspace(); if (ws && ws.updateToolbox) ws.updateToolbox(window.toolbox); } catch(_) {}
      } catch(_) {}
      return;
    }
    // Grouped categories based on p5 reference
    const CATEGORY_COLORS = {
      'Color': '#F06292',
      'Structure': '#BA68C8',
      'Shape': '#64B5F6',
      'Transform': '#4DB6AC',
      'Environment': '#81C784',
      'Rendering': '#AED581',
      'Data': '#FFD54F',
      'DOM': '#FFB74D',
      'Events': '#FF8A65',
      'Image': '#A1887F',
      'IO': '#90A4AE',
      'Math': '#9575CD',
      'Typography': '#4FC3F7',
      'Utilities': '#4DB6AC',
      'WebGL': '#7986CB',
      'Core': '#90CAF9',
      'Uncategorized': '#B0BEC5',
      'Constants': '#E0E0E0'
    };
    const orderedCategoryNames = [
      'Structure','Color','Shape','Transform','Environment','Rendering','Image','Typography','Math','Data','IO','DOM','Events','Utilities','WebGL','Core','Uncategorized'
    ];
    // Create categories in a stable order, skipping empties
    orderedCategoryNames.forEach(cat => {
      const contents = groupedContents[cat];
      const filtered = contents ? contents.filter(Boolean) : [];
      if (filtered && filtered.length) {
        window.toolbox.contents.push({
          kind: 'category',
          name: `p5 · ${cat}`,
          colour: CATEGORY_COLORS[cat] || '#9E9E9E',
          contents: filtered
        });
      }
    });
    // // Keep a catch-all flat list at the end for power users
    // window.toolbox.contents.push({
    //   kind: 'category',
    //   name: 'All p5 functions (auto)',
    //   colour: '#ff8a80',
    //   contents: categoryContents
    // });
    // Globals/constants category
 //   const globalsCategory = { kind: 'category', name: 'p5 globals & constants', colour: '#ffd180', contents: [] };
    // if (numOpts.length && isAllowedBlock('p5_global_number')) globalsCategory.contents.push({ kind: 'block', type: 'p5_global_number' });
    // if (boolOpts.length && isAllowedBlock('p5_global_boolean')) globalsCategory.contents.push({ kind: 'block', type: 'p5_global_boolean' });
    // if (strOpts.length && isAllowedBlock('p5_global_string')) globalsCategory.contents.push({ kind: 'block', type: 'p5_global_string' });
    // if (constOpts.length && isAllowedBlock('p5_constant')) globalsCategory.contents.push({ kind: 'block', type: 'p5_constant' });
    // window.toolbox.contents.push(globalsCategory);
    // Append extra categories provided by host JSON (names not already present)
    try {
      const extras = window.EXTRA_TOOLBOX_CATEGORIES;
      if (Array.isArray(extras) && window.toolbox && Array.isArray(window.toolbox.contents)) {
        const existingNames = new Set();
        try {
          window.toolbox.contents.forEach(c => { if (c && c.kind === 'category' && c.name) existingNames.add(c.name); });
        } catch(_) {}
        extras.forEach(cat => {
          try {
            if (!cat || typeof cat.name !== 'string') return;
            if (existingNames.has(cat.name)) return; // don't duplicate existing categories
            const entry = {
              kind: 'category',
              name: cat.name,
              colour: cat.colour || '#9E9E9E',
              categorystyle: cat.categorystyle,
              contents: []
            };
            const blocks = Array.isArray(cat.blocks) ? cat.blocks : [];
            entry.contents = blocks
              .filter(t => typeof t === 'string' && (!Blockly.Blocks || !!Blockly.Blocks[t]) && isAllowedBlock(t))
              .map(t => ({ kind: 'block', type: t }));
            window.toolbox.contents.push(entry);
            existingNames.add(cat.name);
          } catch(_) {}
        });
      }
    } catch(_) {}

    // Reorder categories to match the JSON order if provided
    try {
      const extras = window.EXTRA_TOOLBOX_CATEGORIES;
      if (Array.isArray(extras) && window.toolbox && Array.isArray(window.toolbox.contents)) {
        const desiredOrder = extras.map(c => (c && typeof c.name === 'string') ? c.name : null).filter(Boolean);
        const existing = window.toolbox.contents.slice();
        const catByName = new Map();
        const nonCats = [];
        existing.forEach(item => {
          if (item && item.kind === 'category' && item.name) {
            catByName.set(item.name, item);
          } else {
            nonCats.push(item);
          }
        });
        const newContents = [];
        desiredOrder.forEach(name => {
          if (catByName.has(name)) newContents.push(catByName.get(name));
        });
        // Append any categories not mentioned in JSON to the end, preserving their original relative order
        existing.forEach(item => {
          if (item && item.kind === 'category' && item.name) {
            if (desiredOrder.indexOf(item.name) === -1) newContents.push(item);
          }
        });
        // Optionally append non-category items (like seps) at the end to avoid breaking toolbox
        nonCats.forEach(nc => newContents.push(nc));
        window.toolbox.contents = newContents;
      }
    } catch(_) {}

    // Apply JSON category swatch colors (override existing category colours when provided)
    try {
      const extras = window.EXTRA_TOOLBOX_CATEGORIES;
      if (Array.isArray(extras) && window.toolbox && Array.isArray(window.toolbox.contents)) {
        const colorByName = new Map();
        extras.forEach(c => { if (c && c.name && c.colour) colorByName.set(c.name, c.colour); });
        window.toolbox.contents.forEach(cat => {
          try {
            if (cat && cat.kind === 'category' && cat.name && colorByName.has(cat.name)) {
              cat.colour = colorByName.get(cat.name);
            }
          } catch(_) {}
        });
      }
    } catch(_) {}
    // Filter any pre-existing static toolbox blocks by allowlist
    try {
      if (_ALLOWED_SET && window.toolbox && Array.isArray(window.toolbox.contents)) {
        window.toolbox.contents.forEach(cat => {
          if (!cat || !Array.isArray(cat.contents)) return;
          cat.contents = cat.contents.filter(e => !e || e.kind !== 'block' || isAllowedBlock(e.type));
        });
      }
    } catch(_) {}
    // If a workspace already exists, update its toolbox now
    try {
      const ws = Blockly.getMainWorkspace && Blockly.getMainWorkspace();
      if (ws && ws.updateToolbox) ws.updateToolbox(window.toolbox);
    } catch(_) {}
  } catch(_) {}
})();
