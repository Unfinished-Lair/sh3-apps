import type {
  SourceShard,
  ShardContext,
  ViewFactory,
  ViewHandle,
  MountContext,
  LayoutNode,
} from 'sh3-core';
import { registerShellMode, sh3 } from 'sh3-core';
import { mount, unmount } from 'svelte';
import Conversations from './ai/conversations/Conversations.svelte';
import ScopeList from './rich/ScopeList.svelte';
import Defaults from './ai/Defaults.svelte';
import Sketch from './ai/sketch/Sketch.svelte';
import SaveSketchPrompt from './ai/sketch/SaveSketchPrompt.svelte';

const CONVERSATIONS_VIEW_ID = 'ai:conversations';
const CONVERSATIONS_FLOAT_TITLE = 'AI Conversations';
const DEFAULTS_VIEW_ID = 'ai:defaults';
const DEFAULTS_FLOAT_TITLE = 'AI Defaults';
const SKETCH_VIEW_ID = 'ai:sketch';
const SKETCH_FLOAT_TITLE = 'AI Sketch';
const SAVE_PROMPT_VIEW_ID = 'ai:sketch.save-prompt';

function nodeContainsView(node: LayoutNode, viewId: string): boolean {
  if (node.type === 'slot') return node.viewId === viewId;
  if (node.type === 'tabs') return node.tabs.some((t) => t.viewId === viewId);
  if (node.type === 'split') return node.children.some((c) => nodeContainsView(c, viewId));
  return false;
}

function focusOrOpenConversations(): void {
  for (const f of sh3.float.list()) {
    if (nodeContainsView(f.content, CONVERSATIONS_VIEW_ID)) {
      sh3.float.focus(f.id);
      return;
    }
  }
  sh3.float.open(CONVERSATIONS_VIEW_ID, {
    title: CONVERSATIONS_FLOAT_TITLE,
    size: { w: 480, h: 560 },
  });
}

function focusOrOpenDefaults(): void {
  for (const f of sh3.float.list()) {
    if (nodeContainsView(f.content, DEFAULTS_VIEW_ID)) {
      sh3.float.focus(f.id);
      return;
    }
  }
  sh3.float.open(DEFAULTS_VIEW_ID, {
    title: DEFAULTS_FLOAT_TITLE,
    size: { w: 520, h: 520 },
  });
}

function focusOrOpenSketch(): void {
  for (const f of sh3.float.list()) {
    if (nodeContainsView(f.content, SKETCH_VIEW_ID)) {
      sh3.float.focus(f.id);
      return;
    }
  }
  sh3.float.open(SKETCH_VIEW_ID, {
    title: SKETCH_FLOAT_TITLE,
    size: { w: 720, h: 540 },
  });
}
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
import { actionsToTools } from './ai/catalog/action-adapter';
import { assembleCatalog, filterByScope } from './ai/catalog/assemble';
import { makeScopeLookup, addUserScope, removeUserScope, type UserScopes } from './ai/scope/store';
import { resolveScope } from './ai/scope/resolve';
import { SCOPE_NONE, BUILTIN_SCOPES } from './ai/scope/builtins';
import { parseScopeSaveArgs } from './ai/scope/parse-args';
import {
  SH3_AI_TOOL_CONTRIBUTION,
  SH3_AI_CONFIG_MENU_CONTRIBUTION,
  type ToolContribution,
  type AiConfigMenuItem,
} from './contributions';
import { ConversationStore } from './ai/conversations/store';
import type { ConversationDocument } from './ai/conversations/types';
import { firstMessageTitle, llmSummarizeTitle } from './ai/conversations/title-strategy';
import { replayConversationToScrollback } from './ai/conversations/replay';
import { DocsStore } from './ai/docs/store';
import { makeDocTools } from './ai/docs/tools';
import { SketchState } from './ai/sketch/state';
import { makeSketchTools } from './ai/sketch/tools';

