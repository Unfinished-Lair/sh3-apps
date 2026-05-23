import { describe, it, expect, vi, beforeEach } from 'vitest';

// Stub `sh3` from sh3-core so the discover-types action can open a fake
// float and tests can introspect what it called.
const { fakeFloatStore, fakeFloatManager, resetFakeFloatState } = vi.hoisted(() => {
  const fakeFloatStore: Array<{
    id: string;
    content: { type: 'tabs'; tabs: Array<{ slotId: string; viewId: string; label: string }> };
    position: { x: number; y: number };
    size: { w: number; h: number };
    title?: string;
  }> = [];
  const counter = { n: 0 };
  const fakeFloatManager = {
    open: vi.fn((viewId: string, options?: { title?: string; size?: { w: number; h: number }; position?: { x: number; y: number } }) => {
      counter.n += 1;
      const slotId = `float:${viewId}:${counter.n}`;
      const id = `float-${counter.n}`;
      fakeFloatStore.push({
        id,
        content: { type: 'tabs', tabs: [{ slotId, viewId, label: options?.title ?? viewId }] },
        position: options?.position ?? { x: 0, y: 0 },
        size: options?.size ?? { w: 600, h: 400 },
        title: options?.title,
      });
      return id;
    }),
    close: vi.fn((id: string) => {
      const idx = fakeFloatStore.findIndex(f => f.id === id);
      if (idx >= 0) fakeFloatStore.splice(idx, 1);
    }),
    list: vi.fn(() => fakeFloatStore.slice()),
    focus: vi.fn(),
  };
  const resetFakeFloatState = () => {
    fakeFloatStore.length = 0;
    counter.n = 0;
    fakeFloatManager.open.mockClear();
    fakeFloatManager.list.mockClear();
  };
  return { fakeFloatStore, fakeFloatManager, resetFakeFloatState };
});

vi.mock('sh3-core', () => ({
  sh3: {
    float: fakeFloatManager,
  },
}));

import { inspectorFiddleShard, buildCatalogMarkdown } from './shard.svelte';
import { STARTER_VALUE, STARTER_VALUE_TEXT, STARTER_META_TEXT } from './starter';
import { EDITOR_DOCUMENT_POINT } from '@unfinished-lair/sh3-editor/contributions';
import type {
  EditorDocumentChannel,
  EditorDocumentContribution,
  EditorPathSeed,
  EditorContentSeed,
} from '@unfinished-lair/sh3-editor/contributions';
import {
  INSPECTOR_INSTANCE_POINT,
  type InspectorInstanceContribution,
  type InspectorBindHandle,
} from '@unfinished-lair/sh3-editor/inspector/contributions';
import type { ToolbarAction } from '@unfinished-lair/sh3-editor';

const APP_ID = 'inspector-fiddle-app';

// ----------------------------------------------------------------------------
// In-memory DocumentHandle mock — covers readText / writeText / watch.
// ----------------------------------------------------------------------------

class FakeDocs {
  files: Record<string, string> = {};

  constructor(seed: Record<string, string> = {}) {
    this.files = { ...seed };
  }

  readText = vi.fn(async (path: string): Promise<string | null> => {
    return path in this.files ? this.files[path] : null;
  });
  writeText = vi.fn(async (path: string, content: string): Promise<void> => {
    this.files[path] = content;
  });
  watch = vi.fn((_cb: (...args: unknown[]) => void) => () => {});
  // Stubs to satisfy DocumentHandle when cast.
  readBinary = vi.fn(async () => null);
  readJson   = vi.fn(async () => null);
  writeBinary = vi.fn(async () => {});
  writeJson   = vi.fn(async () => {});
  delete      = vi.fn(async () => {});
  rename      = vi.fn(async () => {});
  mkdir       = vi.fn(async () => {});
  rmdir       = vi.fn(async () => {});
  renameFolder = vi.fn(async () => {});
  list        = vi.fn(async () => []);
  listFolders = vi.fn(async () => []);
  exists      = vi.fn(async (p: string) => p in this.files);
  status      = vi.fn(async () => null);
  resolveConflict = vi.fn(async () => {});
  readBranch  = vi.fn(async () => null);
  dispose     = vi.fn(() => {});
}

