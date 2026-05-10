<script lang="ts">
  import type { ShardContext, FieldAddress, FieldView } from 'sh3-core';
  import ContextPicker from './ContextPicker.svelte';
  import { buildPrompt as buildPromptFn, type ContextEntry } from './prompt';
  import { addrKey } from './picker';

  type RunStream = (
    prompt: string,
    signal: AbortSignal,
    onChunk: (text: string) => void,
  ) => Promise<string>;

  interface Props {
    ctx: ShardContext;
    addr: FieldAddress;
    fv: FieldView;
    runEditStream: RunStream;
    onClose: () => void;
  }
  let { ctx, addr, fv, runEditStream, onClose }: Props = $props();

  type Phase =
    | { kind: 'idle' }
    | { kind: 'streaming'; partial: string }
    | { kind: 'validate-2pane'; proposal: string }
    | { kind: 'validate-3pane'; proposal: string; current: string; choice: 'original' | 'current' | 'proposal' }
    | { kind: 'error'; message: string };

  const original = String(ctx.sh3.fields.get(addr) ?? '');
  let prompt = $state('');
  let selectedAddrs = $state<FieldAddress[]>([]);
  let phase = $state<Phase>({ kind: 'idle' });
  let abortCtrl: AbortController | null = null;

  function buildPrompt(): string {
    const all = ctx.sh3.fields.list();
    const contexts: ContextEntry[] = [];
    for (const a of selectedAddrs) {
      const k = addrKey(a);
      const fv = all.find((f) => addrKey(f) === k);
      if (!fv) continue;
      contexts.push({
        shardId: fv.shardId,
        slotId: fv.slotId,
        fieldId: fv.fieldId,
        label: fv.label,
        kind: fv.kind,
        value: ctx.sh3.fields.get(a),
      });
    }
    return buildPromptFn({ original, instruction: prompt, contexts });
  }

  async function run(): Promise<void> {
    if (!prompt.trim()) return;
    abortCtrl?.abort();
    abortCtrl = new AbortController();
    phase = { kind: 'streaming', partial: '' };
    try {
      const final = await runEditStream(buildPrompt(), abortCtrl.signal, (text) => {
        phase = { kind: 'streaming', partial: text };
      });
      phase = { kind: 'validate-2pane', proposal: final };
    } catch (err) {
      if (abortCtrl.signal.aborted) return;
      const message = err instanceof Error ? err.message : String(err);
      phase = { kind: 'error', message };
    }
  }

  function cancel(): void {
    abortCtrl?.abort();
    abortCtrl = null;
    onClose();
  }

  async function accept2(): Promise<void> {
    if (phase.kind !== 'validate-2pane') return;
    const current = String(ctx.sh3.fields.get(addr) ?? '');
    if (current !== original) {
      phase = {
        kind: 'validate-3pane',
        proposal: phase.proposal,
        current,
        choice: 'proposal',
      };
      return;
    }
    await commitValue(phase.proposal);
  }

  async function accept3(): Promise<void> {
    if (phase.kind !== 'validate-3pane') return;
    const pick =
      phase.choice === 'original' ? original :
      phase.choice === 'current'  ? phase.current :
                                    phase.proposal;
    await commitValue(pick);
  }

  async function commitValue(value: string): Promise<void> {
    try {
      await ctx.sh3.fields.set(addr, value);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      phase = { kind: 'error', message };
    }
  }

  function discard(): void {
    onClose();
  }

  function refine(): void {
    phase = { kind: 'idle' };
  }

  function dismissError(): void {
    phase = { kind: 'idle' };
  }
</script>

