import type { ShardContext, FieldAddress, FieldView } from 'sh3-core';
import { sh3 } from 'sh3-core';
import { createBadge, ensureBadgeStyles } from './badge';

interface Attachment {
  addr: FieldAddress;
  dispose(): void;
  badgeEl: HTMLElement;
}

const addrKey = (a: { shardId: string; slotId?: string; fieldId: string }): string =>
  `${a.shardId}::${a.slotId ?? ''}::${a.fieldId}`;

const addrFromView = (fv: FieldView): FieldAddress => ({
  shardId: fv.shardId,
  slotId: fv.slotId,
  fieldId: fv.fieldId,
});

let active = false;
const attachments = new Map<string, Attachment>();
let unsubscribe: (() => void) | null = null;
let openFloatId: string | null = null;

export function isActive(): boolean {
  return active;
}

export function start(ctx: ShardContext): void {
  if (active) return;
  ensureBadgeStyles();
  active = true;
  rebuild(ctx);
  unsubscribe = ctx.sh3.fields.onChange(() => rebuild(ctx));
}

export function stop(): void {
  if (!active) return;
  active = false;
  unsubscribe?.();
  unsubscribe = null;
  for (const a of attachments.values()) a.dispose();
  attachments.clear();
  if (openFloatId) {
    try { sh3.float.close(openFloatId); } catch { /* float may already be torn down */ }
    openFloatId = null;
  }
}

/** Called from the Edit float's view-mount once it knows its own float id. */
export function noteFloatOpened(id: string): void {
  openFloatId = id;
}

export function noteFloatClosed(id: string): void {
  if (openFloatId === id) openFloatId = null;
}

function rebuild(ctx: ShardContext): void {
  const wanted = new Map<string, FieldView>();
  for (const fv of ctx.sh3.fields.list()) {
    if (fv.readonly) continue;
    if (!fv.element) continue;
    if (fv.shardId === 'ai') continue;
    wanted.set(addrKey(fv), fv);
  }

  for (const [k, a] of attachments) {
    if (!wanted.has(k)) {
      a.dispose();
      attachments.delete(k);
    }
  }

  for (const [k, fv] of wanted) {
    if (attachments.has(k)) continue;
    const addr = addrFromView(fv);
    const badgeEl = createBadge(fv.label);
    badgeEl.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      openEditFloat(addr, fv, badgeEl);
    });
    const dispose = ctx.sh3.fields.attachDecoration(addr, () => ({ element: badgeEl }));
    attachments.set(k, { addr, dispose, badgeEl });
  }
}

function openEditFloat(addr: FieldAddress, fv: FieldView, badgeEl: HTMLElement): void {
  if (openFloatId) {
    try { sh3.float.close(openFloatId); } catch { /* prior float may already be gone */ }
    openFloatId = null;
  }
  const id = sh3.float.open('ai:assistant.edit', {
    title: `AI · ${fv.label}`,
    anchor: badgeEl,
    dismissable: true,
    size: { w: 420, h: 320 },
    meta: { addr, fv },
  });
  openFloatId = id;
}
