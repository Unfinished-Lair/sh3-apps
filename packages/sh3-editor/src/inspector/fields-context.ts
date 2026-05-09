import type { ShardContext } from 'sh3-core';

export const FIELDS_CONTEXT_KEY = 'sh3-editor:fields';

export interface FieldsContext {
  ctx: ShardContext;
  slotId: string;
}
