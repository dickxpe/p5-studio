// Typed messaging for Blockly webview communication

export type BlocklyToExtensionMessage =
    | {
        type: 'blocklyGeneratedCode';
        code: string;
        workspace?: string;
        lineMap?: Array<{ line: number; blockId: string }>;
    }
    | {
        type: 'blocklyRequestSave';
    }
    | {
        type: 'blocklyReady';
    };

export type ExtensionToBlocklyMessage =
    | { type: 'setBlocklyTheme'; theme: string }
    | { type: 'loadWorkspace'; workspace: string }
    | { type: 'clearBlocklyHighlight' }
    | { type: 'highlightBlocklyBlock'; blockId: string };

export type AnyBlocklyMessage = BlocklyToExtensionMessage | ExtensionToBlocklyMessage;
