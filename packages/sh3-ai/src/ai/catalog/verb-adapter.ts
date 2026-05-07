import type { Tool } from './types';

export interface VerbDescriptor {
  shardId: string;
  name: string;
  summary: string | undefined;
}

export type VerbRunner = (
  shardId: string,
  name: string,
  args: string[],
  opts: { signal: AbortSignal },
) => Promise<unknown>;

export function verbsToTools(
  verbs: ReadonlyArray<VerbDescriptor>,
  runVerb: VerbRunner,
): Tool[] {
  return verbs.map((v) => ({
    name: `${v.shardId}.${v.name}`,
    description: v.summary && v.summary.length > 0 ? v.summary : '(no description)',
    inputSchema: {
      type: 'object',
      properties: {
        args: {
          type: 'string',
          description: 'Whitespace-separated positional arguments.',
        },
      },
      required: ['args'],
    },
    source: 'verb' as const,
    run: async (rawArgs: unknown, opts) => {
      const args = parseArgs(rawArgs);
      return runVerb(v.shardId, v.name, args, opts);
    },
  }));
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
