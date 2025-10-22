/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

(function(){
  const addText = {
    type: 'add_text',
    message0: 'Add text %1',
    args0: [
      { type: 'input_value', name: 'TEXT', check: 'String' },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: '',
    helpUrl: '',
  };
  Blockly.defineBlocksWithJsonArray([addText]);
})();
