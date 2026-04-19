import type { ServerShard, ServerShardContext } from 'sh3-core';
import { registerRoutes } from './routes.js';
import { bootTenants, type ReplicaConfig } from './boot.js';
import { runLoopOnce } from './loop.js';
import { pushBatch, pullSinceTick } from './http-client.js';
import { appendPending } from './pending.js';

const DEFAULT_TICK_MS = 10_000;

let loopInterval: ReturnType<typeof setInterval> | null = null;

const shard: ServerShard = {
  id: 'sh3-sync',

  async routes(router, ctx: ServerShardContext) {
    registerRoutes(router as any, ctx);

    const replicas = await bootTenants({
      dataDir: ctx.dataDir,
      tenants: ctx.tenants(),
      setPeerRole: ctx.setPeerRole,
    });

    if (replicas.length === 0) return;

    const cursors = new Map<string, number>();
    const tickMs = replicas[0].tickIntervalMs ?? DEFAULT_TICK_MS;

    const tick = async () => {
      for (const replica of replicas) {
        try {
          await runReplicaTick(ctx, replica, cursors);
        } catch (err) {
          console.error(`[sh3-sync] tick failed for ${replica.tenant}:`, err);
        }
      }
    };

    loopInterval = setInterval(() => { void tick(); }, tickMs);
  },

  teardown() {
    if (loopInterval) clearInterval(loopInterval);
    loopInterval = null;
  },
};

async function runReplicaTick(
  ctx: ServerShardContext,
  replica: ReplicaConfig,
  cursors: Map<string, number>,
): Promise<void> {
  const docs = ctx.documents(replica.tenant);
  await runLoopOnce({
    dataDir: ctx.dataDir,
    tenant: replica.tenant,
    primaryUrl: replica.primaryUrl,
    apiKey: replica.apiKey,
    push: pushBatch,
    pull: pullSinceTick,
    applyChange: async (change) => {
      await docs.applyFromPeer({
        shardId: change.shardId,
        path: change.path,
        content: change.content,
        incomingVersion: change.version,
        expectedLocalVersion: change.version - 1,
        origin: change.metadata.origin ?? 'primary',
        deleted: change.metadata.deleted,
      });
    },
    cursor: {
      get: async () => cursors.get(replica.tenant) ?? 0,
      set: async (n) => { cursors.set(replica.tenant, n); },
    },
  });
}

export default shard;
export { appendPending };
