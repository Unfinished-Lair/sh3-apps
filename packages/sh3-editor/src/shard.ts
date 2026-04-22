import type { SourceShard, ShardContext } from 'sh3-core';
import { mount, unmount } from 'svelte';
import { InstanceRegistry } from './model/instance-registry';
import { createApi } from './model/api';
import type { ApiInternals } from './model/api';
import type { EditorApi, OpenDocumentOptions, InspectorMeta, ColorPalette } from './types';
import { INSPECTOR_RENDERER_POINT, type InspectorRenderer } from './inspector/contributions';
import { setRenderers } from './inspector/registry';
import { setColorRendererDeps } from './inspector/color-renderer-deps';
import Editor from './views/Editor.svelte';
import Inspector from './views/Inspector.svelte';
import ColorPicker from './views/ColorPicker.svelte';
import ColorRenderer from './inspector/color-renderer.svelte';
import Settings from './settings/Settings.svelte';

let registry: InstanceRegistry | null = null;
let apiRef: EditorApi | null = null;
let internalsRef: ApiInternals | null = null;
let teardownRef: (() => void) | null = null;
let unsubscribeContributions: (() => void) | null = null;
let unregisterColorRenderer: (() => void) | null = null;

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
        const component = mount(ColorPicker, {
          target: container,
          props: {
            instanceId,
            adHocValue: ephemeral?.value,
            adHocReadonly: ephemeral?.readonly ?? false,
            internals: internalsRef!,
            prefs: initialEntry?.options.prefs ?? { mode: 'hsv' },
            compact: initialEntry?.options.compact ?? false,
            userPalettes: userPaletteState.user.colorPickerPalettes,
            onSaveUserPalette: handleSavePalette,
            onDeleteUserPalette: handleDeletePalette,
          },
        });
        return {
          closable: true,
          unmount() { unmount(component); },
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
  },

  deactivate() {
    unregisterColorRenderer?.();
    unregisterColorRenderer = null;
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
