import type {
  ConversionDef,
  GraphAsset,
  GraphAssetNode,
  GraphAssetEdge,
} from '@unfinished-lair/sh3-editor/graph/types';
import type { RunContext, RunLogEntry } from '../domain/types';
import type { PipelineDocument } from '../document/format';
import { createRunContext } from '../runtime/context';
import { runGraph, type RunnerGraph } from '../runtime/runner';
import type { HandlerRegistry } from '../runtime/handlers';
import { CONVERSIONS } from '../domain/data-types';

export interface RunPipelineOptions {
  doc: PipelineDocument;
  docId: string;
  tenant: string;
  inputs: Record<string, unknown>;
  signal: AbortSignal;
  log: (entry: RunLogEntry) => void;
  invokeVerb: RunContext['invokeVerb'];
  writeDocument: RunContext['writeDocument'];
  loadSubGraph: (docId: string) => Promise<PipelineDocument>;
  handlers: HandlerRegistry;
  /** Test hook: called whenever a sub-graph context is constructed. */
  onChildContextCreated?: (ctx: RunContext) => void;
  /** Optional override; defaults to domain conversions. */
  conversions?: ReadonlyArray<ConversionDef>;
}

export async function runPipelineDocument(
  opts: RunPipelineOptions,
): Promise<{ outputs: Record<string, unknown> }> {
  const runner: RunnerGraph = projectAsset(opts.doc.asset);
  const conversions = opts.conversions ?? CONVERSIONS;

  const runSubGraph = async (
    docId: string,
    inputs: Record<string, unknown>,
  ): Promise<{ outputs: Record<string, unknown> }> => {
    const childDoc = await opts.loadSubGraph(docId);
    const child = createRunContext({
      docId,
      tenant: opts.tenant,
      inputs,
      signal: opts.signal,
      log: opts.log,
      invokeVerb: opts.invokeVerb,
      runSubGraph: async (id, inp) => runSubGraph(id, inp),
      writeDocument: opts.writeDocument,
    });
    opts.onChildContextCreated?.(child);
    const childGraph = projectAsset(childDoc.asset);
    return runGraph({ graph: childGraph, ctx: child, handlers: opts.handlers, conversions });
  };

  const ctx = createRunContext({
    docId: opts.docId,
    tenant: opts.tenant,
    inputs: opts.inputs,
    signal: opts.signal,
    log: opts.log,
    invokeVerb: opts.invokeVerb,
    runSubGraph,
    writeDocument: opts.writeDocument,
  });

  return runGraph({ graph: runner, ctx, handlers: opts.handlers, conversions });
}

function stripNodePrefix(portId: string, nodeId: string): string {
  const prefix = `${nodeId}_`;
  return portId.startsWith(prefix) ? portId.slice(prefix.length) : portId;
}

export function projectAsset(asset: GraphAsset): RunnerGraph {
  const nodes = (asset.nodes ?? []) as GraphAssetNode[];
  const edges = (asset.edges ?? []) as GraphAssetEdge[];
  return {
    nodes: nodes.map((n) => ({ id: n.id, type: n.type, config: n.config ?? {} })),
    edges: edges.map((e) => ({
      from: { node: e.sourceNodeId, port: stripNodePrefix(e.sourcePortId, e.sourceNodeId) },
      to:   { node: e.targetNodeId, port: stripNodePrefix(e.targetPortId, e.targetNodeId) },
      ...(e.adapter !== undefined ? { adapter: e.adapter } : {}),
    })),
  };
}
