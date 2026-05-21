import { sh3 } from 'sh3-core';
import type { BrowseCapability } from 'sh3-core';
import type { ExplorerStore } from '../explorerShard.svelte';
import { type Ref, computeDestination, addCopySuffix, isPasteIntoSelf } from './destination';

type ReadyStore = Extract<ExplorerStore, { ready: true }>;

export async function runPaste(
  browse: BrowseCapability,
  store: ReadyStore,
  targetRef: Ref,
): Promise<void> {
  const cb = store.clipboard;
  if (!cb) return;
  const source = cb.ref;

  if (isPasteIntoSelf(source, targetRef)) {
    sh3.toast.notify('Cannot paste a folder into itself or its descendant.', { level: 'warn' });
    return;
  }

  const targetFolderPath = targetRef.kind === 'folder'
    ? targetRef.path
    : (targetRef.path.includes('/') ? targetRef.path.slice(0, targetRef.path.lastIndexOf('/')) : '');

  const sameShardAndFolder =
    source.shardId === targetRef.shardId &&
    parentDir(source.path) === targetFolderPath;

  if (cb.mode === 'cut' && sameShardAndFolder) {
    sh3.toast.notify('Source and destination are identical.', { level: 'warn' });
    return;
  }

  if (source.kind === 'file') {
    await pasteFile(browse, store, source, targetRef, cb.mode, sameShardAndFolder);
  } else {
    sh3.toast.notify('Folder paste lands in the next task.', { level: 'warn' });
  }
}

function parentDir(path: string): string {
  const i = path.lastIndexOf('/');
  return i < 0 ? '' : path.slice(0, i);
}

async function pasteFile(
  browse: BrowseCapability,
  store: ReadyStore,
  source: Ref,
  targetRef: Ref,
  mode: 'cut' | 'copy',
  sameShardAndFolder: boolean,
): Promise<void> {
  const initialDest = computeDestination(source, targetRef);
  let destPath = initialDest.path;

  if (mode === 'copy' && sameShardAndFolder) {
    let attempt = 1;
    while (true) {
      destPath = addCopySuffix(initialDest.path, attempt);
      const existing = await browse.readFrom?.(initialDest.shardId, destPath);
      if (existing == null) break;
      attempt++;
      if (attempt > 999) {
        sh3.toast.notify('Cannot find a free copy name.', { level: 'error' });
        return;
      }
    }
  }

  if (source.shardId === initialDest.shardId && mode === 'cut') {
    try {
      await browse.renameFrom!(source.shardId, source.path, destPath);
      sh3.toast.notify(`Moved to ${destPath}.`, { level: 'success' });
      store.clearClipboard();
      store.setSelection(null);
    } catch (err) {
      sh3.toast.notify(
        `Move failed: ${err instanceof Error ? err.message : String(err)}`,
        { level: 'error' },
      );
    }
    return;
  }

  const content = await browse.readFrom?.(source.shardId, source.path);
  if (content == null) {
    sh3.toast.notify(`Source no longer exists: ${source.path}.`, { level: 'warn' });
    store.clearClipboard();
    return;
  }

  try {
    await browse.writeTo!(initialDest.shardId, destPath, content);
  } catch (err) {
    sh3.toast.notify(
      `Paste failed: ${err instanceof Error ? err.message : String(err)}`,
      { level: 'error' },
    );
    return;
  }

  if (mode === 'cut') {
    try {
      await browse.deleteFrom!(source.shardId, source.path);
    } catch (err) {
      sh3.toast.notify(
        `Copied to ${destPath}, but failed to remove source: ${err instanceof Error ? err.message : String(err)}`,
        { level: 'warn' },
      );
      return;
    }
    store.clearClipboard();
  }
  sh3.toast.notify(`${mode === 'cut' ? 'Moved' : 'Copied'} to ${destPath}.`, { level: 'success' });
  store.setSelection(null);
}
