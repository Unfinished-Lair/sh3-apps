import type { RunContext } from '../../domain/types';

export interface NodeInvocation {
  nodeId: string;
  type: string;
  config: Record<string, unknown>;
  /** Resolved data input values keyed by input port short id (control ports excluded). */
  inputs: Record<string, unknown>;
}

export interface NodeOutcome {
  /** Values written to data output ports (keyed by short id). */
  outputs: Record<string, unknown>;
  /** Outgoing control port short id to follow; null = no control follow-up. */
  next: string | null;
  /** For sequence-style nodes: ordered list of outgoing control port short ids to fire one by one. */
  sequenceOuts?: string[];
}

export type NodeHandler = (
  ctx: RunContext,
  invocation: NodeInvocation,
) => Promise<NodeOutcome>;

export interface HandlerRegistry {
  exact: Map<string, NodeHandler>;
  prefixed: Array<{ prefix: string; handler: NodeHandler }>;
}

export function lookupHandler(reg: HandlerRegistry, type: string): NodeHandler | undefined {
  const exact = reg.exact.get(type);
  if (exact) return exact;
  for (const { prefix, handler } of reg.prefixed) {
    if (type.startsWith(prefix)) return handler;
  }
  return undefined;
}
