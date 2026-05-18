import type { DocumentHandle } from 'sh3-core';
import type { DocSummary } from './types';

const DIR = 'docs/';

/** CRUD wrapper around the sh3-ai DocumentHandle, scoped to the
 *  `docs/<providerId>/...` namespace. Reads span every provider folder;
 *  writes and deletes are partitioned by provider id. */
export class DocsStore {
  constructor(private readonly handle: DocumentHandle) {}

  /** List docs under `docs/`, optionally filtered to one provider folder.
   *  Sorted by `lastModified` desc. Entries that don't fit the
   *  `<provider>/<file>` shape (e.g. stray `docs/orphan.md`) are skipped. */
  async list(provider?: string): Promise<DocSummary[]> {
    const metas = await this.handle.list();
    const out: DocSummary[] = [];
    for (const meta of metas) {
      if (!meta.path.startsWith(DIR)) continue;
      const rest = meta.path.slice(DIR.length);
      const slash = rest.indexOf('/');
      if (slash <= 0) continue;
      const providerId = rest.slice(0, slash);
      if (provider && provider !== providerId) continue;
      out.push({
        path: rest,
        providerId,
        size: meta.size,
        lastModified: meta.lastModified,
      });
    }
    out.sort((a, b) => b.lastModified - a.lastModified);
    return out;
  }

  /** Read by absolute-under-`docs/` path, e.g. `'gemini/notes.md'`. */
  async read(absPath: string): Promise<string | null> {
    validateAbsPath(absPath);
    return this.handle.readText(`${DIR}${absPath}`);
  }

  /** Write under the given provider's folder. `relPath` is relative to
   *  `docs/<provider>/`. Subdirectories are allowed. */
  async write(provider: string, relPath: string, content: string): Promise<void> {
    validateProvider(provider);
    validateRelPath(relPath);
    await this.handle.writeText(`${DIR}${provider}/${relPath}`, content);
  }

  /** Delete by absolute-under-`docs/` path. The path must start with
   *  `<provider>/`; cross-provider delete is refused. */
  async delete(provider: string, absPath: string): Promise<void> {
    validateProvider(provider);
    validateAbsPath(absPath);
    if (!absPath.startsWith(`${provider}/`)) {
      throw new Error(
        `ai.docs.delete: path '${absPath}' is outside provider folder '${provider}/'`,
      );
    }
    await this.handle.delete(`${DIR}${absPath}`);
  }
}

function validateProvider(provider: string): void {
  if (!provider) throw new Error('provider id is empty');
  if (provider.includes('/') || provider.includes('\\') || provider.includes('\0')) {
    throw new Error(`provider id '${provider}' contains illegal characters`);
  }
  if (provider === '.' || provider === '..') {
    throw new Error(`provider id '${provider}' is reserved`);
  }
}

function validateRelPath(relPath: string): void {
  if (!relPath) throw new Error('path is empty');
  if (relPath.startsWith('/')) throw new Error(`path '${relPath}' must not start with '/'`);
  if (relPath.includes('\0')) throw new Error('path contains NUL');
  for (const seg of relPath.split('/')) {
    if (seg === '' || seg === '.' || seg === '..') {
      throw new Error(`path '${relPath}' contains an illegal segment`);
    }
  }
}

function validateAbsPath(absPath: string): void {
  if (!absPath) throw new Error('path is empty');
  if (absPath.startsWith('/')) throw new Error(`path '${absPath}' must not start with '/'`);
  if (absPath.includes('\0')) throw new Error('path contains NUL');
  const segments = absPath.split('/');
  if (segments.length < 2) {
    throw new Error(
      `path '${absPath}' must include a provider segment, e.g. 'gemini/notes.md'`,
    );
  }
  for (const seg of segments) {
    if (seg === '' || seg === '.' || seg === '..') {
      throw new Error(`path '${absPath}' contains an illegal segment`);
    }
  }
}
