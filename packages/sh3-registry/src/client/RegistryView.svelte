<script lang="ts">
  /*
   * RegistryView — single view for the registry manager shard.
   *
   * Sections: header, collapsible publish form, package card list with
   * inline edit/update/delete actions, empty state, error banner.
   */

  import { registryContext, type RegistryPackage } from './registryShard.svelte';

  const ctx = registryContext;

  // ---- Publish form state ----
  let publishFiles = $state<FileList | null>(null);
  let publishManifest = $state<Record<string, any> | null>(null);
  let publishing = $state(false);
  let publishError = $state<string | null>(null);
  let publishSuccess = $state(false);
  let publishDetailsOpen = $state(false);

  // ---- Card action state ----
  let expandedAction = $state<string | null>(null);

  // ---- Edit form state ----
  let editLabel = $state('');
  let editDesc = $state('');
  let editAuthor = $state('');
  let editSaving = $state(false);
  let editError = $state<string | null>(null);

  // ---- Update form state ----
  let updateFiles = $state<FileList | null>(null);
  let updateManifest = $state<Record<string, any> | null>(null);
  let updatePublishing = $state(false);
  let updateError = $state<string | null>(null);

  // ---- Delete state ----
  let deleteInProgress = $state(false);
  let deleteError = $state<string | null>(null);

  // ---- Artifact file helpers ----
  function findFile(files: FileList, name: string): File | undefined {
    for (const f of files) {
      if (f.name === name) return f;
    }
  }

  async function readManifestFromFiles(files: FileList): Promise<Record<string, any> | null> {
    const manifestFile = findFile(files, 'manifest.json');
    if (!manifestFile) return null;
    try {
      return JSON.parse(await manifestFile.text());
    } catch {
      return null;
    }
  }

  // ---- Publish handlers ----
  async function onPublishFilesSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    publishFiles = input.files;
    publishError = null;
    if (publishFiles?.length) {
      const m = await readManifestFromFiles(publishFiles);
      if (m) {
        publishManifest = m;
      } else {
        publishManifest = null;
        publishError = 'No valid manifest.json found in selection';
      }
    } else {
      publishManifest = null;
    }
  }

  async function handlePublish() {
    if (!publishFiles || !publishManifest) return;
    publishing = true;
    publishError = null;
    publishSuccess = false;

    try {
      const form = new FormData();
      const manifestFile = findFile(publishFiles, 'manifest.json');
      const clientFile = findFile(publishFiles, 'client.js');
      const serverFile = findFile(publishFiles, 'server.js');
      if (manifestFile) form.append('manifest', manifestFile);
      if (clientFile) form.append('client', clientFile);
      if (serverFile) form.append('server', serverFile);

      await ctx.publishPackage(form);

      publishFiles = null;
      publishManifest = null;
      publishSuccess = true;
      publishDetailsOpen = false;
    } catch (err) {
      publishError = err instanceof Error ? err.message : String(err);
    } finally {
      publishing = false;
    }
  }

  // ---- Edit handlers ----
  function startEdit(pkg: RegistryPackage) {
    expandedAction = `edit:${pkg.id}`;
    editLabel = pkg.label;
    editDesc = pkg.description;
    editAuthor = pkg.author.name;
    editError = null;
  }

  async function handleEditSave(pkgId: string) {
    editSaving = true;
    editError = null;
    try {
      await ctx.patchPackage(pkgId, {
        label: editLabel,
        description: editDesc,
        author: editAuthor,
      });
      expandedAction = null;
    } catch (err) {
      editError = err instanceof Error ? err.message : String(err);
    } finally {
      editSaving = false;
    }
  }

  // ---- Update handlers ----
  function startUpdate(pkg: RegistryPackage) {
    expandedAction = `update:${pkg.id}`;
    updateFiles = null;
    updateManifest = null;
    updateError = null;
  }

  async function onUpdateFilesSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    updateFiles = input.files;
    updateError = null;
    if (updateFiles?.length) {
      const m = await readManifestFromFiles(updateFiles);
      if (m) {
        updateManifest = m;
      } else {
        updateManifest = null;
        updateError = 'No valid manifest.json found in selection';
      }
    } else {
      updateManifest = null;
    }
  }

  async function handleUpdatePublish() {
    if (!updateFiles || !updateManifest) return;
    updatePublishing = true;
    updateError = null;
    try {
      const form = new FormData();
      const manifestFile = findFile(updateFiles, 'manifest.json');
      const clientFile = findFile(updateFiles, 'client.js');
      const serverFile = findFile(updateFiles, 'server.js');
      if (manifestFile) form.append('manifest', manifestFile);
      if (clientFile) form.append('client', clientFile);
      if (serverFile) form.append('server', serverFile);

      await ctx.publishPackage(form);
      expandedAction = null;
    } catch (err) {
      updateError = err instanceof Error ? err.message : String(err);
    } finally {
      updatePublishing = false;
    }
  }

  // ---- Delete handlers ----
  function startDelete(pkgId: string) {
    expandedAction = `delete:${pkgId}`;
    deleteError = null;
  }

  async function handleDeleteConfirm(pkgId: string) {
    deleteInProgress = true;
    deleteError = null;
    try {
      await ctx.deletePackage(pkgId);
      expandedAction = null;
    } catch (err) {
      deleteError = err instanceof Error ? err.message : String(err);
    } finally {
      deleteInProgress = false;
    }
  }

  function cancelAction() {
    expandedAction = null;
  }
