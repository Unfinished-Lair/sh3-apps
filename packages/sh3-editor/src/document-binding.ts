import type { ContributionsApi, DocumentHandle, DocumentChange } from 'sh3-core';
import type { InstanceRegistry, RegistryEntry } from './model/instance-registry.svelte';
import type { ApiInternals } from './model/api';
import type { OpenDocumentOptions } from './types';
import type {
  EditorContentSeed,
  EditorDocumentChannel,
  EditorDocumentContribution,
  EditorDocumentSeed,
  EditorOptionsPatch,
  EditorPathSeed,
} from './contributions';
import { EDITOR_DOCUMENT_POINT } from './contributions';

export interface BindDocumentOptions {
  slotId: string;
  contributions: ContributionsApi;
  registry: InstanceRegistry;
  internals: ApiInternals;
  defaultOptions: OpenDocumentOptions;
  /** Document handle from the editor shard's ctx. Required for path-mode
   *  bindings — used for readText/writeText/watch. Content-mode bindings
   *  ignore it. May be omitted in tests when only content-mode is exercised. */
  documents?: DocumentHandle;
  /** Override the warn sink in tests. Defaults to console.warn. */
  warn?: (msg: string) => void;
  /** Override the diagnostic info sink in tests. Defaults to console.info.
   *  Used for the per-mount "which path / which language" trace. */
  log?: (msg: string) => void;
}

export interface BindDocumentResult {
  entry: RegistryEntry;
  /** Run on slot unmount. Releases bind disposer + edit-flow-back
   *  forwarders + watch subscription (path mode). Idempotent. */
  cleanup(): void;
  /** Forwarded from the bound contribution, if any. Preview/Reader call this
   *  on rendered-link clicks. */
  onLinkClick?: EditorDocumentContribution['onLinkClick'];
}

/** Mount-time helper for `sh3-editor:editor` / `:reader`. Resolves the slot
 *  to a `RegistryEntry` via the contribution lookup chain, falling back to
 *  the lazy default. Branches on `seed.kind`:
 *  - `'content'`: in-memory buffer, contributor owns persistence (legacy).
 *  - `'path'`: editor reads from `documents.readText(path)`, writes via
 *    `writeText` on Save, watches for external updates.
 *  Returns the resolved entry plus a cleanup callback for slot unmount. */
export function bindDocument(opts: BindDocumentOptions): BindDocumentResult {
  const {
    slotId,
    contributions,
    registry,
    internals,
    defaultOptions,
    documents,
    warn = console.warn,
    log = console.info,
  } = opts;

  const all = contributions.list<EditorDocumentContribution>(EDITOR_DOCUMENT_POINT);
  const matches = all.filter((c) => c.slotId === slotId);
  if (matches.length > 1) {
    warn(
      `[sh3-editor] Multiple EditorDocumentContribution descriptors registered for slotId="${slotId}"; using the first registered.`,
    );
  }
  const bound: EditorDocumentContribution | undefined = matches[0];

  const offs: Array<() => void> = [];

  // --------------------------------------------------------------- no contribution
  if (!bound) {
    // This is the "Hello, World" placeholder case. It does NOT mean a file was
    // missing on disk — it means no EditorDocumentContribution was registered
    // for this slotId by the time the view mounted. Surface the registered
    // slotIds so a mismatch / registration-race is obvious in the console.
    const known = all.map((c) => c.slotId);
    warn(
      `[sh3-editor] mount slotId="${slotId}": no EditorDocumentContribution matched ` +
        `→ falling back to placeholder default (${JSON.stringify(defaultOptions.content)}). ` +
        `Registered slotIds=[${known.join(', ')}]. ` +
        `Likely a slotId mismatch or a contribution registered after mount.`,
    );
    const entry = registry.get(slotId) ?? registry.open(slotId, defaultOptions);
    return { entry, cleanup() { /* no-op */ } };
  }

  // ---------------------------------------------------------------- content mode
  if (bound.seed.kind === 'content') {
    log(
      `[sh3-editor] mount slotId="${slotId}": content seed — ` +
        `filePath=${JSON.stringify(bound.seed.filePath ?? null)}, ` +
        `language=${JSON.stringify(bound.seed.language ?? null)}, ` +
        `length=${bound.seed.content.length}`,
    );
    const entry = bindContentMode(slotId, bound, bound.seed, registry, internals, offs);
    wireObservers(slotId, bound, internals, offs);
    return makeResult(entry, offs, bound.onLinkClick);
  }

  // ------------------------------------------------------------------- path mode
  log(
    `[sh3-editor] mount slotId="${slotId}": path seed — ` +
      `path=${JSON.stringify(bound.seed.path)}, ` +
      `language=${JSON.stringify(bound.seed.language ?? null)}, ` +
      `initialContent=${bound.seed.initialContent !== undefined}`,
  );
  if (!documents) {
    warn(
      `[sh3-editor] EditorDocumentContribution for slotId="${slotId}" requested path mode but no DocumentHandle was provided; falling back to empty buffer.`,
    );
  }
  const entry = bindPathMode(slotId, bound, bound.seed, registry, internals, documents, warn, log, offs);
  wireObservers(slotId, bound, internals, offs);
  return makeResult(entry, offs, bound.onLinkClick);
}

