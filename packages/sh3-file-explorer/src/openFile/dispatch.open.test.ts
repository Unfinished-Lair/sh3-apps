import { describe, it, expect, vi } from 'vitest';
import type { FileHandlerDescriptor, FileRef, ShardContext } from 'sh3-core';

const { launchApp } = vi.hoisted(() => ({ launchApp: vi.fn(async () => undefined) }));

vi.mock('sh3-core', () => ({
  launchApp,
}));

import { dispatchOpen } from './dispatch';

function ctxWith(handlers: FileHandlerDescriptor[]): ShardContext {
  return {
    contributions: { list: vi.fn(() => handlers) },
    browse: { readFrom: vi.fn(async () => null) },
  } as unknown as ShardContext;
}

describe('dispatchOpen', () => {
  it('returns no-handler when nothing matches the extension', async () => {
    const ctx = ctxWith([]);
    const file: FileRef = { path: 'a/b.dat', tenantId: 't', binary: false };
    const result = await dispatchOpen(ctx, file);
    expect(result).toEqual({ status: 'no-handler' });
  });

  it('invokes the highest-priority view handler and returns opened', async () => {
    const open = vi.fn(async () => {});
    const ctx = ctxWith([
      { label: 'A', match: { extensions: ['.md'] }, open: { type: 'view', open } },
    ]);
    const file: FileRef = { path: 'a/b.md', tenantId: 't', binary: false };
    const result = await dispatchOpen(ctx, file);
    expect(open).toHaveBeenCalledWith(file);
    expect(result).toEqual({ status: 'opened', handlerLabel: 'A' });
  });

  it('invokes launchApp for type:app handlers', async () => {
    const ctx = ctxWith([
      { label: 'A', match: { extensions: ['.proj'] }, open: { type: 'app', appId: 'proj-app' } },
    ]);
    const file: FileRef = { path: 'a/x.proj', tenantId: 't', binary: false };
    const result = await dispatchOpen(ctx, file);
    expect(launchApp).toHaveBeenCalledWith('proj-app', { args: { file } });
    expect(result).toEqual({ status: 'opened', handlerLabel: 'A' });
  });

  it('returns failed when the handler throws', async () => {
    const ctx = ctxWith([
      { label: 'A', match: { extensions: ['.md'] }, open: { type: 'view', open: async () => { throw new Error('boom'); } } },
    ]);
    const file: FileRef = { path: 'a/b.md', tenantId: 't', binary: false };
    const result = await dispatchOpen(ctx, file);
    expect(result.status).toBe('failed');
    expect((result as { status: 'failed'; error: Error }).error.message).toBe('boom');
  });

  it('opts.handlerLabel picks a specific candidate', async () => {
    const opens = [vi.fn(), vi.fn()];
    const ctx = ctxWith([
      { label: 'First', match: { extensions: ['.md'] }, open: { type: 'view', open: opens[0] } },
      { label: 'Second', match: { extensions: ['.md'] }, open: { type: 'view', open: opens[1] } },
    ]);
    const file: FileRef = { path: 'a/b.md', tenantId: 't', binary: false };
    const result = await dispatchOpen(ctx, file, { handlerLabel: 'Second' });
    expect(opens[0]).not.toHaveBeenCalled();
    expect(opens[1]).toHaveBeenCalledWith(file);
    expect(result).toEqual({ status: 'opened', handlerLabel: 'Second' });
  });
});
