<script lang="ts">
  import type { Point } from './edge-path';
  import { cubicEdgePath } from './edge-path';

  interface Props {
    id: string;
    source: Point;
    target: Point;
    color: string;
    oriented: boolean;
    selected: boolean;
    onClick?: (ev: MouseEvent) => void;
  }
  const props: Props = $props();

  const d = $derived(cubicEdgePath(props.source, props.target));
</script>

<g class="edge" class:selected={props.selected} onclick={(ev) => props.onClick?.(ev)} role="presentation">
  {#if props.selected}<path d={d} class="halo" />{/if}
  <path d={d} class="line" stroke={props.color}
        marker-end={props.oriented ? `url(#arrow-${props.id})` : null} />
  {#if props.oriented}
    <defs>
      <marker id="arrow-{props.id}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill={props.color} />
      </marker>
    </defs>
  {/if}
</g>

<style>
  .edge { cursor: pointer; }
  .line { fill: none; stroke-width: 2; }
  .halo { fill: none; stroke: var(--sh3-accent, #4a9eff); stroke-width: 6; opacity: 0.4; }
  .selected .line { stroke-width: 3; }
</style>
