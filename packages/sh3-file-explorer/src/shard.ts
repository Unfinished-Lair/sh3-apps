import type { SourceShard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { createExplorerStore } from './explorerShard.svelte';
import BrowserView from './browser/BrowserView.svelte';

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-file-explorer',
    label: 'File Explorer',
    views: [
      { id: 'sh3-file-explorer-browser', label: 'Files', standalone: true },
    ],
    permissions: ['documents:browse'],
  },

  activate(ctx: ShardContext) {
    const store = createExplorerStore(ctx);

    let stopWatch: (() => void) | null = null;
    if (store.ready) {
      store.refreshDocuments();
      stopWatch = store.startWatch();
    }
    void stopWatch;

    ctx.registerView('sh3-file-explorer-browser', {
      mount(container) {
        const component = mount(BrowserView, { target: container, props: { store } });
        return { unmount() { unmount(component); } };
      },
    });
  },
};
