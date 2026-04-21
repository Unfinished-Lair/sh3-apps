<script lang="ts">
  import { shell, type DocStatus } from 'sh3-core';
  import type { Runtime } from '../runtime.svelte';
  import type { BackupTarget } from '../targets';
  import { createR2Client } from '../r2/client';
  import { readForeign, writeForeign, MissingCapabilityError } from '../foreign-docs';
  import { presentImportConflicts, type ImportConflictInput } from '../conflicts';
  import RemoteTree from './components/RemoteTree.svelte';

  let { rt }: { rt: Runtime } = $props();

  let targetId = $state<string>('');
  type Node = {
    path: string;
    size: number;
    lastModified: string;
    existsLocal: boolean;
    shardId: string;
    docPath: string;
    localContent?: string;
    localStatus?: DocStatus;
    binaryUnsupported?: boolean;
  };
  type Stats = {
    imported: number;
    resolvedLocal: number;
    resolvedIncoming: number;
    skipped: number;
    cancelled: number;
    failed: number;
    errors: string[];
  };
  function emptyStats(): Stats {
    return { imported: 0, resolvedLocal: 0, resolvedIncoming: 0, skipped: 0, cancelled: 0, failed: 0, errors: [] };
  }

  let nodes = $state<Node[]>([]);
  let selected = $state<Set<string>>(new Set());
  let scanning = $state(false);
  let importing = $state(false);
  let permissionBlocked = $state(false);
  let summary = $state<Stats | null>(null);

  const conflictsAvailable = typeof shell?.conflicts?.resolve === 'function';

  const selectedNodes = $derived(nodes.filter((n) => selected.has(n.path)));
  const selectedNew = $derived(selectedNodes.filter((n) => !n.existsLocal));
  const selectedExistingUsable = $derived(
    selectedNodes.filter((n) => n.existsLocal && !n.binaryUnsupported),
  );
  const selectedExistingBinary = $derived(
    selectedNodes.filter((n) => n.existsLocal && n.binaryUnsupported),
  );

  const canImportNew = $derived(
    selectedNew.length > 0 && selectedExistingUsable.length === 0 && selectedExistingBinary.length === 0,
  );
  const canImportUpdated = $derived(
    conflictsAvailable && selectedExistingUsable.length > 0 && selectedNew.length === 0,
  );
  const canImportMixed = $derived(
    conflictsAvailable && selectedNew.length > 0 && selectedExistingUsable.length > 0,
  );

  $effect(() => { if (rt.targets.length > 0 && !targetId) targetId = rt.targets[0].id; });

  async function scan() {
    const target: BackupTarget | undefined = rt.targets.find((t) => t.id === targetId);
    if (!target || !rt.ctx.browse) return;
    summary = null;
    scanning = true;
    try {
      const client = createR2Client(target);
      const read = readForeign(rt.ctx);
      const statusFrom = rt.ctx.browse.statusFrom;
      const localSet = new Set<string>();
      for (const d of await rt.ctx.browse.listDocuments()) localSet.add(`${d.shardId}/${d.path}`);

      const collected: Node[] = [];
      const nextSel = new Set<string>();
      for await (const obj of client.listObjectsV2({ prefix: target.keyPrefix })) {
        const inner = obj.key.slice(target.keyPrefix.length);
        const slash = inner.indexOf('/');
        if (slash < 0) continue;
        const shardId = inner.slice(0, slash);
        const docPath = inner.slice(slash + 1);
        const existsLocal = localSet.has(`${shardId}/${docPath}`);

        let localContent: string | undefined;
        let localStatus: DocStatus | undefined;
        let binaryUnsupported = false;
        if (existsLocal) {
          try {
            const c = await read(shardId, docPath);
            localContent = c ?? '';
          } catch (err) {
            if (err instanceof MissingCapabilityError) {
              permissionBlocked = true;
              scanning = false;
              return;
            }
            binaryUnsupported = true;
          }
          if (statusFrom) {
            try {
              const s = await statusFrom(shardId, docPath);
              if (s) localStatus = s;
            } catch {
              // defensive; fall back to defaults at use-site
            }
          }
        }

        collected.push({
          path: obj.key,
          size: obj.size,
          lastModified: obj.lastModified,
          existsLocal,
          shardId,
          docPath,
          localContent,
          localStatus,
          binaryUnsupported: binaryUnsupported || undefined,
        });
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

  async function writeNew(
    client: ReturnType<typeof createR2Client>,
    write: (shardId: string, path: string, content: string) => Promise<void>,
    stats: Stats,
    newNodes: Node[],
  ): Promise<boolean> {
    for (const node of newNodes) {
      try {
        const content = await client.getObject(node.path);
        await write(node.shardId, node.docPath, content);
        stats.imported++;
      } catch (err) {
        if (err instanceof MissingCapabilityError) {
          permissionBlocked = true;
          return false;
        }
        stats.failed++;
        stats.errors.push(`${node.path}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    return true;
  }

  async function writeExisting(
    target: BackupTarget,
    client: ReturnType<typeof createR2Client>,
    write: (shardId: string, path: string, content: string) => Promise<void>,
    stats: Stats,
    existingUsable: Node[],
    existingBinary: Node[],
  ): Promise<boolean> {
    for (const node of existingBinary) {
      stats.failed++;
      stats.errors.push(`${node.path}: binary not supported`);
    }
    if (existingUsable.length === 0) return true;
    if (!shell?.conflicts) return true;

    const inputs: ImportConflictInput[] = [];
    for (const node of existingUsable) {
      try {
        const incoming = await client.getObject(node.path);
        const parsed = Date.parse(node.lastModified);
        inputs.push({
          shardId: node.shardId,
          path: node.docPath,
          localContent: node.localContent ?? '',
          localVersion: node.localStatus?.version ?? 1,
          localAt: node.localStatus?.lastSyncedAt ?? 0,
          incomingContent: incoming,
          incomingAt: Number.isFinite(parsed) ? parsed : Date.now(),
          targetLabel: target.label,
          remoteKey: node.path,
        });
      } catch (err) {
        stats.failed++;
        stats.errors.push(`${node.path}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    if (inputs.length === 0) return true;

    const decisions = await presentImportConflicts(shell.conflicts, inputs);
    if (decisions === 'cancelled') {
      stats.cancelled += inputs.length;
      return true;
    }

    const byRemoteKey = new Map(inputs.map((i) => [i.remoteKey, i] as const));
    for (const d of decisions) {
      if (d.choice === 'local') {
        stats.resolvedLocal++;
      } else if (d.choice === 'skipped') {
        stats.skipped++;
      } else {
        const input = byRemoteKey.get(d.remoteKey);
        if (!input) continue;
        try {
          await write(d.shardId, d.path, input.incomingContent);
          stats.resolvedIncoming++;
        } catch (err) {
          if (err instanceof MissingCapabilityError) {
            permissionBlocked = true;
            return false;
          }
          stats.failed++;
          stats.errors.push(`${d.shardId}/${d.path}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
    return true;
  }

  async function runImport(mode: 'new' | 'updated' | 'mixed') {
    const target: BackupTarget | undefined = rt.targets.find((t) => t.id === targetId);
    if (!target) return;
    summary = null;
    importing = true;
    const stats = emptyStats();
    try {
      const client = createR2Client(target);
      const write = writeForeign(rt.ctx);
      if (mode === 'new' || mode === 'mixed') {
        const ok = await writeNew(client, write, stats, selectedNew);
        if (!ok) return;
      }
      if (mode === 'updated' || mode === 'mixed') {
        await writeExisting(
          target,
          client,
          write,
          stats,
          selectedExistingUsable,
          mode === 'updated' ? selectedExistingBinary : [],
        );
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
      Import requires the <code>documents:write</code> permission (sh3-core 0.9.1+).
      Reinstall the shard and grant this permission when prompted.
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
      <RemoteTree {nodes} {selected} onToggle={toggle} />

      <div class="actions">
        <button disabled={importing || !canImportNew} onclick={() => runImport('new')}>
          {importing ? 'Importing…' : `Import New (${selectedNew.length})`}
        </button>
        <button
          disabled={importing || !canImportUpdated}
          title={!conflictsAvailable ? 'Requires sh3-core 0.10.4+' : ''}
          onclick={() => runImport('updated')}
        >
          {importing ? 'Importing…' : `Import Updated (${selectedExistingUsable.length})`}
        </button>
        <button
          disabled={importing || !canImportMixed}
          title={!conflictsAvailable ? 'Requires sh3-core 0.10.4+' : ''}
          onclick={() => runImport('mixed')}
        >
          {importing ? 'Importing…' : `Import Selected`}
        </button>
      </div>
    {/if}

    {#if summary}
      <div class="summary">
        Imported: {summary.imported}
        · Kept local: {summary.resolvedLocal}
        · Applied remote: {summary.resolvedIncoming}
        · Skipped: {summary.skipped}
        · Cancelled: {summary.cancelled}
        · Failed: {summary.failed}
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
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
</style>
