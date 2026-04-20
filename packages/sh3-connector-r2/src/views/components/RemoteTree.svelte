<script lang="ts">
  type Node = { path: string; size: number; lastModified: string; existsLocal: boolean };
  type Props = {
    nodes: Node[];
    selected: Set<string>;
    onToggle: (path: string) => void;
  };
  let { nodes, selected, onToggle }: Props = $props();
</script>

<table class="r2-tree">
  <thead><tr><th></th><th>Key</th><th>Size</th><th>Modified</th></tr></thead>
  <tbody>
    {#each nodes as n (n.path)}
      <tr class={n.existsLocal ? 'exists' : ''}>
        <td><input type="checkbox" class="shell-base-check" checked={selected.has(n.path)} onchange={() => onToggle(n.path)} /></td>
        <td>
          {n.path}
          {#if n.existsLocal}<span class="badge" title="Already exists locally — unchecked by default to protect local copy">local</span>{/if}
        </td>
        <td>{n.size}</td>
        <td>{n.lastModified}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .r2-tree { width: 100%; border-collapse: collapse; font-size: 0.9em; }
  th, td { text-align: left; padding: 4px 8px; border-bottom: 1px solid var(--sh3-border, #2a2a2a); }
  tr.exists { color: var(--sh3-muted, #888); }
  .badge { margin-left: 6px; background: var(--sh3-surface, #1a1a1a); padding: 0 6px; border-radius: 2px; font-size: 0.75em; }
</style>
