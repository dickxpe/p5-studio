/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

(function(){
  window.toolbox = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'p5 Events',
        colour: '#FF8A65',
        contents: [
          { kind: 'block', type: 'p5_setup' },
          { kind: 'block', type: 'p5_draw' },
          { kind: 'block', type: 'p5_mouseMoved' },
          { kind: 'block', type: 'p5_mouseDragged' },
          { kind: 'block', type: 'p5_mousePressed' },
          { kind: 'block', type: 'p5_mouseReleased' },
          { kind: 'block', type: 'p5_mouseClicked' },
          { kind: 'block', type: 'p5_doubleClicked' },
          { kind: 'block', type: 'p5_mouseWheel' },
          { kind: 'block', type: 'p5_keyPressed' },
          { kind: 'block', type: 'p5_keyReleased' },
          { kind: 'block', type: 'p5_keyTyped' },
          { kind: 'block', type: 'p5_windowResized' },
          { kind: 'block', type: 'p5_preload' },
          { kind: 'block', type: 'p5_touchStarted' },
          { kind: 'block', type: 'p5_touchMoved' },
          { kind: 'block', type: 'p5_touchEnded' },
          { kind: 'block', type: 'p5_deviceMoved' },
          { kind: 'block', type: 'p5_deviceTurned' },
          { kind: 'block', type: 'p5_deviceShaken' },
          { kind: 'block', type: 'p5_resized' },
          { kind: 'block', type: 'p5_focused' },
          { kind: 'block', type: 'p5_unfocused' },
          { kind: 'block', type: 'p5_blurred' },
          { kind: 'block', type: 'p5_entered' },
          { kind: 'block', type: 'p5_exited' }
        ]
      },
      {
        kind: 'category',
        name: 'Logic',
        categorystyle: 'logic_category',
        contents: [
          {kind: 'block', type: 'controls_if'},
          {kind: 'block', type: 'logic_compare'},
          {kind: 'block', type: 'logic_operation'},
          {kind: 'block', type: 'logic_negate'},
  
          {kind: 'block', type: 'logic_ternary'},
        ],
      },
      {
        kind: 'category',
        name: 'Loops',
        categorystyle: 'loop_category',
        contents: [
          {
            kind: 'block',
            type: 'controls_repeat_ext',
            inputs: {
              TIMES: {
                shadow: {type: 'math_number', fields: {NUM: 10}},
              },
            },
          },
          {kind: 'block', type: 'controls_whileUntil'},
          {
            kind: 'block',
            type: 'controls_for',
            inputs: {
              FROM: {shadow: {type: 'math_number', fields: {NUM: 0}}},
              TO: {shadow: {type: 'math_number', fields: {NUM: 1}}},
              BY: {shadow: {type: 'math_number', fields: {NUM: 1}}},
            },
          },
          {kind: 'block', type: 'controls_forEach'},
          {kind: 'block', type: 'controls_flow_statements'},
        ],
      },
      {
        kind: 'category',
        name: 'Math',
        categorystyle: 'math_category',
        contents: [
          {
            kind: 'block',
            type: 'math_arithmetic',
            inputs: {
              A: {shadow: {type: 'math_number', fields: {NUM: 1}}},
              B: {shadow: {type: 'math_number', fields: {NUM: 1}}},
            },
          },
          {kind: 'block', type: 'math_single', inputs: {NUM: {shadow: {type: 'math_number', fields: {NUM: 9}}}}},
          {kind: 'block', type: 'math_trig', inputs: {NUM: {shadow: {type: 'math_number', fields: {NUM: 45}}}}},
          {kind: 'block', type: 'math_constant'},
          {kind: 'block', type: 'math_number_property', inputs: {NUMBER_TO_CHECK: {shadow: {type: 'math_number', fields: {NUM: 0}}}}},
          {kind: 'block', type: 'math_round', fields: {OP: 'ROUND'}, inputs: {NUM: {shadow: {type: 'math_number', fields: {NUM: 3.1}}}}},
          {kind: 'block', type: 'math_on_list', fields: {OP: 'SUM'}},
          {kind: 'block', type: 'math_modulo', inputs: {DIVIDEND: {shadow: {type: 'math_number', fields: {NUM: 64}}}, DIVISOR: {shadow: {type: 'math_number', fields: {NUM: 10}}}}},
          {kind: 'block', type: 'math_constrain', inputs: {VALUE: {shadow: {type: 'math_number', fields: {NUM: 50}}}, LOW: {shadow: {type: 'math_number', fields: {NUM: 1}}}, HIGH: {shadow: {type: 'math_number', fields: {NUM: 100}}}}},
          {kind: 'block', type: 'math_random_int', inputs: {FROM: {shadow: {type: 'math_number', fields: {NUM: 1}}}, TO: {shadow: {type: 'math_number', fields: {NUM: 100}}}}},
          {kind: 'block', type: 'math_random_float'},
          {kind: 'block', type: 'math_atan2', inputs: {X: {shadow: {type: 'math_number', fields: {NUM: 1}}}, Y: {shadow: {type: 'math_number', fields: {NUM: 1}}}}},
        ],
      },
      {
        kind: 'category',
        name: 'Text',
        categorystyle: 'text_category',
        contents: [
          {kind: 'block', type: 'text_join'},
          {kind: 'block', type: 'text_append', inputs: {TEXT: {shadow: {type: 'text', fields: {TEXT: ''}}}}},
          {kind: 'block', type: 'text_length', inputs: {VALUE: {shadow: {type: 'text', fields: {TEXT: 'abc'}}}}},
          {kind: 'block', type: 'text_isEmpty', inputs: {VALUE: {shadow: {type: 'text', fields: {TEXT: ''}}}}},
          {kind: 'block', type: 'text_indexOf', inputs: {VALUE: {block: {type: 'variables_get'}}, FIND: {shadow: {type: 'text', fields: {TEXT: 'abc'}}}}},
          {kind: 'block', type: 'text_charAt', inputs: {VALUE: {block: {type: 'variables_get'}}}},
          {kind: 'block', type: 'text_getSubstring', inputs: {STRING: {block: {type: 'variables_get'}}}},
          {kind: 'block', type: 'text_changeCase', inputs: {TEXT: {shadow: {type: 'text', fields: {TEXT: 'abc'}}}}},
          {kind: 'block', type: 'text_trim', inputs: {TEXT: {shadow: {type: 'text', fields: {TEXT: 'abc'}}}}},
          {kind: 'block', type: 'text_count', inputs: {SUB: {shadow: {type: 'text'}}, TEXT: {shadow: {type: 'text'}}}},
          {kind: 'block', type: 'text_replace', inputs: {FROM: {shadow: {type: 'text'}}, TO: {shadow: {type: 'text'}}, TEXT: {shadow: {type: 'text'}}}},
          {kind: 'block', type: 'text_reverse', inputs: {TEXT: {shadow: {type: 'text'}}}},
        ],
      },
      {
        kind: 'category',
        name: 'Lists',
        categorystyle: 'list_category',
        contents: [
          {kind: 'block', type: 'lists_create_with'},
          {kind: 'block', type: 'lists_create_with'},
          {kind: 'block', type: 'lists_repeat', inputs: {NUM: {shadow: {type: 'math_number', fields: {NUM: 5}}}}},
          {kind: 'block', type: 'lists_length'},
          {kind: 'block', type: 'lists_isEmpty'},
          {kind: 'block', type: 'lists_indexOf', inputs: {VALUE: {block: {type: 'variables_get'}}}},
          {kind: 'block', type: 'lists_getIndex', inputs: {VALUE: {block: {type: 'variables_get'}}}},
          {kind: 'block', type: 'lists_setIndex', inputs: {LIST: {block: {type: 'variables_get'}}}},
          {kind: 'block', type: 'lists_getSublist', inputs: {LIST: {block: {type: 'variables_get'}}}},
          {kind: 'block', type: 'lists_split', inputs: {DELIM: {shadow: {type: 'text', fields: {TEXT: ','}}}}},
          {kind: 'block', type: 'lists_sort'},
          {kind: 'block', type: 'lists_reverse'},
        ],
      },
        {kind: 'category', name: 'Values', categorystyle: 'value_category', contents: [
          {kind: 'block', type: 'math_number', fields: {NUM: 123}},
            {kind: 'block', type: 'text'},
             {kind: 'block', type: 'logic_boolean'}
          ],
        },
      {kind: 'category', name: 'Variables', categorystyle: 'variable_category', custom: 'VARIABLE'},
      {kind: 'category', name: 'Functions', categorystyle: 'procedure_category', custom: 'PROCEDURE'},
        {kind: 'category', name: 'Debug', categorystyle: 'debug_category', contents: [
                {kind: 'block', type: 'output', inputs: {TEXT: {shadow: {type: 'text', fields: {TEXT: 'abc'}}}}},
                 {kind: 'block', type: 'inputprompt', inputs: {TEXT: {shadow: {type: 'text', fields: {TEXT: 'abc'}}}}},
        ]
        }
    ],
  };
})();
