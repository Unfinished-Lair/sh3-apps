import { describe, it, expect, vi } from 'vitest';
import { bindDocument } from './document-binding';
import { InstanceRegistry } from './model/instance-registry.svelte';
import { createApi } from './model/api';
import type { OpenDocumentOptions } from './types';
import {
  EDITOR_DOCUMENT_POINT,
  type EditorDocumentChannel,
  type EditorDocumentContribution,
} from './contributions';
import type { DocumentChange, DocumentHandle, DocumentMeta, DocStatus } from 'sh3-core';

// ============================================================================
// Test helpers
// ============================================================================

function makeContext() {
  const registry = new InstanceRegistry();
  const { internals } = createApi(registry);
  const contributions = {
    list: <T>(_pointId: string): T[] => [],
    register: <T>(_pointId: string, _desc: T) => () => {},
    onChange: (_pointId: string, _cb: () => void) => () => {},
    onAnyChange: (_cb: (pointId: string) => void) => () => {},
    listPoints: () => [] as string[],
  };
  const defaultOptions: OpenDocumentOptions = { content: 'Hello, World' };
  return { registry, internals, contributions, defaultOptions };
}

function makeContextWithContributions(descriptors: EditorDocumentContribution[]) {
  const registry = new InstanceRegistry();
  const { internals } = createApi(registry);
  const contributions = {
    list: <T>(pointId: string): T[] =>
      pointId === EDITOR_DOCUMENT_POINT
        ? (descriptors as unknown as T[])
        : [],
    register: <T>(_pointId: string, _desc: T) => () => {},
    onChange: (_pointId: string, _cb: () => void) => () => {},
    onAnyChange: (_cb: (pointId: string) => void) => () => {},
    listPoints: () => [EDITOR_DOCUMENT_POINT],
  };
  const defaultOptions: OpenDocumentOptions = { content: 'Hello, World' };
  return { registry, internals, contributions, defaultOptions };
}

/** In-memory DocumentHandle stub for path-mode tests. Captures readText /
 *  writeText calls and lets tests fire watch events synchronously. Only the
 *  subset bindDocument exercises is implemented. */
class MockDocuments {
  files = new Map<string, string>();
  watchers: Array<(change: DocumentChange) => void> = [];
  readCalls: string[] = [];
  writeCalls: Array<{ path: string; content: string }> = [];

  constructor(initial: Record<string, string> = {}) {
    for (const [k, v] of Object.entries(initial)) this.files.set(k, v);
  }

  readText(path: string): Promise<string | null> {
    this.readCalls.push(path);
    return Promise.resolve(this.files.has(path) ? this.files.get(path)! : null);
  }
  writeText(path: string, content: string): Promise<void> {
    this.writeCalls.push({ path, content });
    const existed = this.files.has(path);
    this.files.set(path, content);
    // Mimic real backend: emit a watch event after the write resolves.
    queueMicrotask(() => {
      const change: DocumentChange = {
        type: existed ? 'update' : 'create',
        path,
        scope: 'test',
      };
      for (const cb of this.watchers) cb(change);
    });
    return Promise.resolve();
  }
  watch(cb: (change: DocumentChange) => void): () => void {
    this.watchers.push(cb);
    return () => {
      const i = this.watchers.indexOf(cb);
      if (i !== -1) this.watchers.splice(i, 1);
    };
  }

  /** Test-only: simulate an external write (no echo guard). */
  emitExternal(path: string, content: string): void {
    const existed = this.files.has(path);
    this.files.set(path, content);
    const change: DocumentChange = {
      type: existed ? 'update' : 'create',
      path,
      scope: 'test',
    };
    for (const cb of this.watchers) cb(change);
  }

