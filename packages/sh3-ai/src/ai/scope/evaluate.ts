import type { ResolvedScope, ScopeDecision } from './types';
import { matchesGlob } from './glob';

export function evaluate(scope: ResolvedScope, toolName: string): ScopeDecision {
  for (const pattern of scope.blacklist) {
    if (matchesGlob(toolName, pattern)) {
      return { allowed: false, reason: 'blacklisted', matchedPattern: pattern };
    }
  }
  for (const pattern of scope.whitelist) {
    if (matchesGlob(toolName, pattern)) {
      return { allowed: true };
    }
  }
  return { allowed: false, reason: 'not-whitelisted' };
}
