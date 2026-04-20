import { sha256Hex, hmacSha256 } from './hash';

export interface Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface SignInput {
  method: string;
  host: string;
  path: string;               // e.g. "/bucket/key" (URI-encoded except for "/")
  query?: string;             // canonical query string, already URI-encoded
  headers?: Record<string, string>;
  payload: string | ArrayBuffer | Uint8Array;
  service: string;            // 's3' for R2, else vector-specific
  region: string;             // 'auto' for R2
  credentials: Credentials;
  dateOverride?: string;      // YYYYMMDDTHHMMSSZ, for deterministic testing
}

export interface SignedRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: Uint8Array;
}

function amzDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function dateStamp(amz: string): string {
  return amz.slice(0, 8);
}

export async function signRequest(input: SignInput): Promise<SignedRequest> {
  const amz = input.dateOverride ?? amzDate();
  const date = dateStamp(amz);

  const payloadBytes =
    typeof input.payload === 'string'
      ? new TextEncoder().encode(input.payload)
      : input.payload instanceof Uint8Array
        ? input.payload
        : new Uint8Array(input.payload);
  const payloadHash = await sha256Hex(payloadBytes);

  // Headers: caller-provided + forced host, x-amz-date, and (for s3) x-amz-content-sha256.
  // Lowercase caller-supplied names first to avoid duplicated entries when
  // our canonicalization step lowercases (e.g. "X-Amz-Date" + "x-amz-date").
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(input.headers ?? {})) {
    headers[k.toLowerCase()] = v;
  }
  headers.host = input.host;
  headers['x-amz-date'] = amz;
  if (input.service === 's3') {
    headers['x-amz-content-sha256'] = payloadHash;
  }

  // Canonical headers: lowercase names, trimmed values, sorted.
  const lowerHeaders: Array<[string, string]> = Object.entries(headers)
    .map(([k, v]) => [k.toLowerCase(), String(v).trim().replace(/\s+/g, ' ')] as [string, string])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const signedHeaders = lowerHeaders.map(([k]) => k).join(';');
  const canonicalHeaders = lowerHeaders.map(([k, v]) => `${k}:${v}\n`).join('');

  const canonicalRequest = [
    input.method.toUpperCase(),
    input.path,
    input.query ?? '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${date}/${input.region}/${input.service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amz,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join('\n');

  const kDate = await hmacSha256(
    new TextEncoder().encode(`AWS4${input.credentials.secretAccessKey}`),
    date,
  );
  const kRegion = await hmacSha256(kDate, input.region);
  const kService = await hmacSha256(kRegion, input.service);
  const kSigning = await hmacSha256(kService, 'aws4_request');
  const sigBytes = await hmacSha256(kSigning, stringToSign);

  const signature = Array.from(sigBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const authHeader =
    `AWS4-HMAC-SHA256 Credential=${input.credentials.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, ` +
    `Signature=${signature}`;

  const outHeaders: Record<string, string> = { ...headers };
  outHeaders.Authorization = authHeader;

  const url = `https://${input.host}${input.path}${input.query ? `?${input.query}` : ''}`;
  return { url, method: input.method.toUpperCase(), headers: outHeaders, body: payloadBytes };
}
