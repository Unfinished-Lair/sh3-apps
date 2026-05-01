import type { ContributionsApi } from 'sh3-core';
import type { InstanceRegistry, RegistryEntry } from './model/instance-registry';
import type { ApiInternals } from './model/api';
import type { OpenDocumentOptions } from './types';
import type {
  EditorDocumentContribution,
  EditorDocumentSeed,
} from './contributions';
import { EDITOR_DOCUMENT_POINT } from './contributions';

export interface BindDocumentOptions {
  slotId: string;
  contributions: ContributionsApi;
  registry: InstanceRegistry;
  internals: ApiInternals;
  defaultOptions: OpenDocumentOptions;
  /** Override the warn sink in tests. Defaults to console.warn. */
  warn?: (msg: string) => void;
}

export interface BindDocumentResult {
  entry: RegistryEntry;
  /** Run on slot unmount. Releases bind disposer + edit-flow-back
   *  forwarders. Idempotent. */
  cleanup(): void;
}

/** Mount-time helper for `sh3-editor:editor`. Resolves the slot to a
 *  `RegistryEntry` via the contribution lookup chain (in later tasks),
 *  falling back to the imperative-API entry, then to the lazy default.
 *  Returns the resolved entry plus a cleanup callback for slot unmount. */
export function bindDocument(opts: BindDocumentOptions): BindDocumentResult {
  const {
    slotId,
    contributions,
    registry,
    internals,
    defaultOptions,
    warn = console.warn,
  } = opts;

  const all = contributions.list<EditorDocumentContribution>(EDITOR_DOCUMENT_POINT);
  const matches = all.filter((c) => c.slotId === slotId);
  if (matches.length > 1) {
    warn(
      `[sh3-editor] Multiple EditorDocumentContribution descriptors registered for slotId="${slotId}"; using the first registered.`,
    );
  }
  const bound: EditorDocumentContribution | undefined = matches[0];

  const seedOpts: OpenDocumentOptions = bound
    ? seedToOpenOpts(bound.seed)
    : defaultOptions;
  const entry = registry.get(slotId) ?? registry.open(slotId, seedOpts);

  const offs: Array<() => void> = [];

  if (bound?.bind) {
    const replace = makeReplace(slotId, entry, internals);
    const disposer = bound.bind(replace);
    if (typeof disposer === 'function') offs.push(disposer);
  }

  if (bound?.onContentChange) {
    offs.push(internals.contentChange.on((id, content) => {
      if (id === slotId) bound.onContentChange!(content);
    }));
  }
  if (bound?.onDirtyChange) {
    offs.push(internals.dirtyChange.on((id, dirty) => {
      if (id === slotId) bound.onDirtyChange!(dirty);
    }));
  }
  if (bound?.onSave) {
    offs.push(internals.saveEvent.on((id) => {
      if (id === slotId) bound.onSave!();
    }));
  }
  if (bound?.onPrefsChange) {
    offs.push(internals.prefsChange.on((id, prefs) => {
      if (id === slotId) bound.onPrefsChange!(prefs);
    }));
  }

  return {
    entry,
    cleanup() {
      for (const off of offs) {
        try { off(); } catch (e) { console.warn('[sh3-editor] bindDocument cleanup error', e); }
      }
      offs.length = 0;
    },
  };
}

function makeReplace(
  slotId: string,
  entry: RegistryEntry,
  internals: ApiInternals,
): (next: Partial<EditorDocumentSeed>) => void {
  return (next) => {
    if (next.content !== undefined && next.content !== entry.document.content) {
      entry.document.content = next.content;
      entry.document.cursorStart = 0;
      entry.document.cursorEnd = 0;
      entry.document.dirty = false;
      internals.history(slotId).clear();
      internals.contentChange.emit(slotId, next.content);
      internals.dirtyChange.emit(slotId, false);
    }
    if (next.filePath !== undefined) entry.document.filePath = next.filePath;
    if (next.language !== undefined) entry.document.language = next.language;
    if (next.matchingConfig !== undefined) entry.options.matchingConfig = next.matchingConfig;
    if (next.prefs !== undefined) entry.prefs = { ...entry.prefs, ...next.prefs };
    if (next.fontSize !== undefined) entry.options.fontSize = next.fontSize;
    if (next.showSettings !== undefined) entry.options.showSettings = next.showSettings;
    if (next.toolbarActions !== undefined) entry.options.toolbarActions = next.toolbarActions;
    if (next.highlight !== undefined) entry.options.highlight = next.highlight;
  };
}

function seedToOpenOpts(seed: EditorDocumentSeed): OpenDocumentOptions {
  const opts: OpenDocumentOptions = { content: seed.content };
  if (seed.filePath !== undefined && seed.filePath !== null) opts.filePath = seed.filePath;
  if (seed.language !== undefined && seed.language !== null) opts.language = seed.language;
  if (seed.matchingConfig !== undefined) opts.matchingConfig = seed.matchingConfig;
  if (seed.prefs !== undefined) opts.prefs = seed.prefs;
  if (seed.fontSize !== undefined) opts.fontSize = seed.fontSize;
  if (seed.showSettings !== undefined) opts.showSettings = seed.showSettings;
  if (seed.toolbarActions !== undefined) opts.toolbarActions = seed.toolbarActions;
  if (seed.highlight !== undefined) opts.highlight = seed.highlight;
  return opts;
}
