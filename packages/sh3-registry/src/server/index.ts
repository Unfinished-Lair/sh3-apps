/**
 * sh3-registry server shard — serves a package registry.
 *
 * Routes (relative to /api/sh3-registry/):
 *   GET  /registry.json           — public registry index
 *   GET  /bundles/:filename       — public archive download
 *   POST /publish                 — upload .sh3pkg artifact (admin)
 *   PATCH /packages/:id           — update package metadata (admin)
 *   DELETE /packages/:id          — delete a package (admin)
 *
 * All data stored in ctx.dataDir.
 * Registry format follows registry-spec.md (ratified v0.21.0).
 */

import {
  readFileSync,
  writeFileSync,
  unlinkSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { unzipSync } from 'fflate';

// ---- Types ----

interface PackageVersion {
  version: string;
  contractVersion: string;
  archiveUrl: string;
  integrity: string;
  requires?: Array<{ id: string; versionRange: string }>;
}

interface PackageEntry {
  id: string;
  type: string;
  label: string;
  description: string;
  author: { name: string };
  icon?: string;
  versions: PackageVersion[];
}

interface RegistryJson {
  version: 1;
  packages: PackageEntry[];
}

// ---- Helpers ----

function loadRegistryJson(path: string): RegistryJson {
  if (!existsSync(path)) return { version: 1, packages: [] };
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return { version: 1, packages: [] };
  }
}

function saveRegistryJson(path: string, registry: RegistryJson): void {
  writeFileSync(path, JSON.stringify(registry, null, 2));
}

function readManifestFromArchive(bytes: Buffer): Record<string, any> {
  const files = unzipSync(bytes);
  const manifestBytes = files['manifest.json'];
  if (!manifestBytes) throw new Error('Archive missing manifest.json');
  return JSON.parse(Buffer.from(manifestBytes).toString('utf-8'));
}

// ---- Server Shard ----

const registryServer = {
  id: 'sh3-registry',

  routes(router: any, ctx: { shardId: string; dataDir: string; adminOnly: any }) {
    const registryJsonPath = join(ctx.dataDir, 'registry.json');
    const bundlesDir = join(ctx.dataDir, 'bundles');
    mkdirSync(bundlesDir, { recursive: true });

    // ---- Public: registry index ----
    router.get('/registry.json', (c: any) => {
      if (!existsSync(registryJsonPath)) {
        return c.json({ version: 1, packages: [] });
      }
      const content = readFileSync(registryJsonPath, 'utf-8');
      return c.json(JSON.parse(content));
    });

    // ---- Public: archive downloads ----
    router.get('/bundles/:filename', (c: any) => {
      const filename: string = c.req.param('filename');
      const filePath = join(bundlesDir, filename);
      if (!filePath.startsWith(bundlesDir)) {
        return c.json({ error: 'Invalid path' }, 400);
      }
      if (!existsSync(filePath)) return c.notFound();
      const content = readFileSync(filePath);
      return new Response(content, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    });

    // ---- Admin: publish ----
    // Accepts a single .sh3pkg archive in the "archive" form field.
    // All metadata is extracted from the manifest.json inside the archive.
    router.post('/publish', ctx.adminOnly, async (c: any) => {
      const formData = await c.req.formData();
      const archiveFile = formData.get('archive');

      if (!archiveFile || !(archiveFile instanceof File)) {
        return c.json({ error: 'Missing "archive" file field (.sh3pkg)' }, 400);
      }

      const archiveBytes = Buffer.from(await archiveFile.arrayBuffer());

      let manifest: Record<string, any>;
      try {
        manifest = readManifestFromArchive(archiveBytes);
      } catch (err) {
        return c.json({ error: `Cannot read archive: ${err instanceof Error ? err.message : String(err)}` }, 400);
      }

      const { id, type, label, version, description, author, requiredShards } = manifest;
      if (!id || !type || !label || !version) {
        return c.json({ error: 'Manifest missing required fields (id, type, label, version)' }, 400);
      }

      // Store archive and compute integrity
      const archiveFilename = `${id}-${version}.sh3pkg`;
      const archivePath = join(bundlesDir, archiveFilename);
      writeFileSync(archivePath, archiveBytes);

      const hash = createHash('sha384').update(archiveBytes).digest('base64');
      const integrity = `sha384-${hash}`;
      const archiveUrl = `bundles/${archiveFilename}`;

      // Build requires from requiredShards
      const requires = Array.isArray(requiredShards) && requiredShards.length > 0
        ? requiredShards.map((dep: string) => ({ id: dep, versionRange: '*' }))
        : undefined;

      const registry = loadRegistryJson(registryJsonPath);
      const existingIdx = registry.packages.findIndex((p) => p.id === id);

      const versionEntry: PackageVersion = { version, contractVersion: '1', archiveUrl, integrity };
      if (requires) versionEntry.requires = requires;

      const authorName = typeof author === 'string' ? author : (author?.name ?? 'Unknown');

      if (existingIdx >= 0) {
        const pkg = registry.packages[existingIdx];
        // Delete old archive for this version if it exists
        const verIdx = pkg.versions.findIndex((v) => v.version === version);
        if (verIdx >= 0) {
          const oldUrl = pkg.versions[verIdx].archiveUrl;
          if (oldUrl && oldUrl !== archiveUrl) {
            const oldPath = join(ctx.dataDir, oldUrl);
            if (existsSync(oldPath)) unlinkSync(oldPath);
          }
          pkg.versions[verIdx] = versionEntry;
        } else {
          pkg.versions.unshift(versionEntry);
        }
        pkg.label = label;
        if (description) pkg.description = description;
        if (author) pkg.author = { name: authorName };
      } else {
        registry.packages.push({
          id,
          type,
          label,
          description: description ?? '',
          author: { name: authorName },
          versions: [versionEntry],
        });
      }

      saveRegistryJson(registryJsonPath, registry);
      return c.json({ ok: true, id, version, integrity, archiveUrl });
    });

    // ---- Admin: update metadata ----
    router.patch('/packages/:id', ctx.adminOnly, async (c: any) => {
      const pkgId: string = c.req.param('id');
      const body = await c.req.json();

      const registry = loadRegistryJson(registryJsonPath);
      const pkg = registry.packages.find((p) => p.id === pkgId);
      if (!pkg) return c.json({ error: 'Package not found' }, 404);

      if (body.label !== undefined) pkg.label = body.label;
      if (body.description !== undefined) pkg.description = body.description;
      if (body.author !== undefined) pkg.author = { name: body.author };
      if (body.icon !== undefined) pkg.icon = body.icon || undefined;

      saveRegistryJson(registryJsonPath, registry);
      return c.json({ ok: true });
    });

    // ---- Admin: delete package ----
    router.delete('/packages/:id', ctx.adminOnly, (c: any) => {
      const pkgId: string = c.req.param('id');
      const registry = loadRegistryJson(registryJsonPath);
      const pkg = registry.packages.find((p) => p.id === pkgId);
      if (!pkg) return c.json({ error: 'Package not found' }, 404);

      for (const ver of pkg.versions) {
        if (!ver.archiveUrl) continue;
        const archivePath = join(ctx.dataDir, ver.archiveUrl);
        if (existsSync(archivePath)) unlinkSync(archivePath);
      }

      registry.packages = registry.packages.filter((p) => p.id !== pkgId);
      saveRegistryJson(registryJsonPath, registry);
      return c.json({ ok: true });
    });
  },
};

export default registryServer;
