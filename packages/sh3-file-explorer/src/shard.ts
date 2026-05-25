import type { SourceShard, ShardContext } from 'sh3-core';
import { sh3 } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { createExplorerStore, type ExplorerStore } from './explorerShard.svelte';
import { bindSelectionToActions, SELECTION_TYPE } from './explorerSelection.svelte';
import { runDelete } from './delete/runDelete';
import { runOpen, runOpenWith, listOpenWithLabels } from './openFile/runOpen';
import { chooseHandler } from './openFile/chooseHandler';
import { runCut, runCopy } from './clipboard/runCutCopy';
import { runPaste } from './clipboard/runPaste';
import { runRename } from './folder/runRename';
import { runNewFolder } from './folder/runNewFolder';
import { promptText } from './folder/prompt';
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
    // documents:write implies documents:browse in sh3-core 0.26 — keeping
    // browse explicit for clarity since this is an observer-class shard.
    permissions: ['documents:browse', 'documents:write'],
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

      ctx.actions.register({
        id: 'sh3-file-explorer:document.open',
        label: 'Open',
        scope: { element: SELECTION_TYPE },
        defaultShortcut: 'Enter',
        group: 'document',
        paletteItem: false,
        contextItem: true,
        run: (dCtx) => runOpen(ctx, dCtx.selection as never),
      });

      ctx.actions.register({
        id: 'sh3-file-explorer:document.open-with',
        label: 'Open With…',
        scope: { element: SELECTION_TYPE },
        group: 'document',
        paletteItem: false,
        contextItem: true,
        run: async (dCtx) => {
          const labels = await listOpenWithLabels(ctx, dCtx.selection as never);
          if (labels.length === 0) {
            sh3.toast.notify('No handlers available.', { level: 'warn' });
            return;
          }
          const choice = await chooseHandler(labels);
          if (!choice) return;
          await runOpenWith(ctx, dCtx.selection as never, choice);
        },
      });

      // MIGRATION: In sh3-core 0.26 the document handle methods always
      // exist; gating switches from capability presence to grant snapshot.
      // documents:write grant is required to mutate any bound id.
      const canWrite = () => ctx.documents.grants.write;

      ctx.actions.register({
        id: 'sh3-file-explorer:document.cut',
        label: 'Cut',
        scope: { element: SELECTION_TYPE },
        defaultShortcut: 'Ctrl+X',
        group: 'document',
        paletteItem: false,
        contextItem: true,
        disabled: () => !canWrite(),
        run: (dCtx) => { if (store.ready) runCut(store, dCtx.selection as never); },
      });

      ctx.actions.register({
        id: 'sh3-file-explorer:document.copy',
        label: 'Copy',
        scope: { element: SELECTION_TYPE },
        defaultShortcut: 'Ctrl+C',
        group: 'document',
        paletteItem: false,
        contextItem: true,
        disabled: () => !canWrite(),
        run: (dCtx) => { if (store.ready) runCopy(store, dCtx.selection as never); },
      });

      ctx.actions.register({
        id: 'sh3-file-explorer:document.paste',
        label: 'Paste',
        scope: { element: SELECTION_TYPE },
        defaultShortcut: 'Ctrl+V',
        group: 'document',
        paletteItem: false,
        contextItem: true,
        disabled: () => !canWrite() || !store.ready || store.clipboard === null,
        run: async (dCtx) => {
          if (!store.ready) return;
          const ref = (dCtx.selection as { ref?: { shardId: string; path: string; kind: 'file' | 'folder' } } | undefined)?.ref;
          if (!ref) return;
          await runPaste(ctx, store, ref);
        },
      });

      ctx.actions.register({
        id: 'sh3-file-explorer:document.rename',
        label: 'Rename…',
        scope: { element: SELECTION_TYPE },
        defaultShortcut: 'F2',
        group: 'document',
        paletteItem: false,
        contextItem: true,
        disabled: () => !canWrite(),
        run: async (dCtx) => {
          if (!store.ready) return;
          const ref = (dCtx.selection as { ref?: { shardId: string; path: string; kind: 'file' | 'folder' } } | undefined)?.ref;
          if (!ref) return;
          const initial = ref.path.split('/').pop() ?? ref.path;
          const name = await promptText('Rename', initial);
          if (!name) return;
          await runRename(ctx, store, ref, name);
        },
      });

      ctx.actions.register({
        id: 'sh3-file-explorer:document.new-folder',
        label: 'New Folder…',
        scope: 'view:sh3-file-explorer-browser',
        group: 'document',
        paletteItem: true,
        contextItem: true,
        disabled: () => !canWrite(),
        run: async () => {
          if (!store.ready) return;
          const sel = store.selection;
          const target = sel ?? { shardId: store.documents[0]?.shardId ?? 'sh3-file-explorer', path: '', kind: 'folder' as const };
          const name = await promptText('New folder', '');
          if (!name) return;
          await runNewFolder(ctx, store, target, name);
        },
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
