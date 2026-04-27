const PREVIEW_LIMIT = 4096;

export type PreviewState = 'text' | 'binary' | 'missing' | 'error' | 'empty';

export interface PreviewResult {
  state: PreviewState;
  text: string | null;
}

interface ReadFromBrowse {
  readFrom?: (shardId: string, path: string) => Promise<string | ArrayBuffer | null>;
}

export async function readPreview(
  browse: ReadFromBrowse,
  shardId: string,
  path: string,
): Promise<PreviewResult> {
  if (!browse.readFrom) return { state: 'error', text: null };
  try {
    const content = await browse.readFrom(shardId, path);
    if (content === null) return { state: 'missing', text: null };
    if (typeof content === 'string') {
      if (content.length === 0) return { state: 'empty', text: null };
      const truncated = content.length > PREVIEW_LIMIT;
      const text = truncated ? content.slice(0, PREVIEW_LIMIT) + '\n… (truncated)' : content;
      return { state: 'text', text };
    }
    return { state: 'binary', text: `(binary content, ${content.byteLength} bytes)` };
  } catch {
    return { state: 'error', text: null };
  }
}