// ----------------------------------------------------------------------------
// Fake ShardContext
// ----------------------------------------------------------------------------

interface FakeCtxOptions {
  zone?: { liveSync?: boolean };
  documents?: FakeDocs;
  contributionsByPoint?: Record<string, unknown[]>;
}

function makeCtx(opts?: FakeCtxOptions) {
  const o = opts ?? {};
  const docs = o.documents ?? new FakeDocs();
  const contributionsByPoint = o.contributionsByPoint ?? {};

  const zone = {
    workspace: { liveSync: o.zone?.liveSync ?? false },
  };

  const registered: { pointId: string; descriptor: unknown }[] = [];

  return {
    docs,
    zone,
    registered,
    ctx: {
      state: vi.fn(<T,>(initial: T) => {
        if ((initial as any).workspace) {
          (initial as any).workspace = { ...(initial as any).workspace, ...zone.workspace };
        }
        zone.workspace = (initial as any).workspace;
        return initial as any;
      }),
      registerView: vi.fn(),
      documents: docs as any,
      contributions: {
        register: vi.fn((pointId: string, descriptor: unknown) => {
          registered.push({ pointId, descriptor });
          return () => {};
        }),
        list:       vi.fn((pointId: string) => contributionsByPoint[pointId] ?? []),
        onChange:   vi.fn(() => () => {}),
        onAnyChange: vi.fn(() => () => {}),
        listPoints: vi.fn(() => Object.keys(contributionsByPoint)),
      },
    } as any,
  };
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function pathSeed(d: EditorDocumentContribution): EditorPathSeed {
  if (d.seed.kind !== 'path') throw new Error(`expected path seed, got ${d.seed.kind}`);
  return d.seed;
}
function contentSeed(d: EditorDocumentContribution): EditorContentSeed {
  if (d.seed.kind !== 'content') throw new Error(`expected content seed, got ${d.seed.kind}`);
  return d.seed;
}

function findInspectorDesc(registered: { pointId: string; descriptor: unknown }[]) {
  return registered.find(r => r.pointId === INSPECTOR_INSTANCE_POINT)!
    .descriptor as InspectorInstanceContribution;
}

/** Records every channel verb call into a single flat array. Each entry has
 *  a `kind` discriminator plus the verb's argument fields spread in, so tests
 *  can read `entry.content` (setBuffer), `entry.path` (openPath), or
 *  `entry.toolbarActions` (setOptions) directly. */
interface FakeChannelCall {
  kind: 'setBuffer' | 'openPath' | 'setOptions';
  content?: string;
  path?: string;
  toolbarActions?: ToolbarAction[];
  [key: string]: any;
}

function fakeChannel(onSetBuffer?: (content: string) => void): {
  channel: EditorDocumentChannel;
  calls: FakeChannelCall[];
} {
  const calls: FakeChannelCall[] = [];
  const channel: EditorDocumentChannel = {
    setBuffer(content) {
      calls.push({ kind: 'setBuffer', content });
      onSetBuffer?.(content);
    },
    openPath(path) {
      calls.push({ kind: 'openPath', path });
    },
    setOptions(patch) {
      calls.push({ kind: 'setOptions', ...patch });
    },
  };
  return { channel, calls };
}

function fakeBindHandle(): InspectorBindHandle & { replaceCalls: any[] } {
  const replaceCalls: any[] = [];
  return {
    replace(next: any) { replaceCalls.push(next); },
    history: {
      push: () => {}, undo: () => false, redo: () => false, peek: () => null,
      replaceTop: () => false, canUndo: false, canRedo: false,
      clear: () => {}, onChange: () => () => {},
    },
    replaceCalls,
  } as any;
}

function findInspectorAction(registered: any[], id: string): ToolbarAction {
  const desc = findInspectorDesc(registered);
  const action = desc.seed.toolbarActions?.find((a: ToolbarAction) => a.id === id);
  if (!action) throw new Error(`action ${id} not found`);
  return action;
}

// ============================================================================
// Tests
// ============================================================================

describe('inspectorFiddleShard — manifest', () => {
  it('declares id "inspector-fiddle" and no views', () => {
    expect(inspectorFiddleShard.manifest.id).toBe('inspector-fiddle');
    expect(inspectorFiddleShard.manifest.views ?? []).toEqual([]);
  });
});

describe('inspectorFiddleShard — v3 lifecycle hooks', () => {
  it('register() is a no-op', () => {
    const { ctx } = makeCtx();
    inspectorFiddleShard.register!(ctx);
    expect(ctx.contributions.register).not.toHaveBeenCalled();
  });

  it('onAppActivate is async and accepts (ctx, appId)', async () => {
    const { ctx } = makeCtx();
    await expect(
      inspectorFiddleShard.onAppActivate!(ctx, APP_ID),
    ).resolves.toBeUndefined();
  });
});

describe('inspectorFiddleShard — first-run seeding', () => {
  it('writes value.json + meta.json to documents when missing', async () => {
    const { ctx, docs } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    expect(docs.writeText).toHaveBeenCalledWith('value.json', STARTER_VALUE_TEXT);
    expect(docs.writeText).toHaveBeenCalledWith('meta.json',  STARTER_META_TEXT);
  });

  it('does NOT overwrite existing value.json or meta.json', async () => {
    const docs = new FakeDocs({
      'value.json': '{"hello":"world"}',
      'meta.json':  '{"label":"Custom"}',
    });
    const { ctx } = makeCtx({ documents: docs });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    expect(docs.writeText).not.toHaveBeenCalled();
  });

  it('hydrates live value from existing value.json', async () => {
    const docs = new FakeDocs({
      'value.json': '{"hello":"world"}',
      'meta.json':  STARTER_META_TEXT,
    });
    const { ctx } = makeCtx({ documents: docs });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(JSON.parse(snap.valueText)).toEqual({ hello: 'world' });
  });
});

describe('inspectorFiddleShard — editor contributions', () => {
  it('registers exactly two EDITOR_DOCUMENT_POINT descriptors at fiddle.value / fiddle.meta', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const editorDescs = registered.filter(r => r.pointId === EDITOR_DOCUMENT_POINT);
    expect(editorDescs).toHaveLength(2);

    const slotIds = editorDescs.map(r => (r.descriptor as EditorDocumentContribution).slotId);
    expect(slotIds.sort()).toEqual(['fiddle.meta', 'fiddle.value']);
  });

  it('value descriptor uses path mode with path=value.json and language=json', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const desc = registered.find(r =>
      r.pointId === EDITOR_DOCUMENT_POINT &&
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const seed = pathSeed(desc);
    expect(seed.path).toBe('value.json');
    expect(seed.language).toBe('json');
    expect(seed.initialContent).toBe(STARTER_VALUE_TEXT);
  });

  it('meta descriptor uses path mode with path=meta.json', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const desc = registered.find(r =>
      r.pointId === EDITOR_DOCUMENT_POINT &&
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.meta',
    )!.descriptor as EditorDocumentContribution;
    const seed = pathSeed(desc);
    expect(seed.path).toBe('meta.json');
  });
});

