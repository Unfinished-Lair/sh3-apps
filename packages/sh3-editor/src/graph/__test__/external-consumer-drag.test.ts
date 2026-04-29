import { describe, it, expect } from 'vitest';
import { graphAssetToState } from '../state/bridge';
import { createGraphDomain } from '../domain/create';
import { makeMoveNodeCommand } from '../history/commands';
import type { GraphAsset } from '../asset/types';

describe('graph external-consumer drag reactivity', () => {
  it('move-node command produces a fresh node identity in nodes map', () => {
    const dom = createGraphDomain({
      id: 'd', label: 'D',
      templates: [{
        type: 'box', category: 'A', label: 'Box',
        ports: [], defaultConfig: {},
      }],
    });
    const initial: GraphAsset = {
      id: 'g', name: 'g', domain: 'd', version: 1,
      nodes: [{ id: 'n1', type: 'box', position: { x: 0, y: 0 }, config: {}, ports: [] }],
      edges: [],
    };
    const state = graphAssetToState(initial, dom);
    const before = state.nodes.get('n1')!;

    const cmd = makeMoveNodeCommand(state, 'n1', { x: 0, y: 0 }, { x: 50, y: 25 });
    cmd.apply();

    const after = state.nodes.get('n1')!;
    // Whole-value replacement contract: new object identity, new position values.
    expect(after).not.toBe(before);
    expect(after.position).toEqual({ x: 50, y: 25 });
    // Other fields preserved.
    expect(after.id).toBe(before.id);
    expect(after.type).toBe(before.type);
    expect(after.ports).toBe(before.ports);
  });

  it('undo restores a fresh-identity node with the original position', () => {
    const dom = createGraphDomain({
      id: 'd', label: 'D',
      templates: [{ type: 'box', category: 'A', label: 'Box', ports: [], defaultConfig: {} }],
    });
    const initial: GraphAsset = {
      id: 'g', name: 'g', domain: 'd', version: 1,
      nodes: [{ id: 'n1', type: 'box', position: { x: 10, y: 10 }, config: {}, ports: [] }],
      edges: [],
    };
    const state = graphAssetToState(initial, dom);

    const cmd = makeMoveNodeCommand(state, 'n1', { x: 10, y: 10 }, { x: 99, y: 99 });
    cmd.apply();
    expect(state.nodes.get('n1')!.position).toEqual({ x: 99, y: 99 });
    cmd.revert();
    expect(state.nodes.get('n1')!.position).toEqual({ x: 10, y: 10 });
  });

  it('SvelteMap-typed nodes is iterable and size-aware after mutation', () => {
    const dom = createGraphDomain({
      id: 'd', label: 'D',
      templates: [{ type: 'box', category: 'A', label: 'Box', ports: [], defaultConfig: {} }],
    });
    const initial: GraphAsset = {
      id: 'g', name: 'g', domain: 'd', version: 1,
      nodes: [
        { id: 'n1', type: 'box', position: { x: 0, y: 0 }, config: {}, ports: [] },
        { id: 'n2', type: 'box', position: { x: 0, y: 0 }, config: {}, ports: [] },
      ],
      edges: [],
    };
    const state = graphAssetToState(initial, dom);
    expect(state.nodes.size).toBe(2);
    state.nodes.delete('n1');
    expect(state.nodes.size).toBe(1);
    expect(Array.from(state.nodes.keys())).toEqual(['n2']);
  });
});
