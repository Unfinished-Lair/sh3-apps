import { describe, it, expect } from 'vitest';
import { selectBindingSource } from './select-binding';
import type { ColorPanelDescriptor } from './contributions';

const desc = (slotId: string, initial = '#abcdef'): ColorPanelDescriptor => ({
  slotId,
  initial,
  onChange: () => {},
});

describe('selectBindingSource', () => {
  it('returns entry mode when the registry has an entry, ignoring descriptors and adhoc', () => {
    const result = selectBindingSource('s1', { value: '#123456' }, [desc('s1')], { value: '#000000' });
    expect(result.kind).toBe('entry');
    if (result.kind === 'entry') expect(result.entry.value).toBe('#123456');
  });

  it('returns descriptor mode when no entry exists and a matching descriptor is registered', () => {
    const d = desc('s1', '#abcdef');
    const result = selectBindingSource('s1', undefined, [d], { value: '#000000' });
    expect(result.kind).toBe('descriptor');
    if (result.kind === 'descriptor') expect(result.descriptor).toBe(d);
  });

  it('returns the FIRST matching descriptor when multiple share the same slotId', () => {
    const d1 = desc('s1', '#aaaaaa');
    const d2 = desc('s1', '#bbbbbb');
    const result = selectBindingSource('s1', undefined, [d1, d2], undefined);
    if (result.kind === 'descriptor') expect(result.descriptor).toBe(d1);
  });

  it('skips descriptors with non-matching slotId', () => {
    const d = desc('other');
    const result = selectBindingSource('s1', undefined, [d], { value: '#abc123' });
    expect(result.kind).toBe('adhoc');
    if (result.kind === 'adhoc') expect(result.adHocValue).toBe('#abc123');
  });

  it('returns adhoc mode when no entry and no descriptor matches', () => {
    const result = selectBindingSource('s1', undefined, [], { value: '#abc123', readonly: true });
    expect(result.kind).toBe('adhoc');
    if (result.kind === 'adhoc') {
      expect(result.adHocValue).toBe('#abc123');
      expect(result.adHocReadonly).toBe(true);
    }
  });

  it('returns adhoc with undefined value when meta is omitted', () => {
    const result = selectBindingSource('s1', undefined, [], undefined);
    expect(result.kind).toBe('adhoc');
    if (result.kind === 'adhoc') {
      expect(result.adHocValue).toBeUndefined();
      expect(result.adHocReadonly).toBe(false);
    }
  });
});
