import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { bootTenants } from './boot.js';

describe('bootTenants', () => {
  let dir: string;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'sh3-sync-b-')); });

  it('sets replica role for tenants with replica peer.json, primary otherwise', async () => {
    mkdirSync(join(dir, 'alice'), { recursive: true });
    writeFileSync(join(dir, 'alice', 'peer.json'), JSON.stringify({
      role: 'replica', primaryUrl: 'u', apiKey: 'k', peerId: 'vps',
    }));
    mkdirSync(join(dir, 'bob'), { recursive: true });

    const calls: Array<[string, string]> = [];
    const replicas = await bootTenants({
      dataDir: dir,
      tenants: ['alice', 'bob'],
      setPeerRole: (t, r) => calls.push([t, r]),
    });
    expect(calls.sort()).toEqual([['alice', 'replica'], ['bob', 'primary']]);
    expect(replicas).toEqual([
      { tenant: 'alice', primaryUrl: 'u', apiKey: 'k', peerId: 'vps', tickIntervalMs: undefined },
    ]);
  });

  it('forwards custom tickIntervalMs from peer config', async () => {
    mkdirSync(join(dir, 'alice'), { recursive: true });
    writeFileSync(join(dir, 'alice', 'peer.json'), JSON.stringify({
      role: 'replica', primaryUrl: 'u', apiKey: 'k', peerId: 'vps', tickIntervalMs: 2500,
    }));
    const replicas = await bootTenants({
      dataDir: dir,
      tenants: ['alice'],
      setPeerRole: () => {},
    });
    expect(replicas[0].tickIntervalMs).toBe(2500);
  });

  it('treats incomplete replica config as primary', async () => {
    mkdirSync(join(dir, 'alice'), { recursive: true });
    writeFileSync(join(dir, 'alice', 'peer.json'), JSON.stringify({
      role: 'replica', primaryUrl: 'u',
      // missing apiKey, peerId
    }));
    const calls: Array<[string, string]> = [];
    const replicas = await bootTenants({
      dataDir: dir,
      tenants: ['alice'],
      setPeerRole: (t, r) => calls.push([t, r]),
    });
    expect(calls).toEqual([['alice', 'primary']]);
    expect(replicas).toEqual([]);
  });
});
