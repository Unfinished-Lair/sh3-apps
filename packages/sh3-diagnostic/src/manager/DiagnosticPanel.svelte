<script lang="ts">
  /*
   * Diagnostic panel — framework introspection view.
   *
   * Shows:
   *   - Registered shards (id, version, view count)
   *   - Active shards (id)
   *   - Active app (id) or "none"
   *   - Active layout source (home vs app)
   *
   * Reads through the public sh3 API surface only.
   */

  import { onMount } from 'svelte';
  import {
    listRegisteredApps,
    getActiveApp,
    inspectActiveLayout,
    registeredShards,
    activeShards,
  } from 'sh3-core';

  const apps = $derived(listRegisteredApps());
  const active = $derived(getActiveApp());
  const layout = $derived(inspectActiveLayout());
  const regShards = $derived(Array.from(registeredShards.values()));
  const actShards = $derived(Array.from(activeShards.keys()));

  let serverVersion = $state<string | null>(null);

  onMount(async () => {
    try {
      const res = await fetch('/api/version');
      if (res.ok) {
        const data = await res.json();
        serverVersion = data.version;
      }
    } catch {
      // Server unreachable — leave null.
    }
  });

</script>

<div class="diagnostic">
  <h2>Diagnostic</h2>

  <section>
    <h3>Server version</h3>
    <p>{serverVersion ?? '—'}</p>
  </section>

  <section>
    <h3>Active app</h3>
    <p>{active ? `${active.label} (${active.id})` : 'none'}</p>
  </section>

  <section>
    <h3>Layout source</h3>
    <p>{layout.source}</p>
  </section>

  <section>
    <h3>Registered shards ({regShards.length})</h3>
    <ul>
      {#each regShards as shard (shard.manifest.id)}
        <li>
          {shard.manifest.label} — {shard.manifest.id} — v{shard.manifest.version}
          — {shard.manifest.views.length} views
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h3>Active shards ({actShards.length})</h3>
    <ul>
      {#each actShards as id (id)}
        <li>{id}</li>
      {/each}
    </ul>
  </section>

  <section>
    <h3>Registered apps ({apps.length})</h3>
    <ul>
      {#each apps as manifest (manifest.id)}
        <li>{manifest.label} — {manifest.id} — v{manifest.version}</li>
      {/each}
    </ul>
  </section>

</div>

<style>
  .diagnostic {
    position: absolute;
    inset: 0;
    padding: 12px 16px;
    overflow: auto;
    background: var(--shell-grad-bg, var(--shell-bg));
    color: var(--shell-fg);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
  }
  h2 {
    margin: 0 0 12px;
    color: var(--shell-accent);
    font-size: 14px;
  }
  h3 {
    margin: 12px 0 4px;
    color: var(--shell-fg-muted);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  p, li {
    margin: 0;
  }
  ul {
    margin: 0;
    padding-left: 16px;
  }
  section {
    margin-bottom: 8px;
  }
</style>
