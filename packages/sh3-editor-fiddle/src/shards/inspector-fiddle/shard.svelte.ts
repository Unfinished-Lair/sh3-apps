/*
 * Inspector Fiddle shard.
 *
 * Activates inside the inspector-fiddle app. Holds the parsed value and
 * meta in $state so the inspector's seed.value reactively reflects walker
 * mutations. Hydrates text from a workspace state zone when available;
 * falls back to the starter on first launch.
 *
 * Contribution registrations land in subsequent tasks. This file is
 * deliberately step-built so each behavior is unit-testable in isolation.
 */

import type { SourceShard } from 'sh3-core';
import { sh3 } from 'sh3-core';
import type { ToolbarAction } from '@unfinished-lair/sh3-editor';
import type {
  InspectorInstanceContribution,
  InspectorBindHandle,
  InspectorMeta,
} from '@unfinished-lair/sh3-editor/inspector/contributions';
import type {
  EditorDocumentContribution,
  EditorDocumentSeed,
} from '@unfinished-lair/sh3-editor/contributions';

// SH3 runtime resolves bare specifiers via an importmap that does NOT
// include sh3-editor's per-feature subpaths. Importing the contribution
// point IDs from those subpaths produces an unresolvable runtime import
// at install time. Inline the string constants instead — they are stable
// API. Keep these in sync with sh3-editor's contribution exports.
const EDITOR_DOCUMENT_POINT     = 'sh3-editor.document';
const INSPECTOR_INSTANCE_POINT  = 'sh3-editor.inspectorInstance';
const INSPECTOR_RENDERER_POINT  = 'sh3-editor.inspectorRenderer';
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
 *  for unit testing. Every entry comes from the contributions registry;
 *  the bundled `color` renderer registers itself there too, so we don't
 *  need to inject it manually. */
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

  activate(ctx) {
    const zone = ctx.state({
      workspace: {
        valueText: '' as string,
        metaText:  '' as string,
        liveSync:  false as boolean,
      },
    });

    const valueText = zone.workspace.valueText || STARTER_VALUE_TEXT;
    const metaText  = zone.workspace.metaText  || STARTER_META_TEXT;
    zone.workspace.valueText = valueText;
    zone.workspace.metaText  = metaText;

    // The live state. Walker mutations work in place on liveValue; the
    // editor parse pipeline rotates the reference and re-points the
    // inspector via handle.replace({ value }).
    const state = $state({
      liveValue: structuredClone(STARTER_VALUE) as unknown,
      liveMeta:  structuredClone(STARTER_META)  as InspectorMeta,
      lastGoodValue: structuredClone(STARTER_VALUE) as unknown,
      lastGoodMeta:  structuredClone(STARTER_META)  as InspectorMeta,
      valueParseError: null as string | null,
      metaParseError:  null as string | null,
      liveSync:        zone.workspace.liveSync,
      inspectorTouched: false,
    });

    // If the zone had user-typed text different from the starter, parse
    // it now so live{Value,Meta} reflect the persisted text rather than
    // the starter constants.
    if (valueText !== STARTER_VALUE_TEXT) {
      try {
        const parsed = JSON.parse(valueText);
        state.liveValue = parsed;
        state.lastGoodValue = parsed;
      } catch {
        // text persisted in error state — leave starter live, surface error.
        state.valueParseError = 'Persisted value failed to parse on activate.';
      }
    }
    if (metaText !== STARTER_META_TEXT) {
      try {
        const parsed = JSON.parse(metaText);
        state.liveMeta = parsed;
        state.lastGoodMeta = parsed;
      } catch {
        state.metaParseError = 'Persisted meta failed to parse on activate.';
      }
    }

    // Editor handles, populated by bind(); used by inspector callbacks
    // in later tasks to push round-tripped content back into the editors.
    let valueReplace: ((next: Partial<EditorDocumentSeed>) => void) | null = null;
    let metaReplace:  ((next: Partial<EditorDocumentSeed>) => void) | null = null;

    // Track last-pushed parse-error message per editor so we only ping
    // valueReplace/metaReplace when the indicator actually changes. Without
    // this, every parse success after activation would emit an empty
    // toolbarActions update, which is noisy and breaks consumers that count
    // replace calls.
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

    // Inspector handle, populated by bind() in the inspector contribution
    // (registered in Task 6). We declare it here so the editor parsers
    // can reference it via closure.
    let inspectorHandle: InspectorBindHandle | null = null;

    // Live-sync loop avoidance: each flag is one-shot and consumed by the
    // next callback in the corresponding direction.
    let suppressNextEditorParse     = false; // true → next value-editor onContentChange is dropped
    let suppressNextInspectorChange = false; // true → next inspector onValueChange is dropped

    const refreshSnapshot = () => {
      testSnapshot = {
        valueText: zone.workspace.valueText,
        metaText:  zone.workspace.metaText,
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
          // Replacing the inspector value may synchronously fire onValueChange
          // in the real impl; pre-arm the suppression so we don't bounce back
          // into valueReplace via the live-sync path.
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

    const valueDescriptor: EditorDocumentContribution = {
      slotId: 'fiddle.value',
      seed: {
        content:  valueText,
        language: 'json',
      },
      bind(replace) {
        valueReplace = replace;
        return () => { valueReplace = null; };
      },
      onContentChange(content) {
        zone.workspace.valueText = content;
        if (suppressNextEditorParse) {
          suppressNextEditorParse = false;
          return;
        }
        valueParser.feed(content);
      },
    };

    const metaDescriptor: EditorDocumentContribution = {
      slotId: 'fiddle.meta',
      seed: {
        content:  metaText,
        language: 'json',
      },
      bind(replace) {
        metaReplace = replace;
        return () => { metaReplace = null; };
      },
      onContentChange(content) {
        zone.workspace.metaText = content;
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
        // Suppress the parser pass that would otherwise fire when
        // valueReplace's onContentChange echoes back. Without this, the
        // parser re-feeds, calls inspectorHandle.replace({ value: parsed })
        // ~150ms later, and overwrites any inspector edit the user made
        // during the debounce window with the snapshot we just pushed.
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
        // Open a closable, draggable float mounting an editor view in
        // markdown-preview mode. The float manager mints its own slot id
        // for the new view; we register the EditorDocumentContribution
        // for that slot synchronously so the editor mounts with our
        // content instead of the bundled fallback.
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
          // Pre-arm so the synchronous onContentChange fired by valueReplace
          // is dropped without re-feeding the parser.
          suppressNextEditorParse = true;
          valueReplace({ content: text });
          zone.workspace.valueText = text;
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
