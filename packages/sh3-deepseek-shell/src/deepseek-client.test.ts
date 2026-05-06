import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  chatStream,
  listModels,
  deepseekProvider,
  DeepseekError,
} from './deepseek-client';
import type { ChatChunk } from 'sh3-ai';

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

describe('listModels', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('GETs /models with the bearer key in the Authorization header', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ data: [] }));
    await listModels('my-key');

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.deepseek.com/models');
    expect(init?.method ?? 'GET').toBe('GET');
    expect(init.headers.Authorization).toBe('Bearer my-key');
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('maps `data` entries to ModelInfo and sorts by id', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({
        data: [
          { id: 'deepseek-reasoner', object: 'model', owned_by: 'deepseek' },
          { id: 'deepseek-chat', object: 'model', owned_by: 'deepseek' },
        ],
      }),
    );
    const models = await listModels('test-key');
    expect(models).toEqual([
      { id: 'deepseek-chat', displayName: 'deepseek-chat' },
      { id: 'deepseek-reasoner', displayName: 'deepseek-reasoner' },
    ]);
  });

  it('throws DeepseekError with envelope message and status on HTTP failure', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ error: { message: 'Authentication Fails' } }, 401),
    );
    const err = await listModels('bad-key').catch((e) => e);
    expect(err).toBeInstanceOf(DeepseekError);
    expect(err.status).toBe(401);
    expect(err.message).toBe('Authentication Fails');
  });

  it('redacts the API key from listModels errors', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ error: { message: 'invalid key=sk-LITERAL' } }, 401),
    );
    const err = await listModels('sk-LITERAL').catch((e) => e);
    expect(err.message).not.toContain('sk-LITERAL');
    expect(err.message).toContain('***');
  });
});

describe('chatStream', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POSTs to /chat/completions with the bearer header and stream:true', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ choices: [{ delta: { content: 'hi' }, index: 0 }] }),
    ]));
    const messages = [
      { role: 'user' as const, content: 'hello' },
      { role: 'assistant' as const, content: 'hi back' },
      { role: 'user' as const, content: 'again' },
    ];
    await collect(chatStream('test-key', messages, 'deepseek-chat', new AbortController().signal));

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.deepseek.com/chat/completions');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-key',
    });
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe('deepseek-chat');
    expect(body.stream).toBe(true);
    expect(body.messages).toEqual([
      { role: 'user', content: 'hello' },
      { role: 'assistant', content: 'hi back' },
      { role: 'user', content: 'again' },
    ]);
  });

  it('yields token chunks then a done chunk', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ choices: [{ delta: { role: 'assistant' } }] }),
      JSON.stringify({ choices: [{ delta: { content: 'hel' } }] }),
      JSON.stringify({ choices: [{ delta: { content: 'lo' } }] }),
      '[DONE]',
    ]));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal),
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
      JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }),
    ]));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'ok' },
      { type: 'done' },
    ]);
  });

  it('throws DeepseekError on HTTP failure with envelope message and status', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ error: { message: 'Insufficient Balance' } }, 402),
    );
    const err = await collect(
      chatStream('bad-key', [{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal),
    ).catch((e) => e);
    expect(err).toBeInstanceOf(DeepseekError);
    expect(err.status).toBe(402);
    expect(err.message).toBe('Insufficient Balance');
  });

  it('redacts the API key from chatStream errors', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ error: { message: 'invalid key=sk-XYZ' } }, 401),
    );
    const err = await collect(
      chatStream('sk-XYZ', [{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal),
    ).catch((e) => e);
    expect(err.message).not.toContain('sk-XYZ');
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
    const it = chatStream('test-key', [{ role: 'user', content: 'hi' }], 'deepseek-chat', controller.signal);
    const p = collect(it);
    controller.abort();
    const err = await p.catch((e) => e);
    expect(err).toBeInstanceOf(DeepseekError);
    expect(err.message).toBe('aborted');
  });

  it('wraps a successful 2xx with no chunks as an error', async () => {
    mockFetch.mockResolvedValue(sseResponse([])); // no chunks
    const err = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal),
    ).catch((e) => e);
    expect(err).toBeInstanceOf(DeepseekError);
    expect(err.message).toContain('empty stream');
  });

  it('parses CRLF-separated SSE events', async () => {
    const enc = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(enc.encode(
          `data: ${JSON.stringify({ choices: [{ delta: { content: 'a' } }] })}\r\n\r\n` +
          `data: ${JSON.stringify({ choices: [{ delta: { content: 'b' } }] })}\r\n\r\n`,
        ));
        controller.close();
      },
    });
    mockFetch.mockResolvedValue(new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    }));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'a' },
      { type: 'token', text: 'b' },
      { type: 'done' },
    ]);
  });

  it('drains a trailing SSE event that lacks a blank-line terminator', async () => {
    const enc = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(enc.encode(
          `data: ${JSON.stringify({ choices: [{ delta: { content: 'tail' } }] })}`,
        ));
        controller.close();
      },
    });
    mockFetch.mockResolvedValue(new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    }));
    const chunks = await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal),
    );
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'tail' },
      { type: 'done' },
    ]);
  });
});

