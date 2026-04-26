<script lang="ts">
  import type { Runtime } from '../runtime.svelte';
  import type { BackupTarget } from '../targets';
  import { walkScope } from '../walker';
  import { upload } from '../upload';
  import { createR2Client } from '../r2/client';
  import { readForeign } from '../foreign-docs';
  import { backupFolder, type BackupFolderProgress } from '../backup-folder';

  type Phase = 'preview' | 'running' | 'done';

  let {
    rt,
    shardId,
    pathPrefix,
    onClose,
  }: {
    rt: Runtime;
    shardId: string;
    pathPrefix: string;
    onClose: () => void;
  } = $props();

  let recursive = $state(true);
  let recursiveCount = $state<number | null>(null);
  let directCount = $state<number | null>(null);
  let targetId = $state<string>(rt.targets[0]?.id ?? '');
  let phase = $state<Phase>('preview');
  let progress = $state<BackupFolderProgress | null>(null);
  let summary = $state<{ uploaded: number; skipped: number; failed: number; errors: string[] } | null>(null);

  const folderLabel = $derived(pathPrefix ? pathPrefix.replace(/\/$/, '').split('/').pop() ?? pathPrefix : '(shard root)');
  const previewCount = $derived(recursive ? recursiveCount : directCount);

  async function refreshCounts() {
    if (!rt.ctx.browse) return;
    const browse = rt.ctx.browse;
    const list = async () => {
      const all = await browse.listDocuments();
      return all.map((d) => ({ shardId: d.shardId, path: d.path }));
    };
    const prefix = pathPrefix.endsWith('/') || pathPrefix === '' ? pathPrefix : `${pathPrefix}/`;
    const recurseStats = await walkScope({
      list,
      scope: { shardId, pathPrefix: prefix, recursive: true },
      onItem: async () => 'skipped-unchanged',
    });
    const directStats = await walkScope({
      list,
      scope: { shardId, pathPrefix: prefix, recursive: false },
      onItem: async () => 'skipped-unchanged',
    });
    recursiveCount = recurseStats.total;
    directCount = directStats.total;
  }

  $effect(() => { void refreshCounts(); });

  async function confirm() {
    const target: BackupTarget | undefined = rt.targets.find((t) => t.id === targetId);
    if (!target || !rt.ctx.browse) return;
    phase = 'running';
    progress = null;
    const browse = rt.ctx.browse;
    const client = createR2Client(target);
    const read = readForeign(rt.ctx);
    const prefix = pathPrefix.endsWith('/') || pathPrefix === '' ? pathPrefix : `${pathPrefix}/`;
    const stats = await backupFolder({
      list: async () => {
        const all = await browse.listDocuments();
        return all.map((d) => ({ shardId: d.shardId, path: d.path }));
      },
      shardId,
      pathPrefix: prefix || undefined,
      recursive,
      upload: async (item) => {
        const res = await upload({
          target,
          client,
          logHandle: rt.docs,
          readForeign: read,
          shardId: item.shardId,
          path: item.path,
          sourceTenant: rt.ctx.tenantId,
        });
        if (res.status === 'uploaded' && res.entry) rt.recordBadgeUpload(res.entry);
        return res;
      },
      onProgress: (snap) => { progress = snap; },
    });
    summary = { uploaded: stats.uploaded, skipped: stats.skipped, failed: stats.failed, errors: stats.errors };
    phase = 'done';
  }
</script>

<div class="r2-folder-dialog__backdrop" role="presentation" onclick={onClose}>
  <div class="r2-folder-dialog" role="dialog" aria-modal="true" onclick={(e) => e.stopPropagation()}>
    <header>
      <h2>Back up "{folderLabel}" to R2</h2>
    </header>

    {#if phase === 'preview'}
      {#if rt.targets.length === 0}
        <p>No R2 targets configured. Open the R2 Backup app to add one.</p>
      {:else}
        {#if rt.targets.length > 1}
          <label>Target
            <select bind:value={targetId}>
              {#each rt.targets as t (t.id)}<option value={t.id}>{t.label} ({t.bucket})</option>{/each}
            </select>
          </label>
        {/if}

        <label class="r2-folder-dialog__check">
          <input type="checkbox" bind:checked={recursive} />
          Include subfolders
        </label>

        <p class="r2-folder-dialog__count">
          {#if previewCount === null}
            Counting…
          {:else if previewCount === 0}
            0 documents will be uploaded.
          {:else}
            {previewCount} document{previewCount === 1 ? '' : 's'} will be uploaded.
          {/if}
        </p>
      {/if}

      <footer>
        <button onclick={onClose}>Cancel</button>
        <button
          class="primary"
          disabled={rt.targets.length === 0 || previewCount === 0 || previewCount === null || !targetId}
          onclick={confirm}
        >
          Back up
        </button>
      </footer>
    {:else if phase === 'running'}
      <p>{progress?.currentLabel ?? 'Starting…'}</p>
      <p>{progress?.processed ?? 0} / {progress?.total ?? 0}</p>
    {:else}
      <p>
        {summary?.uploaded} uploaded, {summary?.skipped} skipped, {summary?.failed} failed.
      </p>
      {#if summary && summary.errors.length > 0}
        <ul class="r2-folder-dialog__errors">
          {#each summary.errors as err}<li>{err}</li>{/each}
        </ul>
      {/if}
      <footer>
        <button class="primary" onclick={onClose}>Close</button>
      </footer>
    {/if}
  </div>
</div>

<style>
  .r2-folder-dialog__backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  .r2-folder-dialog {
    background: var(--shell-bg, #1e1e1e);
    color: var(--shell-fg, #ddd);
    border: 1px solid var(--shell-border, #444);
    border-radius: var(--shell-radius, 4px);
    padding: 16px;
    min-width: 360px;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .r2-folder-dialog header h2 { margin: 0; font-size: 1rem; }
  .r2-folder-dialog__check { display: flex; align-items: center; gap: 6px; }
  .r2-folder-dialog__count { color: var(--shell-fg-muted, #888); margin: 0; }
  .r2-folder-dialog__errors { font-size: 0.85em; color: #e66; margin: 4px 0 0; padding-left: 18px; }
  .r2-folder-dialog footer { display: flex; justify-content: flex-end; gap: 6px; margin-top: 6px; }
  .r2-folder-dialog button {
    background: var(--shell-bg-elevated, #2a2a2a);
    color: inherit;
    border: 1px solid var(--shell-border, #444);
    padding: 4px 12px;
    font: inherit;
    cursor: pointer;
    border-radius: var(--shell-radius-sm, 3px);
  }
  .r2-folder-dialog button.primary { border-color: var(--shell-accent, #4a90e2); }
  .r2-folder-dialog button[disabled] { opacity: 0.5; cursor: not-allowed; }
  .r2-folder-dialog label { display: flex; flex-direction: column; gap: 2px; }
</style>
