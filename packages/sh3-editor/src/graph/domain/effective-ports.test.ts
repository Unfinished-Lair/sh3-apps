import { describe, it, expect } from 'vitest';
import { effectivePorts } from './effective-ports';
import type { NodeTemplate } from './types';
import type { GraphAssetPort } from '../asset/types';

function ports(...names: string[]): GraphAssetPort[] {
  return names.map((id) => ({ id, direction: 'output', dataType: 'unknown', label: id }));
}

describe('effectivePorts', () => {
  it('returns static ports when computePorts is absent', () => {
    const tmpl: NodeTemplate = {
      type: 't', category: 'c', label: 't',
      ports: ports('a', 'b'),
      defaultConfig: {},
    };
    expect(effectivePorts(tmpl, {})).toEqual(ports('a', 'b'));
  });

  it('returns computePorts(config) when present', () => {
    const tmpl: NodeTemplate = {
      type: 't', category: 'c', label: 't',
      ports: ports('a'),
      defaultConfig: {},
      computePorts: (c) => {
        const keys = Array.isArray(c.keys) ? (c.keys as string[]) : [];
        return ports('a', ...keys);
      },
    };
    expect(effectivePorts(tmpl, { keys: ['x', 'y'] })).toEqual(ports('a', 'x', 'y'));
  });

  it('falls back to static ports when config is null/undefined', () => {
    const tmpl: NodeTemplate = {
      type: 't', category: 'c', label: 't',
      ports: ports('a'),
      defaultConfig: {},
      computePorts: () => ports('b'),
    };
    expect(effectivePorts(tmpl, null)).toEqual(ports('a'));
    expect(effectivePorts(tmpl, undefined)).toEqual(ports('a'));
  });
});
