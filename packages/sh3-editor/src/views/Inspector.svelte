<script lang="ts">
  import type { InspectorMeta, InspectorApi, HistoryCommand } from '../types';
  import type { ApiInternals } from '../model/api';
  import { isModKey } from '../util/keybindings';
  import Inspect from '../inspector/primitives/Inspect.svelte';
  import Toolbar from './Toolbar.svelte';

  interface Props {
    instanceId: string;
    /** Ad-hoc value supplied via MountContext.meta when no registry entry exists. */
    adHocValue?: unknown;
    adHocMeta?: InspectorMeta;
    adHocReadonly?: boolean;
    internals: ApiInternals;
  }

  let {
    instanceId,
    adHocValue,
    adHocMeta,
    adHocReadonly = false,
    internals,
  }: Props = $props();

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
    background: var(--shell-bg-sunken);
    color: var(--shell-fg);
    font-family: var(--shell-font-mono);
    font-size: 13px;
    outline: none;
  }
  .inspector-body {
    flex: 1;
    overflow: auto;
    padding: 0.5em 0;
  }
</style>
