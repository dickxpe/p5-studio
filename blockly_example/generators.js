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
})();
