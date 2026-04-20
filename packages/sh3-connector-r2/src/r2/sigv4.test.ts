import { describe, it, expect } from 'vitest';
import { signRequest } from './sigv4';

// Canonical AWS test vector: "get-vanilla"
// Source: https://docs.aws.amazon.com/general/latest/gr/signature-v4-test-suite.html
const CREDS = {
  accessKeyId: 'AKIDEXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
};

describe('SigV4 signer — get-vanilla', () => {
  it('produces the expected Authorization header', async () => {
    const signed = await signRequest({
      method: 'GET',
      host: 'example.amazonaws.com',
      path: '/',
      query: '',
      headers: { 'X-Amz-Date': '20150830T123600Z' },
      payload: '',
      service: 'service',
      region: 'us-east-1',
      credentials: CREDS,
      dateOverride: '20150830T123600Z',
    });

    expect(signed.headers.Authorization).toBe(
      'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, ' +
        'SignedHeaders=host;x-amz-date, ' +
        'Signature=5fa00fa31553b73ebf1942676e86291e8372ff2a2260956d9b8aae1d763fbf31',
    );
  });

  it('adds x-amz-content-sha256 for R2 (s3 service)', async () => {
    const signed = await signRequest({
      method: 'PUT',
      host: 'acc.r2.cloudflarestorage.com',
      path: '/bucket/key',
      query: '',
      headers: { 'X-Amz-Date': '20260420T000000Z' },
      payload: 'hello',
      service: 's3',
      region: 'auto',
      credentials: CREDS,
      dateOverride: '20260420T000000Z',
    });
    expect(signed.headers['x-amz-content-sha256']).toBe(
      // sha256('hello')
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
    expect(signed.headers.Authorization).toMatch(/^AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE\/20260420\/auto\/s3\/aws4_request/);
    expect(signed.headers.Authorization).toMatch(/SignedHeaders=host;x-amz-content-sha256;x-amz-date/);
  });
});
