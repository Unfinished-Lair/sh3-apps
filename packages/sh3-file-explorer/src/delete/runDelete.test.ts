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

describe('runDelete file modal path', () => {
  it('skipConfirm=false on a file: opens modal with preview; on confirm deletes', async () => {
    readPreview.mockResolvedValue({ state: 'text', text: 'hello' });
    confirmDelete.mockResolvedValue(true);
    const deleteFrom = vi.fn().mockResolvedValue(undefined);
    const ctx = makeCtx(deleteFrom);
    const store = makeStore();
    await runDelete(ctx, store, dCtxFor(fileSel), { skipConfirm: false });

    expect(readPreview).toHaveBeenCalledWith(ctx.browse, 'notes', 'a.md');
    expect(confirmDelete).toHaveBeenCalledWith({
      target: { shardId: 'notes', path: 'a.md', kind: 'file' },
      previewText: 'hello',
      previewState: 'text',
    });
    expect(deleteFrom).toHaveBeenCalledWith('notes', 'a.md');
    expect(notify).toHaveBeenCalledWith('Deleted a.md', { level: 'success' });
  });

  it('skipConfirm=false on a file: cancel skips deleteFrom and toast', async () => {
    readPreview.mockResolvedValue({ state: 'text', text: 'hello' });
    confirmDelete.mockResolvedValue(false);
    const deleteFrom = vi.fn();
    await runDelete(makeCtx(deleteFrom), makeStore(), dCtxFor(fileSel), { skipConfirm: false });
    expect(deleteFrom).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });
});

const folderSel = {
  type: SELECTION_TYPE,
  ref: { shardId: 'notes', path: 'docs', kind: 'folder' },
  ownerShardId: 'sh3-file-explorer',
};

describe('runDelete folder path', () => {
  it('opens modal with descendantCount; on confirm fans out deleteFrom across descendants', async () => {
    confirmDelete.mockResolvedValue(true);
    const deleteFrom = vi.fn().mockResolvedValue(undefined);
    const ctx = makeCtx(deleteFrom);
    const store = makeStore([
      { shardId: 'notes', path: 'docs/a.md' },
      { shardId: 'notes', path: 'docs/sub/b.md' },
      { shardId: 'notes', path: 'other/c.md' },
      { shardId: 'other-shard', path: 'docs/d.md' },
    ]);
    await runDelete(ctx, store, dCtxFor(folderSel), { skipConfirm: false });

    expect(confirmDelete).toHaveBeenCalledWith({
      target: { shardId: 'notes', path: 'docs', kind: 'folder', descendantCount: 2 },
      previewText: null,
      previewState: 'text',
    });
    expect(readPreview).not.toHaveBeenCalled();
    expect(deleteFrom).toHaveBeenCalledTimes(2);
    expect(deleteFrom).toHaveBeenCalledWith('notes', 'docs/a.md');
    expect(deleteFrom).toHaveBeenCalledWith('notes', 'docs/sub/b.md');
    expect(notify).toHaveBeenCalledWith(
      'Deleted folder /docs (2 files)',
      { level: 'success' },
    );
    expect(store.setSelection).toHaveBeenCalledWith(null);
  });

  it('Shift+Delete on a folder still opens the modal (bypass-guard)', async () => {
    confirmDelete.mockResolvedValue(false);
    const deleteFrom = vi.fn();
    const store = makeStore([{ shardId: 'notes', path: 'docs/a.md' }]);
    await runDelete(makeCtx(deleteFrom), store, dCtxFor(folderSel), { skipConfirm: true });
    expect(confirmDelete).toHaveBeenCalled();
    expect(deleteFrom).not.toHaveBeenCalled();
  });

  it('partial folder failure: error toast reports n/total', async () => {
    confirmDelete.mockResolvedValue(true);
    const deleteFrom = vi.fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('nope'))
      .mockResolvedValueOnce(undefined);
    const ctx = makeCtx(deleteFrom);
    const store = makeStore([
      { shardId: 'notes', path: 'docs/a.md' },
      { shardId: 'notes', path: 'docs/b.md' },
      { shardId: 'notes', path: 'docs/c.md' },
    ]);
    await runDelete(ctx, store, dCtxFor(folderSel), { skipConfirm: false });
    expect(notify).toHaveBeenCalledWith(
      'Deleted 2/3; 1 failed',
      { level: 'error' },
    );
    expect(store.setSelection).toHaveBeenCalledWith(null);
  });
});
