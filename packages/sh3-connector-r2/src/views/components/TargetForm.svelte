<script lang="ts">
  import type { BackupTarget } from '../../targets';
  import { newTargetId } from '../../targets';
  import { createR2Client } from '../../r2/client';

  type Props = {
    initial?: BackupTarget;
    onSave: (tgt: BackupTarget) => void | Promise<void>;
    onCancel: () => void;
    onShowGuide?: () => void;
  };
  let { initial, onSave, onCancel, onShowGuide }: Props = $props();

  let label = $state(initial?.label ?? '');
  let accountId = $state(initial?.accountId ?? '');
  let bucket = $state(initial?.bucket ?? '');
  let keyPrefix = $state(initial?.keyPrefix ?? '');
  let accessKeyId = $state(initial?.accessKeyId ?? '');
  let secretAccessKey = $state(initial?.secretAccessKey ?? '');
  let busy = $state(false);
  let error = $state<string | null>(null);

  async function submit(e: Event) {
    e.preventDefault();
    error = null;
    busy = true;
    const tgt: BackupTarget = {
      id: initial?.id ?? newTargetId(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      label: label.trim(),
      accountId: accountId.trim(),
      bucket: bucket.trim(),
      region: 'auto',
      keyPrefix: keyPrefix.trim(),
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: secretAccessKey.trim(),
    };
    try {
      await createR2Client(tgt).headBucket();
      await onSave(tgt);
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      busy = false;
    }
  }
</script>

<form class="r2-form" onsubmit={submit}>
  <label>Label<input type="text" bind:value={label} required /></label>
  <label>Cloudflare Account ID<input type="text" bind:value={accountId} required /></label>
  <label>Bucket name<input type="text" bind:value={bucket} required /></label>
  <label>Key prefix (e.g. sh3-laptop/)<input type="text" bind:value={keyPrefix} /></label>
  <label>Access Key ID<input type="password" bind:value={accessKeyId} required /></label>
  <label>Secret Access Key<input type="password" bind:value={secretAccessKey} required /></label>

  {#if error}<p class="r2-form__error">{error}</p>{/if}

  {#if onShowGuide}
    <button type="button" class="r2-form__hint" onclick={onShowGuide}>
      New to Cloudflare R2? Open the setup guide →
    </button>
  {/if}

  <div class="r2-form__actions">
    <button type="button" onclick={onCancel} disabled={busy}>Cancel</button>
    <button type="submit" disabled={busy}>{busy ? 'Validating…' : 'Save & validate'}</button>
  </div>
</form>

<style>
  .r2-form { display: flex; flex-direction: column; gap: 8px; max-width: 480px; padding: 12px; }
  .r2-form label { display: flex; flex-direction: column; gap: 2px; font-size: 0.9em; }
  .r2-form__error { color: #e66; margin: 0; }
  .r2-form__hint {
    align-self: flex-start;
    background: transparent;
    border: none;
    color: var(--sh3-accent, #4a9eff);
    padding: 0;
    font: inherit;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .r2-form__actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }
</style>
