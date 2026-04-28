<script lang="ts">
  import type { DomainListing } from '../domain/registry';

  interface Props {
    domains: DomainListing[];
  }
  const { domains }: Props = $props();
</script>

<div class="graph-empty">
  <h2>No graph open</h2>
  <p class="hint">
    A consumer shard binds a graph by registering a <code>GraphViewDescriptor</code>
    at <code>sh3-editor.graph-view</code>.
  </p>

  {#if domains.length > 0}
    <h3>Registered domains</h3>
    <ul class="domain-list">
      {#each domains as d (d.id)}
        <li><code>{d.id}</code><span class="dash">—</span><span class="label">{d.label}</span></li>
      {/each}
    </ul>
  {:else}
    <p class="warn">
      No graph domains registered. Install or activate a shard that provides one.
    </p>
  {/if}
</div>

<style>
  .graph-empty {
    padding: 1.5rem;
    color: var(--sh3-text-secondary, #888);
    font-family: var(--sh3-font-ui, system-ui);
  }
  h2 { margin: 0 0 0.5rem 0; color: var(--sh3-text-primary, #ddd); }
  h3 { margin: 1.5rem 0 0.5rem 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.06em; }
  .hint { margin: 0 0 0.5rem 0; }
  .domain-list { list-style: none; padding: 0; margin: 0; }
  .domain-list li { padding: 0.25rem 0; font-size: 0.9rem; }
  .domain-list code { color: var(--sh3-text-primary, #ddd); }
  .dash { margin: 0 0.5em; opacity: 0.6; }
  .label { color: var(--sh3-text-secondary, #aaa); }
  .warn { color: var(--sh3-warn, #d6a13a); }
</style>
