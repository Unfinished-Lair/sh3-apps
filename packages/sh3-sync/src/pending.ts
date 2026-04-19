import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { PushEntry } from './types.js';

function filePath(dataDir: string, tenant: string, shardId: string, path: string): string {
  return join(dataDir, tenant, 'pending', shardId, `${path}.pending.json`);
}

export async function appendPending(
  dataDir: string, tenant: string, entry: PushEntry,
): Promise<void> {
  const p = filePath(dataDir, tenant, entry.shardId, entry.path);
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, JSON.stringify(entry));
}

export async function listPending(dataDir: string, tenant: string): Promise<PushEntry[]> {
  const base = join(dataDir, tenant, 'pending');
  const out: PushEntry[] = [];
  await walk(base, '', async (rel) => {
    if (!rel.endsWith('.pending.json')) return;
    const raw = await readFile(join(base, rel), 'utf-8');
    out.push(JSON.parse(raw) as PushEntry);
  });
  return out;
}

export async function removePending(
  dataDir: string, tenant: string, shardId: string, path: string,
): Promise<void> {
  try {
    await rm(filePath(dataDir, tenant, shardId, path));
  } catch (err: any) {
    if (err?.code !== 'ENOENT') throw err;
  }
}

async function walk(
  base: string, cur: string, visit: (rel: string) => Promise<void>,
): Promise<void> {
  let entries;
  try {
    entries = await readdir(join(base, cur), { withFileTypes: true });
  } catch (err: any) {
    if (err?.code === 'ENOENT') return;
    throw err;
  }
  for (const e of entries) {
    const sub = cur ? join(cur, e.name) : e.name;
    if (e.isDirectory()) await walk(base, sub, visit);
    else await visit(sub);
  }
}
