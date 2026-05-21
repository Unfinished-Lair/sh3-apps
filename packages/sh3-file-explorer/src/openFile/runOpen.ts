import { sh3, type FileRef, type ShardContext } from 'sh3-core';
import { dispatchOpen, listHandlersFor } from './dispatch';
import { SELECTION_TYPE } from '../explorerSelection.svelte';

type Sel = { type: string; ref: { shardId: string; path: string; kind: 'file' | 'folder' } };

function refToFile(ctx: ShardContext, ref: Sel['ref']): FileRef {
  return { path: `${ref.shardId}/${ref.path}`, tenantId: (ctx as { tenantId?: string }).tenantId ?? '', binary: false };
}

function extOf(path: string): string {
  const i = path.lastIndexOf('.');
  return i < 0 ? '' : path.slice(i);
}

export async function runOpen(ctx: ShardContext, sel: Sel): Promise<void> {
  if (sel.type !== SELECTION_TYPE) return;
  if (sel.ref.kind !== 'file') return;
  const file = refToFile(ctx, sel.ref);
  const result = await dispatchOpen(ctx, file);
  if (result.status === 'no-handler') {
    sh3.toast.notify(`No handler for ${extOf(sel.ref.path) || sel.ref.path} files.`, { level: 'warn' });
    return;
  }
  if (result.status === 'failed') {
    sh3.toast.notify(`Failed to open ${sel.ref.path}: ${result.error.message}`, { level: 'error' });
    return;
  }
}

export async function runOpenWith(ctx: ShardContext, sel: Sel, handlerLabel: string): Promise<void> {
  if (sel.type !== SELECTION_TYPE) return;
  if (sel.ref.kind !== 'file') return;
  const file = refToFile(ctx, sel.ref);
  const result = await dispatchOpen(ctx, file, { handlerLabel });
  if (result.status === 'failed') {
    sh3.toast.notify(`Failed to open ${sel.ref.path}: ${result.error.message}`, { level: 'error' });
  }
}

export async function listOpenWithLabels(ctx: ShardContext, sel: Sel): Promise<string[]> {
  if (sel.type !== SELECTION_TYPE || sel.ref.kind !== 'file') return [];
  const file = refToFile(ctx, sel.ref);
  const handlers = await listHandlersFor(ctx, file);
  return handlers.map((h) => h.label);
}
