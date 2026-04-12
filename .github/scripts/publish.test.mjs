import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import * as publish from './publish.mjs';
import { mkdtempSync, writeFileSync, rmSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

describe('publish.mjs', () => {
  it('loads without errors', () => {
    assert.ok(typeof publish.parseVer === 'function');
    assert.ok(typeof publish.compareVer === 'function');
    assert.ok(typeof publish.isNpmEligible === 'function');
    assert.ok(typeof publish.computeIntegrity === 'function');
    assert.ok(typeof publish.loadLiveRegistry === 'function');
    assert.ok(typeof publish.saveRegistry === 'function');
    assert.ok(typeof publish.discoverPackages === 'function');
    assert.ok(typeof publish.diffPackage === 'function');
    assert.ok(typeof publish.applyPackageUpdate === 'function');
    assert.ok(typeof publish.main === 'function');
  });
});

describe('parseVer', () => {
  it('parses strict MAJOR.MINOR.PATCH', () => {
    assert.deepEqual(publish.parseVer('0.1.0'), { major: 0, minor: 1, patch: 0 });
    assert.deepEqual(publish.parseVer('1.2.3'), { major: 1, minor: 2, patch: 3 });
    assert.deepEqual(publish.parseVer('10.20.30'), { major: 10, minor: 20, patch: 30 });
  });

  it('rejects pre-release versions', () => {
    assert.throws(() => publish.parseVer('0.1.0-alpha.1'), /Non-strict semver/);
    assert.throws(() => publish.parseVer('1.0.0-rc.0'), /Non-strict semver/);
  });

  it('rejects build metadata', () => {
    assert.throws(() => publish.parseVer('1.0.0+build.1'), /Non-strict semver/);
  });

  it('rejects non-numeric components', () => {
    assert.throws(() => publish.parseVer('1.x.0'), /Non-strict semver/);
    assert.throws(() => publish.parseVer('v1.0.0'), /Non-strict semver/);
  });

  it('rejects incomplete versions', () => {
    assert.throws(() => publish.parseVer('1.0'), /Non-strict semver/);
    assert.throws(() => publish.parseVer('1'), /Non-strict semver/);
    assert.throws(() => publish.parseVer(''), /Non-strict semver/);
  });
});

describe('compareVer', () => {
  const v = (s) => publish.parseVer(s);

  it('returns 0 for equal versions', () => {
    assert.equal(publish.compareVer(v('1.2.3'), v('1.2.3')), 0);
  });

  it('returns negative when a < b', () => {
    assert.ok(publish.compareVer(v('1.2.3'), v('1.2.4')) < 0);
    assert.ok(publish.compareVer(v('1.2.3'), v('1.3.0')) < 0);
    assert.ok(publish.compareVer(v('1.2.3'), v('2.0.0')) < 0);
    assert.ok(publish.compareVer(v('0.9.9'), v('1.0.0')) < 0);
  });

  it('returns positive when a > b', () => {
    assert.ok(publish.compareVer(v('1.2.4'), v('1.2.3')) > 0);
    assert.ok(publish.compareVer(v('1.3.0'), v('1.2.99')) > 0);
    assert.ok(publish.compareVer(v('2.0.0'), v('1.99.99')) > 0);
  });

  it('compares major first, then minor, then patch', () => {
    // Major differences dominate
    assert.ok(publish.compareVer(v('2.0.0'), v('1.99.99')) > 0);
    // Minor differences dominate over patch
    assert.ok(publish.compareVer(v('1.2.0'), v('1.1.99')) > 0);
  });
});

describe('isNpmEligible', () => {
  it('new outcome always eligible (first publish)', () => {
    assert.equal(publish.isNpmEligible('new', null, '0.1.0'), true);
    assert.equal(publish.isNpmEligible('new', null, '1.0.0'), true);
  });

  it('unchanged outcome never eligible', () => {
    assert.equal(publish.isNpmEligible('unchanged', '0.1.0', '0.1.0'), false);
  });

  it('regression outcome never eligible', () => {
    assert.equal(publish.isNpmEligible('regression', '0.2.0', '0.1.9'), false);
  });

  it('patch bump not eligible', () => {
    assert.equal(publish.isNpmEligible('bump', '0.1.0', '0.1.1'), false);
    assert.equal(publish.isNpmEligible('bump', '1.2.3', '1.2.4'), false);
    assert.equal(publish.isNpmEligible('bump', '10.20.30', '10.20.99'), false);
  });

  it('minor bump eligible', () => {
    assert.equal(publish.isNpmEligible('bump', '0.1.0', '0.2.0'), true);
    assert.equal(publish.isNpmEligible('bump', '0.1.5', '0.2.0'), true);
    assert.equal(publish.isNpmEligible('bump', '1.2.3', '1.3.0'), true);
  });

  it('major bump eligible', () => {
    assert.equal(publish.isNpmEligible('bump', '0.1.0', '1.0.0'), true);
    assert.equal(publish.isNpmEligible('bump', '1.99.99', '2.0.0'), true);
  });
});

describe('computeIntegrity', () => {
  let tmp;

  function setup() {
    tmp = mkdtempSync(join(tmpdir(), 'sh3-publish-test-'));
  }

  function teardown() {
    rmSync(tmp, { recursive: true, force: true });
  }

  it('produces sha384-<base64> prefix', () => {
    setup();
    try {
      const p = join(tmp, 'bundle.js');
      writeFileSync(p, 'hello world');
      const integrity = publish.computeIntegrity(p);
      assert.match(integrity, /^sha384-[A-Za-z0-9+/]+=*$/);
    } finally {
      teardown();
    }
  });

  it('matches node:crypto sha384 base64 directly', () => {
    setup();
    try {
      const p = join(tmp, 'bundle.js');
      const content = 'const x = 42;';
      writeFileSync(p, content);
      const expected = 'sha384-' + createHash('sha384').update(content).digest('base64');
      assert.equal(publish.computeIntegrity(p), expected);
    } finally {
      teardown();
    }
  });

  it('produces different hashes for different content', () => {
    setup();
    try {
      const p1 = join(tmp, 'a.js');
      const p2 = join(tmp, 'b.js');
      writeFileSync(p1, 'one');
      writeFileSync(p2, 'two');
      assert.notEqual(publish.computeIntegrity(p1), publish.computeIntegrity(p2));
    } finally {
      teardown();
    }
  });
});

describe('loadLiveRegistry', () => {
  let tmp;
  function setup() { tmp = mkdtempSync(join(tmpdir(), 'sh3-publish-test-')); }
  function teardown() { rmSync(tmp, { recursive: true, force: true }); }

  it('returns empty registry if registry.json missing', () => {
    setup();
    try {
      const reg = publish.loadLiveRegistry(tmp);
      assert.deepEqual(reg, { version: 1, packages: [] });
    } finally {
      teardown();
    }
  });

  it('returns parsed registry.json if present', () => {
    setup();
    try {
      const reg = { version: 1, packages: [{ id: 'sh3-editor', type: 'shard', label: 'Editor', description: '', author: { name: 'x' }, versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/sh3-editor-0.1.0.js', integrity: 'sha384-xxx' }] }] };
      writeFileSync(join(tmp, 'registry.json'), JSON.stringify(reg));
      assert.deepEqual(publish.loadLiveRegistry(tmp), reg);
    } finally {
      teardown();
    }
  });

  it('returns empty registry on malformed JSON', () => {
    setup();
    try {
      writeFileSync(join(tmp, 'registry.json'), 'not json at all');
      const reg = publish.loadLiveRegistry(tmp);
      assert.deepEqual(reg, { version: 1, packages: [] });
    } finally {
      teardown();
    }
  });
});

describe('saveRegistry', () => {
  let tmp;
  function setup() { tmp = mkdtempSync(join(tmpdir(), 'sh3-publish-test-')); }
  function teardown() { rmSync(tmp, { recursive: true, force: true }); }

  it('writes registry.json with 2-space indent', () => {
    setup();
    try {
      const reg = { version: 1, packages: [] };
      publish.saveRegistry(tmp, reg);
      const content = readFileSync(join(tmp, 'registry.json'), 'utf-8');
      assert.equal(content, JSON.stringify(reg, null, 2));
    } finally {
      teardown();
    }
  });

  it('round-trips through load and save', () => {
    setup();
    try {
      const reg = { version: 1, packages: [{ id: 'p', type: 'app', label: 'P', description: 'desc', author: { name: 'a' }, versions: [{ version: '1.0.0', contractVersion: '1', bundleUrl: 'bundles/p-1.0.0.js', integrity: 'sha384-xxx' }] }] };
      publish.saveRegistry(tmp, reg);
      const loaded = publish.loadLiveRegistry(tmp);
      assert.deepEqual(loaded, reg);
    } finally {
      teardown();
    }
  });
});

describe('discoverPackages', () => {
  let tmp;

  function setup() {
    tmp = mkdtempSync(join(tmpdir(), 'sh3-publish-test-'));
    mkdirSync(join(tmp, 'packages'));
  }

  function teardown() {
    rmSync(tmp, { recursive: true, force: true });
  }

  function makePkg(name, version, withArtifact = true, artifactSubdir = 'artifact') {
    const pkgDir = join(tmp, 'packages', name);
    mkdirSync(pkgDir, { recursive: true });
    writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name, version }));
    if (withArtifact) {
      const artDir = join(pkgDir, 'dist', artifactSubdir);
      mkdirSync(artDir, { recursive: true });
      writeFileSync(
        join(artDir, 'manifest.json'),
        JSON.stringify({ id: name, type: 'shard', label: name, version }),
      );
      writeFileSync(join(artDir, 'client.js'), 'export const x = 1;');
    }
  }

  it('discovers packages with built artifacts', () => {
    setup();
    try {
      makePkg('sh3-editor', '0.1.0');
      makePkg('sh3-diagnostic', '0.2.1');
      const pkgs = publish.discoverPackages(tmp);
      const ids = pkgs.map((p) => p.id).sort();
      assert.deepEqual(ids, ['sh3-diagnostic', 'sh3-editor']);
    } finally {
      teardown();
    }
  });

  it('reports each package with id, version, dir, artifactDir', () => {
    setup();
    try {
      makePkg('sh3-editor', '0.1.0');
      const pkgs = publish.discoverPackages(tmp);
      assert.equal(pkgs.length, 1);
      const p = pkgs[0];
      assert.equal(p.id, 'sh3-editor');
      assert.equal(p.version, '0.1.0');
      assert.ok(p.dir.endsWith('sh3-editor'));
      assert.ok(p.artifactDir.endsWith(join('sh3-editor', 'dist', 'artifact')));
    } finally {
      teardown();
    }
  });

  it('throws when a package is missing dist/artifact/manifest.json', () => {
    setup();
    try {
      makePkg('sh3-editor', '0.1.0', false);
      assert.throws(() => publish.discoverPackages(tmp), /missing artifact/i);
    } finally {
      teardown();
    }
  });

  it('returns empty array when no packages exist', () => {
    setup();
    try {
      const pkgs = publish.discoverPackages(tmp);
      assert.deepEqual(pkgs, []);
    } finally {
      teardown();
    }
  });

  it('validates package.json has a version field', () => {
    setup();
    try {
      const pkgDir = join(tmp, 'packages', 'broken');
      mkdirSync(pkgDir, { recursive: true });
      writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name: 'broken' }));
      assert.throws(() => publish.discoverPackages(tmp), /missing version/i);
    } finally {
      teardown();
    }
  });
});

