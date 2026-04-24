# sh3-editor

Reusable text editor shard for SH3. Provides a configurable, multi-instance code/text editor with syntax highlighting, undo/redo, bracket/indent matching, and a pluggable toolbar.

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
