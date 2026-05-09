import type { Tool } from './types';
import type { ResolvedScope } from '../scope/types';
import { evaluate } from '../scope/evaluate';

export interface CatalogSources {
  verbTools: Tool[];
  contributionTools: Tool[];
  actionTools?: Tool[];
}

/** Merge sources with verb-wins-on-collision dedup. Precedence:
 *  verb > contribution > action — action tools come from the live palette
 *  and are the most volatile of the three sources, so they lose any
 *  name-collision tie. */
export function assembleCatalog(sources: CatalogSources): Tool[] {
  const seen = new Map<string, Tool>();
  for (const t of sources.verbTools) {
    if (!seen.has(t.name)) seen.set(t.name, t);
  }
  for (const t of sources.contributionTools) {
    if (!seen.has(t.name)) seen.set(t.name, t);
  }
  for (const t of sources.actionTools ?? []) {
    if (!seen.has(t.name)) seen.set(t.name, t);
  }
  return [...seen.values()];
}

/** Drop every tool whose name the scope evaluator denies. */
export function filterByScope(catalog: Tool[], scope: ResolvedScope): Tool[] {
  return catalog.filter((t) => evaluate(scope, t.name).allowed);
}
