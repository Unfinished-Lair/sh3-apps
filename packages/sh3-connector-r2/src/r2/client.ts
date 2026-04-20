import { signedFetch } from './fetch';
import type { Credentials } from './sigv4';

export interface R2TargetConfig {
  accountId: string;
  bucket: string;
  region: 'auto';
  accessKeyId: string;
  secretAccessKey: string;
}

export interface PutObjectInput {
  key: string;
  body: string | ArrayBuffer | Uint8Array;
  contentType: string;
  sha256: string;
  metadata?: Record<string, string>;
}

export interface HeadObjectResult {
  size: number;
  sha256?: string;
  etag: string;
  lastModified?: string;
}

export interface ListObject {
  key: string;
  size: number;
  lastModified: string;
}

export interface R2Client {
  headBucket(): Promise<void>;
  putObject(input: PutObjectInput): Promise<{ etag: string }>;
  headObject(key: string): Promise<HeadObjectResult | null>;
  listObjectsV2(opts: { prefix: string }): AsyncIterable<ListObject>;
  getObject(key: string): Promise<string>;
}

export function createR2Client(target: R2TargetConfig, fetchImpl?: typeof fetch): R2Client {
  const host = `${target.accountId}.r2.cloudflarestorage.com`;
  const credentials: Credentials = {
    accessKeyId: target.accessKeyId,
    secretAccessKey: target.secretAccessKey,
  };
  const base = `/${target.bucket}`;

  async function request(
    method: string,
    path: string,
    opts: { query?: string; body?: string | ArrayBuffer | Uint8Array; headers?: Record<string, string> } = {},
  ): Promise<Response> {
    return signedFetch({
      fetchImpl,
      method,
      host,
      path: `${base}${path}`,
      query: opts.query,
      headers: opts.headers,
      body: opts.body,
      service: 's3',
      region: target.region,
      credentials,
    });
  }

  return {
    async headBucket() {
      await request('HEAD', '/');
    },

    async putObject(input) {
      const metaHeaders: Record<string, string> = {};
      for (const [k, v] of Object.entries(input.metadata ?? {})) {
        metaHeaders[`x-amz-meta-${k}`] = v;
      }
      const res = await request('PUT', `/${input.key}`, {
        body: input.body,
        headers: {
          'content-type': input.contentType,
          ...metaHeaders,
        },
      });
      return { etag: res.headers.get('etag') ?? '' };
    },

    async headObject(key) {
      try {
        const res = await request('HEAD', `/${key}`);
        return {
          size: Number(res.headers.get('content-length') ?? 0),
          sha256: res.headers.get('x-amz-meta-sh3-sha256') ?? undefined,
          etag: res.headers.get('etag') ?? '',
          lastModified: res.headers.get('last-modified') ?? undefined,
        };
      } catch (err) {
        if (err instanceof Error && 'status' in err && (err as { status: number }).status === 404) {
          return null;
        }
        throw err;
      }
    },

    listObjectsV2({ prefix }) {
      return {
        async *[Symbol.asyncIterator]() {
          let continuation: string | null = null;
          while (true) {
            const params = new URLSearchParams({ 'list-type': '2', prefix });
            if (continuation) params.set('continuation-token', continuation);
            const res = await request('GET', '/', { query: params.toString() });
            const text = await res.text();
            for (const m of text.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
              const inner = m[1];
              const key = /<Key>([^<]*)<\/Key>/.exec(inner)?.[1] ?? '';
              const size = Number(/<Size>([^<]*)<\/Size>/.exec(inner)?.[1] ?? '0');
              const lastModified = /<LastModified>([^<]*)<\/LastModified>/.exec(inner)?.[1] ?? '';
              yield { key, size, lastModified };
            }
            const truncated = /<IsTruncated>([^<]*)<\/IsTruncated>/.exec(text)?.[1] === 'true';
            continuation = truncated
              ? /<NextContinuationToken>([^<]*)<\/NextContinuationToken>/.exec(text)?.[1] ?? null
              : null;
            if (!continuation) break;
          }
        },
      };
    },

    async getObject(key) {
      const res = await request('GET', `/${key}`);
      return res.text();
    },
  };
}
