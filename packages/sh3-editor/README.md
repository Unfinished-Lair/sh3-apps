# sh3-editor

Reusable text editor shard for SH3. Provides a configurable, multi-instance code/text editor with syntax highlighting, undo/redo, bracket/indent matching, and a pluggable toolbar.

## Features

- **Cross-shard color picker.** Registers as a `sh3.color-picker` contributor — `shell.color.pick()` from any shard uses sh3-editor's rich picker (SV square, palettes, HSV/RGB toggle) when the shard is active. Falls back to native `<input type="color">` when inactive.

## Usage

Add `sh3-editor` to your app's `requiredShards`, then use the API:

```typescript
const editor = registeredShards.get('sh3-editor').api;

editor.openDocument('my-file', {
  content: 'hello world',
  filePath: 'src/main.ts',
  language: 'typescript',
  highlight: myHighlighter,
  matchingConfig: { brackets: [['(', ')'], ['{', '}']] },
  toolbarActions: [
    { id: 'run', label: 'Run', icon: '▶', onAction: () => run() },
  ],
});

editor.onSave((id) => saveFile(id));
editor.onContentChange((id, content) => handleChange(id, content));
```

## Indent behavior

Set `matchingConfig.indentType` to enable auto-indent on Enter:

- `'none'` (default) — no custom Enter handling.
- `'brace'` — C/JS/TS-style: Enter after `{` adds one indent; Enter between `{|}` splits lines; typing `}` on an empty-indented line dedents.
- `'indent'` — Python/YAML-style: Enter copies the leading whitespace of the current line.

Secondary options:
- `indentUnit` (default `2`) — number of spaces per indent level.
- `braceStyle` (default `'inline'`) — `'inline'` (K&R) or `'allman'`; only applies to `'brace'`.

```typescript
editor.openDocument('my-file', {
  content: '',
  matchingConfig: {
    brackets: [['(', ')'], ['{', '}']],
    indentType: 'brace',
    indentUnit: 2,
    braceStyle: 'inline',
  },
  prefs: loadedUserPrefs, // optional — hydrates from your own store
  showSettings: true,      // optional — default auto
});

editor.onPrefsChange((id, prefs) => saveUserPrefs(id, prefs));
```

When `indentType` has user-editable options, a gear toolbar button opens a popover letting the user change `indentUnit` and (for `'brace'`) `braceStyle`. Changes fire `onPrefsChange`; sh3-editor does not persist prefs — the consuming shard does.

## Help view

Pressing **F1** opens a Help modal listing the hotkeys active in the current context. The Hotkeys tab groups actions by scope tier (Global / App / View / Focus / Selection), with user rebindings and platform modifiers resolved.

The Help view is also a registered standalone view (`sh3-editor:help`) — pin it in a layout for a persistent reference panel.

### Extending Help with custom tabs

Help aggregates tabs from any shard that registers against the `sh3-editor:help.tabs` contribution point. Use this to ship integrated guides, changelogs, cheatsheets, or any read-only reference content.

See [`docs/authoring-help-tabs.md`](./docs/authoring-help-tabs.md) for the full authoring guide.

## Markdown / richtext preview

The editor supports a rendered preview of the buffer. Two ways to use it:

### In-editor preview toggle

`sh3-editor:editor` shows a 👁 toolbar button when the document is renderable
(language === `'markdown'`, filePath ends in `.md`, or the contribution provides
its own `render`). Click to switch to a rendered view; click again to return to
edit mode. `Ctrl+Shift+V` is the same toggle. The textarea state (cursor,
selection, undo) is preserved across toggles.

To start a document directly in preview mode:

```typescript
ctx.contributions.register<EditorDocumentContribution>(EDITOR_DOCUMENT_POINT, {
  slotId: 'my-slot',
  seed: {
    content: '# Hello\n\nMarkdown here.',
    language: 'markdown',
    startInPreview: true,
  },
});
```

### Standalone reader view

`sh3-editor:reader` is a read-only view registered as a standalone shard view.
Hosts mount it via `SlotNode { viewId: 'sh3-editor:reader', slotId: '<slot>' }`
and feed it documents through the same `EDITOR_DOCUMENT_POINT`. Use it for
docs-folder browsers, changelog viewers, anywhere edit isn't needed.

### Custom renderers

By default, markdown is rendered with the bundled `marked`-based renderer.
Override per slot with the `render` field on the seed:

```typescript
{
  slotId: 'my-slot',
  seed: {
    content,
    language: 'asciidoc',
    render: (text, language) => myAsciidocToHtml(text),
  },
}
```

### Pre-render transform

For small text rewrites that should still feed the bundled markdown renderer
(wiki-link sugar, footnote stubs, etc.), use `transform` instead of replacing
the renderer entirely. The transform receives the raw buffer and runs before
sh3-editor's resolved renderer:

```typescript
{
  slotId: 'my-slot',
  seed: {
    content,
    language: 'markdown',
    // [[uuid|Label]] → [Label](wiki:uuid)
    transform: (text) => text.replace(
      /\[\[([^\]|]+)\|([^\]]+)\]\]/g,
      (_m, target, label) => `[${label}](wiki:${target})`,
    ),
  },
  onLinkClick(e) {
    if (e.href.startsWith('wiki:')) {
      myRouter.openByUuid(e.href.slice('wiki:'.length));
      return 'handled';
    }
  },
}
```

`transform` composes with `render`: if both are set, `transform` runs first.
If `render` is omitted and the document is markdown, the transformed text
flows into the bundled `marked`-based renderer — no extra dependency needed.

### Link clicks

Anchors inside rendered content are intercepted. The contribution receives an
`onLinkClick` callback for in-app navigation:

```typescript
{
  slotId: 'my-slot',
  seed: { content, language: 'markdown' },
  onLinkClick(e) {
    if (e.kind === 'internal') {
      navigateTo(e.href);
      return 'handled';
    }
    // 'default' (or void) lets sh3-editor apply default behavior:
    //  - 'anchor' → scroll to matching id
    //  - 'external' → shell.openExternal or window.open
    //  - 'internal' → no-op
  },
}
```
