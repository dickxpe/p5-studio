import * as recast from 'recast';

const builders = recast.types.builders;

export interface LoopGuardOptions {
  helperName?: string;
  tagPrefix?: string;
}

export interface InjectLoopGuardsResult {
  code: string;
  modified: boolean;
}

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const DEFAULT_HELPER = '__p5LoopGuard';

export const LOOP_GUARD_HELPER_SNIPPET = `
(function(){
  if (typeof window === 'undefined') { return; }
  const DEFAULT_MAX_ITERATIONS = 4000;
  const DEFAULT_MAX_TIME_MS = 250;
  const DEFAULT_IDLE_RESET_MS = 5;
  const guardConfig = (window && window.__p5LoopGuardConfig) || {};
  if (guardConfig && guardConfig.enabled === false) {
    window.__p5LoopGuard = function(){ };
    window.__p5ResetLoopGuards = function(){ };
    return;
  }
  function clampPositive(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }
  const MAX_ITERATIONS = clampPositive(guardConfig.maxIterations, DEFAULT_MAX_ITERATIONS);
  const MAX_TIME_MS = clampPositive(guardConfig.maxTimeMs, DEFAULT_MAX_TIME_MS);
  const IDLE_RESET_MS = clampPositive(guardConfig.idleResetMs, DEFAULT_IDLE_RESET_MS);
  const state = new Map();
  function now(){
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      return performance.now();
    }
    return Date.now();
  }
  function getFrameMarker(){
    try {
      if (typeof window.__liveP5FrameCounter === 'number' && Number.isFinite(window.__liveP5FrameCounter)) {
        return window.__liveP5FrameCounter;
      }
      if (typeof window.frameCount === 'number' && Number.isFinite(window.frameCount)) {
        return window.frameCount;
      }
      if (window._p5Instance && typeof window._p5Instance.frameCount === 'number' && Number.isFinite(window._p5Instance.frameCount)) {
        return window._p5Instance.frameCount;
      }
    } catch { }
    return undefined;
  }
  function createState(ts, frameMarker){
    return { count: 0, start: ts, last: ts, frame: typeof frameMarker === 'number' ? frameMarker : undefined, timeout: null };
  }
  function clearPending(info){
    if (info && info.timeout) {
      try { clearTimeout(info.timeout); } catch { }
      info.timeout = null;
    }
  }
  function scheduleAutoReset(k, info){
    clearPending(info);
    info.timeout = setTimeout(() => {
      try { state.delete(k); } catch { }
    }, IDLE_RESET_MS);
  }
  function shouldReset(info, frameMarker, ts){
    if (typeof frameMarker === 'number') {
      if (info.frame !== frameMarker) {
        return true;
      }
    } else if (typeof info.frame === 'number' && typeof frameMarker !== 'number') {
      if ((ts - info.last) > IDLE_RESET_MS) {
        return true;
      }
    } else if ((ts - info.last) > IDLE_RESET_MS) {
      return true;
    }
    return false;
  }
  function key(tag){
    return (typeof tag === 'string' && tag.length > 0) ? tag : 'loop';
  }
  function parseTag(tag) {
    if (typeof tag !== 'string' || !tag) return {};
    const parts = tag.split('@');
    const info = {};
    if (parts[0]) info.file = parts[0];
    if (parts[1]) info.loop = parts[1];
    if (parts[2]) {
      const linePart = parts[2].split(':')[0];
      if (linePart) info.line = linePart;
    }
    return info;
  }
  function formatMessage(tag) {
    const info = parseTag(tag);
    const fileName = info.file || 'sketch';
    const loopName = info.loop || 'loop';
    const lineSegment = info.line ? ' on line ' + info.line : '';
    return '[‼️RUNTIME ERROR in ' + fileName + '] Potential infinite loop detected near ' + loopName + '-loop' + lineSegment + '.';
  }
  window.__p5ResetLoopGuards = function(){ state.clear(); };
  window.__p5LoopGuard = function(tag){
    const k = key(tag);
    const ts = now();
    const frameMarker = getFrameMarker();
    let info = state.get(k);
    if (!info) {
      info = createState(ts, frameMarker);
      state.set(k, info);
    } else {
      if (shouldReset(info, frameMarker, ts)) {
        clearPending(info);
        info.count = 0;
        info.start = ts;
      }
      info.frame = typeof frameMarker === 'number' ? frameMarker : undefined;
    }
    info.last = ts;
    info.count += 1;
    scheduleAutoReset(k, info);
    if (info.count > MAX_ITERATIONS || (ts - info.start) > MAX_TIME_MS) {
      clearPending(info);
      state.delete(k);
      const message = formatMessage(tag);
      if (typeof window.__p5HandleLoopGuardHit === 'function') {
        try { window.__p5HandleLoopGuardHit(tag, message); } catch (err) {
          try { console.warn('Loop guard handler failed', err); } catch {}
        }
      }
      throw new Error(message);
    }
  };
})();
`;