// ============================================================================
// Content mode
// ============================================================================

function bindContentMode(
  slotId: string,
  bound: EditorDocumentContribution,
  seed: EditorContentSeed,
  registry: InstanceRegistry,
  internals: ApiInternals,
  offs: Array<() => void>,
): RegistryEntry {
  const seedOpts = contentSeedToOpenOpts(seed);
  const entry = registry.get(slotId) ?? registry.open(slotId, seedOpts);

  if (bound.bind) {
    const channel = makeContentChannel(slotId, entry, internals);
    const disposer = bound.bind(channel);
    if (typeof disposer === 'function') offs.push(disposer);
  }
  return entry;
}

function makeContentChannel(
  slotId: string,
  entry: RegistryEntry,
  internals: ApiInternals,
): EditorDocumentChannel {
  return {
    setBuffer(content) {
      if (content === entry.document.content) return;
      entry.document.content = content;
      entry.document.cursorStart = 0;
      entry.document.cursorEnd = 0;
      entry.document.dirty = false;
      internals.history(slotId).clear();
      internals.contentChange.emit(slotId, content);
      internals.dirtyChange.emit(slotId, false);
    },
    openPath() {
      // No-op in content mode. The contribution registered a content seed —
      // path operations are not part of its contract.
    },
    setOptions(patch) {
      applyOptionsPatch(entry, patch);
    },
  };
}

function contentSeedToOpenOpts(seed: EditorContentSeed): OpenDocumentOptions {
  const opts: OpenDocumentOptions = { content: seed.content };
  if (seed.filePath !== undefined && seed.filePath !== null) opts.filePath = seed.filePath;
  applyCommonToOpts(opts, seed);
  return opts;
}

// ============================================================================
// Path mode
// ============================================================================

function bindPathMode(
  slotId: string,
  bound: EditorDocumentContribution,
  seed: EditorPathSeed,
  registry: InstanceRegistry,
  internals: ApiInternals,
  documents: DocumentHandle | undefined,
  warn: (msg: string) => void,
  log: (msg: string) => void,
  offs: Array<() => void>,
): RegistryEntry {
  // Initial synchronous buffer = initialContent (or empty). Real disk
  // content is fetched async after mount; the buffer is replaced if it
  // arrives before the user starts typing.
  const initialBuffer = seed.initialContent ?? '';
  const seedOpts = pathSeedToOpenOpts(seed, initialBuffer);
  const entry = registry.get(slotId) ?? registry.open(slotId, seedOpts);

  // Mutable per-mount state. Path can be swapped via replace({ path }).
  const state: PathState = {
    boundPath: seed.path,
    lastPersisted: null,
    pendingEchoes: new Set<string>(),
    saveInFlight: false,
    disposed: false,
  };

  if (documents) {
    void initialReadFromDisk(slotId, entry, state, documents, internals, warn, log);
    offs.push(installSaveHandler(slotId, entry, bound, state, documents, internals, warn));
    const off = installWatcher(slotId, entry, state, documents, internals, warn);
    if (off) offs.push(off);
  }

  offs.push(installDirtyReconciler(slotId, entry, state, internals));

  if (bound.bind) {
    const channel = makePathChannel(slotId, entry, state, documents, internals, warn);
    const disposer = bound.bind(channel);
    if (typeof disposer === 'function') offs.push(disposer);
  }

  // Disposed flag for the cleanup phase — used by async tasks to bail.
  offs.push(() => { state.disposed = true; });

  return entry;
}

interface PathState {
  boundPath: string;
  /** Last value we know is on disk. null = file didn't exist at last read. */
  lastPersisted: string | null;
  /** Content values we just wrote — drop the watch event that echoes them. */
  pendingEchoes: Set<string>;
  /** True between save handler's writeText call and resolution. Watch events
   *  fired during this window are unconditionally dropped — they are either
   *  our own write echoing back, or interleaved external writes that will
   *  be reconciled when save settles. */
  saveInFlight: boolean;
  disposed: boolean;
}