describe('diffPackage', () => {
  const makeEntry = (id, version) => ({
    id,
    type: 'shard',
    label: id,
    description: '',
    author: { name: 'x' },
    versions: [{ version, contractVersion: '1', bundleUrl: `bundles/${id}-${version}.js`, integrity: 'sha384-xxx' }],
  });

  it('reports new when package is not in registry', () => {
    const pkg = { id: 'sh3-new', version: '0.1.0' };
    const reg = { version: 1, packages: [] };
    assert.deepEqual(publish.diffPackage(pkg, reg), { outcome: 'new', oldVersion: null });
  });

  it('reports unchanged when version matches live registry', () => {
    const pkg = { id: 'sh3-editor', version: '0.1.0' };
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.1.0')] };
    assert.deepEqual(publish.diffPackage(pkg, reg), { outcome: 'unchanged', oldVersion: '0.1.0' });
  });

  it('reports bump when new version > old version', () => {
    const pkg = { id: 'sh3-editor', version: '0.2.0' };
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.1.0')] };
    assert.deepEqual(publish.diffPackage(pkg, reg), { outcome: 'bump', oldVersion: '0.1.0' });
  });

  it('reports regression when new version < old version', () => {
    const pkg = { id: 'sh3-editor', version: '0.1.0' };
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.2.0')] };
    assert.deepEqual(publish.diffPackage(pkg, reg), { outcome: 'regression', oldVersion: '0.2.0' });
  });

  it('patch bumps classified as bump', () => {
    const pkg = { id: 'sh3-editor', version: '0.1.1' };
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.1.0')] };
    assert.deepEqual(publish.diffPackage(pkg, reg), { outcome: 'bump', oldVersion: '0.1.0' });
  });
});

