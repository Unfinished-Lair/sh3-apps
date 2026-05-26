import { describe, it, expect } from 'vitest';
import type { GraphDomain, PortRef } from '../domain/types';
import { decideConnect } from './connect-resolution';

const SRC: PortRef = { nodeId: 'a', portId: 'out', direction: 'output', dataType: 'num' };
const TGT: PortRef = { nodeId: 'b', portId: 'in',  direction: 'input',  dataType: 'str' };

function dom(extra: Partial<GraphDomain>): GraphDomain {
  return {
    id: 'd', label: 'd', edgeSemantics: 'oriented', useNodePalette: true, showMeta: true,
    defaultNodeWidth: 100, defaultNodeHeight: 60,
    getTemplates: () => [], getTemplatesByCategory: () => new Map(), addTemplate: () => {},
    getNodeVisuals: () => ({ label: '', borderColor: '#000' }), addVisuals: () => {},
    resolveLabel: () => '',
    ...extra,
  };
}

describe('decideConnect', () => {
  it('accepts by default when no resolver/canConnect', () => {
    expect(decideConnect(dom({}), SRC, TGT)).toEqual({ kind: 'accept' });
  });

  it('uses canConnect when only canConnect present', () => {
    const d = dom({ canConnect: () => false });
    expect(decideConnect(d, SRC, TGT)).toEqual({ kind: 'reject' });
  });

  it('resolveConnect overrides canConnect', () => {
    const d = dom({
      canConnect: () => true,
      resolveConnect: () => false,
    });
    expect(decideConnect(d, SRC, TGT)).toEqual({ kind: 'reject' });
  });

  it('resolveConnect → true: accept without adapter', () => {
    const d = dom({ resolveConnect: () => true });
    expect(decideConnect(d, SRC, TGT)).toEqual({ kind: 'accept' });
  });

  it('resolveConnect → { via }: accept with adapter', () => {
    const d = dom({ resolveConnect: () => ({ via: 'demo:n-to-s' }) });
    expect(decideConnect(d, SRC, TGT)).toEqual({ kind: 'accept', adapter: 'demo:n-to-s' });
  });
});
