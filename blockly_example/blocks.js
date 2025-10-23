/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

(function(){
  const blocks = [];

  // helper to make number input with shadow default
  function numInput(name) {
    return { type: 'input_value', name, check: 'Number' };
  }

  // Simple text utility (kept)
  blocks.push({
    type: 'add_text',
    message0: 'Add text %1',
    args0: [ { type: 'input_value', name: 'TEXT', check: 'String' } ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
  });

  // p5 Structure
  blocks.push(
    { type: 'p5_setup', message0: 'setup %1 %2', args0: [ { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' } ], colour: 0 },
    { type: 'p5_draw',  message0: 'draw %1 %2',  args0: [ { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' } ], colour: 0 },
  );

  // p5 Canvas & environment
  blocks.push(
    { type: 'p5_createCanvas', message0: 'createCanvas width %1 height %2', args0: [ numInput('W'), numInput('H') ], previousStatement: null, nextStatement: null, colour: 200 },
    { type: 'p5_frameRate', message0: 'frameRate %1', args0: [ numInput('FPS') ], previousStatement: null, nextStatement: null, colour: 200 },
    { type: 'p5_clear', message0: 'clear', args0: [], previousStatement: null, nextStatement: null, colour: 200 },
  );

  // p5 Color & style
  blocks.push(
    { type: 'p5_background', message0: 'background %1', args0: [ numInput('C') ], previousStatement: null, nextStatement: null, colour: 20 },
    { type: 'p5_fill', message0: 'fill %1', args0: [ numInput('C') ], previousStatement: null, nextStatement: null, colour: 20 },
    { type: 'p5_noFill', message0: 'noFill', args0: [], previousStatement: null, nextStatement: null, colour: 20 },
    { type: 'p5_stroke', message0: 'stroke %1', args0: [ numInput('C') ], previousStatement: null, nextStatement: null, colour: 20 },
    { type: 'p5_noStroke', message0: 'noStroke', args0: [], previousStatement: null, nextStatement: null, colour: 20 },
    { type: 'p5_strokeWeight', message0: 'strokeWeight %1', args0: [ numInput('W') ], previousStatement: null, nextStatement: null, colour: 20 },
  );

  // p5 Shapes
  blocks.push(
    { type: 'p5_rect', message0: 'rect x %1 y %2 w %3 h %4', args0: [ numInput('X'), numInput('Y'), numInput('W'), numInput('H') ], previousStatement: null, nextStatement: null, colour: 300 },
    { type: 'p5_circle', message0: 'circle x %1 y %2 d %3', args0: [ numInput('X'), numInput('Y'), numInput('D') ], previousStatement: null, nextStatement: null, colour: 300 },
    { type: 'p5_ellipse', message0: 'ellipse x %1 y %2 w %3 h %4', args0: [ numInput('X'), numInput('Y'), numInput('W'), numInput('H') ], previousStatement: null, nextStatement: null, colour: 300 },
    { type: 'p5_line', message0: 'line x1 %1 y1 %2 x2 %3 y2 %4', args0: [ numInput('X1'), numInput('Y1'), numInput('X2'), numInput('Y2') ], previousStatement: null, nextStatement: null, colour: 300 },
  );

  // p5 Transform
  blocks.push(
    { type: 'p5_push', message0: 'push', args0: [], previousStatement: null, nextStatement: null, colour: 260 },
    { type: 'p5_pop', message0: 'pop', args0: [], previousStatement: null, nextStatement: null, colour: 260 },
    { type: 'p5_translate', message0: 'translate x %1 y %2', args0: [ numInput('X'), numInput('Y') ], previousStatement: null, nextStatement: null, colour: 260 },
    { type: 'p5_rotate', message0: 'rotate %1 (radians)', args0: [ numInput('A') ], previousStatement: null, nextStatement: null, colour: 260 },
  );

  // p5 Typography
  blocks.push(
    { type: 'p5_text', message0: 'text %1 x %2 y %3', args0: [ { type:'input_value', name:'S', check:'String' }, numInput('X'), numInput('Y') ], previousStatement: null, nextStatement: null, colour: 340 },
    { type: 'p5_textSize', message0: 'textSize %1', args0: [ numInput('SZ') ], previousStatement: null, nextStatement: null, colour: 340 },
  );

  Blockly.defineBlocksWithJsonArray(blocks);
})();
