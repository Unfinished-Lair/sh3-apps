import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { registerRoutes } from './routes.js';

function stubCtx(overrides: Record<string, any> = {}): any {
  const docsByTenant = new Map<string, any>();
  const defaultDocs = {
    // Primary accepts any expectedLocalVersion → version = expectedLocalVersion + 1
    applyFromPeer: async (input: any) => ({ applied: true, version: input.incomingVersion }),
    listAll: async () => [],
    read: async () => '',
    getTick: async () => 42,
  };
  return {
    scopeRequired: () => async (_c: any, next: any) => next(),
    documents: (tenant: string) => docsByTenant.get(tenant) ?? defaultDocs,
    _setDocs: (tenant: string, docs: any) => docsByTenant.set(tenant, docs),
    ...overrides,
  };
}

function asReplicaCaller(router: Hono, tenant: string): void {
  router.use('*', async (c, next) => {
    (c as any).set('caller', { peerRole: 'replica', tenantId: tenant, scopes: ['sync:peer'] });
    await next();
  });
}

describe('registerRoutes POST /push/:tenant', () => {
  it('applies each entry via ctx.documents(tenant).applyFromPeer', async () => {
    const router = new Hono();
    asReplicaCaller(router, 'alice');
    const ctx = stubCtx();
    registerRoutes(router, ctx);
    const res = await router.request('/push/alice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch: [
          { shardId: 'notes', path: 'a.txt', content: 'x', expectedLocalVersion: 0, origin: 'peer' },
          { shardId: 'notes', path: 'b.txt', content: 'y', expectedLocalVersion: 2, origin: 'peer' },
        ],
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as { results: Array<{ applied: boolean; version: number }> };
    expect(body.results).toEqual([
      { applied: true, version: 1 },
      { applied: true, version: 3 },
    ]);
  });

  it('rejects non-replica callers with 403', async () => {
    const router = new Hono();
    router.use('*', async (c, next) => {
      (c as any).set('caller', { tenantId: 'alice', scopes: ['sync:peer'] });
      await next();
    });
    registerRoutes(router, stubCtx());
    const res = await router.request('/push/alice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch: [] }),
    });
    expect(res.status).toBe(403);
  });
});

describe('registerRoutes GET /pull/:tenant', () => {
  it('returns tick and empty changes for empty tenant', async () => {
    const router = new Hono();
    asReplicaCaller(router, 'alice');
    registerRoutes(router, stubCtx());
    const res = await router.request('/pull/alice?sinceTick=0');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ tick: 42, changes: [] });
  });

  it('returns docs with version > sinceTick', async () => {
    const router = new Hono();
    asReplicaCaller(router, 'alice');
    const ctx = stubCtx();
    ctx._setDocs('alice', {
      applyFromPeer: async () => ({ applied: true, version: 1 }),
      listAll: async () => [
        { shardId: 'notes', path: 'a.txt', version: 3, syncMode: 'sync', origin: 'primary' },
        { shardId: 'notes', path: 'b.txt', version: 1, syncMode: 'sync' },
      ],
      read: async (_s: string, p: string) => (p === 'a.txt' ? 'A' : 'B'),
      getTick: async () => 3,
    });
    registerRoutes(router, ctx);
    const res = await router.request('/pull/alice?sinceTick=2');
    const body = await res.json() as any;
    expect(body.tick).toBe(3);
    expect(body.changes).toHaveLength(1);
    expect(body.changes[0]).toMatchObject({
      shardId: 'notes',
      path: 'a.txt',
      content: 'A',
      version: 3,
    });
  });

  it('rejects non-replica callers with 403', async () => {
    const router = new Hono();
    router.use('*', async (c, next) => {
      (c as any).set('caller', { tenantId: 'alice', scopes: ['sync:peer'] });
      await next();
    });
    registerRoutes(router, stubCtx());
    const res = await router.request('/pull/alice?sinceTick=0');
    expect(res.status).toBe(403);
  });
});