describe('inspectorFiddleShard — inspector contribution', () => {
  it('registers exactly one INSPECTOR_INSTANCE_POINT descriptor at slot fiddle.inspector', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const inspectorDescs = registered.filter(r => r.pointId === INSPECTOR_INSTANCE_POINT);
    expect(inspectorDescs).toHaveLength(1);
    expect((inspectorDescs[0].descriptor as InspectorInstanceContribution).slotId).toBe('fiddle.inspector');
  });

  it('seeds the inspector with the live value and meta', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const desc = findInspectorDesc(registered);
    expect(desc.seed.value).toEqual(STARTER_VALUE);
    expect(desc.seed.meta?.fields?.fg?.type).toBe('color');
  });

  it('onValueChange marks inspectorTouched', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const desc = findInspectorDesc(registered);
    desc.bind?.(fakeBindHandle());
    desc.onValueChange?.({ name: 'edited' });
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.inspectorTouched).toBe(true);
  });

  it('value-editor parse calls inspectorHandle.replace once bind has fired', async () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const inspectorDesc = findInspectorDesc(registered);
    const handle = fakeBindHandle();
    inspectorDesc.bind?.(handle);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    valueDesc.onContentChange!('{"hi":42}');
    vi.advanceTimersByTime(200);

    expect(handle.replaceCalls).toEqual([{ value: { hi: 42 } }]);
    vi.useRealTimers();
  });

  it('meta-editor parse calls inspectorHandle.replace with meta only', async () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const inspectorDesc = findInspectorDesc(registered);
    const handle = fakeBindHandle();
    inspectorDesc.bind?.(handle);

    const metaDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.meta',
    )!.descriptor as EditorDocumentContribution;
    metaDesc.onContentChange!('{"label":"X"}');
    vi.advanceTimersByTime(200);

    expect(handle.replaceCalls).toEqual([{ meta: { label: 'X' } }]);
    vi.useRealTimers();
  });
});

