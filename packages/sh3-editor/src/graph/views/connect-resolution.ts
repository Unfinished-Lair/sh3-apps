import type { GraphDomain, PortRef } from '../domain/types';

export type ConnectAttempt =
  | { kind: 'reject' }
  | { kind: 'accept'; adapter?: string };

/**
 * Decide whether the src→tgt connection is allowed, and whether it should
 * be persisted with an adapter id. Prefers `resolveConnect`; falls back to
 * `canConnect` for legacy domains; falls back to "always accept" when
 * neither is present.
 */
export function decideConnect(
  domain: GraphDomain,
  src: PortRef,
  tgt: PortRef,
): ConnectAttempt {
  if (domain.resolveConnect) {
    const r = domain.resolveConnect(src, tgt);
    if (r === false) return { kind: 'reject' };
    if (r === true) return { kind: 'accept' };
    return { kind: 'accept', adapter: r.via };
  }
  if (domain.canConnect) {
    return domain.canConnect(src, tgt) ? { kind: 'accept' } : { kind: 'reject' };
  }
  return { kind: 'accept' };
}
