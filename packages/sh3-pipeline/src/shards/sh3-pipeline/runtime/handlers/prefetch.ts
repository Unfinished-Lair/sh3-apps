import type { NodeHandler } from './index';
import type { PrefetchConfig } from '../../domain/types';
import { keyOf } from '../../domain/prefetch-key';

export function makePrefetchHandler(): NodeHandler {
  return async (ctx, inv) => {
    const cfg = inv.config as unknown as { mode?: string } & PrefetchConfig;
    const live = cfg.list?.rows.find(
      (r) => keyOf(r, cfg.valueField) === cfg.selectedRowKey,
    );
    const row = live ?? cfg.lastSelectedRow ?? null;

    if (!row) {
      ctx.log({
        ts: Date.now(),
        nodeId: inv.nodeId,
        level: 'warn',
        message: `Prefetch node "${cfg.name}" has no valid selection`,
      });
      return { outputs: { value: undefined, record: undefined }, next: null };
    }

    if (!live && cfg.lastSelectedRow) {
      ctx.log({
        ts: Date.now(),
        nodeId: inv.nodeId,
        level: 'debug',
        message: `Prefetch node "${cfg.name}" emitting orphaned selection`,
      });
    }

    const value = cfg.valueField ? row[cfg.valueField] : row;
    return { outputs: { value, record: row }, next: null };
  };
}
