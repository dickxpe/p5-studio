import * as vscode from 'vscode';

export function handleLog(
  params: { message: any; focus?: boolean },
  deps: {
    canLog: () => boolean;
    outputChannel: vscode.OutputChannel;
    getTime: () => string;
    focusOutputChannel?: () => void;
  }
) {
  if (!deps.canLog()) return;
  const toStr = (v: any) => typeof v === 'string' ? v : (v && v.toString ? v.toString() : String(v));
  const raw = Array.isArray(params.message) ? params.message.map(toStr).join(' ') : toStr(params.message);
  let sanitized = raw.split(/\r?\n/).filter(line => !/^\s*For more details, see:\s*/i.test(line)).join('\n').trim();
  const matchesP5Hint = sanitized.includes("Did you just try to use p5.js's") && sanitized.includes("into your sketch's setup() function");
  if (matchesP5Hint) {
    sanitized = sanitized.replace("Did you just try to use p5.js's", "Did you just try to use p5.js's or your own function").replace("into your sketch's setup() function", "into your sketch's setup() or draw() function");
  }
  if (sanitized.length === 0) return;
  if (params.focus && deps.focusOutputChannel) {
    try { deps.focusOutputChannel(); } catch { }
  }
  deps.outputChannel.appendLine(`${deps.getTime()} [💭LOG]: ${sanitized}`);
}
