# Changelog

## 0.2.0

- Auto-indent on Enter: new `MatchingConfig.indentType` — `'none' | 'brace' | 'indent'`.
- Brace-aware behavior when `indentType === 'brace'`:
  - Enter after `{` adds one indent unit.
  - Enter between `{|}` splits into three lines (inline) or four (allman).
  - Typing `}` on a whitespace-only line dedents to the matching `{`.
- User preferences (`indentUnit`, `braceStyle`) exposed via a built-in settings popover.
  - Gear button appears in the toolbar when the active `indentType` has user-editable options.
  - Can be hidden via `OpenDocumentOptions.showSettings: false`.
- New API: `onPrefsChange(id, prefs)` — fires when the user toggles prefs; consumers own persistence.
- Seed prior prefs via `OpenDocumentOptions.prefs`.
- `MatchingConfig.indentBased` is deprecated; treat as `indentType: 'indent'` when `indentType` is absent.

## 0.1.0

- Initial release
- Multi-instance document management
- Layered textarea editor with syntax highlight overlay
- Custom undo/redo with keystroke coalescing
- Bracket matching (configurable pairs)
- Indent-level matching (for indent-based languages)
- Configurable toolbar via action descriptors
- Public API: openDocument, closeDocument, getContent, isDirty, events
- Tab/Shift+Tab indent/dedent
- Line numbers with scroll sync
