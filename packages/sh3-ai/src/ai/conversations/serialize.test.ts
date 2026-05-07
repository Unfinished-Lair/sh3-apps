import { describe, it, expect } from 'vitest';
import { serializeConversation, parseConversation } from './serialize';
import type { ConversationDocument } from './types';

const sample: ConversationDocument = {
  id: 'abc',
  version: 1,
  title: 'fixing the auth bug',
  createdAt: 1_700_000_000_000,
  updatedAt: 1_700_000_500_000,
  providerId: 'gemini',
  model: 'gemini-2.5-flash',
  messages: [
    { role: 'user', content: 'why does login redirect?' },
    { role: 'assistant', content: 'because session cookie expires…', model: 'gemini-2.5-flash' },
  ],
  toolCalls: [
    { messageIndex: 1, callId: 'c1', name: 'sh3-fe.read', arguments: { path: '/app/login.ts' } },
  ],
  toolResults: [
    { messageIndex: 1, callId: 'c1', content: 'export function login() { … }' },
  ],
};

describe('serializeConversation / parseConversation', () => {
  it('round-trips losslessly', () => {
    const json = serializeConversation(sample);
    const parsed = parseConversation(json);
    expect(parsed).toEqual(sample);
  });

  it('produces stable JSON (deterministic key order)', () => {
    expect(serializeConversation(sample)).toBe(serializeConversation(sample));
  });

  it('rejects malformed JSON with a clear error', () => {
    expect(() => parseConversation('{not json')).toThrow(/parse/i);
  });

  it('rejects wrong version with a clear error', () => {
    const wrong = JSON.stringify({ ...sample, version: 99 });
    expect(() => parseConversation(wrong)).toThrow(/version/i);
  });

  it('rejects non-object payloads', () => {
    expect(() => parseConversation('null')).toThrow();
    expect(() => parseConversation('"hi"')).toThrow();
    expect(() => parseConversation('42')).toThrow();
  });

  it('defaults missing optional arrays to empty', () => {
    const partial = JSON.stringify({
      id: 'x', version: 1, title: '', createdAt: 0, updatedAt: 0,
      providerId: null, model: null, messages: [],
      // toolCalls + toolResults omitted
    });
    const parsed = parseConversation(partial);
    expect(parsed.toolCalls).toEqual([]);
    expect(parsed.toolResults).toEqual([]);
  });

  it('rejects when required `id` is missing', () => {
    const broken = JSON.stringify({ ...sample, id: undefined });
    expect(() => parseConversation(broken)).toThrow(/id/);
  });
});
