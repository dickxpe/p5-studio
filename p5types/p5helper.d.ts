/**
 * The recommended global for loading media files in the VS Code webview.
 * Example: loadSound(MEDIA_FOLDER + '/mysound.mp3')
 */
declare const MEDIA_FOLDER: string;

/**
 * Send an OSC message to the configured remote address/port.
 * @param address The OSC address (e.g. "/foo/bar")
 * @param args Arguments to send (numbers, strings, booleans)
 */
declare function sendOSC(address: string, args?: any[]): void;

/**
 * Print output to the console and the VS Code output panel.
 * Alias for console.log.
 * @param args Values to print
 */
declare function output(...args: any[]): void;
