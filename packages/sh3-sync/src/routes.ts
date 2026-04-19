import type { ServerShardContext } from 'sh3-core';

type HonoLike = {
  post(path: string, ...handlers: any[]): any;
  get(path: string, ...handlers: any[]): any;
};

export function registerRoutes(router: HonoLike, ctx: ServerShardContext): void {
  const gate = ctx.scopeRequired('sync:peer');

  router.post('/push/:tenant', gate, async (c: any) => {
    const caller = c.get('caller');
    if (caller?.peerRole !== 'replica') {
      return c.json({ error: 'Only replicas may push' }, 403);
    }
    const tenant = c.req.param('tenant');
    const body = (await c.req.json()) as { batch: Array<{
      shardId: string;
      path: string;
      content: string;
      expectedLocalVersion: number;
      origin: string;
      deleted?: boolean;
    }> };
    const docs = ctx.documents(tenant);
    const results = [];
    for (const entry of body.batch ?? []) {
      // applyFromPeer writes incomingVersion as-is; on primary we bump.
      const incomingVersion = entry.expectedLocalVersion + 1;
      const res = await docs.applyFromPeer({
        shardId: entry.shardId,
        path: entry.path,
        content: entry.content,
        incomingVersion,
        expectedLocalVersion: entry.expectedLocalVersion,
        origin: entry.origin,
        deleted: entry.deleted,
      });
      results.push(res);
    }
    return c.json({ results });
  });

  router.get('/pull/:tenant', gate, async (c: any) => {
    const caller = c.get('caller');
    if (caller?.peerRole !== 'replica') {
      return c.json({ error: 'Only replicas may pull' }, 403);
    }
    const tenant = c.req.param('tenant');
    const sinceTick = Number(c.req.query('sinceTick') ?? '0');
    const docs = ctx.documents(tenant);
    const all = await docs.listAll();
    const changes = [];
    for (const entry of all as Array<Record<string, any>>) {
      const v = entry.version;
      if (typeof v === 'number' && v > sinceTick) {
        const content = (await (docs as any).read(entry.shardId, entry.path)) ?? '';
        changes.push({
          shardId: entry.shardId,
          path: entry.path,
          content,
          version: v,
          metadata: {
            syncMode: entry.syncMode,
            deleted: entry.deleted,
            origin: entry.origin,
          },
        });
      }
    }
    const tick = await docs.getTick();
    return c.json({ tick, changes });
  });
}
