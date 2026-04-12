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

  import { shell, focusTab, spliceIntoActiveLayout } from 'sh3-core';
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
    shell.modal.open(DemoModalContent, { depth: 1 }, { boxStyle: randomModalBoxStyle() });
  }

  function openMenu(e: MouseEvent) {
    const anchor = e.currentTarget as HTMLElement;
    shell.popup.show(DemoPopupMenu, { anchor });
  }

  function fireToast() {
    shell.toast.notify(`hello from ${slotId}`, { level: 'info' });
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
    background: var(--shell-bg);
    color: var(--shell-fg);
    font-family: var(--shell-font-ui);
  }
  .mock-header {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--shell-pad-sm) var(--shell-pad-md);
    background: var(--shell-bg-elevated);
    border-bottom: 1px solid var(--shell-border);
    font-size: 11px;
  }
  .mock-title {
    color: var(--shell-accent);
    font-family: var(--shell-font-mono);
  }
  .mock-slot-id {
    color: var(--shell-fg-muted);
    font-family: var(--shell-font-mono);
  }
  .mock-body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--shell-pad-md);
    padding: var(--shell-pad-lg);
    min-height: 0;
    min-width: 0;
  }
  .mock-counter {
    font-size: 48px;
    font-family: var(--shell-font-mono);
    color: var(--shell-fg);
    line-height: 1;
  }
  .mock-actions {
    display: flex;
    gap: var(--shell-pad-sm);
  }
  .mock-actions button {
    appearance: none;
    font: inherit;
    font-size: 12px;
    padding: var(--shell-pad-sm) var(--shell-pad-md);
    background: var(--shell-accent-muted);
    color: var(--shell-fg);
    border: 1px solid var(--shell-border-strong);
    border-radius: 3px;
    cursor: pointer;
  }
  .mock-actions button:hover {
    background: var(--shell-accent);
  }
  .mock-actions button.secondary {
    background: transparent;
  }
  .mock-actions button.secondary:hover {
    background: var(--shell-bg-elevated);
  }
  .mock-hint {
    color: var(--shell-fg-subtle);
    font-size: 11px;
  }
  .mock-overlays {
    display: flex;
    gap: var(--shell-pad-sm);
    margin-top: var(--shell-pad-sm);
  }
  .mock-overlays .overlay {
    appearance: none;
    font: inherit;
    font-size: 11px;
    padding: 2px var(--shell-pad-sm);
    background: var(--shell-bg-sunken);
    color: var(--shell-fg-muted);
    border: 1px solid var(--shell-border);
    border-radius: 2px;
    cursor: pointer;
  }
  .mock-overlays .overlay:hover {
    color: var(--shell-fg);
    border-color: var(--shell-accent-muted);
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
    color: var(--shell-fg-subtle);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .mock-focus-buttons {
    display: flex;
    gap: var(--shell-pad-sm);
  }
  .mock-focus-buttons button {
    appearance: none;
    font: inherit;
    font-size: 11px;
    padding: 2px var(--shell-pad-sm);
    background: var(--shell-bg-sunken);
    color: var(--shell-fg-muted);
    border: 1px solid var(--shell-border);
    border-radius: 2px;
    cursor: pointer;
  }
  .mock-focus-buttons button:hover {
    color: var(--shell-fg);
    border-color: var(--shell-accent-muted);
  }
  .mock-context code {
    font-family: var(--shell-font-mono);
    font-size: 10px;
    color: var(--shell-accent);
  }
  .mock-footer {
    flex: 0 0 auto;
    padding: var(--shell-pad-xs) var(--shell-pad-md);
    background: var(--shell-bg-sunken);
    border-top: 1px solid var(--shell-border);
    color: var(--shell-fg-subtle);
    font-family: var(--shell-font-mono);
    font-size: 10px;
    text-align: right;
  }
</style>
