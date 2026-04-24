<script lang="ts">
  import type { ActiveActionDescriptor } from 'sh3-core';
  import type { HelpTabContext } from '../../help/contributions';
  import { prettifyShortcut, detectPlatform } from './prettifyShortcut';

  let { tabCtx, actions }: { tabCtx: HelpTabContext; actions: ActiveActionDescriptor[] } = $props();

  const platform = detectPlatform();

  type Tier = 'home' | 'app' | 'view' | 'focus' | 'element';
  const TIER_LABEL: Record<Tier, string> = {
    home:    'Global',
    app:     'App',
    view:    'View',
    focus:   'Focus',
    element: 'Selection',
  };

  function tierOf(d: ActiveActionDescriptor): Tier {
    if (d.scope === 'home') return 'home';
    if (d.scope === 'app') return 'app';
    if (typeof d.scope === 'string') {
      if (d.scope.startsWith('view:')) return 'view';
      if (d.scope.startsWith('focus:')) return 'focus';
    }
    return 'element';
  }

  const TIER_ORDER: readonly Tier[] = ['home', 'app', 'view', 'focus', 'element'];

  const grouped = $derived.by(() => {
    const byTier = new Map<Tier, ActiveActionDescriptor[]>();
    for (const d of actions) {
      const t = tierOf(d);
      const arr = byTier.get(t) ?? [];
      arr.push(d);
      byTier.set(t, arr);
    }
    for (const arr of byTier.values()) {
      arr.sort((a, b) => {
        const ga = a.group ?? '';
        const gb = b.group ?? '';
        if (ga !== gb) return ga.localeCompare(gb);
        return a.label.localeCompare(b.label);
      });
    }
    return TIER_ORDER
      .map((t) => ({ tier: t, label: TIER_LABEL[t], items: byTier.get(t) ?? [] }))
      .filter((g) => g.items.length > 0);
  });

  const { snapshot } = tabCtx;
  const showContextHeader = snapshot.activeAppId !== null || snapshot.focusedViewId !== null;
</script>

<div class="hotkeys-tab">
  {#if showContextHeader}
    <header class="ctx">
      {#if snapshot.activeAppId}<span>App: <code>{snapshot.activeAppId}</code></span>{/if}
      {#if snapshot.activeAppId && snapshot.focusedViewId} · {/if}
      {#if snapshot.focusedViewId}<span>Focused view: <code>{snapshot.focusedViewId}</code></span>{/if}
    </header>
  {/if}

  {#if grouped.length === 0}
    <p class="empty">No hotkeys active in this context.</p>
  {:else}
    {#each grouped as group (group.tier)}
      <section class="group">
        <h3 class="group-title">{group.label}</h3>
        <ul class="list">
          {#each group.items as item (item.id)}
            <li class="row" class:disabled={item.effectiveShortcut === null}>
              <span class="label">{item.label}</span>
              <kbd class="kbd">{prettifyShortcut(item.effectiveShortcut, platform)}</kbd>
              {#if item.scopeBadge}<span class="badge">{item.scopeBadge}</span>{/if}
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  {/if}
</div>

<style>
  .hotkeys-tab { padding: 12px 16px; color: var(--shell-fg); }
  .ctx { font-size: 12px; opacity: 0.8; margin-bottom: 12px; }
  .ctx code { font-family: var(--shell-mono, monospace); }
  .group { margin-bottom: 16px; }
  .group-title { font-size: 13px; font-weight: 600; margin: 0 0 6px; opacity: 0.9; }
  .list { list-style: none; margin: 0; padding: 0; }
  .row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    gap: 8px;
    align-items: center;
    padding: 4px 0;
    border-bottom: 1px solid var(--shell-border, #2a2a2a);
  }
  .row.disabled { opacity: 0.5; }
  .label {
    font-size: 13px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .kbd {
    font-family: var(--shell-mono, monospace);
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 3px;
    background: var(--shell-surface-2, #2a2a2a);
  }
  .badge {
    font-size: 11px;
    opacity: 0.6;
    font-family: var(--shell-mono, monospace);
  }
  .empty { opacity: 0.6; padding: 16px 0; }
</style>
