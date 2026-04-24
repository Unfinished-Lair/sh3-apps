import type { Platform } from './prettifyShortcut';

/**
 * Best-effort local reimplementation of `shell.actions.listActive()` for use
 * until the upstream API lands (sh3-core RFC: listActive). Swap with the real
 * call by changing the import in Help.svelte/HotkeysTab.svelte once shipped.
 *
 * Caveats vs the upstream version:
 * - `scope: 'app'` semantics approximate as "active iff an app is active" because
 *   we cannot read the app's required-shards set from public API. Upstream filters
 *   by ownerShardId; this shim does not.
 * - Registration order within a tier is caller-provided (matches what
 *   `ctx.contributions.list` returns).
 */

type AtomicScope =
  | 'home'
  | 'app'
  | `view:${string}`
  | `focus:${string}`
  | { element: string };

interface ShimAction {
  id: string;
  label: string;
  scope: AtomicScope | AtomicScope[];
  defaultShortcut?: string;
  group?: string;
  icon?: string;
  paletteItem?: boolean;
  contextItem?: boolean;
}
export interface ShimActionEntry {
  action: ShimAction;
  ownerShardId: string;
}

export interface ActiveActionDescriptor {
  id: string;
  label: string;
  effectiveShortcut: string | null;
  scope: AtomicScope;
  scopeBadge: string | null;
  group?: string;
  icon?: string;
  ownerShardId: string;
  paletteItem: boolean;
  contextItem: boolean;
}

export interface ShimInputs {
  listActionEntries(): ShimActionEntry[];
  getActiveAppId(): string | null;
  getMountedViewIds(): ReadonlySet<string>;
  getFocusedViewId(): string | null;
  getSelection(): { type: string; ref: unknown } | null;
  /** Map of actionId → user-bound shortcut string (or null to disable). */
  getBindings(): Record<string, string | null | undefined>;
  platform: Platform;
}

type TierName = 'element' | 'focus' | 'view' | 'app' | 'home';
const TIER_ORDER: readonly TierName[] = ['element', 'focus', 'view', 'app', 'home'];

function tierOf(scope: AtomicScope): TierName {
  if (scope === 'home') return 'home';
  if (scope === 'app') return 'app';
  if (typeof scope === 'string') {
    if (scope.startsWith('view:')) return 'view';
    if (scope.startsWith('focus:')) return 'focus';
  }
  return 'element';
}

function scopeBadgeOf(scope: AtomicScope): string | null {
  if (scope === 'home' || scope === 'app') return null;
  if (typeof scope === 'string') return scope;
  return scope.element;
}

function isScopeActive(scope: AtomicScope, inputs: ShimInputs): boolean {
  if (scope === 'home') return inputs.getActiveAppId() === null;
  if (scope === 'app') return inputs.getActiveAppId() !== null;
  if (typeof scope === 'string') {
    if (scope.startsWith('view:')) {
      return inputs.getMountedViewIds().has(scope.slice(5));
    }
    if (scope.startsWith('focus:')) {
      return inputs.getFocusedViewId() === scope.slice(6);
    }
  }
  if (typeof scope === 'object' && 'element' in scope) {
    const sel = inputs.getSelection();
    return sel !== null && sel.type === scope.element;
  }
  return false;
}

function resolveMod(shortcut: string | undefined, platform: Platform): string | null {
  if (!shortcut) return null;
  const modReplace = platform === 'mac' ? 'Meta' : 'Ctrl';
  return shortcut
    .split('+')
    .map((p) => (p === 'Mod' ? modReplace : p))
    .join('+');
}

function resolveEffectiveShortcut(
  action: ShimAction,
  bindings: Record<string, string | null | undefined>,
  platform: Platform,
): string | null {
  if (action.id in bindings) {
    const bound = bindings[action.id];
    if (bound === null) return null;
    if (typeof bound === 'string') return resolveMod(bound, platform);
  }
  return resolveMod(action.defaultShortcut, platform);
}

export function listActiveShim(inputs: ShimInputs): ActiveActionDescriptor[] {
  const out: ActiveActionDescriptor[] = [];

  for (const entry of inputs.listActionEntries()) {
    const scopes: AtomicScope[] = Array.isArray(entry.action.scope)
      ? entry.action.scope
      : [entry.action.scope];

    let activeScope: AtomicScope | null = null;
    for (const tier of TIER_ORDER) {
      const match = scopes.find((s) => tierOf(s) === tier && isScopeActive(s, inputs));
      if (match) { activeScope = match; break; }
    }
    if (!activeScope) continue;

    out.push({
      id: entry.action.id,
      label: entry.action.label,
      effectiveShortcut: resolveEffectiveShortcut(
        entry.action,
        inputs.getBindings(),
        inputs.platform,
      ),
      scope: activeScope,
      scopeBadge: scopeBadgeOf(activeScope),
      group: entry.action.group,
      icon: entry.action.icon,
      ownerShardId: entry.ownerShardId,
      paletteItem: entry.action.paletteItem !== false,
      contextItem: entry.action.contextItem !== false,
    });
  }

  return out;
}