describe('inspectorFiddleShard — sync-to-json toolbar action', () => {
  it('registers an action with id "sync-to-json" on the inspector toolbar', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const action = findInspectorAction(registered, 'sync-to-json');
    expect(action.label).toMatch(/sync/i);
  });

  it('is disabled when inspectorTouched is false', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const action = findInspectorAction(registered, 'sync-to-json');
    expect(action.disabled).toBe(true);
  });

  it('serializes liveValue and calls valueChannel.setBuffer when clicked', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const { channel, calls } = fakeChannel();
    valueDesc.bind?.(channel);

    const inspectorDesc = findInspectorDesc(registered);
    inspectorDesc.bind?.(fakeBindHandle());
    inspectorDesc.onValueChange?.({ name: 'edited' });

    const action = findInspectorAction(registered, 'sync-to-json');
    expect(action.disabled).toBe(false);
    action.onAction();

    const bufferCalls = calls.filter(c => c.kind === 'setBuffer');
    expect(bufferCalls).toHaveLength(1);
    expect(typeof bufferCalls[0].content).toBe('string');
    expect(JSON.parse(bufferCalls[0].content!)).toEqual(STARTER_VALUE);
  });

  it('clears inspectorTouched after a successful sync', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const { channel } = fakeChannel();
    valueDesc.bind?.(channel);

    const inspectorDesc = findInspectorDesc(registered);
    inspectorDesc.bind?.(fakeBindHandle());
    inspectorDesc.onValueChange?.({});

    findInspectorAction(registered, 'sync-to-json').onAction();
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.inspectorTouched).toBe(false);
  });

  it('suppresses the parser when sync triggers a content-change echo', async () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const { channel } = fakeChannel((content) => {
      valueDesc.onContentChange!(content);
    });
    valueDesc.bind?.(channel);

    const inspectorDesc = findInspectorDesc(registered);
    const handle = fakeBindHandle();
    inspectorDesc.bind?.(handle);

    inspectorDesc.onValueChange?.({ name: 'edited' });

    findInspectorAction(registered, 'sync-to-json').onAction();
    vi.advanceTimersByTime(200);

    expect(handle.replaceCalls).toEqual([]);
    vi.useRealTimers();
  });
});