describe('applyPackageUpdate', () => {
  let tmp;

  function setup() {
    tmp = mkdtempSync(join(tmpdir(), 'sh3-publish-test-'));
    mkdirSync(join(tmp, 'packages'));
    mkdirSync(join(tmp, '_pages', 'bundles'), { recursive: true });
  }

  function teardown() {
    rmSync(tmp, { recursive: true, force: true });
  }

  function makePkg(id, version, { type = 'shard', withServer = false, manifestVersion = null } = {}) {
    const pkgDir = join(tmp, 'packages', id);
    const artifactDir = join(pkgDir, 'dist', 'artifact');
    mkdirSync(artifactDir, { recursive: true });
    writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name: id, version }));
    const manifest = {
      id,
      type,
      label: id,
      version: manifestVersion ?? version,
      description: 'test pkg',
      author: 'test-author',
      contractVersion: 1,
    };
    writeFileSync(join(artifactDir, 'manifest.json'), JSON.stringify(manifest));
    writeFileSync(join(artifactDir, 'client.js'), `export const client = '${id}-${version}';`);
    if (withServer) {
      writeFileSync(join(artifactDir, 'server.js'), `export const server = '${id}-${version}';`);
    }
    return { id, version, dir: pkgDir, artifactDir };
  }

  it('adds a new package entry for a "new" outcome', () => {
    setup();
    try {
      const pkg = makePkg('sh3-editor', '0.1.0');
      const reg = { version: 1, packages: [] };
      publish.applyPackageUpdate(pkg, join(tmp, '_pages'), reg);

      assert.equal(reg.packages.length, 1);
      const entry = reg.packages[0];
      assert.equal(entry.id, 'sh3-editor');
      assert.equal(entry.type, 'shard');
      assert.equal(entry.versions.length, 1);
      assert.equal(entry.versions[0].version, '0.1.0');
      assert.equal(entry.versions[0].bundleUrl, 'bundles/sh3-editor-0.1.0.js');
      assert.match(entry.versions[0].integrity, /^sha384-/);
      assert.equal(entry.versions[0].serverBundleUrl, undefined);

      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.1.0.js')));
    } finally {
      teardown();
    }
  });

  it('includes serverBundleUrl when server.js present', () => {
    setup();
    try {
      const pkg = makePkg('sh3-registry', '0.1.2', { type: 'combo', withServer: true });
      const reg = { version: 1, packages: [] };
      publish.applyPackageUpdate(pkg, join(tmp, '_pages'), reg);

      const entry = reg.packages[0];
      assert.equal(entry.type, 'combo');
      assert.equal(entry.versions[0].serverBundleUrl, 'bundles/sh3-registry-0.1.2-server.js');
      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'sh3-registry-0.1.2-server.js')));
    } finally {
      teardown();
    }
  });

  it('replaces old bundles on a bump', () => {
    setup();
    try {
      // Seed registry with an "old" version
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.1.0.js'), 'old-content');
      const reg = {
        version: 1,
        packages: [
          {
            id: 'sh3-editor',
            type: 'shard',
            label: 'Editor',
            description: 'old',
            author: { name: 'x' },
            versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/sh3-editor-0.1.0.js', integrity: 'sha384-old' }],
          },
        ],
      };

      const pkg = makePkg('sh3-editor', '0.2.0');
      publish.applyPackageUpdate(pkg, join(tmp, '_pages'), reg);

      // New bundle exists, old bundle is gone
      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.2.0.js')));
      assert.ok(!existsSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.1.0.js')));

      // Registry entry shows new version only
      assert.equal(reg.packages.length, 1);
      assert.equal(reg.packages[0].versions.length, 1);
      assert.equal(reg.packages[0].versions[0].version, '0.2.0');
    } finally {
      teardown();
    }
  });

  it('replaces old server bundle too when previous had one', () => {
    setup();
    try {
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-registry-0.1.0.js'), 'old-c');
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-registry-0.1.0-server.js'), 'old-s');
      const reg = {
        version: 1,
        packages: [
          {
            id: 'sh3-registry',
            type: 'combo',
            label: 'Registry',
            description: 'old',
            author: { name: 'x' },
            versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/sh3-registry-0.1.0.js', integrity: 'sha384-old', serverBundleUrl: 'bundles/sh3-registry-0.1.0-server.js' }],
          },
        ],
      };

      const pkg = makePkg('sh3-registry', '0.2.0', { type: 'combo', withServer: true });
      publish.applyPackageUpdate(pkg, join(tmp, '_pages'), reg);

      assert.ok(!existsSync(join(tmp, '_pages', 'bundles', 'sh3-registry-0.1.0.js')));
      assert.ok(!existsSync(join(tmp, '_pages', 'bundles', 'sh3-registry-0.1.0-server.js')));
      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'sh3-registry-0.2.0.js')));
      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'sh3-registry-0.2.0-server.js')));
    } finally {
      teardown();
    }
  });

  it('refreshes label/description/author from manifest on bump', () => {
    setup();
    try {
      const reg = {
        version: 1,
        packages: [
          {
            id: 'sh3-editor',
            type: 'shard',
            label: 'Old Label',
            description: 'old desc',
            author: { name: 'old' },
            versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/sh3-editor-0.1.0.js', integrity: 'sha384-old' }],
          },
        ],
      };
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.1.0.js'), 'old');

      const pkg = makePkg('sh3-editor', '0.2.0');
      publish.applyPackageUpdate(pkg, join(tmp, '_pages'), reg);

      // The fixture's manifest has description 'test pkg' and author 'test-author'
      assert.equal(reg.packages[0].description, 'test pkg');
      assert.equal(reg.packages[0].author.name, 'test-author');
    } finally {
      teardown();
    }
  });
});

