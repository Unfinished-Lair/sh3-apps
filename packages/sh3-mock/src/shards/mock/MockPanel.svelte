<script lang="ts">
  /*
   * MockPanel — the view component contributed by the mock shard.
   *
   * Purpose in the phase-4 stack: prove the end-to-end path by showing
   *   1. the slotId the shell mounted us into,
   *   2. live pixel dimensions (propagated through onResize from the slot),
   *   3. a counter whose value lives in the mock shard's workspace state
   *      zone, keyed by slotId so every slot has its own counter.
   *
   * All three signals together demonstrate that layout + state zones +
   * shard lifecycle compose correctly. Since phase 7, the shell's own
   * layout tree also persists through the workspace zone — independent
   * of this shard's counter, which continues to use its own shardId.
   *
   * Note: the workspace prop is the shard's reactive $state proxy — reading
   * `workspace.countersBySlot[slotId]` inside the template is live.
   */

  import { sh3, focusTab, spliceIntoActiveLayout } from 'sh3-core';
  import type { MountContext } from 'sh3-core';
  import DemoModalContent from './DemoModalContent.svelte';
  import DemoPopupMenu from './DemoPopupMenu.svelte';
  import { randomModalBoxStyle } from './randomModalStyle';

  interface WorkspaceState {
    countersBySlot: Record<string, number>;
  }
  interface Dims {
    width: number;
    height: number;
  }

  let {
    slotId,
    context,
    workspace,
    dims,
  }: {
    slotId: string;
    context: MountContext;
    workspace: WorkspaceState;
    dims: Dims;
  } = $props();

  const count = $derived(workspace.countersBySlot[slotId] ?? 0);

  function increment() {
    workspace.countersBySlot[slotId] = count + 1;
  }

  function reset() {
    workspace.countersBySlot[slotId] = 0;
  }

  // --- Phase 5 overlay demo ---------------------------------------------

  function openModal() {
    sh3.modal.open(DemoModalContent, { depth: 1 }, { boxStyle: randomModalBoxStyle() });
  }

  function openMenu(e: MouseEvent) {
    const anchor = e.currentTarget as HTMLElement;
    sh3.popup.show(DemoPopupMenu, { anchor });
  }

  function fireToast() {
    sh3.toast.notify(`hello from ${slotId}`, { level: 'info' });
  }

  /**
   * Ensure a mock panel tab exists in the layout, re-adding it if it was
   * closed, then focus it.
   */
  function ensureAndFocus(tabSlotId: string, label: string) {
    if (!focusTab(tabSlotId)) {
      spliceIntoActiveLayout({ slotId: tabSlotId, viewId: 'mock:panel', label });
    }
  }
</script>

<div class="mock-panel">
  <header class="mock-header">
    <span class="mock-title">mock:panel</span>
    <span class="mock-slot-id">{slotId}</span>
  </header>

  <div class="mock-body">
    <div class="mock-counter">{count}</div>
    <div class="mock-actions">
      <button type="button" onclick={increment}>+ increment</button>
      <button type="button" class="secondary" onclick={reset}>reset</button>
    </div>
    <div class="mock-hint">
      counter persists per slot across reload
    </div>

    <div class="mock-overlays">
      <button type="button" class="overlay" onclick={openModal}>Modal</button>
      <button type="button" class="overlay" onclick={openMenu}>Menu ▾</button>
      <button type="button" class="overlay" onclick={fireToast}>Toast</button>
    </div>

    <div class="mock-focus">
      <span class="mock-section-label">focusTab API</span>
      <div class="mock-focus-buttons">
        <button type="button" class="overlay" onclick={() => ensureAndFocus('main.center.a', 'Panel A')}>Focus A</button>
        <button type="button" class="overlay" onclick={() => ensureAndFocus('main.center.b', 'Panel B')}>Focus B</button>
        <button type="button" class="overlay" onclick={() => ensureAndFocus('main.center.c', 'Panel C')}>Focus C</button>
      </div>
    </div>

    <div class="mock-context">
      <span class="mock-section-label">MountContext</span>
      <code>{context.viewId} @ {context.label}</code>
    </div>
  </div>

  <footer class="mock-footer">
    {dims.width} × {dims.height}
  </footer>
