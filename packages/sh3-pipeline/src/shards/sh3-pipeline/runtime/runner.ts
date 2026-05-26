import type { RunContext } from '../domain/types';
import { lookupHandler, type HandlerRegistry, type NodeOutcome } from './handlers';

export interface RunnerNode {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

export interface RunnerEdge {
  from: { node: string; port: string };
  to: { node: string; port: string };
}

export interface RunnerGraph {
  nodes: RunnerNode[];
  edges: RunnerEdge[];
}

export interface RunOptions {
  graph: RunnerGraph;
  ctx: RunContext;
  handlers: HandlerRegistry;
}

export interface RunResult {
  outputs: Record<string, unknown>;
}

export async function runGraph(opts: RunOptions): Promise<RunResult> {
  const { graph, ctx, handlers } = opts;

  if (ctx.signal.aborted) throw new Error('Run aborted before start');

  const startNode = graph.nodes.find((n) => n.type === 'start');
  if (!startNode) throw new Error('Graph has no start node');

  const nodesById = new Map(graph.nodes.map((n) => [n.id, n]));
  const outgoing = indexEdgesByFrom(graph.edges);
  const incoming = indexEdgesByTo(graph.edges);

  const valueCache = new Map<string, Record<string, unknown>>();

  await runFromNode(startNode.id, ctx, {
    nodesById,
    outgoing,
    incoming,
    handlers,
    valueCache,
  });

  const endNode = graph.nodes.find((n) => n.type === 'end');
  const finalOutputs = endNode ? valueCache.get(endNode.id) ?? {} : {};

  if (!endNode) {
    ctx.log({
      ts: Date.now(),
      nodeId: null,
      level: 'warn',
      message: 'Run reached control dead-end with no end node',
    });
  }

  return { outputs: finalOutputs };
}

interface RunState {
  nodesById: Map<string, RunnerNode>;
  outgoing: Map<string, RunnerEdge[]>;
  incoming: Map<string, RunnerEdge[]>;
  handlers: HandlerRegistry;
  valueCache: Map<string, Record<string, unknown>>;
}

async function runFromNode(nodeId: string, ctx: RunContext, state: RunState): Promise<void> {
  if (ctx.signal.aborted) throw new Error('Run aborted');

  const node = state.nodesById.get(nodeId);
  if (!node) throw new Error(`Edge points at unknown node id ${nodeId}`);

  const handler = lookupHandler(state.handlers, node.type);
  if (!handler) throw new Error(`No handler for node type ${node.type}`);

  const inputs = await resolveInputs(node, ctx, state);

  ctx.log({ ts: Date.now(), nodeId, level: 'debug', message: `enter ${node.type}` });
  let outcome: NodeOutcome;
  try {
    outcome = await handler(ctx, {
      nodeId,
      type: node.type,
      config: node.config,
      inputs,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    ctx.log({ ts: Date.now(), nodeId, level: 'error', message: msg, data: err });
    throw err;
  }
  ctx.log({ ts: Date.now(), nodeId, level: 'debug', message: `exit ${node.type}` });

  state.valueCache.set(nodeId, outcome.outputs);

  if (outcome.next !== null) {
    const nextEdge = (state.outgoing.get(nodeId) ?? []).find(
      (e) => e.from.port === outcome.next,
    );
    if (nextEdge) await runFromNode(nextEdge.to.node, ctx, state);
  } else if (outcome.sequenceOuts) {
    for (const portId of outcome.sequenceOuts) {
      const edge = (state.outgoing.get(nodeId) ?? []).find((e) => e.from.port === portId);
      if (edge) await runFromNode(edge.to.node, ctx, state);
    }
  }
}

async function resolveInputs(
  node: RunnerNode,
  ctx: RunContext,
  state: RunState,
): Promise<Record<string, unknown>> {
  const inputs: Record<string, unknown> = {};
  const incoming = state.incoming.get(node.id) ?? [];

  for (const edge of incoming) {
    // Run input ports follow a naming convention: 'run' (default) or
    // 'run-in' (used when a node has both a run input and output).
    // Edges into them carry no data — skip pulling.
    if (edge.to.port === 'run' || edge.to.port === 'run-in') continue;

    let upstream = state.valueCache.get(edge.from.node);
    if (!upstream) {
      const upstreamNode = state.nodesById.get(edge.from.node);
      if (!upstreamNode) continue;
      const upstreamHandler = lookupHandler(state.handlers, upstreamNode.type);
      if (!upstreamHandler) throw new Error(`No handler for upstream type ${upstreamNode.type}`);
      const upstreamInputs = await resolveInputs(upstreamNode, ctx, state);
      const result = await upstreamHandler(ctx, {
        nodeId: upstreamNode.id,
        type: upstreamNode.type,
        config: upstreamNode.config,
        inputs: upstreamInputs,
      });
      state.valueCache.set(upstreamNode.id, result.outputs);
      upstream = result.outputs;
    }
    inputs[edge.to.port] = upstream?.[edge.from.port];
  }
  return inputs;
}

function indexEdgesByFrom(edges: RunnerEdge[]): Map<string, RunnerEdge[]> {
  const m = new Map<string, RunnerEdge[]>();
  for (const e of edges) {
    const arr = m.get(e.from.node) ?? [];
    arr.push(e);
    m.set(e.from.node, arr);
  }
  return m;
}

function indexEdgesByTo(edges: RunnerEdge[]): Map<string, RunnerEdge[]> {
  const m = new Map<string, RunnerEdge[]>();
  for (const e of edges) {
    const arr = m.get(e.to.node) ?? [];
    arr.push(e);
    m.set(e.to.node, arr);
  }
  return m;
}