  // Unused methods — stubbed to satisfy DocumentHandle shape when cast.
  readBinary(): Promise<ArrayBuffer | null> { return Promise.resolve(null); }
  readJson(): Promise<unknown> { return Promise.resolve(null); }
  writeBinary(): Promise<void> { return Promise.resolve(); }
  writeJson(): Promise<void> { return Promise.resolve(); }
  delete(): Promise<void> { return Promise.resolve(); }
  rename(): Promise<void> { return Promise.resolve(); }
  mkdir(): Promise<void> { return Promise.resolve(); }
  rmdir(): Promise<void> { return Promise.resolve(); }
  renameFolder(): Promise<void> { return Promise.resolve(); }
  list(): Promise<DocumentMeta[]> { return Promise.resolve([]); }
  listFolders(): Promise<string[]> { return Promise.resolve([]); }
  exists(path: string): Promise<boolean> { return Promise.resolve(this.files.has(path)); }
  status(): Promise<DocStatus | null> { return Promise.resolve(null); }
  resolveConflict(): Promise<void> { return Promise.resolve(); }
  readBranch(): Promise<string | null> { return Promise.resolve(null); }
  dispose(): void { /* no-op */ }
}

const flushAsync = () => new Promise<void>((r) => queueMicrotask(() => queueMicrotask(r)));

// ============================================================================
// Existing behavior — content mode + fallback
// ============================================================================

describe('bindDocument — fallback paths (no contribution)', () => {
  it('reuses existing registry entry when present', () => {
    const ctx = makeContext();
    ctx.registry.open('slot-A', { content: 'preset' });
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(entry.document.content).toBe('preset');
  });

  it('lazy-opens with defaultOptions when no entry and no contribution', () => {
    const ctx = makeContext();
    const { entry } = bindDocument({ slotId: 'slot-B', ...ctx });
    expect(entry.document.content).toBe('Hello, World');
  });

  it('cleanup is a no-op when no contribution is bound', () => {
    const ctx = makeContext();
    const { cleanup } = bindDocument({ slotId: 'slot-C', ...ctx });
    expect(() => cleanup()).not.toThrow();
  });
});

