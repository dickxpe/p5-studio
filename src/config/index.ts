function getLogWarningsToOutput(): boolean {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<boolean>('logWarningsToOutput', true) === true;
    } catch { return true; }
}
import * as vscode from 'vscode';

export type StrictLevel = 'ignore' | 'warn' | 'block';

function getP5jsVersion(): string {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<string>('P5jsVersion', '1.11') || '1.11';
    } catch { return '1.11'; }
}

function getStepRunDelayMs(): number {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<number>('stepRunDelayMs', 500);
    } catch { return 500; }
}

function getShowDebugButton(): boolean {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<boolean>('ShowDebugButton', false) === true;
    } catch { return false; }
}

function getShowFPS(): boolean {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<boolean>('showFPS', false) === true;
    } catch { return false; }
}

function getDebounceDelay(): number {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<number>('debounceDelay', 250);
    } catch { return 250; }
}

function getVariablePanelDebounceDelay(): number {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<number>('variablePanelDebounceDelay', 500);
    } catch { return 500; }
}

function getReloadWhileTyping(): boolean {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadWhileTyping', true) === true;
    } catch { return true; }
}

function getReloadOnSave(): boolean {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<boolean>('reloadOnSave', true) === true;
    } catch { return true; }
}

function getStrictLevel(kind: 'Semicolon' | 'Undeclared' | 'NoVar' | 'LooseEquality'): StrictLevel {
    const cfg = vscode.workspace.getConfiguration('P5Studio');
    const key = `Strict${kind}Warning` as const;
    let level = cfg.get<string>(key, 'warn') as StrictLevel;
    const valid = level === 'ignore' || level === 'warn' || level === 'block';
    if (!valid) level = 'warn';
    try { if (level) return level; } catch { }
    const enable = cfg.get<boolean>(
        kind === 'Semicolon' ? 'enableSemicolonWarning' :
            kind === 'Undeclared' ? 'enableUndeclaredWarning' :
                kind === 'NoVar' ? 'enableNoVarWarning' : 'enableLooseEqualityWarning', true);
    const block = cfg.get<boolean>(
        kind === 'Semicolon' ? 'BlockOnSemicolon' :
            kind === 'Undeclared' ? 'BlockOnUndeclared' :
                kind === 'NoVar' ? 'BlockOnNoVar' : 'BlockOnLooseEquality', true);
    if (!enable) return 'ignore';
    return block ? 'block' : 'warn';
}

function getOscConfig() {
    const cfg = vscode.workspace.getConfiguration('P5Studio');
    return {
        localAddress: cfg.get<string>('oscLocalAddress', '127.0.0.1') || '127.0.0.1',
        localPort: cfg.get<number>('oscLocalPort', 57121) || 57121,
        remoteAddress: cfg.get<string>('oscRemoteAddress', '127.0.0.1') || '127.0.0.1',
        remotePort: cfg.get<number>('oscRemotePort', 57120) || 57120,
    };
}

function getSingleP5Panel(): boolean {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<boolean>('SingleP5Panel', false) === true;
    } catch { return false; }
}

function getBlocklyTheme(): string {
    try {
        return vscode.workspace.getConfiguration('P5Studio').get<string>('blocklyTheme', 'dark') || 'dark';
    } catch { return 'dark'; }
}

function resolveBlocklyTheme(): string {
    try {
        const t = getBlocklyTheme();
        if (t === 'auto') {
            return vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light';
        }
        return t || 'dark';
    } catch { return 'dark'; }
}

async function setReloadWhileTyping(value: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration('P5Studio');
    await config.update('reloadWhileTyping', !!value, vscode.ConfigurationTarget.Global);
}

async function setShowDebugButton(value: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration('P5Studio');
    await config.update('ShowDebugButton', !!value, vscode.ConfigurationTarget.Global);
}

async function setReloadOnSave(value: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration('P5Studio');
    await config.update('reloadOnSave', !!value, vscode.ConfigurationTarget.Global);
}

async function setShowFPS(value: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration('P5Studio');
    await config.update('showFPS', !!value, vscode.ConfigurationTarget.Global);
}

async function setShowSetupNotification(value: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration('P5Studio');
    await config.update('showSetupNotification', !!value, vscode.ConfigurationTarget.Global);
}

export const config = {
    getP5jsVersion,
    getStepRunDelayMs,
    getShowDebugButton,
    getShowFPS,
    getDebounceDelay,
    getVariablePanelDebounceDelay,
    getReloadWhileTyping,
    getReloadOnSave,
    getBlockSketchOnWarning(): boolean {
        return vscode.workspace.getConfiguration('P5Studio').get<boolean>('BlockSketchOnWarning', true) === true;
    },
    getShowSetupNotification(): boolean {
        return vscode.workspace.getConfiguration('P5Studio').get<boolean>('showSetupNotification', true) === true;
    },
    getBlocklyTheme,
    resolveBlocklyTheme,
    getStrictLevel,
    getLogWarningsToOutput,
    getOscConfig,
    getSingleP5Panel,
    setReloadWhileTyping,
    setShowDebugButton,
    setReloadOnSave,
    setShowFPS,
    setShowSetupNotification,
};
