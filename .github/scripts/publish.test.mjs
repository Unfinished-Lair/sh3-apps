import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import * as publish from './publish.mjs';

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
