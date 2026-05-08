<script lang="ts">
  import { Slider, NumberInput } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';
  import { isNumberRecord } from './match';
  import { warnOnce } from './warn';
  import ReadOnlyLeaf from '../primitives/ReadOnlyLeaf.svelte';

  let { value, meta, api, onCommit, onCommitCoalesced }: InspectorRendererProps = $props();

  const widget = $derived(
    meta?.widget?.type === 'slider-group' ? meta.widget : undefined,
  );
  const ok = $derived(isNumberRecord(value) && !!widget);

  const warnKey = $derived(meta?.label ?? '<unlabeled>');
  $effect(() => {
    if (!isNumberRecord(value)) warnOnce(warnKey, 'slider-group', 'expected Record<string, number>');
    else if (!widget) warnOnce(warnKey, 'slider-group', 'meta.widget required (with channels)');
  });

  // One gestureKey per channel — each sub-slider/field interacts independently
  // and each gesture coalesces into one undo entry for that channel.
  let gestureKeys: Record<string, string | null> = {};

  function commitChannelLive(subKey: string, next: number) {
    if (api.readonly || !onCommit) return;
    const v = value as Record<string, number>;
    if (next === v[subKey]) return;
    gestureKeys[subKey] ??= `slider-group:${subKey}:${crypto.randomUUID()}`;
    const merged = { ...v, [subKey]: next };
    onCommitCoalesced?.(merged, gestureKeys[subKey]!);
  }

  function commitChannelFinal(subKey: string, next: number) {
    if (api.readonly || !onCommit) return;
    const v = value as Record<string, number>;
    if (next !== v[subKey]) {
      const merged = { ...v, [subKey]: next };
      const gk = gestureKeys[subKey];
      if (gk) onCommitCoalesced?.(merged, gk);
      else    onCommit(merged);
    }
    gestureKeys[subKey] = null;
  }

  const orientation = $derived(widget?.orientation ?? 'horizontal');
</script>

{#if !ok}
  <ReadOnlyLeaf {value} />
{:else}
  <div class="iw iw--{orientation}">
    {#each widget!.channels as ch (ch.id)}
      <div class="channel channel--{orientation}">
        <span class="channel-label">{ch.label}</span>
        <div class="slider-wrap">
          <Slider
            value={(value as Record<string, number>)[ch.id] ?? 0}
            min={ch.min ?? 0}
            max={ch.max ?? 100}
            step={ch.step ?? 1}
            orientation={orientation}
            disabled={api.readonly || meta?.readonly}
            oninput={(n: number) => commitChannelLive(ch.id, n)}
            onchange={(n: number) => commitChannelFinal(ch.id, n)}
          />
        </div>
        <div class="field-wrap">
          <NumberInput
            value={(value as Record<string, number>)[ch.id] ?? 0}
            min={ch.min}
            max={ch.max}
            step={ch.step ?? 1}
            disabled={api.readonly || meta?.readonly}
            size="sm"
            oninput={(n: number) => commitChannelLive(ch.id, n)}
            onchange={(n: number) => commitChannelFinal(ch.id, n)}
          />
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .iw { display: flex; width: 100%; }
  .iw--horizontal { flex-direction: column; gap: 4px; }
  .iw--vertical   { flex-direction: row; gap: 8px; align-items: end; }

  .channel { display: flex; gap: 6px; align-items: center; }
  .channel--vertical { flex-direction: column-reverse; align-items: center; }

  .channel-label {
    font-size: 0.75rem;
    color: var(--sh3-fg-muted);
    flex: 0 0 auto;
    min-width: 60px;
  }
  .channel--vertical .channel-label { min-width: 0; text-align: center; }

  .slider-wrap {
    flex: 1 1 auto;
    min-width: 0;
  }
  .slider-wrap > :global(*) {
    width: 100%;
    box-sizing: border-box;
  }

  .field-wrap {
    flex: 0 0 64px;
  }
  .field-wrap > :global(*) {
    width: 100%;
    box-sizing: border-box;
  }
</style>
