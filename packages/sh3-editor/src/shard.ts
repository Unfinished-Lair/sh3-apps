import type { SourceShard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { InstanceRegistry } from './model/instance-registry';
import { createApi } from './model/api';
import type { ApiInternals } from './model/api';
import type { EditorApi, OpenDocumentOptions, InspectorMeta } from './types';
import { INSPECTOR_RENDERER_POINT, type InspectorRenderer } from './inspector/contributions';
import { setRenderers } from './inspector/registry';
import Editor from './views/Editor.svelte';
import Inspector from './views/Inspector.svelte';

let registry: InstanceRegistry | null = null;
let apiRef: EditorApi | null = null;
let internalsRef: ApiInternals | null = null;
let teardownRef: (() => void) | null = null;
let unsubscribeContributions: (() => void) | null = null;

export function getApi(): EditorApi | null {
  return apiRef;
}

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-editor',
    label: 'Editor',
    views: [
      { id: 'sh3-editor:editor',    label: 'Editor',    standalone: true },
      { id: 'sh3-editor:inspector', label: 'Inspector', standalone: true },
    ],
  },

  activate(ctx: ShardContext) {
    registry = new InstanceRegistry();
    const { api, internals, teardown } = createApi(registry);
    apiRef = api;
    internalsRef = internals;
    teardownRef = teardown;

    (shard as any).api = api;

    // Seed + subscribe to inspector renderer contributions.
    const refresh = () => {
      setRenderers(ctx.contributions.list<InspectorRenderer>(INSPECTOR_RENDERER_POINT));
    };
    refresh();
    unsubscribeContributions = ctx.contributions.onChange(INSPECTOR_RENDERER_POINT, refresh);

    const defaultOptions: OpenDocumentOptions = {
      content: 'Hello, World',
    };

    ctx.registerView('sh3-editor:editor', {
      mount(container, context) {
        const instanceId = context.slotId;
        const entry = registry!.get(instanceId);
        const opts = entry?.options || defaultOptions;
        const component = mount(Editor, {
          target: container,
          props: {
            entry,
            internals: internalsRef!,
            highlight: opts.highlight,
            matchingConfig: opts.matchingConfig,
            fontSize: opts.fontSize,
            toolbarActions: opts.toolbarActions,
            showSettings: opts.showSettings,
          },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    ctx.registerView('sh3-editor:inspector', {
      mount(container, context) {
        const instanceId = context.slotId;
        const entry = internals.inspectors.get(instanceId);
        const ephemeral = context.meta as { value?: unknown; meta?: InspectorMeta; readonly?: boolean } | undefined;
        const component = mount(Inspector, {
          target: container,
          props: {
            instanceId,
            entry,
            adHocValue: ephemeral?.value,
            adHocMeta: ephemeral?.meta,
            adHocReadonly: ephemeral?.readonly ?? false,
            internals: internalsRef!,
            toolbarActions: entry?.options.toolbarActions ?? [],
          },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });
  },

  deactivate() {
    unsubscribeContributions?.();
    unsubscribeContributions = null;
    teardownRef?.();
    registry?.clear();
    // Reset the renderer map so a later re-activation starts clean.
    setRenderers([]);
    registry = null;
    apiRef = null;
    internalsRef = null;
    teardownRef = null;
    (shard as any).api = null;
  },
};
