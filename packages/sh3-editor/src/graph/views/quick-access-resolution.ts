import type { GraphDomain } from '../domain/types';
import type { EditorPrefs } from '../../settings/editor-prefs';

/**
 * Resolve the ordered list of template types the Quick-Access toolbar should
 * render for this domain. Falls back to `domain.getDefaultQuickAccess()` when
 * the user has no saved variant or the saved active variant is missing.
 * Unknown types are filtered out; a single console.warn is emitted per call
 * if any were dropped.
 */
export function resolveActiveEntries(domain: GraphDomain, prefs: EditorPrefs): string[] {
  const saved = prefs.quickAccess.domains[domain.id];
  // Backward-compat: domains built against sh3-editor < 0.19 (or hand-rolled
  // per the cross-shard rule) won't expose getDefaultQuickAccess. Treat as no
  // defaults — the toolbar simply stays empty until that domain ships an
  // upgrade.
  const defaultList = typeof domain.getDefaultQuickAccess === 'function'
    ? domain.getDefaultQuickAccess()
    : [];
  const list = saved?.variants[saved.active] ?? defaultList;
  const knownTypes = new Set(domain.getTemplates().map((t) => t.type));
  const out: string[] = [];
  let droppedAny = false;
  for (const t of list) {
    if (knownTypes.has(t)) out.push(t);
    else droppedAny = true;
  }
  if (droppedAny) {
    console.warn(
      `[sh3-editor] quick-access: dropped unknown template(s) for domain '${domain.id}'`,
    );
  }
  return out;
}
