import { describe, it, expect } from 'vitest';
import { runGraph, type RunnerGraph } from './runner';
import { createRunContext } from './context';
import { structuralHandlers } from './handlers/structural';
import type { RunContext } from '../domain/types';

function makeCtx(overrides: Partial<Parameters<typeof createRunContext>[0]> = {}): RunContext {
  return createRunContext({
    docId: 'test',
    tenant: 't',
    inputs: {},
    signal: new AbortController().signal,
    log: () => {},
    invokeVerb: async () => ({ result: undefined, scrollback: [] }),
    runSubGraph: async () => ({ outputs: {} }),
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
        { from: { node: 's',  port: 'control'     }, to: { node: 'sv', port: 'control-in' } },
        { from: { node: 'l',  port: 'value'       }, to: { node: 'sv', port: 'value'      } },
        { from: { node: 's',  port: 'topic'       }, to: { node: 'e',  port: 'topic'      } },
        { from: { node: 'sv', port: 'control-out' }, to: { node: 'e',  port: 'control'    } },
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
        { from: { node: 's',  port: 'control' }, to: { node: 'b', port: 'control' } },
        { from: { node: 's',  port: 'flag'    }, to: { node: 'b', port: 'cond'    } },
        { from: { node: 'b',  port: 'then'    }, to: { node: 'e', port: 'control' } },
        { from: { node: 'b',  port: 'else'    }, to: { node: 'e', port: 'control' } },
        { from: { node: 'ok', port: 'value'   }, to: { node: 'e', port: 'result'  } },
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

describe('runGraph — aborted run', () => {
  it('rejects when signal aborts before invocation', async () => {
    const controller = new AbortController();
    controller.abort();
    const graph: RunnerGraph = {
      nodes: [
        { id: 's', type: 'start', config: { params: [] } },
        { id: 'e', type: 'end',   config: { returns: [] } },
      ],
      edges: [{ from: { node: 's', port: 'control' }, to: { node: 'e', port: 'control' } }],
    };
    const ctx = makeCtx({ signal: controller.signal });
    await expect(runGraph({ graph, ctx, handlers })).rejects.toThrow(/abort/i);
  });
});
