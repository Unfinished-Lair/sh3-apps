export interface DocSummary {
  /** Path under the `docs/` root, e.g. 'gemini/notes.md'. */
  path: string;
  /** Provider folder this doc lives under (first path segment). */
  providerId: string;
  size: number;
  lastModified: number;
}
