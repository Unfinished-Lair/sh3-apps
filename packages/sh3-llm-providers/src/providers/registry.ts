import type { ProviderDef } from './types';
import { deepseekDef } from './deepseek/def';
import { geminiDef } from './gemini/def';
import { claudeDef } from './claude/def';

/** Single source of truth for the providers this shard registers. Adding a
 *  fourth provider is a copy-folder + one entry here. */
export const PROVIDERS: ProviderDef[] = [deepseekDef, geminiDef, claudeDef];
