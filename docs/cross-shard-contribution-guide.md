# Cross-Shard Contribution Guide

How shards in this monorepo extend each other's UIs without coupling, using `sh3-connector-r2` × `sh3-file-explorer` as the worked example. Read this before building another cloud-storage connector or any shard that wants to surface state into the file explorer.

---

## Part 1 — Communication Principles

SH3 runs every shard in one tenant in a single JS realm, but installed shards load from a registry as separate blob URLs. The realm is shared; the module graph is not. This shapes everything below.

### Rule 1 — No bare runtime imports across shards

`sh3-core`'s loader rewrites bare specifiers via regex before `import(blobUrl)`. Only `sh3-core(/...)?` and `svelte(/...)?` are shimmed. Anything else passes through unrewritten and the browser rejects it. So a line like

```ts
import { someThing } from 'sh3-file-explorer';   // ❌ install-time failure
```

works in dev (vitest + node_modules) but breaks the moment the shard is installed via the registry.

### Rule 2 — Type-only imports cross freely

```ts
import type { SelectionAction, DocumentBadgeProvider } from 'sh3-file-explorer';   // ✅ erased at compile time
```

Types disappear during build. Only their structural shape survives. This is the contract one shard publishes for others to satisfy.

### Rule 3 — Inline contribution-point IDs as string literals

If you need the constant for a contribution point, **don't** import it:

```ts
import { SELECTION_ACTION_POINT } from 'sh3-file-explorer';   // ❌ runtime value, breaks at install
```

Inline the literal next to the import:

```ts
import type { SelectionAction } from 'sh3-file-explorer';
const SELECTION_ACTION_POINT = 'sh3-file-explorer.selectionAction';
```

The provider package owns the canonical name; the consumer hardcodes it. The mismatch surface is one string in two files — easy to keep in sync.

### Rule 4 — All cross-shard wiring goes through `ctx.contributions`

`sh3-core` exposes a single per-tenant registry. Providers register descriptors at a point id; consumers list and iterate. Nothing else crosses shard boundaries:

- No direct method calls between shards.
- No bus, no pub/sub, no global singletons reaching across (the `shell` singleton is for shared overlays, not inter-shard state).
- Document data flows through `ctx.browse` / `ctx.documents` (a sh3-core capability), not via shard-to-shard reads.

### Rule 5 — Contribution-providing shards must `autostart`

By default, a shard activates only while one of its declaring apps is open. When the app closes, the shard is deactivated and its contributions are auto-cleaned. So a connector that exists only to surface state into *other* apps will appear empty whenever its own app is closed.

```ts
export const shard: SourceShard = {
  manifest: { /* … */ },
  autostart() {},                      // empty body is fine; presence is the marker
  async activate(ctx) { /* … */ },
};
```

The presence of `autostart` flips the host bootstrap into pre-activating the shard at tenant boot and skipping deactivation when consuming apps close. Body runs after `activate`; an empty function works as a pure marker.

### Rule 6 — Use `$effect.root()` for runes outside components

`createExplorerStore(ctx)` is called from the shard's `activate(ctx)` — not inside a component. Using `$effect()` there throws `effect_orphan`. Wrap the effects in `$effect.root(() => { … })` to create an explicit tracking scope, capture the disposer, and call it from the shard's `deactivate()` (or expose a `dispose()` on the store and have the shard call it).

```ts
const disposeEffects = $effect.root(() => {
  $effect(() => { /* subscribe */ });
});
// in shard.deactivate():
store.dispose();   // calls disposeEffects()
```

---

## Part 2 — The R2 ↔ File Explorer Bridge

Two shards. Three contribution surfaces. One direction of communication.

### Direction map

```
sh3-file-explorer (provider of the contribution points)
        ▲                     ▲
        │ register actions    │ register badge provider
        │                     │
sh3-connector-r2 (consumer / registers descriptors)
```

`sh3-file-explorer` publishes the *contribution points* — the named slots where extensions plug in. `sh3-connector-r2` publishes the *descriptors* — concrete implementations that fill those slots. The explorer renders. The connector responds.

### Surface 1 — Selection actions (`'sh3-file-explorer.selectionAction'`)

Action buttons in the SelectionPanel. r2 registers two:

