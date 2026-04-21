<script lang="ts">
  import type { InspectorMeta, InspectorApi, WalkerCommitOverride } from '../../types';
  import { resolveRenderer } from '../registry';
  import { attemptCommit } from '../walker/commit';
  import FallbackWalker from '../walker/FallbackWalker.svelte';
  import ReadOnlyLeaf from './ReadOnlyLeaf.svelte';

  interface Props {
    value: unknown;
    meta?: InspectorMeta;
    api: InspectorApi;
    /** Walker-supplied default commit for this field site (mutate parent + push history).
     *  Used as the fallback when walkerOnCommit is absent or returns false. Absent at
     *  root-level mounts. */
    onCommit?: (next: unknown) => void;
    /** Consumer override, threaded from the root inspector mount. */
    walkerOnCommit?: WalkerCommitOverride;
    /** Path from the root inspected value to this node. Empty at root. */
    basePath?: (string | number)[];
  }
  let { value, meta, api, onCommit, walkerOnCommit, basePath = [] }: Props = $props();

  let resolution = $derived(resolveRenderer(value, meta));

  // If an override is in scope AND we're at a field site (have a fallback commit),
  // gate the custom renderer's commit through attemptCommit. If no override, pass
  // the raw fallback through — preserves pre-override behavior exactly.
  let customRendererCommit = $derived.by<((next: unknown) => void) | undefined>(() => {
    const fallback = onCommit;
    const override = walkerOnCommit;
    if (fallback === undefined) return undefined;
    if (override === undefined) return fallback;
    return (next) => { attemptCommit(override, basePath, next, () => fallback(next)); };
  });
</script>

{#if meta?.hidden}
  <!-- hidden by meta; render nothing -->
{:else if resolution.kind === 'custom'}
  {@const Renderer = resolution.component}
  <Renderer {value} {meta} {api} onCommit={customRendererCommit} />
{:else if resolution.kind === 'walker'}
  <FallbackWalker {value} {meta} {api} {walkerOnCommit} {basePath} />
{:else}
  <ReadOnlyLeaf {value} />
{/if}
