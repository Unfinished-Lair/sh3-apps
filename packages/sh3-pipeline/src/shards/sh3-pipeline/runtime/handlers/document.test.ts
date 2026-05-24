import { describe, it, expect } from 'vitest';
import { makeDocumentWriteHandler } from './document';
import type { RunContext } from '../../domain/types';

type WriteCall = { shard: string; path: string; content: string | ArrayBuffer };

function ctxStub(overrides: Partial<RunContext> = {}, calls: WriteCall[] = []): RunContext {
  return {
    vars: new Map(),
    inputs: {},
    docId: 'd',
    tenant: 't',
    signal: new AbortController().signal,
    log: () => {},
    invokeVerb: async () => ({ result: undefined, scrollback: [] }),
    runSubGraph: async () => ({ outputs: {} }),
    writeDocument: async (shard, path, content) => {
      calls.push({ shard, path, content });
    },
    ...overrides,
  };
}

describe('document.write handler — single object', () => {
  it('writes one document with the resolved path and JSON-stringified content', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    const outcome = await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 'sh3-text', pathTemplate: 'out/result.json', format: 'json' },
      inputs: { data: { hello: 'world' } },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0].shard).toBe('sh3-text');
    expect(calls[0].path).toBe('out/result.json');
    expect(calls[0].content).toBe(JSON.stringify({ hello: 'world' }, null, 2));
    expect(outcome.outputs.paths).toEqual(['out/result.json']);
    expect(outcome.next).toBe('control-out');
  });
});

describe('document.write handler — array fan-out', () => {
  it('writes one document per array item using {i} as index', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    const outcome = await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 'sh3-text', pathTemplate: 'out/r-{i}.json', format: 'json' },
      inputs: { data: [{ k: 1 }, { k: 2 }, { k: 3 }] },
    });
    expect(calls.map((c) => c.path)).toEqual([
      'out/r-0.json',
      'out/r-1.json',
      'out/r-2.json',
    ]);
    expect(outcome.outputs.paths).toEqual([
      'out/r-0.json',
      'out/r-1.json',
      'out/r-2.json',
    ]);
  });

  it('treats an empty array as a no-op write with paths=[]', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    const outcome = await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'x-{i}.json', format: 'json' },
      inputs: { data: [] },
    });
    expect(calls).toHaveLength(0);
    expect(outcome.outputs.paths).toEqual([]);
    expect(outcome.next).toBe('control-out');
  });
});

describe('document.write handler — field interpolation', () => {
  it('interpolates {name} from each item field', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'out/{name}.json', format: 'json' },
      inputs: { data: [{ name: 'alpha' }, { name: 'beta' }] },
    });
    expect(calls.map((c) => c.path)).toEqual(['out/alpha.json', 'out/beta.json']);
  });

  it('throws when a template field is missing on an item', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { targetShard: 's', pathTemplate: 'out/{missing}.json', format: 'json' },
        inputs: { data: [{ name: 'alpha' }] },
      }),
    ).rejects.toThrow(/template field 'missing' is missing/);
    expect(calls).toHaveLength(0);
  });

  it('detects intra-run path collisions before writing anything', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { targetShard: 's', pathTemplate: 'out/{name}.json', format: 'json' },
        inputs: { data: [{ name: 'alpha' }, { name: 'alpha' }] },
      }),
    ).rejects.toThrow(/path collision/);
    expect(calls).toHaveLength(0);
  });
});

describe('document.write handler — content rule', () => {
  it('uses item.content verbatim when present as a string (format ignored)', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'out/{name}', format: 'json' },
      inputs: { data: [{ name: 'a.txt', content: 'plain text body' }] },
    });
    expect(calls[0].content).toBe('plain text body');
  });

  it('uses item.content verbatim when present as an ArrayBuffer', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    const buf = new TextEncoder().encode('hello').buffer;
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'out/{name}', format: 'json' },
      inputs: { data: [{ name: 'a.bin', content: buf }] },
    });
    expect(calls[0].content).toBe(buf);
  });

  it("falls back to serialisation when item.content is neither string nor ArrayBuffer", async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'out/{name}.json', format: 'json' },
      inputs: { data: [{ name: 'a', content: { nested: 'object' } }] },
    });
    expect(calls[0].content).toBe(
      JSON.stringify({ name: 'a', content: { nested: 'object' } }, null, 2),
    );
  });

  it('serialises as text under format=text', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'out/x.txt', format: 'text' },
      inputs: { data: 12345 },
    });
    expect(calls[0].content).toBe('12345');
  });
});

describe('document.write handler — string input', () => {
  it('parses a JSON-shaped string and treats the parsed value as data', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'out/r-{i}.json', format: 'json' },
      inputs: { data: JSON.stringify([{ a: 1 }, { a: 2 }]) },
    });
    expect(calls.map((c) => c.path)).toEqual(['out/r-0.json', 'out/r-1.json']);
    expect(JSON.parse(calls[0].content as string)).toEqual({ a: 1 });
  });

  it('treats a non-JSON string as a single text item', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'out/raw.txt', format: 'text' },
      inputs: { data: 'this is not json' },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0].path).toBe('out/raw.txt');
    expect(calls[0].content).toBe('this is not json');
  });
});

describe('document.write handler — path sanitisation', () => {
  it('replaces colons in the resolved path while preserving slashes', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { targetShard: 's', pathTemplate: 'out/{name}.json', format: 'json' },
      inputs: { data: [{ name: '2026-05-24T15:30:00.000Z' }] },
    });
    expect(calls[0].path).toBe('out/2026-05-24T15-30-00.000Z.json');
  });
});

describe('document.write handler — error policy', () => {
  it('throws when targetShard is missing', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { pathTemplate: 'x.json', format: 'json' },
        inputs: { data: { k: 1 } },
      }),
    ).rejects.toThrow(/targetShard/);
    expect(calls).toHaveLength(0);
  });

  it('throws when pathTemplate is missing', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { targetShard: 's', format: 'json' },
        inputs: { data: { k: 1 } },
      }),
    ).rejects.toThrow(/pathTemplate/);
    expect(calls).toHaveLength(0);
  });

  it('throws when data is undefined', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { targetShard: 's', pathTemplate: 'x.json', format: 'json' },
        inputs: {},
      }),
    ).rejects.toThrow(/no data/);
    expect(calls).toHaveLength(0);
  });

  it('on mid-array failure, surfaces writtenSoFar and stops', async () => {
    const calls: WriteCall[] = [];
    let call = 0;
    const ctx = ctxStub(
      {
        writeDocument: async (shard, path, content) => {
          call += 1;
          if (call === 2) throw new Error('simulated backend failure');
          calls.push({ shard, path, content });
        },
      },
      calls,
    );
    const handler = makeDocumentWriteHandler();
    let captured: unknown = null;
    try {
      await handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { targetShard: 's', pathTemplate: 'r-{i}.json', format: 'json' },
        inputs: { data: [{ a: 1 }, { a: 2 }, { a: 3 }] },
      });
    } catch (e) {
      captured = e;
    }
    expect(captured).toBeInstanceOf(Error);
    expect((captured as Error & { writtenSoFar?: string[] }).writtenSoFar).toEqual([
      'r-0.json',
    ]);
    expect(calls.map((c) => c.path)).toEqual(['r-0.json']);
  });
});