function pathSeedToOpenOpts(seed: EditorPathSeed, initialBuffer: string): OpenDocumentOptions {
  const opts: OpenDocumentOptions = { content: initialBuffer };
  // Path is shown in the toolbar chip.
  opts.filePath = seed.path;
  applyCommonToOpts(opts, seed);
  return opts;
}

async function initialReadFromDisk(
  slotId: string,
  entry: RegistryEntry,
  state: PathState,
  documents: DocumentHandle,
  internals: ApiInternals,
  warn: (msg: string) => void,
  log: (msg: string) => void,
): Promise<void> {
  // Contribution registered path mode without a usable path (empty string or
  // unset). The contributor is expected to swap a real path in via
  // replace({ path }); skip the initial read so we don't fire readText(undefined).
  if (!state.boundPath) {
    warn(
      `[sh3-editor] slotId="${slotId}": path seed has an empty path; skipping initial read ` +
        `(buffer stays empty until a path is swapped in).`,
    );
    return;
  }
  try {
    const fromDisk = await documents.readText(state.boundPath);
    if (state.disposed) return;
    if (fromDisk === null) {
      // File does not exist (or is empty) at the bound path. The buffer stays
      // at initialContent/empty — this is the genuine "file not found" trace,
      // distinct from the no-contribution "Hello, World" case above.
      warn(
        `[sh3-editor] slotId="${slotId}": readText(${JSON.stringify(state.boundPath)}) returned null ` +
          `(file not found / empty) — buffer stays empty.`,
      );
      state.lastPersisted = null;
      return;
    }
    log(
      `[sh3-editor] slotId="${slotId}": readText(${JSON.stringify(state.boundPath)}) → loaded ${fromDisk.length} chars.`,
    );
    state.lastPersisted = fromDisk;
    // Don't overwrite the user's in-flight edits. If they've already typed
    // (dirty became true during the await window), drop the disk content
    // and rely on Save to push their version up.
    if (entry.document.dirty) return;
    if (entry.document.content === fromDisk) return;
    entry.document.content = fromDisk;
    entry.document.cursorStart = 0;
    entry.document.cursorEnd = 0;
    entry.document.dirty = false;
    internals.history(slotId).clear();
    internals.contentChange.emit(slotId, fromDisk);
    internals.dirtyChange.emit(slotId, false);
  } catch (e) {
    warn(`[sh3-editor] readText("${state.boundPath}") failed: ${stringifyErr(e)}`);
  }
}

function installSaveHandler(
  slotId: string,
  entry: RegistryEntry,
  bound: EditorDocumentContribution,
  state: PathState,
  documents: DocumentHandle,
  internals: ApiInternals,
  warn: (msg: string) => void,
): () => void {
  return internals.saveEvent.on(async (id) => {
    if (id !== slotId) return;
    const content = entry.document.content;
    const path = state.boundPath;
    state.saveInFlight = true;
    state.pendingEchoes.add(content);
    try {
      await documents.writeText(path, content);
      if (state.disposed) return;
      state.lastPersisted = content;
      entry.document.dirty = false;
      internals.dirtyChange.emit(slotId, false);
      bound.onSave?.();
    } catch (e) {
      state.pendingEchoes.delete(content);
      warn(`[sh3-editor] writeText("${path}") failed: ${stringifyErr(e)}`);
      // dirty stays true; contributor's onSave does NOT fire.
    } finally {
      state.saveInFlight = false;
    }
  });
}

