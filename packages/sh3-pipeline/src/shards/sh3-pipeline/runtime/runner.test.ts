import { describe, it, expect } from 'vitest';
import type { ConversionDef } from '@unfinished-lair/sh3-editor/graph/types';
import { runGraph, type RunnerGraph } from './runner';
import { createRunContext } from './context';
import { structuralHandlers } from './handlers/structural';
import type { RunContext, RunLogEntry } from '../domain/types';
import type { NodeHandler, HandlerRegistry } from './handlers';

function makeCtx(overrides: Partial<Parameters<typeof createRunContext>[0]> = {}): RunContext {
  return createRunContext({
    docId: 'test',
    tenant: 't',
    inputs: {},
    signal: new AbortController().signal,
    log: () => {},
    invokeVerb: async () => ({ result: undefined, scrollback: [] }),
    runSubGraph: async () => ({ outputs: {} }),
    writeDocument: async () => {},
    ...overrides,
  });
}

const handlers = {
  exact: structuralHandlers.exact,
  prefixed: structuralHandlers.prefixed,
};

describe('runGraph — minimal linear run', () => {
  it('seeds inputs at start, runs literal → setVar → end, returns end outputs', async () => {
    const graph: RunnerGraph = {
      nodes: [
        { id: 's',  type: 'start',          config: { params: [{ name: 'topic', dataType: 'string' }] } },
        { id: 'l',  type: 'literal.string', config: { value: 'mapped' } },
        { id: 'sv', type: 'setVar',         config: { key: 'k' } },
        { id: 'e',  type: 'end',            config: { returns: [{ name: 'topic', dataType: 'string' }] } },
      ],
      edges: [
        { from: { node: 's',  port: 'run'     }, to: { node: 'sv', port: 'run-in' } },
        { from: { node: 'l',  port: 'value'   }, to: { node: 'sv', port: 'value'  } },
        { from: { node: 's',  port: 'topic'   }, to: { node: 'e',  port: 'topic'  } },
        { from: { node: 'sv', port: 'run-out' }, to: { node: 'e',  port: 'run'    } },
      ],
    };

    const ctx = makeCtx({ inputs: { topic: 'hello' } });
    const result = await runGraph({ graph, ctx, handlers });
    expect(result.outputs).toEqual({ topic: 'hello' });
    expect(ctx.vars.get('k')).toBe('mapped');
  });
});

describe('runGraph — branch', () => {
  it('follows the then path when cond is true', async () => {
    const graph: RunnerGraph = {
      nodes: [
        { id: 's',   type: 'start',          config: { params: [{ name: 'flag', dataType: 'boolean' }] } },
        { id: 'b',   type: 'branch',         config: {} },
        { id: 'ok',  type: 'literal.string', config: { value: 'OK' } },
        { id: 'e',   type: 'end',            config: { returns: [{ name: 'result', dataType: 'string' }] } },
      ],
      edges: [
        { from: { node: 's',  port: 'run'   }, to: { node: 'b', port: 'run'    } },
        { from: { node: 's',  port: 'flag'  }, to: { node: 'b', port: 'cond'   } },
        { from: { node: 'b',  port: 'then'  }, to: { node: 'e', port: 'run'    } },
        { from: { node: 'b',  port: 'else'  }, to: { node: 'e', port: 'run'    } },
        { from: { node: 'ok', port: 'value' }, to: { node: 'e', port: 'result' } },
      ],
    };
    const result = await runGraph({
      graph,
      ctx: makeCtx({ inputs: { flag: true } }),
      handlers,
    });
    expect(result.outputs.result).toBe('OK');
  });
});

describe('runGraph — no end node', () => {
  it('resolves with empty outputs and warns', async () => {
    const warns: string[] = [];
    const graph: RunnerGraph = {
      nodes: [{ id: 's', type: 'start', config: { params: [] } }],
      edges: [],
    };
    const ctx = makeCtx({
      log: (e) => { if (e.level === 'warn') warns.push(e.message); },
    });
    const result = await runGraph({ graph, ctx, handlers });
    expect(result.outputs).toEqual({});
    expect(warns.some((m) => /dead-end|no end/i.test(m))).toBe(true);
  });
});

