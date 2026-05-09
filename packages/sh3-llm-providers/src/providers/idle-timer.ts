/** Streaming watchdog used by Gemini and DeepSeek. Composes the
 *  caller-supplied AbortSignal with an internal one that fires after
 *  `idleTimeoutMs` of inactivity. The clients call `bump()` after every
 *  chunk they receive — that resets the timer, so a model that thinks
 *  for a long time but produces output in bursts will not trip it.
 *
 *  When `idleTimeoutMs` is `0` or `undefined`, the helper is a passthrough:
 *  the returned `signal` is the caller's signal, and `bump()`/`clear()`
 *  are no-ops. */
export interface IdleTimer {
  signal: AbortSignal;
  bump(): void;
  clear(): void;
}

export function makeIdleTimer(
  external: AbortSignal,
  idleTimeoutMs: number | undefined,
): IdleTimer {
  if (!idleTimeoutMs || idleTimeoutMs <= 0) {
    return { signal: external, bump() {}, clear() {} };
  }

  const ac = new AbortController();
  let timer: ReturnType<typeof setTimeout> | null = null;

  const fire = () => {
    ac.abort(
      new DOMException(`idle timeout: no chunk for ${idleTimeoutMs}ms`, 'TimeoutError'),
    );
  };

  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const bump = () => {
    clear();
    timer = setTimeout(fire, idleTimeoutMs);
  };

  bump();

  return {
    signal: AbortSignal.any([external, ac.signal]),
    bump,
    clear,
  };
}
