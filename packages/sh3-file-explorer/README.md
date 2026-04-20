# sh3-file-explorer

Official SH3 file explorer — browses tenant documents.

- Requires `sh3-core ^0.9.0`.
- Declares the `documents:browse` permission.
- Exposes one app (`sh3-file-explorer-app`) and one shard (`sh3-file-explorer`) with one view: `Files`.

## Scripts

```bash
npm --workspace sh3-file-explorer run build            # library build (dist/)
npm --workspace sh3-file-explorer run build:artifact   # deployable artifact (dist/artifact/)
npm --workspace sh3-file-explorer run dev              # watch build
npm --workspace sh3-file-explorer run test             # vitest
```

## Contributions API (0.4.0+)

Other shards can contribute per-selection action buttons to the file-explorer's selection panel via sh3-core's `ctx.contributions`:

```ts
import type { SelectionAction } from 'sh3-file-explorer';         // type-only
import { SELECTION_ACTION_POINT } from 'sh3-file-explorer';       // value (a constant string)

activate(ctx) {
  ctx.contributions.register<SelectionAction>(SELECTION_ACTION_POINT, {
    id: 'my-shard:do-thing',                      // shard-prefixed, globally unique
    label: 'Do thing',
    appliesTo: (sel) => sel.path.endsWith('.md'), // optional filter
    onInvoke: (sel) => { /* ... */ },
    kind: 'secondary',                             // or 'primary'
  });
  // Framework auto-unregisters on shard deactivate.
}
```

The panel re-renders on register/unregister. Errors thrown by `onInvoke` are caught and surfaced as a toast — they don't crash the panel.

## Manual QA checklist

Load the package into a host SH3 environment with at least one document:

1. Launch the File Explorer app from the home screen. One view appears: **Files**.
2. The tree is grouped by shard id; expanding reveals folders/files, reactive to `ctx.browse.watchDocuments`.
3. Selecting a file populates the right-hand panel with the path and shard id.
4. If another shard registers a selection action (see above), a button row appears below the selection header.
5. If the host grants the app without `documents:browse`, the view renders a clear permission-missing message.