describe('bindDocument — contribution lookup (content mode)', () => {
  it('seeds the entry from a matching contribution', () => {
    const ctx = makeContextWithContributions([
      {
        slotId: 'slot-A',
        seed: { kind: 'content', content: 'from-contribution', language: 'rust' },
      },
    ]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(entry.document.content).toBe('from-contribution');
    expect(entry.document.language).toBe('rust');
  });

  it('ignores contributions with mismatched slotId', () => {
    const ctx = makeContextWithContributions([
      { slotId: 'slot-OTHER', seed: { kind: 'content', content: 'other' } },
    ]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(entry.document.content).toBe('Hello, World');
  });

  it('first registered wins on slotId collision and warns', () => {
    const warn = vi.fn();
    const ctx = makeContextWithContributions([
      { slotId: 'slot-A', seed: { kind: 'content', content: 'first' } },
      { slotId: 'slot-A', seed: { kind: 'content', content: 'second' } },
    ]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx, warn });
    expect(entry.document.content).toBe('first');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('slot-A');
  });

  it('does not re-seed a registry entry that already exists (open beats seed)', () => {
    const ctx = makeContextWithContributions([
      { slotId: 'slot-A', seed: { kind: 'content', content: 'from-seed' } },
    ]);
    ctx.registry.open('slot-A', { content: 'from-imperative-open' });
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(entry.document.content).toBe('from-imperative-open');
  });
});

describe('bindDocument — channel swap (content mode)', () => {
  it('captures channel via bind() at mount and disposes on cleanup', () => {
    let captured: EditorDocumentChannel | null = null;
    let disposed = false;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      bind(channel) {
        captured = channel;
        return () => { disposed = true; };
      },
    }]);
    const { cleanup } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(captured).not.toBeNull();
    expect(captured!.setBuffer).toBeTypeOf('function');
    expect(captured!.openPath).toBeTypeOf('function');
    expect(captured!.setOptions).toBeTypeOf('function');
    cleanup();
    expect(disposed).toBe(true);
  });

  it('setBuffer(...) mutates entry, clears history, fires events', () => {
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      bind(c) { captured = c; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });

    ctx.internals.history('slot-A').push({ apply() {}, revert() {} });
    expect(ctx.internals.history('slot-A').canUndo).toBe(true);

    const contentSpy = vi.fn();
    const dirtySpy = vi.fn();
    ctx.internals.contentChange.on(contentSpy);
    ctx.internals.dirtyChange.on(dirtySpy);

    captured.setBuffer('next');

    expect(entry.document.content).toBe('next');
    expect(entry.document.cursorStart).toBe(0);
    expect(entry.document.cursorEnd).toBe(0);
    expect(entry.document.dirty).toBe(false);
    expect(ctx.internals.history('slot-A').canUndo).toBe(false);
    expect(contentSpy).toHaveBeenCalledWith('slot-A', 'next');
    expect(dirtySpy).toHaveBeenCalledWith('slot-A', false);
  });

  it('setBuffer(same) is silent', () => {
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      bind(c) { captured = c; return () => {}; },
    }]);
    bindDocument({ slotId: 'slot-A', ...ctx });
    const contentSpy = vi.fn();
    ctx.internals.contentChange.on(contentSpy);
    captured.setBuffer('init');
    expect(contentSpy).not.toHaveBeenCalled();
  });

  it('setOptions(...) does not fire content events', () => {
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      bind(c) { captured = c; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    const contentSpy = vi.fn();
    ctx.internals.contentChange.on(contentSpy);

    captured.setOptions({ language: 'rust', filePath: '/x.rs' });

    expect(entry.document.language).toBe('rust');
    expect(entry.document.filePath).toBe('/x.rs');
    expect(contentSpy).not.toHaveBeenCalled();
  });

  it('setOptions(...) updates wrapper options (toolbarActions, fontSize, etc.)', () => {
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      bind(c) { captured = c; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    const action = { id: 'a', label: 'A', onAction: () => {} };
    captured.setOptions({ toolbarActions: [action], fontSize: 18 });
    expect(entry.options.toolbarActions).toEqual([action]);
    expect(entry.options.fontSize).toBe(18);
  });

  it('cleanup is safe when bind returned no disposer', () => {
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      bind(_c) { /* no return — disposer is optional */ },
    }]);
    const { cleanup } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(() => cleanup()).not.toThrow();
  });
});

