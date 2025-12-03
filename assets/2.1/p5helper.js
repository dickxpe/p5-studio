/**
 * Connect to a WebSocket stream for pixel streaming.
 * @param {string} wsAddress - The WebSocket address.
 * @param {string} streamId - The webview UUID.
 * @param {string} userCode - The canvas UUID.
 * @param {number} [targetFPS=30] - Optional target FPS for throttling pixel sends.
 */
function connectStream(wsAddress, streamId, userCode, targetFPS = 30) {
    // This is a stub for autocompletion only.
    // The real implementation is injected in the webview.
}

/**
 * Send the current canvas pixels over the WebSocket stream.
 */
function sendPixels() {
    // This is a stub for autocompletion only.
    // The real implementation is injected in the webview.
}

/**
 * Enable lossy pixel streaming using canvas encoding.
 * @param {number} [quality] Optional quality between 0 and 1 (defaults to ~0.7). Values are clamped to 0.05-1.
 * @param {'webp'|'png'|'jpeg'|'jpg'} [mimeType]
 *        Optional shorthand for the resulting mime type. For example "webp" → image/webp, "jpg" → image/jpeg.
 *        Omit to keep the previous mime type (defaults to webp).
 */
function enableLossySend(quality, mimeType) {
    // This is a stub for autocompletion only.
    // The real implementation is injected in the webview.
}

/**
 * Disable lossy pixel streaming and return to raw pixel diffs.
 */
function disableLossySend() {
    // This is a stub for autocompletion only.
    // The real implementation is injected in the webview.
}

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