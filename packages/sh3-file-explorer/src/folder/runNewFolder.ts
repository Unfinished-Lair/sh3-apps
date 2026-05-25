import { sh3, type ShardContext } from 'sh3-core';
import type { ExplorerStore } from '../explorerShard.svelte';
import type { Ref } from '../clipboard/destination';

type ReadyStore = Extract<ExplorerStore, { ready: true }>;

/** Minimal slice of ShardContext used by runNewFolder — exported for tests. */
export interface NewFolderCtx {
  documents: {
    writeText(path: string, content: string): Promise<void>;
  };
}

export function validateFolderName(name: string, siblings: string[]): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Folder name cannot be empty.';
  if (trimmed.includes('/') || trimmed === '..' || trimmed === '.') {
    return 'Folder name cannot contain "/" or "..".';
  }
  if (siblings.includes(trimmed)) return `Folder "${trimmed}" already exists.`;
  return null;
}

export function computePlaceholderPath(parentFolder: string, name: string): string {
  const base = parentFolder ? `${parentFolder}/${name}` : name;
  return `${base}/.keep`;
}

export function listSiblingFolders(
  documents: ReadyStore['documents'],
  shardId: string,
  parentFolder: string,
): string[] {
  const prefix = parentFolder ? `${parentFolder}/` : '';
  const siblings = new Set<string>();
  for (const d of documents) {
    if (d.shardId !== shardId) continue;
    if (!d.path.startsWith(prefix)) continue;
    const rest = d.path.slice(prefix.length);
    const slashIdx = rest.indexOf('/');
    if (slashIdx > 0) siblings.add(rest.slice(0, slashIdx));
  }
  return [...siblings];
}

export async function runNewFolder(
  ctx: NewFolderCtx,
  store: ReadyStore,
  target: Ref,
  name: string,
): Promise<void> {
  const parentFolder = target.kind === 'folder'
    ? target.path
    : (target.path.includes('/') ? target.path.slice(0, target.path.lastIndexOf('/')) : '');
  const siblings = listSiblingFolders(store.documents, target.shardId, parentFolder);
  const reason = validateFolderName(name, siblings);
  if (reason) { sh3.toast.notify(reason, { level: 'warn' }); return; }
  const placeholderPath = computePlaceholderPath(parentFolder, name.trim());
  try {
    await ctx.documents.writeText(`${target.shardId}/${placeholderPath}`, '');
    sh3.toast.notify(
      `Created folder "${name.trim()}" (.keep placeholder; sh3#34 will remove the need).`,
      { level: 'success' },
    );
  } catch (err) {
    sh3.toast.notify(
      `New folder failed: ${err instanceof Error ? err.message : String(err)}`,
      { level: 'error' },
    );
  }
}

export type _CtxOk = ShardContext extends NewFolderCtx ? true : false;
