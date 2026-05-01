import { describe, it, expect } from 'vitest';
import { InstanceRegistry } from './instance-registry.svelte';

describe('InstanceRegistry — document reactivity', () => {
  it('$derived(entry.document.content) re-evaluates after content mutation', () => {
    const reg = new InstanceRegistry();
    const entry = reg.open('a', { content: 'before' });

    const observed = $derived(entry.document.content);
    expect(observed).toBe('before');

    entry.document.content = 'after';
    expect(observed).toBe('after');
  });

  it('$derived re-evaluates for language, filePath, and dirty independently', () => {
    const reg = new InstanceRegistry();
    const entry = reg.open('a', {
      content: '',
      language: 'ts',
      filePath: '/a.ts',
    });

    const lang = $derived(entry.document.language);
    const path = $derived(entry.document.filePath);
    const dirty = $derived(entry.document.dirty);

    expect(lang).toBe('ts');
    expect(path).toBe('/a.ts');
    expect(dirty).toBe(false);

    entry.document.language = 'js';
    entry.document.filePath = '/a.js';
    entry.document.dirty = true;

    expect(lang).toBe('js');
    expect(path).toBe('/a.js');
    expect(dirty).toBe(true);
  });
});
