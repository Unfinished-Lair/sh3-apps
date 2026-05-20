export type GridStyle = 'cells' | 'dots' | 'none';

export interface EditorPrefs {
  gridStyle: GridStyle;
}

export const DEFAULT_EDITOR_PREFS: EditorPrefs = { gridStyle: 'cells' };

const VALID_GRID_STYLES: ReadonlySet<GridStyle> = new Set(['cells', 'dots', 'none']);

let current: EditorPrefs = { ...DEFAULT_EDITOR_PREFS };
const subscribers = new Set<(p: EditorPrefs) => void>();

export function getEditorPrefs(): EditorPrefs {
  return current;
}

export function setGridStyle(style: GridStyle): void {
  if (current.gridStyle === style) return;
  current = { ...current, gridStyle: style };
  for (const cb of subscribers) cb(current);
}

export function subscribeEditorPrefs(cb: (p: EditorPrefs) => void): () => void {
  subscribers.add(cb);
  return () => { subscribers.delete(cb); };
}

/** Apply a persisted blob WITHOUT notifying subscribers — used at boot
 *  so the shard's save-on-change subscriber does not echo back the
 *  just-loaded value. Silently coerces invalid input to defaults. */
export function hydrateEditorPrefs(blob: unknown): void {
  const safe = { ...DEFAULT_EDITOR_PREFS };
  if (blob && typeof blob === 'object') {
    const candidate = (blob as Record<string, unknown>).gridStyle;
    if (typeof candidate === 'string' && VALID_GRID_STYLES.has(candidate as GridStyle)) {
      safe.gridStyle = candidate as GridStyle;
    }
  }
  current = safe;
}

export function _resetForTests(): void {
  current = { ...DEFAULT_EDITOR_PREFS };
  subscribers.clear();
}
