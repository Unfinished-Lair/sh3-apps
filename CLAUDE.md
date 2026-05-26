# SH3 Apps

Monorepo for SH3 user applications built with Svelte 5, Vite, and the sh3-core SDK.

## References

- **SH3 documentation & source:** https://github.com/Unfinished-Lair/sh3/
- **Publishing & build numbers:** see `docs/publishing.md` in the sh3 repo for the `sh3Artifact()` plugin, `buildSuffix`, and `tagPattern`.

## Per-package versioning

Every package under `packages/` carries its own `package.json` version and is released on its own cadence. There is no repo-wide version; do **not** introduce one.

## Tag convention

Releases are tagged per-package using the format:

```
<package-name>-v<version>
```

Examples: `sh3-ai-v0.9.0`, `sh3-style-v0.4.2`, `sh3-editor-v1.0.0`.

Tags are annotated (`git tag -a`) and pushed alongside the release commit. The reserved `build-base` tag is the repo-wide baseline and is unrelated to releases.

## Bumping a package

1. Edit `packages/<pkg>/package.json` — bump `"version"` following semver (patch for additive/fix, minor for new API, major for breaking).
2. Update any sibling notes (per-package CHANGELOG if present, README version header).
3. Commit: `git commit -m "chore(<pkg>): bump to v<version>"`.
4. Tag: `git tag -a <pkg>-v<version> -m "<pkg> v<version>"`.
5. Push commit and tag: `git push origin main && git push origin <pkg>-v<version>`.

The CI `publish.yml` workflow on `main` rebuilds and republishes all package artifacts to gh-pages; bumping `package.json.version` is what makes the new release land in the registry.

## Build-suffix configuration

Each package's `vite.artifact.ts` should be configured so `buildSuffix: 'auto'` produces a count of commits since *that package's* last tag — not the global most-recent tag.

```ts
// packages/<pkg>/vite.artifact.ts
import { sh3Artifact } from 'sh3-core/build';

sh3Artifact({
  buildSuffix: 'auto',
  tagPattern: '<pkg>-v*',   // e.g. 'sh3-ai-v*'
});
```

Without `tagPattern`, `git describe --tags --abbrev=0` picks the most recently tagged package in the repo — usually a different package — and the resulting commit count is meaningless. `tagPattern` is required for every package in this repo.

When a package has never been tagged, the suffix is omitted and the artifact ships as the bare `package.json.version`. That's expected behavior on a first release; the next build after the first tag starts producing `+N` suffixes.

Requires `sh3-core@>=0.26.2` for `tagPattern` support.

## Shard-in-app permission rotation

A shard contributed to an app via `App.manifest.requiredShards` runs inside the **host app's namespace and permission set**, not its own. Specifically:

- **boundId** — `ctx.documents.boundId` resolves to the app id (e.g. `sh3-pipeline`) while the shard is bound, not the shard's own id.
- **grants** — `ctx.documents.grants.browse` / `.write` resolve from the **host app's** `manifest.permissions`, not the shard's. While unbound, the shard's own manifest applies.

Practical implication: a generic-purpose shard like `sh3-editor` (manifest declares `permissions: []`) gains the host app's `documents:*` capabilities while running inside that app. The inspector's `<DocumentOpener>` then browses the full active scope. There is no need to declare `documents:browse` on every reusable shard "just in case"; declare the permission on the app(s) that genuinely need it.

The flip side: a shard cannot rely on its own declared permissions while bound — the host app overrides. Standalone usage (autostart or solo activation) still consults the shard manifest.

Requires `sh3-core@>=0.26.3`. See ADR-025 (Amendment 2026-05-27) for the design rationale.

## Overrides

`package.json` overrides `sh3-core` to the sibling working tree (`file:../SH3/packages/sh3-core`). Both repos must be checked out side-by-side for `npm install` to work locally. The CI workflow checks out the private `Unfinished-Lair/sh3` repo into a sibling path before installing.
