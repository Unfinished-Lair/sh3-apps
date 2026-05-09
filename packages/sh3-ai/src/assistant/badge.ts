/**
 * Visual badge attached over a controllable field while the assistant is
 * active. Exported as a DOM helper so mode.ts can build one per attachment
 * without dragging Svelte into the decoration factory.
 */
export function createBadge(label: string): HTMLButtonElement {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'sh3-ai-assistant-badge';
  el.title = `AI · ${label}`;
  el.setAttribute('aria-label', `Edit '${label}' with AI`);
  el.textContent = 'AI';
  return el;
}

const STYLE_ID = 'sh3-ai-assistant-badge-styles';

export function ensureBadgeStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
.sh3-ai-assistant-badge {
  appearance: none;
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  padding: 0;
  font: 600 10px/1 var(--sh3-font-ui, system-ui, sans-serif);
  letter-spacing: 0.04em;
  color: var(--sh3-fg-on-accent, #fff);
  background: var(--sh3-accent, #61afef);
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 999px;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  opacity: 0.85;
  transition: opacity 0.1s, transform 0.1s;
  z-index: 1;
}
.sh3-ai-assistant-badge:hover {
  opacity: 1;
  transform: scale(1.08);
}
.sh3-ai-assistant-badge:active {
  transform: scale(0.96);
}
`;
  document.head.appendChild(style);
}
