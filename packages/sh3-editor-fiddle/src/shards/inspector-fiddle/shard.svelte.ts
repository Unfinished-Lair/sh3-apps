/*
 * Inspector Fiddle shard (contract v3).
 *
 * Lifecycle:
 *   register(ctx)              — no-op; fiddle is purely an app shard.
 *   onAppActivate(ctx, appId)  — seeds value.json / meta.json under
 *                                {scope}/docs/inspector-fiddle-app/, then
 *                                registers the editor + inspector
 *                                contributions. All registrations land in
 *                                the per-app cleanup bag and auto-dispose
 *                                on app unload.
 *
 * The two JSON editors run in path mode — sh3-editor owns persistence
 * via ctx.documents (shared namespace across all required shards in the
 * app). The fiddle observes editor onContentChange to drive the live
 * parser into the inspector.
 */

import type { DocumentHandle, SourceShard, ShardContext } from 'sh3-core';
import { sh3 } from 'sh3-core';
import type { ToolbarAction } from '@unfinished-lair/sh3-editor';
import type {
  InspectorInstanceContribution,
  InspectorBindHandle,
  InspectorMeta,
} from '@unfinished-lair/sh3-editor/inspector/contributions';
import type {
  EditorDocumentContribution,
  EditorReplacePatch,
} from '@unfinished-lair/sh3-editor/contributions';

// SH3 runtime resolves bare specifiers via an importmap that does NOT
// include sh3-editor's per-feature subpaths. Importing the contribution
// point IDs from those subpaths produces an unresolvable runtime import
// at install time. Inline the string constants instead — they are stable
// API. Keep these in sync with sh3-editor's contribution exports.
const EDITOR_DOCUMENT_POINT     = 'sh3-editor.document';
const INSPECTOR_INSTANCE_POINT  = 'sh3-editor.inspectorInstance';
const INSPECTOR_RENDERER_POINT  = 'sh3-editor.inspectorRenderer';

const VALUE_PATH = 'value.json';
const META_PATH  = 'meta.json';

import {
  STARTER_VALUE,
  STARTER_META,
  STARTER_VALUE_TEXT,
  STARTER_META_TEXT,
} from './starter';
import { createDebouncedParser } from './parse';

interface FiddleSnapshot {
  valueText: string;
  metaText:  string;
  liveSync:  boolean;
  inspectorTouched: boolean;
}

/** Build the markdown catalog of inspector renderer types. Pure — exported
 *  for unit testing. */
export function buildCatalogMarkdown(
  renderers: ReadonlyArray<{ id: string; type: string }>,
): string {
  const lines = [
    '# Available inspector renderer types',
    '',
    'Use these as `meta.type` values in the meta editor to dispatch a custom renderer for a field.',
    '',
  ];
  if (renderers.length === 0) {
    lines.push('_None registered._');
  } else {
    for (const r of renderers) {
      lines.push(`- \`${r.type}\` — \`${r.id}\``);
    }
  }
  return lines.join('\n');
}

let testSnapshot: FiddleSnapshot = {
  valueText: '',
  metaText:  '',
  liveSync:  false,
  inspectorTouched: false,
};

