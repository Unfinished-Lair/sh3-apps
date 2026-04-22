import { describe, it, expect } from 'vitest';
import { registry } from './registry';
import type { SettingsField } from './contributions';

describe('settings registry', () => {
  it('maps every SettingsField type to a component', () => {
    const types: SettingsField['type'][] = [
      'boolean',
      'string',
      'number',
      'number-range',
      'enum',
    ];
    for (const t of types) {
      expect(registry[t], `missing renderer for type ${t}`).toBeDefined();
    }
  });

  it('has no extra keys beyond the SettingsField union', () => {
    const expected = new Set(['boolean', 'string', 'number', 'number-range', 'enum']);
    const actual = new Set(Object.keys(registry));
    expect(actual).toEqual(expected);
  });
});
