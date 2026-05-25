import { sh3, PermissionError, type ShardContext } from 'sh3-core';
import type { ExplorerStore } from '../explorerShard.svelte';
import { SELECTION_TYPE, type DeleteTargetRef } from '../explorerSelection.svelte';
import { readPreview } from './readPreview';
import { confirmDelete } from './confirmDelete';

type ReadyStore = Extract<ExplorerStore, { ready: true }>;

// MIGRATION: sh3-core 0.26 no longer exports `Action` from its public api.
// Mirror just the shape we touch here so we don't depend on internals.
interface ActionDispatchContext {
  action: { id: string; label: string };
  appId: string | null;
  selection?: { type: string; ref: unknown; ownerShardId: string };
  invokedVia: 'keyboard' | 'context-menu' | 'palette' | 'programmatic';
  dispatch(actionId: string): void;
}

const NO_SELECTION_TOAST = 'Select a file or folder first.';

export async function runDelete(
  ctx: ShardContext,
  store: ReadyStore,
  dCtx: ActionDispatchContext,
  opts: { skipConfirm: boolean },
): Promise<void> {
  const sel = dCtx.selection;
  if (!sel || sel.type !== SELECTION_TYPE) {
    sh3.toast.notify(NO_SELECTION_TOAST, { level: 'warn' });
    return;
  }

  const ref = sel.ref as DeleteTargetRef;
  const goStraightToDelete = ref.kind === 'file' && opts.skipConfirm;

  if (!goStraightToDelete) {
    const preview = ref.kind === 'file'
      ? await readPreview(ctx, ref.shardId, ref.path)
      : { state: 'text' as const, text: null };

    const descendantCount = ref.kind === 'folder'
      ? countDescendants(store, ref.shardId, ref.path)
      : undefined;

    const confirmed = await confirmDelete({
      target: descendantCount === undefined
        ? { shardId: ref.shardId, path: ref.path, kind: ref.kind }
        : { shardId: ref.shardId, path: ref.path, kind: ref.kind, descendantCount },
      previewText: preview.text,
      previewState: preview.state,
    });
    if (!confirmed) return;
  }

  if (ref.kind === 'file') {
    try {
      await ctx.documents.delete(`${ref.shardId}/${ref.path}`);
      sh3.toast.notify(`Deleted ${ref.path}`, { level: 'success' });
      store.setSelection(null);
    } catch (err) {
      sh3.toast.notify(
        `Failed to delete ${ref.path}: ${formatErr(err)}`,
        { level: 'error' },
      );
    }
    return;
  }

  // Folder: fan out over the locally-known descendants.
  const targets = collectFolderTargets(store, ref.shardId, ref.path);
  const results = await Promise.allSettled(
    targets.map((t) => ctx.documents.delete(`${t.shardId}/${t.path}`)),
  );
  const failed = results.filter((r) => r.status === 'rejected').length;
  if (failed === 0) {
    sh3.toast.notify(
      `Deleted folder /${ref.path} (${targets.length} files)`,
      { level: 'success' },
    );
  } else {
    sh3.toast.notify(
      `Deleted ${targets.length - failed}/${targets.length}; ${failed} failed`,
      { level: 'error' },
    );
  }
  store.setSelection(null);
}

function formatErr(err: unknown): string {
  if (err instanceof PermissionError) return err.message;
  return err instanceof Error ? err.message : String(err);
}

function collectFolderTargets(
  store: ReadyStore,
  shardId: string,
  folderPath: string,
): Array<{ shardId: string; path: string }> {
  const prefix = folderPath ? `${folderPath}/` : '';
  return store.documents
    .filter((d) => d.shardId === shardId && (folderPath === '' ? true : d.path === folderPath || d.path.startsWith(prefix)))
    .map((d) => ({ shardId: d.shardId, path: d.path }));
}

function countDescendants(store: ReadyStore, shardId: string, folderPath: string): number {
  return collectFolderTargets(store, shardId, folderPath).length;
}
