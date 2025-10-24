/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

(function(){
  const gen = javascript.javascriptGenerator;
  const Order = gen.Order || javascript.Order;

  gen.forBlock['add_text'] = function(block, generator) {
    const text = generator.valueToCode(block, 'TEXT', Order ? Order.NONE : gen.ORDER_NONE) || "''";
    const addText = generator.provideFunction_(
      'addText',
      `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  outputDiv.appendChild(textEl);
}`,
    );
    return `${addText}(${text});\n`;
  };

  // p5: structure
  gen.forBlock['p5_setup'] = function(block, generator){
    const statements = generator.statementToCode(block, 'DO');
    return `function setup() {\n${statements}}\n`;
  };
  gen.forBlock['p5_draw'] = function(block, generator){
    const statements = generator.statementToCode(block, 'DO');
    return `function draw() {\n${statements}}\n`;
  };

  // helpers for values
  function v(genr, blk, name){ return genr.valueToCode(blk, name, Order ? Order.NONE : gen.ORDER_NONE) || '0'; }
  function s(genr, blk, name){ return genr.valueToCode(blk, name, Order ? Order.NONE : gen.ORDER_NONE) || "''"; }

  // p5: environment/canvas
  gen.forBlock['p5_createCanvas']   = (b,g)=> `createCanvas(${v(g,b,'W')}, ${v(g,b,'H')});\n`;
  gen.forBlock['p5_frameRate']      = (b,g)=> `frameRate(${v(g,b,'FPS')});\n`;
  gen.forBlock['p5_clear']          = ()=> `clear();\n`;

  // p5: color & style
  gen.forBlock['p5_background']     = (b,g)=> `background(${v(g,b,'C')});\n`;
  gen.forBlock['p5_fill']           = (b,g)=> `fill(${v(g,b,'C')});\n`;
  gen.forBlock['p5_noFill']         = ()=> `noFill();\n`;
  gen.forBlock['p5_stroke']         = (b,g)=> `stroke(${v(g,b,'C')});\n`;
  gen.forBlock['p5_noStroke']       = ()=> `noStroke();\n`;
  gen.forBlock['p5_strokeWeight']   = (b,g)=> `strokeWeight(${v(g,b,'W')});\n`;

  // p5: shapes
  gen.forBlock['p5_rect']           = (b,g)=> `rect(${v(g,b,'X')}, ${v(g,b,'Y')}, ${v(g,b,'W')}, ${v(g,b,'H')});\n`;
  gen.forBlock['p5_circle']         = (b,g)=> `circle(${v(g,b,'X')}, ${v(g,b,'Y')}, ${v(g,b,'D')});\n`;
  gen.forBlock['p5_ellipse']        = (b,g)=> `ellipse(${v(g,b,'X')}, ${v(g,b,'Y')}, ${v(g,b,'W')}, ${v(g,b,'H')});\n`;
  gen.forBlock['p5_line']           = (b,g)=> `line(${v(g,b,'X1')}, ${v(g,b,'Y1')}, ${v(g,b,'X2')}, ${v(g,b,'Y2')});\n`;

  // p5: transform
  gen.forBlock['p5_push']           = ()=> `push();\n`;
  gen.forBlock['p5_pop']            = ()=> `pop();\n`;
  gen.forBlock['p5_translate']      = (b,g)=> `translate(${v(g,b,'X')}, ${v(g,b,'Y')});\n`;
  gen.forBlock['p5_rotate']         = (b,g)=> `rotate(${v(g,b,'A')});\n`;

  // p5: typography
  gen.forBlock['p5_text']           = (b,g)=> `text(${s(g,b,'S')}, ${v(g,b,'X')}, ${v(g,b,'Y')});\n`;
  gen.forBlock['p5_textSize']       = (b,g)=> `textSize(${v(g,b,'SZ')});\n`;
})();