</script>

<div class="reg-view">
  <!-- Header -->
  <header class="reg-header">
    <h2>Registry Manager</h2>
    <button
      class="reg-refresh-btn"
      onclick={() => ctx.refreshPackages()}
      disabled={ctx.state.ephemeral.loading}
    >
      {ctx.state.ephemeral.loading ? 'Loading...' : 'Refresh'}
    </button>
  </header>

  <!-- Global error -->
  {#if ctx.state.ephemeral.error}
    <div class="reg-error">{ctx.state.ephemeral.error}</div>
  {/if}

  <!-- Publish success -->
  {#if publishSuccess}
    <div class="reg-success">Package published successfully.</div>
  {/if}

  <!-- Publish New (collapsible) -->
  <details class="reg-publish-section" bind:open={publishDetailsOpen}>
    <summary>Publish New Package</summary>
    <div class="reg-publish-form">
      <div class="reg-form-row">
        <input type="file" multiple accept=".json,.js" onchange={onPublishFilesSelect} class="reg-input" />
        <button
          class="reg-btn reg-btn-primary"
          onclick={handlePublish}
          disabled={publishing || !publishManifest}
        >
          {publishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
      <div class="reg-hint">Select artifact files: manifest.json (required), client.js, server.js</div>
      {#if publishManifest}
        <div class="reg-manifest-preview">
          <span class="reg-badge" class:badge-shard={publishManifest.type === 'shard'} class:badge-app={publishManifest.type === 'app'} class:badge-combo={publishManifest.type === 'combo'}>
            {publishManifest.type}
          </span>
          <strong>{publishManifest.label ?? publishManifest.id}</strong>
          v{publishManifest.version}
          {#if publishManifest.description}
            <span class="reg-preview-desc">— {publishManifest.description}</span>
          {/if}
        </div>
      {/if}
      {#if publishError}
        <div class="reg-error">{publishError}</div>
      {/if}
    </div>
  </details>

  <!-- Package list -->
  {#if !ctx.state.ephemeral.loading && ctx.state.ephemeral.packages.length === 0}
    <div class="reg-empty">No packages published.</div>
  {:else}
    <div class="reg-list">
      {#each ctx.state.ephemeral.packages as pkg (pkg.id)}
        <div class="reg-card">
          <div class="reg-card-body">
            <div class="reg-card-title">
              <span class="reg-card-label">{pkg.label}</span>
              <span class="reg-badge" class:badge-shard={pkg.type === 'shard'} class:badge-app={pkg.type === 'app'}>
                {pkg.type}
              </span>
              <span class="reg-card-meta">
                v{pkg.versions[0]?.version} &middot; {pkg.versions.length} version{pkg.versions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div class="reg-card-desc">{pkg.description}</div>
            <div class="reg-card-author">by {pkg.author.name} &middot; id: {pkg.id}</div>
          </div>

          {#if !expandedAction?.endsWith(`:${pkg.id}`)}
            <div class="reg-card-actions">
              <button class="reg-btn reg-btn-secondary" onclick={() => startEdit(pkg)}>Edit</button>
              <button class="reg-btn reg-btn-secondary" onclick={() => startUpdate(pkg)}>Update</button>
              <button class="reg-btn reg-btn-danger" onclick={() => startDelete(pkg.id)}>Delete</button>
            </div>
          {/if}

          {#if expandedAction === `edit:${pkg.id}`}
            <div class="reg-inline-form">
              <input bind:value={editLabel} placeholder="Label" class="reg-input" />
              <input bind:value={editDesc} placeholder="Description" class="reg-input" />
              <input bind:value={editAuthor} placeholder="Author" class="reg-input" />
              {#if editError}
                <div class="reg-error">{editError}</div>
              {/if}
              <div class="reg-form-row">
                <button class="reg-btn reg-btn-primary" onclick={() => handleEditSave(pkg.id)} disabled={editSaving}>
                  {editSaving ? 'Saving...' : 'Save'}
                </button>
                <button class="reg-btn reg-btn-secondary" onclick={cancelAction}>Cancel</button>
              </div>
            </div>
          {/if}

          {#if expandedAction === `update:${pkg.id}`}
            <div class="reg-inline-form">
              <div class="reg-form-row">
                <input type="file" multiple accept=".json,.js" onchange={onUpdateFilesSelect} class="reg-input" />
                <button
                  class="reg-btn reg-btn-primary"
                  onclick={handleUpdatePublish}
                  disabled={updatePublishing || !updateManifest}
                >
                  {updatePublishing ? 'Publishing...' : 'Publish Update'}
                </button>
                <button class="reg-btn reg-btn-secondary" onclick={cancelAction}>Cancel</button>
              </div>
              <div class="reg-hint">Select artifact files: manifest.json (required), client.js, server.js</div>
              {#if updateManifest}
                <div class="reg-manifest-preview">
                  <span class="reg-badge" class:badge-shard={updateManifest.type === 'shard'} class:badge-app={updateManifest.type === 'app'} class:badge-combo={updateManifest.type === 'combo'}>
                    {updateManifest.type}
                  </span>
                  <strong>{updateManifest.label ?? updateManifest.id}</strong>
                  v{updateManifest.version}
                </div>
              {/if}
              {#if updateError}
                <div class="reg-error">{updateError}</div>
              {/if}
            </div>
          {/if}

          {#if expandedAction === `delete:${pkg.id}`}
            <div class="reg-inline-form reg-delete-confirm">
              <span>Delete <strong>{pkg.label}</strong>?</span>
              {#if deleteError}
                <div class="reg-error">{deleteError}</div>
              {/if}
              <div class="reg-form-row">
                <button
                  class="reg-btn reg-btn-danger"
                  onclick={() => handleDeleteConfirm(pkg.id)}
                  disabled={deleteInProgress}
                >
                  {deleteInProgress ? 'Deleting...' : 'Confirm'}
                </button>
                <button class="reg-btn reg-btn-secondary" onclick={cancelAction}>Cancel</button>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .reg-view {
    font-family: var(--shell-font-ui);
    color: var(--shell-fg, #e0e0e0);
    background: var(--shell-bg, #1e1e1e);
    padding: 16px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .reg-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .reg-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  .reg-refresh-btn {
    padding: 6px 14px;
    background: var(--shell-accent, #007acc);
    color: #fff;
    border: none;
    border-radius: var(--shell-radius);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.875rem;
  }
  .reg-refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .reg-error {
    padding: 8px 12px;
    margin-bottom: 12px;
    background: color-mix(in srgb, var(--shell-error, #d32f2f) 15%, transparent);
    color: var(--shell-error, #d32f2f);
    border: 1px solid var(--shell-error, #d32f2f);
    border-radius: var(--shell-radius);
    font-size: 0.8125rem;
  }
  .reg-success {
    padding: 8px 12px;
    margin-bottom: 12px;
    background: color-mix(in srgb, var(--shell-success, #4caf50) 15%, transparent);
    color: var(--shell-success, #4caf50);
    border: 1px solid var(--shell-success, #4caf50);
    border-radius: var(--shell-radius);
    font-size: 0.8125rem;
  }
  .reg-publish-section {
    padding: 8px 12px;
    border: 1px solid var(--shell-border, #444);
    border-radius: var(--shell-radius-md);
    margin-bottom: 16px;
    font-size: 0.875rem;
  }
  .reg-publish-section summary {
    cursor: pointer;
    font-weight: 500;
    padding: 4px 0;
  }
  .reg-publish-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
  }
  .reg-form-row {
    display: flex;
    gap: 8px;
  }
  .reg-input {
    flex: 1;
    padding: 6px 10px;
    background: var(--shell-input-bg, #2a2a2a);
    color: var(--shell-fg, #e0e0e0);
    border: 1px solid var(--shell-border, #444);
    border-radius: var(--shell-radius);
    font-family: inherit;
    font-size: 0.8125rem;
  }
  .reg-input:disabled {
    opacity: 0.5;
  }
  .reg-input::placeholder {
    color: var(--shell-fg-muted, #888);
  }
  .reg-btn {
    padding: 6px 14px;
    border: none;
    border-radius: var(--shell-radius);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    white-space: nowrap;
  }
  .reg-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .reg-btn-primary {
    background: var(--shell-accent, #007acc);
    color: #fff;
  }
  .reg-btn-secondary {
    background: var(--shell-input-bg, #2a2a2a);
    color: var(--shell-fg, #e0e0e0);
    border: 1px solid var(--shell-border, #444);
  }
  .reg-btn-danger {
    background: transparent;
    color: var(--shell-error, #d32f2f);
    border: 1px solid var(--shell-error, #d32f2f);
  }
  .reg-btn-danger:hover:not(:disabled) {
    background: var(--shell-error, #d32f2f);
    color: #fff;
  }
  .reg-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .reg-card {
    background: var(--shell-input-bg, #2a2a2a);
    border: 1px solid var(--shell-border, #444);
    border-radius: var(--shell-radius-md);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .reg-card:hover {
    border-color: var(--shell-accent, #007acc);
  }
  .reg-card-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .reg-card-title {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .reg-card-label {
    font-weight: 600;
    font-size: 0.9375rem;
  }
  .reg-badge {
    font-size: 0.6875rem;
    padding: 1px 6px;
    border-radius: var(--shell-radius-sm);
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  .badge-shard {
    background: color-mix(in srgb, var(--shell-accent, #007acc) 25%, transparent);
    color: var(--shell-accent, #007acc);
  }
  .badge-app {
    background: color-mix(in srgb, var(--shell-success, #4caf50) 25%, transparent);
    color: var(--shell-success, #4caf50);
  }
  .badge-combo {
    background: color-mix(in srgb, var(--shell-warning, #ff9800) 25%, transparent);
    color: var(--shell-warning, #ff9800);
  }
  .reg-hint {
    font-size: 0.75rem;
    color: var(--shell-fg-muted, #888);
  }
  .reg-manifest-preview {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: var(--shell-input-bg, #2a2a2a);
    border: 1px solid var(--shell-border, #444);
    border-radius: var(--shell-radius);
    font-size: 0.8125rem;
  }
  .reg-preview-desc {
    color: var(--shell-fg-muted, #aaa);
  }
  .reg-card-meta {
    font-size: 0.75rem;
    color: var(--shell-fg-muted, #888);
  }
  .reg-card-desc {
    font-size: 0.8125rem;
    color: var(--shell-fg-muted, #aaa);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .reg-card-author {
    font-size: 0.75rem;
    color: var(--shell-fg-muted, #777);
  }
  .reg-card-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  .reg-inline-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--shell-border, #444);
  }
  .reg-delete-confirm {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .reg-delete-confirm span {
    flex: 1;
    font-size: 0.875rem;
  }
  .reg-empty {
    text-align: center;
    padding: 32px 16px;
    color: var(--shell-fg-muted, #888);
    font-size: 0.875rem;
  }
</style>
