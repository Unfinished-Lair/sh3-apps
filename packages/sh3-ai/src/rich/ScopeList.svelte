<script lang="ts">
  interface Props {
    data: {
      scopes: Array<{ id: string; label: string; isActive: boolean }>;
      onSelectScope: (id: string) => void;
    };
  }
  let { data }: Props = $props();
</script>

<div class="sh3-ai-scopes">
  <table>
    <thead>
      <tr><th></th><th>ID</th><th>Label</th></tr>
    </thead>
    <tbody>
      {#each data.scopes as scope (scope.id)}
        <tr class:active={scope.isActive}>
          <td class="dot">{scope.isActive ? '●' : ''}</td>
          <td>
            <button
              type="button"
              disabled={scope.isActive}
              onclick={() => data.onSelectScope(scope.id)}
            >
              {scope.id}
            </button>
          </td>
          <td>{scope.label}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .sh3-ai-scopes table { border-collapse: collapse; width: 100%; }
  .sh3-ai-scopes th,
  .sh3-ai-scopes td { padding: 2px 8px; text-align: left; }
  .sh3-ai-scopes td.dot { width: 1em; text-align: center; }
  .sh3-ai-scopes button {
    background: none;
    border: 0;
    color: var(--sh3-link, #6cf);
    cursor: pointer;
    padding: 0;
    font: inherit;
  }
  .sh3-ai-scopes button:hover:not(:disabled) { text-decoration: underline; }
  .sh3-ai-scopes button:disabled {
    color: var(--sh3-fg-muted, #9aa0aa);
    cursor: default;
  }
  .sh3-ai-scopes tr.active td.dot { color: var(--sh3-accent, #6ea8fe); }
</style>
