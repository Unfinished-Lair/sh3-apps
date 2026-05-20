import type { NodeHandler } from './index';

/**
 * Per-node verb config stamped onto each `verb:*` node by `verbsToTemplates`.
 * - `hasInputSchema`: true when the verb declared an object-shaped input schema.
 *   Drives structured-vs-positional dispatch.
 * - `outputPortIds`: list of output port short ids when the verb declared an
 *   object-shaped output schema; `[]` for a single scalar `value` port; `null`
 *   when no output schema was declared (use 4-port fallback shape).
 */
interface VerbNodeConfig {
  shardId?: unknown;
  name?: unknown;
  hasInputSchema?: unknown;
  outputPortIds?: unknown;
}

export function makeVerbHandler(): NodeHandler {
  return async (ctx, inv) => {
    const cfg = inv.config as VerbNodeConfig;
    const shardId = String(cfg.shardId ?? '');
    const name = String(cfg.name ?? '');
    if (!shardId || !name) {
      throw new Error(`verb node ${inv.nodeId}: missing shardId/name in config`);
    }

    const hasInputSchema = cfg.hasInputSchema === true;
    const outputPortIds = normalizeOutputPortIds(cfg.outputPortIds);

    let runResult: { result: unknown; scrollback: unknown[] };
    if (hasInputSchema) {
      const structured: Record<string, unknown> = { ...inv.inputs };
      runResult = await ctx.invokeVerb(shardId, name, [], { signal: ctx.signal, structured });
    } else {
      const args = parseArgsString(inv.inputs.args);
      runResult = await ctx.invokeVerb(shardId, name, args, { signal: ctx.signal });
    }

    // Forward the verb's scrollback to the runner log so users see the
    // verb's own output in the console / log panel.
    for (const entry of runResult.scrollback) {
      const rec = entry as Record<string, unknown> | null;
      if (!rec || typeof rec !== 'object') continue;
      const message = scrollbackMessage(rec);
      if (!message) continue;
      ctx.log({
        ts: typeof rec.ts === 'number' ? (rec.ts as number) : Date.now(),
        nodeId: inv.nodeId,
        level: scrollbackLevel(rec),
        message,
        data: rec,
      });
    }

    const outputs = outputPortIds === null
      ? mapFallbackOutputs(runResult)
      : mapStructuredOutputs(runResult.result, outputPortIds);

    return { outputs, next: 'control-out' };
  };
}

function normalizeOutputPortIds(v: unknown): string[] | null {
  if (v === null || v === undefined) return null;
  if (!Array.isArray(v)) return null;
  return v.filter((x): x is string => typeof x === 'string');
}

function scrollbackLevel(rec: Record<string, unknown>): 'debug' | 'info' | 'warn' | 'error' {
  if (rec.kind === 'status' && typeof rec.level === 'string') {
    if (rec.level === 'error' || rec.level === 'warn' || rec.level === 'info' || rec.level === 'debug') {
      return rec.level;
    }
  }
  if (rec.kind === 'text' && rec.stream === 'stderr') return 'warn';
  return 'info';
}

function scrollbackMessage(rec: Record<string, unknown>): string {
  if (typeof rec.text === 'string' && rec.text.length > 0) return rec.text;
  if (Array.isArray(rec.chunks)) {
    return rec.chunks.filter((c): c is string => typeof c === 'string').join('');
  }
  return '';
}

function parseArgsString(v: unknown): string[] {
  if (typeof v !== 'string' || v.length === 0) return [];
  return v.split(/\s+/).filter(Boolean);
}

function mapStructuredOutputs(result: unknown, portIds: string[]): Record<string, unknown> {
  if (portIds.length === 0) return { value: result };
  if (!result || typeof result !== 'object') {
    return Object.fromEntries(portIds.map((id) => [id, undefined]));
  }
  const out: Record<string, unknown> = {};
  for (const id of portIds) out[id] = (result as Record<string, unknown>)[id];
  return out;
}

function mapFallbackOutputs(run: { result: unknown; scrollback: unknown[] }): Record<string, unknown> {
  return {
    result: run.result,
    stdout: collectStream(run.scrollback, 'stdout'),
    stderr: collectStream(run.scrollback, 'stderr'),
    scrollback: run.scrollback,
  };
}

function collectStream(entries: unknown[], stream: 'stdout' | 'stderr'): string {
  const out: string[] = [];
  for (const e of entries) {
    if (!e || typeof e !== 'object') continue;
    const rec = e as Record<string, unknown>;
    if (rec.kind !== 'text' || rec.stream !== stream) continue;
    if (Array.isArray(rec.chunks)) {
      for (const c of rec.chunks) if (typeof c === 'string') out.push(c);
    } else if (typeof rec.text === 'string') {
      out.push(rec.text);
    }
  }
  return out.join('');
}
