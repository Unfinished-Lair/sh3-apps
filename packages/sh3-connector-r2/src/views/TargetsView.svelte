<script lang="ts">
  import type { Runtime } from '../runtime.svelte';
  import type { BackupTarget } from '../targets';
  import { saveTarget, deleteTarget } from '../targets';
  import TargetForm from './components/TargetForm.svelte';

  let { rt }: { rt: Runtime } = $props();

  let editing = $state<BackupTarget | 'new' | null>(null);

  async function onSave(tgt: BackupTarget) {
    await saveTarget(rt.docs, tgt);
    await rt.refreshTargets();
    editing = null;
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this target? Existing R2 objects are not removed.')) return;
    await deleteTarget(rt.docs, id);
    await rt.refreshTargets();
  }
</script>

<div class="r2-targets">
  <header>
    <h2>R2 Targets</h2>
    {#if editing === null}
      <button onclick={() => (editing = 'new')}>Add target</button>
    {/if}
  </header>

  {#if editing === 'new'}
    <TargetForm onSave={onSave} onCancel={() => (editing = null)} />
  {:else if editing && typeof editing !== 'string'}
    <TargetForm initial={editing} onSave={onSave} onCancel={() => (editing = null)} />
  {:else}
    {#if !rt.targetsLoaded}
      <p>Loading…</p>
    {:else if rt.targets.length === 0}
      <p class="muted">No targets yet. Click "Add target" to configure one.</p>
    {:else}
      <table>
        <thead><tr><th>Label</th><th>Bucket</th><th>Prefix</th><th></th></tr></thead>
        <tbody>
          {#each rt.targets as t (t.id)}
            <tr>
              <td>{t.label}</td>
              <td>{t.bucket}</td>
              <td>{t.keyPrefix || '(none)'}</td>
              <td>
                <button onclick={() => (editing = t)}>Edit</button>
                <button class="danger" onclick={() => onDelete(t.id)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
</div>

<style>
  .r2-targets { padding: 12px; }
  header { display: flex; justify-content: space-between; align-items: center; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--sh3-border, #2a2a2a); }
  .muted { color: var(--sh3-muted, #888); }
  .danger { color: #e66; }
</style>
