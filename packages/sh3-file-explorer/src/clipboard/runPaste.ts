import { sh3, type ShardContext } from 'sh3-core';
import type { ExplorerStore } from '../explorerShard.svelte';
import { type Ref, computeDestination, addCopySuffix, isPasteIntoSelf } from './destination';

type ReadyStore = Extract<ExplorerStore, { ready: true }>;

/**
 * Minimal slice of ShardContext that the paste verbs need. Defined
 * separately so tests can pass a thin stub.
 */
export interface PasteCtx {
  documents: {
    readBinary(path: string): Promise<ArrayBuffer | null>;
    writeBinary(path: string, content: ArrayBuffer): Promise<void>;
    rename(oldPath: string, newPath: string): Promise<void>;
    delete(path: string): Promise<void>;
  };
}

function rooted(shardId: string, path: string): string {
  return `${shardId}/${path}`;
}

export async function runPaste(
  ctx: PasteCtx,
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
    await pasteFile(ctx, store, source, targetRef, cb.mode, sameShardAndFolder);
  } else {
    await pasteFolder(ctx, store, source, targetRef, cb.mode);
  }
}

function parentDir(path: string): string {
  const i = path.lastIndexOf('/');
  return i < 0 ? '' : path.slice(0, i);
}

async function pasteFile(
  ctx: PasteCtx,
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
      const existing = await ctx.documents.readBinary(rooted(initialDest.shardId, destPath));
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
      await ctx.documents.rename(rooted(source.shardId, source.path), rooted(source.shardId, destPath));
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

  const content = await ctx.documents.readBinary(rooted(source.shardId, source.path));
  if (content == null) {
    sh3.toast.notify(`Source no longer exists: ${source.path}.`, { level: 'warn' });
    store.clearClipboard();
    return;
  }

  try {
    await ctx.documents.writeBinary(rooted(initialDest.shardId, destPath), content);
  } catch (err) {
    sh3.toast.notify(
      `Paste failed: ${err instanceof Error ? err.message : String(err)}`,
      { level: 'error' },
    );
    return;
  }

  if (mode === 'cut') {
    try {
      await ctx.documents.delete(rooted(source.shardId, source.path));
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

async function pasteFolder(
  ctx: PasteCtx,
  store: ReadyStore,
  source: Ref,
  targetRef: Ref,
  mode: 'cut' | 'copy',
): Promise<void> {
  const sourcePrefix = source.path === '' ? '' : `${source.path}/`;
  const targetFolder = targetRef.kind === 'folder'
    ? targetRef.path
    : (targetRef.path.includes('/') ? targetRef.path.slice(0, targetRef.path.lastIndexOf('/')) : '');
  const newBase = targetFolder
    ? `${targetFolder}/${basename(source.path)}`
    : basename(source.path);

  const descendants = store.documents.filter((d) =>
    d.shardId === source.shardId &&
    (source.path === '' || d.path === source.path || d.path.startsWith(sourcePrefix)),
  );

  const tasks = descendants.map(async (d) => {
    const rel = source.path === '' ? d.path : d.path.slice(sourcePrefix.length);
    const destPath = rel ? `${newBase}/${rel}` : newBase;
    if (source.shardId === targetRef.shardId && mode === 'cut') {
      await ctx.documents.rename(rooted(source.shardId, d.path), rooted(source.shardId, destPath));
      return;
    }
    const content = await ctx.documents.readBinary(rooted(source.shardId, d.path));
    if (content == null) throw new Error(`source missing: ${d.path}`);
    await ctx.documents.writeBinary(rooted(targetRef.shardId, destPath), content);
    if (mode === 'cut') {
      await ctx.documents.delete(rooted(source.shardId, d.path));
    }
  });

  const results = await Promise.allSettled(tasks);
  const failed = results.filter((r) => r.status === 'rejected').length;
  if (failed === 0) {
    sh3.toast.notify(`${mode === 'cut' ? 'Moved' : 'Copied'} folder /${source.path} (${descendants.length} files).`, { level: 'success' });
  } else {
    sh3.toast.notify(`${descendants.length - failed}/${descendants.length} done; ${failed} failed.`, { level: 'error' });
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[sh3-file-explorer] paste failed for ${descendants[i].path}:`, r.reason);
      }
    });
  }
  if (mode === 'cut' && failed === 0) store.clearClipboard();
  store.setSelection(null);
}

function basename(path: string): string {
  const i = path.lastIndexOf('/');
  return i < 0 ? path : path.slice(i + 1);
}

// Compile-time assert that ShardContext satisfies the PasteCtx shape so
// callers can pass `ctx` directly without further adapters.
export type _CtxOk = ShardContext extends PasteCtx ? true : false;
