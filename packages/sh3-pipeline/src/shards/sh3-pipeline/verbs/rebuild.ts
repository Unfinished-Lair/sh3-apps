import type { GraphDomain } from '@unfinished-lair/sh3-editor/graph/types';
import type { ShardContext } from 'sh3-core';
import { verbsToTemplates, type VerbDescriptor } from '../templates/verb-adapter';

export function rebuildCatalog(
  ctx: ShardContext,
  domain: GraphDomain,
): { count: number } {
  const verbs = ctx.sh3.listVerbs({ programmaticOnly: true }) as VerbDescriptor[];
  const templates = verbsToTemplates(verbs);
  for (const t of templates) domain.addTemplate(t);
  return { count: templates.length };
}
