/*
 * Cross-shard document read/write capabilities. In 0.9.0 these are NOT
 * available through the public shard context API — ctx.browse is
 * read-only-enumerate and ctx.documents(...) is self-scoped. This module
 * is the one place that wraps the missing capability so the rest of the
 * connector can be built, tested, and partially operational today.
 *
 * Upstream: https://github.com/Unfinished-Lair/sh3/issues/21
 * Resolution plan: once documents:read + documents:write land on
 * BrowseCapability, update readForeign/writeForeign to call the real
 * primitives.
 */
import type { ShardContext } from 'sh3-core';

export class NotImplementedError extends Error {
  override name = 'NotImplementedError';
}

const MESSAGE =
  'Cross-shard document access is pending sh3-core issue #21. ' +
  'Upload and import cannot complete until documents:read/documents:write permissions land.';

export function readForeign(_ctx: ShardContext): (shardId: string, path: string) => Promise<string | null> {
  return async () => { throw new NotImplementedError(MESSAGE); };
}

export function writeForeign(_ctx: ShardContext): (shardId: string, path: string, content: string) => Promise<void> {
  return async () => { throw new NotImplementedError(MESSAGE); };
}
