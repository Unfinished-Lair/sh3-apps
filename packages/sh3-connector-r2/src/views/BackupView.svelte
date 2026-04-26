<script lang="ts">
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
    if (!rt.ctx.browse) return;
    shardIds = await rt.ctx.browse.listShards();
    if (!shardId && shardIds.length > 0) shardId = shardIds[0];
  }
  $effect(() => { void refreshShards(); });

  async function refreshLog() {
    recent = await listRecentLog(rt.docs, 50);
  }
  $effect(() => { void refreshLog(); });

  async function run() {
    const target: BackupTarget | undefined = rt.targets.find((t) => t.id === targetId);
    if (!target || !rt.ctx.browse) return;
    if (!shardId) { alert('Pick a shard to back up.'); return; }

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
      const browse = rt.ctx.browse;
      const stats = await backupFolder({
        list: async () => {
          const all = await browse.listDocuments();
          return all.map((d) => ({ shardId: d.shardId, path: d.path }));
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
  {/if}
</div>

<style>
  .r2-backup { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
  label { display: flex; flex-direction: column; gap: 2px; max-width: 420px; }
  select {
    padding: var(--shell-pad-md) var(--shell-pad-lg);
    background: var(--shell-input-bg);
    color: var(--shell-fg);
    border: 1px solid var(--shell-border);
    border-radius: var(--shell-radius);
    font-family: inherit;
    font-size: 0.8125rem;
    line-height: var(--shell-line);
  }
  select:focus-visible {
    border-color: var(--shell-input-border-focus);
    box-shadow: var(--shell-focus-ring);
    outline: none;
  }
  select:disabled { opacity: 0.55; cursor: not-allowed; }
  .r2-log { list-style: none; padding: 0; font-size: 0.85em; }
  .r2-log li { display: grid; grid-template-columns: auto 1fr auto auto; gap: 8px; padding: 2px 0; }
  .r2-log .status-failed { color: #e66; }
  .r2-log .status-skipped-unchanged { color: var(--sh3-muted, #888); }
  .muted { color: var(--sh3-muted, #888); }
</style>
