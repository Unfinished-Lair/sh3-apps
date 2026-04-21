import { describe, it, expect } from 'vitest';
import { InspectorRegistry } from './inspector-registry.svelte';

describe('InspectorRegistry', () => {
  it('open stores value/meta/options under id', () => {
    const reg = new InspectorRegistry();
    const value = { x: 1 };
    const meta = { label: 'V' };
    reg.open('a', { value, meta });
    const entry = reg.get('a');
    expect(entry?.value).toBe(value);
    expect(entry?.meta).toBe(meta);
  });

  it('open is a no-op when id already exists (returns existing)', () => {
    const reg = new InspectorRegistry();
    const first = { x: 1 };
    reg.open('a', { value: first });
    reg.open('a', { value: { x: 2 } });
    expect(reg.get('a')?.value).toBe(first);
  });

  it('close deletes and fires onClose', () => {
    const closed: string[] = [];
    const reg = new InspectorRegistry((id) => closed.push(id));
    reg.open('a', { value: {} });
    reg.close('a');
    expect(reg.get('a')).toBeUndefined();
    expect(closed).toEqual(['a']);
  });

  it('close on missing id returns false, does not fire onClose', () => {
    const closed: string[] = [];
    const reg = new InspectorRegistry((id) => closed.push(id));
    expect(reg.close('nope')).toBe(false);
    expect(closed).toEqual([]);
  });

  it('list enumerates open instance ids', () => {
    const reg = new InspectorRegistry();
    reg.open('a', { value: {} });
    reg.open('b', { value: {} });
    expect(reg.list().sort()).toEqual(['a', 'b']);
  });

  it('clear fires onClose for every id', () => {
    const closed: string[] = [];
    const reg = new InspectorRegistry((id) => closed.push(id));
    reg.open('a', { value: {} });
    reg.open('b', { value: {} });
    reg.clear();
    expect(closed.sort()).toEqual(['a', 'b']);
    expect(reg.list()).toEqual([]);
  });
});