export function injectLoopGuards(code: string, options?: LoopGuardOptions): InjectLoopGuardsResult {
  const helperName = normalizeHelperName(options?.helperName);
  try {
    const acorn = require('acorn');
    const ast = recast.parse(code, {
      parser: {
        parse(src: string) {
          return acorn.parse(src, { ecmaVersion: 2020, sourceType: 'script', locations: true });
        }
      }
    });
    let modified = false;

    function guardLoop(node: any, loopType: string) {
      const tag = buildTag(loopType, node.loc, options?.tagPrefix);
      node.body = ensureGuardedBlock(node.body, tag);
    }

    function ensureGuardedBlock(body: any, tag: string) {
      const guardStatement = buildGuardStatement(tag);
      if (body && body.type === 'BlockStatement') {
        if (!isGuardStatement(body.body[0])) {
          body.body.unshift(guardStatement);
          modified = true;
        }
        return body;
      }
      modified = true;
      if (!body || body.type === 'EmptyStatement') {
        return builders.blockStatement([guardStatement]);
      }
      return builders.blockStatement([guardStatement, body]);
    }

    function buildGuardStatement(tag: string) {
      const guardCallee = builders.memberExpression(
        builders.identifier('window'),
        builders.identifier(helperName),
        false
      );
      const args = (typeof tag === 'string' && tag.length > 0)
        ? [builders.literal(tag)]
        : [];
      return builders.expressionStatement(builders.callExpression(guardCallee, args));
    }

    function isGuardStatement(node: any): boolean {
      if (!node || node.type !== 'ExpressionStatement') return false;
      const expr = node.expression;
      if (!expr || expr.type !== 'CallExpression') return false;
      if (expr.callee.type === 'MemberExpression' && expr.callee.object.type === 'Identifier' && expr.callee.object.name === 'window') {
        if (expr.callee.property.type === 'Identifier' && expr.callee.property.name === helperName) {
          return true;
        }
      }
      if (expr.callee.type === 'Identifier' && expr.callee.name === helperName) {
        return true;
      }
      return false;
    }

    function buildTag(loopType: string, loc: any, prefix?: string) {
      const parts: string[] = [];
      if (prefix) parts.push(prefix);
      parts.push(loopType);
      if (loc && loc.start && typeof loc.start.line === 'number') {
        const col = typeof loc.start.column === 'number' ? loc.start.column : 0;
        parts.push(`${loc.start.line}:${col}`);
      }
      return parts.join('@');
    }

    recast.types.visit(ast, {
      visitForStatement(path) {
        guardLoop(path.value, 'for');
        this.traverse(path);
      },
      visitWhileStatement(path) {
        guardLoop(path.value, 'while');
        this.traverse(path);
      },
      visitDoWhileStatement(path) {
        guardLoop(path.value, 'do-while');
        this.traverse(path);
      },
      visitForInStatement(path) {
        guardLoop(path.value, 'for-in');
        this.traverse(path);
      },
      visitForOfStatement(path) {
        guardLoop(path.value, 'for-of');
        this.traverse(path);
      }
    });

    if (!modified) {
      return { code, modified: false };
    }
    return { code: recast.print(ast).code, modified: true };
  } catch {
    return { code, modified: false };
  }
}

function normalizeHelperName(candidate?: string): string {
  if (candidate && IDENTIFIER_RE.test(candidate)) {
    return candidate;
  }
  return DEFAULT_HELPER;
}
