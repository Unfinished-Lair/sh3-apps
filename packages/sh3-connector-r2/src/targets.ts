import type { DocumentHandle } from 'sh3-core';

export interface BackupTarget {
  id: string;
  label: string;
  accountId: string;
  bucket: string;
  region: 'auto';
  keyPrefix: string;
  accessKeyId: string;
  secretAccessKey: string;
  createdAt: string;
}

const DIR = 'targets/';

export function newTargetId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  return `tgt-${hex}`;
}

function scopedDir(handle: DocumentHandle): string {
  return `${handle.boundId}/${DIR}`;
}

export async function listTargets(handle: DocumentHandle): Promise<BackupTarget[]> {
  // sh3-core 0.26: list() returns scope-rooted paths under this handle's boundId.
  const prefix = scopedDir(handle);
  const metas = await handle.list();
  const out: BackupTarget[] = [];
  for (const meta of metas) {
    if (!meta.path.startsWith(prefix) || !meta.path.endsWith('.json')) continue;
    const raw = await handle.readText(meta.path);
    if (!raw) continue;
    try {
      out.push(JSON.parse(raw) as BackupTarget);
    } catch {
      // skip corrupt file
    }
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

export async function saveTarget(handle: DocumentHandle, tgt: BackupTarget): Promise<void> {
  await handle.writeText(`${scopedDir(handle)}${tgt.id}.json`, JSON.stringify(tgt, null, 2));
}

export async function deleteTarget(handle: DocumentHandle, id: string): Promise<void> {
  await handle.delete(`${scopedDir(handle)}${id}.json`);
}
