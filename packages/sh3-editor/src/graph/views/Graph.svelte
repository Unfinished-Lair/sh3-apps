<script lang="ts">
  import GraphNode from './GraphNode.svelte';
  import GraphEdge from './GraphEdge.svelte';
  import GraphPalette from './GraphPalette.svelte';
  import GraphToolbar from './GraphToolbar.svelte';
  import type { GraphState, NodeState, EdgeState, PortDefinition } from '../state/types';
  import type { GraphDomain, NodeVisuals, NodeTemplate } from '../domain/types';
  import type { HistoryController } from '../../types';
  import type { GraphAssetNode, GraphAssetPort } from '../asset/types';
  import {
    makeMoveNodeCommand, makeAddEdgeCommand, makeAddNodeCommand,
  } from '../history/commands';
  import { effectivePorts } from '../domain/effective-ports';
  import { resolvePortColor } from './port-color';
  import { decideConnect } from './connect-resolution';
  import { setActiveGraph, clearActiveGraphIf, type ActiveGraphRef } from '../active';
  import { clampZoom, clientToGraph, fitToContent, type Viewport } from './viewport';
  import {
    getEditorPrefs, subscribeEditorPrefs, type GridStyle,
  } from '../../settings/editor-prefs';
  import { sh3 } from 'sh3-core';

  interface Props {
    state: GraphState;
    domain: GraphDomain;
    history: HistoryController;
    onSelectionChange?: (ids: string[]) => void;
    onAssetChanged?: () => void;
    /** Default true — toolbar's "Show node picker" button. */
    showNodePicker?: boolean;
  }
  const props: Props = $props();

  function visualsFor(n: NodeState): NodeVisuals {
    return props.domain.getNodeVisuals(n.type);
  }

  // Endpoint resolution: measure the actual rendered .port-marker rect
  // post-render and cache it in graph coords. Authoritative over any math
  // model (header height, port row height, font-size). Falls back to a
  // math approximation only for the first frame before measurement runs.
  let portCenters = $state(new Map<string, { x: number; y: number }>());

  function fallbackEndpoint(node: NodeState, portShortId: string, side: 'output' | 'input') {
    const port = node.ports.find((p) => p.shortId === portShortId);
    if (!port) return { x: node.position.x, y: node.position.y };
    const list = node.ports.filter((p) => p.direction === side);
    const idx = list.indexOf(port);
    const y = node.position.y + 26 + 8 + idx * 22 + 11;
    const x = side === 'output' ? node.position.x + node.width + 5 : node.position.x - 5;
    return { x, y };
  }

  function srcPoint(e: EdgeState) {
    void props.state.revision;
    const measured = portCenters.get(`${e.sourceNodeId}:${e.sourcePortId}`);
    if (measured) return measured;
    const n = props.state.nodes.get(e.sourceNodeId);
    return n ? fallbackEndpoint(n, e.sourcePortId, 'output') : { x: 0, y: 0 };
  }
  function tgtPoint(e: EdgeState) {
    void props.state.revision;
    const measured = portCenters.get(`${e.targetNodeId}:${e.targetPortId}`);
    if (measured) return measured;
    const n = props.state.nodes.get(e.targetNodeId);
    return n ? fallbackEndpoint(n, e.targetPortId, 'input') : { x: 0, y: 0 };
  }

  // Measure rendered marker positions after each DOM update.
  $effect(() => {
    void props.state.revision;
    void viewport.x; void viewport.y; void viewport.zoom;
    // Defer to next microtask so node DOM has flushed before we measure.
    queueMicrotask(() => {
      if (!canvasEl) return;
      const canvasRect = canvasEl.getBoundingClientRect();
      const next = new Map<string, { x: number; y: number }>();
      const nodeEls = canvasEl.querySelectorAll<HTMLElement>('.graph-node[data-node-id]');
      for (const nodeEl of nodeEls) {
        const nodeId = nodeEl.getAttribute('data-node-id');
        if (!nodeId) continue;
        const portEls = nodeEl.querySelectorAll<HTMLElement>('.port[data-port-id]');
        for (const portEl of portEls) {
          const portId = portEl.getAttribute('data-port-id');
          const marker = portEl.querySelector<HTMLElement>('.port-marker');
          if (!portId || !marker) continue;
          const r = marker.getBoundingClientRect();
          const cx = r.left + r.width / 2 - canvasRect.left;
          const cy = r.top + r.height / 2 - canvasRect.top;
          // Convert screen → graph coords (inverse of .viewport transform).
          const gx = (cx - viewport.x) / viewport.zoom;
          const gy = (cy - viewport.y) / viewport.zoom;
          next.set(`${nodeId}:${portId}`, { x: gx, y: gy });
        }
      }
      portCenters = next;
    });
  });

  function isSelected(id: string): boolean {
    void props.state.revision;
    return props.state.selection.has(id);
  }

  function edgeColor(e: EdgeState): string {
    void props.state.revision;
    const n = props.state.nodes.get(e.sourceNodeId);
    if (!n) return '#888';
    const p = n.ports.find((pp) => pp.shortId === e.sourcePortId);
    if (!p?.dataType) return '#888';
    return resolvePortColor(props.domain, visualsFor(n), p.dataType) ?? '#888';
  }

  function portColorFor(node: NodeState, p: PortDefinition): string | null {
    void props.state.revision;
    return resolvePortColor(props.domain, visualsFor(node), p.dataType);
  }

  function selectOne(id: string, additive: boolean) {
    if (additive) {
      if (props.state.selection.has(id)) props.state.selection.delete(id);
      else props.state.selection.add(id);
    } else {
      props.state.selection.clear();
      props.state.selection.add(id);
    }
    props.state.revision++;
    props.onSelectionChange?.(Array.from(props.state.selection));
  }

  function clearSelection() {
    if (props.state.selection.size === 0) return;
    props.state.selection.clear();
    props.state.revision++;
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
    const dx = (ev.clientX - dragState.start.x) / viewport.zoom;
    const dy = (ev.clientY - dragState.start.y) / viewport.zoom;
    props.state.nodes.set(dragState.nodeId, {
      ...n,
      position: { x: dragState.origin.x + dx, y: dragState.origin.y + dy },
    });
    props.state.revision++;
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
      if (canvasEl) {
        const rect = canvasEl.getBoundingClientRect();
        edgeDrag.cursor = clientToGraph({ x: ev.clientX, y: ev.clientY }, rect, viewport);
      }
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

  function onPortPointerUp(_node: NodeState, _port: PortDefinition, ev: PointerEvent) {
    if (!edgeDrag) return;
    ev.stopPropagation();
    const src = edgeDrag.source;
    edgeDrag = null;

    // The source port captured the pointer in onPortPointerDown, so this
    // handler fires on the source — not on whatever port the user dropped
    // onto. Resolve the actual drop target by hit-testing the DOM.
    const dropEl = document.elementFromPoint(ev.clientX, ev.clientY);
    const portEl = dropEl?.closest('.port[data-port-id]') as HTMLElement | null;
    if (!portEl) return;
    const isInputPort = portEl.classList.contains('input');
    if (!isInputPort) return;
    const targetPortId = portEl.dataset.portId ?? '';
    const nodeEl = portEl.closest('.graph-node[data-node-id]') as HTMLElement | null;
    const targetNodeId = nodeEl?.dataset.nodeId ?? '';
    if (!targetNodeId || !targetPortId) return;

    const targetNode = props.state.nodes.get(targetNodeId);
    if (!targetNode) return;
    const targetPort = targetNode.ports.find((p) => p.shortId === targetPortId);
    if (!targetPort) return;

    if (props.domain.edgeSemantics === 'oriented' && src.direction !== 'output') return;
    if (src.nodeId === targetNodeId) return;
    const decision = decideConnect(props.domain,
      { nodeId: src.nodeId, portId: src.portId, direction: src.direction, dataType: src.dataType },
      { nodeId: targetNodeId, portId: targetPortId, direction: targetPort.direction, dataType: targetPort.dataType },
    );
    if (decision.kind === 'reject') return;

    const id = `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const cmd = makeAddEdgeCommand(props.state, {
      id,
      sourceNodeId: src.nodeId,
      sourcePortId: src.portId,
      targetNodeId,
      targetPortId,
      ...(decision.adapter ? { adapter: decision.adapter } : {}),
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

  // Mirror grid-style pref reactively so every open graph re-renders on edit.
  let gridStyle: GridStyle = $state(getEditorPrefs().gridStyle);
  $effect(() => {
    const off = subscribeEditorPrefs((p) => { gridStyle = p.gridStyle; });
    return off;
  });

  const GRID_BASE_PX = 20;
  const gridBackgroundImage = $derived.by(() => {
    const color = 'var(--sh3-grid, #2a2a2a)';
    switch (gridStyle) {
      case 'dots':
        return `radial-gradient(circle, ${color} 0 1px, transparent 1.5px)`;
      case 'none':
        return 'none';
      case 'cells':
      default:
        return [
          `linear-gradient(${color} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        ].join(', ');
    }
  });
  const gridSizePx = $derived(GRID_BASE_PX * viewport.zoom);

  const PAN_THRESHOLD_PX = 4;
  const DRAG_MIME = 'application/sh3-editor.node-template';

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
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const g = clientToGraph({ x: ev.clientX, y: ev.clientY }, rect, viewport);
    paletteDropAtTimestamp = Date.now();
    if (props.domain.useNodePalette) {
      // Keep palette anchor in screen-pixel space for layout (palette is outside .viewport),
      // but stash the graph-space drop point for onPalettePick.
      palette = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
      paletteDropAt = g;
    } else {
      addFreeformAt(g);
    }
  }

  let paletteDropAt: { x: number; y: number } | null = $state(null);
  let paletteDropAtTimestamp = $state(0);

  function addFreeformAt(g: { x: number; y: number }) {
    const id = `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const node: GraphAssetNode = {
      id, type: '', position: { x: g.x, y: g.y },
      config: {}, ports: [],
    };
    const cmd = makeAddNodeCommand(props.state, props.domain, node);
    cmd.apply();
    props.history.push(cmd);
    props.onAssetChanged?.();
  }

  const RECENT_DROP_WINDOW_MS = 5000;

  function viewportGraphCenter(): { x: number; y: number } {
    if (!canvasEl) return { x: 0, y: 0 };
    const cx = canvasEl.clientWidth / 2;
    const cy = canvasEl.clientHeight / 2;
    return {
      x: (cx - viewport.x) / viewport.zoom,
      y: (cy - viewport.y) / viewport.zoom,
    };
  }

  function getRecentDrop(): { x: number; y: number } | null {
    if (!paletteDropAt) return null;
    if (Date.now() - paletteDropAtTimestamp > RECENT_DROP_WINDOW_MS) return null;
    return paletteDropAt;
  }

  function insertNodeFromTemplate(
    templateType: string,
    at?: { x: number; y: number },
  ): void {
    if (props.state.readonly) return;
    const tpl = props.domain.getTemplates().find((t) => t.type === templateType);
    if (!tpl) return;
    const drop = at ?? getRecentDrop() ?? viewportGraphCenter();
    const id = `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const initialConfig = { ...tpl.defaultConfig };
    let resolved: GraphAssetPort[];
    try {
      resolved = effectivePorts(tpl, initialConfig);
      if (!Array.isArray(resolved)) throw new Error('computePorts returned non-array');
    } catch (err) {
      console.warn('computePorts threw at instantiation; falling back to static ports', err);
      resolved = tpl.ports;
    }
    const ports: GraphAssetPort[] = resolved.map((p) => ({ ...p, id: `${id}_${p.id}` }));
    const node: GraphAssetNode = {
      id, type: tpl.type,
      position: { ...drop },
      config: initialConfig,
      ports,
    };
    const cmd = makeAddNodeCommand(props.state, props.domain, node);
    cmd.apply();
    props.history.push(cmd);
    props.onAssetChanged?.();
    props.state.selection.clear();
    props.state.selection.add(id);
    props.state.revision++;
    props.onSelectionChange?.([id]);
  }

  function onPalettePick(t: NodeTemplate) {
    const drop = paletteDropAt;
    if (!drop) return;
    insertNodeFromTemplate(t.type, drop);
    palette = null;
    paletteDropAt = null;
  }

  // Reading state.revision (a tracked $state field bumped by every
  // mutation) is the single subscription point for graph-state changes.
  // The data layer uses plain Map/Set — no svelte/reactivity dependency.
  const nodesArr = $derived.by(() => {
    void props.state.revision;
    return Array.from(props.state.nodes.values());
  });
  const edgesArr = $derived.by(() => {
    void props.state.revision;
    return Array.from(props.state.edges.values());
  });
  const oriented = $derived(props.domain.edgeSemantics === 'oriented');

  const ZOOM_STEP = 1.2;

  function applyZoom(newZoom: number, focal?: { x: number; y: number }) {
    const z = clampZoom(newZoom);
    const f = focal ?? (canvasEl
      ? { x: canvasEl.clientWidth / 2, y: canvasEl.clientHeight / 2 }
      : { x: 0, y: 0 });
    const gx = (f.x - viewport.x) / viewport.zoom;
    const gy = (f.y - viewport.y) / viewport.zoom;
    viewport = { x: f.x - gx * z, y: f.y - gy * z, zoom: z };
  }

  function zoomIn(focal?: { x: number; y: number })  { applyZoom(viewport.zoom * ZOOM_STEP, focal); }
  function zoomOut(focal?: { x: number; y: number }) { applyZoom(viewport.zoom / ZOOM_STEP, focal); }
  function zoomReset() { applyZoom(1); }
  function doFitContent() {
    if (!canvasEl) return;
    const vp = fitToContent(
      Array.from(props.state.nodes.values()),
      { w: canvasEl.clientWidth, h: canvasEl.clientHeight },
    );
    viewport = vp;
  }
  function dismissPalette() { palette = null; paletteDropAt = null; }

  const PICKER_VIEW_ID = 'sh3-editor:graph-node-picker';

  function floatHostsPicker(content: unknown): boolean {
    // Non-dismissable floats wrap their view in a TabsNode (single tab) so
    // it can be dragged into the docked tree; dismissable floats use a bare
    // SlotNode. We check both so toggling stays correct either way.
    if (!content || typeof content !== 'object') return false;
    const c = content as { type?: string; viewId?: string;
                          tabs?: { viewId?: string }[] };
    if (c.type === 'slot' && c.viewId === PICKER_VIEW_ID) return true;
    if (c.type === 'tabs' && Array.isArray(c.tabs)) {
      return c.tabs.some((t) => t.viewId === PICKER_VIEW_ID);
    }
    return false;
  }

  function openNodePicker(): void {
    const existing = sh3.float.list().find((f) => floatHostsPicker(f.content));
    if (existing) {
      sh3.float.focus(existing.id);
      return;
    }
    sh3.float.open(PICKER_VIEW_ID, {
      title: 'Nodes',
      size: { w: 280, h: 420 },
    });
  }

  // Active-graph wiring. Keyboard shortcuts (Delete, Mod+Z/Y, Mod+Shift+Z,
  // viewport ops, Escape) are registered as SH3 actions in shard.ts with
  // scope 'focus:sh3-editor:graph'; their handlers read getActiveGraph() to
  // find the focused instance. We publish ourselves as active on focusin
  // and clear on unmount.
  const activeRef: ActiveGraphRef = {
    get state() { return props.state; },
    get domain() { return props.domain; },
    get history() { return props.history; },
    onAssetChanged: () => props.onAssetChanged?.(),
    onSelectionChange: (ids) => props.onSelectionChange?.(ids),
    zoomIn: (focal) => zoomIn(focal),
    zoomOut: (focal) => zoomOut(focal),
    zoomReset: () => zoomReset(),
    fitContent: () => doFitContent(),
    dismissPalette: () => dismissPalette(),
    insertNodeFromTemplate: (type, at) => insertNodeFromTemplate(type, at),
    getRecentDrop,
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

  function onCanvasDragOver(ev: DragEvent) {
    if (props.state.readonly) return;
    if (!ev.dataTransfer) return;
    // The MIME presence check is unreliable across browsers during dragover
    // (some hide the data until drop). Accept any drag — the drop handler
    // re-validates and no-ops if the payload is wrong.
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'copy';
  }

  function onCanvasDrop(ev: DragEvent) {
    if (props.state.readonly) return;
    if (!ev.dataTransfer) return;
    const templateType = ev.dataTransfer.getData(DRAG_MIME);
    if (!templateType) return;
    ev.preventDefault();
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const g = clientToGraph({ x: ev.clientX, y: ev.clientY }, rect, viewport);
    insertNodeFromTemplate(templateType, g);
  }

  function onCanvasWheel(ev: WheelEvent) {
    if (!canvasEl) return;
    // Let wheel events inside the palette popup scroll its list natively.
    if (ev.target instanceof Element && ev.target.closest('.palette')) return;
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
     style:background-image={gridBackgroundImage}
     style:background-size="{gridSizePx}px {gridSizePx}px"
     style:background-position="{viewport.x}px {viewport.y}px"
     tabindex="0"
     onfocusin={onCanvasFocusIn}
     onpointerdowncapture={onCanvasPointerDownCapture}
     onpointerdown={onCanvasPointerDown}
     onpointermove={onCanvasPointerMove}
     onpointerup={onCanvasPointerUp}
     onpointercancel={onCanvasPointerUp}
     ondragover={onCanvasDragOver}
     ondrop={onCanvasDrop}
     onclick={(ev) => {
       if (ev.target === ev.currentTarget) {
         clearSelection();
         if (palette) {
           palette = null;
           paletteDropAt = null;
         } else {
           onCanvasEmptyClick(ev);
         }
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
          selected={isSelected(e.id)}
          adapter={e.adapter}
          onClick={(ev) => { ev.stopPropagation(); selectOne(e.id, ev.ctrlKey || ev.metaKey); }}
        />
      {/each}
      {#if edgeDrag}
        {@const sourceNode = props.state.nodes.get(edgeDrag.source.nodeId)}
        {#if sourceNode}
          {@const measured = portCenters.get(`${edgeDrag.source.nodeId}:${edgeDrag.source.portId}`)}
          {@const start = measured ?? fallbackEndpoint(sourceNode, edgeDrag.source.portId,
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
        selected={isSelected(n.id)}
        portColor={(p) => portColorFor(n, p)}
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
  <GraphToolbar
    zoom={viewport.zoom}
    showNodePicker={props.showNodePicker ?? true}
    onZoomIn={() => zoomIn()}
    onZoomOut={() => zoomOut()}
    onZoomReset={() => zoomReset()}
    onFit={() => doFitContent()}
    onOpenNodePicker={openNodePicker}
  />
</div>

<style>
  .graph-canvas { position: relative; width: 100%; height: 100%; overflow: hidden;
                  background-color: var(--sh3-surface-0, #161616);
                  outline: none; }
  /* overflow: visible overrides the SVG UA default of overflow:hidden, which
     would clip edge paths whose endpoints fall outside the SVG's intrinsic
     user-coordinate viewport (i.e. graph coords <0 or beyond canvas size).
     The visible-frame clip is still enforced by .graph-canvas one level up. */
  .edge-overlay { position: absolute; inset: 0; width: 100%; height: 100%;
                  overflow: visible; pointer-events: none; }
  .edge-overlay :global(g.edge) { pointer-events: stroke; }
  /* pointer-events:none lets clicks/drags inside the viewport's transformed
     bounds fall through to .graph-canvas (for pan + empty-click + palette
     dismiss). Children (.graph-node, g.edge stroke) opt back in via their
     own pointer-events. Without this, a panned viewport "swallows" clicks
     in any region the transformed div now covers, breaking pan, empty-click
     and node interaction in those zones. */
  .viewport { position: absolute; inset: 0; transform-origin: 0 0; pointer-events: none; }
</style>