<div class="edit-root">
  <div class="header">
    <span class="label" title={fv.label}>{fv.label}</span>
    <span class="kind">{fv.kind}</span>
  </div>

  {#if phase.kind === 'idle'}
    <div class="body">
      <label class="prompt-label" for="ai-edit-prompt">Instruction</label>
      <textarea
        id="ai-edit-prompt"
        class="prompt"
        bind:value={prompt}
        placeholder="rewrite this more cleanly, fix orthography…"
        rows={4}
      ></textarea>
      <ContextPicker {ctx} excludeAddr={addr} bind:selected={selectedAddrs} />
      <details class="orig">
        <summary>Original ({original.length} chars)</summary>
        <pre>{original}</pre>
      </details>
    </div>
    <div class="footer">
      <button type="button" class="ghost" onclick={cancel}>Cancel</button>
      <button type="button" class="primary" disabled={!prompt.trim()} onclick={run}>Run</button>
    </div>
  {:else if phase.kind === 'streaming'}
    <div class="body">
      <div class="status">Streaming…</div>
      <pre class="proposal">{phase.partial}</pre>
    </div>
    <div class="footer">
      <button type="button" class="ghost" onclick={cancel}>Cancel</button>
    </div>
  {:else if phase.kind === 'validate-2pane'}
    <div class="body">
      <div class="diff">
        <div class="pane">
          <div class="pane-label">Original</div>
          <pre>{original}</pre>
        </div>
        <div class="pane">
          <div class="pane-label">Proposal</div>
          <pre>{phase.proposal}</pre>
        </div>
      </div>
    </div>
    <div class="footer">
      <button type="button" class="ghost" onclick={discard}>Discard</button>
      <button type="button" class="ghost" onclick={refine}>Refine</button>
      <button type="button" class="primary" onclick={accept2}>Accept</button>
    </div>
  {:else if phase.kind === 'validate-3pane'}
    <div class="body">
      <div class="status warn">
        Field changed while the AI was thinking — pick which value to keep.
      </div>
      <div class="picker">
        <label>
          <input type="radio" bind:group={phase.choice} value="original" />
          <span class="pane-label">Original</span>
          <pre>{original}</pre>
        </label>
        <label>
          <input type="radio" bind:group={phase.choice} value="current" />
          <span class="pane-label">Your edit</span>
          <pre>{phase.current}</pre>
        </label>
        <label>
          <input type="radio" bind:group={phase.choice} value="proposal" />
          <span class="pane-label">AI proposal</span>
          <pre>{phase.proposal}</pre>
        </label>
      </div>
    </div>
    <div class="footer">
      <button type="button" class="ghost" onclick={discard}>Discard</button>
      <button type="button" class="primary" onclick={accept3}>Accept</button>
    </div>
  {:else if phase.kind === 'error'}
    <div class="body">
      <div class="status error">{phase.message}</div>
    </div>
    <div class="footer">
      <button type="button" class="ghost" onclick={discard}>Close</button>
      <button type="button" class="primary" onclick={dismissError}>Try again</button>
    </div>
  {/if}
</div>

<style>
  .edit-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--sh3-bg, #1e1e1e);
    color: var(--sh3-fg, #e0e0e0);
    font-family: var(--sh3-font-ui, system-ui, sans-serif);
    font-size: 12px;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-bottom: 1px solid var(--sh3-border, #2a2a2a);
    flex-shrink: 0;
  }
  .label {
    font-weight: 600;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .kind {
    color: var(--sh3-fg-muted, #888);
    font-family: var(--sh3-font-mono, monospace);
    font-size: 11px;
  }
  .body {
    flex: 1;
    padding: 8px 10px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    padding: 6px 10px;
    border-top: 1px solid var(--sh3-border, #2a2a2a);
    flex-shrink: 0;
  }
  .prompt-label {
    color: var(--sh3-fg-muted, #888);
    font-size: 11px;
  }
  .prompt {
    width: 100%;
    box-sizing: border-box;
    background: var(--sh3-bg-sunken, #161616);
    color: var(--sh3-fg, #e0e0e0);
    border: 1px solid var(--sh3-border, #2a2a2a);
    border-radius: 3px;
    padding: 4px 6px;
    font: inherit;
    resize: vertical;
  }
  .prompt:focus {
    outline: none;
    border-color: var(--sh3-accent, #61afef);
  }
  .orig summary {
    color: var(--sh3-fg-muted, #888);
    cursor: pointer;
    font-size: 11px;
  }
  .orig pre, .proposal, .pane pre, .picker pre {
    margin: 4px 0 0 0;
    padding: 6px 8px;
    background: var(--sh3-bg-sunken, #161616);
    border: 1px solid var(--sh3-border, #2a2a2a);
    border-radius: 3px;
    font-family: var(--sh3-font-mono, monospace);
    font-size: 11px;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 160px;
    overflow: auto;
  }
  .status {
    font-size: 11px;
    color: var(--sh3-fg-muted, #888);
  }
  .status.warn { color: var(--sh3-warn, #d19a66); }
  .status.error { color: var(--sh3-error, #ff7a7a); }
  .diff {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .pane-label {
    font-size: 10px;
    color: var(--sh3-fg-muted, #888);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .picker {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .picker label {
    display: block;
    cursor: pointer;
    padding: 4px;
    border: 1px solid transparent;
    border-radius: 3px;
  }
  .picker label:hover {
    border-color: var(--sh3-border, #2a2a2a);
  }
  button {
    appearance: none;
    border: 1px solid var(--sh3-border, #2a2a2a);
    background: var(--sh3-bg-sunken, #161616);
    color: var(--sh3-fg, #e0e0e0);
    padding: 4px 10px;
    border-radius: 3px;
    cursor: pointer;
    font: inherit;
  }
  button.primary {
    background: var(--sh3-accent, #61afef);
    color: var(--sh3-fg-on-accent, #fff);
    border-color: transparent;
  }
  button.primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  button.ghost:hover {
    background: var(--sh3-bg, #1e1e1e);
  }
</style>
