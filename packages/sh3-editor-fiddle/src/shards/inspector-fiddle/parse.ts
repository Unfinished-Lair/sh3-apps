export interface DebouncedParserOptions {
  onSuccess: (value: unknown, sourceText: string) => void;
  onError:   (message: string) => void;
  debounceMs?: number;
}

export interface DebouncedParser {
  feed(text: string): void;
  flush(): void;
  cancel(): void;
}

export function createDebouncedParser(opts: DebouncedParserOptions): DebouncedParser {
  const { onSuccess, onError, debounceMs = 150 } = opts;

  let pendingText: string | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function run() {
    if (pendingText === null) return;
    const text = pendingText;
    pendingText = null;
    timer = null;
    try {
      const value = JSON.parse(text);
      onSuccess(value, text);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    }
  }

  return {
    feed(text: string) {
      pendingText = text;
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(run, debounceMs);
    },
    flush() {
      if (timer !== null) clearTimeout(timer);
      run();
    },
    cancel() {
      if (timer !== null) clearTimeout(timer);
      timer = null;
      pendingText = null;
    },
  };
}
