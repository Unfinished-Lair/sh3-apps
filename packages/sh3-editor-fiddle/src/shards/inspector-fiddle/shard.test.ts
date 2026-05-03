import { describe, it, expect, vi, beforeEach } from 'vitest';

// Stub `shell` from sh3-core so the discover-types action can open a fake
// float and tests can introspect what it called. The fake mints slot ids
// matching the shape sh3-core produces ('float:<viewId>:<n>') so callers
// downstream see the same wire format. Using vi.hoisted so the references
// are available to the hoisted vi.mock factory.
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
  shell: {
    float: fakeFloatManager,
  },
}));

import { inspectorFiddleShard, buildCatalogMarkdown } from './shard.svelte';
import { STARTER_VALUE, STARTER_VALUE_TEXT, STARTER_META_TEXT } from './starter';
import { EDITOR_DOCUMENT_POINT } from '@unfinished-lair/sh3-editor/contributions';
import type { EditorDocumentContribution } from '@unfinished-lair/sh3-editor/contributions';
import {
  INSPECTOR_INSTANCE_POINT,
  type InspectorInstanceContribution,
  type InspectorBindHandle,
} from '@unfinished-lair/sh3-editor/inspector/contributions';
import type { ToolbarAction } from '@unfinished-lair/sh3-editor';

interface FakeZoneSpec {
  workspace: {
    valueText: string;
    metaText: string;
    liveSync: boolean;
  };
}

interface FakeCtxOptions {
  zone?: Partial<FakeZoneSpec['workspace']>;
  /** Seeds ctx.contributions.list(...) responses keyed by pointId. */
  contributionsByPoint?: Record<string, unknown[]>;
}

function makeCtx(opts?: FakeCtxOptions | Partial<FakeZoneSpec['workspace']>) {
  // Backwards-compatible: callers may pass the zone shape directly.
  const isOpts = opts && ('zone' in (opts as object) || 'contributionsByPoint' in (opts as object));
  const o: FakeCtxOptions = isOpts ? (opts as FakeCtxOptions) : { zone: opts as Partial<FakeZoneSpec['workspace']> };
  const zoneInitial = o.zone;
  const contributionsByPoint = o.contributionsByPoint ?? {};

  const zone: FakeZoneSpec = {
    workspace: {
      valueText: zoneInitial?.valueText ?? '',
      metaText:  zoneInitial?.metaText  ?? '',
      liveSync:  zoneInitial?.liveSync  ?? false,
    },
  };

  const registered: { pointId: string; descriptor: unknown }[] = [];

  return {
    zone,
    registered,
    ctx: {
      state: vi.fn(<T,>(initial: T) => {
        // Hydrate from initial; in real ctx this returns a $state-wrapped reactive proxy.
        // For the test we simulate "field present in zone overrides the initial".
        if ((initial as any).workspace) {
          (initial as any).workspace = { ...(initial as any).workspace, ...zone.workspace };
        }
        zone.workspace = (initial as any).workspace;
        return initial as any;
      }),
      registerView: vi.fn(),
      contributions: {
        register: vi.fn((pointId: string, descriptor: unknown) => {
          registered.push({ pointId, descriptor });
          return () => {};
        }),
        list:       vi.fn((pointId: string) => contributionsByPoint[pointId] ?? []),
        onChange:   vi.fn(() => () => {}),
        listPoints: vi.fn(() => Object.keys(contributionsByPoint)),
      },
    } as any,
  };
}

describe('inspectorFiddleShard — manifest', () => {
  it('declares id "inspector-fiddle" and no views', () => {
    expect(inspectorFiddleShard.manifest.id).toBe('inspector-fiddle');
    expect(inspectorFiddleShard.manifest.views ?? []).toEqual([]);
  });
});

describe('inspectorFiddleShard — activate hydration', () => {
  it('seeds value and meta text from the starter when zone is empty', () => {
    const { ctx } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    // The shard publishes its hydrated text via a test-only export:
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.valueText).toBe(STARTER_VALUE_TEXT);
    expect(snap.metaText).toBe(STARTER_META_TEXT);
    expect(snap.liveSync).toBe(false);
  });

  it('hydrates value text from the workspace zone when present', () => {
    const customText = '{"hello":"world"}';
    const { ctx } = makeCtx({ valueText: customText });
    inspectorFiddleShard.activate!(ctx);
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.valueText).toBe(customText);
  });

  it('hydrates liveSync from the workspace zone when present', () => {
    const { ctx } = makeCtx({ liveSync: true });
    inspectorFiddleShard.activate!(ctx);
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.liveSync).toBe(true);
  });
});

