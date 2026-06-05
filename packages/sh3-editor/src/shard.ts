import type { SourceShard, ShardContext, FileHandlerDescriptor } from 'sh3-core';
import { PERMISSION_DOCUMENTS_WRITE, sh3, getActiveApp } from 'sh3-core';
import { openInFloat } from './handlers/openInFloat';
import { mount, unmount } from 'svelte';
import { InstanceRegistry } from './model/instance-registry.svelte';
import { createApi } from './model/api';
import type { ApiInternals } from './model/api';
import type { EditorApi, OpenDocumentOptions, InspectorMeta, ColorPalette } from './types';
import { INSPECTOR_RENDERER_POINT, type InspectorRenderer } from './inspector/contributions';
import { COLOR_PICKER_POINT, type ColorContribution } from 'sh3-core';
import { openColorPickerPopup } from './color-picker/popup-pick';
import { COLOR_PANEL_POINT, type ColorPanelDescriptor } from './color-panel/contributions';
import { selectBindingSource } from './color-panel/select-binding';
import { setRenderers } from './inspector/registry';
import { setColorRendererDeps } from './inspector/color-renderer-deps';
import {
  HELP_TABS_CONTRIBUTION_POINT_ID,
  type HelpTabContribution,
} from './help/contributions';
import { buildTabsContent } from './help/buildTabsContent';
import { setHelpSnapshot, clearHelpSnapshot, type HelpSnapshot } from './help/snapshot';
import { setHelpHubOpener, type OpenHubOptions } from './help/openHub';
import Editor from './views/Editor.svelte';
import Reader from './views/Reader.svelte';
import Inspector from './views/Inspector.svelte';
import ColorPicker from './views/ColorPicker.svelte';
import ColorRenderer from './inspector/color-renderer.svelte';
import Settings from './settings/Settings.svelte';
import HelpHotkeys from './views/HelpHotkeys.svelte';
import HelpSettings from './views/HelpSettings.svelte';
import HelpQuickAccess from './views/HelpQuickAccess.svelte';
import GraphHost from './graph/views/GraphHost.svelte';
import GraphNodePicker from './graph/views/GraphNodePicker.svelte';
import PopupPickWrapper from './color-picker/PopupPickWrapper.svelte';
import type { ColorPickViewMeta } from './color-picker/popup-pick';
import { createDomainRegistry } from './graph/domain/registry';
import {
  GRAPH_DOMAIN_POINT, GRAPH_VIEW_POINT,
  type GraphDomainContribution, type GraphViewDescriptor,
} from './graph/contributions';
import type { GraphAsset } from './graph/asset/types';
import { getActiveGraph } from './graph/active';
import { getActiveEditor } from './views/active';
import { makeRemoveSelectionCommand } from './graph/history/commands';
import { bindDocumentLive } from './document-binding';
import { bindEdits } from './edit/edit-binding';
import { bindInspector } from './inspector-binding';
import { bindTabDirty } from './tab-dirty';
import { registerBuiltinWidgets } from './inspector/widgets/register';
import { SETTINGS_POINT, type SettingsDescriptor } from './settings/contributions';
import {
  getEditorPrefs, setGridStyle, subscribeEditorPrefs, hydrateEditorPrefs,
  type GridStyle,
} from './settings/editor-prefs';

let registry: InstanceRegistry | null = null;
let apiRef: EditorApi | null = null;
let internalsRef: ApiInternals | null = null;
let teardownRef: (() => void) | null = null;
let unsubscribeContributions: (() => void) | null = null;
let unregisterColorRenderer: (() => void) | null = null;
let unregisterBuiltinWidgets: (() => void) | null = null;
let unregisterColorContribution: (() => void) | null = null;
let domainRegistry: ReturnType<typeof createDomainRegistry> | null = null;
let unsubscribeDomainContributions: (() => void) | null = null;
let unregisterSettingsDescriptor: (() => void) | null = null;
let unsubscribeEditorPrefs: (() => void) | null = null;

export function getApi(): EditorApi | null {
  return apiRef;
}

/** True when an editable element (input/textarea/select/[contenteditable])
 *  inside a focused .graph-canvas currently holds focus. Used to skip
 *  graph-scoped shortcuts (Delete, Mod+Z, Escape, …) while the user is
 *  typing inside a node body widget. */
