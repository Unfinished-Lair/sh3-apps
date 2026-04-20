<script lang="ts">
  import type { ProgressState } from '../../runtime.svelte';
  let { p }: { p: ProgressState } = $props();
  const pct = $derived(p.total === 0 ? 0 : Math.round((p.processed / p.total) * 100));
</script>

{#if p.running || p.total > 0}
  <div class="r2-progress">
    <div class="r2-progress__label">
      {#if p.running}Running: {p.currentLabel}{:else}Done.{/if}
    </div>
    <div class="r2-progress__bar"><div class="r2-progress__fill" style:width="{pct}%"></div></div>
    <div class="r2-progress__counts">
      {p.processed}/{p.total} — uploaded {p.uploaded}, skipped {p.skipped}, failed {p.failed}
    </div>
    {#if p.errors.length > 0}
      <details>
        <summary>{p.errors.length} error{p.errors.length === 1 ? '' : 's'}</summary>
        <ul>{#each p.errors as e}<li>{e}</li>{/each}</ul>
      </details>
    {/if}
  </div>
{/if}

<style>
  .r2-progress { padding: 8px; border: 1px solid var(--sh3-border, #2a2a2a); border-radius: 3px; margin: 8px 0; }
  .r2-progress__bar { height: 6px; background: var(--sh3-surface, #1a1a1a); margin: 4px 0; }
  .r2-progress__fill { height: 100%; background: var(--sh3-accent, #4a9eff); }
  .r2-progress__counts { font-size: 0.85em; color: var(--sh3-muted, #888); }
</style>
