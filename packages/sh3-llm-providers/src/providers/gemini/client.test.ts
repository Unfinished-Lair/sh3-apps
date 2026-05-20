import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { listModels, GeminiError, chatStream, geminiProvider } from './client';
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
    const p = geminiProvider({
      getApiKey: () => 'x',
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    expect(p.id).toBe('gemini');
    expect(p.label).toBe('Gemini');
  });

  it('chain() reads getChain on every call (live read)', () => {
    let chain = ['a'];
    const p = geminiProvider({
      getApiKey: () => 'x',
      getChain: () => chain,
      getMaxOutputTokens: () => null,
    });
    expect(p.chain()).toEqual(['a']);
    chain = ['b', 'c'];
    expect(p.chain()).toEqual(['b', 'c']);
  });

  it('chat() proxies to chatStream with the live API key', async () => {
    mockFetch.mockImplementation(async () => sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    let key = 'first-key';
    const p = geminiProvider({
      getApiKey: () => key,
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    await collect(p.chat([{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal));
    expect((mockFetch.mock.calls[0][0] as string)).toContain('key=first-key');

    key = 'second-key';
    await collect(p.chat([{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal));
    expect((mockFetch.mock.calls[1][0] as string)).toContain('key=second-key');
  });

  it('chat() forwards options.systemInstruction into the request body', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    const p = geminiProvider({
      getApiKey: () => 'k',
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    await collect(p.chat(
      [{ role: 'user', content: 'hi' }],
      'gemini-2.5-flash',
      new AbortController().signal,
      { systemInstruction: 'be brief' },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.systemInstruction).toEqual({ parts: [{ text: 'be brief' }] });
  });

  it('isAuthFailure returns true for GeminiError with status 400/401/403', () => {
    const p = geminiProvider({
      getApiKey: () => 'x',
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    expect(p.isAuthFailure(new GeminiError('x', 400))).toBe(true);
    expect(p.isAuthFailure(new GeminiError('x', 401))).toBe(true);
    expect(p.isAuthFailure(new GeminiError('x', 403))).toBe(true);
  });

  it('isAuthFailure returns false for other errors', () => {
    const p = geminiProvider({
      getApiKey: () => 'x',
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    expect(p.isAuthFailure(new GeminiError('x', 500))).toBe(false);
    expect(p.isAuthFailure(new GeminiError('x', 429))).toBe(false);
    expect(p.isAuthFailure(new Error('boom'))).toBe(false);
    expect(p.isAuthFailure(undefined)).toBe(false);
  });

  it('isReady returns true when API key is set, a string reason otherwise', () => {
    let key = '';
    const p = geminiProvider({
      getApiKey: () => key,
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    const empty = p.isReady();
    expect(typeof empty).toBe('string');
    expect(empty).toContain('gemini');
    expect(empty).toContain('API key');

    key = 'present';
    expect(p.isReady()).toBe(true);
  });
});

describe('chatStream tool-call translation', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends functionDeclarations with . encoded as __ in names', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(chatStream(
      'k',
      [{ role: 'user', content: 'hi' }],
      'gemini-2.5-flash',
      new AbortController().signal,
      undefined,
      {
        tools: [
          {
            name: 'sh3-r2.backup',
            description: 'Back up',
            inputSchema: { type: 'object', properties: { path: { type: 'string' } } },
          },
        ],
      },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.tools).toEqual([
      {
        functionDeclarations: [
          {
            name: 'sh3-r2__backup',
            description: 'Back up',
            parameters: { type: 'object', properties: { path: { type: 'string' } } },
          },
        ],
      },
    ]);
  });

  it('strips JSON-Schema keys Gemini rejects (additionalProperties, $schema, oneOf) — top level and nested', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(chatStream(
      'k',
      [{ role: 'user', content: 'hi' }],
      'gemini-2.5-flash',
      new AbortController().signal,
      undefined,
      {
        tools: [
          {
            name: 'tool.x',
            description: 'd',
            inputSchema: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              type: 'object',
              additionalProperties: false,
              properties: {
                tags: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: { name: { type: 'string' } },
                  },
                },
                bag: {
                  type: 'object',
                  additionalProperties: { type: 'string' },
                  properties: { k: { type: 'string' } },
                },
              },
              oneOf: [{ type: 'object' }],
            },
          },
        ],
      },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    const params = body.tools[0].functionDeclarations[0].parameters;
    expect(params).toEqual({
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: { name: { type: 'string' } },
          },
        },
        bag: {
          type: 'object',
          properties: { k: { type: 'string' } },
        },
      },
    });
  });

  it('rewrites JSON-Schema nullable-shorthand type arrays into single type + nullable:true', async () => {
    // Gemini's Schema requires `type` to be a single string. JSON Schema's
    // nullable shorthand (`type: ["X","null"]`, emitted by zod-to-json-schema
    // and friends) must be translated to `type:"X", nullable:true`.
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(chatStream(
      'k',
      [{ role: 'user', content: 'hi' }],
      'gemini-2.5-flash',
      new AbortController().signal,
      undefined,
      {
        tools: [
          {
            name: 'tool.nullable',
            description: 'd',
            inputSchema: {
              type: 'object',
              properties: {
                a: { type: ['string', 'null'] },
                b: { type: ['null', 'integer'] },
                c: { type: ['string'] },
                d: {
                  type: 'array',
                  items: { type: ['number', 'null'] },
                },
              },
            },
          },
        ],
      },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    const params = body.tools[0].functionDeclarations[0].parameters;
    expect(params).toEqual({
      type: 'object',
      properties: {
        a: { type: 'string', nullable: true },
        b: { type: 'integer', nullable: true },
        c: { type: 'string' },
        d: {
          type: 'array',
          items: { type: 'number', nullable: true },
        },
      },
    });
  });

  it('omits the tools field when no tools given', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal,
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.tools).toBeUndefined();
  });

  it('parses functionCall parts and emits tool-call chunk + tool-calls finishReason', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({
        candidates: [{
          content: {
            parts: [
              { functionCall: { name: 'sh3-r2__backup', args: { path: '/docs' } } },
            ],
          },
        }],
      }),
    ]));
    const chunks = await collect(chatStream(
      'k',
      [{ role: 'user', content: 'do it' }],
      'gemini-2.5-flash',
      new AbortController().signal,
      undefined,
      {
        tools: [{
          name: 'sh3-r2.backup',
          description: 'b',
          inputSchema: { type: 'object' },
        }],
      },
    ));
    expect(chunks[0]).toMatchObject({
      type: 'tool-call',
      name: 'sh3-r2.backup',
      arguments: { path: '/docs' },
    });
    expect(chunks[chunks.length - 1]).toEqual({ type: 'done', finishReason: 'tool-calls' });
  });

  it('appends toolResults as role:function parts in the next request', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    const callIdToName = new Map<string, string>([['c1', 'sh3-r2.backup']]);
    await collect(chatStream(
      'k',
      [{ role: 'user', content: 'hi' }],
      'gemini-2.5-flash',
      new AbortController().signal,
      undefined,
      {
        toolResults: [{ toolCallId: 'c1', content: 'done' }],
      },
      callIdToName,
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    const fnPart = body.contents[body.contents.length - 1];
    expect(fnPart.role).toBe('function');
    expect(fnPart.parts[0].functionResponse).toEqual({
      name: 'sh3-r2__backup',
      response: { result: 'done' },
    });
  });

  it('serializes an error toolResult as { error }', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    const callIdToName = new Map<string, string>([['c1', 'sh3-r2.backup']]);
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal,
      undefined,
      { toolResults: [{ toolCallId: 'c1', content: { error: 'boom' } }] },
      callIdToName,
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    const fnPart = body.contents[body.contents.length - 1];
    expect(fnPart.parts[0].functionResponse).toEqual({
      name: 'sh3-r2__backup',
      response: { error: 'boom' },
    });
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

  it('omits systemInstruction and generationConfig when no config provided', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(
      chatStream('test-key', [{ role: 'user', content: 'hi' }], 'gemini-2.5-flash', new AbortController().signal),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body).not.toHaveProperty('systemInstruction');
    expect(body).not.toHaveProperty('generationConfig');
  });

  it('includes systemInstruction when options.systemInstruction provided', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'gemini-2.5-flash',
        new AbortController().signal,
        undefined,
        { systemInstruction: 'be brief' },
      ),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.systemInstruction).toEqual({ parts: [{ text: 'be brief' }] });
  });

  it('omits systemInstruction when options.systemInstruction is empty string', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'gemini-2.5-flash',
        new AbortController().signal,
        undefined,
        { systemInstruction: '' },
      ),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body).not.toHaveProperty('systemInstruction');
  });

  it('includes generationConfig.temperature from ChatOptions, omits when null', async () => {
    // Temperature now arrives via ChatOptions (sh3-ai-owned, shared across
    // providers), not the per-provider GeminiGenerationConfig.
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'gemini-2.5-flash',
        new AbortController().signal,
        undefined,
        { temperature: 0.2 },
      ),
    );
    let body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.generationConfig).toEqual({ temperature: 0.2 });

    mockFetch.mockClear();
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'gemini-2.5-flash',
        new AbortController().signal,
        undefined,
        { temperature: null },
      ),
    );
    body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body).not.toHaveProperty('generationConfig');
  });

  it('includes generationConfig.maxOutputTokens when number, omits when null', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'gemini-2.5-flash',
        new AbortController().signal,
        { maxOutputTokens: 256 },
      ),
    );
    let body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.generationConfig).toEqual({ maxOutputTokens: 256 });

    mockFetch.mockClear();
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'gemini-2.5-flash',
        new AbortController().signal,
        { maxOutputTokens: null },
      ),
    );
    body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body).not.toHaveProperty('generationConfig');
  });

  it('combines temperature (from options) and maxOutputTokens (from config) in generationConfig', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    ]));
    await collect(
      chatStream(
        'test-key',
        [{ role: 'user', content: 'hi' }],
        'gemini-2.5-flash',
        new AbortController().signal,
        { maxOutputTokens: 100 },
        { temperature: 0 },
      ),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.generationConfig).toEqual({ temperature: 0, maxOutputTokens: 100 });
  });
});
