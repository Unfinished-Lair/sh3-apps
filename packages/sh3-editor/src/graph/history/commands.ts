import type {
  GraphAsset, GraphAssetBlock, GraphAssetEdge, GraphAssetNode, GraphAssetPort,
} from '../asset/types';
import type { GraphDomain, NodeTemplate } from '../domain/types';
import { effectivePorts } from '../domain/effective-ports';
import type {
  BlockId, BlockState, EdgeState, GraphState, NodeId, NodeState, PortDefinition,
} from '../state/types';
import { graphAssetToState, graphStateToAsset, buildConfigFields } from '../state/bridge';

export type GraphCommandKind =
  | 'add-node'
  | 'add-many'
  | 'remove-node'
  | 'move-node'
  | 'move-nodes'
  | 'set-node-config'
  | 'add-edge'
  | 'remove-edge'
  | 'remove-selection'
  | 'replace-asset'
  | 'resize-node'
  | 'add-block'
  | 'remove-block'
  | 'move-block'
  | 'resize-block'
  | 'set-block-config';

export interface GraphCommand {
  apply(): void;
  revert(): void;
  meta?: { kind: GraphCommandKind; label?: string; timestamp?: number };
}

function shortPortId(nodeId: string, full: string): string {
  const p = `${nodeId}_`;
  return full.startsWith(p) ? full.slice(p.length) : full;
}

function buildNodeState(n: GraphAssetNode, dom: GraphDomain, connectedShortIds: Set<string>): NodeState {
  const visuals = dom.getNodeVisuals(n.type);
  const ports: PortDefinition[] = n.ports.map((p) => ({ ...p, shortId: shortPortId(n.id, p.id) }));
  const tmpl = dom.getTemplates().find((t) => t.type === n.type);
  const defaultW = visuals.defaultWidth  ?? dom.defaultNodeWidth;
  const defaultH = visuals.defaultHeight ?? dom.defaultNodeHeight;
  return {
    id: n.id,
    type: n.type,
    label: dom.resolveLabel(n.type, n.config),
    ports,
    config: { ...n.config },
    configFields: tmpl ? buildConfigFields(tmpl, n.config, connectedShortIds) : [],
    position: { ...n.position },
    width:  n.width  ?? defaultW,
    height: n.height ?? defaultH,
    defaultsForSerialization: { width: defaultW, height: defaultH },
  };
}

function recomputeNodeFields(state: GraphState, dom: GraphDomain, nodeId: NodeId): void {
  const n = state.nodes.get(nodeId);
  if (!n) return;
  const connected = new Set<string>();
  for (const e of state.edges.values()) {
    if (e.targetNodeId === nodeId) connected.add(e.targetPortId);
  }
  const tmpl = dom.getTemplates().find((t) => t.type === n.type);
  const configFields = tmpl ? buildConfigFields(tmpl, n.config, connected) : [];
  const label = dom.resolveLabel(n.type, n.config);
  state.nodes.set(nodeId, { ...n, configFields, label });
}

export function makeAddNodeCommand(state: GraphState, dom: GraphDomain, asset: GraphAssetNode): GraphCommand {
  return {
    meta: { kind: 'add-node' },
    apply() {
      state.nodes.set(asset.id, buildNodeState(asset, dom, new Set()));
      state.revision++;
    },
    revert() {
      state.nodes.delete(asset.id);
      state.selection.delete(asset.id);
      state.revision++;
    },
  };
}

export function makeAddManyCommand(
  state: GraphState, dom: GraphDomain,
  nodes: GraphAssetNode[], edges: GraphAssetEdge[],
): GraphCommand {
  return {
    meta: { kind: 'add-many' },
    apply() {
      for (const n of nodes) state.nodes.set(n.id, buildNodeState(n, dom, new Set()));
      for (const e of edges) {
        state.edges.set(e.id, {
          id: e.id,
          sourceNodeId: e.sourceNodeId,
          sourcePortId: shortPortId(e.sourceNodeId, e.sourcePortId),
          targetNodeId: e.targetNodeId,
          targetPortId: shortPortId(e.targetNodeId, e.targetPortId),
        });
      }
      for (const e of edges) recomputeNodeFields(state, dom, e.targetNodeId);
      state.revision++;
    },
    revert() {
      for (const e of edges) state.edges.delete(e.id);
      for (const n of nodes) {
        state.nodes.delete(n.id);
        state.selection.delete(n.id);
      }
      for (const e of edges) recomputeNodeFields(state, dom, e.targetNodeId);
      state.revision++;
    },
  };
}

