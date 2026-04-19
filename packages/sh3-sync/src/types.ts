export interface PeerConfig {
  role: 'primary' | 'replica';
  primaryUrl?: string;
  apiKey?: string;
  peerId?: string;
  tickIntervalMs?: number;
}

export interface PushEntry {
  shardId: string;
  path: string;
  content: string;
  expectedLocalVersion: number;
  origin: string;
  deleted?: boolean;
}

export interface PushResult {
  applied: boolean;
  version?: number;
  reason?: 'stale' | 'conflict' | 'conflict-extended';
}

export interface PullChange {
  shardId: string;
  path: string;
  content: string;
  version: number;
  metadata: {
    syncMode?: 'sync' | 'local-only';
    deleted?: boolean;
    origin?: string;
  };
}

export interface PullResponse {
  tick: number;
  changes: PullChange[];
}
