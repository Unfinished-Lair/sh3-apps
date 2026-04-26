import type {
  ShardContext,
  DocumentMeta,
  DocumentChange,
} from 'sh3-core';
import { DOCUMENT_BADGE_POINT, type BadgeDoc, type Badge, type DocumentBadgeProvider } from './contributions';
import { iterateBadges } from './browser/iterate-badges';

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
      dispose(): void;
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
      getBadgesFor(doc: BadgeDoc): Array<{ providerId: string; badge: Badge }>;
      dispose(): void;
    };

export function createExplorerStore(ctx: ShardContext): ExplorerStore {
  if (!ctx.browse) {
    return { ctx, ready: false, error: new PermissionMissingError(), dispose: () => {} };
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

  let badgeTick = $state(0);
  let providersVersion = $state(0);

  // createExplorerStore is called from the shard's activate(), not inside a
  // component, so $effect would orphan. $effect.root creates an explicit
  // tracking scope; the returned disposer is invoked from dispose() below.
  const disposeBadgeEffects = $effect.root(() => {
    $effect(() => {
      return ctx.contributions.onChange(DOCUMENT_BADGE_POINT, () => {
        providersVersion++;
        badgeTick++;
      });
    });

    $effect(() => {
      void providersVersion;
      const providers = ctx.contributions.list<DocumentBadgeProvider>(DOCUMENT_BADGE_POINT);
      const offs = providers.map((p) => p.onChange?.(() => { badgeTick++; }) ?? (() => {}));
      return () => { for (const off of offs) off(); };
    });
  });

  function getBadgesFor(doc: BadgeDoc) {
    void badgeTick;
    const providers = ctx.contributions.list<DocumentBadgeProvider>(DOCUMENT_BADGE_POINT);
    return iterateBadges(providers, doc, (id, err) => {
      console.error(`[sh3-file-explorer] badge provider "${id}" threw:`, err);
    });
  }

  function dispose() {
    disposeBadgeEffects();
  }

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
    getBadgesFor,
    dispose,
  };
}
