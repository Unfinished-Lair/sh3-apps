import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  chatStream,
  listModels,
  claudeProvider,
  ClaudeError,
} from './client';
import type { ChatChunk } from 'sh3-ai';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Build an SSE response from a list of (event-name, data-json) pairs. */
function sseResponse(events: Array<[string, string]>): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder();
      for (const [event, data] of events) {
        controller.enqueue(enc.encode(`event: ${event}\ndata: ${data}\n\n`));
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

describe('chatStream — text-only happy path', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POSTs to /v1/messages with x-api-key + anthropic-version + stream:true', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'hi' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'test-key',
      [{ role: 'user', content: 'hello' }],
      'claude-haiku-4-5',
      new AbortController().signal,
    ));
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      'Content-Type': 'application/json',
      'x-api-key': 'test-key',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    });
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe('claude-haiku-4-5');
    expect(body.stream).toBe(true);
    expect(body.max_tokens).toBe(8192);   // DEFAULT_MAX_TOKENS
    expect(body.messages).toEqual([{ role: 'user', content: 'hello' }]);
    expect(body).not.toHaveProperty('system');
  });

  it('yields text_delta tokens then a done chunk', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'hel' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'lo' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    const chunks = await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
    ));
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'token', text: 'hel' },
      { type: 'token', text: 'lo' },
      { type: 'done', finishReason: 'stop' },
    ]);
  });

  it('throws ClaudeError with envelope message and status on HTTP failure', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } }, 401),
    );
    const err = await collect(
      chatStream('bad-key', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal),
    ).catch((e) => e);
    expect(err).toBeInstanceOf(ClaudeError);
    expect(err.status).toBe(401);
    expect(err.message).toBe('invalid x-api-key');
  });

  it('redacts the API key from chatStream errors', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ type: 'error', error: { message: 'invalid key sk-LITERAL' } }, 401),
    );
    const err = await collect(
      chatStream('sk-LITERAL', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal),
    ).catch((e) => e);
    expect(err.message).not.toContain('sk-LITERAL');
    expect(err.message).toContain('***');
  });

  it('wraps a successful 2xx with no chunks as an error', async () => {
    mockFetch.mockResolvedValue(sseResponse([]));
    const err = await collect(
      chatStream('k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal),
    ).catch((e) => e);
    expect(err).toBeInstanceOf(ClaudeError);
    expect(err.message).toContain('empty stream');
  });

  it('uses user-supplied maxOutputTokens when set', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
      { maxOutputTokens: 256 },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.max_tokens).toBe(256);
  });
});

