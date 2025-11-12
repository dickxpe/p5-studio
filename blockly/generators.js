/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

(function () {
  const gen = javascript.javascriptGenerator;
  const Order = gen.Order || javascript.Order;

  gen.forBlock['output'] = (b, g) => `output(${v(g, b, 'TEXT')});\n`;
  // Value block: returns the entered value from the prompt (no parameters)
  gen.forBlock['inputprompt'] = (b, g) => [`inputPrompt()`, (Order ? Order.NONE : gen.ORDER_NONE)];


  // p5: structure
  gen.forBlock['p5_setup'] = function (block, generator) {
    const statements = generator.statementToCode(block, 'DO');
    return `function setup() {\n${statements}}\n`;
  };
  gen.forBlock['p5_draw'] = function (block, generator) {
    const statements = generator.statementToCode(block, 'DO');
    return `function draw() {\n${statements}}\n`;
  };
  gen.forBlock['p5_windowResized'] = function (block, generator) {
    const statements = generator.statementToCode(block, 'DO');
    return `function windowResized() {\n${statements}}\n`;
  };

  // helpers for values
  function v(genr, blk, name) { return genr.valueToCode(blk, name, Order ? Order.NONE : gen.ORDER_NONE) || '0'; }
  function s(genr, blk, name) { return genr.valueToCode(blk, name, Order ? Order.NONE : gen.ORDER_NONE) || "''"; }

  // p5: environment/canvas
  gen.forBlock['p5_createCanvas'] = (b, g) => `createCanvas(${v(g, b, 'W')}, ${v(g, b, 'H')});\n`;
  gen.forBlock['p5_frameRate'] = (b, g) => `frameRate(${v(g, b, 'FPS')});\n`;
  gen.forBlock['p5_clear'] = () => `clear();\n`;

  // p5: color & style
  gen.forBlock['p5_background'] = (b, g) => `background(${v(g, b, 'C')});\n`;
  gen.forBlock['p5_fill'] = (b, g) => `fill(${v(g, b, 'C')});\n`;
  gen.forBlock['p5_noFill'] = () => `noFill();\n`;
  gen.forBlock['p5_stroke'] = (b, g) => `stroke(${v(g, b, 'C')});\n`;
  gen.forBlock['p5_noStroke'] = () => `noStroke();\n`;
  gen.forBlock['p5_strokeWeight'] = (b, g) => `strokeWeight(${v(g, b, 'W')});\n`;

  // p5: shapes
  gen.forBlock['p5_rect'] = (b, g) => `rect(${v(g, b, 'X')}, ${v(g, b, 'Y')}, ${v(g, b, 'W')}, ${v(g, b, 'H')});\n`;
  gen.forBlock['p5_circle'] = (b, g) => `circle(${v(g, b, 'X')}, ${v(g, b, 'Y')}, ${v(g, b, 'D')});\n`;
  gen.forBlock['p5_ellipse'] = (b, g) => `ellipse(${v(g, b, 'X')}, ${v(g, b, 'Y')}, ${v(g, b, 'W')}, ${v(g, b, 'H')});\n`;
  gen.forBlock['p5_line'] = (b, g) => `line(${v(g, b, 'X1')}, ${v(g, b, 'Y1')}, ${v(g, b, 'X2')}, ${v(g, b, 'Y2')});\n`;

  // p5: transform
  gen.forBlock['p5_push'] = () => `push();\n`;
  gen.forBlock['p5_pop'] = () => `pop();\n`;
  gen.forBlock['p5_translate'] = (b, g) => `translate(${v(g, b, 'X')}, ${v(g, b, 'Y')});\n`;
  gen.forBlock['p5_rotate'] = (b, g) => `rotate(${v(g, b, 'A')});\n`;

  // p5: typography
  gen.forBlock['p5_text'] = (b, g) => `text(${s(g, b, 'S')}, ${v(g, b, 'X')}, ${v(g, b, 'Y')});\n`;
  gen.forBlock['p5_textSize'] = (b, g) => `textSize(${v(g, b, 'SZ')});\n`;

  // Override default loop generators to use let instead of var in for-headers
  try {
    const origControlsFor = gen.forBlock['controls_for'];
    gen.forBlock['controls_for'] = function (block, generator) {
      try {
        const out = origControlsFor ? origControlsFor.call(this, block, generator) : javascript.javascriptGenerator.forBlock['controls_for'](block, generator);
        if (typeof out === 'string') return out.replace(/for \(var\s+/, 'for (let ');
        return out;
      } catch (e) {
        // Fallback: minimal for-loop code using let
        const variable = block.getFieldValue('VAR') || 'i';
        const from = generator.valueToCode(block, 'FROM', Order ? Order.NONE : gen.ORDER_NONE) || '0';
        const to = generator.valueToCode(block, 'TO', Order ? Order.NONE : gen.ORDER_NONE) || '0';
        const by = generator.valueToCode(block, 'BY', Order ? Order.NONE : gen.ORDER_NONE) || '1';
        const branch = generator.statementToCode(block, 'DO');
        return `for (let ${variable} = ${from}; ${variable} <= ${to}; ${variable} += ${by}) {\n${branch}}\n`;
      }
    };
  } catch (e) { }

  try {
    const origControlsForEach = gen.forBlock['controls_forEach'];
    gen.forBlock['controls_forEach'] = function (block, generator) {
      try {
        const out = origControlsForEach ? origControlsForEach.call(this, block, generator) : javascript.javascriptGenerator.forBlock['controls_forEach'](block, generator);
        if (typeof out === 'string') return out.replace(/for \(var\s+/, 'for (let ');
        return out;
      } catch (e) {
        // Fallback minimal implementation
        const variable = block.getFieldValue('VAR') || 'x';
        const list = generator.valueToCode(block, 'LIST', Order ? Order.NONE : gen.ORDER_NONE) || '[]';
        const branch = generator.statementToCode(block, 'DO');
        return `for (let ${variable} of ${list}) {\n${branch}}\n`;
      }
    };
  } catch (e) { }
})();
