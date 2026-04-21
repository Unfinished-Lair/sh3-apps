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

/** Options for opening an inspector instance in sh3-editor's registry. */
export interface OpenInspectorOptions {
  value: unknown;
  meta?: InspectorMeta;
  readonly?: boolean;
  toolbarActions?: ToolbarAction[];
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
}

/** The public API surface exposed to consuming shards. */
export interface EditorApi {
  getContent(instanceId: string): string | null;
  isDirty(instanceId: string): boolean;
  getDocument(instanceId: string): EditorDocument | null;
  listInstances(): string[];
  openDocument(id: string, opts: OpenDocumentOptions): void;
  closeDocument(id: string): void;
  updateContent(id: string, content: string, cursorStart: number, cursorEnd: number): void;
  markClean(id: string): void;
  onContentChange(callback: (id: string, content: string) => void): () => void;
  onDirtyChange(callback: (id: string, dirty: boolean) => void): () => void;
  onSave(callback: (id: string) => void): () => void;
  onPrefsChange(callback: (id: string, prefs: UserPrefs) => void): () => void;

  // Inspector additions
  openInspector(id: string, opts: OpenInspectorOptions): void;
  closeInspector(id: string): void;
  getInspectorValue(id: string): unknown | null;
  listInspectorInstances(): string[];
  onInspectorValueChange(callback: (id: string, value: unknown) => void): () => void;

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
