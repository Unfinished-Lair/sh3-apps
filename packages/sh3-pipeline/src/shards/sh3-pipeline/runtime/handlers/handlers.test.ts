import { describe, it, expect } from 'vitest';
import { structuralHandlers } from './structural';
import { makeVerbHandler } from './verb';
import type { RunContext } from '../../domain/types';

function ctxStub(overrides: Partial<RunContext> = {}): RunContext {
  return {
    vars: overrides.vars ?? new Map<string, unknown>(),
    inputs: overrides.inputs ?? {},
    docId: 'd',
    tenant: 't',
    signal: new AbortController().signal,
    log: () => {},
    invokeVerb: async () => ({ result: undefined, scrollback: [] }),
    runSubGraph: async () => ({ outputs: {} }),
    writeDocument: async () => {},
    ...overrides,
  };
}

describe('structuralHandlers.start', () => {
  it('publishes RunContext.inputs to per-name output ports and follows control', async () => {
    const ctx = ctxStub({ inputs: { topic: 'hello', count: 3 } });
    const outcome = await structuralHandlers.exact.get('start')!(ctx, {
      nodeId: 's',
      type: 'start',
      config: {
        params: [
          { name: 'topic', dataType: 'string' },
          { name: 'count', dataType: 'number' },
        ],
      },
      inputs: {},
    });
    expect(outcome.outputs).toEqual({ topic: 'hello', count: 3 });
    expect(outcome.next).toBe('run');
  });
});

describe('structuralHandlers.end', () => {
  it('mirrors its bound inputs as outputs and terminates', async () => {
    const ctx = ctxStub();
    const outcome = await structuralHandlers.exact.get('end')!(ctx, {
      nodeId: 'e',
      type: 'end',
      config: { returns: [{ name: 'result', dataType: 'string' }] },
      inputs: { result: 'final' },
    });
    expect(outcome.next).toBe(null);
    expect(outcome.outputs).toEqual({ result: 'final' });
  });
});

describe('structuralHandlers.branch', () => {
  it('follows then on true and else on false', async () => {
    const ctx = ctxStub();
    const handler = structuralHandlers.exact.get('branch')!;
    const tCase = await handler(ctx, { nodeId: 'b', type: 'branch', config: {}, inputs: { cond: true } });
    expect(tCase.next).toBe('then');
    const fCase = await handler(ctx, { nodeId: 'b', type: 'branch', config: {}, inputs: { cond: false } });
    expect(fCase.next).toBe('else');
  });
});

describe('structuralHandlers.sequence', () => {
  it('declares ordered control outs and null `next`', async () => {
    const ctx = ctxStub();
    const outcome = await structuralHandlers.exact.get('sequence')!(ctx, {
      nodeId: 'seq',
      type: 'sequence',
      config: { count: 3 },
      inputs: {},
    });
    expect(outcome.sequenceOuts).toEqual(['out-1', 'out-2', 'out-3']);
    expect(outcome.next).toBe(null);
  });
});

describe('structuralHandlers.setVar / getVar', () => {
  it('writes and reads through ctx.vars', async () => {
    const ctx = ctxStub();
    const set = await structuralHandlers.exact.get('setVar')!(ctx, {
      nodeId: 'sv',
      type: 'setVar',
      config: { key: 'k' },
      inputs: { value: 42 },
    });
    expect(ctx.vars.get('k')).toBe(42);
    expect(set.next).toBe('run-out');
    const get = await structuralHandlers.exact.get('getVar')!(ctx, {
      nodeId: 'gv',
      type: 'getVar',
      config: { key: 'k' },
      inputs: {},
    });
    expect(get.outputs).toEqual({ value: 42 });
  });
});

describe('structuralHandlers.literal.*', () => {
  it('emits the configured value', async () => {
    const ctx = ctxStub();
    const s = await structuralHandlers.exact.get('literal.string')!(ctx, {
      nodeId: 'l',
      type: 'literal.string',
      config: { value: 'hi' },
      inputs: {},
    });
    expect(s.outputs.value).toBe('hi');
    const n = await structuralHandlers.exact.get('literal.number')!(ctx, {
      nodeId: 'l',
      type: 'literal.number',
      config: { value: 7 },
      inputs: {},
    });
    expect(n.outputs.value).toBe(7);
  });
});

describe('structuralHandlers.record.get', () => {
  it('reads a key from the input record', async () => {
    const ctx = ctxStub();
    const out = await structuralHandlers.exact.get('record.get')!(ctx, {
      nodeId: 'r',
      type: 'record.get',
      config: { key: 'a' },
      inputs: { record: { a: 1, b: 2 } },
    });
    expect(out.outputs.value).toBe(1);
  });
});

