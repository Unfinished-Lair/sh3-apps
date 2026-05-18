#!/usr/bin/env node
/**
 * Static file server for _pages/ — mimics what GitHub Pages serves from the
 * gh-pages branch, so the SH3 host can install packages from a local clone of
 * the registry while testing.
 *
 * Usage:
 *   node scripts/serve-pages.mjs [--port=5050] [--dir=_pages]
 *
 * Sends CORS-permissive headers so a browser-hosted SH3 client on a different
 * origin can fetch /registry.json and the bundle archives.
 */

import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { join, normalize, sep } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = /^--([^=]+)=(.*)$/.exec(a);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), 'true'];
  }),
);

const port = Number(args.port ?? 5050);
const root = join(process.cwd(), args.dir ?? '_pages');

if (!existsSync(root)) {
  console.error(`[serve-pages] root directory not found: ${root}`);
  process.exit(1);
}

const MIME = {
  '.json': 'application/json; charset=utf-8',
  '.sh3pkg': 'application/zip',
  '.zip': 'application/zip',
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function mimeFor(path) {
  const dot = path.lastIndexOf('.');
  return MIME[path.slice(dot)] ?? 'application/octet-stream';
}

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Strip query string, decode, normalize. Reject any path that escapes the root.
  const rawPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const safe = normalize(rawPath).replace(/^[\\/]+/, '');
  if (safe.split(sep).some((seg) => seg === '..')) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }

  let filePath = join(root, safe);
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`not found: ${rawPath}`);
    console.log(`[404] ${req.method} ${rawPath}`);
    return;
  }

  const stat = statSync(filePath);
  res.writeHead(200, {
    'Content-Type': mimeFor(filePath),
    'Content-Length': stat.size,
    'Cache-Control': 'no-store',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
  console.log(`[200] ${req.method} ${rawPath} (${stat.size}B)`);
});

server.listen(port, () => {
  console.log(`[serve-pages] root: ${root}`);
  console.log(`[serve-pages] listening on http://localhost:${port}`);
  console.log(`[serve-pages] registry: http://localhost:${port}/registry.json`);
});
