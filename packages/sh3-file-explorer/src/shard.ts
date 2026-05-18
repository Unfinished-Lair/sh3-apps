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
      // Document hydration + watcher: keep at register(). The store backs
      // the browser view which is `standalone: true`, so it can be popped
      // out into a float from any app — the documents list must already be
      // populated when that happens.
      store.refreshDocuments();
      stopWatch = store.startWatch();

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

  onAppActivate(ctx: ShardContext, _appId: string) {
    // Selection mirror is app-scoped: it writes file-explorer's local
    // selection into ctx.actions.selection (a global, single-typed slot).
    // Outside the owning app, another app's shard may legitimately own that
    // slot for its own selection type — running the mirror at SH3 boot would
    // race with that owner and trip the framework's
    //   [sh3] Shard "..." tried to clear selection owned by "..."
    // warning. Confining the mirror to onAppActivate scopes it correctly.
    if (activeStore?.ready) {
      stopSelectionMirror = bindSelectionToActions(ctx, activeStore);
    }
  },

  onAppDeactivate(_ctx: ShardContext, _appId: string) {
    if (stopSelectionMirror) {
      stopSelectionMirror();
      stopSelectionMirror = null;
    }
  },

  deactivate() {
    if (stopWatch) { stopWatch(); stopWatch = null; }
    if (stopSelectionMirror) { stopSelectionMirror(); stopSelectionMirror = null; }
    activeStore?.dispose();
    activeStore = null;
  },
};
