import { shell, type FileRef, type ShardContext } from 'sh3-core';
import { EDITOR_DOCUMENT_POINT } from '../contributions';
import { languageFromExtension } from './language';

export async function openInFloat(ctx: ShardContext, file: FileRef): Promise<void> {
  const readFrom = ctx.browse?.readFrom;
  if (typeof readFrom !== 'function') {
    shell.toast.notify('Text Editor cannot read files from other shards (missing documents:read).', { level: 'warn' });
    return;
  }

  const slashIdx = file.path.indexOf('/');
  if (slashIdx <= 0) {
    shell.toast.notify(`Text Editor: invalid path '${file.path}'.`, { level: 'error' });
    return;
  }
  const shardId = file.path.slice(0, slashIdx);
  const rel = file.path.slice(slashIdx + 1);

  const result = await readFrom(shardId, rel);
  if (result == null) {
    shell.toast.notify(`Text Editor: file not found: ${rel}.`, { level: 'warn' });
    return;
  }
  const content = typeof result === 'string' ? result : '';

  const title = rel.split('/').pop() ?? rel;
  const language = languageFromExtension(rel);

  const floatId = shell.float.open('sh3-editor:editor', { title, size: { w: 720, h: 480 } });
  const entry = shell.float.list().find((f) => f.id === floatId);
  const tabs = (entry?.content as { tabs?: Array<{ slotId: string }> } | undefined)?.tabs;
  const slotId = tabs?.[0]?.slotId;
  if (!slotId) {
    shell.toast.notify('Text Editor: float opened without a slot.', { level: 'error' });
    return;
  }

  ctx.contributions.register(EDITOR_DOCUMENT_POINT, {
    slotId,
    seed: { kind: 'content', content, language, filePath: rel },
  });
}
