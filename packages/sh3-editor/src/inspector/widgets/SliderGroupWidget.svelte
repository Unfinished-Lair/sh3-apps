<script lang="ts">
  import { SliderGroup } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isNumberRecord } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit, onCommitCoalesced }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'slider-group' ? meta.widget : undefined,
  );
  const ok = $derived(isNumberRecord(value) && !!widget);

  // Slot id isn't directly available — synthetic key based on field label.
  // TODO(later): thread real slotId through InspectorRendererProps.
  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isNumberRecord(value)) warnOnce(warnKey, 'slider-group', 'expected Record<string, number>');
    else if (!widget) warnOnce(warnKey, 'slider-group', 'meta.widget required (with spec)');
  });

  let local: Record<string, number> = $state(ok ? { ...(value as Record<string, number>) } : {});
  $effect(() => { if (ok) local = { ...(value as Record<string, number>) }; });

  // One drag key per sub-slider per gesture: keyed by sub-key + uuid.
  let dragKeys: Record<string, string | null> = {};

  function onSubChange(subKey: string, next: number) {
    if (api.readonly) return;
    const prev = (value as Record<string, number>)[subKey];
    if (next === prev) return;
    const merged = { ...(value as Record<string, number>), [subKey]: next };
    const dk = dragKeys[subKey];
    if (dk) onCommitCoalesced?.(merged, dk);
    else    onCommit?.(merged);
  }
  function onSubPointerDown(subKey: string) {
    dragKeys[subKey] = `slider-group:${subKey}:${crypto.randomUUID()}`;
  }
  function onSubPointerUp(subKey: string) {
    dragKeys[subKey] = null;
  }
  function onAnyPointerCancel() {
    for (const k of Object.keys(dragKeys)) dragKeys[k] = null;
  }
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div onpointercancel={onAnyPointerCancel}>
    <SliderGroup
      bind:value={local}
      spec={widget!.spec}
      disabled={api.readonly || meta?.readonly}
      onsubchange={onSubChange}
      onsubpointerdown={onSubPointerDown}
      onsubpointerup={onSubPointerUp}
    />
  </div>
{/if}
