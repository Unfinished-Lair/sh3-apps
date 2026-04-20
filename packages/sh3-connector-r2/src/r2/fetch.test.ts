import { describe, it, expect, vi } from 'vitest';
import { signedFetch } from './fetch';

const CREDS = { accessKeyId: 'AKID', secretAccessKey: 'secret' };

describe('signedFetch', () => {
  it('signs and issues a fetch, returns parsed response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('body', { status: 200, headers: { etag: '"abc"' } }),
    );
    const res = await signedFetch({
      fetchImpl: fetchMock as unknown as typeof fetch,
      method: 'GET',
      host: 'acc.r2.cloudflarestorage.com',
      path: '/bucket/key',
      service: 's3',
      region: 'auto',
      credentials: CREDS,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/^https:\/\/acc\.r2\.cloudflarestorage\.com\/bucket\/key/);
    expect((init.headers as Record<string, string>).Authorization).toMatch(/^AWS4-HMAC-SHA256/);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('body');
  });

  it('throws R2Error on non-2xx', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('<Error><Code>NoSuchBucket</Code></Error>', { status: 404 }),
    );
    await expect(
      signedFetch({
        fetchImpl: fetchMock as unknown as typeof fetch,
        method: 'GET',
        host: 'acc.r2.cloudflarestorage.com',
        path: '/nope/',
        service: 's3',
        region: 'auto',
        credentials: CREDS,
      }),
    ).rejects.toMatchObject({ name: 'R2Error', status: 404, code: 'NoSuchBucket' });
  });
});
