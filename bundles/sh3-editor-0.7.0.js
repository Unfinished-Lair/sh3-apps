/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".cp-surface.svelte-7v5dlc{display:flex;flex-direction:column;gap:12px;padding:12px;background:var(--shell-bg-elevated);border-radius:6px;font-family:var(--shell-font-ui);width:fit-content}.cp-surface.disabled.svelte-7v5dlc{opacity:.5;pointer-events:none}.cp-main.svelte-7v5dlc{display:flex;gap:16px}.cp-left.svelte-7v5dlc{display:flex;flex-direction:column;gap:10px}.cp-right.svelte-7v5dlc{display:flex;flex-direction:column;min-width:180px}.cp-body.svelte-7v5dlc{display:flex;gap:8px}.cp-square.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:crosshair}.cp-strip.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-mode.svelte-7v5dlc{display:inline-flex;gap:0}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:3px 10px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);cursor:pointer}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):first-child{border-radius:4px 0 0 4px;border-right:none}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):last-child{border-radius:0 4px 4px 0}.cp-mode.svelte-7v5dlc button.active:where(.svelte-7v5dlc){background:var(--shell-accent, #3a7eff);color:var(--shell-bg)}.cp-sliders.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-label.svelte-7v5dlc{width:14px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-value.svelte-7v5dlc{width:40px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-range.svelte-7v5dlc{flex:1;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:8px;border-radius:4px;background:var(--track-bg, var(--shell-input-bg));outline:none;cursor:pointer}.cp-range.svelte-7v5dlc::-webkit-slider-thumb{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-range.svelte-7v5dlc::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-hex-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-preview.svelte-7v5dlc{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-7v5dlc{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-palette.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-palette-select.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;outline:none}.cp-palette-select.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-swatches.svelte-7v5dlc{display:grid;grid-template-columns:repeat(auto-fill,minmax(24px,1fr));gap:4px}.cp-swatch.svelte-7v5dlc{width:24px;height:24px;border-radius:4px;border:1px solid var(--shell-border);cursor:pointer;padding:0;outline:none}.cp-swatch.active.svelte-7v5dlc{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-palette-actions.svelte-7v5dlc{display:flex;gap:4px}.cp-palette-btn.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-palette-btn.svelte-7v5dlc:hover:not([disabled]){background:var(--shell-bg-sunken)}.cp-palette-btn[disabled].svelte-7v5dlc{opacity:.5;cursor:not-allowed}.cp-save-prompt.svelte-7v5dlc{display:flex;gap:4px;align-items:center}.cp-save-input.svelte-7v5dlc{flex:1;min-width:0;padding:3px 6px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:12px;font-family:inherit;outline:none}.cp-pick-title.svelte-1n3y1cm{font:var(--shell-font-ui);color:var(--shell-text-dim);padding:4px 8px;border-bottom:1px solid var(--shell-border-subtle, rgba(255, 255, 255, .1))}.toolbar.svelte-10sr5yt{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid var(--shell-border);background:var(--shell-bg-raised);font-family:var(--shell-font-ui);font-size:12px;flex-shrink:0}.toolbar-btn.svelte-10sr5yt{padding:2px 8px;border:1px solid var(--shell-border);border-radius:3px;background:var(--shell-bg);color:var(--shell-fg);font-size:11px;cursor:pointer;white-space:nowrap}.toolbar-btn.svelte-10sr5yt:hover:not(:disabled){background:var(--shell-bg-sunken)}.toolbar-btn.svelte-10sr5yt:disabled{opacity:.4;cursor:default}.toolbar-accent.svelte-10sr5yt{color:var(--shell-accent)}.toolbar-spacer.svelte-10sr5yt{flex:1}.toolbar-sep.svelte-10sr5yt{width:1px;height:16px;background:var(--shell-border)}.toolbar-path.svelte-10sr5yt{color:var(--shell-fg-muted);font-family:var(--shell-font-mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body.svelte-1etykqv{padding:var(--shell-pad-lg);display:flex;flex-direction:column;gap:var(--shell-pad-md);min-width:320px;font-family:var(--shell-font-ui)}h2.svelte-1etykqv{margin:0;font-size:16px;color:var(--shell-fg)}.rows.svelte-1etykqv{display:flex;flex-direction:column;gap:var(--shell-pad-sm)}.row.svelte-1etykqv{display:flex;align-items:center;justify-content:space-between;gap:var(--shell-pad-md);font-size:13px}.label.svelte-1etykqv{color:var(--shell-fg-muted)}.seg.svelte-1etykqv{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;padding:4px 10px;background:var(--shell-bg);color:var(--shell-fg);border:none;font-size:12px;cursor:pointer}.seg.svelte-1etykqv button:where(.svelte-1etykqv)+button:where(.svelte-1etykqv){border-left:1px solid var(--shell-border)}.seg.svelte-1etykqv button.active:where(.svelte-1etykqv){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-1etykqv button:where(.svelte-1etykqv):hover:not(.active){background:var(--shell-bg-sunken)}.actions.svelte-1etykqv{display:flex;justify-content:flex-end;gap:var(--shell-pad-sm)}.actions.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:var(--shell-radius-sm);cursor:pointer}.actions.svelte-1etykqv button:where(.svelte-1etykqv):hover{background:var(--shell-accent)}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv){background:transparent}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv):hover{background:var(--shell-bg-sunken)}.editor-container.svelte-1j4uh1h{display:flex;flex-direction:column;height:100%;position:relative}.editor-wrap.svelte-1j4uh1h{display:flex;height:100%;overflow:hidden;background:var(--shell-bg-sunken);font-family:var(--shell-font-mono);font-size:var(--editor-font-size, 13px);line-height:1.6;color:var(--shell-fg)}.gutter.svelte-1j4uh1h{flex-shrink:0;width:3.5em;background:var(--shell-bg-sunken);border-right:1px solid var(--shell-border);overflow:hidden;color:var(--shell-fg-muted);font-size:inherit;line-height:inherit;-webkit-user-select:none;user-select:none}.gutter-inner.svelte-1j4uh1h{text-align:right;padding:0 .5em 0 0}.line-num.svelte-1j4uh1h{font-size:.85em;height:1lh;line-height:1lh}.editor-body.svelte-1j4uh1h{position:relative;flex:1;overflow:hidden}.highlight-layer.svelte-1j4uh1h{position:absolute;top:0;left:0;margin:0;padding:0 .75em;white-space:pre;word-wrap:normal;overflow:visible;pointer-events:none;font-family:inherit;font-size:inherit;line-height:inherit;color:var(--shell-fg);-moz-tab-size:2;tab-size:2}.input-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:0;padding:0 .75em;background:transparent;border:none;outline:none;resize:none;font-family:inherit;font-size:inherit;line-height:inherit;color:transparent;caret-color:var(--shell-fg);white-space:pre;word-wrap:normal;overflow:auto;-moz-tab-size:2;tab-size:2;box-sizing:border-box}.input-layer.svelte-1j4uh1h::selection{background:#61afef40}.hl-keyword{color:#c678dd}.hl-type{color:#e5c07b}.hl-string{color:#98c379}.hl-number,.hl-bool{color:#d19a66}.hl-comment{color:#5c6370;font-style:italic}.hl-key{color:#e06c75}.hl-context{color:#56b6c2}.hl-parent,.hl-ref{color:#61afef}.hl-punct{color:var(--shell-fg-muted)}.hl-code{color:#abb2bf}.hl-heading{color:#e5c07b;font-weight:600}.hl-bold{font-weight:600}.field.svelte-2gtehg{display:grid;grid-template-columns:minmax(4em,12em) 1fr;column-gap:.75em;align-items:center;padding:.15em .5em;font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg)}.label.svelte-2gtehg{color:var(--shell-fg-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.readonly.svelte-2gtehg .value:where(.svelte-2gtehg){color:var(--shell-fg-muted)}.primitive.svelte-1o84d6l{background:var(--shell-bg-sunken);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:2px;padding:.1em .3em;font-family:var(--shell-font-mono);font-size:13px;width:100%;box-sizing:border-box}.primitive.svelte-1o84d6l:focus{outline:1px solid var(--shell-accent, #61afef)}.primitive.svelte-1o84d6l:disabled{color:var(--shell-fg-muted);cursor:default}.walker.svelte-1xvtj10{display:flex;flex-direction:column;gap:.1em;padding:.25em 0}.leaf.svelte-o6duey{font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg-muted)}.inspector-container.svelte-jpxkcf{display:flex;flex-direction:column;height:100%;background:var(--shell-bg-sunken);color:var(--shell-fg);font-family:var(--shell-font-mono);font-size:13px;outline:none}.inspector-body.svelte-jpxkcf{flex:1;overflow:auto;padding:.5em 0}.cp.svelte-f5c5rv{display:flex;flex-direction:column;border:1px solid var(--shell-border);border-radius:6px;width:fit-content}.cp.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact.svelte-f5c5rv{position:relative;display:inline-block;font-family:var(--shell-font-ui)}.cp-compact.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact-row.svelte-f5c5rv{display:flex;align-items:center;gap:6px}.cp-compact-preview.svelte-f5c5rv{width:20px;height:20px;cursor:pointer;border:1px solid var(--shell-border);border-radius:4px;flex-shrink:0;outline:none}.cp-compact-preview.svelte-f5c5rv:focus-visible{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-preview.svelte-f5c5rv{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-f5c5rv{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-f5c5rv:focus{border-color:var(--shell-accent, #3a7eff)}.cp-compact-hex.svelte-f5c5rv{width:90px;font-size:12px}.cp-leaf-fallback.svelte-1tdr2l8{font-family:var(--shell-font-mono, monospace);color:var(--shell-text-dim)}.section.svelte-18qjjuf{padding-bottom:var(--shell-pad-md);margin-bottom:var(--shell-pad-md);border-bottom:1px solid var(--shell-border)}.section.svelte-18qjjuf:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0}.section-label.svelte-18qjjuf{margin:0 0 var(--shell-pad-sm);font-size:11px;font-weight:600;color:var(--shell-accent);text-transform:uppercase;letter-spacing:.08em;font-family:var(--shell-font-ui)}.rows.svelte-18qjjuf{display:flex;flex-direction:column}.row.svelte-1rh69ln{display:grid;grid-template-columns:200px 1fr;column-gap:var(--shell-pad-md);align-items:center;padding:var(--shell-pad-sm) 0;font-family:var(--shell-font-ui);font-size:13px;color:var(--shell-fg)}.row.disabled.svelte-1rh69ln{opacity:.5;pointer-events:none}.label.svelte-1rh69ln{color:var(--shell-fg)}.desc.svelte-1rh69ln{font-size:11px;color:var(--shell-fg-muted);margin-top:2px}.control.svelte-1rh69ln{display:flex;align-items:center;gap:var(--shell-pad-sm)}.error.svelte-1rh69ln{grid-column:2;font-size:11px;color:var(--shell-error, #ff7a7a);margin-top:4px}.toggle.svelte-ert2i6{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:34px;height:18px;background:var(--shell-border);border:none;border-radius:9px;position:relative;cursor:pointer;padding:0;transition:background .1s}.toggle.on.svelte-ert2i6{background:var(--shell-accent)}.toggle[disabled].svelte-ert2i6{cursor:not-allowed}.knob.svelte-ert2i6{position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:left .1s}.toggle.on.svelte-ert2i6 .knob:where(.svelte-ert2i6){left:18px}.input.svelte-1jljyjf{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:100%;box-sizing:border-box}.input.svelte-1jljyjf:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1jljyjf{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1jljyjf{cursor:not-allowed}.input.svelte-1be7g0v{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:90px;box-sizing:border-box}.input.svelte-1be7g0v:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1be7g0v{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1be7g0v{cursor:not-allowed}.unit.svelte-1be7g0v{font-size:11px;color:var(--shell-fg-muted)}.slider.svelte-1jyn88{flex:1;accent-color:var(--shell-accent);cursor:pointer}.slider[disabled].svelte-1jyn88{cursor:not-allowed}.slider.error.svelte-1jyn88{accent-color:var(--shell-error, #ff7a7a)}.value.svelte-1jyn88{min-width:56px;text-align:right;font-size:12px;color:var(--shell-accent);font-variant-numeric:tabular-nums}.seg.svelte-iu603z{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.error.svelte-iu603z{border-color:var(--shell-error, #ff7a7a)}.seg.svelte-iu603z button:where(.svelte-iu603z){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 10px;background:var(--shell-bg-sunken);color:var(--shell-fg);border:none;cursor:pointer}.seg.svelte-iu603z button:where(.svelte-iu603z)+button:where(.svelte-iu603z){border-left:1px solid var(--shell-border)}.seg.svelte-iu603z button.active:where(.svelte-iu603z){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-iu603z button:where(.svelte-iu603z):hover:not(.active):not([disabled]){background:var(--shell-bg)}.seg.svelte-iu603z button[disabled]:where(.svelte-iu603z){cursor:not-allowed}.settings.svelte-mrn94a{padding:var(--shell-pad-lg);font-family:var(--shell-font-ui);color:var(--shell-fg);background:var(--shell-bg);min-height:100%;box-sizing:border-box}.title.svelte-mrn94a{margin:0 0 var(--shell-pad-md);font-size:16px;font-weight:600}.empty.svelte-mrn94a{color:var(--shell-fg-muted);font-style:italic;padding:var(--shell-pad-md) 0}.hotkeys-tab.svelte-151qe3m{padding:12px 16px;color:var(--shell-fg)}.ctx.svelte-151qe3m{font-size:12px;opacity:.8;margin-bottom:12px}.ctx.svelte-151qe3m code:where(.svelte-151qe3m){font-family:var(--shell-mono, monospace)}.group.svelte-151qe3m{margin-bottom:16px}.group-title.svelte-151qe3m{font-size:13px;font-weight:600;margin:0 0 6px;opacity:.9}.list.svelte-151qe3m{list-style:none;margin:0;padding:0}.row.svelte-151qe3m{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;padding:4px 0;border-bottom:1px solid var(--shell-border, #2a2a2a)}.row.disabled.svelte-151qe3m{opacity:.5}.label.svelte-151qe3m{font-size:13px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kbd.svelte-151qe3m{font-family:var(--shell-mono, monospace);font-size:12px;padding:2px 6px;border-radius:3px;background:var(--shell-surface-2, #2a2a2a)}.badge.svelte-151qe3m{font-size:11px;opacity:.6;font-family:var(--shell-mono, monospace)}.empty.svelte-151qe3m{opacity:.6;padding:16px 0}.help-root.svelte-udgkd3{display:flex;flex-direction:column;height:100%;min-height:320px;background:var(--shell-surface, #1a1a1a);color:var(--shell-fg)}.modal-surface.svelte-udgkd3{width:640px;max-width:90vw;height:480px;max-height:80vh}.help-header.svelte-udgkd3{display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid var(--shell-border, #2a2a2a)}.title.svelte-udgkd3{font-weight:600;flex:1}.close-btn.svelte-udgkd3{background:none;border:none;color:var(--shell-fg);font-size:18px;cursor:pointer;padding:0 8px;line-height:1}.tab-strip.svelte-udgkd3{display:flex;gap:2px;padding:6px 8px 0;border-bottom:1px solid var(--shell-border, #2a2a2a);background:var(--shell-surface-2, transparent)}.tab-btn.svelte-udgkd3{background:transparent;border:none;color:var(--shell-fg);padding:6px 12px;cursor:pointer;font-size:13px;border-bottom:2px solid transparent;display:inline-flex;gap:4px;align-items:center}.tab-btn.svelte-udgkd3:hover{background:var(--shell-hover, rgba(255,255,255,.05))}.tab-btn.active.svelte-udgkd3{border-bottom-color:var(--shell-accent, #3ba3ff);font-weight:600}.tab-icon.svelte-udgkd3{font-size:14px}.tab-bodies.svelte-udgkd3{flex:1;overflow:hidden;position:relative}.tab-body.svelte-udgkd3{position:absolute;top:0;right:0;bottom:0;left:0;overflow-y:auto;overflow-x:hidden;display:none}.tab-body.active.svelte-udgkd3{display:block}.loading.svelte-udgkd3{padding:16px;opacity:.6}";
  document.head.appendChild(s);
})();
var Vt = Object.defineProperty;
var bt = (r) => {
  throw TypeError(r);
};
var Lt = (r, t, n) => t in r ? Vt(r, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : r[t] = n;
var Z = (r, t, n) => Lt(r, typeof t != "symbol" ? t + "" : t, n), qt = (r, t, n) => t.has(r) || bt("Cannot " + n);
var Se = (r, t, n) => (qt(r, t, "read from private field"), n ? n.call(r) : t.get(r)), Ze = (r, t, n) => t.has(r) ? bt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(r) : t.set(r, n);
import { shell as He, getActiveApp as jt, COLOR_PICKER_POINT as Nt } from "sh3-core";
import { onMount as je, onDestroy as Pt, mount as me, unmount as pe } from "svelte";
import * as e from "svelte/internal/client";
import "svelte/internal/disclose-version";
const Ft = 2, Kt = "inline";
function zt(r, t) {
  return {
    indentUnit: (t == null ? void 0 : t.indentUnit) ?? (r == null ? void 0 : r.indentUnit) ?? Ft,
    braceStyle: (t == null ? void 0 : t.braceStyle) ?? (r == null ? void 0 : r.braceStyle) ?? Kt
  };
}
class Wt {
  constructor(t) {
    Z(this, "entries", /* @__PURE__ */ new Map());
    Z(this, "onClose");
    this.onClose = t;
  }
  open(t, n) {
    if (this.entries.has(t))
      return this.entries.get(t);
    const v = {
      document: {
        id: t,
        content: n.content,
        filePath: n.filePath ?? null,
        cursorStart: 0,
        cursorEnd: 0,
        scrollTop: 0,
        scrollLeft: 0,
        dirty: !1,
        language: n.language ?? null
      },
      options: n,
      prefs: zt(n.matchingConfig, n.prefs)
    };
    return this.entries.set(t, v), v;
  }
  close(t) {
    const n = this.entries.delete(t);
    return n && this.onClose && this.onClose(t), n;
  }
  get(t) {
    return this.entries.get(t);
  }
  has(t) {
    return this.entries.has(t);
  }
  list() {
    return [...this.entries.keys()];
  }
  clear() {
    const t = [...this.entries.keys()];
    if (this.entries.clear(), this.onClose) for (const n of t) this.onClose(n);
  }
}
var Ue;
class Gt {
  constructor(t) {
    Z(this, "entries", /* @__PURE__ */ new Map());
    Ze(this, Ue, e.state(0));
    Z(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(Se(this, Ue));
  }
  set version(t) {
    e.set(Se(this, Ue), t, !0);
  }
  open(t, n) {
    const i = this.entries.get(t);
    if (i) return i;
    const v = { value: n.value, meta: n.meta, options: n };
    return this.entries.set(t, v), this.version++, v;
  }
  close(t) {
    const n = this.entries.delete(t);
    return n && (this.version++, this.onClose && this.onClose(t)), n;
  }
  get(t) {
    return this.version, this.entries.get(t);
  }
  has(t) {
    return this.version, this.entries.has(t);
  }
  list() {
    return this.version, [...this.entries.keys()];
  }
  clear() {
    const t = [...this.entries.keys()];
    if (this.entries.clear(), t.length > 0 && this.version++, this.onClose) for (const n of t) this.onClose(n);
  }
}
Ue = new WeakMap();
const Xt = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
function be({ h: r, s: t, v: n }) {
  const i = t / 100, v = n / 100, l = v * i, s = l * (1 - Math.abs(r / 60 % 2 - 1)), p = v - l;
  let a = 0, f = 0, o = 0;
  return r < 60 ? (a = l, f = s) : r < 120 ? (a = s, f = l) : r < 180 ? (f = l, o = s) : r < 240 ? (f = s, o = l) : r < 300 ? (a = s, o = l) : (a = l, o = s), {
    r: Math.round((a + p) * 255),
    g: Math.round((f + p) * 255),
    b: Math.round((o + p) * 255)
  };
}
function Yt({ r, g: t, b: n }) {
  const i = r / 255, v = t / 255, l = n / 255, s = Math.max(i, v, l), p = Math.min(i, v, l), a = s - p;
  let f = 0;
  a !== 0 && (s === i ? f = 60 * ((v - l) / a % 6) : s === v ? f = 60 * ((l - i) / a + 2) : f = 60 * ((i - v) / a + 4)), f < 0 && (f += 360);
  const o = s === 0 ? 0 : a / s * 100, m = s * 100;
  return { h: Math.round(f), s: Math.round(o), v: Math.round(m) };
}
function _e({ r, g: t, b: n }) {
  const i = (v) => v.toString(16).padStart(2, "0");
  return `#${i(r)}${i(t)}${i(n)}`;
}
function Jt(r) {
  let t = r.replace(/^#/, "");
  t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]);
  const n = parseInt(t, 16);
  return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
}
function Ie(r) {
  return _e(be(r));
}
function fe(r) {
  return Yt(Jt(r));
}
function Qt(r) {
  return Xt.test(r);
}
function te(r) {
  if (!Qt(r)) return null;
  let t = r.replace(/^#/, "").toLowerCase();
  return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), `#${t}`;
}
var Re;
class Zt {
  constructor(t) {
    Z(this, "entries", /* @__PURE__ */ new Map());
    Ze(this, Re, e.state(0));
    Z(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(Se(this, Re));
  }
  set version(t) {
    e.set(Se(this, Re), t, !0);
  }
  open(t, n) {
    const i = this.entries.get(t);
    if (i) return i;
    const l = { value: te(n.value) ?? "#000000", options: n };
    return this.entries.set(t, l), this.version++, l;
  }
  close(t) {
    const n = this.entries.delete(t);
    return n && (this.version++, this.onClose && this.onClose(t)), n;
  }
  get(t) {
    return this.version, this.entries.get(t);
  }
  has(t) {
    return this.version, this.entries.has(t);
  }
  list() {
    return this.version, [...this.entries.keys()];
  }
  clear() {
    const t = [...this.entries.keys()];
    if (this.entries.clear(), t.length > 0 && this.version++, this.onClose) for (const n of t) this.onClose(n);
  }
}
Re = new WeakMap();
const $t = 200;
class en {
  constructor(t = $t) {
    Z(this, "undoStack", []);
    Z(this, "redoStack", []);
    Z(this, "maxDepth");
    Z(this, "listeners", /* @__PURE__ */ new Set());
    this.maxDepth = t;
  }
  push(t) {
    t.meta && t.meta.timestamp == null ? t.meta.timestamp = Date.now() : t.meta || (t.meta = { timestamp: Date.now() }), this.undoStack.push(t), this.undoStack.length > this.maxDepth && this.undoStack.shift(), this.redoStack.length = 0, this.emit();
  }
  undo() {
    const t = this.undoStack.pop();
    return t ? (t.revert(), this.redoStack.push(t), this.emit(), !0) : !1;
  }
  redo() {
    const t = this.redoStack.pop();
    return t ? (t.apply(), this.undoStack.push(t), this.emit(), !0) : !1;
  }
  peek() {
    return this.undoStack[this.undoStack.length - 1] ?? null;
  }
  replaceTop(t) {
    return this.undoStack.length === 0 ? !1 : (t.meta && t.meta.timestamp == null ? t.meta.timestamp = Date.now() : t.meta || (t.meta = { timestamp: Date.now() }), this.undoStack[this.undoStack.length - 1] = t, this.emit(), !0);
  }
  clear() {
    this.undoStack.length = 0, this.redoStack.length = 0, this.emit();
  }
  get canUndo() {
    return this.undoStack.length > 0;
  }
  get canRedo() {
    return this.redoStack.length > 0;
  }
  onChange(t) {
    return this.listeners.add(t), () => {
      this.listeners.delete(t);
    };
  }
  emit() {
    for (const t of this.listeners) t();
  }
}
function qe(r) {
  const { setter: t, before: n, after: i, cursorBefore: v, cursorAfter: l, now: s } = r;
  return {
    apply: () => t(i, l),
    revert: () => t(n, v),
    meta: {
      kind: "text-swap",
      timestamp: s,
      snapshot: { before: n, after: i, cursorBefore: v, cursorAfter: l }
    }
  };
}
class tn {
  constructor() {
    Z(this, "engines", /* @__PURE__ */ new Map());
  }
  get(t) {
    let n = this.engines.get(t);
    return n || (n = new en(), this.engines.set(t, n)), n;
  }
  release(t) {
    this.engines.delete(t);
  }
  clear() {
    this.engines.clear();
  }
}
class ve {
  constructor() {
    Z(this, "listeners", /* @__PURE__ */ new Set());
  }
  on(t) {
    return this.listeners.add(t), () => {
      this.listeners.delete(t);
    };
  }
  emit(...t) {
    for (const n of this.listeners) n(...t);
  }
  clear() {
    this.listeners.clear();
  }
}
function nn(r, t, n) {
  const i = r.get(t);
  return {
    push(l) {
      i.push(l), n();
    },
    undo() {
      const l = i.undo();
      return l && n(), l;
    },
    redo() {
      const l = i.redo();
      return l && n(), l;
    },
    peek() {
      return i.peek();
    },
    replaceTop(l) {
      const s = i.replaceTop(l);
      return s && n(), s;
    },
    get canUndo() {
      return i.canUndo;
    },
    get canRedo() {
      return i.canRedo;
    },
    clear() {
      i.clear(), n();
    },
    onChange(l) {
      return i.onChange(l);
    }
  };
}
const rn = 300;
function ln(r) {
  const t = new ve(), n = new ve(), i = new ve(), v = new ve(), l = new ve(), s = new ve(), p = new ve(), a = new tn(), f = new Gt((c) => {
    a.release(c);
  }), o = new Zt((c) => {
    a.release(c);
  }), m = /* @__PURE__ */ new Map();
  function k(c) {
    let g = m.get(c);
    return g || (g = nn(a, c, () => {
      var x;
      if (f.has(c) && l.emit(c, ((x = f.get(c)) == null ? void 0 : x.value) ?? null), o.has(c)) {
        const S = o.get(c);
        S && s.emit(c, S.value);
      }
    }), m.set(c, g)), g;
  }
  function b(c) {
    a.release(c), m.delete(c);
  }
  return { api: {
    getContent(c) {
      const g = r.get(c);
      return g ? g.document.content : null;
    },
    isDirty(c) {
      const g = r.get(c);
      return g ? g.document.dirty : !1;
    },
    getDocument(c) {
      const g = r.get(c);
      return g ? g.document : null;
    },
    listInstances() {
      return r.list();
    },
    openDocument(c, g) {
      r.open(c, g);
    },
    closeDocument(c) {
      r.close(c) && b(c);
    },
    updateContent(c, g, x, S) {
      var K, W;
      const I = r.get(c);
      if (!I) return;
      const T = I.document, C = T.content;
      if (C === g) return;
      const D = T.cursorStart, U = (F, Y) => {
        T.content = F, T.cursorStart = Y, T.cursorEnd = Y, t.emit(c, F);
      };
      T.content = g, T.cursorStart = x, T.cursorEnd = S;
      const A = k(c), B = Date.now(), L = A.peek(), P = ((K = L == null ? void 0 : L.meta) == null ? void 0 : K.kind) === "text-swap" ? L.meta.snapshot : void 0, M = Math.abs(g.length - C.length) <= 1, j = P && ((W = L == null ? void 0 : L.meta) == null ? void 0 : W.timestamp) != null && B - L.meta.timestamp < rn;
      P && M && j ? A.replaceTop(qe({
        setter: U,
        before: P.before,
        after: g,
        cursorBefore: P.cursorBefore,
        cursorAfter: x,
        now: B
      })) : A.push(qe({
        setter: U,
        before: C,
        after: g,
        cursorBefore: D,
        cursorAfter: x,
        now: B
      }));
      const O = T.dirty;
      T.dirty = !0, t.emit(c, g), O || n.emit(c, !0);
    },
    markClean(c) {
      const g = r.get(c);
      g && g.document.dirty && (g.document.dirty = !1, n.emit(c, !1));
    },
    onContentChange(c) {
      return t.on(c);
    },
    onDirtyChange(c) {
      return n.on(c);
    },
    onSave(c) {
      return i.on(c);
    },
    onPrefsChange(c) {
      return v.on(c);
    },
    openInspector(c, g) {
      f.open(c, g);
    },
    closeInspector(c) {
      f.close(c) && b(c);
    },
    getInspectorValue(c) {
      var g;
      return ((g = f.get(c)) == null ? void 0 : g.value) ?? null;
    },
    listInspectorInstances() {
      return f.list();
    },
    onInspectorValueChange(c) {
      return l.on(c);
    },
    openColorPicker(c, g) {
      o.open(c, g);
    },
    closeColorPicker(c) {
      o.close(c) && b(c);
    },
    getColorPickerValue(c) {
      var g;
      return ((g = o.get(c)) == null ? void 0 : g.value) ?? null;
    },
    listColorPickerInstances() {
      return o.list();
    },
    onColorPickerValueChange(c) {
      return s.on(c);
    },
    onColorPickerPrefsChange(c) {
      return p.on(c);
    },
    history: k
  }, internals: {
    emitSave(c) {
      i.emit(c);
    },
    contentChange: t,
    dirtyChange: n,
    saveEvent: i,
    prefsChange: v,
    inspectorValueChange: l,
    colorPickerValueChange: s,
    colorPickerPrefsChange: p,
    history: k,
    inspectors: f,
    colorPickers: o
  }, teardown: () => {
    t.clear(), n.clear(), i.clear(), v.clear(), l.clear(), s.clear(), p.clear(), a.clear(), m.clear(), f.clear(), o.clear();
  } };
}
const $e = "sh3-editor.inspectorRenderer", et = [
  {
    id: "pastel",
    label: "Pastel",
    colors: [
      "#ffb3ba",
      "#ffdfba",
      "#ffffba",
      "#baffc9",
      "#bae1ff",
      "#e8baff",
      "#ffb3de",
      "#c9baff",
      "#baf2ff",
      "#ffdab3"
    ],
    builtin: !0
  },
  {
    id: "neon",
    label: "Neon",
    colors: [
      "#ff0080",
      "#ff00ff",
      "#8000ff",
      "#0040ff",
      "#00ffff",
      "#00ff40",
      "#80ff00",
      "#ffff00",
      "#ff8000",
      "#ff0040"
    ],
    builtin: !0
  },
  {
    id: "earth",
    label: "Earth Tones",
    colors: [
      "#8b4513",
      "#a0522d",
      "#cd853f",
      "#deb887",
      "#d2b48c",
      "#bc8f8f",
      "#808000",
      "#6b8e23",
      "#556b2f",
      "#8fbc8f"
    ],
    builtin: !0
  },
  {
    id: "web1",
    label: "Web 1.0",
    colors: [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ff6600",
      "#663399",
      "#009900",
      "#cc0000",
      "#336699",
      "#ffffff"
    ],
    builtin: !0
  },
  {
    id: "mono",
    label: "Monochrome",
    colors: [
      "#000000",
      "#1a1a1a",
      "#333333",
      "#4d4d4d",
      "#666666",
      "#808080",
      "#999999",
      "#b3b3b3",
      "#cccccc",
      "#e6e6e6",
      "#f2f2f2",
      "#ffffff"
    ],
    builtin: !0
  },
  {
    id: "ocean",
    label: "Ocean",
    colors: [
      "#001f3f",
      "#003366",
      "#005b96",
      "#0077b6",
      "#00b4d8",
      "#48cae4",
      "#90e0ef",
      "#ade8f4",
      "#caf0f8",
      "#023e8a"
    ],
    builtin: !0
  },
  {
    id: "sunset",
    label: "Sunset",
    colors: [
      "#ff6b35",
      "#ff8c42",
      "#ffb347",
      "#ffd700",
      "#ff4500",
      "#dc143c",
      "#c71585",
      "#8b008b",
      "#ff69b4",
      "#ffa07a"
    ],
    builtin: !0
  },
  {
    id: "jewel",
    label: "Jewel Tones",
    colors: [
      "#50c878",
      "#0f52ba",
      "#e0115f",
      "#9966cc",
      "#ff7518",
      "#4b0082",
      "#006d6f",
      "#cf1020",
      "#ffd700",
      "#228b22"
    ],
    builtin: !0
  }
];
var an = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">H</span> <input type="range" min="0" max="360" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">S</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">V</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), sn = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">R</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">G</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">B</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), on = e.from_html("<option> </option>"), cn = e.from_html('<button type="button"></button>'), dn = e.from_html('<div class="cp-save-prompt svelte-7v5dlc"><input type="text" class="cp-save-input svelte-7v5dlc" placeholder="Palette name"/> <button type="button" class="cp-palette-btn svelte-7v5dlc">OK</button> <button type="button" class="cp-palette-btn svelte-7v5dlc">Cancel</button></div>'), un = e.from_html('<div role="group" aria-label="Color picker"><div class="cp-main svelte-7v5dlc"><div class="cp-left svelte-7v5dlc"><div class="cp-body svelte-7v5dlc"><canvas class="cp-square svelte-7v5dlc" role="slider" aria-label="Saturation and value"></canvas> <canvas class="cp-strip svelte-7v5dlc" role="slider" aria-label="Hue"></canvas></div> <div class="cp-mode svelte-7v5dlc"><button type="button">HSV</button> <button type="button">RGB</button></div> <!> <div class="cp-hex-row svelte-7v5dlc"><div class="cp-preview svelte-7v5dlc"></div> <input type="text" class="cp-hex-input svelte-7v5dlc" aria-label="Hex value"/></div></div> <div class="cp-right svelte-7v5dlc"><div class="cp-palette svelte-7v5dlc"><select class="cp-palette-select svelte-7v5dlc" aria-label="Palette"></select> <div class="cp-swatches svelte-7v5dlc"></div> <div class="cp-palette-actions svelte-7v5dlc"><button type="button" class="cp-palette-btn svelte-7v5dlc" title="Save current color to a palette">+ Save</button> <button type="button" class="cp-palette-btn cp-delete svelte-7v5dlc">Delete</button></div> <!></div></div></div></div>');
function rt(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "readonly", 3, !1), i = e.prop(t, "initialMode", 3, "hsv"), v = e.prop(t, "userPalettes", 19, () => []);
  const l = 180, s = 20, p = te(t.value) ?? "#000000";
  let a = e.state(e.proxy(fe(p))), f = p, o = e.state(e.proxy(i()));
  e.user_effect(() => {
    const d = te(t.value) ?? "#000000";
    d !== f && (e.set(a, fe(d), !0), f = d, e.set(R, d.toUpperCase(), !0));
  });
  function m(d) {
    const y = te(d);
    y && y !== f && (f = y, t.onChange(y));
  }
  function k() {
    m(Ie(e.get(a)));
  }
  let b = e.state(void 0), h = e.state(void 0);
  const u = typeof window < "u" && window.devicePixelRatio || 1;
  function _() {
    if (!e.get(b)) return;
    const d = l, y = l;
    e.get(b).width = d * u, e.get(b).height = y * u, e.get(b).style.width = d + "px", e.get(b).style.height = y + "px";
    const E = e.get(b).getContext("2d"), H = E.createImageData(d * u, y * u), q = H.data;
    for (let N = 0; N < y * u; N++)
      for (let X = 0; X < d * u; X++) {
        const z = X / u / d * 100, ee = (1 - N / u / y) * 100, Q = be({ h: e.get(a).h, s: z, v: ee }), oe = (N * d * u + X) * 4;
        q[oe] = Q.r, q[oe + 1] = Q.g, q[oe + 2] = Q.b, q[oe + 3] = 255;
      }
    E.putImageData(H, 0, 0), c();
  }
  function c() {
    if (!e.get(b)) return;
    const d = e.get(b).getContext("2d"), y = e.get(a).s / 100 * l, E = (1 - e.get(a).v / 100) * l;
    d.save(), d.scale(u, u), d.beginPath(), d.arc(y, E, 6, 0, Math.PI * 2), d.strokeStyle = "#ffffff", d.lineWidth = 2, d.stroke(), d.beginPath(), d.arc(y, E, 7, 0, Math.PI * 2), d.strokeStyle = "#000000", d.lineWidth = 1, d.stroke(), d.restore();
  }
  function g() {
    if (!e.get(h)) return;
    const d = s, y = l;
    e.get(h).width = d * u, e.get(h).height = y * u, e.get(h).style.width = d + "px", e.get(h).style.height = y + "px";
    const E = e.get(h).getContext("2d"), H = E.createImageData(d * u, y * u), q = H.data;
    for (let N = 0; N < y * u; N++) {
      const X = N / (y * u) * 360, z = be({ h: X, s: 100, v: 100 });
      for (let ee = 0; ee < d * u; ee++) {
        const Q = (N * d * u + ee) * 4;
        q[Q] = z.r, q[Q + 1] = z.g, q[Q + 2] = z.b, q[Q + 3] = 255;
      }
    }
    E.putImageData(H, 0, 0), x();
  }
  function x() {
    if (!e.get(h)) return;
    const d = e.get(h).getContext("2d"), y = e.get(a).h / 360 * l;
    d.save(), d.scale(u, u), d.beginPath(), d.moveTo(0, y), d.lineTo(s, y), d.strokeStyle = "#ffffff", d.lineWidth = 2, d.stroke(), d.beginPath(), d.moveTo(0, y), d.lineTo(s, y), d.strokeStyle = "#000000", d.lineWidth = 1, d.stroke(), d.restore();
  }
  je(() => {
    _(), g();
  });
  let S = e.state(e.proxy(e.get(a).h));
  e.user_effect(() => {
    e.get(a).h !== e.get(S) ? (e.set(S, e.get(a).h, !0), _(), g()) : _();
  });
  let I = e.state(!1), T = e.state(!1);
  function C(d) {
    if (n() || !e.get(b)) return;
    const y = e.get(b).getBoundingClientRect(), E = Math.max(0, Math.min(l, d.clientX - y.left)), H = Math.max(0, Math.min(l, d.clientY - y.top)), q = E / l * 100, N = (1 - H / l) * 100;
    e.set(a, { h: e.get(a).h, s: Math.round(q), v: Math.round(N) }, !0);
  }
  function D(d) {
    if (n() || !e.get(h)) return;
    const y = e.get(h).getBoundingClientRect(), H = Math.max(0, Math.min(l, d.clientY - y.top)) / l * 360;
    e.set(a, { h: Math.round(H), s: e.get(a).s, v: e.get(a).v }, !0);
  }
  function U(d) {
    n() || (e.set(I, !0), C(d), window.addEventListener("mousemove", B), window.addEventListener("mouseup", L));
  }
  function A(d) {
    n() || (e.set(T, !0), D(d), window.addEventListener("mousemove", B), window.addEventListener("mouseup", L));
  }
  function B(d) {
    e.get(I) ? C(d) : e.get(T) && D(d);
  }
  function L() {
    (e.get(I) || e.get(T)) && m(Ie(e.get(a))), e.set(I, !1), e.set(T, !1), window.removeEventListener("mousemove", B), window.removeEventListener("mouseup", L);
  }
  const P = "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)", M = e.derived(() => `linear-gradient(to right, #ffffff, ${_e(be({ h: e.get(a).h, s: 100, v: e.get(a).v }))})`), j = e.derived(() => `linear-gradient(to right, #000000, ${_e(be({ h: e.get(a).h, s: e.get(a).s, v: 100 }))})`), O = e.derived(() => be(e.get(a)));
  function K(d) {
    e.set(a, { ...e.get(a), h: +d.target.value }, !0);
  }
  function W(d) {
    e.set(a, { ...e.get(a), s: +d.target.value }, !0);
  }
  function F(d) {
    e.set(a, { ...e.get(a), v: +d.target.value }, !0);
  }
  function Y(d) {
    const y = +d.target.value;
    e.set(a, fe(_e({ r: y, g: e.get(O).g, b: e.get(O).b })), !0);
  }
  function Be(d) {
    const y = +d.target.value;
    e.set(a, fe(_e({ r: e.get(O).r, g: y, b: e.get(O).b })), !0);
  }
  function ne(d) {
    const y = +d.target.value;
    e.set(a, fe(_e({ r: e.get(O).r, g: e.get(O).g, b: y })), !0);
  }
  function w(d) {
    var y;
    e.get(o) !== d && (e.set(o, d, !0), (y = t.onModeChange) == null || y.call(t, d));
  }
  let R = e.state(e.proxy(p.toUpperCase()));
  e.user_effect(() => {
    e.set(R, Ie(e.get(a)).toUpperCase(), !0);
  });
  function G() {
    if (n()) return;
    const d = e.get(R).trim(), y = te(d);
    if (!y) {
      e.set(R, Ie(e.get(a)).toUpperCase(), !0);
      return;
    }
    e.set(a, fe(y), !0), m(y);
  }
  function V(d) {
    d.key === "Enter" && (d.preventDefault(), d.currentTarget.blur());
  }
  const de = e.derived(() => Ie(e.get(a))), ye = e.derived(() => [...et, ...v()]);
  let ae = e.state(e.proxy(et[0].id));
  const J = e.derived(() => e.get(ye).find((d) => d.id === e.get(ae)) ?? e.get(ye)[0]);
  function re(d) {
    if (n()) return;
    const y = te(d);
    y && (e.set(a, fe(y), !0), m(y));
  }
  let ie = e.state(!1), se = e.state("");
  function Ne() {
    return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "u-" + Math.random().toString(36).slice(2, 10);
  }
  function Fe() {
    var y, E;
    if (n()) return;
    if ((y = e.get(J)) != null && y.builtin) {
      e.set(se, ""), e.set(ie, !0);
      return;
    }
    if (!e.get(J)) return;
    const d = {
      ...e.get(J),
      colors: [...e.get(J).colors, e.get(de)]
    };
    (E = t.onSaveUserPalette) == null || E.call(t, d);
  }
  function ke() {
    var E;
    if (n()) return;
    const d = e.get(se).trim();
    if (!d) return;
    const y = { id: "user-" + Ne(), label: d, colors: [e.get(de)] };
    (E = t.onSaveUserPalette) == null || E.call(t, y), e.set(ae, y.id, !0), e.set(ie, !1), e.set(se, "");
  }
  function we() {
    e.set(ie, !1), e.set(se, "");
  }
  function At() {
    var y;
    if (n() || !e.get(J) || e.get(J).builtin) return;
    const d = e.get(J).id;
    (y = t.onDeleteUserPalette) == null || y.call(t, d), e.set(ae, et[0].id, !0);
  }
  function Mt(d) {
    const y = d.target, E = d.shiftKey ? 10 : 1;
    if (y === e.get(b)) {
      if (d.key === "ArrowLeft") {
        d.preventDefault(), e.set(a, { ...e.get(a), s: Math.max(0, e.get(a).s - E) }, !0), k();
        return;
      }
      if (d.key === "ArrowRight") {
        d.preventDefault(), e.set(a, { ...e.get(a), s: Math.min(100, e.get(a).s + E) }, !0), k();
        return;
      }
      if (d.key === "ArrowUp") {
        d.preventDefault(), e.set(a, { ...e.get(a), v: Math.min(100, e.get(a).v + E) }, !0), k();
        return;
      }
      if (d.key === "ArrowDown") {
        d.preventDefault(), e.set(a, { ...e.get(a), v: Math.max(0, e.get(a).v - E) }, !0), k();
        return;
      }
    } else if (y === e.get(h)) {
      if (d.key === "ArrowUp") {
        d.preventDefault(), e.set(a, { ...e.get(a), h: Math.max(0, e.get(a).h - E) }, !0), k();
        return;
      }
      if (d.key === "ArrowDown") {
        d.preventDefault(), e.set(a, { ...e.get(a), h: Math.min(360, e.get(a).h + E) }, !0), k();
        return;
      }
    }
  }
  var xe = un();
  let st;
  var ot = e.child(xe), Ke = e.child(ot), ze = e.child(Ke), ue = e.child(ze);
  e.set_attribute(ue, "aria-valuemin", 0), e.set_attribute(ue, "aria-valuemax", 100), e.bind_this(ue, (d) => e.set(b, d), () => e.get(b));
  var he = e.sibling(ue, 2);
  e.set_attribute(he, "aria-valuemin", 0), e.set_attribute(he, "aria-valuemax", 360), e.bind_this(he, (d) => e.set(h, d), () => e.get(h)), e.reset(ze);
  var We = e.sibling(ze, 2), Ve = e.child(We);
  let ct;
  var Ge = e.sibling(Ve, 2);
  let dt;
  e.reset(We);
  var ut = e.sibling(We, 2);
  {
    var Ut = (d) => {
      var y = an(), E = e.child(y), H = e.sibling(e.child(E), 2);
      e.remove_input_defaults(H), e.set_style(H, "", {}, { "--track-bg": P });
      var q = e.sibling(H, 2), N = e.child(q);
      e.reset(q), e.reset(E);
      var X = e.sibling(E, 2), z = e.sibling(e.child(X), 2);
      e.remove_input_defaults(z);
      let ee;
      var Q = e.sibling(z, 2), oe = e.child(Q);
      e.reset(Q), e.reset(X);
      var ce = e.sibling(X, 2), le = e.sibling(e.child(ce), 2);
      e.remove_input_defaults(le);
      let Le;
      var pt = e.sibling(le, 2), Bt = e.child(pt);
      e.reset(pt), e.reset(ce), e.reset(y), e.template_effect(() => {
        e.set_value(H, e.get(a).h), H.disabled = n(), e.set_text(N, `${e.get(a).h ?? ""}°`), e.set_value(z, e.get(a).s), z.disabled = n(), ee = e.set_style(z, "", ee, { "--track-bg": e.get(M) }), e.set_text(oe, `${e.get(a).s ?? ""}%`), e.set_value(le, e.get(a).v), le.disabled = n(), Le = e.set_style(le, "", Le, { "--track-bg": e.get(j) }), e.set_text(Bt, `${e.get(a).v ?? ""}%`);
      }), e.delegated("input", H, K), e.delegated("change", H, k), e.delegated("input", z, W), e.delegated("change", z, k), e.delegated("input", le, F), e.delegated("change", le, k), e.append(d, y);
    }, Rt = (d) => {
      var y = sn(), E = e.child(y), H = e.sibling(e.child(E), 2);
      e.remove_input_defaults(H);
      var q = e.sibling(H, 2), N = e.child(q, !0);
      e.reset(q), e.reset(E);
      var X = e.sibling(E, 2), z = e.sibling(e.child(X), 2);
      e.remove_input_defaults(z);
      var ee = e.sibling(z, 2), Q = e.child(ee, !0);
      e.reset(ee), e.reset(X);
      var oe = e.sibling(X, 2), ce = e.sibling(e.child(oe), 2);
      e.remove_input_defaults(ce);
      var le = e.sibling(ce, 2), Le = e.child(le, !0);
      e.reset(le), e.reset(oe), e.reset(y), e.template_effect(() => {
        e.set_value(H, e.get(O).r), H.disabled = n(), e.set_text(N, e.get(O).r), e.set_value(z, e.get(O).g), z.disabled = n(), e.set_text(Q, e.get(O).g), e.set_value(ce, e.get(O).b), ce.disabled = n(), e.set_text(Le, e.get(O).b);
      }), e.delegated("input", H, Y), e.delegated("change", H, k), e.delegated("input", z, Be), e.delegated("change", z, k), e.delegated("input", ce, ne), e.delegated("change", ce, k), e.append(d, y);
    };
    e.if(ut, (d) => {
      e.get(o) === "hsv" ? d(Ut) : d(Rt, -1);
    });
  }
  var ft = e.sibling(ut, 2), vt = e.child(ft);
  let gt;
  var Ce = e.sibling(vt, 2);
  e.remove_input_defaults(Ce), e.reset(ft), e.reset(Ke);
  var ht = e.sibling(Ke, 2), mt = e.child(ht), Pe = e.child(mt);
  e.each(Pe, 21, () => e.get(ye), (d) => d.id, (d, y) => {
    var E = on(), H = e.child(E);
    e.reset(E);
    var q = {};
    e.template_effect(() => {
      e.set_text(H, `${e.get(y).label ?? ""}${e.get(y).builtin ? "" : " (user)"}`), q !== (q = e.get(y).id) && (E.value = (E.__value = e.get(y).id) ?? "");
    }), e.append(d, E);
  }), e.reset(Pe);
  var Xe = e.sibling(Pe, 2);
  e.each(Xe, 21, () => {
    var d;
    return ((d = e.get(J)) == null ? void 0 : d.colors) ?? [];
  }, e.index, (d, y) => {
    var E = cn();
    let H, q;
    e.template_effect(
      (N, X, z) => {
        H = e.set_class(E, 1, "cp-swatch svelte-7v5dlc", null, H, N), e.set_attribute(E, "title", X), e.set_attribute(E, "aria-label", z), E.disabled = n(), q = e.set_style(E, "", q, { "background-color": e.get(y) });
      },
      [
        () => ({
          active: e.get(y).toLowerCase() === e.get(de).toLowerCase()
        }),
        () => e.get(y).toUpperCase(),
        () => e.get(y).toUpperCase()
      ]
    ), e.delegated("click", E, () => re(e.get(y))), e.append(d, E);
  }), e.reset(Xe);
  var Ye = e.sibling(Xe, 2), Je = e.child(Ye), Qe = e.sibling(Je, 2);
  e.reset(Ye);
  var Ht = e.sibling(Ye, 2);
  {
    var Ot = (d) => {
      var y = dn(), E = e.child(y);
      e.remove_input_defaults(E);
      var H = e.sibling(E, 2), q = e.sibling(H, 2);
      e.reset(y), e.template_effect((N) => H.disabled = N, [() => !e.get(se).trim()]), e.delegated("keydown", E, (N) => {
        N.key === "Enter" && ke(), N.key === "Escape" && we();
      }), e.bind_value(E, () => e.get(se), (N) => e.set(se, N)), e.delegated("click", H, ke), e.delegated("click", q, we), e.append(d, y);
    };
    e.if(Ht, (d) => {
      e.get(ie) && d(Ot);
    });
  }
  e.reset(mt), e.reset(ht), e.reset(ot), e.reset(xe), e.template_effect(() => {
    var d, y;
    st = e.set_class(xe, 1, "cp-surface svelte-7v5dlc", null, st, { disabled: n() }), e.set_attribute(ue, "aria-valuenow", e.get(a).v), e.set_attribute(ue, "tabindex", n() ? -1 : 0), e.set_attribute(he, "aria-valuenow", e.get(a).h), e.set_attribute(he, "tabindex", n() ? -1 : 0), Ve.disabled = n(), ct = e.set_class(Ve, 1, "svelte-7v5dlc", null, ct, { active: e.get(o) === "hsv" }), Ge.disabled = n(), dt = e.set_class(Ge, 1, "svelte-7v5dlc", null, dt, { active: e.get(o) === "rgb" }), gt = e.set_style(vt, "", gt, { "background-color": e.get(de) }), Ce.disabled = n(), Pe.disabled = n(), Je.disabled = n(), Qe.disabled = n() || (((d = e.get(J)) == null ? void 0 : d.builtin) ?? !0), e.set_attribute(Qe, "title", (y = e.get(J)) != null && y.builtin ? "Built-in palettes cannot be deleted" : "Delete palette");
  }), e.delegated("keydown", xe, Mt), e.delegated("mousedown", ue, U), e.delegated("mousedown", he, A), e.delegated("click", Ve, () => w("hsv")), e.delegated("click", Ge, () => w("rgb")), e.event("blur", Ce, G), e.delegated("keydown", Ce, V), e.bind_value(Ce, () => e.get(R), (d) => e.set(R, d)), e.bind_select_value(Pe, () => e.get(ae), (d) => e.set(ae, d)), e.delegated("click", Je, Fe), e.delegated("click", Qe, At), e.append(r, xe), e.pop();
}
e.delegate(["keydown", "mousedown", "click", "input", "change"]);
var fn = e.from_html('<div class="cp-pick-title svelte-1n3y1cm"> </div>'), vn = e.from_html("<!> <!>", 1);
function gn(r, t) {
  e.push(t, !0);
  let n = e.state(e.proxy(t.initial)), i = !1, v = !1, l = !1;
  function s(b) {
    l || (l = !0, t.onResolve(b));
  }
  function p(b) {
    b.key === "Escape" && (i = !0);
  }
  je(() => {
    document.addEventListener("keydown", p, !0);
  }), Pt(() => {
    document.removeEventListener("keydown", p, !0), s(hn({
      escapePressed: i,
      userTouched: v,
      currentValue: e.get(n)
    }));
  });
  function a(b) {
    v = !0, e.set(n, b, !0);
  }
  var f = vn(), o = e.first_child(f);
  {
    var m = (b) => {
      var h = fn(), u = e.child(h, !0);
      e.reset(h), e.template_effect(() => e.set_text(u, t.title)), e.append(b, h);
    };
    e.if(o, (b) => {
      t.title && b(m);
    });
  }
  var k = e.sibling(o, 2);
  rt(k, {
    get value() {
      return e.get(n);
    },
    initialMode: "hsv",
    get userPalettes() {
      return t.userPalettes;
    },
    onChange: a,
    onModeChange: () => {
    },
    get onSaveUserPalette() {
      return t.onSaveUserPalette;
    },
    get onDeleteUserPalette() {
      return t.onDeleteUserPalette;
    }
  }), e.append(r, f), e.pop();
}
function hn(r) {
  return r.escapePressed || !r.userTouched ? null : r.currentValue;
}
function mn(r) {
  return r && /^#[0-9a-f]{6}$/i.test(r) ? r : "#000000";
}
function pn(r, t) {
  return new Promise((n) => {
    const i = r.anchor ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    He.popup.show(
      gn,
      { anchor: i },
      {
        initial: mn(r.initial),
        title: r.title,
        userPalettes: t.userPalettes,
        onSaveUserPalette: t.onSaveUserPalette,
        onDeleteUserPalette: t.onDeleteUserPalette,
        onResolve: n
      }
    );
  });
}
const bn = "sh3-editor.color-panel";
function _n(r, t, n, i) {
  if (t) return { kind: "entry", entry: t };
  const v = n.find((l) => l.slotId === r);
  return v ? { kind: "descriptor", descriptor: v } : {
    kind: "adhoc",
    adHocValue: i == null ? void 0 : i.value,
    adHocReadonly: (i == null ? void 0 : i.readonly) ?? !1
  };
}
let St = /* @__PURE__ */ new Map();
function _t(r) {
  const t = [...r].sort((i, v) => {
    const l = i.priority ?? 10, s = v.priority ?? 10;
    return l !== s ? s - l : 0;
  }), n = /* @__PURE__ */ new Map();
  for (const i of t)
    n.has(i.type) || n.set(i.type, i);
  St = n;
}
function yn(r) {
  if (r === null || typeof r != "object") return !1;
  const t = Object.getPrototypeOf(r);
  return t === Object.prototype || t === null;
}
function yt(r) {
  var t;
  return ((t = St.get(r)) == null ? void 0 : t.component) ?? null;
}
function kn(r, t) {
  if (t != null && t.type) {
    const n = yt(t.type);
    if (n) return { kind: "custom", component: n };
  }
  if (r !== null && typeof r == "object" && typeof r.__type == "string") {
    const n = yt(r.__type);
    if (n) return { kind: "custom", component: n };
  }
  return yn(r) || Array.isArray(r) ? { kind: "walker" } : { kind: "leaf" };
}
let It = null;
function kt(r) {
  It = r;
}
function wn() {
  return It;
}
const Et = "sh3-editor:help.tabs";
function $(r) {
  return r.ctrlKey || r.metaKey;
}
function xn(r, t, n, i, v = 2) {
  const l = " ".repeat(v);
  if (t === n && !i)
    return {
      content: r.slice(0, t) + l + r.slice(n),
      selectionStart: t + l.length,
      selectionEnd: t + l.length
    };
  const s = r.lastIndexOf(`
`, t - 1) + 1, p = r.slice(s, n).split(`
`);
  let a = t, f = n;
  const o = p.map((k, b) => {
    var h;
    if (i) {
      const u = ((h = k.match(new RegExp(`^ {1,${v}}`))) == null ? void 0 : h[0].length) ?? 0;
      return b === 0 && (a = Math.max(s, t - u)), f -= u, k.slice(u);
    } else
      return b === 0 && (a = t + l.length), f += l.length, l + k;
  });
  return { content: r.slice(0, s) + o.join(`
`) + r.slice(s + p.join(`
`).length), selectionStart: a, selectionEnd: f };
}
function Cn(r, t, n, i, v = 2, l = "inline") {
  if (i === "none") return null;
  const s = r.lastIndexOf(`
`, t - 1) + 1, a = r.slice(s, t).match(/^[ \t]*/)[0], f = " ".repeat(v);
  if (i === "indent") {
    const u = `
` + a;
    return {
      content: r.slice(0, t) + u + r.slice(n),
      selectionStart: t + u.length,
      selectionEnd: t + u.length
    };
  }
  const o = t > 0 ? r[t - 1] : "", m = n < r.length ? r[n] : "", k = o === "{";
  if (k && m === "}") {
    if (l === "inline") {
      const S = `
` + a + f + `
` + a, I = t + 1 + a.length + f.length;
      return {
        content: r.slice(0, t) + S + r.slice(n),
        selectionStart: I,
        selectionEnd: I
      };
    }
    const u = r.slice(0, t - 1), _ = r.slice(n), c = `
` + a + `{
` + a + f + `
` + a, g = u + c + _, x = u.length + (`
` + a + `{
` + a + f).length;
    return { content: g, selectionStart: x, selectionEnd: x };
  }
  if (k) {
    const u = `
` + a + f;
    return {
      content: r.slice(0, t) + u + r.slice(n),
      selectionStart: t + u.length,
      selectionEnd: t + u.length
    };
  }
  const h = `
` + a;
  return {
    content: r.slice(0, t) + h + r.slice(n),
    selectionStart: t + h.length,
    selectionEnd: t + h.length
  };
}
function Pn(r, t, n, i = 2) {
  if (t !== n) return null;
  const v = r.lastIndexOf(`
`, t - 1) + 1, l = r.slice(v, t);
  if (!/^[ \t]*$/.test(l)) return null;
  let s = 0, p = -1;
  for (let m = v - 1; m >= 0; m--) {
    const k = r[m];
    if (k === "}") s++;
    else if (k === "{") {
      if (s === 0) {
        p = m;
        break;
      }
      s--;
    }
  }
  let a;
  if (p === -1) {
    const m = Math.max(0, l.length - i);
    a = l.slice(0, m);
  } else {
    const m = r.lastIndexOf(`
`, p - 1) + 1;
    a = r.slice(m, p).match(/^[ \t]*/)[0];
  }
  if (a.length >= l.length) return null;
  const f = r.slice(0, v) + a + "}" + r.slice(n), o = v + a.length + 1;
  return { content: f, selectionStart: o, selectionEnd: o };
}
var Sn = e.from_html('<span class="toolbar-sep svelte-10sr5yt"></span>'), In = e.from_html("<button><!> </button>"), En = e.from_html("<!> <!>", 1), Dn = e.from_html('<div class="toolbar-spacer svelte-10sr5yt"></div> <span class="toolbar-path svelte-10sr5yt"> </span>', 1), Tn = e.from_html('<div class="toolbar svelte-10sr5yt"><!> <!></div>');
function it(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "filePath", 3, null), i = e.derived(() => {
    const p = [], a = /* @__PURE__ */ new Map();
    for (const f of t.actions) {
      const o = f.group ?? "_default";
      if (!a.has(o)) {
        const m = [];
        a.set(o, m), p.push({ key: o, items: m });
      }
      a.get(o).push(f);
    }
    return p;
  });
  var v = e.comment(), l = e.first_child(v);
  {
    var s = (p) => {
      var a = Tn(), f = e.child(a);
      e.each(f, 17, () => e.get(i), e.index, (k, b, h) => {
        var u = En(), _ = e.first_child(u);
        {
          var c = (x) => {
            var S = Sn();
            e.append(x, S);
          };
          e.if(_, (x) => {
            h > 0 && x(c);
          });
        }
        var g = e.sibling(_, 2);
        e.each(g, 17, () => e.get(b).items, (x) => x.id, (x, S) => {
          var I = In();
          let T;
          var C = e.child(I);
          {
            var D = (A) => {
              var B = e.text();
              e.template_effect(() => e.set_text(B, e.get(S).icon)), e.append(A, B);
            };
            e.if(C, (A) => {
              e.get(S).icon && A(D);
            });
          }
          var U = e.sibling(C, 1, !0);
          e.reset(I), e.template_effect(() => {
            T = e.set_class(I, 1, "toolbar-btn svelte-10sr5yt", null, T, { "toolbar-accent": e.get(S).accent }), I.disabled = e.get(S).disabled, e.set_attribute(I, "title", e.get(S).shortcut ? `${e.get(S).label} (${e.get(S).shortcut})` : e.get(S).label), e.set_text(U, e.get(S).label);
          }), e.delegated("click", I, function(...A) {
            var B;
            (B = e.get(S).onAction) == null || B.apply(this, A);
          }), e.append(x, I);
        }), e.append(k, u);
      });
      var o = e.sibling(f, 2);
      {
        var m = (k) => {
          var b = Dn(), h = e.sibling(e.first_child(b), 2), u = e.child(h, !0);
          e.reset(h), e.template_effect(
            (_) => {
              e.set_attribute(h, "title", n()), e.set_text(u, _);
            },
            [() => n().split(/[/\\]/).pop()]
          ), e.append(k, b);
        };
        e.if(o, (k) => {
          n() && k(m);
        });
      }
      e.reset(a), e.append(p, a);
    };
    e.if(l, (p) => {
      (t.actions.length > 0 || n()) && p(s);
    });
  }
  e.append(r, v), e.pop();
}
e.delegate(["click"]);
var An = e.from_html('<div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Brace style</span> <div class="seg svelte-1etykqv"><button type="button">Inline</button> <button type="button">Allman</button></div></div>'), Mn = e.from_html('<div class="body svelte-1etykqv"><h2 class="svelte-1etykqv">Editor settings</h2> <div class="rows svelte-1etykqv"><div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Indent unit</span> <div class="seg svelte-1etykqv"><button type="button">2</button> <button type="button">4</button></div></div> <!></div> <div class="actions svelte-1etykqv"><button type="button" class="secondary svelte-1etykqv">Close</button></div></div>');
function Un(r, t) {
  e.push(t, !0);
  let n = e.proxy({ ...t.prefs });
  function i(c) {
    n.indentUnit = c, t.onChange({ ...n });
  }
  function v(c) {
    n.braceStyle = c, t.onChange({ ...n });
  }
  var l = Mn(), s = e.sibling(e.child(l), 2), p = e.child(s), a = e.sibling(e.child(p), 2), f = e.child(a);
  let o;
  var m = e.sibling(f, 2);
  let k;
  e.reset(a), e.reset(p);
  var b = e.sibling(p, 2);
  {
    var h = (c) => {
      var g = An(), x = e.sibling(e.child(g), 2), S = e.child(x);
      let I;
      var T = e.sibling(S, 2);
      let C;
      e.reset(x), e.reset(g), e.template_effect(() => {
        I = e.set_class(S, 1, "svelte-1etykqv", null, I, { active: (n.braceStyle ?? "inline") === "inline" }), C = e.set_class(T, 1, "svelte-1etykqv", null, C, { active: (n.braceStyle ?? "inline") === "allman" });
      }), e.delegated("click", S, () => v("inline")), e.delegated("click", T, () => v("allman")), e.append(c, g);
    };
    e.if(b, (c) => {
      t.indentType === "brace" && c(h);
    });
  }
  e.reset(s);
  var u = e.sibling(s, 2), _ = e.child(u);
  e.reset(u), e.reset(l), e.template_effect(() => {
    o = e.set_class(f, 1, "svelte-1etykqv", null, o, { active: (n.indentUnit ?? 2) === 2 }), k = e.set_class(m, 1, "svelte-1etykqv", null, k, { active: (n.indentUnit ?? 2) === 4 });
  }), e.delegated("click", f, () => i(2)), e.delegated("click", m, () => i(4)), e.delegated("click", _, function(...c) {
    var g;
    (g = t.close) == null || g.apply(this, c);
  }), e.append(r, l), e.pop();
}
e.delegate(["click"]);
var Rn = e.from_html('<div class="line-num svelte-1j4uh1h"> </div>'), Hn = e.from_html('<div class="editor-container svelte-1j4uh1h"><!> <div class="editor-wrap svelte-1j4uh1h"><div class="gutter svelte-1j4uh1h"><div class="gutter-inner svelte-1j4uh1h"></div></div> <div class="editor-body svelte-1j4uh1h"><pre class="highlight-layer svelte-1j4uh1h" aria-hidden="true"></pre> <textarea class="input-layer svelte-1j4uh1h" autocapitalize="off"></textarea></div></div></div>');
function On(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "entry", 7), i = e.prop(t, "fontSize", 3, 13), v = e.prop(t, "toolbarActions", 19, () => []), l = e.derived(() => n().document), s = e.state(e.proxy(e.get(l).content)), p = e.derived(() => {
    var w, R;
    return ((w = t.matchingConfig) == null ? void 0 : w.indentType) ?? ((R = t.matchingConfig) != null && R.indentBased ? "indent" : "none");
  }), a = e.derived(() => e.get(p) === "none" ? 0 : e.get(p) === "brace" ? 2 : 1), f = e.derived(() => (t.showSettings ?? !0) && e.get(a) > 0);
  const o = 300, m = (w, R) => {
    e.set(s, w, !0), e.get(l).content = w, e.get(l).cursorStart = R, e.get(l).cursorEnd = R, t.internals.contentChange.emit(e.get(l).id, w), C(R, R);
  };
  function k() {
    He.modal.open(Un, {
      indentType: e.get(p),
      prefs: n().prefs,
      onChange: h
    });
  }
  let b = e.derived(() => {
    if (!e.get(f)) return v();
    const w = {
      id: "sh3-editor:toolbar",
      label: "Settings",
      icon: "⚙",
      onAction: k,
      group: "_editor_builtin"
    };
    return [...v(), w];
  });
  function h(w) {
    n().prefs = { ...n().prefs, ...w }, t.internals.prefsChange.emit(n().document.id, { ...n().prefs });
  }
  e.user_effect(() => {
    e.set(s, e.get(l).content, !0);
  });
  let u = e.state(void 0), _ = e.state(0), c = e.state(0), g = e.derived(() => t.highlight && e.get(l).language ? t.highlight(e.get(s), e.get(l).language) : I(e.get(s))), x = e.derived(() => e.get(s).split(`
`).length), S = e.derived(() => Array.from({ length: e.get(x) }, (w, R) => R + 1));
  function I(w) {
    return w.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function T(w, R, G) {
    var ke, we;
    e.set(s, w, !0);
    const V = e.get(l).id, de = e.get(l).content;
    if (de === w) return;
    const ye = e.get(l).cursorStart;
    e.get(l).content = w, e.get(l).cursorStart = R, e.get(l).cursorEnd = G;
    const ae = t.internals.history(V), J = Date.now(), re = ae.peek(), ie = ((ke = re == null ? void 0 : re.meta) == null ? void 0 : ke.kind) === "text-swap" ? re.meta.snapshot : void 0, se = Math.abs(w.length - de.length) <= 1, Ne = ie && ((we = re == null ? void 0 : re.meta) == null ? void 0 : we.timestamp) != null && J - re.meta.timestamp < o;
    ie && se && Ne ? ae.replaceTop(qe({
      setter: m,
      before: ie.before,
      after: w,
      cursorBefore: ie.cursorBefore,
      cursorAfter: R,
      now: J
    })) : ae.push(qe({
      setter: m,
      before: de,
      after: w,
      cursorBefore: ye,
      cursorAfter: R,
      now: J
    }));
    const Fe = e.get(l).dirty;
    e.get(l).dirty = !0, t.internals.contentChange.emit(V, w), Fe || t.internals.dirtyChange.emit(V, !0);
  }
  function C(w, R) {
    requestAnimationFrame(() => {
      e.get(u) && (e.get(u).selectionStart = w, e.get(u).selectionEnd = R);
    });
  }
  function D(w) {
    var R;
    if (w.key === "s" && $(w)) {
      w.preventDefault(), t.internals.emitSave(e.get(l).id);
      return;
    }
    if (w.key.toLowerCase() === "z" && $(w) && !w.shiftKey) {
      w.preventDefault(), t.internals.history(e.get(l).id).undo();
      return;
    }
    if (w.key.toLowerCase() === "y" && $(w) || w.key.toLowerCase() === "z" && $(w) && w.shiftKey) {
      w.preventDefault(), t.internals.history(e.get(l).id).redo();
      return;
    }
    if (w.key === "Enter" && !w.shiftKey && !$(w) && !w.altKey) {
      if (e.get(p) === "none") return;
      const G = w.currentTarget, V = Cn(e.get(s), G.selectionStart, G.selectionEnd, e.get(p), n().prefs.indentUnit, n().prefs.braceStyle);
      V && (w.preventDefault(), T(V.content, V.selectionStart, V.selectionEnd), C(V.selectionStart, V.selectionEnd));
      return;
    }
    if (w.key === "}" && e.get(p) === "brace" && !$(w) && !w.altKey) {
      const G = w.currentTarget, V = Pn(e.get(s), G.selectionStart, G.selectionEnd, n().prefs.indentUnit);
      if (V) {
        w.preventDefault(), T(V.content, V.selectionStart, V.selectionEnd), C(V.selectionStart, V.selectionEnd);
        return;
      }
    }
    if (w.key === "Tab") {
      w.preventDefault();
      const G = w.currentTarget, V = xn(e.get(s), G.selectionStart, G.selectionEnd, w.shiftKey, (R = t.matchingConfig) == null ? void 0 : R.indentUnit);
      V && (T(V.content, V.selectionStart, V.selectionEnd), C(V.selectionStart, V.selectionEnd));
      return;
    }
  }
  function U(w) {
    const R = w.currentTarget;
    T(R.value, R.selectionStart, R.selectionEnd);
  }
  function A(w) {
    const R = w.currentTarget;
    e.set(_, R.scrollTop, !0), e.set(c, R.scrollLeft, !0);
  }
  function B() {
    e.get(u) && (e.get(l).cursorStart = e.get(u).selectionStart, e.get(l).cursorEnd = e.get(u).selectionEnd);
  }
  var L = Hn(), P = e.child(L);
  it(P, {
    get actions() {
      return e.get(b);
    },
    get filePath() {
      return e.get(l).filePath;
    }
  });
  var M = e.sibling(P, 2);
  let j;
  var O = e.child(M), K = e.child(O);
  let W;
  e.each(K, 20, () => e.get(S), (w) => w, (w, R) => {
    var G = Rn(), V = e.child(G, !0);
    e.reset(G), e.template_effect(() => e.set_text(V, R)), e.append(w, G);
  }), e.reset(K), e.reset(O);
  var F = e.sibling(O, 2), Y = e.child(F);
  let Be;
  e.html(Y, () => e.get(g) + `
`, !0), e.reset(Y);
  var ne = e.sibling(Y, 2);
  e.remove_textarea_child(ne), e.set_attribute(ne, "spellcheck", !1), e.bind_this(ne, (w) => e.set(u, w), () => e.get(u)), e.reset(F), e.reset(M), e.reset(L), e.template_effect(() => {
    j = e.set_style(M, "", j, { "--editor-font-size": `${i() ?? ""}px` }), W = e.set_style(K, "", W, { transform: `translateY(-${e.get(_) ?? ""}px)` }), Be = e.set_style(Y, "", Be, {
      top: `-${e.get(_) ?? ""}px`,
      left: `-${e.get(c) ?? ""}px`
    }), e.set_value(ne, e.get(s));
  }), e.delegated("keydown", ne, D), e.delegated("input", ne, U), e.event("scroll", ne, A), e.event("select", ne, B), e.append(r, L), e.pop();
}
e.delegate(["keydown", "input"]);
function Dt(r, t, n, i) {
  return r && r(t, n) === !0 ? !0 : (i(), !1);
}
var Bn = e.from_html('<div><span class="label svelte-2gtehg"> </span> <span class="value svelte-2gtehg"><!></span></div>');
function tt(r, t) {
  let n = e.prop(t, "readonly", 3, !1);
  var i = Bn();
  let v;
  var l = e.child(i), s = e.child(l, !0);
  e.reset(l);
  var p = e.sibling(l, 2), a = e.child(p);
  e.snippet(a, () => t.children), e.reset(p), e.reset(i), e.template_effect(() => {
    v = e.set_class(i, 1, "field svelte-2gtehg", null, v, { readonly: n() }), e.set_text(s, t.label);
  }), e.append(r, i);
}
var Vn = e.from_html('<input type="checkbox"/>'), Ln = e.from_html('<input class="primitive svelte-1o84d6l"/>');
function qn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "readonly", 3, !1), i = e.state(e.proxy(v(t.value)));
  e.user_effect(() => {
    e.set(i, v(t.value), !0);
  });
  function v(h) {
    return h === null ? "null" : h === void 0 ? "" : typeof h == "boolean" ? h ? "true" : "false" : String(h);
  }
  function l(h, u) {
    if (u === "boolean") return h === "true";
    if (u === "number") {
      const _ = Number(h);
      return Number.isFinite(_) ? _ : t.value;
    }
    return h;
  }
  let s = e.derived(() => typeof t.value == "number" ? "number" : typeof t.value == "boolean" ? "boolean" : "string");
  function p() {
    if (n() || !t.onCommit) return;
    const h = l(e.get(i), e.get(s));
    h !== null && h !== t.value && t.onCommit(h);
  }
  function a(h) {
    if (n() || !t.onCommit) return;
    const u = h.target.checked;
    u !== t.value && t.onCommit(u);
  }
  function f(h) {
    h.key === "Enter" ? h.currentTarget.blur() : h.key === "Escape" && (e.set(i, v(t.value), !0), h.currentTarget.blur());
  }
  var o = e.comment(), m = e.first_child(o);
  {
    var k = (h) => {
      var u = Vn();
      e.remove_input_defaults(u), e.template_effect(
        (_) => {
          e.set_checked(u, _), u.disabled = n();
        },
        [() => !!t.value]
      ), e.delegated("change", u, a), e.append(h, u);
    }, b = (h) => {
      var u = Ln();
      e.remove_input_defaults(u), e.template_effect(() => {
        e.set_attribute(u, "type", e.get(s) === "number" ? "number" : "text"), u.disabled = n();
      }), e.event("blur", u, p), e.delegated("keydown", u, f), e.bind_value(u, () => e.get(i), (_) => e.set(i, _)), e.append(h, u);
    };
    e.if(m, (h) => {
      e.get(s) === "boolean" ? h(k) : h(b, -1);
    });
  }
  e.append(r, o), e.pop();
}
e.delegate(["change", "keydown"]);
var jn = e.from_html('<div class="walker svelte-1xvtj10"></div>');
function Nn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "basePath", 19, () => []);
  function i(f) {
    return f == null || typeof f == "string" || typeof f == "number" || typeof f == "boolean";
  }
  function v(f, o, m) {
    const k = f[o], b = {
      apply() {
        f[o] = m;
      },
      revert() {
        f[o] = k;
      },
      meta: { kind: "walker-edit", label: String(o) }
    };
    t.api.push(b), f[o] = m;
  }
  function l(f) {
    return (o) => {
      Dt(t.walkerOnCommit, [...n(), f], o, () => v(t.value, f, o));
    };
  }
  function s(f) {
    return (o) => v(t.value, f, o);
  }
  let p = e.derived(() => Array.isArray(t.value) ? t.value.map((f, o) => {
    var m;
    return { key: o, child: f, fieldMeta: (m = t.meta) == null ? void 0 : m.item };
  }) : t.value && typeof t.value == "object" ? Object.keys(t.value).map((f) => {
    var o, m;
    return {
      key: f,
      child: t.value[f],
      fieldMeta: (m = (o = t.meta) == null ? void 0 : o.fields) == null ? void 0 : m[f]
    };
  }) : []);
  var a = jn();
  e.each(a, 21, () => e.get(p), (f) => f.key, (f, o) => {
    var m = e.comment(), k = e.first_child(m);
    {
      var b = (h) => {
        const u = e.derived(() => {
          var C;
          return ((C = e.get(o).fieldMeta) == null ? void 0 : C.label) ?? (typeof e.get(o).key == "number" ? `[${e.get(o).key}]` : String(e.get(o).key));
        }), _ = e.derived(() => {
          var C;
          return (((C = e.get(o).fieldMeta) == null ? void 0 : C.readonly) ?? !1) || t.api.readonly;
        });
        var c = e.comment(), g = e.first_child(c);
        {
          var x = (C) => {
            tt(C, {
              get label() {
                return e.get(u);
              },
              get readonly() {
                return e.get(_);
              },
              children: (D, U) => {
                {
                  let A = e.derived(() => e.get(_) ? void 0 : s(e.get(o).key)), B = e.derived(() => [...n(), e.get(o).key]);
                  lt(D, {
                    get value() {
                      return e.get(o).child;
                    },
                    get meta() {
                      return e.get(o).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(A);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(B);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, S = (C) => {
            tt(C, {
              get label() {
                return e.get(u);
              },
              get readonly() {
                return e.get(_);
              },
              children: (D, U) => {
                {
                  let A = e.derived(() => e.get(_) ? void 0 : l(e.get(o).key));
                  qn(D, {
                    get value() {
                      return e.get(o).child;
                    },
                    get readonly() {
                      return e.get(_);
                    },
                    get onCommit() {
                      return e.get(A);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, I = e.derived(() => i(e.get(o).child)), T = (C) => {
            tt(C, {
              get label() {
                return e.get(u);
              },
              get readonly() {
                return e.get(_);
              },
              children: (D, U) => {
                {
                  let A = e.derived(() => e.get(_) ? void 0 : s(e.get(o).key)), B = e.derived(() => [...n(), e.get(o).key]);
                  lt(D, {
                    get value() {
                      return e.get(o).child;
                    },
                    get meta() {
                      return e.get(o).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(A);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(B);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          };
          e.if(g, (C) => {
            var D;
            (D = e.get(o).fieldMeta) != null && D.type ? C(x) : e.get(I) ? C(S, 1) : C(T, -1);
          });
        }
        e.append(h, c);
      };
      e.if(k, (h) => {
        var u;
        (u = e.get(o).fieldMeta) != null && u.hidden || h(b);
      });
    }
    e.append(f, m);
  }), e.reset(a), e.append(r, a), e.pop();
}
var Fn = e.from_html('<span class="leaf svelte-o6duey"> </span>');
function Kn(r, t) {
  function n(l) {
    if (l === null) return "null";
    if (l === void 0) return "undefined";
    if (typeof l == "string") return `"${l}"`;
    if (typeof l == "number" || typeof l == "boolean") return String(l);
    try {
      return JSON.stringify(l);
    } catch {
      return String(l);
    }
  }
  var i = Fn(), v = e.child(i, !0);
  e.reset(i), e.template_effect((l) => e.set_text(v, l), [() => n(t.value)]), e.append(r, i);
}
function lt(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "basePath", 19, () => []), i = e.derived(() => kn(t.value, t.meta)), v = e.derived(() => {
    const m = t.onCommit, k = t.walkerOnCommit;
    if (m !== void 0)
      return k === void 0 ? m : (b) => {
        Dt(k, n(), b, () => m(b));
      };
  });
  var l = e.comment(), s = e.first_child(l);
  {
    var p = (m) => {
    }, a = (m) => {
      const k = e.derived(() => e.get(i).component);
      var b = e.comment(), h = e.first_child(b);
      e.component(h, () => e.get(k), (u, _) => {
        _(u, {
          get value() {
            return t.value;
          },
          get meta() {
            return t.meta;
          },
          get api() {
            return t.api;
          },
          get onCommit() {
            return e.get(v);
          }
        });
      }), e.append(m, b);
    }, f = (m) => {
      Nn(m, {
        get value() {
          return t.value;
        },
        get meta() {
          return t.meta;
        },
        get api() {
          return t.api;
        },
        get walkerOnCommit() {
          return t.walkerOnCommit;
        },
        get basePath() {
          return n();
        }
      });
    }, o = (m) => {
      Kn(m, {
        get value() {
          return t.value;
        }
      });
    };
    e.if(s, (m) => {
      var k;
      (k = t.meta) != null && k.hidden ? m(p) : e.get(i).kind === "custom" ? m(a, 1) : e.get(i).kind === "walker" ? m(f, 2) : m(o, -1);
    });
  }
  e.append(r, l), e.pop();
}
var zn = e.from_html('<div class="inspector-container svelte-jpxkcf" tabindex="-1" role="region" aria-label="Inspector"><!> <div class="inspector-body svelte-jpxkcf"><!></div></div>');
function Wn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "adHocReadonly", 3, !1), i = e.derived(() => t.internals.inspectors.get(t.instanceId)), v = e.derived(() => e.get(i) ? e.get(i).value : t.adHocValue), l = e.derived(() => e.get(i) ? e.get(i).meta : t.adHocMeta), s = e.derived(() => e.get(i) ? !!e.get(i).options.readonly : n()), p = e.derived(() => e.get(i) ? e.get(i).options.onCommit : void 0), a = e.derived(() => {
    var g;
    return ((g = e.get(i)) == null ? void 0 : g.options.toolbarActions) ?? [];
  });
  const f = t.internals.history(t.instanceId), o = {
    push(g) {
      e.get(s) || (f.push(g), t.internals.inspectorValueChange.emit(t.instanceId, e.get(v)));
    },
    get readonly() {
      return e.get(s);
    },
    history: f
  };
  e.user_effect(() => {
    const g = f.onChange(() => {
      t.internals.inspectorValueChange.emit(t.instanceId, e.get(v));
    });
    return () => g();
  });
  let m = e.state(void 0);
  function k(g) {
    if (g.key.toLowerCase() === "z" && $(g) && !g.shiftKey) {
      g.preventDefault(), f.undo();
      return;
    }
    if (g.key.toLowerCase() === "y" && $(g) || g.key.toLowerCase() === "z" && $(g) && g.shiftKey) {
      g.preventDefault(), f.redo();
      return;
    }
  }
  var b = zn(), h = e.child(b);
  {
    var u = (g) => {
      it(g, {
        get actions() {
          return e.get(a);
        },
        filePath: null
      });
    };
    e.if(h, (g) => {
      e.get(a).length > 0 && g(u);
    });
  }
  var _ = e.sibling(h, 2), c = e.child(_);
  lt(c, {
    get value() {
      return e.get(v);
    },
    get meta() {
      return e.get(l);
    },
    get api() {
      return o;
    },
    get walkerOnCommit() {
      return e.get(p);
    },
    basePath: []
  }), e.reset(_), e.reset(b), e.bind_this(b, (g) => e.set(m, g), () => e.get(m)), e.delegated("keydown", b, k), e.append(r, b), e.pop();
}
e.delegate(["keydown"]);
var Gn = e.from_html('<div role="region" aria-label="Color picker"><div class="cp-compact-row svelte-f5c5rv"><div class="cp-preview cp-compact-preview svelte-f5c5rv" role="button" aria-label="Open full color picker" aria-haspopup="true"></div> <input type="text" class="cp-hex-input cp-compact-hex svelte-f5c5rv" aria-label="Hex value"/></div></div>'), Xn = e.from_html('<div tabindex="-1" role="region" aria-label="Color picker"><!> <!></div>');
function Tt(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "adHocReadonly", 3, !1), i = e.prop(t, "userPalettes", 19, () => []), v = e.prop(t, "prefs", 19, () => ({ mode: "hsv" })), l = e.prop(t, "compact", 3, !1), s = e.derived(() => t.internals.colorPickers.get(t.instanceId)), p = e.derived(() => {
    var P;
    return ((P = e.get(s)) == null ? void 0 : P.options.toolbarActions) ?? [];
  }), a = e.state(e.proxy(t.descriptorBinding ? te(t.descriptorBinding.initial) ?? "#000000" : "#000000")), f = e.derived(() => e.get(s) ? e.get(s).value : t.descriptorBinding ? e.get(a) : te(t.adHocValue ?? "") ?? "#000000"), o = e.derived(() => e.get(s) ? !!e.get(s).options.readonly : n());
  const m = t.internals.history(t.instanceId);
  function k(P) {
    if (e.get(o)) return;
    const M = te(P);
    if (!M) return;
    if (t.onExternalCommit) {
      t.onExternalCommit(M);
      return;
    }
    const j = e.get(f);
    if (j === M) return;
    const O = (K) => {
      e.get(s) ? e.get(s).value = K : t.descriptorBinding && e.set(a, K, !0);
    };
    m.push({
      apply: () => O(M),
      revert: () => O(j),
      meta: { kind: "color", timestamp: Date.now() }
    }), O(M), t.internals.colorPickerValueChange.emit(t.instanceId, M), t.descriptorBinding && !e.get(s) && t.descriptorBinding.onChange(M);
  }
  e.user_effect(() => {
    const P = m.onChange(() => {
      t.internals.colorPickerValueChange.emit(t.instanceId, e.get(f)), t.descriptorBinding && !e.get(s) && t.descriptorBinding.onChange(e.get(f));
    });
    return () => P();
  });
  function b(P) {
    t.internals.colorPickerPrefsChange.emit(t.instanceId, { mode: P });
  }
  const h = e.derived(() => /^#[0-9a-f]{6}$/i.test(e.get(f)) ? e.get(f).toUpperCase() : e.get(f));
  let u = e.state(e.proxy(e.get(h)));
  e.user_effect(() => {
    e.set(u, e.get(h), !0);
  });
  function _() {
    if (e.get(o)) return;
    const P = te(e.get(u).trim());
    if (!P) {
      e.set(u, e.get(h), !0);
      return;
    }
    k(P);
  }
  function c(P) {
    P.key === "Enter" && (P.preventDefault(), P.currentTarget.blur());
  }
  let g = e.state(void 0);
  function x() {
    e.get(o) || !e.get(g) || He.popup.show(rt, { anchor: e.get(g) }, {
      value: e.get(f),
      readonly: e.get(o),
      initialMode: v().mode,
      userPalettes: i(),
      onChange: (P) => k(P),
      onModeChange: b,
      onSaveUserPalette: t.onSaveUserPalette,
      onDeleteUserPalette: t.onDeleteUserPalette
    });
  }
  function S(P) {
    (P.key === "Enter" || P.key === " ") && (P.preventDefault(), x());
  }
  let I = e.state(void 0);
  function T(P) {
    if (P.key.toLowerCase() === "z" && $(P) && !P.shiftKey) {
      P.preventDefault(), m.undo();
      return;
    }
    if (P.key.toLowerCase() === "y" && $(P) || P.key.toLowerCase() === "z" && $(P) && P.shiftKey) {
      P.preventDefault(), m.redo();
      return;
    }
  }
  let C = !1;
  function D(P) {
    if (C || !t.descriptorBinding || e.get(
      s
      // descriptor mode only
    )) return;
    const M = te(P) ?? "#000000", j = e.get(a);
    j !== M && (m.push({
      apply: () => {
        e.set(a, M, !0);
      },
      revert: () => {
        e.set(a, j, !0);
      },
      meta: { kind: "color", timestamp: Date.now(), source: "controller" }
    }), e.set(a, M, !0));
  }
  je(() => {
    var P, M;
    if (t.descriptorBinding)
      return (M = (P = t.descriptorBinding).bind) == null || M.call(P, { setValue: D }), () => {
        C = !0;
      };
  });
  var U = e.comment(), A = e.first_child(U);
  {
    var B = (P) => {
      var M = Gn();
      let j;
      var O = e.child(M), K = e.child(O);
      let W;
      e.bind_this(K, (Y) => e.set(g, Y), () => e.get(g));
      var F = e.sibling(K, 2);
      e.remove_input_defaults(F), e.reset(O), e.reset(M), e.template_effect(() => {
        j = e.set_class(M, 1, "cp-compact svelte-f5c5rv", null, j, { disabled: e.get(o) }), e.set_attribute(K, "tabindex", e.get(o) ? -1 : 0), W = e.set_style(K, "", W, { "background-color": e.get(f) }), F.disabled = e.get(o);
      }), e.delegated("click", K, x), e.delegated("keydown", K, S), e.event("blur", F, _), e.delegated("keydown", F, c), e.bind_value(F, () => e.get(u), (Y) => e.set(u, Y)), e.append(P, M);
    }, L = (P) => {
      var M = Xn();
      let j;
      var O = e.child(M);
      {
        var K = (F) => {
          it(F, {
            get actions() {
              return e.get(p);
            },
            filePath: null
          });
        };
        e.if(O, (F) => {
          e.get(p).length > 0 && F(K);
        });
      }
      var W = e.sibling(O, 2);
      rt(W, {
        get value() {
          return e.get(f);
        },
        get readonly() {
          return e.get(o);
        },
        get initialMode() {
          return v().mode;
        },
        get userPalettes() {
          return i();
        },
        onChange: k,
        onModeChange: b,
        get onSaveUserPalette() {
          return t.onSaveUserPalette;
        },
        get onDeleteUserPalette() {
          return t.onDeleteUserPalette;
        }
      }), e.reset(M), e.bind_this(M, (F) => e.set(I, F), () => e.get(I)), e.template_effect(() => j = e.set_class(M, 1, "cp svelte-f5c5rv", null, j, { disabled: e.get(o) })), e.delegated("keydown", M, T), e.append(P, M);
    };
    e.if(A, (P) => {
      l() ? P(B) : P(L, -1);
    });
  }
  e.append(r, U), e.pop();
}
e.delegate(["click", "keydown"]);
var Yn = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>'), Jn = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>');
function Qn(r, t) {
  e.push(t, !0);
  const n = wn();
  let i = e.derived(() => typeof t.value == "string" ? t.value : null);
  var v = e.comment(), l = e.first_child(v);
  {
    var s = (f) => {
      var o = Yn(), m = e.child(o, !0);
      e.reset(o), e.template_effect((k) => e.set_text(m, k), [() => String(t.value)]), e.append(f, o);
    }, p = (f) => {
      var o = Jn(), m = e.child(o, !0);
      e.reset(o), e.template_effect(() => e.set_text(m, e.get(i))), e.append(f, o);
    }, a = (f) => {
      Tt(f, {
        instanceId: "inspector-color",
        get internals() {
          return n.internals;
        },
        compact: !0,
        get adHocValue() {
          return e.get(i);
        },
        get adHocReadonly() {
          return t.api.readonly;
        },
        get userPalettes() {
          return n.userPalettes;
        },
        get onSaveUserPalette() {
          return n.onSaveUserPalette;
        },
        get onDeleteUserPalette() {
          return n.onDeleteUserPalette;
        },
        onExternalCommit: (o) => {
          var m;
          return (m = t.onCommit) == null ? void 0 : m.call(t, o);
        }
      });
    };
    e.if(l, (f) => {
      e.get(i) === null ? f(s) : n ? f(a, -1) : f(p, 1);
    });
  }
  e.append(r, v), e.pop();
}
const nt = "sh3-editor.settings";
function wt(r, t, n, i) {
  const v = { ...r[t] ?? {} };
  return i === void 0 ? delete v[n] : v[n] = i, { ...r, [t]: v };
}
function Zn(r, t) {
  const n = Object.keys(r);
  if (n.length === 0) return r;
  const i = new Set(t);
  let v = !1;
  for (const s of n)
    if (!i.has(s)) {
      v = !0;
      break;
    }
  if (!v) return r;
  const l = {};
  for (const s of n)
    i.has(s) && (l[s] = r[s]);
  return l;
}
var $n = e.from_html('<h3 class="section-label svelte-18qjjuf"> </h3>'), er = e.from_html('<section class="section svelte-18qjjuf"><!> <div class="rows svelte-18qjjuf"><!></div></section>');
function tr(r, t) {
  var n = er(), i = e.child(n);
  {
    var v = (p) => {
      var a = $n(), f = e.child(a, !0);
      e.reset(a), e.template_effect(() => e.set_text(f, t.label)), e.append(p, a);
    };
    e.if(i, (p) => {
      t.showHeader && p(v);
    });
  }
  var l = e.sibling(i, 2), s = e.child(l);
  e.snippet(s, () => t.children), e.reset(l), e.reset(n), e.append(r, n);
}
var nr = e.from_html('<div class="desc svelte-1rh69ln"> </div>'), rr = e.from_html('<div class="error svelte-1rh69ln"> </div>'), lr = e.from_html('<div><div class="label-col"><div class="label svelte-1rh69ln"> </div> <!></div> <div class="control svelte-1rh69ln"><!></div> <!></div>');
function Oe(r, t) {
  let n = e.prop(t, "disabled", 3, !1);
  var i = lr();
  let v;
  var l = e.child(i), s = e.child(l), p = e.child(s, !0);
  e.reset(s);
  var a = e.sibling(s, 2);
  {
    var f = (h) => {
      var u = nr(), _ = e.child(u, !0);
      e.reset(u), e.template_effect(() => e.set_text(_, t.description)), e.append(h, u);
    };
    e.if(a, (h) => {
      t.description && h(f);
    });
  }
  e.reset(l);
  var o = e.sibling(l, 2), m = e.child(o);
  e.snippet(m, () => t.children), e.reset(o);
  var k = e.sibling(o, 2);
  {
    var b = (h) => {
      var u = rr(), _ = e.child(u, !0);
      e.reset(u), e.template_effect(() => e.set_text(_, t.error)), e.append(h, u);
    };
    e.if(k, (h) => {
      t.error && h(b);
    });
  }
  e.reset(i), e.template_effect(() => {
    v = e.set_class(i, 1, "row svelte-1rh69ln", null, v, { disabled: n() }), e.set_text(p, t.label);
  }), e.append(r, i);
}
var ar = e.from_html('<button type="button"><span class="knob svelte-ert2i6"></span></button>');
function ir(r, t) {
  e.push(t, !0);
  const n = e.derived(() => !!t.value);
  Oe(r, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (i, v) => {
      var l = ar();
      let s;
      e.template_effect(() => {
        s = e.set_class(l, 1, "toggle svelte-ert2i6", null, s, { on: e.get(n) }), l.disabled = t.field.disabled, e.set_attribute(l, "aria-pressed", e.get(n)), e.set_attribute(l, "aria-label", t.field.label);
      }), e.delegated("click", l, () => t.onEdit(!e.get(n))), e.append(i, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
var sr = e.from_html('<input type="text"/>');
function or(r, t) {
  e.push(t, !0);
  const n = e.derived(() => t.value == null ? "" : String(t.value));
  Oe(r, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (i, v) => {
      var l = sr();
      e.remove_input_defaults(l);
      let s;
      e.template_effect(() => {
        s = e.set_class(l, 1, "input svelte-1jljyjf", null, s, { error: !!t.error }), e.set_attribute(l, "placeholder", t.field.placeholder ?? ""), l.disabled = t.field.disabled, e.set_value(l, e.get(n));
      }), e.delegated("change", l, (p) => t.onEdit(p.currentTarget.value)), e.append(i, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var cr = e.from_html('<span class="unit svelte-1be7g0v"> </span>'), dr = e.from_html('<input type="number"/> <!>', 1);
function ur(r, t) {
  e.push(t, !0);
  const n = e.derived(() => typeof t.value == "number" ? String(t.value) : "");
  function i(v) {
    const l = v.currentTarget.value, s = Number(l);
    l === "" || Number.isNaN(s) || t.onEdit(s);
  }
  Oe(r, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (v, l) => {
      var s = dr(), p = e.first_child(s);
      e.remove_input_defaults(p);
      let a;
      var f = e.sibling(p, 2);
      {
        var o = (m) => {
          var k = cr(), b = e.child(k, !0);
          e.reset(k), e.template_effect(() => e.set_text(b, t.field.unit)), e.append(m, k);
        };
        e.if(f, (m) => {
          t.field.unit && m(o);
        });
      }
      e.template_effect(() => {
        a = e.set_class(p, 1, "input svelte-1be7g0v", null, a, { error: !!t.error }), e.set_attribute(p, "min", t.field.min), e.set_attribute(p, "max", t.field.max), e.set_attribute(p, "step", t.field.step ?? 1), p.disabled = t.field.disabled, e.set_value(p, e.get(n));
      }), e.delegated("change", p, i), e.append(v, s);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var fr = e.from_html('<input type="range"/> <span class="value svelte-1jyn88"> </span>', 1);
function vr(r, t) {
  e.push(t, !0);
  const n = e.derived(() => i(typeof t.value == "number" ? t.value : t.field.min, t.field.min, t.field.max));
  function i(l, s, p) {
    return Math.min(p, Math.max(s, l));
  }
  function v(l) {
    const s = Number(l.currentTarget.value);
    Number.isNaN(s) || t.onEdit(i(s, t.field.min, t.field.max));
  }
  Oe(r, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (l, s) => {
      var p = fr(), a = e.first_child(p);
      e.remove_input_defaults(a);
      let f;
      var o = e.sibling(a, 2), m = e.child(o);
      e.reset(o), e.template_effect(() => {
        f = e.set_class(a, 1, "slider svelte-1jyn88", null, f, { error: !!t.error }), e.set_attribute(a, "min", t.field.min), e.set_attribute(a, "max", t.field.max), e.set_attribute(a, "step", t.field.step ?? 1), a.disabled = t.field.disabled, e.set_value(a, e.get(n)), e.set_text(m, `${e.get(n) ?? ""}${t.field.unit ? ` ${t.field.unit}` : ""}`);
      }), e.delegated("input", a, v), e.append(l, p);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["input"]);
var gr = e.from_html('<button type="button"> </button>'), hr = e.from_html("<div></div>");
function mr(r, t) {
  e.push(t, !0);
  const n = e.derived(() => typeof t.value == "string" ? t.value : "");
  Oe(r, {
    get label() {
      return t.field.label;
    },
    get description() {
      return t.field.description;
    },
    get disabled() {
      return t.field.disabled;
    },
    get error() {
      return t.error;
    },
    children: (i, v) => {
      var l = hr();
      let s;
      e.each(l, 21, () => t.field.options, (p) => p.value, (p, a) => {
        var f = gr();
        let o;
        var m = e.child(f, !0);
        e.reset(f), e.template_effect(() => {
          f.disabled = t.field.disabled, o = e.set_class(f, 1, "svelte-iu603z", null, o, { active: e.get(n) === e.get(a).value }), e.set_text(m, e.get(a).label);
        }), e.delegated("click", f, () => t.onEdit(e.get(a).value)), e.append(p, f);
      }), e.reset(l), e.template_effect(() => s = e.set_class(l, 1, "seg svelte-iu603z", null, s, { error: !!t.error })), e.append(i, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
const pr = {
  boolean: ir,
  string: or,
  number: ur,
  "number-range": vr,
  enum: mr
};
var br = e.from_html('<p class="empty svelte-mrn94a">No settings available.</p>'), _r = e.from_html('<div class="settings svelte-mrn94a"><h2 class="title svelte-mrn94a">Settings</h2> <!></div>');
function yr(r, t) {
  e.push(t, !0);
  let n = e.state(e.proxy(t.ctx.contributions.list(nt))), i = e.state(e.proxy({})), v = e.state(e.proxy({}));
  e.user_effect(() => t.ctx.contributions.onChange(nt, () => {
    e.set(n, t.ctx.contributions.list(nt), !0);
  })), e.user_effect(() => {
    var k;
    const o = [], m = {};
    for (const b of e.get(n)) {
      m[b.shardId] = b.getValues();
      const h = (k = b.subscribe) == null ? void 0 : k.call(b, () => {
        e.set(i, { ...e.get(i), [b.shardId]: b.getValues() }, !0);
      });
      h && o.push(h);
    }
    return e.set(i, m, !0), e.set(v, Zn(e.get(v), e.get(n).map((b) => b.shardId)), !0), () => o.forEach((b) => b());
  });
  async function l(o, m, k) {
    try {
      await o.onEdit(m, k), e.set(v, wt(e.get(v), o.shardId, m, void 0), !0);
    } catch (b) {
      e.set(v, wt(e.get(v), o.shardId, m, b.message || "Invalid value"), !0);
    } finally {
      e.set(i, { ...e.get(i), [o.shardId]: o.getValues() }, !0);
    }
  }
  var s = _r(), p = e.sibling(e.child(s), 2);
  {
    var a = (o) => {
      var m = br();
      e.append(o, m);
    }, f = (o) => {
      var m = e.comment(), k = e.first_child(m);
      e.each(k, 17, () => e.get(n), (b) => b.shardId, (b, h) => {
        {
          let u = e.derived(() => e.get(n).length > 1);
          tr(b, {
            get label() {
              return e.get(h).label;
            },
            get showHeader() {
              return e.get(u);
            },
            children: (_, c) => {
              var g = e.comment(), x = e.first_child(g);
              e.each(x, 17, () => e.get(h).schema, (S) => S.key, (S, I) => {
                var T = e.comment(), C = e.first_child(T);
                {
                  let D = e.derived(() => {
                    var A;
                    return (A = e.get(i)[e.get(h).shardId]) == null ? void 0 : A[e.get(I).key];
                  }), U = e.derived(() => {
                    var A;
                    return (A = e.get(v)[e.get(h).shardId]) == null ? void 0 : A[e.get(I).key];
                  });
                  e.component(C, () => pr[e.get(I).type], (A, B) => {
                    B(A, {
                      get field() {
                        return e.get(I);
                      },
                      get value() {
                        return e.get(D);
                      },
                      get error() {
                        return e.get(U);
                      },
                      onEdit: (L) => l(e.get(h), e.get(I).key, L)
                    });
                  });
                }
                e.append(S, T);
              }), e.append(_, g);
            }
          });
        }
      }), e.append(o, m);
    };
    e.if(p, (o) => {
      e.get(n).length === 0 ? o(a) : o(f, -1);
    });
  }
  e.reset(s), e.append(r, s), e.pop();
}
function kr(r, t = {}) {
  const n = t.warn ?? ((l) => console.warn(l)), i = /* @__PURE__ */ new Set(), v = [];
  for (let l = 0; l < r.length; l++) {
    const s = r[l];
    if (i.has(s.id)) {
      n(`[sh3-editor] duplicate help tab id "${s.id}" — first registration kept, this one ignored.`);
      continue;
    }
    i.add(s.id), v.push({ c: s, i: l });
  }
  return v.sort((l, s) => {
    const p = l.c.priority ?? 100, a = s.c.priority ?? 100;
    return p !== a ? p - a : l.i - s.i;
  }), v.map((l) => l.c);
}
function wr(r) {
  return {
    activeAppId: r.getActiveApp(),
    focusedViewId: r.readFocusedViewId(),
    mountedViewIds: [...r.listMountedViewIds()],
    selection: r.getSelection(),
    capturedAt: r.now()
  };
}
function xr(r) {
  const t = r.doc ?? (typeof document < "u" ? document : void 0);
  return {
    getActiveApp: () => r.getActiveAppId(),
    listMountedViewIds: () => {
      if (!t) return [];
      const n = t.querySelectorAll("[data-sh3-view]"), i = /* @__PURE__ */ new Set();
      return n.forEach((v) => {
        const l = v.getAttribute("data-sh3-view");
        l && i.add(l);
      }), [...i];
    },
    readFocusedViewId: () => {
      if (!t || !t.activeElement) return null;
      const n = t.activeElement.closest("[data-sh3-view]");
      return (n == null ? void 0 : n.getAttribute("data-sh3-view")) ?? null;
    },
    getSelection: () => r.getSelection(),
    now: () => Date.now()
  };
}
const Cr = {
  Meta: "⌘",
  Ctrl: "⌃",
  Alt: "⌥",
  Shift: "⇧"
};
function Pr(r, t) {
  if (!r) return "—";
  const n = r.split("+");
  if (t === "mac") {
    let i = "";
    for (let v = 0; v < n.length; v++) {
      const l = n[v];
      i += Cr[l] ?? l;
    }
    return i;
  }
  return r;
}
function Sr() {
  return typeof navigator > "u" ? "other" : (navigator.platform || navigator.userAgent || "").includes("Mac") ? "mac" : "other";
}
var Ir = e.from_html('<span>App: <code class="svelte-151qe3m"> </code></span>'), Er = e.from_html('<span>Focused view: <code class="svelte-151qe3m"> </code></span>'), Dr = e.from_html('<header class="ctx svelte-151qe3m"><!> <!> <!></header>'), Tr = e.from_html('<p class="empty svelte-151qe3m">No hotkeys active in this context.</p>'), Ar = e.from_html('<span class="badge svelte-151qe3m"> </span>'), Mr = e.from_html('<li><span class="label svelte-151qe3m"> </span> <kbd class="kbd svelte-151qe3m"> </kbd> <!></li>'), Ur = e.from_html('<section class="group svelte-151qe3m"><h3 class="group-title svelte-151qe3m"> </h3> <ul class="list svelte-151qe3m"></ul></section>'), Rr = e.from_html('<div class="hotkeys-tab svelte-151qe3m"><!> <!></div>');
function Hr(r, t) {
  e.push(t, !0);
  const n = Sr(), i = {
    home: "Global",
    app: "App",
    view: "View",
    focus: "Focus",
    element: "Selection"
  };
  function v(u) {
    if (u.scope === "home") return "home";
    if (u.scope === "app") return "app";
    if (typeof u.scope == "string") {
      if (u.scope.startsWith("view:")) return "view";
      if (u.scope.startsWith("focus:")) return "focus";
    }
    return "element";
  }
  const l = ["home", "app", "view", "focus", "element"], s = e.derived(() => {
    const u = /* @__PURE__ */ new Map();
    for (const _ of t.actions) {
      const c = v(_), g = u.get(c) ?? [];
      g.push(_), u.set(c, g);
    }
    for (const _ of u.values())
      _.sort((c, g) => {
        const x = c.group ?? "", S = g.group ?? "";
        return x !== S ? x.localeCompare(S) : c.label.localeCompare(g.label);
      });
    return l.map((_) => ({ tier: _, label: i[_], items: u.get(_) ?? [] })).filter((_) => _.items.length > 0);
  }), { snapshot: p } = t.tabCtx, a = p.activeAppId !== null || p.focusedViewId !== null;
  var f = Rr(), o = e.child(f);
  {
    var m = (u) => {
      var _ = Dr(), c = e.child(_);
      {
        var g = (C) => {
          var D = Ir(), U = e.sibling(e.child(D)), A = e.child(U, !0);
          e.reset(U), e.reset(D), e.template_effect(() => e.set_text(A, p.activeAppId)), e.append(C, D);
        };
        e.if(c, (C) => {
          p.activeAppId && C(g);
        });
      }
      var x = e.sibling(c, 2);
      {
        var S = (C) => {
          var D = e.text("·");
          e.append(C, D);
        };
        e.if(x, (C) => {
          p.activeAppId && p.focusedViewId && C(S);
        });
      }
      var I = e.sibling(x, 2);
      {
        var T = (C) => {
          var D = Er(), U = e.sibling(e.child(D)), A = e.child(U, !0);
          e.reset(U), e.reset(D), e.template_effect(() => e.set_text(A, p.focusedViewId)), e.append(C, D);
        };
        e.if(I, (C) => {
          p.focusedViewId && C(T);
        });
      }
      e.reset(_), e.append(u, _);
    };
    e.if(o, (u) => {
      a && u(m);
    });
  }
  var k = e.sibling(o, 2);
  {
    var b = (u) => {
      var _ = Tr();
      e.append(u, _);
    }, h = (u) => {
      var _ = e.comment(), c = e.first_child(_);
      e.each(c, 17, () => e.get(s), (g) => g.tier, (g, x) => {
        var S = Ur(), I = e.child(S), T = e.child(I, !0);
        e.reset(I);
        var C = e.sibling(I, 2);
        e.each(C, 21, () => e.get(x).items, (D) => D.id, (D, U) => {
          var A = Mr();
          let B;
          var L = e.child(A), P = e.child(L, !0);
          e.reset(L);
          var M = e.sibling(L, 2), j = e.child(M, !0);
          e.reset(M);
          var O = e.sibling(M, 2);
          {
            var K = (W) => {
              var F = Ar(), Y = e.child(F, !0);
              e.reset(F), e.template_effect(() => e.set_text(Y, e.get(U).scopeBadge)), e.append(W, F);
            };
            e.if(O, (W) => {
              e.get(U).scopeBadge && W(K);
            });
          }
          e.reset(A), e.template_effect(
            (W) => {
              B = e.set_class(A, 1, "row svelte-151qe3m", null, B, { disabled: e.get(U).effectiveShortcut === null }), e.set_text(P, e.get(U).label), e.set_text(j, W);
            },
            [
              () => Pr(e.get(U).effectiveShortcut, n)
            ]
          ), e.append(D, A);
        }), e.reset(C), e.reset(S), e.template_effect(() => e.set_text(T, e.get(x).label)), e.append(g, S);
      }), e.append(u, _);
    };
    e.if(k, (u) => {
      e.get(s).length === 0 ? u(b) : u(h, -1);
    });
  }
  e.reset(f), e.append(r, f), e.pop();
}
var Or = e.from_html('<button class="close-btn svelte-udgkd3" aria-label="Close help">×</button>'), Br = e.from_html('<header class="help-header svelte-udgkd3"><span class="title svelte-udgkd3">Help</span> <!></header>'), Vr = e.from_html('<span class="tab-icon svelte-udgkd3"> </span>'), Lr = e.from_html('<button role="tab"><!> <span> </span></button>'), qr = e.from_html('<div role="tabpanel"></div>'), jr = e.from_html('<div class="tab-strip svelte-udgkd3" role="tablist"></div> <div class="tab-bodies svelte-udgkd3"></div>', 1), Nr = e.from_html('<p class="loading svelte-udgkd3">Loading…</p>'), Fr = e.from_html('<div data-sh3-view="sh3-editor:help"><!> <!></div>');
function xt(r, t) {
  e.push(t, !0);
  let n = e.state(null), i = e.state([]), v = [], l = e.state(0);
  const s = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  function a(c) {
    if (s.has(c.id)) return;
    const g = p.get(c.id);
    if (!g || !e.get(n)) return;
    const x = {
      surface: t.surface,
      snapshot: e.get(n),
      close: t.surface === "modal" ? t.close : void 0
    };
    if (c.id === "sh3-editor:help-tab:hotkeys") {
      const S = me(Hr, {
        target: g,
        props: { tabCtx: x, actions: v }
      });
      s.set(c.id, { unmount: () => pe(S) });
    } else
      s.set(c.id, c.mount(g, x));
  }
  je(() => {
    const c = jt(), g = xr({
      getActiveAppId: () => (c == null ? void 0 : c.id) ?? null,
      getSelection: () => t.ctx.actions.selection.get()
    });
    e.set(n, wr(g)), v = He.actions.listActive();
    const x = t.ctx.contributions.list(Et);
    e.set(i, kr(x));
  }), Pt(() => {
    var c;
    for (const g of s.values())
      try {
        g.unmount();
      } catch (x) {
        console.warn("[sh3-editor] Help tab unmount error:", x);
      }
    s.clear(), p.clear(), (c = t.onClose) == null || c.call(t);
  }), e.user_effect(() => {
    if (!e.get(n)) return;
    const c = e.get(i)[e.get(l)];
    c && queueMicrotask(() => a(c));
  });
  function f(c, g) {
    p.set(g, c);
    const x = e.get(i)[e.get(l)];
    return x && x.id === g && e.get(n) && a(x), {
      destroy() {
        p.delete(g);
      }
    };
  }
  var o = Fr();
  let m;
  var k = e.child(o);
  {
    var b = (c) => {
      var g = Br(), x = e.sibling(e.child(g), 2);
      {
        var S = (I) => {
          var T = Or();
          e.delegated("click", T, function(...C) {
            var D;
            (D = t.close) == null || D.apply(this, C);
          }), e.append(I, T);
        };
        e.if(x, (I) => {
          t.close && I(S);
        });
      }
      e.reset(g), e.append(c, g);
    };
    e.if(k, (c) => {
      t.surface === "modal" && c(b);
    });
  }
  var h = e.sibling(k, 2);
  {
    var u = (c) => {
      var g = jr(), x = e.first_child(g);
      e.each(x, 23, () => e.get(i), (I) => I.id, (I, T, C) => {
        var D = Lr();
        let U;
        var A = e.child(D);
        {
          var B = (M) => {
            var j = Vr(), O = e.child(j, !0);
            e.reset(j), e.template_effect(() => e.set_text(O, e.get(T).icon)), e.append(M, j);
          };
          e.if(A, (M) => {
            e.get(T).icon && M(B);
          });
        }
        var L = e.sibling(A, 2), P = e.child(L, !0);
        e.reset(L), e.reset(D), e.template_effect(() => {
          U = e.set_class(D, 1, "tab-btn svelte-udgkd3", null, U, { active: e.get(C) === e.get(l) }), e.set_attribute(D, "aria-selected", e.get(C) === e.get(l)), e.set_text(P, e.get(T).label);
        }), e.delegated("click", D, () => e.set(l, e.get(C), !0)), e.append(I, D);
      }), e.reset(x);
      var S = e.sibling(x, 2);
      e.each(S, 23, () => e.get(i), (I) => I.id, (I, T, C) => {
        var D = qr();
        let U;
        e.action(D, (A, B) => f == null ? void 0 : f(A, B), () => e.get(T).id), e.template_effect(() => U = e.set_class(D, 1, "tab-body svelte-udgkd3", null, U, { active: e.get(C) === e.get(l) })), e.append(I, D);
      }), e.reset(S), e.append(c, g);
    }, _ = (c) => {
      var g = Nr();
      e.append(c, g);
    };
    e.if(h, (c) => {
      e.get(i).length > 0 ? c(u) : c(_, -1);
    });
  }
  e.reset(o), e.template_effect(() => m = e.set_class(o, 1, "help-root svelte-udgkd3", null, m, { "modal-surface": t.surface === "modal" })), e.append(r, o), e.pop();
}
e.delegate(["click"]);
let ge = null, at = null, Ee = null, De = null, Te = null, Ae = null, Me = null;
function Xr() {
  return at;
}
const Ct = {
  manifest: {
    id: "sh3-editor",
    label: "Editor",
    views: [
      { id: "sh3-editor:editor", label: "Editor", standalone: !0 },
      { id: "sh3-editor:inspector", label: "Inspector", standalone: !0 },
      { id: "sh3-editor:color-picker", label: "Color Picker", standalone: !0 },
      { id: "sh3-editor:settings", label: "Settings", standalone: !0 },
      { id: "sh3-editor:help", label: "Help", standalone: !0 }
    ]
  },
  activate(r) {
    ge = new Wt();
    const { api: t, internals: n, teardown: i } = ln(ge);
    at = t, Ee = n, De = i, Ct.api = t;
    const v = () => {
      _t(r.contributions.list($e));
    };
    v(), Te = r.contributions.onChange($e, v);
    const l = r.state({
      user: { colorPickerPalettes: [] }
    });
    function s(b) {
      const h = l.user.colorPickerPalettes, u = h.findIndex((_) => _.id === b.id);
      u === -1 ? h.push(b) : h[u] = b;
    }
    function p(b) {
      const h = l.user.colorPickerPalettes, u = h.findIndex((_) => _.id === b);
      u !== -1 && h.splice(u, 1);
    }
    kt({
      internals: n,
      userPalettes: l.user.colorPickerPalettes,
      onSaveUserPalette: s,
      onDeleteUserPalette: p
    });
    const a = {
      id: "sh3-editor:color",
      type: "color",
      component: Qn,
      priority: 10
    };
    Ae = r.contributions.register($e, a);
    const f = {
      id: "sh3-editor:color-picker",
      priority: 10,
      open: (b) => pn(b, {
        userPalettes: l.user.colorPickerPalettes,
        onSaveUserPalette: s,
        onDeleteUserPalette: p
      })
    };
    Me = r.contributions.register(Nt, f);
    const o = {};
    r.registerView("sh3-editor:editor", {
      mount(b, h) {
        const u = h.slotId, _ = ge.get(u), c = (_ == null ? void 0 : _.options) || o, g = me(On, {
          target: b,
          props: {
            entry: _,
            internals: Ee,
            highlight: c.highlight,
            matchingConfig: c.matchingConfig,
            fontSize: c.fontSize,
            toolbarActions: c.toolbarActions,
            showSettings: c.showSettings
          }
        });
        return {
          closable: !0,
          unmount() {
            pe(g);
          }
        };
      }
    }), r.registerView("sh3-editor:inspector", {
      mount(b, h) {
        const u = h.slotId, _ = h.meta, c = me(Wn, {
          target: b,
          props: {
            instanceId: u,
            adHocValue: _ == null ? void 0 : _.value,
            adHocMeta: _ == null ? void 0 : _.meta,
            adHocReadonly: (_ == null ? void 0 : _.readonly) ?? !1,
            internals: Ee
          }
        });
        return {
          closable: !0,
          unmount() {
            pe(c);
          }
        };
      }
    }), r.registerView("sh3-editor:color-picker", {
      mount(b, h) {
        const u = h.slotId, _ = n.colorPickers.get(u), c = h.meta, g = r.contributions.list(bn), x = _n(u, _, g, c), S = me(Tt, {
          target: b,
          props: {
            instanceId: u,
            adHocValue: x.kind === "adhoc" ? x.adHocValue : void 0,
            adHocReadonly: x.kind === "adhoc" ? x.adHocReadonly : !1,
            internals: Ee,
            prefs: (_ == null ? void 0 : _.options.prefs) ?? { mode: "hsv" },
            compact: (_ == null ? void 0 : _.options.compact) ?? !1,
            userPalettes: l.user.colorPickerPalettes,
            onSaveUserPalette: s,
            onDeleteUserPalette: p,
            descriptorBinding: x.kind === "descriptor" ? x.descriptor : void 0
          }
        });
        return {
          closable: !0,
          unmount() {
            pe(S);
          }
        };
      }
    }), r.registerView("sh3-editor:settings", {
      mount(b) {
        const h = me(yr, {
          target: b,
          props: { ctx: r }
        });
        return {
          closable: !0,
          unmount() {
            pe(h);
          }
        };
      }
    }), r.registerView("sh3-editor:help", {
      mount(b) {
        const h = me(xt, {
          target: b,
          props: { surface: "view", ctx: r }
        });
        return {
          closable: !0,
          unmount() {
            pe(h);
          }
        };
      }
    });
    const m = {
      id: "sh3-editor:help-tab:hotkeys",
      label: "Hotkeys",
      priority: 0,
      mount() {
        return { unmount() {
        } };
      }
    };
    r.contributions.register(
      Et,
      m
    );
    let k = !1;
    r.actions.register({
      id: "sh3-editor:help.open",
      label: "Open Help",
      scope: ["home", "app"],
      defaultShortcut: "F1",
      allowInInputs: !0,
      paletteItem: !0,
      contextItem: !1,
      group: "Help",
      run() {
        k || (k = !0, He.modal.open(
          xt,
          { surface: "modal", ctx: r, onClose: () => {
            k = !1;
          } },
          { dismissOnBackdrop: !0 }
        ));
      }
    }), r.actions.register({
      id: "sh3-editor:settings.open",
      label: "Open Editor Settings",
      scope: "view:sh3-editor:settings",
      paletteItem: !0,
      contextItem: !1,
      group: "Editor",
      run() {
      }
    });
  },
  deactivate() {
    Ae == null || Ae(), Ae = null, Me == null || Me(), Me = null, kt(null), Te == null || Te(), Te = null, De == null || De(), ge == null || ge.clear(), _t([]), ge = null, at = null, Ee = null, De = null, Ct.api = null;
  }
};
export {
  Xr as getApi,
  Ct as shard
};
