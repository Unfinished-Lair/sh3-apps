import type { GraphAsset } from '@unfinished-lair/sh3-editor/graph/types';
import type { RunLog } from './runtime/run-log.svelte';
import { createRunLog } from './runtime/run-log.svelte';
import { emptyAsset } from './document/store';

/** Default scratch buffer doc id — used when the app is opened without
 *  a specific graph bound. Keeps Save enabled by default. */
export const SCRATCH_DOC_ID = 'sh3-pipeline:scratch.pipeline.json';

/**
 * Module-level shared state for the sh3-pipeline app. The toolbar view, the
 * log view, and the GraphViewDescriptor all read/write this. It lives at
 * module scope (created on shard activation) and is cleared on deactivate.
 */
export interface PipelineState {
  /** Doc id currently bound to the graph editor. Empty string = scratch buffer. */
  docId: string;
  /** Current asset shown in the graph editor. Updated on every commit. */
  asset: GraphAsset;
  /** Whether a run is in flight. */
  isRunning: boolean;
  /** Live run log (shared with the log panel). */
  log: RunLog;
  /** Abort controller for the current run. null when nothing's running. */
  abortController: AbortController | null;
}

export function createPipelineState(): PipelineState {
  const state = $state<PipelineState>({
    docId: SCRATCH_DOC_ID,
    asset: emptyAsset(),
    isRunning: false,
    log: createRunLog(),
    abortController: null,
  });
  return state;
}

let active: PipelineState | null = null;

export function setActiveState(state: PipelineState | null): void {
  active = state;
}

export function getActiveState(): PipelineState | null {
  return active;
}
