<script lang="ts">
  import type { InspectorMeta, InspectorApi } from '../../types';
  import { resolveRenderer } from '../registry';
  import FallbackWalker from '../walker/FallbackWalker.svelte';
  import ReadOnlyLeaf from './ReadOnlyLeaf.svelte';

  interface Props {
    value: unknown;
    meta?: InspectorMeta;
    api: InspectorApi;
    /** Supplied by the walker when mounted at a field; custom renderers use this
     *  to write back to the parent container. Absent at root-level. */
    onCommit?: (next: unknown) => void;
  }
  let { value, meta, api, onCommit }: Props = $props();

  let resolution = $derived(resolveRenderer(value, meta));
</script>

{#if meta?.hidden}
  <!-- hidden by meta; render nothing -->
{:else if resolution.kind === 'custom'}
  {@const Renderer = resolution.component}
  <Renderer {value} {meta} {api} {onCommit} />
{:else if resolution.kind === 'walker'}
  <FallbackWalker {value} {meta} {api} />
{:else}
  <ReadOnlyLeaf {value} />
{/if}
