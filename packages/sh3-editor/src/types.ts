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

/** Configuration for bracket and indent matching. */
export interface MatchingConfig {
  brackets?: [string, string][];
  indentBased?: boolean;
  indentUnit?: number;
}

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
}

/** Full instance data stored in the registry. */
export interface EditorInstance {
  document: EditorDocument;
  options: OpenDocumentOptions;
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
}
