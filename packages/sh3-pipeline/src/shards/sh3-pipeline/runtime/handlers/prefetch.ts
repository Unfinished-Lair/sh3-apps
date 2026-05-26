import type { NodeHandler } from './index';
import type { PrefetchConfig } from '../../domain/types';
import { keyOf } from '../../domain/prefetch-key';

export function makePrefetchHandler(): NodeHandler {
  return async (ctx, inv) => {
    // The asset stores the PrefetchConfig block nested under
    // `config.prefetch` (see `toggleNodeMode` / `commitPrefetchConfig` in
    // runtime/prefetch-actions.ts). Reading from the top-level config
    // misses every field and falls into the "no valid selection" branch
    // even when the inspector clearly shows a selected row.
    const nodeCfg = inv.config as { name?: string; prefetch?: PrefetchConfig };
    const cfg = nodeCfg.prefetch;
    const nodeName = nodeCfg.name ?? cfg?.name ?? '(unnamed)';

    if (!cfg) {
      ctx.log({
        ts: Date.now(),
        nodeId: inv.nodeId,
        level: 'warn',
        message: `Prefetch node "${nodeName}" has no prefetch config`,
      });
      return { outputs: { value: undefined, record: undefined }, next: null };
    }

    const live = cfg.list?.rows.find(
      (r) => keyOf(r, cfg.valueField) === cfg.selectedRowKey,
    );
    const row = live ?? cfg.lastSelectedRow ?? null;

    if (!row) {
      ctx.log({
        ts: Date.now(),
        nodeId: inv.nodeId,
        level: 'warn',
        message: `Prefetch node "${nodeName}" has no valid selection`,
      });
      return { outputs: { value: undefined, record: undefined }, next: null };
    }

    if (!live && cfg.lastSelectedRow) {
      ctx.log({
        ts: Date.now(),
        nodeId: inv.nodeId,
        level: 'debug',
        message: `Prefetch node "${nodeName}" emitting orphaned selection`,
      });
    }

    const value = cfg.valueField ? row[cfg.valueField] : row;
    return { outputs: { value, record: row }, next: null };
  };
}
