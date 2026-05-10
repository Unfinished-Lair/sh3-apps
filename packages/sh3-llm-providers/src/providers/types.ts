import type { AiProvider } from 'sh3-ai';

export interface ModelInfo {
  id: string;
  displayName: string;
}

export interface ProviderUserState extends Record<string, unknown> {
  apiKey: string;
  modelChain: string[];
  maxOutputTokens: number | null;
}

export interface ProviderSessionState extends Record<string, unknown> {
  knownModels: ModelInfo[];
  modelsLastFetchedAt: number | null;
}

/** Live readers handed to a provider's `createProvider` factory. The shard
 *  wires these to the per-provider state subtree, so the provider always
 *  sees the latest user-edited values without owning state itself. */
export interface ProviderDeps {
  getApiKey(): string;
  getChain(): string[];
  getMaxOutputTokens(): number | null;
}

/** Per-provider settings copy. Small differences between providers (label
 *  for the API-key field, link to docs, free-form hint near the system
 *  instruction note) live here so the parametric SettingsView can render
 *  them without provider-specific branches. */
export interface ProviderCopy {
  apiKeyHelp: string;
  apiKeyPlaceholder: string;
  apiKeyTestHint?: string;
  systemInstructionHint?: string;
}

/** Declarative description of a single provider. The shard iterates over
 *  `PROVIDERS: ProviderDef[]` to register settings views and AiProvider
 *  contributions in one pass. Adding a third provider is a copy-folder
 *  operation: add a `def.ts` and a registry-line. */
export interface ProviderDef {
  /** Stable id used as `AiProvider.id`, view-id prefix (`<id>:settings`),
   *  palette item id (`<id>.settings`), and state subtree key. */
  id: string;
  /** Display label, e.g. 'DeepSeek'. */
  label: string;
  /** Initial entry seeded into `state.user.<id>.modelChain` on first run. */
  defaultModel: string;
  /** Build the AiProvider implementation against live state readers. */
  createProvider(deps: ProviderDeps): AiProvider;
  /** Live model listing for the SettingsView's refresh button. */
  listModels(apiKey: string): Promise<ModelInfo[]>;
  /** Per-provider UI copy. */
  copy: ProviderCopy;
}
