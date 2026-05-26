import { describe, it, expect, vi } from 'vitest';
import { makePrintHandler } from './print';
import type { RunContext, RunLogEntry } from '../../domain/types';

function makeCtx(): { ctx: RunContext; logs: RunLogEntry[] } {
  const logs: RunLogEntry[] = [];
  const ctx = {
    vars: new Map(), inputs: {}, docId: '', tenant: '',
    signal: new AbortController().signal,
    log: (e: RunLogEntry) => logs.push(e),
    invokeVerb: vi.fn() as any, runSubGraph: vi.fn() as any, writeDocument: vi.fn() as any,
  } as RunContext;
  return { ctx, logs };
}

describe('print handler', () => {
  it('stringifies a string verbatim and forwards run-out', async () => {
    const { ctx, logs } = makeCtx();
    const h = makePrintHandler();
    const out = await h(ctx, { nodeId: 'p1', type: 'print',
      config: { path: '', label: '' }, inputs: { value: 'hello' } });
    expect(out.next).toBe('run-out');
    expect(logs[0].message).toBe('hello');
  });

  it('stringifies number/boolean', async () => {
    const { ctx, logs } = makeCtx();
    const h = makePrintHandler();
    await h(ctx, { nodeId: 'p1', type: 'print', config: { path: '', label: '' }, inputs: { value: 42 } });
    await h(ctx, { nodeId: 'p1', type: 'print', config: { path: '', label: '' }, inputs: { value: true } });
    expect(logs[0].message).toBe('42');
    expect(logs[1].message).toBe('true');
  });

  it('pretty-prints records and arrays', async () => {
    const { ctx, logs } = makeCtx();
    const h = makePrintHandler();
    await h(ctx, { nodeId: 'p1', type: 'print', config: { path: '', label: '' }, inputs: { value: { a: 1 } } });
    expect(logs[0].message).toBe('{\n  "a": 1\n}');
  });

  it('applies path before stringifying', async () => {
    const { ctx, logs } = makeCtx();
    const h = makePrintHandler();
    await h(ctx, { nodeId: 'p1', type: 'print',
      config: { path: 'items[0].name', label: '' },
      inputs: { value: { items: [{ name: 'first' }] } },
    });
    expect(logs[0].message).toBe('first');
  });

  it('logs "(no input)" when value is undefined', async () => {
    const { ctx, logs } = makeCtx();
    const h = makePrintHandler();
    await h(ctx, { nodeId: 'p1', type: 'print', config: { path: '', label: '' }, inputs: {} });
    expect(logs[0].message).toBe('(no input)');
  });

  it('logs "(path miss)" when path resolves undefined', async () => {
    const { ctx, logs } = makeCtx();
    const h = makePrintHandler();
    await h(ctx, { nodeId: 'p1', type: 'print',
      config: { path: 'nope.gone', label: '' },
      inputs: { value: { a: 1 } },
    });
    expect(logs[0].message).toContain('(path miss');
  });

  it('prepends label when set', async () => {
    const { ctx, logs } = makeCtx();
    const h = makePrintHandler();
    await h(ctx, { nodeId: 'p1', type: 'print',
      config: { path: '', label: 'workspace' },
      inputs: { value: 'square-survivor' },
    });
    expect(logs[0].message).toBe('workspace: square-survivor');
  });
});
