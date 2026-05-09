import { describe, it, expect, vi } from 'vitest';
import { makeAiModeDescriptor } from './mode';
import { ConversationState } from './conversation';
import type { AiProvider, ChatChunk } from './provider';

function makeOutput() {
  const stream = vi.fn(() => {
    const append = vi.fn();
    const complete = vi.fn();
    const error = vi.fn();
    return { append, complete, error };
  });
  const status = vi.fn();
  const text = vi.fn();
  const rich = vi.fn();
  return { stream, status, text, rich };
}

function tokenStream(tokens: string[]): AsyncIterable<ChatChunk> {
  return (async function* () {
    for (const t of tokens) yield { type: 'token', text: t };
    yield { type: 'done' };
  })();
}

function fakeProvider(overrides: Partial<AiProvider> = {}): AiProvider {
  return {
    id: 'gemini',
    label: 'Gemini',
    chain: () => ['gemini-2.5-flash'],
    chat: () => tokenStream(['hello']),
    isAuthFailure: () => false,
    isReady: () => true,
    ...overrides,
  };
}

describe('makeAiModeDescriptor', () => {
  it('descriptor has the expected shape', () => {
    const conversation = new ConversationState();
    const provider = fakeProvider();
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => provider });
    expect(desc.id).toBe('ai');
    expect(desc.label).toBe('AI');
    expect(desc.runsOn).toBe('client');
    expect(desc.autoRelocate).toBe(false);
    expect(typeof desc.dispatch).toBe('function');
    expect(typeof desc.activate).toBe('function');
    expect(typeof desc.deactivate).toBe('function');
  });

  it('happy path: streams tokens, completes, appends user + assistant messages', async () => {
    const conversation = new ConversationState();
    const provider = fakeProvider({ chat: () => tokenStream(['hel', 'lo']) });
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => provider });
    const output = makeOutput();
    const streamHandle = output.stream();
    output.stream.mockClear();
    output.stream.mockReturnValue(streamHandle);

    const signal = new AbortController().signal;
    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);

    expect(output.stream).toHaveBeenCalledTimes(1);
    expect(streamHandle.append).toHaveBeenCalledWith({ model: 'gemini-2.5-flash' });
    expect(streamHandle.append).toHaveBeenCalledWith({ markdown: 'hel' });
    expect(streamHandle.append).toHaveBeenCalledWith({ markdown: 'hello' });
    expect(streamHandle.complete).toHaveBeenCalledTimes(1);
    expect(streamHandle.error).not.toHaveBeenCalled();

    expect(conversation.messages).toEqual([
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello', model: 'gemini-2.5-flash' },
    ]);
  });

  it('emits an error status and does not append when no provider is contributed', async () => {
    const conversation = new ConversationState();
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => undefined });
    const output = makeOutput();
    const signal = new AbortController().signal;

    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);
    expect(output.status).toHaveBeenCalledWith('error', expect.stringContaining('no AI provider'));
    expect(conversation.messages).toEqual([]);
  });

  it('emits the provider isReady() string and does not append when not ready', async () => {
    const conversation = new ConversationState();
    const provider = fakeProvider({
      isReady: () => 'gemini: no API key configured',
      chat: () => { throw new Error('should not be called'); },
    });
    const output = makeOutput();
    const signal = new AbortController().signal;
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => provider });

    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);
    expect(output.status).toHaveBeenCalledWith('error', 'gemini: no API key configured');
    expect(conversation.messages).toEqual([]);
  });

  it('errors and rolls back when the chain is empty', async () => {
    const conversation = new ConversationState();
    const provider = fakeProvider({
      chain: () => [],
      chat: () => { throw new Error('should not be called'); },
    });
    const output = makeOutput();
    const signal = new AbortController().signal;
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => provider });

    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);
    expect(output.status).toHaveBeenCalledWith('error', expect.stringContaining('no models'));
    expect(conversation.messages).toEqual([]);
  });

  it('falls through chain on transient error, stops on auth failure', async () => {
    const conversation = new ConversationState();
    let calls = 0;
    const provider = fakeProvider({
      chain: () => ['a', 'b', 'c'],
      chat: (_msgs, model) => {
        calls++;
        if (model === 'a') throw new Error('transient');
        if (model === 'b') {
          const e = new Error('auth');
          (e as any).__auth = true;
          throw e;
        }
        return tokenStream(['ok']);
      },
      isAuthFailure: (err) => (err as any)?.__auth === true,
    });
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => provider });
    const output = makeOutput();
    const handle = output.stream();
    output.stream.mockReturnValue(handle);
    const signal = new AbortController().signal;
    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);

    expect(calls).toBe(2);
    expect(handle.error).toHaveBeenCalledTimes(1);
    expect(conversation.messages).toEqual([]);
  });

  it('honors lockedModel: single attempt, no chain iteration', async () => {
    const conversation = new ConversationState();
    conversation.setLock('gemini-2.5-pro');
    const calls: string[] = [];
    const provider = fakeProvider({
      chain: () => ['gemini-2.5-flash', 'gemini-2.5-pro'],
      chat: (_m, model) => {
        calls.push(model);
        throw new Error('locked-fail');
      },
    });
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => provider });
    const output = makeOutput();
    const handle = output.stream();
    output.stream.mockReturnValue(handle);
    const signal = new AbortController().signal;
    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);
    expect(calls).toEqual(['gemini-2.5-pro']);
    expect(handle.error).toHaveBeenCalledTimes(1);
    expect(conversation.messages).toEqual([]);
  });

  it('rolls back user message on abort mid-stream', async () => {
    const conversation = new ConversationState();
    const provider = fakeProvider({
      chat: (_m, _model, signal) =>
        (async function* () {
          yield { type: 'token', text: 'hel' };
          await new Promise((res, rej) => {
            signal.addEventListener('abort', () => rej(new DOMException('aborted', 'AbortError')));
          });
        })(),
    });
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => provider });
    const output = makeOutput();
    const handle = output.stream();
    output.stream.mockReturnValue(handle);
    const controller = new AbortController();
    const p = desc.dispatch!({ line: 'hi', cwd: '/', signal: controller.signal }, output as any);
    controller.abort();
    await p;
    expect(handle.error).toHaveBeenCalledTimes(1);
    expect(conversation.messages).toEqual([]);
  });

  it('activate and deactivate reset the conversation', () => {
    const conversation = new ConversationState();
    conversation.appendUser('q');
    conversation.appendAssistant('a', 'gemini-2.5-flash');
    conversation.setLock('gemini-2.5-pro');
    const desc = makeAiModeDescriptor({
      conversation,
      getProvider: () => fakeProvider(),
    });
    desc.activate!({} as any);
    expect(conversation.messages).toEqual([]);
    expect(conversation.lockedModel).toBeNull();

    conversation.appendUser('q2');
    conversation.setLock('x');
    desc.deactivate!({} as any);
    expect(conversation.messages).toEqual([]);
    expect(conversation.lockedModel).toBeNull();
  });

  it('forwards getIdleTimeoutMs() into ChatOptions on every chat call', async () => {
    const conversation = new ConversationState();
    const captured: unknown[] = [];
    const provider = fakeProvider({
      chat: (_m, _model, _signal, options) => {
        captured.push(options);
        return tokenStream(['ok']);
      },
    });
    const desc = makeAiModeDescriptor({
      conversation,
      getProvider: () => provider,
      getIdleTimeoutMs: () => 120_000,
    });
    const output = makeOutput();
    const handle = output.stream();
    output.stream.mockReturnValue(handle);
    const signal = new AbortController().signal;
    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);

    expect(captured).toHaveLength(1);
    expect((captured[0] as any).idleTimeoutMs).toBe(120_000);
  });

  it('omits idleTimeoutMs when getIdleTimeoutMs is not provided', async () => {
    const conversation = new ConversationState();
    const captured: unknown[] = [];
    const provider = fakeProvider({
      chat: (_m, _model, _signal, options) => {
        captured.push(options);
        return tokenStream(['ok']);
      },
    });
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => provider });
    const output = makeOutput();
    const handle = output.stream();
    output.stream.mockReturnValue(handle);
    const signal = new AbortController().signal;
    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);

    expect(captured).toHaveLength(1);
    expect((captured[0] as any).idleTimeoutMs).toBeUndefined();
  });

  it('resolves provider via getProvider on every dispatch (late registration)', async () => {
    const conversation = new ConversationState();
    let provider: AiProvider | undefined;
    const desc = makeAiModeDescriptor({ conversation, getProvider: () => provider });
    const output = makeOutput();
    const signal = new AbortController().signal;

    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);
    expect(output.status).toHaveBeenCalledWith('error', expect.stringContaining('no AI provider'));

    provider = fakeProvider({ chat: () => tokenStream(['ok']) });
    const handle = output.stream();
    output.stream.mockReturnValue(handle);
    await desc.dispatch!({ line: 'hi', cwd: '/', signal }, output as any);
    expect(handle.complete).toHaveBeenCalledTimes(1);
  });
});
