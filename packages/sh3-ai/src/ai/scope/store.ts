import type { Scope } from './types';
import { BUILTIN_SCOPES, BUILTIN_SCOPE_IDS } from './builtins';
import type { ScopeLookup } from './resolve';

/** Map of user-saved scope id → Scope. Persisted in shard state. */
export type UserScopes = Readonly<Record<string, Scope>>;

const BUILTIN_BY_ID: ReadonlyMap<string, Scope> = new Map(
  BUILTIN_SCOPES.map((s) => [s.id, s]),
);

/** Build a ScopeLookup that consults built-ins first, then user-saved scopes.
 *  Built-ins always win — users cannot shadow a built-in id. */
export function makeScopeLookup(userScopes: UserScopes): ScopeLookup {
  return (id: string) => BUILTIN_BY_ID.get(id) ?? userScopes[id];
}

export function addUserScope(prev: UserScopes, scope: Scope): UserScopes {
  if (BUILTIN_SCOPE_IDS.has(scope.id)) {
    throw new Error(`cannot override built-in scope '${scope.id}'`);
  }
  return { ...prev, [scope.id]: scope };
}

export function removeUserScope(prev: UserScopes, id: string): UserScopes {
  if (BUILTIN_SCOPE_IDS.has(id)) {
    throw new Error(`cannot delete built-in scope '${id}'`);
  }
  if (!(id in prev)) return prev;
  const next = { ...prev };
  delete next[id];
  return next;
}
