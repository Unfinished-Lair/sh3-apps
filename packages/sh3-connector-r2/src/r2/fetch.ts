import { signRequest, type Credentials } from './sigv4';

export interface SignedFetchInput {
  fetchImpl?: typeof fetch;
  method: string;
  host: string;
  path: string;
  query?: string;
  headers?: Record<string, string>;
  body?: string | ArrayBuffer | Uint8Array;
  service: string;
  region: string;
  credentials: Credentials;
}

export class R2Error extends Error {
  override name = 'R2Error';
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly responseText?: string,
  ) {
    super(message);
  }
}

export async function signedFetch(input: SignedFetchInput): Promise<Response> {
  const fetchImpl = input.fetchImpl ?? fetch;
  const payload = input.body ?? '';
  const signed = await signRequest({
    method: input.method,
    host: input.host,
    path: input.path,
    query: input.query ?? '',
    headers: input.headers,
    payload,
    service: input.service,
    region: input.region,
    credentials: input.credentials,
  });
  const res = await fetchImpl(signed.url, {
    method: signed.method,
    headers: signed.headers,
    body: input.method === 'GET' || input.method === 'HEAD' ? undefined : signed.body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const codeMatch = text.match(/<Code>([^<]+)<\/Code>/);
    throw new R2Error(
      `R2 ${input.method} ${input.path} failed (${res.status})`,
      res.status,
      codeMatch?.[1],
      text,
    );
  }
  return res;
}
