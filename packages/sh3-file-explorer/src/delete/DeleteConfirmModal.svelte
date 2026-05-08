<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
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

  // sh3-core's modal manager owns the document-level Escape listener and
  // closes the topmost modal without invoking our handlers. Fire onCancel
  // here so the confirmDelete() promise settles on manager-driven dismissal;
  // the wrapper's `settled` guard makes this idempotent for button paths.
  onDestroy(() => {
    onCancel();
  });

  function onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') { ev.preventDefault(); onConfirm(); }
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

<div class="sh3-fe-delete" onkeydown={onKeydown}>
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
  .sh3-fe-delete { padding: 16px; min-width: 360px; max-width: 560px; color: var(--sh3-fg); }
  .sh3-fe-delete h2 { margin: 0 0 8px; font-size: 1.1em; }
  .sh3-fe-delete__path { display: flex; gap: 4px; align-items: baseline; margin-bottom: 12px; font-family: var(--sh3-font-mono, monospace); font-size: 0.95em; }
  .sh3-fe-delete__shard { color: var(--sh3-fg-muted); }
  .sh3-fe-delete__sep { color: var(--sh3-fg-muted); }
  .sh3-fe-delete__name { color: var(--sh3-fg); }
  .sh3-fe-delete__warn { color: var(--sh3-fg); margin: 12px 0; }
  .sh3-fe-delete__preview { background: var(--sh3-bg-elevated, #2a2a2a); border: 1px solid var(--sh3-border, #444); border-radius: var(--sh3-radius-sm, 3px); padding: 8px; margin: 8px 0 12px; max-height: 220px; overflow: auto; white-space: pre; font-family: var(--sh3-font-mono, monospace); font-size: 0.85em; color: var(--sh3-fg); }
  .sh3-fe-delete__preview-placeholder { color: var(--sh3-fg-muted); font-style: italic; margin: 8px 0 12px; }
  .sh3-fe-delete__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
  .sh3-fe-delete__cancel,
  .sh3-fe-delete__confirm { font: inherit; padding: 6px 14px; border-radius: var(--sh3-radius-sm, 3px); cursor: pointer; border: 1px solid var(--sh3-border); }
  .sh3-fe-delete__cancel { background: var(--sh3-bg-elevated); color: var(--sh3-fg); }
  .sh3-fe-delete__cancel:hover { background: var(--sh3-accent-muted); }
  .sh3-fe-delete__confirm { background: var(--sh3-danger, #c0392b); color: #fff; border-color: var(--sh3-danger, #c0392b); }
  .sh3-fe-delete__confirm:hover { filter: brightness(1.1); }
</style>
