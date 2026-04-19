import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readPeerConfig, writePeerConfig } from './peer-config.js';

describe('peer-config', () => {
  let dir: string;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'sh3-sync-pc-')); });

  it('returns null when file missing', async () => {
    expect(await readPeerConfig(dir, 'alice')).toBeNull();
  });

  it('round-trips config', async () => {
    await writePeerConfig(dir, 'alice', {
      role: 'replica', primaryUrl: 'https://x', apiKey: 'sh3_k', peerId: 'vps',
    });
    expect(await readPeerConfig(dir, 'alice')).toEqual({
      role: 'replica', primaryUrl: 'https://x', apiKey: 'sh3_k', peerId: 'vps',
    });
  });

  it('round-trips primary role', async () => {
    await writePeerConfig(dir, 'alice', { role: 'primary' });
    expect(await readPeerConfig(dir, 'alice')).toEqual({ role: 'primary' });
  });
});
