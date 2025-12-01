
let p5Stream = {
    ws,
    wsAddress,
    uuid,
    webviewuuid,
    reconnectTimeout: null,
    reconnecting: false
};

function connectStream(wsAddress, streamId, userCode) {
    p5Stream.webviewuuid = streamId;
    p5Stream.uuid = userCode;
    if (p5Stream.ws) {
        p5Stream.ws.onopen = p5Stream.ws.onclose = p5Stream.ws.onerror = p5Stream.ws.onmessage = null;
        try { p5Stream.ws.close(); } catch (e) { }
        p5Stream.ws = null;
    }
    p5Stream.ws = new WebSocket(wsAddress);
    p5Stream.ws.onopen = () => {
        p5Stream.reconnecting = false;
        console.log('[Sender] WebSocket opened');
    };
    p5Stream.ws.onclose = () => {
        if (!p5Stream.reconnecting) {
            p5Stream.reconnecting = true;
            p5Stream.reconnectTimeout = setTimeout(connectStream, 3000);
        }
        console.log('[Sender] WebSocket closed');
    };
    p5Stream.ws.onerror = () => {
        // Only log error, do not force close/reconnect here
        console.log('[Sender] WebSocket error');
    };
    p5Stream.ws.onmessage = (e) => {
        console.log('[Sender] Message from server:', e.data);
    };
}

function setup() {
    pixelDensity(1);
    createCanvas(100, 100);
    background(255);
    connectStream(wsAddress, webviewuuid, uuid);
}

function draw() {
    if (frameCount % 20 === 0) {
        background(random(255), random(255), random(255));
        sendPixels();
    }
}

function sendPixels() {
    if (p5Stream.ws && p5Stream.ws.readyState === WebSocket.OPEN) {
        loadPixels();
        p5Stream.ws.send(JSON.stringify({
            webviewuuid: p5Stream.webviewuuid,
            uuid: p5Stream.uuid,
            pixels: Array.from(pixels)
        }));
    }
}