<script lang="ts">
  import type { ExplorerStore, BrowseEntry } from '../explorerShard.svelte';

  let { store }: { store: ExplorerStore } = $props();

  type FolderNode = { kind: 'folder'; name: string; path: string; shardId: string; descendantCount: number; children: TreeNode[] };
  type FileNode = { kind: 'file'; name: string; path: string; shardId: string; lastModified: number };
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
          cursor.files.push({ kind: 'file', name, path: e.path, shardId, lastModified: e.lastModified });
        } else {
          let entry = cursor.folders.get(name);
          if (!entry) {
            entry = {
              node: { kind: 'folder', name, path: prefix, shardId, descendantCount: 0, children: [] },
              state: emptyState(),
            };
            cursor.folders.set(name, entry);
          }
          cursor = entry.state;
        }
      }
    }
    const tree = materialize(root);
    annotateDescendants(tree);
    return tree;
  }

  function annotateDescendants(nodes: TreeNode[]): number {
    let total = 0;
    for (const node of nodes) {
      if (node.kind === 'folder') {
        const sub = annotateDescendants(node.children);
        node.descendantCount = sub;
        total += sub;
      } else {
        total += 1;
      }
    }
    return total;
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
        descendantCount: entries.length,
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

  function onSelectFile(node: FileNode) {
    if (!store.ready) return;
    store.setSelection({ shardId: node.shardId, path: node.path, kind: 'file' });
  }

  function onSelectFolder(node: FolderNode) {
    if (!store.ready) return;
    store.setSelection({ shardId: node.shardId, path: node.path, kind: 'folder' });
  }
</script>

{#snippet treeNode(node: TreeNode, depth: number)}
  <li>
    {#if node.kind === 'folder'}
      <div class="sh3-fe-row" style="padding-left: {depth * 12}px">
        <button
          class="sh3-fe-twisty"
          aria-label={store.ready && store.isExpanded(keyFor(node)) ? 'Collapse' : 'Expand'}
          onclick={() => onToggle(node)}
        >
          {store.ready && store.isExpanded(keyFor(node)) ? '▾' : '▸'}
        </button>
        <button
          class="sh3-fe-node sh3-fe-node--folder"
          class:selected={store.ready && store.selection?.shardId === node.shardId && store.selection?.path === node.path && store.selection?.kind === 'folder'}
          onclick={() => onSelectFolder(node)}
        >
          {node.name || '(root)'}/
        </button>
        {#if store.ready}
          {#each store.getBadgesFor({ shardId: node.shardId, path: node.path, kind: 'folder', descendantCount: node.descendantCount }) as { providerId, badge } (providerId)}
            <span class="sh3-fe-badge sh3-fe-badge--{badge.tone ?? 'ok'}" title={badge.tooltip ?? badge.label ?? ''}>{badge.icon}</span>
          {/each}
        {/if}
      </div>
      {#if store.ready && store.isExpanded(keyFor(node))}
        <ul>
          {#each node.children as child (keyFor(child))}
            {@render treeNode(child, depth + 1)}
          {/each}
        </ul>
      {/if}
    {:else}
      <div class="sh3-fe-row" style="padding-left: {depth * 12}px">
        <button
          class="sh3-fe-node sh3-fe-node--file"
          class:selected={store.ready && store.selection?.shardId === node.shardId && store.selection?.path === node.path && store.selection?.kind === 'file'}
          onclick={() => onSelectFile(node)}
        >
          {node.name}
        </button>
        {#if store.ready}
          {#each store.getBadgesFor({ shardId: node.shardId, path: node.path, kind: 'file', lastModified: node.lastModified }) as { providerId, badge } (providerId)}
            <span class="sh3-fe-badge sh3-fe-badge--{badge.tone ?? 'ok'}" title={badge.tooltip ?? badge.label ?? ''}>{badge.icon}</span>
          {/each}
        {/if}
      </div>
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
  .sh3-fe-row { display: flex; align-items: center; gap: 2px; }
  .sh3-fe-twisty {
    background: none;
    border: 0;
    color: var(--shell-fg-muted);
    cursor: pointer;
    padding: 2px 4px;
    font: inherit;
    width: 1.4em;
    flex: 0 0 auto;
  }
  .sh3-fe-twisty:hover { color: var(--shell-fg); }
  .sh3-fe-node--folder { flex: 1 1 auto; }
  .sh3-fe-node--file { flex: 1 1 auto; }
  .sh3-fe-badge {
    display: inline-block;
    padding: 0 4px;
    margin-left: 6px;
    font-size: 0.85em;
    border-radius: var(--shell-radius-sm, 3px);
    flex: 0 0 auto;
    cursor: default;
  }
  .sh3-fe-badge--ok { color: var(--shell-accent, #4a90e2); }
  .sh3-fe-badge--warn { color: #e6a23c; }
  .sh3-fe-badge--muted { color: var(--shell-fg-muted, #888); }
</style>
