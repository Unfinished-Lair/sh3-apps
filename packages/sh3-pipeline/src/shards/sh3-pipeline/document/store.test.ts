import { describe, it, expect } from 'vitest';
import { applyPrefetchSuffixFixup } from './store';
import type { PipelineDocument } from './format';

function docWith(...nodes: Array<{ id: string; type: string; config?: Record<string, unknown> }>): PipelineDocument {
  return {
    version: 1,
    domainId: 'sh3-pipeline',
    interface: { inputs: [], outputs: [] },
    asset: {
      id: 'graph', name: '', domain: 'sh3-pipeline', version: 1,
      nodes: nodes.map(n => ({
        id: n.id, type: n.type, position: { x: 0, y: 0 },
        config: n.config ?? {}, ports: [],
      })),
      edges: [],
    },
  };
}

describe('applyPrefetchSuffixFixup', () => {
  it('strips :prefetch suffix and forces config.mode=prefetch', () => {
    const doc = docWith({ id: 'n1', type: 'verb:s:list:prefetch' });
    applyPrefetchSuffixFixup(doc);
    expect(doc.asset.nodes[0].type).toBe('verb:s:list');
    expect(doc.asset.nodes[0].config?.mode).toBe('prefetch');
  });

  it('leaves base-type nodes untouched', () => {
    const doc = docWith({ id: 'n1', type: 'verb:s:list', config: { mode: 'runtime' } });
    applyPrefetchSuffixFixup(doc);
    expect(doc.asset.nodes[0].type).toBe('verb:s:list');
    expect(doc.asset.nodes[0].config?.mode).toBe('runtime');
  });

  it('is idempotent on already-normalized docs', () => {
    const doc = docWith({ id: 'n1', type: 'verb:s:list', config: { mode: 'prefetch' } });
    const before = JSON.stringify(doc);
    applyPrefetchSuffixFixup(doc);
    expect(JSON.stringify(doc)).toBe(before);
  });
});
