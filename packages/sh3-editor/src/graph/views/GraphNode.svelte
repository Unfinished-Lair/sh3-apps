<script lang="ts">
  import type { NodeState, PortDefinition } from '../state/types';
  import type { NodeVisuals } from '../domain/types';

  interface Props {
    node: NodeState;
    visuals: NodeVisuals;
    selected: boolean;
    onHeaderPointerDown?: (ev: PointerEvent) => void;
    onPortPointerDown?: (port: PortDefinition, ev: PointerEvent) => void;
    onPortPointerUp?: (port: PortDefinition, ev: PointerEvent) => void;
    onSelectClick?: (ev: MouseEvent) => void;
  }
  const props: Props = $props();

  const inputs = $derived(props.node.ports.filter((p) => p.direction === 'input'));
  const outputs = $derived(props.node.ports.filter((p) => p.direction === 'output'));
</script>

<div
  class="graph-node"
  class:selected={props.selected}
  style:left="{props.node.position.x}px"
  style:top="{props.node.position.y}px"
  style:width="{props.node.width}px"
  style:min-height="{props.node.height}px"
  style:--border-color={props.visuals.borderColor}
  style:--text-color={props.visuals.textColor ?? 'var(--sh3-text-primary, #ddd)'}
  data-node-id={props.node.id}
  onclick={(ev) => props.onSelectClick?.(ev)}
  role="button"
  tabindex="0"
>
  <div class="header"
       onpointerdown={(ev) => props.onHeaderPointerDown?.(ev)}>
    {#if props.visuals.icon}<span class="icon">{props.visuals.icon}</span>{/if}
    <span class="label">{props.node.label}</span>
  </div>

  <div class="ports">
    <div class="ports-col inputs">
      {#each inputs as p (p.shortId)}
        <div class="port input"
             data-port-id={p.shortId}
             data-data-type={p.dataType ?? ''}
             onpointerdown={(ev) => props.onPortPointerDown?.(p, ev)}
             onpointerup={(ev) => props.onPortPointerUp?.(p, ev)}>
          <span class="port-marker"></span>
          <span class="port-label">{p.label}</span>
        </div>
      {/each}
    </div>
    <div class="ports-col outputs">
      {#each outputs as p (p.shortId)}
        <div class="port output"
             data-port-id={p.shortId}
             data-data-type={p.dataType ?? ''}
             onpointerdown={(ev) => props.onPortPointerDown?.(p, ev)}
             onpointerup={(ev) => props.onPortPointerUp?.(p, ev)}>
          <span class="port-label">{p.label}</span>
          <span class="port-marker"></span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .graph-node {
    position: absolute;
    background: var(--sh3-surface-1, #1f1f1f);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-color);
    user-select: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  .graph-node.selected { outline: 2px solid var(--sh3-accent, #4a9eff); outline-offset: 1px; }
  .header { padding: 4px 8px; cursor: grab; font-weight: 600; border-bottom: 1px solid var(--border-color); display: flex; gap: 6px; align-items: center; }
  .header:active { cursor: grabbing; }
  .ports { display: flex; justify-content: space-between; padding: 6px 0; }
  .ports-col { display: flex; flex-direction: column; gap: 4px; min-width: 50%; }
  .ports-col.inputs { align-items: flex-start; }
  .ports-col.outputs { align-items: flex-end; }
  .port { display: flex; align-items: center; gap: 4px; padding: 0 4px; font-size: 0.85em; cursor: crosshair; }
  .port-marker { width: 10px; height: 10px; border-radius: 50%; background: var(--border-color); border: 1px solid rgba(255,255,255,0.4); }
  .input .port-marker { margin-left: -10px; }
  .output .port-marker { margin-right: -10px; }
</style>
