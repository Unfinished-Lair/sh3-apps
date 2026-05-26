import { describe, it, expect } from 'vitest';
import type { DataTypeDef, ConversionDef, GraphDomain } from '../domain/types';
import type { GraphAssetEdge } from '../asset/types';

describe('graph type surface — new fields', () => {
  it('DataTypeDef has label + color, optional description', () => {
    const t: DataTypeDef = { label: 'X', color: '#fff' };
    const t2: DataTypeDef = { label: 'X', color: '#fff', description: 'd' };
    expect(t.color).toBe('#fff');
    expect(t2.description).toBe('d');
  });

  it('ConversionDef carries id/from/to/adapt', () => {
    const c: ConversionDef = { id: 'a:b', from: 'a', to: 'b', adapt: (v) => v };
    expect(c.adapt(42)).toBe(42);
  });

  it('GraphDomain accepts optional dataTypes / conversions / resolveConnect', () => {
    const partial: Pick<GraphDomain, 'dataTypes' | 'conversions' | 'resolveConnect'> = {
      dataTypes: { x: { label: 'X', color: '#fff' } },
      conversions: [{ id: 'a:b', from: 'a', to: 'b', adapt: (v) => v }],
      resolveConnect: () => false,
    };
    expect(partial.dataTypes?.x?.color).toBe('#fff');
  });

  it('GraphAssetEdge has optional adapter', () => {
    const e: GraphAssetEdge = {
      id: 'e1', sourceNodeId: 'n1', sourcePortId: 'a',
      targetNodeId: 'n2', targetPortId: 'b', adapter: 'a:b',
    };
    expect(e.adapter).toBe('a:b');
  });
});
