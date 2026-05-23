import type { LinkKind } from './preview/link-classify';
import type { MatchingConfig, ToolbarAction, UserPrefs } from './types';

/**
 * Contribution point id for editor document bindings. Contributors register
 * one `EditorDocumentContribution` per editor slot via
 * `ctx.contributions.register<EditorDocumentContribution>(EDITOR_DOCUMENT_POINT, …)`.
 */
export const EDITOR_DOCUMENT_POINT = 'sh3-editor.document';

/** Shared options carried by both seed variants. */
export interface EditorDocumentSeedCommon {
  /** Forwarded to `highlight(text, language)`. */
  language?: string | null;
  /** Indent + brace auto-edit config. */
  matchingConfig?: MatchingConfig;
  /** User prefs override (shallow-merged over `matchingConfig`). */
  prefs?: UserPrefs;
  /** Editor font size in px. Default 13. */
  fontSize?: number;
  /** Hide the built-in settings gear. Default true when sub-options exist. */
  showSettings?: boolean;
  /** Caller-supplied actions merged with the built-in settings gear. */
  toolbarActions?: ToolbarAction[];
  /** Syntax-highlight hook returning HTML. Default escapes the buffer. */
  highlight?: (text: string, language: string) => string;
  /** Preview/reader render hook. Receives buffer + language, returns HTML.
   *  When absent and language === 'markdown' (or filePath ends in .md and
   *  language is null), the bundled default markdown renderer is used.
   *  When absent for any other language, Preview falls back to escaped
   *  <pre>{content}</pre>. */
  render?: (text: string, language: string | null) => string;
  /** Pre-render text→text hook. Runs before the resolved renderer. */
  transform?: (text: string, language: string | null) => string;
  /** Editor-only: whether the editor toggle starts in preview mode. */
  startInPreview?: boolean;
}

/** Path-backed seed (contract v3). Editor owns persistence: reads from
 *  `ctx.documents.readText(path)` at mount, writes via `writeText` on Save,
 *  observes external changes through `ctx.documents.watch`. */
export interface EditorPathSeed extends EditorDocumentSeedCommon {
  kind: 'path';
  /** Path resolved against `ctx.documents` — i.e. the active app's namespace
   *  when this slot lives inside an app, the editor shard's own namespace
   *  otherwise. */
  path: string;
  /** Written by the editor on first save iff `readText` returns null at mount.
   *  Lets contributors seed a starter for "new file" cases without doing the
   *  write themselves. Optional. */
  initialContent?: string;
  /** Editor save model. 'manual' (default) saves on Mod+S only. Reserved
   *  for a future 'autosave' mode — currently treated as 'manual' if set. */
  save?: 'manual';
}

/** Content-backed seed (legacy / transient). Editor never persists.
 *  Use for ephemeral surfaces — float-spawned markdown previews, ad-hoc
 *  scratch buffers, contributor-owned storage. */
export interface EditorContentSeed extends EditorDocumentSeedCommon {
  kind: 'content';
  /** Initial buffer text. */
  content: string;
  /** Toolbar file chip; informational only — editor never reads/writes it. */
  filePath?: string | null;
}

export type EditorDocumentSeed = EditorPathSeed | EditorContentSeed;

/** Patch for view-level options. Never touches the buffer; pass any subset
 *  of the fields you want to change. Each field replaces (does not merge)
 *  except `prefs`, which is shallow-merged into the current prefs to keep
 *  individual gear-popover changes additive.
 *
 *  In path mode, `filePath` is normally managed by `openPath(...)` — setting
 *  it via `setOptions(...)` only overrides the toolbar chip until the next
 *  `openPath` overwrites it. In content mode, the contributor owns
 *  `filePath` entirely (informational only — editor never reads/writes it). */
export type EditorOptionsPatch = Partial<{
  language: string | null;
  filePath: string | null;
  matchingConfig: MatchingConfig;
  prefs: UserPrefs;
  fontSize: number;
  showSettings: boolean;
  toolbarActions: ToolbarAction[];
  highlight: (text: string, language: string) => string;
  render: (text: string, language: string | null) => string;
  transform: (text: string, language: string | null) => string;
  startInPreview: boolean;
}>;

