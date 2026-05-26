import type { GraphDomain, NodeVisuals } from '../domain/types';

/**
 * Resolve the port-disc color for a given port.
 * Resolution chain: domain.dataTypes[t].color → visuals.portColors[t] → null (caller falls back).
 * Returns null when `dataType` is undefined or unresolved.
 */
export function resolvePortColor(
  domain: GraphDomain,
  visuals: NodeVisuals,
  dataType: string | undefined,
): string | null {
  if (!dataType) return null;
  const domainColor = domain.dataTypes?.[dataType]?.color;
  if (domainColor) return domainColor;
  const templateColor = visuals.portColors?.[dataType];
  if (templateColor) return templateColor;
  return null;
}
