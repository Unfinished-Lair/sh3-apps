# sh3-file-explorer

Official SH3 file explorer — browses tenant documents.

- Requires `sh3-core ^0.11.1`.
- Declares the `documents:browse`, `documents:read`, and `documents:write` permissions.
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

## Deleting documents (0.7.0+)

Within the Files view, the explorer provides keyboard shortcuts for deletion:

- `Delete` — opens a confirmation modal with a raw-text preview (file) or a count-and-warning (folder), then deletes on confirm.
- `Shift+Delete` — deletes a file immediately, no modal. Folders always confirm regardless of modifier.

The action is also reachable via right-click and the command palette (registered through sh3-core's Actions framework).

The shard declares `documents:read` and `documents:write` so the modal can preview content and the delete can land. The cross-shard delete itself goes through `ctx.browse.deleteFrom`, which is added in sh3-core 0.12.0+. Against earlier versions, the action toasts `Delete requires sh3-core with browse.deleteFrom (RFC pending).` and bails. See `docs/sh3-rfcs/2026-04-27-browse-delete-from.md` (local) for the upstream extension.

## Verifying delete locally

**Pre-RFC (sh3-core 0.11.x):**
1. `npm run build:artifact` in `packages/sh3-file-explorer/`.
2. Install the artifact in a host with at least one document from another shard (e.g. sh3-editor).
3. Open File Explorer, select a file, press `Delete`.
4. Expect a toast: `Delete requires sh3-core with browse.deleteFrom (RFC pending).` The action also appears in the right-click menu and palette.

**Post-RFC (sh3-core ≥ 0.12.0):**
1. Bump the peer dep to that version; reinstall and rebuild.
2. Repeat step 3 above. Expect the modal with a text preview; Confirm removes the file from the tree within ~100ms.
3. Select a folder with descendants, press `Delete`. Expect the modal with the descendant count, no list. Confirm removes all descendants.
4. Press `Shift+Delete` on a file. Expect immediate delete, success toast.
5. Press `Shift+Delete` on a folder. Expect the modal still appears.
