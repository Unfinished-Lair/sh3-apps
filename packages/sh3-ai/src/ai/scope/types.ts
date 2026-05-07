/** A composable, named permission scope. */
export interface Scope {
  /** Stable id, e.g. 'sh3-ai:read-only', 'sh3-r2:backup'. Uses ':' as separator. */
  id: string;
  /** Display label for picker/banners. */
  label: string;
  /** Other scope ids whose whitelists/blacklists are merged in (cycle-detected). */
  extends?: string[];
  /** Glob patterns matched against Tool.name. Pattern syntax: '*' matches any
   *  single segment of [^.]*. No '**'. Tool names use '.' as separator. */
  whitelist: string[];
  /** Authoritative deny list. Same pattern syntax as whitelist. */
  blacklist: string[];
}

/** Result of walking a Scope's `extends` chain into a flat permission set. */
export interface ResolvedScope {
  id: string;
  whitelist: string[];
  blacklist: string[];
}

/** Result of evaluating a Tool name against a ResolvedScope. */
export type ScopeDecision =
  | { allowed: true }
  | {
      allowed: false;
      reason: 'blacklisted' | 'not-whitelisted';
      matchedPattern?: string;
    };
