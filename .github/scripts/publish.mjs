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
  const packagesDir = join(repoRoot, 'packages');
  if (!existsSync(packagesDir)) return [];

  const entries = readdirSync(packagesDir);
  const result = [];

  for (const name of entries) {
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

    result.push({
      id: pkgJson.name,
      version: pkgJson.version,
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

  const cmp = compareVer(parseVer(pkg.version), parseVer(oldVersion));
  if (cmp === 0) return { outcome: 'unchanged', oldVersion };
  if (cmp > 0) return { outcome: 'bump', oldVersion };
  return { outcome: 'regression', oldVersion };
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
  const clientDst = join(bundlesDir, `${pkg.id}-${pkg.version}.js`);
  copyFileSync(clientSrc, clientDst);
  const integrity = computeIntegrity(clientDst);

  let serverBundleUrl;
  const serverSrc = join(pkg.artifactDir, 'server.js');
  if (existsSync(serverSrc)) {
    const serverDst = join(bundlesDir, `${pkg.id}-${pkg.version}-server.js`);
    copyFileSync(serverSrc, serverDst);
    serverBundleUrl = `bundles/${pkg.id}-${pkg.version}-server.js`;
  }

  // ---- Build new entry ----
  const versionEntry = {
    version: pkg.version,
    contractVersion: String(manifest.contractVersion ?? 1),
    bundleUrl: `bundles/${pkg.id}-${pkg.version}.js`,
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
    versions: [versionEntry],
  };

  if (existingIdx >= 0) {
    liveRegistry.packages[existingIdx] = newEntry;
  } else {
    liveRegistry.packages.push(newEntry);
  }

  return liveRegistry;
}

const NPM_ELIGIBLE_PACKAGES = new Set(['sh3-editor']);

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

  // 4. Fail fast on any regression
  const regressions = classified.filter((c) => c.outcome === 'regression');
  if (regressions.length > 0) {
    const msg = regressions
      .map((c) => `  - ${c.pkg.id}: ${c.oldVersion} → ${c.pkg.version}`)
      .join('\n');
    throw new Error(`Version regression detected (new < old):\n${msg}`);
  }

  // 5. Apply updates for new and bump outcomes
  const registryPublished = [];
  const npmEligible = [];
  for (const c of classified) {
    if (c.outcome === 'new' || c.outcome === 'bump') {
      applyPackageUpdate(c.pkg, pagesDir, registry);
      registryPublished.push(c.pkg.id);
      if (NPM_ELIGIBLE_PACKAGES.has(c.pkg.id)
          && isNpmEligible(c.outcome, c.oldVersion, c.pkg.version)) {
        npmEligible.push(c.pkg.id);
      }
    }
  }

  // 6. Save registry
  saveRegistry(pagesDir, registry);

  // 7. Emit JSON line + markdown summary
  const result = { registryPublished, npmEligible };
  process.stdout.write(JSON.stringify(result) + '\n');
  process.stdout.write(renderSummary(classified, result));

  return result;
}

function renderSummary(classified, result) {
  const lines = ['## Publish Summary', ''];
  lines.push('### Registry (gh-pages)');
  for (const c of classified) {
    if (c.outcome === 'new') {
      lines.push(`- ✓ ${c.pkg.id}: new → ${c.pkg.version}`);
    } else if (c.outcome === 'bump') {
      lines.push(`- ✓ ${c.pkg.id}: ${c.oldVersion} → ${c.pkg.version}`);
    } else if (c.outcome === 'unchanged') {
      lines.push(`- · ${c.pkg.id}: ${c.pkg.version} (unchanged)`);
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
