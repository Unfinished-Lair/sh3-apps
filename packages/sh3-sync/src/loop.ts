import { listPending, removePending } from './pending.js';
import type { PushEntry, PushResult, PullResponse, PullChange } from './types.js';

export interface LoopOnceInput {
  dataDir: string;
  tenant: string;
  primaryUrl: string;
  apiKey: string;
  push: (primaryUrl: string, apiKey: string, tenant: string, batch: PushEntry[]) => Promise<PushResult[]>;
  pull: (primaryUrl: string, apiKey: string, tenant: string, sinceTick: number) => Promise<PullResponse>;
  applyChange: (change: PullChange) => Promise<void>;
  cursor: { get: () => Promise<number>; set: (n: number) => Promise<void> };
}

export async function runLoopOnce(input: LoopOnceInput): Promise<void> {
  const pending = await listPending(input.dataDir, input.tenant);
  if (pending.length > 0) {
    const results = await input.push(input.primaryUrl, input.apiKey, input.tenant, pending);
    for (let i = 0; i < pending.length; i += 1) {
      const entry = pending[i];
      const result = results[i];
      if (result?.applied) {
        await removePending(input.dataDir, input.tenant, entry.shardId, entry.path);
      }
    }
  }

  const sinceTick = await input.cursor.get();
  const resp = await input.pull(input.primaryUrl, input.apiKey, input.tenant, sinceTick);
  for (const change of resp.changes) {
    await input.applyChange(change);
  }
  await input.cursor.set(resp.tick);
}
