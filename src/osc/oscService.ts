import * as vscode from 'vscode';
import * as osc from 'osc';

export type OscArgs = Array<{ type: string; value?: any } | number | string | boolean>;
export type BroadcastFn = (address: string, args: any[]) => void;

export interface OscServiceApi {
    send: (address: string, args: any[]) => void;
    reload: () => void;
    dispose: () => void;
    getConfig: () => { localAddress: string; remoteAddress: string; localPort: number; remotePort: number };
    handleConfigChange: (e: vscode.ConfigurationChangeEvent) => void;
}

let port: osc.UDPPort | null = null;
let broadcast: BroadcastFn | null = null;
let output: vscode.OutputChannel | null = null;

function getConfig() {
    const config = vscode.workspace.getConfiguration('P5Studio');
    return {
        localAddress: config.get<string>('oscLocalAddress', '127.0.0.1'),
        remoteAddress: config.get<string>('oscRemoteAddress', '127.0.0.1'),
        remotePort: config.get<number>('oscRemotePort', 57120),
        localPort: config.get<number>('oscLocalPort', 57121)
    };
}

function ensureOutput() {
    if (!output) output = vscode.window.createOutputChannel('LIVE P5: OSC');
    return output!;
}

function openPort() {
    if (port) {
        try { port.close(); } catch { }
        port = null;
    }
    const cfg = getConfig();
    // Bind exactly to the configured localAddress to avoid unexpected EADDRINUSE on 0.0.0.0
    port = new osc.UDPPort({
        localAddress: cfg.localAddress,
        localPort: cfg.localPort,
        remoteAddress: cfg.remoteAddress,
        remotePort: cfg.remotePort,
        metadata: true
    });
    const ch = ensureOutput();
    ch.appendLine(`[DEBUG] Opening OSC port on ${cfg.localAddress}:${cfg.localPort}, remote ${cfg.remoteAddress}:${cfg.remotePort}`);
    port.open();

    port.on('ready', () => {
        try {
            const c = getConfig();
            ch.appendLine(`[${new Date().toLocaleTimeString()}] [OSC] Listening on ${c.localAddress}:${c.localPort} | Remote target ${c.remoteAddress}:${c.remotePort}`);
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
                // Provide a helpful hint for common binding conflict
                if (typeof err?.code === 'string' && err.code.toUpperCase() === 'EADDRINUSE') {
                    ch.appendLine('[OSC] Hint: The local port is already in use. Close the other app or change P5Studio.oscLocalPort or P5Studio.oscLocalAddress (e.g., 127.0.0.1).');
                }
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
            if (!port) {
                vscode.window.showErrorMessage('OSC port is not initialized. Try reloading the window.');
                return;
            }
            const packet = toPacket(address, args);
            ch.appendLine(`[DEBUG] Sending OSC packet: ${JSON.stringify(packet)}`);
            port.send(packet);
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
