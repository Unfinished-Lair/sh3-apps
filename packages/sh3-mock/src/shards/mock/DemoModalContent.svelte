<script lang="ts">
  /*
   * DemoModalContent — body of the demo modal opened by the mock view's
   * "Open modal" button. Used to prove the phase-5 modal stack: it has a
   * button that opens another modal on top of itself. Escape should close
   * them one at a time, top to bottom.
   */

  import { shell } from 'sh3-core';
  import Self from './DemoModalContent.svelte';
  import { randomModalBoxStyle } from './randomModalStyle';

  let {
    depth,
    close,
  }: {
    depth: number;
    close: () => void;
  } = $props();

  function openAnother() {
    shell.modal.open(Self, { depth: depth + 1 }, { boxStyle: randomModalBoxStyle() });
  }
</script>

<div class="body">
  <h2>Modal #{depth}</h2>
  <p>
    This modal was opened by the phase-5 overlay manager.
    Press <kbd>Escape</kbd> to dismiss the topmost modal, or use the buttons.
  </p>
  <div class="row">
    <button type="button" onclick={openAnother}>Stack another modal</button>
    <button type="button" class="secondary" onclick={close}>Close this one</button>
  </div>
</div>

<style>
  .body {
    padding: var(--shell-pad-lg);
    display: flex;
    flex-direction: column;
    gap: var(--shell-pad-md);
  }
  h2 {
    margin: 0;
    font-size: 16px;
    color: var(--shell-fg);
  }
  p {
    margin: 0;
    color: var(--shell-fg-muted);
    font-size: 13px;
    line-height: 1.5;
  }
  kbd {
    font-family: var(--shell-font-mono);
    font-size: 11px;
    padding: 1px 4px;
    border: 1px solid var(--shell-border-strong);
    border-radius: 2px;
    background: var(--shell-bg-sunken);
  }
  .row {
    display: flex;
    gap: var(--shell-pad-sm);
  }
  button {
    appearance: none;
    font: inherit;
    font-size: 12px;
    padding: var(--shell-pad-sm) var(--shell-pad-md);
    background: var(--shell-accent-muted);
    color: var(--shell-fg);
    border: 1px solid var(--shell-border-strong);
    border-radius: 3px;
    cursor: pointer;
  }
  button:hover { background: var(--shell-accent); }
  button.secondary {
    background: transparent;
  }
  button.secondary:hover {
    background: var(--shell-bg-sunken);
  }
</style>
