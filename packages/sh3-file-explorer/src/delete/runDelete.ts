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

  void store; void opts; void readPreview; void confirmDelete; void (sel.ref as DeleteTargetRef);
}
