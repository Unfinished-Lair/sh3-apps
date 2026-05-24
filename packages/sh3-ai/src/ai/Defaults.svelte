<script lang="ts">
  interface Props {
    state: {
      systemInstruction: string;
      titleStrategy: 'first-message' | 'llm-summarize';
      idleTimeoutMs: number;
      showReasoning: boolean;
    };
  }

  // Rename `state` → `user` on destructure: a local variable named `state`
  // collides with Svelte 5's `$state` rune detection when the prop is also
  // bind-mutated through nested keys.
  let { state: user }: Props = $props();

  // Snap points for the idle-timeout slider. `0` is the rightmost stop
  // ("No limit") — providers treat 0/undefined as "no internal watchdog".
  const IDLE_STOPS: ReadonlyArray<{ ms: number; label: string }> = [
    { ms: 30_000, label: '30s' },
    { ms: 60_000, label: '1m' },
    { ms: 120_000, label: '2m' },
    { ms: 300_000, label: '5m' },
    { ms: 600_000, label: '10m' },
    { ms: 0, label: 'No limit' },
  ];

  function indexFor(ms: number): number {
    const exact = IDLE_STOPS.findIndex((s) => s.ms === ms);
    if (exact >= 0) return exact;
    // Closest non-zero match; fall back to default (60s = index 1).
    let best = 1;
    let bestDiff = Number.POSITIVE_INFINITY;
    IDLE_STOPS.forEach((s, i) => {
      if (s.ms === 0) return;
      const d = Math.abs(s.ms - ms);
      if (d < bestDiff) { bestDiff = d; best = i; }
    });
    return best;
  }

  let idleIndex = $derived(indexFor(user.idleTimeoutMs));
  let idleLabel = $derived(IDLE_STOPS[idleIndex].label);

  function onIdleSliderInput(e: Event) {
    const i = Number((e.currentTarget as HTMLInputElement).value);
    user.idleTimeoutMs = IDLE_STOPS[i].ms;
  }
</script>

<section class="ai-defaults">
  <h2>System instruction</h2>
  <p class="note">
    Shared across every AI provider. Sent on every chat turn — Gemini wraps it
    in <code>systemInstruction.parts</code>; OpenAI-compatible providers (DeepSeek)
    prepend it as a <code>role:'system'</code> message. Empty = no system message
    is sent.
  </p>
  <label class="field">
    <span class="visually-hidden">System instruction</span>
    <textarea
      bind:value={user.systemInstruction}
      placeholder="Optional. Steer model behavior — e.g., 'You are a concise assistant.'"
      rows="6"
      spellcheck="false"
    ></textarea>
  </label>

  <hr />

  <h2>Conversation title strategy</h2>
  <p class="note">
    How sh3-ai picks the title for a fresh conversation after the first turn.
  </p>
  <div class="radio-group">
    <label>
      <input
        type="radio"
        class="sh3-base-radio"
        name="titleStrategy"
        value="first-message"
        checked={user.titleStrategy === 'first-message'}
        onchange={() => (user.titleStrategy = 'first-message')}
      />
      <span>First user message</span>
      <span class="help">Truncate the first prompt and use it as the title.</span>
    </label>
    <label>
      <input
        type="radio"
        class="sh3-base-radio"
        name="titleStrategy"
        value="llm-summarize"
        checked={user.titleStrategy === 'llm-summarize'}
        onchange={() => (user.titleStrategy = 'llm-summarize')}
      />
      <span>LLM summary</span>
      <span class="help">Ask the active provider to summarize the first exchange.</span>
    </label>
  </div>

  <hr />

  <h2>Streaming idle timeout</h2>
  <p class="note">
    How long to wait between chunks before assuming the request is stuck.
    The timer resets on every token, reasoning chunk, or tool call — a
    model that thinks for a long time but produces output in bursts will
    not trip it. Pick <em>No limit</em> for thinking-heavy models if even
    10 minutes isn't enough.
  </p>
  <div class="idle-slider">
    <input
      type="range"
      min="0"
      max={IDLE_STOPS.length - 1}
      step="1"
      value={idleIndex}
      oninput={onIdleSliderInput}
      aria-label="Streaming idle timeout"
      aria-valuetext={idleLabel}
    />
    <span class="idle-value">{idleLabel}</span>
  </div>
  <div class="idle-ticks" aria-hidden="true">
    {#each IDLE_STOPS as stop, i}
      <span class:current={i === idleIndex}>{stop.label}</span>
    {/each}
  </div>

  <hr />

  <h2>Show reasoning</h2>
  <p class="note">
    Display the model's chain-of-thought in the shell scrollback inside a
    collapsed "Thinking…" disclosure. Applies to providers that emit
    reasoning (Claude extended thinking, DeepSeek
    <code>reasoning_content</code>). When off, the reasoning is still
    accumulated internally so tool-use continuation works — it's just not
    rendered.
  </p>
  <label class="checkbox-row">
    <input
      type="checkbox"
      bind:checked={user.showReasoning}
    />
    <span>Show reasoning</span>
  </label>
</section>

<style>
  .ai-defaults {
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 36rem;
  }
  .note,
  .help {
    margin: 0;
    color: var(--sh3-fg-muted, inherit);
    font-size: 0.9em;
  }
  code {
    font-family: var(--sh3-mono, ui-monospace, monospace);
    font-size: 0.95em;
  }
  hr {
    border: 0;
    border-top: 1px solid var(--sh3-border, rgba(127, 127, 127, 0.3));
    margin: 0.5rem 0;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  textarea {
    width: 100%;
    padding: 0.4rem 0.5rem;
    font: inherit;
    font-family: var(--sh3-mono, ui-monospace, monospace);
    resize: vertical;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .radio-group label {
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: baseline;
    gap: 0.4rem 0.5rem;
    cursor: pointer;
  }
  .radio-group input {
    grid-row: 1;
    grid-column: 1;
  }
  .idle-slider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .idle-slider input[type='range'] {
    flex: 1;
  }
  .idle-value {
    min-width: 4.5rem;
    text-align: right;
    font-family: var(--sh3-mono, ui-monospace, monospace);
    font-variant-numeric: tabular-nums;
  }
  .idle-ticks {
    display: flex;
    justify-content: space-between;
    font-size: 0.75em;
    color: var(--sh3-fg-muted, inherit);
    margin-top: -0.25rem;
  }
  .idle-ticks .current {
    color: var(--sh3-fg, inherit);
    font-weight: 600;
  }
  .checkbox-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
</style>
