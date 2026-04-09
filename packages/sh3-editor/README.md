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