describe('bindDocument — edit-flow-back forwarders (content mode)', () => {
  it('onContentChange fires only for matching slotId', () => {
    const onContentChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      onContentChange,
    }]);
    bindDocument({ slotId: 'slot-A', ...ctx });

    ctx.internals.contentChange.emit('slot-A', 'edit');
    ctx.internals.contentChange.emit('slot-OTHER', 'noise');

    expect(onContentChange).toHaveBeenCalledTimes(1);
    expect(onContentChange).toHaveBeenCalledWith('edit');
  });

  it('onDirtyChange / onSave / onPrefsChange filter by slotId', () => {
    const onDirtyChange = vi.fn();
    const onSave = vi.fn();
    const onPrefsChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      onDirtyChange, onSave, onPrefsChange,
    }]);
    bindDocument({ slotId: 'slot-A', ...ctx });

    ctx.internals.dirtyChange.emit('slot-A', true);
    ctx.internals.dirtyChange.emit('slot-OTHER', true);
    ctx.internals.saveEvent.emit('slot-A');
    ctx.internals.saveEvent.emit('slot-OTHER');
    ctx.internals.prefsChange.emit('slot-A', { indentUnit: 4 });
    ctx.internals.prefsChange.emit('slot-OTHER', { indentUnit: 8 });

    expect(onDirtyChange).toHaveBeenCalledTimes(1);
    expect(onDirtyChange).toHaveBeenCalledWith(true);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onPrefsChange).toHaveBeenCalledTimes(1);
    expect(onPrefsChange).toHaveBeenCalledWith({ indentUnit: 4 });
  });

  it('cleanup unsubscribes the forwarders', () => {
    const onContentChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      onContentChange,
    }]);
    const { cleanup } = bindDocument({ slotId: 'slot-A', ...ctx });
    cleanup();
    ctx.internals.contentChange.emit('slot-A', 'after-cleanup');
    expect(onContentChange).not.toHaveBeenCalled();
  });

  it('two slots are isolated — A callback never sees B traffic', () => {
    const aSpy = vi.fn();
    const bSpy = vi.fn();
    const ctx = makeContextWithContributions([
      { slotId: 'slot-A', seed: { kind: 'content', content: 'a' }, onContentChange: aSpy },
      { slotId: 'slot-B', seed: { kind: 'content', content: 'b' }, onContentChange: bSpy },
    ]);
    bindDocument({ slotId: 'slot-A', ...ctx });
    bindDocument({ slotId: 'slot-B', ...ctx });

    ctx.internals.contentChange.emit('slot-A', 'edit-A');
    ctx.internals.contentChange.emit('slot-B', 'edit-B');

    expect(aSpy).toHaveBeenCalledTimes(1);
    expect(aSpy).toHaveBeenCalledWith('edit-A');
    expect(bSpy).toHaveBeenCalledTimes(1);
    expect(bSpy).toHaveBeenCalledWith('edit-B');
  });

  it('setBuffer(...) is observed by the contribution onContentChange', () => {
    let captured!: EditorDocumentChannel;
    const onContentChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'init' },
      bind(c) { captured = c; return () => {}; },
      onContentChange,
    }]);
    bindDocument({ slotId: 'slot-A', ...ctx });
    captured.setBuffer('swapped');
    expect(onContentChange).toHaveBeenCalledWith('swapped');
  });
});

describe('document-binding — preview additions (0.11.0)', () => {
  it('threads seed.render and seed.startInPreview into the resolved options', () => {
    const customRender = (t: string) => `<x>${t}</x>`;
    const ctx = makeContextWithContributions([{
      slotId: 'p1',
      seed: { kind: 'content', content: 'hello', render: customRender, startInPreview: true },
    }]);
    const { entry } = bindDocument({ slotId: 'p1', ...ctx });
    expect(entry.options.render).toBe(customRender);
    expect(entry.options.startInPreview).toBe(true);
  });

  it('setOptions updates seed.render at runtime', () => {
    const r1 = (t: string) => `<a>${t}</a>`;
    const r2 = (t: string) => `<b>${t}</b>`;
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 'p2',
      seed: { kind: 'content', content: '', render: r1 },
      bind(c) { captured = c; return () => {}; },
    }]);
    const { entry, cleanup } = bindDocument({ slotId: 'p2', ...ctx });
    expect(entry.options.render).toBe(r1);
    captured.setOptions({ render: r2 });
    expect(entry.options.render).toBe(r2);
    cleanup();
  });

  it('exposes the bound contribution onLinkClick on the result', () => {
    const onLinkClick = () => 'handled' as const;
    const ctx = makeContextWithContributions([{
      slotId: 'p3',
      seed: { kind: 'content', content: '' },
      onLinkClick,
    }]);
    const result = bindDocument({ slotId: 'p3', ...ctx });
    expect(result.onLinkClick).toBe(onLinkClick);
  });

  it('result.onLinkClick is undefined when no contribution is bound', () => {
    const ctx = makeContextWithContributions([]);
    const result = bindDocument({ slotId: 'p4', ...ctx });
    expect(result.onLinkClick).toBeUndefined();
  });

  it('threads seed.transform into the resolved options', () => {
    const customTransform = (t: string) => `T:${t}`;
    const ctx = makeContextWithContributions([{
      slotId: 'p5',
      seed: { kind: 'content', content: 'hello', transform: customTransform },
    }]);
    const { entry } = bindDocument({ slotId: 'p5', ...ctx });
    expect(entry.options.transform).toBe(customTransform);
  });

  it('setOptions updates seed.transform at runtime', () => {
    const t1 = (t: string) => `1:${t}`;
    const t2 = (t: string) => `2:${t}`;
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 'p6',
      seed: { kind: 'content', content: '', transform: t1 },
      bind(c) { captured = c; return () => {}; },
    }]);
    const { entry, cleanup } = bindDocument({ slotId: 'p6', ...ctx });
    expect(entry.options.transform).toBe(t1);
    captured.setOptions({ transform: t2 });
    expect(entry.options.transform).toBe(t2);
    cleanup();
  });
});