/** Slot-scoped channel handed to a contributor at bind time. Mirrors
 *  EditorEditChannel's verb-based shape. The contributor stores the channel
 *  reference and calls verbs to mutate the live binding.
 *
 *  History semantics:
 *   - setBuffer clears history (the buffer's authored timeline is being
 *     replaced).
 *   - openPath clears history (the file changed; cross-file undo would
 *     be meaningless).
 *   - setOptions never touches history.
 *
 *  Do not mix `setBuffer(...)` with `EditorEditChannel.submit(...)` against
 *  the same slot — setBuffer clears history. Pick one channel per concern.
 *  See edit/contributions.ts. */
export interface EditorDocumentChannel {
  /** Replace buffer in place.
   *  - content mode: this IS a new document — clears history, resets
   *    cursor to 0, fires onContentChange and onDirtyChange(false).
   *  - path mode: transient buffer poke — does NOT write to disk.
   *    Resets cursor to 0, clears history, recomputes dirty against
   *    state.lastPersisted (dirty becomes true if content diverges from
   *    the disk snapshot). Used by transform/render pipelines.
   *  Same-value calls are silent (no events fire). */
  setBuffer(content: string): void;

  /** Path mode only. Switch this binding to a different file path. Flushes
   *  any pending dirty buffer to the OLD path, then reads the new path,
   *  clears history, resets cursor and dirty. No-op in content mode and
   *  when called with the currently-bound path. */
  openPath(path: string): void;

  /** Patch view-level options. See EditorOptionsPatch for the field set. */
  setOptions(patch: EditorOptionsPatch): void;
}

/** Descriptor registered under EDITOR_DOCUMENT_POINT. One descriptor binds
 *  one editor slot keyed by `slotId`. */
export interface EditorDocumentContribution {
  /** Slot id this binding owns. Editor matches at mount time. */
  slotId: string;

  /** Initial state. Read once when the editor view mounts at `slotId`.
   *  Later changes flow through `bind`/the channel. */
  seed: EditorDocumentSeed;

  /** Push channel for swaps. The editor calls `bind` exactly once at mount
   *  with a fresh `EditorDocumentChannel` scoped to that mount. The
   *  contributor stores the channel reference and calls its verbs to mutate
   *  the live binding. The returned disposer (if any) is invoked on slot
   *  unmount; the contributor should drop its channel reference there. */
  bind?(channel: EditorDocumentChannel): (() => void) | void;

  /** Editor → contributor: user edit committed. Fires in both modes. */
  onContentChange?(content: string): void;
  /** Editor → contributor: dirty flag flipped. In path mode, dirty = buffer
   *  differs from last-persisted snapshot. */
  onDirtyChange?(dirty: boolean): void;
  /** Editor → contributor: Save action ran. In path mode, fires AFTER the
   *  successful `writeText`. */
  onSave?(): void;
  /** Editor → contributor: settings gear changed prefs. */
  onPrefsChange?(prefs: UserPrefs): void;

  /** Preview/reader → contributor: user clicked an <a> in rendered content.
   *  Return 'handled' to suppress all default behavior; return 'default' (or
   *  void) to apply sh3-editor's default behavior for the link kind. */
  onLinkClick?(e: PreviewLinkEvent): 'handled' | 'default' | void;
}

/** Payload delivered to `EditorDocumentContribution.onLinkClick` when a
 *  Preview surface intercepts an anchor click. */
export interface PreviewLinkEvent {
  /** Raw href from the <a> element, unmodified. */
  href: string;
  /** Best-effort classification — 'anchor' (#fragment), 'external' (any
   *  scheme: prefix), or 'internal' (everything else). Contributors can
   *  override semantics by returning 'handled' and acting on `href` directly. */
  kind: LinkKind;
  /** The original click event. preventDefault() has already been called by
   *  sh3-editor; provided for modifier-key inspection. */
  event: MouseEvent;
  /** slotId of the contribution that owns this preview surface. */
  slotId: string;
}
