<script lang="ts">
  import { Textarea } from 'sh3-core';
  import type { InspectorRendererProps } from '../contributions';

  let { value, meta, api, onCommit }: InspectorRendererProps = $props();

  function stringify(v: unknown): string {
    try { return JSON.stringify(v ?? null, null, 2); }
    catch { return ''; }
  }

  let text = $state('');
  let parseError = $state<string | null>(null);

  $effect(() => { text = stringify(value); });

  function commitFinal(next: string) {
    if (api.readonly || !onCommit) return;
    parseError = null;
    const trimmed = next.trim();
    if (trimmed === '') { onCommit(null); return; }
    try {
      const parsed = JSON.parse(trimmed);
      onCommit(parsed);
    } catch (e) {
      parseError = e instanceof Error ? e.message : String(e);
    }
  }
</script>

<div class="iw" class:error={parseError !== null} title={parseError ?? ''}>
  <Textarea
    value={text}
    rows={meta?.widget?.type === 'text' ? (meta.widget.rows ?? 6) : 6}
    disabled={api.readonly || meta?.readonly}
    oninput={(v: string) => { text = v; }}
    onchange={commitFinal}
  />
</div>

<style>
  .iw { display: block; width: 100%; }
  .iw > :global(*) { width: 100%; box-sizing: border-box; font-family: monospace; }
  .iw.error :global(textarea) { border-color: var(--sh3-danger, #e5484d); }
</style>
