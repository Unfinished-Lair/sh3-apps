import { describe, it, expect, vi, beforeEach } from 'vitest';

const { notify, confirmDelete, readPreview } = vi.hoisted(() => ({
  notify: vi.fn(),
  confirmDelete: vi.fn(),
  readPreview: vi.fn(),
}));

vi.mock('sh3-core', () => ({
  shell: { toast: { notify, clear: vi.fn() } },
}));

vi.mock('./confirmDelete', () => ({ confirmDelete }));

vi.mock('./readPreview', () => ({ readPreview }));

import { runDelete } from './runDelete';
import { SELECTION_TYPE } from '../explorerSelection.svelte';

function makeStore(documents: Array<{ shardId: string; path: string }> = []) {
  return {
    ready: true as const,
    documents,
    setSelection: vi.fn(),
    browse: { deleteFrom: vi.fn(), readFrom: vi.fn() },
  } as never;
}

function makeCtx(deleteFrom?: (...args: unknown[]) => Promise<void>) {
  return {
    browse: deleteFrom ? { deleteFrom, readFrom: vi.fn() } : undefined,
  } as never;
}

const fileSel = {
  type: SELECTION_TYPE,
  ref: { shardId: 'notes', path: 'a.md', kind: 'file' },
  ownerShardId: 'sh3-file-explorer',
};

const dCtxFor = (sel: unknown) => ({
  action: { id: 'x', label: 'X' },
  appId: 'sh3-file-explorer-app',
  invokedVia: 'keyboard' as const,
  dispatch: vi.fn(),
  selection: sel as never,
});

beforeEach(() => {
  notify.mockClear();
  confirmDelete.mockReset();
  readPreview.mockReset();
});

describe('runDelete bail cases', () => {
  it('bails with warn toast when there is no selection', async () => {
    await runDelete(makeCtx(vi.fn()), makeStore(), dCtxFor(undefined), { skipConfirm: false });
    expect(notify).toHaveBeenCalledWith('Select a file or folder first.', { level: 'warn' });
  });

  it('bails with warn toast when selection.type does not match', async () => {
    const wrong = { type: 'other-shard.thing', ref: {}, ownerShardId: 'x' };
    await runDelete(makeCtx(vi.fn()), makeStore(), dCtxFor(wrong), { skipConfirm: false });
    expect(notify).toHaveBeenCalledWith('Select a file or folder first.', { level: 'warn' });
  });

  it('bails with feature-gate toast when ctx.browse.deleteFrom is undefined', async () => {
    const ctx = { browse: { readFrom: vi.fn() } } as never;
    await runDelete(ctx, makeStore(), dCtxFor(fileSel), { skipConfirm: false });
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining('Delete requires sh3-core'),
      { level: 'warn' },
    );
  });

  it('bails with feature-gate toast when ctx.browse itself is missing', async () => {
    await runDelete(makeCtx(undefined), makeStore(), dCtxFor(fileSel), { skipConfirm: false });
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining('Delete requires sh3-core'),
      { level: 'warn' },
    );
  });
});

describe('runDelete file path', () => {
  it('skipConfirm=true on a file: calls deleteFrom once, success toast, clears selection', async () => {
    const deleteFrom = vi.fn().mockResolvedValue(undefined);
    const ctx = makeCtx(deleteFrom);
    const store = makeStore();
    await runDelete(ctx, store, dCtxFor(fileSel), { skipConfirm: true });
    expect(confirmDelete).not.toHaveBeenCalled();
    expect(deleteFrom).toHaveBeenCalledTimes(1);
    expect(deleteFrom).toHaveBeenCalledWith('notes', 'a.md');
    expect(notify).toHaveBeenCalledWith('Deleted a.md', { level: 'success' });
    expect(store.setSelection).toHaveBeenCalledWith(null);
  });

  it('skipConfirm=true on a file: error during deleteFrom toasts error, does not clear selection', async () => {
    const deleteFrom = vi.fn().mockRejectedValue(new Error('boom'));
    const ctx = makeCtx(deleteFrom);
    const store = makeStore();
    await runDelete(ctx, store, dCtxFor(fileSel), { skipConfirm: true });
    expect(notify).toHaveBeenCalledWith(
      'Failed to delete a.md: boom',
      { level: 'error' },
    );
    expect(store.setSelection).not.toHaveBeenCalled();
  });
});
