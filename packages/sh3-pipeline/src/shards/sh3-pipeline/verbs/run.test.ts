import { describe, it, expect } from 'vitest';
import type { GraphAsset } from '@unfinished-lair/sh3-editor/graph/types';
import { runPipelineDocument } from './run';
import { structuralHandlers } from '../runtime/handlers/structural';
import { DOMAIN_ID, PIPELINE_DOC_VERSION, type PipelineDocument } from '../document/format';
import type { NodeHandler, HandlerRegistry } from '../runtime/handlers';

function emptyAsset(): GraphAsset {
  return { id: 'g', name: '', domain: DOMAIN_ID, version: 1, nodes: [], edges: [] };
}

function makePassthroughDoc(name: string): PipelineDocument {
  return {
    version: PIPELINE_DOC_VERSION,
    domainId: DOMAIN_ID,
    interface: {
      inputs:  [{ name, dataType: 'string' }],
      outputs: [{ name, dataType: 'string' }],
    },
    asset: {
      ...emptyAsset(),
      nodes: [
        {
          id: 's',
          type: 'start',
          config: { params: [{ name, dataType: 'string' }] },
          position: { x: 0, y: 0 },
          ports: [
            { id: 's_control', label: 'control', direction: 'output', dataType: 'control' },
            { id: `s_${name}`, label: name, direction: 'output', dataType: 'string' },
          ],
        },
        {
          id: 'e',
          type: 'end',
          config: { returns: [{ name, dataType: 'string' }] },
          position: { x: 0, y: 0 },
          ports: [
            { id: 'e_control', label: 'control', direction: 'input', dataType: 'control' },
            { id: `e_${name}`, label: name, direction: 'input', dataType: 'string' },
          ],
        },
      ],
      edges: [
        { id: 'edge-ctrl', sourceNodeId: 's', sourcePortId: 's_control',     targetNodeId: 'e', targetPortId: 'e_control' },
        { id: 'edge-data', sourceNodeId: 's', sourcePortId: `s_${name}`,     targetNodeId: 'e', targetPortId: `e_${name}` },
      ],
    },
  };
}

const handlers: HandlerRegistry = {
  exact: structuralHandlers.exact,
  prefixed: structuralHandlers.prefixed,
};

describe('runPipelineDocument — passthrough', () => {
  it('passes inputs through start, mirrors them at end', async () => {
    const doc = makePassthroughDoc('topic');
    const result = await runPipelineDocument({
      doc,
      docId: 'sh3-pipeline:test.pipeline.json',
      tenant: 't',
      inputs: { topic: 'cats' },
      signal: new AbortController().signal,
      log: () => {},
      invokeVerb: async () => ({ result: undefined, scrollback: [] }),
      loadSubGraph: async () => doc,
      handlers,
    });
    expect(result.outputs).toEqual({ topic: 'cats' });
  });
});

describe('runPipelineDocument — sub-graph fork', () => {
  it('runs the child in a fresh vars Map; parent vars are isolated', async () => {
    const child = makePassthroughDoc('echo');

    // Custom handler that calls ctx.runSubGraph during the parent run.
    const subGraphCaller: NodeHandler = async (ctx) => {
      ctx.vars.set('parent-only', 'PARENT');
      const childResult = await ctx.runSubGraph('sh3-pipeline:child.pipeline.json', { echo: 'kitten' });
      ctx.vars.set('child-saw-parent', 'parent-only' in Object.fromEntries(ctx.vars));
      return {
        outputs: { childEcho: childResult.outputs.echo },
        next: 'control-out',
      };
    };

    const parent: PipelineDocument = {
      version: PIPELINE_DOC_VERSION,
      domainId: DOMAIN_ID,
      interface: { inputs: [], outputs: [{ name: 'final', dataType: 'string' }] },
      asset: {
        ...emptyAsset(),
        nodes: [
          { id: 's',  type: 'start',          config: { params: [] }, position: { x: 0, y: 0 }, ports: [
            { id: 's_control', label: 'control', direction: 'output', dataType: 'control' },
          ] },
          { id: 'sg', type: 'fake:sub',       config: {},             position: { x: 0, y: 0 }, ports: [
            { id: 'sg_control-in',  label: 'control', direction: 'input',  dataType: 'control' },
            { id: 'sg_control-out', label: 'control', direction: 'output', dataType: 'control' },
            { id: 'sg_childEcho',   label: 'echo',    direction: 'output', dataType: 'string'  },
          ] },
          { id: 'e',  type: 'end',            config: { returns: [{ name: 'final', dataType: 'string' }] }, position: { x: 0, y: 0 }, ports: [
            { id: 'e_control', label: 'control', direction: 'input', dataType: 'control' },
            { id: 'e_final',   label: 'final',   direction: 'input', dataType: 'string'  },
          ] },
        ],
        edges: [
          { id: 'e1', sourceNodeId: 's',  sourcePortId: 's_control',     targetNodeId: 'sg', targetPortId: 'sg_control-in'  },
          { id: 'e2', sourceNodeId: 'sg', sourcePortId: 'sg_control-out', targetNodeId: 'e',  targetPortId: 'e_control'      },
          { id: 'e3', sourceNodeId: 'sg', sourcePortId: 'sg_childEcho',   targetNodeId: 'e',  targetPortId: 'e_final'        },
        ],
      },
    };

    const customHandlers: HandlerRegistry = {
      exact: new Map(structuralHandlers.exact),
      prefixed: [{ prefix: 'fake:', handler: subGraphCaller }],
    };

    let observedChildVarsSize = -1;
    const result = await runPipelineDocument({
      doc: parent,
      docId: 'sh3-pipeline:parent.pipeline.json',
      tenant: 't',
      inputs: {},
      signal: new AbortController().signal,
      log: () => {},
      invokeVerb: async () => ({ result: undefined, scrollback: [] }),
      loadSubGraph: async () => child,
      handlers: customHandlers,
      onChildContextCreated: (childCtx) => {
        observedChildVarsSize = childCtx.vars.size;
      },
    });

    expect(observedChildVarsSize).toBe(0);
    expect(result.outputs.final).toBe('kitten');
  });
});
