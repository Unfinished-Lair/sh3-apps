import { describe, it, expect } from 'vitest';
import { makeJsonifyHandler } from './jsonify';
import type { RunContext, RunLogEntry } from '../../domain/types';

function makeCtx() {
  const logs: RunLogEntry[] = [];
  return {
    ctx: {
      vars: new Map(),
      inputs: {},
      docId: '',
      tenant: '',
      signal: new AbortController().signal,
      log: (e: RunLogEntry) => logs.push(e),
      invokeVerb: async () => ({ result: undefined, scrollback: [] }),
      runSubGraph: async () => ({ outputs: {} }),
      writeDocument: async () => {},
    } as unknown as RunContext,
    logs,
  };
}

describe('jsonify handler', () => {
  it('stringifies record pretty', async () => {
    const { ctx } = makeCtx();
    const h = makeJsonifyHandler();
    const out = await h(ctx, { nodeId: 'j', type: 'record.toJson',
      config: { pretty: true }, inputs: { record: { a: 1 } } });
    expect(out.outputs.json).toBe('{\n  "a": 1\n}');
  });

  it('stringifies record compact when pretty=false', async () => {
    const { ctx } = makeCtx();
    const h = makeJsonifyHandler();
    const out = await h(ctx, { nodeId: 'j', type: 'record.toJson',
      config: { pretty: false }, inputs: { record: { a: 1 } } });
    expect(out.outputs.json).toBe('{"a":1}');
  });

  it('stringifies array', async () => {
    const { ctx } = makeCtx();
    const h = makeJsonifyHandler();
    const out = await h(ctx, { nodeId: 'j', type: 'array.toJson',
      config: { pretty: false }, inputs: { array: [1, 2, 3] } });
    expect(out.outputs.json).toBe('[1,2,3]');
  });

  it('emits undefined and logs error on circular ref', async () => {
    const { ctx, logs } = makeCtx();
    const h = makeJsonifyHandler();
    const obj: any = { a: 1 }; obj.self = obj;
    const out = await h(ctx, { nodeId: 'j', type: 'record.toJson',
      config: { pretty: false }, inputs: { record: obj } });
    expect(out.outputs.json).toBeUndefined();
    expect(logs.some((l) => l.level === 'error')).toBe(true);
  });
});