describe('inspectorFiddleShard — editor contributions', () => {
  it('registers exactly two EDITOR_DOCUMENT_POINT descriptors at slot ids fiddle.value and fiddle.meta', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

    const editorDescs = registered.filter(r => r.pointId === EDITOR_DOCUMENT_POINT);
    expect(editorDescs).toHaveLength(2);

    const slotIds = editorDescs.map(r => (r.descriptor as EditorDocumentContribution).slotId);
    expect(slotIds.sort()).toEqual(['fiddle.meta', 'fiddle.value']);
  });

  it('seeds the value editor with starter text and language=json', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    const desc = registered.find(r =>
      r.pointId === EDITOR_DOCUMENT_POINT &&
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    expect(desc.seed.content).toBe(STARTER_VALUE_TEXT);
    expect(desc.seed.language).toBe('json');
  });

  it('value editor onContentChange writes to workspace zone before parse outcome is known', () => {
    const { ctx, registered, zone } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    const desc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;

    desc.onContentChange!('{ broken json');
    expect(zone.workspace.valueText).toBe('{ broken json');
  });
});

function findInspectorDesc(registered: { pointId: string; descriptor: unknown }[]) {
  return registered.find(r => r.pointId === INSPECTOR_INSTANCE_POINT)!
    .descriptor as InspectorInstanceContribution;
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

describe('inspectorFiddleShard — inspector contribution', () => {
  it('registers exactly one INSPECTOR_INSTANCE_POINT descriptor at slot fiddle.inspector', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

    const inspectorDescs = registered.filter(r => r.pointId === INSPECTOR_INSTANCE_POINT);
    expect(inspectorDescs).toHaveLength(1);
    expect((inspectorDescs[0].descriptor as InspectorInstanceContribution).slotId).toBe('fiddle.inspector');
  });

  it('seeds the inspector with the live value and meta', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    const desc = findInspectorDesc(registered);
    expect(desc.seed.value).toEqual(STARTER_VALUE);
    expect(desc.seed.meta?.fields?.fg?.type).toBe('color');
  });

  it('onValueChange marks inspectorTouched', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    const desc = findInspectorDesc(registered);
    desc.bind?.(fakeBindHandle());
    desc.onValueChange?.({ name: 'edited' });
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.inspectorTouched).toBe(true);
  });

  it('value-editor parse calls inspectorHandle.replace once bind has fired', async () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

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

  it('meta-editor parse calls inspectorHandle.replace with meta only', () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

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

function findInspectorAction(registered: any[], id: string): ToolbarAction {
  const desc = findInspectorDesc(registered);
  const action = desc.seed.toolbarActions?.find((a: ToolbarAction) => a.id === id);
  if (!action) throw new Error(`action ${id} not found`);
  return action;
}

describe('inspectorFiddleShard — sync-to-json toolbar action', () => {
  it('registers an action with id "sync-to-json" on the inspector toolbar', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    const action = findInspectorAction(registered, 'sync-to-json');
    expect(action.label).toMatch(/sync/i);
  });

  it('is disabled when inspectorTouched is false', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    const action = findInspectorAction(registered, 'sync-to-json');
    expect(action.disabled).toBe(true);
  });

  it('serializes liveValue and calls valueReplace when clicked', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const replaced: any[] = [];
    valueDesc.bind?.((next) => replaced.push(next));

    const inspectorDesc = findInspectorDesc(registered);
    inspectorDesc.bind?.(fakeBindHandle());
    // Simulate a walker edit so inspectorTouched flips true.
    inspectorDesc.onValueChange?.({ name: 'edited' });

    const action = findInspectorAction(registered, 'sync-to-json');
    expect(action.disabled).toBe(false);
    action.onAction();

    expect(replaced).toHaveLength(1);
    expect(typeof replaced[0].content).toBe('string');
    expect(JSON.parse(replaced[0].content)).toEqual(STARTER_VALUE);
  });

  it('clears inspectorTouched after a successful sync', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    valueDesc.bind?.(() => {});

    const inspectorDesc = findInspectorDesc(registered);
    inspectorDesc.bind?.(fakeBindHandle());
    inspectorDesc.onValueChange?.({});

    findInspectorAction(registered, 'sync-to-json').onAction();
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.inspectorTouched).toBe(false);
  });
});

