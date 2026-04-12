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

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

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
  if (outcome === 'new') return true;
  if (outcome !== 'bump') return false;
  const o = parseVer(oldVer);
  const n = parseVer(newVer);
  return n.major > o.major || (n.major === o.major && n.minor > o.minor);
}

export function computeIntegrity(filePath) {
  const bytes = readFileSync(filePath);
  const hash = createHash('sha384').update(bytes).digest('base64');
  return `sha384-${hash}`;
}

export function loadLiveRegistry(pagesDir) {
  const p = join(pagesDir, 'registry.json');
  if (!existsSync(p)) return { version: 1, packages: [] };
  try {
    return JSON.parse(readFileSync(p, 'utf-8'));
  } catch {
    return { version: 1, packages: [] };
  }
}

export function saveRegistry(pagesDir, registry) {
  writeFileSync(join(pagesDir, 'registry.json'), JSON.stringify(registry, null, 2));
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
