import type { ConflictsApi, ConflictItem, ConflictManagerBranch } from 'sh3-core';

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

function extensionOf(path: string): string | undefined {
  const dot = path.lastIndexOf('.');
  if (dot < 0) return undefined;
  const slash = path.lastIndexOf('/');
  if (dot < slash) return undefined;
  return path.slice(dot);
}

function toConflictItem(input: ImportConflictInput): ConflictItem {
  const id = `${input.shardId}/${input.path}`;
  const localBranch: ConflictManagerBranch = {
    origin: 'local',
    version: input.localVersion,
    at: input.localAt,
    content: input.localContent,
  };
  const remoteBranch: ConflictManagerBranch = {
    origin: `r2:${input.targetLabel}`,
    version: 0,
    at: input.incomingAt,
    content: input.incomingContent,
  };
  const item: ConflictItem = {
    id,
    label: id,
    branches: [localBranch, remoteBranch],
    meta: { remoteKey: input.remoteKey, shardId: input.shardId, path: input.path },
  };
  const ext = extensionOf(input.path);
  if (ext !== undefined) item.extension = ext;
  return item;
}

export async function presentImportConflicts(
  conflictsApi: ConflictsApi,
  items: ImportConflictInput[],
): Promise<ImportConflictDecision[] | 'cancelled'> {
  if (items.length === 0) return [];
  const conflictItems = items.map(toConflictItem);
  const byId = new Map<string, ImportConflictInput>(
    items.map((i) => [`${i.shardId}/${i.path}`, i]),
  );

  let outcome;
  try {
    outcome = await conflictsApi.resolve(conflictItems, { title: 'Resolve R2 import conflicts' });
  } catch {
    return 'cancelled';
  }

  if (outcome.status === 'cancelled') return 'cancelled';

  const decisions: ImportConflictDecision[] = [];
  for (const choice of outcome.choices) {
    const input = byId.get(choice.itemId);
    if (!input) continue;
    const resolved: 'local' | 'incoming' = choice.chosen.origin === 'local' ? 'local' : 'incoming';
    decisions.push({
      shardId: input.shardId,
      path: input.path,
      choice: resolved,
      remoteKey: input.remoteKey,
    });
  }
  for (const itemId of outcome.skipped) {
    const input = byId.get(itemId);
    if (!input) continue;
    decisions.push({
      shardId: input.shardId,
      path: input.path,
      choice: 'skipped',
      remoteKey: input.remoteKey,
    });
  }
  return decisions;
}
