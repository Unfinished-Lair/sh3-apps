import type { PrefetchConfig } from '../domain/types';
import { keyOf } from '../domain/prefetch-key';

export interface PrefetchInvocation {
  cfg: PrefetchConfig;
  signal?: AbortSignal;
}

export interface PrefetchRunDeps {
  invokeVerb: (
    shardId: string,
    name: string,
    args: string[],
    opts?: { signal?: AbortSignal; structured?: unknown },
  ) => Promise<{ result: unknown; scrollback: unknown[] }>;
  /**
   * Returns the live `schema.output.items` block for the given verb, or null
   * when the verb declares no output schema. Used to snapshot the row shape
   * alongside the rows themselves so the inspector can resolve value-field
   * options offline.
   */
  verbOutputItemsSchema: (shardId: string, name: string) =>
    | { properties: Record<string, unknown> }
    | null;
}

/**
 * Pure function over the prefetch config. Does NOT mutate the input cfg.
 * Returns the next-state cfg that the shard writes back into the graph asset.
 */
export async function runPrefetch(
  inv: PrefetchInvocation,
  deps: PrefetchRunDeps,
): Promise<PrefetchConfig> {
  const { cfg, signal } = inv;

  let result: { result: unknown; scrollback: unknown[] };
  try {
    result = await deps.invokeVerb(cfg.shardId, cfg.name, [], {
      signal,
      structured: cfg.args,
    });
  } catch (err) {
    return {
      ...cfg,
      lastError: { message: err instanceof Error ? err.message : String(err), ts: Date.now() },
    };
  }

  if (!Array.isArray(result.result)) {
    return {
      ...cfg,
      lastError: { message: 'expected array result, got ' + typeof result.result, ts: Date.now() },
    };
  }

  const rows: Record<string, unknown>[] = [];
  for (const item of result.result) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      rows.push(item as Record<string, unknown>);
    }
  }

  const schemaSnapshot = deps.verbOutputItemsSchema(cfg.shardId, cfg.name);
  const list = { rows, fetchedAt: Date.now(), schemaSnapshot };

  let nextSelectedRow = cfg.lastSelectedRow;
  if (cfg.selectedRowKey !== null) {
    const match = rows.find((r) => keyOf(r, cfg.valueField) === cfg.selectedRowKey);
    if (match) nextSelectedRow = match;
  }

  return {
    ...cfg,
    list,
    lastSelectedRow: nextSelectedRow,
    lastError: null,
  };
}
