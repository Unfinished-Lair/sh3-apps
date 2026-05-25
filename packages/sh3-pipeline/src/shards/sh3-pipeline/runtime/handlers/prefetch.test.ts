import { describe, expect, it, vi } from 'vitest';
import { makePrefetchHandler } from './prefetch';
import type { RunContext, PrefetchConfig } from '../../domain/types';

function makeCtx(): RunContext {
  return {
    vars: new Map(),
    inputs: {},
    docId: 'doc',
    tenant: 't',
    signal: new AbortController().signal,
    log: vi.fn(),
    invokeVerb: vi.fn(),
    runSubGraph: vi.fn(),
    writeDocument: vi.fn(),
  };
}

function makeNode(cfg: PrefetchConfig) {
  return {
    nodeId: 'n1',
    type: 'verb:workspace-mgr:workspaces.list',
    config: { mode: 'prefetch', ...cfg } as Record<string, unknown>,
    inputs: {},
  };
}

describe('prefetchHandler', () => {
  it('emits value + record from the matched row in list.rows', async () => {
    const handler = makePrefetchHandler();
    const cfg: PrefetchConfig = {
      shardId: 'workspace-mgr',
      name: 'workspaces.list',
      summary: '',
      args: {},
      valueField: 'id',
      list: { rows: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }], fetchedAt: 0, schemaSnapshot: null },
      selectedRowKey: 'a',
      lastSelectedRow: { id: 'a', name: 'A' },
      lastError: null,
    };
    const outcome = await handler(makeCtx(), makeNode(cfg));
    expect(outcome.outputs).toEqual({ value: 'a', record: { id: 'a', name: 'A' } });
    expect(outcome.next).toBeNull();
  });

  it('orphan: emits lastSelectedRow when list.rows no longer contains the key', async () => {
    const handler = makePrefetchHandler();
    const cfg: PrefetchConfig = {
      shardId: 'x', name: 'y', summary: '',
      args: {}, valueField: 'id',
      list: { rows: [{ id: 'b' }], fetchedAt: 0, schemaSnapshot: null },
      selectedRowKey: 'a',
      lastSelectedRow: { id: 'a', name: 'orphan' },
      lastError: null,
    };
    const ctx = makeCtx();
    const outcome = await handler(ctx, makeNode(cfg));
    expect(outcome.outputs).toEqual({ value: 'a', record: { id: 'a', name: 'orphan' } });
    expect(ctx.log).toHaveBeenCalledWith(expect.objectContaining({
      level: 'debug',
      message: expect.stringMatching(/orphaned/i),
    }));
  });

  it('no list and no lastSelectedRow: emits undefined on both ports + warn log', async () => {
    const handler = makePrefetchHandler();
    const cfg: PrefetchConfig = {
      shardId: 'x', name: 'y', summary: '',
      args: {}, valueField: null,
      list: null, selectedRowKey: null, lastSelectedRow: null, lastError: null,
    };
    const ctx = makeCtx();
    const outcome = await handler(ctx, makeNode(cfg));
    expect(outcome.outputs).toEqual({ value: undefined, record: undefined });
    expect(ctx.log).toHaveBeenCalledWith(expect.objectContaining({
      level: 'warn',
      message: expect.stringMatching(/no valid selection/i),
    }));
  });

  it('valueField null: value port emits the full row', async () => {
    const handler = makePrefetchHandler();
    const cfg: PrefetchConfig = {
      shardId: 'x', name: 'y', summary: '',
      args: {}, valueField: null,
      list: { rows: [{ id: 'a' }], fetchedAt: 0, schemaSnapshot: null },
      selectedRowKey: '{"id":"a"}',
      lastSelectedRow: { id: 'a' },
      lastError: null,
    };
    const outcome = await handler(makeCtx(), makeNode(cfg));
    expect(outcome.outputs.value).toEqual({ id: 'a' });
    expect(outcome.outputs.record).toEqual({ id: 'a' });
  });
});
