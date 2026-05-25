<script lang="ts">
  import { sh3 } from 'sh3-core';
  import type { Runtime } from '../runtime.svelte';
  import type { BackupTarget } from '../targets';
  import { listRecentLog, type UploadLogEntry } from '../upload-log';
  import { upload } from '../upload';
  import { createR2Client } from '../r2/client';
  import { readForeign } from '../foreign-docs';
  import { backupFolder } from '../backup-folder';
  import Progress from './components/Progress.svelte';

  let { rt }: { rt: Runtime } = $props();

  let targetId = $state<string>('');
  let shardId = $state<string>('');
  let pathPrefix = $state<string>('');
  let shardIds = $state<string[]>([]);
  let recent = $state<UploadLogEntry[]>([]);

  $effect(() => {
    if (rt.targets.length > 0 && !targetId) targetId = rt.targets[0].id;
  });

  async function refreshShards() {
    // sh3-core 0.26: top-level folders in the active scope are bound ids.
    shardIds = await rt.docs.listFolders('');
    if (!shardId && shardIds.length > 0) shardId = shardIds[0];
  }
  $effect(() => { void refreshShards(); });

  async function refreshLog() {
    recent = await listRecentLog(rt.docs, 50);
  }
  $effect(() => { void refreshLog(); });

  async function run() {
    const target: BackupTarget | undefined = rt.targets.find((t) => t.id === targetId);
    if (!target) return;
    if (!shardId) { sh3.toast.notify('Pick a shard to back up.', { level: 'warn' }); return; }

    rt.progress.running = true;
    rt.progress.currentLabel = '';
    rt.progress.total = 0;
    rt.progress.processed = 0;
    rt.progress.uploaded = 0;
    rt.progress.skipped = 0;
    rt.progress.failed = 0;
    rt.progress.errors = [];

    try {
      const client = createR2Client(target);
      const read = readForeign(rt.ctx);
      const docs = rt.docs;
      const stats = await backupFolder({
        list: async () => {
          // sh3-core 0.26: list() returns scope-rooted paths `<shardId>/<rest>`.
          const all = await docs.list();
          return all.map((m) => {
            const slash = m.path.indexOf('/');
            return slash < 0
              ? { shardId: m.path, path: '' }
              : { shardId: m.path.slice(0, slash), path: m.path.slice(slash + 1) };
          });
        },
        shardId,
        pathPrefix: pathPrefix || undefined,
        recursive: true,
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
        onProgress: (snap) => {
          rt.progress.currentLabel = snap.currentLabel;
          rt.progress.total = snap.total;
          rt.progress.processed = snap.processed;
          rt.progress.uploaded = snap.uploaded;
          rt.progress.skipped = snap.skipped;
          rt.progress.failed = snap.failed;
        },
      });
      rt.progress.errors = stats.errors;
    } finally {
      rt.progress.running = false;
      await refreshLog();
    }
  }
</script>

<div class="r2-backup">
  <h2>Back up to R2</h2>

  {#if rt.targets.length === 0}
    <p>No R2 targets configured. Add one in the Targets tab.</p>
  {:else}
    <label>Target
      <select bind:value={targetId}>
        {#each rt.targets as t (t.id)}<option value={t.id}>{t.label} ({t.bucket})</option>{/each}
      </select>
    </label>

    <label>Shard
      <select bind:value={shardId}>
        {#each shardIds as s}<option value={s}>{s}</option>{/each}
      </select>
    </label>

    <label>Path prefix (optional)
      <input type="text" bind:value={pathPrefix} placeholder="e.g. journal/" />
    </label>

    <button disabled={rt.progress.running} onclick={run}>
      {rt.progress.running ? 'Running…' : 'Back up now'}
    </button>

    <Progress p={rt.progress} />

    <h3>Recent activity</h3>
    <div class="log-wrap">
      {#if recent.length === 0}
        <p class="muted">No uploads yet.</p>
      {:else}
        <ul class="r2-log">
          {#each recent as entry}
            <li class={`status-${entry.status}`}>
              <span class="ts">{entry.at}</span>
              <span class="path">{entry.shardId}/{entry.path}</span>
              <span class="status">{entry.status}</span>
              {#if entry.reason}<span class="reason">— {entry.reason}</span>{/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>

<style>
  .r2-backup {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    min-height: 0;
    box-sizing: border-box;
  }
  label { display: flex; flex-direction: column; gap: 2px; max-width: 420px; flex: 0 0 auto; }
  .log-wrap { flex: 1 1 auto; min-height: 0; overflow: auto; border: 1px solid var(--sh3-border, #2a2a2a); border-radius: 3px; padding: 8px; }
  select {
    padding: var(--sh3-pad-md) var(--sh3-pad-lg);
    background: var(--sh3-input-bg);
    color: var(--sh3-fg);
    border: 1px solid var(--sh3-border);
    border-radius: var(--sh3-radius);
    font-family: inherit;
    font-size: 0.8125rem;
    line-height: var(--sh3-line);
  }
  select:focus-visible {
    border-color: var(--sh3-input-border-focus);
    box-shadow: var(--sh3-focus-ring);
    outline: none;
  }
  select:disabled { opacity: 0.55; cursor: not-allowed; }
  .r2-log { list-style: none; padding: 0; font-size: 0.85em; }
  .r2-log li { display: grid; grid-template-columns: auto 1fr auto auto; gap: 8px; padding: 2px 0; }
  .r2-log .status-failed { color: #e66; }
  .r2-log .status-skipped-unchanged { color: var(--sh3-muted, #888); }
  .muted { color: var(--sh3-muted, #888); }
</style>
