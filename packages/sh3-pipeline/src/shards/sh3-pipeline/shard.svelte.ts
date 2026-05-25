import { mount, unmount, untrack } from 'svelte';
import { sh3 } from 'sh3-core';
import type {
  SourceShard,
  ShardContext,
  ViewFactory,
  ViewHandle,
  MountContext,
  Verb,
  VerbContext,
} from 'sh3-core';
import type { GraphAsset } from '@unfinished-lair/sh3-editor/graph/types';
import type {
  GraphDomainContribution,
  GraphViewDescriptor,
  GraphController,
} from '@unfinished-lair/sh3-editor/graph/contributions';
import type {
  InspectorInstanceContribution,
  InspectorBindHandle,
  DocPickerContribution,
  InspectorRenderer,
} from '@unfinished-lair/sh3-editor/inspector/contributions';
import PrefetchInspectorAdapter from './views/PrefetchInspectorAdapter.svelte';
import {
  bindPrefetchActions,
  unbindPrefetchActions,
  setSelectedPrefetchNodeId,
  maybeAutoPrefetch,
} from './runtime/prefetch-actions';
import type { HelpTabContribution } from '@unfinished-lair/sh3-editor/help/contributions';
import PipelineNodesHelpTab from './views/PipelineNodesHelpTab.svelte';
import PipelineToolbar from './PipelineToolbar.svelte';
import RunLogPanel from './RunLogPanel.svelte';
import { buildControlGraphDomain } from './domain/build';
import { GRAPH_DOMAIN_POINT } from './contributions';
import { runPipelineDocument } from './verbs/run';
import { rebuildCatalog } from './verbs/rebuild';
import { openPipelineApp } from './verbs/open';
import { structuralHandlers } from './runtime/handlers/structural';
import { makeDocumentWriteHandler } from './runtime/handlers/document';
import { makeVerbHandler } from './runtime/handlers/verb';
import { makePrefetchHandler } from './runtime/handlers/prefetch';
import type { PipelineDocument } from './document/format';
import { load as loadDoc, save as saveDoc, emptyDocument } from './document/store';
import {
  createPipelineState,
  setActiveState,
  getActiveState,
  SCRATCH_DOC_ID,
  type PipelineState,
} from './state.svelte';

const GRAPH_VIEW_POINT = 'sh3-editor.graph-view';
const INSPECTOR_INSTANCE_POINT = 'sh3-editor.inspectorInstance';
const INSPECTOR_RENDERER_POINT = 'sh3-editor.inspectorRenderer';
const DOC_PICKER_POINT = 'sh3-editor.docPicker';
const HELP_TABS_POINT = 'sh3-editor:help.tabs';
const GRAPH_SLOT_ID = 'graph';
const INSPECTOR_SLOT_ID = 'inspector';
const PREFETCH_RENDERER_TYPE = 'sh3-pipeline:prefetch-node';

let domainRef: ReturnType<typeof buildControlGraphDomain> | null = null;
let graphController: GraphController | null = null;

const verbHandler = makeVerbHandler();
const prefetchHandler = makePrefetchHandler();

/**
 * Dispatch verb-prefixed nodes on config.mode so the single 'verb:' prefix
 * registration covers both runtime (config.mode === 'runtime') and prefetch
 * (config.mode === 'prefetch') variants of a verb node.
 */
const verbDispatcher: typeof verbHandler = (ctx, inv) => {
  const mode = (inv.config as { mode?: unknown }).mode;
  if (mode === 'prefetch') return prefetchHandler(ctx, inv);
  return verbHandler(ctx, inv);
};

const handlers = {
  exact: new Map([
    ...structuralHandlers.exact,
    ['document.write', makeDocumentWriteHandler()],
  ]),
  prefixed: [{ prefix: 'verb:', handler: verbDispatcher }],
};

