import { sh3, type BrowseCapability, type DocumentMeta } from 'sh3-core';
import type { Ref } from '../clipboard/destination';
import type { ExplorerStore } from '../explorerShard.svelte';

type ReadyStore = Extract<ExplorerStore, { ready: true }>;
type Descendant = DocumentMeta & { shardId: string };

export function renamePathsFor(
  source: Ref,
  newBaseName: string,
  documents: Descendant[],
): Array<[string, string]> {
  const dirIdx = source.path.lastIndexOf('/');
  const parent = dirIdx < 0 ? '' : source.path.slice(0, dirIdx);
  const newPath = parent ? `${parent}/${newBaseName}` : newBaseName;

  if (source.kind === 'file') {
    return [[source.path, newPath]];
  }

  const sourcePrefix = source.path === '' ? '' : `${source.path}/`;
  const newPrefix = newPath === '' ? '' : `${newPath}/`;
  return documents
    .filter((d) => d.shardId === source.shardId && (source.path === '' || d.path === source.path || d.path.startsWith(sourcePrefix)))
    .map((d) => {
      const rel = source.path === '' ? d.path : d.path.slice(sourcePrefix.length);
      return [d.path, rel ? `${newPrefix}${rel}` : newPath];
    });
}

export async function runRename(
  browse: BrowseCapability,
  store: ReadyStore,
  source: Ref,
  newBaseName: string,
): Promise<void> {
  if (newBaseName.includes('/') || newBaseName.includes('..') || !newBaseName.trim()) {
    sh3.toast.notify('Name must not be empty or contain "/" or "..".', { level: 'warn' });
    return;
  }
  const pairs = renamePathsFor(source, newBaseName, store.documents);
  if (pairs.length === 0) {
    sh3.toast.notify('Nothing to rename.', { level: 'warn' });
    return;
  }

  if (source.kind === 'file') {
    try {
      await browse.renameFrom!(source.shardId, pairs[0][0], pairs[0][1]);
      sh3.toast.notify(`Renamed to ${pairs[0][1]}.`, { level: 'success' });
      store.setSelection({ shardId: source.shardId, path: pairs[0][1], kind: 'file' });
    } catch (err) {
      sh3.toast.notify(
        `Rename failed: ${err instanceof Error ? err.message : String(err)}`,
        { level: 'error' },
      );
    }
    return;
  }

  const results = await Promise.allSettled(
    pairs.map(([oldPath, newPath]) => browse.renameFrom!(source.shardId, oldPath, newPath)),
  );
  const failed = results.filter((r) => r.status === 'rejected').length;
  if (failed === 0) {
    sh3.toast.notify(`Renamed folder (${pairs.length} files).`, { level: 'success' });
    const dirIdx = source.path.lastIndexOf('/');
    const parent = dirIdx < 0 ? '' : source.path.slice(0, dirIdx);
    const newPath = parent ? `${parent}/${newBaseName}` : newBaseName;
    store.setSelection({ shardId: source.shardId, path: newPath, kind: 'folder' });
  } else {
    sh3.toast.notify(`${pairs.length - failed}/${pairs.length} done; ${failed} failed.`, { level: 'error' });
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[sh3-file-explorer] rename failed for ${pairs[i][0]}:`, r.reason);
      }
    });
  }
}
