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
} from '@unfinished-lair/sh3-editor/inspector/contributions';
import PipelineToolbar from './PipelineToolbar.svelte';
import RunLogPanel from './RunLogPanel.svelte';
import { buildControlGraphDomain } from './domain/build';
import { GRAPH_DOMAIN_POINT } from './contributions';
import { runPipelineDocument } from './verbs/run';
import { rebuildCatalog } from './verbs/rebuild';
import { openPipelineApp } from './verbs/open';
import { structuralHandlers } from './runtime/handlers/structural';
import { makeVerbHandler } from './runtime/handlers/verb';
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
const GRAPH_SLOT_ID = 'graph';
const INSPECTOR_SLOT_ID = 'inspector';

let domainRef: ReturnType<typeof buildControlGraphDomain> | null = null;
let graphController: GraphController | null = null;

const handlers = {
  exact: structuralHandlers.exact,
  prefixed: [{ prefix: 'verb:', handler: makeVerbHandler({ hasSchema: false }) }],
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

/** Strip the shard prefix from a docId for display. */
function docIdToPath(docId: string): string {
  return docId.startsWith('sh3-pipeline:') ? docId.slice('sh3-pipeline:'.length) : docId;
}

/** Build a docId from a bare path (defaults to this shard's namespace). */
function pathToDocId(path: string): string {
  return path.includes(':') ? path : `sh3-pipeline:${path}`;
}

async function saveAsViaPicker(ctx: ShardContext, state: PipelineState): Promise<void> {
  const path = await ctx.documentPicker.save();
  if (!path) return;
  const docId = pathToDocId(path.trim());
  await saveDoc(ctx, docId, { ...emptyDocument(), asset: state.asset });
  state.docId = docId;
  state.log.push({ ts: Date.now(), nodeId: null, level: 'info', message: `Saved as ${docId}` });
}

async function openActiveFromPath(ctx: ShardContext, state: PipelineState, path: string): Promise<void> {
  const docId = pathToDocId(path);
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
  await openActiveFromPath(ctx, state, picked.path);
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
    permissions: ['documents:browse', 'documents:read', 'documents:write'],
  },

  register(ctx: ShardContext) {
    const state = createPipelineState();
    setActiveState(state);

    // 1. Domain contribution.
    domainRef = buildControlGraphDomain(ctx as never, {
      log: (...args: unknown[]) => console.debug('[control-graph]', ...args),
    });
    const domain = domainRef;
    const domainContribution: GraphDomainContribution = {
      id: 'sh3-pipeline:control-graph',
      factory: () => domain,
    };
    ctx.contributions.register<GraphDomainContribution>(GRAPH_DOMAIN_POINT, domainContribution);

    // 2. GraphViewDescriptor — binds the editor's graph slot to our asset state.
    let inspectorHandle: InspectorBindHandle | null = null;

    // Pull the current selected-node binding out of the controller and push
    // it to the inspector. Always wrapped in `untrack` because BOTH call
    // sites (the graph bind callback and the inspector bind callback) run
    // inside reactive scopes (their parent $effects); subscribing to graph
    // state from there causes effect_update_depth_exceeded loops.
    function syncInspector(): void {
      if (!inspectorHandle || !graphController) return;
      const ctrl = graphController;
      const handle = inspectorHandle;
      untrack(() => {
        const binding = ctrl.getSelectedInspectorBinding();
        if (binding) {
          handle.replace({ value: binding.value, meta: binding.meta });
        } else {
          handle.replace({ value: null, meta: {} });
        }
      });
    }

    const graphDescriptor: GraphViewDescriptor = {
      slotId: GRAPH_SLOT_ID,
      domainId: 'sh3-pipeline:control-graph',
      initial: state.asset,
      onChange: (next: GraphAsset) => {
        state.asset = next;
      },
      bind: (ctrl) => {
        graphController = ctrl;
        // selectionSubs callbacks fire outside any tracking scope, but the
        // initial sync below runs inside this $effect — untrack inside
        // syncInspector handles both safely.
        ctrl.onSelectionChange(() => syncInspector());
        syncInspector();
      },
    };
    ctx.contributions.register<GraphViewDescriptor>(GRAPH_VIEW_POINT, graphDescriptor);

    // 2b. Inspector binding — push the selected graph node's config into the
    // inspector slot whenever selection changes, and route field edits back
    // through the graph controller's onCommit (which goes through history).
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

    // 3. Toolbar view.
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

    // 6. Actions (File + Pipeline menu, palette, keyboard).
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
        // view-scope on our toolbar = "active iff the sh3-pipeline app is open".
        // 'app' would activate on any app because the shard autostarts.
        scope: 'view:sh3-pipeline:toolbar',
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
        scope: 'view:sh3-pipeline:toolbar',
        menuItem: 'pipeline',
        paletteItem: true,
      });
    }
  },

  deactivate() {
    setActiveState(null);
    domainRef = null;
    graphController = null;
  },
};

// Re-export for diagnostic introspection.
export { getActiveState };