function installWatcher(
  slotId: string,
  entry: RegistryEntry,
  state: PathState,
  documents: DocumentHandle,
  internals: ApiInternals,
  warn: (msg: string) => void,
): (() => void) | null {
  try {
    return documents.watch((change: DocumentChange) => {
      if (state.disposed) return;
      // Walk only when the change touches our path (rename uses 'path' for
      // the destination).
      if (change.path !== state.boundPath) return;
      if (change.type === 'delete') {
        state.lastPersisted = null;
        return;
      }
      // Drop events fired while our own save is in flight — they are
      // either our echo or a racing external write that will be
      // reconciled after save settles.
      if (state.saveInFlight) return;
      if (entry.document.dirty) {
        warn(
          `[sh3-editor] external write to "${state.boundPath}" arrived while buffer is dirty; ignoring.`,
        );
        return;
      }
      void (async () => {
        try {
          const next = await documents.readText(state.boundPath);
          if (state.disposed) return;
          if (next === null) return;
          if (state.pendingEchoes.has(next)) {
            state.pendingEchoes.delete(next);
            return;
          }
          if (entry.document.content === next) return;
          state.lastPersisted = next;
          entry.document.content = next;
          entry.document.cursorStart = 0;
          entry.document.cursorEnd = 0;
          entry.document.dirty = false;
          internals.history(slotId).clear();
          internals.contentChange.emit(slotId, next);
          internals.dirtyChange.emit(slotId, false);
        } catch (e) {
          warn(`[sh3-editor] re-readText("${state.boundPath}") failed: ${stringifyErr(e)}`);
        }
      })();
    });
  } catch (e) {
    warn(`[sh3-editor] documents.watch() unavailable: ${stringifyErr(e)}`);
    return null;
  }
}

/** Recompute dirty against `state.lastPersisted` on every contentChange.
 *  Path mode's dirty bit is supposed to be `content !== lastPersisted`, but
 *  Editor.svelte's pushContent / setContent only one-way-ratchets it to true
 *  on user edits. As a result, an undo back to the persisted snapshot leaves
 *  dirty stuck at true. This listener closes that loop: any contentChange
 *  for our slot recomputes dirty and emits the flip if it changed.
 *
 *  Skipped when `lastPersisted` is null (no canonical snapshot yet — file
 *  didn't exist at last read, or initial read hasn't resolved). In that
 *  case the existing one-way-true behavior is preserved. */
function installDirtyReconciler(
  slotId: string,
  entry: RegistryEntry,
  state: PathState,
  internals: ApiInternals,
): () => void {
  return internals.contentChange.on((id, content) => {
    if (id !== slotId) return;
    if (state.disposed) return;
    if (state.lastPersisted === null) return;
    const shouldBeDirty = content !== state.lastPersisted;
    if (entry.document.dirty === shouldBeDirty) return;
    entry.document.dirty = shouldBeDirty;
    internals.dirtyChange.emit(slotId, shouldBeDirty);
  });
}

function makePathChannel(
  slotId: string,
  entry: RegistryEntry,
  state: PathState,
  documents: DocumentHandle | undefined,
  internals: ApiInternals,
  warn: (msg: string) => void,
): EditorDocumentChannel {
  return {
    setBuffer(content) {
      if (content === entry.document.content) return;
      // Buffer poke — does not write to disk. History clears because the
      // buffer's authored timeline has been replaced.
      entry.document.content = content;
      entry.document.cursorStart = 0;
      entry.document.cursorEnd = 0;
      // Dirty becomes true iff buffer != lastPersisted (poke could diverge
      // from disk; only Save reconciles). When lastPersisted is null
      // (file didn't exist), the buffer-poke does not flip dirty — Save
      // reconciles the new-file case.
      const willBeDirty = state.lastPersisted !== null && content !== state.lastPersisted;
      entry.document.dirty = willBeDirty;
      internals.history(slotId).clear();
      internals.contentChange.emit(slotId, content);
      internals.dirtyChange.emit(slotId, willBeDirty);
    },
    openPath(path) {
      if (path === state.boundPath) return;
      void swapPath(slotId, entry, state, path, documents, internals, warn);
    },
    setOptions(patch) {
      applyOptionsPatch(entry, patch);
    },
  };
}

async function swapPath(
  slotId: string,
  entry: RegistryEntry,
  state: PathState,
  newPath: string,
  documents: DocumentHandle | undefined,
  internals: ApiInternals,
  warn: (msg: string) => void,
): Promise<void> {
  const oldPath = state.boundPath;
  // Flush dirty buffer to OLD path before swapping (auto-save on swap).
  if (entry.document.dirty && documents) {
    const content = entry.document.content;
    state.saveInFlight = true;
    state.pendingEchoes.add(content);
    try {
      await documents.writeText(oldPath, content);
      state.lastPersisted = content;
    } catch (e) {
      state.pendingEchoes.delete(content);
      warn(`[sh3-editor] flush-on-swap writeText("${oldPath}") failed: ${stringifyErr(e)}`);
      // Continue with the swap — user requested the swap explicitly; we
      // surface the failure via console but don't block.
    } finally {
      state.saveInFlight = false;
    }
  }
  state.boundPath = newPath;
  state.lastPersisted = null;
  entry.document.filePath = newPath;
  // Re-read new path. The watcher continues to fire for the new path because
  // it filters on state.boundPath dynamically.
  if (!documents) {
    entry.document.content = '';
    entry.document.dirty = false;
    internals.history(slotId).clear();
    internals.contentChange.emit(slotId, '');
    internals.dirtyChange.emit(slotId, false);
    return;
  }
  try {
    const next = await documents.readText(newPath);
    if (state.disposed) return;
    const nextBuffer = next ?? '';
    state.lastPersisted = next;
    entry.document.content = nextBuffer;
    entry.document.cursorStart = 0;
    entry.document.cursorEnd = 0;
    entry.document.dirty = false;
    internals.history(slotId).clear();
    internals.contentChange.emit(slotId, nextBuffer);
    internals.dirtyChange.emit(slotId, false);
  } catch (e) {
    warn(`[sh3-editor] swap-readText("${newPath}") failed: ${stringifyErr(e)}`);
  }
}