describe('inspectorFiddleShard — live-sync toggle', () => {
  it('registers a toolbar action with id "live-sync"', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const action = findInspectorAction(registered, 'live-sync');
    expect(action.label).toMatch(/live/i);
  });

  it('starts off when zone.liveSync is false', async () => {
    const { ctx } = makeCtx({ zone: { liveSync: false } });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.liveSync).toBe(false);
  });

  it('starts on when zone.liveSync is true (hydration)', async () => {
    const { ctx } = makeCtx({ zone: { liveSync: true } });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.liveSync).toBe(true);
  });

  it('toggle action flips state.liveSync and persists to zone', async () => {
    const { ctx, registered, zone } = makeCtx({ zone: { liveSync: false } });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    findInspectorAction(registered, 'live-sync').onAction();
    expect(zone.workspace.liveSync).toBe(true);
    findInspectorAction(registered, 'live-sync').onAction();
    expect(zone.workspace.liveSync).toBe(false);
  });

  it('off mode: onValueChange does NOT call valueChannel.setBuffer', async () => {
    const { ctx, registered } = makeCtx({ zone: { liveSync: false } });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const { channel, calls } = fakeChannel();
    valueDesc.bind?.(channel);

    const inspectorDesc = findInspectorDesc(registered);
    inspectorDesc.bind?.(fakeBindHandle());
    inspectorDesc.onValueChange?.({ name: 'edited' });
    expect(calls.filter(c => c.kind === 'setBuffer')).toEqual([]);
  });

  it('on mode: onValueChange serializes and calls valueChannel.setBuffer', async () => {
    const { ctx, registered } = makeCtx({ zone: { liveSync: true } });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const { channel, calls } = fakeChannel();
    valueDesc.bind?.(channel);

    const inspectorDesc = findInspectorDesc(registered);
    inspectorDesc.bind?.(fakeBindHandle());
    (inspectorDesc.seed.value as any).name = 'mutated';
    inspectorDesc.onValueChange?.(inspectorDesc.seed.value);

    const bufferCalls = calls.filter(c => c.kind === 'setBuffer');
    expect(bufferCalls).toHaveLength(1);
    expect(JSON.parse(bufferCalls[0].content!).name).toBe('mutated');
  });

  it('loop avoidance — value-editor onContentChange triggered by our own setBuffer does NOT re-run parse', async () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx({ zone: { liveSync: true } });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const inspectorDesc = findInspectorDesc(registered);
    const { channel } = fakeChannel(() => {
      valueDesc.onContentChange!(JSON.stringify(inspectorDesc.seed.value, null, 2));
    });
    valueDesc.bind?.(channel);

    const handle = fakeBindHandle();
    inspectorDesc.bind?.(handle);

    (inspectorDesc.seed.value as any).name = 'mutated';
    inspectorDesc.onValueChange?.(inspectorDesc.seed.value);
    vi.advanceTimersByTime(200);

    expect(handle.replaceCalls).toEqual([]);
    vi.useRealTimers();
  });

  it('loop avoidance — inspector replace triggered by editor parse does NOT re-fire valueChannel.setBuffer', async () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx({ zone: { liveSync: true } });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const { channel, calls } = fakeChannel();
    valueDesc.bind?.(channel);

    const inspectorDesc = findInspectorDesc(registered);
    const handle = fakeBindHandle();
    handle.replace = (next: any) => {
      handle.replaceCalls.push(next);
      if ('value' in next) inspectorDesc.onValueChange?.(next.value);
    };
    inspectorDesc.bind?.(handle);

    valueDesc.onContentChange!('{"a":1}');
    vi.advanceTimersByTime(200);

    expect(handle.replaceCalls).toHaveLength(1);
    expect(calls.filter(c => c.kind === 'setBuffer')).toEqual([]);
    vi.useRealTimers();
  });
});

describe('inspectorFiddleShard — parse error indicators', () => {
  it('starts with no parse-error action on the value editor', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const seed = pathSeed(valueDesc);
    const ids = (seed.toolbarActions ?? []).map(a => a.id);
    expect(ids).not.toContain('value-parse-error');
  });

  it('on parse failure, setOptions is called with a toolbarActions list containing parse-error action', async () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const { channel, calls } = fakeChannel();
    valueDesc.bind?.(channel);

    valueDesc.onContentChange!('{ invalid json');
    vi.advanceTimersByTime(200);

    const last = calls[calls.length - 1];
    const ids = (last?.toolbarActions ?? []).map((a: ToolbarAction) => a.id);
    expect(ids).toContain('value-parse-error');
    const action = last.toolbarActions!.find((a: ToolbarAction) => a.id === 'value-parse-error')!;
    expect(action.disabled).toBe(true);
    expect(action.accent).toBe(true);
    expect(action.label).toMatch(/⚠/);
    vi.useRealTimers();
  });

  it('on parse recovery, setOptions is called with a toolbarActions list NOT containing parse-error action', async () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const { channel, calls } = fakeChannel();
    valueDesc.bind?.(channel);

    valueDesc.onContentChange!('{ broken');
    vi.advanceTimersByTime(200);
    valueDesc.onContentChange!('{"ok":1}');
    vi.advanceTimersByTime(200);

    const last = calls[calls.length - 1];
    const ids = (last?.toolbarActions ?? []).map((a: ToolbarAction) => a.id);
    expect(ids).not.toContain('value-parse-error');
    vi.useRealTimers();
  });

  it('meta editor parse failure pushes a meta-parse-error action', async () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const metaDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.meta',
    )!.descriptor as EditorDocumentContribution;
    const { channel, calls } = fakeChannel();
    metaDesc.bind?.(channel);

    metaDesc.onContentChange!('{ broken meta');
    vi.advanceTimersByTime(200);

    const last = calls[calls.length - 1];
    const ids = (last?.toolbarActions ?? []).map((a: ToolbarAction) => a.id);
    expect(ids).toContain('meta-parse-error');
    vi.useRealTimers();
  });
});