| id | Trigger | Behavior |
| --- | --- | --- |
| `sh3-connector-r2:backup-file` | `appliesTo: sel.kind === 'file'` | Single-file `upload()` |
| `sh3-connector-r2:backup-folder` | `appliesTo: sel.kind === 'folder'` | Opens an r2-owned recursion-confirm dialog, then `backupFolder({ recursive })` |

The descriptor type (`SelectionAction`) carries `id`, `label`, optional `appliesTo(sel)`, `onInvoke(sel)`. The explorer enumerates all registered actions per selection and renders them filtered by `appliesTo`.

### Surface 2 — Document badges (`'sh3-file-explorer.documentBadge'`)

Per-row status icons in the tree + verbose blocks in the SelectionPanel. r2 registers one:

```ts
{
  id: 'sh3-connector-r2:backup-status',
  getBadge: (doc) => buildR2Badge(runtime.peekBadgeIndex(), doc),
  onChange: (cb) => runtime.subscribeBadgeChange(cb),
}
```

The descriptor is a *provider*, not a per-doc descriptor — registered once. The explorer calls `getBadge(doc)` per visible row inside a `$derived`. `onChange(cb)` is the invalidation channel: when r2's state changes, it bumps the explorer's reactive tick and the derived re-runs.

`getBadge` returns `Badge | null`. `null` means "no badge for this doc"; we use silence (rather than a "not backed up" badge) to keep the tree visually quiet for partially-backed-up trees.

### Surface 3 — Folder backup orchestration (internal to r2)

Not a cross-shard contribution — but it's the data path the folder selection action drives. `walkScope({ shardId, pathPrefix, recursive })` filters the tenant's document index in memory. `backupFolder(...)` iterates the filtered set, calls a caller-supplied `upload(item)` per doc, aggregates outcomes, and reports progress via callback. Both the connector's own Backup tab and the folder dialog call the same `backupFolder()` — single source of truth for the loop logic.

### Reactivity model

```
[upload completes]
        │
        ▼
runtime.recordBadgeUpload(entry)
        │
        ├── append entry to in-memory badgeIndex (Map)
        │
        └── notifyBadgeChange()
                  │
                  ▼
              for each subscriber: cb()
                  │
                  ▼
        explorer's badge-store tick++ ($state)
                  │
                  ▼
        DocumentTree + SelectionPanel $derived re-run
                  │
                  ▼
        getBadgesFor(node) called → iterates providers → calls getBadge(node) → reads new badgeIndex
                  │
                  ▼
        new badge renders in the row
```

One-way data flow. The explorer never reaches into r2's internals; r2 publishes a snapshot through a function that the explorer calls. Subscriptions are reset whenever providers come or go (the explorer subscribes to the registry's `onChange` and re-binds per-provider listeners on each registry change).

### What r2 imports from the explorer

Exactly two type names and two string literals — that's the entire surface area.

```ts
// shard.ts
import type { SelectionAction, DocumentBadgeProvider } from 'sh3-file-explorer';
const SELECTION_ACTION_POINT = 'sh3-file-explorer.selectionAction';
const DOCUMENT_BADGE_POINT   = 'sh3-file-explorer.documentBadge';
```

No value imports. No internal modules touched. The explorer can refactor freely as long as the descriptor shapes stay structurally compatible.

---

## Part 3 — Building Another Storage Connector

R2 is one S3-compatible bucket-store with SigV4 signing. The architecture below survives unchanged for **any** push-to-remote storage (BunnyCDN, Amazon S3, Backblaze B2, GCS, Azure Blob, an HTTP API, even a remote SH3 tenant). The only swap is the *transport client*.

### What's reusable as-is

These modules have zero R2 knowledge and should be copied verbatim into a new connector (or extracted to a shared `sh3-storage-bridge` package once a second connector exists):