describe('inspectorFiddleShard — live-sync toggle', () => {
  it('registers a toolbar action with id "live-sync"', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    const action = findInspectorAction(registered, 'live-sync');
    expect(action.label).toMatch(/live/i);
  });

  it('starts off when zone.liveSync is false', () => {
    const { ctx, registered } = makeCtx({ liveSync: false });
    inspectorFiddleShard.activate!(ctx);
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.liveSync).toBe(false);
  });

  it('starts on when zone.liveSync is true (hydration)', () => {
    const { ctx, registered } = makeCtx({ liveSync: true });
    inspectorFiddleShard.activate!(ctx);
    const snap = (inspectorFiddleShard as any).__test_snapshot();
    expect(snap.liveSync).toBe(true);
  });

  it('toggle action flips state.liveSync and persists to zone', () => {
    const { ctx, registered, zone } = makeCtx({ liveSync: false });
    inspectorFiddleShard.activate!(ctx);
    findInspectorAction(registered, 'live-sync').onAction();
    expect(zone.workspace.liveSync).toBe(true);
    findInspectorAction(registered, 'live-sync').onAction();
    expect(zone.workspace.liveSync).toBe(false);
  });

  it('off mode: onValueChange does NOT call valueReplace', () => {
    const { ctx, registered } = makeCtx({ liveSync: false });
    inspectorFiddleShard.activate!(ctx);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const replaced: any[] = [];
    valueDesc.bind?.((next) => replaced.push(next));

    const inspectorDesc = findInspectorDesc(registered);
    inspectorDesc.bind?.(fakeBindHandle());
    inspectorDesc.onValueChange?.({ name: 'edited' });
    expect(replaced).toEqual([]);
  });

  it('on mode: onValueChange serializes and calls valueReplace', () => {
    const { ctx, registered } = makeCtx({ liveSync: true });
    inspectorFiddleShard.activate!(ctx);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const replaced: any[] = [];
    valueDesc.bind?.((next) => replaced.push(next));

    const inspectorDesc = findInspectorDesc(registered);
    inspectorDesc.bind?.(fakeBindHandle());
    // The walker would have mutated liveValue in place before firing onValueChange.
    (inspectorDesc.seed.value as any).name = 'mutated';
    inspectorDesc.onValueChange?.(inspectorDesc.seed.value);

    expect(replaced).toHaveLength(1);
    expect(JSON.parse(replaced[0].content).name).toBe('mutated');
  });

  it('loop avoidance — value-editor onContentChange triggered by our own replace does NOT re-run parse', () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx({ liveSync: true });
    inspectorFiddleShard.activate!(ctx);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const inspectorDesc = findInspectorDesc(registered);
    valueDesc.bind?.((_next) => {
      // Simulate the editor view firing onContentChange synchronously after replace.
      valueDesc.onContentChange!(JSON.stringify(inspectorDesc.seed.value, null, 2));
    });

    const handle = fakeBindHandle();
    inspectorDesc.bind?.(handle);

    (inspectorDesc.seed.value as any).name = 'mutated';
    inspectorDesc.onValueChange?.(inspectorDesc.seed.value);
    vi.advanceTimersByTime(200);

    // Only the manual replace should have hit the editor — the inspector
    // handle.replace call from the parse path must NOT fire (suppressed).
    expect(handle.replaceCalls).toEqual([]);
    vi.useRealTimers();
  });

  it('loop avoidance — inspector replace triggered by editor parse does NOT re-fire valueReplace', () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx({ liveSync: true });
    inspectorFiddleShard.activate!(ctx);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const replaced: any[] = [];
    valueDesc.bind?.((next) => replaced.push(next));

    const inspectorDesc = findInspectorDesc(registered);
    const handle = fakeBindHandle();
    // Make the inspector handle simulate the inspector firing onValueChange
    // immediately on every replace({ value: … }) (matches inspector.md §2 semantics).
    handle.replace = (next: any) => {
      handle.replaceCalls.push(next);
      if ('value' in next) inspectorDesc.onValueChange?.(next.value);
    };
    inspectorDesc.bind?.(handle);

    valueDesc.onContentChange!('{"a":1}');
    vi.advanceTimersByTime(200);

    // Inspector got one replace from parse; valueReplace was NOT called as a
    // consequence (suppressed onValueChange).
    expect(handle.replaceCalls).toHaveLength(1);
    expect(replaced).toEqual([]);
    vi.useRealTimers();
  });
});

