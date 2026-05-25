import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PermissionError, type FileRef, type ShardContext } from 'sh3-core';
import { EDITOR_DOCUMENT_POINT } from '../contributions';

vi.mock('sh3-core', async () => {
  const actual = await vi.importActual<typeof import('sh3-core')>('sh3-core');
  return {
    ...actual,
    sh3: {
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

import { sh3 } from 'sh3-core';
import { openInFloat } from './openInFloat';

function makeCtx(readResult: string | null | Error = 'hello'): ShardContext {
  const readText = vi.fn(async (_path: string) => {
    if (readResult instanceof Error) throw readResult;
    return readResult;
  });
  return {
    documents: {
      boundId: 'sh3-editor',
      grants: { browse: true, write: false },
      readText,
    },
    contributions: {
      register: vi.fn(() => () => {}),
    },
  } as unknown as ShardContext;
}

beforeEach(() => vi.clearAllMocks());

describe('openInFloat', () => {
  it('reads via ctx.documents.readText(scope-rooted path)', async () => {
    const ctx = makeCtx('# hi');
    const file: FileRef = { path: 'notes/sub/readme.md', tenantId: 't', binary: false };
    await openInFloat(ctx, file);
    expect(ctx.documents.readText).toHaveBeenCalledWith('notes/sub/readme.md');
  });

  it('opens a float for the editor view and registers the seeded contribution with the minted slotId', async () => {
    const ctx = makeCtx('# hi');
    const file: FileRef = { path: 'notes/readme.md', tenantId: 't', binary: false };
    await openInFloat(ctx, file);
    expect(sh3.float.open).toHaveBeenCalledWith(
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

  it('toasts and bails when readText returns null', async () => {
    const ctx = makeCtx(null);
    const file: FileRef = { path: 'notes/missing.md', tenantId: 't', binary: false };
    await openInFloat(ctx, file);
    expect(sh3.toast.notify).toHaveBeenCalledWith(
      expect.stringContaining('missing.md'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(sh3.float.open).not.toHaveBeenCalled();
  });

  it('toasts when readText throws PermissionError (missing documents:browse)', async () => {
    const ctx = makeCtx(new PermissionError('boundary', 'notes/readme.md'));
    const file: FileRef = { path: 'notes/readme.md', tenantId: 't', binary: false };
    await openInFloat(ctx, file);
    expect(sh3.toast.notify).toHaveBeenCalledWith(
      expect.stringContaining('cannot read'),
      expect.objectContaining({ level: 'warn' }),
    );
    expect(sh3.float.open).not.toHaveBeenCalled();
  });
});
