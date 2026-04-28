import { describe, it, expect, vi } from 'vitest';
import { graphAssetToState, graphStateToAsset, buildConfigFields } from './bridge';
import type { GraphAsset } from '../asset/types';
import type { GraphDomain, NodeTemplate } from '../domain/types';

function stubDomain(overrides: Partial<GraphDomain> = {}): GraphDomain {
  return {
    id: 'test',
    label: 'Test',
    edgeSemantics: 'oriented',
    useNodePalette: true,
    showMeta: true,
    defaultNodeWidth: 180,
    defaultNodeHeight: 80,
    getTemplates: () => [],
    getTemplatesByCategory: () => new Map(),
    addTemplate: () => {},
    getNodeVisuals: (type) => ({
      label: type,
      borderColor: '#888',
      defaultWidth: 180,
      defaultHeight: 80,
    }),
    addVisuals: () => {},
    resolveLabel: (type) => type,
    ...overrides,
  };
}

describe('graphAssetToState', () => {
  it('converts an empty asset', () => {
    const asset: GraphAsset = {
      id: 'g1', name: 'Test', domain: 'test', version: 1,
      nodes: [], edges: [], metadata: { foo: 'bar' },
    };
    const state = graphAssetToState(asset, stubDomain());
    expect(state.id).toBe('g1');
    expect(state.domainId).toBe('test');
    expect(state.name).toBe('Test');
    expect(state.version).toBe(1);
    expect(state.nodes.size).toBe(0);
    expect(state.edges.size).toBe(0);
    expect(state.metadata).toEqual({ foo: 'bar' });
    expect(state.readonly).toBe(false);
    expect(state.selection.size).toBe(0);
  });

  it('strips node-id prefix from port short ids', () => {
    const asset: GraphAsset = {
      id: 'g1', name: '', domain: 'test', version: 1,
      nodes: [{
        id: 'n1', type: 'math:add', position: { x: 0, y: 0 },
        config: {},
        ports: [
          { id: 'n1_a', label: 'A', direction: 'input', dataType: 'number' },
          { id: 'n1_out', label: 'Out', direction: 'output', dataType: 'number' },
        ],
      }],
      edges: [],
    };
    const state = graphAssetToState(asset, stubDomain());
    const node = state.nodes.get('n1')!;
    expect(node.ports[0].shortId).toBe('a');
    expect(node.ports[1].shortId).toBe('out');
  });

  it('falls back to full port id when no node prefix is present', () => {
    const asset: GraphAsset = {
      id: 'g1', name: '', domain: 'test', version: 1,
      nodes: [{
        id: 'n1', type: 't', position: { x: 0, y: 0 }, config: {},
        ports: [{ id: 'orphan', label: 'O', direction: 'input' }],
      }],
      edges: [],
    };
    const state = graphAssetToState(asset, stubDomain());
    expect(state.nodes.get('n1')!.ports[0].shortId).toBe('orphan');
  });

  it('uses domain.getNodeVisuals for default width/height', () => {
    const asset: GraphAsset = {
      id: 'g1', name: '', domain: 'test', version: 1,
      nodes: [{
        id: 'n1', type: 't', position: { x: 0, y: 0 }, config: {}, ports: [],
      }],
      edges: [],
    };
    const dom = stubDomain({
      getNodeVisuals: () => ({ label: 't', borderColor: '#000', defaultWidth: 240, defaultHeight: 120 }),
    });
    const state = graphAssetToState(asset, dom);
    const node = state.nodes.get('n1')!;
    expect(node.width).toBe(240);
    expect(node.height).toBe(120);
  });

  it('drops edges with missing endpoints and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const asset: GraphAsset = {
      id: 'g1', name: '', domain: 'test', version: 1,
      nodes: [{
        id: 'n1', type: 't', position: { x: 0, y: 0 }, config: {},
        ports: [{ id: 'n1_o', label: 'O', direction: 'output' }],
      }],
      edges: [
        { id: 'e1', sourceNodeId: 'n1', sourcePortId: 'n1_o', targetNodeId: 'missing', targetPortId: 'x' },
      ],
    };
    const state = graphAssetToState(asset, stubDomain());
    expect(state.edges.size).toBe(0);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('graphStateToAsset', () => {
  it('round-trips a non-trivial asset', () => {
    const asset: GraphAsset = {
      id: 'g', name: 'My Graph', domain: 'test', version: 1,
      metadata: { author: 'me' },
      nodes: [
        {
          id: 'n1', type: 'src', position: { x: 10, y: 20 },
          config: { value: 42 },
          ports: [{ id: 'n1_out', label: 'Out', direction: 'output', dataType: 'number' }],
        },
        {
          id: 'n2', type: 'sink', position: { x: 200, y: 30 },
          config: {},
          ports: [{ id: 'n2_in', label: 'In', direction: 'input', dataType: 'number' }],
        },
      ],
      edges: [
        { id: 'e1', sourceNodeId: 'n1', sourcePortId: 'n1_out', targetNodeId: 'n2', targetPortId: 'n2_in' },
      ],
    };
    const state = graphAssetToState(asset, stubDomain());
    const back = graphStateToAsset(state);
    expect(back).toEqual(asset);
  });

  it('re-prefixes short port ids with their node id', () => {
    const asset: GraphAsset = {
      id: 'g', name: '', domain: 'test', version: 1,
      nodes: [{
        id: 'n1', type: 't', position: { x: 0, y: 0 }, config: {},
        ports: [{ id: 'n1_p', label: 'P', direction: 'input' }],
      }],
      edges: [],
    };
    const state = graphAssetToState(asset, stubDomain());
    const back = graphStateToAsset(state);
    expect(back.nodes[0].ports[0].id).toBe('n1_p');
  });
});

describe('buildConfigFields', () => {
  const template: NodeTemplate = {
    type: 'math:add', category: 'Math', label: 'Add',
    ports: [
      { id: 'a', label: 'A', direction: 'input', dataType: 'number' },
      { id: 'b', label: 'B', direction: 'input', dataType: 'number' },
      { id: 'out', label: 'Out', direction: 'output', dataType: 'number' },
    ],
    defaultConfig: { mode: 'int' },
    configSchema: [
      { key: 'mode', label: 'Mode', type: 'select', options: [
        { value: 'int', label: 'Integer' }, { value: 'float', label: 'Float' },
      ] },
    ],
  };

  it('emits manual schema fields', () => {
    const fields = buildConfigFields(template, { mode: 'int' }, new Set());
    expect(fields.find((f) => f.key === 'mode')).toMatchObject({
      key: 'mode', type: 'select', label: 'Mode',
    });
  });

  it('auto-generates fields for input ports with primitive dataTypes', () => {
    const fields = buildConfigFields(template, {}, new Set());
    const a = fields.find((f) => f.key === 'a');
    const b = fields.find((f) => f.key === 'b');
    expect(a).toMatchObject({ key: 'a', type: 'number', label: 'A' });
    expect(b).toMatchObject({ key: 'b', type: 'number', label: 'B' });
  });

  it('marks port fields as disabled when their port is connected', () => {
    const fields = buildConfigFields(template, {}, new Set(['a']));
    const a = fields.find((f) => f.key === 'a');
    expect(a?.disabled).toBe(true);
    const b = fields.find((f) => f.key === 'b');
    expect(b?.disabled).toBe(false);
  });

  it('manual schema wins on key collision with auto port field', () => {
    const collidingTemplate: NodeTemplate = {
      type: 't', category: 'X', label: 'T',
      ports: [{ id: 'a', label: 'A', direction: 'input', dataType: 'number' }],
      defaultConfig: { a: 'manual' },
      configSchema: [{ key: 'a', label: 'A (manual)', type: 'string' }],
    };
    const fields = buildConfigFields(collidingTemplate, { a: 'manual' }, new Set());
    const a = fields.find((f) => f.key === 'a')!;
    expect(a.type).toBe('string');
    expect(a.label).toBe('A (manual)');
  });

  it('skips output ports', () => {
    const fields = buildConfigFields(template, {}, new Set());
    expect(fields.find((f) => f.key === 'out')).toBeUndefined();
  });

  it('skips input ports without a known primitive dataType', () => {
    const t: NodeTemplate = {
      type: 't', category: 'X', label: 'T',
      ports: [{ id: 'evt', label: 'Evt', direction: 'input', dataType: 'event' }],
      defaultConfig: {},
    };
    const fields = buildConfigFields(t, {}, new Set());
    expect(fields).toHaveLength(0);
  });

  it('passes rendererHint through manual schema entries', () => {
    const t: NodeTemplate = {
      type: 't', category: 'X', label: 'T',
      ports: [],
      defaultConfig: { color: '#ff0000' },
      configSchema: [{ key: 'color', label: 'Color', type: 'string', rendererHint: 'color' }],
    };
    const fields = buildConfigFields(t, { color: '#ff0000' }, new Set());
    expect(fields[0].rendererHint).toBe('color');
  });
});
