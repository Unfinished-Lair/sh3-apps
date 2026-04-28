import { describe, it, expect } from 'vitest';
import {
  makeAddNodeCommand,
  makeRemoveNodeCommand,
  makeMoveNodeCommand,
  makeSetNodeConfigCommand,
  makeAddEdgeCommand,
  makeRemoveEdgeCommand,
  makeRemoveSelectionCommand,
  makeAddManyCommand,
  makeReplaceAssetCommand,
} from './commands';
import { graphAssetToState, graphStateToAsset } from '../state/bridge';
import { createGraphDomain } from '../domain/create';
import type { GraphAsset } from '../asset/types';

const dom = createGraphDomain({ id: 't', label: 't' });

function emptyState() {
  return graphAssetToState({ id: 'g', name: '', domain: 't', version: 1, nodes: [], edges: [] }, dom);
}

describe('add-node command', () => {
  it('apply inserts; revert removes', () => {
    const s = emptyState();
    const cmd = makeAddNodeCommand(s, dom, {
      id: 'n1', type: 't', position: { x: 0, y: 0 }, config: {}, ports: [],
    });
    cmd.apply();
    expect(s.nodes.has('n1')).toBe(true);
    cmd.revert();
    expect(s.nodes.has('n1')).toBe(false);
  });

  it('meta.kind is add-node', () => {
    const s = emptyState();
    const cmd = makeAddNodeCommand(s, dom, {
      id: 'n', type: 't', position: { x: 0, y: 0 }, config: {}, ports: [],
    });
    expect(cmd.meta?.kind).toBe('add-node');
  });
});

describe('remove-node command', () => {
  it('apply removes node and its incident edges; revert restores both', () => {
    const s = graphAssetToState({
      id: 'g', name: '', domain: 't', version: 1,
      nodes: [
        { id: 'n1', type: 't', position: { x: 0, y: 0 }, config: {},
          ports: [{ id: 'n1_o', label: 'O', direction: 'output' }] },
        { id: 'n2', type: 't', position: { x: 0, y: 0 }, config: {},
          ports: [{ id: 'n2_i', label: 'I', direction: 'input' }] },
      ],
      edges: [{ id: 'e1', sourceNodeId: 'n1', sourcePortId: 'n1_o',
                targetNodeId: 'n2', targetPortId: 'n2_i' }],
    }, dom);
    const cmd = makeRemoveNodeCommand(s, dom, 'n1');
    cmd.apply();
    expect(s.nodes.has('n1')).toBe(false);
    expect(s.edges.size).toBe(0);
    cmd.revert();
    expect(s.nodes.has('n1')).toBe(true);
    expect(s.edges.has('e1')).toBe(true);
  });
});

describe('move-node command', () => {
  it('coalesces start/end positions', () => {
    const s = graphAssetToState({
      id: 'g', name: '', domain: 't', version: 1,
      nodes: [{ id: 'n1', type: 't', position: { x: 10, y: 20 }, config: {}, ports: [] }],
      edges: [],
    }, dom);
    s.nodes.get('n1')!.position = { x: 100, y: 200 };
    const cmd = makeMoveNodeCommand(s, 'n1', { x: 10, y: 20 }, { x: 100, y: 200 });
    cmd.revert();
    expect(s.nodes.get('n1')!.position).toEqual({ x: 10, y: 20 });
    cmd.apply();
    expect(s.nodes.get('n1')!.position).toEqual({ x: 100, y: 200 });
  });
});

describe('set-node-config command', () => {
  it('applies and reverts a single key', () => {
    const s = graphAssetToState({
      id: 'g', name: '', domain: 't', version: 1,
      nodes: [{ id: 'n1', type: 't', position: { x: 0, y: 0 }, config: { mode: 'a' }, ports: [] }],
      edges: [],
    }, dom);
    const cmd = makeSetNodeConfigCommand(s, dom, 'n1', ['mode'], 'a', 'b');
    cmd.apply();
    expect(s.nodes.get('n1')!.config.mode).toBe('b');
    cmd.revert();
    expect(s.nodes.get('n1')!.config.mode).toBe('a');
  });

  it('applies and reverts a nested path', () => {
    const s = graphAssetToState({
      id: 'g', name: '', domain: 't', version: 1,
      nodes: [{
        id: 'n1', type: 't', position: { x: 0, y: 0 },
        config: { params: { x: 1 } }, ports: [],
      }],
      edges: [],
    }, dom);
    const cmd = makeSetNodeConfigCommand(s, dom, 'n1', ['params', 'x'], 1, 7);
    cmd.apply();
    expect(((s.nodes.get('n1')!.config as any).params.x)).toBe(7);
    cmd.revert();
    expect(((s.nodes.get('n1')!.config as any).params.x)).toBe(1);
  });
});

