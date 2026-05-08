<script lang="ts">
  interface Props {
    state: {
      systemInstruction: string;
      titleStrategy: 'first-message' | 'llm-summarize';
    };
  }

  // Rename `state` → `user` on destructure: a local variable named `state`
  // collides with Svelte 5's `$state` rune detection when the prop is also
  // bind-mutated through nested keys.
  let { state: user }: Props = $props();
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
</style>
