/**
 * The recommended global for loading media files in the VS Code webview.
 * Example: loadSound(MEDIA_FOLDER + '/mysound.mp3')
 */
declare const MEDIA_FOLDER: string;

/**
 * The recommended global for loading files from the include folder (next to your sketch).
 * Example: loadImage(INCLUDE_FOLDER + '/myimage.png')
 */
declare const INCLUDE_FOLDER: string;

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

/**
 * Convert OSC argument objects (with metadata) into plain JS values.
 * The extension delivers OSC args as objects like { type: 'f'|'i'|'s'|'T'|'F', value: any }.
 * This helper maps those to their primitive values, preserving non-object items as-is.
 *
 * Example:
 *   // [{type:'f',value:1.23}, {type:'s',value:'hi'}, {type:'T',value:true}] -> [1.23, 'hi', true]
 *   const values = oscArgsToArray(args);
 *
 * @param args A single OSC argument or an array of arguments.
 * @returns A plain array of values.
 */
declare function oscArgsToArray(args: any[] | any): any[];

