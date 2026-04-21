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
});
