<script lang="ts">
  /*
   * Log panel — renders the rolling buffer captured in log/capture.svelte.ts.
   *
   * Filter by level, autoscroll-to-bottom toggle, clear, and save-to-doc.
   * Save writes plain text to the diagnostic shard's own document zone via
   * diagnosticContext.docs (which is just ctx.documents).
   */

  import { sh3 } from 'sh3-core';
  import { tick } from 'svelte';
  import { diagnosticContext } from '../diagnosticShard.svelte';
  import {
    logBuffer,
    clearLog,
    serializeLog,
    logFileName,
    type LogLevel,
  } from '../log/capture.svelte';

  const LEVELS: readonly LogLevel[] = ['log', 'info', 'warn', 'error', 'debug'];

  let activeLevels = $state<Record<LogLevel, boolean>>({
    log: true,
    info: true,
    warn: true,
    error: true,
    debug: true,
  });
  let autoscroll = $state(true);
  let saving = $state(false);

  const filtered = $derived(logBuffer.filter((e) => activeLevels[e.level]));

  let listEl: HTMLDivElement | null = $state(null);

  $effect(() => {
    // Track filtered.length so a new entry triggers re-run.
    void filtered.length;
    if (!autoscroll || !listEl) return;
    void tick().then(() => {
      if (listEl) listEl.scrollTop = listEl.scrollHeight;
    });
  });

  function toggleLevel(level: LogLevel) {
    activeLevels[level] = !activeLevels[level];
  }

  async function onSave() {
    if (saving) return;
    saving = true;
    try {
      const docs = diagnosticContext?.docs;
      if (!docs) {
        sh3.toast.notify('Log save unavailable — diagnostic not activated.', { level: 'error' });
        return;
      }
      const path = logFileName();
      await docs.writeText(path, serializeLog(logBuffer));
      sh3.toast.notify(`Saved ${path}`, { level: 'success' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      sh3.toast.notify(`Save failed: ${msg}`, { level: 'error' });
    } finally {
      saving = false;
    }
  }

  function formatTime(ts: number): string {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    return `${hh}:${mm}:${ss}.${ms}`;
  }
</script>

<div class="diagnostic">
  <header>
    <h2>Logs</h2>
    <div class="toolbar">
      <div class="filters">
        {#each LEVELS as level (level)}
          <button
            type="button"
            class="chip {level}"
            class:active={activeLevels[level]}
            onclick={() => toggleLevel(level)}
          >
            {level}
          </button>
        {/each}
      </div>
      <label class="auto">
        <input type="checkbox" bind:checked={autoscroll} />
        autoscroll
      </label>
      <button type="button" class="action" onclick={clearLog}>Clear</button>
      <button type="button" class="action primary" onclick={onSave} disabled={saving || logBuffer.length === 0}>
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
    <p class="muted">{filtered.length} / {logBuffer.length} entries</p>
  </header>

  <div class="list" bind:this={listEl}>
    {#each filtered as entry (entry.id)}
      <div class="row {entry.level}">
        <span class="time">{formatTime(entry.ts)}</span>
        <span class="level">{entry.level}</span>
        <span class="text">{entry.text}</span>
      </div>
    {:else}
      <p class="empty">No entries match the current filter.</p>
    {/each}
  </div>
</div>

<style>
  .diagnostic {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: 12px 16px;
    background: var(--sh3-grad-bg, var(--sh3-bg));
    color: var(--sh3-fg);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
  }
  header {
    flex: 0 0 auto;
    margin-bottom: 8px;
  }
  h2 {
    margin: 0 0 8px;
    color: var(--sh3-accent);
    font-size: 14px;
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .filters {
    display: flex;
    gap: 4px;
  }
  .chip {
    background: transparent;
    color: var(--sh3-fg-muted);
    border: 1px solid var(--sh3-fg-muted);
    border-radius: 10px;
    padding: 2px 8px;
    font: inherit;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.5px;
  }
  .chip.active {
    color: var(--sh3-bg);
    background: var(--sh3-fg);
    border-color: var(--sh3-fg);
  }
  .chip.warn.active { background: #c89a2c; border-color: #c89a2c; }
  .chip.error.active { background: #c94a4a; border-color: #c94a4a; }
  .chip.info.active { background: var(--sh3-accent); border-color: var(--sh3-accent); }
  .auto {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--sh3-fg-muted);
    cursor: pointer;
  }
  .action {
    background: transparent;
    color: var(--sh3-fg);
    border: 1px solid var(--sh3-fg-muted);
    border-radius: 4px;
    padding: 2px 10px;
    font: inherit;
    cursor: pointer;
  }
  .action:hover:not(:disabled) {
    border-color: var(--sh3-accent);
    color: var(--sh3-accent);
  }
  .action.primary {
    border-color: var(--sh3-accent);
    color: var(--sh3-accent);
  }
  .action:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .muted {
    margin: 4px 0 0;
    color: var(--sh3-fg-muted);
  }
  .list {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    background: var(--sh3-bg);
    border: 1px solid var(--sh3-fg-muted);
    border-radius: 4px;
    padding: 4px 6px;
  }
  .row {
    display: grid;
    grid-template-columns: max-content max-content 1fr;
    gap: 8px;
    padding: 1px 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .row .time { color: var(--sh3-fg-muted); }
  .row .level {
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.5px;
    color: var(--sh3-fg-muted);
  }
  .row.warn .level { color: #c89a2c; }
  .row.error .level { color: #c94a4a; }
  .row.error .text { color: #e57373; }
  .row.info .level { color: var(--sh3-accent); }
  .empty {
    color: var(--sh3-fg-muted);
    margin: 8px 4px;
  }
</style>
