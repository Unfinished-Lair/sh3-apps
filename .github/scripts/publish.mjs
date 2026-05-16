/**
 * SH3 static registry publish script.
 *
 * Reads:
 *   - packages/<name>/package.json
 *   - packages/<name>/dist/artifact/<id>-<version>.sh3pkg
 *   - _pages/registry.json
 *
 * Writes:
 *   - _pages/registry.json
 *   - _pages/bundles/{id}-{version}.sh3pkg
 *   (and deletes previous archives for bumped packages, plus any
 *    orphans whose source workspace now publishes under a different id)
 *
 * Emits to stdout:
 *   - One JSON line: {"registryPublished": [...], "npmEligible": [...], "swept": [...]}
 *   - Followed by a markdown summary for $GITHUB_STEP_SUMMARY
 *
 * Exit code 0 on success (including "nothing to do"); non-zero on any error.
 *
 * Registry format follows registry-spec.md (ratified v0.21.0).
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { unzipSync } from 'fflate';

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

// Read and parse manifest.json from inside a .sh3pkg ZIP archive.
export function readManifestFromShPkg(archivePath) {
  const bytes = readFileSync(archivePath);
  const files = unzipSync(bytes);
  const manifestBytes = files['manifest.json'];
  if (!manifestBytes) throw new Error(`No manifest.json in ${archivePath}`);
  return JSON.parse(Buffer.from(manifestBytes).toString('utf-8'));
}

// Find the single .sh3pkg file in an artifact directory. Returns null if absent.
export function findShPkgPath(artifactDir) {
  if (!existsSync(artifactDir)) return null;
  const found = readdirSync(artifactDir).find((f) => f.endsWith('.sh3pkg'));
  return found ? join(artifactDir, found) : null;
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
    const shPkgPath = findShPkgPath(artifactDir);
    if (!shPkgPath) {
      throw new Error(
        `Package "${name}" has missing artifact at ${artifactDir}. Run 'npm run build:artifact' in the package first.`,
      );
    }

    const manifest = readManifestFromShPkg(shPkgPath);

    const contractVersion = '1';

    const requires = (manifest.requiredShards ?? []).map((id) => ({
      id,
      versionRange: '*',
    }));

    result.push({
      id: manifest.id,
      npmName: pkgJson.name,
      // `version` is the release version from package.json — the semver
      // precedence axis (drives bump/regression/npm-eligibility decisions).
      version: pkgJson.version,
      // `artifactVersion` is what sh3-core's sh3Artifact plugin wrote into
      // manifest.json — `package.json.version` plus an optional `+build`
      // suffix. Drives archive filenames and registry-entry versions.
      artifactVersion: manifest.version ?? pkgJson.version,
      contractVersion,
      requires,
      dir: pkgDir,
      artifactDir,
      shPkgPath,
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
  if (pkg.artifactVersion === oldVersion) return { outcome: 'unchanged', oldVersion };
  return { outcome: 'bump', oldVersion };
}

/**
 * Returns true iff the new .sh3pkg archive contains byte-identical client.js
 * (and server.js, if present on either side) compared with the stored archive.
 *
 * Motivation: `sh3Artifact({ buildSuffix: 'auto' })` derives the `+build<N>`
 * suffix from `git rev-list --count <lastTag>..HEAD`, which is a repo-wide
 * counter. So every push to main advances the suffix for every package, even
 * those whose source code didn't change. Without this gate, `diffPackage` flags
 * each as a precedence-equal "bump" and `applyPackageUpdate` rewrites the
 * archive + registry entry for byte-identical content.
 *
 * Comparisons are done on extracted bytes to be robust against non-deterministic
 * ZIP metadata (timestamps, etc.) in the outer archive wrapper.
 */
