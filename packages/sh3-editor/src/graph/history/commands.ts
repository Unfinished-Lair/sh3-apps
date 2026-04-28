import type { GraphAsset, GraphAssetEdge, GraphAssetNode } from '../asset/types';
import type { GraphDomain } from '../domain/types';
import type { EdgeState, GraphState, NodeId, NodeState, PortDefinition } from '../state/types';
import { graphAssetToState, graphStateToAsset, buildConfigFields } from '../state/bridge';

export type GraphCommandKind =
  | 'add-node'
  | 'add-many'
  | 'remove-node'
  | 'move-node'
  | 'set-node-config'
  | 'add-edge'
  | 'remove-edge'
  | 'remove-selection'
  | 'replace-asset';

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
  return {
    id: n.id,
    type: n.type,
    label: dom.resolveLabel(n.type, n.config),
    ports,
    config: { ...n.config },
    configFields: tmpl ? buildConfigFields(tmpl, n.config, connectedShortIds) : [],
    position: { ...n.position },
    width: visuals.defaultWidth ?? dom.defaultNodeWidth,
    height: visuals.defaultHeight ?? dom.defaultNodeHeight,
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
  n.configFields = tmpl ? buildConfigFields(tmpl, n.config, connected) : [];
  n.label = dom.resolveLabel(n.type, n.config);
}

export function makeAddNodeCommand(state: GraphState, dom: GraphDomain, asset: GraphAssetNode): GraphCommand {
  return {
    meta: { kind: 'add-node' },
    apply() { state.nodes.set(asset.id, buildNodeState(asset, dom, new Set())); },
    revert() {
      state.nodes.delete(asset.id);
      state.selection.delete(asset.id);
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
    },
    revert() {
      for (const e of edges) state.edges.delete(e.id);
      for (const n of nodes) {
        state.nodes.delete(n.id);
        state.selection.delete(n.id);
      }
      for (const e of edges) recomputeNodeFields(state, dom, e.targetNodeId);
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
    },
    revert() {
      if (!removedNode) return;
      state.nodes.set(removedNode.id, removedNode);
      for (const e of removedEdges) state.edges.set(e.id, e);
      for (const e of removedEdges) recomputeNodeFields(state, dom, e.targetNodeId);
    },
  };
}

export function makeMoveNodeCommand(
  state: GraphState, nodeId: NodeId,
  before: { x: number; y: number }, after: { x: number; y: number },
): GraphCommand {
  return {
    meta: { kind: 'move-node' },
    apply() { const n = state.nodes.get(nodeId); if (n) n.position = { ...after }; },
    revert() { const n = state.nodes.get(nodeId); if (n) n.position = { ...before }; },
  };
}

export function makeSetNodeConfigCommand(
  state: GraphState, dom: GraphDomain, nodeId: NodeId,
  path: (string | number)[], before: unknown, after: unknown,
): GraphCommand {
  function write(n: NodeState, value: unknown): void {
    if (path.length === 0) return;
    let cursor: any = n.config;
    for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i] as any];
    cursor[path[path.length - 1] as any] = value;
  }
  return {
    meta: { kind: 'set-node-config' },
    apply() {
      const n = state.nodes.get(nodeId);
      if (!n) return;
      write(n, after);
      recomputeNodeFields(state, dom, nodeId);
    },
    revert() {
      const n = state.nodes.get(nodeId);
      if (!n) return;
      write(n, before);
      recomputeNodeFields(state, dom, nodeId);
    },
  };
}

export function makeAddEdgeCommand(state: GraphState, edge: EdgeState): GraphCommand {
  return {
    meta: { kind: 'add-edge' },
    apply() {
      state.edges.set(edge.id, { ...edge });
    },
    revert() {
      state.edges.delete(edge.id);
      state.selection.delete(edge.id);
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
    },
    revert() {
      if (!removed) return;
      state.edges.set(removed.id, removed);
    },
  };
}

export function makeRemoveSelectionCommand(
  state: GraphState, dom: GraphDomain, ids: (NodeId | string)[],
): GraphCommand {
  let removedNodes: NodeState[] = [];
  let removedEdges: EdgeState[] = [];
  return {
    meta: { kind: 'remove-selection' },
    apply() {
      removedNodes = [];
      removedEdges = [];
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
      state.selection.clear();
      for (const e of removedEdges) recomputeNodeFields(state, dom, e.targetNodeId);
    },
    revert() {
      for (const n of removedNodes) state.nodes.set(n.id, n);
      for (const e of removedEdges) state.edges.set(e.id, e);
      for (const e of removedEdges) recomputeNodeFields(state, dom, e.targetNodeId);
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
      state.selection.clear();
    },
  };
}
