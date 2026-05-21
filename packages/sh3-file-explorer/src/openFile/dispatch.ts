import type {
  FileHandlerDescriptor,
  FileHandlerPattern,
  FileRef,
  ShardContext,
} from 'sh3-core';
import { launchApp } from 'sh3-core';

export type DispatchResult =
  | { status: 'opened'; handlerLabel: string }
  | { status: 'no-handler' }
  | { status: 'failed'; error: Error };

function extOf(path: string): string {
  const dotIdx = path.lastIndexOf('.');
  if (dotIdx < 0) return '';
  return path.slice(dotIdx).toLowerCase();
}

function splitPath(path: string): { shardId: string; rel: string } | null {
  const slashIdx = path.indexOf('/');
  if (slashIdx <= 0) return null;
  return { shardId: path.slice(0, slashIdx), rel: path.slice(slashIdx + 1) };
}

function matchPattern(head: string, pattern: FileHandlerPattern): boolean {
  switch (pattern.type) {
    case 'startsWith': return head.startsWith(pattern.value);
    case 'includes':   return head.includes(pattern.value);
    case 'regex':      return new RegExp(pattern.pattern, pattern.flags).test(head);
  }
}

async function headerMatches(
  ctx: ShardContext,
  file: FileRef,
  header: NonNullable<FileHandlerDescriptor['match']['header']>,
): Promise<boolean> {
  const split = splitPath(file.path);
  if (!split) return false;
  const readFrom = ctx.browse?.readFrom;
  if (typeof readFrom !== 'function') return false;
  const content = await readFrom(split.shardId, split.rel);
  if (content == null) return false;
  const readBytes = header.readBytes ?? 256;
  const isString = typeof content === 'string';
  const headString = isString
    ? content.slice(0, readBytes)
    : new TextDecoder().decode(new Uint8Array(content as ArrayBuffer).subarray(0, readBytes));
  if (header.patterns?.length) {
    for (const p of header.patterns) {
      if (matchPattern(headString, p)) {
        if (header.predicate) {
          return header.predicate(isString ? headString : new Uint8Array(content as ArrayBuffer).subarray(0, readBytes));
        }
        return true;
      }
    }
    return false;
  }
  if (header.predicate) {
    return header.predicate(isString ? headString : new Uint8Array(content as ArrayBuffer).subarray(0, readBytes));
  }
  return true;
}

export async function listHandlersFor(
  ctx: ShardContext,
  file: FileRef,
): Promise<FileHandlerDescriptor[]> {
  const ext = extOf(file.path);
  if (!ext) return [];
  const all = ctx.contributions.list<FileHandlerDescriptor>('sh3.file-handler');
  const byExt = all.filter((d) =>
    d.match.extensions.some((e) => e.toLowerCase() === ext),
  );
  const withRegistrationOrder = byExt.map((d, idx) => ({ d, idx }));
  const winners: Array<{ d: FileHandlerDescriptor; idx: number }> = [];
  for (const entry of withRegistrationOrder) {
    if (!entry.d.match.header) { winners.push(entry); continue; }
    if (await headerMatches(ctx, file, entry.d.match.header)) winners.push(entry);
  }
  winners.sort((a, b) => {
    const pa = a.d.priority ?? 0;
    const pb = b.d.priority ?? 0;
    if (pa !== pb) return pb - pa;
    return a.idx - b.idx;
  });
  return winners.map((w) => w.d);
}

export async function dispatchOpen(
  ctx: ShardContext,
  file: FileRef,
  opts?: { handlerLabel?: string },
): Promise<DispatchResult> {
  const candidates = await listHandlersFor(ctx, file);
  if (candidates.length === 0) return { status: 'no-handler' };
  const pick = opts?.handlerLabel
    ? candidates.find((c) => c.label === opts.handlerLabel) ?? null
    : candidates[0];
  if (!pick) return { status: 'no-handler' };
  try {
    if (pick.open.type === 'view') {
      await pick.open.open(file);
    } else {
      await launchApp(pick.open.appId, { args: { file: file as unknown as Record<string, unknown> } });
    }
    return { status: 'opened', handlerLabel: pick.label };
  } catch (err) {
    return { status: 'failed', error: err instanceof Error ? err : new Error(String(err)) };
  }
}