describe('chatStream — tool round-trip', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends tools as { name, description, input_schema } (with encoded names)', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
      undefined,
      {
        tools: [{
          name: 'sh3-r2.backup',
          description: 'Back up',
          inputSchema: { type: 'object', properties: { path: { type: 'string' } } },
        }],
      },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.tools).toEqual([{
      name: 'sh3-r2__backup',
      description: 'Back up',
      input_schema: { type: 'object', properties: { path: { type: 'string' } } },
    }]);
  });

  it('omits the tools field when no tools given', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.tools).toBeUndefined();
  });

  it('accumulates input_json_delta and emits one tool-call chunk per tool_use block (decoding __→.)', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({
        type: 'content_block_start',
        index: 0,
        content_block: { type: 'tool_use', id: 'toolu_1', name: 'sh3-r2__backup', input: {} },
      })],
      ['content_block_delta', JSON.stringify({
        type: 'content_block_delta', index: 0,
        delta: { type: 'input_json_delta', partial_json: '{"pa' },
      })],
      ['content_block_delta', JSON.stringify({
        type: 'content_block_delta', index: 0,
        delta: { type: 'input_json_delta', partial_json: 'th":"/docs"}' },
      })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'tool_use' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    const chunks = await collect(chatStream(
      'k', [{ role: 'user', content: 'go' }], 'claude-haiku-4-5', new AbortController().signal,
      undefined,
      { tools: [{ name: 'sh3-r2.backup', description: 'b', inputSchema: { type: 'object' } }] },
    ));
    const toolCall = chunks.find((c) => c.type === 'tool-call');
    expect(toolCall).toMatchObject({
      type: 'tool-call',
      id: 'toolu_1',
      name: 'sh3-r2.backup',
      arguments: { path: '/docs' },
    });
    const done = chunks[chunks.length - 1];
    expect(done).toEqual({ type: 'done', finishReason: 'tool-calls' });
  });

  it('rewrites trailing assistant + appends synthetic user tool_result when toolCalls present', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k',
      [
        { role: 'user', content: 'list apps' },
        { role: 'assistant', content: 'I will list them.' },
      ],
      'claude-haiku-4-5', new AbortController().signal,
      undefined,
      {
        toolCalls: [{ id: 'toolu_1', name: 'shell.apps', arguments: { x: 1 } }],
        toolResults: [{ toolCallId: 'toolu_1', content: 'app-a, app-b' }],
      },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.messages).toEqual([
      { role: 'user', content: 'list apps' },
      {
        role: 'assistant',
        content: [
          { type: 'text', text: 'I will list them.' },
          { type: 'tool_use', id: 'toolu_1', name: 'shell__apps', input: { x: 1 } },
        ],
      },
      {
        role: 'user',
        content: [
          { type: 'tool_result', tool_use_id: 'toolu_1', content: 'app-a, app-b' },
        ],
      },
    ]);
  });

  it('injects an empty-content assistant turn for toolCalls when no preceding assistant message', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k',
      [{ role: 'user', content: 'list apps' }],
      'claude-haiku-4-5', new AbortController().signal,
      undefined,
      {
        toolCalls: [{ id: 'toolu_1', name: 'shell.apps', arguments: {} }],
        toolResults: [{ toolCallId: 'toolu_1', content: 'app-a' }],
      },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.messages).toEqual([
      { role: 'user', content: 'list apps' },
      {
        role: 'assistant',
        content: [
          { type: 'tool_use', id: 'toolu_1', name: 'shell__apps', input: {} },
        ],
      },
      {
        role: 'user',
        content: [
          { type: 'tool_result', tool_use_id: 'toolu_1', content: 'app-a' },
        ],
      },
    ]);
  });

  it('serializes an error toolResult as JSON {"error":...}', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
      undefined,
      {
        toolCalls: [{ id: 'toolu_1', name: 'shell.apps', arguments: {} }],
        toolResults: [{ toolCallId: 'toolu_1', content: { error: 'boom' } }],
      },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    const last = body.messages[body.messages.length - 1];
    expect(last.content[0]).toEqual({
      type: 'tool_result',
      tool_use_id: 'toolu_1',
      content: '{"error":"boom"}',
    });
  });
});

