import type { ShardContext, DocumentHandle } from 'sh3-core';
import type { BackupTarget } from './targets';
import { listTargets } from './targets';

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

  return {
    ctx,
    docs,
    get targets() { return targets; },
    get targetsLoaded() { return loaded; },
    progress,
    refreshTargets,
  };
}

export type Runtime = ReturnType<typeof createRuntime>;
