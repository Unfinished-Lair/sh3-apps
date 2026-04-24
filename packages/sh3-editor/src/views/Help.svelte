<script lang="ts">
  import { onMount, onDestroy, mount as svelteMount, unmount as svelteUnmount } from 'svelte';
  import { getActiveApp, shell, type ActiveActionDescriptor } from 'sh3-core';

  import type {
    HelpTabContribution,
    HelpTabContext,
    HelpTabHandle,
    HelpSnapshot,
  } from '../help/contributions';
  import { HELP_TABS_CONTRIBUTION_POINT_ID } from '../help/contributions';
  import { buildTabList } from './help/buildTabList';
  import { captureHelpSnapshot, buildRuntimeInputs } from './help/captureSnapshot';
  import HotkeysTab from './help/HotkeysTab.svelte';

  type CtxLike = {
    contributions: { list<T>(pointId: string): T[] };
    actions: { selection: { get(): { type: string; ref: unknown } | null } };
  };

  let {
    surface,
    close,
    onClose,
    ctx,
  }: {
    surface: 'view' | 'modal';
    close?: () => void;
    onClose?: () => void;
    ctx: CtxLike;
  } = $props();

  let snapshot: HelpSnapshot | null = $state.raw(null);
  let tabs: HelpTabContribution[] = $state.raw([]);
  let hotkeysActions: ActiveActionDescriptor[] = [];
  let activeIndex = $state(0);

  const handles = new Map<string, HelpTabHandle>();
  const containers = new Map<string, HTMLElement>();

  function mountTabIfNeeded(tab: HelpTabContribution): void {
    if (handles.has(tab.id)) return;
    const container = containers.get(tab.id);
    if (!container || !snapshot) return;
    const tabCtx: HelpTabContext = {
      surface,
      snapshot,
      close: surface === 'modal' ? close : undefined,
    };
    if (tab.id === 'sh3-editor:help-tab:hotkeys') {
      const cmp = svelteMount(HotkeysTab, {
        target: container,
        props: { tabCtx, actions: hotkeysActions },
      });
      handles.set(tab.id, { unmount: () => svelteUnmount(cmp) });
    } else {
      handles.set(tab.id, tab.mount(container, tabCtx));
    }
  }

  onMount(() => {
    const app = getActiveApp();
    const inputs = buildRuntimeInputs({
      getActiveAppId: () => app?.id ?? null,
      getSelection: () => ctx.actions.selection.get(),
    });
    snapshot = captureHelpSnapshot(inputs);

    hotkeysActions = shell.actions.listActive();

    const contributions = ctx.contributions.list<HelpTabContribution>(
      HELP_TABS_CONTRIBUTION_POINT_ID,
    );
    tabs = buildTabList(contributions);
  });

  onDestroy(() => {
    for (const h of handles.values()) {
      try { h.unmount(); } catch (e) { console.warn('[sh3-editor] Help tab unmount error:', e); }
    }
    handles.clear();
    containers.clear();
    onClose?.();
  });

  $effect(() => {
    if (!snapshot) return;
    const tab = tabs[activeIndex];
    if (!tab) return;
    queueMicrotask(() => mountTabIfNeeded(tab));
  });

  function bindContainer(node: HTMLElement, tabId: string) {
    containers.set(tabId, node);
    const active = tabs[activeIndex];
    if (active && active.id === tabId && snapshot) mountTabIfNeeded(active);
    return {
      destroy() {
        containers.delete(tabId);
      },
    };
  }
</script>

<div class="help-root" class:modal-surface={surface === 'modal'} data-sh3-view="sh3-editor:help">
  {#if surface === 'modal'}
    <header class="help-header">
      <span class="title">Help</span>
      {#if close}
        <button class="close-btn" onclick={close} aria-label="Close help">×</button>
      {/if}
    </header>
  {/if}

  {#if tabs.length > 0}
    <div class="tab-strip" role="tablist">
      {#each tabs as tab, i (tab.id)}
        <button
          class="tab-btn"
          class:active={i === activeIndex}
          role="tab"
          aria-selected={i === activeIndex}
          onclick={() => (activeIndex = i)}
        >
          {#if tab.icon}<span class="tab-icon">{tab.icon}</span>{/if}
          <span>{tab.label}</span>
        </button>
      {/each}
    </div>
    <div class="tab-bodies">
      {#each tabs as tab, i (tab.id)}
        <div
          class="tab-body"
          class:active={i === activeIndex}
          role="tabpanel"
          use:bindContainer={tab.id}
        ></div>
      {/each}
    </div>
  {:else}
    <p class="loading">Loading…</p>
  {/if}
</div>

<style>
  .help-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 320px;
    background: var(--shell-surface, #1a1a1a);
    color: var(--shell-fg);
  }
  .modal-surface {
    width: 640px;
    max-width: 90vw;
    height: 480px;
    max-height: 80vh;
  }
  .help-header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--shell-border, #2a2a2a);
  }
  .title { font-weight: 600; flex: 1; }
  .close-btn {
    background: none;
    border: none;
    color: var(--shell-fg);
    font-size: 18px;
    cursor: pointer;
    padding: 0 8px;
    line-height: 1;
  }
  .tab-strip {
    display: flex;
    gap: 2px;
    padding: 6px 8px 0;
    border-bottom: 1px solid var(--shell-border, #2a2a2a);
    background: var(--shell-surface-2, transparent);
  }
  .tab-btn {
    background: transparent;
    border: none;
    color: var(--shell-fg);
    padding: 6px 12px;
    cursor: pointer;
    font-size: 13px;
    border-bottom: 2px solid transparent;
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }
  .tab-btn:hover { background: var(--shell-hover, rgba(255,255,255,0.05)); }
  .tab-btn.active {
    border-bottom-color: var(--shell-accent, #3ba3ff);
    font-weight: 600;
  }
  .tab-icon { font-size: 14px; }
  .tab-bodies {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  .tab-body {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: none;
  }
  .tab-body.active { display: block; }
  .loading { padding: 16px; opacity: 0.6; }
</style>
