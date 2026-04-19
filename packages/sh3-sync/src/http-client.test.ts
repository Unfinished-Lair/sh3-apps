import { describe, it, expect, vi } from 'vitest';
import { pushBatch, pullSinceTick } from './http-client.js';

describe('http-client.pushBatch', () => {
  it('POSTs with Bearer auth and returns results', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ results: [{ applied: true, version: 3 }] }), { status: 200 }),
    );
    (globalThis as any).fetch = fetchMock;
    const res = await pushBatch('https://p', 'sh3_k', 'alice', [
      { shardId: 'notes', path: 'a', content: 'x', expectedLocalVersion: 0, origin: 'vps' },
    ]);
    expect(res).toEqual([{ applied: true, version: 3 }]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://p/api/sh3-sync/push/alice',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer sh3_k' }),
      }),
    );
  });

  it('throws on non-2xx response', async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValue(
      new Response('forbidden', { status: 403 }),
    );
    await expect(pushBatch('https://p', 'sh3_k', 'alice', [])).rejects.toThrow(/403/);
  });
});

describe('http-client.pullSinceTick', () => {
  it('GETs with Bearer auth and returns PullResponse', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ tick: 42, changes: [] }), { status: 200 }),
    );
    (globalThis as any).fetch = fetchMock;
    const res = await pullSinceTick('https://p', 'sh3_k', 'alice', 7);
    expect(res).toEqual({ tick: 42, changes: [] });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://p/api/sh3-sync/pull/alice?sinceTick=7');
    expect(opts.headers.Authorization).toBe('Bearer sh3_k');
  });

  it('throws on non-2xx response', async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValue(
      new Response('err', { status: 500 }),
    );
    await expect(pullSinceTick('https://p', 'sh3_k', 'alice', 0)).rejects.toThrow(/500/);
  });
});