| Module | Role | Storage-specific bits |
| --- | --- | --- |
| `walker.ts` | Filter the tenant doc index by shardId + path prefix + recursion depth | None |
| `upload-log.ts` | Append/read structured logs under a doc-handle directory | None |
| `badge-index.ts` | Build a `${shardId}/${path} → newest entry` map from a log array | None |
| `badge-subscribers.ts` | Set-based subscribe/notify with per-callback error isolation | None |
| `backup-folder.ts` | Iterate a walked set, call a caller-supplied `upload(item)`, aggregate outcomes, report progress | None — `upload` is injected |
| `badges.ts` | File / folder / stale badge logic over an index map | None — branding strings only |
| `runtime.svelte.ts` skeleton | `$state` for targets, progress, `badgeIndex`, `badgeSubs`; lazy `ensureBadgeIndex` with in-flight dedup; `recordBadgeUpload` + `notifyBadgeChange` | None — the runtime composes the storage-agnostic pieces |
| `shard.ts` skeleton | Manifest, view registrations, `autostart()`, two `SelectionAction` registrations, one `DocumentBadgeProvider` registration | Brand strings (id, label) |
| `views/FolderBackupDialog.svelte` | Recursion-confirm modal mounted on `document.body` | None — calls injected `upload` |
| `folder-backup-dialog.ts` | `mount()`/`unmount()` overlay helper | None |

### What's storage-specific

These modules embed the cloud-vendor's wire protocol. Each new connector ships its own:

| Module | Role | Per-storage variation |
| --- | --- | --- |
| `targets.ts` | Persisted config schema (account id, bucket, credentials) | The shape is vendor-specific; the *storage strategy* (one doc-handle file per target) is reusable |
| `r2/client.ts` | High-level methods: `headObject`, `putObject`, `getObject`, `listObjectsV2` | Each connector implements this same interface against its vendor's API |
| `r2/sigv4.ts`, `r2/keys.ts`, `r2/hash.ts`, `r2/fetch.ts` | Request signing, URL building, content addressing, low-level HTTP | Replace with vendor's auth method + URL conventions |
| `foreign-docs.ts` | Read/write through `ctx.browse.readFrom` / `writeTo` (sh3-core 0.9.1+ document capabilities) | None — this is sh3-core, not r2 |

**The minimum viable interface** every storage backend's client must satisfy, observed from how the connector uses it:

```ts
interface StorageClient {
  headObject(key: string): Promise<{ size: number; sha256: string; etag: string } | null>;
  putObject(args: {
    key: string;
    body: string;
    contentType: string;
    sha256: string;
    metadata: Record<string, string>;
  }): Promise<{ etag: string }>;
  getObject(key: string): Promise<string>;
  listObjectsV2(args: { prefix: string }): AsyncIterable<{ key: string; size: number; lastModified: string }>;
}
```

If your vendor exposes those four operations (or you can wrap their SDK to expose them), the rest of the connector is a copy + brand swap.

### Skeleton: BunnyCDN connector

Bunny's Storage API is a flat HTTP API (`PUT https://storage.bunnycdn.com/<zone>/<path>` with `AccessKey: <password>` header). No request signing — auth is a static header. So `bunny/client.ts` is much simpler than `r2/client.ts`:

```ts
// packages/sh3-connector-bunny/src/bunny/client.ts (sketch)
export function createBunnyClient(target: BunnyTarget): StorageClient {
  const base = `https://storage.bunnycdn.com/${target.storageZone}`;
  const headers = { AccessKey: target.password };

  return {
    async putObject({ key, body, contentType, sha256 }) {
      const res = await fetch(`${base}/${key}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': contentType, Checksum: sha256 },
        body,
      });
      if (!res.ok) throw new Error(`Bunny PUT ${res.status}`);
      return { etag: res.headers.get('etag') ?? '' };
    },

    async headObject(key) {
      const res = await fetch(`${base}/${key}`, { method: 'HEAD', headers });
      if (res.status === 404) return null;
      // Bunny doesn't return sha256 in headers; track it client-side via Checksum
      return { size: Number(res.headers.get('Content-Length') ?? 0), sha256: '', etag: res.headers.get('etag') ?? '' };
    },

    async getObject(key) { /* GET, return text */ },
    async *listObjectsV2({ prefix }) { /* GET /?prefix=<...> if Bunny supports it; otherwise paginate via dir listing */ },
  };
}
```

The `targets.ts` schema becomes:

```ts
export interface BunnyTarget {
  id: string;
  label: string;
  storageZone: string;
  password: string;            // Bunny's "Storage Password" = the API key
  pullZoneUrl?: string;        // Optional: for serving back via CDN later
  createdAt: string;
}
```

Everything else in the connector — `walker.ts`, `upload-log.ts`, `backup-folder.ts`, `badges.ts`, `runtime.svelte.ts`, `shard.ts`, the dialog — copies over. Update brand strings (`'sh3-connector-bunny:backup-file'`, "Back up to Bunny", etc.). The contribution registrations and the file-explorer integration are mechanically identical.

### Skeleton: Amazon S3 connector

S3 is the easiest case — R2 is S3-compatible, so `r2/client.ts` is already 95% of an S3 client. The differences:

- S3 uses regional endpoints (`s3.<region>.amazonaws.com`); R2 uses one global endpoint (`<account>.r2.cloudflarestorage.com`). Adapt URL construction in `r2/keys.ts`-equivalent.
- SigV4 requires the AWS region in the credential scope and signing key. R2 always uses `auto` region. Add a `region` field to the target schema and thread it through the signer.
- S3 has a richer object-metadata story (storage class, server-side encryption headers); pass those through `putObject` if you want them.

For an S3 connector, fork `sh3-connector-r2`, rename to `sh3-connector-s3`, change two URL templates and the region handling. Done.

### What to keep identical, even when tempted otherwise

- **Provider registration shape.** Two SelectionActions (file + folder), one DocumentBadgeProvider. Don't invent new contribution points the explorer doesn't know about — if you need richer surfaces, add them to `sh3-file-explorer` first (a generic point that other connectors can plug into too) before consuming.
- **`autostart()` on the shard.** Without it, your badges and actions vanish whenever the user closes your app's tab.
- **Inline string-literal point IDs.** No imported constants from `sh3-file-explorer`. Type-only imports for `SelectionAction` and `DocumentBadgeProvider`.
- **Caller-records-upload pattern.** `upload()` returns the log entry; the *caller* (file action `onInvoke`, BackupView, FolderBackupDialog) calls `runtime.recordBadgeUpload(entry)`. Keep `upload.ts` pure — no implicit reads of runtime state.
- **In-memory badge index hydrated lazily at activate.** Don't make the explorer wait for hydration; emit `null` briefly and let the post-hydration `notifyBadgeChange()` paint badges in.

### What you'll need to design fresh per backend

- Auth UX in `views/components/TargetForm.svelte` (account/zone fields, credential entry).
- The setup help / wizard (Bunny needs zone + storage password; S3 needs access key + secret + region; etc.).
- Object-key conventions if you don't want a flat `<keyPrefix>/<shardId>/<path>` layout.
- Vendor-specific edge cases (rate limits, multipart-upload thresholds, storage classes).

---

## Reference: file paths in the worked example

| Concept | File |
| --- | --- |
| Selection action contribution point | `packages/sh3-file-explorer/src/contributions.ts` |
| Document badge contribution point | `packages/sh3-file-explorer/src/contributions.ts` |
| Explorer reactive store | `packages/sh3-file-explorer/src/explorerShard.svelte.ts` |
| Tree row + badge rendering | `packages/sh3-file-explorer/src/browser/DocumentTree.svelte` |
| Side panel + verbose badges | `packages/sh3-file-explorer/src/browser/SelectionPanel.svelte` |
| Pure badge iteration helper | `packages/sh3-file-explorer/src/browser/iterate-badges.ts` |
| r2 contribution registrations | `packages/sh3-connector-r2/src/shard.ts` |
| r2 runtime + badge index | `packages/sh3-connector-r2/src/runtime.svelte.ts` |
| r2 badge builder | `packages/sh3-connector-r2/src/badges.ts` |
| r2 folder backup orchestrator | `packages/sh3-connector-r2/src/backup-folder.ts` |
| r2 folder dialog | `packages/sh3-connector-r2/src/views/FolderBackupDialog.svelte` |
| r2 walk-scope (storage-agnostic) | `packages/sh3-connector-r2/src/walker.ts` |
| r2 upload-log (storage-agnostic) | `packages/sh3-connector-r2/src/upload-log.ts` |
| R2-specific HTTP client | `packages/sh3-connector-r2/src/r2/client.ts` |
| R2 SigV4 + URL helpers | `packages/sh3-connector-r2/src/r2/{sigv4,keys,hash,fetch}.ts` |
