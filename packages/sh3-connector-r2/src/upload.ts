import type { DocumentHandle } from 'sh3-core';
import type { R2Client } from './r2/client';
import type { BackupTarget } from './targets';
import { buildObjectKey, contentTypeFor } from './r2/keys';
import { sha256Hex } from './r2/hash';
import { appendLog, type UploadLogEntry } from './upload-log';

export interface UploadInput {
  target: BackupTarget;
  client: R2Client;
  logHandle: DocumentHandle;
  readForeign: (shardId: string, path: string) => Promise<string | null>;
  shardId: string;
  path: string;
  sourceTenant?: string;
}

export interface UploadResult {
  status: 'uploaded' | 'skipped-unchanged' | 'failed';
  reason?: string;
  sha256?: string;
  size?: number;
  entry?: UploadLogEntry;
}

function entryId(): string {
  const b = new Uint8Array(6);
  crypto.getRandomValues(b);
  let s = '';
  for (const x of b) s += x.toString(16).padStart(2, '0');
  return `${Date.now().toString(36)}-${s}`;
}

export async function upload(input: UploadInput): Promise<UploadResult> {
  const { target, client, logHandle, readForeign, shardId, path } = input;
  const key = buildObjectKey(target.keyPrefix, shardId, path);
  const at = new Date().toISOString();

  let content: string | null;
  try {
    content = await readForeign(shardId, path);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    await logOrIgnore(logHandle, { id: entryId(), targetId: target.id, shardId, path, sha256: '', size: 0, status: 'failed', reason, at });
    return { status: 'failed', reason };
  }

  if (content === null) {
    const reason = 'Document not found at source';
    await logOrIgnore(logHandle, { id: entryId(), targetId: target.id, shardId, path, sha256: '', size: 0, status: 'failed', reason, at });
    return { status: 'failed', reason };
  }

  const size = new TextEncoder().encode(content).length;
  const sha = await sha256Hex(content);

  try {
    const head = await client.headObject(key);
    if (head && head.sha256 === sha) {
      await logOrIgnore(logHandle, { id: entryId(), targetId: target.id, shardId, path, sha256: sha, size, status: 'skipped-unchanged', at });
      return { status: 'skipped-unchanged', sha256: sha, size };
    }
  } catch {
    // Non-fatal; proceed with PUT.
  }

  try {
    await client.putObject({
      key,
      body: content,
      contentType: contentTypeFor(path),
      sha256: sha,
      metadata: {
        'sh3-shard': shardId,
        'sh3-path': encodeURIComponent(path),
        'sh3-uploaded-at': at,
        'sh3-source-tenant': input.sourceTenant ?? '',
        'sh3-sha256': sha,
      },
    });
    const entry: UploadLogEntry = { id: entryId(), targetId: target.id, shardId, path, sha256: sha, size, status: 'uploaded', at };
    await logOrIgnore(logHandle, entry);
    return { status: 'uploaded', sha256: sha, size, entry };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    await logOrIgnore(logHandle, { id: entryId(), targetId: target.id, shardId, path, sha256: sha, size, status: 'failed', reason, at });
    return { status: 'failed', reason };
  }
}

async function logOrIgnore(handle: DocumentHandle, entry: UploadLogEntry): Promise<void> {
  try {
    await appendLog(handle, entry);
  } catch (err) {
    console.warn('[sh3-connector-r2] failed to append upload log:', err);
  }
}
