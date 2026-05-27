<script lang="ts">
  import type { NodeState, GraphState } from '../state/types';
  import type { BodyFieldDef, GraphDomain } from '../domain/types';
  import type {
    InspectorApi,
    HistoryController,
    HistoryCommand,
  } from '../../types';
  import { makeSetNodeConfigCommand } from '../history/commands';
  import { makeCoalesceState, decideCoalesce } from '../../inspector/walker/coalesce';
  import { splitKeyPath, resolveValueAtPath, evalShow } from './body-bridge-helpers';
  import { resolveRenderer } from '../../inspector/registry';

  interface Props {
    node: NodeState;
    state: GraphState;
    domain: GraphDomain;
    history: HistoryController;
    bodySchema: BodyFieldDef[];
  }
  const props: Props = $props();

  // Per-bridge coalesce state. Keyed by stringified path so successive edits
  // to the same field (same gesture key) replaceTop on history.
  const coalesce = makeCoalesceState();

  const api: InspectorApi = {
    push: (cmd: HistoryCommand) => props.history.push(cmd),
    get readonly() { return props.state.readonly; },
    get history() { return props.history; },
  };

  function onCommitFor(entry: BodyFieldDef) {
    const path = splitKeyPath(entry.key);
    if (path.length === 0) return undefined;
    return (next: unknown) => {
      const before = resolveValueAtPath(props.node.config, path);
      const cmd = makeSetNodeConfigCommand(
        props.state, props.domain, props.node.id, path, before, next,
      );
      cmd.apply();
      props.history.push(cmd);
      coalesce.clear(path.join('.'));
    };
  }

  function onCommitCoalescedFor(entry: BodyFieldDef) {
    const path = splitKeyPath(entry.key);
    if (path.length === 0) return undefined;
    return (next: unknown, key: string) => {
      const beforeNow = resolveValueAtPath(props.node.config, path);
      const decision = decideCoalesce(coalesce, path.join('.'), key, beforeNow);
      const cmd = makeSetNodeConfigCommand(
        props.state, props.domain, props.node.id, path, decision.before, next,
      );
      cmd.apply();
      if (decision.action === 'push') props.history.push(cmd);
      else props.history.replaceTop(cmd);
    };
  }

  // Reading state.revision keeps derived values reactive without remounting
  // child components on every mutation (which would destroy textarea caret
  // state). Widgets receive fresh `value` props and re-render internally.
</script>

<div class="body-slot"
     onpointerdown={(ev) => ev.stopPropagation()}
     onpointerup={(ev) => ev.stopPropagation()}
     onclick={(ev) => ev.stopPropagation()}
     ondblclick={(ev) => ev.stopPropagation()}>
  {#each props.bodySchema as entry, i (i)}
    {@const _rev = props.state.revision}
    {#if evalShow(entry.show, props.node.config)}
      {@const path = splitKeyPath(entry.key)}
      {@const value = path.length ? resolveValueAtPath(props.node.config, path) : undefined}
      {@const resolved = resolveRenderer(value, entry.meta)}
      {#if resolved.kind === 'custom'}
        {@const Comp = resolved.component}
        <Comp
          {value}
          meta={entry.meta}
          {api}
          onCommit={onCommitFor(entry)}
          onCommitCoalesced={onCommitCoalescedFor(entry)}
        />
      {:else}
        <span class="missing">[no renderer for {entry.meta?.type ?? '?'}]</span>
      {/if}
    {/if}
  {/each}
</div>

<style>
  .body-slot {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px 6px;
    min-width: 0;
    min-height: 0;
    flex: 1 1 0;
  }
  /* TextWidget wraps its <Textarea> in <div class="iw">; make that wrapper
     and its child grow vertically so the textarea fills the body slot when
     the node is resized. Other widgets (badges, custom renderers) keep
     their intrinsic height because they don't ship the .iw shell. */
  .body-slot :global(.iw) {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .body-slot :global(.iw) > :global(*) {
    flex: 1 1 auto;
    min-height: 0;
  }
  /* Disable the browser's native textarea corner handle — the node has its
     own resize handles and the two used to overlap visually without doing
     anything useful (browser handle dragged the textarea inside its own
     box, not the node). */
  .body-slot :global(textarea) {
    resize: none;
    height: 100%;
    box-sizing: border-box;
  }
  .missing {
    font-size: 0.8em;
    color: var(--sh3-warning, #f59e0b);
    font-family: var(--sh3-font-mono);
  }
</style>