async function runOneShot(
  provider: AiProvider,
  prompt: string,
  signal: AbortSignal,
  systemInstruction?: string,
  idleTimeoutMs?: number,
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
      for await (const chunk of provider.chat(messages, model, signal, { systemInstruction, idleTimeoutMs })) {
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
    views: [
      { id: CONVERSATIONS_VIEW_ID, label: 'AI Conversations', standalone: true },
      { id: DEFAULTS_VIEW_ID, label: 'AI Defaults', standalone: true },
      { id: SKETCH_VIEW_ID, label: 'AI Sketch', standalone: true },
      { id: SAVE_PROMPT_VIEW_ID, label: 'Save AI Sketch', standalone: true },
    ],
  },

  async activate(ctx: ShardContext) {
    const state = ctx.state<{
      user: {
        activeProviderId: string | null;
        activeScopeId: string;
        scopes: UserScopes;
        activeConversationId: string | null;
        titleStrategy: 'first-message' | 'llm-summarize';
        systemInstruction: string;
        /** Streaming idle timeout in milliseconds — abort if no chunk for
         *  this long. `0` = no internal watchdog (only the external signal
         *  cancels). Default 60_000 preserves the previous hard-coded
         *  behavior the providers used. */
        idleTimeoutMs: number;
      };
    }>({
      user: {
        activeProviderId: null,
        activeScopeId: SCOPE_NONE.id,
        scopes: {},
        activeConversationId: null,
        titleStrategy: 'first-message',
        systemInstruction: '',
        idleTimeoutMs: 60_000,
      },
    });

    const getActive = (): AiProvider | undefined => {
      const list = ctx.contributions.list<AiProvider>(SH3_AI_PROVIDER_CONTRIBUTION);
      return resolveActiveProvider(list, state.user.activeProviderId);
    };

    const conversation = new ConversationState();
    const docHandle = ctx.documents({ format: 'text', extensions: ['.json'] });
    const store = new ConversationStore(docHandle);

    // Separate handle (no extensions filter) for the AI-managed docs zone.
    // Same backend, different scope — the store filters to `docs/` paths.
    const docsHandle = ctx.documents({ format: 'text' });
    const docsStore = new DocsStore(docsHandle);

    const sketchState = new SketchState();

    function openSavePrompt(): void {
      const snap = sketchState.current;
      const providerId = state.user.activeProviderId;
      if (!snap) {
        sh3.toast.notify('AI Sketch: nothing to save.', { level: 'warn' });
        return;
      }
      if (!providerId) {
        sh3.toast.notify('AI Sketch: no active AI provider.', { level: 'warn' });
        return;
      }
      sh3.float.open(SAVE_PROMPT_VIEW_ID, {
        title: 'Save AI Sketch',
        size: { w: 360, h: 160 },
        dismissable: true,
        meta: { providerId, html: snap.html },
      });
    }

    const sketchFactory: ViewFactory = {
      mount(container: HTMLElement, _mctx: MountContext): ViewHandle {
        const instance = mount(Sketch, {
          target: container,
          props: { state: sketchState, onSave: openSavePrompt },
        });
        return {
          unmount() { unmount(instance); },
          closable: true,
        };
      },
    };
    ctx.registerView(SKETCH_VIEW_ID, sketchFactory);

    const savePromptFactory: ViewFactory = {
      mount(container: HTMLElement, mctx: MountContext): ViewHandle {
        const meta = (mctx.meta ?? {}) as { providerId?: string; html?: string };
        const loc = mctx.location();
        const floatId = loc?.kind === 'float' ? loc.floatId : null;
        if (!meta.providerId || meta.html == null || !floatId) {
          return { unmount() {}, closable: true };
        }
        const instance = mount(SaveSketchPrompt, {
          target: container,
          props: {
            providerId: meta.providerId,
            html: meta.html,
            store: docsStore,
            onClose: () => sh3.float.close(floatId),
          },
        });
        return {
          unmount() { unmount(instance); },
          closable: true,
        };
      },
    };
    ctx.registerView(SAVE_PROMPT_VIEW_ID, savePromptFactory);

    ctx.actions.register({
      id: 'sh3-ai:sketch.open',
      label: 'AI Sketch: Open',
      scope: ['home', 'app'],
      paletteItem: true,
      contextItem: false,
      group: 'AI',
      run() { focusOrOpenSketch(); },
    });

    ctx.actions.register({
      id: 'sh3-ai:sketch.save',
      label: 'AI Sketch: Save…',
      scope: ['home', 'app'],
      paletteItem: true,
      contextItem: false,
      group: 'AI',
      run() { openSavePrompt(); },
    });

    // Restore the previously-active conversation (if any) so the user
    // re-enters where they left off after a reload.
    if (state.user.activeConversationId) {
      const id = state.user.activeConversationId;
      let doc: ConversationDocument | null = null;
      try {
        doc = await store.load(id);
      } catch (err) {
        console.warn(`sh3-ai: failed to load active conversation ${id}: ${(err as Error).message}`);
      }
      if (doc) {
        conversation.bindTo(doc, store.autosave(doc.id));
        // Restore provider+model when possible.
        if (doc.providerId) {
          const list = ctx.contributions.list<AiProvider>(SH3_AI_PROVIDER_CONTRIBUTION);
          const found = list.find((p) => p.id === doc!.providerId);
          if (found) {
            state.user.activeProviderId = found.id;
            if (doc.model && found.chain().includes(doc.model)) {
              conversation.setLock(doc.model);
            }
          } else {
            console.warn(
              `sh3-ai: conversation '${doc.title || doc.id}' was authored with provider '${doc.providerId}' which is no longer registered.`,
            );
          }
        }
      } else {
        // Active id pointed to a missing doc — clear the pointer.
        state.user.activeConversationId = null;
      }
    }

    function currentResolvedScope() {
      const lookup = makeScopeLookup(state.user.scopes);
      const root = lookup(state.user.activeScopeId) ?? SCOPE_NONE;
      return resolveScope(root, lookup);
    }

    function buildCatalog() {
      // Programmatic-only: skip verbs that can only be driven from a real
      // terminal (e.g. ai:provider, ai:lock). They'd reject under runVerb
      // anyway and previously enticed the LLM into infinite retry loops.
      const verbs = ctx.listVerbs({ programmaticOnly: true });
      const verbTools = verbsToTools(verbs, (shardId, name, args, opts) =>
        ctx.runVerb(shardId, name, args, opts),
      );
      const contribs = ctx.contributions.list<ToolContribution>(SH3_AI_TOOL_CONTRIBUTION);
      const contributionTools = toolContributionsToTools(contribs);
      // Built per-turn so the active provider id is baked into the
      // descriptions the LLM sees — no self-introspection needed.
      const docTools = makeDocTools({
        store: docsStore,
        activeProviderId: state.user.activeProviderId,
      });
      const sketchTools = makeSketchTools({
        state: sketchState,
        isViewOpen: () =>
          sh3.float.list().some((f) => nodeContainsView(f.content, SKETCH_VIEW_ID)),
      });
      // Snapshot of currently-dispatchable palette actions, refreshed per
      // turn so the LLM sees the same context-filtered set the user does.
      const active = sh3.actions.listActive();
      const actionTools = actionsToTools(active, (id, opts) =>
        ctx.runAction(id, opts),
      );
      const all = assembleCatalog({
        verbTools,
        contributionTools: [...contributionTools, ...docTools, ...sketchTools],
        actionTools,
      });
      return filterByScope(all, currentResolvedScope());
    }

    function rotateConversation() {
      conversation.detach();
      state.user.activeConversationId = null;
      // Lazy creation in dispatch will pick up from here.
    }

    async function ensureActiveConversation() {
      if (conversation.id) return;
      const provider = getActive();
      const doc = await store.create({
        providerId: provider?.id ?? null,
        model: conversation.lockedModel,
      });
      conversation.bindTo(doc, store.autosave(doc.id));
      state.user.activeConversationId = doc.id;
    }

    async function onTurnComplete() {
      if (!conversation.id || conversation.title) return;
      const firstUser = conversation.messages.find((m) => m.role === 'user');
      const firstAssistant = conversation.messages.find((m) => m.role === 'assistant');
      if (!firstUser || !firstAssistant) return;

      let title: string;
      if (state.user.titleStrategy === 'llm-summarize') {
        const provider = getActive();
        if (provider) {
          title = await llmSummarizeTitle(
            (p, sig) => runOneShot(
              provider, p, sig,
              state.user.systemInstruction || undefined,
              state.user.idleTimeoutMs,
            ),
            firstUser.content,
            firstAssistant.content,
            new AbortController().signal,
          );
        } else {
          title = firstMessageTitle(firstUser.content);
        }
      } else {
        title = firstMessageTitle(firstUser.content);
      }
      try {
        await store.rename(conversation.id, title);
        conversation.title = title;
      } catch (err) {
        console.warn(`sh3-ai: failed to persist title: ${(err as Error).message}`);
      }
    }

    const conversationsFactory: ViewFactory = {
      mount(container: HTMLElement, _mctx: MountContext): ViewHandle {
        const instance = mount(Conversations, {
          target: container,
          props: {
            store,
            getActiveId: () => state.user.activeConversationId,
            onActivate: async (id: string) => {
              const r = sh3.dispatchToTerminal(`ai:open ${id}`);
              if (r.ok) return;
              // No terminal (or ambiguous focus) — bind silently so the
              // selection sticks, and tell the user why nothing rendered.
              await openConversationById(id);
              sh3.toast.notify(
                r.error === 'no-terminal'
                  ? 'AI conversation loaded. Open a terminal to see the transcript.'
                  : 'AI conversation loaded. Focus a terminal to see the transcript.',
                { level: 'warn' },
              );
            },
            onNew: () => newConversation().then(() => undefined),
            onRename: renameConversationById,
            onDelete: deleteConversationById,
          },
        });
        return {
          unmount() { unmount(instance); },
          closable: true,
        };
      },
    };
    ctx.registerView(CONVERSATIONS_VIEW_ID, conversationsFactory);

    const defaultsFactory: ViewFactory = {
      mount(container: HTMLElement, _mctx: MountContext): ViewHandle {
        const instance = mount(Defaults, {
          target: container,
          props: { state: state.user },
        });
        return {
          unmount() { unmount(instance); },
          closable: true,
        };
      },
    };
    ctx.registerView(DEFAULTS_VIEW_ID, defaultsFactory);

    // Command Palette: parent submenu "AI Configuration..." with built-in
    // "Conversations" + "Defaults" children, plus dynamic children registered
    // by other shards against SH3_AI_CONFIG_MENU_CONTRIBUTION (e.g. provider
    // settings).
    ctx.actions.register({
      id: 'sh3-ai:open-config',
      label: 'AI Configuration...',
      scope: ['home', 'app'],
      paletteItem: true,
      contextItem: false,
      group: 'Settings',
      submenu: true,
    });
    ctx.actions.register({
      id: 'sh3-ai:open-config.conversations',
      label: 'Conversations',
      scope: ['home', 'app'],
      submenuOf: 'sh3-ai:open-config',
      run() {
        focusOrOpenConversations();
      },
    });
    ctx.actions.register({
      id: 'sh3-ai:open-config.defaults',
      label: 'AI Defaults',
      scope: ['home', 'app'],
      submenuOf: 'sh3-ai:open-config',
      run() {
        focusOrOpenDefaults();
      },
    });

    const configMenuDisposers = new Map<string, () => void>();
    function reconcileConfigMenu() {
      for (const dispose of configMenuDisposers.values()) dispose();
      configMenuDisposers.clear();
      const items = ctx.contributions.list<AiConfigMenuItem>(
        SH3_AI_CONFIG_MENU_CONTRIBUTION,
      );
      for (const item of items) {
        if (configMenuDisposers.has(item.id)) continue;
        const dispose = ctx.actions.register({
          id: `sh3-ai:open-config.${item.id}`,
          label: item.label,
          scope: ['home', 'app'],
          submenuOf: 'sh3-ai:open-config',
          run() {
            item.run();
          },
        });
        configMenuDisposers.set(item.id, dispose);
      }
    }
    ctx.contributions.onChange(SH3_AI_CONFIG_MENU_CONTRIBUTION, reconcileConfigMenu);
    reconcileConfigMenu();

    registerShellMode(
      ctx,
      makeAiModeDescriptor({
        conversation,
        getProvider: () => getActive(),
        getCatalog: () => buildCatalog(),
        getScope: () => currentResolvedScope(),
        ensureActiveConversation,
        onTurnComplete,
        getSystemInstruction: () => state.user.systemInstruction || undefined,
        getIdleTimeoutMs: () => state.user.idleTimeoutMs,
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
          const text = await runOneShot(
            provider, prompt, controller.signal,
            state.user.systemInstruction || undefined,
            state.user.idleTimeoutMs,
          );
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

    // View-facing helpers. The Conversations browser view (ai:conversations)
    // calls these via its mount-time props. No verbs in this version —
    // conversation management is fully driven through the view.

    async function newConversation(): Promise<ConversationDocument> {
      if (conversation.id) conversation.detach();
      const provider = getActive();
      const doc = await store.create({
        providerId: provider?.id ?? null,
        model: conversation.lockedModel,
      });
      conversation.bindTo(doc, store.autosave(doc.id));
      state.user.activeConversationId = doc.id;
      return doc;
    }

    async function openConversationById(id: string): Promise<ConversationDocument | null> {
      const doc = await store.load(id);
      if (!doc) return null;
      if (conversation.id !== doc.id) conversation.detach();
      conversation.bindTo(doc, store.autosave(doc.id));
      state.user.activeConversationId = doc.id;
      // Restore provider+model when possible.
      if (doc.providerId) {
        const list = ctx.contributions.list<AiProvider>(SH3_AI_PROVIDER_CONTRIBUTION);
        const found = list.find((p) => p.id === doc.providerId);
        if (found) {
          state.user.activeProviderId = found.id;
          if (doc.model && found.chain().includes(doc.model)) {
            conversation.setLock(doc.model);
          }
        } else {
          console.warn(
            `sh3-ai: conversation '${doc.title || doc.id}' was authored on '${doc.providerId}' which is no longer registered.`,
          );
        }
      }
      return doc;
    }

    async function renameConversationById(id: string, newTitle: string): Promise<void> {
      await store.rename(id, newTitle);
      if (conversation.id === id) conversation.title = newTitle;
    }

    async function deleteConversationById(id: string): Promise<void> {
      if (conversation.id === id) {
        // Refuse silently — the view should hide delete on the active row.
        // But accept it as a rotation if it slips through: detach then delete.
        conversation.detach();
        state.user.activeConversationId = null;
      }
      await store.delete(id);
    }

    ctx.registerVerb({
      name: 'reset',
      globalVerb: true,
      summary: 'Start a fresh AI conversation. The previous conversation stays saved.',
      async run(vctx) {
        const prevTitle = conversation.title || conversation.id;
        rotateConversation();
        vctx.scrollback.clear();
        vctx.scrollback.push({
          kind: 'status',
          text: prevTitle
            ? `ai: new conversation started (was '${prevTitle}')`
            : 'ai: new conversation started',
          level: 'info',
          ts: Date.now(),
        });
      },
    });

    ctx.registerVerb({
      name: 'open',
      summary: 'Load a saved AI conversation into this terminal. Usage: ai:open <id>',
      globalVerb: true,
      async run(vctx, args) {
        if (args.length === 0) {
          vctx.scrollback.push({
            kind: 'status',
            text: 'usage: ai:open <id>',
            level: 'info',
            ts: Date.now(),
          });
          return;
        }
        const id = args[0];
        const doc = await openConversationById(id);
        if (!doc) {
          vctx.scrollback.push({
            kind: 'status',
            text: `ai: conversation '${id}' not found`,
            level: 'error',
            ts: Date.now(),
          });
          return;
        }
        vctx.scrollback.clear();
        replayConversationToScrollback(doc, vctx.scrollback, vctx.cwd);
        vctx.scrollback.push({
          kind: 'status',
          text: `ai: opened '${doc.title || doc.id}'`,
          level: 'info',
          ts: Date.now(),
        });
      },
    });

    ctx.registerVerb({
      name: 'lock',
      globalVerb: true,
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
      globalVerb: true,
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
      globalVerb: true,
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
            rotateConversation();
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
      globalVerb: true,
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
      globalVerb: true,
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
          const scopes: Array<{ id: string; label: string; isActive: boolean }> = [];
          for (const id of knownIds) {
            const s = lookup(id);
            if (!s) continue;
            scopes.push({ id: s.id, label: s.label, isActive: s.id === active });
          }
          vctx.scrollback.push({
            kind: 'rich',
            component: ScopeList,
            props: {
              data: {
                scopes,
                onSelectScope: (id: string) => {
                  void vctx.dispatch(`ai:scope ${id}`);
                },
              },
            },
            ts: Date.now(),
          });
          return;
        }

        const sub = args[0];

        if (sub === 'clear') {
          state.user.activeScopeId = SCOPE_NONE.id;
          rotateConversation();
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
        rotateConversation();
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
