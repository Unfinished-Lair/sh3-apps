# Publish script and workflow

This directory contains the Node script that drives the SH3 static registry + types-only npm distribution pipeline. The script is invoked by `.github/workflows/publish.yml` on every push to `main`, but you can also run it locally against a fake `_pages/` directory for testing.

## One-time setup

### 1. Enable GitHub Pages

In the repo's Settings → Pages:

- Source: Deploy from a branch
- Branch: `gh-pages` / `(root)`

(If `gh-pages` doesn't exist yet, the first workflow run creates it.)

### 2. Add `NPM_TOKEN` secret

In the repo's Settings → Secrets and variables → Actions:

- Name: `NPM_TOKEN`
- Value: an automation token from [npmjs.com](https://www.npmjs.com/) with **publish** permission on the `@unfinished-lair/sh3-editor` package

Without this secret, the `npm publish` step fails on any minor+ bump of `@unfinished-lair/sh3-editor`.

## Local dry-run

To test the script without touching any real registry:

```bash
# Build all packages first — the script requires dist/artifact/ to exist
for pkg in packages/*/; do
  npm run build:artifact -w "$(basename "$pkg")"
done

# Run against a fake _pages directory
mkdir -p /tmp/fake-pages/bundles
echo '{ "version": 1, "packages": [] }' > /tmp/fake-pages/registry.json
SH3_PAGES_DIR=/tmp/fake-pages node .github/scripts/publish.mjs

# Inspect what would have happened
cat /tmp/fake-pages/registry.json
ls /tmp/fake-pages/bundles/
```

The script's stdout contains, on the first line, a JSON result of the form:

```json
{"registryPublished":["sh3-editor"],"npmEligible":["@unfinished-lair/sh3-editor"]}
```

Followed by a markdown summary.

## Running tests

```bash
npm run test:publish
```

## Release workflow (how to actually ship a change)

1. Bump `version` in the package's `package.json` on `main`.
2. Commit and push.
3. GitHub Actions runs `.github/workflows/publish.yml`.
4. Registry updates on `gh-pages` unconditionally for any version change.
5. npm publish runs only for `@unfinished-lair/sh3-editor` on minor+ bumps.

**That's the entire release ritual.** No tags, no changeset files, no manual invocations.

## Version bump guidance

- **Patch** (`0.1.0 → 0.1.1`): registry-only. Use for bugfixes and internal iteration.
- **Minor** (`0.1.0 → 0.2.0`): registry + npm (for `@unfinished-lair/sh3-editor`). Use when the public API surface grows or changes in a meaningful way.
- **Major** (`0.x → 1.0`): registry + npm. Reserved for breaking changes to the public contract.

## Troubleshooting

### "Version regression detected"

A package's `package.json.version` is lower than what's already on the registry. Almost always an accidental edit. If you actually meant to unpublish, do it manually and set the version forward again.

### "Package <name> has missing artifact"

The workflow didn't run `build:artifact` for this package before invoking the script. Check the build step in the workflow.
