import { shell } from 'sh3-core';
import DeleteConfirmModal from './DeleteConfirmModal.svelte';
import type { PreviewState } from './readPreview';

export interface ConfirmDeleteArgs {
  target: {
    shardId: string;
    path: string;
    kind: 'file' | 'folder';
    descendantCount?: number;
  };
  previewText: string | null;
  previewState: PreviewState;
}

export function confirmDelete(args: ConfirmDeleteArgs): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (result: boolean) => {
      if (settled) return;
      settled = true;
      handle.close();
      resolve(result);
    };
    const handle = shell.modal.open(
      DeleteConfirmModal,
      {
        target: args.target,
        previewText: args.previewText,
        previewState: args.previewState,
        onConfirm: () => settle(true),
        onCancel: () => settle(false),
      },
      { dismissOnBackdrop: false },
    );
  });
}
