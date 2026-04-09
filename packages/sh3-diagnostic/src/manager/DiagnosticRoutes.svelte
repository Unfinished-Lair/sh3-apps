<script lang="ts">
  /*
   * Diagnostic routes view — lists all server API routes.
   *
   * Fetches the route table from GET /api/routes. GET routes render
   * as clickable links for quick testing of parameterless endpoints.
   */

  interface ApiRoute { method: string; path: string; }
  let routes: ApiRoute[] = $state([]);
  let error: string | null = $state(null);

  async function fetchRoutes() {
    try {
      const res = await fetch('/api/routes');
      if (!res.ok) { error = `${res.status}`; return; }
      routes = await res.json();
      error = null;
    } catch {
      error = 'unavailable';
    }
  }

  fetchRoutes();
</script>

<div class="diagnostic">
  <h2>API Routes</h2>

  {#if error}
    <p class="muted">Server not reachable or route introspection unavailable ({error}).</p>
  {:else}
    <p class="muted">{routes.length} unique routes</p>
    <ul>
      {#each routes as route}
        <li>
          <span class="method" class:get={route.method === 'GET'}>{route.method}</span>
          {#if route.method === 'GET'}
            <a href={route.path} target="_blank" rel="noopener">{route.path}</a>
          {:else}
            <span class="path">{route.path}</span>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
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
  .muted {
    color: var(--shell-fg-muted);
    margin: 0 0 8px;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    margin: 0;
    padding: 2px 0;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .method {
    min-width: 6ch;
    color: var(--shell-fg-muted);
    flex-shrink: 0;
  }
  .method.get {
    color: var(--shell-accent);
  }
  a {
    color: var(--shell-accent);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .path {
    color: var(--shell-fg);
  }
</style>
