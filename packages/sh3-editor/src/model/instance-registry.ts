import type { EditorDocument, OpenDocumentOptions, UserPrefs, MatchingConfig } from '../types';
import { HistoryEngine } from './history';

export interface RegistryEntry {
  document: EditorDocument;
  history: HistoryEngine;
  options: OpenDocumentOptions;
  /** Mutable runtime prefs — initialized from matchingConfig, overridden by opts.prefs,
   *  and updated by the settings popover. */
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

  open(id: string, opts: OpenDocumentOptions): RegistryEntry {
    if (this.entries.has(id)) {
      return this.entries.get(id)!;
    }

    const document: EditorDocument = {
      id,
      content: opts.content,
      filePath: opts.filePath ?? null,
      cursorStart: 0,
      cursorEnd: 0,
      scrollTop: 0,
      scrollLeft: 0,
      dirty: false,
      language: opts.language ?? null,
    };

    const entry: RegistryEntry = {
      document,
      history: new HistoryEngine(),
      options: opts,
      prefs: resolvePrefs(opts.matchingConfig, opts.prefs),
    };

    this.entries.set(id, entry);
    return entry;
  }

  close(id: string): boolean {
    return this.entries.delete(id);
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
    this.entries.clear();
  }
}
