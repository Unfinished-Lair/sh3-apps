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
    // Phase 5.3 fills modal flow.
    return;
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

  void readPreview; void confirmDelete;
}
