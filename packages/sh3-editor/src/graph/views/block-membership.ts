import type { GraphState, BlockId, NodeId } from '../state/types';

export interface Rect { x: number; y: number; w: number; h: number; }

export interface BlockMembershipCache {
  members: Map<BlockId, Set<NodeId>>;
}

/** True when `node`'s bbox is fully inside `block`'s bbox (inclusive). */
export function isContained(block: Rect, node: Rect): boolean {
  return node.x >= block.x
      && node.y >= block.y
      && node.x + node.w <= block.x + block.w
      && node.y + node.h <= block.y + block.h;
}

/**
 * Compute per-block sets of contained node ids using bbox containment.
 * Nodes can be members of multiple blocks (e.g., nested blocks).
 */
export function computeMembership(state: GraphState): BlockMembershipCache {
  const members = new Map<BlockId, Set<NodeId>>();
  for (const b of state.blocks.values()) {
    const br: Rect = { x: b.position.x, y: b.position.y, w: b.width, h: b.height };
    const set = new Set<NodeId>();
    for (const n of state.nodes.values()) {
      const nr: Rect = { x: n.position.x, y: n.position.y, w: n.width, h: n.height };
      if (isContained(br, nr)) set.add(n.id);
    }
    members.set(b.id, set);
  }
  return { members };
}
