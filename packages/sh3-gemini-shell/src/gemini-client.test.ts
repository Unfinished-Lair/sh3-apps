import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { askGemini, listModels, GeminiError } from './gemini-client';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('askGemini', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the text from a single-part response', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({
        candidates: [{ content: { parts: [{ text: 'hello world' }] } }],
      }),
    );
    const out = await askGemini('test-key', 'hi', 'gemini-2.5-flash');
    expect(out).toBe('hello world');
  });

  it('concatenates multiple text parts in candidates[0]', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({
        candidates: [{ content: { parts: [{ text: 'one ' }, { text: 'two' }] } }],
      }),
    );
    const out = await askGemini('test-key', 'hi', 'gemini-2.5-flash');
    expect(out).toBe('one two');
  });

  it('POSTs to the gemini-2.5-flash generateContent endpoint with the key in the query string and JSON body', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    );
    await askGemini('my-secret-key', 'ping', 'gemini-2.5-flash');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=my-secret-key',
    );
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body as string)).toEqual({
      contents: [{ parts: [{ text: 'ping' }] }],
    });
  });

  it('throws the Gemini error.message when the response includes the standard error envelope', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        { error: { code: 400, message: 'API key not valid', status: 'INVALID_ARGUMENT' } },
        400,
      ),
    );
    await expect(askGemini('bad-key', 'hi', 'gemini-2.5-flash')).rejects.toThrow('API key not valid');
  });

  it('throws "HTTP <status>" when the error response has no parseable envelope', async () => {
    mockFetch.mockResolvedValue(
      new Response('Internal Server Error', { status: 500 }),
    );
    await expect(askGemini('test-key', 'hi', 'gemini-2.5-flash')).rejects.toThrow('HTTP 500');
  });

  it('throws "unexpected response shape" when a 2xx body is missing candidates', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ promptFeedback: {} }));
    await expect(askGemini('test-key', 'hi', 'gemini-2.5-flash')).rejects.toThrow('unexpected response shape');
  });

  it('passes an AbortSignal in fetch options (timeout wiring)', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    );
    await askGemini('test-key', 'hi', 'gemini-2.5-flash');
    const init = mockFetch.mock.calls[0][1];
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('redacts the API key from error messages', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        { error: { code: 400, message: 'bad request for key=AIza-XYZ-LITERAL' } },
        400,
      ),
    );
    const err = await askGemini('AIza-XYZ-LITERAL', 'hi', 'gemini-2.5-flash').catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).not.toContain('AIza-XYZ-LITERAL');
    expect(err.message).toContain('***');
  });

  it('uses the supplied modelId in the URL', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    );
    await askGemini('test-key', 'hi', 'gemini-2.5-pro');
    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=test-key',
    );
  });

  it('throws a GeminiError on HTTP failures', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        { error: { code: 400, message: 'API key not valid' } },
        400,
      ),
    );
    const err = await askGemini('bad-key', 'hi', 'gemini-2.5-flash').catch((e) => e);
    expect(err).toBeInstanceOf(GeminiError);
  });

  it('wraps network failures in GeminiError with no status', async () => {
    mockFetch.mockRejectedValue(new TypeError('fetch failed'));
    const err = await askGemini('test-key', 'hi', 'gemini-2.5-flash').catch((e) => e);
    expect(err).toBeInstanceOf(GeminiError);
    expect(err.status).toBeUndefined();
    expect(err.message).toBe('fetch failed');
  });

  it('exposes HTTP 429 on GeminiError.status (rate-limit classification)', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        { error: { code: 429, message: 'Quota exceeded' } },
        429,
      ),
    );
    const err = await askGemini('test-key', 'hi', 'gemini-2.5-flash').catch((e) => e);
    expect(err).toBeInstanceOf(GeminiError);
    expect(err.status).toBe(429);
  });

  it('exposes HTTP 400 on GeminiError.status (auth-shaped failure)', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        { error: { code: 400, message: 'API key not valid' } },
        400,
      ),
    );
    const err = await askGemini('bad-key', 'hi', 'gemini-2.5-flash').catch((e) => e);
    expect(err.status).toBe(400);
  });
});

describe('listModels', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('GETs the v1beta/models endpoint with the key in the query string', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ models: [] }));
    await listModels('my-key');

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models?key=my-key',
    );
    expect(init?.method ?? 'GET').toBe('GET');
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it('filters to models that support generateContent, strips the models/ prefix, and sorts by id', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({
        models: [
          {
            name: 'models/gemini-2.5-pro',
            displayName: 'Gemini 2.5 Pro',
            supportedGenerationMethods: ['generateContent'],
          },
          {
            name: 'models/embedding-001',
            displayName: 'Embedding 001',
            supportedGenerationMethods: ['embedContent'],
          },
          {
            name: 'models/gemini-2.5-flash',
            displayName: 'Gemini 2.5 Flash',
            supportedGenerationMethods: ['generateContent', 'countTokens'],
          },
        ],
      }),
    );
    const models = await listModels('test-key');
    expect(models).toEqual([
      { id: 'gemini-2.5-flash', displayName: 'Gemini 2.5 Flash' },
      { id: 'gemini-2.5-pro', displayName: 'Gemini 2.5 Pro' },
    ]);
  });

  it('returns [] when no models support generateContent', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({
        models: [
          {
            name: 'models/embedding-001',
            displayName: 'Embedding 001',
            supportedGenerationMethods: ['embedContent'],
          },
        ],
      }),
    );
    const models = await listModels('test-key');
    expect(models).toEqual([]);
  });

  it('throws GeminiError with envelope message and status on HTTP failure', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        { error: { code: 403, message: 'API key not authorized' } },
        403,
      ),
    );
    const err = await listModels('bad-key').catch((e) => e);
    expect(err).toBeInstanceOf(GeminiError);
    expect(err.status).toBe(403);
    expect(err.message).toBe('API key not authorized');
  });

  it('redacts the API key from listModels errors', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        { error: { code: 400, message: 'invalid key=AIza-LITERAL' } },
        400,
      ),
    );
    const err = await listModels('AIza-LITERAL').catch((e) => e);
    expect(err.message).not.toContain('AIza-LITERAL');
    expect(err.message).toContain('***');
  });
});
