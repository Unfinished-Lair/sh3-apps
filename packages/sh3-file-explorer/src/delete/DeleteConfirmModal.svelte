<script lang="ts">
  import { onMount } from 'svelte';
  import type { PreviewState } from './readPreview';

  let {
    target,
    previewText,
    previewState,
    onConfirm,
    onCancel,
  }: {
    target: { shardId: string; path: string; kind: 'file' | 'folder'; descendantCount?: number };
    previewText: string | null;
    previewState: PreviewState;
    onConfirm: () => void;
    onCancel: () => void;
  } = $props();

  let cancelBtn = $state<HTMLButtonElement | null>(null);

  onMount(() => {
    cancelBtn?.focus();
  });

  function onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') { ev.preventDefault(); onCancel(); }
    else if (ev.key === 'Enter') { ev.preventDefault(); onConfirm(); }
  }

  const previewPlaceholder = $derived(
    previewState === 'binary' ? previewText :
    previewState === 'missing' ? '(file no longer exists)' :
    previewState === 'error'   ? '(unable to read for preview)' :
    previewState === 'empty'   ? '(empty file)' :
    null,
  );

  const folderMessage = $derived(
    target.kind === 'folder'
      ? `This will delete /${target.path} and its ${target.descendantCount ?? 0} descendants. This cannot be undone.`
      : null,
  );
</script>

<svelte:window onkeydown={onKeydown} />

<div class="sh3-fe-delete">
  <h2>{target.kind === 'folder' ? 'Delete folder?' : 'Delete file?'}</h2>
  <div class="sh3-fe-delete__path">
    <span class="sh3-fe-delete__shard">{target.shardId}</span>
    <span class="sh3-fe-delete__sep">/</span>
    <span class="sh3-fe-delete__name">{target.path}</span>
  </div>

  {#if target.kind === 'folder'}
    <p class="sh3-fe-delete__warn">{folderMessage}</p>
  {:else if previewState === 'text' && previewText !== null}
    <pre class="sh3-fe-delete__preview">{previewText}</pre>
  {:else if previewPlaceholder !== null}
    <p class="sh3-fe-delete__preview-placeholder">{previewPlaceholder}</p>
  {/if}

  <div class="sh3-fe-delete__actions">
    <button bind:this={cancelBtn} type="button" class="sh3-fe-delete__cancel" onclick={onCancel}>Cancel</button>
    <button type="button" class="sh3-fe-delete__confirm" onclick={onConfirm}>Delete</button>
  </div>
</div>

<style>
  .sh3-fe-delete { padding: 16px; min-width: 360px; max-width: 560px; color: var(--shell-fg); }
  .sh3-fe-delete h2 { margin: 0 0 8px; font-size: 1.1em; }
  .sh3-fe-delete__path { display: flex; gap: 4px; align-items: baseline; margin-bottom: 12px; font-family: var(--shell-font-mono, monospace); font-size: 0.95em; }
  .sh3-fe-delete__shard { color: var(--shell-fg-muted); }
  .sh3-fe-delete__sep { color: var(--shell-fg-muted); }
  .sh3-fe-delete__name { color: var(--shell-fg); }
  .sh3-fe-delete__warn { color: var(--shell-fg); margin: 12px 0; }
  .sh3-fe-delete__preview { background: var(--shell-bg-elevated, #2a2a2a); border: 1px solid var(--shell-border, #444); border-radius: var(--shell-radius-sm, 3px); padding: 8px; margin: 8px 0 12px; max-height: 220px; overflow: auto; white-space: pre; font-family: var(--shell-font-mono, monospace); font-size: 0.85em; color: var(--shell-fg); }
  .sh3-fe-delete__preview-placeholder { color: var(--shell-fg-muted); font-style: italic; margin: 8px 0 12px; }
  .sh3-fe-delete__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
  .sh3-fe-delete__cancel,
  .sh3-fe-delete__confirm { font: inherit; padding: 6px 14px; border-radius: var(--shell-radius-sm, 3px); cursor: pointer; border: 1px solid var(--shell-border); }
  .sh3-fe-delete__cancel { background: var(--shell-bg-elevated); color: var(--shell-fg); }
  .sh3-fe-delete__cancel:hover { background: var(--shell-accent-muted); }
  .sh3-fe-delete__confirm { background: var(--shell-danger, #c0392b); color: #fff; border-color: var(--shell-danger, #c0392b); }
  .sh3-fe-delete__confirm:hover { filter: brightness(1.1); }
</style>
