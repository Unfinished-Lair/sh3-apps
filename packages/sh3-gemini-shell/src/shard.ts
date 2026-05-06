import type { SourceShard, ShardContext, ViewFactory, MountContext, ViewHandle } from 'sh3-core';
import { registerShellMode } from 'sh3-core';
import { mount, unmount } from 'svelte';
import SettingsView from './views/SettingsView.svelte';
import {
  askOnce,
  iterateChain,
  geminiProvider,
  GeminiError,
  type ModelInfo,
} from './gemini-client';
import { ConversationState } from './ai/conversation';
import { makeAiModeDescriptor } from './ai/mode';

interface GeminiUserState {
  apiKey: string;
  modelChain: string[];
}

interface GeminiSessionState {
  knownModels: ModelInfo[];
  modelsLastFetchedAt: number | null;
}

function isAuthFailure(err: unknown): boolean {
  return err instanceof GeminiError && (err.status === 400 || err.status === 401 || err.status === 403);
}

export const shard: SourceShard = {
  manifest: {
    id: 'gemini',
    label: 'Gemini',
    views: [{ id: 'gemini:settings', label: 'Gemini Settings' }],
  },

  activate(ctx: ShardContext) {
    const state = ctx.state<{ user: GeminiUserState; session: GeminiSessionState }>({
      user: { apiKey: '', modelChain: ['gemini-2.5-flash'] },
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
    });
    const conversation = new ConversationState();
    registerShellMode(
      ctx,
      makeAiModeDescriptor({
        provider,
        conversation,
        hasApiKey: () => state.user.apiKey.length > 0,
      }),
    );

    ctx.registerVerb({
      name: 'ask',
      summary: 'Send a prompt to Gemini and print the answer. Usage: ask <prompt...>',
      async run(vctx, args) {
        if (args.length === 0) {
          vctx.scrollback.push({
            kind: 'status',
            text: 'usage: gemini:ask <prompt>',
            level: 'info',
            ts: Date.now(),
          });
          return;
        }

        if (!state.user.apiKey) {
          vctx.scrollback.push({
            kind: 'text',
            stream: 'stderr',
            chunks: ['gemini: no API key configured. Open the Gemini app to set one.'],
            ts: Date.now(),
          });
          return;
        }

        const chain =
          state.user.modelChain.length > 0
            ? state.user.modelChain
            : ['gemini-2.5-flash'];
        const prompt = args.join(' ');

        try {
          const { value } = await iterateChain(
            chain,
            isAuthFailure,
            (model) => askOnce(state.user.apiKey, prompt, model),
          );
          vctx.scrollback.push({
            kind: 'text',
            stream: 'stdout',
            chunks: [value],
            ts: Date.now(),
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          vctx.scrollback.push({
            kind: 'text',
            stream: 'stderr',
            chunks: [`gemini: ${msg}`],
            ts: Date.now(),
          });
        }
      },
    });

    ctx.registerVerb({
      name: 'reset',
      summary: 'Clear the Gemini conversation thread (does not affect scrollback).',
      async run(vctx) {
        conversation.reset();
        vctx.scrollback.push({
          kind: 'status',
          text: 'gemini: thread cleared',
          level: 'info',
          ts: Date.now(),
        });
      },
    });

    ctx.registerVerb({
      name: 'lock',
      summary: 'Pin the Gemini conversation to a single model. Usage: lock <model-id>',
      async run(vctx, args) {
        if (args.length === 0) {
          vctx.scrollback.push({
            kind: 'status',
            text: 'usage: gemini:lock <model-id>',
            level: 'info',
            ts: Date.now(),
          });
          return;
        }
        const id = args[0];
        const chain = state.user.modelChain;
        if (!chain.includes(id)) {
          vctx.scrollback.push({
            kind: 'status',
            text: `gemini: '${id}' is not in your model chain`,
            level: 'error',
            ts: Date.now(),
          });
          return;
        }
        conversation.setLock(id);
        vctx.scrollback.push({
          kind: 'status',
          text: `gemini: locked to ${id}`,
          level: 'info',
          ts: Date.now(),
        });
      },
    });

    ctx.registerVerb({
      name: 'unlock',
      summary: 'Release the Gemini model lock and resume chain iteration.',
      async run(vctx) {
        conversation.setLock(null);
        vctx.scrollback.push({
          kind: 'status',
          text: 'gemini: model lock released',
          level: 'info',
          ts: Date.now(),
        });
      },
    });
  },

  // Empty body — the hook keeps the shard resident so verbs and the mode are
  // reachable when no Gemini app/view is open.
  autostart() {},
};
