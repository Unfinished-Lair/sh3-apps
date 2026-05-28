import { CURRENT_ASSET_VERSION, type GraphAsset } from './types';

/**
 * Promote a persisted GraphAsset to CURRENT_ASSET_VERSION. Pure — returns the
 * input unchanged when it is already at the latest version. Does not mutate
 * the input asset.
 *
 *  v1 → v2: bump version. blocks absent (rendered as no blocks).
 */
export function migrateAsset(asset: GraphAsset): GraphAsset {
  if (asset.version >= CURRENT_ASSET_VERSION) return asset;
  return { ...asset, version: CURRENT_ASSET_VERSION };
}
