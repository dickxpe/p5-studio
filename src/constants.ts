// Centralized constants and sets used across the extension.

// Set of reserved/built-in global names (p5.js, browser, JS built-ins, etc.)
export const RESERVED_GLOBALS = new Set<string>([
    "MEDIA_FOLDER", "INCLUDE_FOLDER", "p5",
    // p5.js color functions and color mode
    "hue", "saturation", "brightness", "red", "green", "blue", "alpha", "lightness", "colorMode", "color",
    // p5.js core properties
    "width", "height", "frameCount", "frameRate", "deltaTime", "mouseX", "mouseY", "pmouseX", "pmouseY",
    "winMouseX", "winMouseY", "pwinMouseX", "pwinMouseY", "mouseButton", "mouseIsPressed", "key", "keyCode",
    "keyIsPressed", "keyIsDown", "touches", "deviceOrientation", "accelerationX", "accelerationY", "accelerationZ",
    "pAccelerationX", "pAccelerationY", "pAccelerationZ", "rotationX", "rotationY", "rotationZ", "pRotationX",
    "pRotationY", "pRotationZ", "turnAxis", "movedX", "movedY", "movedZ", "winMouseX", "winMouseY", "pwinMouseX", "pwinMouseY",
    // p5.js structure
    "setup", "draw", "preload", "remove", "mouseMoved", "mouseDragged", "mousePressed", "mouseReleased", "mouseClicked",
    "doubleClicked", "mouseWheel", "touchStarted", "touchMoved", "touchEnded", "keyPressed", "keyReleased", "keyTyped",
    // p5.js rendering
    "createCanvas", "resizeCanvas", "noCanvas", "createGraphics", "createCapture", "createVideo", "createAudio", "loadImage",
    "image", "imageMode", "blend", "copy", "filter", "get", "loadPixels", "set", "updatePixels", "noLoop", "loop", "redraw",
    "clear", "background", "color", "fill", "noFill", "stroke", "noStroke", "strokeWeight", "strokeCap", "strokeJoin",
    "erase", "noErase", "blendMode", "drawingContext", "push", "pop", "resetMatrix", "applyMatrix", "translate", "rotate",
    "rotateX", "rotateY", "rotateZ", "scale", "shearX", "shearY", "createShader", "shader", "resetShader",
    // p5.js shapes
    "rect", "square", "ellipse", "circle", "arc", "triangle", "quad", "line", "point", "beginShape", "endShape", "vertex",
    "bezierVertex", "curveVertex", "bezier", "curve", "curveTightness", "curveDetail",
    // p5.js typography
    "text", "textFont", "textSize", "textAlign", "textStyle", "textLeading", "textWidth", "textAscent", "textDescent",
    // p5.js attributes
    "ellipseMode", "rectMode", "angleMode", "noSmooth", "smooth", "strokeCap", "strokeJoin",
    // p5.js math
    "abs", "ceil", "constrain", "dist", "exp", "floor", "lerp", "log", "mag", "map", "max", "min", "norm", "pow", "round",
    "sq", "sqrt", "createVector", "noise", "noiseDetail", "noiseSeed", "randomSeed", "random", "randomGaussian",
    // p5.js conversion / formatting helpers
    "int", "float", "str", "boolean", "byte", "char", "unchar", "hex", "unhex", "nf", "nfc", "nfp", "nfs",
    // p5.js trigonometry
    "degrees", "radians", "sin", "cos", "tan", "asin", "acos", "atan", "atan2",
    // p5.js time & date
    "day", "hour", "minute", "millis", "month", "second", "year",
    // p5.js events
    "deviceMoved", "deviceTurned", "deviceShaken",
    // p5.js input
    "createInput", "createButton", "createCheckbox", "createSelect", "createSlider", "createRadio", "createColorPicker",
    // p5.js output
    "print", "println", "save", "saveCanvas", "saveFrames", "saveJSON", "saveStrings", "saveTable", "saveXML",
    // p5.js files
    "loadJSON", "loadStrings", "loadTable", "loadXML", "loadBytes", "loadFont", "loadShader", "loadImage", "loadSound",
    // p5.js sound (if p5.sound is loaded)
    "loadSound", "createAudio", "createOscillator", "createGain", "createConvolver", "createDelay", "createCompressor",
    "createPanner", "createStereoPanner", "createAnalyser", "createEnvelope", "createFFT", "createFilter", "createBiquadFilter",
    "createLowPass", "createHighPass", "createBandPass", "createPeaking", "createNotch", "createAllPass", "createLowshelf",
    "createHighshelf", "createDistortion", "createWaveShaper", "createMediaElementSource", "createMediaStreamSource",
    // p5.js dom
    "createDiv", "createSpan", "createP", "createImg", "createA", "createElement", "select", "selectAll", "removeElements",
    // p5.js misc
    "frameRate", "pixelDensity", "displayWidth", "displayHeight", "windowWidth", "windowHeight", "windowResized",
    // browser globals (partial, common)
    "window", "document", "navigator", "location", "console", "setTimeout", "setInterval", "clearTimeout", "clearInterval",
    "alert", "prompt", "confirm", "requestAnimationFrame", "cancelAnimationFrame", "localStorage", "sessionStorage",
    "fetch", "XMLHttpRequest", "Event", "addEventListener", "removeEventListener", "dispatchEvent",
    // JS built-ins
    "Array", "Object", "Function", "String", "Number", "Boolean", "Symbol", "Date", "Math", "RegExp", "Error", "EvalError",
    "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "JSON", "parseInt", "parseFloat", "isNaN",
    "isFinite", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape", "Infinity",
    "NaN", "undefined", "null", "Map", "Set", "WeakMap", "WeakSet", "Promise", "Reflect", "Proxy", "Intl", "DataView",
    "ArrayBuffer", "SharedArrayBuffer", "Atomics", "BigInt", "BigInt64Array", "BigUint64Array", "Float32Array",
    "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array",
    // VS Code injected
    "acquireVsCodeApi",
    // p5.js constants (alignment, modes, keys, mouse, etc.)
    // Angle modes
    "DEGREES", "RADIANS",
    // Color modes
    "RGB", "HSB", "HSL",
    // Geometry modes
    "CENTER", "CORNER", "CORNERS", "RADIUS",
    //Arc mode
    "OPEN", "CHORD", "PIE",
    //Close
    "CLOSE",
    // Text alignment and vertical alignment
    "LEFT", "RIGHT", "TOP", "BOTTOM", "BASELINE",
    // Stroke caps and joins
    "ROUND", "SQUARE", "PROJECT", "MITER", "BEVEL",
    // Image/rectangle modes reuse CENTER/CORNER/CORNERS/RADIUS
    // Blend modes
    "BLEND", "ADD", "DARKEST", "LIGHTEST", "DIFFERENCE", "EXCLUSION", "MULTIPLY", "SCREEN", "REPLACE", "OVERLAY", "HARD_LIGHT", "SOFT_LIGHT",
    // Cursor constants
    "ARROW", "CROSS", "HAND", "MOVE", "TEXT", "WAIT",
    // Renderer constant
    "WEBGL",
    // Angle constants
    "PI", "HALF_PI", "QUARTER_PI", "TWO_PI",
    // Key constants
    "BACKSPACE", "DELETE", "ENTER", "RETURN", "TAB", "ESCAPE",
    // Arrow keys
    "UP_ARROW", "DOWN_ARROW", "LEFT_ARROW", "RIGHT_ARROW",
    // Modifier keys
    "ALT", "CONTROL", "SHIFT",
    // Filter
    "INVERT", "THRESHOLD", "GRAY", "OPAQUE", "POSTERIZE", "BLUR", "ERODE", "DILATE",
    "pixels"
]);

// Add a set of known p5 numeric properties
export const P5_NUMERIC_IDENTIFIERS = new Set<string>([
    "width", "height", "frameCount", "frameRate", "deltaTime", "mouseX", "mouseY", "pmouseX", "pmouseY",
    "winMouseX", "winMouseY", "pwinMouseX", "pwinMouseY", "accelerationX", "accelerationY", "accelerationZ",
    "pAccelerationX", "pAccelerationY", "pAccelerationZ", "rotationX", "rotationY", "rotationZ", "pRotationX",
    "pRotationY", "pRotationZ", "movedX", "movedY", "movedZ", "displayWidth", "displayHeight", "windowWidth",
    "windowHeight"
]);

// List of p5 event handler function names
export const P5_EVENT_HANDLERS: string[] = [
    "mouseMoved", "mouseDragged", "mousePressed", "mouseReleased", "mouseClicked",
    "doubleClicked", "mouseWheel", "touchStarted", "touchMoved", "touchEnded",
    "keyPressed", "keyReleased", "keyTyped", "deviceMoved", "deviceTurned", "deviceShaken"
];
