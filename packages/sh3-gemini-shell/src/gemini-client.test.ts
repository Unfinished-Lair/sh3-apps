import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { askOnce, listModels, GeminiError } from './gemini-client';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function sseResponse(chunks: string[]): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder();
      for (const c of chunks) {
        controller.enqueue(enc.encode(`data: ${c}\n\n`));
      }
      controller.close();
    },
  });
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

async function collect<T>(it: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const item of it) out.push(item);
  return out;
}

describe('askOnce', () => {
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
    const out = await askOnce('test-key', 'hi', 'gemini-2.5-flash');
    expect(out).toBe('hello world');
  });

  it('concatenates multiple text parts in candidates[0]', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({
        candidates: [{ content: { parts: [{ text: 'one ' }, { text: 'two' }] } }],
      }),
    );
    const out = await askOnce('test-key', 'hi', 'gemini-2.5-flash');
    expect(out).toBe('one two');
  });

  it('POSTs to the gemini-2.5-flash generateContent endpoint with the key in the query string and JSON body', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    );
    await askOnce('my-secret-key', 'ping', 'gemini-2.5-flash');

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
    await expect(askOnce('bad-key', 'hi', 'gemini-2.5-flash')).rejects.toThrow('API key not valid');
  });

  it('throws "HTTP <status>" when the error response has no parseable envelope', async () => {
    mockFetch.mockResolvedValue(
      new Response('Internal Server Error', { status: 500 }),
    );
    await expect(askOnce('test-key', 'hi', 'gemini-2.5-flash')).rejects.toThrow('HTTP 500');
  });

  it('throws "unexpected response shape" when a 2xx body is missing candidates', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ promptFeedback: {} }));
    await expect(askOnce('test-key', 'hi', 'gemini-2.5-flash')).rejects.toThrow('unexpected response shape');
  });

  it('passes an AbortSignal in fetch options (timeout wiring)', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    );
    await askOnce('test-key', 'hi', 'gemini-2.5-flash');
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
    const err = await askOnce('AIza-XYZ-LITERAL', 'hi', 'gemini-2.5-flash').catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).not.toContain('AIza-XYZ-LITERAL');
    expect(err.message).toContain('***');
  });

  it('uses the supplied modelId in the URL', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    );
    await askOnce('test-key', 'hi', 'gemini-2.5-pro');
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
    const err = await askOnce('bad-key', 'hi', 'gemini-2.5-flash').catch((e) => e);
    expect(err).toBeInstanceOf(GeminiError);
  });

  it('wraps network failures in GeminiError with no status', async () => {
    mockFetch.mockRejectedValue(new TypeError('fetch failed'));
    const err = await askOnce('test-key', 'hi', 'gemini-2.5-flash').catch((e) => e);
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
    const err = await askOnce('test-key', 'hi', 'gemini-2.5-flash').catch((e) => e);
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
    const err = await askOnce('bad-key', 'hi', 'gemini-2.5-flash').catch((e) => e);
    expect(err.status).toBe(400);
  });

  it('aborts when the external signal aborts before fetch resolves', async () => {
    const controller = new AbortController();
    mockFetch.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal!.addEventListener('abort', () => {
            const err = new DOMException('aborted', 'AbortError');
            reject(err);
          });
        }),
    );
    const p = askOnce('test-key', 'hi', 'gemini-2.5-flash', controller.signal);
    controller.abort();
    const err = await p.catch((e) => e);
    expect(err).toBeInstanceOf(GeminiError);
    expect(err.message).toBe('aborted');
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

import { iterateChain } from './gemini-client';

