import { describe, it, expect } from 'vitest';
import { bindDocument } from './document-binding';
import { InstanceRegistry } from './model/instance-registry.svelte';
import { createApi } from './model/api';
import type { OpenDocumentOptions } from './types';

function makeContext() {
  const registry = new InstanceRegistry();
  const { internals } = createApi(registry);
  // Minimal ContributionsApi mock — list returns [], register/onChange are no-ops.
  const contributions = {
    list: <T>(_pointId: string): T[] => [],
    register: <T>(_pointId: string, _desc: T) => () => {},
    onChange: (_pointId: string, _cb: () => void) => () => {},
    listPoints: () => [] as string[],
  };
  const defaultOptions: OpenDocumentOptions = { content: 'Hello, World' };
  return { registry, internals, contributions, defaultOptions };
}

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

import { vi } from 'vitest';
import { EDITOR_DOCUMENT_POINT, type EditorDocumentContribution, type EditorDocumentSeed } from './contributions';

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
    listPoints: () => [EDITOR_DOCUMENT_POINT],
  };
  const defaultOptions: OpenDocumentOptions = { content: 'Hello, World' };
  return { registry, internals, contributions, defaultOptions };
}

describe('bindDocument — contribution lookup', () => {
  it('seeds the entry from a matching contribution', () => {
    const ctx = makeContextWithContributions([
      {
        slotId: 'slot-A',
        seed: { content: 'from-contribution', language: 'rust' },
      },
    ]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(entry.document.content).toBe('from-contribution');
    expect(entry.document.language).toBe('rust');
  });

  it('ignores contributions with mismatched slotId', () => {
    const ctx = makeContextWithContributions([
      { slotId: 'slot-OTHER', seed: { content: 'other' } },
    ]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(entry.document.content).toBe('Hello, World');
  });

  it('first registered wins on slotId collision and warns', () => {
    const warn = vi.fn();
    const ctx = makeContextWithContributions([
      { slotId: 'slot-A', seed: { content: 'first' } },
      { slotId: 'slot-A', seed: { content: 'second' } },
    ]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx, warn });
    expect(entry.document.content).toBe('first');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('slot-A');
  });

  it('does not re-seed a registry entry that already exists (open beats seed)', () => {
    const ctx = makeContextWithContributions([
      { slotId: 'slot-A', seed: { content: 'from-seed' } },
    ]);
    ctx.registry.open('slot-A', { content: 'from-imperative-open' });
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(entry.document.content).toBe('from-imperative-open');
  });
});

describe('bindDocument — replace swap channel', () => {
  it('captures replace via bind() at mount and disposes on cleanup', () => {
    let captured: ((next: Partial<EditorDocumentSeed>) => void) | null = null;
    let disposed = false;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { content: 'init' },
      bind(replace) {
        captured = replace;
        return () => { disposed = true; };
      },
    }]);
    const { cleanup } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(captured).toBeTypeOf('function');
    cleanup();
    expect(disposed).toBe(true);
  });

  it('replace({ content }) mutates entry, clears history, fires events', () => {
    let captured!: (next: Partial<EditorDocumentSeed>) => void;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { content: 'init' },
      bind(r) { captured = r; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });

    // Seed the history with one push so we can observe the clear.
    ctx.internals.history('slot-A').push({ apply() {}, revert() {} });
    expect(ctx.internals.history('slot-A').canUndo).toBe(true);

    const contentSpy = vi.fn();
    const dirtySpy = vi.fn();
    ctx.internals.contentChange.on(contentSpy);
    ctx.internals.dirtyChange.on(dirtySpy);

    captured({ content: 'next' });

    expect(entry.document.content).toBe('next');
    expect(entry.document.cursorStart).toBe(0);
    expect(entry.document.cursorEnd).toBe(0);
    expect(entry.document.dirty).toBe(false);
    expect(ctx.internals.history('slot-A').canUndo).toBe(false);
    expect(contentSpy).toHaveBeenCalledWith('slot-A', 'next');
    expect(dirtySpy).toHaveBeenCalledWith('slot-A', false);
  });

  it('replace({ content: same }) is silent', () => {
    let captured!: (next: Partial<EditorDocumentSeed>) => void;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { content: 'init' },
      bind(r) { captured = r; return () => {}; },
    }]);
    bindDocument({ slotId: 'slot-A', ...ctx });
    const contentSpy = vi.fn();
    ctx.internals.contentChange.on(contentSpy);
    captured({ content: 'init' });
    expect(contentSpy).not.toHaveBeenCalled();
  });

  it('field-only replace does not fire content events', () => {
    let captured!: (next: Partial<EditorDocumentSeed>) => void;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { content: 'init' },
      bind(r) { captured = r; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    const contentSpy = vi.fn();
    ctx.internals.contentChange.on(contentSpy);

    captured({ language: 'rust', filePath: '/x.rs' });

    expect(entry.document.language).toBe('rust');
    expect(entry.document.filePath).toBe('/x.rs');
    expect(contentSpy).not.toHaveBeenCalled();
  });

  it('replace updates wrapper options (toolbarActions, fontSize, etc.)', () => {
    let captured!: (next: Partial<EditorDocumentSeed>) => void;
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { content: 'init' },
      bind(r) { captured = r; return () => {}; },
    }]);
    const { entry } = bindDocument({ slotId: 'slot-A', ...ctx });
    const action = { id: 'a', label: 'A', onAction: () => {} };
    captured({ toolbarActions: [action], fontSize: 18 });
    expect(entry.options.toolbarActions).toEqual([action]);
    expect(entry.options.fontSize).toBe(18);
  });

  it('cleanup is safe when bind returned no disposer', () => {
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { content: 'init' },
      bind(_r) { /* no return — disposer is optional */ },
    }]);
    const { cleanup } = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(() => cleanup()).not.toThrow();
  });
});