describe('add-edge / remove-edge', () => {
  function withNodes() {
    return graphAssetToState({
      id: 'g', name: '', domain: 't', version: 1,
      nodes: [
        { id: 'n1', type: 't', position: { x: 0, y: 0 }, config: {},
          ports: [{ id: 'n1_o', label: 'O', direction: 'output' }] },
        { id: 'n2', type: 't', position: { x: 0, y: 0 }, config: {},
          ports: [{ id: 'n2_i', label: 'I', direction: 'input' }] },
      ],
      edges: [],
    }, dom);
  }

  it('add-edge round-trip', () => {
    const s = withNodes();
    const cmd = makeAddEdgeCommand(s, {
      id: 'e1', sourceNodeId: 'n1', sourcePortId: 'o',
      targetNodeId: 'n2', targetPortId: 'i',
    });
    cmd.apply();
    expect(s.edges.has('e1')).toBe(true);
    cmd.revert();
    expect(s.edges.has('e1')).toBe(false);
  });

  it('remove-edge round-trip', () => {
    const s = withNodes();
    s.edges.set('e1', { id: 'e1', sourceNodeId: 'n1', sourcePortId: 'o',
                        targetNodeId: 'n2', targetPortId: 'i' });
    const cmd = makeRemoveEdgeCommand(s, 'e1');
    cmd.apply();
    expect(s.edges.size).toBe(0);
    cmd.revert();
    expect(s.edges.has('e1')).toBe(true);
  });
});

describe('remove-selection', () => {
  it('removes a mixed set in one shot', () => {
    const s = graphAssetToState({
      id: 'g', name: '', domain: 't', version: 1,
      nodes: [
        { id: 'n1', type: 't', position: { x: 0, y: 0 }, config: {},
          ports: [{ id: 'n1_o', label: 'O', direction: 'output' }] },
        { id: 'n2', type: 't', position: { x: 0, y: 0 }, config: {},
          ports: [{ id: 'n2_i', label: 'I', direction: 'input' }] },
        { id: 'n3', type: 't', position: { x: 0, y: 0 }, config: {}, ports: [] },
      ],
      edges: [{ id: 'e1', sourceNodeId: 'n1', sourcePortId: 'n1_o',
                targetNodeId: 'n2', targetPortId: 'n2_i' }],
    }, dom);
    const cmd = makeRemoveSelectionCommand(s, dom, ['n1', 'e1']);
    cmd.apply();
    expect(s.nodes.has('n1')).toBe(false);
    expect(s.nodes.has('n2')).toBe(true);
    expect(s.edges.size).toBe(0);
    cmd.revert();
    expect(s.nodes.has('n1')).toBe(true);
    expect(s.edges.has('e1')).toBe(true);
  });
});

describe('add-many', () => {
  it('inserts and reverts a batch', () => {
    const s = emptyState();
    const cmd = makeAddManyCommand(s, dom, [
      { id: 'a', type: 't', position: { x: 0, y: 0 }, config: {}, ports: [] },
      { id: 'b', type: 't', position: { x: 0, y: 0 }, config: {}, ports: [] },
    ], []);
    cmd.apply();
    expect(s.nodes.size).toBe(2);
    cmd.revert();
    expect(s.nodes.size).toBe(0);
  });
});

describe('replace-asset', () => {
  it('snapshots the current asset on apply for revert', () => {
    const original: GraphAsset = {
      id: 'g', name: 'A', domain: 't', version: 1,
      nodes: [{ id: 'n1', type: 't', position: { x: 0, y: 0 }, config: {}, ports: [] }],
      edges: [],
    };
    const replacement: GraphAsset = {
      id: 'g', name: 'B', domain: 't', version: 1,
      nodes: [{ id: 'n2', type: 't', position: { x: 0, y: 0 }, config: {}, ports: [] }],
      edges: [],
    };
    const s = graphAssetToState(original, dom);
    const cmd = makeReplaceAssetCommand(s, dom, replacement);
    cmd.apply();
    expect(graphStateToAsset(s).nodes[0].id).toBe('n2');
    cmd.revert();
    expect(graphStateToAsset(s).nodes[0].id).toBe('n1');
  });
});