/** Route a RunLogEntry to the browser console with the right severity. */
function consoleLog(e: { level: 'debug' | 'info' | 'warn' | 'error'; nodeId: string | null; message: string; data?: unknown }): void {
  const fn = e.level === 'error' ? console.error
    : e.level === 'warn'  ? console.warn
    : e.level === 'info'  ? console.info
    :                       console.debug;
  const node = e.nodeId ? `(${e.nodeId})` : '';
  if (e.data !== undefined) fn(`[pipeline:${e.level}]`, node, e.message, e.data);
  else fn(`[pipeline:${e.level}]`, node, e.message);
}

async function runActiveAsset(ctx: ShardContext, state: PipelineState): Promise<{ outputs: Record<string, unknown> }> {
  if (state.isRunning) throw new Error('A run is already in flight');
  state.isRunning = true;
  state.abortController = new AbortController();
  state.log.clear();

  const doc: PipelineDocument = {
    ...emptyDocument(),
    asset: state.asset,
  };

  try {
    const result = await runPipelineDocument({
      doc,
      docId: state.docId || SCRATCH_DOC_ID,
      tenant: ctx.tenantId,
      inputs: {},
      signal: state.abortController.signal,
      log: (e) => { state.log.push(e); consoleLog(e); },
      invokeVerb: (s, n, a, o) => ctx.sh3.runVerb(s, n, a, o),
      writeDocument: async (targetShard, path, content) => {
        // sh3-core 0.26: scope-rooted path; binary vs text routed by content type.
        // Cross-shard writes still go through ctx.documents (the relaxed handle
        // honours documents:write across boundIds in the active scope).
        const full = `${targetShard}/${path}`;
        if (typeof content === 'string') {
          await ctx.documents.writeText(full, content);
        } else {
          await ctx.documents.writeBinary(full, content);
        }
      },
      loadSubGraph: (id) => loadDoc(ctx, id),
      handlers,
    });
    return result;
  } finally {
    state.isRunning = false;
    state.abortController = null;
  }
}

async function saveActive(ctx: ShardContext, state: PipelineState): Promise<void> {
  if (!state.docId) {
    state.log.push({ ts: Date.now(), nodeId: null, level: 'warn', message: 'Save: no docId attached.' });
    return;
  }
  await saveDoc(ctx, state.docId, { ...emptyDocument(), asset: state.asset });
  state.log.push({ ts: Date.now(), nodeId: null, level: 'info', message: `Saved ${state.docId}` });
}

/** Build a docId from the SaverValue returned by ctx.documentPicker.save().
 *  sh3-core's DocumentFilePicker emits `<shardId>/<rest>` for save (see
 *  _DocumentBrowser.svelte commit), not the boundId-relative path that
 *  open() returns alongside its shardId. Split at the first '/' so the
 *  docId carries the picker's chosen target shard, not always this one. */
function saverPathToDocId(saver: string): string | null {
  const trimmed = saver.trim();
  const slash = trimmed.indexOf('/');
  if (slash <= 0 || slash === trimmed.length - 1) return null;
  return `${trimmed.slice(0, slash)}:${trimmed.slice(slash + 1)}`;
}

async function saveAsViaPicker(ctx: ShardContext, state: PipelineState): Promise<void> {
  const saver = await ctx.documentPicker.save();
  if (!saver) return;
  const docId = saverPathToDocId(saver);
  if (!docId) {
    state.log.push({ ts: Date.now(), nodeId: null, level: 'error', message: `Save As: invalid picker path ${saver}` });
    return;
  }
  await saveDoc(ctx, docId, { ...emptyDocument(), asset: state.asset });
  state.docId = docId;
  state.log.push({ ts: Date.now(), nodeId: null, level: 'info', message: `Saved as ${docId}` });
}

