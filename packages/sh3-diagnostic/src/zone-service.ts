import type { ZoneName, ZoneManager } from 'sh3-core';
import { registeredShards } from 'sh3-core';
import { summarizeKeys } from './util/type-summary';
import type { ZoneEntry, ZoneGroup, ShardGroup } from './types';

/** The four non-physical zones in display order. */
export const ZONES: ZoneName[] = ['ephemeral', 'session', 'workspace', 'user'];

/** Resolve a shard ID to a human-readable label. Falls back to the raw ID. */
function shardLabel(shardId: string): string {
  const shard = registeredShards.get(shardId);
  return shard?.manifest.label ?? shardId;
}

/** Build a ZoneEntry for a single shard in a single zone. */
function buildEntry(zones: ZoneManager, zone: ZoneName, shardId: string): ZoneEntry {
  const data = zones.peek(zone, shardId);
  return {
    shardId,
    shardLabel: shardLabel(shardId),
    zone,
    keys: summarizeKeys(data),
  };
}

/** Build all entries across all zones. */
function buildAllEntries(zones: ZoneManager): ZoneEntry[] {
  const entries: ZoneEntry[] = [];
  for (const zone of ZONES) {
    const shardIds = zones.list(zone);
    for (const shardId of shardIds) {
      entries.push(buildEntry(zones, zone, shardId));
    }
  }
  return entries;
}

/** Get entries grouped by zone (zone-first view). */
export function getZoneGroups(zones: ZoneManager): ZoneGroup[] {
  const all = buildAllEntries(zones);
  return ZONES.map((zone) => ({
    zone,
    entries: all.filter((e) => e.zone === zone),
  }));
}

/** Get entries grouped by shard (shard-first view). */
export function getShardGroups(zones: ZoneManager): ShardGroup[] {
  const all = buildAllEntries(zones);
  const map = new Map<string, ZoneEntry[]>();
  for (const entry of all) {
    const list = map.get(entry.shardId) ?? [];
    list.push(entry);
    map.set(entry.shardId, list);
  }
  return Array.from(map.entries()).map(([shardId, entries]) => ({
    shardId,
    shardLabel: entries[0].shardLabel,
    entries,
  }));
}

/** Clear a single shard's data in a single zone. */
export function clearEntry(zones: ZoneManager, zone: ZoneName, shardId: string): void {
  zones.clear(zone, shardId);
}

/** Clear all data in a single zone. */
export function clearEntireZone(zones: ZoneManager, zone: ZoneName): void {
  zones.clearAll(zone);
}

/** Clear all data across all zones. */
export function clearAllCaches(zones: ZoneManager): void {
  for (const zone of ZONES) {
    zones.clearAll(zone);
  }
}
