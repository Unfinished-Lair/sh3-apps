import type { SourceShard, ShardContext } from 'sh3-core';
import { registerShellMode } from 'sh3-core';
import { ConversationState } from './ai/conversation';
import { makeAiModeDescriptor } from './ai/mode';
import {
  SH3_AI_PROVIDER_CONTRIBUTION,
  type AiProvider,
  type ChatMessage,
} from './ai/provider';
import {
  resolveActiveProvider,
  formatProviderList,
  decideSwitchAction,
} from './ai/selection';

async function runOneShot(
  provider: AiProvider,
  prompt: string,
  signal: AbortSignal,
): Promise<string> {
  const chain = provider.chain();
  if (chain.length === 0) {
    throw new Error(`${provider.id}: no models configured`);
  }
  const attempts: { model: string; error: string }[] = [];
  for (const model of chain) {
    try {
      const messages: ChatMessage[] = [{ role: 'user', content: prompt }];
      let text = '';
      let done = false;
      for await (const chunk of provider.chat(messages, model, signal)) {
        if (chunk.type === 'token') {
          text += chunk.text;
        } else if (chunk.type === 'done') {
          done = true;
          break;
        }
      }
      if (!done) throw new Error('stream ended without done chunk');
      return text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      attempts.push({ model, error: msg });
      if (provider.isAuthFailure(err)) break;
    }
  }
  const tried = attempts.map((a) => a.model).join(', ');
  const last = attempts[attempts.length - 1]?.error ?? 'unknown error';
  throw new Error(`all models failed (tried ${tried}); last error: ${last}`);
}

export const shard: SourceShard = {
  manifest: {
    id: 'ai',
    label: 'AI',
    views: [],
  },

  activate(ctx: ShardContext) {
    const state = ctx.state<{ user: { activeProviderId: string | null } }>({
      user: { activeProviderId: null },
    });

    const getActive = (): AiProvider | undefined => {
      const list = ctx.contributions.list<AiProvider>(SH3_AI_PROVIDER_CONTRIBUTION);
      return resolveActiveProvider(list, state.user.activeProviderId);
    };

    const conversation = new ConversationState();

    registerShellMode(
      ctx,
      makeAiModeDescriptor({
        conversation,
        getProvider: () => getActive(),
      }),
    );

    ctx.registerVerb({
      name: 'ask',
      summary: 'Send a one-shot prompt to the active AI provider. Usage: ai:ask <prompt...>',
      async run(vctx, args) {
        if (args.length === 0) {
          vctx.scrollback.push({
            kind: 'status',
            text: 'usage: ai:ask <prompt>',
            level: 'info',
            ts: Date.now(),
          });
          return;
        }

        const provider = getActive();
        if (!provider) {
          vctx.scrollback.push({
            kind: 'text',
            stream: 'stderr',
            chunks: ['ai: no AI provider configured'],
            ts: Date.now(),
          });
          return;
        }

        const ready = provider.isReady();
        if (ready !== true) {
          vctx.scrollback.push({
            kind: 'text',
            stream: 'stderr',
            chunks: [ready],
            ts: Date.now(),
          });
          return;
        }

        const prompt = args.join(' ');
        const controller = new AbortController();
        try {
          const text = await runOneShot(provider, prompt, controller.signal);
          vctx.scrollback.push({
            kind: 'text',
            stream: 'stdout',
            chunks: [text],
            ts: Date.now(),
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          vctx.scrollback.push({
            kind: 'text',
            stream: 'stderr',
            chunks: [`ai: ${msg}`],
            ts: Date.now(),
          });
        }
      },
    });

    ctx.registerVerb({
      name: 'reset',
      summary: 'Clear the AI conversation thread (does not affect scrollback).',
      async run(vctx) {
        conversation.reset();
        vctx.scrollback.push({
          kind: 'status',
          text: 'ai: thread cleared',
          level: 'info',
          ts: Date.now(),
        });
      },
    });

    ctx.registerVerb({
      name: 'lock',
      summary: 'Pin the AI conversation to a single model. Usage: ai:lock <model-id>',
      async run(vctx, args) {
        if (args.length === 0) {
          vctx.scrollback.push({
            kind: 'status',
            text: 'usage: ai:lock <model-id>',
            level: 'info',
            ts: Date.now(),
          });
          return;
        }
        const provider = getActive();
        if (!provider) {
          vctx.scrollback.push({
            kind: 'status',
            text: 'ai: no AI provider configured',
            level: 'error',
            ts: Date.now(),
          });
          return;
        }
        const id = args[0];
        const chain = provider.chain();
        if (!chain.includes(id)) {
          vctx.scrollback.push({
            kind: 'status',
            text: `ai: '${id}' is not in the provider's model chain`,
            level: 'error',
            ts: Date.now(),
          });
          return;
        }
        conversation.setLock(id);
        vctx.scrollback.push({
          kind: 'status',
          text: `ai: locked to ${id}`,
          level: 'info',
          ts: Date.now(),
        });
      },
    });

    ctx.registerVerb({
      name: 'unlock',
      summary: 'Release the AI model lock and resume chain iteration.',
      async run(vctx) {
        conversation.setLock(null);
        vctx.scrollback.push({
          kind: 'status',
          text: 'ai: model lock released',
          level: 'info',
          ts: Date.now(),
        });
      },
    });

    ctx.registerVerb({
      name: 'provider',
      summary:
        'List AI providers or switch the active one. Usage: ai:provider [<id>]',
      async run(vctx, args) {
        const list = ctx.contributions.list<AiProvider>(
          SH3_AI_PROVIDER_CONTRIBUTION,
        );

        if (args.length === 0) {
          vctx.scrollback.push({
            kind: 'status',
            text: formatProviderList(list, state.user.activeProviderId),
            level: 'info',
            ts: Date.now(),
          });
          return;
        }

        const requested = args[0];
        const action = decideSwitchAction(
          list,
          state.user.activeProviderId,
          requested,
        );

        switch (action.kind) {
          case 'no-providers':
          case 'unknown':
            vctx.scrollback.push({
              kind: 'status',
              text: action.message,
              level: 'error',
              ts: Date.now(),
            });
            return;
          case 'already-active':
            vctx.scrollback.push({
              kind: 'status',
              text: action.message,
              level: 'info',
              ts: Date.now(),
            });
            return;
          case 'switched':
            state.user.activeProviderId = action.newActiveId;
            // Different providers have different model namespaces and likely
            // different system instructions; carrying messages across is unsafe.
            conversation.reset();
            vctx.scrollback.push({
              kind: 'status',
              text: action.message,
              level: 'info',
              ts: Date.now(),
            });
            return;
        }
      },
    });
  },

  // Empty body — keeps the shard resident so the `ai` mode and verbs are
  // reachable when no provider app/view is open.
  autostart() {},
};
