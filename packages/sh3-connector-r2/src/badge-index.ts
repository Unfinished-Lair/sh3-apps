import type { UploadLogEntry } from './upload-log';

export function buildBadgeIndexFromLog(entries: readonly UploadLogEntry[]): Map<string, UploadLogEntry> {
  const ix = new Map<string, UploadLogEntry>();
  for (const e of entries) {
    if (e.status !== 'uploaded') continue;
    const key = `${e.shardId}/${e.path}`;
    const prev = ix.get(key);
    if (!prev || e.at > prev.at) ix.set(key, e);
  }
  return ix;
}
