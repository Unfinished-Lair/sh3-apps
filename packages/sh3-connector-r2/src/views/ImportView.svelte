<script lang="ts">
  import type { Runtime } from '../runtime.svelte';
  import type { BackupTarget } from '../targets';
  import { createR2Client } from '../r2/client';
  import { writeForeign, NotImplementedError } from '../foreign-docs';
  import RemoteTree from './components/RemoteTree.svelte';

  let { rt }: { rt: Runtime } = $props();

  let targetId = $state<string>('');
  type Node = { path: string; size: number; lastModified: string; existsLocal: boolean };
  let nodes = $state<Node[]>([]);
  let selected = $state<Set<string>>(new Set());
  let scanning = $state(false);
  let importing = $state(false);
  let permissionBlocked = $state(false);
  let summary = $state<{ imported: number; skipped: number; failed: number; errors: string[] } | null>(null);

  $effect(() => { if (rt.targets.length > 0 && !targetId) targetId = rt.targets[0].id; });

  async function scan() {
    const target: BackupTarget | undefined = rt.targets.find((t) => t.id === targetId);
    if (!target || !rt.ctx.browse) return;
    summary = null;
    scanning = true;
    try {
      const client = createR2Client(target);
      const localSet = new Set<string>();
      for (const d of await rt.ctx.browse.listDocuments()) localSet.add(`${d.shardId}/${d.path}`);
      const collected: Node[] = [];
      const nextSel = new Set<string>();
      for await (const obj of client.listObjectsV2({ prefix: target.keyPrefix })) {
        const inner = obj.key.slice(target.keyPrefix.length);
        const slash = inner.indexOf('/');
        if (slash < 0) continue;
        const shardId = inner.slice(0, slash);
        const path = inner.slice(slash + 1);
        const existsLocal = localSet.has(`${shardId}/${path}`);
        collected.push({ path: obj.key, size: obj.size, lastModified: obj.lastModified, existsLocal });
        if (!existsLocal) nextSel.add(obj.key);
      }
      nodes = collected;
      selected = nextSel;
    } finally {
      scanning = false;
    }
  }

  function toggle(key: string) {
    if (selected.has(key)) selected.delete(key);
    else selected.add(key);
    selected = new Set(selected);
  }

  async function runImport() {
    const target: BackupTarget | undefined = rt.targets.find((t) => t.id === targetId);
    if (!target) return;
    summary = null;
    importing = true;
    const stats = { imported: 0, skipped: 0, failed: 0, errors: [] as string[] };
    try {
      const client = createR2Client(target);
      const write = writeForeign(rt.ctx);

      for (const key of selected) {
        const node = nodes.find((n) => n.path === key);
        if (!node) continue;
        const inner = key.slice(target.keyPrefix.length);
        const slash = inner.indexOf('/');
        const shardId = inner.slice(0, slash);
        const path = inner.slice(slash + 1);
        if (node.existsLocal) { stats.skipped++; continue; }
        try {
          const content = await client.getObject(key);
          await write(shardId, path, content);
          stats.imported++;
        } catch (err) {
          if (err instanceof NotImplementedError) { permissionBlocked = true; break; }
          stats.failed++;
          stats.errors.push(`${key}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    } finally {
      importing = false;
      summary = stats;
    }
  }
</script>

<div class="r2-import">
  <h2>Import from R2</h2>

  {#if permissionBlocked}
    <div class="warn">
      Import requires the <code>documents:write</code> permission, which is pending upstream
      <a href="https://github.com/Unfinished-Lair/sh3/issues/21" target="_blank" rel="noopener">sh3#21</a>.
      Once that lands and the shard is re-installed, this view will work end-to-end.
    </div>
  {/if}

  {#if rt.targets.length === 0}
    <p>No R2 targets configured. Add one in the Targets tab.</p>
  {:else}
    <label>Target
      <select bind:value={targetId}>
        {#each rt.targets as t (t.id)}<option value={t.id}>{t.label} ({t.bucket})</option>{/each}
      </select>
    </label>
    <button disabled={scanning} onclick={scan}>{scanning ? 'Scanning…' : 'Scan bucket'}</button>

    {#if nodes.length > 0}
      <p>{nodes.length} object{nodes.length === 1 ? '' : 's'} — {selected.size} selected</p>
      <RemoteTree nodes={nodes} selected={selected} onToggle={toggle} />
      <button disabled={importing || selected.size === 0} onclick={runImport}>
        {importing ? 'Importing…' : `Import ${selected.size} object${selected.size === 1 ? '' : 's'}`}
      </button>
    {/if}

    {#if summary}
      <div class="summary">
        Imported: {summary.imported} · Skipped (exists locally): {summary.skipped} · Failed: {summary.failed}
        {#if summary.errors.length > 0}
          <details><summary>Errors</summary><ul>{#each summary.errors as e}<li>{e}</li>{/each}</ul></details>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .r2-import { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
  label { display: flex; flex-direction: column; gap: 2px; max-width: 420px; }
  .warn { background: #5a3a1a; border: 1px solid #a77733; padding: 8px; color: #ffd; }
  .summary { border: 1px solid var(--sh3-border, #2a2a2a); padding: 8px; border-radius: 3px; }
</style>
