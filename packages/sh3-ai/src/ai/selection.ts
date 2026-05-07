import type { AiProvider } from './provider';

/**
 * Pick the active provider from a contributions list, honoring a (possibly
 * stale) user preference. Returns undefined when no providers are registered.
 *
 * Resolution order:
 *   1. If `preferredId` is set AND a provider with that id is in `list`, return it.
 *   2. Otherwise, return `list[0]` (first registered).
 *
 * The fallback handles two cases without ceremony:
 *   - The user has not yet picked a provider (preferredId is null).
 *   - The user picked a provider that has since been uninstalled.
 */
export function resolveActiveProvider(
  list: AiProvider[],
  preferredId: string | null,
): AiProvider | undefined {
  if (preferredId) {
    const match = list.find((p) => p.id === preferredId);
    if (match) return match;
  }
  return list.length > 0 ? list[0] : undefined;
}

export function formatProviderList(
  list: AiProvider[],
  preferredId: string | null,
): string {
  if (list.length === 0) return 'ai: no providers registered';
  const active = resolveActiveProvider(list, preferredId);
  return list
    .map((p) => (p === active ? `* ${p.id}  (active)` : `  ${p.id}`))
    .join('\n');
}

export type SwitchAction =
  | { kind: 'no-providers'; message: string }
  | { kind: 'unknown'; message: string }
  | { kind: 'already-active'; message: string }
  | { kind: 'switched'; newActiveId: string; message: string };

export function decideSwitchAction(
  list: AiProvider[],
  preferredId: string | null,
  requestedId: string,
): SwitchAction {
  if (list.length === 0) {
    return { kind: 'no-providers', message: 'ai: no providers registered' };
  }
  if (!list.some((p) => p.id === requestedId)) {
    const available = list.map((p) => p.id).join(', ');
    return {
      kind: 'unknown',
      message: `ai: '${requestedId}' is not a registered provider; available: ${available}`,
    };
  }
  const currentActive = resolveActiveProvider(list, preferredId);
  if (currentActive && currentActive.id === requestedId) {
    return { kind: 'already-active', message: `ai: already on ${requestedId}` };
  }
  return {
    kind: 'switched',
    newActiveId: requestedId,
    message: `ai: switched to ${requestedId} (conversation reset)`,
  };
}
