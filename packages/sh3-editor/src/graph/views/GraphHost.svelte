<script lang="ts">
  import { untrack } from 'svelte';
  import Graph from './Graph.svelte';
  import GraphEmpty from './GraphEmpty.svelte';
  import { pickBinding, type Binding, type MetaBinding } from './binding';
  import type { GraphViewDescriptor, GraphController } from '../contributions';
  import type { DomainRegistry } from '../domain/registry';
  import { graphAssetToState } from '../state/bridge';
  import { createGraphController, type InternalGraphController } from './controller';
  import type { GraphState } from '../state/types';
  import type { GraphDomain } from '../domain/types';

  interface Props {
    slotId: string;
    meta: MetaBinding | undefined;
    descriptors: GraphViewDescriptor[];
    domains: DomainRegistry;
    onControllerReady?: (ctrl: GraphController) => void;
  }
  const props: Props = $props();

  const binding: Binding = $derived(pickBinding(props.slotId, props.meta, props.descriptors));

  let graphState: GraphState | null = $state(null);
  let graphDomain: GraphDomain | null = $state(null);
  let graphController: InternalGraphController | null = $state(null);
  let errorMsg: string | null = $state(null);

  // Notify the active binding's onChange. Lifted to component scope so it
  // can be passed to <Graph onAssetChanged>; reads `binding` and
  // `graphController` reactively at call time.
  function notifyAssetChanged(): void {
    if (!graphController) return;
    if (binding.kind === 'descriptor') {
      try { binding.descriptor.onChange(graphController.getAsset()); }
      catch (e) { console.warn('graph: onChange threw', e); }
    } else if (binding.kind === 'meta') {
      binding.onChange?.(graphController.getAsset());
    }
  }

  $effect(() => {
    if (binding.kind === 'descriptor' || binding.kind === 'meta') {
      const domainId = binding.kind === 'descriptor' ? binding.descriptor.domainId : binding.domainId;
      const dom = props.domains.get(domainId);
      if (!dom) {
        errorMsg = `Domain "${domainId}" is not registered. Install or activate the shard that provides it.`;
        graphState = null; graphDomain = null; graphController = null;
        return;
      }
      errorMsg = null;
      graphDomain = dom;
      const initial = binding.kind === 'descriptor' ? binding.descriptor.initial : binding.asset;
      const newState = graphAssetToState(initial, dom);
      graphState = newState;
      // Pass the $state-proxied graphState (not the raw newState) so that
      // controller mutations (setAsset, select, etc.) go through the proxy
      // and fire signals to Graph.svelte's deriveds. Read via untrack so
      // the effect doesn't subscribe to graphState (which it just wrote) —
      // otherwise the write triggers a self-recursion loop.
      const desc = binding.kind === 'descriptor' ? binding.descriptor : undefined;
      const proxiedState = untrack(() => graphState)!;
      const ctrl = createGraphController(proxiedState, dom, desc, notifyAssetChanged);
      graphController = ctrl;
      if (binding.kind === 'descriptor') {
        try { binding.descriptor.bind?.(ctrl); }
        catch (e) { console.warn('graph: descriptor.bind threw', e); }
      }
      props.onControllerReady?.(ctrl);
    } else {
      graphState = null; graphDomain = null; graphController = null; errorMsg = null;
    }

    return () => {
      graphController?._kill();
      graphController = null;
    };
  });

  const history = $derived.by(() => {
    const c = graphController;
    return c ? c.history : null;
  });
</script>

{#if errorMsg}
  <div class="graph-error">
    <h2>Graph error</h2>
    <p>{errorMsg}</p>
  </div>
{:else if binding.kind === 'empty'}
  <GraphEmpty domains={props.domains.list()} />
{:else if graphState && graphDomain && history}
  <Graph
    state={graphState}
    domain={graphDomain}
    history={history}
    onSelectionChange={(ids) => {
      // Re-route through the controller so its onSelectionChange
      // subscribers (e.g. the inspector binding) get notified. The
      // mutation already happened inside Graph.svelte; ctrl.select()
      // re-applies it idempotently and fires emitSelection().
      graphController?.select(ids);
    }}
    onAssetChanged={notifyAssetChanged}
  />
{/if}

<style>
  .graph-error { padding: 1.5rem; color: var(--sh3-warn, #d6a13a); font-family: var(--sh3-font-ui, system-ui); }
  .graph-error h2 { margin: 0 0 0.5rem; }
</style>
