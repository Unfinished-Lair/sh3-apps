# sh3-file-explorer changelog

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
