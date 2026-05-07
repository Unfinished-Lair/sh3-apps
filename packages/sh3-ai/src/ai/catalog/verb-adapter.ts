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
 * verb's `result` and the scrollback entries it pushed (which we
 * currently surface back to the LLM only via `result`).
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
          return out.result;
        }
        const args = parseArgs(rawArgs);
        const out = await runVerb(v.shardId, v.name, args, { signal: opts.signal });
        return out.result;
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
