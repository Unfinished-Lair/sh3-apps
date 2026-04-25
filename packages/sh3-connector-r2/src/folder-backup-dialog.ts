import { mount, unmount } from 'svelte';
import type { Runtime } from './runtime.svelte';
import FolderBackupDialog from './views/FolderBackupDialog.svelte';

export function openFolderBackupDialog(input: {
  rt: Runtime;
  shardId: string;
  pathPrefix: string;
}): void {
  const host = document.createElement('div');
  host.className = 'r2-folder-dialog-host';
  document.body.appendChild(host);

  let cmp: ReturnType<typeof mount> | null = null;
  const close = () => {
    if (cmp) unmount(cmp);
    cmp = null;
    host.remove();
  };

  cmp = mount(FolderBackupDialog, {
    target: host,
    props: { rt: input.rt, shardId: input.shardId, pathPrefix: input.pathPrefix, onClose: close },
  });
}
