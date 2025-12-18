export type TriggerDef = {
  id: string;
  label: string;
  fnName: string;
  params: string[];
};

function unquoteLabel(raw: string): string {
  const s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    const inner = s.slice(1, -1);
    // Minimal unescape for common sequences
    return inner
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
  }
  return s;
}

function splitTopLevelArgs(list: string): string[] {
  const out: string[] = [];
  let cur = '';
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let esc = false;

  for (let i = 0; i < list.length; i++) {
    const ch = list[i];
    if (esc) {
      cur += ch;
      esc = false;
      continue;
    }
    if (ch === '\\') {
      cur += ch;
      esc = true;
      continue;
    }

    if (inSingle) {
      cur += ch;
      if (ch === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      cur += ch;
      if (ch === '"') inDouble = false;
      continue;
    }
    if (inTemplate) {
      cur += ch;
      if (ch === '`') inTemplate = false;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      cur += ch;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      cur += ch;
      continue;
    }
    if (ch === '`') {
      inTemplate = true;
      cur += ch;
      continue;
    }

    if (ch === '(') depthParen++;
    else if (ch === ')') depthParen = Math.max(0, depthParen - 1);
    else if (ch === '[') depthBracket++;
    else if (ch === ']') depthBracket = Math.max(0, depthBracket - 1);
    else if (ch === '{') depthBrace++;
    else if (ch === '}') depthBrace = Math.max(0, depthBrace - 1);

    const atTop = depthParen === 0 && depthBracket === 0 && depthBrace === 0;
    if (ch === ',' && atTop) {
      const trimmed = cur.trim();
      if (trimmed.length) out.push(trimmed);
      cur = '';
      continue;
    }

    cur += ch;
  }

  const trimmed = cur.trim();
  if (trimmed.length) out.push(trimmed);
  return out;
}

function normalizeParam(p: string): string {
  let s = p.trim();
  if (!s) return s;
  // Remove rest operator
  if (s.startsWith('...')) s = s.slice(3).trim();

  // Remove TypeScript type annotations at top-level (best-effort)
  // e.g. (x: number = 1) =>
  const eqIdx = s.indexOf('=');
  const beforeDefault = eqIdx >= 0 ? s.slice(0, eqIdx).trim() : s;
  const colonIdx = beforeDefault.indexOf(':');
  if (colonIdx >= 0) {
    s = beforeDefault.slice(0, colonIdx).trim() + (eqIdx >= 0 ? ' ' + s.slice(eqIdx).trim() : '');
  } else {
    s = s;
  }

  // Remove default assignment
  const eq2 = s.indexOf('=');
  if (eq2 >= 0) s = s.slice(0, eq2).trim();

  return s;
}

function parseParamsFromParenList(parenList: string): string[] {
  if (!parenList.trim()) return [];
  const parts = splitTopLevelArgs(parenList);
  return parts.map(normalizeParam).filter(Boolean);
}

export function extractTriggers(code: string): TriggerDef[] {
  const lines = String(code || '').split(/\r?\n/);
  const triggers: TriggerDef[] = [];

  // Supports:
  //   //@trigger("Label")
  //   //@trigger('Label')
  //   //@trigger()           -> defaults to function name
  //   //@trigger             -> defaults to function name
  const triggerRe = /^\s*\/\/\s*@trigger(?:\s*\(\s*(.*?)\s*\))?\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(triggerRe);
    if (!m) continue;

    const rawLabel = (typeof m[1] === 'string') ? m[1].trim() : '';
    const label = rawLabel ? unquoteLabel(rawLabel) : '';

    // Find next non-empty, non-comment line for a function signature.
    let sigLine = '';
    let sigIndex = -1;
    for (let j = i + 1; j < Math.min(lines.length, i + 15); j++) {
      const raw = lines[j];
      const t = raw.trim();
      if (!t) continue;
      if (t.startsWith('//')) continue;
      if (t.startsWith('/*') || t.startsWith('*')) continue;
      sigLine = raw;
      sigIndex = j;
      break;
    }
    if (!sigLine) continue;

    // Patterns
    // 1) function name(a,b)
    let fnName: string | undefined;
    let paramList: string | undefined;

    let mm = sigLine.match(/^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/);
    if (mm) {
      fnName = mm[1];
      paramList = mm[2] ?? '';
    }

    // 2) const name = function(a,b)
    if (!fnName) {
      mm = sigLine.match(/^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\s*\(([^)]*)\)/);
      if (mm) {
        fnName = mm[1];
        paramList = mm[2] ?? '';
      }
    }

    // 3) const name = (a,b) =>
    if (!fnName) {
      mm = sigLine.match(/^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/);
      if (mm) {
        fnName = mm[1];
        paramList = mm[2] ?? '';
      }
    }

    // 4) const name = a =>
    if (!fnName) {
      mm = sigLine.match(/^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?([A-Za-z_$][\w$]*)\s*=>/);
      if (mm) {
        fnName = mm[1];
        paramList = mm[2] ?? '';
      }
    }

    if (!fnName) continue;

    const params = paramList ? (paramList.includes(',') || paramList.includes('{') || paramList.includes('[')
      ? parseParamsFromParenList(paramList)
      : [normalizeParam(paramList)].filter(Boolean)) : [];

    const effectiveLabel = label || fnName;
    const id = `${fnName}::${effectiveLabel}::${sigIndex}`;
    triggers.push({ id, label: effectiveLabel, fnName, params });
  }

  return triggers;
}
