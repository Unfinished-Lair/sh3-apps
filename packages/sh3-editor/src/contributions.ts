import type { MatchingConfig, ToolbarAction, UserPrefs } from './types';

/**
 * Contribution point id for editor document bindings. Contributors register
 * one `EditorDocumentContribution` per editor slot via
 * `ctx.contributions.register<EditorDocumentContribution>(EDITOR_DOCUMENT_POINT, …)`.
 */
export const EDITOR_DOCUMENT_POINT = 'sh3-editor.document';

/** Initial state seed for an editor slot. Read once at mount; later changes
 *  flow through `bind`/`replace`. Field set mirrors `OpenDocumentOptions`. */
export interface EditorDocumentSeed {
  /** Initial buffer text. */
  content: string;
  /** Toolbar file chip; informational only — editor never reads/writes it. */
  filePath?: string | null;
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
}

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
  bind?(replace: (next: Partial<EditorDocumentSeed>) => void): (() => void) | void;

  /** Editor → contributor: user edit committed. */
  onContentChange?(content: string): void;
  /** Editor → contributor: dirty flag flipped. */
  onDirtyChange?(dirty: boolean): void;
  /** Editor → contributor: Ctrl+S pressed inside the textarea. */
  onSave?(): void;
  /** Editor → contributor: settings gear changed prefs. */
  onPrefsChange?(prefs: UserPrefs): void;
}
