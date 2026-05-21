import type { ExplorerStore } from '../explorerShard.svelte';
import { SELECTION_TYPE, type DeleteTargetRef } from '../explorerSelection.svelte';

type ReadyStore = Extract<ExplorerStore, { ready: true }>;
type Sel = { type: string; ref: unknown };

function asTargetRef(sel: Sel): DeleteTargetRef | null {
  if (sel.type !== SELECTION_TYPE) return null;
  const ref = sel.ref as DeleteTargetRef | undefined;
  if (!ref || typeof ref.shardId !== 'string' || typeof ref.path !== 'string') return null;
  if (ref.kind !== 'file' && ref.kind !== 'folder') return null;
  return ref;
}

export function runCut(store: ReadyStore, sel: Sel): void {
  const ref = asTargetRef(sel);
  if (!ref) return;
  store.setClipboard({ mode: 'cut', ref });
}

export function runCopy(store: ReadyStore, sel: Sel): void {
  const ref = asTargetRef(sel);
  if (!ref) return;
  store.setClipboard({ mode: 'copy', ref });
}
