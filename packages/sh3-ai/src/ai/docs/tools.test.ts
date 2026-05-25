import { describe, it, expect } from 'vitest';
import type { DocumentHandle, DocumentMeta } from 'sh3-core';
import { DocsStore } from './store';
import { makeDocTools } from './tools';
import type { Tool } from '../catalog/types';

const BOUND = 'ai';
const DOCS_ROOT = `${BOUND}/docs/`;

function fakeHandle() {
  const docs = new Map<string, string>();
  const handle: Pick<DocumentHandle, 'boundId' | 'grants' | 'list' | 'readText' | 'writeText' | 'delete'> & {
    _docs: Map<string, string>;
  } = {
    _docs: docs,
    boundId: BOUND,
    grants: { browse: false, write: false },
    async list(): Promise<DocumentMeta[]> {
      return [...docs.entries()].map(([path, content]) => ({
        path,
        size: content.length,
        lastModified: 0,
      }));
    },
    async readText(path: string) {
      return docs.has(path) ? (docs.get(path) ?? null) : null;
    },
    async writeText(path: string, content: string) {
      docs.set(path, content);
    },
    async delete(path: string) {
      docs.delete(path);
    },
  };
  return handle;
}

function setup(activeProvider: string | null) {
  const handle = fakeHandle();
  const store = new DocsStore(handle as unknown as DocumentHandle);
  const tools = makeDocTools({ store, activeProviderId: activeProvider });
  const byName = new Map<string, Tool>(tools.map((t) => [t.name, t]));
  return { handle, store, tools, byName };
}

const opts = { signal: new AbortController().signal };

describe('makeDocTools — surface', () => {
  it('exposes the four ai.docs.* tools with sh3-ai.tool source', () => {
    const { tools } = setup('gemini');
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(['ai.docs.delete', 'ai.docs.list', 'ai.docs.read', 'ai.docs.write']);
    for (const t of tools) expect(t.source).toBe('sh3-ai.tool');
  });

  it('write/delete schemas mark required fields', () => {
    const { byName } = setup('gemini');
    expect((byName.get('ai.docs.write')!.inputSchema as any).required).toEqual(['path', 'content']);
    expect((byName.get('ai.docs.read')!.inputSchema as any).required).toEqual(['path']);
    expect((byName.get('ai.docs.delete')!.inputSchema as any).required).toEqual(['path']);
  });

  it('embeds the active provider id into every description', () => {
    const { tools } = setup('gemini');
    for (const t of tools) {
      expect(t.description).toContain("'gemini'");
    }
  });

  it('write description tells the LLM the path is RELATIVE', () => {
    const { byName } = setup('gemini');
    expect(byName.get('ai.docs.write')!.description).toMatch(/RELATIVE/);
  });

  it('embeds an explanatory line when no provider is active', () => {
    const { tools } = setup(null);
    for (const t of tools) {
      expect(t.description).toMatch(/no AI provider is currently active/i);
    }
  });
});

describe('ai.docs.list', () => {
  it('runs without an active provider', async () => {
    const { handle, byName } = setup(null);
    handle._docs.set(`${DOCS_ROOT}gemini/a.md`, 'a');
    handle._docs.set(`${DOCS_ROOT}deepseek/b.md`, 'b');
    const out = (await byName.get('ai.docs.list')!.run({}, opts)) as Array<{ path: string }>;
    expect(out.map((x) => x.path).sort()).toEqual(['deepseek/b.md', 'gemini/a.md']);
  });

  it('passes provider filter', async () => {
    const { handle, byName } = setup('gemini');
    handle._docs.set(`${DOCS_ROOT}gemini/a.md`, 'a');
    handle._docs.set(`${DOCS_ROOT}deepseek/b.md`, 'b');
    const out = (await byName.get('ai.docs.list')!.run({ provider: 'gemini' }, opts)) as Array<{
      path: string;
    }>;
    expect(out.map((x) => x.path)).toEqual(['gemini/a.md']);
  });
});

describe('ai.docs.read', () => {
  it('runs without an active provider', async () => {
    const { handle, byName } = setup(null);
    handle._docs.set(`${DOCS_ROOT}gemini/a.md`, 'hello');
    const out = await byName.get('ai.docs.read')!.run({ path: 'gemini/a.md' }, opts);
    expect(out).toEqual({ content: 'hello' });
  });

  it('returns not-found error shape', async () => {
    const { byName } = setup('gemini');
    const out = await byName.get('ai.docs.read')!.run({ path: 'gemini/missing.md' }, opts);
    expect(out).toEqual({ error: 'not-found', path: 'gemini/missing.md' });
  });

  it('rejects missing path arg', async () => {
    const { byName } = setup('gemini');
    await expect(byName.get('ai.docs.read')!.run({}, opts)).rejects.toThrow(/missing.*path/);
  });
});

describe('ai.docs.write', () => {
  it('writes under the active provider folder', async () => {
    const { handle, byName } = setup('gemini');
    const out = await byName
      .get('ai.docs.write')!
      .run({ path: 'notes.md', content: 'hi' }, opts);
    expect(out).toEqual({ ok: true, path: 'gemini/notes.md' });
    expect(handle._docs.get(`${DOCS_ROOT}gemini/notes.md`)).toBe('hi');
  });

  it('throws when no provider is active', async () => {
    const { byName } = setup(null);
    await expect(
      byName.get('ai.docs.write')!.run({ path: 'notes.md', content: 'x' }, opts),
    ).rejects.toThrow(/no active AI provider/);
  });

  it('rejects traversal in path', async () => {
    const { byName } = setup('gemini');
    await expect(
      byName.get('ai.docs.write')!.run({ path: '../deepseek/x.md', content: 'x' }, opts),
    ).rejects.toThrow(/illegal segment/);
  });

  it('requires content', async () => {
    const { byName } = setup('gemini');
    await expect(
      byName.get('ai.docs.write')!.run({ path: 'notes.md' }, opts),
    ).rejects.toThrow(/missing.*content/);
  });
});

describe('ai.docs.delete', () => {
  it('deletes within active provider folder', async () => {
    const { handle, byName } = setup('gemini');
    handle._docs.set(`${DOCS_ROOT}gemini/a.md`, 'x');
    await byName.get('ai.docs.delete')!.run({ path: 'gemini/a.md' }, opts);
    expect(handle._docs.has(`${DOCS_ROOT}gemini/a.md`)).toBe(false);
  });

  it('refuses cross-provider deletes', async () => {
    const { handle, byName } = setup('gemini');
    handle._docs.set(`${DOCS_ROOT}deepseek/b.md`, 'x');
    await expect(
      byName.get('ai.docs.delete')!.run({ path: 'deepseek/b.md' }, opts),
    ).rejects.toThrow(/outside provider folder/);
    expect(handle._docs.has(`${DOCS_ROOT}deepseek/b.md`)).toBe(true);
  });

  it('throws when no provider is active', async () => {
    const { byName } = setup(null);
    await expect(
      byName.get('ai.docs.delete')!.run({ path: 'gemini/a.md' }, opts),
    ).rejects.toThrow(/no active AI provider/);
  });
});
