<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let {
    title,
    initial,
    onConfirm,
    onCancel,
  }: {
    title: string;
    initial: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
  } = $props();

  let value = $state(initial);
  let input = $state<HTMLInputElement | null>(null);

  onMount(() => {
    input?.focus();
    input?.select();
  });

  onDestroy(() => {
    onCancel();
  });

  function onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') { ev.preventDefault(); onConfirm(value); }
    if (ev.key === 'Escape') { ev.preventDefault(); onCancel(); }
  }
</script>

<div class="sh3-fe-prompt" onkeydown={onKeydown}>
  <h2>{title}</h2>
  <input bind:this={input} bind:value type="text" class="sh3-fe-prompt__input" />
  <div class="sh3-fe-prompt__actions">
    <button type="button" class="sh3-fe-prompt__cancel" onclick={onCancel}>Cancel</button>
    <button type="button" class="sh3-fe-prompt__ok" onclick={() => onConfirm(value)}>OK</button>
  </div>
</div>

<style>
  .sh3-fe-prompt { padding: 16px; min-width: 360px; color: var(--sh3-fg); }
  .sh3-fe-prompt h2 { margin: 0 0 12px; font-size: 1.1em; }
  .sh3-fe-prompt__input { width: 100%; box-sizing: border-box; padding: 6px 8px; background: var(--sh3-bg-elevated); color: var(--sh3-fg); border: 1px solid var(--sh3-border); border-radius: var(--sh3-radius-sm, 3px); font: inherit; }
  .sh3-fe-prompt__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
  .sh3-fe-prompt__cancel,
  .sh3-fe-prompt__ok { font: inherit; padding: 6px 14px; border-radius: var(--sh3-radius-sm, 3px); cursor: pointer; border: 1px solid var(--sh3-border); }
  .sh3-fe-prompt__cancel { background: var(--sh3-bg-elevated); color: var(--sh3-fg); }
  .sh3-fe-prompt__cancel:hover { background: var(--sh3-accent-muted); }
  .sh3-fe-prompt__ok { background: var(--sh3-accent, #3b82f6); color: #fff; border-color: var(--sh3-accent, #3b82f6); }
  .sh3-fe-prompt__ok:hover { filter: brightness(1.1); }
</style>
