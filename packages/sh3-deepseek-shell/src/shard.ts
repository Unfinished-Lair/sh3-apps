import type {
  SourceShard,
  ShardContext,
  ViewFactory,
  MountContext,
  ViewHandle,
  LayoutNode,
} from 'sh3-core';
import { shell } from 'sh3-core';
import { mount, unmount } from 'svelte';
import SettingsView from './views/SettingsView.svelte';
import { deepseekProvider, type ModelInfo } from './deepseek-client';

// String contract with sh3-ai. Mirrors `SH3_AI_PROVIDER_CONTRIBUTION` exported
// from sh3-ai/src/ai/provider.ts. Inlined (not imported) because bare
// cross-shard imports fail at SH3 install time — the providing shard's
// package is not part of the consuming shard's bundle.
const SH3_AI_PROVIDER_CONTRIBUTION = 'sh3-ai.provider';

const SETTINGS_VIEW_ID = 'deepseek:settings';
const SETTINGS_FLOAT_TITLE = 'DeepSeek Settings';

interface DeepseekUserState {
  apiKey: string;
  modelChain: string[];
  systemInstruction: string;
  temperature: number | null;
  maxOutputTokens: number | null;
}

interface DeepseekSessionState {
  knownModels: ModelInfo[];
  modelsLastFetchedAt: number | null;
}

function nodeContainsView(node: LayoutNode, viewId: string): boolean {
  if (node.type === 'slot') return node.viewId === viewId;
  if (node.type === 'tabs') return node.tabs.some((t) => t.viewId === viewId);
  if (node.type === 'split') return node.children.some((c) => nodeContainsView(c, viewId));
  return false;
}

function focusOrOpenSettings(): void {
  for (const f of shell.float.list()) {
    if (nodeContainsView(f.content, SETTINGS_VIEW_ID)) {
      shell.float.focus(f.id);
      return;
    }
  }
  shell.float.open(SETTINGS_VIEW_ID, {
    title: SETTINGS_FLOAT_TITLE,
    size: { w: 520, h: 640 },
  });
}

export const shard: SourceShard = {
  manifest: {
    id: 'deepseek',
    label: 'DeepSeek',
    views: [
      { id: SETTINGS_VIEW_ID, label: 'DeepSeek Settings', standalone: true },
    ],
  },

  activate(ctx: ShardContext) {
    const state = ctx.state<{ user: DeepseekUserState; session: DeepseekSessionState }>({
      user: {
        apiKey: '',
        modelChain: ['deepseek-chat'],
        systemInstruction: '',
        temperature: null,
        maxOutputTokens: null,
      },
      session: { knownModels: [], modelsLastFetchedAt: null },
    });

    const settingsFactory: ViewFactory = {
      mount(container: HTMLElement, _mctx: MountContext): ViewHandle {
        const instance = mount(SettingsView, {
          target: container,
          props: { state: state.user, session: state.session },
        });
        return {
          unmount() {
            unmount(instance);
          },
          closable: true,
        };
      },
    };
    ctx.registerView(SETTINGS_VIEW_ID, settingsFactory);

    const provider = deepseekProvider({
      getApiKey: () => state.user.apiKey,
      getChain: () =>
        state.user.modelChain.length > 0 ? state.user.modelChain : ['deepseek-chat'],
      getSystemInstruction: () => state.user.systemInstruction,
      getTemperature: () => state.user.temperature,
      getMaxOutputTokens: () => state.user.maxOutputTokens,
    });
    ctx.contributions.register(SH3_AI_PROVIDER_CONTRIBUTION, provider);

    ctx.actions.register({
      id: 'sh3-deepseek-shell:settings.open',
      label: 'Open Settings: DeepSeek',
      scope: ['home', 'app'],
      paletteItem: true,
      contextItem: false,
      group: 'Settings',
      run() {
        focusOrOpenSettings();
      },
    });
  },

  // Empty body — keeps the shard resident so the provider contribution and
  // the palette action stay alive even when no app/view is open.
  autostart() {},
};
