import { shell, type ShardContext } from 'sh3-core';
import type { Action } from 'sh3-core';
import type { ExplorerStore } from '../explorerShard.svelte';
import { SELECTION_TYPE, type DeleteTargetRef } from '../explorerSelection.svelte';
import { readPreview } from './readPreview';
import { confirmDelete } from './confirmDelete';

type ReadyStore = Extract<ExplorerStore, { ready: true }>;
type ActionDispatchContext = Parameters<Action['run']>[0];

const FEATURE_GATE_TOAST = 'Delete requires sh3-core with browse.deleteFrom (RFC pending).';
const NO_SELECTION_TOAST = 'Select a file or folder first.';

export async function runDelete(
  ctx: ShardContext,
  store: ReadyStore,
  dCtx: ActionDispatchContext,
  opts: { skipConfirm: boolean },
): Promise<void> {
  const sel = dCtx.selection;
  if (!sel || sel.type !== SELECTION_TYPE) {
    shell.toast.notify(NO_SELECTION_TOAST, { level: 'warn' });
    return;
  }

  const browse = ctx.browse;
  if (!browse || typeof browse.deleteFrom !== 'function') {
    shell.toast.notify(FEATURE_GATE_TOAST, { level: 'warn' });
    return;
  }

  const ref = sel.ref as DeleteTargetRef;
  const goStraightToDelete = ref.kind === 'file' && opts.skipConfirm;

  if (!goStraightToDelete) {
    const preview = ref.kind === 'file'
      ? await readPreview(browse, ref.shardId, ref.path)
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
      await browse.deleteFrom(ref.shardId, ref.path);
      shell.toast.notify(`Deleted ${ref.path}`, { level: 'success' });
      store.setSelection(null);
    } catch (err) {
      shell.toast.notify(
        `Failed to delete ${ref.path}: ${err instanceof Error ? err.message : String(err)}`,
        { level: 'error' },
      );
    }
    return;
  }

  // Folder: fan out over the locally-known descendants.
  const targets = collectFolderTargets(store, ref.shardId, ref.path);
  const results = await Promise.allSettled(
    targets.map((t) => browse.deleteFrom!(t.shardId, t.path)),
  );
  const failed = results.filter((r) => r.status === 'rejected').length;
  if (failed === 0) {
    shell.toast.notify(
      `Deleted folder /${ref.path} (${targets.length} files)`,
      { level: 'success' },
    );
  } else {
    shell.toast.notify(
      `Deleted ${targets.length - failed}/${targets.length}; ${failed} failed`,
      { level: 'error' },
    );
  }
  store.setSelection(null);
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