describe('inspectorFiddleShard — parse error indicators', () => {
  it('starts with no parse-error action on the value editor', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const ids = (valueDesc.seed.toolbarActions ?? []).map(a => a.id);
    expect(ids).not.toContain('value-parse-error');
  });

  it('on parse failure, replace is called with a toolbarActions list containing parse-error action', () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const replaced: any[] = [];
    valueDesc.bind?.((next) => replaced.push(next));

    valueDesc.onContentChange!('{ invalid json');
    vi.advanceTimersByTime(200);

    const last = replaced[replaced.length - 1];
    const ids = (last?.toolbarActions ?? []).map((a: any) => a.id);
    expect(ids).toContain('value-parse-error');
    const action = last.toolbarActions.find((a: any) => a.id === 'value-parse-error');
    expect(action.disabled).toBe(true);
    expect(action.accent).toBe(true);
    expect(action.label).toMatch(/⚠/);
    vi.useRealTimers();
  });

  it('on parse recovery, replace is called with a toolbarActions list NOT containing parse-error action', () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

    const valueDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.value',
    )!.descriptor as EditorDocumentContribution;
    const replaced: any[] = [];
    valueDesc.bind?.((next) => replaced.push(next));

    valueDesc.onContentChange!('{ broken');
    vi.advanceTimersByTime(200);
    valueDesc.onContentChange!('{"ok":1}');
    vi.advanceTimersByTime(200);

    const last = replaced[replaced.length - 1];
    const ids = (last?.toolbarActions ?? []).map((a: any) => a.id);
    expect(ids).not.toContain('value-parse-error');
    vi.useRealTimers();
  });

  it('meta editor parse failure pushes a meta-parse-error action', () => {
    vi.useFakeTimers();
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

    const metaDesc = registered.find(r =>
      (r.descriptor as EditorDocumentContribution).slotId === 'fiddle.meta',
    )!.descriptor as EditorDocumentContribution;
    const replaced: any[] = [];
    metaDesc.bind?.((next) => replaced.push(next));

    metaDesc.onContentChange!('{ broken meta');
    vi.advanceTimersByTime(200);

    const last = replaced[replaced.length - 1];
    const ids = (last?.toolbarActions ?? []).map((a: any) => a.id);
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
      { id: 'sh3-editor:color',    type: 'color' },
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

  it('registers a toolbar action with id "discover-types"', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);
    const action = findInspectorAction(registered, 'discover-types');
    expect(action.label).toMatch(/types/i);
  });

  it('opens a float mounting sh3-editor:editor and registers a markdown-preview contribution at its slotId', () => {
    const { ctx, registered } = makeCtx({
      contributionsByPoint: {
        'sh3-editor.inspectorRenderer': [
          { id: 'sh3-chat:chat-message', type: 'chat-message' },
        ],
      },
    });
    inspectorFiddleShard.activate!(ctx);

    const beforeRegisterCount = registered.length;
    findInspectorAction(registered, 'discover-types').onAction();

    expect(ctx.contributions.list).toHaveBeenCalledWith('sh3-editor.inspectorRenderer');
    expect(fakeFloatManager.open).toHaveBeenCalledWith(
      'sh3-editor:editor',
      expect.objectContaining({ title: expect.stringMatching(/types/i) }),
    );

    // Exactly one new EDITOR_DOCUMENT_POINT contribution registered.
    const newRegistrations = registered.slice(beforeRegisterCount);
    const editorRegistration = newRegistrations.find(
      r => r.pointId === EDITOR_DOCUMENT_POINT,
    );
    expect(editorRegistration).toBeTruthy();
    const desc = editorRegistration!.descriptor as EditorDocumentContribution;
    expect(desc.slotId).toMatch(/^float:/);
    expect(desc.seed.language).toBe('markdown');
    expect(desc.seed.startInPreview).toBe(true);
    // Markdown body lists the registered renderer
    expect(desc.seed.content).toMatch(/chat-message/);
  });

  it('emits a "None registered" catalog when no renderers are registered', () => {
    const { ctx, registered } = makeCtx();
    inspectorFiddleShard.activate!(ctx);

    const beforeRegisterCount = registered.length;
    findInspectorAction(registered, 'discover-types').onAction();

    const newRegistrations = registered.slice(beforeRegisterCount);
    const editorRegistration = newRegistrations.find(
      r => r.pointId === EDITOR_DOCUMENT_POINT,
    );
    expect(editorRegistration).toBeTruthy();
    const desc = editorRegistration!.descriptor as EditorDocumentContribution;
    expect(desc.seed.content).toMatch(/None registered/);
  });
});
