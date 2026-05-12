import { mount, unmount } from 'svelte';
import MainView from './MainView.svelte';
import type { SourceShard, ViewFactory, ViewHandle, MountContext } from 'sh3-core';

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-pipeline',
    label: 'sh3-pipeline',
    views: [{ id: 'sh3-pipeline:main', label: 'Main View' }],
  },
  activate(ctx) {
    const factory: ViewFactory = {
      mount(container: HTMLElement, context: MountContext): ViewHandle {
        const dims = $state({ width: 0, height: 0 });

        const instance = mount(MainView, {
          target: container,
          props: { context, dims },
        });

        return {
          unmount() {
            unmount(instance);
          },
          onResize(w, h) {
            dims.width = w;
            dims.height = h;
          },
          closable: true,
        };
      },
    };
    ctx.registerView('sh3-pipeline:main', factory);
  },
};