// ============================================================================
// Shared helpers
// ============================================================================

function applyOptionsPatch(entry: RegistryEntry, patch: EditorOptionsPatch): void {
  if (patch.language !== undefined) {
    entry.document.language = patch.language;
  }
  if (patch.filePath !== undefined) {
    entry.document.filePath = patch.filePath;
  }
  if (patch.matchingConfig !== undefined) {
    entry.options.matchingConfig = patch.matchingConfig;
  }
  if (patch.prefs !== undefined) {
    entry.prefs = { ...entry.prefs, ...patch.prefs };
  }
  if (patch.fontSize !== undefined) {
    entry.options.fontSize = patch.fontSize;
  }
  if (patch.showSettings !== undefined) {
    entry.options.showSettings = patch.showSettings;
  }
  if (patch.toolbarActions !== undefined) {
    entry.options.toolbarActions = patch.toolbarActions;
  }
  if (patch.render !== undefined) {
    entry.options.render = patch.render;
  }
  if (patch.transform !== undefined) {
    entry.options.transform = patch.transform;
  }
  if (patch.startInPreview !== undefined) {
    entry.options.startInPreview = patch.startInPreview;
  }
}

function applyCommonToOpts(opts: OpenDocumentOptions, seed: EditorDocumentSeed): void {
  if (seed.language !== undefined && seed.language !== null) opts.language = seed.language;
  if (seed.matchingConfig !== undefined) opts.matchingConfig = seed.matchingConfig;
  if (seed.prefs !== undefined) opts.prefs = seed.prefs;
  if (seed.fontSize !== undefined) opts.fontSize = seed.fontSize;
  if (seed.showSettings !== undefined) opts.showSettings = seed.showSettings;
  if (seed.toolbarActions !== undefined) opts.toolbarActions = seed.toolbarActions;
  if (seed.render !== undefined) opts.render = seed.render;
  if (seed.transform !== undefined) opts.transform = seed.transform;
  if (seed.startInPreview !== undefined) opts.startInPreview = seed.startInPreview;
}

function wireObservers(
  slotId: string,
  bound: EditorDocumentContribution,
  internals: ApiInternals,
  offs: Array<() => void>,
): void {
  if (bound.onContentChange) {
    offs.push(internals.contentChange.on((id, content) => {
      if (id === slotId) bound.onContentChange!(content);
    }));
  }
  if (bound.onDirtyChange) {
    offs.push(internals.dirtyChange.on((id, dirty) => {
      if (id === slotId) bound.onDirtyChange!(dirty);
    }));
  }
  // onSave forwarding: in path mode the save handler already calls
  // bound.onSave AFTER the disk write succeeds. In content mode there is
  // no disk write, so wire the raw saveEvent through. Distinguish by
  // checking the seed's kind.
  if (bound.onSave && bound.seed.kind === 'content') {
    offs.push(internals.saveEvent.on((id) => {
      if (id === slotId) bound.onSave!();
    }));
  }
  if (bound.onPrefsChange) {
    offs.push(internals.prefsChange.on((id, prefs) => {
      if (id === slotId) bound.onPrefsChange!(prefs);
    }));
  }
}

function makeResult(
  entry: RegistryEntry,
  offs: Array<() => void>,
  onLinkClick: EditorDocumentContribution['onLinkClick'] | undefined,
): BindDocumentResult {
  return {
    entry,
    cleanup() {
      for (const off of offs) {
        try { off(); } catch (e) { console.warn('[sh3-editor] bindDocument cleanup error', e); }
      }
      offs.length = 0;
    },
    onLinkClick,
  };
}

function stringifyErr(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
