export interface BadgeSubscribers {
  subscribe(cb: () => void): () => void;
  notify(onError?: (err: unknown) => void): void;
}

export function createBadgeSubscribers(): BadgeSubscribers {
  const subs = new Set<() => void>();
  return {
    subscribe(cb) {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    notify(onError) {
      for (const cb of subs) {
        try { cb(); } catch (err) { onError?.(err); }
      }
    },
  };
}
