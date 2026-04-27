import type { SourceShard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { createExplorerStore, type ExplorerStore } from './explorerShard.svelte';
import BrowserView from './browser/BrowserView.svelte';

let activeStore: ExplorerStore | null = null;
let stopWatch: (() => void) | null = null;

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-file-explorer',
    label: 'File Explorer',
    views: [
      { id: 'sh3-file-explorer-browser', label: 'Files', standalone: true },
    ],
    permissions: ['documents:browse', 'documents:read', 'documents:write'],
  },

  activate(ctx: ShardContext) {
    const store = createExplorerStore(ctx);
    activeStore = store;

    if (store.ready) {
      store.refreshDocuments();
      stopWatch = store.startWatch();
    }

    ctx.registerView('sh3-file-explorer-browser', {
      mount(container) {
        const component = mount(BrowserView, { target: container, props: { store } });
        return { unmount() { unmount(component); } };
      },
    });
  },

  deactivate() {
    if (stopWatch) { stopWatch(); stopWatch = null; }
    activeStore?.dispose();
    activeStore = null;
  },
};
