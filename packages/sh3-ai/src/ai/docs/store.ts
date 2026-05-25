import type { DocumentHandle } from 'sh3-core';
import type { DocSummary } from './types';

const DIR = 'docs/';

/** CRUD wrapper around the sh3-ai DocumentHandle, scoped to the
 *  `docs/<providerId>/...` namespace. Reads span every provider folder;
 *  writes and deletes are partitioned by provider id.
 *
 *  sh3-core 0.26: every path passed to / returned from the handle is
 *  scope-rooted (`<boundId>/<rest>`). The store hides that detail and
 *  continues to expose `<provider>/<file>`-style paths externally. */
export class DocsStore {
  constructor(private readonly handle: DocumentHandle) {}

  /** Internal: prepend the active boundId to a `docs/...` tail. */
  private rooted(tail: string): string {
    return `${this.handle.boundId}/${tail}`;
  }

  /** List docs under `docs/`, optionally filtered to one provider folder.
   *  Sorted by `lastModified` desc. Entries that don't fit the
   *  `<provider>/<file>` shape (e.g. stray `docs/orphan.md`) are skipped. */
  async list(provider?: string): Promise<DocSummary[]> {
    const metas = await this.handle.list();
    const prefix = this.rooted(DIR);
    const out: DocSummary[] = [];
    for (const meta of metas) {
      if (!meta.path.startsWith(prefix)) continue;
      const rest = meta.path.slice(prefix.length);
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
    return this.handle.readText(this.rooted(`${DIR}${absPath}`));
  }

  /** Write under the given provider's folder. `relPath` is relative to
   *  `docs/<provider>/`. Subdirectories are allowed. */
  async write(provider: string, relPath: string, content: string): Promise<void> {
    validateProvider(provider);
    validateRelPath(relPath);
    await this.handle.writeText(this.rooted(`${DIR}${provider}/${relPath}`), content);
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
    await this.handle.delete(this.rooted(`${DIR}${absPath}`));
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
