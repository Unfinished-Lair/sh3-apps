<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let {
    labels,
    onPick,
    onCancel,
  }: {
    labels: string[];
    onPick: (label: string) => void;
    onCancel: () => void;
  } = $props();

  let listRoot = $state<HTMLDivElement | null>(null);

  onMount(() => {
    listRoot?.querySelector<HTMLButtonElement>('button')?.focus();
  });

  onDestroy(() => {
    onCancel();
  });
</script>

<div class="sh3-fe-openwith">
  <h2>Open with…</h2>
  <div bind:this={listRoot} class="sh3-fe-openwith__list">
    {#each labels as label}
      <button type="button" class="sh3-fe-openwith__item" onclick={() => onPick(label)}>{label}</button>
    {/each}
  </div>
  <div class="sh3-fe-openwith__actions">
    <button type="button" class="sh3-fe-openwith__cancel" onclick={onCancel}>Cancel</button>
  </div>
</div>

<style>
  .sh3-fe-openwith { padding: 16px; min-width: 320px; color: var(--sh3-fg); }
  .sh3-fe-openwith h2 { margin: 0 0 12px; font-size: 1.1em; }
  .sh3-fe-openwith__list { display: flex; flex-direction: column; gap: 4px; }
  .sh3-fe-openwith__item { text-align: left; padding: 6px 10px; background: var(--sh3-bg-elevated); color: var(--sh3-fg); border: 1px solid var(--sh3-border); border-radius: var(--sh3-radius-sm, 3px); font: inherit; cursor: pointer; }
  .sh3-fe-openwith__item:hover,
  .sh3-fe-openwith__item:focus { background: var(--sh3-accent-muted); }
  .sh3-fe-openwith__actions { display: flex; justify-content: flex-end; margin-top: 12px; }
  .sh3-fe-openwith__cancel { font: inherit; padding: 6px 14px; border-radius: var(--sh3-radius-sm, 3px); cursor: pointer; border: 1px solid var(--sh3-border); background: var(--sh3-bg-elevated); color: var(--sh3-fg); }
  .sh3-fe-openwith__cancel:hover { background: var(--sh3-accent-muted); }
</style>
