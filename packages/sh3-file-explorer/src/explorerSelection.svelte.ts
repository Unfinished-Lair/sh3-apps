import type { ShardContext } from 'sh3-core';
import type { ExplorerStore, Selection } from './explorerShard.svelte';

export const SELECTION_TYPE = 'sh3-file-explorer.document';

export type DeleteTargetRef = {
  shardId: string;
  path: string;
  kind: 'file' | 'folder';
};

export type SelectionPayload = { type: typeof SELECTION_TYPE; ref: DeleteTargetRef };

type ReadyStore = Extract<ExplorerStore, { ready: true }>;

export function selectionToActionPayload(sel: Selection): SelectionPayload | null {
  if (!sel) return null;
  return {
    type: SELECTION_TYPE,
    ref: { shardId: sel.shardId, path: sel.path, kind: sel.kind },
  };
}

export function bindSelectionToActions(ctx: ShardContext, store: ReadyStore): () => void {
  return $effect.root(() => {
    $effect(() => {
      const payload = selectionToActionPayload(store.selection);
      if (payload === null) ctx.actions.selection.clear();
      else ctx.actions.selection.set(payload);
    });
  });
}
