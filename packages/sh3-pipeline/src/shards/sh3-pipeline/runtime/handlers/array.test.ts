import { describe, it, expect } from 'vitest';
import { arraySizeHandler, arrayGetHandler } from './array';
import type { RunContext, RunLogEntry } from '../../domain/types';

function makeCtx(): { ctx: RunContext; logs: RunLogEntry[] } {
  const logs: RunLogEntry[] = [];
  const ctx = {
    vars: new Map(), inputs: {}, docId: '', tenant: '',
    signal: new AbortController().signal,
    log: (e: RunLogEntry) => logs.push(e),
    invokeVerb: async () => ({ result: undefined, scrollback: [] }),
    runSubGraph: async () => ({ outputs: {} }),
    writeDocument: async () => {},
  } as unknown as RunContext;
  return { ctx, logs };
}

describe('array.size handler', () => {
  it('returns length for a populated array', async () => {
    const { ctx } = makeCtx();
    const out = await arraySizeHandler(ctx, {
      nodeId: 'as', type: 'array.size', config: {},
      inputs: { array: [1, 2, 3, 4] },
    });
    expect(out.outputs.size).toBe(4);
    expect(out.next).toBeNull();
  });

  it('returns 0 for an empty array', async () => {
    const { ctx } = makeCtx();
    const out = await arraySizeHandler(ctx, {
      nodeId: 'as', type: 'array.size', config: {}, inputs: { array: [] },
    });
    expect(out.outputs.size).toBe(0);
  });

  it('warns and returns 0 when input is not an array', async () => {
    const { ctx, logs } = makeCtx();
    const out = await arraySizeHandler(ctx, {
      nodeId: 'as', type: 'array.size', config: {},
      inputs: { array: 'not-an-array' },
    });
    expect(out.outputs.size).toBe(0);
    expect(logs.some((l) => l.level === 'warn' && /not an array/.test(l.message))).toBe(true);
  });
});

describe('array.get handler', () => {
  it('returns element at index with error:false', async () => {
    const { ctx } = makeCtx();
    const out = await arrayGetHandler(ctx, {
      nodeId: 'ag', type: 'array.get', config: {},
      inputs: { array: ['a', 'b', 'c'], index: 1 },
    });
    expect(out.outputs.value).toBe('b');
    expect(out.outputs.error).toBe(false);
  });

  it('returns undefined + error:true on out-of-bounds (high)', async () => {
    const { ctx } = makeCtx();
    const out = await arrayGetHandler(ctx, {
      nodeId: 'ag', type: 'array.get', config: {},
      inputs: { array: ['a'], index: 5 },
    });
    expect(out.outputs.value).toBeUndefined();
    expect(out.outputs.error).toBe(true);
  });

  it('returns undefined + error:true on negative index', async () => {
    const { ctx } = makeCtx();
    const out = await arrayGetHandler(ctx, {
      nodeId: 'ag', type: 'array.get', config: {},
      inputs: { array: ['a', 'b'], index: -1 },
    });
    expect(out.outputs.value).toBeUndefined();
    expect(out.outputs.error).toBe(true);
  });

  it('coerces numeric-string index', async () => {
    const { ctx } = makeCtx();
    const out = await arrayGetHandler(ctx, {
      nodeId: 'ag', type: 'array.get', config: {},
      inputs: { array: ['a', 'b'], index: '1' as unknown as number },
    });
    expect(out.outputs.value).toBe('b');
    expect(out.outputs.error).toBe(false);
  });

  it('non-integer index → error', async () => {
    const { ctx, logs } = makeCtx();
    const out = await arrayGetHandler(ctx, {
      nodeId: 'ag', type: 'array.get', config: {},
      inputs: { array: ['a', 'b'], index: 1.5 },
    });
    expect(out.outputs.error).toBe(true);
    expect(logs.some((l) => l.level === 'warn' && /integer/.test(l.message))).toBe(true);
  });

  it('non-array input → error + warn', async () => {
    const { ctx, logs } = makeCtx();
    const out = await arrayGetHandler(ctx, {
      nodeId: 'ag', type: 'array.get', config: {},
      inputs: { array: { not: 'array' }, index: 0 },
    });
    expect(out.outputs.value).toBeUndefined();
    expect(out.outputs.error).toBe(true);
    expect(logs.some((l) => l.level === 'warn' && /not an array/.test(l.message))).toBe(true);
  });

  it('returns the row record verbatim (unknown output)', async () => {
    const { ctx } = makeCtx();
    const row = { id: 'sq', name: 'Square-Survivor' };
    const out = await arrayGetHandler(ctx, {
      nodeId: 'ag', type: 'array.get', config: {},
      inputs: { array: [row], index: 0 },
    });
    expect(out.outputs.value).toBe(row);
  });
});
