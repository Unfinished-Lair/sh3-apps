<script lang="ts">
  import type { EditorIndentType, UserPrefs } from '../types';

  interface Props {
    indentType: EditorIndentType;
    prefs: UserPrefs;
    onChange: (next: UserPrefs) => void;
    onClose: () => void;
  }

  let { indentType, prefs, onChange, onClose }: Props = $props();

  let panelEl: HTMLDivElement | undefined = $state();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  function handleOutsideClick(e: MouseEvent) {
    if (panelEl && !panelEl.contains(e.target as Node)) onClose();
  }

  $effect(() => {
    window.addEventListener('mousedown', handleOutsideClick, true);
    window.addEventListener('keydown', handleKeydown, true);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick, true);
      window.removeEventListener('keydown', handleKeydown, true);
    };
  });

  function setIndentUnit(v: number) {
    onChange({ ...prefs, indentUnit: v });
  }

  function setBraceStyle(v: 'inline' | 'allman') {
    onChange({ ...prefs, braceStyle: v });
  }
</script>

<div class="settings-panel" bind:this={panelEl} role="dialog" aria-label="Editor settings">
  <div class="row">
    <span class="label">Indent unit</span>
    <div class="seg">
      <button class:active={(prefs.indentUnit ?? 2) === 2} onclick={() => setIndentUnit(2)}>2</button>
      <button class:active={(prefs.indentUnit ?? 2) === 4} onclick={() => setIndentUnit(4)}>4</button>
    </div>
  </div>

  {#if indentType === 'brace'}
    <div class="row">
      <span class="label">Brace style</span>
      <div class="seg">
        <button
          class:active={(prefs.braceStyle ?? 'inline') === 'inline'}
          onclick={() => setBraceStyle('inline')}
        >Inline</button>
        <button
          class:active={(prefs.braceStyle ?? 'inline') === 'allman'}
          onclick={() => setBraceStyle('allman')}
        >Allman</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .settings-panel {
    position: absolute;
    top: 32px;
    right: 8px;
    z-index: 10;
    background: var(--shell-bg-raised);
    border: 1px solid var(--shell-border);
    border-radius: 4px;
    padding: 8px 10px;
    min-width: 200px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    font-family: var(--shell-font-ui);
    font-size: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .label {
    color: var(--shell-fg-muted);
  }

  .seg {
    display: inline-flex;
    border: 1px solid var(--shell-border);
    border-radius: 3px;
    overflow: hidden;
  }

  .seg button {
    padding: 2px 8px;
    background: var(--shell-bg);
    color: var(--shell-fg);
    border: none;
    font-size: 11px;
    cursor: pointer;
  }

  .seg button + button {
    border-left: 1px solid var(--shell-border);
  }

  .seg button.active {
    background: var(--shell-accent);
    color: var(--shell-bg);
  }

  .seg button:hover:not(.active) {
    background: var(--shell-bg-sunken);
  }
</style>
