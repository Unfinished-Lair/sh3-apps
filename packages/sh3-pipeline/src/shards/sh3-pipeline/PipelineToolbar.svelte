<script lang="ts">
  import type { PipelineState } from './state.svelte';

  let {
    state,
    onRun,
    onStop,
    onNew,
    onSave,
  }: {
    state: PipelineState;
    onRun: () => void;
    onStop: () => void;
    onNew: () => void;
    onSave: () => void;
  } = $props();

  let canRun = $derived(state.asset.nodes.some((n) => n.type === 'start'));
</script>

<div class="pipeline-toolbar">
  <button onclick={onRun}  disabled={!canRun || state.isRunning}>Run</button>
  <button onclick={onStop} disabled={!state.isRunning}>Stop</button>
  <span class="sep"></span>
  <button onclick={onNew}>New</button>
  <button onclick={onSave} disabled={!state.docId}>Save</button>
  <span class="docid" title={state.docId}>{state.docId || '(unsaved)'}</span>
</div>

<style>
  .pipeline-toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 100%;
    padding: 0 8px;
    background: var(--shell-bg, #1a1a1a);
    color: var(--shell-fg, #eee);
    font-family: var(--shell-font-ui);
    font-size: 12px;
    border-bottom: 1px solid var(--shell-fg-subtle, #333);
  }
  .sep {
    width: 1px;
    height: 16px;
    background: var(--shell-fg-subtle, #333);
    margin: 0 4px;
  }
  button {
    padding: 3px 10px;
    background: var(--shell-bg-elevated, #2a2a2a);
    color: var(--shell-fg, #eee);
    border: 1px solid var(--shell-fg-subtle, #333);
    border-radius: 3px;
    cursor: pointer;
    font: inherit;
  }
  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .docid {
    margin-left: auto;
    font-family: var(--shell-font-mono);
    font-size: 11px;
    color: var(--shell-fg-muted, #888);
    max-width: 320px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
