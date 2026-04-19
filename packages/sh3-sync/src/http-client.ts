import type { PushEntry, PushResult, PullResponse } from './types.js';

export async function pushBatch(
  primaryUrl: string,
  apiKey: string,
  tenant: string,
  batch: PushEntry[],
): Promise<PushResult[]> {
  const res = await fetch(`${primaryUrl}/api/sh3-sync/push/${tenant}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ batch }),
  });
  if (!res.ok) throw new Error(`push failed: ${res.status}`);
  const body = (await res.json()) as { results: PushResult[] };
  return body.results;
}

export async function pullSinceTick(
  primaryUrl: string,
  apiKey: string,
  tenant: string,
  sinceTick: number,
): Promise<PullResponse> {
  const res = await fetch(
    `${primaryUrl}/api/sh3-sync/pull/${tenant}?sinceTick=${sinceTick}`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );
  if (!res.ok) throw new Error(`pull failed: ${res.status}`);
  return (await res.json()) as PullResponse;
}
