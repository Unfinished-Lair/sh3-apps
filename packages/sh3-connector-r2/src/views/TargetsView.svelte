<script lang="ts">
  import type { Runtime } from '../runtime.svelte';
  import type { BackupTarget } from '../targets';
  import { saveTarget, deleteTarget } from '../targets';
  import TargetForm from './components/TargetForm.svelte';
  import CloudflareSetupGuide from './components/CloudflareSetupGuide.svelte';

  let { rt }: { rt: Runtime } = $props();

  let editing = $state<BackupTarget | 'new' | null>(null);
  let showGuide = $state(false);

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

  function openGuide() { showGuide = true; }
  function closeGuide() { showGuide = false; }
</script>

<div class="r2-targets" class:r2-targets--split={showGuide}>
  <div class="r2-targets__main">
    <header>
      <h2>R2 Targets</h2>
      <div class="r2-targets__actions">
        {#if !showGuide}
          <button type="button" onclick={openGuide}>Help</button>
        {/if}
        {#if editing === null}
          <button type="button" onclick={() => (editing = 'new')}>Add target</button>
        {/if}
      </div>
    </header>

    {#if editing === 'new'}
      <TargetForm onSave={onSave} onCancel={() => (editing = null)} onShowGuide={openGuide} />
    {:else if editing && typeof editing !== 'string'}
      <TargetForm initial={editing} onSave={onSave} onCancel={() => (editing = null)} onShowGuide={openGuide} />
    {:else}
      {#if !rt.targetsLoaded}
        <p>Loading…</p>
      {:else if rt.targets.length === 0}
        <p class="muted">No targets yet. Click "Add target" to configure one, or "Help" if you're new to Cloudflare R2.</p>
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
                  <button type="button" onclick={() => (editing = t)}>Edit</button>
                  <button type="button" class="danger" onclick={() => onDelete(t.id)}>Delete</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    {/if}
  </div>

  {#if showGuide}
    <div class="r2-targets__guide">
      <CloudflareSetupGuide onClose={closeGuide} />
    </div>
  {/if}
</div>

<style>
  .r2-targets { padding: 12px; }
  .r2-targets--split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
  }
  @media (max-width: 720px) {
    .r2-targets--split { grid-template-columns: 1fr; }
  }
  header { display: flex; justify-content: space-between; align-items: center; }
  .r2-targets__actions { display: flex; gap: 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--sh3-border, #2a2a2a); }
  .muted { color: var(--sh3-muted, #888); }
  .danger { color: #e66; }
</style>
