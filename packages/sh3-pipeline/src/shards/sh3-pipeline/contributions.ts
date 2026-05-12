// Contribution point id for graph domains. Owned by sh3-editor; we inline
// the literal here per the cross-shard contribution guide (no value imports
// across shards — sh3-core's loader only rewrites bare specifiers for
// `sh3-core` and `svelte`, so any other runtime import fails at install).
export const GRAPH_DOMAIN_POINT = 'sh3-editor.graph-domain';

export type { GraphDomainContribution } from '@unfinished-lair/sh3-editor/graph/contributions';
