export type GridStyle = 'cells' | 'dots' | 'none';

export interface QuickAccessPrefs {
  /** Missing key => domain uncustomized; fall back to domain.getDefaultQuickAccess(). */
  domains: Record<string, DomainQuickAccess>;
}

export interface DomainQuickAccess {
  /** Variant name → ordered list of template types. */
  variants: Record<string, string[]>;
  /** Name of the variant the toolbar currently shows. */
  active: string;
}

export interface EditorPrefs {
  gridStyle: GridStyle;
  quickAccess: QuickAccessPrefs;
}

export const DEFAULT_EDITOR_PREFS: EditorPrefs = {
  gridStyle: 'cells',
  quickAccess: { domains: {} },
};

const VALID_GRID_STYLES: ReadonlySet<GridStyle> = new Set(['cells', 'dots', 'none']);

let current: EditorPrefs = clone(DEFAULT_EDITOR_PREFS);
const subscribers = new Set<(p: EditorPrefs) => void>();

function clone(p: EditorPrefs): EditorPrefs {
  return {
    gridStyle: p.gridStyle,
    quickAccess: {
      domains: Object.fromEntries(
        Object.entries(p.quickAccess.domains).map(([id, dom]) => [
          id,
          { active: dom.active, variants: { ...dom.variants } },
        ]),
      ),
    },
  };
}

export function getEditorPrefs(): EditorPrefs {
  return current;
}

export function setGridStyle(style: GridStyle): void {
  if (current.gridStyle === style) return;
  current = { ...clone(current), gridStyle: style };
  for (const cb of subscribers) cb(current);
}

export function setDomainQuickAccess(domainId: string, dqa: DomainQuickAccess | null): void {
  const next = clone(current);
  if (dqa === null) delete next.quickAccess.domains[domainId];
  else next.quickAccess.domains[domainId] = { active: dqa.active, variants: { ...dqa.variants } };
  current = next;
  for (const cb of subscribers) cb(current);
}

export function subscribeEditorPrefs(cb: (p: EditorPrefs) => void): () => void {
  subscribers.add(cb);
  return () => { subscribers.delete(cb); };
}

function sanitizeQuickAccess(blob: unknown): QuickAccessPrefs {
  const out: QuickAccessPrefs = { domains: {} };
  if (!blob || typeof blob !== 'object') return out;
  const domains = (blob as Record<string, unknown>).domains;
  if (!domains || typeof domains !== 'object') return out;
  for (const [id, raw] of Object.entries(domains)) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as Record<string, unknown>;
    if (typeof r.active !== 'string') continue;
    if (!r.variants || typeof r.variants !== 'object') continue;
    const variants: Record<string, string[]> = {};
    for (const [name, list] of Object.entries(r.variants as Record<string, unknown>)) {
      if (!Array.isArray(list)) continue;
      variants[name] = list.filter((x): x is string => typeof x === 'string');
    }
    if (!variants[r.active]) continue;
    out.domains[id] = { active: r.active, variants };
  }
  return out;
}

/** Apply a persisted blob WITHOUT notifying subscribers — used at boot
 *  so the shard's save-on-change subscriber does not echo back the
 *  just-loaded value. Silently coerces invalid input to defaults. */
export function hydrateEditorPrefs(blob: unknown): void {
  const safe = clone(DEFAULT_EDITOR_PREFS);
  if (blob && typeof blob === 'object') {
    const o = blob as Record<string, unknown>;
    if (typeof o.gridStyle === 'string' && VALID_GRID_STYLES.has(o.gridStyle as GridStyle)) {
      safe.gridStyle = o.gridStyle as GridStyle;
    }
    safe.quickAccess = sanitizeQuickAccess(o.quickAccess);
  }
  current = safe;
}

export function _resetForTests(): void {
  current = clone(DEFAULT_EDITOR_PREFS);
  subscribers.clear();
}
