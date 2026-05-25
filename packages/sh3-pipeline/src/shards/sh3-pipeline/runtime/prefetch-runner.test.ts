import { describe, expect, it, vi } from 'vitest';
import { runPrefetch, type PrefetchRunDeps } from './prefetch-runner';
import type { PrefetchConfig } from '../domain/types';

function makeCfg(over: Partial<PrefetchConfig> = {}): PrefetchConfig {
  return {
    shardId: 'workspace-mgr',
    name: 'workspaces.list',
    summary: '',
    args: { tenant: 't1' },
    valueField: 'id',
    list: null,
    selectedRowKey: null,
    lastSelectedRow: null,
    lastError: null,
    ...over,
  };
}

function makeDeps(invokeVerb: PrefetchRunDeps['invokeVerb']): PrefetchRunDeps {
  return {
    invokeVerb,
    verbOutputItemsSchema: () => ({
      properties: { id: { type: 'string' }, name: { type: 'string' } },
    }),
  };
}

describe('runPrefetch', () => {
  it('calls invokeVerb with structured args from prefetch.args', async () => {
    const invokeVerb = vi.fn().mockResolvedValue({ result: [], scrollback: [] });
    const cfg = makeCfg();
    await runPrefetch({ cfg }, makeDeps(invokeVerb));
    expect(invokeVerb).toHaveBeenCalledWith(
      'workspace-mgr',
      'workspaces.list',
      [],
      expect.objectContaining({ structured: { tenant: 't1' } }),
    );
  });

  it('writes rows + fetchedAt + schemaSnapshot into prefetch.list on success', async () => {
    const rows = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }];
    const invokeVerb = vi.fn().mockResolvedValue({ result: rows, scrollback: [] });
    const cfg = makeCfg();
    const before = Date.now();
    const next = await runPrefetch({ cfg }, makeDeps(invokeVerb));
    expect(next.list?.rows).toEqual(rows);
    expect(next.list?.fetchedAt).toBeGreaterThanOrEqual(before);
    expect(next.list?.schemaSnapshot).toEqual({
      properties: { id: { type: 'string' }, name: { type: 'string' } },
    });
    expect(next.lastError).toBeNull();
  });

  it('rejects non-array results; preserves previous list and records error', async () => {
    const prevList = { rows: [{ id: 'a' }], fetchedAt: 1, schemaSnapshot: null };
    const invokeVerb = vi.fn().mockResolvedValue({ result: 'not an array', scrollback: [] });
    const cfg = makeCfg({ list: prevList });
    const next = await runPrefetch({ cfg }, makeDeps(invokeVerb));
    expect(next.list).toEqual(prevList);
    expect(next.lastError?.message).toMatch(/not an array|expected array/i);
  });

  it('filters non-object items from the array (debug-log via warn channel)', async () => {
    const invokeVerb = vi.fn().mockResolvedValue({
      result: [{ id: 'a' }, 42, null, { id: 'b' }, 'string'],
      scrollback: [],
    });
    const cfg = makeCfg();
    const next = await runPrefetch({ cfg }, makeDeps(invokeVerb));
    expect(next.list?.rows).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('records error and preserves previous list when invokeVerb throws', async () => {
    const prevList = { rows: [{ id: 'a' }], fetchedAt: 1, schemaSnapshot: null };
    const invokeVerb = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    const cfg = makeCfg({ list: prevList });
    const next = await runPrefetch({ cfg }, makeDeps(invokeVerb));
    expect(next.list).toEqual(prevList);
    expect(next.lastError?.message).toBe('ECONNREFUSED');
  });

  it('orphan: selection key absent from new rows — keeps lastSelectedRow, leaves selectedRowKey', async () => {
    const invokeVerb = vi.fn().mockResolvedValue({
      result: [{ id: 'b' }, { id: 'c' }],
      scrollback: [],
    });
    const cfg = makeCfg({
      selectedRowKey: 'a',
      lastSelectedRow: { id: 'a', name: 'gone' },
    });
    const next = await runPrefetch({ cfg }, makeDeps(invokeVerb));
    expect(next.selectedRowKey).toBe('a');
    expect(next.lastSelectedRow).toEqual({ id: 'a', name: 'gone' });
  });

  it('match: refreshes lastSelectedRow to the new row when key still resolves', async () => {
    const invokeVerb = vi.fn().mockResolvedValue({
      result: [{ id: 'a', name: 'Acme v2' }, { id: 'b' }],
      scrollback: [],
    });
    const cfg = makeCfg({
      selectedRowKey: 'a',
      lastSelectedRow: { id: 'a', name: 'Acme v1' },
    });
    const next = await runPrefetch({ cfg }, makeDeps(invokeVerb));
    expect(next.selectedRowKey).toBe('a');
    expect(next.lastSelectedRow).toEqual({ id: 'a', name: 'Acme v2' });
  });

  it('forwards the abort signal to invokeVerb', async () => {
    const invokeVerb = vi.fn().mockResolvedValue({ result: [], scrollback: [] });
    const cfg = makeCfg();
    const controller = new AbortController();
    await runPrefetch({ cfg, signal: controller.signal }, makeDeps(invokeVerb));
    expect(invokeVerb).toHaveBeenCalledWith(
      'workspace-mgr',
      'workspaces.list',
      [],
      expect.objectContaining({ signal: controller.signal }),
    );
  });
});
