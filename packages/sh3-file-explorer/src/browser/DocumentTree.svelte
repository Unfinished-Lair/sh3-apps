<script lang="ts">
  import type { ExplorerStore, BrowseEntry } from '../explorerShard.svelte';

  let { store }: { store: ExplorerStore } = $props();

  type FolderNode = { kind: 'folder'; name: string; path: string; shardId: string; children: TreeNode[] };
  type FileNode = { kind: 'file'; name: string; path: string; shardId: string };
  type TreeNode = FolderNode | FileNode;

  type BuildState = { folders: Map<string, { node: FolderNode; state: BuildState }>; files: FileNode[] };

  function emptyState(): BuildState {
    return { folders: new Map(), files: [] };
  }

  function materialize(state: BuildState): TreeNode[] {
    const folders = [...state.folders.values()].map(({ node, state: sub }) => {
      node.children = materialize(sub);
      return node;
    });
    folders.sort((a, b) => a.name.localeCompare(b.name));
    const files = [...state.files].sort((a, b) => a.name.localeCompare(b.name));
    return [...folders, ...files];
  }

  function buildShardTree(shardId: string, entries: BrowseEntry[]): TreeNode[] {
    const root = emptyState();
    for (const e of entries) {
      const parts = e.path.split('/').filter(Boolean);
      if (parts.length === 0) continue;
      let cursor = root;
      let prefix = '';
      for (let i = 0; i < parts.length; i++) {
        const name = parts[i];
        prefix = prefix ? `${prefix}/${name}` : name;
        const isLast = i === parts.length - 1;
        if (isLast) {
          cursor.files.push({ kind: 'file', name, path: e.path, shardId });
        } else {
          let entry = cursor.folders.get(name);
          if (!entry) {
            entry = {
              node: { kind: 'folder', name, path: prefix, shardId, children: [] },
              state: emptyState(),
            };
            cursor.folders.set(name, entry);
          }
          cursor = entry.state;
        }
      }
    }
    return materialize(root);
  }

  const tree = $derived.by((): FolderNode[] => {
    if (!store.ready) return [];
    const byShard = new Map<string, BrowseEntry[]>();
    for (const d of store.documents) {
      const arr = byShard.get(d.shardId) ?? [];
      arr.push(d);
      byShard.set(d.shardId, arr);
    }
    const out: FolderNode[] = [];
    for (const [shardId, entries] of [...byShard.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      out.push({
        kind: 'folder',
        name: shardId,
        path: '',
        shardId,
        children: buildShardTree(shardId, entries),
      });
    }
    return out;
  });

  function keyFor(node: TreeNode) { return `${node.shardId}:${node.path}`; }

  function onToggle(node: TreeNode) {
    if (node.kind !== 'folder') return;
    store.toggleExpanded(keyFor(node));
  }

  function onSelect(node: TreeNode) {
    if (!store.ready) return;
    store.setSelection({ shardId: node.shardId, path: node.path });
  }
</script>

{#snippet treeNode(node: TreeNode, depth: number)}
  <li style="padding-left: {depth * 12}px">
    {#if node.kind === 'folder'}
      <button class="sh3-fe-node" onclick={() => onToggle(node)}>
        {store.ready && store.isExpanded(keyFor(node)) ? '▾' : '▸'} {node.name || '(root)'}/
      </button>
      {#if store.ready && store.isExpanded(keyFor(node))}
        <ul>
          {#each node.children as child (keyFor(child))}
            {@render treeNode(child, depth + 1)}
          {/each}
        </ul>
      {/if}
    {:else}
      <button
        class="sh3-fe-node sh3-fe-node--file"
        class:selected={store.ready && store.selection?.shardId === node.shardId && store.selection?.path === node.path}
        onclick={() => onSelect(node)}
      >
        {node.name}
      </button>
    {/if}
  </li>
{/snippet}

{#if !store.ready}
  <p class="sh3-fe-empty">{store.error.message}</p>
{:else if tree.length === 0}
  <p class="sh3-fe-empty">No documents in this tenant.</p>
{:else}
  <ul class="sh3-fe-tree">
    {#each tree as node (keyFor(node))}
      {@render treeNode(node, 0)}
    {/each}
  </ul>
{/if}

<style>
  .sh3-fe-tree, .sh3-fe-tree ul { list-style: none; padding: 0; margin: 0; }
  .sh3-fe-node { background: none; border: 0; color: var(--shell-fg); cursor: pointer; padding: 2px 4px; text-align: left; width: 100%; font: inherit; }
  .sh3-fe-node:hover { background: var(--shell-bg-elevated); }
  .sh3-fe-node.selected { background: var(--shell-accent-muted); }
  .sh3-fe-empty { color: var(--shell-fg-muted); padding: 8px; }
</style>