describe('main()', () => {
  let tmp;

  function setup() {
    tmp = mkdtempSync(join(tmpdir(), 'sh3-publish-test-'));
    mkdirSync(join(tmp, 'packages'));
    mkdirSync(join(tmp, '_pages', 'bundles'), { recursive: true });
  }

  function teardown() {
    rmSync(tmp, { recursive: true, force: true });
  }

  function makePkg(id, version, opts = {}) {
    const npmName = opts.npmName ?? id;
    const pkgDir = join(tmp, 'packages', id);
    const artifactDir = join(pkgDir, 'dist', 'artifact');
    mkdirSync(artifactDir, { recursive: true });
    writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name: npmName, version }));
    const manifest = {
      id,
      type: opts.type ?? 'shard',
      label: id,
      version,
      description: 'test',
      author: 'tester',
      contractVersion: 1,
    };
    writeFileSync(join(artifactDir, 'manifest.json'), JSON.stringify(manifest));
    writeFileSync(join(artifactDir, 'client.js'), `export const x = '${id}-${version}';`);
    if (opts.withServer) {
      writeFileSync(join(artifactDir, 'server.js'), `export const s = '${id}-${version}';`);
    }
  }

  function seedRegistry(reg) {
    writeFileSync(join(tmp, '_pages', 'registry.json'), JSON.stringify(reg));
  }

  it('publishes all packages on first run (empty registry)', async () => {
    setup();
    try {
      makePkg('sh3-editor', '0.1.0', { npmName: '@unfinished-lair/sh3-editor' });
      makePkg('sh3-diagnostic', '0.2.1', { type: 'combo', withServer: true });

      const result = await publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') });

      assert.deepEqual([...result.registryPublished].sort(), ['sh3-diagnostic', 'sh3-editor']);
      // sh3-editor is in npm_eligible because new publishes always are
      assert.deepEqual([...result.npmEligible].sort(), ['@unfinished-lair/sh3-editor']);

      const reg = JSON.parse(readFileSync(join(tmp, '_pages', 'registry.json'), 'utf-8'));
      assert.equal(reg.packages.length, 2);
    } finally {
      teardown();
    }
  });

  it('registry-only on a patch bump of sh3-editor', async () => {
    setup();
    try {
      makePkg('sh3-editor', '0.1.1', { npmName: '@unfinished-lair/sh3-editor' });
      seedRegistry({
        version: 1,
        packages: [
          {
            id: 'sh3-editor', type: 'shard', label: 'Editor', description: '',
            author: { name: 'x' },
            versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/sh3-editor-0.1.0.js', integrity: 'sha384-xxx' }],
          },
        ],
      });
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.1.0.js'), 'old');

      const result = await publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') });

      assert.deepEqual(result.registryPublished, ['sh3-editor']);
      assert.deepEqual(result.npmEligible, []); // patch does not publish to npm
    } finally {
      teardown();
    }
  });

  it('registry + npm on a minor bump of sh3-editor', async () => {
    setup();
    try {
      makePkg('sh3-editor', '0.2.0', { npmName: '@unfinished-lair/sh3-editor' });
      seedRegistry({
        version: 1,
        packages: [
          {
            id: 'sh3-editor', type: 'shard', label: 'Editor', description: '',
            author: { name: 'x' },
            versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/sh3-editor-0.1.0.js', integrity: 'sha384-xxx' }],
          },
        ],
      });
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.1.0.js'), 'old');

      const result = await publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') });

      assert.deepEqual(result.registryPublished, ['sh3-editor']);
      assert.deepEqual(result.npmEligible, ['@unfinished-lair/sh3-editor']);
    } finally {
      teardown();
    }
  });

  it('no-op when nothing changed', async () => {
    setup();
    try {
      makePkg('sh3-editor', '0.1.0', { npmName: '@unfinished-lair/sh3-editor' });
      seedRegistry({
        version: 1,
        packages: [
          {
            id: 'sh3-editor', type: 'shard', label: 'Editor', description: '',
            author: { name: 'x' },
            versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/sh3-editor-0.1.0.js', integrity: 'sha384-xxx' }],
          },
        ],
      });

      const result = await publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') });

      assert.deepEqual(result.registryPublished, []);
      assert.deepEqual(result.npmEligible, []);
    } finally {
      teardown();
    }
  });

  it('fails fast on regression', async () => {
    setup();
    try {
      makePkg('sh3-editor', '0.1.0', { npmName: '@unfinished-lair/sh3-editor' });
      seedRegistry({
        version: 1,
        packages: [
          {
            id: 'sh3-editor', type: 'shard', label: 'Editor', description: '',
            author: { name: 'x' },
            versions: [{ version: '0.2.0', contractVersion: '1', bundleUrl: 'bundles/sh3-editor-0.2.0.js', integrity: 'sha384-xxx' }],
          },
        ],
      });

      await assert.rejects(
        publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') }),
        /regression/i,
      );
    } finally {
      teardown();
    }
  });

  it('non-editor package never eligible for npm', async () => {
    setup();
    try {
      makePkg('sh3-diagnostic', '1.0.0'); // first publish, major version — but not sh3-editor
      const result = await publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') });

      assert.deepEqual(result.registryPublished, ['sh3-diagnostic']);
      assert.deepEqual(result.npmEligible, []); // only sh3-editor can be eligible
    } finally {
      teardown();
    }
  });
});
