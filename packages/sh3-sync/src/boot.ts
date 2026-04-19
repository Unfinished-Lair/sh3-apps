import { readPeerConfig } from './peer-config.js';

export interface ReplicaConfig {
  tenant: string;
  primaryUrl: string;
  apiKey: string;
  peerId: string;
  tickIntervalMs?: number;
}

export async function bootTenants(input: {
  dataDir: string;
  tenants: string[];
  setPeerRole: (tenant: string, role: 'primary' | 'replica') => void;
}): Promise<ReplicaConfig[]> {
  const replicas: ReplicaConfig[] = [];
  for (const tenant of input.tenants) {
    const cfg = await readPeerConfig(input.dataDir, tenant);
    if (cfg?.role === 'replica' && cfg.primaryUrl && cfg.apiKey && cfg.peerId) {
      input.setPeerRole(tenant, 'replica');
      replicas.push({
        tenant,
        primaryUrl: cfg.primaryUrl,
        apiKey: cfg.apiKey,
        peerId: cfg.peerId,
        tickIntervalMs: cfg.tickIntervalMs,
      });
    } else {
      input.setPeerRole(tenant, 'primary');
    }
  }
  return replicas;
}
