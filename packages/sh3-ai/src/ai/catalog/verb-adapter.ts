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

/** When a verb returns nothing but pushed output to scrollback, surface
 *  that text to the LLM so it sees what a human user would see. If the
 *  verb did return a value, it wins — scrollback is dropped to avoid
 *  double-reporting. */
function foldScrollback(out: { result: unknown; scrollback: unknown[] }): unknown {
  if (out.result !== undefined) return out.result;
  const text = scrollbackToText(out.scrollback);
  return text.length > 0 ? text : '';
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
      for (const c of rec.chunks) {
        if (typeof c === 'string') lines.push(c);
      }
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
