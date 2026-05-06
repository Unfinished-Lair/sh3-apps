import type { SourceShard, ShardContext, ViewFactory, MountContext, ViewHandle } from 'sh3-core';
import { mount, unmount } from 'svelte';
import SettingsView from './views/SettingsView.svelte';
import { geminiProvider, type ModelInfo } from './gemini-client';

// String contract with sh3-ai. Mirrors `SH3_AI_PROVIDER_CONTRIBUTION` exported
// from sh3-ai/src/ai/provider.ts. Inlined (not imported) because bare
// cross-shard imports fail at SH3 install time — the providing shard's
// package is not part of the consuming shard's bundle.
const SH3_AI_PROVIDER_CONTRIBUTION = 'sh3-ai.provider';

interface GeminiUserState {
  apiKey: string;
  modelChain: string[];
  systemInstruction: string;
  temperature: number | null;
  maxOutputTokens: number | null;
}

interface GeminiSessionState {
  knownModels: ModelInfo[];
  modelsLastFetchedAt: number | null;
}

export const shard: SourceShard = {
  manifest: {
    id: 'gemini',
    label: 'Gemini',
    views: [{ id: 'gemini:settings', label: 'Gemini Settings' }],
  },

  activate(ctx: ShardContext) {
    const state = ctx.state<{ user: GeminiUserState; session: GeminiSessionState }>({
      user: {
        apiKey: '',
        modelChain: ['gemini-2.5-flash'],
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
        };
      },
    };
    ctx.registerView('gemini:settings', settingsFactory);

    const provider = geminiProvider({
      getApiKey: () => state.user.apiKey,
      getChain: () =>
        state.user.modelChain.length > 0 ? state.user.modelChain : ['gemini-2.5-flash'],
      getSystemInstruction: () => state.user.systemInstruction,
      getTemperature: () => state.user.temperature,
      getMaxOutputTokens: () => state.user.maxOutputTokens,
    });
    ctx.contributions.register(SH3_AI_PROVIDER_CONTRIBUTION, provider);
  },

  // Empty body — keeps the shard resident so the provider contribution
  // stays alive when no Gemini app/view is open.
  autostart() {},
};
