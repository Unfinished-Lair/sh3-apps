const HEX = '0123456789abcdef';

export async function sha256Hex(input: string | ArrayBuffer | Uint8Array): Promise<string> {
  const data =
    typeof input === 'string'
      ? new TextEncoder().encode(input)
      : input instanceof Uint8Array
        ? input
        : new Uint8Array(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += HEX[bytes[i] >>> 4];
    out += HEX[bytes[i] & 0xf];
  }
  return out;
}

export async function hmacSha256(
  key: ArrayBuffer | Uint8Array,
  msg: string,
): Promise<Uint8Array> {
  const keyBuf = key instanceof Uint8Array ? key : new Uint8Array(key);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuf,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(msg));
  return new Uint8Array(mac);
}
