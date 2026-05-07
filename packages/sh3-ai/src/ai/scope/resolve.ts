import type { Scope, ResolvedScope } from './types';

export type ScopeLookup = (id: string) => Scope | undefined;

/**
 * Walk a Scope's `extends` chain, merging whitelists and blacklists.
 * Detects cycles. Skips unknown ids silently.
 *
 * @throws Error when a cycle is detected.
 */
export function resolveScope(root: Scope, lookup: ScopeLookup): ResolvedScope {
  const whitelist = new Set<string>();
  const blacklist = new Set<string>();
  const visited = new Set<string>();

  function walk(scope: Scope): void {
    if (visited.has(scope.id)) {
      throw new Error(`scope cycle detected at '${scope.id}'`);
    }
    visited.add(scope.id);
    for (const pattern of scope.whitelist) whitelist.add(pattern);
    for (const pattern of scope.blacklist) blacklist.add(pattern);
    for (const id of scope.extends ?? []) {
      const next = lookup(id);
      if (next) walk(next);
    }
  }

  walk(root);
  return {
    id: root.id,
    whitelist: [...whitelist],
    blacklist: [...blacklist],
  };
}
