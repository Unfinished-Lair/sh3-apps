import type { ShardContext } from 'sh3-core';
import type {
  GraphAsset, GraphAssetPort, GraphDomain, NodeTemplate,
} from '@unfinished-lair/sh3-editor/graph/types';
import type { GraphController } from '@unfinished-lair/sh3-editor/graph/contributions';
import type { PrefetchConfig } from '../domain/types';
import { getActiveState, type PipelineState } from '../state.svelte';
import { runPrefetch } from './prefetch-runner';

const argRefreshTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function scheduleArgsRefresh(nodeId: string, debounceMs = 300): void {
  if (!activeCtx) return;
  const state = getActiveState();
  if (!state) return;
  const existing = argRefreshTimers.get(nodeId);
  if (existing) clearTimeout(existing);
  argRefreshTimers.set(nodeId, setTimeout(() => {
    argRefreshTimers.delete(nodeId);
    if (!activeCtx) return;
    refreshPrefetchNode(activeCtx, state, nodeId).catch((err) => {
      console.warn('[pipeline] args-change refresh failed', nodeId, err);
    });
  }, debounceMs));
}

/**
 * Idempotent walk over the active asset: for each prefetch node that has
 * never been fetched (list === null && lastError === null) and isn't
 * currently in flight, kick off a refresh. Safe to call repeatedly; the
 * guard prevents re-fetches.
 */
export function maybeAutoPrefetch(): void {
  if (!activeCtx) return;
  const state = getActiveState();
  if (!state) return;
  const ctx = activeCtx;
  for (const node of state.asset.nodes) {
    if ((node.config as { mode?: unknown }).mode !== 'prefetch') continue;
    const cfg = (node.config as { prefetch?: PrefetchConfig }).prefetch;
    if (cfg && cfg.list === null && cfg.lastError === null && !state.prefetchingNodes.has(node.id)) {
      refreshPrefetchNode(ctx, state, node.id).catch((err) => {
        console.warn('[pipeline] auto-prefetch failed', node.id, err);
      });
    }
  }
}

/**
 * Wiring shared between the shard module and the inspector adapter. The shard
 * pushes the active ShardContext + graphController here at onAppActivate so the
 * adapter (which only sees InspectorRendererProps) can drive prefetch refresh,
 * config commits, and mode toggle against the selected node.
 */

let activeCtx: ShardContext | null = null;
let activeController: GraphController | null = null;
let activeDomain: GraphDomain | null = null;
let selectedNodeId: string | null = null;

export function bindPrefetchActions(
  ctx: ShardContext,
  ctrl: GraphController | null,
  domain: GraphDomain | null = null,
): void {
  activeCtx = ctx;
  activeController = ctrl;
  activeDomain = domain;
}

export function unbindPrefetchActions(): void {
  activeCtx = null;
  activeController = null;
  activeDomain = null;
  selectedNodeId = null;
}

export function setSelectedPrefetchNodeId(id: string | null): void {
  selectedNodeId = id;
}

export function getSelectedPrefetchNodeId(): string | null {
  return selectedNodeId;
}

export function isSelectedPrefetchRefreshing(): boolean {
  const state = getActiveState();
  if (!state || !selectedNodeId) return false;
  return state.prefetchingNodes.has(selectedNodeId);
}

export async function refreshSelectedPrefetchNode(): Promise<void> {
  if (!activeCtx) return;
  const state = getActiveState();
  if (!state || !selectedNodeId) return;
  await refreshPrefetchNode(activeCtx, state, selectedNodeId);
}

export function commitSelectedPrefetchConfig(next: PrefetchConfig): void {
  const state = getActiveState();
  if (!state || !selectedNodeId) return;
  const node = state.asset.nodes.find((n) => n.id === selectedNodeId);
  const prev = node ? (node.config as { prefetch?: PrefetchConfig }).prefetch : null;
  commitPrefetchConfig(state, selectedNodeId, next);
  // Debounced refresh only when args changed (not on row selection / valueField change).
  if (prev && JSON.stringify(prev.args) !== JSON.stringify(next.args)) {
    scheduleArgsRefresh(selectedNodeId);
  }
}

export function toggleSelectedNodeMode(): void {
  const state = getActiveState();
  if (!state || !selectedNodeId) return;
  toggleNodeMode(state, selectedNodeId);
}