export function makeRemoveNodeCommand(state: GraphState, dom: GraphDomain, nodeId: NodeId): GraphCommand {
  let removedNode: NodeState | null = null;
  let removedEdges: EdgeState[] = [];
  return {
    meta: { kind: 'remove-node' },
    apply() {
      const n = state.nodes.get(nodeId);
      if (!n) return;
      removedNode = n;
      removedEdges = [];
      for (const [id, e] of state.edges) {
        if (e.sourceNodeId === nodeId || e.targetNodeId === nodeId) {
          removedEdges.push(e);
          state.edges.delete(id);
        }
      }
      state.nodes.delete(nodeId);
      state.selection.delete(nodeId);
      for (const e of removedEdges) recomputeNodeFields(state, dom, e.targetNodeId);
      state.revision++;
    },
    revert() {
      if (!removedNode) return;
      state.nodes.set(removedNode.id, removedNode);
      for (const e of removedEdges) state.edges.set(e.id, e);
      for (const e of removedEdges) recomputeNodeFields(state, dom, e.targetNodeId);
      state.revision++;
    },
  };
}

export function makeMoveNodeCommand(
  state: GraphState, nodeId: NodeId,
  before: { x: number; y: number }, after: { x: number; y: number },
): GraphCommand {
  return {
    meta: { kind: 'move-node' },
    apply() {
      const n = state.nodes.get(nodeId);
      if (n) state.nodes.set(nodeId, { ...n, position: { ...after } });
      state.revision++;
    },
    revert() {
      const n = state.nodes.get(nodeId);
      if (n) state.nodes.set(nodeId, { ...n, position: { ...before } });
      state.revision++;
    },
  };
}

export function makeMoveNodesCommand(
  state: GraphState,
  moves: { id: NodeId; before: { x: number; y: number }; after: { x: number; y: number } }[],
): GraphCommand {
  return {
    meta: { kind: 'move-nodes' },
    apply() {
      for (const m of moves) {
        const n = state.nodes.get(m.id);
        if (n) state.nodes.set(m.id, { ...n, position: { ...m.after } });
      }
      state.revision++;
    },
    revert() {
      for (const m of moves) {
        const n = state.nodes.get(m.id);
        if (n) state.nodes.set(m.id, { ...n, position: { ...m.before } });
      }
      state.revision++;
    },
  };
}

export function makeSetNodeConfigCommand(
  state: GraphState, dom: GraphDomain, nodeId: NodeId,
  path: (string | number)[], before: unknown, after: unknown,
): GraphCommand {
  function withWrite(n: NodeState, value: unknown): NodeState {
    if (path.length === 0) return n;
    // JSON deep-clone — the asset contract guarantees config is JSON-shaped
    // (Record<string, unknown>), and JSON serialization transparently walks
    // through Svelte 5 $state proxies where structuredClone would throw
    // "Proxy object could not be cloned" (DOMException). Plain Maps inside
    // GraphState are opaque to Svelte's proxy, but `props.node.config`
    // arriving via $props at a component boundary is proxied.
    const newConfig = JSON.parse(JSON.stringify(n.config)) as Record<string, unknown>;
    let cursor: any = newConfig;
    for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i] as any];
    cursor[path[path.length - 1] as any] = value;
    return { ...n, config: newConfig };
  }

  function recomputePorts(
    written: NodeState,
    tmpl: NodeTemplate,
  ): { ports: PortDefinition[]; shortIdSet: Set<string> } | null {
    if (!tmpl.computePorts) return null;
    let raw: GraphAssetPort[];
    try {
      raw = effectivePorts(tmpl, written.config);
      if (!Array.isArray(raw)) throw new Error('computePorts returned non-array');
    } catch (err) {
      console.warn('computePorts threw in set-node-config; keeping previous ports', err);
      return null;
    }
    const seen = new Set<string>();
    const newPorts: PortDefinition[] = [];
    for (const p of raw) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      newPorts.push({ ...p, id: `${nodeId}_${p.id}`, shortId: p.id });
    }
    return { ports: newPorts, shortIdSet: seen };
  }

  let savedPorts: PortDefinition[] | null = null;
  let droppedEdges: EdgeState[] = [];

  return {
    meta: { kind: 'set-node-config' },
    apply() {
      const n = state.nodes.get(nodeId);
      if (!n) return;
      const written = withWrite(n, after);
      const tmpl = dom.getTemplates().find((t) => t.type === n.type);
      const recomputed = tmpl ? recomputePorts(written, tmpl) : null;

      if (recomputed) {
        savedPorts = n.ports;
        droppedEdges = [];
        for (const e of [...state.edges.values()]) {
          let drop = false;
          if (e.sourceNodeId === nodeId && !recomputed.shortIdSet.has(e.sourcePortId)) drop = true;
          if (e.targetNodeId === nodeId && !recomputed.shortIdSet.has(e.targetPortId)) drop = true;
          if (drop) {
            droppedEdges.push(e);
            state.edges.delete(e.id);
            state.selection.delete(e.id);
          }
        }
        state.nodes.set(nodeId, { ...written, ports: recomputed.ports });
      } else {
        savedPorts = null;
        droppedEdges = [];
        state.nodes.set(nodeId, written);
      }
      recomputeNodeFields(state, dom, nodeId);
      state.revision++;
    },
    revert() {
      const n = state.nodes.get(nodeId);
      if (!n) return;
      const reverted = withWrite(n, before);
      if (savedPorts) {
        state.nodes.set(nodeId, { ...reverted, ports: savedPorts });
        for (const e of droppedEdges) state.edges.set(e.id, { ...e });
        savedPorts = null;
        droppedEdges = [];
      } else {
        state.nodes.set(nodeId, reverted);
      }
      recomputeNodeFields(state, dom, nodeId);
      state.revision++;
    },
  };
}