describe('iterateChain', () => {
  it('returns the first successful result without trying later models', async () => {
    const calls: string[] = [];
    const result = await iterateChain(
      ['a', 'b', 'c'],
      () => false,
      async (m) => {
        calls.push(m);
        return `ok:${m}`;
      },
    );
    expect(result).toEqual({ model: 'a', value: 'ok:a' });
    expect(calls).toEqual(['a']);
  });

  it('falls through to the next model on a transient error', async () => {
    const calls: string[] = [];
    const result = await iterateChain(
      ['a', 'b'],
      () => false,
      async (m) => {
        calls.push(m);
        if (m === 'a') throw new Error('transient');
        return `ok:${m}`;
      },
    );
    expect(result).toEqual({ model: 'b', value: 'ok:b' });
    expect(calls).toEqual(['a', 'b']);
  });

  it('breaks the chain on auth failure', async () => {
    const calls: string[] = [];
    const err = await iterateChain(
      ['a', 'b'],
      (e) => (e as Error).message === 'auth',
      async (m) => {
        calls.push(m);
        throw new Error('auth');
      },
    ).catch((e) => e);
    expect(calls).toEqual(['a']);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toContain('all models failed');
    expect(err.message).toContain('a');
  });

  it('summarizes attempts when chain is fully exhausted', async () => {
    const err = await iterateChain(
      ['a', 'b'],
      () => false,
      async (m) => {
        throw new Error(`fail-${m}`);
      },
    ).catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toContain('tried a, b');
    expect(err.message).toContain('fail-b');
  });

  it('throws synchronously when chain is empty', async () => {
    const err = await iterateChain([], () => false, async () => 'x').catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toContain('empty');
  });
});

import { chatStream } from './gemini-client';
import type { ChatChunk } from './ai/provider';

describe('chatStream', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POSTs to streamGenerateContent?alt=sse with the conversation messages', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'hi' }] } }] }),
    ]));
    const messages = [
      { role: 'user' as const, content: 'hello' },
      { role: 'assistant' as const, content: 'hi back' },
      { role: 'user' as const, content: 'again' },
    ];
    await collect(chatStream('test-key', messages, 'gemini-2.5-flash', new AbortController().signal));

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=test-key',
    );
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string);
    expect(body.contents).toEqual([
      { role: 'user', parts: [{ text: 'hello' }] },
      { role: 'model', parts: [{ text: 'hi back' }] },
      { role: 'user', parts: [{ text: 'again' }] },
    ]);
  });

  it('yields token chunks then a done chunk', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'hel' }] } }] }),
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'lo' }] } }] }),
    ]));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'hel' },
      { type: 'token', text: 'lo' },
      { type: 'done' },
    ]);
  });

  it('skips malformed SSE chunks without aborting the stream', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      'not json',
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'ok' },
      { type: 'done' },
    ]);
  });

  it('throws GeminiError on HTTP failure with envelope message and status', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ error: { code: 400, message: 'API key not valid' } }, 400),
    );
    const err = await collect(
      chatStream('bad-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    ).catch((e) => e);
    expect(err).toBeInstanceOf(GeminiError);
    expect(err.status).toBe(400);
    expect(err.message).toBe('API key not valid');
  });

  it('redacts the API key from chatStream errors', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ error: { code: 400, message: 'invalid key=AIza-XYZ' } }, 400),
    );
    const err = await collect(
      chatStream('AIza-XYZ', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    ).catch((e) => e);
    expect(err.message).not.toContain('AIza-XYZ');
    expect(err.message).toContain('***');
  });

  it('aborts when the external signal aborts mid-stream', async () => {
    const controller = new AbortController();
    mockFetch.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal!.addEventListener('abort', () => {
            reject(new DOMException('aborted', 'AbortError'));
          });
        }),
    );
    const it = chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', controller.signal);
    const p = collect(it);
    controller.abort();
    const err = await p.catch((e) => e);
    expect(err).toBeInstanceOf(GeminiError);
    expect(err.message).toBe('aborted');
  });

  it('wraps a successful 2xx with no chunks as an error', async () => {
    mockFetch.mockResolvedValue(sseResponse([])); // no chunks
    const err = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    ).catch((e) => e);
    expect(err).toBeInstanceOf(GeminiError);
    expect(err.message).toContain('empty stream');
  });

  it('parses CRLF-separated SSE events', async () => {
    const enc = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(enc.encode(
          `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'a' }] } }] })}\r\n\r\n` +
          `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'b' }] } }] })}\r\n\r\n`,
        ));
        controller.close();
      },
    });
    mockFetch.mockResolvedValue(new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    }));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'a' },
      { type: 'token', text: 'b' },
      { type: 'done' },
    ]);
  });

  it('accepts SSE data lines with no space after the colon', async () => {
    const enc = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(enc.encode(
          `data:${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] })}\n\n`,
        ));
        controller.close();
      },
    });
    mockFetch.mockResolvedValue(new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    }));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'ok' },
      { type: 'done' },
    ]);
  });

  it('drains a trailing SSE event that lacks a blank-line terminator', async () => {
    const enc = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(enc.encode(
          `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: 'tail' }] } }] })}`,
        ));
        controller.close();
      },
    });
    mockFetch.mockResolvedValue(new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    }));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'tail' },
      { type: 'done' },
    ]);
  });

  it('parses SSE even when Content-Type is not text/event-stream', async () => {
    // Some hosts/proxies report `text/plain` or `application/json` for SSE-shaped bodies.
    const enc = new TextEncoder();
    const payload = JSON.stringify({
      candidates: [{
        content: { parts: [{ text: 'real-shape ok' }], role: 'model' },
        finishReason: 'STOP',
        index: 0,
      }],
      modelVersion: 'gemini-2.5-flash',
    });
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(enc.encode(`data: ${payload}\n\n`));
        controller.close();
      },
    });
    mockFetch.mockResolvedValue(new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    }));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'real-shape ok' },
      { type: 'done' },
    ]);
  });

  it('falls back to JSON-array parsing when the response is application/json', async () => {
    // streamGenerateContent without alt=sse honored returns a JSON array
    // of GenerateContentResponse objects with Content-Type: application/json.
    mockFetch.mockResolvedValue(new Response(
      JSON.stringify([
        { candidates: [{ content: { parts: [{ text: 'foo' }] } }] },
        { candidates: [{ content: { parts: [{ text: 'bar' }] } }] },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'foo' },
      { type: 'token', text: 'bar' },
      { type: 'done' },
    ]);
  });
});

