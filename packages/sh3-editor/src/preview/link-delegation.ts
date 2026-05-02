export interface ClickedAnchor {
  anchor: HTMLAnchorElement;
  href: string;
}

export function findClickedAnchor(target: EventTarget | null): ClickedAnchor | null {
  if (!target || !(target instanceof Element)) return null;
  const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
  if (!anchor) return null;
  const href = anchor.getAttribute('href');
  if (href == null) return null;
  return { anchor, href };
}
