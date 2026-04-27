import { describe, it, expect, vi } from 'vitest';
import { readPreview } from './readPreview';

describe('readPreview', () => {
  it('returns "error" when readFrom is undefined (e.g. documents:read missing)', async () => {
    const result = await readPreview({}, 'shard', 'a.md');
    expect(result).toEqual({ state: 'error', text: null });
  });

  it('returns "missing" when readFrom resolves null', async () => {
    const browse = { readFrom: vi.fn().mockResolvedValue(null) };
    expect(await readPreview(browse, 'shard', 'a.md')).toEqual({ state: 'missing', text: null });
  });

  it('returns "empty" when readFrom resolves an empty string', async () => {
    const browse = { readFrom: vi.fn().mockResolvedValue('') };
    expect(await readPreview(browse, 'shard', 'a.md')).toEqual({ state: 'empty', text: null });
  });

  it('returns "text" with the full content when shorter than the limit', async () => {
    const browse = { readFrom: vi.fn().mockResolvedValue('hello world') };
    expect(await readPreview(browse, 'shard', 'a.md')).toEqual({
      state: 'text',
      text: 'hello world',
    });
  });

  it('returns "text" truncated when content exceeds 4096 chars', async () => {
    const big = 'x'.repeat(5000);
    const browse = { readFrom: vi.fn().mockResolvedValue(big) };
    const result = await readPreview(browse, 'shard', 'a.md');
    expect(result.state).toBe('text');
    expect(result.text).toBe('x'.repeat(4096) + '\n… (truncated)');
  });

  it('returns "binary" with byte-count text when readFrom resolves an ArrayBuffer', async () => {
    const buf = new ArrayBuffer(42);
    const browse = { readFrom: vi.fn().mockResolvedValue(buf) };
    expect(await readPreview(browse, 'shard', 'a.bin')).toEqual({
      state: 'binary',
      text: '(binary content, 42 bytes)',
    });
  });

  it('returns "error" when readFrom throws', async () => {
    const browse = { readFrom: vi.fn().mockRejectedValue(new Error('disk on fire')) };
    expect(await readPreview(browse, 'shard', 'a.md')).toEqual({ state: 'error', text: null });
  });
});
