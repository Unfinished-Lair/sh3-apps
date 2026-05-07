import type {
  ShellModeDescriptor,
  ShellModeOutput,
  StreamHandle,
} from 'sh3-core';
import type { AiProvider } from './provider';
import { ConversationState } from './conversation';
import ResponseCard from './ResponseCard.svelte';
import type { Tool } from './catalog/types';
import type { ResolvedScope } from './scope/types';
import { dispatchLoop } from './dispatch/loop';
import { makeOutputTranscript } from './dispatch/transcript';

export interface AiModeDeps {
  conversation: ConversationState;
  /** Resolve the active provider at dispatch time. Returns undefined when no
   *  provider has been contributed against `SH3_AI_PROVIDER_CONTRIBUTION`. */
  getProvider: () => AiProvider | undefined;
  /** Build the catalog of tools available under the active scope. When empty
   *  (or omitted), the dispatch falls back to chat-only with chain fallback. */
  getCatalog?: () => Tool[];
  /** Resolved scope used by the dispatch loop to re-check each tool call. */
  getScope?: () => ResolvedScope;
  /** Ensure a ConversationState binding exists before the user message is
   *  appended. Called at the top of dispatch when the state is unbound. */
  ensureActiveConversation?: () => Promise<void>;
  /** Hook fired after a successful turn (chat-only or tool path). The shard
   *  uses this to apply the title strategy on the first turn. */
  onTurnComplete?: () => Promise<void>;
}

export function makeAiModeDescriptor(deps: AiModeDeps): ShellModeDescriptor {
  return {
    id: 'ai',
    label: 'AI',
    runsOn: 'client',
    autoRelocate: false,
    activate: () => deps.conversation.reset(),
    deactivate: () => deps.conversation.reset(),
    dispatch: makeAiDispatch(deps),
  };
}

function makeAiDispatch(deps: AiModeDeps) {
  return async (
    input: { line: string; cwd: string; signal: AbortSignal },
    output: ShellModeOutput,
  ): Promise<void> => {
    const { conversation } = deps;

    const provider = deps.getProvider();
    if (!provider) {
      output.status('error', 'sh3-ai: no AI provider configured');
      return;
    }

    const ready = provider.isReady();
    if (ready !== true) {
      output.status('error', ready);
      return;
    }

    if (deps.ensureActiveConversation) {
      try {
        await deps.ensureActiveConversation();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        output.status('error', `sh3-ai: ${msg}`);
        return;
      }
    }

    const catalog = deps.getCatalog?.() ?? [];
    if (catalog.length > 0) {
      await runToolDispatch(provider, conversation, catalog, deps.getScope!(), input, output);
      if (deps.onTurnComplete) {
        try { await deps.onTurnComplete(); } catch { /* non-fatal */ }
      }
      return;
    }

    conversation.appendUser(input.line);

    const chain = conversation.lockedModel ? [conversation.lockedModel] : provider.chain();
    if (chain.length === 0) {
      output.status('error', `${provider.id}: no models configured`);
      conversation.popLastUser();
      return;
    }

    const handle = output.stream(ResponseCard, {
      markdown: '',
      model: null,
      locked: !!conversation.lockedModel,
      __aiCard: true,
    });

    await runChatTurn(provider, conversation, chain, input.signal, handle);

    if (deps.onTurnComplete) {
      try { await deps.onTurnComplete(); } catch { /* non-fatal */ }
    }
  };
}

/**
 * Tool-aware dispatch: single model, no chain fallback. Assistant text and
 * tool-call activity stream through `output.text` / `output.status` rather
 * than the ResponseCard so tool-call status interleaves correctly with
 * inline text.
 */
async function runToolDispatch(
  provider: AiProvider,
  conversation: ConversationState,
  catalog: Tool[],
  scope: ResolvedScope,
  input: { line: string; cwd: string; signal: AbortSignal },
  output: ShellModeOutput,
): Promise<void> {
  const chain = conversation.lockedModel ? [conversation.lockedModel] : provider.chain();
  if (chain.length === 0) {
    output.status('error', `${provider.id}: no models configured`);
    return;
  }
  const model = chain[0];
  try {
    await dispatchLoop({
      prompt: input.line,
      catalog,
      scope,
      conversation,
      provider,
      model,
      signal: input.signal,
      transcript: makeOutputTranscript(output),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    output.status('error', `sh3-ai: ${msg}`);
  }
}

async function runChatTurn(
  provider: AiProvider,
  conversation: ConversationState,
  chain: string[],
  signal: AbortSignal,
  handle: StreamHandle,
): Promise<void> {
  const attempts: { model: string; error: string }[] = [];

  for (const model of chain) {
    let markdown = '';
    let firstToken = true;
    let succeeded = false;

    try {
      for await (const chunk of provider.chat(conversation.messages, model, signal)) {
        if (signal.aborted) {
          handle.error(new DOMException('aborted', 'AbortError'));
          conversation.popLastUser();
          return;
        }
        if (chunk.type === 'token') {
          if (firstToken) {
            handle.append({ model });
            firstToken = false;
          }
          markdown += chunk.text;
          handle.append({ markdown });
        } else if (chunk.type === 'done') {
          handle.complete();
          conversation.appendAssistant(markdown, model);
          succeeded = true;
          break;
        }
      }
      if (succeeded) return;
    } catch (err) {
      if (signal.aborted) {
        handle.error(err);
        conversation.popLastUser();
        return;
      }
      const msg = err instanceof Error ? err.message : String(err);
      attempts.push({ model, error: msg });
      if (provider.isAuthFailure(err)) break;
      if (conversation.lockedModel) break;
    }
  }

  const tried = attempts.map((a) => a.model).join(', ');
  const last = attempts[attempts.length - 1]?.error ?? 'unknown error';
  const summary = conversation.lockedModel
    ? `locked model ${conversation.lockedModel} failed: ${last}`
    : `all models failed (tried ${tried}); last error: ${last}`;
  handle.error(new Error(summary));
  conversation.popLastUser();
}
