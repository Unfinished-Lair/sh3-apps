import { sh3 } from 'sh3-core';
import { detectMode } from './marker';
import type { SketchState } from './state';

export interface LoadIntoSketchDeps {
  state: SketchState;
  browse: { readFrom?: (shardId: string, path: string) => Promise<string | ArrayBuffer | null> };
  focusOrOpenSketch: () => void;
}

export async function loadIntoSketch(
  shardId: string,
  relPath: string,
  deps: LoadIntoSketchDeps,
): Promise<void> {
  if (typeof deps.browse.readFrom !== 'function') {
    sh3.toast.notify('AI Sketch: cannot read files from other shards (missing documents:read).', { level: 'warn' });
    return;
  }
  let content: string | ArrayBuffer | null;
  try {
    content = await deps.browse.readFrom(shardId, relPath);
  } catch (err) {
    sh3.toast.notify(
      `AI Sketch: load failed: ${err instanceof Error ? err.message : String(err)}`,
      { level: 'error' },
    );
    return;
  }
  if (content == null) {
    sh3.toast.notify(`AI Sketch: file not found: ${relPath}.`, { level: 'warn' });
    return;
  }
  const html = typeof content === 'string' ? content : new TextDecoder().decode(content);
  deps.state.set({ html, mode: detectMode(html) });
  deps.focusOrOpenSketch();
}
