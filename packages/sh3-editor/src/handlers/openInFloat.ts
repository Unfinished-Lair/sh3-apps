import { sh3, PermissionError, type FileRef, type ShardContext } from 'sh3-core';
import { EDITOR_DOCUMENT_POINT } from '../contributions';
import { languageFromExtension } from './language';

export async function openInFloat(ctx: ShardContext, file: FileRef): Promise<void> {
  const slashIdx = file.path.indexOf('/');
  if (slashIdx <= 0) {
    sh3.toast.notify(`Text Editor: invalid path '${file.path}'.`, { level: 'error' });
    return;
  }
  // Path is scope-rooted (`<shardId>/<rest>`) per sh3-core 0.26. The relative
  // portion (after the bound-id segment) is used for the title + language hint.
  const rel = file.path.slice(slashIdx + 1);

  let result: string | null;
  try {
    result = await ctx.documents.readText(file.path);
  } catch (e) {
    if (e instanceof PermissionError) {
      sh3.toast.notify('Text Editor cannot read files from other shards (missing documents:browse).', { level: 'warn' });
      return;
    }
    throw e;
  }
  if (result == null) {
    sh3.toast.notify(`Text Editor: file not found: ${rel}.`, { level: 'warn' });
    return;
  }
  const content = result;

  const title = rel.split('/').pop() ?? rel;
  const language = languageFromExtension(rel);

  const floatId = sh3.float.open('sh3-editor:editor', { title, size: { w: 720, h: 480 } });
  const entry = sh3.float.list().find((f) => f.id === floatId);
  const tabs = (entry?.content as { tabs?: Array<{ slotId: string }> } | undefined)?.tabs;
  const slotId = tabs?.[0]?.slotId;
  if (!slotId) {
    sh3.toast.notify('Text Editor: float opened without a slot.', { level: 'error' });
    return;
  }

  ctx.contributions.register(EDITOR_DOCUMENT_POINT, {
    slotId,
    seed: { kind: 'content', content, language, filePath: rel },
  });
}
