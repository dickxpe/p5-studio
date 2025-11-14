import * as vscode from 'vscode';
import * as osc from 'osc';
import { config as cfg } from '../config/index';

export type OscArgs = Array<{ type: string; value?: any } | number | string | boolean>;
export type BroadcastFn = (address: string, args: any[]) => void;

export interface OscServiceApi {
    send: (address: string, args: any[]) => void;
    reload: () => void;
    dispose: () => void;
    getConfig: () => { localAddress: string; remoteAddress: string; localPort: number; remotePort: number };
    handleConfigChange: (e: vscode.ConfigurationChangeEvent) => void;
}

let port: osc.UDPPort | null = null; // receiver
let sendPort: osc.UDPPort | null = null; // sender
let broadcast: BroadcastFn | null = null;
let output: vscode.OutputChannel | null = null;

function getConfig() { return cfg.getOscConfig(); }

function ensureOutput() {
    if (!output) output = vscode.window.createOutputChannel('LIVE P5: OSC');
    return output!;
}

function openPort() {
    // Close previous ports if any
    if (port) { try { port.close(); } catch { } port = null; }
    if (sendPort) { try { sendPort.close(); } catch { } sendPort = null; }
    const cfg = getConfig();
    // Receiver port

    const receiveOptions = {
        remoteAddress: "127.0.0.1", // required by osc.js
        remotePort: Math.floor(20000 + Math.random() * 40000), // random high port
        localAddress: cfg.localAddress,
        localPort: cfg.localPort,
        metadata: true
    };
    port = new osc.UDPPort(receiveOptions);

    const sendOptions = {
        remoteAddress: cfg.remoteAddress,
        remotePort: cfg.remotePort,
        localAddress: "127.0.0.1", // required by osc.js
        localPort: Math.floor(20000 + Math.random() * 40000), // random high port
        metadata: true
    };
    // Sender port (do not bind localAddress/localPort, just set remote)
    sendPort = new osc.UDPPort(sendOptions);
    const ch = ensureOutput();
    ch.appendLine(`[DEBUG] Opening OSC receive port on ${cfg.localAddress}:${cfg.localPort}`);
    ch.appendLine(`[DEBUG] Opening OSC send port to ${cfg.remoteAddress}:${cfg.remotePort}`);
    port.open();
    sendPort.open();

    port.on('ready', () => {
        try {
            const c = getConfig();
            ch.appendLine(`[${new Date().toLocaleTimeString()}] [OSC] Listening on ${c.localAddress}:${c.localPort}`);
        } catch { }
    });
    sendPort.on('ready', () => {
        try {
            const c = getConfig();
            ch.appendLine(`[${new Date().toLocaleTimeString()}] [OSC] Sending to ${c.remoteAddress}:${c.remotePort}`);
        } catch { }
    });
    port.on('message', (msg: any) => {
        try { ch.appendLine(`[${new Date().toLocaleTimeString()}] [OSC] RX ${msg.address} ${JSON.stringify(msg.args)}`); } catch { }
        if (broadcast) {
            try { broadcast(msg.address, msg.args); } catch (e) { try { ch.appendLine(`[DEBUG] Broadcast error: ${e}`); } catch { } }
        }
    });
    try {
        (port as any).on && (port as any).on('error', (err: any) => {
            try {
                const msg = err && err.message ? err.message : String(err);
                ch.appendLine(`[${new Date().toLocaleTimeString()}] [OSC] Error: ${msg}`);
                if (typeof err?.code === 'string' && err.code.toUpperCase() === 'EADDRINUSE') {
                    ch.appendLine('[OSC] Hint: The local port is already in use. Close the other app or change P5Studio.oscLocalPort or P5Studio.oscLocalAddress (e.g., 127.0.0.1).');
                }
            } catch { }
        });
        (sendPort as any).on && (sendPort as any).on('error', (err: any) => {
            try {
                const msg = err && err.message ? err.message : String(err);
                ch.appendLine(`[${new Date().toLocaleTimeString()}] [OSC] SendPort Error: ${msg}`);
            } catch { }
        });
    } catch { }
}

function toPacket(address: string, args: any[]) {
    return {
        address,
        args: (args || []).map((a: any) => {
            if (typeof a === 'number') return { type: 'f', value: a };
            if (typeof a === 'string') return { type: 's', value: a };
            if (typeof a === 'boolean') return { type: a ? 'T' : 'F', value: a };
            return { type: 's', value: String(a) };
        })
    };
}

export function initOsc(bcast: BroadcastFn): OscServiceApi {
    broadcast = bcast;
    openPort();

    function send(address: string, args: any[]) {
        const ch = ensureOutput();
        try {
            if (!sendPort) {
                vscode.window.showErrorMessage('OSC send port is not initialized. Try reloading the window.');
                return;
            }
            const packet = toPacket(address, args);
            ch.appendLine(`[DEBUG] Sending OSC packet: ${JSON.stringify(packet)}`);
            sendPort.send(packet);
        } catch (e) {
            try { ch.appendLine(`[DEBUG] OSC send error: ${e}`); } catch { }
            console.error('OSC send error:', e);
        }
    }

    function reload() { openPort(); }

    function dispose() {
        try { if (port) port.close(); } catch { }
        port = null;
    }

    function handleConfigChange(e: vscode.ConfigurationChangeEvent) {
        if (
            e.affectsConfiguration('P5Studio.oscLocalAddress') ||
            e.affectsConfiguration('P5Studio.oscRemoteAddress') ||
            e.affectsConfiguration('P5Studio.oscRemotePort') ||
            e.affectsConfiguration('P5Studio.oscLocalPort')
        ) {
            reload();
        }
    }

    return { send, reload, dispose, getConfig, handleConfigChange };
}
