import { describe, it, expect, vi, beforeEach } from 'vitest';

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));

vi.mock('sh3-core', () => ({
  sh3: { toast: { notify } },
  launchApp: vi.fn(),
}));

const dispatchMock = vi.hoisted(() => ({
  dispatchOpen: vi.fn(),
  listHandlersFor: vi.fn(),
}));

vi.mock('./dispatch', () => dispatchMock);

import { runOpen } from './runOpen';
import { SELECTION_TYPE } from '../explorerSelection.svelte';

beforeEach(() => vi.clearAllMocks());

describe('runOpen', () => {
  it('builds a FileRef with <shardId>/<path> and dispatches', async () => {
    dispatchMock.dispatchOpen.mockResolvedValueOnce({ status: 'opened', handlerLabel: 'Text Editor' });
    const ctx = { tenantId: 't' } as any;
    await runOpen(ctx, { type: SELECTION_TYPE, ref: { shardId: 'notes', path: 'a.md', kind: 'file' } });
    expect(dispatchMock.dispatchOpen).toHaveBeenCalledWith(
      ctx,
      { path: 'notes/a.md', tenantId: 't', binary: false },
    );
  });

  it('toasts "no handler" outcome', async () => {
    dispatchMock.dispatchOpen.mockResolvedValueOnce({ status: 'no-handler' });
    await runOpen({ tenantId: 't' } as any, { type: SELECTION_TYPE, ref: { shardId: 'notes', path: 'a.bin', kind: 'file' } });
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining('No handler'),
      expect.objectContaining({ level: 'warn' }),
    );
  });

  it('toasts the failure message on failed dispatch', async () => {
    dispatchMock.dispatchOpen.mockResolvedValueOnce({ status: 'failed', error: new Error('boom') });
    await runOpen({ tenantId: 't' } as any, { type: SELECTION_TYPE, ref: { shardId: 'notes', path: 'a.md', kind: 'file' } });
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining('boom'),
      expect.objectContaining({ level: 'error' }),
    );
  });

  it('ignores folder selections', async () => {
    await runOpen({ tenantId: 't' } as any, { type: SELECTION_TYPE, ref: { shardId: 'notes', path: 'd', kind: 'folder' } });
    expect(dispatchMock.dispatchOpen).not.toHaveBeenCalled();
  });
});
