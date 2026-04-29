<script lang="ts">
  interface Props {
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    onFit: () => void;
  }
  const props: Props = $props();
  const pct = $derived(`${Math.round(props.zoom * 100)}%`);
</script>

<div class="toolbar" role="toolbar" aria-label="Graph viewport">
  <button type="button" title="Zoom out (Mod+-)"  onclick={() => props.onZoomOut()}>−</button>
  <button type="button" title="Reset zoom (Mod+0)" class="zoom-label" onclick={() => props.onZoomReset()}>{pct}</button>
  <button type="button" title="Zoom in (Mod+=)"   onclick={() => props.onZoomIn()}>+</button>
  <button type="button" title="Fit content (Shift+1)" onclick={() => props.onFit()}>⤢</button>
</div>

<style>
  .toolbar {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 5;
    display: flex;
    gap: 2px;
    background: var(--sh3-surface-1, #1f1f1f);
    border: 1px solid var(--sh3-border, #444);
    border-radius: 4px;
    padding: 2px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.35);
  }
  button {
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    background: transparent;
    color: var(--sh3-text-primary, #ddd);
    border: 0;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.85em;
    line-height: 1;
  }
  button:hover { background: var(--sh3-hover, #333); }
  .zoom-label { min-width: 44px; font-variant-numeric: tabular-nums; }
</style>