describe('verbHandler — fallback (no schema)', () => {
  it('joins stdout/stderr scrollback and exposes raw result', async () => {
    const ctx: RunContext = ctxStub({
      invokeVerb: async (shardId, name, args) => {
        expect(shardId).toBe('demo');
        expect(name).toBe('demo:do');
        expect(args).toEqual(['arg1', 'arg2']);
        return {
          result: 42,
          scrollback: [
            { kind: 'text', stream: 'stdout', chunks: ['hello ', 'world'], ts: 0 },
            { kind: 'text', stream: 'stderr', chunks: ['oops'], ts: 1 },
            { kind: 'status', text: 'ignored by stdout/stderr', level: 'info', ts: 2 },
          ],
        };
      },
    });
    const handler = makeVerbHandler();
    const outcome = await handler(ctx, {
      nodeId: 'v',
      type: 'verb:demo:demo:do',
      config: {
        shardId: 'demo',
        name: 'demo:do',
        hasInputSchema: false,
        outputPortIds: null,
      },
      inputs: { args: 'arg1 arg2' },
    });
    expect(outcome.next).toBe('run-out');
    expect(outcome.outputs.result).toBe(42);
    expect(outcome.outputs.stdout).toBe('hello world');
    expect(outcome.outputs.stderr).toBe('oops');
    expect(Array.isArray(outcome.outputs.scrollback)).toBe(true);
  });

  it('treats missing schema fields as no-schema (back-compat for legacy configs)', async () => {
    const ctx: RunContext = ctxStub({
      invokeVerb: async (_s, _n, args, opts) => {
        expect(args).toEqual([]);
        expect(opts?.structured).toBeUndefined();
        return { result: 'x', scrollback: [] };
      },
    });
    const handler = makeVerbHandler();
    const outcome = await handler(ctx, {
      nodeId: 'v',
      type: 'verb:demo:demo:do',
      config: { shardId: 'demo', name: 'demo:do' },
      inputs: {},
    });
    expect(outcome.outputs.result).toBe('x');
  });
});

describe('verbHandler — structured', () => {
  it('dispatches with { structured } and surfaces object outputs', async () => {
    const ctx: RunContext = ctxStub({
      invokeVerb: async (_s, _n, args, opts) => {
        expect(args).toEqual([]);
        expect(opts?.structured).toEqual({ topic: 'cats', count: 3 });
        return { result: { answer: 'ok', count: 3 }, scrollback: [] };
      },
    });
    const handler = makeVerbHandler();
    const outcome = await handler(ctx, {
      nodeId: 'v',
      type: 'verb:demo:demo:do',
      config: {
        shardId: 'demo',
        name: 'demo:do',
        hasInputSchema: true,
        outputPortIds: ['answer', 'count'],
      },
      inputs: { topic: 'cats', count: 3 },
    });
    expect(outcome.outputs).toEqual({ answer: 'ok', count: 3 });
    expect(outcome.next).toBe('run-out');
  });

  it('input-schema-only verb: dispatches structured but maps outputs via fallback shape', async () => {
    // Mirrors dirt-cli: schema.input declares { tool, args } but there is no
    // schema.output, so outputPortIds === null and the runner must surface
    // result/stdout/stderr/scrollback.
    const ctx: RunContext = ctxStub({
      invokeVerb: async (shardId, name, args, opts) => {
        expect(shardId).toBe('dirt');
        expect(name).toBe('dirt-cli');
        expect(args).toEqual([]);
        expect(opts?.structured).toEqual({ tool: 'gamecontent', args: ['--list'] });
        return {
          result: { exitCode: 0 },
          scrollback: [
            { kind: 'text', stream: 'stdout', chunks: ['ran'], ts: 0 },
          ],
        };
      },
    });
    const handler = makeVerbHandler();
    const outcome = await handler(ctx, {
      nodeId: 'v',
      type: 'verb:dirt:dirt-cli',
      config: {
        shardId: 'dirt',
        name: 'dirt-cli',
        hasInputSchema: true,
        outputPortIds: null,
      },
      inputs: { tool: 'gamecontent', args: ['--list'] },
    });
    expect(outcome.outputs.result).toEqual({ exitCode: 0 });
    expect(outcome.outputs.stdout).toBe('ran');
  });

  it('scalar output schema: lifts result to a single `value` port', async () => {
    const ctx: RunContext = ctxStub({
      invokeVerb: async (_s, _n, _a, opts) => {
        expect(opts?.structured).toEqual({ x: 1 });
        return { result: 'hello', scrollback: [] };
      },
    });
    const handler = makeVerbHandler();
    const outcome = await handler(ctx, {
      nodeId: 'v',
      type: 'verb:demo:demo:do',
      config: {
        shardId: 'demo',
        name: 'demo:do',
        hasInputSchema: true,
        outputPortIds: [],
      },
      inputs: { x: 1 },
    });
    expect(outcome.outputs).toEqual({ value: 'hello' });
  });
});
