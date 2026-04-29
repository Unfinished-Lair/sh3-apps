import type { SourceShard, ShardContext } from 'sh3-core';
import { shell } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { InstanceRegistry } from './model/instance-registry';
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
import Editor from './views/Editor.svelte';
import Inspector from './views/Inspector.svelte';
import ColorPicker from './views/ColorPicker.svelte';
import ColorRenderer from './inspector/color-renderer.svelte';
import Settings from './settings/Settings.svelte';
import Help from './views/Help.svelte';
import GraphHost from './graph/views/GraphHost.svelte';
import { createDomainRegistry } from './graph/domain/registry';
import {
  GRAPH_DOMAIN_POINT, GRAPH_VIEW_POINT,
  type GraphDomainContribution, type GraphViewDescriptor,
} from './graph/contributions';
import type { GraphAsset } from './graph/asset/types';
import { getActiveGraph } from './graph/active';
import { makeRemoveSelectionCommand } from './graph/history/commands';

let registry: InstanceRegistry | null = null;
let apiRef: EditorApi | null = null;
let internalsRef: ApiInternals | null = null;
let teardownRef: (() => void) | null = null;
let unsubscribeContributions: (() => void) | null = null;
let unregisterColorRenderer: (() => void) | null = null;
let unregisterColorContribution: (() => void) | null = null;
let domainRegistry: ReturnType<typeof createDomainRegistry> | null = null;
let unsubscribeDomainContributions: (() => void) | null = null;

export function getApi(): EditorApi | null {
  return apiRef;
}

export const shard: SourceShard = {
  manifest: {
    id: 'sh3-editor',
    label: 'Editor',
    views: [
      { id: 'sh3-editor:editor',       label: 'Editor',       standalone: true },
      { id: 'sh3-editor:inspector',    label: 'Inspector',    standalone: true },
      { id: 'sh3-editor:color-picker', label: 'Color Picker', standalone: true },
      { id: 'sh3-editor:settings',     label: 'Settings',     standalone: true },
      { id: 'sh3-editor:help',         label: 'Help',         standalone: true },
      { id: 'sh3-editor:graph',        label: 'Graph',        standalone: true },
    ],
  },

  activate(ctx: ShardContext) {
    registry = new InstanceRegistry();
    const { api, internals, teardown } = createApi(registry);
    apiRef = api;
    internalsRef = internals;
    teardownRef = teardown;

    (shard as any).api = api;

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

    // Register sh3-editor as the sh3.color-picker contributor. shell.color.pick()
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
        const instanceId = context.slotId;
        const entry = registry!.get(instanceId);
        const opts = entry?.options || defaultOptions;
        const component = mount(Editor, {
          target: container,
          props: {
            entry,
            internals: internalsRef!,
            highlight: opts.highlight,
            matchingConfig: opts.matchingConfig,
            fontSize: opts.fontSize,
            toolbarActions: opts.toolbarActions,
            showSettings: opts.showSettings,
          },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    ctx.registerView('sh3-editor:inspector', {
      mount(container, context) {
        const instanceId = context.slotId;
        const ephemeral = context.meta as { value?: unknown; meta?: InspectorMeta; readonly?: boolean } | undefined;
        const component = mount(Inspector, {
          target: container,
          props: {
            instanceId,
            adHocValue: ephemeral?.value,
            adHocMeta: ephemeral?.meta,
            adHocReadonly: ephemeral?.readonly ?? false,
            internals: internalsRef!,
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

    ctx.registerView('sh3-editor:settings', {
      mount(container) {
        const component = mount(Settings, {
          target: container,
          props: { ctx },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
        };
      },
    });

    ctx.registerView('sh3-editor:help', {
      mount(container) {
        const component = mount(Help, {
          target: container,
          props: { surface: 'view', ctx },
        });
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
      mount() {
        // Help shell short-circuits this id and mounts HotkeysTab directly
        // with the prebuilt actions list. This registration only makes the
        // tab appear in the strip — the shell owns its lifecycle.
        return { unmount() { /* no-op */ } };
      },
    };
    ctx.contributions.register<HelpTabContribution>(
      HELP_TABS_CONTRIBUTION_POINT_ID,
      hotkeysTabContribution,
    );

    let helpOpen = false;
    ctx.actions.register({
      id: 'sh3-editor:help.open',
      label: 'Open Help',
      scope: ['home', 'app'],
      defaultShortcut: 'F1',
      allowInInputs: true,
      paletteItem: true,
      contextItem: false,
      group: 'Help',
      run() {
        if (helpOpen) return;
        helpOpen = true;
        shell.modal.open(
          Help,
          { surface: 'modal', ctx, onClose: () => { helpOpen = false; } },
          { dismissOnBackdrop: true },
        );
      },
    });

    ctx.actions.register({
      id: 'sh3-editor:settings.open',
      label: 'Open Editor Settings',
      scope: 'view:sh3-editor:settings',
      paletteItem: true,
      contextItem: false,
      group: 'Editor',
      run() {
        // Settings view is standalone-openable via the shell's view launcher.
        // Placeholder: full wiring belongs in a future task.
      },
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
        const g = getActiveGraph();
        if (!g || g.state.readonly) return;
        if (g.history.redo()) g.onAssetChanged();
      },
    });
  },

  deactivate() {
    unsubscribeDomainContributions?.();
    unsubscribeDomainContributions = null;
    domainRegistry?.clear();
    domainRegistry = null;
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
