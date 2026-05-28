<script lang="ts">
  import type { BlockState } from '../state/types';

  interface Props {
    block: BlockState;
    selected: boolean;
    onSelectClick: (ev: MouseEvent) => void;
    onPointerDown: (ev: PointerEvent) => void;
    onResizePointerDown: (edge: 'e' | 's' | 'se', ev: PointerEvent) => void;
  }
  let props: Props = $props();

  const labelInside  = $derived(props.block.labelAnchor === 'top');
  const labelOutside = $derived(props.block.labelAnchor === 'above');
  const labelCenter  = $derived(props.block.labelAnchor === 'centered');
</script>

<div
  class="graph-block"
  class:selected={props.selected}
  data-block-id={props.block.id}
  role="group"
  aria-label={props.block.label}
  style:left="{props.block.position.x}px"
  style:top="{props.block.position.y}px"
  style:width="{props.block.width}px"
  style:height="{props.block.height}px"
  onpointerdown={props.onPointerDown}
  onclick={props.onSelectClick}
>
  <div
    class="fill"
    style:background={props.block.color}
    style:opacity={props.block.alpha}
  ></div>

  {#if labelInside}
    <div class="label label-top">{props.block.label}</div>
  {/if}
  {#if labelOutside}
    <div class="label label-above">{props.block.label}</div>
  {/if}
  {#if labelCenter}
    <div class="label label-center">{props.block.label}</div>
  {/if}

  <div
    class="resize e"
    role="separator"
    aria-orientation="vertical"
    onpointerdown={(ev) => props.onResizePointerDown('e', ev)}
  ></div>
  <div
    class="resize s"
    role="separator"
    aria-orientation="horizontal"
    onpointerdown={(ev) => props.onResizePointerDown('s', ev)}
  ></div>
  <div
    class="resize se"
    role="separator"
    onpointerdown={(ev) => props.onResizePointerDown('se', ev)}
  ></div>
</div>

<style>
  .graph-block {
    position: absolute;
    border: 1px solid var(--sh3-border, #444);
    border-radius: 4px;
    box-sizing: border-box;
    pointer-events: auto;
  }
  .graph-block.selected {
    outline: 2px solid var(--sh3-accent, #4a9eff);
    outline-offset: 1px;
  }
  .fill { position: absolute; inset: 0; pointer-events: none; }

  .label {
    position: absolute;
    color: var(--sh3-fg, #ddd);
    font: 12px var(--sh3-font-ui, system-ui);
    pointer-events: auto;
    user-select: none;
  }
  .label-top    { top: 0; left: 0; right: 0; padding: 2px 6px;
                  background: rgba(0,0,0,0.25); border-bottom: 1px solid var(--sh3-border, #444); }
  .label-above  { bottom: 100%; left: 0; margin-bottom: 2px; }
  .label-center { top: 50%; left: 50%; transform: translate(-50%, -50%);
                  font-size: 18px; opacity: 0.5; }

  .resize { position: absolute; pointer-events: auto; }
  .resize.e  { right: -3px; top: 0; bottom: 0; width: 6px; cursor: ew-resize; }
  .resize.s  { left: 0; right: 0; bottom: -3px; height: 6px; cursor: ns-resize; }
  .resize.se { right: -3px; bottom: -3px; width: 10px; height: 10px;
               cursor: nwse-resize; }
</style>
