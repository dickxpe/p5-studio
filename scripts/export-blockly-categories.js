/*
Exports a JSON list of all Blockly categories with their blocks,
combining static toolbox categories and dynamically generated p5 categories
based on the p5types mapping used by the extension.
Writes to blockly/blockly_categories.json
*/

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BLOCKLY_DIR = path.join(ROOT, 'blockly');
const P5TYPES_SRC = path.join(ROOT, 'p5types', 'src');

function readToolboxObject() {
  const toolboxJsPath = path.join(BLOCKLY_DIR, 'toolbox.js');
  const code = fs.readFileSync(toolboxJsPath, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'toolbox.js' });
  const tb = sandbox.window.toolbox;
  if (!tb || !Array.isArray(tb.contents)) {
    throw new Error('Failed to load toolbox contents');
  }
  return tb;
}

function parseP5InstanceMethodsFromDts(text) {
  const out = new Set();
  const ifaceIdx = text.indexOf('interface p5InstanceExtensions');
  if (ifaceIdx >= 0) {
    const tail = text.slice(ifaceIdx);
    const braceStart = tail.indexOf('{');
    if (braceStart >= 0) {
      const body = tail.slice(braceStart + 1);
      const rx = /\n\s*([a-zA-Z_][\w]*)\s*\(/g;
      let m;
      while ((m = rx.exec(body))) {
        const name = m[1];
        if (name && name !== 'constructor') out.add(name);
      }
    }
  }
  return Array.from(out);
}

function buildP5CategoryMap() {
  const map = {};
  const topFolders = [
    'color','core','data','dom','events','image','io','math','typography','utilities','webgl'
  ];
  const labelForFolder = {
    color: 'Color',
    core: 'Core',
    data: 'Data',
    dom: 'DOM',
    events: 'Events',
    image: 'Image',
    io: 'IO',
    math: 'Math',
    typography: 'Typography',
    utilities: 'Utilities',
    webgl: 'WebGL',
  };
  function addFile(filePath, label){
    const text = fs.readFileSync(filePath, 'utf8');
    const names = parseP5InstanceMethodsFromDts(text);
    names.forEach(n => { if (!map[n]) map[n] = label; });
  }
  for (const folder of topFolders) {
    const abs = path.join(P5TYPES_SRC, folder);
    if (!fs.existsSync(abs)) continue;
    const label = labelForFolder[folder] || folder;
    const entries = fs.readdirSync(abs);
    for (const entry of entries) {
      const full = path.join(abs, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        let subLabel = label;
        if (folder === 'core') {
          const low = entry.toLowerCase();
          if (low.includes('shape')) subLabel = 'Shape';
          else if (low.includes('structure')) subLabel = 'Structure';
          else if (low.includes('transform')) subLabel = 'Transform';
          else if (low.includes('environment')) subLabel = 'Environment';
          else if (low.includes('render')) subLabel = 'Rendering';
          else if (low.includes('constants')) subLabel = 'Constants';
        } else if (folder === 'webgl') {
          subLabel = 'WebGL';
        }
        const subFiles = fs.readdirSync(full);
        for (const f of subFiles) {
          if (f.endsWith('.d.ts')) addFile(path.join(full, f), subLabel);
        }
      } else if (entry.endsWith('.d.ts')) {
        addFile(full, label);
      }
    }
  }
  return map;
}

function extractStaticCategories(tb) {
  const cats = [];
  for (const item of tb.contents) {
    if (!item || item.kind !== 'category') continue;
    const cat = { name: item.name, colour: item.colour, categorystyle: item.categorystyle };
    if (item.custom) {
      cat.custom = item.custom;
      cat.blocks = [];
    } else if (Array.isArray(item.contents)) {
      cat.blocks = item.contents.filter(e => e && e.kind === 'block').map(e => e.type);
    } else {
      cat.blocks = [];
    }
    cats.push(cat);
  }
  return cats;
}

function buildDynamicP5Categories(p5Map) {
  const grouped = {};
  for (const [name, cat] of Object.entries(p5Map)) {
    const blockType = 'p5_auto_' + name;
    const key = 'p5 · ' + (cat || 'Uncategorized');
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(blockType);
  }
  // Stable order similar to the webview
  const order = ['Structure','Color','Shape','Transform','Environment','Rendering','Image','Typography','Math','Data','IO','DOM','Events','Utilities','WebGL','Core','Uncategorized','Constants'];
  const result = [];
  const colourBy = {
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
  const presentCats = new Set(Object.keys(grouped).map(n => n.replace(/^p5 ·\s*/, '')));
  const ordered = order.filter(n => presentCats.has(n)).concat(Array.from(presentCats).filter(n => !order.includes(n)));
  for (const cat of ordered) {
    const name = 'p5 · ' + cat;
    const blocks = (grouped[name] || []).sort((a, b) => a.localeCompare(b));
    result.push({ name, colour: colourBy[cat] || '#9E9E9E', blocks });
  }
  // Add globals/constants category similar to the webview (block types only)
  result.push({ name: 'p5 globals & constants', colour: '#ffd180', blocks: ['p5_global_number','p5_global_boolean','p5_global_string','p5_constant'] });
  return result;
}

function main() {
  const tb = readToolboxObject();
  const staticCats = extractStaticCategories(tb);
  // Populate Quickstart like the webview does
  const qs = staticCats.find(c => c.name === 'p5 Quickstart');
  if (qs) {
    qs.blocks = ['p5_draw','p5_setup','p5_auto_createCanvas','p5_auto_background'];
  }
  const p5Map = buildP5CategoryMap();
  const dynCats = buildDynamicP5Categories(p5Map);

  // Merge: keep static first, then dynamic p5 categories appended
  const all = [...staticCats, ...dynCats];
  const outPath = path.join(BLOCKLY_DIR, 'blockly_categories.json');
  fs.writeFileSync(outPath, JSON.stringify({ categories: all }, null, 2), 'utf8');
  console.log('Wrote', outPath, 'with', all.length, 'categories');
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('Export failed:', e); process.exit(1); }
}
