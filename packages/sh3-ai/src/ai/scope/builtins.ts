import type { Scope } from './types';

/** Default scope: empty. Behaviorally identical to today's chat-only mode. */
export const SCOPE_NONE: Scope = {
  id: 'sh3-ai:none',
  label: 'No tools (chat only)',
  whitelist: [],
  blacklist: [],
};

/** Convention-based read-only scope. Matches verbs whose name suggests a
 *  read operation. Verbs using non-conventional names won't be reachable
 *  under this scope; users can author a custom one with `ai:scope save`. */
export const SCOPE_READ_ONLY: Scope = {
  id: 'sh3-ai:read-only',
  label: 'Read-only (convention-matched)',
  whitelist: ['*.read', '*.list', '*.get', '*.find', '*.show', '*.describe'],
  blacklist: [],
};

/** Yolo. Whitelists everything; nothing blacklisted. Power-user opt-in. */
export const SCOPE_EVERYTHING: Scope = {
  id: 'sh3-ai:everything',
  label: 'Everything (no restrictions)',
  whitelist: ['*', '*.*'],
  blacklist: [],
};

export const BUILTIN_SCOPES: ReadonlyArray<Scope> = [
  SCOPE_NONE,
  SCOPE_READ_ONLY,
  SCOPE_EVERYTHING,
];

/** Scope ids that cannot be overridden or deleted by users. */
export const BUILTIN_SCOPE_IDS: ReadonlySet<string> = new Set(
  BUILTIN_SCOPES.map((s) => s.id),
);
