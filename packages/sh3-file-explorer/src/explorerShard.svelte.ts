import type {
  ShardContext,
  SyncScope,
  SyncRegistry,
  GrantRecord,
  DocumentMeta,
  DocumentChange,
} from 'sh3-core';
import { SvelteSet } from 'svelte/reactivity';

export type Selection = { shardId: string; path: string } | null;
export type BrowseEntry = DocumentMeta & { shardId: string };

export class PermissionMissingError extends Error {
  constructor() {
    super('sh3-file-explorer requires the documents:browse permission.');
  }
}

export type ExplorerStore =
  | {
      ctx: ShardContext;
      ready: false;
      error: PermissionMissingError;
    }
  | {
      ctx: ShardContext;
      ready: true;
      error?: undefined;
      browse: NonNullable<ShardContext['browse']>;
      registry: SyncRegistry;
      readonly selection: Selection;
      readonly documents: BrowseEntry[];
      readonly grants: GrantRecord[];
      readonly connectorIds: string[];
      setSelection(next: Selection): void;
      toggleExpanded(key: string): void;
      isExpanded(key: string): boolean;
      coverageFor(sel: Selection): GrantRecord[];
      refreshDocuments(): Promise<void>;
      refreshGrants(): Promise<void>;
      startWatch(): () => void;
    };

export function createExplorerStore(ctx: ShardContext): ExplorerStore {
  if (!ctx.browse || !ctx.syncRegistry) {
    return { ctx, ready: false, error: new PermissionMissingError() };
  }

  const browse = ctx.browse;
  const registry = ctx.syncRegistry();

  let selection = $state<Selection>(null);
  const expanded = new SvelteSet<string>();
  let documents = $state<BrowseEntry[]>([]);
  let grants = $state<GrantRecord[]>([]);
  let connectorIds = $state<string[]>([]);

  function setSelection(next: Selection) { selection = next; }

  function toggleExpanded(key: string) {
    if (expanded.has(key)) expanded.delete(key);
    else expanded.add(key);
  }

  function isExpanded(key: string) { return expanded.has(key); }

  async function refreshDocuments() {
    documents = await browse.listDocuments();
  }

  async function refreshGrants() {
    const [g, ids] = await Promise.all([registry.list(), registry.listAllConnectorIds()]);
    grants = g;
    connectorIds = ids;
  }

  function startWatch() {
    return browse.watchDocuments((_change: DocumentChange) => {
      refreshDocuments();
    });
  }

  function coverageFor(sel: Selection): GrantRecord[] {
    if (!sel) return [];
    return grants.filter((g) => {
      const s: SyncScope = g.scope;
      if (s.kind === 'tenant') return true;
      if (s.kind === 'shard') return s.shardId === sel.shardId;
      if (s.kind === 'path') return s.shardId === sel.shardId && sel.path.startsWith(s.prefix);
      return false;
    });
  }

  return {
    ctx,
    ready: true,
    browse,
    registry,
    get selection() { return selection; },
    get documents() { return documents; },
    get grants() { return grants; },
    get connectorIds() { return connectorIds; },
    setSelection,
    toggleExpanded,
    isExpanded,
    coverageFor,
    refreshDocuments,
    refreshGrants,
    startWatch,
  };
}
