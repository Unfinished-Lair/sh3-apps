import { describe, it, expect } from 'vitest';
import { createGraphDomain } from './create';
import type { DataTypeDef, ConversionDef } from './types';

describe('createGraphDomain', () => {
  it('applies sane defaults', () => {
    const d = createGraphDomain({ id: 'd', label: 'D' });
    expect(d.id).toBe('d');
    expect(d.label).toBe('D');
    expect(d.edgeSemantics).toBe('oriented');
    expect(d.useNodePalette).toBe(true);
    expect(d.showMeta).toBe(true);
    expect(d.defaultNodeWidth).toBe(180);
    expect(d.defaultNodeHeight).toBe(80);
  });

  it('returns fallback visuals for unknown types', () => {
    const d = createGraphDomain({ id: 'd', label: 'D' });
    const v = d.getNodeVisuals('unknown');
    expect(v.label).toBe('unknown');
    expect(typeof v.borderColor).toBe('string');
  });

  it('upserts templates by type', () => {
    const d = createGraphDomain({ id: 'd', label: 'D' });
    d.addTemplate({ type: 't', category: 'C', label: 'L1', ports: [], defaultConfig: {} });
    d.addTemplate({ type: 't', category: 'C', label: 'L2', ports: [], defaultConfig: {} });
    expect(d.getTemplates()).toHaveLength(1);
    expect(d.getTemplates()[0].label).toBe('L2');
  });

  it('groups templates by category', () => {
    const d = createGraphDomain({
      id: 'd', label: 'D',
      templates: [
        { type: 't1', category: 'A', label: '', ports: [], defaultConfig: {} },
        { type: 't2', category: 'A', label: '', ports: [], defaultConfig: {} },
        { type: 't3', category: 'B', label: '', ports: [], defaultConfig: {} },
      ],
    });
    const grouped = d.getTemplatesByCategory();
    expect(grouped.get('A')).toHaveLength(2);
    expect(grouped.get('B')).toHaveLength(1);
  });

  it('uses configured resolveLabel when provided', () => {
    const d = createGraphDomain({
      id: 'd', label: 'D',
      resolveLabel: (type, cfg) => `${type}:${cfg.x}`,
    });
    expect(d.resolveLabel('t', { x: 42 })).toBe('t:42');
  });

  it('falls back to type when resolveLabel is omitted', () => {
    const d = createGraphDomain({ id: 'd', label: 'D' });
    expect(d.resolveLabel('t', {})).toBe('t');
  });
});

describe('createGraphDomain — new fields', () => {
  it('plumbs dataTypes / conversions / resolveConnect from spec', () => {
    const dataTypes: Record<string, DataTypeDef> = {
      str: { label: 'String', color: '#0ff' },
    };
    const conversions: ConversionDef[] = [
      { id: 'demo:n-to-s', from: 'num', to: 'str', adapt: (v) => String(v) },
    ];
    const d = createGraphDomain({
      id: 'demo', label: 'Demo',
      dataTypes,
      conversions,
      resolveConnect: () => ({ via: 'demo:n-to-s' }),
    });
    expect(d.dataTypes).toBe(dataTypes);
    expect(d.conversions).toBe(conversions);
    expect(d.resolveConnect?.(
      { nodeId: 'a', portId: 'x', direction: 'output', dataType: 'num' },
      { nodeId: 'b', portId: 'y', direction: 'input',  dataType: 'str' },
    )).toEqual({ via: 'demo:n-to-s' });
  });

  it('omits dataTypes / conversions / resolveConnect when spec does not include them', () => {
    const d = createGraphDomain({ id: 'd', label: 'd' });
    expect(d.dataTypes).toBeUndefined();
    expect(d.conversions).toBeUndefined();
    expect(d.resolveConnect).toBeUndefined();
  });
});

describe('createGraphDomain — quick access', () => {
  it('returns defaultQuickAccess as configured', () => {
    const d = createGraphDomain({
      id: 'd', label: 'D',
      templates: [{ type: 'a', category: 'X', label: 'A', ports: [], defaultConfig: {} }],
      defaultQuickAccess: ['a'],
    });
    expect(d.getDefaultQuickAccess()).toEqual(['a']);
  });

  it('returns [] when defaultQuickAccess absent', () => {
    const d = createGraphDomain({ id: 'd', label: 'D' });
    expect(d.getDefaultQuickAccess()).toEqual([]);
  });

  it('hasTemplate returns true only for registered types', () => {
    const d = createGraphDomain({
      id: 'd', label: 'D',
      templates: [{ type: 'a', category: 'X', label: 'A', ports: [], defaultConfig: {} }],
    });
    expect(d.hasTemplate('a')).toBe(true);
    expect(d.hasTemplate('missing')).toBe(false);
  });

  it('allowBlocks defaults to true', () => {
    const d = createGraphDomain({ id: 'd', label: 'D' });
    expect(d.allowBlocks).toBe(true);
  });

  it('allowBlocks honors the spec opt-out', () => {
    const d = createGraphDomain({ id: 'd', label: 'D', allowBlocks: false });
    expect(d.allowBlocks).toBe(false);
  });
});
