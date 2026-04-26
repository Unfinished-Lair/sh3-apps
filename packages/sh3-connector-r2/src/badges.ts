import type { UploadLogEntry } from './upload-log';

export interface Badge {
  icon: string;
  tone?: 'ok' | 'warn' | 'muted';
  tooltip?: string;
  label?: string;
  detail?: string;
}

export interface BadgeDoc {
  shardId: string;
  path: string;
  kind: 'file' | 'folder';
  lastModified?: number;
  descendantCount?: number;
}

export function buildR2Badge(ix: Map<string, UploadLogEntry>, doc: BadgeDoc): Badge | null {
  return doc.kind === 'folder' ? buildFolderBadge(ix, doc) : buildFileBadge(ix, doc);
}

function buildFileBadge(ix: Map<string, UploadLogEntry>, doc: BadgeDoc): Badge | null {
  const entry = ix.get(`${doc.shardId}/${doc.path}`);
  if (!entry) return null;
  const stale = doc.lastModified !== undefined && doc.lastModified > Date.parse(entry.at);
  return stale
    ? {
        icon: '⚠',
        tone: 'warn',
        tooltip: 'Edited after last backup',
        label: 'Backup is stale',
        detail: `Last backup ${entry.at}`,
      }
    : {
        icon: '☁',
        tone: 'ok',
        tooltip: 'Backed up',
        label: 'Backed up to R2',
        detail: entry.at,
      };
}

function buildFolderBadge(ix: Map<string, UploadLogEntry>, doc: BadgeDoc): Badge | null {
  if (doc.descendantCount === 0) return null;
  const prefix = `${doc.shardId}/${doc.path}${doc.path ? '/' : ''}`;
  let n = 0;
  for (const key of ix.keys()) if (key.startsWith(prefix)) n++;
  if (n === 0) return null;
  const total = doc.descendantCount;
  const display = total !== undefined ? Math.min(n, total) : n;
  const label = total !== undefined ? `${display}/${total} backed up` : `${display} backed up`;
  return { icon: '☁', tone: 'ok', tooltip: label, label };
}
