import type { ConflictsApi } from 'sh3-core';

export interface ImportConflictInput {
  shardId: string;
  path: string;
  localContent: string;
  localVersion: number;
  localAt: number;
  incomingContent: string;
  incomingAt: number;
  targetLabel: string;
  remoteKey: string;
}

export type ImportConflictDecision =
  | { path: string; shardId: string; choice: 'local' | 'incoming'; remoteKey: string }
  | { path: string; shardId: string; choice: 'skipped'; remoteKey: string };

export async function presentImportConflicts(
  conflictsApi: ConflictsApi,
  items: ImportConflictInput[],
): Promise<ImportConflictDecision[] | 'cancelled'> {
  if (items.length === 0) return [];
  throw new Error('not implemented');
}
