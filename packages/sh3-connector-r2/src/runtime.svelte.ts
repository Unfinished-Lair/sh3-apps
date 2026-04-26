import type { ShardContext, DocumentHandle } from 'sh3-core';
import type { BackupTarget } from './targets';
import type { UploadLogEntry } from './upload-log';
import { listTargets } from './targets';
import { listAllSuccessfulLog } from './upload-log';
import { buildBadgeIndexFromLog } from './badge-index';
import { createBadgeSubscribers } from './badge-subscribers';

export interface ProgressState {
  running: boolean;
  currentLabel: string;
  total: number;
  processed: number;
  uploaded: number;
  skipped: number;
  failed: number;
  errors: string[];
}

export function createRuntime(ctx: ShardContext) {
  const docs: DocumentHandle = ctx.documents({ format: 'text' });

  let targets = $state<BackupTarget[]>([]);
  let loaded = $state(false);
  const progress = $state<ProgressState>({
    running: false,
    currentLabel: '',
    total: 0,
    processed: 0,
    uploaded: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  });

  async function refreshTargets(): Promise<void> {
    targets = await listTargets(docs);
    loaded = true;
  }

  let badgeIndex: Map<string, UploadLogEntry> | null = null;
  let inflight: Promise<Map<string, UploadLogEntry>> | null = null;
  const badgeSubs = createBadgeSubscribers();

  function notifyBadgeChange(): void {
    badgeSubs.notify((err) => console.error('[sh3-connector-r2] badge subscriber threw:', err));
  }

  async function ensureBadgeIndex(): Promise<Map<string, UploadLogEntry>> {
    if (badgeIndex) return badgeIndex;
    if (inflight) return inflight;
    inflight = (async () => {
      const all = await listAllSuccessfulLog(docs);
      const ix = buildBadgeIndexFromLog(all);
      badgeIndex = ix;
      inflight = null;
      notifyBadgeChange();
      return ix;
    })();
    return inflight;
  }

  function peekBadgeIndex(): Map<string, UploadLogEntry> | null {
    return badgeIndex;
  }

  function recordBadgeUpload(entry: UploadLogEntry): void {
    if (entry.status !== 'uploaded') return;
    if (badgeIndex) {
      const key = `${entry.shardId}/${entry.path}`;
      const prev = badgeIndex.get(key);
      if (!prev || entry.at > prev.at) badgeIndex.set(key, entry);
    }
    notifyBadgeChange();
  }

  function subscribeBadgeChange(cb: () => void): () => void {
    return badgeSubs.subscribe(cb);
  }

  return {
    ctx,
    docs,
    get targets() { return targets; },
    get targetsLoaded() { return loaded; },
    progress,
    refreshTargets,
    peekBadgeIndex,
    ensureBadgeIndex,
    recordBadgeUpload,
    subscribeBadgeChange,
  };
}

export type Runtime = ReturnType<typeof createRuntime>;
