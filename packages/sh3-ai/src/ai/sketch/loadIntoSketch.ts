import { sh3, PermissionError } from 'sh3-core';
import type { DocumentHandle } from 'sh3-core';
import { detectMode } from './marker';
import type { SketchState } from './state';

export interface LoadIntoSketchDeps {
  state: SketchState;
  /** sh3-core 0.26: read documents through the scope-rooted DocumentHandle.
   *  Cross-shard reads need `documents:browse` (granted via the manifest);
   *  the handle throws `PermissionError` on out-of-grant addresses. */
  documents: Pick<DocumentHandle, 'readText' | 'readBinary'>;
  focusOrOpenSketch: () => void;
}

/**
 * Load a sketch from a scope-rooted document path (e.g. `notes/sketches/a.html`).
 * The first segment of `rootedPath` is the bound id (shard or app); the rest is
 * shard-relative.
 */
export async function loadIntoSketch(
  rootedPath: string,
  deps: LoadIntoSketchDeps,
): Promise<void> {
  let content: string | ArrayBuffer | null;
  try {
    // Try text first; fall back to binary if a backend returned a buffer.
    content = await deps.documents.readText(rootedPath);
  } catch (err) {
    if (err instanceof PermissionError) {
      sh3.toast.notify(
        `AI Sketch: cannot read '${rootedPath}' — documents:browse not granted for this path.`,
        { level: 'warn' },
      );
      return;
    }
    sh3.toast.notify(
      `AI Sketch: load failed: ${err instanceof Error ? err.message : String(err)}`,
      { level: 'error' },
    );
    return;
  }
  if (content == null) {
    sh3.toast.notify(`AI Sketch: file not found: ${rootedPath}.`, { level: 'warn' });
    return;
  }
  const html = typeof content === 'string' ? content : new TextDecoder().decode(content);
  deps.state.set({ html, mode: detectMode(html) });
  deps.focusOrOpenSketch();
}
