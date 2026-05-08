<script lang="ts">
  import { contrastRatio, wcagBadge, type WcagUsage } from '../util/contrast';

  let {
    fg,
    bg,
    usage = 'text',
  }: {
    fg: string | undefined;
    bg: string | undefined;
    usage?: WcagUsage;
  } = $props();

  const ratio = $derived(fg && bg ? contrastRatio(fg, bg) : undefined);
  const badge = $derived(ratio === undefined ? '—' : wcagBadge(ratio, usage));
  const label = $derived(
    ratio === undefined
      ? '—'
      : `${ratio.toFixed(2)}:1`,
  );
</script>

<span class="badge" class:aaa={badge === 'AAA'} class:aa={badge === 'AA'} class:fail={badge === 'fail'}>
  <span class="level">{badge}</span>
  <span class="ratio">{label}</span>
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 1px 6px;
    border-radius: var(--sh3-radius-sm, 3px);
    font-size: 10px;
    line-height: 1.2;
    background: var(--sh3-bg-sunken);
    color: var(--sh3-fg-muted);
    border: 1px solid var(--sh3-border);
  }
  .level {
    font-weight: 600;
    letter-spacing: 0.3px;
  }
  .ratio {
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }
  .badge.aaa { color: var(--sh3-success); border-color: var(--sh3-success); }
  .badge.aa { color: var(--sh3-fg); }
  .badge.fail { color: var(--sh3-error); border-color: var(--sh3-error); }
</style>
