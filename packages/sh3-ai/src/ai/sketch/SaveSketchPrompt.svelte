<script lang="ts">
  import { sh3 } from 'sh3-core';
  import type { DocsStore } from '../docs/store';

  let {
    providerId,
    html,
    store,
    onClose,
  }: {
    providerId: string;
    html: string;
    store: DocsStore;
    onClose: () => void;
  } = $props();

  const NAME_RE = /^[a-zA-Z0-9._-]+$/;

  function defaultName(now = new Date()): string {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `sketch-${y}-${m}-${d}-${hh}${mm}`;
  }

  let mode = $state<'naming' | 'confirming-overwrite'>('naming');
  let name = $state(defaultName());
  let error = $state<string | null>(null);
  let saving = $state(false);

  async function handleSave() {
    error = null;
    const trimmed = name.trim();
    if (!trimmed || !NAME_RE.test(trimmed)) {
      error = 'Name may only contain letters, digits, dot, underscore, dash.';
      return;
    }
    const relPath = `sketches/${trimmed}.html`;
    saving = true;
    try {
      const existing = await store.read(`${providerId}/${relPath}`);
      if (existing !== null) {
        mode = 'confirming-overwrite';
        return;
      }
      await store.write(providerId, relPath, html);
      sh3.toast.notify(`Saved AI Sketch as ${relPath}.`, { level: 'info' });
      onClose();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      saving = false;
    }
  }

  async function handleOverwrite() {
    error = null;
    saving = true;
    try {
      const relPath = `sketches/${name.trim()}.html`;
      await store.write(providerId, relPath, html);
      sh3.toast.notify(`Saved AI Sketch as ${relPath}.`, { level: 'info' });
      onClose();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      mode = 'naming';
    } finally {
      saving = false;
    }
  }
</script>

<div class="save-prompt">
  {#if mode === 'naming'}
    <label>
      Name
      <input bind:value={name} disabled={saving} />
    </label>
    {#if error}<p class="error">{error}</p>{/if}
    <div class="actions">
      <button type="button" disabled={saving} onclick={onClose}>Cancel</button>
      <button type="button" disabled={saving} onclick={handleSave}>Save</button>
    </div>
  {:else}
    <p>A sketch named <code>{name}</code> already exists. Overwrite?</p>
    {#if error}<p class="error">{error}</p>{/if}
    <div class="actions">
      <button type="button" disabled={saving} onclick={() => (mode = 'naming')}>Back</button>
      <button type="button" disabled={saving} onclick={handleOverwrite}>Overwrite</button>
    </div>
  {/if}
</div>

<style>
  .save-prompt {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
  }
  input {
    padding: 4px 6px;
    font-family: var(--mono-font, monospace);
  }
  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  .error {
    color: var(--error, #d23);
    font-size: 12px;
    margin: 0;
  }
  code {
    font-family: var(--mono-font, monospace);
  }
</style>