async function openActiveFromDocId(ctx: ShardContext, state: PipelineState, docId: string): Promise<void> {
  try {
    const doc = await loadDoc(ctx, docId);
    state.docId = docId;
    state.asset = doc.asset;
    if (graphController) {
      try { graphController.setAsset(doc.asset); } catch { /* */ }
    }
    state.log.push({ ts: Date.now(), nodeId: null, level: 'info', message: `Opened ${docId}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    state.log.push({ ts: Date.now(), nodeId: null, level: 'error', message: `Open failed: ${msg}` });
  }
}

async function openActiveViaPicker(ctx: ShardContext, state: PipelineState): Promise<void> {
  const picked = await ctx.documentPicker.open();
  if (!picked) return;
  await openActiveFromDocId(ctx, state, `${picked.shardId}:${picked.path}`);
}

function newDoc(state: PipelineState): void {
  state.docId = SCRATCH_DOC_ID;
  state.asset = emptyDocument().asset;
  if (graphController) {
    try { graphController.setAsset(state.asset); } catch { /* controller may be detached */ }
  }
}

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-pipeline',
    label: 'sh3-pipeline',
    views: [
      { id: 'sh3-pipeline:toolbar', label: 'Pipeline Toolbar' },
      { id: 'sh3-pipeline:log',     label: 'Pipeline Log' },
    ],
    // sh3-core 0.26: documents:read folded into documents:browse; documents:write implies browse.
    // Kept both for clarity — this shard reads & writes across boundIds (verb nodes
    // load sub-graphs from other shards; document.write fans out to arbitrary targetShard).
    permissions: ['documents:browse', 'documents:write'],
  },

  register(ctx: ShardContext) {
    const state = createPipelineState();
    setActiveState(state);

    // 1. Domain contribution — global publisher. Other shards can declare
    // 'sh3-pipeline:control-graph' as their graph domain regardless of
    // whether the pipeline app is open.
    domainRef = buildControlGraphDomain(ctx as never, {
      log: (...args: unknown[]) => console.debug('[control-graph]', ...args),
    });
    const domain = domainRef;
    const domainContribution: GraphDomainContribution = {
      id: 'sh3-pipeline:control-graph',
      factory: () => domain,
    };
    ctx.contributions.register<GraphDomainContribution>(GRAPH_DOMAIN_POINT, domainContribution);

    // Doc-picker provider. Registered at register() (not onAppActivate)
    // because doc-typed ports may exist in other apps' inspector slots
    // that use sh3-editor's DocWidget; the picker should be discoverable
    // whenever the pipeline shard is loaded, not only when its app is open.
    ctx.contributions.register<DocPickerContribution>(DOC_PICKER_POINT, {
      id: 'sh3-pipeline:doc-picker',
      picker: ctx.documentPicker,
      priority: 100,
    });

    // Help tab "Pipeline Nodes". Registered at boot so users can open Help
    // (F1) from any app and find the pipeline node reference. Reads
    // domain.getTemplates() at each mount — always reflects the live catalog.
    ctx.contributions.register<HelpTabContribution>(HELP_TABS_POINT, {
      id: 'sh3-pipeline:help-tab:nodes',
      label: 'Pipeline Nodes',
      priority: 100,
      mount(container, tabCtx) {
        if (!domainRef) {
          container.textContent = 'Pipeline catalog not initialized.';
          return { unmount() { container.textContent = ''; } };
        }
        const cmp = mount(PipelineNodesHelpTab, {
          target: container,
          props: { tabCtx, domain: domainRef },
        });
        return { unmount() { unmount(cmp); } };
      },
    });

    // (Slot-keyed graph + inspector contributions and toolbar actions are
    // registered in onAppActivate — they only matter while the pipeline app
    // is loaded, and the framework's per-app cleanup bag auto-disposes them
    // on onAppDeactivate.)

    // 2. Toolbar view.
    const toolbarFactory: ViewFactory = {
      mount(container: HTMLElement, _mountCtx: MountContext): ViewHandle {
        const instance = mount(PipelineToolbar, {
          target: container,
          props: {
            state,
            onRun:  () => { runActiveAsset(ctx, state).catch((err) => {
              const msg = err instanceof Error ? err.message : String(err);
              state.log.push({ ts: Date.now(), nodeId: null, level: 'error', message: msg });
            }); },
            onStop: () => { state.abortController?.abort(); },
            onNew:  () => { newDoc(state); },
            onSave: () => { saveActive(ctx, state).catch((err) => {
              const msg = err instanceof Error ? err.message : String(err);
              state.log.push({ ts: Date.now(), nodeId: null, level: 'error', message: msg });
            }); },
          },
        });
        return {
          closable: false,
          unmount() { unmount(instance); },
        };
      },
    };
    ctx.registerView('sh3-pipeline:toolbar', toolbarFactory);

    // 4. Log view.
    const logFactory: ViewFactory = {
      mount(container: HTMLElement, _mountCtx: MountContext): ViewHandle {
        const instance = mount(RunLogPanel, {
          target: container,
          props: { log: state.log },
        });
        return {
          closable: false,
          unmount() { unmount(instance); },
        };
      },
    };
    ctx.registerView('sh3-pipeline:log', logFactory);

    // 5. Verbs.
    const runVerb: Verb = {
      name: 'pipeline.run',
      summary: 'Run a pipeline graph document.',
      programmatic: true,
      schema: {
        input: {
          type: 'object',
          properties: {
            docId:  { type: 'string' },
            inputs: { type: 'object' },
          },
          required: ['docId'],
        },
      },
      async run(vctx: VerbContext, args: string[]) {
        const structured = (vctx.structuredArgs ?? { docId: args[0], inputs: {} }) as {
          docId: string;
          inputs?: Record<string, unknown>;
        };
        if (!structured.docId) {
          vctx.scrollback.push({ kind: 'status', text: 'pipeline.run: docId is required', level: 'error', ts: Date.now() });
          return;
        }
        const doc = await loadDoc(ctx, structured.docId);
        const signal = vctx.signal ?? new AbortController().signal;
        const result = await runPipelineDocument({
          doc,
          docId: structured.docId,
          tenant: ctx.tenantId,
          inputs: structured.inputs ?? {},
          signal,
          log: (e) => {
            consoleLog(e);
            if (e.level === 'debug') return;
            vctx.scrollback.push({ kind: 'status', text: e.message, level: e.level, ts: e.ts });
          },
          invokeVerb: (s, n, a, o) => ctx.sh3.runVerb(s, n, a, o),
          writeDocument: async (targetShard, path, content) => {
            // sh3-core 0.26 coalesced doc API — see runActiveAsset above.
            const full = `${targetShard}/${path}`;
            if (typeof content === 'string') {
              await ctx.documents.writeText(full, content);
            } else {
              await ctx.documents.writeBinary(full, content);
            }
          },
          loadSubGraph: (id) => loadDoc(ctx, id),
          handlers,
        });
        vctx.scrollback.push({
          kind: 'status',
          text: `pipeline.run done — outputs: ${JSON.stringify(result.outputs)}`,
          level: 'info',
          ts: Date.now(),
        });
        // Programmatic callers get the structured result via the runVerb resolution.
        return result as unknown as void;
      },
    };
    ctx.registerVerb(runVerb);

    const openVerb: Verb = {
      name: 'pipeline.open',
      summary: 'Open a pipeline graph in the sh3-pipeline app.',
      programmatic: true,
      schema: {
        input: { type: 'object', properties: { docId: { type: 'string' } }, required: ['docId'] },
      },
      async run(vctx: VerbContext, args: string[]) {
        const structured = (vctx.structuredArgs ?? { docId: args[0] }) as { docId: string };
        await openPipelineApp(structured.docId);
        vctx.scrollback.push({
          kind: 'status',
          text: `pipeline.open ${structured.docId} (v0.1.0: app launched; docId routing in v0.2.0)`,
          level: 'info',
          ts: Date.now(),
        });
      },
    };
    ctx.registerVerb(openVerb);

    const rebuildVerb: Verb = {
      name: 'pipeline.catalog.rebuild',
      summary: 'Rebuild the Control Graph verb-node catalog from the live verb registry.',
      programmatic: true,
      schema: { input: { type: 'object', properties: {} } },
      async run(vctx: VerbContext) {
        if (!domainRef) {
          vctx.scrollback.push({ kind: 'status', text: 'Control Graph domain not initialized', level: 'error', ts: Date.now() });
          return;
        }
        const result = rebuildCatalog(ctx, domainRef);
        vctx.scrollback.push({
          kind: 'status',
          text: `pipeline.catalog.rebuild — ${result.count} verb templates`,
          level: 'info',
          ts: Date.now(),
        });
        return result as unknown as void;
      },
    };
    ctx.registerVerb(rebuildVerb);
  },

  onAppActivate(ctx: ShardContext, _appId: string) {
    const state = getActiveState();
    if (!state) return;

    // Slot-keyed graph + inspector contributions — bound to GRAPH_SLOT_ID
    // and INSPECTOR_SLOT_ID, which only exist inside the pipeline app's
    // layout. Registering them at register() (boot) would leave dangling
    // entries in sh3-editor's contribution registry whenever pipeline is
    // closed, confusing other apps that consume the same slot ids.
    let inspectorHandle: InspectorBindHandle | null = null;

    // Pull the current selected-node binding out of the controller and push
    // it to the inspector. Always wrapped in `untrack` because BOTH call
    // sites (the graph bind callback and the inspector bind callback) run
    // inside reactive scopes (their parent $effects); subscribing to graph
    // state from there causes effect_update_depth_exceeded loops.
    //
    // The same constraint applies to maybeAutoPrefetch — it reads
    // state.asset.nodes, so any invocation reachable from the descriptor's
    // bind callback must also be wrapped in `untrack`, or every
    // `state.asset = …` write reschedules the GraphHost effect and tears
    // down the controller. See autoPrefetchUntracked below.
    function syncInspector(selectedIds?: ReadonlyArray<string>): void {
      if (!inspectorHandle || !graphController) return;
      const ctrl = graphController;
      const handle = inspectorHandle;
      untrack(() => {
        const binding = ctrl.getSelectedInspectorBinding();
        if (!binding) {
          setSelectedPrefetchNodeId(null);
          handle.replace({ value: null, meta: {} });
          return;
        }
        const value = binding.value;
        const v = value as { mode?: string };
        // Route any verb node (runtime OR prefetch) through the dedicated
        // adapter. The adapter renders the picker UI in prefetch mode and
        // a "Switch to Prefetch mode" entry-point button in runtime mode.
        // No pickerable gating — the adapter shows the button by default;
        // users decide whether prefetch makes sense for a given verb.
        const isVerbNode = v.mode === 'runtime' || v.mode === 'prefetch';
        const singleId = selectedIds && selectedIds.length === 1 ? selectedIds[0] : null;
        setSelectedPrefetchNodeId(isVerbNode ? singleId : null);

        const meta = isVerbNode
          ? { ...binding.meta, type: PREFETCH_RENDERER_TYPE }
          : binding.meta;
        handle.replace({ value, meta });
      });
    }

    const autoPrefetchUntracked = (): void => { untrack(() => { maybeAutoPrefetch(); }); };

    const graphDescriptor: GraphViewDescriptor = {
      slotId: GRAPH_SLOT_ID,
      domainId: 'sh3-pipeline:control-graph',
      initial: state.asset,
      onChange: (next: GraphAsset) => {
        state.asset = next;
      },
      bind: (ctrl) => {
        graphController = ctrl;
        bindPrefetchActions(ctx, ctrl, domainRef);
        ctrl.onSelectionChange((ids) => {
          syncInspector(ids as ReadonlyArray<string>);
          // Newly-dropped prefetch nodes fire one auto-fetch so the picker
          // populates without user action. onSelectionChange fires after
          // node drops; the maybeAutoPrefetch guard (list === null) makes
          // the call idempotent on selection-only changes.
          autoPrefetchUntracked();
        });
        syncInspector();
        autoPrefetchUntracked();
      },
    };
    ctx.contributions.register<GraphViewDescriptor>(GRAPH_VIEW_POINT, graphDescriptor);

    // Inspector renderer for prefetch verb nodes. Dispatched via meta.type
    // override in syncInspector when the selected node's config.mode is 'prefetch'.
    const prefetchRenderer: InspectorRenderer = {
      id: 'sh3-pipeline:prefetch-inspector',
      type: PREFETCH_RENDERER_TYPE,
      component: PrefetchInspectorAdapter,
      priority: 100,
    };
    ctx.contributions.register<InspectorRenderer>(INSPECTOR_RENDERER_POINT, prefetchRenderer);

    const inspectorContribution: InspectorInstanceContribution = {
      slotId: INSPECTOR_SLOT_ID,
      seed: { value: null, meta: {} },
      bind(handle) {
        inspectorHandle = handle;
        syncInspector();
      },
      onCommit(path, next) {
        const binding = graphController?.getSelectedInspectorBinding();
        return binding?.onCommit(path, next) ?? false;
      },
    };
    ctx.contributions.register<InspectorInstanceContribution>(INSPECTOR_INSTANCE_POINT, inspectorContribution);

    // Toolbar actions (File + Pipeline menus, palette, keyboard). Registered
    // here so they only exist while the pipeline app is open. scope: 'app'
    // is safe now — v3's dispatcher gates by activeAppId, and the actions
    // are only in the registry while THIS app is active.
    const fileActions = [
      {
        id: 'sh3-pipeline:doc.new',
        label: 'New Pipeline',
        defaultShortcut: 'Mod+Alt+N',
        group: 'Document',
        run: () => newDoc(state),
      },
      {
        id: 'sh3-pipeline:doc.open',
        label: 'Open…',
        defaultShortcut: 'Mod+O',
        group: 'Document',
        run: () => { openActiveViaPicker(ctx, state); },
      },
      {
        id: 'sh3-pipeline:doc.save',
        label: 'Save',
        defaultShortcut: 'Mod+S',
        group: 'Document',
        run: () => saveActive(ctx, state),
      },
      {
        id: 'sh3-pipeline:doc.save-as',
        label: 'Save As…',
        defaultShortcut: 'Mod+Shift+S',
        group: 'Document',
        run: () => { saveAsViaPicker(ctx, state); },
      },
    ];
    for (const a of fileActions) {
      ctx.actions.register({
        ...a,
        scope: 'app',
        menuItem: 'file',
        paletteItem: true,
      });
    }

    const pipelineActions = [
      {
        id: 'sh3-pipeline:run',
        label: 'Run',
        defaultShortcut: 'F5',
        group: 'Run',
        run: () => {
          runActiveAsset(ctx, state).catch((err) => {
            const msg = err instanceof Error ? err.message : String(err);
            state.log.push({ ts: Date.now(), nodeId: null, level: 'error', message: msg });
          });
        },
      },
      {
        id: 'sh3-pipeline:stop',
        label: 'Stop',
        defaultShortcut: 'Shift+F5',
        group: 'Run',
        run: () => { state.abortController?.abort(); },
      },
      {
        id: 'sh3-pipeline:catalog.rebuild',
        label: 'Rebuild Catalog',
        group: 'Tools',
        run: () => {
          if (domainRef) {
            const result = rebuildCatalog(ctx, domainRef);
            state.log.push({ ts: Date.now(), nodeId: null, level: 'info', message: `Catalog rebuilt: ${result.count} verbs` });
          }
        },
      },
    ];
    for (const a of pipelineActions) {
      ctx.actions.register({
        ...a,
        scope: 'app',
        menuItem: 'pipeline',
        paletteItem: true,
      });
    }
  },

  onAppDeactivate(_ctx: ShardContext, _appId: string) {
    // Slot-keyed contributions + toolbar actions auto-dispose via the
    // per-app cleanup bag. Reset the graphController module ref — its
    // bind callback won't fire again until the next onAppActivate.
    graphController = null;
    unbindPrefetchActions();
  },

  deactivate() {
    setActiveState(null);
    domainRef = null;
    graphController = null;
  },
};

// Re-export for diagnostic introspection.
export { getActiveState };
