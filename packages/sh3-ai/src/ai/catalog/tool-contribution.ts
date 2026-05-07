import type { Tool } from './types';
import type { ToolContribution } from '../../contributions';

export function toolContributionsToTools(
  contributions: ReadonlyArray<ToolContribution>,
): Tool[] {
  return contributions.map((c) => ({
    name: c.name,
    description: c.description,
    inputSchema: c.inputSchema,
    source: 'sh3-ai.tool' as const,
    run: c.run,
  }));
}
