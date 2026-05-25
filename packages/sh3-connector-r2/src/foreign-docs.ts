/*
 * Cross-shard document read/write via the unified ctx.documents handle.
 *
 * Since sh3-core 0.26 the `ctx.documents` handle uses scope-rooted paths
 * (`<boundId>/<rest>`) and absorbs all the old `ctx.browse.*` verbs. Reading
 * or writing into another shard's namespace is just `ctx.documents.readText(
 * '<shardId>/<path>')` / `writeText(...)`, gated by `documents:browse`
 * (implicit when `documents:write` is declared). A `PermissionError` (from
 * sh3-core) is thrown when the active grant set does not cover the path.
 *
 * Binary documents are still deferred per v0.1.0 spec — readForeign throws
 * MissingCapabilityError if the handle returns an ArrayBuffer.
 */
import type { ShardContext } from 'sh3-core';

export class MissingCapabilityError extends Error {
  override name = 'MissingCapabilityError';
}

export function readForeign(
  ctx: ShardContext,
): (shardId: string, path: string) => Promise<string | null> {
  return async (shardId, path) => {
    const content = await ctx.documents.readText(`${shardId}/${path}`);
    if (content === null) return null;
    if (typeof content === 'string') return content;
    throw new MissingCapabilityError(
      `Binary document at ${shardId}/${path} is not supported in v0.1.0 (deferred).`,
    );
  };
}

export function writeForeign(
  ctx: ShardContext,
): (shardId: string, path: string, content: string) => Promise<void> {
  return async (shardId, path, content) => {
    await ctx.documents.writeText(`${shardId}/${path}`, content);
  };
}
