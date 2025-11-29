import { rewriteUserCodeWithWindowGlobals, extractGlobalVariables } from '../src/processing/codeRewriter';

const code = `const myShape = {
    x: 200,
    y: 100,
    w: 50,
    h: 50
};

let x = 0;
let y = 0;
let h = 0;

function setup() {
    myShape.x = 150;
}`;

const globals = extractGlobalVariables(code);
const rewritten = rewriteUserCodeWithWindowGlobals(code, globals);
console.log(rewritten);
