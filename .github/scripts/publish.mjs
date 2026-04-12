/**
 * SH3 static registry publish script.
 *
 * Reads:
 *   - packages/<name>/package.json
 *   - packages/<name>/dist/artifact/manifest.json
 *   - packages/<name>/dist/artifact/client.js (and server.js if present)
 *   - _pages/registry.json
 *
 * Writes:
 *   - _pages/registry.json
 *   - _pages/bundles/{id}-{version}.js
 *   - _pages/bundles/{id}-{version}-server.js
 *   (and deletes previous bundles for bumped packages)
 *
 * Emits to stdout:
 *   - One JSON line: {"registry_published": [...], "npm_eligible": [...]}
 *   - Followed by a markdown summary for $GITHUB_STEP_SUMMARY
 *
 * Exit code 0 on success (including "nothing to do"); non-zero on any error.
 */

// Helpers exported for unit tests.
export function parseVer(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) throw new Error(`Non-strict semver rejected: ${JSON.stringify(v)}`);
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

export function compareVer(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

export function isNpmEligible(outcome, oldVer, newVer) {
  throw new Error('not implemented');
}

export function computeIntegrity(filePath) {
  throw new Error('not implemented');
}

export function loadLiveRegistry(pagesDir) {
  throw new Error('not implemented');
}

export function saveRegistry(pagesDir, registry) {
  throw new Error('not implemented');
}

export function discoverPackages(repoRoot) {
  throw new Error('not implemented');
}

export function diffPackage(pkg, liveRegistry) {
  throw new Error('not implemented');
}

export function applyPackageUpdate(pkg, pagesDir, liveRegistry) {
  throw new Error('not implemented');
}

// Entry point
export async function main({ repoRoot, pagesDir }) {
  throw new Error('not implemented');
}

// CLI invocation
if (import.meta.url === `file://${process.argv[1]}`) {
  const repoRoot = process.cwd();
  const pagesDir = process.env.SH3_PAGES_DIR ?? `${repoRoot}/_pages`;
  main({ repoRoot, pagesDir }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
