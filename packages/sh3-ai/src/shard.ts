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
import { verbsToTools } from './ai/catalog/verb-adapter';
import { toolContributionsToTools } from './ai/catalog/tool-contribution';
import { assembleCatalog, filterByScope } from './ai/catalog/assemble';
import { makeScopeLookup, addUserScope, removeUserScope, type UserScopes } from './ai/scope/store';
import { resolveScope } from './ai/scope/resolve';
import { SCOPE_NONE, BUILTIN_SCOPES } from './ai/scope/builtins';
import { parseScopeSaveArgs } from './ai/scope/parse-args';
import { SH3_AI_TOOL_CONTRIBUTION, type ToolContribution } from './contributions';

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
        } else if (chunk.type === 'tool-call') {
          throw new Error(
            `provider emitted a tool-call chunk for a tools-less request`,
          );
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
    const state = ctx.state<{
      user: {
        activeProviderId: string | null;
        activeScopeId: string;
        scopes: UserScopes;
      };
    }>({
      user: {
        activeProviderId: null,
        activeScopeId: SCOPE_NONE.id,
        scopes: {},
      },
    });

    const getActive = (): AiProvider | undefined => {
      const list = ctx.contributions.list<AiProvider>(SH3_AI_PROVIDER_CONTRIBUTION);
      return resolveActiveProvider(list, state.user.activeProviderId);
    };

    const conversation = new ConversationState();

    function currentResolvedScope() {
      const lookup = makeScopeLookup(state.user.scopes);
      const root = lookup(state.user.activeScopeId) ?? SCOPE_NONE;
      return resolveScope(root, lookup);
    }

    function buildCatalog() {
      const verbs = ctx.listVerbs();
      const verbTools = verbsToTools(verbs, (shardId, name, args, opts) =>
        ctx.runVerb(shardId, name, args, opts),
      );
      const contribs = ctx.contributions.list<ToolContribution>(SH3_AI_TOOL_CONTRIBUTION);
      const contributionTools = toolContributionsToTools(contribs);
      const all = assembleCatalog({ verbTools, contributionTools });
      return filterByScope(all, currentResolvedScope());
    }

    registerShellMode(
      ctx,
      makeAiModeDescriptor({
        conversation,
        getProvider: () => getActive(),
        getCatalog: () => buildCatalog(),
        getScope: () => currentResolvedScope(),
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

    ctx.registerVerb({
      name: 'catalog',
      summary:
        'List the AI tool catalog under the active scope, or describe one tool. Usage: ai:catalog [<name>]',
      async run(vctx, args) {
        const catalog = buildCatalog();

        if (args.length === 0) {
          if (catalog.length === 0) {
            vctx.scrollback.push({
              kind: 'status', text: 'ai: no tools available under active scope',
              level: 'info', ts: Date.now(),
            });
            return;
          }
          const lines = catalog.map(
            (t) => `  ${t.name} — ${t.description} (${t.source})`,
          );
          vctx.scrollback.push({
            kind: 'status',
            text: `${catalog.length} tool(s):\n${lines.join('\n')}`,
            level: 'info', ts: Date.now(),
          });
          return;
        }

        const target = catalog.find((t) => t.name === args[0]);
        if (!target) {
          vctx.scrollback.push({
            kind: 'status',
            text: `ai: '${args[0]}' is not in the active catalog (denied by scope or unregistered)`,
            level: 'error', ts: Date.now(),
          });
          return;
        }
        vctx.scrollback.push({
          kind: 'status',
          text: [
            `name:        ${target.name}`,
            `description: ${target.description}`,
            `source:      ${target.source}`,
            `inputSchema: ${JSON.stringify(target.inputSchema, null, 2)}`,
          ].join('\n'),
          level: 'info', ts: Date.now(),
        });
      },
    });

    ctx.registerVerb({
      name: 'scope',
      summary:
        'List, switch, save, or delete AI permission scopes. Usage: ai:scope [<id>|clear|save <id> [opts]|delete <id>]',
      async run(vctx, args) {
        const lookup = makeScopeLookup(state.user.scopes);
        const knownIds = [
          ...BUILTIN_SCOPES.map((s) => s.id),
          ...Object.keys(state.user.scopes),
        ];

        if (args.length === 0) {
          const active = state.user.activeScopeId;
          const lines = [`scope: ${active}`, '', 'available scopes:'];
          for (const id of knownIds) {
            const s = lookup(id);
            if (!s) continue;
            lines.push(`  ${id === active ? '*' : ' '} ${s.id}  ${s.label}`);
          }
          vctx.scrollback.push({
            kind: 'status', text: lines.join('\n'), level: 'info', ts: Date.now(),
          });
          return;
        }

        const sub = args[0];

        if (sub === 'clear') {
          state.user.activeScopeId = SCOPE_NONE.id;
          conversation.reset();
          vctx.scrollback.push({
            kind: 'status', text: `scope: ${SCOPE_NONE.id}`,
            level: 'info', ts: Date.now(),
          });
          return;
        }

        if (sub === 'save') {
          try {
            const parsed = parseScopeSaveArgs(args.slice(1));
            state.user.scopes = addUserScope(state.user.scopes, {
              id: parsed.id,
              label: parsed.id,
              extends: parsed.extends.length > 0 ? parsed.extends : undefined,
              whitelist: parsed.whitelist,
              blacklist: parsed.blacklist,
            });
            vctx.scrollback.push({
              kind: 'status', text: `scope saved: ${parsed.id}`,
              level: 'info', ts: Date.now(),
            });
          } catch (err) {
            vctx.scrollback.push({
              kind: 'status',
              text: `ai: ${err instanceof Error ? err.message : String(err)}`,
              level: 'error', ts: Date.now(),
            });
          }
          return;
        }

        if (sub === 'delete') {
          const targetId = args[1];
          if (!targetId) {
            vctx.scrollback.push({
              kind: 'status', text: 'usage: ai:scope delete <id>',
              level: 'info', ts: Date.now(),
            });
            return;
          }
          try {
            state.user.scopes = removeUserScope(state.user.scopes, targetId);
            vctx.scrollback.push({
              kind: 'status', text: `scope deleted: ${targetId}`,
              level: 'info', ts: Date.now(),
            });
          } catch (err) {
            vctx.scrollback.push({
              kind: 'status',
              text: `ai: ${err instanceof Error ? err.message : String(err)}`,
              level: 'error', ts: Date.now(),
            });
          }
          return;
        }

        const target = lookup(sub);
        if (!target) {
          vctx.scrollback.push({
            kind: 'status', text: `ai: unknown scope '${sub}'`,
            level: 'error', ts: Date.now(),
          });
          return;
        }
        state.user.activeScopeId = target.id;
        conversation.reset();
        const catalog = buildCatalog();
        vctx.scrollback.push({
          kind: 'status',
          text: `scope: ${target.id} — ${catalog.length} tools available`,
          level: 'info', ts: Date.now(),
        });
      },
    });
  },

  // Empty body — keeps the shard resident so the `ai` mode and verbs are
  // reachable when no provider app/view is open.
  autostart() {},
};
