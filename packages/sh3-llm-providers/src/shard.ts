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
import { PROVIDERS } from './providers/registry';
import type {
  ProviderUserState,
  ProviderSessionState,
  ProviderDef,
} from './providers/types';

// String contracts with sh3-ai. Mirror the constants exported from
// sh3-ai/src/contributions.ts and sh3-ai/src/ai/provider.ts. Inlined (not
// imported) because bare cross-shard imports fail at SH3 install time — the
// providing shard's package is not part of the consuming shard's bundle.
const SH3_AI_PROVIDER_CONTRIBUTION = 'sh3-ai.provider';
const SH3_AI_CONFIG_MENU_CONTRIBUTION = 'sh3-ai.configMenu';

interface Tree {
  user: Record<string, ProviderUserState>;
  session: Record<string, ProviderSessionState>;
}

function nodeContainsView(node: LayoutNode, viewId: string): boolean {
  if (node.type === 'slot') return node.viewId === viewId;
  if (node.type === 'tabs') return node.tabs.some((t) => t.viewId === viewId);
  if (node.type === 'split') return node.children.some((c) => nodeContainsView(c, viewId));
  return false;
}

function focusOrOpenSettings(viewId: string, title: string): void {
  for (const f of shell.float.list()) {
    if (nodeContainsView(f.content, viewId)) {
      shell.float.focus(f.id);
      return;
    }
  }
  shell.float.open(viewId, {
    title,
    size: { w: 520, h: 640 },
  });
}

// The artifact-builder regex detects shards by the literal pattern
// `views: [` in the bundled output, so we keep this declaration as a
// hand-written array literal rather than `PROVIDERS.map(...)`. Keep the
// entries here in sync with PROVIDERS in providers/registry.ts — the
// runtime registration loop in activate() iterates PROVIDERS.
export const shard: SourceShard = {
  manifest: {
    id: 'llm-providers',
    label: 'LLM Providers',
    views: [
      { id: 'deepseek:settings', label: 'DeepSeek Settings', standalone: true },
      { id: 'gemini:settings', label: 'Gemini Settings', standalone: true },
    ],
  },

  activate(ctx: ShardContext) {
    const initial: Tree = { user: {}, session: {} };
    for (const p of PROVIDERS) {
      initial.user[p.id] = {
        apiKey: '',
        modelChain: [p.defaultModel],
        temperature: null,
        maxOutputTokens: null,
      };
      initial.session[p.id] = { knownModels: [], modelsLastFetchedAt: null };
    }
    const state = ctx.state<Tree>(initial);

    for (const p of PROVIDERS) {
      registerProvider(ctx, p, state);
    }
  },

  // Empty body — keeps the shard resident so provider contributions and
  // palette actions stay alive even when no app/view is open.
  autostart() {},
};

function registerProvider(
  ctx: ShardContext,
  p: ProviderDef,
  state: Tree,
): void {
  const viewId = `${p.id}:settings`;
  const floatTitle = `${p.label} Settings`;

  const factory: ViewFactory = {
    mount(container: HTMLElement, _mctx: MountContext): ViewHandle {
      const instance = mount(SettingsView, {
        target: container,
        props: {
          def: p,
          state: state.user[p.id],
          session: state.session[p.id],
        },
      });
      return {
        unmount() { unmount(instance); },
        closable: true,
      };
    },
  };
  ctx.registerView(viewId, factory);

  const provider = p.createProvider({
    getApiKey: () => state.user[p.id].apiKey,
    getChain: () => {
      const c = state.user[p.id].modelChain;
      return c.length > 0 ? c : [p.defaultModel];
    },
    getTemperature: () => state.user[p.id].temperature,
    getMaxOutputTokens: () => state.user[p.id].maxOutputTokens,
  });
  ctx.contributions.register(SH3_AI_PROVIDER_CONTRIBUTION, provider);

  ctx.contributions.register(SH3_AI_CONFIG_MENU_CONTRIBUTION, {
    id: `${p.id}.settings`,
    label: p.label,
    run: () => focusOrOpenSettings(viewId, floatTitle),
  });
}
