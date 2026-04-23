<script lang="ts">
  import type { StyleRow } from '../theme-manager';

  interface Props {
    data: {
      rows: StyleRow[];
      onClickStyle: (id: string) => void;
    };
  }
  let { data }: Props = $props();
</script>

<div class="sh3-style-styles">
  <table>
    <thead>
      <tr><th>Name</th><th>ID</th><th>Kind</th><th>State</th></tr>
    </thead>
    <tbody>
      {#each data.rows as row (row.id)}
        <tr>
          <td>
            <button type="button" onclick={() => data.onClickStyle(row.id)}>
              {row.name}
            </button>
          </td>
          <td>{row.id}</td>
          <td>{row.kind}</td>
          <td>
            {#if row.state === 'active'}
              <span class="dot active" aria-label="active">●</span>
            {:else if row.state === 'preview'}
              <span class="dot preview" aria-label="preview">○</span>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .sh3-style-styles table { border-collapse: collapse; width: 100%; }
  .sh3-style-styles th,
  .sh3-style-styles td { padding: 2px 8px; text-align: left; }
  .sh3-style-styles button {
    background: none;
    border: 0;
    color: var(--shell-link, #6cf);
    cursor: pointer;
    padding: 0;
    font: inherit;
  }
  .sh3-style-styles button:hover { text-decoration: underline; }
  .sh3-style-styles .dot.active { color: var(--shell-accent, #6ea8fe); }
  .sh3-style-styles .dot.preview { color: var(--shell-fg-muted, #9aa0aa); }
</style>
