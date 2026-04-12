<script lang="ts">
  /*
   * DemoPopupMenu — body of the demo popup shown by the mock view's
   * "Menu" button. Small context-menu-style list. Clicking any item
   * closes the popup and emits a toast so you can see the whole overlay
   * stack cooperating.
   */

  import { shell } from 'sh3-core';

  let { close }: { close: () => void } = $props();

  const items = [
    { label: 'Info toast',    level: 'info'    as const },
    { label: 'Success toast', level: 'success' as const },
    { label: 'Warning toast', level: 'warn'    as const },
    { label: 'Error toast',   level: 'error'   as const },
  ];

  function pick(label: string, level: 'info' | 'success' | 'warn' | 'error') {
    close();
    shell.toast.notify(`${label} from popup`, { level });
  }
</script>

<ul class="menu" role="menu">
  {#each items as { label, level } (label)}
    <li role="none">
      <button type="button" role="menuitem" onclick={() => pick(label, level)}>
        {label}
      </button>
    </li>
  {/each}
</ul>

<style>
  .menu {
    list-style: none;
    margin: 0;
    padding: 4px;
    display: flex;
    flex-direction: column;
    min-width: 160px;
  }
  .menu button {
    width: 100%;
    text-align: left;
    appearance: none;
    background: transparent;
    color: var(--shell-fg);
    border: none;
    font: inherit;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 2px;
    cursor: pointer;
  }
  .menu button:hover {
    background: var(--shell-accent-muted);
  }
</style>