describe('chatStream — extended thinking', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('attaches thinking field for claude-opus-* models', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-opus-4-7', new AbortController().signal,
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.thinking).toEqual({ type: 'enabled', budget_tokens: 4096 });
  });

  it('attaches thinking field for claude-sonnet-* models', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-sonnet-4-6', new AbortController().signal,
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.thinking).toEqual({ type: 'enabled', budget_tokens: 4096 });
  });

  it('omits thinking field for claude-haiku-* models', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.thinking).toBeUndefined();
  });

  it('echoes signed thinking blocks at the head of the assistant tool_use turn (structured reasoningContent)', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k',
      [{ role: 'user', content: 'list apps' }],
      'claude-opus-4-7', new AbortController().signal,
      undefined,
      {
        toolCalls: [{ id: 'toolu_1', name: 'shell.apps', arguments: {} }],
        toolResults: [{ toolCallId: 'toolu_1', content: 'app-a' }],
        reasoningContent: {
          text: 'I should call shell.apps',
          providerBlocks: [{
            type: 'thinking',
            thinking: 'I should call shell.apps',
            signature: 'sig-xyz',
          }],
        },
      },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    const assistant = body.messages[body.messages.length - 2];
    expect(assistant).toEqual({
      role: 'assistant',
      content: [
        { type: 'thinking', thinking: 'I should call shell.apps', signature: 'sig-xyz' },
        { type: 'tool_use', id: 'toolu_1', name: 'shell__apps', input: {} },
      ],
    });
  });

  it('ignores the string form of reasoningContent (DeepSeek-only) on Claude', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k',
      [{ role: 'user', content: 'hi' }],
      'claude-opus-4-7', new AbortController().signal,
      undefined,
      {
        toolCalls: [{ id: 'toolu_1', name: 'shell.apps', arguments: {} }],
        toolResults: [{ toolCallId: 'toolu_1', content: 'ok' }],
        reasoningContent: 'flat string — should be ignored',
      },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    const assistant = body.messages[body.messages.length - 2];
    // No 'thinking' block — the flat string can't carry signatures.
    expect(assistant.content).toEqual([
      { type: 'tool_use', id: 'toolu_1', name: 'shell__apps', input: {} },
    ]);
  });

  it('emits reasoning text chunks from thinking_delta and a final providerData chunk after stop', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({
        type: 'content_block_start', index: 0,
        content_block: { type: 'thinking', thinking: '' },
      })],
      ['content_block_delta', JSON.stringify({
        type: 'content_block_delta', index: 0,
        delta: { type: 'thinking_delta', thinking: 'I should ' },
      })],
      ['content_block_delta', JSON.stringify({
        type: 'content_block_delta', index: 0,
        delta: { type: 'thinking_delta', thinking: 'answer carefully.' },
      })],
      ['content_block_delta', JSON.stringify({
        type: 'content_block_delta', index: 0,
        delta: { type: 'signature_delta', signature: 'sig-abc' },
      })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 1, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 1, delta: { type: 'text_delta', text: 'Answer.' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 1 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    const chunks = await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-opus-4-7', new AbortController().signal,
    ));
    expect(chunks).toEqual<ChatChunk[]>([
      { type: 'reasoning', text: 'I should ' },
      { type: 'reasoning', text: 'answer carefully.' },
      {
        type: 'reasoning',
        text: '',
        providerData: {
          type: 'thinking',
          thinking: 'I should answer carefully.',
          signature: 'sig-abc',
        },
      },
      { type: 'token', text: 'Answer.' },
      { type: 'done', finishReason: 'stop' },
    ]);
  });
});

describe('chatStream — system instruction + caching', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('omits system field when systemInstruction is empty/undefined', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
      undefined, { systemInstruction: '' },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body).not.toHaveProperty('system');
  });

  it('lifts non-empty systemInstruction as an array form with cache_control ephemeral', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
      undefined, { systemInstruction: 'be brief' },
    ));
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.system).toEqual([
      { type: 'text', text: 'be brief', cache_control: { type: 'ephemeral' } },
    ]);
  });

  it('forwards temperature when provided, omits when null', async () => {
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
      undefined, { temperature: 0.3 },
    ));
    let body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.temperature).toBe(0.3);

    mockFetch.mockClear();
    mockFetch.mockResolvedValue(sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    await collect(chatStream(
      'k', [{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal,
      undefined, { temperature: null },
    ));
    body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body).not.toHaveProperty('temperature');
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

  it('GETs /v1/models with x-api-key and anthropic-version', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ data: [] }));
    await listModels('my-key');
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/models');
    expect(init?.method ?? 'GET').toBe('GET');
    expect(init.headers['x-api-key']).toBe('my-key');
    expect(init.headers['anthropic-version']).toBe('2023-06-01');
    expect(init.headers['anthropic-dangerous-direct-browser-access']).toBe('true');
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('maps data entries to ModelInfo using display_name, falling back to id, sorted by id', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({
        data: [
          { id: 'claude-opus-4-7', display_name: 'Claude Opus 4.7', type: 'model' },
          { id: 'claude-haiku-4-5', type: 'model' },
        ],
      }),
    );
    const models = await listModels('test-key');
    expect(models).toEqual([
      { id: 'claude-haiku-4-5', displayName: 'claude-haiku-4-5' },
      { id: 'claude-opus-4-7', displayName: 'Claude Opus 4.7' },
    ]);
  });

  it('throws ClaudeError with envelope message and status on HTTP failure', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ type: 'error', error: { message: 'invalid x-api-key' } }, 401),
    );
    const err = await listModels('bad-key').catch((e) => e);
    expect(err).toBeInstanceOf(ClaudeError);
    expect(err.status).toBe(401);
    expect(err.message).toBe('invalid x-api-key');
  });

  it('redacts the API key from listModels errors', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({ type: 'error', error: { message: 'invalid key sk-LITERAL' } }, 401),
    );
    const err = await listModels('sk-LITERAL').catch((e) => e);
    expect(err.message).not.toContain('sk-LITERAL');
    expect(err.message).toContain('***');
  });
});