export async function refreshPrefetchNode(
  ctx: ShardContext,
  state: PipelineState,
  nodeId: string,
): Promise<void> {
  if (state.prefetchingNodes.has(nodeId)) return;
  const node = state.asset.nodes.find((n) => n.id === nodeId);
  if (!node) return;
  const cfg = (node.config as { prefetch?: PrefetchConfig }).prefetch;
  if (!cfg) return;

  state.prefetchingNodes.add(nodeId);
  try {
    const next = await runPrefetch(
      { cfg },
      {
        invokeVerb: (s, n, a, o) => ctx.sh3.runVerb(s, n, a, o),
        verbOutputItemsSchema: (shardId, name) => {
          const verbs = ctx.sh3.listVerbs?.({ programmaticOnly: true }) ?? [];
          const v = verbs.find((x) => x.shardId === shardId && x.name === name);
          const out = v?.schema?.output as { items?: { properties?: Record<string, unknown> } } | undefined;
          return out?.items?.properties ? { properties: out.items.properties } : null;
        },
      },
    );
    commitPrefetchConfig(state, nodeId, next);
  } finally {
    state.prefetchingNodes.delete(nodeId);
  }
}

export function commitPrefetchConfig(state: PipelineState, nodeId: string, next: PrefetchConfig): void {
  const nodes = state.asset.nodes.map((n) =>
    n.id === nodeId
      ? { ...n, config: { ...n.config, prefetch: next } }
      : n,
  );
  state.asset = { ...state.asset, nodes };
  pushAssetToController(state.asset);
}

export function toggleNodeMode(state: PipelineState, nodeId: string): void {
  const node = state.asset.nodes.find((n) => n.id === nodeId);
  if (!node) return;
  const isPrefetch = (node.config as { mode?: unknown }).mode === 'prefetch';

  // Strip wires touching this node (they're invalid in the new port shape).
  const edges = state.asset.edges.filter(
    (e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId,
  );

  // Preserve all template-derived fields (pickerable, summary, hasInputSchema,
  // outputPortIds…) so the inspector keeps routing through PrefetchAdapter
  // after the round-trip and so toggling back to runtime restores the full
  // verb-node shape. We only flip `mode` and add/remove the prefetch block.
  const baseConfig = { ...(node.config as Record<string, unknown>) };
  delete baseConfig.prefetch;
  const nextConfig: Record<string, unknown> = isPrefetch
    ? { ...baseConfig, mode: 'runtime' }
    : {
        ...baseConfig,
        mode: 'prefetch',
        prefetch: {
          args: {}, valueField: null, list: null,
          selectedRowKey: null, lastSelectedRow: null, lastError: null,
        },
      };

  // Recompute ports from the template so the node visually swaps between
  // runtime (control-in + structured inputs + result outputs) and prefetch
  // (no inputs + value/record outputs). Without this the asset retains the
  // pre-toggle port shape and the canvas still shows old ports.
  const ports = computePortsForType(node.type, nextConfig, nodeId) ?? node.ports;

  const nodes = state.asset.nodes.map((n) =>
    n.id === nodeId ? { ...n, config: nextConfig, ports } : n,
  );
  state.asset = { ...state.asset, nodes, edges };
  pushAssetToController(state.asset);

  // setAsset routes through makeReplaceAssetCommand, which clears selection
  // silently (no emitSelection). Without this select() the inspector never
  // hears the swap — it keeps the pre-toggle entry value and the user sees
  // stale UI until they manually click another node and back.
  if (activeController) {
    try { activeController.select([nodeId]); } catch { /* */ }
  }
}

function computePortsForType(
  type: string,
  config: Record<string, unknown>,
  nodeId: string,
): GraphAssetPort[] | null {
  if (!activeDomain) return null;
  const template: NodeTemplate | undefined = activeDomain
    .getTemplates()
    .find((t) => t.type === type);
  if (!template) return null;
  let resolved: GraphAssetPort[];
  try {
    resolved = template.computePorts
      ? template.computePorts(config)
      : template.ports;
    if (!Array.isArray(resolved)) resolved = template.ports;
  } catch {
    resolved = template.ports;
  }
  return resolved.map((p) => ({ ...p, id: `${nodeId}_${p.id}` }));
}

function pushAssetToController(asset: GraphAsset): void {
  if (activeController) {
    try { activeController.setAsset(asset); } catch { /* controller may be detached */ }
  }
}
