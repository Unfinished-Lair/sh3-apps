import { describe, it, expect } from 'vitest';
import { InspectorRegistry } from './inspector-registry.svelte';

describe('InspectorRegistry — reactivity', () => {
  it('$derived(registry.get(id)) re-evaluates after close + open', () => {
    const reg = new InspectorRegistry();
    reg.open('a', { value: { n: 1 } });

    const entry = $derived(reg.get('a'));
    expect(entry?.value).toEqual({ n: 1 });

    reg.close('a');
    reg.open('a', { value: { n: 2 } });

    // SvelteMap tracks dependencies: close() + set() invalidate the $derived.
    expect(entry?.value).toEqual({ n: 2 });
  });

  it('$derived falls back to undefined after close with no reopen', () => {
    const reg = new InspectorRegistry();
    reg.open('a', { value: { n: 1 } });

    const entry = $derived(reg.get('a'));
    expect(entry).not.toBeUndefined();

    reg.close('a');
    expect(entry).toBeUndefined();
  });

  it('mutating entry.value re-runs $derived(entry.value)', () => {
    const reg = new InspectorRegistry();
    const entry = reg.open('a', { value: { n: 1 } });

    const observed = $derived(entry.value);
    expect((observed as { n: number }).n).toBe(1);

    entry.value = { n: 2 };
    expect((observed as { n: number }).n).toBe(2);
  });

  it('mutating entry.meta re-runs $derived(entry.meta)', () => {
    const reg = new InspectorRegistry();
    const entry = reg.open('a', { value: {}, meta: { label: 'A' } });

    const observed = $derived(entry.meta);
    expect(observed?.label).toBe('A');

    entry.meta = { label: 'B' };
    expect(observed?.label).toBe('B');
  });

  it('bumpVersion is callable and does not throw on a populated registry', () => {
    // Smoke test: the version counter is a private $state field; the actual
    // reactive behavior is covered end-to-end in the bindInspector tests
    // where replace() calls bumpVersion while $derived consumers observe.
    const reg = new InspectorRegistry();
    reg.open('a', { value: { n: 1 } });
    expect(() => reg.bumpVersion()).not.toThrow();
  });
});
