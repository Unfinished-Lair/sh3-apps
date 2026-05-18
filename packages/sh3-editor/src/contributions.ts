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

/** Swappable subset for `bind(replace)`. Mode is fixed at mount; field set
 *  matches whichever variant the contribution registered with.
 *  - Content mode: any common field plus `content` / `filePath`.
 *  - Path mode: any common field plus `path`. Replacing `path` flushes
 *    pending dirty writes (to the old path), reads the new path, clears
 *    history. Replacing `content` in path mode pokes the local buffer
 *    without writing — useful for previews / transforms. */
export type EditorReplacePatch =
  | (Partial<Omit<EditorContentSeed, 'kind'>> & { content?: string })
  | (Partial<Omit<EditorPathSeed, 'kind'>> & { content?: string });

/** Descriptor registered under EDITOR_DOCUMENT_POINT. One descriptor binds
 *  one editor slot keyed by `slotId`. */
export interface EditorDocumentContribution {
  /** Slot id this binding owns. Editor matches at mount time. */
  slotId: string;

  /** Initial state. Read once when the editor view mounts at `slotId`.
   *  Later changes flow through `bind`/`replace`. */
  seed: EditorDocumentSeed;

  /** Push channel for swaps. The editor calls `bind` exactly once at mount
   *  with a `replace` closure scoped to that mount. The contributor stores
   *  the closure and calls it whenever it wants to swap fields on the live
   *  document. The returned disposer (if any) is invoked on slot unmount;
   *  the contributor should drop its `replace` reference there. */
  bind?(replace: (next: EditorReplacePatch) => void): (() => void) | void;

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
