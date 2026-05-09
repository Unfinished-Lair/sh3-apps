<script lang="ts">
  import { sh3 } from 'sh3-core';
  import type { DocsStore } from '../docs/store';
  import type { RenderMode } from './state';
  import { SH3_INLINE_MARKER } from './tools';

  let {
    providerId,
    html,
    mode,
    store,
    onClose,
  }: {
    providerId: string;
    html: string;
    mode: RenderMode;
    store: DocsStore;
    onClose: () => void;
  } = $props();

  function bodyToWrite(): string {
    if (mode !== 'inline') return html;
    if (html.slice(0, 200).includes('sh3:inline')) return html;
    return `${SH3_INLINE_MARKER}\n${html}`;
  }

  const NAME_RE = /^[a-zA-Z0-9._-]+$/;

  function defaultName(now = new Date()): string {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `sketch-${y}-${m}-${d}-${hh}${mm}`;
  }

  let promptMode = $state<'naming' | 'confirming-overwrite'>('naming');
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
        promptMode = 'confirming-overwrite';
        return;
      }
      await store.write(providerId, relPath, bodyToWrite());
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
      await store.write(providerId, relPath, bodyToWrite());
      sh3.toast.notify(`Saved AI Sketch as ${relPath}.`, { level: 'info' });
      onClose();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      promptMode = 'naming';
    } finally {
      saving = false;
    }
  }
</script>

<div class="save-prompt">
  {#if promptMode === 'naming'}
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
      <button type="button" disabled={saving} onclick={() => (promptMode = 'naming')}>Back</button>
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