import { geminiProvider } from './gemini-client';

describe('geminiProvider', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('id and label are static', () => {
    const p = geminiProvider({ getApiKey: () => 'x', getChain: () => ['m'] });
    expect(p.id).toBe('gemini');
    expect(p.label).toBe('Gemini');
  });

  it('chain() reads getChain on every call (live read)', () => {
    let chain = ['a'];
    const p = geminiProvider({ getApiKey: () => 'x', getChain: () => chain });
    expect(p.chain()).toEqual(['a']);
    chain = ['b', 'c'];
    expect(p.chain()).toEqual(['b', 'c']);
  });

  it('chat() proxies to chatStream with the live API key', async () => {
    mockFetch.mockImplementation(async () => sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    let key = 'first-key';
    const p = geminiProvider({ getApiKey: () => key, getChain: () => ['m'] });
    await collect(p.chat([{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal));
    expect((mockFetch.mock.calls[0][0] as string)).toContain('key=first-key');

    key = 'second-key';
    await collect(p.chat([{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal));
    expect((mockFetch.mock.calls[1][0] as string)).toContain('key=second-key');
  });

  it('isAuthFailure returns true for GeminiError with status 400/401/403', () => {
    const p = geminiProvider({ getApiKey: () => 'x', getChain: () => ['m'] });
    expect(p.isAuthFailure(new GeminiError('x', 400))).toBe(true);
    expect(p.isAuthFailure(new GeminiError('x', 401))).toBe(true);
    expect(p.isAuthFailure(new GeminiError('x', 403))).toBe(true);
  });

  it('isAuthFailure returns false for other errors', () => {
    const p = geminiProvider({ getApiKey: () => 'x', getChain: () => ['m'] });
    expect(p.isAuthFailure(new GeminiError('x', 500))).toBe(false);
    expect(p.isAuthFailure(new GeminiError('x', 429))).toBe(false);
    expect(p.isAuthFailure(new Error('boom'))).toBe(false);
    expect(p.isAuthFailure(undefined)).toBe(false);
  });
});
