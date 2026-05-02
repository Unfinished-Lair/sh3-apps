/** Represents a single open document in the editor. */
export interface EditorDocument {
  id: string;
  content: string;
  filePath: string | null;
  cursorStart: number;
  cursorEnd: number;
  scrollTop: number;
  scrollLeft: number;
  dirty: boolean;
  language: string | null;
}

/** A single entry in the undo/redo stack. */
export interface HistoryEntry {
  before: string;
  after: string;
  cursorBefore: number;
  cursorAfter: number;
  timestamp: number;
}

/** Result of an undo or redo operation. */
export interface HistoryResult {
  content: string;
  cursor: number;
}

/** Which kind of auto-indent the editor applies on Enter. */
export type EditorIndentType = 'none' | 'brace' | 'indent';

/** Brace style used when `indentType === 'brace'`. */
export type BraceStyle = 'inline' | 'allman';

/** Configuration for bracket and indent matching. */
export interface MatchingConfig {
  brackets?: [string, string][];
  /** Kind of auto-indent on Enter. Default 'none'. */
  indentType?: EditorIndentType;
  /** Number of spaces used for one indent level. Default 2. */
  indentUnit?: number;
  /** Brace style when indentType === 'brace'. Default 'inline'. */
  braceStyle?: BraceStyle;
  /** @deprecated Use indentType. When indentType is undefined and this is true, treated as 'indent'. */
  indentBased?: boolean;
}

/** Subset of MatchingConfig that is user-editable at runtime via the settings popover. */
export type UserPrefs = Pick<MatchingConfig, 'indentUnit' | 'braceStyle'>;

/** Result of a bracket match query. */
export interface BracketMatch {
  open: number;
  close: number;
}

/** Result of an indent match query — line indices at the matching indent level. */
export interface IndentMatch {
  /** Line index of the enclosing parent (lower indent). -1 if top-level. */
  parentLine: number;
  /** Line indices of siblings at the same indent level within the parent block. */
  siblingLines: number[];
}

/** A toolbar action descriptor. */
export interface ToolbarAction {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  onAction: () => void;
  disabled?: boolean;
  accent?: boolean;
  group?: string;
}

/** Options passed when opening a new document. */
export interface OpenDocumentOptions {
  content: string;
  filePath?: string;
  language?: string;
  highlight?: (text: string, language: string) => string;
  matchingConfig?: MatchingConfig;
  toolbarActions?: ToolbarAction[];
  fontSize?: number;
  /** User-owned prefs from a prior session. Shallow-merged over matchingConfig. */
  prefs?: UserPrefs;
  /** When false, hides the built-in settings gear even if sub-options exist. Default auto. */
  showSettings?: boolean;
  /** Preview/reader render hook. See contributions.ts for full semantics. */
  render?: (text: string, language: string | null) => string;
  /** Preview/reader pre-render hook. See contributions.ts for full semantics. */
  transform?: (text: string, language: string | null) => string;
  /** Editor-only: start the editor in preview mode. Default false. */
  startInPreview?: boolean;
}

/** Recursive meta tree — per-field hints keyed alongside the inspected value. */
export interface InspectorMeta {
  /** Renderer dispatch tag. Wins over value.__type when both are present. */
  type?: string;
  /** Override the field's auto-derived label. */
  label?: string;
  /** Skip this field during fallback walking. */
  hidden?: boolean;
  /** Force read-only; primitives rendered as read-only leaves. */
  readonly?: boolean;
  /** For object values: per-field meta keyed by field name. */
  fields?: { [key: string]: InspectorMeta };
  /** For array values: default meta applied to every item. */
  item?: InspectorMeta;
}

/** Consumer-supplied commit sink for the inspector's fallback walker. Called by the
 *  walker *before* its default in-place mutation + history push. Receives the path from
 *  the root inspected value to the edited field (numeric indices for arrays, string keys
 *  for objects) and the proposed new value. Return `true` to signal the consumer has
 *  routed the edit elsewhere (e.g. through their own editor.dispatch); the walker will
 *  skip both the in-place write and the history push. Return `false`, `undefined`, or
 *  throw to let the walker commit as normal. Not invoked for custom renderers mounted at
 *  the root, since those have no walker path. */
export type WalkerCommitOverride = (path: (string | number)[], next: unknown) => boolean | void;

/** Options for opening an inspector instance in sh3-editor's registry. */
export interface OpenInspectorOptions {
  value: unknown;
  meta?: InspectorMeta;
  readonly?: boolean;
  toolbarActions?: ToolbarAction[];
  /** Route walker field commits through a consumer-owned sink (e.g. the caller's own
   *  editor.dispatch) so edits join the caller's coalesce window, autosave stream, and
   *  undo stack. See `WalkerCommitOverride` for semantics. */
  onCommit?: WalkerCommitOverride;
}

/** The object a custom inspector renderer receives as props. */
export interface InspectorApi {
  push(cmd: HistoryCommand): void;
  readonly readonly: boolean;
  readonly history: HistoryController;
}

