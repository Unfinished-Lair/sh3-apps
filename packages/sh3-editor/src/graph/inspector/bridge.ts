import type { FieldDescriptor, GraphState, NodeId } from '../state/types';
import type { GraphDomain } from '../domain/types';
import type { HistoryController, InspectorMeta, WalkerCommitOverride } from '../../types';
import { makeSetNodeConfigCommand } from '../history/commands';

export function fieldsToInspectorMeta(fields: FieldDescriptor[]): InspectorMeta {
  const out: InspectorMeta = { fields: {} };
  for (const f of fields) {
    const m: InspectorMeta = { label: f.label };
    if (f.rendererHint) m.type = f.rendererHint;
    if (f.disabled) m.readonly = true;
    out.fields![f.key] = m;
  }
  return out;
}

function getAtPath(obj: unknown, path: (string | number)[]): unknown {
  let cur: any = obj;
  for (const p of path) cur = cur?.[p];
  return cur;
}

export function makeNodeConfigOverride(
  nodeId: NodeId,
  state: GraphState,
  dom: GraphDomain,
  history: HistoryController,
  descriptorOnCommit: undefined | ((nid: string, p: (string | number)[], n: unknown) => boolean | void),
  onAssetChanged: () => void,
): WalkerCommitOverride {
  return (path, next) => {
    const consumed = descriptorOnCommit?.(nodeId, path, next);
    if (consumed === true) return true;

    const n = state.nodes.get(nodeId);
    if (!n) return true;
    const before = getAtPath(n.config, path);
    if (before === next) return true;
    const cmd = makeSetNodeConfigCommand(state, dom, nodeId, path, before, next);
    cmd.apply();
    history.push(cmd);
    onAssetChanged();
    return true;
  };
}
