import type { DocumentHandle } from 'sh3-core';

export interface UploadLogEntry {
  id: string;
  targetId: string;
  shardId: string;
  path: string;
  sha256: string;
  size: number;
  status: 'uploaded' | 'skipped-unchanged' | 'failed';
  reason?: string;
  at: string;
}

const DIR = 'uploads/';

function monthFolder(iso: string): string {
  return iso.slice(0, 7);  // "YYYY-MM"
}

function randomSuffix(): string {
  const b = new Uint8Array(4);
  crypto.getRandomValues(b);
  let s = '';
  for (const x of b) s += x.toString(16).padStart(2, '0');
  return s;
}

function scopedDir(handle: DocumentHandle): string {
  // sh3-core 0.26: all paths into ctx.documents are scope-rooted by boundId.
  return `${handle.boundId}/${DIR}`;
}

export async function appendLog(handle: DocumentHandle, entry: UploadLogEntry): Promise<void> {
  const folder = `${scopedDir(handle)}${monthFolder(entry.at)}/`;
  // Colons in ISO timestamps break filesystem-backed storage on Windows.
  // Replace them in the filename only; entry.at inside the JSON keeps the canonical ISO string.
  const safeAt = entry.at.replace(/:/g, '-');
  const filename = `${safeAt}-${randomSuffix()}.json`;
  await handle.writeText(`${folder}${filename}`, JSON.stringify(entry, null, 2));
}

export async function listRecentLog(handle: DocumentHandle, limit: number): Promise<UploadLogEntry[]> {
  const prefix = scopedDir(handle);
  const metas = await handle.list();
  const months = new Set<string>();
  for (const m of metas) {
    if (!m.path.startsWith(prefix)) continue;
    const rest = m.path.slice(prefix.length);
    const slash = rest.indexOf('/');
    if (slash > 0) months.add(rest.slice(0, slash));
  }
  const sortedMonths = Array.from(months).sort().reverse().slice(0, 2);

  const entries: UploadLogEntry[] = [];
  for (const m of metas) {
    const monthMatch = sortedMonths.find((mo) => m.path.startsWith(`${prefix}${mo}/`));
    if (!monthMatch) continue;
    if (!m.path.endsWith('.json')) continue;
    const raw = await handle.readText(m.path);
    if (!raw) continue;
    try {
      entries.push(JSON.parse(raw) as UploadLogEntry);
    } catch {
      // skip corrupt file
    }
  }
  entries.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
  return entries.slice(0, limit);
}

export async function listAllSuccessfulLog(handle: DocumentHandle): Promise<UploadLogEntry[]> {
  const prefix = scopedDir(handle);
  const metas = await handle.list();
  const entries: UploadLogEntry[] = [];
  for (const m of metas) {
    if (!m.path.startsWith(prefix)) continue;
    if (!m.path.endsWith('.json')) continue;
    const raw = await handle.readText(m.path);
    if (!raw) continue;
    try {
      const e = JSON.parse(raw) as UploadLogEntry;
      if (e.status === 'uploaded') entries.push(e);
    } catch {
      // skip corrupt file
    }
  }
  return entries;
}
