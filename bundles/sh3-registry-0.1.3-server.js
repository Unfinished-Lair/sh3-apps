/**
 * sh3-registry server shard — serves a package registry.
 *
 * Routes (relative to /api/sh3-registry/):
 *   GET  /registry.json           — public registry index
 *   GET  /bundles/:filename       — public bundle download
 *   POST /publish                 — upload artifact (manifest + bundles) (admin)
 *   PATCH /packages/:id           — update package metadata (admin)
 *   DELETE /packages/:id          — delete a package (admin)
 *   GET  /keys                    — list API keys (admin)
 *   POST /keys                    — generate API key (admin)
 *   DELETE /keys/:id              — revoke API key (admin)
 *
 * All data stored in ctx.dataDir.
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync, } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
// ---- Helpers ----
function loadRegistryJson(path) {
    if (!existsSync(path))
        return { version: 1, packages: [] };
    try {
        return JSON.parse(readFileSync(path, 'utf-8'));
    }
    catch {
        return { version: 1, packages: [] };
    }
}
function saveRegistryJson(path, registry) {
    writeFileSync(path, JSON.stringify(registry, null, 2));
}
// ---- Server Shard ----
const registryServer = {
    id: 'sh3-registry',
    routes(router, ctx) {
        const registryJsonPath = join(ctx.dataDir, 'registry.json');
        const bundlesDir = join(ctx.dataDir, 'bundles');
        mkdirSync(bundlesDir, { recursive: true });
        // ---- Public: registry index ----
        router.get('/registry.json', (c) => {
            if (!existsSync(registryJsonPath)) {
                return c.json({ version: 1, packages: [] });
            }
            const content = readFileSync(registryJsonPath, 'utf-8');
            return c.json(JSON.parse(content));
        });
        // ---- Public: bundle downloads ----
        router.get('/bundles/:filename', (c) => {
            const filename = c.req.param('filename');
            const filePath = join(bundlesDir, filename);
            // Prevent traversal
            if (!filePath.startsWith(bundlesDir)) {
                return c.json({ error: 'Invalid path' }, 400);
            }
            if (!existsSync(filePath))
                return c.notFound();
            const content = readFileSync(filePath);
            return new Response(content, {
                headers: {
                    'Content-Type': 'application/javascript',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        });
        // ---- Admin: publish ----
        // Accepts artifact files: manifest (required), client (optional), server (optional).
        // All metadata is read from the manifest — no manual fields needed.
        router.post('/publish', ctx.adminOnly, async (c) => {
            const formData = await c.req.formData();
            const manifestFile = formData.get('manifest');
            const clientFile = formData.get('client');
            const serverFile = formData.get('server');
            if (!manifestFile || !(manifestFile instanceof File)) {
                return c.json({ error: 'Missing "manifest" file field' }, 400);
            }
            let manifest;
            try {
                manifest = JSON.parse(await manifestFile.text());
            }
            catch {
                return c.json({ error: 'Invalid manifest JSON' }, 400);
            }
            const { id, type, label, version, description, author } = manifest;
            if (!id || !type || !label || !version) {
                return c.json({ error: 'Manifest missing required fields (id, type, label, version)' }, 400);
            }
            // Store client bundle and compute integrity
            let bundleUrl;
            let integrity;
            if (clientFile instanceof File) {
                const bundleBytes = Buffer.from(await clientFile.arrayBuffer());
                const bundleFilename = `${id}-${version}.js`;
                writeFileSync(join(bundlesDir, bundleFilename), bundleBytes);
                const hash = createHash('sha384').update(bundleBytes).digest('base64');
                integrity = `sha384-${hash}`;
                bundleUrl = `bundles/${bundleFilename}`;
            }
            // Store server bundle
            let serverBundleUrl;
            if (serverFile instanceof File) {
                const serverBytes = Buffer.from(await serverFile.arrayBuffer());
                const serverFilename = `${id}-${version}-server.js`;
                writeFileSync(join(bundlesDir, serverFilename), serverBytes);
                serverBundleUrl = `bundles/${serverFilename}`;
            }
            // Update registry index
            if (bundleUrl) {
                const registry = loadRegistryJson(registryJsonPath);
                const existing = registry.packages.findIndex((p) => p.id === id);
                const versionEntry = {
                    version,
                    contractVersion: String(manifest.contractVersion ?? 1),
                    bundleUrl,
                    integrity,
                };
                if (serverBundleUrl)
                    versionEntry.serverBundleUrl = serverBundleUrl;
                if (existing >= 0) {
                    // Replace existing version or prepend new one
                    const verIdx = registry.packages[existing].versions.findIndex((v) => v.version === version);
                    if (verIdx >= 0) {
                        registry.packages[existing].versions[verIdx] = versionEntry;
                    }
                    else {
                        registry.packages[existing].versions.unshift(versionEntry);
                    }
                    registry.packages[existing].label = label;
                    if (description)
                        registry.packages[existing].description = description;
                    if (author)
                        registry.packages[existing].author = { name: author };
                }
                else {
                    registry.packages.push({
                        id,
                        type,
                        label,
                        description: description ?? '',
                        author: { name: author ?? 'Unknown' },
                        versions: [versionEntry],
                    });
                }
                saveRegistryJson(registryJsonPath, registry);
            }
            return c.json({ ok: true, id, version, integrity, bundleUrl });
        });
        // ---- Admin: update metadata ----
        router.patch('/packages/:id', ctx.adminOnly, async (c) => {
            const pkgId = c.req.param('id');
            const body = await c.req.json();
            const registry = loadRegistryJson(registryJsonPath);
            const pkg = registry.packages.find((p) => p.id === pkgId);
            if (!pkg)
                return c.json({ error: 'Package not found' }, 404);
            if (body.label !== undefined)
                pkg.label = body.label;
            if (body.description !== undefined)
                pkg.description = body.description;
            if (body.author !== undefined)
                pkg.author = { name: body.author };
            saveRegistryJson(registryJsonPath, registry);
            return c.json({ ok: true });
        });
        // ---- Admin: delete package ----
        router.delete('/packages/:id', ctx.adminOnly, (c) => {
            const pkgId = c.req.param('id');
            const registry = loadRegistryJson(registryJsonPath);
            const pkg = registry.packages.find((p) => p.id === pkgId);
            if (!pkg)
                return c.json({ error: 'Package not found' }, 404);
            for (const ver of pkg.versions) {
                const filename = ver.bundleUrl.replace('/bundles/', '');
                const bundlePath = join(bundlesDir, filename);
                if (existsSync(bundlePath))
                    unlinkSync(bundlePath);
            }
            registry.packages = registry.packages.filter((p) => p.id !== pkgId);
            saveRegistryJson(registryJsonPath, registry);
            return c.json({ ok: true });
        });
    },
};
export default registryServer;