export function isArtifactContentUnchanged(pkg, pagesDir, liveRegistry) {
  const entry = liveRegistry.packages.find((p) => p.id === pkg.id);
  const stored = entry?.versions?.[0];
  if (!stored) return false;

  // Old-format entries (bundleUrl) must always be republished to migrate to archiveUrl.
  if (!stored.archiveUrl) return false;
  if (!pkg.shPkgPath || !existsSync(pkg.shPkgPath)) return false;

  const storedArchivePath = join(pagesDir, stored.archiveUrl);
  if (!existsSync(storedArchivePath)) return false;

  try {
    const newFiles = unzipSync(readFileSync(pkg.shPkgPath));
    const storedFiles = unzipSync(readFileSync(storedArchivePath));

    const newClient = newFiles['client.js'];
    const storedClient = storedFiles['client.js'];
    if (!newClient || !storedClient) return false;
    if (Buffer.compare(Buffer.from(newClient), Buffer.from(storedClient)) !== 0) return false;

    const newServer = newFiles['server.js'];
    const storedServer = storedFiles['server.js'];
    if (!!newServer !== !!storedServer) return false;
    if (newServer && storedServer) {
      if (Buffer.compare(Buffer.from(newServer), Buffer.from(storedServer)) !== 0) return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function applyPackageUpdate(pkg, pagesDir, liveRegistry) {
  const manifest = readManifestFromShPkg(pkg.shPkgPath);

  const bundlesDir = join(pagesDir, 'bundles');
  mkdirSync(bundlesDir, { recursive: true });

  // ---- Delete old archives if there was a previous entry ----
  const existingIdx = liveRegistry.packages.findIndex((p) => p.id === pkg.id);
  if (existingIdx >= 0) {
    const oldEntry = liveRegistry.packages[existingIdx];
    for (const ver of oldEntry.versions) {
      // Support both old format (bundleUrl/serverBundleUrl) and new (archiveUrl).
      const urls = ver.archiveUrl
        ? [ver.archiveUrl]
        : [ver.bundleUrl, ver.serverBundleUrl].filter(Boolean);
      for (const url of urls) {
        const filePath = join(pagesDir, url);
        if (existsSync(filePath)) unlinkSync(filePath);
      }
    }
  }

  // ---- Copy new .sh3pkg archive ----
  const archiveFilename = `${pkg.id}-${pkg.artifactVersion}.sh3pkg`;
  const archiveDst = join(bundlesDir, archiveFilename);
  copyFileSync(pkg.shPkgPath, archiveDst);
  const integrity = computeIntegrity(archiveDst);

  // ---- Build new entry ----
  const versionEntry = {
    version: pkg.artifactVersion,
    contractVersion: pkg.contractVersion,
    archiveUrl: `bundles/${archiveFilename}`,
    integrity,
  };
  if (pkg.requires && pkg.requires.length > 0) {
    versionEntry.requires = pkg.requires;
  }

  const authorName =
    typeof manifest.author === 'string'
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
 * Supports both old format (bundleUrl/serverBundleUrl) and new (archiveUrl).
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
        const urls = ver.archiveUrl
          ? [ver.archiveUrl]
          : [ver.bundleUrl, ver.serverBundleUrl].filter(Boolean);
        for (const url of urls) {
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
  //     advances) to "unchanged-content" when the new artifact's content is
  //     byte-identical to the registry's. Defends against the every-push
  //     republish cycle that buildSuffix:'auto' would otherwise cause.
  for (const c of classified) {
    if (c.outcome !== 'bump') continue;
    const cmp = compareVer(parseVer(c.pkg.artifactVersion), parseVer(c.oldVersion));
    if (cmp !== 0) continue;
    if (isArtifactContentUnchanged(c.pkg, pagesDir, registry)) {
      c.outcome = 'unchanged-content';
    }
  }

  // 3c. Promote any "unchanged" package whose stored entry still uses the old
  //     bundleUrl format (no archiveUrl) to "bump" so it gets migrated on the
  //     next publish. Packages without buildSuffix:'auto' (like sh3-registry)
  //     never advance their version, so diffPackage returns 'unchanged' forever
  //     and the old-format guard in isArtifactContentUnchanged is never reached.
  for (const c of classified) {
    if (c.outcome !== 'unchanged') continue;
    const entry = registry.packages.find((p) => p.id === c.pkg.id);
    if (entry?.versions?.[0] && !entry.versions[0].archiveUrl) {
      c.outcome = 'bump';
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
  const registryPublished = [];
  const npmEligible = [];
  for (const c of classified) {
    if (c.outcome === 'new' || c.outcome === 'bump') {
      applyPackageUpdate(c.pkg, pagesDir, registry);
      registryPublished.push(c.pkg.id);
      if (
        NPM_ELIGIBLE_PACKAGES.has(c.pkg.npmName) &&
        isNpmEligible(c.outcome, c.oldVersion, c.pkg.version)
      ) {
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
