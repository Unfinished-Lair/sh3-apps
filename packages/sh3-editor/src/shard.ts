import type { SourceShard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { InstanceRegistry } from './model/instance-registry';
import { createApi } from './model/api';
import type { ApiInternals } from './model/api';
import type { EditorApi, OpenDocumentOptions } from './types';
import Editor from './views/Editor.svelte';

let registry: InstanceRegistry | null = null;
let apiRef: EditorApi | null = null;
let internalsRef: ApiInternals | null = null;

/** Exposed so consuming shards can access the API via registeredShards. */
export function getApi(): EditorApi | null {
  return apiRef;
}

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-editor',
    label: 'Editor',
    views: [{ id: 'sh3-editor:editor', label: 'Editor', standalone: true }],
  },

  activate(ctx: ShardContext) {
    registry = new InstanceRegistry();
    const { api, internals } = createApi(registry);
    apiRef = api;
    internalsRef = internals;

    // Expose the API on the shard for external access.
    (shard as any).api = api;

    const defaultOptions: OpenDocumentOptions =  {
      content: "Hello, World"
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
    internalsRef?.prefsChange.clear();
    registry?.clear();
    registry = null;
    apiRef = null;
    internalsRef = null;
    (shard as any).api = null;
  },
};
