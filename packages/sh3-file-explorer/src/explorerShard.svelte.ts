import type {
  ShardContext,
  DocumentMeta,
  DocumentChange,
} from 'sh3-core';
import { DOCUMENT_BADGE_POINT, type BadgeDoc, type Badge, type DocumentBadgeProvider } from './contributions';
import { iterateBadges } from './browser/iterate-badges';

export type Selection = { shardId: string; path: string; kind: 'file' | 'folder' } | null;
export type BrowseEntry = DocumentMeta & { shardId: string };
export type Clipboard = { mode: 'cut' | 'copy'; ref: NonNullable<Selection> } | null;

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
      readonly selection: Selection;
      readonly documents: BrowseEntry[];
      readonly clipboard: Clipboard;
      setSelection(next: Selection): void;
      setClipboard(c: Clipboard): void;
      clearClipboard(): void;
      toggleExpanded(key: string): void;
      isExpanded(key: string): boolean;
      refreshDocuments(): Promise<void>;
      startWatch(): () => void;
      getBadgesFor(doc: BadgeDoc): Array<{ providerId: string; badge: Badge }>;
      dispose(): void;
    };

/**
 * Split a scope-rooted document path into its bound-id prefix and the
 * per-shard relative path. Returns null when the path has no bound-id
 * segment (which shouldn't happen for sh3-core 0.26+).
 */
function splitScopeRooted(path: string): { shardId: string; rest: string } | null {
  const slash = path.indexOf('/');
  if (slash <= 0) {
    // Bound-id root with no trailing path — return empty `rest`.
    return slash < 0 && path.length > 0
      ? { shardId: path, rest: '' }
      : null;
  }
  return { shardId: path.slice(0, slash), rest: path.slice(slash + 1) };
}

export function createExplorerStore(ctx: ShardContext): ExplorerStore {
  // The handle is always present in sh3-core 0.26+. Without documents:browse
  // the handle is contained to this shard's own bound id and list() will
  // only show that bound id's docs — but the view still functions. We only
  // surface the permission-missing error when the grant is absent.
  if (!ctx.documents.grants.browse) {
    return { ctx, ready: false, error: new PermissionMissingError(), dispose: () => {} };
  }

  let selection = $state<Selection>(null);
  const expanded = $state<Record<string, true>>({});
  let documents = $state<BrowseEntry[]>([]);
  let clipboard = $state<Clipboard>(null);

  function setSelection(next: Selection) { selection = next; }
  function setClipboard(next: Clipboard) { clipboard = next; }
  function clearClipboard() { clipboard = null; }

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
    // ctx.documents.list() (relaxed handle) returns every doc in the active
    // scope with scope-rooted paths. Split each path back into shardId +
    // per-shard-relative path so the rest of file-explorer (which groups by
    // shardId and renders shard-relative trees) keeps working unchanged.
    const raw = await ctx.documents.list();
    const out: BrowseEntry[] = [];
    for (const meta of raw) {
      const split = splitScopeRooted(meta.path);
      if (!split) continue;
      out.push({ ...meta, path: split.rest, shardId: split.shardId });
    }
    documents = out;
  }

  function startWatch() {
    return ctx.documents.watch((_change: DocumentChange) => {
      refreshDocuments();
    });
  }

  return {
    ctx,
    ready: true,
    get selection() { return selection; },
    get documents() { return documents; },
    get clipboard() { return clipboard; },
    setSelection,
    setClipboard,
    clearClipboard,
    toggleExpanded,
    isExpanded,
    refreshDocuments,
    startWatch,
    getBadgesFor,
    dispose,
  };
}
