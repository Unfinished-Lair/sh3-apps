<script lang="ts">
  import GraphNode from './GraphNode.svelte';
  import GraphEdge from './GraphEdge.svelte';
  import GraphPalette from './GraphPalette.svelte';
  import type { GraphState, NodeState, EdgeState, PortDefinition } from '../state/types';
  import type { GraphDomain, NodeVisuals, NodeTemplate } from '../domain/types';
  import type { HistoryController } from '../../types';
  import type { GraphAssetNode, GraphAssetPort } from '../asset/types';
  import {
    makeMoveNodeCommand, makeAddEdgeCommand, makeAddNodeCommand,
  } from '../history/commands';
  import { setActiveGraph, clearActiveGraphIf, type ActiveGraphRef } from '../active';
  import { clampZoom, clientToGraph, fitToContent, type Viewport } from './viewport';

  interface Props {
    state: GraphState;
    domain: GraphDomain;
    history: HistoryController;
    onSelectionChange?: (ids: string[]) => void;
    onAssetChanged?: () => void;
  }
  const props: Props = $props();

  function visualsFor(n: NodeState): NodeVisuals {
    return props.domain.getNodeVisuals(n.type);
  }

  function endpointFor(node: NodeState, portShortId: string, side: 'output' | 'input') {
    const port = node.ports.find((p) => p.shortId === portShortId);
    if (!port) return { x: node.position.x, y: node.position.y };
    const inputs  = node.ports.filter((p) => p.direction === 'input');
    const outputs = node.ports.filter((p) => p.direction === 'output');
    const list = side === 'input' ? inputs : outputs;
    const idx = list.indexOf(port);
    const headerH = 26;
    const portRowH = 22;
    const y = node.position.y + headerH + 8 + idx * portRowH + portRowH / 2;
    const x = side === 'output' ? node.position.x + node.width : node.position.x;
    return { x, y };
  }

  function srcPoint(e: EdgeState) {
    const n = props.state.nodes.get(e.sourceNodeId);
    return n ? endpointFor(n, e.sourcePortId, 'output') : { x: 0, y: 0 };
  }
  function tgtPoint(e: EdgeState) {
    const n = props.state.nodes.get(e.targetNodeId);
    return n ? endpointFor(n, e.targetPortId, 'input') : { x: 0, y: 0 };
  }

  function edgeColor(e: EdgeState): string {
    const n = props.state.nodes.get(e.sourceNodeId);
    if (!n) return '#888';
    const p = n.ports.find((pp) => pp.shortId === e.sourcePortId);
    if (!p?.dataType) return '#888';
    return visualsFor(n).portColors?.[p.dataType] ?? '#888';
  }

  function selectOne(id: string, additive: boolean) {
    if (additive) {
      if (props.state.selection.has(id)) props.state.selection.delete(id);
      else props.state.selection.add(id);
    } else {
      props.state.selection.clear();
      props.state.selection.add(id);
    }
    props.onSelectionChange?.(Array.from(props.state.selection));
  }

  function clearSelection() {
    if (props.state.selection.size === 0) return;
    props.state.selection.clear();
    props.onSelectionChange?.([]);
  }

  let dragState: { nodeId: string; start: { x: number; y: number };
                   origin: { x: number; y: number } } | null = $state(null);

  function onHeaderPointerDown(node: NodeState, ev: PointerEvent) {
    if (props.state.readonly) return;
    ev.stopPropagation();
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    dragState = {
      nodeId: node.id,
      start: { x: ev.clientX, y: ev.clientY },
      origin: { ...node.position },
    };
  }

  function onHeaderPointerMove(ev: PointerEvent) {
    if (!dragState) return;
    const n = props.state.nodes.get(dragState.nodeId);
    if (!n) return;
    const dx = ev.clientX - dragState.start.x;
    const dy = ev.clientY - dragState.start.y;
    props.state.nodes.set(dragState.nodeId, {
      ...n,
      position: { x: dragState.origin.x + dx, y: dragState.origin.y + dy },
    });
  }

  function onHeaderPointerUp(_ev: PointerEvent) {
    if (!dragState) return;
    const n = props.state.nodes.get(dragState.nodeId);
    if (n && (n.position.x !== dragState.origin.x || n.position.y !== dragState.origin.y)) {
      const cmd = makeMoveNodeCommand(props.state, dragState.nodeId, dragState.origin, { ...n.position });
      props.history.push(cmd);
      props.onAssetChanged?.();
    }
    dragState = null;
  }

  let edgeDrag: {
    source: { nodeId: string; portId: string; direction: 'input' | 'output'; dataType?: string };
    cursor: { x: number; y: number };
  } | null = $state(null);

  function onPortPointerDown(node: NodeState, port: PortDefinition, ev: PointerEvent) {
    if (props.state.readonly) return;
    ev.stopPropagation();
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    edgeDrag = {
      source: { nodeId: node.id, portId: port.shortId, direction: port.direction, dataType: port.dataType },
      cursor: { x: ev.clientX, y: ev.clientY },
    };
  }

  function onCanvasPointerMove(ev: PointerEvent) {
    onHeaderPointerMove(ev);
    if (edgeDrag) {
      edgeDrag.cursor = { x: ev.clientX, y: ev.clientY }; // graph-space conversion in Task 11
    }
    if (panState && panState.pointerId === ev.pointerId) {
      const dx = ev.clientX - panState.startX;
      const dy = ev.clientY - panState.startY;
      if (!panState.panning && Math.abs(dx) + Math.abs(dy) > PAN_THRESHOLD_PX) {
        panState.panning = true;
      }
      if (panState.panning) {
        viewport = { ...viewport, x: panState.originVx + dx, y: panState.originVy + dy };
      }
    }
  }

  function onPortPointerUp(node: NodeState, port: PortDefinition, ev: PointerEvent) {
    if (!edgeDrag) return;
    ev.stopPropagation();
    const src = edgeDrag.source;
    edgeDrag = null;

    if (port.direction !== 'input') return;
    if (props.domain.edgeSemantics === 'oriented' && src.direction !== 'output') return;
    if (src.nodeId === node.id) return;
    if (props.domain.canConnect && !props.domain.canConnect(
      { nodeId: src.nodeId, portId: src.portId, direction: src.direction, dataType: src.dataType },
      { nodeId: node.id, portId: port.shortId, direction: port.direction, dataType: port.dataType },
    )) return;

    const id = `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const cmd = makeAddEdgeCommand(props.state, {
      id,
      sourceNodeId: src.nodeId,
      sourcePortId: src.portId,
      targetNodeId: node.id,
      targetPortId: port.shortId,
    });
    cmd.apply();
    props.history.push(cmd);
    props.onAssetChanged?.();
  }

  function onCanvasPointerUp(ev: PointerEvent) {
    onHeaderPointerUp(ev);
    edgeDrag = null;
    if (panState && panState.pointerId === ev.pointerId) {
      const wasPanning = panState.panning;
      panState = null;
      if (wasPanning) {
        // Suppress the synthetic click that would otherwise open the palette.
        suppressNextEmptyClick = true;
      }
    }
  }

  let palette: { x: number; y: number } | null = $state(null);
  let viewport: Viewport = $state({ x: 0, y: 0, zoom: 1 });
  let canvasEl: HTMLDivElement | null = $state(null);

  const PAN_THRESHOLD_PX = 4;

  let panState: {
    pointerId: number;
    startX: number; startY: number;
    originVx: number; originVy: number;
    panning: boolean;
  } | null = $state(null);

  let suppressNextEmptyClick = $state(false);

  function onCanvasPointerDown(ev: PointerEvent) {
    // Pan only when the empty canvas itself was hit with primary button.
    if (ev.target !== ev.currentTarget) return;
    if (ev.button !== 0) return;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    panState = {
      pointerId: ev.pointerId,
      startX: ev.clientX, startY: ev.clientY,
      originVx: viewport.x, originVy: viewport.y,
      panning: false,
    };
  }

  function onCanvasEmptyClick(ev: MouseEvent) {
    if (suppressNextEmptyClick) { suppressNextEmptyClick = false; return; }
    if (props.state.readonly) return;
    if (ev.target !== ev.currentTarget) return;
    if (props.domain.useNodePalette) {
      const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
      palette = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
    } else {
      addFreeformAt(ev);
    }
  }

  function addFreeformAt(ev: MouseEvent) {
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const id = `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const node: GraphAssetNode = {
      id, type: '', position: { x: ev.clientX - rect.left, y: ev.clientY - rect.top },
      config: {}, ports: [],
    };
    const cmd = makeAddNodeCommand(props.state, props.domain, node);
    cmd.apply();
    props.history.push(cmd);
    props.onAssetChanged?.();
  }

  function onPalettePick(t: NodeTemplate) {
    if (!palette) return;
    const id = `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ports: GraphAssetPort[] = t.ports.map((p) => ({ ...p, id: `${id}_${p.id}` }));
    const node: GraphAssetNode = {
      id, type: t.type,
      position: { ...palette },
      config: { ...t.defaultConfig },
      ports,
    };
    const cmd = makeAddNodeCommand(props.state, props.domain, node);
    cmd.apply();
    props.history.push(cmd);
    props.onAssetChanged?.();
    palette = null;
  }

  const nodesArr = $derived(Array.from(props.state.nodes.values()));
  const edgesArr = $derived(Array.from(props.state.edges.values()));
  const oriented = $derived(props.domain.edgeSemantics === 'oriented');

  // Active-graph wiring. Keyboard shortcuts (Delete, Mod+Z/Y, Mod+Shift+Z)
  // are registered as SH3 actions in shard.ts with scope
  // 'focus:sh3-editor:graph'; their handlers read getActiveGraph() to find
  // the focused instance. We publish ourselves as active on focusin and
  // clear on unmount.
  const activeRef: ActiveGraphRef = {
    get state() { return props.state; },
    get domain() { return props.domain; },
    get history() { return props.history; },
    onAssetChanged: () => props.onAssetChanged?.(),
    onSelectionChange: (ids) => props.onSelectionChange?.(ids),
  };

  $effect(() => {
    return () => clearActiveGraphIf(activeRef);
  });

  function onCanvasFocusIn() { setActiveGraph(activeRef); }
  function onCanvasPointerDownCapture(ev: PointerEvent) {
    // Pointer events don't transfer focus by default, and child handlers
    // call stopPropagation. Capture-phase focus ensures clicks anywhere
    // (header, port, body) leave the canvas focused so shortcuts dispatch.
    (ev.currentTarget as HTMLElement).focus({ preventScroll: true });
  }

  function onCanvasWheel(ev: WheelEvent) {
    if (!canvasEl) return;
    ev.preventDefault();
    const rect = canvasEl.getBoundingClientRect();
    const mx = ev.clientX - rect.left;
    const my = ev.clientY - rect.top;
    const gx = (mx - viewport.x) / viewport.zoom;
    const gy = (my - viewport.y) / viewport.zoom;
    const newZoom = clampZoom(viewport.zoom * (1 - ev.deltaY * 0.001));
    viewport = {
      x: mx - gx * newZoom,
      y: my - gy * newZoom,
      zoom: newZoom,
    };
  }

  $effect(() => {
    if (!canvasEl) return;
    const el = canvasEl;
    const handler = (ev: WheelEvent) => onCanvasWheel(ev);
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  });
</script>

<div class="graph-canvas"
     bind:this={canvasEl}
     tabindex="0"
     onfocusin={onCanvasFocusIn}
     onpointerdowncapture={onCanvasPointerDownCapture}
     onpointerdown={onCanvasPointerDown}
     onpointermove={onCanvasPointerMove}
     onpointerup={onCanvasPointerUp}
     onpointercancel={onCanvasPointerUp}
     onclick={(ev) => {
       if (ev.target === ev.currentTarget) {
         clearSelection();
         palette = null;
         onCanvasEmptyClick(ev);
       }
     }}>
  <div class="viewport"
       style:transform="translate({viewport.x}px, {viewport.y}px) scale({viewport.zoom})"
       style:transform-origin="0 0">
    <svg class="edge-overlay">
      {#each edgesArr as e (e.id)}
        <GraphEdge
          id={e.id}
          source={srcPoint(e)}
          target={tgtPoint(e)}
          color={edgeColor(e)}
          oriented={oriented}
          selected={props.state.selection.has(e.id)}
          onClick={(ev) => { ev.stopPropagation(); selectOne(e.id, ev.ctrlKey || ev.metaKey); }}
        />
      {/each}
      {#if edgeDrag}
        {@const sourceNode = props.state.nodes.get(edgeDrag.source.nodeId)}
        {#if sourceNode}
          {@const start = endpointFor(sourceNode, edgeDrag.source.portId,
                                      edgeDrag.source.direction === 'output' ? 'output' : 'input')}
          <path class="edge-ghost" stroke="var(--sh3-accent, #4a9eff)" fill="none" stroke-dasharray="4 3"
                d={`M ${start.x} ${start.y} L ${edgeDrag.cursor.x} ${edgeDrag.cursor.y}`} />
        {/if}
      {/if}
    </svg>
    {#each nodesArr as n (n.id)}
      <GraphNode
        node={n}
        visuals={visualsFor(n)}
        selected={props.state.selection.has(n.id)}
        onSelectClick={(ev) => { ev.stopPropagation(); selectOne(n.id, ev.ctrlKey || ev.metaKey); }}
        onHeaderPointerDown={(ev) => onHeaderPointerDown(n, ev)}
        onPortPointerDown={(p, ev) => onPortPointerDown(n, p, ev)}
        onPortPointerUp={(p, ev) => onPortPointerUp(n, p, ev)}
      />
    {/each}
  </div>
  {#if palette}
    <GraphPalette
      byCategory={props.domain.getTemplatesByCategory()}
      x={palette.x}
      y={palette.y}
      onPick={onPalettePick}
      onClose={() => palette = null}
    />
  {/if}
</div>

<style>
  .graph-canvas { position: relative; width: 100%; height: 100%; overflow: hidden;
                  background: var(--sh3-surface-0, #161616);
                  background-image:
                    linear-gradient(var(--sh3-grid, #2a2a2a) 1px, transparent 1px),
                    linear-gradient(90deg, var(--sh3-grid, #2a2a2a) 1px, transparent 1px);
                  background-size: 20px 20px; outline: none; }
  .edge-overlay { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
  .edge-overlay :global(g.edge) { pointer-events: stroke; }
  .viewport { position: absolute; inset: 0; transform-origin: 0 0; }
</style>
