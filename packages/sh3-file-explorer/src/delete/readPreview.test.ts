import { describe, it, expect, vi } from 'vitest';

const { PermissionError } = vi.hoisted(() => ({
  PermissionError: class PermissionError extends Error {
    constructor(public kind: string, public path: string) {
      super(`PermissionError(${kind}): ${path}`);
    }
  },
}));

vi.mock('sh3-core', () => ({ PermissionError }));

import { readPreview } from './readPreview';

function toBuffer(s: string): ArrayBuffer {
  return new TextEncoder().encode(s).buffer as ArrayBuffer;
}

function ctxWith(readBinary: (path: string) => Promise<ArrayBuffer | null>) {
  return { documents: { readBinary } };
}

describe('readPreview', () => {
  it('returns "error" when readBinary throws PermissionError (e.g. browse grant missing)', async () => {
    const ctx = ctxWith(async () => { throw new PermissionError('boundary', 'shard/a.md'); });
    const result = await readPreview(ctx, 'shard', 'a.md');
    expect(result).toEqual({ state: 'error', text: null });
  });

  it('passes the scope-rooted path to readBinary', async () => {
    const readBinary = vi.fn(async () => toBuffer('hi'));
    await readPreview(ctxWith(readBinary), 'shard', 'a.md');
    expect(readBinary).toHaveBeenCalledWith('shard/a.md');
  });

  it('returns "missing" when readBinary resolves null', async () => {
    const ctx = ctxWith(vi.fn(async () => null));
    expect(await readPreview(ctx, 'shard', 'a.md')).toEqual({ state: 'missing', text: null });
  });

  it('returns "empty" when readBinary resolves a zero-length buffer', async () => {
    const ctx = ctxWith(vi.fn(async () => new ArrayBuffer(0)));
    expect(await readPreview(ctx, 'shard', 'a.md')).toEqual({ state: 'empty', text: null });
  });

  it('returns "text" with the full content when shorter than the limit', async () => {
    const ctx = ctxWith(vi.fn(async () => toBuffer('hello world')));
    expect(await readPreview(ctx, 'shard', 'a.md')).toEqual({
      state: 'text',
      text: 'hello world',
    });
  });

  it('returns "text" truncated when content exceeds 4096 chars', async () => {
    const big = 'x'.repeat(5000);
    const ctx = ctxWith(vi.fn(async () => toBuffer(big)));
    const result = await readPreview(ctx, 'shard', 'a.md');
    expect(result.state).toBe('text');
    expect(result.text).toBe('x'.repeat(4096) + '\n… (truncated)');
  });

  it('returns "binary" with byte-count text when the bytes contain a NUL (binary heuristic)', async () => {
    const buf = new ArrayBuffer(42);
    new Uint8Array(buf)[10] = 0; // ensure at least one NUL
    const ctx = ctxWith(vi.fn(async () => buf));
    expect(await readPreview(ctx, 'shard', 'a.bin')).toEqual({
      state: 'binary',
      text: '(binary content, 42 bytes)',
    });
  });

  it('returns "error" when readBinary throws a generic error', async () => {
    const ctx = ctxWith(vi.fn(async () => { throw new Error('disk on fire'); }));
    expect(await readPreview(ctx, 'shard', 'a.md')).toEqual({ state: 'error', text: null });
  });
});
