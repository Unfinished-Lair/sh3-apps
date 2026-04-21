import { describe, it, expect } from 'vitest';
import { ColorPickerRegistry } from './color-picker-registry';

describe('ColorPickerRegistry — reactivity', () => {
  it('$derived(registry.get(id)) re-evaluates after close + open', () => {
    const reg = new ColorPickerRegistry();
    reg.open('a', { value: '#ff0000' });

    const entry = $derived(reg.get('a'));
    expect(entry?.value).toBe('#ff0000');

    reg.close('a');
    reg.open('a', { value: '#00ff00' });

    expect(entry?.value).toBe('#00ff00');
  });

  it('$derived falls back to undefined after close with no reopen', () => {
    const reg = new ColorPickerRegistry();
    reg.open('a', { value: '#ff0000' });

    const entry = $derived(reg.get('a'));
    expect(entry).not.toBeUndefined();

    reg.close('a');
    expect(entry).toBeUndefined();
  });
});
