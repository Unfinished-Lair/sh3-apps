# sh3-file-explorer changelog

## 0.8.0 — 2026-05-21 — File-handler dispatch + clipboard + folder ops

### Added
- File-handler dispatch: double-click, Enter, and the Open context-menu entry now route through `sh3.file-handler` contributions. Selection panel shows an "Open with <handler>" button when a file is selected.
- Clipboard actions: Cut (`Ctrl+X`), Copy (`Ctrl+C`), Paste (`Ctrl+V`). Same-shard moves use `browse.renameFrom`; cross-shard moves go via `readFrom` + `writeTo` + `deleteFrom`. Same-folder copies auto-rename with a `(copy)` suffix. Cut rows dim in the tree.
- Folder operations: `New Folder…` (palette + context, uses a `.keep` placeholder pending [sh3#34](https://github.com/Unfinished-Lair/sh3/issues/34)) and `Rename…` (`F2`) on files and folders. Folder rename and folder paste fan out across descendants with `Promise.allSettled` aggregation.
- `Open With…` context-menu action that surfaces all matching handlers when several extensions are claimed by multiple shards.

### Changed
- `peerDependencies.sh3-core` bumped to `^0.22.5` for `FileHandlerDescriptor`, `BrowseCapability.{readFrom,writeTo,renameFrom,deleteFrom}`, and `documents:browse` + `documents:read` + `documents:write` permissions.
- Vitest config picks up `@sveltejs/vite-plugin-svelte` so `.svelte.ts` runes-based stores can be unit-tested.

## 0.7.1 — 2026-05-06

### Changed
- `peerDependencies.sh3-core` bumped from `^0.11.1` to `^0.13.0`. The cross-shard delete primitive (`browse.deleteFrom`) ships in 0.11.8+ and is present in current 0.13.x hosts; the runtime feature-detect now lights up the real delete path instead of the gate toast.
- Feature-gate toast text updated to drop the "RFC pending" framing now that the upstream API has shipped.

## 0.7.0 — 2026-04-27

### Added
- `Delete` and `Shift+Delete` keyboard shortcuts on the Files view (registered via sh3-core's Actions framework). Action also reachable from the right-click menu and command palette.
- Confirmation modal showing a raw-text preview (truncated at 4096 chars) for files, and a count-and-warning for folders. `Shift+Delete` bypasses the modal for files only — folders always confirm.
- `documents:read` declared in the manifest for the preview fetch.
- `documents:write` declared in the manifest for the upcoming `ctx.browse.deleteFrom` extension.

### Changed
- `peerDependencies.sh3-core` bumped from `^0.10.1` to `^0.11.1` (Actions framework).

### Notes
- The cross-shard delete primitive (`BrowseCapability.deleteFrom`) requires sh3-core ≥ 0.12.0. Until that ships, the Delete action toasts `Delete requires sh3-core with browse.deleteFrom (RFC pending).` See `docs/sh3-rfcs/2026-04-27-browse-delete-from.md` (local; not committed).
