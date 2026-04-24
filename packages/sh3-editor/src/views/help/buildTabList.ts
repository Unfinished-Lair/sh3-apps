import type { HelpTabContribution } from '../../help/contributions';

export interface BuildTabListOpts {
  warn?: (msg: string) => void;
}

/**
 * Sort contributions by (priority ?? 100, registration order) and drop
 * any duplicate ids after the first, logging a warning for each drop.
 */
export function buildTabList(
  contributions: readonly HelpTabContribution[],
  opts: BuildTabListOpts = {},
): HelpTabContribution[] {
  const warn = opts.warn ?? ((m: string) => console.warn(m));
  const seen = new Set<string>();
  const indexed: Array<{ c: HelpTabContribution; i: number }> = [];

  for (let i = 0; i < contributions.length; i++) {
    const c = contributions[i];
    if (seen.has(c.id)) {
      warn(`[sh3-editor] duplicate help tab id "${c.id}" — first registration kept, this one ignored.`);
      continue;
    }
    seen.add(c.id);
    indexed.push({ c, i });
  }

  indexed.sort((a, b) => {
    const pa = a.c.priority ?? 100;
    const pb = b.c.priority ?? 100;
    if (pa !== pb) return pa - pb;
    return a.i - b.i;
  });

  return indexed.map((e) => e.c);
}