describe('claudeProvider', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('id and label are static', () => {
    const p = claudeProvider({
      getApiKey: () => 'x',
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    expect(p.id).toBe('claude');
    expect(p.label).toBe('Claude');
    expect(p.capabilities?.tools).toBe(true);
  });

  it('chain() reads getChain on every call (live read)', () => {
    let chain = ['a'];
    const p = claudeProvider({
      getApiKey: () => 'x',
      getChain: () => chain,
      getMaxOutputTokens: () => null,
    });
    expect(p.chain()).toEqual(['a']);
    chain = ['b', 'c'];
    expect(p.chain()).toEqual(['b', 'c']);
  });

  it('chat() proxies to chatStream with the live API key in x-api-key header', async () => {
    mockFetch.mockImplementation(async () => sseResponse([
      ['message_start', JSON.stringify({ type: 'message_start', message: {} })],
      ['content_block_start', JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text' } })],
      ['content_block_delta', JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } })],
      ['content_block_stop', JSON.stringify({ type: 'content_block_stop', index: 0 })],
      ['message_delta', JSON.stringify({ type: 'message_delta', delta: { stop_reason: 'end_turn' } })],
      ['message_stop', JSON.stringify({ type: 'message_stop' })],
    ]));
    let key = 'first-key';
    const p = claudeProvider({
      getApiKey: () => key,
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    async function drain(it: AsyncIterable<unknown>) {
      for await (const _ of it) void _;
    }
    await drain(p.chat([{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal));
    expect(mockFetch.mock.calls[0][1].headers['x-api-key']).toBe('first-key');

    key = 'second-key';
    await drain(p.chat([{ role: 'user', content: 'hi' }], 'claude-haiku-4-5', new AbortController().signal));
    expect(mockFetch.mock.calls[1][1].headers['x-api-key']).toBe('second-key');
  });

  it('isAuthFailure returns true for ClaudeError with status 400/401/403', () => {
    const p = claudeProvider({
      getApiKey: () => 'x',
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    expect(p.isAuthFailure(new ClaudeError('x', 400))).toBe(true);
    expect(p.isAuthFailure(new ClaudeError('x', 401))).toBe(true);
    expect(p.isAuthFailure(new ClaudeError('x', 403))).toBe(true);
  });

  it('isAuthFailure returns false for other errors', () => {
    const p = claudeProvider({
      getApiKey: () => 'x',
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    expect(p.isAuthFailure(new ClaudeError('x', 429))).toBe(false);
    expect(p.isAuthFailure(new ClaudeError('x', 500))).toBe(false);
    expect(p.isAuthFailure(new Error('boom'))).toBe(false);
    expect(p.isAuthFailure(undefined)).toBe(false);
  });

  it('isReady returns true when API key is set, a string reason otherwise', () => {
    let key = '';
    const p = claudeProvider({
      getApiKey: () => key,
      getChain: () => ['m'],
      getMaxOutputTokens: () => null,
    });
    const empty = p.isReady();
    expect(typeof empty).toBe('string');
    expect(empty).toContain('claude');
    expect(empty).toContain('API key');

    key = 'present';
    expect(p.isReady()).toBe(true);
  });
});
