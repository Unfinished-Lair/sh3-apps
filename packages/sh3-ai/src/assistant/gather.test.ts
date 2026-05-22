import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gatherContexts, type GatherDeps } from './gather';
import type { SelectedEntry } from './picker';
import type { ContextSource } from 'sh3-core';

interface StubField {
  shardId: string;
  slotId?: string;
  fieldId: string;
  label: string;
  kind: 'string' | 'json';
  value: unknown;
}

function makeDeps(opts: {
  fields?: StubField[];
  sources?: ContextSource[];
  readFrom?: (shardId: string, path: string) => unknown;
}): { deps: GatherDeps; toasts: string[] } {
  const toasts: string[] = [];
  const fields = opts.fields ?? [];
  const sources = opts.sources ?? [];
  const deps: GatherDeps = {
    fields: {
      get: (addr) => {
        const fv = fields.find(
          (f) =>
            f.shardId === addr.shardId &&
            (f.slotId ?? undefined) === (addr.slotId ?? undefined) &&
            f.fieldId === addr.fieldId,
        );
        return fv?.value;
      },
      list: () =>
        fields.map((f) => ({
          shardId: f.shardId,
          slotId: f.slotId,
          fieldId: f.fieldId,
          label: f.label,
          kind: f.kind,
          readonly: false,
          source: 'test',
        })) as ReturnType<GatherDeps['fields']['list']>,
    },
    sources: () => sources,
    readDocument: opts.readFrom
      ? async (shardId, path) => opts.readFrom!(shardId, path)
      : undefined,
    toast: (msg) => toasts.push(msg),
  };
  return { deps, toasts };
}

