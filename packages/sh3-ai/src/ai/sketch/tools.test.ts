import { describe, it, expect } from 'vitest';
import type { DocumentHandle, DocumentMeta } from 'sh3-core';
import { SketchState } from './state';
import { makeSketchTools, SH3_INLINE_MARKER } from './tools';
import type { Tool } from '../catalog/types';
import { DocsStore } from '../docs/store';

function fakeHandle() {
  const files = new Map<string, string>();
  const handle: Pick<DocumentHandle, 'list' | 'readText' | 'writeText' | 'delete'> & {
    _files: Map<string, string>;
  } = {
    _files: files,
    async list(): Promise<DocumentMeta[]> {
      return [...files.entries()].map(([path, content]) => ({
        path,
        size: content.length,
        lastModified: 0,
      }));
    },
    async readText(path: string) {
      return files.has(path) ? (files.get(path) ?? null) : null;
    },
    async writeText(path: string, content: string) {
      files.set(path, content);
    },
    async delete(path: string) {
      files.delete(path);
    },
  };
  return handle;
}

function setup(opts: { viewOpen?: boolean; activeProviderId?: string | null } = {}) {
  const state = new SketchState();
  const handle = fakeHandle();
  const store = new DocsStore(handle as unknown as DocumentHandle);
  let isOpen = opts.viewOpen ?? false;
  const tools = makeSketchTools({
    state,
    store,
    activeProviderId: opts.activeProviderId === undefined ? 'gemini' : opts.activeProviderId,
    isViewOpen: () => isOpen,
  });
  const byName = new Map<string, Tool>(tools.map((t) => [t.name, t]));
  return {
    state,
    store,
    handle,
    tools,
    byName,
    setViewOpen(v: boolean) { isOpen = v; },
  };
}

const opts = { signal: new AbortController().signal };

describe('makeSketchTools — surface', () => {
  it('exposes ai.sketch.show and ai.sketch.save with sh3-ai.tool source', () => {
    const { tools } = setup();
    expect(tools.map((t) => t.name).sort()).toEqual(['ai.sketch.save', 'ai.sketch.show']);
    for (const t of tools) {
      expect(t.source).toBe('sh3-ai.tool');
      expect(typeof t.description).toBe('string');
      expect(t.description.length).toBeGreaterThan(0);
    }
  });

  it('show inputSchema accepts html, path, and mode (no required field)', () => {
    const { byName } = setup();
    const schema = byName.get('ai.sketch.show')!.inputSchema as {
      type: string;
      properties: Record<string, { type: string; enum?: string[] }>;
      required?: string[];
    };
    expect(schema.type).toBe('object');
    expect(schema.required).toBeUndefined();
    expect(schema.properties.html.type).toBe('string');
    expect(schema.properties.path.type).toBe('string');
    expect(schema.properties.mode.enum).toEqual(['inline', 'isolated']);
  });

  it('save inputSchema requires name and accepts overwrite', () => {
    const { byName } = setup();
    const schema = byName.get('ai.sketch.save')!.inputSchema as {
      type: string;
      properties: Record<string, { type: string }>;
      required: string[];
    };
    expect(schema.required).toEqual(['name']);
    expect(schema.properties.name.type).toBe('string');
    expect(schema.properties.overwrite.type).toBe('boolean');
  });
});

