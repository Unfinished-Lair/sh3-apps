import type { EditorDocument, OpenDocumentOptions, UserPrefs, MatchingConfig } from '../types';

export interface RegistryEntry {
  document: EditorDocument;
  options: OpenDocumentOptions;
  prefs: Required<UserPrefs>;
}

const DEFAULT_INDENT_UNIT = 2;
const DEFAULT_BRACE_STYLE = 'inline' as const;

function resolvePrefs(mc: MatchingConfig | undefined, overrides: UserPrefs | undefined): Required<UserPrefs> {
  return {
    indentUnit: overrides?.indentUnit ?? mc?.indentUnit ?? DEFAULT_INDENT_UNIT,
    braceStyle: overrides?.braceStyle ?? mc?.braceStyle ?? DEFAULT_BRACE_STYLE,
  };
}

export class InstanceRegistry {
  private entries = new Map<string, RegistryEntry>();
  private onClose?: (id: string) => void;

  constructor(onClose?: (id: string) => void) {
    this.onClose = onClose;
  }

  open(id: string, opts: OpenDocumentOptions): RegistryEntry {
    if (this.entries.has(id)) {
      return this.entries.get(id)!;
    }

    const document = $state<EditorDocument>({
      id,
      content: opts.content,
      filePath: opts.filePath ?? null,
      cursorStart: 0,
      cursorEnd: 0,
      scrollTop: 0,
      scrollLeft: 0,
      dirty: false,
      language: opts.language ?? null,
    });

    const entry: RegistryEntry = {
      document,
      options: opts,
      prefs: resolvePrefs(opts.matchingConfig, opts.prefs),
    };

    this.entries.set(id, entry);
    return entry;
  }

  close(id: string): boolean {
    const had = this.entries.delete(id);
    if (had && this.onClose) this.onClose(id);
    return had;
  }

  get(id: string): RegistryEntry | undefined {
    return this.entries.get(id);
  }

  has(id: string): boolean {
    return this.entries.has(id);
  }

  list(): string[] {
    return [...this.entries.keys()];
  }

  clear(): void {
    const ids = [...this.entries.keys()];
    this.entries.clear();
    if (this.onClose) for (const id of ids) this.onClose(id);
  }
}
