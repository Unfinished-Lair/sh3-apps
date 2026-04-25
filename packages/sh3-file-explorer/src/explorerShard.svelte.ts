import type {
  ShardContext,
  DocumentMeta,
  DocumentChange,
} from 'sh3-core';

export type Selection = { shardId: string; path: string; kind: 'file' | 'folder' } | null;
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
      readonly selection: Selection;
      readonly documents: BrowseEntry[];
      setSelection(next: Selection): void;
      toggleExpanded(key: string): void;
      isExpanded(key: string): boolean;
      refreshDocuments(): Promise<void>;
      startWatch(): () => void;
    };

export function createExplorerStore(ctx: ShardContext): ExplorerStore {
  if (!ctx.browse) {
    return { ctx, ready: false, error: new PermissionMissingError() };
  }

  const browse = ctx.browse;

  let selection = $state<Selection>(null);
  const expanded = $state<Record<string, true>>({});
  let documents = $state<BrowseEntry[]>([]);

  function setSelection(next: Selection) { selection = next; }

  function toggleExpanded(key: string) {
    if (expanded[key]) delete expanded[key];
    else expanded[key] = true;
  }

  function isExpanded(key: string) { return expanded[key] === true; }

  async function refreshDocuments() {
    documents = await browse.listDocuments();
  }

  function startWatch() {
    return browse.watchDocuments((_change: DocumentChange) => {
      refreshDocuments();
    });
  }

  return {
    ctx,
    ready: true,
    browse,
    get selection() { return selection; },
    get documents() { return documents; },
    setSelection,
    toggleExpanded,
    isExpanded,
    refreshDocuments,
    startWatch,
  };
}