describe('runGraph — missing start', () => {
  it('throws', async () => {
    const graph: RunnerGraph = {
      nodes: [{ id: 'e', type: 'end', config: { returns: [] } }],
      edges: [],
    };
    await expect(
      runGraph({ graph, ctx: makeCtx(), handlers }),
    ).rejects.toThrow(/start/i);
  });
});

describe('runGraph — edge adapter', () => {
  it('applies edge adapter when reading upstream output', async () => {
    const conversions: ConversionDef[] = [
      { id: 'pipeline:number-to-string', from: 'number', to: 'string', adapt: (v) => String(v) },
    ];

    let captured: unknown = null;
    const captureHandler: NodeHandler = async (_ctx, inv) => {
      captured = inv.inputs.value;
      return { outputs: {}, next: 'run-out' };
    };

    const customHandlers: HandlerRegistry = {
      exact: new Map([
        ...structuralHandlers.exact,
        ['__capture__', captureHandler],
      ]),
      prefixed: structuralHandlers.prefixed,
    };

    const graph: RunnerGraph = {
      nodes: [
        { id: 's',    type: 'start',          config: { params: [] } },
        { id: 'lit',  type: 'literal.number', config: { value: 42 } },
        { id: 'sink', type: '__capture__',    config: {} },
        { id: 'e',    type: 'end',            config: { returns: [] } },
      ],
      edges: [
        { from: { node: 's',    port: 'run' },     to: { node: 'sink', port: 'run-in' } },
        { from: { node: 'lit',  port: 'value' },   to: { node: 'sink', port: 'value' }, adapter: 'pipeline:number-to-string' },
        { from: { node: 'sink', port: 'run-out' }, to: { node: 'e',    port: 'run' } },
      ],
    };

    await runGraph({ graph, ctx: makeCtx(), handlers: customHandlers, conversions });
    expect(captured).toBe('42');
  });

  it('adapter throw yields undefined input and logs error', async () => {
    const conversions: ConversionDef[] = [
      { id: 'pipeline:fail', from: 'number', to: 'string',
        adapt: () => { throw new Error('boom'); } },
    ];

    let captured: unknown = 'unset';
    const captureHandler: NodeHandler = async (_ctx, inv) => {
      captured = inv.inputs.value;
      return { outputs: {}, next: 'run-out' };
    };

    const errors: RunLogEntry[] = [];
    const customHandlers: HandlerRegistry = {
      exact: new Map([
        ...structuralHandlers.exact,
        ['__capture__', captureHandler],
      ]),
      prefixed: structuralHandlers.prefixed,
    };

    const graph: RunnerGraph = {
      nodes: [
        { id: 's',    type: 'start',          config: { params: [] } },
        { id: 'lit',  type: 'literal.number', config: { value: 42 } },
        { id: 'sink', type: '__capture__',    config: {} },
        { id: 'e',    type: 'end',            config: { returns: [] } },
      ],
      edges: [
        { from: { node: 's',    port: 'run' },     to: { node: 'sink', port: 'run-in' } },
        { from: { node: 'lit',  port: 'value' },   to: { node: 'sink', port: 'value' }, adapter: 'pipeline:fail' },
        { from: { node: 'sink', port: 'run-out' }, to: { node: 'e',    port: 'run' } },
      ],
    };

    await runGraph({
      graph,
      ctx: makeCtx({ log: (e) => { if (e.level === 'error') errors.push(e); } }),
      handlers: customHandlers,
      conversions,
    });
    expect(captured).toBeUndefined();
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('runGraph — aborted run', () => {
  it('rejects when signal aborts before invocation', async () => {
    const controller = new AbortController();
    controller.abort();
    const graph: RunnerGraph = {
      nodes: [
        { id: 's', type: 'start', config: { params: [] } },
        { id: 'e', type: 'end',   config: { returns: [] } },
      ],
      edges: [{ from: { node: 's', port: 'run' }, to: { node: 'e', port: 'run' } }],
    };
    const ctx = makeCtx({ signal: controller.signal });
    await expect(runGraph({ graph, ctx, handlers })).rejects.toThrow(/abort/i);
  });
});
