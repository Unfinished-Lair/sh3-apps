export interface WalkScope {
  shardId: string;
  pathPrefix?: string;
}

export interface WalkStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
}

export interface WalkInput {
  list: () => Promise<Array<{ shardId: string; path: string }>>;
  scope: WalkScope;
  onItem: (
    item: { shardId: string; path: string },
    index: number,
    total: number,
  ) => Promise<'uploaded' | 'skipped-unchanged' | 'failed'>;
}

export async function walkScope(input: WalkInput): Promise<WalkStats> {
  const all = await input.list();
  const prefix = input.scope.pathPrefix ?? '';
  const matched = all.filter(
    (d) => d.shardId === input.scope.shardId && d.path.startsWith(prefix),
  );

  const stats: WalkStats = { total: matched.length, uploaded: 0, skipped: 0, failed: 0 };
  for (let i = 0; i < matched.length; i++) {
    const outcome = await input.onItem(matched[i], i, matched.length);
    if (outcome === 'uploaded') stats.uploaded++;
    else if (outcome === 'skipped-unchanged') stats.skipped++;
    else stats.failed++;
  }
  return stats;
}
