import { geminiProvider, listModels } from './client';
import type { ProviderDef } from '../types';

export const geminiDef: ProviderDef = {
  id: 'gemini',
  label: 'Gemini',
  defaultModel: 'gemini-2.5-flash',
  createProvider: geminiProvider,
  listModels,
  copy: {
    apiKeyHelp:
      "Stored locally in your user zone. Used by the `ai` shell mode to call Google's Generative Language API.",
    apiKeyPlaceholder: 'paste your Gemini API key',
    apiKeyTestHint: 'Run `ai:ask hello` in the shell to test.',
  },
};
