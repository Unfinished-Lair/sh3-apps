<script lang="ts">
  import type { EditorIndentType, UserPrefs } from '../types';

  interface Props {
    indentType: EditorIndentType;
    prefs: UserPrefs;
    onChange: (next: UserPrefs) => void;
    close: () => void;
  }

  let { indentType, prefs, onChange, close }: Props = $props();

  let current = $state<UserPrefs>({ ...prefs });

  function setIndentUnit(v: number) {
    current.indentUnit = v;
    onChange({ ...current });
  }

  function setBraceStyle(v: 'inline' | 'allman') {
    current.braceStyle = v;
    onChange({ ...current });
  }
</script>

<div class="body">
  <h2>Editor settings</h2>

  <div class="rows">
    <div class="row">
      <span class="label">Indent unit</span>
      <div class="seg">
        <button
          type="button"
          class:active={(current.indentUnit ?? 2) === 2}
          onclick={() => setIndentUnit(2)}
        >2</button>
        <button
          type="button"
          class:active={(current.indentUnit ?? 2) === 4}
          onclick={() => setIndentUnit(4)}
        >4</button>
      </div>
    </div>

    {#if indentType === 'brace'}
      <div class="row">
        <span class="label">Brace style</span>
        <div class="seg">
          <button
            type="button"
            class:active={(current.braceStyle ?? 'inline') === 'inline'}
            onclick={() => setBraceStyle('inline')}
          >Inline</button>
          <button
            type="button"
            class:active={(current.braceStyle ?? 'inline') === 'allman'}
            onclick={() => setBraceStyle('allman')}
          >Allman</button>
        </div>
      </div>
    {/if}
  </div>

  <div class="actions">
    <button type="button" class="secondary" onclick={close}>Close</button>
  </div>
</div>

<style>
  .body {
    padding: var(--sh3-pad-lg);
    display: flex;
    flex-direction: column;
    gap: var(--sh3-pad-md);
    min-width: 320px;
    font-family: var(--sh3-font-ui);
  }

  h2 {
    margin: 0;
    font-size: 16px;
    color: var(--sh3-fg);
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: var(--sh3-pad-sm);
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sh3-pad-md);
    font-size: 13px;
  }

  .label {
    color: var(--sh3-fg-muted);
  }

  .seg {
    display: inline-flex;
    border: 1px solid var(--sh3-border);
    border-radius: var(--sh3-radius-sm);
    overflow: hidden;
  }

  .seg button {
    appearance: none;
    font: inherit;
    padding: 4px 10px;
    background: var(--sh3-bg);
    color: var(--sh3-fg);
    border: none;
    font-size: 12px;
    cursor: pointer;
  }

  .seg button + button {
    border-left: 1px solid var(--sh3-border);
  }

  .seg button.active {
    background: var(--sh3-accent);
    color: var(--sh3-bg);
  }

  .seg button:hover:not(.active) {
    background: var(--sh3-bg-sunken);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--sh3-pad-sm);
  }

  .actions button {
    appearance: none;
    font: inherit;
    font-size: 12px;
    padding: var(--sh3-pad-sm) var(--sh3-pad-md);
    background: var(--sh3-accent-muted);
    color: var(--sh3-fg);
    border: 1px solid var(--sh3-border-strong);
    border-radius: var(--sh3-radius-sm);
    cursor: pointer;
  }

  .actions button:hover {
    background: var(--sh3-accent);
  }

  .actions button.secondary {
    background: transparent;
  }

  .actions button.secondary:hover {
    background: var(--sh3-bg-sunken);
  }
</style>
