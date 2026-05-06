import type { SourceShard, ShardContext, ViewFactory, MountContext, ViewHandle } from 'sh3-core';
import { mount, unmount } from 'svelte';
import SettingsView from './views/SettingsView.svelte';
import { askGemini, GeminiError, type ModelInfo } from './gemini-client';

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
        const attempts: { model: string; error: string }[] = [];

        for (const model of chain) {
          try {
            const text = await askGemini(state.user.apiKey, prompt, model);
            vctx.scrollback.push({
              kind: 'text',
              stream: 'stdout',
              chunks: [text],
              ts: Date.now(),
            });
            return;
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            attempts.push({ model, error: msg });
            if (isAuthFailure(err)) break;
          }
        }

        const tried = attempts.map((a) => a.model).join(', ');
        const last = attempts[attempts.length - 1]?.error ?? 'unknown error';
        vctx.scrollback.push({
          kind: 'text',
          stream: 'stderr',
          chunks: [`gemini: all models failed (tried ${tried}); last error: ${last}`],
          ts: Date.now(),
        });
      },
    });
  },

  // Empty body — the hook's only job is to keep the shard resident so
  // gemini:ask is callable from the SH3 shell when the app is closed.
  autostart() {},
};
