import { describe, it, expect, afterAll } from 'vitest';
import { createServer } from 'sh3-server';
import { serve } from '@hono/node-server';
import {
  mkdtempSync, mkdirSync, writeFileSync, copyFileSync, existsSync,
  readdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AddressInfo } from 'node:net';
import { appendPending } from '../src/pending.js';

const here = dirname(fileURLToPath(import.meta.url));
const syncServerJs = resolve(here, '..', 'dist', 'server', 'index.js');

interface Spawn {
  dir: string;
  port: number;
  baseUrl: string;
  server: Awaited<ReturnType<typeof createServer>>;
  httpServer: ReturnType<typeof serve>;
}

const spawned: Spawn[] = [];

function installSh3Sync(dataDir: string): string {
  const pkgDir = join(dataDir, 'packages', 'sh3-sync');
  mkdirSync(pkgDir, { recursive: true });
  writeFileSync(join(pkgDir, 'manifest.json'), JSON.stringify({
    id: 'sh3-sync',
    label: 'Document sync',
    version: '0.1.0',
    type: 'shard',
    permissions: ['sync:peer'],
    contractVersion: 1,
  }, null, 2));
  copyFileSync(syncServerJs, join(pkgDir, 'server.js'));
  return pkgDir;
}

async function spinServer(label: string): Promise<Spawn> {
  const dir = mkdtempSync(join(tmpdir(), `sh3-sync-e2e-${label}-`));
  installSh3Sync(dir);
  const server = await createServer({ port: 0, dataDir: dir, noAuth: true });
  const httpServer = serve({ fetch: server.app.fetch, port: 0 });
  const port = (httpServer.address() as AddressInfo).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  // Mount sh3-sync via the package loader. The server's shardRouter is
  // internal, but loadPackages is what start() would call. We re-run a
  // minimal version here using the same import path.
  const pkgDir = join(dir, 'packages', 'sh3-sync');
  const serverJs = join(pkgDir, 'server.js');
  const modUrl = `file:///${serverJs.replace(/\\/g, '/')}?t=${Date.now()}`;
  const mod = await import(modUrl);
  const shard = mod.default;

  // Wire the shard directly into server.app. This mirrors what the
  // framework does for shell-shard — sh3-server's dynamic /api/:shardId/*
  // catch-all is not installed because start() was skipped, so we mount
  // explicitly at /api/sh3-sync.
  const { Hono } = await import('hono');
  const subApp = new Hono();
  const shardDataDir = join(pkgDir, 'data');
  mkdirSync(shardDataDir, { recursive: true });
  await shard.routes(subApp, {
    shardId: 'sh3-sync',
    dataDir: shardDataDir,
    permissions: ['sync:peer'],
    adminOnly: async (_c: any, next: any) => next(),
    scopeRequired: (scope: string) => async (c: any, next: any) => {
      const caller = c.get('caller');
      if (caller?.scopes?.includes('admin:*') || caller?.scopes?.includes(scope)) return next();
      return c.json({ error: `Missing required scope: ${scope}` }, 403);
    },
    tenantRequired: async (_c: any, next: any) => next(),
    wsRegister: () => {},
    tenants: () => {
      // Work around sh3-server 0.9.0 ESM/require bug in listTenantsSync.
      const root = join(dir, 'docs');
      if (!existsSync(root)) return [];
      return readdirSync(root, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);
    },
    documents: (tenant: string) => ({
      read: (shardId: string, path: string) => server.docStore.read(tenant, shardId, path),
      exists: (shardId: string, path: string) => server.docStore.exists(tenant, shardId, path),
      list: (shardId: string) => server.docStore.list(tenant, shardId),
      listAll: () => server.docStore.listAll(tenant),
      write: (shardId: string, path: string, content: any, metadata?: any) =>
        server.docStore.write(tenant, shardId, path, content, metadata),
      delete: (shardId: string, path: string) => server.docStore.delete(tenant, shardId, path),
      applyFromPeer: (input: any) => server.docStore.applyFromPeer(tenant, input),
      getTick: () => server.docStore.getTick(tenant),
      readPolicy: () => server.docStore.readPolicy(tenant),
      writePolicy: (policy: any) => server.docStore.writePolicy(tenant, policy),
      listConflicts: () => server.docStore.listConflicts(tenant),
      readConflict: (shardId: string, path: string) => server.docStore.readConflict(tenant, shardId, path),
      resolveConflict: (shardId: string, path: string, choice: any) =>
        server.docStore.resolveConflict(tenant, shardId, path, choice),
    }),
    setPeerRole: (tenant: string, role: 'primary' | 'replica') => {
      server.docStore.roles.set(tenant, role);
    },
  });
  server.app.route('/api/sh3-sync', subApp);

  const spawn: Spawn = { dir, port, baseUrl, server, httpServer };
  spawned.push(spawn);
  return spawn;
}

async function teardown(s: Spawn): Promise<void> {
  await new Promise<void>((r) => s.httpServer.close(() => r()));
}

afterAll(async () => {
  for (const s of spawned) await teardown(s);
});

async function poll<T>(
  fn: () => Promise<T | null>,
  predicate: (v: T | null) => boolean,
  timeoutMs: number,
  intervalMs = 100,
): Promise<T | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const v = await fn();
    if (predicate(v)) return v;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return fn();
}

