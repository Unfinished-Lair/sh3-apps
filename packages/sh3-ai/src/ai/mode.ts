import type {
  ShellModeDescriptor,
  ShellModeOutput,
  StreamHandle,
} from 'sh3-core';
import type { AiProvider } from './provider';
import { ConversationState } from './conversation';
import ResponseCard from './ResponseCard.svelte';

export interface AiModeDeps {
  conversation: ConversationState;
  /** Resolve the active provider at dispatch time. Returns undefined when no
   *  provider has been contributed against `SH3_AI_PROVIDER_CONTRIBUTION`. */
  getProvider: () => AiProvider | undefined;
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
  };
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
