import type { Shard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { InstanceRegistry } from './model/instance-registry';
import { createApi } from './model/api';
import type { ApiInternals } from './model/api';
import type { EditorApi } from './types';
import Editor from './views/Editor.svelte';

let registry: InstanceRegistry | null = null;
let apiRef: EditorApi | null = null;
let internalsRef: ApiInternals | null = null;

/** Exposed so consuming shards can access the API via registeredShards. */
export function getApi(): EditorApi | null {
  return apiRef;
}

export const shard: Shard = {
  manifest: {
    id: 'sh3-editor',
    label: 'Editor',
    version: '0.1.0',
    views: [{ id: 'sh3-editor:editor', label: 'Editor' }],
  },

  activate(ctx: ShardContext) {
    registry = new InstanceRegistry();
    const { api, internals } = createApi(registry);
    apiRef = api;
    internalsRef = internals;

    // Expose the API on the shard for external access.
    (shard as any).api = api;

    ctx.registerView('sh3-editor:editor', {
      mount(container, context) {
        const instanceId = context.slotId;
        const entry = registry!.get(instanceId);
        if (!entry) {
          container.textContent = `Editor: no document for "${instanceId}"`;
          return { unmount() {} };
        }

        const opts = entry.options;
        const component = mount(Editor, {
          target: container,
          props: {
            entry,
            internals: internalsRef!,
            highlight: opts.highlight,
            matchingConfig: opts.matchingConfig,
            fontSize: opts.fontSize,
            toolbarActions: opts.toolbarActions,
          },
        });

        return {
          unmount() {
            unmount(component);
          },
        };
      },
    });
  },

  deactivate() {
    internalsRef?.contentChange.clear();
    internalsRef?.dirtyChange.clear();
    internalsRef?.saveEvent.clear();
    registry?.clear();
    registry = null;
    apiRef = null;
    internalsRef = null;
    (shard as any).api = null;
  },
};
