import { describe, it, expect, vi } from 'vitest';

vi.mock('sh3-core', () => ({ launchApp: vi.fn() }));

import { createExplorerStore } from './explorerShard.svelte';
import type { ShardContext } from 'sh3-core';

function makeCtx(): ShardContext {
  return {
    browse: {
      listDocuments: vi.fn(async () => []),
      watchDocuments: vi.fn(() => () => {}),
    },
    contributions: { list: vi.fn(() => []), onChange: vi.fn(() => () => {}) },
  } as unknown as ShardContext;
}

describe('ExplorerStore clipboard', () => {
  it('starts null', () => {
    const store = createExplorerStore(makeCtx());
    if (!store.ready) throw new Error('expected ready store');
    expect(store.clipboard).toBeNull();
  });

  it('setClipboard updates the field', () => {
    const store = createExplorerStore(makeCtx());
    if (!store.ready) throw new Error('expected ready store');
    store.setClipboard({ mode: 'cut', ref: { shardId: 'A', path: 'a.txt', kind: 'file' } });
    expect(store.clipboard).toEqual({ mode: 'cut', ref: { shardId: 'A', path: 'a.txt', kind: 'file' } });
  });

  it('clearClipboard nulls it', () => {
    const store = createExplorerStore(makeCtx());
    if (!store.ready) throw new Error('expected ready store');
    store.setClipboard({ mode: 'copy', ref: { shardId: 'A', path: 'a.txt', kind: 'file' } });
    store.clearClipboard();
    expect(store.clipboard).toBeNull();
  });
});
