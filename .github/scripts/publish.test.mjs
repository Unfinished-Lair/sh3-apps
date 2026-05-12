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
    assert.ok(typeof publish.isArtifactContentUnchanged === 'function');
    assert.ok(typeof publish.applyPackageUpdate === 'function');
    assert.ok(typeof publish.sweepOrphans === 'function');
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

  it('strips build metadata before parsing', () => {
    // Per semver §10, build metadata MUST be ignored for precedence.
    // sh3Artifact's buildSuffix:'auto' emits `<release>+<commits-past-tag>`.
    assert.deepEqual(publish.parseVer('1.0.0+build.1'), { major: 1, minor: 0, patch: 0 });
    assert.deepEqual(publish.parseVer('0.13.17+5'), { major: 0, minor: 13, patch: 17 });
    assert.deepEqual(publish.parseVer('2.5.0+408'), { major: 2, minor: 5, patch: 0 });
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
      // No buildSuffix in the fixture → manifest.version equals package.version.
      assert.equal(p.artifactVersion, '0.1.0');
      assert.ok(p.dir.endsWith('sh3-editor'));
      assert.ok(p.artifactDir.endsWith(join('sh3-editor', 'dist', 'artifact')));
    } finally {
      teardown();
    }
  });

  it('reads artifactVersion from manifest.json (with build suffix)', () => {
    setup();
    try {
      const pkgDir = join(tmp, 'packages', 'sh3-editor');
      mkdirSync(pkgDir, { recursive: true });
      writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name: 'sh3-editor', version: '0.13.17' }));
      const artDir = join(pkgDir, 'dist', 'artifact');
      mkdirSync(artDir, { recursive: true });
      writeFileSync(
        join(artDir, 'manifest.json'),
        JSON.stringify({ id: 'sh3-editor', type: 'shard', label: 'Editor', version: '0.13.17+5' }),
      );
      writeFileSync(join(artDir, 'client.js'), 'export const x = 1;');

      const pkgs = publish.discoverPackages(tmp);
      assert.equal(pkgs.length, 1);
      assert.equal(pkgs[0].version, '0.13.17');           // release axis
      assert.equal(pkgs[0].artifactVersion, '0.13.17+5'); // artifact identity
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
  // Helper: construct the shape discoverPackages returns. `artifactVersion`
  // defaults to `version` so existing semantics (no buildSuffix) keep working.
  const pkg = (id, version, artifactVersion = version) => ({ id, version, artifactVersion });

  it('reports new when package is not in registry', () => {
    const reg = { version: 1, packages: [] };
    assert.deepEqual(publish.diffPackage(pkg('sh3-new', '0.1.0'), reg), { outcome: 'new', oldVersion: null });
  });

  it('reports unchanged when version matches live registry', () => {
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.1.0')] };
    assert.deepEqual(publish.diffPackage(pkg('sh3-editor', '0.1.0'), reg), { outcome: 'unchanged', oldVersion: '0.1.0' });
  });

  it('reports bump when new version > old version', () => {
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.1.0')] };
    assert.deepEqual(publish.diffPackage(pkg('sh3-editor', '0.2.0'), reg), { outcome: 'bump', oldVersion: '0.1.0' });
  });

  it('reports regression when new version < old version', () => {
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.2.0')] };
    assert.deepEqual(publish.diffPackage(pkg('sh3-editor', '0.1.0'), reg), { outcome: 'regression', oldVersion: '0.2.0' });
  });

  it('patch bumps classified as bump', () => {
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.1.0')] };
    assert.deepEqual(publish.diffPackage(pkg('sh3-editor', '0.1.1'), reg), { outcome: 'bump', oldVersion: '0.1.0' });
  });

  it('reports bump when artifactVersion adds a build suffix to same release', () => {
    // Registry has bare 0.13.17; new build has 0.13.17+5 → same release, new
    // build identity. Should refresh the entry so the bundle SRI tracks the
    // current artifact content.
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.13.17')] };
    assert.deepEqual(
      publish.diffPackage(pkg('sh3-editor', '0.13.17', '0.13.17+5'), reg),
      { outcome: 'bump', oldVersion: '0.13.17' },
    );
  });

  it('reports bump when only the build suffix changed', () => {
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.13.17+4')] };
    assert.deepEqual(
      publish.diffPackage(pkg('sh3-editor', '0.13.17', '0.13.17+5'), reg),
      { outcome: 'bump', oldVersion: '0.13.17+4' },
    );
  });

  it('reports unchanged when artifactVersion (incl. suffix) matches registry', () => {
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.13.17+5')] };
    assert.deepEqual(
      publish.diffPackage(pkg('sh3-editor', '0.13.17', '0.13.17+5'), reg),
      { outcome: 'unchanged', oldVersion: '0.13.17+5' },
    );
  });

  it('release bump beats stored suffixed version', () => {
    const reg = { version: 1, packages: [makeEntry('sh3-editor', '0.13.17+8')] };
    assert.deepEqual(
      publish.diffPackage(pkg('sh3-editor', '0.13.18', '0.13.18+1'), reg),
      { outcome: 'bump', oldVersion: '0.13.17+8' },
    );
  });
});