export interface InspectorRendererProps {
  value: unknown;
  meta?: InspectorMeta;
  api: InspectorApi;
  /** Optional commit hook supplied by the walker when this renderer is mounted at a
   *  field site. Custom renderers call this with the new value; the walker builds the
   *  apply/revert history command and writes back to the inspected object. Absent for
   *  root-level mounts, in which case the renderer has no parent to write to. */
  onCommit?: (next: unknown) => void;
}

/** The public API surface exposed to consuming shards. */
export interface EditorApi {
  getContent(instanceId: string): string | null;
  isDirty(instanceId: string): boolean;
  getDocument(instanceId: string): EditorDocument | null;
  listInstances(): string[];
  /**
   * @deprecated since 0.10.0 — register an `EditorDocumentContribution`
   *   under `EDITOR_DOCUMENT_POINT` from `@unfinished-lair/sh3-editor/contributions`
   *   instead. Kept for in-tree shards that haven't migrated; will be
   *   removed in a future major.
   */
  openDocument(id: string, opts: OpenDocumentOptions): void;
  /**
   * @deprecated since 0.10.0 — dispose the contribution registration
   *   (the disposer returned from `ctx.contributions.register`) instead.
   */
  closeDocument(id: string): void;
  /**
   * @deprecated since 0.10.0 — call the `replace` callback handed to your
   *   `EditorDocumentContribution.bind(replace)` hook with `{ content }`.
   */
  updateContent(id: string, content: string, cursorStart: number, cursorEnd: number): void;
  markClean(id: string): void;
  /**
   * @deprecated since 0.10.0 — set `EditorDocumentContribution.onContentChange`
   *   on the descriptor for the slot you care about; per-slot, no id-filter.
   */
  onContentChange(callback: (id: string, content: string) => void): () => void;
  /**
   * @deprecated since 0.10.0 — use `EditorDocumentContribution.onDirtyChange`.
   */
  onDirtyChange(callback: (id: string, dirty: boolean) => void): () => void;
  /**
   * @deprecated since 0.10.0 — use `EditorDocumentContribution.onSave`.
   */
  onSave(callback: (id: string) => void): () => void;
  /**
   * @deprecated since 0.10.0 — use `EditorDocumentContribution.onPrefsChange`.
   */
  onPrefsChange(callback: (id: string, prefs: UserPrefs) => void): () => void;

  // Inspector additions
  openInspector(id: string, opts: OpenInspectorOptions): void;
  closeInspector(id: string): void;
  getInspectorValue(id: string): unknown | null;
  listInspectorInstances(): string[];
  onInspectorValueChange(callback: (id: string, value: unknown) => void): () => void;

  // Color picker
  openColorPicker(id: string, opts: OpenColorPickerOptions): void;
  closeColorPicker(id: string): void;
  getColorPickerValue(id: string): string | null;
  listColorPickerInstances(): string[];
  onColorPickerValueChange(callback: (id: string, hex: string) => void): () => void;
  onColorPickerPrefsChange(callback: (id: string, prefs: ColorPickerPrefs) => void): () => void;

  // Generic history bus
  history(instanceId: string): HistoryController;
}

/** A reversible command on the undo stack. push() does NOT call apply();
 *  the caller is responsible for putting the world in the post-apply state
 *  before recording. undo runs revert(); redo runs apply(). */
export interface HistoryCommand {
  apply(): void;
  revert(): void;
  meta?: {
    kind?: string;
    label?: string;
    timestamp?: number;
    [key: string]: unknown;
  };
}

/** Per-instance history surface. Stable across the lifetime of the
 *  instance — calling history(id) always returns the same object. */
export interface HistoryController {
  push(cmd: HistoryCommand): void;
  undo(): boolean;
  redo(): boolean;
  peek(): HistoryCommand | null;
  replaceTop(cmd: HistoryCommand): boolean;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  clear(): void;
  onChange(cb: () => void): () => void;
}

/** A single palette preset. Built-in palettes set `builtin: true`; user palettes omit it. */
export interface ColorPalette {
  id: string;
  label: string;
  colors: string[]; // hex strings, e.g. '#FF0000'
  builtin?: boolean;
}

/** User-owned view preferences for the color picker.
 *  Persisted by the consumer (like editor `UserPrefs`). */
export interface ColorPickerPrefs {
  mode: 'hsv' | 'rgb';
}

/** Options passed when opening a color picker instance. */
export interface OpenColorPickerOptions {
  value: string;                 // initial hex, e.g. '#ff0000'; invalid → '#000000'
  readonly?: boolean;
  toolbarActions?: ToolbarAction[];
  prefs?: ColorPickerPrefs;      // consumer-provided initial prefs from prior session
  compact?: boolean;             // tighter layout; inspector renderer sets true
}

// --- Cross-shard color-panel types (≥ 0.7.0) ---
export type {
  ColorPanelDescriptor,
  ColorPanelController,
} from './color-panel/contributions';

// --- Preview / Reader (≥ 0.11.0) ---
export type { PreviewLinkEvent } from './contributions';
