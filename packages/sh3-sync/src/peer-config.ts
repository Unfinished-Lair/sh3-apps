import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { PeerConfig } from './types.js';

function path(dataDir: string, tenant: string): string {
  return join(dataDir, tenant, 'peer.json');
}

export async function readPeerConfig(dataDir: string, tenant: string): Promise<PeerConfig | null> {
  try {
    return JSON.parse(await readFile(path(dataDir, tenant), 'utf-8')) as PeerConfig;
  } catch (err: any) {
    if (err?.code === 'ENOENT') return null;
    throw err;
  }
}

export async function writePeerConfig(
  dataDir: string, tenant: string, config: PeerConfig,
): Promise<void> {
  const p = path(dataDir, tenant);
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, JSON.stringify(config, null, 2));
}
