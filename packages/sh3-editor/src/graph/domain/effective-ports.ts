import type { NodeTemplate } from './types';
import type { GraphAssetPort } from '../asset/types';

/**
 * Resolve the effective port list for a node given its template and current
 * config. Returns `template.computePorts(config)` when present and config is
 * non-nil; otherwise the static `template.ports`. Pure and synchronous.
 *
 * If `computePorts` throws or returns a non-array, callers should fall back
 * to `template.ports` — that fallback lives in the call sites because they
 * have the right place to log and surface the warning.
 */
export function effectivePorts(
  template: NodeTemplate,
  config: Record<string, unknown> | null | undefined,
): GraphAssetPort[] {
  if (template.computePorts && config) return template.computePorts(config);
  return template.ports;
}
