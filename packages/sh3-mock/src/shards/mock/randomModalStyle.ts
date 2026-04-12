/*
 * randomModalBoxStyle — produce a random inline style string for the mock
 * panel's demo modals. Used to stress-test the phase-5 modal frame by
 * opening dialogs at arbitrary sizes and viewport positions instead of
 * the default centered box. The returned string is passed through as
 * `ModalOptions.boxStyle` and applied directly to `.modal-box`.
 *
 * The generator picks a width/height in a bounded range, then a top/left
 * that keeps the box fully inside the viewport with a small margin. The
 * base `.modal-box` CSS sets min-width / max-width / max-height — we
 * override those to `none`/`0` so the chosen size actually sticks.
 */

const MIN_W = 260;
const MAX_W = 580;
const MIN_H = 140;
const MAX_H = 440;
const MARGIN = 24;

function randInt(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

export function randomModalBoxStyle(): string {
  const w = randInt(MIN_W, MAX_W);
  const h = randInt(MIN_H, MAX_H);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxLeft = Math.max(MARGIN, vw - w - MARGIN);
  const maxTop = Math.max(MARGIN, vh - h - MARGIN);
  const left = randInt(MARGIN, maxLeft);
  const top = randInt(MARGIN, maxTop);
  return (
    `position: absolute; top: ${top}px; left: ${left}px; ` +
    `width: ${w}px; height: ${h}px; ` +
    `min-width: 0; max-width: none; max-height: none;`
  );
}
