import { describe, it, expect, vi } from 'vitest';
import { createR2Client, type R2TargetConfig } from './client';

const TARGET: R2TargetConfig = {
  accountId: 'acc',
  bucket: 'mybucket',
  region: 'auto',
  accessKeyId: 'AKID',
  secretAccessKey: 'secret',
};

function makeClient(fetchImpl: typeof fetch) {
  return createR2Client(TARGET, fetchImpl);
}

describe('R2Client', () => {
  it('headBucket calls HEAD on the bucket root', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('', { status: 200 }));
    const client = makeClient(fetchImpl as unknown as typeof fetch);
    await client.headBucket();
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://acc.r2.cloudflarestorage.com/mybucket/');
    expect(init.method).toBe('HEAD');
  });

  it('putObject uploads with the expected metadata headers', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response('', { status: 200, headers: { etag: '"e"' } }),
    );
    const client = makeClient(fetchImpl as unknown as typeof fetch);
    const res = await client.putObject({
      key: 'pfx/shard/a.md',
      body: 'hello',
      contentType: 'text/markdown',
      sha256: 'c0ffee',
      metadata: { 'sh3-shard': 'shard', 'sh3-path': 'a.md' },
    });
    expect(res.etag).toBe('"e"');
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://acc.r2.cloudflarestorage.com/mybucket/pfx/shard/a.md');
    expect(init.method).toBe('PUT');
    const headers = init.headers as Record<string, string>;
    expect(headers['content-type']).toBe('text/markdown');
    expect(headers['x-amz-meta-sh3-shard']).toBe('shard');
    expect(headers['x-amz-meta-sh3-path']).toBe('a.md');
  });

  it('headObject returns metadata or null on 404', async () => {
    const okFetch = vi.fn().mockResolvedValue(
      new Response('', {
        status: 200,
        headers: {
          'content-length': '5',
          'x-amz-meta-sh3-sha256': 'abc',
          etag: '"x"',
          'last-modified': 'Mon, 20 Apr 2026 00:00:00 GMT',
        },
      }),
    );
    const head = await makeClient(okFetch as unknown as typeof fetch).headObject('k');
    expect(head).toEqual({
      size: 5,
      sha256: 'abc',
      etag: '"x"',
      lastModified: 'Mon, 20 Apr 2026 00:00:00 GMT',
    });

    const missFetch = vi.fn().mockResolvedValue(new Response('', { status: 404 }));
    const miss = await makeClient(missFetch as unknown as typeof fetch).headObject('k');
    expect(miss).toBeNull();
  });

  it('listObjectsV2 parses keys and paginates', async () => {
    const page1 = `<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
      <Contents><Key>a</Key><Size>1</Size><LastModified>2026-04-20T00:00:00Z</LastModified></Contents>
      <Contents><Key>b</Key><Size>2</Size><LastModified>2026-04-20T00:00:01Z</LastModified></Contents>
      <IsTruncated>true</IsTruncated>
      <NextContinuationToken>TOK</NextContinuationToken>
    </ListBucketResult>`;
    const page2 = `<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
      <Contents><Key>c</Key><Size>3</Size><LastModified>2026-04-20T00:00:02Z</LastModified></Contents>
      <IsTruncated>false</IsTruncated>
    </ListBucketResult>`;
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response(page1, { status: 200 }))
      .mockResolvedValueOnce(new Response(page2, { status: 200 }));
    const client = makeClient(fetchImpl as unknown as typeof fetch);
    const out: string[] = [];
    for await (const obj of client.listObjectsV2({ prefix: 'p/' })) {
      out.push(obj.key);
    }
    expect(out).toEqual(['a', 'b', 'c']);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('getObject returns text', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('contents', { status: 200 }));
    const client = makeClient(fetchImpl as unknown as typeof fetch);
    expect(await client.getObject('k')).toBe('contents');
  });
});