</div>

<style>
  .mock-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: var(--sh3-bg);
    color: var(--sh3-fg);
    font-family: var(--sh3-font-ui);
  }
  .mock-header {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--sh3-pad-sm) var(--sh3-pad-md);
    background: var(--sh3-bg-elevated);
    border-bottom: 1px solid var(--sh3-border);
    font-size: 11px;
  }
  .mock-title {
    color: var(--sh3-accent);
    font-family: var(--sh3-font-mono);
  }
  .mock-slot-id {
    color: var(--sh3-fg-muted);
    font-family: var(--sh3-font-mono);
  }
  .mock-body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--sh3-pad-md);
    padding: var(--sh3-pad-lg);
    min-height: 0;
    min-width: 0;
  }
  .mock-counter {
    font-size: 48px;
    font-family: var(--sh3-font-mono);
    color: var(--sh3-fg);
    line-height: 1;
  }
  .mock-actions {
    display: flex;
    gap: var(--sh3-pad-sm);
  }
  .mock-actions button {
    appearance: none;
    font: inherit;
    font-size: 12px;
    padding: var(--sh3-pad-sm) var(--sh3-pad-md);
    background: var(--sh3-accent-muted);
    color: var(--sh3-fg);
    border: 1px solid var(--sh3-border-strong);
    border-radius: 3px;
    cursor: pointer;
  }
  .mock-actions button:hover {
    background: var(--sh3-accent);
  }
  .mock-actions button.secondary {
    background: transparent;
  }
  .mock-actions button.secondary:hover {
    background: var(--sh3-bg-elevated);
  }
  .mock-hint {
    color: var(--sh3-fg-subtle);
    font-size: 11px;
  }
  .mock-overlays {
    display: flex;
    gap: var(--sh3-pad-sm);
    margin-top: var(--sh3-pad-sm);
  }
  .mock-overlays .overlay {
    appearance: none;
    font: inherit;
    font-size: 11px;
    padding: 2px var(--sh3-pad-sm);
    background: var(--sh3-bg-sunken);
    color: var(--sh3-fg-muted);
    border: 1px solid var(--sh3-border);
    border-radius: 2px;
    cursor: pointer;
  }
  .mock-overlays .overlay:hover {
    color: var(--sh3-fg);
    border-color: var(--sh3-accent-muted);
  }
  .mock-focus,
  .mock-context {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .mock-section-label {
    font-size: 10px;
    color: var(--sh3-fg-subtle);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .mock-focus-buttons {
    display: flex;
    gap: var(--sh3-pad-sm);
  }
  .mock-focus-buttons button {
    appearance: none;
    font: inherit;
    font-size: 11px;
    padding: 2px var(--sh3-pad-sm);
    background: var(--sh3-bg-sunken);
    color: var(--sh3-fg-muted);
    border: 1px solid var(--sh3-border);
    border-radius: 2px;
    cursor: pointer;
  }
  .mock-focus-buttons button:hover {
    color: var(--sh3-fg);
    border-color: var(--sh3-accent-muted);
  }
  .mock-context code {
    font-family: var(--sh3-font-mono);
    font-size: 10px;
    color: var(--sh3-accent);
  }
  .mock-footer {
    flex: 0 0 auto;
    padding: var(--sh3-pad-xs) var(--sh3-pad-md);
    background: var(--sh3-bg-sunken);
    border-top: 1px solid var(--sh3-border);
    color: var(--sh3-fg-subtle);
    font-family: var(--sh3-font-mono);
    font-size: 10px;
    text-align: right;
  }
</style>
