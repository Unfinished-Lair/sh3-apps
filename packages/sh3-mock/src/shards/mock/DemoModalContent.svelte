<script lang="ts">
  /*
   * DemoModalContent — body of the demo modal opened by the mock view's
   * "Open modal" button. Used to prove the phase-5 modal stack: it has a
   * button that opens another modal on top of itself. Escape should close
   * them one at a time, top to bottom.
   */

  import { sh3 } from 'sh3-core';
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
    sh3.modal.open(Self, { depth: depth + 1 }, { boxStyle: randomModalBoxStyle() });
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
    padding: var(--sh3-pad-lg);
    display: flex;
    flex-direction: column;
    gap: var(--sh3-pad-md);
  }
  h2 {
    margin: 0;
    font-size: 16px;
    color: var(--sh3-fg);
  }
  p {
    margin: 0;
    color: var(--sh3-fg-muted);
    font-size: 13px;
    line-height: 1.5;
  }
  kbd {
    font-family: var(--sh3-font-mono);
    font-size: 11px;
    padding: 1px 4px;
    border: 1px solid var(--sh3-border-strong);
    border-radius: 2px;
    background: var(--sh3-bg-sunken);
  }
  .row {
    display: flex;
    gap: var(--sh3-pad-sm);
  }
  button {
    appearance: none;
    font: inherit;
    font-size: 12px;
    padding: var(--sh3-pad-sm) var(--sh3-pad-md);
    background: var(--sh3-accent-muted);
    color: var(--sh3-fg);
    border: 1px solid var(--sh3-border-strong);
    border-radius: 3px;
    cursor: pointer;
  }
  button:hover { background: var(--sh3-accent); }
  button.secondary {
    background: transparent;
  }
  button.secondary:hover {
    background: var(--sh3-bg-sunken);
  }
</style>