describe('bindDocument — edit-flow-back forwarders', () => {
  it('onContentChange fires only for matching slotId', () => {
    const onContentChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { content: 'init' },
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
      seed: { content: 'init' },
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
      seed: { content: 'init' },
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
      { slotId: 'slot-A', seed: { content: 'a' }, onContentChange: aSpy },
      { slotId: 'slot-B', seed: { content: 'b' }, onContentChange: bSpy },
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

  it('replace({ content }) is observed by the contribution onContentChange', () => {
    let captured!: (next: Partial<EditorDocumentSeed>) => void;
    const onContentChange = vi.fn();
    const ctx = makeContextWithContributions([{
      slotId: 'slot-A',
      seed: { content: 'init' },
      bind(r) { captured = r; return () => {}; },
      onContentChange,
    }]);
    bindDocument({ slotId: 'slot-A', ...ctx });
    captured({ content: 'swapped' });
    expect(onContentChange).toHaveBeenCalledWith('swapped');
  });
});

describe('document-binding — preview additions (0.11.0)', () => {
  it('threads seed.render and seed.startInPreview into the resolved options', () => {
    const customRender = (t: string) => `<x>${t}</x>`;
    const ctx = makeContextWithContributions([{
      slotId: 'p1',
      seed: { content: 'hello', render: customRender, startInPreview: true },
    }]);
    const { entry } = bindDocument({ slotId: 'p1', ...ctx });
    expect(entry.options.render).toBe(customRender);
    expect(entry.options.startInPreview).toBe(true);
  });

  it('makeReplace updates seed.render at runtime', () => {
    const r1 = (t: string) => `<a>${t}</a>`;
    const r2 = (t: string) => `<b>${t}</b>`;
    let captured!: (next: Partial<EditorDocumentSeed>) => void;
    const ctx = makeContextWithContributions([{
      slotId: 'p2',
      seed: { content: '', render: r1 },
      bind(r) { captured = r; return () => {}; },
    }]);
    const { entry, cleanup } = bindDocument({ slotId: 'p2', ...ctx });
    expect(entry.options.render).toBe(r1);
    captured({ render: r2 });
    expect(entry.options.render).toBe(r2);
    cleanup();
  });

  it('exposes the bound contribution onLinkClick on the result', () => {
    const onLinkClick = () => 'handled' as const;
    const ctx = makeContextWithContributions([{
      slotId: 'p3',
      seed: { content: '' },
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
      seed: { content: 'hello', transform: customTransform },
    }]);
    const { entry } = bindDocument({ slotId: 'p5', ...ctx });
    expect(entry.options.transform).toBe(customTransform);
  });

  it('makeReplace updates seed.transform at runtime', () => {
    const t1 = (t: string) => `1:${t}`;
    const t2 = (t: string) => `2:${t}`;
    let captured!: (next: Partial<EditorDocumentSeed>) => void;
    const ctx = makeContextWithContributions([{
      slotId: 'p6',
      seed: { content: '', transform: t1 },
      bind(r) { captured = r; return () => {}; },
    }]);
    const { entry, cleanup } = bindDocument({ slotId: 'p6', ...ctx });
    expect(entry.options.transform).toBe(t1);
    captured({ transform: t2 });
    expect(entry.options.transform).toBe(t2);
    cleanup();
  });
});
