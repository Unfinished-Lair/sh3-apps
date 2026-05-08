import { deepseekProvider, listModels } from './client';
import type { ProviderDef } from '../types';

export const deepseekDef: ProviderDef = {
  id: 'deepseek',
  label: 'DeepSeek',
  defaultModel: 'deepseek-chat',
  createProvider: deepseekProvider,
  listModels,
  copy: {
    apiKeyHelp:
      "Stored locally in your user zone. Used by the `ai` shell mode to call DeepSeek's OpenAI-compatible Chat Completions API.",
    apiKeyPlaceholder: 'paste your DeepSeek API key',
    apiKeyTestHint: 'Run `ai:ask hello` in the shell to test.',
  },
};