describe('buildCatalogMarkdown', () => {
  it('starts with the catalog title and intro paragraph', () => {
    const md = buildCatalogMarkdown([]);
    expect(md).toMatch(/^# Available inspector renderer types/);
    expect(md).toMatch(/`meta\.type`/);
  });

  it('renders "None registered" when no renderers are passed', () => {
    expect(buildCatalogMarkdown([])).toMatch(/None registered/);
  });

  it('renders one bullet per renderer with both type and id', () => {
    const md = buildCatalogMarkdown([
      { id: 'sh3-editor:color',      type: 'color' },
      { id: 'sh3-chat:chat-message', type: 'chat-message' },
    ]);
    expect(md).toMatch(/`color`.*`sh3-editor:color`/);
    expect(md).toMatch(/`chat-message`.*`sh3-chat:chat-message`/);
    expect(md).not.toMatch(/None registered/);
  });
});

describe('inspectorFiddleShard — discover-types action', () => {
  beforeEach(() => {
    resetFakeFloatState();
  });

  it('registers a toolbar action with id "discover-types"', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);
    const action = findInspectorAction(registered, 'discover-types');
    expect(action.label).toMatch(/types/i);
  });

  it('opens a float mounting sh3-editor:editor and registers a content-mode markdown contribution at its slotId', async () => {
    const { ctx, registered } = makeCtx({
      contributionsByPoint: {
        'sh3-editor.inspectorRenderer': [
          { id: 'sh3-chat:chat-message', type: 'chat-message' },
        ],
      },
    });
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const beforeRegisterCount = registered.length;
    findInspectorAction(registered, 'discover-types').onAction();

    expect(ctx.contributions.list).toHaveBeenCalledWith('sh3-editor.inspectorRenderer');
    expect(fakeFloatManager.open).toHaveBeenCalledWith(
      'sh3-editor:editor',
      expect.objectContaining({ title: expect.stringMatching(/types/i) }),
    );

    const newRegistrations = registered.slice(beforeRegisterCount);
    const editorRegistration = newRegistrations.find(
      r => r.pointId === EDITOR_DOCUMENT_POINT,
    );
    expect(editorRegistration).toBeTruthy();
    const desc = editorRegistration!.descriptor as EditorDocumentContribution;
    expect(desc.slotId).toMatch(/^float:/);
    const seed = contentSeed(desc);
    expect(seed.language).toBe('markdown');
    expect(seed.startInPreview).toBe(true);
    expect(seed.content).toMatch(/chat-message/);
  });

  it('emits a "None registered" catalog when no renderers are registered', async () => {
    const { ctx, registered } = makeCtx();
    await inspectorFiddleShard.onAppActivate!(ctx, APP_ID);

    const beforeRegisterCount = registered.length;
    findInspectorAction(registered, 'discover-types').onAction();

    const newRegistrations = registered.slice(beforeRegisterCount);
    const editorRegistration = newRegistrations.find(
      r => r.pointId === EDITOR_DOCUMENT_POINT,
    );
    expect(editorRegistration).toBeTruthy();
    const desc = editorRegistration!.descriptor as EditorDocumentContribution;
    const seed = contentSeed(desc);
    expect(seed.content).toMatch(/None registered/);
  });
});
