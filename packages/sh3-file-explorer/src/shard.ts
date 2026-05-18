import type { SourceShard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { createExplorerStore, type ExplorerStore } from './explorerShard.svelte';
import { bindSelectionToActions, SELECTION_TYPE } from './explorerSelection.svelte';
import { runDelete } from './delete/runDelete';
import BrowserView from './browser/BrowserView.svelte';

let activeStore: ExplorerStore | null = null;
let stopWatch: (() => void) | null = null;
let stopSelectionMirror: (() => void) | null = null;

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-file-explorer',
    label: 'File Explorer',
    views: [
      { id: 'sh3-file-explorer-browser', label: 'Files', standalone: true },
    ],
    permissions: ['documents:browse', 'documents:read', 'documents:write'],
  },

  register(ctx: ShardContext) {
    const store = createExplorerStore(ctx);
    activeStore = store;

    if (store.ready) {
      store.refreshDocuments();
      stopWatch = store.startWatch();
      stopSelectionMirror = bindSelectionToActions(ctx, store);

      ctx.actions.register({
        id: 'sh3-file-explorer:document.delete',
        label: 'Delete',
        scope: { element: SELECTION_TYPE },
        defaultShortcut: 'Delete',
        group: 'document',
        paletteItem: false,
        contextItem: true,
        run: (dCtx) => runDelete(ctx, store, dCtx, { skipConfirm: false }),
      });

      ctx.actions.register({
        id: 'sh3-file-explorer:document.delete-skip-confirm',
        label: 'Delete (skip confirmation)',
        scope: { element: SELECTION_TYPE },
        defaultShortcut: 'Shift+Delete',
        paletteItem: false,
        contextItem: false,
        run: (dCtx) => runDelete(ctx, store, dCtx, { skipConfirm: true }),
      });
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
    if (stopSelectionMirror) { stopSelectionMirror(); stopSelectionMirror = null; }
    activeStore?.dispose();
    activeStore = null;
  },
};
