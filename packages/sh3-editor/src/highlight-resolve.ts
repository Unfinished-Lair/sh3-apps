import type { EditorHighlighterContribution } from './contributions';

/** Resolve the syntax-highlight function for `language` from the registered
 *  highlighter contributions.
 *
 *  Matching rules (mirrors the `sh3.file-handler` priority convention):
 *   - A contribution matches when its `languages` array includes `language`.
 *   - A contribution with no `languages` array is a wildcard fallback that
 *     matches any language.
 *   - A language-specific match always beats a wildcard fallback, regardless
 *     of priority. Within the same specificity tier, the highest `priority`
 *     (default 0) wins; ties keep the first registered.
 *   - `language === null` never resolves a highlighter (plain text → escaped).
 *
 *  Returns the chosen `highlight` function, or `null` when nothing matches. */
export function resolveHighlighter(
  list: readonly EditorHighlighterContribution[],
  language: string | null,
): EditorHighlighterContribution['highlight'] | null {
  if (!language) return null;

  let specific: EditorHighlighterContribution | null = null;
  let wildcard: EditorHighlighterContribution | null = null;

  for (const c of list) {
    if (c.languages === undefined) {
      if (wildcard === null || (c.priority ?? 0) > (wildcard.priority ?? 0)) wildcard = c;
      continue;
    }
    if (c.languages.includes(language)) {
      if (specific === null || (c.priority ?? 0) > (specific.priority ?? 0)) specific = c;
    }
  }

  const chosen = specific ?? wildcard;
  return chosen ? chosen.highlight : null;
}