describe('ai.sketch.show — html arg', () => {
  it("default mode is inline; reports viewOpen=false when view is closed", async () => {
    const { state, byName } = setup();
    const out = await byName.get('ai.sketch.show')!.run({ html: '<b>hi</b>' }, opts);
    expect(out).toMatchObject({ ok: true, viewOpen: false, source: 'html', mode: 'inline' });
    expect(state.current).toEqual({ html: '<b>hi</b>', mode: 'inline' });
  });

  it('honors explicit isolated mode', async () => {
    const { state, byName } = setup();
    await byName.get('ai.sketch.show')!.run({ html: '<b>hi</b>', mode: 'isolated' }, opts);
    expect(state.current).toEqual({ html: '<b>hi</b>', mode: 'isolated' });
  });

  it('rejects when neither html nor path is given', async () => {
    const { byName } = setup();
    await expect(byName.get('ai.sketch.show')!.run({}, opts)).rejects.toThrow(/html.*path/);
  });

  it('rejects empty html', async () => {
    const { byName } = setup();
    await expect(byName.get('ai.sketch.show')!.run({ html: '' }, opts)).rejects.toThrow(
      /html.*path/,
    );
  });

  it('rejects when both html and path are given', async () => {
    const { byName } = setup();
    await expect(
      byName.get('ai.sketch.show')!.run({ html: 'x', path: 'gemini/sketches/a.html' }, opts),
    ).rejects.toThrow(/mutually exclusive/);
  });

  it('rejects unknown mode', async () => {
    const { byName } = setup();
    await expect(
      byName.get('ai.sketch.show')!.run({ html: 'x', mode: 'oops' }, opts),
    ).rejects.toThrow(/inline.*isolated/);
  });

  it('reports viewOpen=true when isViewOpen returns true', async () => {
    const { byName, setViewOpen } = setup();
    setViewOpen(true);
    const out = await byName.get('ai.sketch.show')!.run({ html: 'x' }, opts);
    expect(out).toMatchObject({ ok: true, viewOpen: true });
  });
});

describe('ai.sketch.show — path arg', () => {
  it('loads saved sketch and detects inline mode from sh3:inline marker', async () => {
    const { state, byName, handle } = setup();
    handle._files.set(
      'docs/gemini/sketches/foo.html',
      `${SH3_INLINE_MARKER}\n<button class="sh3-btn">Hi</button>`,
    );
    const out = await byName
      .get('ai.sketch.show')!
      .run({ path: 'gemini/sketches/foo.html' }, opts);
    expect(out).toMatchObject({
      ok: true,
      source: 'path',
      path: 'gemini/sketches/foo.html',
      mode: 'inline',
    });
    expect(state.current?.mode).toBe('inline');
    expect(state.current?.html).toContain('sh3-btn');
  });

  it('falls back to isolated mode when marker is absent', async () => {
    const { state, byName, handle } = setup();
    handle._files.set(
      'docs/gemini/sketches/bar.html',
      '<style>body{background:red}</style><div>raw</div>',
    );
    const out = await byName
      .get('ai.sketch.show')!
      .run({ path: 'gemini/sketches/bar.html' }, opts);
    expect(out).toMatchObject({ source: 'path', mode: 'isolated' });
    expect(state.current?.mode).toBe('isolated');
  });

  it('explicit mode overrides marker-based detection', async () => {
    const { state, byName, handle } = setup();
    handle._files.set(
      'docs/gemini/sketches/foo.html',
      `${SH3_INLINE_MARKER}\n<div>hi</div>`,
    );
    await byName
      .get('ai.sketch.show')!
      .run({ path: 'gemini/sketches/foo.html', mode: 'isolated' }, opts);
    expect(state.current?.mode).toBe('isolated');
  });

  it('returns not-found error when path does not exist', async () => {
    const { state, byName } = setup();
    const out = await byName
      .get('ai.sketch.show')!
      .run({ path: 'gemini/sketches/missing.html' }, opts);
    expect(out).toEqual({ error: 'not-found', path: 'gemini/sketches/missing.html' });
    expect(state.current).toBeNull();
  });

  it('cross-provider read is allowed', async () => {
    const { state, byName, handle } = setup({ activeProviderId: 'gemini' });
    handle._files.set('docs/openai/sketches/x.html', '<p>cross</p>');
    const out = await byName
      .get('ai.sketch.show')!
      .run({ path: 'openai/sketches/x.html' }, opts);
    expect(out).toMatchObject({ source: 'path', mode: 'isolated' });
    expect(state.current?.html).toBe('<p>cross</p>');
  });
});

