# Changelog

## 0.3.1

- Re-export `getApi` from the package entry so consumers can `import { getApi } from '@unfinished-lair/sh3-editor'`.

## 0.3.0

- New view `sh3-editor:inspector` — renders arbitrary objects with a fallback walker for plain objects/arrays and editable leaves for primitives.
- Per-instance generic history bus on `EditorApi.history(instanceId)`: `push` / `undo` / `redo` / `peek` / `replaceTop` / `clear` / `onChange`. Custom `HistoryCommand`s from external shards interleave with the editor's text-swap commands in the same stack.
- Inspector renderer contributions — register custom renderers for a type tag via `ctx.contributions.register<InspectorRenderer>(INSPECTOR_RENDERER_POINT, …)`. Subpath: `@unfinished-lair/sh3-editor/inspector/contributions`.
- New `EditorApi` surface: `openInspector` / `closeInspector` / `getInspectorValue` / `listInspectorInstances` / `onInspectorValueChange` / `history(id)`.
- Peer bump: `sh3-core` `^0.10.4` (required for `ctx.contributions`).
- Retroactive documentation under `docs/sh3-editor/{editor,inspector}.md`.
- Primitives subpath d.ts emission deferred — workspace-local consumers can import `<Inspect>` / `<Field>` / `<EditablePrimitive>` by direct path; published subpath is a follow-up.

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
