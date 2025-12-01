/**
 * Connect to a WebSocket stream for pixel streaming.
 * @param wsAddress The WebSocket address.
 * @param streamId The webview UUID.
 * @param userCode The canvas UUID.
 */
declare function connectStream(wsAddress: string, streamId: string, userCode: string): void;

/**
 * Send the current canvas pixels over the WebSocket stream.
 */
declare function sendPixels(): void;
