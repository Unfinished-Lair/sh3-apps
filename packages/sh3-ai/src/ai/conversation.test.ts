import { describe, it, expect } from 'vitest';
import { ConversationState } from './conversation';

describe('ConversationState', () => {
  it('starts with no messages and no lock', () => {
    const c = new ConversationState();
    expect(c.messages).toEqual([]);
    expect(c.lockedModel).toBeNull();
  });

  it('appendUser pushes a user message', () => {
    const c = new ConversationState();
    c.appendUser('hello');
    expect(c.messages).toEqual([{ role: 'user', content: 'hello' }]);
  });

  it('popLastUser removes the trailing user message', () => {
    const c = new ConversationState();
    c.appendUser('hello');
    c.popLastUser();
    expect(c.messages).toEqual([]);
  });

  it('popLastUser is a no-op when last message is not user', () => {
    const c = new ConversationState();
    c.appendUser('q');
    c.appendAssistant('a', 'gemini-2.5-flash');
    c.popLastUser();
    expect(c.messages).toEqual([
      { role: 'user', content: 'q' },
      { role: 'assistant', content: 'a', model: 'gemini-2.5-flash' },
    ]);
  });

  it('popLastUser is a no-op on empty messages', () => {
    const c = new ConversationState();
    c.popLastUser();
    expect(c.messages).toEqual([]);
  });

  it('appendAssistant pushes an assistant message with model attribution', () => {
    const c = new ConversationState();
    c.appendAssistant('result', 'gemini-2.5-pro');
    expect(c.messages).toEqual([
      { role: 'assistant', content: 'result', model: 'gemini-2.5-pro' },
    ]);
  });

  it('reset clears messages and lockedModel', () => {
    const c = new ConversationState();
    c.appendUser('q');
    c.appendAssistant('a', 'gemini-2.5-flash');
    c.setLock('gemini-2.5-pro');
    c.reset();
    expect(c.messages).toEqual([]);
    expect(c.lockedModel).toBeNull();
  });

  it('setLock pins a model id', () => {
    const c = new ConversationState();
    c.setLock('gemini-2.5-pro');
    expect(c.lockedModel).toBe('gemini-2.5-pro');
  });

  it('setLock(null) releases the lock', () => {
    const c = new ConversationState();
    c.setLock('gemini-2.5-pro');
    c.setLock(null);
    expect(c.lockedModel).toBeNull();
  });
});

describe('ConversationState binding + autosave', () => {
  function fakeAutosave() {
    const writes: string[] = [];
    let disposed = false;
    return {
      writes,
      controller: {
        dirty: false,
        update(content: string) { writes.push(content); },
        async flush() {},
        async dispose() { disposed = true; },
      },
      get disposed() { return disposed; },
    };
  }

  const doc = {
    id: 'abc',
    version: 1 as const,
    title: 'fixing auth',
    createdAt: 100,
    updatedAt: 200,
    providerId: 'gemini',
    model: 'gemini-2.5-flash',
    messages: [
      { role: 'user' as const, content: 'why' },
      { role: 'assistant' as const, content: 'because', model: 'gemini-2.5-flash' },
    ],
    toolCalls: [
      { messageIndex: 1, callId: 'c1', name: 'a.b', arguments: {} },
    ],
    toolResults: [
      { messageIndex: 1, callId: 'c1', content: 'ok' },
    ],
  };

  it('bindTo replaces in-memory contents', () => {
    const c = new ConversationState();
    c.appendUser('stale');
    const a = fakeAutosave();
    c.bindTo(doc, a.controller);
    expect(c.id).toBe('abc');
    expect(c.title).toBe('fixing auth');
    expect(c.createdAt).toBe(100);
    expect(c.providerId).toBe('gemini');
    expect(c.lockedModel).toBe('gemini-2.5-flash');
    expect(c.messages).toEqual(doc.messages);
    expect(c.toolCalls).toEqual(doc.toolCalls);
    expect(c.toolResults).toEqual(doc.toolResults);
  });

  it('mutators while bound trigger autosave update', () => {
    const c = new ConversationState();
    const a = fakeAutosave();
    c.bindTo(doc, a.controller);
    const before = a.writes.length;
    c.appendUser('next prompt');
    expect(a.writes.length).toBe(before + 1);
    const written = JSON.parse(a.writes[a.writes.length - 1]);
    expect(written.messages[written.messages.length - 1]).toEqual({
      role: 'user', content: 'next prompt',
    });
  });

  it('mutators while unbound do not call autosave', () => {
    const c = new ConversationState();
    c.appendUser('unbound');         // no controller exists
    expect(c.messages).toHaveLength(1);
    // Nothing to assert against; the absence of a throw is the test.
  });

  it('detach() disposes the controller and clears binding fields', () => {
    const c = new ConversationState();
    const a = fakeAutosave();
    c.bindTo(doc, a.controller);
    c.detach();
    expect(c.id).toBeNull();
    expect(c.title).toBe('');
    expect(c.createdAt).toBe(0);
    expect(c.providerId).toBeNull();
    expect(a.disposed).toBe(true);
  });

  it('after detach, mutators stop persisting (in-memory only)', () => {
    const c = new ConversationState();
    const a = fakeAutosave();
    c.bindTo(doc, a.controller);
    c.detach();
    const before = a.writes.length;
    c.appendUser('after detach');
    expect(a.writes.length).toBe(before);
    expect(c.messages[c.messages.length - 1].content).toBe('after detach');
  });

  it('toDocument() throws when unbound', () => {
    const c = new ConversationState();
    expect(() => c.toDocument()).toThrow(/not bound/);
  });
});

describe('ConversationState tool-call extension', () => {
  it('records a tool call with the source message index', () => {
    const c = new ConversationState();
    c.appendUser('hi');
    c.appendAssistant('thinking', 'm1');
    c.appendToolCall({ callId: '1', name: 'a.b', arguments: { x: 1 } });
    expect(c.toolCalls).toEqual([
      { messageIndex: 1, callId: '1', name: 'a.b', arguments: { x: 1 } },
    ]);
  });

  it('records a tool result alongside the call', () => {
    const c = new ConversationState();
    c.appendUser('hi');
    c.appendAssistant('thinking', 'm1');
    c.appendToolCall({ callId: '1', name: 'a.b', arguments: {} });
    c.appendToolResult({ callId: '1', content: 'ok' });
    expect(c.toolResults).toEqual([
      { messageIndex: 1, callId: '1', content: 'ok' },
    ]);
  });

  it('reset() clears tool history alongside messages', () => {
    const c = new ConversationState();
    c.appendUser('hi');
    c.appendAssistant('a', 'm1');
    c.appendToolCall({ callId: '1', name: 'a.b', arguments: {} });
    c.appendToolResult({ callId: '1', content: 'ok' });
    c.reset();
    expect(c.messages).toEqual([]);
    expect(c.toolCalls).toEqual([]);
    expect(c.toolResults).toEqual([]);
  });
});
