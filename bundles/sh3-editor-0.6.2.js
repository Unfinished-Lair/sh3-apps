/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".toolbar.svelte-10sr5yt{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid var(--shell-border);background:var(--shell-bg-raised);font-family:var(--shell-font-ui);font-size:12px;flex-shrink:0}.toolbar-btn.svelte-10sr5yt{padding:2px 8px;border:1px solid var(--shell-border);border-radius:3px;background:var(--shell-bg);color:var(--shell-fg);font-size:11px;cursor:pointer;white-space:nowrap}.toolbar-btn.svelte-10sr5yt:hover:not(:disabled){background:var(--shell-bg-sunken)}.toolbar-btn.svelte-10sr5yt:disabled{opacity:.4;cursor:default}.toolbar-accent.svelte-10sr5yt{color:var(--shell-accent)}.toolbar-spacer.svelte-10sr5yt{flex:1}.toolbar-sep.svelte-10sr5yt{width:1px;height:16px;background:var(--shell-border)}.toolbar-path.svelte-10sr5yt{color:var(--shell-fg-muted);font-family:var(--shell-font-mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body.svelte-1etykqv{padding:var(--shell-pad-lg);display:flex;flex-direction:column;gap:var(--shell-pad-md);min-width:320px;font-family:var(--shell-font-ui)}h2.svelte-1etykqv{margin:0;font-size:16px;color:var(--shell-fg)}.rows.svelte-1etykqv{display:flex;flex-direction:column;gap:var(--shell-pad-sm)}.row.svelte-1etykqv{display:flex;align-items:center;justify-content:space-between;gap:var(--shell-pad-md);font-size:13px}.label.svelte-1etykqv{color:var(--shell-fg-muted)}.seg.svelte-1etykqv{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;padding:4px 10px;background:var(--shell-bg);color:var(--shell-fg);border:none;font-size:12px;cursor:pointer}.seg.svelte-1etykqv button:where(.svelte-1etykqv)+button:where(.svelte-1etykqv){border-left:1px solid var(--shell-border)}.seg.svelte-1etykqv button.active:where(.svelte-1etykqv){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-1etykqv button:where(.svelte-1etykqv):hover:not(.active){background:var(--shell-bg-sunken)}.actions.svelte-1etykqv{display:flex;justify-content:flex-end;gap:var(--shell-pad-sm)}.actions.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:var(--shell-radius-sm);cursor:pointer}.actions.svelte-1etykqv button:where(.svelte-1etykqv):hover{background:var(--shell-accent)}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv){background:transparent}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv):hover{background:var(--shell-bg-sunken)}.editor-container.svelte-1j4uh1h{display:flex;flex-direction:column;height:100%;position:relative}.editor-wrap.svelte-1j4uh1h{display:flex;height:100%;overflow:hidden;background:var(--shell-bg-sunken);font-family:var(--shell-font-mono);font-size:var(--editor-font-size, 13px);line-height:1.6;color:var(--shell-fg)}.gutter.svelte-1j4uh1h{flex-shrink:0;width:3.5em;background:var(--shell-bg-sunken);border-right:1px solid var(--shell-border);overflow:hidden;color:var(--shell-fg-muted);font-size:inherit;line-height:inherit;-webkit-user-select:none;user-select:none}.gutter-inner.svelte-1j4uh1h{text-align:right;padding:0 .5em 0 0}.line-num.svelte-1j4uh1h{font-size:.85em;height:1lh;line-height:1lh}.editor-body.svelte-1j4uh1h{position:relative;flex:1;overflow:hidden}.highlight-layer.svelte-1j4uh1h{position:absolute;top:0;left:0;margin:0;padding:0 .75em;white-space:pre;word-wrap:normal;overflow:visible;pointer-events:none;font-family:inherit;font-size:inherit;line-height:inherit;color:var(--shell-fg);-moz-tab-size:2;tab-size:2}.input-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:0;padding:0 .75em;background:transparent;border:none;outline:none;resize:none;font-family:inherit;font-size:inherit;line-height:inherit;color:transparent;caret-color:var(--shell-fg);white-space:pre;word-wrap:normal;overflow:auto;-moz-tab-size:2;tab-size:2;box-sizing:border-box}.input-layer.svelte-1j4uh1h::selection{background:#61afef40}.hl-keyword{color:#c678dd}.hl-type{color:#e5c07b}.hl-string{color:#98c379}.hl-number,.hl-bool{color:#d19a66}.hl-comment{color:#5c6370;font-style:italic}.hl-key{color:#e06c75}.hl-context{color:#56b6c2}.hl-parent,.hl-ref{color:#61afef}.hl-punct{color:var(--shell-fg-muted)}.hl-code{color:#abb2bf}.hl-heading{color:#e5c07b;font-weight:600}.hl-bold{font-weight:600}.field.svelte-2gtehg{display:grid;grid-template-columns:minmax(4em,12em) 1fr;column-gap:.75em;align-items:center;padding:.15em .5em;font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg)}.label.svelte-2gtehg{color:var(--shell-fg-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.readonly.svelte-2gtehg .value:where(.svelte-2gtehg){color:var(--shell-fg-muted)}.primitive.svelte-1o84d6l{background:var(--shell-bg-sunken);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:2px;padding:.1em .3em;font-family:var(--shell-font-mono);font-size:13px;width:100%;box-sizing:border-box}.primitive.svelte-1o84d6l:focus{outline:1px solid var(--shell-accent, #61afef)}.primitive.svelte-1o84d6l:disabled{color:var(--shell-fg-muted);cursor:default}.walker.svelte-1xvtj10{display:flex;flex-direction:column;gap:.1em;padding:.25em 0}.leaf.svelte-o6duey{font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg-muted)}.inspector-container.svelte-jpxkcf{display:flex;flex-direction:column;height:100%;background:var(--shell-bg-sunken);color:var(--shell-fg);font-family:var(--shell-font-mono);font-size:13px;outline:none}.inspector-body.svelte-jpxkcf{flex:1;overflow:auto;padding:.5em 0}.cp-surface.svelte-7v5dlc{display:flex;flex-direction:column;gap:12px;padding:12px;background:var(--shell-bg-elevated);border-radius:6px;font-family:var(--shell-font-ui);width:fit-content}.cp-surface.disabled.svelte-7v5dlc{opacity:.5;pointer-events:none}.cp-main.svelte-7v5dlc{display:flex;gap:16px}.cp-left.svelte-7v5dlc{display:flex;flex-direction:column;gap:10px}.cp-right.svelte-7v5dlc{display:flex;flex-direction:column;min-width:180px}.cp-body.svelte-7v5dlc{display:flex;gap:8px}.cp-square.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:crosshair}.cp-strip.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-mode.svelte-7v5dlc{display:inline-flex;gap:0}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:3px 10px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);cursor:pointer}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):first-child{border-radius:4px 0 0 4px;border-right:none}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):last-child{border-radius:0 4px 4px 0}.cp-mode.svelte-7v5dlc button.active:where(.svelte-7v5dlc){background:var(--shell-accent, #3a7eff);color:var(--shell-bg)}.cp-sliders.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-label.svelte-7v5dlc{width:14px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-value.svelte-7v5dlc{width:40px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-range.svelte-7v5dlc{flex:1;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:8px;border-radius:4px;background:var(--track-bg, var(--shell-input-bg));outline:none;cursor:pointer}.cp-range.svelte-7v5dlc::-webkit-slider-thumb{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-range.svelte-7v5dlc::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-hex-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-preview.svelte-7v5dlc{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-7v5dlc{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-palette.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-palette-select.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;outline:none}.cp-palette-select.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-swatches.svelte-7v5dlc{display:grid;grid-template-columns:repeat(auto-fill,minmax(24px,1fr));gap:4px}.cp-swatch.svelte-7v5dlc{width:24px;height:24px;border-radius:4px;border:1px solid var(--shell-border);cursor:pointer;padding:0;outline:none}.cp-swatch.active.svelte-7v5dlc{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-palette-actions.svelte-7v5dlc{display:flex;gap:4px}.cp-palette-btn.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-palette-btn.svelte-7v5dlc:hover:not([disabled]){background:var(--shell-bg-sunken)}.cp-palette-btn[disabled].svelte-7v5dlc{opacity:.5;cursor:not-allowed}.cp-save-prompt.svelte-7v5dlc{display:flex;gap:4px;align-items:center}.cp-save-input.svelte-7v5dlc{flex:1;min-width:0;padding:3px 6px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:12px;font-family:inherit;outline:none}.cp.svelte-f5c5rv{display:flex;flex-direction:column;border:1px solid var(--shell-border);border-radius:6px;width:fit-content}.cp.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact.svelte-f5c5rv{position:relative;display:inline-block;font-family:var(--shell-font-ui)}.cp-compact.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact-row.svelte-f5c5rv{display:flex;align-items:center;gap:6px}.cp-compact-preview.svelte-f5c5rv{width:20px;height:20px;cursor:pointer;border:1px solid var(--shell-border);border-radius:4px;flex-shrink:0;outline:none}.cp-compact-preview.svelte-f5c5rv:focus-visible{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-preview.svelte-f5c5rv{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-f5c5rv{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-f5c5rv:focus{border-color:var(--shell-accent, #3a7eff)}.cp-compact-hex.svelte-f5c5rv{width:90px;font-size:12px}.cp-leaf-fallback.svelte-1tdr2l8{font-family:var(--shell-font-mono, monospace);color:var(--shell-text-dim)}.section.svelte-18qjjuf{padding-bottom:var(--shell-pad-md);margin-bottom:var(--shell-pad-md);border-bottom:1px solid var(--shell-border)}.section.svelte-18qjjuf:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0}.section-label.svelte-18qjjuf{margin:0 0 var(--shell-pad-sm);font-size:11px;font-weight:600;color:var(--shell-accent);text-transform:uppercase;letter-spacing:.08em;font-family:var(--shell-font-ui)}.rows.svelte-18qjjuf{display:flex;flex-direction:column}.row.svelte-1rh69ln{display:grid;grid-template-columns:200px 1fr;column-gap:var(--shell-pad-md);align-items:center;padding:var(--shell-pad-sm) 0;font-family:var(--shell-font-ui);font-size:13px;color:var(--shell-fg)}.row.disabled.svelte-1rh69ln{opacity:.5;pointer-events:none}.label.svelte-1rh69ln{color:var(--shell-fg)}.desc.svelte-1rh69ln{font-size:11px;color:var(--shell-fg-muted);margin-top:2px}.control.svelte-1rh69ln{display:flex;align-items:center;gap:var(--shell-pad-sm)}.error.svelte-1rh69ln{grid-column:2;font-size:11px;color:var(--shell-error, #ff7a7a);margin-top:4px}.toggle.svelte-ert2i6{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:34px;height:18px;background:var(--shell-border);border:none;border-radius:9px;position:relative;cursor:pointer;padding:0;transition:background .1s}.toggle.on.svelte-ert2i6{background:var(--shell-accent)}.toggle[disabled].svelte-ert2i6{cursor:not-allowed}.knob.svelte-ert2i6{position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:left .1s}.toggle.on.svelte-ert2i6 .knob:where(.svelte-ert2i6){left:18px}.input.svelte-1jljyjf{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:100%;box-sizing:border-box}.input.svelte-1jljyjf:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1jljyjf{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1jljyjf{cursor:not-allowed}.input.svelte-1be7g0v{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:90px;box-sizing:border-box}.input.svelte-1be7g0v:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1be7g0v{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1be7g0v{cursor:not-allowed}.unit.svelte-1be7g0v{font-size:11px;color:var(--shell-fg-muted)}.slider.svelte-1jyn88{flex:1;accent-color:var(--shell-accent);cursor:pointer}.slider[disabled].svelte-1jyn88{cursor:not-allowed}.slider.error.svelte-1jyn88{accent-color:var(--shell-error, #ff7a7a)}.value.svelte-1jyn88{min-width:56px;text-align:right;font-size:12px;color:var(--shell-accent);font-variant-numeric:tabular-nums}.seg.svelte-iu603z{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.error.svelte-iu603z{border-color:var(--shell-error, #ff7a7a)}.seg.svelte-iu603z button:where(.svelte-iu603z){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 10px;background:var(--shell-bg-sunken);color:var(--shell-fg);border:none;cursor:pointer}.seg.svelte-iu603z button:where(.svelte-iu603z)+button:where(.svelte-iu603z){border-left:1px solid var(--shell-border)}.seg.svelte-iu603z button.active:where(.svelte-iu603z){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-iu603z button:where(.svelte-iu603z):hover:not(.active):not([disabled]){background:var(--shell-bg)}.seg.svelte-iu603z button[disabled]:where(.svelte-iu603z){cursor:not-allowed}.settings.svelte-mrn94a{padding:var(--shell-pad-lg);font-family:var(--shell-font-ui);color:var(--shell-fg);background:var(--shell-bg);min-height:100%;box-sizing:border-box}.title.svelte-mrn94a{margin:0 0 var(--shell-pad-md);font-size:16px;font-weight:600}.empty.svelte-mrn94a{color:var(--shell-fg-muted);font-style:italic;padding:var(--shell-pad-md) 0}.hotkeys-tab.svelte-151qe3m{padding:12px 16px;color:var(--shell-fg)}.ctx.svelte-151qe3m{font-size:12px;opacity:.8;margin-bottom:12px}.ctx.svelte-151qe3m code:where(.svelte-151qe3m){font-family:var(--shell-mono, monospace)}.group.svelte-151qe3m{margin-bottom:16px}.group-title.svelte-151qe3m{font-size:13px;font-weight:600;margin:0 0 6px;opacity:.9}.list.svelte-151qe3m{list-style:none;margin:0;padding:0}.row.svelte-151qe3m{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;padding:4px 0;border-bottom:1px solid var(--shell-border, #2a2a2a)}.row.disabled.svelte-151qe3m{opacity:.5}.label.svelte-151qe3m{font-size:13px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kbd.svelte-151qe3m{font-family:var(--shell-mono, monospace);font-size:12px;padding:2px 6px;border-radius:3px;background:var(--shell-surface-2, #2a2a2a)}.badge.svelte-151qe3m{font-size:11px;opacity:.6;font-family:var(--shell-mono, monospace)}.empty.svelte-151qe3m{opacity:.6;padding:16px 0}.help-root.svelte-udgkd3{display:flex;flex-direction:column;height:100%;min-height:320px;background:var(--shell-surface, #1a1a1a);color:var(--shell-fg)}.modal-surface.svelte-udgkd3{width:640px;max-width:90vw;height:480px;max-height:80vh}.help-header.svelte-udgkd3{display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid var(--shell-border, #2a2a2a)}.title.svelte-udgkd3{font-weight:600;flex:1}.close-btn.svelte-udgkd3{background:none;border:none;color:var(--shell-fg);font-size:18px;cursor:pointer;padding:0 8px;line-height:1}.tab-strip.svelte-udgkd3{display:flex;gap:2px;padding:6px 8px 0;border-bottom:1px solid var(--shell-border, #2a2a2a);background:var(--shell-surface-2, transparent)}.tab-btn.svelte-udgkd3{background:transparent;border:none;color:var(--shell-fg);padding:6px 12px;cursor:pointer;font-size:13px;border-bottom:2px solid transparent;display:inline-flex;gap:4px;align-items:center}.tab-btn.svelte-udgkd3:hover{background:var(--shell-hover, rgba(255,255,255,.05))}.tab-btn.active.svelte-udgkd3{border-bottom-color:var(--shell-accent, #3ba3ff);font-weight:600}.tab-icon.svelte-udgkd3{font-size:14px}.tab-bodies.svelte-udgkd3{flex:1;overflow:hidden;position:relative}.tab-body.svelte-udgkd3{position:absolute;top:0;right:0;bottom:0;left:0;overflow-y:auto;overflow-x:hidden;display:none}.tab-body.active.svelte-udgkd3{display:block}.loading.svelte-udgkd3{padding:16px;opacity:.6}";
  document.head.appendChild(s);
})();
var Ot = Object.defineProperty;
var ht = (r) => {
  throw TypeError(r);
};
var Lt = (r, t, n) => t in r ? Ot(r, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : r[t] = n;
var J = (r, t, n) => Lt(r, typeof t != "symbol" ? t + "" : t, n), Vt = (r, t, n) => t.has(r) || ht("Cannot " + n);
var Pe = (r, t, n) => (Vt(r, t, "read from private field"), n ? n.call(r) : t.get(r)), Je = (r, t, n) => t.has(r) ? ht("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(r) : t.set(r, n);
import { shell as qe, getActiveApp as qt } from "sh3-core";
import { onMount as xt, onDestroy as Bt, mount as me, unmount as pe } from "svelte";
import * as e from "svelte/internal/client";
import "svelte/internal/disclose-version";
const jt = 2, Nt = "inline";
function Ft(r, t) {
  return {
    indentUnit: (t == null ? void 0 : t.indentUnit) ?? (r == null ? void 0 : r.indentUnit) ?? jt,
    braceStyle: (t == null ? void 0 : t.braceStyle) ?? (r == null ? void 0 : r.braceStyle) ?? Nt
  };
}
class Kt {
  constructor(t) {
    J(this, "entries", /* @__PURE__ */ new Map());
    J(this, "onClose");
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
      prefs: Ft(n.matchingConfig, n.prefs)
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
var Ae;
class zt {
  constructor(t) {
    J(this, "entries", /* @__PURE__ */ new Map());
    Je(this, Ae, e.state(0));
    J(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(Pe(this, Ae));
  }
  set version(t) {
    e.set(Pe(this, Ae), t, !0);
  }
  open(t, n) {
    const s = this.entries.get(t);
    if (s) return s;
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
Ae = new WeakMap();
const Wt = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
function be({ h: r, s: t, v: n }) {
  const s = t / 100, v = n / 100, l = v * s, d = l * (1 - Math.abs(r / 60 % 2 - 1)), p = v - l;
  let a = 0, f = 0, u = 0;
  return r < 60 ? (a = l, f = d) : r < 120 ? (a = d, f = l) : r < 180 ? (f = l, u = d) : r < 240 ? (f = d, u = l) : r < 300 ? (a = d, u = l) : (a = l, u = d), {
    r: Math.round((a + p) * 255),
    g: Math.round((f + p) * 255),
    b: Math.round((u + p) * 255)
  };
}
function Gt({ r, g: t, b: n }) {
  const s = r / 255, v = t / 255, l = n / 255, d = Math.max(s, v, l), p = Math.min(s, v, l), a = d - p;
  let f = 0;
  a !== 0 && (d === s ? f = 60 * ((v - l) / a % 6) : d === v ? f = 60 * ((l - s) / a + 2) : f = 60 * ((s - v) / a + 4)), f < 0 && (f += 360);
  const u = d === 0 ? 0 : a / d * 100, h = d * 100;
  return { h: Math.round(f), s: Math.round(u), v: Math.round(h) };
}
function _e({ r, g: t, b: n }) {
  const s = (v) => v.toString(16).padStart(2, "0");
  return `#${s(r)}${s(t)}${s(n)}`;
}
function Xt(r) {
  let t = r.replace(/^#/, "");
  t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]);
  const n = parseInt(t, 16);
  return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
}
function Ie(r) {
  return _e(be(r));
}
function fe(r) {
  return Gt(Xt(r));
}
function Yt(r) {
  return Wt.test(r);
}
function ce(r) {
  if (!Yt(r)) return null;
  let t = r.replace(/^#/, "").toLowerCase();
  return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), `#${t}`;
}
var He;
class Jt {
  constructor(t) {
    J(this, "entries", /* @__PURE__ */ new Map());
    Je(this, He, e.state(0));
    J(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(Pe(this, He));
  }
  set version(t) {
    e.set(Pe(this, He), t, !0);
  }
  open(t, n) {
    const s = this.entries.get(t);
    if (s) return s;
    const l = { value: ce(n.value) ?? "#000000", options: n };
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
He = new WeakMap();
const Qt = 200;
class Zt {
  constructor(t = Qt) {
    J(this, "undoStack", []);
    J(this, "redoStack", []);
    J(this, "maxDepth");
    J(this, "listeners", /* @__PURE__ */ new Set());
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
function Ve(r) {
  const { setter: t, before: n, after: s, cursorBefore: v, cursorAfter: l, now: d } = r;
  return {
    apply: () => t(s, l),
    revert: () => t(n, v),
    meta: {
      kind: "text-swap",
      timestamp: d,
      snapshot: { before: n, after: s, cursorBefore: v, cursorAfter: l }
    }
  };
}
class $t {
  constructor() {
    J(this, "engines", /* @__PURE__ */ new Map());
  }
  get(t) {
    let n = this.engines.get(t);
    return n || (n = new Zt(), this.engines.set(t, n)), n;
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
    J(this, "listeners", /* @__PURE__ */ new Set());
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
function en(r, t, n) {
  const s = r.get(t);
  return {
    push(l) {
      s.push(l), n();
    },
    undo() {
      const l = s.undo();
      return l && n(), l;
    },
    redo() {
      const l = s.redo();
      return l && n(), l;
    },
    peek() {
      return s.peek();
    },
    replaceTop(l) {
      const d = s.replaceTop(l);
      return d && n(), d;
    },
    get canUndo() {
      return s.canUndo;
    },
    get canRedo() {
      return s.canRedo;
    },
    clear() {
      s.clear(), n();
    },
    onChange(l) {
      return s.onChange(l);
    }
  };
}
const tn = 300;
function nn(r) {
  const t = new ve(), n = new ve(), s = new ve(), v = new ve(), l = new ve(), d = new ve(), p = new ve(), a = new $t(), f = new zt((c) => {
    a.release(c);
  }), u = new Jt((c) => {
    a.release(c);
  }), h = /* @__PURE__ */ new Map();
  function _(c) {
    let g = h.get(c);
    return g || (g = en(a, c, () => {
      var S;
      if (f.has(c) && l.emit(c, ((S = f.get(c)) == null ? void 0 : S.value) ?? null), u.has(c)) {
        const P = u.get(c);
        P && d.emit(c, P.value);
      }
    }), h.set(c, g)), g;
  }
  function b(c) {
    a.release(c), h.delete(c);
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
    updateContent(c, g, S, P) {
      var W, X;
      const I = r.get(c);
      if (!I) return;
      const M = I.document, C = M.content;
      if (C === g) return;
      const D = M.cursorStart, R = (Z, $) => {
        M.content = Z, M.cursorStart = $, M.cursorEnd = $, t.emit(c, Z);
      };
      M.content = g, M.cursorStart = S, M.cursorEnd = P;
      const w = _(c), T = Date.now(), A = w.peek(), j = ((W = A == null ? void 0 : A.meta) == null ? void 0 : W.kind) === "text-swap" ? A.meta.snapshot : void 0, V = Math.abs(g.length - C.length) <= 1, F = j && ((X = A == null ? void 0 : A.meta) == null ? void 0 : X.timestamp) != null && T - A.meta.timestamp < tn;
      j && V && F ? w.replaceTop(Ve({
        setter: R,
        before: j.before,
        after: g,
        cursorBefore: j.cursorBefore,
        cursorAfter: S,
        now: T
      })) : w.push(Ve({
        setter: R,
        before: C,
        after: g,
        cursorBefore: D,
        cursorAfter: S,
        now: T
      }));
      const H = M.dirty;
      M.dirty = !0, t.emit(c, g), H || n.emit(c, !0);
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
      return s.on(c);
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
      u.open(c, g);
    },
    closeColorPicker(c) {
      u.close(c) && b(c);
    },
    getColorPickerValue(c) {
      var g;
      return ((g = u.get(c)) == null ? void 0 : g.value) ?? null;
    },
    listColorPickerInstances() {
      return u.list();
    },
    onColorPickerValueChange(c) {
      return d.on(c);
    },
    onColorPickerPrefsChange(c) {
      return p.on(c);
    },
    history: _
  }, internals: {
    emitSave(c) {
      s.emit(c);
    },
    contentChange: t,
    dirtyChange: n,
    saveEvent: s,
    prefsChange: v,
    inspectorValueChange: l,
    colorPickerValueChange: d,
    colorPickerPrefsChange: p,
    history: _,
    inspectors: f,
    colorPickers: u
  }, teardown: () => {
    t.clear(), n.clear(), s.clear(), v.clear(), l.clear(), d.clear(), p.clear(), a.clear(), h.clear(), f.clear(), u.clear();
  } };
}
const Qe = "sh3-editor.inspectorRenderer";
let Ct = /* @__PURE__ */ new Map();
function mt(r) {
  const t = [...r].sort((s, v) => {
    const l = s.priority ?? 10, d = v.priority ?? 10;
    return l !== d ? d - l : 0;
  }), n = /* @__PURE__ */ new Map();
  for (const s of t)
    n.has(s.type) || n.set(s.type, s);
  Ct = n;
}
function rn(r) {
  if (r === null || typeof r != "object") return !1;
  const t = Object.getPrototypeOf(r);
  return t === Object.prototype || t === null;
}
function pt(r) {
  var t;
  return ((t = Ct.get(r)) == null ? void 0 : t.component) ?? null;
}
function ln(r, t) {
  if (t != null && t.type) {
    const n = pt(t.type);
    if (n) return { kind: "custom", component: n };
  }
  if (r !== null && typeof r == "object" && typeof r.__type == "string") {
    const n = pt(r.__type);
    if (n) return { kind: "custom", component: n };
  }
  return rn(r) || Array.isArray(r) ? { kind: "walker" } : { kind: "leaf" };
}
let St = null;
function bt(r) {
  St = r;
}
function an() {
  return St;
}
const Pt = "sh3-editor:help.tabs";
function Q(r) {
  return r.ctrlKey || r.metaKey;
}
function sn(r, t, n, s, v = 2) {
  const l = " ".repeat(v);
  if (t === n && !s)
    return {
      content: r.slice(0, t) + l + r.slice(n),
      selectionStart: t + l.length,
      selectionEnd: t + l.length
    };
  const d = r.lastIndexOf(`
`, t - 1) + 1, p = r.slice(d, n).split(`
`);
  let a = t, f = n;
  const u = p.map((_, b) => {
    var m;
    if (s) {
      const i = ((m = _.match(new RegExp(`^ {1,${v}}`))) == null ? void 0 : m[0].length) ?? 0;
      return b === 0 && (a = Math.max(d, t - i)), f -= i, _.slice(i);
    } else
      return b === 0 && (a = t + l.length), f += l.length, l + _;
  });
  return { content: r.slice(0, d) + u.join(`
`) + r.slice(d + p.join(`
`).length), selectionStart: a, selectionEnd: f };
}
function on(r, t, n, s, v = 2, l = "inline") {
  if (s === "none") return null;
  const d = r.lastIndexOf(`
`, t - 1) + 1, a = r.slice(d, t).match(/^[ \t]*/)[0], f = " ".repeat(v);
  if (s === "indent") {
    const i = `
` + a;
    return {
      content: r.slice(0, t) + i + r.slice(n),
      selectionStart: t + i.length,
      selectionEnd: t + i.length
    };
  }
  const u = t > 0 ? r[t - 1] : "", h = n < r.length ? r[n] : "", _ = u === "{";
  if (_ && h === "}") {
    if (l === "inline") {
      const P = `
` + a + f + `
` + a, I = t + 1 + a.length + f.length;
      return {
        content: r.slice(0, t) + P + r.slice(n),
        selectionStart: I,
        selectionEnd: I
      };
    }
    const i = r.slice(0, t - 1), k = r.slice(n), c = `
` + a + `{
` + a + f + `
` + a, g = i + c + k, S = i.length + (`
` + a + `{
` + a + f).length;
    return { content: g, selectionStart: S, selectionEnd: S };
  }
  if (_) {
    const i = `
` + a + f;
    return {
      content: r.slice(0, t) + i + r.slice(n),
      selectionStart: t + i.length,
      selectionEnd: t + i.length
    };
  }
  const m = `
` + a;
  return {
    content: r.slice(0, t) + m + r.slice(n),
    selectionStart: t + m.length,
    selectionEnd: t + m.length
  };
}
function cn(r, t, n, s = 2) {
  if (t !== n) return null;
  const v = r.lastIndexOf(`
`, t - 1) + 1, l = r.slice(v, t);
  if (!/^[ \t]*$/.test(l)) return null;
  let d = 0, p = -1;
  for (let h = v - 1; h >= 0; h--) {
    const _ = r[h];
    if (_ === "}") d++;
    else if (_ === "{") {
      if (d === 0) {
        p = h;
        break;
      }
      d--;
    }
  }
  let a;
  if (p === -1) {
    const h = Math.max(0, l.length - s);
    a = l.slice(0, h);
  } else {
    const h = r.lastIndexOf(`
`, p - 1) + 1;
    a = r.slice(h, p).match(/^[ \t]*/)[0];
  }
  if (a.length >= l.length) return null;
  const f = r.slice(0, v) + a + "}" + r.slice(n), u = v + a.length + 1;
  return { content: f, selectionStart: u, selectionEnd: u };
}
var dn = e.from_html('<span class="toolbar-sep svelte-10sr5yt"></span>'), un = e.from_html("<button><!> </button>"), fn = e.from_html("<!> <!>", 1), vn = e.from_html('<div class="toolbar-spacer svelte-10sr5yt"></div> <span class="toolbar-path svelte-10sr5yt"> </span>', 1), gn = e.from_html('<div class="toolbar svelte-10sr5yt"><!> <!></div>');
function rt(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "filePath", 3, null), s = e.derived(() => {
    const p = [], a = /* @__PURE__ */ new Map();
    for (const f of t.actions) {
      const u = f.group ?? "_default";
      if (!a.has(u)) {
        const h = [];
        a.set(u, h), p.push({ key: u, items: h });
      }
      a.get(u).push(f);
    }
    return p;
  });
  var v = e.comment(), l = e.first_child(v);
  {
    var d = (p) => {
      var a = gn(), f = e.child(a);
      e.each(f, 17, () => e.get(s), e.index, (_, b, m) => {
        var i = fn(), k = e.first_child(i);
        {
          var c = (S) => {
            var P = dn();
            e.append(S, P);
          };
          e.if(k, (S) => {
            m > 0 && S(c);
          });
        }
        var g = e.sibling(k, 2);
        e.each(g, 17, () => e.get(b).items, (S) => S.id, (S, P) => {
          var I = un();
          let M;
          var C = e.child(I);
          {
            var D = (w) => {
              var T = e.text();
              e.template_effect(() => e.set_text(T, e.get(P).icon)), e.append(w, T);
            };
            e.if(C, (w) => {
              e.get(P).icon && w(D);
            });
          }
          var R = e.sibling(C, 1, !0);
          e.reset(I), e.template_effect(() => {
            M = e.set_class(I, 1, "toolbar-btn svelte-10sr5yt", null, M, { "toolbar-accent": e.get(P).accent }), I.disabled = e.get(P).disabled, e.set_attribute(I, "title", e.get(P).shortcut ? `${e.get(P).label} (${e.get(P).shortcut})` : e.get(P).label), e.set_text(R, e.get(P).label);
          }), e.delegated("click", I, function(...w) {
            var T;
            (T = e.get(P).onAction) == null || T.apply(this, w);
          }), e.append(S, I);
        }), e.append(_, i);
      });
      var u = e.sibling(f, 2);
      {
        var h = (_) => {
          var b = vn(), m = e.sibling(e.first_child(b), 2), i = e.child(m, !0);
          e.reset(m), e.template_effect(
            (k) => {
              e.set_attribute(m, "title", n()), e.set_text(i, k);
            },
            [() => n().split(/[/\\]/).pop()]
          ), e.append(_, b);
        };
        e.if(u, (_) => {
          n() && _(h);
        });
      }
      e.reset(a), e.append(p, a);
    };
    e.if(l, (p) => {
      (t.actions.length > 0 || n()) && p(d);
    });
  }
  e.append(r, v), e.pop();
}
e.delegate(["click"]);
var hn = e.from_html('<div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Brace style</span> <div class="seg svelte-1etykqv"><button type="button">Inline</button> <button type="button">Allman</button></div></div>'), mn = e.from_html('<div class="body svelte-1etykqv"><h2 class="svelte-1etykqv">Editor settings</h2> <div class="rows svelte-1etykqv"><div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Indent unit</span> <div class="seg svelte-1etykqv"><button type="button">2</button> <button type="button">4</button></div></div> <!></div> <div class="actions svelte-1etykqv"><button type="button" class="secondary svelte-1etykqv">Close</button></div></div>');
function pn(r, t) {
  e.push(t, !0);
  let n = e.proxy({ ...t.prefs });
  function s(c) {
    n.indentUnit = c, t.onChange({ ...n });
  }
  function v(c) {
    n.braceStyle = c, t.onChange({ ...n });
  }
  var l = mn(), d = e.sibling(e.child(l), 2), p = e.child(d), a = e.sibling(e.child(p), 2), f = e.child(a);
  let u;
  var h = e.sibling(f, 2);
  let _;
  e.reset(a), e.reset(p);
  var b = e.sibling(p, 2);
  {
    var m = (c) => {
      var g = hn(), S = e.sibling(e.child(g), 2), P = e.child(S);
      let I;
      var M = e.sibling(P, 2);
      let C;
      e.reset(S), e.reset(g), e.template_effect(() => {
        I = e.set_class(P, 1, "svelte-1etykqv", null, I, { active: (n.braceStyle ?? "inline") === "inline" }), C = e.set_class(M, 1, "svelte-1etykqv", null, C, { active: (n.braceStyle ?? "inline") === "allman" });
      }), e.delegated("click", P, () => v("inline")), e.delegated("click", M, () => v("allman")), e.append(c, g);
    };
    e.if(b, (c) => {
      t.indentType === "brace" && c(m);
    });
  }
  e.reset(d);
  var i = e.sibling(d, 2), k = e.child(i);
  e.reset(i), e.reset(l), e.template_effect(() => {
    u = e.set_class(f, 1, "svelte-1etykqv", null, u, { active: (n.indentUnit ?? 2) === 2 }), _ = e.set_class(h, 1, "svelte-1etykqv", null, _, { active: (n.indentUnit ?? 2) === 4 });
  }), e.delegated("click", f, () => s(2)), e.delegated("click", h, () => s(4)), e.delegated("click", k, function(...c) {
    var g;
    (g = t.close) == null || g.apply(this, c);
  }), e.append(r, l), e.pop();
}
e.delegate(["click"]);
var bn = e.from_html('<div class="line-num svelte-1j4uh1h"> </div>'), _n = e.from_html('<div class="editor-container svelte-1j4uh1h"><!> <div class="editor-wrap svelte-1j4uh1h"><div class="gutter svelte-1j4uh1h"><div class="gutter-inner svelte-1j4uh1h"></div></div> <div class="editor-body svelte-1j4uh1h"><pre class="highlight-layer svelte-1j4uh1h" aria-hidden="true"></pre> <textarea class="input-layer svelte-1j4uh1h" autocapitalize="off"></textarea></div></div></div>');
function yn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "entry", 7), s = e.prop(t, "fontSize", 3, 13), v = e.prop(t, "toolbarActions", 19, () => []), l = e.derived(() => n().document), d = e.state(e.proxy(e.get(l).content)), p = e.derived(() => {
    var x, U;
    return ((x = t.matchingConfig) == null ? void 0 : x.indentType) ?? ((U = t.matchingConfig) != null && U.indentBased ? "indent" : "none");
  }), a = e.derived(() => e.get(p) === "none" ? 0 : e.get(p) === "brace" ? 2 : 1), f = e.derived(() => (t.showSettings ?? !0) && e.get(a) > 0);
  const u = 300, h = (x, U) => {
    e.set(d, x, !0), e.get(l).content = x, e.get(l).cursorStart = U, e.get(l).cursorEnd = U, t.internals.contentChange.emit(e.get(l).id, x), C(U, U);
  };
  function _() {
    qe.modal.open(pn, {
      indentType: e.get(p),
      prefs: n().prefs,
      onChange: m
    });
  }
  let b = e.derived(() => {
    if (!e.get(f)) return v();
    const x = {
      id: "sh3-editor:toolbar",
      label: "Settings",
      icon: "⚙",
      onAction: _,
      group: "_editor_builtin"
    };
    return [...v(), x];
  });
  function m(x) {
    n().prefs = { ...n().prefs, ...x }, t.internals.prefsChange.emit(n().document.id, { ...n().prefs });
  }
  e.user_effect(() => {
    e.set(d, e.get(l).content, !0);
  });
  let i = e.state(void 0), k = e.state(0), c = e.state(0), g = e.derived(() => t.highlight && e.get(l).language ? t.highlight(e.get(d), e.get(l).language) : I(e.get(d))), S = e.derived(() => e.get(d).split(`
`).length), P = e.derived(() => Array.from({ length: e.get(S) }, (x, U) => U + 1));
  function I(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function M(x, U, K) {
    var ke, we;
    e.set(d, x, !0);
    const L = e.get(l).id, de = e.get(l).content;
    if (de === x) return;
    const ye = e.get(l).cursorStart;
    e.get(l).content = x, e.get(l).cursorStart = U, e.get(l).cursorEnd = K;
    const le = t.internals.history(L), G = Date.now(), ne = le.peek(), ae = ((ke = ne == null ? void 0 : ne.meta) == null ? void 0 : ke.kind) === "text-swap" ? ne.meta.snapshot : void 0, se = Math.abs(x.length - de.length) <= 1, Be = ae && ((we = ne == null ? void 0 : ne.meta) == null ? void 0 : we.timestamp) != null && G - ne.meta.timestamp < u;
    ae && se && Be ? le.replaceTop(Ve({
      setter: h,
      before: ae.before,
      after: x,
      cursorBefore: ae.cursorBefore,
      cursorAfter: U,
      now: G
    })) : le.push(Ve({
      setter: h,
      before: de,
      after: x,
      cursorBefore: ye,
      cursorAfter: U,
      now: G
    }));
    const je = e.get(l).dirty;
    e.get(l).dirty = !0, t.internals.contentChange.emit(L, x), je || t.internals.dirtyChange.emit(L, !0);
  }
  function C(x, U) {
    requestAnimationFrame(() => {
      e.get(i) && (e.get(i).selectionStart = x, e.get(i).selectionEnd = U);
    });
  }
  function D(x) {
    var U;
    if (x.key === "s" && Q(x)) {
      x.preventDefault(), t.internals.emitSave(e.get(l).id);
      return;
    }
    if (x.key.toLowerCase() === "z" && Q(x) && !x.shiftKey) {
      x.preventDefault(), t.internals.history(e.get(l).id).undo();
      return;
    }
    if (x.key.toLowerCase() === "y" && Q(x) || x.key.toLowerCase() === "z" && Q(x) && x.shiftKey) {
      x.preventDefault(), t.internals.history(e.get(l).id).redo();
      return;
    }
    if (x.key === "Enter" && !x.shiftKey && !Q(x) && !x.altKey) {
      if (e.get(p) === "none") return;
      const K = x.currentTarget, L = on(e.get(d), K.selectionStart, K.selectionEnd, e.get(p), n().prefs.indentUnit, n().prefs.braceStyle);
      L && (x.preventDefault(), M(L.content, L.selectionStart, L.selectionEnd), C(L.selectionStart, L.selectionEnd));
      return;
    }
    if (x.key === "}" && e.get(p) === "brace" && !Q(x) && !x.altKey) {
      const K = x.currentTarget, L = cn(e.get(d), K.selectionStart, K.selectionEnd, n().prefs.indentUnit);
      if (L) {
        x.preventDefault(), M(L.content, L.selectionStart, L.selectionEnd), C(L.selectionStart, L.selectionEnd);
        return;
      }
    }
    if (x.key === "Tab") {
      x.preventDefault();
      const K = x.currentTarget, L = sn(e.get(d), K.selectionStart, K.selectionEnd, x.shiftKey, (U = t.matchingConfig) == null ? void 0 : U.indentUnit);
      L && (M(L.content, L.selectionStart, L.selectionEnd), C(L.selectionStart, L.selectionEnd));
      return;
    }
  }
  function R(x) {
    const U = x.currentTarget;
    M(U.value, U.selectionStart, U.selectionEnd);
  }
  function w(x) {
    const U = x.currentTarget;
    e.set(k, U.scrollTop, !0), e.set(c, U.scrollLeft, !0);
  }
  function T() {
    e.get(i) && (e.get(l).cursorStart = e.get(i).selectionStart, e.get(l).cursorEnd = e.get(i).selectionEnd);
  }
  var A = _n(), j = e.child(A);
  rt(j, {
    get actions() {
      return e.get(b);
    },
    get filePath() {
      return e.get(l).filePath;
    }
  });
  var V = e.sibling(j, 2);
  let F;
  var H = e.child(V), W = e.child(H);
  let X;
  e.each(W, 20, () => e.get(P), (x) => x, (x, U) => {
    var K = bn(), L = e.child(K, !0);
    e.reset(K), e.template_effect(() => e.set_text(L, U)), e.append(x, K);
  }), e.reset(W), e.reset(H);
  var Z = e.sibling(H, 2), $ = e.child(Z);
  let Re;
  e.html($, () => e.get(g) + `
`, !0), e.reset($);
  var te = e.sibling($, 2);
  e.remove_textarea_child(te), e.set_attribute(te, "spellcheck", !1), e.bind_this(te, (x) => e.set(i, x), () => e.get(i)), e.reset(Z), e.reset(V), e.reset(A), e.template_effect(() => {
    F = e.set_style(V, "", F, { "--editor-font-size": `${s() ?? ""}px` }), X = e.set_style(W, "", X, { transform: `translateY(-${e.get(k) ?? ""}px)` }), Re = e.set_style($, "", Re, {
      top: `-${e.get(k) ?? ""}px`,
      left: `-${e.get(c) ?? ""}px`
    }), e.set_value(te, e.get(d));
  }), e.delegated("keydown", te, D), e.delegated("input", te, R), e.event("scroll", te, w), e.event("select", te, T), e.append(r, A), e.pop();
}
e.delegate(["keydown", "input"]);
function It(r, t, n, s) {
  return r && r(t, n) === !0 ? !0 : (s(), !1);
}
var kn = e.from_html('<div><span class="label svelte-2gtehg"> </span> <span class="value svelte-2gtehg"><!></span></div>');
function Ze(r, t) {
  let n = e.prop(t, "readonly", 3, !1);
  var s = kn();
  let v;
  var l = e.child(s), d = e.child(l, !0);
  e.reset(l);
  var p = e.sibling(l, 2), a = e.child(p);
  e.snippet(a, () => t.children), e.reset(p), e.reset(s), e.template_effect(() => {
    v = e.set_class(s, 1, "field svelte-2gtehg", null, v, { readonly: n() }), e.set_text(d, t.label);
  }), e.append(r, s);
}
var wn = e.from_html('<input type="checkbox"/>'), xn = e.from_html('<input class="primitive svelte-1o84d6l"/>');
function Cn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "readonly", 3, !1), s = e.state(e.proxy(v(t.value)));
  e.user_effect(() => {
    e.set(s, v(t.value), !0);
  });
  function v(m) {
    return m === null ? "null" : m === void 0 ? "" : typeof m == "boolean" ? m ? "true" : "false" : String(m);
  }
  function l(m, i) {
    if (i === "boolean") return m === "true";
    if (i === "number") {
      const k = Number(m);
      return Number.isFinite(k) ? k : t.value;
    }
    return m;
  }
  let d = e.derived(() => typeof t.value == "number" ? "number" : typeof t.value == "boolean" ? "boolean" : "string");
  function p() {
    if (n() || !t.onCommit) return;
    const m = l(e.get(s), e.get(d));
    m !== null && m !== t.value && t.onCommit(m);
  }
  function a(m) {
    if (n() || !t.onCommit) return;
    const i = m.target.checked;
    i !== t.value && t.onCommit(i);
  }
  function f(m) {
    m.key === "Enter" ? m.currentTarget.blur() : m.key === "Escape" && (e.set(s, v(t.value), !0), m.currentTarget.blur());
  }
  var u = e.comment(), h = e.first_child(u);
  {
    var _ = (m) => {
      var i = wn();
      e.remove_input_defaults(i), e.template_effect(
        (k) => {
          e.set_checked(i, k), i.disabled = n();
        },
        [() => !!t.value]
      ), e.delegated("change", i, a), e.append(m, i);
    }, b = (m) => {
      var i = xn();
      e.remove_input_defaults(i), e.template_effect(() => {
        e.set_attribute(i, "type", e.get(d) === "number" ? "number" : "text"), i.disabled = n();
      }), e.event("blur", i, p), e.delegated("keydown", i, f), e.bind_value(i, () => e.get(s), (k) => e.set(s, k)), e.append(m, i);
    };
    e.if(h, (m) => {
      e.get(d) === "boolean" ? m(_) : m(b, -1);
    });
  }
  e.append(r, u), e.pop();
}
e.delegate(["change", "keydown"]);
var Sn = e.from_html('<div class="walker svelte-1xvtj10"></div>');
function Pn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "basePath", 19, () => []);
  function s(f) {
    return f == null || typeof f == "string" || typeof f == "number" || typeof f == "boolean";
  }
  function v(f, u, h) {
    const _ = f[u], b = {
      apply() {
        f[u] = h;
      },
      revert() {
        f[u] = _;
      },
      meta: { kind: "walker-edit", label: String(u) }
    };
    t.api.push(b), f[u] = h;
  }
  function l(f) {
    return (u) => {
      It(t.walkerOnCommit, [...n(), f], u, () => v(t.value, f, u));
    };
  }
  function d(f) {
    return (u) => v(t.value, f, u);
  }
  let p = e.derived(() => Array.isArray(t.value) ? t.value.map((f, u) => {
    var h;
    return { key: u, child: f, fieldMeta: (h = t.meta) == null ? void 0 : h.item };
  }) : t.value && typeof t.value == "object" ? Object.keys(t.value).map((f) => {
    var u, h;
    return {
      key: f,
      child: t.value[f],
      fieldMeta: (h = (u = t.meta) == null ? void 0 : u.fields) == null ? void 0 : h[f]
    };
  }) : []);
  var a = Sn();
  e.each(a, 21, () => e.get(p), (f) => f.key, (f, u) => {
    var h = e.comment(), _ = e.first_child(h);
    {
      var b = (m) => {
        const i = e.derived(() => {
          var C;
          return ((C = e.get(u).fieldMeta) == null ? void 0 : C.label) ?? (typeof e.get(u).key == "number" ? `[${e.get(u).key}]` : String(e.get(u).key));
        }), k = e.derived(() => {
          var C;
          return (((C = e.get(u).fieldMeta) == null ? void 0 : C.readonly) ?? !1) || t.api.readonly;
        });
        var c = e.comment(), g = e.first_child(c);
        {
          var S = (C) => {
            Ze(C, {
              get label() {
                return e.get(i);
              },
              get readonly() {
                return e.get(k);
              },
              children: (D, R) => {
                {
                  let w = e.derived(() => e.get(k) ? void 0 : d(e.get(u).key)), T = e.derived(() => [...n(), e.get(u).key]);
                  tt(D, {
                    get value() {
                      return e.get(u).child;
                    },
                    get meta() {
                      return e.get(u).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(w);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(T);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, P = (C) => {
            Ze(C, {
              get label() {
                return e.get(i);
              },
              get readonly() {
                return e.get(k);
              },
              children: (D, R) => {
                {
                  let w = e.derived(() => e.get(k) ? void 0 : l(e.get(u).key));
                  Cn(D, {
                    get value() {
                      return e.get(u).child;
                    },
                    get readonly() {
                      return e.get(k);
                    },
                    get onCommit() {
                      return e.get(w);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, I = e.derived(() => s(e.get(u).child)), M = (C) => {
            Ze(C, {
              get label() {
                return e.get(i);
              },
              get readonly() {
                return e.get(k);
              },
              children: (D, R) => {
                {
                  let w = e.derived(() => e.get(k) ? void 0 : d(e.get(u).key)), T = e.derived(() => [...n(), e.get(u).key]);
                  tt(D, {
                    get value() {
                      return e.get(u).child;
                    },
                    get meta() {
                      return e.get(u).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(w);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(T);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          };
          e.if(g, (C) => {
            var D;
            (D = e.get(u).fieldMeta) != null && D.type ? C(S) : e.get(I) ? C(P, 1) : C(M, -1);
          });
        }
        e.append(m, c);
      };
      e.if(_, (m) => {
        var i;
        (i = e.get(u).fieldMeta) != null && i.hidden || m(b);
      });
    }
    e.append(f, h);
  }), e.reset(a), e.append(r, a), e.pop();
}
var In = e.from_html('<span class="leaf svelte-o6duey"> </span>');
function En(r, t) {
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
  var s = In(), v = e.child(s, !0);
  e.reset(s), e.template_effect((l) => e.set_text(v, l), [() => n(t.value)]), e.append(r, s);
}
function tt(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "basePath", 19, () => []), s = e.derived(() => ln(t.value, t.meta)), v = e.derived(() => {
    const h = t.onCommit, _ = t.walkerOnCommit;
    if (h !== void 0)
      return _ === void 0 ? h : (b) => {
        It(_, n(), b, () => h(b));
      };
  });
  var l = e.comment(), d = e.first_child(l);
  {
    var p = (h) => {
    }, a = (h) => {
      const _ = e.derived(() => e.get(s).component);
      var b = e.comment(), m = e.first_child(b);
      e.component(m, () => e.get(_), (i, k) => {
        k(i, {
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
      }), e.append(h, b);
    }, f = (h) => {
      Pn(h, {
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
    }, u = (h) => {
      En(h, {
        get value() {
          return t.value;
        }
      });
    };
    e.if(d, (h) => {
      var _;
      (_ = t.meta) != null && _.hidden ? h(p) : e.get(s).kind === "custom" ? h(a, 1) : e.get(s).kind === "walker" ? h(f, 2) : h(u, -1);
    });
  }
  e.append(r, l), e.pop();
}
var Dn = e.from_html('<div class="inspector-container svelte-jpxkcf" tabindex="-1" role="region" aria-label="Inspector"><!> <div class="inspector-body svelte-jpxkcf"><!></div></div>');
function Mn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "adHocReadonly", 3, !1), s = e.derived(() => t.internals.inspectors.get(t.instanceId)), v = e.derived(() => e.get(s) ? e.get(s).value : t.adHocValue), l = e.derived(() => e.get(s) ? e.get(s).meta : t.adHocMeta), d = e.derived(() => e.get(s) ? !!e.get(s).options.readonly : n()), p = e.derived(() => e.get(s) ? e.get(s).options.onCommit : void 0), a = e.derived(() => {
    var g;
    return ((g = e.get(s)) == null ? void 0 : g.options.toolbarActions) ?? [];
  });
  const f = t.internals.history(t.instanceId), u = {
    push(g) {
      e.get(d) || (f.push(g), t.internals.inspectorValueChange.emit(t.instanceId, e.get(v)));
    },
    get readonly() {
      return e.get(d);
    },
    history: f
  };
  e.user_effect(() => {
    const g = f.onChange(() => {
      t.internals.inspectorValueChange.emit(t.instanceId, e.get(v));
    });
    return () => g();
  });
  let h = e.state(void 0);
  function _(g) {
    if (g.key.toLowerCase() === "z" && Q(g) && !g.shiftKey) {
      g.preventDefault(), f.undo();
      return;
    }
    if (g.key.toLowerCase() === "y" && Q(g) || g.key.toLowerCase() === "z" && Q(g) && g.shiftKey) {
      g.preventDefault(), f.redo();
      return;
    }
  }
  var b = Dn(), m = e.child(b);
  {
    var i = (g) => {
      rt(g, {
        get actions() {
          return e.get(a);
        },
        filePath: null
      });
    };
    e.if(m, (g) => {
      e.get(a).length > 0 && g(i);
    });
  }
  var k = e.sibling(m, 2), c = e.child(k);
  tt(c, {
    get value() {
      return e.get(v);
    },
    get meta() {
      return e.get(l);
    },
    get api() {
      return u;
    },
    get walkerOnCommit() {
      return e.get(p);
    },
    basePath: []
  }), e.reset(k), e.reset(b), e.bind_this(b, (g) => e.set(h, g), () => e.get(h)), e.delegated("keydown", b, _), e.append(r, b), e.pop();
}
e.delegate(["keydown"]);
const $e = [
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
var Tn = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">H</span> <input type="range" min="0" max="360" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">S</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">V</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), An = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">R</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">G</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">B</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), Hn = e.from_html("<option> </option>"), Un = e.from_html('<button type="button"></button>'), Rn = e.from_html('<div class="cp-save-prompt svelte-7v5dlc"><input type="text" class="cp-save-input svelte-7v5dlc" placeholder="Palette name"/> <button type="button" class="cp-palette-btn svelte-7v5dlc">OK</button> <button type="button" class="cp-palette-btn svelte-7v5dlc">Cancel</button></div>'), On = e.from_html('<div role="group" aria-label="Color picker"><div class="cp-main svelte-7v5dlc"><div class="cp-left svelte-7v5dlc"><div class="cp-body svelte-7v5dlc"><canvas class="cp-square svelte-7v5dlc" role="slider" aria-label="Saturation and value"></canvas> <canvas class="cp-strip svelte-7v5dlc" role="slider" aria-label="Hue"></canvas></div> <div class="cp-mode svelte-7v5dlc"><button type="button">HSV</button> <button type="button">RGB</button></div> <!> <div class="cp-hex-row svelte-7v5dlc"><div class="cp-preview svelte-7v5dlc"></div> <input type="text" class="cp-hex-input svelte-7v5dlc" aria-label="Hex value"/></div></div> <div class="cp-right svelte-7v5dlc"><div class="cp-palette svelte-7v5dlc"><select class="cp-palette-select svelte-7v5dlc" aria-label="Palette"></select> <div class="cp-swatches svelte-7v5dlc"></div> <div class="cp-palette-actions svelte-7v5dlc"><button type="button" class="cp-palette-btn svelte-7v5dlc" title="Save current color to a palette">+ Save</button> <button type="button" class="cp-palette-btn cp-delete svelte-7v5dlc">Delete</button></div> <!></div></div></div></div>');
function _t(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "readonly", 3, !1), s = e.prop(t, "initialMode", 3, "hsv"), v = e.prop(t, "userPalettes", 19, () => []);
  const l = 180, d = 20, p = ce(t.value) ?? "#000000";
  let a = e.state(e.proxy(fe(p))), f = p, u = e.state(e.proxy(s()));
  e.user_effect(() => {
    const o = ce(t.value) ?? "#000000";
    o !== f && (e.set(a, fe(o), !0), f = o, e.set(U, o.toUpperCase(), !0));
  });
  function h(o) {
    const y = ce(o);
    y && y !== f && (f = y, t.onChange(y));
  }
  function _() {
    h(Ie(e.get(a)));
  }
  let b = e.state(void 0), m = e.state(void 0);
  const i = typeof window < "u" && window.devicePixelRatio || 1;
  function k() {
    if (!e.get(b)) return;
    const o = l, y = l;
    e.get(b).width = o * i, e.get(b).height = y * i, e.get(b).style.width = o + "px", e.get(b).style.height = y + "px";
    const E = e.get(b).getContext("2d"), O = E.createImageData(o * i, y * i), q = O.data;
    for (let B = 0; B < y * i; B++)
      for (let z = 0; z < o * i; z++) {
        const N = z / i / o * 100, ee = (1 - B / i / y) * 100, Y = be({ h: e.get(a).h, s: N, v: ee }), ie = (B * o * i + z) * 4;
        q[ie] = Y.r, q[ie + 1] = Y.g, q[ie + 2] = Y.b, q[ie + 3] = 255;
      }
    E.putImageData(O, 0, 0), c();
  }
  function c() {
    if (!e.get(b)) return;
    const o = e.get(b).getContext("2d"), y = e.get(a).s / 100 * l, E = (1 - e.get(a).v / 100) * l;
    o.save(), o.scale(i, i), o.beginPath(), o.arc(y, E, 6, 0, Math.PI * 2), o.strokeStyle = "#ffffff", o.lineWidth = 2, o.stroke(), o.beginPath(), o.arc(y, E, 7, 0, Math.PI * 2), o.strokeStyle = "#000000", o.lineWidth = 1, o.stroke(), o.restore();
  }
  function g() {
    if (!e.get(m)) return;
    const o = d, y = l;
    e.get(m).width = o * i, e.get(m).height = y * i, e.get(m).style.width = o + "px", e.get(m).style.height = y + "px";
    const E = e.get(m).getContext("2d"), O = E.createImageData(o * i, y * i), q = O.data;
    for (let B = 0; B < y * i; B++) {
      const z = B / (y * i) * 360, N = be({ h: z, s: 100, v: 100 });
      for (let ee = 0; ee < o * i; ee++) {
        const Y = (B * o * i + ee) * 4;
        q[Y] = N.r, q[Y + 1] = N.g, q[Y + 2] = N.b, q[Y + 3] = 255;
      }
    }
    E.putImageData(O, 0, 0), S();
  }
  function S() {
    if (!e.get(m)) return;
    const o = e.get(m).getContext("2d"), y = e.get(a).h / 360 * l;
    o.save(), o.scale(i, i), o.beginPath(), o.moveTo(0, y), o.lineTo(d, y), o.strokeStyle = "#ffffff", o.lineWidth = 2, o.stroke(), o.beginPath(), o.moveTo(0, y), o.lineTo(d, y), o.strokeStyle = "#000000", o.lineWidth = 1, o.stroke(), o.restore();
  }
  xt(() => {
    k(), g();
  });
  let P = e.state(e.proxy(e.get(a).h));
  e.user_effect(() => {
    e.get(a).h !== e.get(P) ? (e.set(P, e.get(a).h, !0), k(), g()) : k();
  });
  let I = e.state(!1), M = e.state(!1);
  function C(o) {
    if (n() || !e.get(b)) return;
    const y = e.get(b).getBoundingClientRect(), E = Math.max(0, Math.min(l, o.clientX - y.left)), O = Math.max(0, Math.min(l, o.clientY - y.top)), q = E / l * 100, B = (1 - O / l) * 100;
    e.set(a, { h: e.get(a).h, s: Math.round(q), v: Math.round(B) }, !0);
  }
  function D(o) {
    if (n() || !e.get(m)) return;
    const y = e.get(m).getBoundingClientRect(), O = Math.max(0, Math.min(l, o.clientY - y.top)) / l * 360;
    e.set(a, { h: Math.round(O), s: e.get(a).s, v: e.get(a).v }, !0);
  }
  function R(o) {
    n() || (e.set(I, !0), C(o), window.addEventListener("mousemove", T), window.addEventListener("mouseup", A));
  }
  function w(o) {
    n() || (e.set(M, !0), D(o), window.addEventListener("mousemove", T), window.addEventListener("mouseup", A));
  }
  function T(o) {
    e.get(I) ? C(o) : e.get(M) && D(o);
  }
  function A() {
    (e.get(I) || e.get(M)) && h(Ie(e.get(a))), e.set(I, !1), e.set(M, !1), window.removeEventListener("mousemove", T), window.removeEventListener("mouseup", A);
  }
  const j = "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)", V = e.derived(() => `linear-gradient(to right, #ffffff, ${_e(be({ h: e.get(a).h, s: 100, v: e.get(a).v }))})`), F = e.derived(() => `linear-gradient(to right, #000000, ${_e(be({ h: e.get(a).h, s: e.get(a).s, v: 100 }))})`), H = e.derived(() => be(e.get(a)));
  function W(o) {
    e.set(a, { ...e.get(a), h: +o.target.value }, !0);
  }
  function X(o) {
    e.set(a, { ...e.get(a), s: +o.target.value }, !0);
  }
  function Z(o) {
    e.set(a, { ...e.get(a), v: +o.target.value }, !0);
  }
  function $(o) {
    const y = +o.target.value;
    e.set(a, fe(_e({ r: y, g: e.get(H).g, b: e.get(H).b })), !0);
  }
  function Re(o) {
    const y = +o.target.value;
    e.set(a, fe(_e({ r: e.get(H).r, g: y, b: e.get(H).b })), !0);
  }
  function te(o) {
    const y = +o.target.value;
    e.set(a, fe(_e({ r: e.get(H).r, g: e.get(H).g, b: y })), !0);
  }
  function x(o) {
    var y;
    e.get(u) !== o && (e.set(u, o, !0), (y = t.onModeChange) == null || y.call(t, o));
  }
  let U = e.state(e.proxy(p.toUpperCase()));
  e.user_effect(() => {
    e.set(U, Ie(e.get(a)).toUpperCase(), !0);
  });
  function K() {
    if (n()) return;
    const o = e.get(U).trim(), y = ce(o);
    if (!y) {
      e.set(U, Ie(e.get(a)).toUpperCase(), !0);
      return;
    }
    e.set(a, fe(y), !0), h(y);
  }
  function L(o) {
    o.key === "Enter" && (o.preventDefault(), o.currentTarget.blur());
  }
  const de = e.derived(() => Ie(e.get(a))), ye = e.derived(() => [...$e, ...v()]);
  let le = e.state(e.proxy($e[0].id));
  const G = e.derived(() => e.get(ye).find((o) => o.id === e.get(le)) ?? e.get(ye)[0]);
  function ne(o) {
    if (n()) return;
    const y = ce(o);
    y && (e.set(a, fe(y), !0), h(y));
  }
  let ae = e.state(!1), se = e.state("");
  function Be() {
    return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "u-" + Math.random().toString(36).slice(2, 10);
  }
  function je() {
    var y, E;
    if (n()) return;
    if ((y = e.get(G)) != null && y.builtin) {
      e.set(se, ""), e.set(ae, !0);
      return;
    }
    if (!e.get(G)) return;
    const o = {
      ...e.get(G),
      colors: [...e.get(G).colors, e.get(de)]
    };
    (E = t.onSaveUserPalette) == null || E.call(t, o);
  }
  function ke() {
    var E;
    if (n()) return;
    const o = e.get(se).trim();
    if (!o) return;
    const y = { id: "user-" + Be(), label: o, colors: [e.get(de)] };
    (E = t.onSaveUserPalette) == null || E.call(t, y), e.set(le, y.id, !0), e.set(ae, !1), e.set(se, "");
  }
  function we() {
    e.set(ae, !1), e.set(se, "");
  }
  function Dt() {
    var y;
    if (n() || !e.get(G) || e.get(G).builtin) return;
    const o = e.get(G).id;
    (y = t.onDeleteUserPalette) == null || y.call(t, o), e.set(le, $e[0].id, !0);
  }
  function Mt(o) {
    const y = o.target, E = o.shiftKey ? 10 : 1;
    if (y === e.get(b)) {
      if (o.key === "ArrowLeft") {
        o.preventDefault(), e.set(a, { ...e.get(a), s: Math.max(0, e.get(a).s - E) }, !0), _();
        return;
      }
      if (o.key === "ArrowRight") {
        o.preventDefault(), e.set(a, { ...e.get(a), s: Math.min(100, e.get(a).s + E) }, !0), _();
        return;
      }
      if (o.key === "ArrowUp") {
        o.preventDefault(), e.set(a, { ...e.get(a), v: Math.min(100, e.get(a).v + E) }, !0), _();
        return;
      }
      if (o.key === "ArrowDown") {
        o.preventDefault(), e.set(a, { ...e.get(a), v: Math.max(0, e.get(a).v - E) }, !0), _();
        return;
      }
    } else if (y === e.get(m)) {
      if (o.key === "ArrowUp") {
        o.preventDefault(), e.set(a, { ...e.get(a), h: Math.max(0, e.get(a).h - E) }, !0), _();
        return;
      }
      if (o.key === "ArrowDown") {
        o.preventDefault(), e.set(a, { ...e.get(a), h: Math.min(360, e.get(a).h + E) }, !0), _();
        return;
      }
    }
  }
  var xe = On();
  let lt;
  var at = e.child(xe), Ne = e.child(at), Fe = e.child(Ne), ue = e.child(Fe);
  e.set_attribute(ue, "aria-valuemin", 0), e.set_attribute(ue, "aria-valuemax", 100), e.bind_this(ue, (o) => e.set(b, o), () => e.get(b));
  var he = e.sibling(ue, 2);
  e.set_attribute(he, "aria-valuemin", 0), e.set_attribute(he, "aria-valuemax", 360), e.bind_this(he, (o) => e.set(m, o), () => e.get(m)), e.reset(Fe);
  var Ke = e.sibling(Fe, 2), Oe = e.child(Ke);
  let st;
  var ze = e.sibling(Oe, 2);
  let it;
  e.reset(Ke);
  var ot = e.sibling(Ke, 2);
  {
    var Tt = (o) => {
      var y = Tn(), E = e.child(y), O = e.sibling(e.child(E), 2);
      e.remove_input_defaults(O), e.set_style(O, "", {}, { "--track-bg": j });
      var q = e.sibling(O, 2), B = e.child(q);
      e.reset(q), e.reset(E);
      var z = e.sibling(E, 2), N = e.sibling(e.child(z), 2);
      e.remove_input_defaults(N);
      let ee;
      var Y = e.sibling(N, 2), ie = e.child(Y);
      e.reset(Y), e.reset(z);
      var oe = e.sibling(z, 2), re = e.sibling(e.child(oe), 2);
      e.remove_input_defaults(re);
      let Le;
      var gt = e.sibling(re, 2), Rt = e.child(gt);
      e.reset(gt), e.reset(oe), e.reset(y), e.template_effect(() => {
        e.set_value(O, e.get(a).h), O.disabled = n(), e.set_text(B, `${e.get(a).h ?? ""}°`), e.set_value(N, e.get(a).s), N.disabled = n(), ee = e.set_style(N, "", ee, { "--track-bg": e.get(V) }), e.set_text(ie, `${e.get(a).s ?? ""}%`), e.set_value(re, e.get(a).v), re.disabled = n(), Le = e.set_style(re, "", Le, { "--track-bg": e.get(F) }), e.set_text(Rt, `${e.get(a).v ?? ""}%`);
      }), e.delegated("input", O, W), e.delegated("change", O, _), e.delegated("input", N, X), e.delegated("change", N, _), e.delegated("input", re, Z), e.delegated("change", re, _), e.append(o, y);
    }, At = (o) => {
      var y = An(), E = e.child(y), O = e.sibling(e.child(E), 2);
      e.remove_input_defaults(O);
      var q = e.sibling(O, 2), B = e.child(q, !0);
      e.reset(q), e.reset(E);
      var z = e.sibling(E, 2), N = e.sibling(e.child(z), 2);
      e.remove_input_defaults(N);
      var ee = e.sibling(N, 2), Y = e.child(ee, !0);
      e.reset(ee), e.reset(z);
      var ie = e.sibling(z, 2), oe = e.sibling(e.child(ie), 2);
      e.remove_input_defaults(oe);
      var re = e.sibling(oe, 2), Le = e.child(re, !0);
      e.reset(re), e.reset(ie), e.reset(y), e.template_effect(() => {
        e.set_value(O, e.get(H).r), O.disabled = n(), e.set_text(B, e.get(H).r), e.set_value(N, e.get(H).g), N.disabled = n(), e.set_text(Y, e.get(H).g), e.set_value(oe, e.get(H).b), oe.disabled = n(), e.set_text(Le, e.get(H).b);
      }), e.delegated("input", O, $), e.delegated("change", O, _), e.delegated("input", N, Re), e.delegated("change", N, _), e.delegated("input", oe, te), e.delegated("change", oe, _), e.append(o, y);
    };
    e.if(ot, (o) => {
      e.get(u) === "hsv" ? o(Tt) : o(At, -1);
    });
  }
  var ct = e.sibling(ot, 2), dt = e.child(ct);
  let ut;
  var Ce = e.sibling(dt, 2);
  e.remove_input_defaults(Ce), e.reset(ct), e.reset(Ne);
  var ft = e.sibling(Ne, 2), vt = e.child(ft), Se = e.child(vt);
  e.each(Se, 21, () => e.get(ye), (o) => o.id, (o, y) => {
    var E = Hn(), O = e.child(E);
    e.reset(E);
    var q = {};
    e.template_effect(() => {
      e.set_text(O, `${e.get(y).label ?? ""}${e.get(y).builtin ? "" : " (user)"}`), q !== (q = e.get(y).id) && (E.value = (E.__value = e.get(y).id) ?? "");
    }), e.append(o, E);
  }), e.reset(Se);
  var We = e.sibling(Se, 2);
  e.each(We, 21, () => {
    var o;
    return ((o = e.get(G)) == null ? void 0 : o.colors) ?? [];
  }, e.index, (o, y) => {
    var E = Un();
    let O, q;
    e.template_effect(
      (B, z, N) => {
        O = e.set_class(E, 1, "cp-swatch svelte-7v5dlc", null, O, B), e.set_attribute(E, "title", z), e.set_attribute(E, "aria-label", N), E.disabled = n(), q = e.set_style(E, "", q, { "background-color": e.get(y) });
      },
      [
        () => ({
          active: e.get(y).toLowerCase() === e.get(de).toLowerCase()
        }),
        () => e.get(y).toUpperCase(),
        () => e.get(y).toUpperCase()
      ]
    ), e.delegated("click", E, () => ne(e.get(y))), e.append(o, E);
  }), e.reset(We);
  var Ge = e.sibling(We, 2), Xe = e.child(Ge), Ye = e.sibling(Xe, 2);
  e.reset(Ge);
  var Ht = e.sibling(Ge, 2);
  {
    var Ut = (o) => {
      var y = Rn(), E = e.child(y);
      e.remove_input_defaults(E);
      var O = e.sibling(E, 2), q = e.sibling(O, 2);
      e.reset(y), e.template_effect((B) => O.disabled = B, [() => !e.get(se).trim()]), e.delegated("keydown", E, (B) => {
        B.key === "Enter" && ke(), B.key === "Escape" && we();
      }), e.bind_value(E, () => e.get(se), (B) => e.set(se, B)), e.delegated("click", O, ke), e.delegated("click", q, we), e.append(o, y);
    };
    e.if(Ht, (o) => {
      e.get(ae) && o(Ut);
    });
  }
  e.reset(vt), e.reset(ft), e.reset(at), e.reset(xe), e.template_effect(() => {
    var o, y;
    lt = e.set_class(xe, 1, "cp-surface svelte-7v5dlc", null, lt, { disabled: n() }), e.set_attribute(ue, "aria-valuenow", e.get(a).v), e.set_attribute(ue, "tabindex", n() ? -1 : 0), e.set_attribute(he, "aria-valuenow", e.get(a).h), e.set_attribute(he, "tabindex", n() ? -1 : 0), Oe.disabled = n(), st = e.set_class(Oe, 1, "svelte-7v5dlc", null, st, { active: e.get(u) === "hsv" }), ze.disabled = n(), it = e.set_class(ze, 1, "svelte-7v5dlc", null, it, { active: e.get(u) === "rgb" }), ut = e.set_style(dt, "", ut, { "background-color": e.get(de) }), Ce.disabled = n(), Se.disabled = n(), Xe.disabled = n(), Ye.disabled = n() || (((o = e.get(G)) == null ? void 0 : o.builtin) ?? !0), e.set_attribute(Ye, "title", (y = e.get(G)) != null && y.builtin ? "Built-in palettes cannot be deleted" : "Delete palette");
  }), e.delegated("keydown", xe, Mt), e.delegated("mousedown", ue, R), e.delegated("mousedown", he, w), e.delegated("click", Oe, () => x("hsv")), e.delegated("click", ze, () => x("rgb")), e.event("blur", Ce, K), e.delegated("keydown", Ce, L), e.bind_value(Ce, () => e.get(U), (o) => e.set(U, o)), e.bind_select_value(Se, () => e.get(le), (o) => e.set(le, o)), e.delegated("click", Xe, je), e.delegated("click", Ye, Dt), e.append(r, xe), e.pop();
}
e.delegate(["keydown", "mousedown", "click", "input", "change"]);
var Ln = e.from_html('<div role="region" aria-label="Color picker"><div class="cp-compact-row svelte-f5c5rv"><div class="cp-preview cp-compact-preview svelte-f5c5rv" role="button" aria-label="Open full color picker" aria-haspopup="true"></div> <input type="text" class="cp-hex-input cp-compact-hex svelte-f5c5rv" aria-label="Hex value"/></div></div>'), Vn = e.from_html('<div tabindex="-1" role="region" aria-label="Color picker"><!> <!></div>');
function Et(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "adHocReadonly", 3, !1), s = e.prop(t, "userPalettes", 19, () => []), v = e.prop(t, "prefs", 19, () => ({ mode: "hsv" })), l = e.prop(t, "compact", 3, !1), d = e.derived(() => t.internals.colorPickers.get(t.instanceId)), p = e.derived(() => {
    var w;
    return ((w = e.get(d)) == null ? void 0 : w.options.toolbarActions) ?? [];
  }), a = e.derived(() => e.get(d) ? e.get(d).value : ce(t.adHocValue ?? "") ?? "#000000"), f = e.derived(() => e.get(d) ? !!e.get(d).options.readonly : n());
  const u = t.internals.history(t.instanceId);
  function h(w) {
    if (e.get(f)) return;
    const T = ce(w);
    if (!T) return;
    if (t.onExternalCommit) {
      t.onExternalCommit(T);
      return;
    }
    const A = e.get(a);
    if (A === T) return;
    const j = (V) => {
      e.get(d) && (e.get(d).value = V);
    };
    u.push({
      apply: () => j(T),
      revert: () => j(A),
      meta: { kind: "color", timestamp: Date.now() }
    }), j(T), t.internals.colorPickerValueChange.emit(t.instanceId, T);
  }
  e.user_effect(() => {
    const w = u.onChange(() => {
      t.internals.colorPickerValueChange.emit(t.instanceId, e.get(a));
    });
    return () => w();
  });
  function _(w) {
    t.internals.colorPickerPrefsChange.emit(t.instanceId, { mode: w });
  }
  const b = e.derived(() => /^#[0-9a-f]{6}$/i.test(e.get(a)) ? e.get(a).toUpperCase() : e.get(a));
  let m = e.state(e.proxy(e.get(b)));
  e.user_effect(() => {
    e.set(m, e.get(b), !0);
  });
  function i() {
    if (e.get(f)) return;
    const w = ce(e.get(m).trim());
    if (!w) {
      e.set(m, e.get(b), !0);
      return;
    }
    h(w);
  }
  function k(w) {
    w.key === "Enter" && (w.preventDefault(), w.currentTarget.blur());
  }
  let c = e.state(void 0);
  function g() {
    e.get(f) || !e.get(c) || qe.popup.show(_t, { anchor: e.get(c) }, {
      value: e.get(a),
      readonly: e.get(f),
      initialMode: v().mode,
      userPalettes: s(),
      onChange: (w) => h(w),
      onModeChange: _,
      onSaveUserPalette: t.onSaveUserPalette,
      onDeleteUserPalette: t.onDeleteUserPalette
    });
  }
  function S(w) {
    (w.key === "Enter" || w.key === " ") && (w.preventDefault(), g());
  }
  let P = e.state(void 0);
  function I(w) {
    if (w.key.toLowerCase() === "z" && Q(w) && !w.shiftKey) {
      w.preventDefault(), u.undo();
      return;
    }
    if (w.key.toLowerCase() === "y" && Q(w) || w.key.toLowerCase() === "z" && Q(w) && w.shiftKey) {
      w.preventDefault(), u.redo();
      return;
    }
  }
  var M = e.comment(), C = e.first_child(M);
  {
    var D = (w) => {
      var T = Ln();
      let A;
      var j = e.child(T), V = e.child(j);
      let F;
      e.bind_this(V, (W) => e.set(c, W), () => e.get(c));
      var H = e.sibling(V, 2);
      e.remove_input_defaults(H), e.reset(j), e.reset(T), e.template_effect(() => {
        A = e.set_class(T, 1, "cp-compact svelte-f5c5rv", null, A, { disabled: e.get(f) }), e.set_attribute(V, "tabindex", e.get(f) ? -1 : 0), F = e.set_style(V, "", F, { "background-color": e.get(a) }), H.disabled = e.get(f);
      }), e.delegated("click", V, g), e.delegated("keydown", V, S), e.event("blur", H, i), e.delegated("keydown", H, k), e.bind_value(H, () => e.get(m), (W) => e.set(m, W)), e.append(w, T);
    }, R = (w) => {
      var T = Vn();
      let A;
      var j = e.child(T);
      {
        var V = (H) => {
          rt(H, {
            get actions() {
              return e.get(p);
            },
            filePath: null
          });
        };
        e.if(j, (H) => {
          e.get(p).length > 0 && H(V);
        });
      }
      var F = e.sibling(j, 2);
      _t(F, {
        get value() {
          return e.get(a);
        },
        get readonly() {
          return e.get(f);
        },
        get initialMode() {
          return v().mode;
        },
        get userPalettes() {
          return s();
        },
        onChange: h,
        onModeChange: _,
        get onSaveUserPalette() {
          return t.onSaveUserPalette;
        },
        get onDeleteUserPalette() {
          return t.onDeleteUserPalette;
        }
      }), e.reset(T), e.bind_this(T, (H) => e.set(P, H), () => e.get(P)), e.template_effect(() => A = e.set_class(T, 1, "cp svelte-f5c5rv", null, A, { disabled: e.get(f) })), e.delegated("keydown", T, I), e.append(w, T);
    };
    e.if(C, (w) => {
      l() ? w(D) : w(R, -1);
    });
  }
  e.append(r, M), e.pop();
}
e.delegate(["click", "keydown"]);
var qn = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>'), Bn = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>');
function jn(r, t) {
  e.push(t, !0);
  const n = an();
  let s = e.derived(() => typeof t.value == "string" ? t.value : null);
  var v = e.comment(), l = e.first_child(v);
  {
    var d = (f) => {
      var u = qn(), h = e.child(u, !0);
      e.reset(u), e.template_effect((_) => e.set_text(h, _), [() => String(t.value)]), e.append(f, u);
    }, p = (f) => {
      var u = Bn(), h = e.child(u, !0);
      e.reset(u), e.template_effect(() => e.set_text(h, e.get(s))), e.append(f, u);
    }, a = (f) => {
      Et(f, {
        instanceId: "inspector-color",
        get internals() {
          return n.internals;
        },
        compact: !0,
        get adHocValue() {
          return e.get(s);
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
        onExternalCommit: (u) => {
          var h;
          return (h = t.onCommit) == null ? void 0 : h.call(t, u);
        }
      });
    };
    e.if(l, (f) => {
      e.get(s) === null ? f(d) : n ? f(a, -1) : f(p, 1);
    });
  }
  e.append(r, v), e.pop();
}
const et = "sh3-editor.settings";
function yt(r, t, n, s) {
  const v = { ...r[t] ?? {} };
  return s === void 0 ? delete v[n] : v[n] = s, { ...r, [t]: v };
}
function Nn(r, t) {
  const n = Object.keys(r);
  if (n.length === 0) return r;
  const s = new Set(t);
  let v = !1;
  for (const d of n)
    if (!s.has(d)) {
      v = !0;
      break;
    }
  if (!v) return r;
  const l = {};
  for (const d of n)
    s.has(d) && (l[d] = r[d]);
  return l;
}
var Fn = e.from_html('<h3 class="section-label svelte-18qjjuf"> </h3>'), Kn = e.from_html('<section class="section svelte-18qjjuf"><!> <div class="rows svelte-18qjjuf"><!></div></section>');
function zn(r, t) {
  var n = Kn(), s = e.child(n);
  {
    var v = (p) => {
      var a = Fn(), f = e.child(a, !0);
      e.reset(a), e.template_effect(() => e.set_text(f, t.label)), e.append(p, a);
    };
    e.if(s, (p) => {
      t.showHeader && p(v);
    });
  }
  var l = e.sibling(s, 2), d = e.child(l);
  e.snippet(d, () => t.children), e.reset(l), e.reset(n), e.append(r, n);
}
var Wn = e.from_html('<div class="desc svelte-1rh69ln"> </div>'), Gn = e.from_html('<div class="error svelte-1rh69ln"> </div>'), Xn = e.from_html('<div><div class="label-col"><div class="label svelte-1rh69ln"> </div> <!></div> <div class="control svelte-1rh69ln"><!></div> <!></div>');
function Ue(r, t) {
  let n = e.prop(t, "disabled", 3, !1);
  var s = Xn();
  let v;
  var l = e.child(s), d = e.child(l), p = e.child(d, !0);
  e.reset(d);
  var a = e.sibling(d, 2);
  {
    var f = (m) => {
      var i = Wn(), k = e.child(i, !0);
      e.reset(i), e.template_effect(() => e.set_text(k, t.description)), e.append(m, i);
    };
    e.if(a, (m) => {
      t.description && m(f);
    });
  }
  e.reset(l);
  var u = e.sibling(l, 2), h = e.child(u);
  e.snippet(h, () => t.children), e.reset(u);
  var _ = e.sibling(u, 2);
  {
    var b = (m) => {
      var i = Gn(), k = e.child(i, !0);
      e.reset(i), e.template_effect(() => e.set_text(k, t.error)), e.append(m, i);
    };
    e.if(_, (m) => {
      t.error && m(b);
    });
  }
  e.reset(s), e.template_effect(() => {
    v = e.set_class(s, 1, "row svelte-1rh69ln", null, v, { disabled: n() }), e.set_text(p, t.label);
  }), e.append(r, s);
}
var Yn = e.from_html('<button type="button"><span class="knob svelte-ert2i6"></span></button>');
function Jn(r, t) {
  e.push(t, !0);
  const n = e.derived(() => !!t.value);
  Ue(r, {
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
    children: (s, v) => {
      var l = Yn();
      let d;
      e.template_effect(() => {
        d = e.set_class(l, 1, "toggle svelte-ert2i6", null, d, { on: e.get(n) }), l.disabled = t.field.disabled, e.set_attribute(l, "aria-pressed", e.get(n)), e.set_attribute(l, "aria-label", t.field.label);
      }), e.delegated("click", l, () => t.onEdit(!e.get(n))), e.append(s, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
var Qn = e.from_html('<input type="text"/>');
function Zn(r, t) {
  e.push(t, !0);
  const n = e.derived(() => t.value == null ? "" : String(t.value));
  Ue(r, {
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
    children: (s, v) => {
      var l = Qn();
      e.remove_input_defaults(l);
      let d;
      e.template_effect(() => {
        d = e.set_class(l, 1, "input svelte-1jljyjf", null, d, { error: !!t.error }), e.set_attribute(l, "placeholder", t.field.placeholder ?? ""), l.disabled = t.field.disabled, e.set_value(l, e.get(n));
      }), e.delegated("change", l, (p) => t.onEdit(p.currentTarget.value)), e.append(s, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var $n = e.from_html('<span class="unit svelte-1be7g0v"> </span>'), er = e.from_html('<input type="number"/> <!>', 1);
function tr(r, t) {
  e.push(t, !0);
  const n = e.derived(() => typeof t.value == "number" ? String(t.value) : "");
  function s(v) {
    const l = v.currentTarget.value, d = Number(l);
    l === "" || Number.isNaN(d) || t.onEdit(d);
  }
  Ue(r, {
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
      var d = er(), p = e.first_child(d);
      e.remove_input_defaults(p);
      let a;
      var f = e.sibling(p, 2);
      {
        var u = (h) => {
          var _ = $n(), b = e.child(_, !0);
          e.reset(_), e.template_effect(() => e.set_text(b, t.field.unit)), e.append(h, _);
        };
        e.if(f, (h) => {
          t.field.unit && h(u);
        });
      }
      e.template_effect(() => {
        a = e.set_class(p, 1, "input svelte-1be7g0v", null, a, { error: !!t.error }), e.set_attribute(p, "min", t.field.min), e.set_attribute(p, "max", t.field.max), e.set_attribute(p, "step", t.field.step ?? 1), p.disabled = t.field.disabled, e.set_value(p, e.get(n));
      }), e.delegated("change", p, s), e.append(v, d);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var nr = e.from_html('<input type="range"/> <span class="value svelte-1jyn88"> </span>', 1);
function rr(r, t) {
  e.push(t, !0);
  const n = e.derived(() => s(typeof t.value == "number" ? t.value : t.field.min, t.field.min, t.field.max));
  function s(l, d, p) {
    return Math.min(p, Math.max(d, l));
  }
  function v(l) {
    const d = Number(l.currentTarget.value);
    Number.isNaN(d) || t.onEdit(s(d, t.field.min, t.field.max));
  }
  Ue(r, {
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
    children: (l, d) => {
      var p = nr(), a = e.first_child(p);
      e.remove_input_defaults(a);
      let f;
      var u = e.sibling(a, 2), h = e.child(u);
      e.reset(u), e.template_effect(() => {
        f = e.set_class(a, 1, "slider svelte-1jyn88", null, f, { error: !!t.error }), e.set_attribute(a, "min", t.field.min), e.set_attribute(a, "max", t.field.max), e.set_attribute(a, "step", t.field.step ?? 1), a.disabled = t.field.disabled, e.set_value(a, e.get(n)), e.set_text(h, `${e.get(n) ?? ""}${t.field.unit ? ` ${t.field.unit}` : ""}`);
      }), e.delegated("input", a, v), e.append(l, p);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["input"]);
var lr = e.from_html('<button type="button"> </button>'), ar = e.from_html("<div></div>");
function sr(r, t) {
  e.push(t, !0);
  const n = e.derived(() => typeof t.value == "string" ? t.value : "");
  Ue(r, {
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
    children: (s, v) => {
      var l = ar();
      let d;
      e.each(l, 21, () => t.field.options, (p) => p.value, (p, a) => {
        var f = lr();
        let u;
        var h = e.child(f, !0);
        e.reset(f), e.template_effect(() => {
          f.disabled = t.field.disabled, u = e.set_class(f, 1, "svelte-iu603z", null, u, { active: e.get(n) === e.get(a).value }), e.set_text(h, e.get(a).label);
        }), e.delegated("click", f, () => t.onEdit(e.get(a).value)), e.append(p, f);
      }), e.reset(l), e.template_effect(() => d = e.set_class(l, 1, "seg svelte-iu603z", null, d, { error: !!t.error })), e.append(s, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
const ir = {
  boolean: Jn,
  string: Zn,
  number: tr,
  "number-range": rr,
  enum: sr
};
var or = e.from_html('<p class="empty svelte-mrn94a">No settings available.</p>'), cr = e.from_html('<div class="settings svelte-mrn94a"><h2 class="title svelte-mrn94a">Settings</h2> <!></div>');
function dr(r, t) {
  e.push(t, !0);
  let n = e.state(e.proxy(t.ctx.contributions.list(et))), s = e.state(e.proxy({})), v = e.state(e.proxy({}));
  e.user_effect(() => t.ctx.contributions.onChange(et, () => {
    e.set(n, t.ctx.contributions.list(et), !0);
  })), e.user_effect(() => {
    var _;
    const u = [], h = {};
    for (const b of e.get(n)) {
      h[b.shardId] = b.getValues();
      const m = (_ = b.subscribe) == null ? void 0 : _.call(b, () => {
        e.set(s, { ...e.get(s), [b.shardId]: b.getValues() }, !0);
      });
      m && u.push(m);
    }
    return e.set(s, h, !0), e.set(v, Nn(e.get(v), e.get(n).map((b) => b.shardId)), !0), () => u.forEach((b) => b());
  });
  async function l(u, h, _) {
    try {
      await u.onEdit(h, _), e.set(v, yt(e.get(v), u.shardId, h, void 0), !0);
    } catch (b) {
      e.set(v, yt(e.get(v), u.shardId, h, b.message || "Invalid value"), !0);
    } finally {
      e.set(s, { ...e.get(s), [u.shardId]: u.getValues() }, !0);
    }
  }
  var d = cr(), p = e.sibling(e.child(d), 2);
  {
    var a = (u) => {
      var h = or();
      e.append(u, h);
    }, f = (u) => {
      var h = e.comment(), _ = e.first_child(h);
      e.each(_, 17, () => e.get(n), (b) => b.shardId, (b, m) => {
        {
          let i = e.derived(() => e.get(n).length > 1);
          zn(b, {
            get label() {
              return e.get(m).label;
            },
            get showHeader() {
              return e.get(i);
            },
            children: (k, c) => {
              var g = e.comment(), S = e.first_child(g);
              e.each(S, 17, () => e.get(m).schema, (P) => P.key, (P, I) => {
                var M = e.comment(), C = e.first_child(M);
                {
                  let D = e.derived(() => {
                    var w;
                    return (w = e.get(s)[e.get(m).shardId]) == null ? void 0 : w[e.get(I).key];
                  }), R = e.derived(() => {
                    var w;
                    return (w = e.get(v)[e.get(m).shardId]) == null ? void 0 : w[e.get(I).key];
                  });
                  e.component(C, () => ir[e.get(I).type], (w, T) => {
                    T(w, {
                      get field() {
                        return e.get(I);
                      },
                      get value() {
                        return e.get(D);
                      },
                      get error() {
                        return e.get(R);
                      },
                      onEdit: (A) => l(e.get(m), e.get(I).key, A)
                    });
                  });
                }
                e.append(P, M);
              }), e.append(k, g);
            }
          });
        }
      }), e.append(u, h);
    };
    e.if(p, (u) => {
      e.get(n).length === 0 ? u(a) : u(f, -1);
    });
  }
  e.reset(d), e.append(r, d), e.pop();
}
function ur(r, t = {}) {
  const n = t.warn ?? ((l) => console.warn(l)), s = /* @__PURE__ */ new Set(), v = [];
  for (let l = 0; l < r.length; l++) {
    const d = r[l];
    if (s.has(d.id)) {
      n(`[sh3-editor] duplicate help tab id "${d.id}" — first registration kept, this one ignored.`);
      continue;
    }
    s.add(d.id), v.push({ c: d, i: l });
  }
  return v.sort((l, d) => {
    const p = l.c.priority ?? 100, a = d.c.priority ?? 100;
    return p !== a ? p - a : l.i - d.i;
  }), v.map((l) => l.c);
}
function fr(r) {
  return {
    activeAppId: r.getActiveApp(),
    focusedViewId: r.readFocusedViewId(),
    mountedViewIds: [...r.listMountedViewIds()],
    selection: r.getSelection(),
    capturedAt: r.now()
  };
}
function vr(r) {
  const t = r.doc ?? (typeof document < "u" ? document : void 0);
  return {
    getActiveApp: () => r.getActiveAppId(),
    listMountedViewIds: () => {
      if (!t) return [];
      const n = t.querySelectorAll("[data-sh3-view]"), s = /* @__PURE__ */ new Set();
      return n.forEach((v) => {
        const l = v.getAttribute("data-sh3-view");
        l && s.add(l);
      }), [...s];
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
const gr = {
  Meta: "⌘",
  Ctrl: "⌃",
  Alt: "⌥",
  Shift: "⇧"
};
function hr(r, t) {
  if (!r) return "—";
  const n = r.split("+");
  if (t === "mac") {
    let s = "";
    for (let v = 0; v < n.length; v++) {
      const l = n[v];
      s += gr[l] ?? l;
    }
    return s;
  }
  return r;
}
function mr() {
  return typeof navigator > "u" ? "other" : (navigator.platform || navigator.userAgent || "").includes("Mac") ? "mac" : "other";
}
var pr = e.from_html('<span>App: <code class="svelte-151qe3m"> </code></span>'), br = e.from_html('<span>Focused view: <code class="svelte-151qe3m"> </code></span>'), _r = e.from_html('<header class="ctx svelte-151qe3m"><!> <!> <!></header>'), yr = e.from_html('<p class="empty svelte-151qe3m">No hotkeys active in this context.</p>'), kr = e.from_html('<span class="badge svelte-151qe3m"> </span>'), wr = e.from_html('<li><span class="label svelte-151qe3m"> </span> <kbd class="kbd svelte-151qe3m"> </kbd> <!></li>'), xr = e.from_html('<section class="group svelte-151qe3m"><h3 class="group-title svelte-151qe3m"> </h3> <ul class="list svelte-151qe3m"></ul></section>'), Cr = e.from_html('<div class="hotkeys-tab svelte-151qe3m"><!> <!></div>');
function Sr(r, t) {
  e.push(t, !0);
  const n = mr(), s = {
    home: "Global",
    app: "App",
    view: "View",
    focus: "Focus",
    element: "Selection"
  };
  function v(i) {
    if (i.scope === "home") return "home";
    if (i.scope === "app") return "app";
    if (typeof i.scope == "string") {
      if (i.scope.startsWith("view:")) return "view";
      if (i.scope.startsWith("focus:")) return "focus";
    }
    return "element";
  }
  const l = ["home", "app", "view", "focus", "element"], d = e.derived(() => {
    const i = /* @__PURE__ */ new Map();
    for (const k of t.actions) {
      const c = v(k), g = i.get(c) ?? [];
      g.push(k), i.set(c, g);
    }
    for (const k of i.values())
      k.sort((c, g) => {
        const S = c.group ?? "", P = g.group ?? "";
        return S !== P ? S.localeCompare(P) : c.label.localeCompare(g.label);
      });
    return l.map((k) => ({ tier: k, label: s[k], items: i.get(k) ?? [] })).filter((k) => k.items.length > 0);
  }), { snapshot: p } = t.tabCtx, a = p.activeAppId !== null || p.focusedViewId !== null;
  var f = Cr(), u = e.child(f);
  {
    var h = (i) => {
      var k = _r(), c = e.child(k);
      {
        var g = (C) => {
          var D = pr(), R = e.sibling(e.child(D)), w = e.child(R, !0);
          e.reset(R), e.reset(D), e.template_effect(() => e.set_text(w, p.activeAppId)), e.append(C, D);
        };
        e.if(c, (C) => {
          p.activeAppId && C(g);
        });
      }
      var S = e.sibling(c, 2);
      {
        var P = (C) => {
          var D = e.text("·");
          e.append(C, D);
        };
        e.if(S, (C) => {
          p.activeAppId && p.focusedViewId && C(P);
        });
      }
      var I = e.sibling(S, 2);
      {
        var M = (C) => {
          var D = br(), R = e.sibling(e.child(D)), w = e.child(R, !0);
          e.reset(R), e.reset(D), e.template_effect(() => e.set_text(w, p.focusedViewId)), e.append(C, D);
        };
        e.if(I, (C) => {
          p.focusedViewId && C(M);
        });
      }
      e.reset(k), e.append(i, k);
    };
    e.if(u, (i) => {
      a && i(h);
    });
  }
  var _ = e.sibling(u, 2);
  {
    var b = (i) => {
      var k = yr();
      e.append(i, k);
    }, m = (i) => {
      var k = e.comment(), c = e.first_child(k);
      e.each(c, 17, () => e.get(d), (g) => g.tier, (g, S) => {
        var P = xr(), I = e.child(P), M = e.child(I, !0);
        e.reset(I);
        var C = e.sibling(I, 2);
        e.each(C, 21, () => e.get(S).items, (D) => D.id, (D, R) => {
          var w = wr();
          let T;
          var A = e.child(w), j = e.child(A, !0);
          e.reset(A);
          var V = e.sibling(A, 2), F = e.child(V, !0);
          e.reset(V);
          var H = e.sibling(V, 2);
          {
            var W = (X) => {
              var Z = kr(), $ = e.child(Z, !0);
              e.reset(Z), e.template_effect(() => e.set_text($, e.get(R).scopeBadge)), e.append(X, Z);
            };
            e.if(H, (X) => {
              e.get(R).scopeBadge && X(W);
            });
          }
          e.reset(w), e.template_effect(
            (X) => {
              T = e.set_class(w, 1, "row svelte-151qe3m", null, T, { disabled: e.get(R).effectiveShortcut === null }), e.set_text(j, e.get(R).label), e.set_text(F, X);
            },
            [
              () => hr(e.get(R).effectiveShortcut, n)
            ]
          ), e.append(D, w);
        }), e.reset(C), e.reset(P), e.template_effect(() => e.set_text(M, e.get(S).label)), e.append(g, P);
      }), e.append(i, k);
    };
    e.if(_, (i) => {
      e.get(d).length === 0 ? i(b) : i(m, -1);
    });
  }
  e.reset(f), e.append(r, f), e.pop();
}
var Pr = e.from_html('<button class="close-btn svelte-udgkd3" aria-label="Close help">×</button>'), Ir = e.from_html('<header class="help-header svelte-udgkd3"><span class="title svelte-udgkd3">Help</span> <!></header>'), Er = e.from_html('<span class="tab-icon svelte-udgkd3"> </span>'), Dr = e.from_html('<button role="tab"><!> <span> </span></button>'), Mr = e.from_html('<div role="tabpanel"></div>'), Tr = e.from_html('<div class="tab-strip svelte-udgkd3" role="tablist"></div> <div class="tab-bodies svelte-udgkd3"></div>', 1), Ar = e.from_html('<p class="loading svelte-udgkd3">Loading…</p>'), Hr = e.from_html('<div data-sh3-view="sh3-editor:help"><!> <!></div>');
function kt(r, t) {
  e.push(t, !0);
  let n = e.state(null), s = e.state([]), v = [], l = e.state(0);
  const d = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  function a(c) {
    if (d.has(c.id)) return;
    const g = p.get(c.id);
    if (!g || !e.get(n)) return;
    const S = {
      surface: t.surface,
      snapshot: e.get(n),
      close: t.surface === "modal" ? t.close : void 0
    };
    if (c.id === "sh3-editor:help-tab:hotkeys") {
      const P = me(Sr, {
        target: g,
        props: { tabCtx: S, actions: v }
      });
      d.set(c.id, { unmount: () => pe(P) });
    } else
      d.set(c.id, c.mount(g, S));
  }
  xt(() => {
    const c = qt(), g = vr({
      getActiveAppId: () => (c == null ? void 0 : c.id) ?? null,
      getSelection: () => t.ctx.actions.selection.get()
    });
    e.set(n, fr(g)), v = qe.actions.listActive();
    const S = t.ctx.contributions.list(Pt);
    e.set(s, ur(S));
  }), Bt(() => {
    var c;
    for (const g of d.values())
      try {
        g.unmount();
      } catch (S) {
        console.warn("[sh3-editor] Help tab unmount error:", S);
      }
    d.clear(), p.clear(), (c = t.onClose) == null || c.call(t);
  }), e.user_effect(() => {
    if (!e.get(n)) return;
    const c = e.get(s)[e.get(l)];
    c && queueMicrotask(() => a(c));
  });
  function f(c, g) {
    p.set(g, c);
    const S = e.get(s)[e.get(l)];
    return S && S.id === g && e.get(n) && a(S), {
      destroy() {
        p.delete(g);
      }
    };
  }
  var u = Hr();
  let h;
  var _ = e.child(u);
  {
    var b = (c) => {
      var g = Ir(), S = e.sibling(e.child(g), 2);
      {
        var P = (I) => {
          var M = Pr();
          e.delegated("click", M, function(...C) {
            var D;
            (D = t.close) == null || D.apply(this, C);
          }), e.append(I, M);
        };
        e.if(S, (I) => {
          t.close && I(P);
        });
      }
      e.reset(g), e.append(c, g);
    };
    e.if(_, (c) => {
      t.surface === "modal" && c(b);
    });
  }
  var m = e.sibling(_, 2);
  {
    var i = (c) => {
      var g = Tr(), S = e.first_child(g);
      e.each(S, 23, () => e.get(s), (I) => I.id, (I, M, C) => {
        var D = Dr();
        let R;
        var w = e.child(D);
        {
          var T = (V) => {
            var F = Er(), H = e.child(F, !0);
            e.reset(F), e.template_effect(() => e.set_text(H, e.get(M).icon)), e.append(V, F);
          };
          e.if(w, (V) => {
            e.get(M).icon && V(T);
          });
        }
        var A = e.sibling(w, 2), j = e.child(A, !0);
        e.reset(A), e.reset(D), e.template_effect(() => {
          R = e.set_class(D, 1, "tab-btn svelte-udgkd3", null, R, { active: e.get(C) === e.get(l) }), e.set_attribute(D, "aria-selected", e.get(C) === e.get(l)), e.set_text(j, e.get(M).label);
        }), e.delegated("click", D, () => e.set(l, e.get(C), !0)), e.append(I, D);
      }), e.reset(S);
      var P = e.sibling(S, 2);
      e.each(P, 23, () => e.get(s), (I) => I.id, (I, M, C) => {
        var D = Mr();
        let R;
        e.action(D, (w, T) => f == null ? void 0 : f(w, T), () => e.get(M).id), e.template_effect(() => R = e.set_class(D, 1, "tab-body svelte-udgkd3", null, R, { active: e.get(C) === e.get(l) })), e.append(I, D);
      }), e.reset(P), e.append(c, g);
    }, k = (c) => {
      var g = Ar();
      e.append(c, g);
    };
    e.if(m, (c) => {
      e.get(s).length > 0 ? c(i) : c(k, -1);
    });
  }
  e.reset(u), e.template_effect(() => h = e.set_class(u, 1, "help-root svelte-udgkd3", null, h, { "modal-surface": t.surface === "modal" })), e.append(r, u), e.pop();
}
e.delegate(["click"]);
let ge = null, nt = null, Ee = null, De = null, Me = null, Te = null;
function Vr() {
  return nt;
}
const wt = {
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
    ge = new Kt();
    const { api: t, internals: n, teardown: s } = nn(ge);
    nt = t, Ee = n, De = s, wt.api = t;
    const v = () => {
      mt(r.contributions.list(Qe));
    };
    v(), Me = r.contributions.onChange(Qe, v);
    const l = r.state({
      user: { colorPickerPalettes: [] }
    });
    function d(_) {
      const b = l.user.colorPickerPalettes, m = b.findIndex((i) => i.id === _.id);
      m === -1 ? b.push(_) : b[m] = _;
    }
    function p(_) {
      const b = l.user.colorPickerPalettes, m = b.findIndex((i) => i.id === _);
      m !== -1 && b.splice(m, 1);
    }
    bt({
      internals: n,
      userPalettes: l.user.colorPickerPalettes,
      onSaveUserPalette: d,
      onDeleteUserPalette: p
    });
    const a = {
      id: "sh3-editor:color",
      type: "color",
      component: jn,
      priority: 10
    };
    Te = r.contributions.register(Qe, a);
    const f = {};
    r.registerView("sh3-editor:editor", {
      mount(_, b) {
        const m = b.slotId, i = ge.get(m), k = (i == null ? void 0 : i.options) || f, c = me(yn, {
          target: _,
          props: {
            entry: i,
            internals: Ee,
            highlight: k.highlight,
            matchingConfig: k.matchingConfig,
            fontSize: k.fontSize,
            toolbarActions: k.toolbarActions,
            showSettings: k.showSettings
          }
        });
        return {
          closable: !0,
          unmount() {
            pe(c);
          }
        };
      }
    }), r.registerView("sh3-editor:inspector", {
      mount(_, b) {
        const m = b.slotId, i = b.meta, k = me(Mn, {
          target: _,
          props: {
            instanceId: m,
            adHocValue: i == null ? void 0 : i.value,
            adHocMeta: i == null ? void 0 : i.meta,
            adHocReadonly: (i == null ? void 0 : i.readonly) ?? !1,
            internals: Ee
          }
        });
        return {
          closable: !0,
          unmount() {
            pe(k);
          }
        };
      }
    }), r.registerView("sh3-editor:color-picker", {
      mount(_, b) {
        const m = b.slotId, i = n.colorPickers.get(m), k = b.meta, c = me(Et, {
          target: _,
          props: {
            instanceId: m,
            adHocValue: k == null ? void 0 : k.value,
            adHocReadonly: (k == null ? void 0 : k.readonly) ?? !1,
            internals: Ee,
            prefs: (i == null ? void 0 : i.options.prefs) ?? { mode: "hsv" },
            compact: (i == null ? void 0 : i.options.compact) ?? !1,
            userPalettes: l.user.colorPickerPalettes,
            onSaveUserPalette: d,
            onDeleteUserPalette: p
          }
        });
        return {
          closable: !0,
          unmount() {
            pe(c);
          }
        };
      }
    }), r.registerView("sh3-editor:settings", {
      mount(_) {
        const b = me(dr, {
          target: _,
          props: { ctx: r }
        });
        return {
          closable: !0,
          unmount() {
            pe(b);
          }
        };
      }
    }), r.registerView("sh3-editor:help", {
      mount(_) {
        const b = me(kt, {
          target: _,
          props: { surface: "view", ctx: r }
        });
        return {
          closable: !0,
          unmount() {
            pe(b);
          }
        };
      }
    });
    const u = {
      id: "sh3-editor:help-tab:hotkeys",
      label: "Hotkeys",
      priority: 0,
      mount() {
        return { unmount() {
        } };
      }
    };
    r.contributions.register(
      Pt,
      u
    );
    let h = !1;
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
        h || (h = !0, qe.modal.open(
          kt,
          { surface: "modal", ctx: r, onClose: () => {
            h = !1;
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
    Te == null || Te(), Te = null, bt(null), Me == null || Me(), Me = null, De == null || De(), ge == null || ge.clear(), mt([]), ge = null, nt = null, Ee = null, De = null, wt.api = null;
  }
};
export {
  Vr as getApi,
  wt as shard
};
