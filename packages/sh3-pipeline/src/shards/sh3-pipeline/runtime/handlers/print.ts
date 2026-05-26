import type { NodeHandler } from './index';
import { resolvePath } from './print-path';

function toDisplay(v: unknown): string {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object') {
    try { return JSON.stringify(v, null, 2); }
    catch { return String(v); }
  }
  return String(v);
}

export function makePrintHandler(): NodeHandler {
  return async (ctx, inv) => {
    const cfg = inv.config as { path?: string; label?: string };
    const label = (cfg.label ?? '').trim();
    const prefix = label ? `${label}: ` : '';

    if (!('value' in inv.inputs) || inv.inputs.value === undefined) {
      ctx.log({ ts: Date.now(), nodeId: inv.nodeId, level: 'info', message: `${prefix}(no input)` });
      return { outputs: {}, next: 'run-out' };
    }

    const raw = inv.inputs.value;
    let resolved: unknown = raw;
    if (cfg.path && cfg.path.length > 0) {
      try {
        resolved = resolvePath(raw, cfg.path);
      } catch (e) {
        ctx.log({ ts: Date.now(), nodeId: inv.nodeId, level: 'warn',
          message: `${prefix}(path error: ${String((e as Error).message)})` });
        return { outputs: {}, next: 'run-out' };
      }
      if (resolved === undefined) {
        ctx.log({ ts: Date.now(), nodeId: inv.nodeId, level: 'info',
          message: `${prefix}(path miss: ${cfg.path})` });
        return { outputs: {}, next: 'run-out' };
      }
    }

    ctx.log({ ts: Date.now(), nodeId: inv.nodeId, level: 'info',
      message: `${prefix}${toDisplay(resolved)}`, data: resolved });
    return { outputs: {}, next: 'run-out' };
  };
}
