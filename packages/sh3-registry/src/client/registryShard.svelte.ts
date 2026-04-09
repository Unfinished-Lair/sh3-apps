/*
 * sh3-registry client shard — manages a remote SH3 package registry.
 *
 * Contributes one view:
 *   - `sh3-registry:manage` — package list, publish, edit, update, delete
 *
 * Installed from a registry or pre-included. Talks to its server
 * counterpart mounted at `/api/sh3-registry/`.
 *
 * `.svelte.ts` because mounting Svelte components requires rune access.
 */

import { mount, unmount } from 'svelte';
import RegistryView from './RegistryView.svelte';
import { getAuthHeader } from 'sh3-core';
import type { Shard, ViewFactory, ViewHandle, MountContext, ShardContext } from 'sh3-core';
import type { StateZones } from 'sh3-core';

/** Registry package shape from the server's registry.json. */
export interface RegistryPackage {
  id: string;
  type: 'shard' | 'app';
  label: string;
  description: string;
  author: { name: string };
  versions: Array<{
    version: string;
    contractVersion: string;
    bundleUrl: string;
    integrity: string;
  }>;
}

/** Schema shape for state zone typing. */
interface RegistryZoneSchema {
  ephemeral: {
    packages: RegistryPackage[];
    loading: boolean;
    error: string | null;
  };
}

/** Reactive context exposed to the view component. */
export interface RegistryContext {
  state: StateZones<RegistryZoneSchema>;
  refreshPackages(): Promise<void>;
  publishPackage(form: FormData): Promise<void>;
  patchPackage(id: string, fields: { label?: string; description?: string; author?: string }): Promise<void>;
  deletePackage(id: string): Promise<void>;
}

/**
 * Module-level context set during activate(). Imported by the Svelte
 * view component so it can read/write state and trigger actions.
 */
export let registryContext: RegistryContext = undefined!;

/** Build fetch headers with auth. */
function authHeaders(contentType?: string): Record<string, string> {
  const auth = getAuthHeader();
  const headers: Record<string, string> = {};
  if (auth) headers['Authorization'] = auth;
  if (contentType) headers['Content-Type'] = contentType;
  return headers;
}

/** Server shard API prefix. */
const apiBase = '/api/sh3-registry';

export const registryShard: Shard = {
  manifest: {
    id: 'sh3-registry',
    label: 'Registry Manager',
    version: '0.1.2',
    views: [
      { id: 'sh3-registry:manage', label: 'Registry' },
    ],
    serverBundle: 'sh3-registry-server.js',
  },

  activate(ctx: ShardContext) {
    const state = ctx.state<RegistryZoneSchema>({
      ephemeral: {
        packages: [] as RegistryPackage[],
        loading: false,
        error: null as string | null,
      },
    });

    async function refreshPackages(): Promise<void> {
      state.ephemeral.loading = true;
      state.ephemeral.error = null;
      try {
        const res = await fetch(`${apiBase}/registry.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        state.ephemeral.packages = data.packages ?? [];
      } catch (err) {
        state.ephemeral.error = err instanceof Error ? err.message : String(err);
      } finally {
        state.ephemeral.loading = false;
      }
    }

    async function publishPackage(form: FormData): Promise<void> {
      const res = await fetch(`${apiBase}/publish`, {
        method: 'POST',
        headers: authHeaders(),
        body: form,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      await refreshPackages();
    }

    async function patchPackage(
      id: string,
      fields: { label?: string; description?: string; author?: string },
    ): Promise<void> {
      const res = await fetch(`${apiBase}/packages/${id}`, {
        method: 'PATCH',
        headers: authHeaders('application/json'),
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      await refreshPackages();
    }

    async function deletePackage(id: string): Promise<void> {
      const res = await fetch(`${apiBase}/packages/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      await refreshPackages();
    }

    registryContext = { state, refreshPackages, publishPackage, patchPackage, deletePackage };

    const manageFactory: ViewFactory = {
      mount(container: HTMLElement, _context: MountContext): ViewHandle {
        const instance = mount(RegistryView, { target: container });
        void refreshPackages();
        return {
          unmount() {
            unmount(instance);
          },
        };
      },
    };

    ctx.registerView('sh3-registry:manage', manageFactory);
  },

  autostart() {
    // Self-starting so the view is available from the launcher.
  },
};
