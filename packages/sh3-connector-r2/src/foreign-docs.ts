/*
 * Cross-shard document read/write. Shipped in sh3-core 0.9.1 via
 * ctx.browse.readFrom and ctx.browse.writeTo, gated by the manifest
 * permissions documents:read and documents:write respectively
 * (in addition to documents:browse, which hosts the methods).
 *
 * Tracked at https://github.com/Unfinished-Lair/sh3/issues/21 (resolved).
 *
 * Binary documents are deferred per v0.1.0 spec — readForeign throws
 * MissingCapabilityError if the backend returns an ArrayBuffer. Upload
 * catches the throw and logs it as a failed entry.
 */
import type { ShardContext } from 'sh3-core';

export class MissingCapabilityError extends Error {
  override name = 'MissingCapabilityError';
}

const READ_MISSING =
  'documents:read not available. Reinstall the shard with the documents:read ' +
  'permission granted (sh3-core 0.9.1+).';
const WRITE_MISSING =
  'documents:write not available. Reinstall the shard with the documents:write ' +
  'permission granted (sh3-core 0.9.1+).';

export function readForeign(
  ctx: ShardContext,
): (shardId: string, path: string) => Promise<string | null> {
  return async (shardId, path) => {
    const readFrom = ctx.browse?.readFrom;
    if (!readFrom) throw new MissingCapabilityError(READ_MISSING);
    const content = await readFrom(shardId, path);
    if (content === null) return null;
    if (typeof content === 'string') return content;
    throw new Error(
      `Binary document at ${shardId}/${path} is not supported in v0.1.0 (deferred).`,
    );
  };
}

export function writeForeign(
  ctx: ShardContext,
): (shardId: string, path: string, content: string) => Promise<void> {
  return async (shardId, path, content) => {
    const writeTo = ctx.browse?.writeTo;
    if (!writeTo) throw new MissingCapabilityError(WRITE_MISSING);
    await writeTo(shardId, path, content);
  };
}
