#!/usr/bin/env node
// Produce dist/artifact/{server.js,manifest.json} for deploy/install.
// version is authoritative from package.json per ADR-013.

import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(here, '..');
const serverSrc = join(pkgDir, 'dist', 'server', 'index.js');
const artifactDir = join(pkgDir, 'dist', 'artifact');

mkdirSync(artifactDir, { recursive: true });
copyFileSync(serverSrc, join(artifactDir, 'server.js'));

const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf-8'));
const manifest = JSON.parse(readFileSync(join(pkgDir, 'manifest.json'), 'utf-8'));
manifest.version = pkg.version;

writeFileSync(join(artifactDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`[sh3-sync] artifact built → ${artifactDir}`);
