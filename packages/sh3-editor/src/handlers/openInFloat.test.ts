import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FileRef, ShardContext } from 'sh3-core';
import { EDITOR_DOCUMENT_POINT } from '../contributions';

vi.mock('sh3-core', async () => {
  const actual = await vi.importActual<typeof import('sh3-core')>('sh3-core');
  return {
    ...actual,
    shell: {
      float: {
        open: vi.fn(() => 'float-42'),
        list: vi.fn(() => [
          { id: 'float-42', content: { tabs: [{ slotId: 'float:sh3-editor:editor:1' }] } },
        ]),
      },
      toast: { notify: vi.fn() },
    },
  };
});

import { shell } from 'sh3-core';
import { openInFloat } from './openInFloat';

function makeCtx(readResult: string | null = 'hello'): ShardContext {
  return {
    browse: {
      readFrom: vi.fn(async () => readResult),
    },
    contributions: {
      register: vi.fn(() => () => {}),
    },
  } as unknown as ShardContext;
}

beforeEach(() => vi.clearAllMocks());

describe('openInFloat', () => {
  it('reads via ctx.browse.readFrom(shardId, relPath) using the <shardId>/<rest> path convention', async () => {
    const ctx = makeCtx('# hi');
    const file: FileRef = { path: 'notes/sub/readme.md', tenantId: 't', binary: false };
    await openInFloat(ctx, file);
    expect(ctx.browse!.readFrom).toHaveBeenCalledWith('notes', 'sub/readme.md');
  });

  it('opens a float for the editor view and registers the seeded contribution with the minted slotId', async () => {
    const ctx = makeCtx('# hi');
    const file: FileRef = { path: 'notes/readme.md', tenantId: 't', binary: false };
    await openInFloat(ctx, file);
    expect(shell.float.open).toHaveBeenCalledWith(
      'sh3-editor:editor',
      expect.objectContaining({ title: 'readme.md' }),
    );
    expect(ctx.contributions.register).toHaveBeenCalledWith(
      EDITOR_DOCUMENT_POINT,
      expect.objectContaining({
        slotId: 'float:sh3-editor:editor:1',
        seed: expect.objectContaining({ kind: 'content', content: '# hi', language: 'markdown' }),
      }),
    );
  });

  it('toasts and bails when readFrom returns null', async () => {
    const ctx = makeCtx(null);
    const file: FileRef = { path: 'notes/missing.md', tenantId: 't', binary: false };
    await openInFloat(ctx, file);
    expect(shell.toast.notify).toHaveBeenCalledWith(
      expect.stringContaining('missing.md'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(shell.float.open).not.toHaveBeenCalled();
  });

  it('toasts when ctx.browse.readFrom is undefined (permission gate)', async () => {
    const ctx = { browse: {}, contributions: { register: vi.fn() } } as unknown as ShardContext;
    const file: FileRef = { path: 'notes/readme.md', tenantId: 't', binary: false };
    await openInFloat(ctx, file);
    expect(shell.toast.notify).toHaveBeenCalledWith(
      expect.stringContaining('cannot read'),
      expect.objectContaining({ level: 'warn' }),
    );
  });
});
