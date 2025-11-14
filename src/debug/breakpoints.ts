import * as vscode from 'vscode';

// Check if an enabled VS Code breakpoint exists on a given 1-based line
// for the provided document URI string.
export function hasBreakpointOnLine(docUriStr: string, line1Based: number): boolean {
    try {
        const bps = vscode.debug.breakpoints || [];
        for (const bp of bps) {
            if (bp.enabled && bp instanceof vscode.SourceBreakpoint) {
                const loc = bp.location;
                if (loc && loc.uri && loc.uri.toString() === docUriStr) {
                    const bpLine0 = loc.range.start.line; // 0-based
                    if (bpLine0 === (line1Based - 1)) return true;
                }
            }
        }
    } catch { }
    return false;
}
