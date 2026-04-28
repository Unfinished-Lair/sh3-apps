import { describe, it, expect } from 'vitest';
import { createGraphController } from './controller';
import { graphAssetToState } from '../state/bridge';
import { createGraphDomain } from '../domain/create';
import type { GraphAsset } from '../asset/types';

const dom = createGraphDomain({ id: 't', label: 't' });

function makeState() {
  return graphAssetToState({
    id: 'g', name: 'g', domain: 't', version: 1,
    nodes: [
      { id: 'n1', type: 't', position: { x: 0, y: 0 }, config: { x: 1 }, ports: [] },
      { id: 'n2', type: 't', position: { x: 0, y: 0 }, config: { x: 2 }, ports: [] },
    ],
    edges: [],
  }, dom);
}

describe('GraphController', () => {
  it('exposes setAsset / getAsset round-trip without echo', () => {
    const state = makeState();
    let onChangeCalls = 0;
    const ctrl = createGraphController(state, dom, undefined, () => onChangeCalls++);
    const next: GraphAsset = {
      id: 'g', name: 'b', domain: 't', version: 1,
      nodes: [{ id: 'n3', type: 't', position: { x: 0, y: 0 }, config: {}, ports: [] }],
      edges: [],
    };
    ctrl.setAsset(next);
    expect(state.nodes.has('n3')).toBe(true);
    expect(onChangeCalls).toBe(0); // no echo on setAsset
    expect(ctrl.getAsset().nodes[0].id).toBe('n3');
  });

  it('select / clearSelection + onSelectionChange', () => {
    const state = makeState();
    const ctrl = createGraphController(state, dom, undefined, () => {});
    const heard: string[][] = [];
    ctrl.onSelectionChange((s) => heard.push(s as string[]));
    ctrl.select(['n1', 'n2']);
    ctrl.clearSelection();
    expect(heard).toEqual([['n1', 'n2'], []]);
  });

  it('getSelectedInspectorBinding null on empty / multi / edge selection', () => {
    const state = makeState();
    const ctrl = createGraphController(state, dom, undefined, () => {});
    expect(ctrl.getSelectedInspectorBinding()).toBeNull();
    ctrl.select(['n1', 'n2']);
    expect(ctrl.getSelectedInspectorBinding()).toBeNull();
    ctrl.select(['n1']);
    const b = ctrl.getSelectedInspectorBinding();
    expect(b).not.toBeNull();
    expect(b!.value).toEqual({ x: 1 });
  });
});
