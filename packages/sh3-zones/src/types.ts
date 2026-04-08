import type { ZoneName } from 'sh3-core';

/** A single key-value summary for display. */
export interface KeySummary {
  key: string;
  typeSummary: string;
}

/** One shard's data within a single zone. */
export interface ZoneEntry {
  shardId: string;
  shardLabel: string;
  zone: ZoneName;
  keys: KeySummary[];
}

/** All zone data grouped by zone (for zone-first view). */
export interface ZoneGroup {
  zone: ZoneName;
  entries: ZoneEntry[];
}

/** All zone data grouped by shard (for shard-first view). */
export interface ShardGroup {
  shardId: string;
  shardLabel: string;
  entries: ZoneEntry[];
}

/** Storage stats for persistent zones. */
export interface StorageStats {
  workspace: number;
  user: number;
}
