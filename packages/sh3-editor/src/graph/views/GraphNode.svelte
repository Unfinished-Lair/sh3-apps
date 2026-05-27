<script lang="ts">
  import BodyBridge from './BodyBridge.svelte';
  import type { NodeState, PortDefinition, GraphState } from '../state/types';
  import type { NodeVisuals, GraphDomain } from '../domain/types';
  import type { HistoryController } from '../../types';

  interface Props {
    node: NodeState;
    visuals: NodeVisuals;
    selected: boolean;
    /** True while an in-progress marquee covers this node; shows a preview outline. */
    marqueePreview?: boolean;
    /** Resolver injected by Graph.svelte. Returns hex, or null to inherit border. */
    portColor?: (port: PortDefinition) => string | null;
    /** Forwarded to BodyBridge for revision subscription + history dispatch. */
    state: GraphState;
    domain: GraphDomain;
    history: HistoryController;
    onHeaderPointerDown?: (ev: PointerEvent) => void;
    onPortPointerDown?: (port: PortDefinition, ev: PointerEvent) => void;
    onPortPointerUp?: (port: PortDefinition, ev: PointerEvent) => void;
    onSelectClick?: (ev: MouseEvent) => void;
    /** Called when user drags a resize handle. Edge: 'e', 's', or 'se'. */
    onResizePointerDown?: (edge: 'e' | 's' | 'se', ev: PointerEvent) => void;
  }
  const props: Props = $props();

  const inputs = $derived(props.node.ports.filter((p) => p.direction === 'input'));
  const outputs = $derived(props.node.ports.filter((p) => p.direction === 'output'));
  const hasBody = $derived(!!props.visuals.bodySchema && props.visuals.bodySchema.length > 0);
  const resizable = $derived(!!props.visuals.resize);
  const resizeAxes = $derived(props.visuals.resize?.axes ?? 'both');

  function colorFor(p: PortDefinition): string | undefined {
    return props.portColor?.(p) ?? undefined;
  }
</script>

<div
  class="graph-node"
  class:selected={props.selected}
  class:marquee-preview={props.marqueePreview && !props.selected}
  class:resizable
  style:left="{props.node.position.x}px"
  style:top="{props.node.position.y}px"
  style:width="{props.node.width}px"
  style:height={resizable ? `${props.node.height}px` : null}
  style:min-height={resizable ? null : `${props.node.height}px`}
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

  <div class="row" class:has-body={hasBody}>
    <div class="ports-col inputs">
      {#each inputs as p (p.shortId)}
        <div class="port input"
             data-port-id={p.shortId}
             data-data-type={p.dataType ?? ''}
             style:--port-color={colorFor(p)}
             onpointerdown={(ev) => props.onPortPointerDown?.(p, ev)}
             onpointerup={(ev) => props.onPortPointerUp?.(p, ev)}>
          <span class="port-marker"></span>
          <span class="port-label">{p.label}</span>
        </div>
      {/each}
    </div>

    {#if hasBody}
      <BodyBridge
        node={props.node}
        state={props.state}
        domain={props.domain}
        history={props.history}
        bodySchema={props.visuals.bodySchema!}
      />
    {/if}

    <div class="ports-col outputs">
      {#each outputs as p (p.shortId)}
        <div class="port output"
             data-port-id={p.shortId}
             data-data-type={p.dataType ?? ''}
             style:--port-color={colorFor(p)}
             onpointerdown={(ev) => props.onPortPointerDown?.(p, ev)}
             onpointerup={(ev) => props.onPortPointerUp?.(p, ev)}>
          <span class="port-label">{p.label}</span>
          <span class="port-marker"></span>
        </div>
      {/each}
    </div>
  </div>

  {#if resizable}
    {#if resizeAxes !== 'height'}
      <div class="resize-edge resize-edge-r"
           onpointerdown={(ev) => { ev.stopPropagation(); props.onResizePointerDown?.('e', ev); }}></div>
    {/if}
    {#if resizeAxes !== 'width'}
      <div class="resize-edge resize-edge-b"
           onpointerdown={(ev) => { ev.stopPropagation(); props.onResizePointerDown?.('s', ev); }}></div>
    {/if}
    <div class="resize-corner"
         onpointerdown={(ev) => { ev.stopPropagation(); props.onResizePointerDown?.('se', ev); }}></div>
  {/if}
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
    /* Parent .viewport sets pointer-events:none so empty regions fall
       through to .graph-canvas; nodes opt back in here. */
    pointer-events: auto;
    display: flex;
    flex-direction: column;
  }
  .graph-node.selected { outline: 2px solid var(--sh3-accent, #4a9eff); outline-offset: 1px; }
  .graph-node.marquee-preview {
    outline: 2px dashed var(--sh3-accent, #4a9eff);
    outline-offset: 1px;
  }
  .header { padding: 4px 8px; cursor: grab; font-weight: 600; border-bottom: 1px solid var(--border-color); display: flex; gap: 6px; align-items: center; }
  .header:active { cursor: grabbing; }
  .row { display: flex; align-items: stretch; padding: 6px 0; min-height: 24px; flex: 1 1 auto; min-height: 0; }
  .ports-col { display: flex; flex-direction: column; gap: 4px; }
  .ports-col.inputs  { align-items: flex-start; flex: 0 0 auto; }
  .ports-col.outputs { align-items: flex-end;   flex: 0 0 auto; margin-left: auto; }
  /* When a body slot is present, the body slot's flex: 1 1 0 should claim
     all remaining horizontal space and push the output column to the right
     naturally. `margin-left: auto` would greedily absorb that space first,
     leaving 0 px for the body slot to grow into. */
  .row.has-body .ports-col.outputs { margin-left: 0; }
  .port { display: flex; align-items: center; gap: 4px; padding: 0 4px; font-size: 0.85em; cursor: crosshair; }
  .port-marker { width: 10px; height: 10px; border-radius: 50%;
                 background: var(--port-color, var(--border-color));
                 border: 1px solid rgba(255,255,255,0.4); }
  .input .port-marker { margin-left: -10px; }
  .output .port-marker { margin-right: -10px; }
  .resize-edge {
    position: absolute;
    background: transparent;
    transition: background 0.1s;
  }
  .resize-edge:hover { background: rgba(74,158,255,0.35); }
  .resize-edge-r { right: -3px; top: 0; bottom: 0; width: 6px; cursor: ew-resize; }
  .resize-edge-b { left: 0; right: 0; bottom: -3px; height: 6px; cursor: ns-resize; }
  .resize-corner {
    position: absolute; right: 0; bottom: 0;
    width: 12px; height: 12px;
    cursor: nwse-resize;
    background: linear-gradient(135deg, transparent 50%, var(--border-color) 50%);
    opacity: 0.7;
  }
  .resize-corner:hover { opacity: 1; }
</style>