describe('two-node convergence', () => {
  it('replica push reaches primary and increments version', async () => {
    // --- Primary A ---
    const A = await spinServer('A');
    // --- Replica B ---
    const B = await spinServer('B');

    // Mint a sync:peer key on A for tenant 'alice'.
    const key = A.server.keys.generate({
      label: 'B replica for alice',
      tenantId: 'alice',
      ownerUserId: null,
      mintedByShardId: null,
      scopes: ['sync:peer'],
      peerRole: 'replica',
      peerId: 'vps-b',
    });

    // Seed B: write alice tenant dir + peer.json pointing to A.
    mkdirSync(join(B.dir, 'docs', 'alice'), { recursive: true });
    const bSyncDataDir = join(B.dir, 'packages', 'sh3-sync', 'data');
    mkdirSync(join(bSyncDataDir, 'alice'), { recursive: true });
    writeFileSync(join(bSyncDataDir, 'alice', 'peer.json'), JSON.stringify({
      role: 'replica',
      primaryUrl: A.baseUrl,
      apiKey: key.key,
      peerId: 'vps-b',
      tickIntervalMs: 150,
    }, null, 2));

    // B's sh3-sync was mounted before peer.json — remount to pick it up.
    // Easiest: re-run the shard's routes on a fresh subApp. But since
    // bootTenants just needs to run again, and the shard holds loop state
    // at module scope, we instead shut B down and spawn a new B that
    // reads the now-present peer.json at mount time.
    await teardown(B);
    spawned.splice(spawned.indexOf(B), 1);
    const B2 = await spinServerWithExistingDir(B.dir, 'B2');

    // Write a doc on B2 (replica) via docStore directly — replica's
    // Mode A write marks it pending (version=0, syncState='pending').
    await B2.server.docStore.write('alice', 'notes', 'hello.txt', 'hello from B');

    // Enqueue in sh3-sync's pending queue so the loop picks it up.
    await appendPending(join(B2.dir, 'packages', 'sh3-sync', 'data'), 'alice', {
      shardId: 'notes',
      path: 'hello.txt',
      content: 'hello from B',
      expectedLocalVersion: 0,
      origin: 'vps-b',
    });

    // Wait for convergence on A (up to 5s — 150ms ticks, should take 1-2).
    const onA = await poll(
      () => A.server.docStore.read('alice', 'notes', 'hello.txt'),
      (v) => v === 'hello from B',
      5_000,
      100,
    );
    expect(onA).toBe('hello from B');

    // Version on A should be 1 (primary bumped from 0 → 1).
    const aliceDocs = await A.server.docStore.listAll('alice');
    const helloDoc = aliceDocs.find((d) => d.path === 'hello.txt');
    expect(helloDoc?.version).toBe(1);
  }, 30_000);
});

// Re-spawn helper: same as spinServer but with an existing dir.
async function spinServerWithExistingDir(dir: string, label: string): Promise<Spawn> {
  if (!existsSync(join(dir, 'packages', 'sh3-sync', 'server.js'))) {
    installSh3Sync(dir);
  }
  const server = await createServer({ port: 0, dataDir: dir, noAuth: true });
  const httpServer = serve({ fetch: server.app.fetch, port: 0 });
  const port = (httpServer.address() as AddressInfo).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const pkgDir = join(dir, 'packages', 'sh3-sync');
  const serverJs = join(pkgDir, 'server.js');
  const modUrl = `file:///${serverJs.replace(/\\/g, '/')}?t=${Date.now()}&r=${label}`;
  const mod = await import(modUrl);
  const shard = mod.default;

  const { Hono } = await import('hono');
  const subApp = new Hono();
  const shardDataDir = join(pkgDir, 'data');
  mkdirSync(shardDataDir, { recursive: true });
  await shard.routes(subApp, {
    shardId: 'sh3-sync',
    dataDir: shardDataDir,
    permissions: ['sync:peer'],
    adminOnly: async (_c: any, next: any) => next(),
    scopeRequired: (scope: string) => async (c: any, next: any) => {
      const caller = c.get('caller');
      if (caller?.scopes?.includes('admin:*') || caller?.scopes?.includes(scope)) return next();
      return c.json({ error: `Missing required scope: ${scope}` }, 403);
    },
    tenantRequired: async (_c: any, next: any) => next(),
    wsRegister: () => {},
    tenants: () => {
      // Work around sh3-server 0.9.0 ESM/require bug in listTenantsSync.
      const root = join(dir, 'docs');
      if (!existsSync(root)) return [];
      return readdirSync(root, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);
    },
    documents: (tenant: string) => ({
      read: (shardId: string, path: string) => server.docStore.read(tenant, shardId, path),
      exists: (shardId: string, path: string) => server.docStore.exists(tenant, shardId, path),
      list: (shardId: string) => server.docStore.list(tenant, shardId),
      listAll: () => server.docStore.listAll(tenant),
      write: (shardId: string, path: string, content: any, metadata?: any) =>
        server.docStore.write(tenant, shardId, path, content, metadata),
      delete: (shardId: string, path: string) => server.docStore.delete(tenant, shardId, path),
      applyFromPeer: (input: any) => server.docStore.applyFromPeer(tenant, input),
      getTick: () => server.docStore.getTick(tenant),
      readPolicy: () => server.docStore.readPolicy(tenant),
      writePolicy: (policy: any) => server.docStore.writePolicy(tenant, policy),
      listConflicts: () => server.docStore.listConflicts(tenant),
      readConflict: (shardId: string, path: string) => server.docStore.readConflict(tenant, shardId, path),
      resolveConflict: (shardId: string, path: string, choice: any) =>
        server.docStore.resolveConflict(tenant, shardId, path, choice),
    }),
    setPeerRole: (tenant: string, role: 'primary' | 'replica') => {
      server.docStore.roles.set(tenant, role);
    },
  });
  server.app.route('/api/sh3-sync', subApp);

  const spawn: Spawn = { dir, port, baseUrl, server, httpServer };
  spawned.push(spawn);
  return spawn;
}
