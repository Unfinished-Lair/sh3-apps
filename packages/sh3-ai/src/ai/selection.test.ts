import { describe, it, expect } from 'vitest';
import type { AiProvider } from './provider';
import { resolveActiveProvider } from './selection';

function fakeProvider(id: string): AiProvider {
  return {
    id,
    label: id,
    chain: () => [],
    chat: async function* () {},
    isAuthFailure: () => false,
    isReady: () => true,
  };
}

describe('resolveActiveProvider', () => {
  it('returns undefined when list is empty', () => {
    expect(resolveActiveProvider([], null)).toBeUndefined();
    expect(resolveActiveProvider([], 'gemini')).toBeUndefined();
  });

  it('returns the only provider when list has one and no preference', () => {
    const g = fakeProvider('gemini');
    expect(resolveActiveProvider([g], null)).toBe(g);
  });

  it('returns the first registered when no preference and list has many', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(resolveActiveProvider([g, d], null)).toBe(g);
  });

  it('returns the preferred provider when the id is registered', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(resolveActiveProvider([g, d], 'deepseek')).toBe(d);
  });

  it('falls back to first registered when preferred id is not registered', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(resolveActiveProvider([g, d], 'openai')).toBe(g);
  });

  it('falls back to undefined when preferred id is set but list is empty', () => {
    expect(resolveActiveProvider([], 'gemini')).toBeUndefined();
  });
});

import { formatProviderList, decideSwitchAction } from './selection';

describe('formatProviderList', () => {
  it('returns a not-registered message when list is empty', () => {
    expect(formatProviderList([], null)).toBe('ai: no providers registered');
  });

  it('marks the only provider as active when list has one and no preference', () => {
    const g = fakeProvider('gemini');
    expect(formatProviderList([g], null)).toBe('* gemini  (active)');
  });

  it('marks the first registered as active when no preference', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(formatProviderList([g, d], null)).toBe(
      '* gemini  (active)\n  deepseek',
    );
  });

  it('marks the preferred provider as active when registered', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(formatProviderList([g, d], 'deepseek')).toBe(
      '  gemini\n* deepseek  (active)',
    );
  });

  it('falls back to first when preferred id is not registered', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(formatProviderList([g, d], 'openai')).toBe(
      '* gemini  (active)\n  deepseek',
    );
  });
});

describe('decideSwitchAction', () => {
  it('returns no-providers when list is empty', () => {
    expect(decideSwitchAction([], null, 'gemini')).toEqual({
      kind: 'no-providers',
      message: 'ai: no providers registered',
    });
  });

  it('returns unknown when requested id is not registered', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(decideSwitchAction([g, d], 'gemini', 'openai')).toEqual({
      kind: 'unknown',
      message: "ai: 'openai' is not a registered provider; available: gemini, deepseek",
    });
  });

  it('returns already-active when requested id matches the resolved active', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(decideSwitchAction([g, d], 'gemini', 'gemini')).toEqual({
      kind: 'already-active',
      message: 'ai: already on gemini',
    });
  });

  it('returns already-active when no preference is set and target is the implicit active (list[0])', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(decideSwitchAction([g, d], null, 'gemini')).toEqual({
      kind: 'already-active',
      message: 'ai: already on gemini',
    });
  });

  it('returns switched when requested id is a different registered provider', () => {
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(decideSwitchAction([g, d], 'gemini', 'deepseek')).toEqual({
      kind: 'switched',
      newActiveId: 'deepseek',
      message: 'ai: switched to deepseek (conversation reset)',
    });
  });

  it('treats stale preference as already-active when target equals the resolved fallback', () => {
    // preference 'openai' is stale → resolves to gemini; 'gemini' is target → already-active.
    const g = fakeProvider('gemini');
    const d = fakeProvider('deepseek');
    expect(decideSwitchAction([g, d], 'openai', 'gemini')).toEqual({
      kind: 'already-active',
      message: 'ai: already on gemini',
    });
  });
});
