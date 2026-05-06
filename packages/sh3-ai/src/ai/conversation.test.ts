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