export const inspectorFiddleShard: SourceShard & {
  __test_snapshot?: () => FiddleSnapshot;
} = {
  manifest: {
    id: 'inspector-fiddle',
    label: 'Inspector Fiddle',
    views: [],
  },

  // v3: register runs at SH3 boot for every shard. Fiddle has no
  // shell-level contributions, so this body is empty.
  register(_ctx: ShardContext) {
    // no-op
  },

  async onAppActivate(ctx: ShardContext, _appId: string) {
    // ---- 1. First-run seeding ------------------------------------------
    // ctx.documents resolves to {scope}/docs/inspector-fiddle-app/ for the
    // duration of this app's activation. If the files don't exist yet,
    // write the starter — otherwise hydrate live state from what's on disk.
    await ensureSeedDoc(ctx.documents, VALUE_PATH, STARTER_VALUE_TEXT);
    await ensureSeedDoc(ctx.documents, META_PATH,  STARTER_META_TEXT);

    const valueText = (await ctx.documents.readText(VALUE_PATH)) ?? STARTER_VALUE_TEXT;
    const metaText  = (await ctx.documents.readText(META_PATH))  ?? STARTER_META_TEXT;

    // ---- 2. Live state -------------------------------------------------
    const zone = ctx.state({
      workspace: {
        liveSync: false as boolean,
      },
    });

    const state = $state({
      liveValue: tryParse<unknown>(valueText, STARTER_VALUE),
      liveMeta:  tryParse<InspectorMeta>(metaText, STARTER_META),
      lastGoodValue: tryParse<unknown>(valueText, STARTER_VALUE),
      lastGoodMeta:  tryParse<InspectorMeta>(metaText, STARTER_META),
      valueParseError: null as string | null,
      metaParseError:  null as string | null,
      liveSync:        zone.workspace.liveSync,
      inspectorTouched: false,
    });

    // ---- 3. Editor handles (populated by bind) -------------------------
    let valueReplace: ((next: EditorReplacePatch) => void) | null = null;
    let metaReplace:  ((next: EditorReplacePatch) => void) | null = null;

    let lastValueErrorPushed: string | null = null;
    let lastMetaErrorPushed:  string | null = null;

    function truncateForToolbar(s: string): string {
      return s.length > 60 ? s.slice(0, 57) + '…' : s;
    }

    function valueErrorAction(message: string): ToolbarAction {
      return {
        id: 'value-parse-error',
        label: '⚠ ' + truncateForToolbar(message),
        group: 'parse-error',
        disabled: true,
        accent: true,
        onAction: () => { /* no-op; label communicates the message */ },
      };
    }

    function metaErrorAction(message: string): ToolbarAction {
      return {
        id: 'meta-parse-error',
        label: '⚠ ' + truncateForToolbar(message),
        group: 'parse-error',
        disabled: true,
        accent: true,
        onAction: () => { /* no-op */ },
      };
    }

    function pushValueToolbar() {
      if (!valueReplace) return;
      const current = state.valueParseError;
      if (current === lastValueErrorPushed) return;
      lastValueErrorPushed = current;
      const actions: ToolbarAction[] = [];
      if (current) actions.push(valueErrorAction(current));
      valueReplace({ toolbarActions: actions });
    }

    function pushMetaToolbar() {
      if (!metaReplace) return;
      const current = state.metaParseError;
      if (current === lastMetaErrorPushed) return;
      lastMetaErrorPushed = current;
      const actions: ToolbarAction[] = [];
      if (current) actions.push(metaErrorAction(current));
      metaReplace({ toolbarActions: actions });
    }

    let inspectorHandle: InspectorBindHandle | null = null;

    // Live-sync loop avoidance: each flag is one-shot and consumed by the
    // next callback in the corresponding direction.
    let suppressNextEditorParse     = false;
    let suppressNextInspectorChange = false;

    const refreshSnapshot = () => {
      testSnapshot = {
        valueText: JSON.stringify(state.liveValue, null, 2),
        metaText:  JSON.stringify(state.liveMeta,  null, 2),
        liveSync:  state.liveSync,
        inspectorTouched: state.inspectorTouched,
      };
    };

    const valueParser = createDebouncedParser({
      onSuccess(parsed) {
        state.liveValue = parsed;
        state.lastGoodValue = parsed;
        state.valueParseError = null;
        state.inspectorTouched = false;
        refreshSnapshot();
        pushValueToolbar();
        if (inspectorHandle) {
          suppressNextInspectorChange = true;
          inspectorHandle.replace({ value: parsed });
        }
      },
      onError(msg) {
        state.valueParseError = msg;
        refreshSnapshot();
        pushValueToolbar();
      },
    });

    const valueDescriptor: EditorDocumentContribution = {
      slotId: 'fiddle.value',
      seed: {
        kind: 'path',
        path: VALUE_PATH,
        language: 'json',
        initialContent: STARTER_VALUE_TEXT,
      },
      bind(replace) {
        valueReplace = replace;
        return () => { valueReplace = null; };
      },
      onContentChange(content) {
        if (suppressNextEditorParse) {
          suppressNextEditorParse = false;
          return;
        }
        valueParser.feed(content);
      },
    };

    const metaParser = createDebouncedParser({
      onSuccess(parsed) {
        const meta = parsed as InspectorMeta;
        state.liveMeta = meta;
        state.lastGoodMeta = meta;
        state.metaParseError = null;
        refreshSnapshot();
        pushMetaToolbar();
        inspectorHandle?.replace({ meta });
      },
      onError(msg) {
        state.metaParseError = msg;
        refreshSnapshot();
        pushMetaToolbar();
      },
    });

    const metaDescriptor: EditorDocumentContribution = {
      slotId: 'fiddle.meta',
      seed: {
        kind: 'path',
        path: META_PATH,
        language: 'json',
        initialContent: STARTER_META_TEXT,
      },
      bind(replace) {
        metaReplace = replace;
        return () => { metaReplace = null; };
      },
      onContentChange(content) {
        metaParser.feed(content);
      },
    };

    ctx.contributions.register<EditorDocumentContribution>(EDITOR_DOCUMENT_POINT, valueDescriptor);
    ctx.contributions.register<EditorDocumentContribution>(EDITOR_DOCUMENT_POINT, metaDescriptor);

    const syncToJsonAction: ToolbarAction = {
      id: 'sync-to-json',
      label: '← Sync to JSON',
      group: 'fiddle',
      get disabled() {
        return !state.inspectorTouched;
      },
      onAction() {
        if (!valueReplace) return;
        const text = JSON.stringify(state.liveValue, null, 2);
        suppressNextEditorParse = true;
        valueReplace({ content: text });
        state.inspectorTouched = false;
        refreshSnapshot();
      },
    };

    const liveSyncAction: ToolbarAction = {
      id: 'live-sync',
      label: 'Live sync',
      group: 'fiddle',
      get accent() {
        return state.liveSync;
      },
      onAction() {
        state.liveSync = !state.liveSync;
        zone.workspace.liveSync = state.liveSync;
        refreshSnapshot();
      },
    };

    const discoverTypesAction: ToolbarAction = {
      id: 'discover-types',
      label: 'Available types →',
      group: 'fiddle',
      onAction() {
        const renderers = ctx.contributions.list<{ id: string; type: string }>(
          INSPECTOR_RENDERER_POINT,
        ) ?? [];
        const text = buildCatalogMarkdown(renderers);
        const floatId = sh3.float.open('sh3-editor:editor', {
          title: 'Available types',
          size: { w: 520, h: 360 },
        });
        const entry = sh3.float.list().find((f) => f.id === floatId);
        if (!entry) return;
        const tabs = (entry.content as { type: 'tabs'; tabs: Array<{ slotId: string }> }).tabs;
        const slotId = tabs[0]?.slotId;
        if (!slotId) return;
        ctx.contributions.register<EditorDocumentContribution>(EDITOR_DOCUMENT_POINT, {
          slotId,
          seed: {
            kind: 'content',
            content: text,
            language: 'markdown',
            startInPreview: true,
          },
        });
      },
    };

    const inspectorDescriptor: InspectorInstanceContribution = {
      slotId: 'fiddle.inspector',
      seed: {
        value: state.liveValue,
        meta:  state.liveMeta,
        toolbarActions: [syncToJsonAction, liveSyncAction, discoverTypesAction],
      },
      bind(handle: InspectorBindHandle) {
        inspectorHandle = handle;
        return () => { inspectorHandle = null; };
      },
      onValueChange(value) {
        if (suppressNextInspectorChange) {
          suppressNextInspectorChange = false;
          return;
        }
        state.inspectorTouched = true;
        refreshSnapshot();
        if (state.liveSync && valueReplace) {
          const text = JSON.stringify(value, null, 2);
          suppressNextEditorParse = true;
          valueReplace({ content: text });
          state.inspectorTouched = false;
          refreshSnapshot();
        }
      },
    };

    ctx.contributions.register<InspectorInstanceContribution>(
      INSPECTOR_INSTANCE_POINT,
      inspectorDescriptor,
    );

    refreshSnapshot();
  },

  __test_snapshot(): FiddleSnapshot {
    return testSnapshot;
  },
};

// ============================================================================
// Helpers
// ============================================================================

async function ensureSeedDoc(
  docs: DocumentHandle,
  path: string,
  starter: string,
): Promise<void> {
  const existing = await docs.readText(path);
  if (existing === null) {
    await docs.writeText(path, starter);
  }
}

function tryParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}
