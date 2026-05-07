import type { Tool } from './types';
import type { ResolvedScope } from '../scope/types';
import { evaluate } from '../scope/evaluate';

export interface CatalogSources {
  verbTools: Tool[];
  contributionTools: Tool[];
}

/** Merge sources with verb-wins-on-collision dedup. */
export function assembleCatalog(sources: CatalogSources): Tool[] {
  const seen = new Map<string, Tool>();
  // Verbs first → they win on collision.
  for (const t of sources.verbTools) {
    if (!seen.has(t.name)) seen.set(t.name, t);
  }
  for (const t of sources.contributionTools) {
    if (!seen.has(t.name)) seen.set(t.name, t);
  }
  return [...seen.values()];
}

/** Drop every tool whose name the scope evaluator denies. */
export function filterByScope(catalog: Tool[], scope: ResolvedScope): Tool[] {
  return catalog.filter((t) => evaluate(scope, t.name).allowed);
}
