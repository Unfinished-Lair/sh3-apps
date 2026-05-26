import { describe, it, expect } from 'vitest';
import { makeDocumentWriteHandler } from './document';
import type { RunContext } from '../../domain/types';

type WriteCall = { path: string; content: string | ArrayBuffer };

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
    writeDocument: async (path, content) => {
      calls.push({ path, content });
    },
    ...overrides,
  };
}

const F = (shardId: string, path = '') => ({ shardId, path });

describe('document.write handler — single object', () => {
  it('writes one document at <shardId>/<folder>/<filename> with JSON content', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    const outcome = await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { folder: F('sh3-text', 'out'), filename: 'result.json', format: 'json' },
      inputs: { data: { hello: 'world' } },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0].path).toBe('sh3-text/out/result.json');
    expect(calls[0].content).toBe(JSON.stringify({ hello: 'world' }, null, 2));
    expect(outcome.outputs.paths).toEqual(['out/result.json']);
    expect(outcome.next).toBe('run-out');
  });

  it('writes to shard root when folder.path is empty', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    const outcome = await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { folder: F('sh3-text', ''), filename: 'root.json', format: 'json' },
      inputs: { data: { k: 1 } },
    });
    expect(calls[0].path).toBe('sh3-text/root.json');
    expect(outcome.outputs.paths).toEqual(['root.json']);
  });
});

describe('document.write handler — array fan-out', () => {
  it('writes one document per array item using {i} in filename', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    const outcome = await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { folder: F('sh3-text', 'out'), filename: 'r-{i}.json', format: 'json' },
      inputs: { data: [{ k: 1 }, { k: 2 }, { k: 3 }] },
    });
    expect(calls.map((c) => c.path)).toEqual([
      'sh3-text/out/r-0.json',
      'sh3-text/out/r-1.json',
      'sh3-text/out/r-2.json',
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
      config: { folder: F('s', ''), filename: 'x-{i}.json', format: 'json' },
      inputs: { data: [] },
    });
    expect(calls).toHaveLength(0);
    expect(outcome.outputs.paths).toEqual([]);
    expect(outcome.next).toBe('run-out');
  });
});

describe('document.write handler — field interpolation', () => {
  it('interpolates {name} from each item field into the filename', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { folder: F('s', 'out'), filename: '{name}.json', format: 'json' },
      inputs: { data: [{ name: 'alpha' }, { name: 'beta' }] },
    });
    expect(calls.map((c) => c.path)).toEqual(['s/out/alpha.json', 's/out/beta.json']);
  });

  it('throws when a template field is missing on an item', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { folder: F('s', 'out'), filename: '{missing}.json', format: 'json' },
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
        config: { folder: F('s', 'out'), filename: '{name}.json', format: 'json' },
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
      config: { folder: F('s', 'out'), filename: '{name}', format: 'json' },
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
      config: { folder: F('s', 'out'), filename: '{name}', format: 'json' },
      inputs: { data: [{ name: 'a.bin', content: buf }] },
    });
    expect(calls[0].content).toBe(buf);
  });

  it('falls back to serialisation when item.content is not string/ArrayBuffer', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { folder: F('s', 'out'), filename: '{name}.json', format: 'json' },
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
      config: { folder: F('s', ''), filename: 'x.txt', format: 'text' },
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
      config: { folder: F('s', 'out'), filename: 'r-{i}.json', format: 'json' },
      inputs: { data: JSON.stringify([{ a: 1 }, { a: 2 }]) },
    });
    expect(calls.map((c) => c.path)).toEqual(['s/out/r-0.json', 's/out/r-1.json']);
    expect(JSON.parse(calls[0].content as string)).toEqual({ a: 1 });
  });

  it('treats a non-JSON string as a single text item', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { folder: F('s', 'out'), filename: 'raw.txt', format: 'text' },
      inputs: { data: 'this is not json' },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0].path).toBe('s/out/raw.txt');
    expect(calls[0].content).toBe('this is not json');
  });
});

describe('document.write handler — path sanitisation', () => {
  it('replaces colons in the resolved filename while preserving slashes', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await handler(ctx, {
      nodeId: 'w',
      type: 'document.write',
      config: { folder: F('s', 'out'), filename: '{name}.json', format: 'json' },
      inputs: { data: [{ name: '2026-05-24T15:30:00.000Z' }] },
    });
    expect(calls[0].path).toBe('s/out/2026-05-24T15-30-00.000Z.json');
  });
});

describe('document.write handler — error policy', () => {
  it('throws when folder is null', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { folder: null, filename: 'x.json', format: 'json' },
        inputs: { data: { k: 1 } },
      }),
    ).rejects.toThrow(/folder is required/);
    expect(calls).toHaveLength(0);
  });

  it('throws when folder.shardId is empty', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { folder: F('', ''), filename: 'x.json', format: 'json' },
        inputs: { data: { k: 1 } },
      }),
    ).rejects.toThrow(/folder is required/);
    expect(calls).toHaveLength(0);
  });

  it('throws when filename is missing', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { folder: F('s', ''), format: 'json' },
        inputs: { data: { k: 1 } },
      }),
    ).rejects.toThrow(/filename is required/);
    expect(calls).toHaveLength(0);
  });

  it('throws when filename is the empty string', async () => {
    const calls: WriteCall[] = [];
    const ctx = ctxStub({}, calls);
    const handler = makeDocumentWriteHandler();
    await expect(
      handler(ctx, {
        nodeId: 'w',
        type: 'document.write',
        config: { folder: F('s', ''), filename: '', format: 'json' },
        inputs: { data: { k: 1 } },
      }),
    ).rejects.toThrow(/filename is required/);
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
        config: { folder: F('s', ''), filename: 'x.json', format: 'json' },
        inputs: {},
      }),
    ).rejects.toThrow(/no data/);
    expect(calls).toHaveLength(0);
  });

  it('on mid-array failure, surfaces writtenSoFar (relative paths) and stops', async () => {
    const calls: WriteCall[] = [];
    let call = 0;
    const ctx = ctxStub(
      {
        writeDocument: async (path, content) => {
          call += 1;
          if (call === 2) throw new Error('simulated backend failure');
          calls.push({ path, content });
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
        config: { folder: F('s', ''), filename: 'r-{i}.json', format: 'json' },
        inputs: { data: [{ a: 1 }, { a: 2 }, { a: 3 }] },
      });
    } catch (e) {
      captured = e;
    }
    expect(captured).toBeInstanceOf(Error);
    expect((captured as Error & { writtenSoFar?: string[] }).writtenSoFar).toEqual([
      'r-0.json',
    ]);
    expect(calls.map((c) => c.path)).toEqual(['s/r-0.json']);
  });
});
