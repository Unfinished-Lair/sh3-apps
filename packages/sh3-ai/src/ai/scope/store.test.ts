import { describe, it, expect } from 'vitest';
import { makeScopeLookup, addUserScope, removeUserScope } from './store';
import { SCOPE_NONE, SCOPE_READ_ONLY } from './builtins';
import type { Scope } from './types';

describe('makeScopeLookup', () => {
  it('returns built-in scopes by id', () => {
    const lookup = makeScopeLookup({});
    expect(lookup('sh3-ai:none')).toBe(SCOPE_NONE);
    expect(lookup('sh3-ai:read-only')).toBe(SCOPE_READ_ONLY);
  });

  it('returns user scopes by id', () => {
    const u: Scope = { id: 'u:x', label: 'X', whitelist: [], blacklist: [] };
    const lookup = makeScopeLookup({ 'u:x': u });
    expect(lookup('u:x')).toBe(u);
  });

  it('returns undefined for unknown id', () => {
    const lookup = makeScopeLookup({});
    expect(lookup('nope')).toBeUndefined();
  });

  it('built-ins win when a user tries to shadow a builtin id', () => {
    const fake: Scope = { id: 'sh3-ai:none', label: 'fake', whitelist: ['*'], blacklist: [] };
    const lookup = makeScopeLookup({ 'sh3-ai:none': fake });
    expect(lookup('sh3-ai:none')).toBe(SCOPE_NONE);
  });
});

describe('addUserScope', () => {
  it('rejects ids in BUILTIN_SCOPE_IDS', () => {
    const u: Scope = { id: 'sh3-ai:none', label: 'x', whitelist: [], blacklist: [] };
    expect(() => addUserScope({}, u)).toThrow(/built-in/i);
  });

  it('inserts a fresh user scope', () => {
    const next = addUserScope({}, { id: 'a', label: 'A', whitelist: [], blacklist: [] });
    expect(next.a.id).toBe('a');
  });

  it('replaces an existing user scope with the same id', () => {
    const initial = { a: { id: 'a', label: 'old', whitelist: [], blacklist: [] } } as const;
    const next = addUserScope(initial, { id: 'a', label: 'new', whitelist: [], blacklist: [] });
    expect(next.a.label).toBe('new');
  });
});

describe('removeUserScope', () => {
  it('rejects built-in ids', () => {
    expect(() => removeUserScope({}, 'sh3-ai:none')).toThrow(/built-in/i);
  });

  it('returns the same object when the id is unknown', () => {
    const initial = { a: { id: 'a', label: 'A', whitelist: [], blacklist: [] } };
    expect(removeUserScope(initial, 'b')).toBe(initial);
  });

  it('removes the user scope by id', () => {
    const initial = {
      a: { id: 'a', label: 'A', whitelist: [], blacklist: [] },
      b: { id: 'b', label: 'B', whitelist: [], blacklist: [] },
    };
    const next = removeUserScope(initial, 'a');
    expect(next.a).toBeUndefined();
    expect(next.b).toBeDefined();
  });
});
