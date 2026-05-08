<script lang="ts">
  import type { KeySummary } from '../types';

  let {
    label,
    keys,
    onclear,
  }: {
    label: string;
    keys: KeySummary[];
    onclear: () => void;
  } = $props();
</script>

<div class="entry-row">
  <span class="entry-label">{label}</span>
  <span class="entry-keys">
    {#if keys.length === 0}
      <span class="empty">(empty)</span>
    {:else}
      {#each keys as kv, i}
        <span class="kv">
          <span class="key">{kv.key}:</span>
          <span class="type">{kv.typeSummary}</span>
        </span>
        {#if i < keys.length - 1}<span class="sep">,</span>{/if}
      {/each}
    {/if}
  </span>
  <button class="clear-btn" onclick={onclear} title="Clear this entry">✕</button>
</div>

<style>
  .entry-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: var(--sh3-font-size);
  }
  .entry-row:hover {
    background: var(--sh3-bg-elevated);
  }
  .entry-label {
    min-width: 120px;
    font-family: var(--sh3-font-mono);
    color: var(--sh3-fg);
  }
  .entry-keys {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    color: var(--sh3-fg-muted);
    font-family: var(--sh3-font-mono);
    font-size: 11px;
  }
  .kv {
    display: inline;
  }
  .key {
    color: var(--sh3-fg-subtle);
  }
  .type {
    color: var(--sh3-accent-muted);
  }
  .sep {
    color: var(--sh3-fg-subtle);
    margin-right: 4px;
  }
  .empty {
    color: var(--sh3-fg-subtle);
    font-style: italic;
  }
  .clear-btn {
    all: unset;
    cursor: pointer;
    color: var(--sh3-fg-subtle);
    font-size: 11px;
    padding: 2px 4px;
    border-radius: 3px;
    opacity: 0;
  }
  .entry-row:hover .clear-btn {
    opacity: 1;
  }
  .clear-btn:hover {
    color: #ff6b6b;
    background: var(--sh3-bg-sunken);
  }
</style>
