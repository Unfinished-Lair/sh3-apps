<script lang="ts">
  import type { RegistryEntry } from '../model/instance-registry.svelte';
  import type { ToolbarAction } from '../types';
  import type { PreviewLinkEvent } from '../contributions';
  import { resolveRender } from '../preview/render-resolve';
  import Preview from './Preview.svelte';
  import Toolbar from './Toolbar.svelte';

  interface Props {
    entry: RegistryEntry;
    toolbarActions?: ToolbarAction[];
    render?: (text: string, language: string | null) => string;
    transform?: (text: string, language: string | null) => string;
    onLinkClick?: (e: PreviewLinkEvent) => 'handled' | 'default' | void;
  }

  let {
    entry,
    toolbarActions = [],
    render,
    transform,
    onLinkClick,
  }: Props = $props();

  let doc = $derived(entry.document);

  let resolvedRender = $derived(
    resolveRender({
      render,
      transform,
      language: doc.language,
      filePath: doc.filePath,
    }),
  );

  let html = $derived(resolvedRender(doc.content, doc.language));
</script>

<div class="reader-container">
  <Toolbar actions={toolbarActions} filePath={doc.filePath} />
  <div class="reader-body">
    <Preview {html} slotId={doc.id} {onLinkClick} />
  </div>
</div>

<style>
  .reader-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--shell-bg);
  }
  .reader-body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
</style>
