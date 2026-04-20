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

export async function listTargets(handle: DocumentHandle): Promise<BackupTarget[]> {
  const metas = await handle.list();
  const out: BackupTarget[] = [];
  for (const meta of metas) {
    if (!meta.path.startsWith(DIR) || !meta.path.endsWith('.json')) continue;
    const raw = await handle.read(meta.path);
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
  await handle.write(`${DIR}${tgt.id}.json`, JSON.stringify(tgt, null, 2));
}

export async function deleteTarget(handle: DocumentHandle, id: string): Promise<void> {
  await handle.delete(`${DIR}${id}.json`);
}