export function makeAddEdgeCommand(state: GraphState, edge: EdgeState): GraphCommand {
  return {
    meta: { kind: 'add-edge' },
    apply() {
      state.edges.set(edge.id, { ...edge });
      state.revision++;
    },
    revert() {
      state.edges.delete(edge.id);
      state.selection.delete(edge.id);
      state.revision++;
    },
  };
}

export function makeRemoveEdgeCommand(state: GraphState, edgeId: string): GraphCommand {
  let removed: EdgeState | null = null;
  return {
    meta: { kind: 'remove-edge' },
    apply() {
      const e = state.edges.get(edgeId);
      if (!e) return;
      removed = e;
      state.edges.delete(edgeId);
      state.selection.delete(edgeId);
      state.revision++;
    },
    revert() {
      if (!removed) return;
      state.edges.set(removed.id, removed);
      state.revision++;
    },
  };
}

export function makeRemoveSelectionCommand(
  state: GraphState, dom: GraphDomain, ids: (NodeId | string)[],
): GraphCommand {
  let removedNodes: NodeState[] = [];
  let removedEdges: EdgeState[] = [];
  let removedBlocks: BlockState[] = [];
  return {
    meta: { kind: 'remove-selection' },
    apply() {
      removedNodes = [];
      removedEdges = [];
      removedBlocks = [];
      const idSet = new Set(ids);
      // First pass: edges named directly in the selection.
      for (const id of idSet) {
        const e = state.edges.get(id);
        if (e) { removedEdges.push(e); state.edges.delete(id); }
      }
      // Second pass: nodes — also drag their incident edges.
      for (const id of idSet) {
        const n = state.nodes.get(id);
        if (!n) continue;
        for (const [eid, e] of state.edges) {
          if (e.sourceNodeId === id || e.targetNodeId === id) {
            removedEdges.push(e);
            state.edges.delete(eid);
          }
        }
        removedNodes.push(n);
        state.nodes.delete(id);
      }
      // Third pass: blocks. Blocks are container-only — removing one does
      // not implicitly remove its members.
      for (const id of idSet) {
        const b = state.blocks.get(id);
        if (b) { removedBlocks.push(b); state.blocks.delete(id); }
      }
      state.selection.clear();
      for (const e of removedEdges) recomputeNodeFields(state, dom, e.targetNodeId);
      state.revision++;
    },
    revert() {
      for (const n of removedNodes) state.nodes.set(n.id, n);
      for (const e of removedEdges) state.edges.set(e.id, e);
      for (const b of removedBlocks) state.blocks.set(b.id, b);
      for (const e of removedEdges) recomputeNodeFields(state, dom, e.targetNodeId);
      state.revision++;
    },
  };
}

export function makeResizeNodeCommand(
  state: GraphState,
  nodeId: NodeId,
  before: { w: number; h: number },
  after:  { w: number; h: number },
): GraphCommand {
  return {
    meta: { kind: 'resize-node' },
    apply() {
      const n = state.nodes.get(nodeId);
      if (n) state.nodes.set(nodeId, { ...n, width: after.w, height: after.h });
      state.revision++;
    },
    revert() {
      const n = state.nodes.get(nodeId);
      if (n) state.nodes.set(nodeId, { ...n, width: before.w, height: before.h });
      state.revision++;
    },
  };
}

