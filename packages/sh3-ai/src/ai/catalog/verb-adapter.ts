import type { Tool, JsonSchema } from './types';

/**
 * Verb descriptor as returned by sh3-core 0.15's `ctx.listVerbs()`.
 * `name` is the shardId-prefixed form (e.g. 'sh3-r2:backup').
 * `schema.input` is JSON Schema; when present, the LLM gets typed args
 * and we dispatch with `runVerb(..., { structured })`.
 */
export interface VerbDescriptor {
  shardId: string;
  name: string;
  summary: string | undefined;
  /** Loose `unknown` so we accept sh3-core's PortableJSONSchema (strict
   *  shape) and any equivalent JSON-shaped value without a structural
   *  type clash. The schema is passed verbatim to the LLM. */
  schema?: { input: unknown };
}

/**
 * Programmatic verb dispatch — sh3-core's `ctx.runVerb`. Returns the
 * verb's `result` (when it returns one) and any scrollback entries it
 * pushed during execution. Many SH3 built-ins publish their output via
 * scrollback rather than `return` — see `scrollbackToText` below.
 */
export type VerbRunner = (
  shardId: string,
  name: string,
  args: string[],
  opts: { signal: AbortSignal; structured?: unknown },
) => Promise<{ result: unknown; scrollback: unknown[] }>;

const FALLBACK_SCHEMA: JsonSchema = {
  type: 'object',
  properties: {
    args: {
      type: 'string',
      description: 'Whitespace-separated positional arguments.',
    },
  },
  required: ['args'],
};

export function verbsToTools(
  verbs: ReadonlyArray<VerbDescriptor>,
  runVerb: VerbRunner,
): Tool[] {
  return verbs.map((v) => {
    const hasSchema = v.schema !== undefined && v.schema.input !== undefined;
    const inputSchema: JsonSchema = hasSchema
      ? (v.schema!.input as JsonSchema)
      : FALLBACK_SCHEMA;
    return {
      name: toolNameFor(v),
      description: v.summary && v.summary.length > 0 ? v.summary : '(no description)',
      inputSchema,
      source: 'verb' as const,
      run: async (rawArgs: unknown, opts) => {
        if (hasSchema) {
          const out = await runVerb(v.shardId, v.name, [], {
            signal: opts.signal,
            structured: rawArgs,
          });
          return foldScrollback(out);
        }
        const args = parseArgs(rawArgs);
        const out = await runVerb(v.shardId, v.name, args, { signal: opts.signal });
        return foldScrollback(out);
      },
    };
  });
}

/** Convert a prefixed verb name 'shardId:bare' to a tool name 'shardId.bare'.
 *  Tool names use '.' so the glob matcher (single-segment '*') stays meaningful. */
function toolNameFor(v: VerbDescriptor): string {
  const prefix = `${v.shardId}:`;
  const bare = v.name.startsWith(prefix) ? v.name.slice(prefix.length) : v.name;
  return `${v.shardId}.${bare}`;
}

/** When a verb returns nothing meaningful but pushed output to scrollback,
 *  surface that text to the LLM so it sees what a human user would see. A
 *  defined-but-empty result (`''`, `[]`, `{}`, `null`) is treated as
 *  "no useful return" and we still fall back to scrollback — many SH3
 *  built-ins return such placeholders while emitting their real output via
 *  `vctx.scrollback`.
 *
 *  Verbs that fail under programmatic invocation (e.g. they expect a shell
 *  vctx that sh3-core's `runVerb` doesn't provide) typically signal failure
 *  by pushing a `level: 'error'` status to scrollback and returning nothing.
 *  We detect that pattern and throw, so the dispatch loop's catch translates
 *  it to a `{ error }` tool-result — the LLM treats those as terminal,
 *  whereas plain error-shaped text gets ignored and the model retries. */
function foldScrollback(out: { result: unknown; scrollback: unknown[] }): unknown {
  if (isEmptyResult(out.result)) {
    const errorText = collectScrollbackErrors(out.scrollback);
    if (errorText.length > 0) throw new Error(errorText);
  }
  const text = scrollbackToText(out.scrollback);
  if (text.length > 0 && isEmptyResult(out.result)) return text;
  if (out.result !== undefined) return out.result;
  return text;
}

/** Returns the joined text of error-level scrollback entries, or '' if
 *  none. An "error entry" is a status with `level: 'error'` or a text
 *  stream on stderr. */
function collectScrollbackErrors(entries: unknown[]): string {
  const lines: string[] = [];
  for (const e of entries) {
    if (!e || typeof e !== 'object') continue;
    const rec = e as Record<string, unknown>;
    if (rec.level === 'error' && typeof rec.text === 'string') {
      lines.push(rec.text);
      continue;
    }
    if (rec.stream === 'stderr' && Array.isArray(rec.chunks)) {
      const joined = rec.chunks.filter((c): c is string => typeof c === 'string').join('');
      if (joined) lines.push(joined);
    }
  }
  return lines.join('\n');
}

function isEmptyResult(r: unknown): boolean {
  if (r === undefined || r === null || r === '') return true;
  if (Array.isArray(r)) return r.length === 0;
  if (typeof r === 'object') return Object.keys(r as object).length === 0;
  return false;
}

function scrollbackToText(entries: unknown[]): string {
  const lines: string[] = [];
  for (const e of entries) {
    if (!e || typeof e !== 'object') continue;
    const rec = e as Record<string, unknown>;
    if (typeof rec.text === 'string') {
      lines.push(rec.text);
      continue;
    }
    if (Array.isArray(rec.chunks)) {
      const joined = rec.chunks.filter((c): c is string => typeof c === 'string').join('');
      if (joined) lines.push(joined);
      continue;
    }
    // Rich entry (table, list, tree, custom kinds from sh3-core/other shards)
    // — we don't know the schema, so JSON-stringify the payload minus the
    // transient `ts` field. The LLM gets enough structure to reason about it
    // rather than nothing at all.
    try {
      const { ts: _ts, ...rest } = rec;
      lines.push(JSON.stringify(rest));
    } catch {
      // Skip entries that can't be serialized (cycles, etc.).
    }
  }
  return lines.join('\n');
}

function parseArgs(raw: unknown): string[] {
  if (typeof raw === 'string') {
    return raw.length > 0 ? raw.split(/\s+/).filter(Boolean) : [];
  }
  if (raw && typeof raw === 'object' && 'args' in raw) {
    const v = (raw as { args: unknown }).args;
    if (typeof v === 'string') return parseArgs(v);
  }
  return [];
}
