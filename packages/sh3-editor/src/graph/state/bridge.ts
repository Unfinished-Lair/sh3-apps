import type { GraphAsset, GraphAssetNode } from '../asset/types';
import type { GraphDomain, NodeTemplate } from '../domain/types';
import type {
  EdgeState, FieldDescriptor, GraphState, NodeState, PortDefinition,
} from './types';

function shortPortId(nodeId: string, fullPortId: string): string {
  const prefix = `${nodeId}_`;
  return fullPortId.startsWith(prefix) ? fullPortId.slice(prefix.length) : fullPortId;
}

function nodeFromAsset(
  n: GraphAssetNode,
  domain: GraphDomain,
  connectedInputs: Set<string>,
): NodeState {
  const visuals = domain.getNodeVisuals(n.type);
  const ports: PortDefinition[] = n.ports.map((p) => ({
    ...p,
    shortId: shortPortId(n.id, p.id),
  }));
  const template = domain.getTemplates().find((t) => t.type === n.type);
  const configFields = template
    ? buildConfigFields(template, n.config, connectedInputs)
    : [];
  return {
    id: n.id,
    type: n.type,
    label: domain.resolveLabel(n.type, n.config),
    ports,
    config: { ...n.config },
    configFields,
    position: { ...n.position },
    width: visuals.defaultWidth ?? domain.defaultNodeWidth,
    height: visuals.defaultHeight ?? domain.defaultNodeHeight,
  };
}

export function graphAssetToState(asset: GraphAsset, domain: GraphDomain): GraphState {
  // Build a lookup of port-id existence so we can drop dangling edges.
  const portIds = new Map<string, Set<string>>();
  for (const n of asset.nodes) {
    portIds.set(n.id, new Set(n.ports.map((p) => p.id)));
  }

  // Pre-compute connected-input port short-ids per node.
  const connectedByNode = new Map<string, Set<string>>();
  for (const e of asset.edges) {
    const tgtPorts = portIds.get(e.targetNodeId);
    const srcPorts = portIds.get(e.sourceNodeId);
    if (!tgtPorts?.has(e.targetPortId) || !srcPorts?.has(e.sourcePortId)) continue;
    let set = connectedByNode.get(e.targetNodeId);
    if (!set) { set = new Set(); connectedByNode.set(e.targetNodeId, set); }
    set.add(shortPortId(e.targetNodeId, e.targetPortId));
  }

  const nodes = new Map<string, NodeState>();
  for (const n of asset.nodes) {
    const conn = connectedByNode.get(n.id) ?? new Set<string>();
    nodes.set(n.id, nodeFromAsset(n, domain, conn));
  }

  const edges = new Map<string, EdgeState>();
  for (const e of asset.edges) {
    const tgtPorts = portIds.get(e.targetNodeId);
    const srcPorts = portIds.get(e.sourceNodeId);
    if (!tgtPorts?.has(e.targetPortId) || !srcPorts?.has(e.sourcePortId)) {
      console.warn(`graph: dropping edge ${e.id} with missing endpoint`, e);
      continue;
    }
    edges.set(e.id, {
      id: e.id,
      sourceNodeId: e.sourceNodeId,
      sourcePortId: shortPortId(e.sourceNodeId, e.sourcePortId),
      targetNodeId: e.targetNodeId,
      targetPortId: shortPortId(e.targetNodeId, e.targetPortId),
    });
  }

  return {
    id: asset.id,
    domainId: asset.domain,
    name: asset.name,
    version: asset.version,
    nodes,
    edges,
    metadata: { ...(asset.metadata ?? {}) },
    readonly: false,
    selection: new Set(),
  };
}

const PORT_TYPE_TO_FIELD: Record<string, FieldDescriptor['type']> = {
  number: 'number',
  boolean: 'boolean',
  string: 'string',
};

export function buildConfigFields(
  template: NodeTemplate,
  _config: Record<string, unknown>,
  connectedInputPortShortIds: Set<string>,
): FieldDescriptor[] {
  const out: FieldDescriptor[] = [];
  const seen = new Set<string>();

  // 1. Manual schema entries.
  for (const def of template.configSchema ?? []) {
    seen.add(def.key);
    const field: FieldDescriptor = {
      key: def.key,
      label: def.label,
      type: def.type,
    };
    if (def.options) field.options = def.options;
    if (def.rendererHint) field.rendererHint = def.rendererHint;
    if (connectedInputPortShortIds.has(def.key)) field.disabled = true;
    out.push(field);
  }

  // 2. Auto-generated input-port fields.
  for (const p of template.ports) {
    if (p.direction !== 'input') continue;
    if (seen.has(p.id)) continue;                  // collision → manual wins
    const fieldType = p.dataType ? PORT_TYPE_TO_FIELD[p.dataType] : undefined;
    if (!fieldType) continue;                      // unknown dataType → no auto field
    out.push({
      key: p.id,
      label: p.label,
      type: fieldType,
      disabled: connectedInputPortShortIds.has(p.id),
    });
  }

  return out;
}

function fullPortId(nodeId: string, shortId: string): string {
  return shortId.startsWith(`${nodeId}_`) ? shortId : `${nodeId}_${shortId}`;
}

export function graphStateToAsset(state: GraphState): GraphAsset {
  const nodes: GraphAsset['nodes'] = [];
  for (const n of state.nodes.values()) {
    nodes.push({
      id: n.id,
      type: n.type,
      position: { ...n.position },
      config: { ...n.config },
      ports: n.ports.map((p) => ({
        id: p.id,           // already in full form (asset → state preserves p.id)
        label: p.label,
        direction: p.direction,
        ...(p.dataType !== undefined ? { dataType: p.dataType } : {}),
      })),
    });
  }
  const edges: GraphAsset['edges'] = [];
  for (const e of state.edges.values()) {
    edges.push({
      id: e.id,
      sourceNodeId: e.sourceNodeId,
      sourcePortId: fullPortId(e.sourceNodeId, e.sourcePortId),
      targetNodeId: e.targetNodeId,
      targetPortId: fullPortId(e.targetNodeId, e.targetPortId),
    });
  }
  const out: GraphAsset = {
    id: state.id,
    name: state.name,
    domain: state.domainId,
    version: state.version,
    nodes,
    edges,
  };
  if (Object.keys(state.metadata).length > 0) out.metadata = { ...state.metadata };
  return out;
}