export function makeReplaceAssetCommand(
  state: GraphState, dom: GraphDomain, next: GraphAsset,
): GraphCommand {
  let snapshot: GraphAsset | null = null;
  return {
    meta: { kind: 'replace-asset' },
    apply() {
      snapshot = graphStateToAsset(state);
      const fresh = graphAssetToState(next, dom);
      state.id = fresh.id;
      state.domainId = fresh.domainId;
      state.name = fresh.name;
      state.version = fresh.version;
      state.metadata = fresh.metadata;
      state.nodes.clear(); for (const [k, v] of fresh.nodes) state.nodes.set(k, v);
      state.edges.clear(); for (const [k, v] of fresh.edges) state.edges.set(k, v);
      state.selection.clear();
      state.revision++;
    },
    revert() {
      if (!snapshot) return;
      const fresh = graphAssetToState(snapshot, dom);
      state.id = fresh.id;
      state.domainId = fresh.domainId;
      state.name = fresh.name;
      state.version = fresh.version;
      state.metadata = fresh.metadata;
      state.nodes.clear(); for (const [k, v] of fresh.nodes) state.nodes.set(k, v);
      state.edges.clear(); for (const [k, v] of fresh.edges) state.edges.set(k, v);
      state.blocks.clear(); for (const [k, v] of fresh.blocks) state.blocks.set(k, v);
      state.selection.clear();
      state.revision++;
    },
  };
}

// ---------- Block commands ----------

function blockFromAsset(b: GraphAssetBlock): BlockState {
  return {
    id: b.id,
    position: { ...b.position },
    width: b.width, height: b.height,
    color: b.color, alpha: b.alpha,
    label: b.label, labelAnchor: b.labelAnchor,
  };
}

export function makeAddBlockCommand(state: GraphState, b: GraphAssetBlock): GraphCommand {
  const snap = blockFromAsset(b);
  return {
    meta: { kind: 'add-block' },
    apply() {
      state.blocks.set(snap.id, { ...snap, position: { ...snap.position } });
      state.revision++;
    },
    revert() {
      state.blocks.delete(snap.id);
      state.selection.delete(snap.id);
      state.revision++;
    },
  };
}

export function makeRemoveBlockCommand(state: GraphState, id: BlockId): GraphCommand {
  let snap: BlockState | null = null;
  return {
    meta: { kind: 'remove-block' },
    apply() {
      const cur = state.blocks.get(id);
      if (!cur) return;
      snap = { ...cur, position: { ...cur.position } };
      state.blocks.delete(id);
      state.selection.delete(id);
      state.revision++;
    },
    revert() {
      if (!snap) return;
      state.blocks.set(snap.id, { ...snap, position: { ...snap.position } });
      state.revision++;
    },
  };
}

export interface MoveBlockSpec {
  blockId: BlockId;
  before: { x: number; y: number };
  after:  { x: number; y: number };
  carriedNodes: Array<{ id: string; before: { x: number; y: number }; after: { x: number; y: number } }>;
}

export function makeMoveBlockCommand(state: GraphState, spec: MoveBlockSpec): GraphCommand {
  return {
    meta: { kind: 'move-block' },
    apply() {
      const b = state.blocks.get(spec.blockId);
      if (b) state.blocks.set(spec.blockId, { ...b, position: { ...spec.after } });
      for (const m of spec.carriedNodes) {
        const n = state.nodes.get(m.id);
        if (n) state.nodes.set(m.id, { ...n, position: { ...m.after } });
      }
      state.revision++;
    },
    revert() {
      const b = state.blocks.get(spec.blockId);
      if (b) state.blocks.set(spec.blockId, { ...b, position: { ...spec.before } });
      for (const m of spec.carriedNodes) {
        const n = state.nodes.get(m.id);
        if (n) state.nodes.set(m.id, { ...n, position: { ...m.before } });
      }
      state.revision++;
    },
  };
}

export interface ResizeBlockSpec {
  blockId: BlockId;
  before: { w: number; h: number };
  after:  { w: number; h: number };
}

export function makeResizeBlockCommand(state: GraphState, spec: ResizeBlockSpec): GraphCommand {
  return {
    meta: { kind: 'resize-block' },
    apply() {
      const b = state.blocks.get(spec.blockId);
      if (b) state.blocks.set(spec.blockId, { ...b, width: spec.after.w, height: spec.after.h });
      state.revision++;
    },
    revert() {
      const b = state.blocks.get(spec.blockId);
      if (b) state.blocks.set(spec.blockId, { ...b, width: spec.before.w, height: spec.before.h });
      state.revision++;
    },
  };
}

export interface SetBlockConfigSpec {
  blockId: BlockId;
  before: Partial<Pick<BlockState, 'color' | 'alpha' | 'label' | 'labelAnchor'>>;
  after:  Partial<Pick<BlockState, 'color' | 'alpha' | 'label' | 'labelAnchor'>>;
}

export function makeSetBlockConfigCommand(state: GraphState, spec: SetBlockConfigSpec): GraphCommand {
  return {
    meta: { kind: 'set-block-config' },
    apply() {
      const b = state.blocks.get(spec.blockId);
      if (b) state.blocks.set(spec.blockId, { ...b, ...spec.after });
      state.revision++;
    },
    revert() {
      const b = state.blocks.get(spec.blockId);
      if (b) state.blocks.set(spec.blockId, { ...b, ...spec.before });
      state.revision++;
    },
  };
}
