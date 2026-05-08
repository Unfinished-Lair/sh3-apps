<script lang="ts">
  /*
   * DiagnosticPromptModal — first-time prompt asking the user whether the
   * diagnostic panel should dock into the current app's layout or stay
   * silent for this session. The choice is persisted per-app-id in the
   * diagnostic shard's workspace zone.
   *
   * Props:
   *   - appLabel: human label of the active app (for the prompt text)
   *   - onChoose: callback invoked with the user's choice; also responsible
   *     for any side effects (persist + dock). We call `close()` right
   *     after so the modal tears down regardless.
   *
   * The `close` prop is injected by the modal manager (see overlays/modal.ts).
   */

  let {
    appLabel,
    onChoose,
    close,
  }: {
    appLabel: string;
    onChoose: (choice: 'dock' | 'silent') => void;
    close: () => void;
  } = $props();

  function pick(choice: 'dock' | 'silent') {
    onChoose(choice);
    close();
  }
</script>

<div class="body">
  <h2>Diagnostic shard</h2>
  <p>
    Dock the diagnostic panel into <strong>{appLabel}</strong>'s layout,
    or keep it silent for this session? Your choice is remembered per app.
  </p>
  <div class="row">
    <button type="button" onclick={() => pick('dock')}>Dock</button>
    <button type="button" class="secondary" onclick={() => pick('silent')}>Silent</button>
  </div>
</div>

<style>
  .body {
    padding: var(--sh3-pad-lg);
    display: flex;
    flex-direction: column;
    gap: var(--sh3-pad-md);
    min-width: 320px;
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
    border-radius: var(--sh3-radius-sm);
    cursor: pointer;
  }
  button:hover { background: var(--sh3-accent); }
  button.secondary { background: transparent; }
  button.secondary:hover { background: var(--sh3-bg-sunken); }
</style>
