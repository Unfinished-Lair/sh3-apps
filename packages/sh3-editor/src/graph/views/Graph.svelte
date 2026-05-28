<script lang="ts">
  import GraphNode from './GraphNode.svelte';
  import GraphEdge from './GraphEdge.svelte';
  import GraphToolbar from './GraphToolbar.svelte';
  import GraphQuickAccessToolbar from './GraphQuickAccessToolbar.svelte';
  import GraphBlock from './GraphBlock.svelte';
  import { resolveActiveEntries } from './quick-access-resolution';
  import { computeMembership, isContained, type BlockMembershipCache } from './block-membership';
  import { cubicEdgePath } from './edge-path';
  import type { GraphState, NodeState, EdgeState, PortDefinition, BlockState, BlockId } from '../state/types';
  import type { GraphDomain, NodeVisuals } from '../domain/types';
  import type { HistoryController } from '../../types';
  import type { GraphAssetNode, GraphAssetPort, GraphAssetBlock } from '../asset/types';
  import {
    makeMoveNodesCommand, makeAddEdgeCommand, makeAddNodeCommand,
    makeResizeNodeCommand,
    makeAddBlockCommand, makeMoveBlockCommand, makeResizeBlockCommand,
  } from '../history/commands';
  import { effectivePorts } from '../domain/effective-ports';
  import { resolvePortColor } from './port-color';
  import { decideConnect } from './connect-resolution';
  import { setActiveGraph, clearActiveGraphIf, type ActiveGraphRef } from '../active';
  import { clampZoom, clientToGraph, fitToContent, type Viewport } from './viewport';
  import { normalizeRect, nodesInRect, type Rect } from './marquee';
  import {
    getEditorPrefs, subscribeEditorPrefs, setDomainQuickAccess, type GridStyle,
  } from '../../settings/editor-prefs';
  import { openHelpHub } from '../../help/openHub';
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

  // ---------- Blocks ----------
  // Membership cache: recomputed on triggers (node insert/remove, node move,
  // node resize, block add/remove, block resize). Block move preserves
  // membership — members translate with the block — so no recompute on move.
  let membershipCache = $state<BlockMembershipCache>(computeMembership(props.state));
  function refreshMembership() {
    membershipCache = computeMembership(props.state);
  }

  let blockDrag: {
    pointerId: number;
    blockId: BlockId;
    anchor: { x: number; y: number };
    blockOrigin: { x: number; y: number };
    carriedOrigins: Map<string, { x: number; y: number }>;
    active: boolean;
    startClient: { x: number; y: number };
  } | null = $state(null);

  let blockResize: {
    blockId: BlockId;
    pointerId: number;
    edge: 'e' | 's' | 'se';
    anchor: { x: number; y: number };
    origin: { w: number; h: number };
  } | null = $state(null);

  function onBlockPointerDown(block: BlockState, ev: PointerEvent) {
    if (props.state.readonly) return;
    ev.stopPropagation();
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    const carried = new Map<string, { x: number; y: number }>();
    const memberIds = membershipCache.members.get(block.id) ?? new Set<string>();
    for (const id of memberIds) {
      const n = props.state.nodes.get(id);
      if (n) carried.set(id, { ...n.position });
    }
    // Include nested blocks' members (single recursion level — design §4.6).
    for (const nestedBlock of props.state.blocks.values()) {
      if (nestedBlock.id === block.id) continue;
      if (isContained(
        { x: block.position.x, y: block.position.y, w: block.width, h: block.height },
        { x: nestedBlock.position.x, y: nestedBlock.position.y, w: nestedBlock.width, h: nestedBlock.height },
      )) {
        const nestedMembers = membershipCache.members.get(nestedBlock.id) ?? new Set<string>();
        for (const id of nestedMembers) {
          const n = props.state.nodes.get(id);
          if (n && !carried.has(id)) carried.set(id, { ...n.position });
        }
      }
    }
    blockDrag = {
      pointerId: ev.pointerId,
      blockId: block.id,
      anchor: { x: ev.clientX, y: ev.clientY },
      blockOrigin: { ...block.position },
      carriedOrigins: carried,
      active: false,
      startClient: { x: ev.clientX, y: ev.clientY },
    };
  }

  function onBlockPointerMove(ev: PointerEvent) {
    if (!blockDrag || blockDrag.pointerId !== ev.pointerId) return;
    const dx = ev.clientX - blockDrag.startClient.x;
    const dy = ev.clientY - blockDrag.startClient.y;
    if (!blockDrag.active && Math.abs(dx) + Math.abs(dy) <= PAN_THRESHOLD_PX) return;
    blockDrag.active = true;
    const dxG = (ev.clientX - blockDrag.anchor.x) / viewport.zoom;
    const dyG = (ev.clientY - blockDrag.anchor.y) / viewport.zoom;
    const b = props.state.blocks.get(blockDrag.blockId);
    if (b) {
      props.state.blocks.set(blockDrag.blockId, {
        ...b,
        position: { x: blockDrag.blockOrigin.x + dxG, y: blockDrag.blockOrigin.y + dyG },
      });
    }
    for (const [id, origin] of blockDrag.carriedOrigins) {
      const n = props.state.nodes.get(id);
      if (!n) continue;
      props.state.nodes.set(id, { ...n, position: { x: origin.x + dxG, y: origin.y + dyG } });
    }
    props.state.revision++;
  }

  function onBlockPointerUp(ev: PointerEvent) {
    if (!blockDrag) return;
    if (blockDrag.pointerId !== ev.pointerId) return;
    const wasActive = blockDrag.active;
    const bd = blockDrag;
    blockDrag = null;
    if (wasActive) {
      const b = props.state.blocks.get(bd.blockId);
      if (!b) return;
      const carriedNodes = Array.from(bd.carriedOrigins.entries()).map(([id, before]) => {
        const n = props.state.nodes.get(id);
        return { id, before, after: n ? { ...n.position } : before };
      });
      const cmd = makeMoveBlockCommand(props.state, {
        blockId: bd.blockId,
        before: bd.blockOrigin,
        after: { ...b.position },
        carriedNodes,
      });
      props.history.push(cmd);
      props.onAssetChanged?.();
      suppressNextNodeSelectClick = true;
    }
    // No-drag click: handled by GraphBlock's onclick which calls selectOne via onBlockLabelClick.
  }

  function onBlockLabelClick(block: BlockState, ev: MouseEvent) {
    ev.stopPropagation();
    if (suppressNextNodeSelectClick) { suppressNextNodeSelectClick = false; return; }
    selectOne(block.id, ev.shiftKey);
  }

  function onBlockResizePointerDown(block: BlockState, edge: 'e' | 's' | 'se', ev: PointerEvent) {
    if (props.state.readonly) return;
    ev.stopPropagation();
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    blockResize = {
      blockId: block.id, pointerId: ev.pointerId, edge,
      anchor: { x: ev.clientX, y: ev.clientY },
      origin: { w: block.width, h: block.height },
    };
  }

  function onBlockResizePointerMove(ev: PointerEvent) {
    if (!blockResize || blockResize.pointerId !== ev.pointerId) return;
    const b = props.state.blocks.get(blockResize.blockId);
    if (!b) return;
    const dx = (ev.clientX - blockResize.anchor.x) / viewport.zoom;
    const dy = (ev.clientY - blockResize.anchor.y) / viewport.zoom;
    const MIN_W = 80, MIN_H = 40;
    const nextW = blockResize.edge === 's' ? b.width  : Math.max(MIN_W, blockResize.origin.w + dx);
    const nextH = blockResize.edge === 'e' ? b.height : Math.max(MIN_H, blockResize.origin.h + dy);
    props.state.blocks.set(blockResize.blockId, { ...b, width: nextW, height: nextH });
    props.state.revision++;
  }

  function onBlockResizePointerUp(ev: PointerEvent) {
    if (!blockResize || blockResize.pointerId !== ev.pointerId) return;
    const b = props.state.blocks.get(blockResize.blockId);
    if (b && (b.width !== blockResize.origin.w || b.height !== blockResize.origin.h)) {
      const cmd = makeResizeBlockCommand(props.state, {
        blockId: blockResize.blockId,
        before: { w: blockResize.origin.w, h: blockResize.origin.h },
        after:  { w: b.width, h: b.height },
      });
      props.history.push(cmd);
      props.onAssetChanged?.();
      refreshMembership();
    }
    blockResize = null;
  }

  type NodeId = string;
  let dragState: {
    pointerId: number;
    anchor: { x: number; y: number };
    origins: Map<NodeId, { x: number; y: number }>;
  } | null = $state(null);

  let resizeState: {
    nodeId: NodeId;
    pointerId: number;
    edge: 'e' | 's' | 'se';
    anchor: { x: number; y: number };
    origin: { w: number; h: number };
    constraints: { minW: number; minH: number; maxW: number; maxH: number };
  } | null = $state(null);

  function onResizePointerDown(node: NodeState, edge: 'e' | 's' | 'se', ev: PointerEvent) {
    if (props.state.readonly) return;
    ev.stopPropagation();
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    const visuals = props.domain.getNodeVisuals(node.type);
    const r = visuals.resize ?? {};
    resizeState = {
      nodeId: node.id,
      pointerId: ev.pointerId,
      edge,
      anchor: { x: ev.clientX, y: ev.clientY },
      origin: { w: node.width, h: node.height },
      constraints: {
        minW: r.minW ?? 40,
        minH: r.minH ?? 24,
        maxW: r.maxW ?? Infinity,
        maxH: r.maxH ?? Infinity,
      },
    };
  }

  function onResizePointerMove(ev: PointerEvent) {
    if (!resizeState || resizeState.pointerId !== ev.pointerId) return;
    const dx = (ev.clientX - resizeState.anchor.x) / viewport.zoom;
    const dy = (ev.clientY - resizeState.anchor.y) / viewport.zoom;
    const { minW, minH, maxW, maxH } = resizeState.constraints;
    const n = props.state.nodes.get(resizeState.nodeId);
    if (!n) return;
    const nextW = resizeState.edge === 's'
        ? n.width
        : Math.max(minW, Math.min(maxW, resizeState.origin.w + dx));
    const nextH = resizeState.edge === 'e'
        ? n.height
        : Math.max(minH, Math.min(maxH, resizeState.origin.h + dy));
    props.state.nodes.set(resizeState.nodeId, { ...n, width: nextW, height: nextH });
    props.state.revision++;
  }

  function onResizePointerUp(_ev: PointerEvent) {
    if (!resizeState) return;
    const n = props.state.nodes.get(resizeState.nodeId);
    if (n && (n.width !== resizeState.origin.w || n.height !== resizeState.origin.h)) {
      const cmd = makeResizeNodeCommand(
        props.state, resizeState.nodeId,
        { w: resizeState.origin.w, h: resizeState.origin.h },
        { w: n.width, h: n.height },
      );
      props.history.push(cmd);
      props.onAssetChanged?.();
      suppressNextNodeSelectClick = true;
      refreshMembership();
    }
    resizeState = null;
  }

  function onHeaderPointerDown(node: NodeState, ev: PointerEvent) {
    if (props.state.readonly) return;
    ev.stopPropagation();
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);

    const origins = new Map<NodeId, { x: number; y: number }>();
    const grabbedInSelection = props.state.selection.has(node.id);
    const selSize = props.state.selection.size;

    if (grabbedInSelection && selSize > 1) {
      // Drag the whole selection; selection unchanged.
      for (const id of props.state.selection) {
        const n = props.state.nodes.get(id);
        if (n) origins.set(id, { ...n.position });
      }
    } else if (grabbedInSelection && selSize === 1) {
      // Grabbed node is the sole selected item; drag it, no selection mutation.
      origins.set(node.id, { ...node.position });
    } else {
      // Grabbed node is not in the selection; replace selection with it.
      props.state.selection.clear();
      props.state.selection.add(node.id);
      props.state.revision++;
      props.onSelectionChange?.([node.id]);
      origins.set(node.id, { ...node.position });
    }

    dragState = {
      pointerId: ev.pointerId,
      anchor: { x: ev.clientX, y: ev.clientY },
      origins,
    };
  }

  function onHeaderPointerMove(ev: PointerEvent) {
    if (!dragState) return;
    const dx = (ev.clientX - dragState.anchor.x) / viewport.zoom;
    const dy = (ev.clientY - dragState.anchor.y) / viewport.zoom;
    for (const [id, origin] of dragState.origins) {
      const n = props.state.nodes.get(id);
      if (!n) continue;
      props.state.nodes.set(id, {
        ...n,
        position: { x: origin.x + dx, y: origin.y + dy },
      });
    }
    props.state.revision++;
  }

  function onHeaderPointerUp(_ev: PointerEvent) {
    if (!dragState) return;
    const moves: { id: NodeId; before: { x: number; y: number }; after: { x: number; y: number } }[] = [];
    for (const [id, before] of dragState.origins) {
      const n = props.state.nodes.get(id);
      if (!n) continue;
      if (n.position.x !== before.x || n.position.y !== before.y) {
        moves.push({ id, before: { ...before }, after: { ...n.position } });
      }
    }
    if (moves.length > 0) {
      const cmd = makeMoveNodesCommand(props.state, moves);
      props.history.push(cmd);
      props.onAssetChanged?.();
      // The synthetic click that follows pointerup would otherwise fire
      // GraphNode.onSelectClick and collapse a multi-selection to just the
      // grabbed node. Swallow it.
      suppressNextNodeSelectClick = true;
      // Lone-node move can change which block contains it.
      refreshMembership();
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
    onResizePointerMove(ev);
    onBlockPointerMove(ev);
    onBlockResizePointerMove(ev);
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
    if (marqueeState && marqueeState.pointerId === ev.pointerId && canvasEl) {
      const rect = canvasEl.getBoundingClientRect();
      marqueeState.currentG = clientToGraph({ x: ev.clientX, y: ev.clientY }, rect, viewport);
      const dx = (marqueeState.currentG.x - marqueeState.startG.x) * viewport.zoom;
      const dy = (marqueeState.currentG.y - marqueeState.startG.y) * viewport.zoom;
      if (!marqueeState.active && Math.abs(dx) + Math.abs(dy) > PAN_THRESHOLD_PX) {
        marqueeState.active = true;
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
    onResizePointerUp(ev);
    onBlockPointerUp(ev);
    onBlockResizePointerUp(ev);
    edgeDrag = null;
    if (panState && panState.pointerId === ev.pointerId) {
      const wasPanning = panState.panning;
      panState = null;
      if (wasPanning) {
        suppressNextEmptyClick = true;
        suppressNextContextMenu = true;
      }
    }
    if (marqueeState && marqueeState.pointerId === ev.pointerId) {
      const wasActive = marqueeState.active;
      const shift = marqueeState.shift;
      const rect = normalizeRect(marqueeState.startG, marqueeState.currentG);
      marqueeState = null;
      if (wasActive) {
        const hits = nodesInRect(
          Array.from(props.state.nodes.values()).map((n) => ({
            id: n.id, position: n.position, width: n.width, height: n.height,
          })),
          rect,
        );
        const blockHits = nodesInRect(
          Array.from(props.state.blocks.values()).map((b) => ({
            id: b.id, position: b.position, width: b.width, height: b.height,
          })),
          rect,
        );
        if (!shift) props.state.selection.clear();
        for (const id of hits) props.state.selection.add(id);
        for (const id of blockHits) props.state.selection.add(id);
        props.state.revision++;
        props.onSelectionChange?.(Array.from(props.state.selection));
        // Marquee swallowed the click — don't let onCanvasEmptyClick fire.
        suppressNextEmptyClick = true;
      }
    }
  }

  let viewport: Viewport = $state({ x: 0, y: 0, zoom: 1 });
  let canvasEl: HTMLDivElement | null = $state(null);

  // Mirror grid-style + quickAccess prefs reactively so every open graph
  // re-renders on edit.
  let gridStyle: GridStyle = $state(getEditorPrefs().gridStyle);
  let editorPrefs = $state(getEditorPrefs());
  $effect(() => {
    const off = subscribeEditorPrefs((p) => {
      gridStyle = p.gridStyle;
      editorPrefs = p;
    });
    return off;
  });

  const quickAccessEntries = $derived.by(() =>
    resolveActiveEntries(props.domain, editorPrefs),
  );
  const quickAccessVariantNames = $derived.by(() => {
    const saved = editorPrefs.quickAccess.domains[props.domain.id];
    if (!saved) return ['default'];
    return Object.keys(saved.variants);
  });
  const quickAccessActiveVariant = $derived.by(() => {
    const saved = editorPrefs.quickAccess.domains[props.domain.id];
    return saved?.active ?? 'default';
  });

  function onQuickAccessInsert(templateType: string) {
    insertNodeFromTemplate(templateType);
  }
  function onQuickAccessSwitchVariant(name: string) {
    const saved = editorPrefs.quickAccess.domains[props.domain.id];
    if (!saved) return;
    setDomainQuickAccess(props.domain.id, { ...saved, active: name });
  }
  function onQuickAccessOpenEditor() {
    openHelpHub({ focusTabId: 'sh3-editor:help-tab:quick-access' });
  }

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
  let suppressNextContextMenu = $state(false);
  let suppressNextNodeSelectClick = $state(false);

  let marqueeState: {
    pointerId: number;
    startG: { x: number; y: number };
    currentG: { x: number; y: number };
    shift: boolean;
    active: boolean;
  } | null = $state(null);

  // Live preview of which nodes the marquee would select. Recomputed each
  // pointermove via Svelte reactivity on marqueeState.currentG.
  const marqueePreviewIds = $derived.by(() => {
    void props.state.revision;
    if (!marqueeState || !marqueeState.active) return new Set<string>();
    const rect = normalizeRect(marqueeState.startG, marqueeState.currentG);
    return new Set(nodesInRect(
      Array.from(props.state.nodes.values()).map((n) => ({
        id: n.id, position: n.position, width: n.width, height: n.height,
      })),
      rect,
    ));
  });

  function onCanvasPointerDown(ev: PointerEvent) {
    if (ev.target !== ev.currentTarget) return;

    if (ev.button === 0) {
      (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
      if (canvasEl) {
        const rect = canvasEl.getBoundingClientRect();
        const g = clientToGraph({ x: ev.clientX, y: ev.clientY }, rect, viewport);
        marqueeState = {
          pointerId: ev.pointerId,
          startG: g,
          currentG: g,
          shift: ev.shiftKey,
          active: false,
        };
      }
      return;
    }

    if (ev.button === 2) {
      (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
      panState = {
        pointerId: ev.pointerId,
        startX: ev.clientX, startY: ev.clientY,
        originVx: viewport.x, originVy: viewport.y,
        panning: false,
      };
      return;
    }
  }

  function onCanvasEmptyClick(ev: MouseEvent) {
    if (suppressNextEmptyClick) { suppressNextEmptyClick = false; return; }
    if (props.state.readonly) return;
    if (ev.target !== ev.currentTarget) return;
    clearSelection();
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const g = clientToGraph({ x: ev.clientX, y: ev.clientY }, rect, viewport);
    paletteDropAtTimestamp = Date.now();
    paletteDropAt = g;
    if (props.domain.useNodePalette) {
      openPickerAt(ev.clientX, ev.clientY);
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
    refreshMembership();
  }

  function addBlockAt(graphPoint: { x: number; y: number }) {
    if (props.state.readonly) return;
    if (props.domain.allowBlocks === false) return;
    const id = `b_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const block: GraphAssetBlock = {
      id,
      position: { x: graphPoint.x - 120, y: graphPoint.y - 80 },
      width: 240, height: 160,
      color: '#446688', alpha: 0.20,
      label: 'Group', labelAnchor: 'top',
    };
    const cmd = makeAddBlockCommand(props.state, block);
    cmd.apply();
    props.history.push(cmd);
    props.onAssetChanged?.();
    props.state.selection.clear();
    props.state.selection.add(id);
    props.state.revision++;
    props.onSelectionChange?.([id]);
    refreshMembership();
  }

  function addBlockAtViewportCenter() {
    addBlockAt(viewportGraphCenter());
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
  const blocksArr = $derived.by(() => {
    void props.state.revision;
    return Array.from(props.state.blocks.values());
  });

  // Set of node ids being carried by an active block drag — for visual
  // preview on those nodes during the drag.
  const blockDragPreviewIds = $derived.by(() => {
    if (!blockDrag || !blockDrag.active) return new Set<string>();
    return new Set(blockDrag.carriedOrigins.keys());
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
  function dismissPalette() { paletteDropAt = null; }

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
    // Toolbar-opened picker: docked-style float (non-dismissable, draggable).
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

  function openPickerAt(clientX: number, clientY: number): void {
    // Empty-canvas picker: dismissable float, anchored to the canvas so the
    // frame portals into the same overlay host (e.g. when the graph view
    // itself lives inside another float). `autoClose` instructs the picker
    // view to close itself after a template is picked.
    const PICKER_W = 280;
    const PICKER_H = 360;
    const vw = typeof window !== 'undefined' ? window.innerWidth : Infinity;
    const vh = typeof window !== 'undefined' ? window.innerHeight : Infinity;
    const x = Math.max(0, Math.min(clientX, vw - PICKER_W));
    const y = Math.max(0, Math.min(clientY, vh - PICKER_H));
    sh3.float.open(PICKER_VIEW_ID, {
      size: { w: PICKER_W, h: PICKER_H },
      position: { x, y },
      dismissable: true,
      ...(canvasEl ? { anchor: canvasEl } : {}),
      props: { autoClose: true },
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
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const g = clientToGraph({ x: ev.clientX, y: ev.clientY }, rect, viewport);
    if (ev.dataTransfer.getData('application/sh3-editor.block')) {
      ev.preventDefault();
      addBlockAt(g);
      return;
    }
    const templateType = ev.dataTransfer.getData(DRAG_MIME);
    if (!templateType) return;
    ev.preventDefault();
    insertNodeFromTemplate(templateType, g);
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

  // Picker-reopen suppression. sh3-core's floatDismiss listener runs at
  // document+capture and synchronously closes the dismissable picker on
  // outside-click — by the time our canvas onpointerdown fires (bubble),
  // sh3.float.list() no longer reports the picker, so checking there is
  // too late. We install our own document+capture listener (registered
  // here at Graph mount, before any picker is ever opened) so it runs
  // before sh3-core's and observes the picker still in the list.
  $effect(() => {
    if (typeof document === 'undefined') return;
    const handler = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      if (!canvasEl) return;
      if (ev.target !== canvasEl) return;
      if (sh3.float.list().some((f) => floatHostsPicker(f.content))) {
        suppressNextEmptyClick = true;
      }
    };
    document.addEventListener('pointerdown', handler, true);
    return () => document.removeEventListener('pointerdown', handler, true);
  });

  // Right-button drag pan suppresses the contextmenu that would otherwise
  // open on right-button release. sh3-core's contextmenu listener is on
  // document+bubble and opens the SH3 action context menu — preventDefault
  // alone only suppresses the native OS menu, so we also stopPropagation
  // (capture phase) to keep the event from reaching that bubble listener.
  $effect(() => {
    if (typeof document === 'undefined') return;
    const handler = (ev: Event) => {
      if (!canvasEl) return;
      const t = ev.target as Node | null;
      if (!t || !canvasEl.contains(t)) return;
      const shouldSuppress =
        (panState && panState.panning) || suppressNextContextMenu;
      if (!shouldSuppress) return;
      if (suppressNextContextMenu) suppressNextContextMenu = false;
      ev.preventDefault();
      ev.stopPropagation();
    };
    document.addEventListener('contextmenu', handler, true);
    return () => document.removeEventListener('contextmenu', handler, true);
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
         onCanvasEmptyClick(ev);
       }
     }}>
  <div class="viewport"
       style:transform="translate({viewport.x}px, {viewport.y}px) scale({viewport.zoom})"
       style:transform-origin="0 0">
    {#each blocksArr as b (b.id)}
      <GraphBlock
        block={b}
        selected={isSelected(b.id)}
        onSelectClick={(ev) => onBlockLabelClick(b, ev)}
        onPointerDown={(ev) => onBlockPointerDown(b, ev)}
        onResizePointerDown={(edge, ev) => onBlockResizePointerDown(b, edge, ev)}
      />
    {/each}
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
          onClick={(ev) => { ev.stopPropagation(); selectOne(e.id, ev.shiftKey); }}
        />
      {/each}
      {#if edgeDrag}
        {@const sourceNode = props.state.nodes.get(edgeDrag.source.nodeId)}
        {#if sourceNode}
          {@const measured = portCenters.get(`${edgeDrag.source.nodeId}:${edgeDrag.source.portId}`)}
          {@const start = measured ?? fallbackEndpoint(sourceNode, edgeDrag.source.portId,
                                      edgeDrag.source.direction === 'output' ? 'output' : 'input')}
          {@const ghostPath = edgeDrag.source.direction === 'output'
                                ? cubicEdgePath(start, edgeDrag.cursor)
                                : cubicEdgePath(edgeDrag.cursor, start)}
          <path class="edge-ghost" stroke="var(--sh3-accent, #4a9eff)" fill="none" stroke-dasharray="4 3"
                d={ghostPath} />
        {/if}
      {/if}
    </svg>
    {#each nodesArr as n (n.id)}
      <GraphNode
        node={n}
        visuals={visualsFor(n)}
        selected={isSelected(n.id)}
        marqueePreview={marqueePreviewIds.has(n.id)}
        blockDragPreview={blockDragPreviewIds.has(n.id)}
        portColor={(p) => portColorFor(n, p)}
        state={props.state}
        domain={props.domain}
        history={props.history}
        onSelectClick={(ev) => {
          ev.stopPropagation();
          if (suppressNextNodeSelectClick) { suppressNextNodeSelectClick = false; return; }
          selectOne(n.id, ev.shiftKey);
        }}
        onHeaderPointerDown={(ev) => onHeaderPointerDown(n, ev)}
        onPortPointerDown={(p, ev) => onPortPointerDown(n, p, ev)}
        onPortPointerUp={(p, ev) => onPortPointerUp(n, p, ev)}
        onResizePointerDown={(edge, ev) => onResizePointerDown(n, edge, ev)}
      />
    {/each}
    {#if marqueeState && marqueeState.active}
      {@const r = normalizeRect(marqueeState.startG, marqueeState.currentG)}
      <svg class="marquee-overlay">
        <rect
          class="marquee"
          x={r.x} y={r.y} width={r.w} height={r.h}
          fill="var(--sh3-accent, #4a9eff)"
          fill-opacity="0.15"
          stroke="var(--sh3-accent, #4a9eff)"
          stroke-dasharray="4 3"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    {/if}
  </div>
  {#if !props.state.readonly}
    <GraphQuickAccessToolbar
      domain={props.domain}
      entries={quickAccessEntries}
      variantNames={quickAccessVariantNames}
      activeVariant={quickAccessActiveVariant}
      showAddBlock={props.domain.allowBlocks !== false}
      onInsert={onQuickAccessInsert}
      onSwitchVariant={onQuickAccessSwitchVariant}
      onOpenEditor={onQuickAccessOpenEditor}
      onAddBlock={addBlockAtViewportCenter}
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
  /* Marquee renders in its own overlay after the nodes in document order
     so it paints on top of them. Same pointer-events:none + overflow:visible
     contract as .edge-overlay. */
  .marquee-overlay { position: absolute; inset: 0; width: 100%; height: 100%;
                     overflow: visible; pointer-events: none; }
  /* pointer-events:none lets clicks/drags inside the viewport's transformed
     bounds fall through to .graph-canvas (for pan + empty-click + palette
     dismiss). Children (.graph-node, g.edge stroke) opt back in via their
     own pointer-events. Without this, a panned viewport "swallows" clicks
     in any region the transformed div now covers, breaking pan, empty-click
     and node interaction in those zones. */
  .viewport { position: absolute; inset: 0; transform-origin: 0 0; pointer-events: none; }
</style>
