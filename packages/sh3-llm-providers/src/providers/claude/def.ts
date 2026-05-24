import { claudeProvider, listModels } from './client';
import type { ProviderDef } from '../types';

export const claudeDef: ProviderDef = {
  id: 'claude',
  label: 'Claude',
  defaultModel: 'claude-haiku-4-5',
  createProvider: claudeProvider,
  listModels,
  copy: {
    apiKeyHelp:
      "Stored locally in your user zone. Used by the `ai` shell mode to call Anthropic's Messages API.",
    apiKeyPlaceholder: 'paste your Anthropic API key (sk-ant-…)',
    apiKeyTestHint: 'Run `ai:ask hello` in the shell to test.',
  },
};
