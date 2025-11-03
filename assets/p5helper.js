const MEDIA_FOLDER = "";

/**
 * The recommended global for loading files from the include folder (next to your sketch).
 * Example: loadImage(INCLUDE_FOLDER + '/myimage.png')
 */
const INCLUDE_FOLDER = "";

/**
 * Send an OSC message to the configured remote address/port.
 * @param {string} address The OSC address (e.g. "/foo/bar")
 * @param {any[]} [args] Arguments to send (numbers, strings, booleans)
 */
function sendOSC(address, args) {
    // This is a stub for autocompletion only.
    // The real implementation is injected in the webview.
}

/**
 * Print output to the console and the VS Code output panel.
 * Alias for console.log.
 * @param {...any} args Values to print
 */
function output(...args) {
    // This is a stub for autocompletion only.
    // The real implementation is injected in the webview.
}

function oscArgsToArray(args) {
    const list = Array.isArray(args) ? args : [args];
    return list.map(arg => (arg && typeof arg === 'object' && 'value' in arg) ? arg.value : arg);
}