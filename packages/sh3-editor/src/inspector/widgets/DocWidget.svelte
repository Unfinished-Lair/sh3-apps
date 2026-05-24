<script lang="ts">
  import type { InspectorRendererProps, DocPickerContribution } from '../contributions';
  import { listDocPickerProviders } from './doc-picker-registry';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  const handle = $derived(value as { shardId?: string; path?: string } | null | undefined);
  const display = $derived.by(() => {
    if (!handle || typeof handle !== 'object') return '(no document)';
    if (handle.shardId && handle.path) return `${handle.shardId}/${handle.path}`;
    return '(no document)';
  });

  let browseEl: HTMLButtonElement | undefined = $state();

  function pickProvider(): DocPickerContribution | null {
    const entries = listDocPickerProviders();
    if (entries.length === 0) return null;
    const sorted = [...entries].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
    return sorted[0];
  }

  const hasProvider = $derived(listDocPickerProviders().length > 0);

  async function onBrowse() {
    if (api.readonly || !onCommit) return;
    const provider = pickProvider();
    if (!provider) return;
    const picked = await provider.picker.open({ anchor: browseEl });
    if (!picked) return;
    onCommit({ shardId: picked.shardId, path: picked.path });
  }

  function onClear() {
    if (api.readonly || !onCommit) return;
    onCommit(null);
  }
</script>

<div class="iw">
  <span class="chip">{display}</span>
  {#if !api.readonly && !meta?.readonly}
    <button
      type="button"
      data-role="browse"
      bind:this={browseEl}
      disabled={!hasProvider}
      title={hasProvider ? 'Browse documents' : 'No document picker registered'}
      onclick={onBrowse}
    >Browse</button>
    <button
      type="button"
      data-role="clear"
      disabled={!handle}
      onclick={onClear}
    >Clear</button>
  {/if}
</div>

<style>
  .iw { display: flex; gap: 4px; align-items: center; width: 100%; }
  .chip {
    flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    padding: 2px 6px; border: 1px solid var(--sh3-border, #333); border-radius: 3px;
    font-family: monospace; font-size: 0.85em;
  }
  button { padding: 2px 6px; font-size: 0.85em; }
</style>
