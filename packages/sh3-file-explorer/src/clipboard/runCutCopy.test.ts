import { describe, it, expect, vi } from 'vitest';

vi.mock('sh3-core', () => ({ launchApp: vi.fn() }));

import { runCut, runCopy } from './runCutCopy';
import { SELECTION_TYPE } from '../explorerSelection.svelte';

function makeStore() {
  return {
    ready: true as const,
    clipboard: null,
    setClipboard: vi.fn(),
  } as any;
}

describe('runCut / runCopy', () => {
  it('runCut writes the selection with mode:cut', () => {
    const store = makeStore();
    runCut(store, { type: SELECTION_TYPE, ref: { shardId: 'A', path: 'a.txt', kind: 'file' } });
    expect(store.setClipboard).toHaveBeenCalledWith({
      mode: 'cut',
      ref: { shardId: 'A', path: 'a.txt', kind: 'file' },
    });
  });

  it('runCopy writes the selection with mode:copy', () => {
    const store = makeStore();
    runCopy(store, { type: SELECTION_TYPE, ref: { shardId: 'A', path: 'd', kind: 'folder' } });
    expect(store.setClipboard).toHaveBeenCalledWith({
      mode: 'copy',
      ref: { shardId: 'A', path: 'd', kind: 'folder' },
    });
  });

  it('no-op when selection ref is the wrong type', () => {
    const store = makeStore();
    runCut(store, { type: 'other:type', ref: 'x' });
    expect(store.setClipboard).not.toHaveBeenCalled();
  });
});
