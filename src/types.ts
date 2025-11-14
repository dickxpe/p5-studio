// Shared types used across the extension and webview message contracts

export type P5Version = '1.11' | '2.1' | (string & {});

export interface DocContext {
    docUri: string;
    fileName: string;
    fsPath?: string;
}

export interface PanelContext {
    docUri: string;
    isActive: boolean;
    captureVisible?: boolean;
}

export interface GlobalVar {
    name: string;
    type: string;
    value: any;
}

export interface TopInputItem {
    varName: string;
    label?: string;
    defaultValue?: any;
}

export type StrictLevel = 'ignore' | 'warn' | 'block';

export interface OscMessage {
    address: string;
    args?: any[];
}
