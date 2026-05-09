<script lang="ts">
  import { setContext } from 'svelte';
  import type { ShardContext } from 'sh3-core';
  import type { InspectorMeta, InspectorApi, HistoryCommand } from '../types';
  import type { ApiInternals } from '../model/api';
  import { isModKey } from '../util/keybindings';
  import Inspect from '../inspector/primitives/Inspect.svelte';
  import Toolbar from './Toolbar.svelte';
  import { FIELDS_CONTEXT_KEY, type FieldsContext } from '../inspector/fields-context';

  interface Props {
    instanceId: string;
    /** Ad-hoc value supplied via MountContext.meta when no registry entry exists. */
    adHocValue?: unknown;
    adHocMeta?: InspectorMeta;
    adHocReadonly?: boolean;
    internals: ApiInternals;
    ctx?: ShardContext;
    slotId?: string;
  }

  let {
    instanceId,
    adHocValue,
    adHocMeta,
    adHocReadonly = false,
    internals,
    ctx,
    slotId,
  }: Props = $props();

  if (ctx && slotId) {
    setContext<FieldsContext>(FIELDS_CONTEXT_KEY, { ctx, slotId });
  }

  let entry = $derived(internals.inspectors.get(instanceId));
  let value = $derived(entry ? entry.value : adHocValue);
  let meta = $derived(entry ? entry.meta : adHocMeta);
  let readonly = $derived(entry ? Boolean(entry.options.readonly) : adHocReadonly);
  let walkerOnCommit = $derived(entry ? entry.options.onCommit : undefined);
  let toolbarActions = $derived(entry?.options.toolbarActions ?? []);

  const history = internals.history(instanceId);

  const api: InspectorApi = {
    push(cmd: HistoryCommand) {
      if (readonly) return;
      history.push(cmd);
      internals.inspectorValueChange.emit(instanceId, value);
    },
    get readonly() { return readonly; },
    history,
  };

  // Re-emit value changes on undo/redo.
  $effect(() => {
    const off = history.onChange(() => {
      internals.inspectorValueChange.emit(instanceId, value);
    });
    return () => off();
  });

  let rootEl: HTMLDivElement | undefined = $state();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key.toLowerCase() === 'z' && isModKey(e) && !e.shiftKey) {
      e.preventDefault();
      history.undo();
      return;
    }
    if ((e.key.toLowerCase() === 'y' && isModKey(e)) || (e.key.toLowerCase() === 'z' && isModKey(e) && e.shiftKey)) {
      e.preventDefault();
      history.redo();
      return;
    }
  }
</script>

<div
  class="inspector-container"
  tabindex="-1"
  bind:this={rootEl}
  onkeydown={handleKeydown}
  role="region"
  aria-label="Inspector"
>
  {#if toolbarActions.length > 0}
    <Toolbar actions={toolbarActions} filePath={null} />
  {/if}
  <div class="inspector-body">
    <Inspect {value} {meta} {api} walkerOnCommit={walkerOnCommit} basePath={[]} />
  </div>
</div>

<style>
  .inspector-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--sh3-bg);
    color: var(--sh3-fg);
    font-family: var(--sh3-font-mono);
    font-size: 13px;
    outline: none;
    /* Normalize widget background tokens across sh3-core primitives.
       Field/Textarea/NumberInput/Select default to --sh3-input-bg while
       Segmented/EditablePrimitive default to --sh3-bg-sunken. Override
       --sh3-input-bg locally so every input-style widget inherits the
       same sunken surface used elsewhere in the inspector. */
    --sh3-input-bg: var(--sh3-bg-sunken);
  }
  .inspector-body {
    flex: 1;
    overflow: auto;
    padding: 0.5em 0;
  }

  /* sh3-core CSS specificity miss: `.sh3-seg button` (0,1,1) overrides
     `.sh3-seg__btn--active` (0,1,0), so the active state's accent background
     never paints. Bump specificity locally with `button.sh3-seg__btn--active`
     to win source-of-truth for the active appearance. Filed upstream;
     remove once sh3-core ships the fix. */
  .inspector-container :global(.sh3-seg button.sh3-seg__btn--active) {
    background: var(--sh3-accent);
    color: var(--sh3-fg-on-accent);
    font-weight: 600;
  }
</style>