describe('isArtifactContentUnchanged', () => {
  let tmp;

  function setup() {
    tmp = mkdtempSync(join(tmpdir(), 'sh3-publish-test-'));
    mkdirSync(join(tmp, '_pages', 'bundles'), { recursive: true });
    mkdirSync(join(tmp, 'packages'), { recursive: true });
  }

  function teardown() {
    rmSync(tmp, { recursive: true, force: true });
  }

  function sri(content) {
    return 'sha384-' + createHash('sha384').update(content).digest('base64');
  }

  function makeArtifact(id, { clientContent, serverContent } = {}) {
    const artifactDir = join(tmp, 'packages', id, 'dist', 'artifact');
    mkdirSync(artifactDir, { recursive: true });
    if (clientContent !== undefined) {
      writeFileSync(join(artifactDir, 'client.js'), clientContent);
    }
    if (serverContent !== undefined) {
      writeFileSync(join(artifactDir, 'server.js'), serverContent);
    }
    return { id, artifactDir };
  }

  function registryWith(id, version, integrity, { serverBundleUrl } = {}) {
    const versionEntry = { version, contractVersion: '1', bundleUrl: `bundles/${id}-${version}.js`, integrity };
    if (serverBundleUrl) versionEntry.serverBundleUrl = serverBundleUrl;
    return {
      version: 1,
      packages: [{
        id, type: 'shard', label: id, description: '',
        author: { name: 'x' },
        versions: [versionEntry],
      }],
    };
  }

  it('returns true when client bytes match stored integrity (no server bundle)', () => {
    setup();
    try {
      const content = `export const x = 'identical';`;
      const pkg = makeArtifact('sh3-foo', { clientContent: content });
      const reg = registryWith('sh3-foo', '0.1.0+4', sri(content));
      assert.equal(publish.isArtifactContentUnchanged(pkg, join(tmp, '_pages'), reg), true);
    } finally {
      teardown();
    }
  });

  it('returns false when client bytes differ from stored integrity', () => {
    setup();
    try {
      const pkg = makeArtifact('sh3-foo', { clientContent: `export const x = 'new';` });
      const reg = registryWith('sh3-foo', '0.1.0+4', sri(`export const x = 'old';`));
      assert.equal(publish.isArtifactContentUnchanged(pkg, join(tmp, '_pages'), reg), false);
    } finally {
      teardown();
    }
  });

  it('returns false when package is not in the registry', () => {
    setup();
    try {
      const pkg = makeArtifact('sh3-foo', { clientContent: `export const x = 1;` });
      const reg = { version: 1, packages: [] };
      assert.equal(publish.isArtifactContentUnchanged(pkg, join(tmp, '_pages'), reg), false);
    } finally {
      teardown();
    }
  });

  it('returns false when new artifact has no client.js', () => {
    setup();
    try {
      const pkg = makeArtifact('sh3-foo'); // no bundles
      const reg = registryWith('sh3-foo', '0.1.0+4', 'sha384-anything');
      assert.equal(publish.isArtifactContentUnchanged(pkg, join(tmp, '_pages'), reg), false);
    } finally {
      teardown();
    }
  });

  it('returns true when client + server bytes both match', () => {
    setup();
    try {
      const clientContent = `export const c = 1;`;
      const serverContent = `export const s = 2;`;
      const pkg = makeArtifact('sh3-combo', { clientContent, serverContent });
      // Seed the previously-published server bundle on disk so its integrity can be recomputed.
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-combo-0.1.0+4-server.js'), serverContent);
      const reg = registryWith('sh3-combo', '0.1.0+4', sri(clientContent), {
        serverBundleUrl: 'bundles/sh3-combo-0.1.0+4-server.js',
      });
      assert.equal(publish.isArtifactContentUnchanged(pkg, join(tmp, '_pages'), reg), true);
    } finally {
      teardown();
    }
  });

  it('returns false when server presence differs (new has server, old does not)', () => {
    setup();
    try {
      const clientContent = `export const c = 1;`;
      const pkg = makeArtifact('sh3-combo', { clientContent, serverContent: `export const s = 2;` });
      const reg = registryWith('sh3-combo', '0.1.0+4', sri(clientContent)); // no serverBundleUrl
      assert.equal(publish.isArtifactContentUnchanged(pkg, join(tmp, '_pages'), reg), false);
    } finally {
      teardown();
    }
  });

  it('returns false when server presence differs (old has server, new does not)', () => {
    setup();
    try {
      const clientContent = `export const c = 1;`;
      const pkg = makeArtifact('sh3-combo', { clientContent }); // no server
      const reg = registryWith('sh3-combo', '0.1.0+4', sri(clientContent), {
        serverBundleUrl: 'bundles/sh3-combo-0.1.0+4-server.js',
      });
      assert.equal(publish.isArtifactContentUnchanged(pkg, join(tmp, '_pages'), reg), false);
    } finally {
      teardown();
    }
  });

  it('returns false when server bytes differ', () => {
    setup();
    try {
      const clientContent = `export const c = 1;`;
      const pkg = makeArtifact('sh3-combo', { clientContent, serverContent: `export const s = 'new';` });
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-combo-0.1.0+4-server.js'), `export const s = 'old';`);
      const reg = registryWith('sh3-combo', '0.1.0+4', sri(clientContent), {
        serverBundleUrl: 'bundles/sh3-combo-0.1.0+4-server.js',
      });
      assert.equal(publish.isArtifactContentUnchanged(pkg, join(tmp, '_pages'), reg), false);
    } finally {
      teardown();
    }
  });

  it('returns false when stored server bundle is missing on disk (fail closed)', () => {
    setup();
    try {
      const clientContent = `export const c = 1;`;
      const pkg = makeArtifact('sh3-combo', { clientContent, serverContent: `export const s = 2;` });
      const reg = registryWith('sh3-combo', '0.1.0+4', sri(clientContent), {
        serverBundleUrl: 'bundles/sh3-combo-0.1.0+4-server.js', // never written to disk
      });
      assert.equal(publish.isArtifactContentUnchanged(pkg, join(tmp, '_pages'), reg), false);
    } finally {
      teardown();
    }
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

  function makePkg(id, version, { type = 'shard', withServer = false, manifestVersion = null, npmName = null } = {}) {
    const pkgDir = join(tmp, 'packages', id);
    const artifactDir = join(pkgDir, 'dist', 'artifact');
    const finalNpmName = npmName ?? id;
    const finalManifestVersion = manifestVersion ?? version;
    mkdirSync(artifactDir, { recursive: true });
    writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name: finalNpmName, version }));
    const manifest = {
      id,
      type,
      label: id,
      version: finalManifestVersion,
      description: 'test pkg',
      author: 'test-author',
      contractVersion: 1,
    };
    writeFileSync(join(artifactDir, 'manifest.json'), JSON.stringify(manifest));
    writeFileSync(join(artifactDir, 'client.js'), `export const client = '${id}-${version}';`);
    if (withServer) {
      writeFileSync(join(artifactDir, 'server.js'), `export const server = '${id}-${version}';`);
    }
    return { id, version, artifactVersion: finalManifestVersion, npmName: finalNpmName, dir: pkgDir, artifactDir };
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
      assert.deepEqual(entry.source, { npm: 'sh3-editor' });
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

  it('stamps source.npm from pkgJson.name, not from manifest id', () => {
    setup();
    try {
      const pkg = makePkg('sh3-editor', '0.1.0', { npmName: '@unfinished-lair/sh3-editor' });
      const reg = { version: 1, packages: [] };
      publish.applyPackageUpdate(pkg, join(tmp, '_pages'), reg);
      assert.deepEqual(reg.packages[0].source, { npm: '@unfinished-lair/sh3-editor' });
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

  it('uses artifactVersion (with build suffix) for bundle filename and registry entry', () => {
    setup();
    try {
      const pkg = makePkg('sh3-editor', '0.13.17', { manifestVersion: '0.13.17+5' });
      const reg = { version: 1, packages: [] };
      publish.applyPackageUpdate(pkg, join(tmp, '_pages'), reg);

      const entry = reg.packages[0];
      assert.equal(entry.versions[0].version, '0.13.17+5');
      assert.equal(entry.versions[0].bundleUrl, 'bundles/sh3-editor-0.13.17+5.js');
      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.13.17+5.js')));
      // The bare pkg.version filename must NOT exist — the suffix is the
      // artifact identity. Two builds of 0.13.17 (e.g. +5 and +6) need
      // distinct filenames so their SRI hashes stay verifiable.
      assert.ok(!existsSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.13.17.js')));
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
      version: opts.manifestVersion ?? version,
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

  it('build-suffix-only change WITH changed bytes refreshes registry but does NOT publish to npm', async () => {
    setup();
    try {
      // Same release (0.13.17) but a new buildSuffix (+5 → +6) AND new bundle
      // bytes. Registry entry should refresh; npm sees the same release and
      // must not get republished.
      makePkg('sh3-editor', '0.13.17', {
        npmName: '@unfinished-lair/sh3-editor',
        manifestVersion: '0.13.17+6',
      });
      seedRegistry({
        version: 1,
        packages: [
          {
            id: 'sh3-editor', type: 'shard', label: 'Editor', description: '',
            author: { name: 'x' },
            source: { npm: '@unfinished-lair/sh3-editor' },
            versions: [{
              version: '0.13.17+5',
              contractVersion: '1',
              bundleUrl: 'bundles/sh3-editor-0.13.17+5.js',
              integrity: 'sha384-old',
            }],
          },
        ],
      });
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.13.17+5.js'), 'old');

      const result = await publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') });

      assert.deepEqual(result.registryPublished, ['sh3-editor']);
      assert.deepEqual(result.npmEligible, []); // suffix-only ≠ release bump

      const reg = JSON.parse(readFileSync(join(tmp, '_pages', 'registry.json'), 'utf-8'));
      assert.equal(reg.packages[0].versions[0].version, '0.13.17+6');
      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.13.17+6.js')));
      assert.ok(!existsSync(join(tmp, '_pages', 'bundles', 'sh3-editor-0.13.17+5.js')));
    } finally {
      teardown();
    }
  });

  it('skips republish when build suffix advances but bundle bytes are identical', async () => {
    setup();
    try {
      // The CI-churn case: a no-op push to main increments `git rev-list
      // --count` repo-wide, so sh3Artifact bumps the +build suffix on every
      // package. publish.mjs must detect that the bundle bytes didn't change
      // and skip the republish — otherwise gh-pages churns on every push.
      makePkg('sh3-style', '0.2.1', { manifestVersion: '0.2.1+12' });
      // The new client.js content is `export const x = 'sh3-style-0.2.1';`
      // (see makePkg). Seed the registry with the matching integrity and a
      // bundle file whose name reflects the prior suffix.
      const clientContent = `export const x = 'sh3-style-0.2.1';`;
      const integrity = 'sha384-' + createHash('sha384').update(clientContent).digest('base64');
      seedRegistry({
        version: 1,
        packages: [
          {
            id: 'sh3-style', type: 'shard', label: 'sh3-style', description: '',
            author: { name: 'x' },
            source: { npm: 'sh3-style' },
            versions: [{
              version: '0.2.1+11',
              contractVersion: '1',
              bundleUrl: 'bundles/sh3-style-0.2.1+11.js',
              integrity,
            }],
          },
        ],
      });
      writeFileSync(join(tmp, '_pages', 'bundles', 'sh3-style-0.2.1+11.js'), clientContent);

      const result = await publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') });

      // No registry republish, no npm eligibility.
      assert.deepEqual(result.registryPublished, []);
      assert.deepEqual(result.npmEligible, []);

      // Registry entry still pins the OLD suffix.
      const reg = JSON.parse(readFileSync(join(tmp, '_pages', 'registry.json'), 'utf-8'));
      assert.equal(reg.packages[0].versions[0].version, '0.2.1+11');
      // No new-suffix bundle file was created, the old one is still there.
      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'sh3-style-0.2.1+11.js')));
      assert.ok(!existsSync(join(tmp, '_pages', 'bundles', 'sh3-style-0.2.1+12.js')));
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

  it('sweeps orphan entry when workspace publishes under a different manifest id', async () => {
    setup();
    try {
      // Workspace `sh3-gemini-shell` previously published as id `gemini-shell`
      // (combo era). Now it builds shard-only and the manifest id is `gemini`.
      makePkg('sh3-gemini-shell', '0.5.0'); // makePkg sets manifest.id to first arg
      // Override manifest id to simulate the rename.
      const pkgDir = join(tmp, 'packages', 'sh3-gemini-shell');
      const artifactDir = join(pkgDir, 'dist', 'artifact');
      const manifest = JSON.parse(readFileSync(join(artifactDir, 'manifest.json'), 'utf-8'));
      manifest.id = 'gemini';
      writeFileSync(join(artifactDir, 'manifest.json'), JSON.stringify(manifest));

      seedRegistry({
        version: 1,
        packages: [
          {
            id: 'gemini-shell', type: 'combo', label: 'Gemini', description: '',
            author: { name: 'x' },
            source: { npm: 'sh3-gemini-shell' },
            versions: [{ version: '0.4.2', contractVersion: '1', bundleUrl: 'bundles/gemini-shell-0.4.2.js', integrity: 'sha384-old' }],
          },
        ],
      });
      writeFileSync(join(tmp, '_pages', 'bundles', 'gemini-shell-0.4.2.js'), 'old');

      const result = await publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') });

      // New entry exists, old orphan gone
      const reg = JSON.parse(readFileSync(join(tmp, '_pages', 'registry.json'), 'utf-8'));
      const ids = reg.packages.map((p) => p.id).sort();
      assert.deepEqual(ids, ['gemini']);
      assert.ok(!existsSync(join(tmp, '_pages', 'bundles', 'gemini-shell-0.4.2.js')));
      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'gemini-0.5.0.js')));

      assert.deepEqual(result.swept, [{ id: 'gemini-shell', source: 'sh3-gemini-shell', replacedBy: 'gemini' }]);
    } finally {
      teardown();
    }
  });

  it('does not sweep entries with no source.npm (pre-migration)', async () => {
    setup();
    try {
      makePkg('sh3-editor', '0.1.0', { npmName: '@unfinished-lair/sh3-editor' });
      // Seed an unrelated entry with no source field — must survive.
      seedRegistry({
        version: 1,
        packages: [
          {
            id: 'legacy-thing', type: 'shard', label: 'Legacy', description: '',
            author: { name: 'x' },
            versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/legacy-thing-0.1.0.js', integrity: 'sha384-xxx' }],
          },
        ],
      });
      writeFileSync(join(tmp, '_pages', 'bundles', 'legacy-thing-0.1.0.js'), 'legacy');

      const result = await publish.main({ repoRoot: tmp, pagesDir: join(tmp, '_pages') });

      const reg = JSON.parse(readFileSync(join(tmp, '_pages', 'registry.json'), 'utf-8'));
      const ids = reg.packages.map((p) => p.id).sort();
      assert.deepEqual(ids, ['legacy-thing', 'sh3-editor']);
      assert.deepEqual(result.swept, []);
      assert.ok(existsSync(join(tmp, '_pages', 'bundles', 'legacy-thing-0.1.0.js')));
    } finally {
      teardown();
    }
  });
});

describe('sweepOrphans', () => {
  let tmp;

  function setup() {
    tmp = mkdtempSync(join(tmpdir(), 'sh3-publish-test-'));
    mkdirSync(join(tmp, 'bundles'), { recursive: true });
  }

  function teardown() {
    rmSync(tmp, { recursive: true, force: true });
  }

  it('drops entry whose source workspace now publishes a different id', () => {
    setup();
    try {
      const reg = {
        version: 1,
        packages: [
          {
            id: 'gemini-shell', type: 'combo', label: 'Gemini', description: '',
            author: { name: 'x' },
            source: { npm: 'sh3-gemini-shell' },
            versions: [{ version: '0.4.2', contractVersion: '1', bundleUrl: 'bundles/gemini-shell-0.4.2.js', integrity: 'sha384-old' }],
          },
          {
            id: 'gemini', type: 'shard', label: 'Gemini', description: '',
            author: { name: 'x' },
            source: { npm: 'sh3-gemini-shell' },
            versions: [{ version: '0.5.0', contractVersion: '1', bundleUrl: 'bundles/gemini-0.5.0.js', integrity: 'sha384-new' }],
          },
        ],
      };
      writeFileSync(join(tmp, 'bundles', 'gemini-shell-0.4.2.js'), 'old');
      writeFileSync(join(tmp, 'bundles', 'gemini-0.5.0.js'), 'new');

      const swept = publish.sweepOrphans(
        [{ id: 'gemini', npmName: 'sh3-gemini-shell' }],
        tmp,
        reg,
      );

      assert.equal(reg.packages.length, 1);
      assert.equal(reg.packages[0].id, 'gemini');
      assert.deepEqual(swept, [{ id: 'gemini-shell', source: 'sh3-gemini-shell', replacedBy: 'gemini' }]);
      assert.ok(!existsSync(join(tmp, 'bundles', 'gemini-shell-0.4.2.js')));
      assert.ok(existsSync(join(tmp, 'bundles', 'gemini-0.5.0.js')));
    } finally {
      teardown();
    }
  });

  it('leaves entries from absent workspaces untouched', () => {
    setup();
    try {
      const reg = {
        version: 1,
        packages: [
          {
            id: 'sh3-editor', type: 'shard', label: 'Editor', description: '',
            author: { name: 'x' },
            source: { npm: '@unfinished-lair/sh3-editor' },
            versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/sh3-editor-0.1.0.js', integrity: 'sha384-xxx' }],
          },
        ],
      };

      // Editor not in this run's discovered packages — must NOT be swept.
      const swept = publish.sweepOrphans([], tmp, reg);
      assert.equal(reg.packages.length, 1);
      assert.deepEqual(swept, []);
    } finally {
      teardown();
    }
  });

  it('leaves entries with no source.npm untouched', () => {
    setup();
    try {
      const reg = {
        version: 1,
        packages: [
          {
            id: 'legacy', type: 'shard', label: 'Legacy', description: '',
            author: { name: 'x' },
            versions: [{ version: '0.1.0', contractVersion: '1', bundleUrl: 'bundles/legacy-0.1.0.js', integrity: 'sha384-xxx' }],
          },
        ],
      };

      const swept = publish.sweepOrphans(
        [{ id: 'something-else', npmName: 'something-else' }],
        tmp,
        reg,
      );
      assert.equal(reg.packages.length, 1);
      assert.deepEqual(swept, []);
    } finally {
      teardown();
    }
  });

  it('removes server bundle alongside client bundle on sweep', () => {
    setup();
    try {
      const reg = {
        version: 1,
        packages: [
          {
            id: 'old-id', type: 'combo', label: 'Old', description: '',
            author: { name: 'x' },
            source: { npm: 'sh3-thing' },
            versions: [{
              version: '0.1.0', contractVersion: '1',
              bundleUrl: 'bundles/old-id-0.1.0.js', integrity: 'sha384-xxx',
              serverBundleUrl: 'bundles/old-id-0.1.0-server.js',
            }],
          },
        ],
      };
      writeFileSync(join(tmp, 'bundles', 'old-id-0.1.0.js'), 'c');
      writeFileSync(join(tmp, 'bundles', 'old-id-0.1.0-server.js'), 's');

      publish.sweepOrphans(
        [{ id: 'new-id', npmName: 'sh3-thing' }],
        tmp,
        reg,
      );
      assert.equal(reg.packages.length, 0);
      assert.ok(!existsSync(join(tmp, 'bundles', 'old-id-0.1.0.js')));
      assert.ok(!existsSync(join(tmp, 'bundles', 'old-id-0.1.0-server.js')));
    } finally {
      teardown();
    }
  });
});
