/*
 * Log capture — patches console.{log,info,warn,error,debug} and listens for
 * window 'error' / 'unhandledrejection' events to feed a bounded ring buffer
 * the LogPanel view renders reactively.
 *
 * Install once, at diagnosticShard.activate() (sh3-core calls activate during
 * shard registration at boot — earlier than autostart). Re-entry is guarded so
 * activate() running twice is a no-op.
 */

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  id: number;
  ts: number;
  level: LogLevel;
  text: string;
}

const MAX_ENTRIES = 2000;

export const logBuffer = $state<LogEntry[]>([]);
let nextId = 0;
let installed = false;

export function clearLog(): void {
  logBuffer.length = 0;
}

export function installLogCapture(): void {
  if (installed) return;
  installed = true;

  const levels: LogLevel[] = ['log', 'info', 'warn', 'error', 'debug'];
  for (const level of levels) {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      pushEntry(level, args);
      original(...args);
    };
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event: ErrorEvent) => {
      const msg = event.error?.stack || event.message || 'window error';
      pushEntry('error', [`[window.error] ${msg}`]);
    });
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const text =
        reason instanceof Error
          ? reason.stack || reason.message
          : safeStringify(reason);
      pushEntry('error', [`[unhandledrejection] ${text}`]);
    });
  }

  pushEntry('info', ['[diagnostic] log capture installed']);
}

function pushEntry(level: LogLevel, args: unknown[]): void {
  const text = args.map(formatArg).join(' ');
  logBuffer.push({ id: nextId++, ts: Date.now(), level, text });
  if (logBuffer.length > MAX_ENTRIES) {
    logBuffer.splice(0, logBuffer.length - MAX_ENTRIES);
  }
}

function formatArg(arg: unknown): string {
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) return arg.stack || arg.message;
  return safeStringify(arg);
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function serializeLog(entries: LogEntry[]): string {
  return entries
    .map((e) => `[${new Date(e.ts).toISOString()}] [${e.level.toUpperCase()}] ${e.text}`)
    .join('\n');
}

export function logFileName(): string {
  // Sanitize colons — sh3-server's filesystem backend rejects them on Windows.
  return `logs/sh3-log-${new Date().toISOString().replace(/:/g, '-')}.log`;
}
