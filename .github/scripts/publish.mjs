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
 *   (and deletes previous bundles for bumped packages, plus any
 *    orphans whose source workspace now publishes under a different id)
 *
 * Emits to stdout:
 *   - One JSON line: {"registryPublished": [...], "npmEligible": [...], "swept": [...]}
 *   - Followed by a markdown summary for $GITHUB_STEP_SUMMARY
 *
 * Exit code 0 on success (including "nothing to do"); non-zero on any error.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

// Helpers exported for unit tests.
//
// `parseVer` accepts `MAJOR.MINOR.PATCH` optionally followed by a semver
// build-metadata suffix (`+<dot-separated [0-9A-Za-z-]+>`). The suffix is
// stripped before parsing: per semver §10 build metadata MUST be ignored
// for precedence. Pre-release tags (`-alpha`, `-rc.1`) remain unsupported
// — this repo only emits release versions with optional `+build` suffixes
// produced by sh3-core's `sh3Artifact({ buildSuffix: 'auto' })`.
export function parseVer(v) {
  const stripped = v.split('+')[0];
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(stripped);
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

// TEMP: sh3-sync is broken and blocks deploy; re-enable once fixed.
const SKIP_PACKAGES = new Set(['sh3-sync']);

export function discoverPackages(repoRoot) {
  const packagesDir = join(repoRoot, 'packages');
  if (!existsSync(packagesDir)) return [];

  const entries = readdirSync(packagesDir);
  const result = [];

  for (const name of entries) {
    if (SKIP_PACKAGES.has(name)) continue;

    const pkgDir = join(packagesDir, name);
    if (!statSync(pkgDir).isDirectory()) continue;

    const pkgJsonPath = join(pkgDir, 'package.json');
    if (!existsSync(pkgJsonPath)) continue;

    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    if (!pkgJson.version) {
      throw new Error(`Package "${name}" is missing version field in package.json`);
    }

    const artifactDir = join(pkgDir, 'dist', 'artifact');
    const manifestPath = join(artifactDir, 'manifest.json');
    if (!existsSync(manifestPath)) {
      throw new Error(
        `Package "${name}" has missing artifact at ${manifestPath}. Run 'npm run build:artifact' in the package first.`,
      );
    }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    result.push({
      id: manifest.id,
      npmName: pkgJson.name,
      // `version` is the release version from package.json — the semver
      // precedence axis (drives bump/regression/npm-eligibility decisions).
      version: pkgJson.version,
      // `artifactVersion` is what sh3-core's sh3Artifact plugin wrote into
      // manifest.json — `package.json.version` plus an optional `+build`
      // suffix from `git rev-list --count <lastTag>..HEAD`. Drives bundle
      // filenames and registry-entry versions so distinct builds of the
      // same release keep distinct identities + SRI hashes.
      artifactVersion: manifest.version ?? pkgJson.version,
      dir: pkgDir,
      artifactDir,
    });
  }

  return result;
}

export function diffPackage(pkg, liveRegistry) {
  const entry = liveRegistry.packages.find((p) => p.id === pkg.id);
  if (!entry) return { outcome: 'new', oldVersion: null };

  const oldVersion = entry.versions[0]?.version;
  if (!oldVersion) return { outcome: 'new', oldVersion: null };

  // Precedence comparison ignores build metadata (semver §10).
  const cmp = compareVer(parseVer(pkg.artifactVersion), parseVer(oldVersion));
  if (cmp > 0) return { outcome: 'bump', oldVersion };
  if (cmp < 0) return { outcome: 'regression', oldVersion };
  // Precedence-equal: same release. Full-string equality decides whether
  // the build-metadata suffix changed; if it did, treat as a refresh
  // ('bump') so the registry entry + bundle SRI get rewritten. Callers
  // then run isArtifactContentUnchanged() to filter out the common case
  // where only the suffix advanced (every push to main increments
  // `git rev-list --count <lastTag>..HEAD` for the whole repo, so the
  // suffix moves for every package even when source didn't change).
  if (pkg.artifactVersion === oldVersion) return { outcome: 'unchanged', oldVersion };
  return { outcome: 'bump', oldVersion };
}

/**
 * Returns true iff every bundle the new artifact would publish is byte-identical
 * to what the registry already has.
 *
 * Motivation: `sh3Artifact({ buildSuffix: 'auto' })` derives the `+build<N>`
 * suffix from `git rev-list --count <lastTag>..HEAD`, which is a repo-wide
 * counter. So every push to main advances the suffix for every package, even
 * those whose source code didn't change. Without this gate, `diffPackage` flags
 * each as a precedence-equal "bump" and `applyPackageUpdate` rewrites the
 * bundle + registry entry for byte-identical content.
 *
 * Comparisons:
 *   - new client.js   ↔ registry.versions[0].integrity (stored)
 *   - new server.js   ↔ bundles/<old-server>.js on disk (recomputed),
 *                       only if either side has one
 *
 * Server-bundle presence must match (both have it or neither does); the
 * server integrity is recomputed from disk because the registry only stores
 * client integrity today. Missing on-disk server bundle → return false (fail
 * closed: republish so the bundles directory stays consistent).
 */
export function isArtifactContentUnchanged(pkg, pagesDir, liveRegistry) {
  const entry = liveRegistry.packages.find((p) => p.id === pkg.id);
  const stored = entry?.versions?.[0];
  if (!stored) return false;

  const newClient = join(pkg.artifactDir, 'client.js');
  if (!existsSync(newClient)) return false;
  if (computeIntegrity(newClient) !== stored.integrity) return false;

  const newServer = join(pkg.artifactDir, 'server.js');
  const hasNewServer = existsSync(newServer);
  const hasStoredServer = !!stored.serverBundleUrl;
  if (hasNewServer !== hasStoredServer) return false;

  if (hasNewServer) {
    const storedServerPath = join(pagesDir, stored.serverBundleUrl);
    if (!existsSync(storedServerPath)) return false;
    if (computeIntegrity(newServer) !== computeIntegrity(storedServerPath)) return false;
  }

  return true;
}

export function applyPackageUpdate(pkg, pagesDir, liveRegistry) {
  const manifestPath = join(pkg.artifactDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  const bundlesDir = join(pagesDir, 'bundles');
  mkdirSync(bundlesDir, { recursive: true });

  // ---- Delete old bundles if there was a previous entry ----
  const existingIdx = liveRegistry.packages.findIndex((p) => p.id === pkg.id);
  if (existingIdx >= 0) {
    const oldEntry = liveRegistry.packages[existingIdx];
    for (const ver of oldEntry.versions) {
      const oldClient = join(pagesDir, ver.bundleUrl);
      if (existsSync(oldClient)) unlinkSync(oldClient);
      if (ver.serverBundleUrl) {
        const oldServer = join(pagesDir, ver.serverBundleUrl);
        if (existsSync(oldServer)) unlinkSync(oldServer);
      }
    }
  }

  // ---- Copy new bundles in ----
  const clientSrc = join(pkg.artifactDir, 'client.js');
  const clientDst = join(bundlesDir, `${pkg.id}-${pkg.artifactVersion}.js`);
  copyFileSync(clientSrc, clientDst);
  const integrity = computeIntegrity(clientDst);

  let serverBundleUrl;
  const serverSrc = join(pkg.artifactDir, 'server.js');
  if (existsSync(serverSrc)) {
    const serverDst = join(bundlesDir, `${pkg.id}-${pkg.artifactVersion}-server.js`);
    copyFileSync(serverSrc, serverDst);
    serverBundleUrl = `bundles/${pkg.id}-${pkg.artifactVersion}-server.js`;
  }

  // ---- Build new entry ----
  const versionEntry = {
    version: pkg.artifactVersion,
    contractVersion: String(manifest.contractVersion ?? 1),
    bundleUrl: `bundles/${pkg.id}-${pkg.artifactVersion}.js`,
    integrity,
  };
  if (serverBundleUrl) versionEntry.serverBundleUrl = serverBundleUrl;

  const authorName = typeof manifest.author === 'string'
    ? manifest.author
    : (manifest.author?.name ?? 'Unknown');

  const newEntry = {
    id: manifest.id,
    type: manifest.type,
    label: manifest.label,
    description: manifest.description ?? '',
    author: { name: authorName },
    source: { npm: pkg.npmName },
    versions: [versionEntry],
  };

  if (existingIdx >= 0) {
    liveRegistry.packages[existingIdx] = newEntry;
  } else {
    liveRegistry.packages.push(newEntry);
  }

  return liveRegistry;
}

/**
 * Drop entries whose source workspace now publishes under a different manifest id.
 *
 * `entry.source.npm` is stamped on every publish (see applyPackageUpdate). If a
 * workspace's manifest id later changes — e.g. a package transitions from
 * combo (app id wins) to shard-only (shard id wins) — the previous entry would
 * otherwise linger under the stale id forever. This sweep removes those.
 *
 * Entries with no `source.npm` (published before this field existed) are left
 * alone: the sweep can't safely attribute them. They will be backfilled the
 * next time their workspace publishes, since applyPackageUpdate stamps the
 * field on every write.
 */
export function sweepOrphans(packages, pagesDir, liveRegistry) {
  const workspaceMap = new Map();
  for (const p of packages) workspaceMap.set(p.npmName, p.id);

  const swept = [];
  const surviving = [];
  for (const entry of liveRegistry.packages) {
    const sourceNpm = entry.source?.npm;
    const currentId = sourceNpm ? workspaceMap.get(sourceNpm) : undefined;
    if (currentId !== undefined && entry.id !== currentId) {
      for (const ver of entry.versions) {
        for (const url of [ver.bundleUrl, ver.serverBundleUrl]) {
          if (!url) continue;
          const bundlePath = join(pagesDir, url);
          if (existsSync(bundlePath)) unlinkSync(bundlePath);
        }
      }
      swept.push({ id: entry.id, source: sourceNpm, replacedBy: currentId });
    } else {
      surviving.push(entry);
    }
  }
  liveRegistry.packages = surviving;
  return swept;
}

const NPM_ELIGIBLE_PACKAGES = new Set(['@unfinished-lair/sh3-editor']);

export async function main({ repoRoot, pagesDir }) {
  // 1. Ensure pagesDir exists with an empty registry if missing
  mkdirSync(join(pagesDir, 'bundles'), { recursive: true });

  // 2. Load live registry and discover workspace packages
  const registry = loadLiveRegistry(pagesDir);
  const packages = discoverPackages(repoRoot);

  // 3. Classify each package
  const classified = packages.map((pkg) => ({
    pkg,
    ...diffPackage(pkg, registry),
  }));

  // 3b. Demote precedence-equal "bump" outcomes (i.e. build-suffix-only
  //     advances) to "unchanged-content" when the new artifact's bundles are
  //     byte-identical to the registry's. Defends against the every-push
  //     republish cycle that buildSuffix:'auto' would otherwise cause — see
  //     isArtifactContentUnchanged for the underlying mechanism.
  for (const c of classified) {
    if (c.outcome !== 'bump') continue;
    const cmp = compareVer(parseVer(c.pkg.artifactVersion), parseVer(c.oldVersion));
    if (cmp !== 0) continue;
    if (isArtifactContentUnchanged(c.pkg, pagesDir, registry)) {
      c.outcome = 'unchanged-content';
    }
  }

  // 4. Fail fast on any regression
  const regressions = classified.filter((c) => c.outcome === 'regression');
  if (regressions.length > 0) {
    const msg = regressions
      .map((c) => `  - ${c.pkg.id}: ${c.oldVersion} → ${c.pkg.artifactVersion}`)
      .join('\n');
    throw new Error(`Version regression detected (new < old):\n${msg}`);
  }

  // 5. Apply updates for new and bump outcomes.
  // npm eligibility uses the bare release version (`pkg.version`) so that a
  // build-only refresh (same release, new build-metadata suffix) does NOT
  // re-publish to npm — `isNpmEligible` compares semver precedence, which
  // ignores build metadata, so suffix-only bumps short-circuit to false.
  const registryPublished = [];
  const npmEligible = [];
  for (const c of classified) {
    if (c.outcome === 'new' || c.outcome === 'bump') {
      applyPackageUpdate(c.pkg, pagesDir, registry);
      registryPublished.push(c.pkg.id);
      if (NPM_ELIGIBLE_PACKAGES.has(c.pkg.npmName)
          && isNpmEligible(c.outcome, c.oldVersion, c.pkg.version)) {
        npmEligible.push(c.pkg.npmName);
      }
    }
  }

  // 6. Sweep orphans: entries whose source workspace now publishes a different id
  const swept = sweepOrphans(packages, pagesDir, registry);

  // 7. Save registry
  saveRegistry(pagesDir, registry);

  // 8. Emit JSON line + markdown summary
  const result = { registryPublished, npmEligible, swept };
  process.stdout.write(JSON.stringify(result) + '\n');
  process.stdout.write(renderSummary(classified, result));

  return result;
}

function renderSummary(classified, result) {
  const lines = ['## Publish Summary', ''];
  lines.push('### Registry (gh-pages)');
  for (const c of classified) {
    if (c.outcome === 'new') {
      lines.push(`- ✓ ${c.pkg.id}: new → ${c.pkg.artifactVersion}`);
    } else if (c.outcome === 'bump') {
      lines.push(`- ✓ ${c.pkg.id}: ${c.oldVersion} → ${c.pkg.artifactVersion}`);
    } else if (c.outcome === 'unchanged') {
      lines.push(`- · ${c.pkg.id}: ${c.pkg.artifactVersion} (unchanged)`);
    } else if (c.outcome === 'unchanged-content') {
      lines.push(`- · ${c.pkg.id}: suffix ${c.oldVersion} → ${c.pkg.artifactVersion}, content identical (skipped)`);
    }
  }
  if (result.swept && result.swept.length > 0) {
    for (const s of result.swept) {
      lines.push(`- ✗ ${s.id}: swept (renamed by ${s.source} → ${s.replacedBy})`);
    }
  }
  lines.push('');
  lines.push('### npm');
  if (result.npmEligible.length === 0) {
    lines.push('- (no packages eligible)');
  } else {
    for (const id of result.npmEligible) {
      lines.push(`- ✓ ${id} (minor+ bump or first publish)`);
    }
  }
  lines.push('');
  return lines.join('\n');
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