describe('chatStream generation config', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('omits system message, temperature, max_tokens when no config provided', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }),
    ]));
    await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.messages).toEqual([{ role: 'user', content: 'hi' }]);
    expect(body).not.toHaveProperty('temperature');
    expect(body).not.toHaveProperty('max_tokens');
  });

  it('prepends a system message when systemInstruction is non-empty', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'deepseek-chat',
        new AbortController().signal,
        { systemInstruction: 'be brief' },
      ),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.messages).toEqual([
      { role: 'system', content: 'be brief' },
      { role: 'user', content: 'hi' },
    ]);
  });

  it('omits the system message when systemInstruction is empty', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'deepseek-chat',
        new AbortController().signal,
        { systemInstruction: '' },
      ),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.messages).toEqual([{ role: 'user', content: 'hi' }]);
  });

  it('includes temperature when number, omits when null', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'deepseek-chat',
        new AbortController().signal,
        { temperature: 0.2 },
      ),
    );
    let body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.temperature).toBe(0.2);

    mockFetch.mockClear();
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'deepseek-chat',
        new AbortController().signal,
        { temperature: null },
      ),
    );
    body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body).not.toHaveProperty('temperature');
  });

  it('maps maxOutputTokens to max_tokens (OpenAI-compatible naming)', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'deepseek-chat',
        new AbortController().signal,
        { maxOutputTokens: 256 },
      ),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.max_tokens).toBe(256);
    expect(body).not.toHaveProperty('maxOutputTokens');
  });
});

describe('deepseekProvider', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('id and label are static', () => {
    const p = deepseekProvider({
      getApiKey: () => 'x',
      getChain: () => ['m'],
      getSystemInstruction: () => '',
      getTemperature: () => null,
      getMaxOutputTokens: () => null,
    });
    expect(p.id).toBe('deepseek');
    expect(p.label).toBe('DeepSeek');
  });

  it('chain() reads getChain on every call (live read)', () => {
    let chain = ['a'];
    const p = deepseekProvider({
      getApiKey: () => 'x',
      getChain: () => chain,
      getSystemInstruction: () => '',
      getTemperature: () => null,
      getMaxOutputTokens: () => null,
    });
    expect(p.chain()).toEqual(['a']);
    chain = ['b', 'c'];
    expect(p.chain()).toEqual(['b', 'c']);
  });

  it('chat() proxies to chatStream with the live API key in Authorization header', async () => {
    mockFetch.mockImplementation(async () => sseResponse([
      JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }),
    ]));
    let key = 'first-key';
    const p = deepseekProvider({
      getApiKey: () => key,
      getChain: () => ['m'],
      getSystemInstruction: () => '',
      getTemperature: () => null,
      getMaxOutputTokens: () => null,
    });
    async function drain(it: AsyncIterable<unknown>) {
      for await (const _ of it) void _;
    }
    await drain(p.chat([{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal));
    expect(mockFetch.mock.calls[0][1].headers.Authorization).toBe('Bearer first-key');

    key = 'second-key';
    await drain(p.chat([{ role: 'user', content: 'hi' }], 'deepseek-chat', new AbortController().signal));
    expect(mockFetch.mock.calls[1][1].headers.Authorization).toBe('Bearer second-key');
  });

  it('isAuthFailure returns true for DeepseekError with status 400/401/402/403', () => {
    const p = deepseekProvider({
      getApiKey: () => 'x',
      getChain: () => ['m'],
      getSystemInstruction: () => '',
      getTemperature: () => null,
      getMaxOutputTokens: () => null,
    });
    expect(p.isAuthFailure(new DeepseekError('x', 400))).toBe(true);
    expect(p.isAuthFailure(new DeepseekError('x', 401))).toBe(true);
    expect(p.isAuthFailure(new DeepseekError('x', 402))).toBe(true);
    expect(p.isAuthFailure(new DeepseekError('x', 403))).toBe(true);
  });

  it('isAuthFailure returns false for other errors', () => {
    const p = deepseekProvider({
      getApiKey: () => 'x',
      getChain: () => ['m'],
      getSystemInstruction: () => '',
      getTemperature: () => null,
      getMaxOutputTokens: () => null,
    });
    expect(p.isAuthFailure(new DeepseekError('x', 429))).toBe(false);
    expect(p.isAuthFailure(new DeepseekError('x', 500))).toBe(false);
    expect(p.isAuthFailure(new Error('boom'))).toBe(false);
    expect(p.isAuthFailure(undefined)).toBe(false);
  });

  it('isReady returns true when API key is set, a string reason otherwise', () => {
    let key = '';
    const p = deepseekProvider({
      getApiKey: () => key,
      getChain: () => ['m'],
      getSystemInstruction: () => '',
      getTemperature: () => null,
      getMaxOutputTokens: () => null,
    });
    const empty = p.isReady();
    expect(typeof empty).toBe('string');
    expect(empty).toContain('deepseek');
    expect(empty).toContain('API key');

    key = 'present';
    expect(p.isReady()).toBe(true);
  });
});