// ============================================================================
// New: path-mode behavior (contract v3)
// ============================================================================

describe('bindDocument — path mode initial load', () => {
  it('opens with disk content when readText returns non-null', async () => {
    const docs = new MockDocuments({ 'value.json': '{"hello":1}' });
    const ctx = makeContextWithContributions([{
      slotId: 's1',
      seed: { kind: 'path', path: 'value.json', language: 'json' },
    }]);
    const { entry } = bindDocument({ slotId: 's1', ...ctx, documents: docs as unknown as DocumentHandle });
    // Synchronous mount: buffer starts empty (no initialContent), filePath
    // chip shows path.
    expect(entry.document.content).toBe('');
    expect(entry.document.filePath).toBe('value.json');
    await flushAsync();
    expect(entry.document.content).toBe('{"hello":1}');
    expect(entry.document.dirty).toBe(false);
  });

  it('falls back to initialContent when readText returns null', async () => {
    const docs = new MockDocuments();
    const ctx = makeContextWithContributions([{
      slotId: 's2',
      seed: { kind: 'path', path: 'new.txt', initialContent: 'starter' },
    }]);
    const { entry } = bindDocument({ slotId: 's2', ...ctx, documents: docs as unknown as DocumentHandle });
    expect(entry.document.content).toBe('starter');
    await flushAsync();
    // Still 'starter' because the file didn't exist; no write happens until Save.
    expect(entry.document.content).toBe('starter');
    expect(docs.writeCalls).toHaveLength(0);
  });

  it('does not overwrite in-flight edits when readText resolves late', async () => {
    const docs = new MockDocuments({ 'value.json': 'disk-version' });
    const ctx = makeContextWithContributions([{
      slotId: 's3',
      seed: { kind: 'path', path: 'value.json' },
    }]);
    const { entry } = bindDocument({ slotId: 's3', ...ctx, documents: docs as unknown as DocumentHandle });
    // Simulate the user typing before readText resolves.
    entry.document.content = 'user-typed';
    entry.document.dirty = true;
    await flushAsync();
    expect(entry.document.content).toBe('user-typed');
    expect(entry.document.dirty).toBe(true);
  });

  it('does not call readText when seed.path is empty (deferred-bind pattern)', async () => {
    const docs = new MockDocuments();
    const ctx = makeContextWithContributions([{
      slotId: 's-empty',
      // Contribution registers path-mode early with no real path yet; it
      // will call replace({ path: '…' }) once the path is known.
      seed: { kind: 'path', path: '' },
    }]);
    bindDocument({ slotId: 's-empty', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    expect(docs.readCalls).toEqual([]);
  });

  it('does not call readText when seed.path is undefined (contract violation)', async () => {
    const docs = new MockDocuments();
    const ctx = makeContextWithContributions([{
      slotId: 's-undef',
      // Out-of-contract: path is typed required, but runtime-tolerated.
      seed: { kind: 'path', path: undefined as unknown as string },
    }]);
    bindDocument({ slotId: 's-undef', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    expect(docs.readCalls).toEqual([]);
  });

  it('warns and falls back when no DocumentHandle is provided', async () => {
    const warn = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 's4',
      seed: { kind: 'path', path: 'x.md', initialContent: 'fallback' },
    }]);
    const { entry } = bindDocument({ slotId: 's4', ...ctx, warn });
    expect(warn).toHaveBeenCalled();
    expect(entry.document.content).toBe('fallback');
  });
});

describe('bindDocument — path mode save flow', () => {
  it('writes buffer to disk on save and clears dirty', async () => {
    const docs = new MockDocuments({ 'value.json': 'orig' });
    const onSave = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 's5',
      seed: { kind: 'path', path: 'value.json' },
      onSave,
    }]);
    const { entry } = bindDocument({ slotId: 's5', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    entry.document.content = 'edited';
    entry.document.dirty = true;
    ctx.internals.saveEvent.emit('s5');
    await flushAsync();
    expect(docs.writeCalls).toEqual([{ path: 'value.json', content: 'edited' }]);
    expect(entry.document.dirty).toBe(false);
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('save creates the file when it did not exist (lastPersisted was null)', async () => {
    const docs = new MockDocuments();
    const ctx = makeContextWithContributions([{
      slotId: 's6',
      seed: { kind: 'path', path: 'new.txt', initialContent: 'seed' },
    }]);
    const { entry } = bindDocument({ slotId: 's6', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    entry.document.content = 'seed';
    entry.document.dirty = true;
    ctx.internals.saveEvent.emit('s6');
    await flushAsync();
    expect(docs.writeCalls).toEqual([{ path: 'new.txt', content: 'seed' }]);
    expect(docs.files.get('new.txt')).toBe('seed');
  });

  it('save error keeps dirty true and does not fire onSave', async () => {
    const docs = new MockDocuments();
    docs.writeText = () => Promise.reject(new Error('boom'));
    const onSave = vi.fn();
    const warn = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 's7',
      seed: { kind: 'path', path: 'x.md', initialContent: '' },
      onSave,
    }]);
    const { entry } = bindDocument({ slotId: 's7', ...ctx, documents: docs as unknown as DocumentHandle, warn });
    await flushAsync();
    entry.document.content = 'unsaved';
    entry.document.dirty = true;
    ctx.internals.saveEvent.emit('s7');
    await flushAsync();
    expect(entry.document.dirty).toBe(true);
    expect(onSave).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
  });

  it('save filters by slotId — other slots do not trigger writes', async () => {
    const docs = new MockDocuments();
    const ctx = makeContextWithContributions([{
      slotId: 's8',
      seed: { kind: 'path', path: 'a.md', initialContent: '' },
    }]);
    bindDocument({ slotId: 's8', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    ctx.internals.saveEvent.emit('other-slot');
    await flushAsync();
    expect(docs.writeCalls).toHaveLength(0);
  });
});

describe('bindDocument — path mode external watch', () => {
  it('updates buffer on external write when clean', async () => {
    const docs = new MockDocuments({ 'x.md': 'v1' });
    const ctx = makeContextWithContributions([{
      slotId: 's9',
      seed: { kind: 'path', path: 'x.md' },
    }]);
    const { entry } = bindDocument({ slotId: 's9', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    expect(entry.document.content).toBe('v1');
    docs.emitExternal('x.md', 'v2');
    await flushAsync();
    expect(entry.document.content).toBe('v2');
    expect(entry.document.dirty).toBe(false);
  });

  it('skips external update when buffer is dirty', async () => {
    const docs = new MockDocuments({ 'x.md': 'v1' });
    const warn = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 's10',
      seed: { kind: 'path', path: 'x.md' },
    }]);
    const { entry } = bindDocument({ slotId: 's10', ...ctx, documents: docs as unknown as DocumentHandle, warn });
    await flushAsync();
    entry.document.content = 'local-edit';
    entry.document.dirty = true;
    docs.emitExternal('x.md', 'external');
    await flushAsync();
    expect(entry.document.content).toBe('local-edit');
    expect(warn).toHaveBeenCalled();
  });

  it('ignores own-write echo from the save path', async () => {
    const docs = new MockDocuments({ 'x.md': 'v1' });
    const contentSpy = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 's11',
      seed: { kind: 'path', path: 'x.md' },
    }]);
    const { entry } = bindDocument({ slotId: 's11', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    ctx.internals.contentChange.on(contentSpy);
    entry.document.content = 'v2';
    entry.document.dirty = true;
    ctx.internals.saveEvent.emit('s11');
    await flushAsync();
    // After save, an echo event fires (queueMicrotask in mock writeText).
    // contentChange should NOT be re-emitted for the echo — the buffer is
    // already 'v2'.
    const sawWatchTriggeredChange = contentSpy.mock.calls.some(
      (c) => c[1] === 'v2' && c[0] === 's11',
    );
    expect(sawWatchTriggeredChange).toBe(false);
  });

  it('ignores events for other paths', async () => {
    const docs = new MockDocuments({ 'x.md': 'v1', 'y.md': 'other' });
    const ctx = makeContextWithContributions([{
      slotId: 's12',
      seed: { kind: 'path', path: 'x.md' },
    }]);
    const { entry } = bindDocument({ slotId: 's12', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    docs.emitExternal('y.md', 'other-v2');
    await flushAsync();
    expect(entry.document.content).toBe('v1');
  });
});

describe('bindDocument — path mode openPath swap', () => {
  it('swaps to a new path, reads it, clears history', async () => {
    const docs = new MockDocuments({ 'a.md': 'A', 'b.md': 'B' });
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 's13',
      seed: { kind: 'path', path: 'a.md' },
      bind(c) { captured = c; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 's13', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    expect(entry.document.content).toBe('A');
    ctx.internals.history('s13').push({ apply() {}, revert() {} });
    captured.openPath('b.md');
    await flushAsync();
    expect(entry.document.content).toBe('B');
    expect(entry.document.filePath).toBe('b.md');
    expect(ctx.internals.history('s13').canUndo).toBe(false);
  });

  it('flushes dirty buffer to the OLD path before swapping', async () => {
    const docs = new MockDocuments({ 'a.md': 'A', 'b.md': 'B' });
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 's14',
      seed: { kind: 'path', path: 'a.md' },
      bind(c) { captured = c; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 's14', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    entry.document.content = 'A-modified';
    entry.document.dirty = true;
    captured.openPath('b.md');
    await flushAsync();
    expect(docs.files.get('a.md')).toBe('A-modified');
    expect(entry.document.content).toBe('B');
  });

  it('swap to a non-existent path resets buffer to empty', async () => {
    const docs = new MockDocuments({ 'a.md': 'A' });
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 's15',
      seed: { kind: 'path', path: 'a.md' },
      bind(c) { captured = c; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 's15', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    captured.openPath('nope.md');
    await flushAsync();
    expect(entry.document.content).toBe('');
    expect(entry.document.filePath).toBe('nope.md');
  });

  it('setBuffer(...) in path mode pokes buffer without writing', async () => {
    const docs = new MockDocuments({ 'a.md': 'A' });
    let captured!: EditorDocumentChannel;
    const ctx = makeContextWithContributions([{
      slotId: 's16',
      seed: { kind: 'path', path: 'a.md' },
      bind(c) { captured = c; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 's16', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    captured.setBuffer('poked');
    expect(entry.document.content).toBe('poked');
    // Dirty becomes true because lastPersisted='A' and buffer='poked'.
    expect(entry.document.dirty).toBe(true);
    // No write happened.
    expect(docs.writeCalls).toHaveLength(0);
  });
});

describe('bindDocument — path mode cleanup', () => {
  it('cleanup unsubscribes the watcher', async () => {
    const docs = new MockDocuments({ 'x.md': 'v1' });
    const ctx = makeContextWithContributions([{
      slotId: 's17',
      seed: { kind: 'path', path: 'x.md' },
    }]);
    const { entry, cleanup } = bindDocument({ slotId: 's17', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    expect(docs.watchers).toHaveLength(1);
    cleanup();
    expect(docs.watchers).toHaveLength(0);
    // Late external events do not mutate the entry.
    docs.emitExternal('x.md', 'late');
    await flushAsync();
    expect(entry.document.content).toBe('v1');
  });
});

describe('bindDocument — path mode dirty reconciliation', () => {
  it('flips dirty=false when content reverts to lastPersisted (undo case)', async () => {
    const docs = new MockDocuments({ 'a.md': 'orig' });
    const onDirtyChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 's-rec-1',
      seed: { kind: 'path', path: 'a.md' },
      onDirtyChange,
    }]);
    const { entry } = bindDocument({ slotId: 's-rec-1', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync(); // lastPersisted = 'orig'
    onDirtyChange.mockClear();

    // Simulate Editor.svelte's pushContent: ratchet dirty=true and emit contentChange.
    entry.document.content = 'edited';
    entry.document.dirty = true;
    ctx.internals.contentChange.emit('s-rec-1', 'edited');
    expect(entry.document.dirty).toBe(true);
    expect(onDirtyChange).not.toHaveBeenCalled(); // we didn't fire dirtyChange manually

    // Now simulate undo: content returns to 'orig' via setContent's contentChange emit.
    entry.document.content = 'orig';
    ctx.internals.contentChange.emit('s-rec-1', 'orig');
    expect(entry.document.dirty).toBe(false);
    expect(onDirtyChange).toHaveBeenLastCalledWith(false);
  });

  it('flips dirty=true when content diverges from lastPersisted', async () => {
    const docs = new MockDocuments({ 'a.md': 'orig' });
    const onDirtyChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 's-rec-2',
      seed: { kind: 'path', path: 'a.md' },
      onDirtyChange,
    }]);
    const { entry } = bindDocument({ slotId: 's-rec-2', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    onDirtyChange.mockClear();
    expect(entry.document.dirty).toBe(false);

    entry.document.content = 'edited';
    ctx.internals.contentChange.emit('s-rec-2', 'edited');
    expect(entry.document.dirty).toBe(true);
    expect(onDirtyChange).toHaveBeenLastCalledWith(true);
  });

  it('skips reconciliation when lastPersisted is null (new-file case)', async () => {
    const docs = new MockDocuments(); // file does not exist
    const onDirtyChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 's-rec-3',
      seed: { kind: 'path', path: 'new.txt', initialContent: '' },
      onDirtyChange,
    }]);
    const { entry } = bindDocument({ slotId: 's-rec-3', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync(); // lastPersisted stays null
    onDirtyChange.mockClear();

    // Simulate typing — Editor.svelte would set dirty=true; our reconciler must not undo that.
    entry.document.content = 'typed';
    entry.document.dirty = true;
    ctx.internals.contentChange.emit('s-rec-3', 'typed');
    expect(entry.document.dirty).toBe(true);

    // And undoing back to '' must NOT clear dirty (no canonical snapshot to compare to).
    entry.document.content = '';
    ctx.internals.contentChange.emit('s-rec-3', '');
    expect(entry.document.dirty).toBe(true);
    expect(onDirtyChange).not.toHaveBeenCalled();
  });

  it('ignores contentChange events for other slots', async () => {
    const docs = new MockDocuments({ 'a.md': 'orig' });
    const onDirtyChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 's-rec-4',
      seed: { kind: 'path', path: 'a.md' },
      onDirtyChange,
    }]);
    const { entry } = bindDocument({ slotId: 's-rec-4', ...ctx, documents: docs as unknown as DocumentHandle });
    await flushAsync();
    entry.document.dirty = true;
    onDirtyChange.mockClear();

    ctx.internals.contentChange.emit('other-slot', 'orig');
    expect(entry.document.dirty).toBe(true);
    expect(onDirtyChange).not.toHaveBeenCalled();
  });
});
