# sh3-file-explorer

Official SH3 file explorer. Browses tenant documents and manages Document Sync API grants.

- Requires `sh3-core ^0.8.1`.
- Declares the `documents:browse` permission (needed for `ctx.browse` and `ctx.syncRegistry()`).
- Exposes one app (`sh3-file-explorer-app`) and one shard (`sh3-file-explorer`) with two views: `Files` and `Connectors`.
- Never takes the `documents:sync` permission — it only observes grants and helps the user authorize scopes through the core-trusted `SyncGrantPicker`.

## Scripts

```bash
npm --workspace sh3-file-explorer run build            # library build (dist/)
npm --workspace sh3-file-explorer run build:artifact   # deployable artifact (dist/artifact/)
npm --workspace sh3-file-explorer run dev              # watch build
```

## Manual QA checklist

Load the package into a host SH3 environment with at least one document and one sync-capable connector installed, then:

1. Launch the File Explorer app from the home screen. Two tabs appear: **Files**, **Connectors**.
2. **Files** tab renders a tree grouped by shard id.
3. Expanding a shard or folder reveals nested folders/files; the tree is reactive to `ctx.browse.watchDocuments`.
4. Selecting a file populates the right-hand panel with the path, shard id, and a coverage line.
5. Clicking **Sync this path…** opens the `SyncGrantPicker` prefilled with a `path` scope for the current selection.
6. Granting via the picker refreshes the coverage line; the **Connectors** tab now shows the scope under the chosen connector.
7. **Connectors** tab lists all ids returned by `registry.listAllConnectorIds()`.
8. **Manage** expands a connector row and lists its scopes; per-scope **Revoke** removes a single scope and refreshes the list.
9. **Revoke all** prompts a confirm dialog, then revokes every scope for the connector.
10. **Open setup…** stays hidden because the cross-shard setup-view registration mechanism is a deferred item. Re-validate once `sh3-connector-sh3` exists and registers via the convention documented in the spec.
11. If the host grants the app without `documents:browse`, both views render a clear permission-missing message instead of partial functionality.

## Deferred items

- Storage + read mechanism for the `sh3-file-explorer:connector-views` registration key.
- Cross-shard view navigation for **Open setup…**.
- Sync coverage badges on tree rows, conflicts view, drag-drop, file preview, context menu.
