import { describe, it, expect } from 'vitest';
import type { GraphDomain, NodeVisuals } from '../domain/types';
import { resolvePortColor } from './port-color';

function makeDomain(extra: Partial<GraphDomain>): GraphDomain {
  return {
    id: 'd', label: 'd', edgeSemantics: 'oriented', useNodePalette: true,
    showMeta: true, defaultNodeWidth: 100, defaultNodeHeight: 60,
    getTemplates: () => [], getTemplatesByCategory: () => new Map(),
    addTemplate: () => {},
    getNodeVisuals: () => ({ label: '', borderColor: '#000' }),
    addVisuals: () => {},
    resolveLabel: () => '',
    ...extra,
  };
}

describe('resolvePortColor', () => {
  it('returns null when dataType is undefined', () => {
    const d = makeDomain({});
    expect(resolvePortColor(d, { label: '', borderColor: '#000' }, undefined)).toBeNull();
  });

  it('prefers domain.dataTypes color', () => {
    const d = makeDomain({ dataTypes: { run: { label: 'R', color: '#ccc' } } });
    const v: NodeVisuals = { label: '', borderColor: '#000', portColors: { run: '#fff' } };
    expect(resolvePortColor(d, v, 'run')).toBe('#ccc');
  });

  it('falls back to visuals.portColors when domain has no entry', () => {
    const d = makeDomain({});
    const v: NodeVisuals = { label: '', borderColor: '#000', portColors: { run: '#fff' } };
    expect(resolvePortColor(d, v, 'run')).toBe('#fff');
  });

  it('returns null when neither domain nor visuals declare the type', () => {
    const d = makeDomain({});
    expect(resolvePortColor(d, { label: '', borderColor: '#000' }, 'unknown-type')).toBeNull();
  });
});
