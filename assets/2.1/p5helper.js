/* Start the OSC server.If address and port are given, use them; otherwise use settings.
* @param { string } [address] Optional address to bind the OSC server.
* @param { number } [port] Optional port to bind the OSC server.
*/
/**
 * Start the OSC server. If parameters are given, use them; otherwise use settings.
 * @param {string} [localAddress] Optional local address to bind the OSC server.
 * @param {number} [localPort] Optional local port to bind the OSC server.
 * @param {string} [remoteAddress] Optional remote address to send OSC messages.
 * @param {number} [remotePort] Optional remote port to send OSC messages.
 */
function startOSC(localAddress, localPort, remoteAddress, remotePort) {
    // This is a stub for autocompletion only.
    // The real implementation is injected in the webview.
}

/**
 * Stop the OSC server if running.
 */
function stopOSC() {
    // This is a stub for autocompletion only.
    // The real implementation is injected in the webview.
}
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

/**
 * Request a value from the user.
 * Note: This is a stub for IntelliSense only; the runtime implementation
 * is provided by the extension/webview and may coerce strings like
 * "true"/"false" to booleans and numeric strings to numbers.
 * @returns {any} The entered value (type depends on implementation)
 */
function inputPrompt() {
    // This is a stub for autocompletion only.
    // The real implementation (for top-of-file placeholders) is handled by the extension.
}