describe('ai.sketch.save', () => {
  it('refuses when no provider is active', async () => {
    const { byName } = setup({ activeProviderId: null });
    await expect(
      byName.get('ai.sketch.save')!.run({ name: 'foo' }, opts),
    ).rejects.toThrow(/no active AI provider/);
  });

  it('returns empty error when canvas is null', async () => {
    const { byName } = setup();
    const out = await byName.get('ai.sketch.save')!.run({ name: 'foo' }, opts);
    expect(out).toMatchObject({ error: 'empty' });
  });

  it('rejects names with illegal characters', async () => {
    const { state, byName } = setup();
    state.set({ html: '<p>x</p>', mode: 'inline' });
    await expect(
      byName.get('ai.sketch.save')!.run({ name: 'has/slash' }, opts),
    ).rejects.toThrow(/letters, digits/);
  });

  it('writes inline-mode sketch with marker prepended', async () => {
    const { state, byName, handle } = setup();
    state.set({ html: '<p>raw</p>', mode: 'inline' });
    const out = await byName.get('ai.sketch.save')!.run({ name: 'foo' }, opts);
    expect(out).toMatchObject({
      ok: true,
      path: 'gemini/sketches/foo.html',
      mode: 'inline',
    });
    const stored = handle._files.get('docs/gemini/sketches/foo.html');
    expect(stored).toBe(`${SH3_INLINE_MARKER}\n<p>raw</p>`);
  });

  it('writes isolated-mode sketch verbatim (no marker)', async () => {
    const { state, byName, handle } = setup();
    state.set({ html: '<style>x</style><p>iso</p>', mode: 'isolated' });
    await byName.get('ai.sketch.save')!.run({ name: 'iso' }, opts);
    const stored = handle._files.get('docs/gemini/sketches/iso.html');
    expect(stored).toBe('<style>x</style><p>iso</p>');
    expect(stored).not.toContain('sh3:inline');
  });

  it('does not double-prepend the marker on inline sketches that already have one', async () => {
    const { state, byName, handle } = setup();
    state.set({
      html: `${SH3_INLINE_MARKER}\n<p>already</p>`,
      mode: 'inline',
    });
    await byName.get('ai.sketch.save')!.run({ name: 'foo' }, opts);
    const stored = handle._files.get('docs/gemini/sketches/foo.html')!;
    const occurrences = stored.split('sh3:inline').length - 1;
    expect(occurrences).toBe(1);
  });

  it('returns exists error when file is present and overwrite is false', async () => {
    const { state, byName, handle } = setup();
    handle._files.set('docs/gemini/sketches/foo.html', 'old');
    state.set({ html: '<p>new</p>', mode: 'inline' });
    const out = await byName.get('ai.sketch.save')!.run({ name: 'foo' }, opts);
    expect(out).toMatchObject({ error: 'exists', path: 'gemini/sketches/foo.html' });
    expect(handle._files.get('docs/gemini/sketches/foo.html')).toBe('old');
  });

  it('overwrites when overwrite is true', async () => {
    const { state, byName, handle } = setup();
    handle._files.set('docs/gemini/sketches/foo.html', 'old');
    state.set({ html: '<p>new</p>', mode: 'inline' });
    const out = await byName
      .get('ai.sketch.save')!
      .run({ name: 'foo', overwrite: true }, opts);
    expect(out).toMatchObject({ ok: true });
    expect(handle._files.get('docs/gemini/sketches/foo.html')).toBe(
      `${SH3_INLINE_MARKER}\n<p>new</p>`,
    );
  });
});

describe('round-trip', () => {
  it('save then show by path restores the same html and mode (inline)', async () => {
    const { state, byName } = setup();
    state.set({ html: '<button class="sh3-btn">go</button>', mode: 'inline' });
    await byName.get('ai.sketch.save')!.run({ name: 'rt' }, opts);
    state.clear();
    expect(state.current).toBeNull();
    await byName.get('ai.sketch.show')!.run({ path: 'gemini/sketches/rt.html' }, opts);
    expect(state.current?.mode).toBe('inline');
    expect(state.current?.html).toContain('sh3-btn');
  });

  it('save then show by path restores isolated mode', async () => {
    const { state, byName } = setup();
    state.set({ html: '<style>body{}</style><p>x</p>', mode: 'isolated' });
    await byName.get('ai.sketch.save')!.run({ name: 'rt-iso' }, opts);
    state.clear();
    await byName
      .get('ai.sketch.show')!
      .run({ path: 'gemini/sketches/rt-iso.html' }, opts);
    expect(state.current?.mode).toBe('isolated');
  });
});