describe('gatherContexts', () => {
  it('returns an empty array for empty selection', async () => {
    const { deps } = makeDeps({});
    expect(await gatherContexts([], deps)).toEqual([]);
  });

  it('gathers a field entry into a ContextEntry with origin=field', async () => {
    const { deps } = makeDeps({
      fields: [{ shardId: 'sh3-editor', fieldId: 'title', label: 'Title', kind: 'string', value: 'Hello' }],
    });
    const selected: SelectedEntry[] = [
      { kind: 'field', addr: { shardId: 'sh3-editor', fieldId: 'title' } },
    ];
    const out = await gatherContexts(selected, deps);
    expect(out).toEqual([
      {
        origin: 'field',
        originKey: 'sh3-editor:title',
        label: 'Title',
        kind: 'string',
        value: 'Hello',
      },
    ]);
  });

  it('gathers a source entry, awaiting the descriptor get()', async () => {
    const source: ContextSource = {
      id: 'my-app:notes',
      label: 'Notes',
      kind: 'markdown',
      get: async () => '# title',
    };
    const { deps } = makeDeps({ sources: [source] });
    const selected: SelectedEntry[] = [{ kind: 'source', id: 'my-app:notes' }];
    const out = await gatherContexts(selected, deps);
    expect(out).toEqual([
      {
        origin: 'source',
        originKey: 'my-app:notes',
        label: 'Notes',
        kind: 'markdown',
        value: '# title',
      },
    ]);
  });

  it('defaults source kind to "text" when descriptor omits kind', async () => {
    const source: ContextSource = { id: 'a:b', label: 'L', get: () => 'x' };
    const { deps } = makeDeps({ sources: [source] });
    const out = await gatherContexts([{ kind: 'source', id: 'a:b' }], deps);
    expect(out[0].kind).toBe('text');
  });

  it('gathers a document entry via readDocument and infers kind from extension', async () => {
    const { deps } = makeDeps({ readFrom: () => '# Hello' });
    const selected: SelectedEntry[] = [
      { kind: 'document', shardId: 'sh3-server', path: 'docs/README.md' },
    ];
    const out = await gatherContexts(selected, deps);
    expect(out).toEqual([
      {
        origin: 'document',
        originKey: 'sh3-server:docs/README.md',
        label: 'README.md',
        kind: 'markdown',
        value: '# Hello',
      },
    ]);
  });

  it('infers document kind json for .json files', async () => {
    const { deps } = makeDeps({ readFrom: () => '{"a":1}' });
    const out = await gatherContexts(
      [{ kind: 'document', shardId: 's', path: 'data.json' }],
      deps,
    );
    expect(out[0].kind).toBe('json');
  });

  it('infers document kind text for unknown extensions', async () => {
    const { deps } = makeDeps({ readFrom: () => 'plain' });
    const out = await gatherContexts(
      [{ kind: 'document', shardId: 's', path: 'notes.unknown' }],
      deps,
    );
    expect(out[0].kind).toBe('text');
  });

  it('preserves selection order across mixed origins', async () => {
    const source: ContextSource = { id: 'my-app:notes', label: 'Notes', kind: 'markdown', get: () => 'B' };
    const { deps } = makeDeps({
      fields: [{ shardId: 'sh3-editor', fieldId: 'title', label: 'Title', kind: 'string', value: 'A' }],
      sources: [source],
      readFrom: () => 'C',
    });
    const selected: SelectedEntry[] = [
      { kind: 'field', addr: { shardId: 'sh3-editor', fieldId: 'title' } },
      { kind: 'source', id: 'my-app:notes' },
      { kind: 'document', shardId: 's', path: 'r.md' },
    ];
    const out = await gatherContexts(selected, deps);
    expect(out.map((e) => e.origin)).toEqual(['field', 'source', 'document']);
  });

  it('omits an entry when get() returns null and does NOT toast', async () => {
    const source: ContextSource = { id: 'a:b', label: 'L', get: () => null };
    const { deps, toasts } = makeDeps({ sources: [source] });
    const out = await gatherContexts([{ kind: 'source', id: 'a:b' }], deps);
    expect(out).toEqual([]);
    expect(toasts).toEqual([]);
  });

  it('omits a field entry when fields.get returns undefined and does NOT toast', async () => {
    const { deps, toasts } = makeDeps({}); // no fields registered
    const out = await gatherContexts(
      [{ kind: 'field', addr: { shardId: 'x', fieldId: 'y' } }],
      deps,
    );
    expect(out).toEqual([]);
    expect(toasts).toEqual([]);
  });

  it('omits a source entry when get() throws and toasts the error', async () => {
    const source: ContextSource = {
      id: 'a:b',
      label: 'L',
      get: () => { throw new Error('boom'); },
    };
    const { deps, toasts } = makeDeps({ sources: [source] });
    const out = await gatherContexts([{ kind: 'source', id: 'a:b' }], deps);
    expect(out).toEqual([]);
    expect(toasts.length).toBe(1);
    expect(toasts[0]).toContain('boom');
    expect(toasts[0]).toContain('a:b');
  });

  it('omits a document entry when readDocument rejects and toasts the error', async () => {
    const { deps, toasts } = makeDeps({
      readFrom: () => { throw new Error('not found'); },
    });
    const out = await gatherContexts(
      [{ kind: 'document', shardId: 's', path: 'missing.md' }],
      deps,
    );
    expect(out).toEqual([]);
    expect(toasts.length).toBe(1);
    expect(toasts[0]).toContain('not found');
  });

  it('omits a document entry when readDocument is not available (capability missing)', async () => {
    const { deps, toasts } = makeDeps({}); // no readFrom
    const out = await gatherContexts(
      [{ kind: 'document', shardId: 's', path: 'r.md' }],
      deps,
    );
    expect(out).toEqual([]);
    expect(toasts.length).toBe(1);
    expect(toasts[0]).toContain('documents:read');
  });

  it('continues gathering siblings after one entry errors', async () => {
    const good: ContextSource = { id: 'good:1', label: 'Good', kind: 'text', get: () => 'ok' };
    const bad: ContextSource  = { id: 'bad:1',  label: 'Bad',  kind: 'text', get: () => { throw new Error('x'); } };
    const { deps, toasts } = makeDeps({ sources: [good, bad] });
    const out = await gatherContexts(
      [{ kind: 'source', id: 'bad:1' }, { kind: 'source', id: 'good:1' }],
      deps,
    );
    expect(out.map((e) => e.originKey)).toEqual(['good:1']);
    expect(toasts.length).toBe(1);
  });
});
