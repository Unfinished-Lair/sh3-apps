import { PermissionError, type ShardContext } from 'sh3-core';

const PREVIEW_LIMIT = 4096;

export type PreviewState = 'text' | 'binary' | 'missing' | 'error' | 'empty';

export interface PreviewResult {
  state: PreviewState;
  text: string | null;
}

/**
 * Minimal slice of ShardContext that readPreview needs. Defined separately
 * so tests can pass a small stub without instantiating the whole context.
 */
export interface ReadPreviewCtx {
  documents: {
    readBinary(path: string): Promise<ArrayBuffer | null>;
  };
}

/**
 * Sniff a byte buffer to decide whether it looks like text. Heuristic:
 * any NUL byte in the inspected prefix → binary. Otherwise text.
 */
function looksBinary(bytes: Uint8Array, scan: number): boolean {
  const len = Math.min(bytes.length, scan);
  for (let i = 0; i < len; i++) {
    if (bytes[i] === 0) return true;
  }
  return false;
}

export async function readPreview(
  ctx: ReadPreviewCtx,
  shardId: string,
  path: string,
): Promise<PreviewResult> {
  try {
    const buf = await ctx.documents.readBinary(`${shardId}/${path}`);
    if (buf === null) return { state: 'missing', text: null };
    if (buf.byteLength === 0) return { state: 'empty', text: null };
    const bytes = new Uint8Array(buf);
    if (looksBinary(bytes, Math.min(bytes.length, 512))) {
      return { state: 'binary', text: `(binary content, ${buf.byteLength} bytes)` };
    }
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    const truncated = decoded.length > PREVIEW_LIMIT;
    const text = truncated ? decoded.slice(0, PREVIEW_LIMIT) + '\n… (truncated)' : decoded;
    return { state: 'text', text };
  } catch (err) {
    // Migration: previously ctx.browse?.readFrom could be undefined and that
    // path returned `error`. In 0.26 the handle methods always exist and
    // throw PermissionError on grant violations. Surface both as 'error'.
    void err; // not currently logged; structure mirrors prior behavior
    if (err instanceof PermissionError) return { state: 'error', text: null };
    return { state: 'error', text: null };
  }
}

// Allow callers (e.g. runDelete) to pass the full ShardContext.
export type _SatisfiesContext = ShardContext extends ReadPreviewCtx ? true : false;
