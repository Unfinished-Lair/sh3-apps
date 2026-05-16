<script lang="ts">
  import { diagnosticContext } from '../diagnosticShard.svelte';

  interface ApiRoute { method: string; path: string; }

  // ── Data ─────────────────────────────────────────────────────────
  let routes: ApiRoute[]                   = $state([]);
  let fetchError: string | null            = $state(null);

  // ── Filters ───────────────────────────────────────────────────────
  let searchQuery: string                  = $state('');
  let methodFilter: Set<string>            = $state(new Set());  // empty = all
  let prefixFilter: string                 = $state('');         // '' = all
  let hideWildcards: boolean               = $state(true);

  // ── Test panel ────────────────────────────────────────────────────
  let urlTemplate: string                  = $state('');
  let paramValues: Record<string, string>  = $state({});
  let bodyInput: string                    = $state('');
  let lastStatus: string | null            = $state(null);
  let lastStatusOk: boolean                = $state(false);
  let responseBody: string | null          = $state(null);
  let isTesting: boolean                   = $state(false);
  const knownTenant = diagnosticContext.tenantId;
  let copiedFlash: boolean                 = $state(false);

  // ── Helpers ───────────────────────────────────────────────────────
  function routePrefix(path: string): string {
    const parts = path.split('/').filter(Boolean);
    const idx = parts[0]?.toLowerCase() === 'api' ? 1 : 0;
    return parts[idx] ?? '';
  }

  function extractParams(path: string): string[] {
    return [...path.matchAll(/:([a-zA-Z][a-zA-Z0-9_]*)/g)].map(m => m[1]);
  }

  // ── Derived ───────────────────────────────────────────────────────
  let allMethods = $derived(
    [...new Set(routes.map(r => r.method))].sort()
  );

  let allPrefixes = $derived(
    [...new Set(routes.map(r => routePrefix(r.path)))].filter(Boolean).sort()
  );

  let filteredRoutes = $derived(routes.filter(r => {
    if (methodFilter.size > 0 && !methodFilter.has(r.method)) return false;
    if (prefixFilter && routePrefix(r.path) !== prefixFilter) return false;
    if (searchQuery && !r.path.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (hideWildcards && r.path.includes('/:')) return false;
    return true;
  }));

  let currentParams = $derived(extractParams(urlTemplate));

  let resolvedUrl = $derived(
    currentParams.reduce(
      (u, p) => u.replace(`:${p}`, paramValues[p] || `:${p}`),
      urlTemplate
    )
  );

  // ── Filter actions ────────────────────────────────────────────────
  function toggleMethod(m: string) {
    const next = new Set(methodFilter);
    if (next.has(m)) next.delete(m); else next.add(m);
    methodFilter = next;
  }

  // ── Route selection ───────────────────────────────────────────────
  function selectRoute(route: ApiRoute) {
    urlTemplate = route.path;
    const params = extractParams(route.path);
    const next: Record<string, string> = {};
    for (const p of params) {
      if (p === 'tenant' && knownTenant) next[p] = knownTenant;
      else next[p] = paramValues[p] ?? '';
    }
    paramValues = next;
    lastStatus = null;
    copyResolved();
  }

  function copyResolved() {
    const full = window.location.origin + resolvedUrl;
    navigator.clipboard.writeText(full).then(() => {
      copiedFlash = true;
      setTimeout(() => { copiedFlash = false; }, 1200);
    }).catch(() => {});
  }

  // ── Send ──────────────────────────────────────────────────────────
  async function send(method: string) {
    if (!urlTemplate) return;
    isTesting = true;
    lastStatus = null;
    responseBody = null;
    try {
      const init: RequestInit = { method };
      if (['POST', 'PUT', 'PATCH'].includes(method) && bodyInput.trim()) {
        init.headers = { 'Content-Type': 'application/json' };
        init.body = bodyInput;
      }
      const res = await diagnosticContext.fetch(resolvedUrl, init);
      lastStatus = `${res.status} ${res.statusText || (res.ok ? 'OK' : 'Error')}`;
      lastStatusOk = res.ok;
      const text = await res.text();
      if (text) {
        try { responseBody = JSON.stringify(JSON.parse(text), null, 2); }
        catch { responseBody = text; }
      }
    } catch {
      lastStatus = 'network error';
      lastStatusOk = false;
    } finally {
      isTesting = false;
    }
  }

  // ── Data loading ──────────────────────────────────────────────────
  async function loadRoutes() {
    try {
      const res = await diagnosticContext.fetch('/api/routes');
      if (!res.ok) { fetchError = `${res.status}`; return; }
      routes = await res.json();
      fetchError = null;
    } catch {
      fetchError = 'unavailable';
    }
  }

  loadRoutes();

  function methodCls(m: string) {
    const map: Record<string, string> = { GET: 'get', POST: 'post', DELETE: 'del', PUT: 'put', PATCH: 'patch' };
    return map[m] ?? 'other';
  }

  function methodCount(m: string) {
    return routes.filter(r => r.method === m).length;
  }
</script>

<div class="diagnostic">

  <!-- ── Left column: route list ───────────────────────────────── -->
  <div class="route-list">

    <!-- Header -->
    <div class="col-header">
      API Routes
      {#if routes.length}
        <span class="badge">
          {filteredRoutes.length}{filteredRoutes.length !== routes.length ? `/${routes.length}` : ''}
        </span>
      {/if}
    </div>

    <!-- Filters -->
    {#if routes.length > 0}
      <div class="filters">
        <!-- Text search -->
        <input
          class="search-input"
          bind:value={searchQuery}
          placeholder="filter path…"
          spellcheck="false"
        />

        <!-- Method chips + wildcard toggle -->
        <div class="chips-row">
          <div class="method-chips">
            {#each allMethods as m}
              <button
                class="chip {methodCls(m)}"
                class:active={methodFilter.size === 0 || methodFilter.has(m)}
                onclick={() => toggleMethod(m)}
                title="{methodCount(m)} routes"
              >{m}</button>
            {/each}
          </div>
          <button
            class="toggle-btn"
            class:on={hideWildcards}
            onclick={() => { hideWildcards = !hideWildcards; }}
            title="Hide routes with parametric segments (/:param)"
          >/:*</button>
        </div>

        <!-- Prefix / shard selector -->
        {#if allPrefixes.length > 1}
          <select class="prefix-select" bind:value={prefixFilter}>
            <option value="">all sections</option>
            {#each allPrefixes as p}
              <option value={p}>{p}</option>
            {/each}
          </select>
        {/if}
      </div>
    {/if}

    <!-- Routes -->
    {#if fetchError}
      <p class="muted pad">Server unreachable ({fetchError}).</p>
    {:else}
      <ul>
        {#each filteredRoutes as route}
          <li
            role="button"
            tabindex="0"
            class:active={urlTemplate === route.path}
            onclick={() => selectRoute(route)}
            onkeydown={e => e.key === 'Enter' && selectRoute(route)}
          >
            <span class="method {methodCls(route.method)}">{route.method}</span>
            <span class="rpath">{route.path}</span>
          </li>
        {/each}
        {#if filteredRoutes.length === 0}
          <li class="empty">no matches</li>
        {/if}
      </ul>
    {/if}
  </div>

  <!-- ── Right column: test panel ──────────────────────────────── -->
  <div class="test-panel">
    <div class="col-header">Test</div>

    {#if urlTemplate}
      <!-- URL row -->
      <div class="section">
        <label class="field-label">URL</label>
        <div class="url-row">
          <input class="url-input" bind:value={urlTemplate} spellcheck="false" />
          <button
            class="copy-btn"
            class:flashed={copiedFlash}
            onclick={copyResolved}
            title="Copy resolved URL to clipboard"
          >{copiedFlash ? '✓' : '⎘'}</button>
        </div>
        {#if resolvedUrl !== urlTemplate}
          <div class="resolved">{resolvedUrl}</div>
        {/if}
      </div>

      <!-- Parameters -->
      {#if currentParams.length > 0}
        <div class="section">
          <span class="field-label">Parameters</span>
          {#each currentParams as param}
            <div class="param-row">
              <span class="param-name">:{param}</span>
              <input class="param-input" bind:value={paramValues[param]} placeholder={param} />
              {#if param === 'tenant' && knownTenant && !paramValues[param]}
                <button
                  class="autofill-btn"
                  onclick={() => { paramValues[param] = knownTenant; }}
                  title="Auto-fill from tenant list"
                >{knownTenant}</button>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      <!-- Body -->
      <div class="section body-section">
        <span class="field-label">Body <span class="muted">(POST / PUT)</span></span>
        <textarea
          class="body-input"
          bind:value={bodyInput}
          placeholder={'{"key": "value"}'}
          rows={5}
          spellcheck="false"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="action-row">
        <button class="btn get"  onclick={() => send('GET')}    disabled={isTesting}>GET</button>
        <button class="btn post" onclick={() => send('POST')}   disabled={isTesting}>POST</button>
        <button class="btn del"  onclick={() => send('DELETE')} disabled={isTesting}>DELETE</button>
        {#if lastStatus}
          <span class="status" class:ok={lastStatusOk} class:err={!lastStatusOk}>{lastStatus}</span>
        {/if}
      </div>

      <!-- Response body -->
      {#if responseBody !== null}
        <div class="section response-section">
          <span class="field-label">Response</span>
          <pre class="response-body">{responseBody}</pre>
        </div>
      {/if}
    {:else}
      <p class="muted pad">Click a route to test it.</p>
    {/if}
  </div>

</div>

<style>
  /* ── Layout ───────────────────────────────────────────────────── */
  .diagnostic {
    position: absolute;
    inset: 0;
    display: flex;
    background: var(--sh3-grad-bg, var(--sh3-bg));
    color: var(--sh3-fg);
    font-family: var(--sh3-font-mono, ui-monospace, monospace);
    font-size: 12px;
    overflow: hidden;
  }

  .route-list {
    width: 42%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--sh3-border);
    overflow: hidden;
  }

  .test-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding-bottom: 12px;
  }

  /* ── Column headers ───────────────────────────────────────────── */
  .col-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--sh3-accent);
    border-bottom: 1px solid var(--sh3-border);
  }

  .badge {
    font-size: 10px;
    font-weight: 400;
    color: var(--sh3-fg-muted);
    letter-spacing: 0;
    text-transform: none;
  }

  /* ── Filters ──────────────────────────────────────────────────── */
  .filters {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 7px 10px;
    border-bottom: 1px solid var(--sh3-border);
    background: var(--sh3-bg-sunken, var(--sh3-bg));
  }

  .search-input {
    width: 100%;
    box-sizing: border-box;
    background: var(--sh3-input-bg, var(--sh3-bg-elevated));
    border: 1px solid var(--sh3-border);
    border-radius: 3px;
    color: var(--sh3-fg);
    font: inherit;
    font-size: 11px;
    padding: 3px 7px;
    outline: none;
  }

  .search-input:focus {
    border-color: var(--sh3-input-border-focus, var(--sh3-accent));
  }

  .chips-row {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .method-chips {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  }

  .toggle-btn {
    flex-shrink: 0;
    padding: 1px 6px;
    border-radius: 3px;
    border: 1px solid var(--sh3-border);
    background: transparent;
    color: var(--sh3-fg-subtle);
    font: inherit;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    opacity: 0.45;
    transition: opacity 80ms, color 80ms, border-color 80ms, background 80ms;
  }

  .toggle-btn.on {
    opacity: 1;
    color: var(--sh3-warning);
    border-color: color-mix(in srgb, var(--sh3-warning) 45%, transparent);
    background: color-mix(in srgb, var(--sh3-warning) 10%, transparent);
  }

  .chip {
    padding: 1px 6px;
    border-radius: 3px;
    border: 1px solid transparent;
    font: inherit;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    opacity: 0.35;
    transition: opacity 80ms;
  }

  .chip.active { opacity: 1; }
  .chip.get    { color: var(--sh3-accent);  border-color: color-mix(in srgb, var(--sh3-accent)  40%, transparent); background: color-mix(in srgb, var(--sh3-accent)  10%, transparent); }
  .chip.post   { color: var(--sh3-success); border-color: color-mix(in srgb, var(--sh3-success) 40%, transparent); background: color-mix(in srgb, var(--sh3-success) 10%, transparent); }
  .chip.del    { color: var(--sh3-error);   border-color: color-mix(in srgb, var(--sh3-error)   40%, transparent); background: color-mix(in srgb, var(--sh3-error)   10%, transparent); }
  .chip.put,
  .chip.patch  { color: var(--sh3-warning); border-color: color-mix(in srgb, var(--sh3-warning) 40%, transparent); background: color-mix(in srgb, var(--sh3-warning) 10%, transparent); }
  .chip.other  { color: var(--sh3-fg-muted); border-color: var(--sh3-border); background: transparent; }

  .prefix-select {
    width: 100%;
    box-sizing: border-box;
    background: var(--sh3-input-bg, var(--sh3-bg-elevated));
    border: 1px solid var(--sh3-border);
    border-radius: 3px;
    color: var(--sh3-fg);
    font: inherit;
    font-size: 11px;
    padding: 2px 6px;
    outline: none;
    cursor: pointer;
  }

  .prefix-select:focus {
    border-color: var(--sh3-input-border-focus, var(--sh3-accent));
  }

  /* ── Route list ───────────────────────────────────────────────── */
  ul {
    flex: 1;
    overflow-y: auto;
    margin: 0;
    padding: 4px 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 3px 12px;
    cursor: pointer;
    transition: background 80ms;
  }

  li:hover { background: var(--sh3-bg-elevated); }
  li.active { background: color-mix(in srgb, var(--sh3-accent) 12%, transparent); }

  li.empty {
    cursor: default;
    color: var(--sh3-fg-subtle);
    font-size: 11px;
    padding: 8px 12px;
  }

  .method {
    flex-shrink: 0;
    min-width: 7ch;
    font-weight: 600;
    font-size: 11px;
    color: var(--sh3-fg-muted);
  }

  .method.get   { color: var(--sh3-accent); }
  .method.post  { color: var(--sh3-success); }
  .method.del   { color: var(--sh3-error); }
  .method.put   { color: var(--sh3-warning); }
  .method.patch { color: var(--sh3-warning); }

  .rpath {
    color: var(--sh3-fg);
    word-break: break-all;
  }

  /* ── Test panel sections ──────────────────────────────────────── */
  .section {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 14px 0;
  }

  .body-section { flex: 1; }

  .field-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--sh3-fg-muted);
    margin-bottom: 2px;
  }

  /* ── URL row ──────────────────────────────────────────────────── */
  .url-row {
    display: flex;
    gap: 4px;
  }

  .url-input {
    flex: 1;
    min-width: 0;
    background: var(--sh3-input-bg, var(--sh3-bg-sunken));
    border: 1px solid var(--sh3-border);
    border-radius: 3px;
    color: var(--sh3-fg);
    font: inherit;
    padding: 3px 6px;
    outline: none;
  }

  .url-input:focus { border-color: var(--sh3-input-border-focus, var(--sh3-accent)); }

  .copy-btn {
    flex-shrink: 0;
    padding: 3px 7px;
    background: var(--sh3-bg-elevated);
    border: 1px solid var(--sh3-border);
    border-radius: 3px;
    color: var(--sh3-fg-muted);
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    transition: color 80ms, border-color 80ms;
  }

  .copy-btn:hover { color: var(--sh3-fg); }
  .copy-btn.flashed { color: var(--sh3-success); border-color: var(--sh3-success); }

  .resolved {
    font-size: 11px;
    color: var(--sh3-accent);
    opacity: 0.75;
    padding: 1px 2px;
    word-break: break-all;
  }

  /* ── Params ───────────────────────────────────────────────────── */
  .param-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .param-name {
    flex-shrink: 0;
    min-width: 10ch;
    color: var(--sh3-fg-muted);
    font-size: 11px;
  }

  .param-input {
    flex: 1;
    min-width: 0;
    background: var(--sh3-input-bg, var(--sh3-bg-sunken));
    border: 1px solid var(--sh3-border);
    border-radius: 3px;
    color: var(--sh3-fg);
    font: inherit;
    padding: 3px 6px;
    outline: none;
  }

  .param-input:focus { border-color: var(--sh3-input-border-focus, var(--sh3-accent)); }

  .autofill-btn {
    flex-shrink: 0;
    max-width: 14ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 2px 6px;
    background: color-mix(in srgb, var(--sh3-accent) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--sh3-accent) 40%, transparent);
    border-radius: 3px;
    color: var(--sh3-accent);
    cursor: pointer;
    font: inherit;
    font-size: 10px;
    transition: background 80ms;
  }

  .autofill-btn:hover { background: color-mix(in srgb, var(--sh3-accent) 25%, transparent); }

  /* ── Body ─────────────────────────────────────────────────────── */
  .body-input {
    resize: vertical;
    background: var(--sh3-input-bg, var(--sh3-bg-sunken));
    border: 1px solid var(--sh3-border);
    border-radius: 3px;
    color: var(--sh3-fg);
    font: inherit;
    padding: 5px 7px;
    outline: none;
    min-height: 68px;
  }

  .body-input:focus { border-color: var(--sh3-input-border-focus, var(--sh3-accent)); }

  /* ── Action row ───────────────────────────────────────────────── */
  .action-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px 0;
    flex-wrap: wrap;
  }

  .btn {
    padding: 4px 12px;
    border-radius: 3px;
    border: 1px solid;
    font: inherit;
    font-weight: 600;
    font-size: 11px;
    cursor: pointer;
    transition: opacity 80ms;
  }

  .btn:disabled { opacity: 0.45; cursor: default; }

  .btn.get  { background: color-mix(in srgb, var(--sh3-accent)  15%, transparent); border-color: color-mix(in srgb, var(--sh3-accent)  45%, transparent); color: var(--sh3-accent); }
  .btn.post { background: color-mix(in srgb, var(--sh3-success) 15%, transparent); border-color: color-mix(in srgb, var(--sh3-success) 45%, transparent); color: var(--sh3-success); }
  .btn.del  { background: color-mix(in srgb, var(--sh3-error)   15%, transparent); border-color: color-mix(in srgb, var(--sh3-error)   45%, transparent); color: var(--sh3-error); }

  .btn.get:not(:disabled):hover  { background: color-mix(in srgb, var(--sh3-accent)  25%, transparent); }
  .btn.post:not(:disabled):hover { background: color-mix(in srgb, var(--sh3-success) 25%, transparent); }
  .btn.del:not(:disabled):hover  { background: color-mix(in srgb, var(--sh3-error)   25%, transparent); }

  .status {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 3px;
  }

  .status.ok  { color: var(--sh3-success); background: color-mix(in srgb, var(--sh3-success) 12%, transparent); }
  .status.err { color: var(--sh3-error);   background: color-mix(in srgb, var(--sh3-error)   12%, transparent); }

  /* ── Response body ───────────────────────────────────────────── */
  .response-section { flex: 1; }

  .response-body {
    margin: 0;
    padding: 7px 9px;
    background: var(--sh3-bg-sunken, var(--sh3-bg));
    border: 1px solid var(--sh3-border);
    border-radius: 3px;
    color: var(--sh3-fg);
    font: inherit;
    font-size: 11px;
    overflow: auto;
    max-height: 280px;
    white-space: pre-wrap;
    word-break: break-all;
  }

  /* ── Misc ─────────────────────────────────────────────────────── */
  .muted { color: var(--sh3-fg-muted); }
  .pad   { padding: 10px 12px; margin: 0; }
</style>
