import { describe, it, expect, vi } from 'vitest';
import { dispatchLoop } from './loop';
import { makeTranscript } from './transcript';
import type { AiProvider, ChatChunk, ChatOptions } from '../provider';
import type { Tool } from '../catalog/types';
import type { ResolvedScope } from '../scope/types';
import { ConversationState } from '../conversation';

function fakeProvider(rounds: ChatChunk[][]): AiProvider {
  let i = 0;
  return {
    id: 'fake', label: 'fake',
    chain: () => ['m1'],
    capabilities: { tools: true },
    chat: async function* (
      _msg, _model, _signal, _opts: ChatOptions | undefined,
    ): AsyncIterable<ChatChunk> {
      const chunks = rounds[i++] ?? [{ type: 'done', finishReason: 'stop' }];
      for (const c of chunks) yield c;
    },
    isAuthFailure: () => false,
    isReady: () => true,
  };
}

function fakeScrollback() {
  const entries: unknown[] = [];
  return { entries, push: (e: unknown) => entries.push(e) };
}

function fakeTool(name: string, run: Tool['run']): Tool {
  return {
    name, description: name, source: 'verb',
    inputSchema: { type: 'object' }, run,
  };
}

describe('dispatchLoop', () => {
  it('handles a tool-less round (no tool-call chunks)', async () => {
    const provider = fakeProvider([
      [
        { type: 'token', text: 'hello ' },
        { type: 'token', text: 'world' },
        { type: 'done', finishReason: 'stop' },
      ],
    ]);
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: [], blacklist: [] };

    await dispatchLoop({
      prompt: 'hi',
      catalog: [],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
    });

    expect(conv.messages).toEqual([
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello world', model: 'm1' },
    ]);
  });

  it('runs an allowed tool call and feeds the result back', async () => {
    const run = vi.fn().mockResolvedValue('ok');
    const tool = fakeTool('a.b', run);
    const provider = fakeProvider([
      [
        { type: 'tool-call', id: 'c1', name: 'a.b', arguments: { x: 1 } },
        { type: 'done', finishReason: 'tool-calls' },
      ],
      [
        { type: 'token', text: 'all done' },
        { type: 'done', finishReason: 'stop' },
      ],
    ]);
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['a.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'do it',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
    });

    expect(run).toHaveBeenCalledWith({ x: 1 }, expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(conv.toolCalls).toHaveLength(1);
    expect(conv.toolResults).toHaveLength(1);
    expect(conv.toolResults[0].content).toBe('ok');
  });

  it('denies a blacklisted tool and injects an error result without invoking run', async () => {
    const run = vi.fn();
    const tool = fakeTool('a.delete', run);
    const provider = fakeProvider([
      [
        { type: 'tool-call', id: 'c1', name: 'a.delete', arguments: {} },
        { type: 'done', finishReason: 'tool-calls' },
      ],
      [
        { type: 'token', text: 'sorry' },
        { type: 'done', finishReason: 'stop' },
      ],
    ]);
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = {
      id: 's', whitelist: ['*.*'], blacklist: ['*.delete'],
    };

    await dispatchLoop({
      prompt: 'delete it',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
    });

    expect(run).not.toHaveBeenCalled();
    expect(conv.toolResults[0].content).toEqual({ error: expect.stringMatching(/blacklisted/) });
  });

  it('captures tool errors without breaking the loop', async () => {
    const tool = fakeTool('a.b', async () => { throw new Error('boom'); });
    const provider = fakeProvider([
      [
        { type: 'tool-call', id: 'c1', name: 'a.b', arguments: {} },
        { type: 'done', finishReason: 'tool-calls' },
      ],
      [
        { type: 'token', text: 'fallback' },
        { type: 'done', finishReason: 'stop' },
      ],
    ]);
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['a.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'try',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
    });

    expect(conv.toolResults[0].content).toEqual({ error: 'boom' });
  });

  it('honors maxRounds and stops with a status entry', async () => {
    const run = vi.fn().mockResolvedValue('ok');
    const tool = fakeTool('a.b', run);
    // Provider always asks for tool-calls — would loop forever without bound.
    const infiniteRound: ChatChunk[] = [
      { type: 'tool-call', id: 'c', name: 'a.b', arguments: {} },
      { type: 'done', finishReason: 'tool-calls' },
    ];
    const provider = fakeProvider([
      infiniteRound, infiniteRound, infiniteRound, infiniteRound,
    ]);
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['a.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'spin',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
      maxRounds: 2,
    });

    // Two rounds executed → two tool-result entries.
    expect(conv.toolResults).toHaveLength(2);
    // A warn-level status entry should have been pushed for the limit.
    expect(sb.entries.some(
      (e: unknown) =>
        typeof e === 'object' && e !== null &&
        (e as { kind?: unknown }).kind === 'status' &&
        (e as { level?: unknown }).level === 'warn' &&
        /iteration limit/.test((e as { text?: string }).text ?? ''),
    )).toBe(true);
  });

  it('exits cleanly when the signal aborts mid-loop', async () => {
    const ac = new AbortController();
    const tool = fakeTool('a.b', async (_args, _opts) => {
      ac.abort();
      throw new Error('aborted');
    });
    const provider = fakeProvider([
      [
        { type: 'tool-call', id: 'c1', name: 'a.b', arguments: {} },
        { type: 'done', finishReason: 'tool-calls' },
      ],
    ]);
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['a.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'try',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: ac.signal,
      transcript: makeTranscript(sb),
    });

    expect(sb.entries.some(
      (e: unknown) =>
        typeof e === 'object' && e !== null &&
        (e as { text?: string }).text === 'aborted',
    )).toBe(true);
  });

  it('passes the prior round\'s toolCalls to the provider on the next round', async () => {
    const tool = fakeTool('a.b', async () => 'ok');
    const seenOptions: Array<ChatOptions | undefined> = [];
    const provider: AiProvider = {
      id: 'fake', label: 'fake',
      chain: () => ['m1'],
      capabilities: { tools: true },
      chat: async function* (_msg, _model, _signal, opts) {
        seenOptions.push(opts);
        if (seenOptions.length === 1) {
          yield { type: 'tool-call', id: 'c1', name: 'a.b', arguments: { x: 1 } };
          yield { type: 'done', finishReason: 'tool-calls' };
        } else {
          yield { type: 'token', text: 'done' };
          yield { type: 'done', finishReason: 'stop' };
        }
      },
      isAuthFailure: () => false,
      isReady: () => true,
    };
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['a.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'go',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
    });

    expect(seenOptions[0]?.toolCalls).toBeUndefined();
    expect(seenOptions[1]?.toolCalls).toEqual([
      { id: 'c1', name: 'a.b', arguments: { x: 1 } },
    ]);
    expect(seenOptions[1]?.toolResults).toHaveLength(1);
  });

  it('forwards reasoning chunks accumulated in the prior round', async () => {
    const tool = fakeTool('a.b', async () => 'ok');
    const seenOptions: Array<ChatOptions | undefined> = [];
    const provider: AiProvider = {
      id: 'fake', label: 'fake',
      chain: () => ['m1'],
      capabilities: { tools: true },
      chat: async function* (_msg, _model, _signal, opts) {
        seenOptions.push(opts);
        if (seenOptions.length === 1) {
          yield { type: 'reasoning', text: 'I should ' };
          yield { type: 'reasoning', text: 'call a.b' };
          yield { type: 'tool-call', id: 'c1', name: 'a.b', arguments: {} };
          yield { type: 'done', finishReason: 'tool-calls' };
        } else {
          yield { type: 'token', text: 'done' };
          yield { type: 'done', finishReason: 'stop' };
        }
      },
      isAuthFailure: () => false,
      isReady: () => true,
    };
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['a.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'go',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
    });

    expect(seenOptions[0]?.reasoningContent).toBeUndefined();
    expect(seenOptions[1]?.reasoningContent).toBe('I should call a.b');
  });

  it('accumulates providerData blocks and forwards them in the structured reasoningContent', async () => {
    const tool = fakeTool('a.b', async () => 'ok');
    const seenOptions: Array<ChatOptions | undefined> = [];
    const provider: AiProvider = {
      id: 'fake', label: 'fake',
      chain: () => ['m1'],
      capabilities: { tools: true },
      chat: async function* (_msg, _model, _signal, opts) {
        seenOptions.push(opts);
        if (seenOptions.length === 1) {
          yield { type: 'reasoning', text: 'I should ' };
          yield { type: 'reasoning', text: 'call a.b' };
          yield { type: 'reasoning', text: '', providerData: { sig: 'abc', text: 'I should call a.b' } };
          yield { type: 'tool-call', id: 'c1', name: 'a.b', arguments: {} };
          yield { type: 'done', finishReason: 'tool-calls' };
        } else {
          yield { type: 'token', text: 'done' };
          yield { type: 'done', finishReason: 'stop' };
        }
      },
      isAuthFailure: () => false,
      isReady: () => true,
    };
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['a.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'go',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
    });

    expect(seenOptions[1]?.reasoningContent).toEqual({
      text: 'I should call a.b',
      providerBlocks: [{ sig: 'abc', text: 'I should call a.b' }],
    });
  });

  it('falls back to string reasoningContent when no providerData is emitted', async () => {
    // Regression test: DeepSeek emits reasoning chunks without providerData;
    // dispatch must still send the legacy string shape so the DeepSeek
    // client's existing branch keeps working unchanged.
    const tool = fakeTool('a.b', async () => 'ok');
    const seenOptions: Array<ChatOptions | undefined> = [];
    const provider: AiProvider = {
      id: 'fake', label: 'fake',
      chain: () => ['m1'],
      capabilities: { tools: true },
      chat: async function* (_msg, _model, _signal, opts) {
        seenOptions.push(opts);
        if (seenOptions.length === 1) {
          yield { type: 'reasoning', text: 'plain text' };
          yield { type: 'tool-call', id: 'c1', name: 'a.b', arguments: {} };
          yield { type: 'done', finishReason: 'tool-calls' };
        } else {
          yield { type: 'token', text: 'done' };
          yield { type: 'done', finishReason: 'stop' };
        }
      },
      isAuthFailure: () => false,
      isReady: () => true,
    };
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['a.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'go',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
    });

    expect(seenOptions[1]?.reasoningContent).toBe('plain text');
  });

  it('calls transcript.reasoning when showReasoning is true (default)', async () => {
    const calls: string[] = [];
    const transcript = makeTranscript(fakeScrollback());
    transcript.reasoning = (t) => { calls.push(t); };
    const provider: AiProvider = {
      id: 'fake', label: 'fake', chain: () => ['m1'], capabilities: { tools: true },
      chat: async function* () {
        yield { type: 'reasoning', text: 'hello' };
        yield { type: 'token', text: 'done' };
        yield { type: 'done', finishReason: 'stop' };
      },
      isAuthFailure: () => false, isReady: () => true,
    };
    await dispatchLoop({
      prompt: 'go', catalog: [], scope: { id: 's', whitelist: [], blacklist: [] },
      conversation: new ConversationState(), provider, model: 'm1',
      signal: new AbortController().signal, transcript,
    });
    expect(calls).toEqual(['hello']);
  });

  it('does NOT call transcript.reasoning when showReasoning is false (still accumulates for echo)', async () => {
    const calls: string[] = [];
    const transcript = makeTranscript(fakeScrollback());
    transcript.reasoning = (t) => { calls.push(t); };
    const seenOptions: Array<ChatOptions | undefined> = [];
    const tool = fakeTool('a.b', async () => 'ok');
    const provider: AiProvider = {
      id: 'fake', label: 'fake', chain: () => ['m1'], capabilities: { tools: true },
      chat: async function* (_msg, _model, _signal, opts) {
        seenOptions.push(opts);
        if (seenOptions.length === 1) {
          yield { type: 'reasoning', text: 'silently' };
          yield { type: 'tool-call', id: 'c1', name: 'a.b', arguments: {} };
          yield { type: 'done', finishReason: 'tool-calls' };
        } else {
          yield { type: 'done', finishReason: 'stop' };
        }
      },
      isAuthFailure: () => false, isReady: () => true,
    };
    await dispatchLoop({
      prompt: 'go', catalog: [tool],
      scope: { id: 's', whitelist: ['a.*'], blacklist: [] },
      conversation: new ConversationState(), provider, model: 'm1',
      signal: new AbortController().signal, transcript,
      showReasoning: false,
    });
    expect(calls).toEqual([]);                                     // gated
    expect(seenOptions[1]?.reasoningContent).toBe('silently');     // still echoed
  });

  it('forwards systemInstruction to the provider on every round', async () => {
    const tool = fakeTool('a.b', async () => 'ok');
    const seenOptions: Array<ChatOptions | undefined> = [];
    const provider: AiProvider = {
      id: 'fake', label: 'fake',
      chain: () => ['m1'],
      capabilities: { tools: true },
      chat: async function* (_msg, _model, _signal, opts) {
        seenOptions.push(opts);
        if (seenOptions.length === 1) {
          yield { type: 'tool-call', id: 'c1', name: 'a.b', arguments: {} };
          yield { type: 'done', finishReason: 'tool-calls' };
        } else {
          yield { type: 'token', text: 'done' };
          yield { type: 'done', finishReason: 'stop' };
        }
      },
      isAuthFailure: () => false,
      isReady: () => true,
    };
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['a.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'go',
      catalog: [tool],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
      systemInstruction: 'be brief',
    });

    expect(seenOptions[0]?.systemInstruction).toBe('be brief');
    expect(seenOptions[1]?.systemInstruction).toBe('be brief');
  });

  it('rejects unknown tool names from the model', async () => {
    const provider = fakeProvider([
      [
        { type: 'tool-call', id: 'c1', name: 'unknown.tool', arguments: {} },
        { type: 'done', finishReason: 'tool-calls' },
      ],
      [{ type: 'done', finishReason: 'stop' }],
    ]);
    const sb = fakeScrollback();
    const conv = new ConversationState();
    const scope: ResolvedScope = { id: 's', whitelist: ['*.*'], blacklist: [] };

    await dispatchLoop({
      prompt: 'x',
      catalog: [],
      scope,
      conversation: conv,
      provider,
      model: 'm1',
      signal: new AbortController().signal,
      transcript: makeTranscript(sb),
    });

    expect(conv.toolResults[0].content).toEqual({ error: expect.stringMatching(/unknown tool/) });
  });
});
