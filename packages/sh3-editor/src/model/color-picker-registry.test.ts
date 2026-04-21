import { describe, it, expect } from 'vitest';
import { ColorPickerRegistry } from './color-picker-registry.svelte';

describe('ColorPickerRegistry', () => {
  it('starts empty', () => {
    const r = new ColorPickerRegistry();
    expect(r.list()).toEqual([]);
    expect(r.get('nope')).toBeUndefined();
    expect(r.has('nope')).toBe(false);
  });

  it('open creates an entry and second open returns the existing one', () => {
    const r = new ColorPickerRegistry();
    const e1 = r.open('a', { value: '#ff0000' });
    expect(e1.value).toBe('#ff0000');
    expect(r.has('a')).toBe(true);

    const e2 = r.open('a', { value: '#00ff00' });
    expect(e2).toBe(e1);
    expect(e2.value).toBe('#ff0000'); // first-open wins
  });

  it('get returns a live reference', () => {
    const r = new ColorPickerRegistry();
    const e = r.open('a', { value: '#ff0000' });
    e.value = '#00ff00';
    expect(r.get('a')?.value).toBe('#00ff00');
  });

  it('normalizes invalid initial values to #000000', () => {
    const r = new ColorPickerRegistry();
    const e = r.open('a', { value: 'not-a-color' });
    expect(e.value).toBe('#000000');
  });

  it('normalizes valid hex to lowercase-with-#', () => {
    const r = new ColorPickerRegistry();
    expect(r.open('a', { value: '#FF0000' }).value).toBe('#ff0000');
    expect(r.open('b', { value: 'abc' }).value).toBe('#aabbcc');
  });

  it('close returns true on first call, false after', () => {
    const r = new ColorPickerRegistry();
    r.open('a', { value: '#ff0000' });
    expect(r.close('a')).toBe(true);
    expect(r.close('a')).toBe(false);
    expect(r.has('a')).toBe(false);
  });

  it('list reflects open/close in insertion order', () => {
    const r = new ColorPickerRegistry();
    r.open('a', { value: '#ff0000' });
    r.open('b', { value: '#00ff00' });
    r.open('c', { value: '#0000ff' });
    expect(r.list()).toEqual(['a', 'b', 'c']);
    r.close('b');
    expect(r.list()).toEqual(['a', 'c']);
  });

  it('clear empties and fires onClose for every entry', () => {
    const closed: string[] = [];
    const r = new ColorPickerRegistry((id) => closed.push(id));
    r.open('a', { value: '#ff0000' });
    r.open('b', { value: '#00ff00' });
    r.clear();
    expect(r.list()).toEqual([]);
    expect(closed.sort()).toEqual(['a', 'b']);
  });

  it('close fires onClose when an entry existed', () => {
    const closed: string[] = [];
    const r = new ColorPickerRegistry((id) => closed.push(id));
    r.open('a', { value: '#ff0000' });
    r.close('a');
    expect(closed).toEqual(['a']);
  });

  it('close does not fire onClose when no entry existed', () => {
    const closed: string[] = [];
    const r = new ColorPickerRegistry((id) => closed.push(id));
    r.close('ghost');
    expect(closed).toEqual([]);
  });
});
