<script lang="ts">
  import type { InspectorRendererProps } from '../contributions';

  let { value, meta }: InspectorRendererProps = $props();

  const widgetBadge = $derived(
    meta?.widget?.type === 'badge' ? meta.widget : null,
  );
  const level = $derived(widgetBadge?.level ?? 'info');
  const icon = $derived(widgetBadge?.icon ?? defaultIcon(level));
  const text = $derived(typeof value === 'string' ? value : meta?.label ?? '');

  function defaultIcon(lvl: string): string {
    if (lvl === 'error') return '⚠';
    if (lvl === 'warn')  return '⚠';
    return 'ⓘ';
  }
</script>

<span class="badge badge-{level}">
  <span class="icon">{icon}</span>
  <span class="text">{text}</span>
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 1px 6px;
    border-radius: 9999px;
    font-size: 0.8em;
    font-family: var(--sh3-font-mono);
    border: 1px solid currentColor;
  }
  .badge-info  { color: var(--sh3-info,    #38bdf8); }
  .badge-warn  { color: var(--sh3-warning, #f59e0b); }
  .badge-error { color: var(--sh3-error,   #ef4444); }
  .icon { line-height: 1; }
</style>