function isEditableFocusedInsideCanvas(): boolean {
  if (typeof document === 'undefined') return false;
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  const editable =
    tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
    el.isContentEditable;
  if (!editable) return false;
  const canvas = document.querySelector('.graph-canvas:focus-within');
  return !!canvas && canvas.contains(el);
}

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-editor',
    label: 'Editor',
    views: [
      { id: 'sh3-editor:editor',       label: 'Editor',       standalone: true },
      { id: 'sh3-editor:reader',       label: 'Reader',       standalone: true },
      { id: 'sh3-editor:inspector',    label: 'Inspector',    standalone: true },
      { id: 'sh3-editor:color-picker', label: 'Color Picker', standalone: true },
      { id: 'sh3-editor:color-pick',   label: 'Color Pick',   standalone: false },
      { id: 'sh3-editor:settings',     label: 'Settings',     standalone: true },
      { id: 'sh3-editor:help',         label: 'Help',         standalone: true },
      { id: 'sh3-editor:help-hotkeys', label: 'Hotkeys',      standalone: true },
      { id: 'sh3-editor:help-settings', label: 'Settings',    standalone: true },
      { id: 'sh3-editor:help-quick-access', label: 'Quick Access', standalone: true },
      { id: 'sh3-editor:graph',        label: 'Graph',        standalone: true },
      { id: 'sh3-editor:graph-node-picker', label: 'Graph Node Picker', standalone: true },
    ],
    // @note: permission is added so contribution points invoking sh3-editor still give full access to the text editor.
    // need to think of a more robust strategy for temporarly administering a document without having permissions.
    permissions: [PERMISSION_DOCUMENTS_WRITE],
  },

  register(ctx: ShardContext) {
    registry = new InstanceRegistry();
    const { api, internals, teardown } = createApi(registry);
    apiRef = api;
    internalsRef = internals;
    teardownRef = teardown;

    (shard as any).api = api;

    ctx.contributions.register<FileHandlerDescriptor>('sh3.file-handler', {
      label: 'Text Editor',
      match: { extensions: ['.md', '.txt', '.json', '.jsonl'] },
      open: { type: 'view', open: (file) => openInFloat(ctx, file) },
      priority: 0,
    });

    // Seed + subscribe to inspector renderer contributions.
    const refresh = () => {
      setRenderers(ctx.contributions.list<InspectorRenderer>(INSPECTOR_RENDERER_POINT));
    };
    refresh();
    unsubscribeContributions = ctx.contributions.onChange(INSPECTOR_RENDERER_POINT, refresh);

    // User-zone palettes.
    const userPaletteState = ctx.state<{ user: { colorPickerPalettes: ColorPalette[] } }>({
      user: { colorPickerPalettes: [] },
    });

    function handleSavePalette(palette: ColorPalette): void {
      const list = userPaletteState.user.colorPickerPalettes;
      const idx = list.findIndex((p) => p.id === palette.id);
      if (idx === -1) list.push(palette);
      else list[idx] = palette;
    }

    function handleDeletePalette(paletteId: string): void {
      const list = userPaletteState.user.colorPickerPalettes;
      const idx = list.findIndex((p) => p.id === paletteId);
      if (idx !== -1) list.splice(idx, 1);
    }

    // Expose shard-side deps to the inspector color-renderer (mounted inside
    // the inspector walker, which does not have direct access to this scope).
    setColorRendererDeps({
      internals,
      userPalettes: userPaletteState.user.colorPickerPalettes,
      onSaveUserPalette: handleSavePalette,
      onDeleteUserPalette: handleDeletePalette,
    });

    // Auto-register the default color renderer against the inspector contribution point.
    const colorRendererContribution: InspectorRenderer = {
      id: 'sh3-editor:color',
      type: 'color',
      component: ColorRenderer as any,
      priority: 10,
    };
    unregisterColorRenderer =
      ctx.contributions.register<InspectorRenderer>(INSPECTOR_RENDERER_POINT, colorRendererContribution);

    // Register built-in widget renderers (priority 10); user shards override
    // by registering at priority > 10.
    unregisterBuiltinWidgets = registerBuiltinWidgets(ctx);

    // Register sh3-editor as the sh3.color-picker contributor. sh3.color.pick()
    // from any shard now routes here; falls back to native <input type="color">
    // when sh3-editor is inactive.
    const colorContribution: ColorContribution = {
      id: 'sh3-editor:color-picker',
      priority: 10,
      open: (opts) => openColorPickerPopup(opts, {
        userPalettes: userPaletteState.user.colorPickerPalettes,
        onSaveUserPalette: handleSavePalette,
        onDeleteUserPalette: handleDeletePalette,
      }),
    };
    unregisterColorContribution =
      ctx.contributions.register<ColorContribution>(COLOR_PICKER_POINT, colorContribution);

    const defaultOptions: OpenDocumentOptions = {
      content: 'Hello, World',
    };

    ctx.registerView('sh3-editor:editor', {
      mount(container, context) {
        const slotId = context.slotId;
        // bindEdits / tab-dirty resolve the slot's entry lazily, so they survive
        // a document rebind and are created once here.
        const editResult = bindEdits({
          slotId,
          contributions: ctx.contributions,
          registry: registry!,
          internals: internalsRef!,
        });
        const offTabDirty = bindTabDirty(slotId, internalsRef!, context);
        // bindDocumentLive re-mounts the Editor if an EditorDocumentContribution
        // registers AFTER the view mounted (layout-restore vs. late openWorkspace
        // race). mountView returns a Svelte-only disposer.
        const live = bindDocumentLive({
          slotId,
          contributions: ctx.contributions,
          registry: registry!,
          internals: internalsRef!,
          defaultOptions,
          documents: ctx.documents,
          mountView(bindResult) {
            const { entry } = bindResult;
            const opts = entry.options;
            const component = mount(Editor, {
              target: container,
              props: {
                entry,
                internals: internalsRef!,
                matchingConfig: opts.matchingConfig,
                fontSize: opts.fontSize,
                toolbarActions: opts.toolbarActions,
                showSettings: opts.showSettings,
                render: opts.render,
                transform: opts.transform,
                startInPreview: opts.startInPreview,
                onLinkClick: bindResult.onLinkClick,
                ctx,
                slotId,
              },
            });
            return () => unmount(component);
          },
        });
        return {
          closable: true,
          unmount() {
            offTabDirty();
            live.cleanup();
            editResult.cleanup();
          },
        };
      },
    });

    ctx.registerView('sh3-editor:reader', {
      mount(container, context) {
        const slotId = context.slotId;
        const live = bindDocumentLive({
          slotId,
          contributions: ctx.contributions,
          registry: registry!,
          internals: internalsRef!,
          defaultOptions,
          documents: ctx.documents,
          mountView(bindResult) {
            const { entry } = bindResult;
            const opts = entry.options;
            const component = mount(Reader, {
              target: container,
              props: {
                entry,
                toolbarActions: opts.toolbarActions,
                render: opts.render,
                transform: opts.transform,
                onLinkClick: bindResult.onLinkClick,
              },
            });
            return () => unmount(component);
          },
        });
        return {
          closable: true,
          unmount() {
            live.cleanup();
          },
        };
      },
    });

    ctx.registerView('sh3-editor:inspector', {
      mount(container, context) {
        const instanceId = context.slotId;
        const bindResult = bindInspector({
          slotId: instanceId,
          contributions: ctx.contributions,
          registry: registry!,
          internals: internalsRef!,
        });
        const ephemeral = context.meta as { value?: unknown; meta?: InspectorMeta; readonly?: boolean } | undefined;
        const component = mount(Inspector, {
          target: container,
          props: {
            instanceId,
            adHocValue: ephemeral?.value,
            adHocMeta: ephemeral?.meta,
            adHocReadonly: ephemeral?.readonly ?? false,
            internals: internalsRef!,
            ctx,
            slotId: instanceId,
          },
        });
        return {
          closable: true,
          unmount() {
            bindResult.cleanup();
            unmount(component);
          },
        };
      },
    });

    // Internal float view used by `sh3.color.pick()` — mounts the
    // popup-style picker surface inside a dismissable float so it can stack
    // above modals via FloatOptions.anchor portaling.
    ctx.registerView('sh3-editor:color-pick', {
      mount(container, context) {
        const meta = context.meta as ColorPickViewMeta | undefined;
        if (!meta) {
          throw new Error('sh3-editor:color-pick mounted without meta');
        }
        const requestClose = () => {
          const loc = context.location();
          if (loc?.kind === 'float') sh3.float.close(loc.floatId);
        };
        const component = mount(PopupPickWrapper, {
          target: container,
          props: {
            initial: meta.initial,
            title: meta.title,
            userPalettes: meta.userPalettes,
            onSaveUserPalette: meta.onSaveUserPalette,
            onDeleteUserPalette: meta.onDeleteUserPalette,
            onResolve: meta.onResolve,
            close: requestClose,
          },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    ctx.registerView('sh3-editor:color-picker', {
      mount(container, context) {
        const instanceId = context.slotId;
        const initialEntry = internals.colorPickers.get(instanceId);
        const ephemeral = context.meta as { value?: string; readonly?: boolean } | undefined;
        const descriptors = ctx.contributions.list<ColorPanelDescriptor>(COLOR_PANEL_POINT);
        const binding = selectBindingSource(instanceId, initialEntry, descriptors, ephemeral);
        const component = mount(ColorPicker, {
          target: container,
          props: {
            instanceId,
            adHocValue: binding.kind === 'adhoc' ? binding.adHocValue : undefined,
            adHocReadonly: binding.kind === 'adhoc' ? binding.adHocReadonly : false,
            internals: internalsRef!,
            prefs: initialEntry?.options.prefs ?? { mode: 'hsv' },
            compact: initialEntry?.options.compact ?? false,
            userPalettes: userPaletteState.user.colorPickerPalettes,
            onSaveUserPalette: handleSavePalette,
            onDeleteUserPalette: handleDeletePalette,
            descriptorBinding: binding.kind === 'descriptor' ? binding.descriptor : undefined,
          },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    // ---- Editor preferences -------------------------------------------------
    // Hydrate from disk synchronously-best-effort: ctx.documents is async, so
    // initial state comes from DEFAULT_EDITOR_PREFS; the readJson resolves
    // shortly after and updates in place via hydrateEditorPrefs (no subscriber
    // notification). Save-on-change is wired via subscribeEditorPrefs.
    // Path is scope-rooted (sh3-core 0.26) — boundId is the editor shard id
    // here since register() runs standalone, before any onAppActivate rotation.
    const prefsPath = `${ctx.documents.boundId}/editor-prefs.json`;
    void (async () => {
      try {
        const blob = await ctx.documents.readJson(prefsPath);
        if (blob !== null) hydrateEditorPrefs(blob);
      } catch {
        // Corrupt or unreadable — stay at defaults silently.
      }
    })();

    unsubscribeEditorPrefs = subscribeEditorPrefs((prefs) => {
      void ctx.documents.writeJson(prefsPath, prefs).catch(() => {
        // Persistence is best-effort; in-memory value is authoritative for the session.
      });
    });

    const settingsDescriptor: SettingsDescriptor = {
      shardId: 'sh3-editor',
      label: 'Graph',
      schema: [
        {
          key: 'gridStyle',
          label: 'Grid style',
          description: 'Background grid rendered behind graph nodes.',
          type: 'enum',
          options: [
            { value: 'cells', label: 'Cells' },
            { value: 'dots',  label: 'Dots' },
            { value: 'none',  label: 'None' },
          ],
        },
      ],
      getValues: () => ({ gridStyle: getEditorPrefs().gridStyle }),
      onEdit: (key, value) => {
        if (key === 'gridStyle' && typeof value === 'string') {
          setGridStyle(value as GridStyle);
        }
      },
      subscribe: (cb) => subscribeEditorPrefs(() => cb()),
    };
    unregisterSettingsDescriptor =
      ctx.contributions.register<SettingsDescriptor>(SETTINGS_POINT, settingsDescriptor);

    domainRegistry = createDomainRegistry();
    const refreshDomainContributions = () => {
      domainRegistry!.clear();
      const contribs = ctx.contributions.list<GraphDomainContribution>(GRAPH_DOMAIN_POINT);
      for (const c of contribs) domainRegistry!.register(c);
    };
    refreshDomainContributions();
    unsubscribeDomainContributions = ctx.contributions.onChange(GRAPH_DOMAIN_POINT, refreshDomainContributions);

    ctx.registerView('sh3-editor:graph', {
      mount(container, context) {
        const slotId = context.slotId;
        const meta = context.meta as {
          asset?: GraphAsset;
          domainId?: string;
          onChange?: (a: GraphAsset) => void;
          readonly?: boolean;
        } | undefined;

        let component: ReturnType<typeof mount> | null = null;
        const remount = () => {
          if (component) { unmount(component); component = null; }
          const descriptors = ctx.contributions.list<GraphViewDescriptor>(GRAPH_VIEW_POINT);
          component = mount(GraphHost, {
            target: container,
            props: {
              slotId,
              meta,
              descriptors,
              domains: domainRegistry!,
            },
          });
        };
        remount();
        const offDescChange = ctx.contributions.onChange(GRAPH_VIEW_POINT, remount);

        return {
          closable: true,
          unmount() {
            offDescChange();
            if (component) { unmount(component); component = null; }
          },
        };
      },
    });

    ctx.registerView('sh3-editor:graph-node-picker', {
      mount(container, context) {
        const autoClose = context.props?.autoClose === true;
        const component = mount(GraphNodePicker, {
          target: container,
          props: {
            autoClose,
            location: () => context.location(),
          },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    ctx.registerView('sh3-editor:settings', {
      mount(container, context) {
        const component = mount(HelpSettings, {
          target: container,
          props: { ctx, slotId: context.slotId },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    ctx.registerView('sh3-editor:help-settings', {
      mount(container, context) {
        const component = mount(HelpSettings, {
          target: container,
          props: { ctx, slotId: context.slotId },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    ctx.registerView('sh3-editor:help', {
      mount(container) {
        // Legacy standalone surface. The primary Help experience is the F1
        // TabsNode float; this placeholder remains so App.initialLayout
        // pinned to 'sh3-editor:help' keeps rendering something useful.
        container.textContent = 'Help (standalone view) — press F1 for the full hub.';
        return {
          closable: true,
          unmount() { container.textContent = ''; },
        };
      },
    });

    ctx.registerView('sh3-editor:help-hotkeys', {
      mount(container) {
        const component = mount(HelpHotkeys, { target: container, props: {} });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    const hotkeysTabContribution: HelpTabContribution = {
      id: 'sh3-editor:help-tab:hotkeys',
      label: 'Hotkeys',
      priority: 0,
      viewId: 'sh3-editor:help-hotkeys',
    };
    ctx.contributions.register<HelpTabContribution>(
      HELP_TABS_CONTRIBUTION_POINT_ID,
      hotkeysTabContribution,
    );

    ctx.contributions.register<HelpTabContribution>(HELP_TABS_CONTRIBUTION_POINT_ID, {
      id: 'sh3-editor:help-tab:settings',
      label: 'Settings',
      priority: 50,
      viewId: 'sh3-editor:help-settings',
    });

    ctx.registerView('sh3-editor:help-quick-access', {
      mount(container) {
        const component = mount(HelpQuickAccess, { target: container, props: { ctx } });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    ctx.contributions.register<HelpTabContribution>(HELP_TABS_CONTRIBUTION_POINT_ID, {
      id: 'sh3-editor:help-tab:quick-access',
      label: 'Quick Access',
      priority: 60,
      viewId: 'sh3-editor:help-quick-access',
      visible: () => ctx.contributions.list(GRAPH_DOMAIN_POINT).length > 0,
    });

    let helpFloatId: string | null = null;
    function openHelpHubImpl(opts?: OpenHubOptions): void {
      // Reconcile against the float list: if the tracked id is stale
      // (user closed the float), treat it as not-open and re-open.
      if (helpFloatId !== null) {
        const stillThere = sh3.float.list().some((f) => f.id === helpFloatId);
        if (stillThere) {
          sh3.float.focus(helpFloatId);
          return;
        }
        helpFloatId = null;
        clearHelpSnapshot();
      }

      const app = getActiveApp();
      const snap: HelpSnapshot = {
        activeAppId: app?.id ?? null,
        focusedViewId: null,
        mountedViewIds: [],
        selection: ctx.actions.selection.get(),
        capturedAt: Date.now(),
      };
      setHelpSnapshot(snap);

      const contributions = ctx.contributions.list<HelpTabContribution>(
        HELP_TABS_CONTRIBUTION_POINT_ID,
      );
      const content = buildTabsContent(contributions, { activeAppId: snap.activeAppId });

      // Respect focusTabId: jump the TabsNode's active tab to the requested
      // contribution before opening. Missing/unknown id → first tab.
      if (opts?.focusTabId && content.tabs.length > 0) {
        const idx = content.tabs.findIndex((t) => t.slotId === `help-hub:${opts.focusTabId}`);
        if (idx >= 0) content.activeTab = idx;
      }

      helpFloatId = sh3.float.openWithContent({
        title: 'Help',
        size: { w: 720, h: 520 },
        content,
      });
    }
    setHelpHubOpener(openHelpHubImpl);

    ctx.actions.register({
      id: 'sh3-editor:help.open',
      label: 'Open Help',
      scope: ['home', 'app'],
      defaultShortcut: 'F1',
      allowInInputs: true,
      paletteItem: true,
      contextItem: false,
      group: 'Help',
      run(args?: OpenHubOptions) { openHelpHubImpl(args); },
    });

    ctx.actions.register({
      id: 'sh3-editor:editor.preview-toggle',
      label: 'Toggle Preview',
      scope: 'focus:sh3-editor:editor',
      defaultShortcut: 'Mod+Shift+V',
      allowInInputs: true,
      paletteItem: true,
      contextItem: false,
      group: 'Editor',
      run() { getActiveEditor()?.togglePreview(); },
    });

    ctx.actions.register({
      id: 'sh3-editor:graph.delete-selection',
      label: 'Delete Selection',
      scope: 'focus:sh3-editor:graph',
      defaultShortcut: 'Delete',
      paletteItem: true,
      contextItem: true,
      group: 'Graph',
      run() {
        if (isEditableFocusedInsideCanvas()) return;
        const g = getActiveGraph();
        if (!g || g.state.readonly || g.state.selection.size === 0) return;
        const ids = Array.from(g.state.selection);
        const cmd = makeRemoveSelectionCommand(g.state, g.domain, ids);
        cmd.apply();
        g.history.push(cmd);
        g.onSelectionChange([]);
        g.onAssetChanged();
      },
    });

    ctx.actions.register({
      id: 'sh3-editor:graph.undo',
      label: 'Undo',
      scope: 'focus:sh3-editor:graph',
      defaultShortcut: 'Mod+Z',
      paletteItem: true,
      contextItem: false,
      group: 'Graph',
      run() {
        if (isEditableFocusedInsideCanvas()) return;
        const g = getActiveGraph();
        if (!g || g.state.readonly) return;
        if (g.history.undo()) g.onAssetChanged();
      },
    });

    ctx.actions.register({
      id: 'sh3-editor:graph.redo',
      label: 'Redo',
      scope: 'focus:sh3-editor:graph',
      defaultShortcut: 'Mod+Shift+Z',
      paletteItem: true,
      contextItem: false,
      group: 'Graph',
      run() {
        if (isEditableFocusedInsideCanvas()) return;
        const g = getActiveGraph();
        if (!g || g.state.readonly) return;
        if (g.history.redo()) g.onAssetChanged();
      },
    });

    // Windows-style alternate redo binding. Hidden from palette/context to
    // avoid duplicate entries — primary redo action is above.
    ctx.actions.register({
      id: 'sh3-editor:graph.redo-alt',
      label: 'Redo',
      scope: 'focus:sh3-editor:graph',
      defaultShortcut: 'Mod+Y',
      paletteItem: false,
      contextItem: false,
      run() {
        if (isEditableFocusedInsideCanvas()) return;
        const g = getActiveGraph();
        if (!g || g.state.readonly) return;
        if (g.history.redo()) g.onAssetChanged();
      },
    });

    ctx.actions.register({
      id: 'sh3-editor:graph.zoom-in',
      label: 'Zoom In',
      scope: 'focus:sh3-editor:graph',
      defaultShortcut: 'Mod+=',
      paletteItem: true,
      contextItem: false,
      group: 'Graph',
      run() {
        if (isEditableFocusedInsideCanvas()) return;
        getActiveGraph()?.zoomIn();
      },
    });

    ctx.actions.register({
      id: 'sh3-editor:graph.zoom-out',
      label: 'Zoom Out',
      scope: 'focus:sh3-editor:graph',
      defaultShortcut: 'Mod+-',
      paletteItem: true,
      contextItem: false,
      group: 'Graph',
      run() {
        if (isEditableFocusedInsideCanvas()) return;
        getActiveGraph()?.zoomOut();
      },
    });

    ctx.actions.register({
      id: 'sh3-editor:graph.zoom-reset',
      label: 'Reset Zoom',
      scope: 'focus:sh3-editor:graph',
      defaultShortcut: 'Mod+0',
      paletteItem: true,
      contextItem: false,
      group: 'Graph',
      run() {
        if (isEditableFocusedInsideCanvas()) return;
        getActiveGraph()?.zoomReset();
      },
    });

    ctx.actions.register({
      id: 'sh3-editor:graph.fit-content',
      label: 'Fit Content',
      scope: 'focus:sh3-editor:graph',
      defaultShortcut: 'Shift+1',
      paletteItem: true,
      contextItem: false,
      group: 'Graph',
      run() {
        if (isEditableFocusedInsideCanvas()) return;
        getActiveGraph()?.fitContent();
      },
    });

    ctx.actions.register({
      id: 'sh3-editor:graph.dismiss-palette',
      label: 'Dismiss Palette',
      scope: 'focus:sh3-editor:graph',
      defaultShortcut: 'Escape',
      allowInInputs: true,
      paletteItem: false,
      contextItem: false,
      group: 'Graph',
      run() {
        if (isEditableFocusedInsideCanvas()) return;
        getActiveGraph()?.dismissPalette();
      },
    });
  },

  onAppActivate(ctx, appId) {
    // Save/undo/redo are scoped at 'app' (not 'focus:sh3-editor:editor')
    // so non-editor surfaces that bind an EditorEditContribution and call
    // channel.setActive() also receive the keystroke. run() bodies no-op
    // when no surface has published itself as the active target.
    ctx.actions.register({
      id: 'sh3-editor:editor.save',
      label: 'Save Document',
      scope: 'app',
      menuItem: 'file',
      defaultShortcut: 'Mod+S',
      allowInInputs: true,
      paletteItem: true,
      contextItem: false,
      group: 'Editor',
      run() { getActiveEditor()?.save(); },
    });

    ctx.actions.register({
      id: 'sh3-editor:editor.undo',
      label: 'Undo',
      menuItem: 'edit',
      scope: 'app',
      defaultShortcut: 'Mod+Z',
      allowInInputs: true,
      paletteItem: false,
      contextItem: false,
      group: 'Editor',
      run() { getActiveEditor()?.undo(); },
    });

    ctx.actions.register({
      id: 'sh3-editor:editor.redo',
      label: 'Redo',
      menuItem: 'edit',
      scope: 'app',
      defaultShortcut: 'Mod+Shift+Z',
      allowInInputs: true,
      paletteItem: false,
      contextItem: false,
      group: 'Editor',
      run() { getActiveEditor()?.redo(); },
    });

    // Windows-style alternate redo binding. Hidden from palette/context to
    // avoid duplicate entries — primary redo action is above.
    ctx.actions.register({
      id: 'sh3-editor:editor.redo-alt',
      label: 'Redo',
      scope: 'app',
      defaultShortcut: 'Mod+Y',
      allowInInputs: true,
      paletteItem: false,
      contextItem: false,
      run() { getActiveEditor()?.redo(); },
    });
  },

  deactivate() {
    setHelpHubOpener(null);
    clearHelpSnapshot();
    unregisterSettingsDescriptor?.();
    unregisterSettingsDescriptor = null;
    unsubscribeEditorPrefs?.();
    unsubscribeEditorPrefs = null;
    unsubscribeDomainContributions?.();
    unsubscribeDomainContributions = null;
    domainRegistry?.clear();
    domainRegistry = null;
    unregisterBuiltinWidgets?.();
    unregisterBuiltinWidgets = null;
    unregisterColorRenderer?.();
    unregisterColorRenderer = null;
    unregisterColorContribution?.();
    unregisterColorContribution = null;
    setColorRendererDeps(null);
    unsubscribeContributions?.();
    unsubscribeContributions = null;
    teardownRef?.();
    registry?.clear();
    // Reset the renderer map so a later re-activation starts clean.
    setRenderers([]);
    registry = null;
    apiRef = null;
    internalsRef = null;
    teardownRef = null;
    (shard as any).api = null;
  },
};
