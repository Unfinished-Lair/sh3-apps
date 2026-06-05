import { describe, it, expect, vi } from 'vitest';
import { bindDocument, bindDocumentLive, type BindDocumentResult } from './document-binding';
import { InstanceRegistry } from './model/instance-registry.svelte';
import { createApi } from './model/api';
import type { OpenDocumentOptions } from './types';
import {
  EDITOR_DOCUMENT_POINT,
  type EditorDocumentContribution,
} from './contributions';

// ============================================================================
// Test helpers — a contributions stub whose descriptor list is mutable and
// whose onChange listeners can be fired, so we can simulate a contribution
// that registers AFTER the view has already mounted.
// ============================================================================

function makeLiveContext() {
  const registry = new InstanceRegistry();
  const { internals } = createApi(registry);
  const descriptors: EditorDocumentContribution[] = [];
  const listeners = new Set<() => void>();

  const contributions = {
    list: <T>(pointId: string): T[] =>
      pointId === EDITOR_DOCUMENT_POINT ? (descriptors as unknown as T[]) : [],
    register: <T>(_p: string, _d: T) => () => {},
    onChange: (pointId: string, cb: () => void) => {
      if (pointId !== EDITOR_DOCUMENT_POINT) return () => {};
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    onAnyChange: (_cb: (p: string) => void) => () => {},
    listPoints: () => [EDITOR_DOCUMENT_POINT],
  };

  /** Register a descriptor late and notify subscribers, mirroring the real
   *  ContributionsApi.register + onChange fan-out. */
  const addDescriptor = (d: EditorDocumentContribution) => {
    descriptors.push(d);
    for (const cb of [...listeners]) cb();
  };

  const listenerCount = () => listeners.size;

  const defaultOptions: OpenDocumentOptions = { content: 'Hello, World' };
  return { registry, internals, contributions, defaultOptions, addDescriptor, listenerCount };
}

/** Records every (re)mount the orchestrator drives, returning a disposer spy
 *  per call so tests can assert teardown ordering. */
function makeViewRecorder() {
  const mounts: Array<{ result: BindDocumentResult; off: ReturnType<typeof vi.fn> }> = [];
  const mountView = (result: BindDocumentResult) => {
    const off = vi.fn();
    mounts.push({ result, off });
    return off;
  };
  return { mounts, mountView };
}

// ============================================================================
// matched flag on bindDocument
// ============================================================================

describe('bindDocument — matched flag', () => {
  it('reports matched=false when falling back to the placeholder', () => {
    const ctx = makeLiveContext();
    const result = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(result.matched).toBe(false);
  });

  it('reports matched=true when a contribution is bound', () => {
    const ctx = makeLiveContext();
    ctx.addDescriptor({ slotId: 'slot-A', seed: { kind: 'content', content: 'real' } });
    const result = bindDocument({ slotId: 'slot-A', ...ctx });
    expect(result.matched).toBe(true);
  });
});

// ============================================================================
// bindDocumentLive — late re-binding orchestration
// ============================================================================

describe('bindDocumentLive — already-matching contribution', () => {
  it('mounts once and never subscribes when a contribution already matches', () => {
    const ctx = makeLiveContext();
    ctx.addDescriptor({ slotId: 'slot-A', seed: { kind: 'content', content: 'real' } });
    const { mounts } = makeViewRecorder();
    const rec = makeViewRecorder();

    bindDocumentLive({ slotId: 'slot-A', ...ctx, mountView: rec.mountView });

    expect(rec.mounts).toHaveLength(1);
    expect(rec.mounts[0].result.matched).toBe(true);
    expect(rec.mounts[0].result.entry.document.content).toBe('real');
    expect(ctx.listenerCount()).toBe(0);
    expect(mounts).toHaveLength(0); // sanity: unused recorder untouched
  });
});

describe('bindDocumentLive — late registration', () => {
  it('shows the placeholder, then re-mounts with the real document when a contribution registers late', () => {
    const ctx = makeLiveContext();
    const rec = makeViewRecorder();

    bindDocumentLive({ slotId: 'slot-A', ...ctx, mountView: rec.mountView });

    // Initial mount: placeholder, watching for a late contribution.
    expect(rec.mounts).toHaveLength(1);
    expect(rec.mounts[0].result.matched).toBe(false);
    expect(rec.mounts[0].result.entry.document.content).toBe('Hello, World');
    expect(ctx.listenerCount()).toBe(1);

    // A contribution for this slot registers after mount.
    ctx.addDescriptor({
      slotId: 'slot-A',
      seed: { kind: 'content', content: 'arrived-late', language: 'rust' },
    });

    // The placeholder view is torn down and a fresh one mounts with real content.
    expect(rec.mounts[0].off).toHaveBeenCalledTimes(1);
    expect(rec.mounts).toHaveLength(2);
    expect(rec.mounts[1].result.matched).toBe(true);
    expect(rec.mounts[1].result.entry.document.content).toBe('arrived-late');
    expect(rec.mounts[1].result.entry.document.language).toBe('rust');
  });

  it('ignores a late contribution registered for a different slot', () => {
    const ctx = makeLiveContext();
    const rec = makeViewRecorder();

    bindDocumentLive({ slotId: 'slot-A', ...ctx, mountView: rec.mountView });
    ctx.addDescriptor({ slotId: 'slot-OTHER', seed: { kind: 'content', content: 'nope' } });

    expect(rec.mounts).toHaveLength(1);
    expect(rec.mounts[0].off).not.toHaveBeenCalled();
  });

  it('stops watching after a successful re-bind', () => {
    const ctx = makeLiveContext();
    const rec = makeViewRecorder();

    bindDocumentLive({ slotId: 'slot-A', ...ctx, mountView: rec.mountView });
    ctx.addDescriptor({ slotId: 'slot-A', seed: { kind: 'content', content: 'first' } });
    expect(rec.mounts).toHaveLength(2);
    expect(ctx.listenerCount()).toBe(0);

    // A further registry change must not drive a third mount.
    ctx.addDescriptor({ slotId: 'slot-A', seed: { kind: 'content', content: 'second' } });
    expect(rec.mounts).toHaveLength(2);
  });

  it('does not clobber a placeholder the user has edited (dirty) and warns', () => {
    const ctx = makeLiveContext();
    const warn = vi.fn();
    const rec = makeViewRecorder();

    bindDocumentLive({ slotId: 'slot-A', ...ctx, warn, mountView: rec.mountView });
    // User typed into the placeholder before any contribution arrived.
    rec.mounts[0].result.entry.document.dirty = true;

    ctx.addDescriptor({ slotId: 'slot-A', seed: { kind: 'content', content: 'real' } });

    expect(rec.mounts).toHaveLength(1); // no re-mount
    expect(rec.mounts[0].off).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
  });
});

describe('bindDocumentLive — cleanup', () => {
  it('cleanup unmounts the current view, disposes the binding, and stops watching', () => {
    const ctx = makeLiveContext();
    const rec = makeViewRecorder();

    const handle = bindDocumentLive({ slotId: 'slot-A', ...ctx, mountView: rec.mountView });
    expect(ctx.listenerCount()).toBe(1);

    handle.cleanup();
    expect(rec.mounts[0].off).toHaveBeenCalledTimes(1);
    expect(ctx.listenerCount()).toBe(0);

    // A contribution registering after cleanup must not drive a new mount.
    ctx.addDescriptor({ slotId: 'slot-A', seed: { kind: 'content', content: 'too-late' } });
    expect(rec.mounts).toHaveLength(1);
  });

  it('cleanup after a re-bind tears down the second view, not the first', () => {
    const ctx = makeLiveContext();
    const rec = makeViewRecorder();

    const handle = bindDocumentLive({ slotId: 'slot-A', ...ctx, mountView: rec.mountView });
    ctx.addDescriptor({ slotId: 'slot-A', seed: { kind: 'content', content: 'real' } });
    expect(rec.mounts).toHaveLength(2);

    // First view's disposer already ran during the re-bind.
    expect(rec.mounts[0].off).toHaveBeenCalledTimes(1);
    rec.mounts[0].off.mockClear();

    handle.cleanup();
    expect(rec.mounts[1].off).toHaveBeenCalledTimes(1);
    expect(rec.mounts[0].off).not.toHaveBeenCalled();
  });
});
