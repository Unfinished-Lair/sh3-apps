<script lang="ts">
  let {
    open,
    title,
    message,
    onconfirm,
    oncancel,
  }: {
    open: boolean;
    title: string;
    message: string;
    onconfirm: () => void;
    oncancel: () => void;
  } = $props();
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="overlay" onclick={oncancel}>
    <div class="dialog" onclick={(e) => e.stopPropagation()}>
      <h3>{title}</h3>
      <p>{message}</p>
      <div class="actions">
        <button class="btn cancel" onclick={oncancel}>Cancel</button>
        <button class="btn confirm" onclick={onconfirm}>Clear</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .dialog {
    background: var(--shell-bg-elevated);
    border: 1px solid var(--shell-border);
    border-radius: 8px;
    padding: 16px 20px;
    min-width: 300px;
    max-width: 400px;
    color: var(--shell-fg);
    font-family: var(--shell-font-ui);
  }
  .dialog h3 {
    margin: 0 0 8px;
    font-size: 14px;
  }
  .dialog p {
    margin: 0 0 16px;
    font-size: var(--shell-font-size);
    color: var(--shell-fg-muted);
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  .btn {
    all: unset;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
  }
  .cancel {
    background: var(--shell-bg-sunken);
    color: var(--shell-fg);
  }
  .cancel:hover {
    background: var(--shell-border);
  }
  .confirm {
    background: #ff6b6b;
    color: #fff;
  }
  .confirm:hover {
    background: #ff5252;
  }
</style>
