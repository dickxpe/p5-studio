/**
 * Custom block definitions for the workspace.
 * Add simple blocks that are used by the toolbox but not provided by the
 * automatically-generated block set.
 */
(function(){
  try {
    const defs = [
      {
        "type": "output",
        "message0": "output %1",
        "args0": [ { "type": "input_value", "name": "TEXT" } ],
        "previousStatement": null,
        "nextStatement": null,
  "colour": "#ec43f5",
        "tooltip": "Append text to the output pane",
      }
    ];
    if (typeof Blockly !== 'undefined' && Blockly.defineBlocksWithJsonArray) {
      Blockly.defineBlocksWithJsonArray(defs);
    }
  } catch (e) { /* ignore errors during block registration */ }
})();
