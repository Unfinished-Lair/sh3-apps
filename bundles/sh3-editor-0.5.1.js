/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".toolbar.svelte-10sr5yt{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid var(--shell-border);background:var(--shell-bg-raised);font-family:var(--shell-font-ui);font-size:12px;flex-shrink:0}.toolbar-btn.svelte-10sr5yt{padding:2px 8px;border:1px solid var(--shell-border);border-radius:3px;background:var(--shell-bg);color:var(--shell-fg);font-size:11px;cursor:pointer;white-space:nowrap}.toolbar-btn.svelte-10sr5yt:hover:not(:disabled){background:var(--shell-bg-sunken)}.toolbar-btn.svelte-10sr5yt:disabled{opacity:.4;cursor:default}.toolbar-accent.svelte-10sr5yt{color:var(--shell-accent)}.toolbar-spacer.svelte-10sr5yt{flex:1}.toolbar-sep.svelte-10sr5yt{width:1px;height:16px;background:var(--shell-border)}.toolbar-path.svelte-10sr5yt{color:var(--shell-fg-muted);font-family:var(--shell-font-mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body.svelte-1etykqv{padding:var(--shell-pad-lg);display:flex;flex-direction:column;gap:var(--shell-pad-md);min-width:320px;font-family:var(--shell-font-ui)}h2.svelte-1etykqv{margin:0;font-size:16px;color:var(--shell-fg)}.rows.svelte-1etykqv{display:flex;flex-direction:column;gap:var(--shell-pad-sm)}.row.svelte-1etykqv{display:flex;align-items:center;justify-content:space-between;gap:var(--shell-pad-md);font-size:13px}.label.svelte-1etykqv{color:var(--shell-fg-muted)}.seg.svelte-1etykqv{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;padding:4px 10px;background:var(--shell-bg);color:var(--shell-fg);border:none;font-size:12px;cursor:pointer}.seg.svelte-1etykqv button:where(.svelte-1etykqv)+button:where(.svelte-1etykqv){border-left:1px solid var(--shell-border)}.seg.svelte-1etykqv button.active:where(.svelte-1etykqv){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-1etykqv button:where(.svelte-1etykqv):hover:not(.active){background:var(--shell-bg-sunken)}.actions.svelte-1etykqv{display:flex;justify-content:flex-end;gap:var(--shell-pad-sm)}.actions.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:var(--shell-radius-sm);cursor:pointer}.actions.svelte-1etykqv button:where(.svelte-1etykqv):hover{background:var(--shell-accent)}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv){background:transparent}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv):hover{background:var(--shell-bg-sunken)}.editor-container.svelte-1j4uh1h{display:flex;flex-direction:column;height:100%;position:relative}.editor-wrap.svelte-1j4uh1h{display:flex;height:100%;overflow:hidden;background:var(--shell-bg-sunken);font-family:var(--shell-font-mono);font-size:var(--editor-font-size, 13px);line-height:1.6;color:var(--shell-fg)}.gutter.svelte-1j4uh1h{flex-shrink:0;width:3.5em;background:var(--shell-bg-sunken);border-right:1px solid var(--shell-border);overflow:hidden;color:var(--shell-fg-muted);font-size:inherit;line-height:inherit;-webkit-user-select:none;user-select:none}.gutter-inner.svelte-1j4uh1h{text-align:right;padding:0 .5em 0 0}.line-num.svelte-1j4uh1h{font-size:.85em;height:1lh;line-height:1lh}.editor-body.svelte-1j4uh1h{position:relative;flex:1;overflow:hidden}.highlight-layer.svelte-1j4uh1h{position:absolute;top:0;left:0;margin:0;padding:0 .75em;white-space:pre;word-wrap:normal;overflow:visible;pointer-events:none;font-family:inherit;font-size:inherit;line-height:inherit;color:var(--shell-fg);-moz-tab-size:2;tab-size:2}.input-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:0;padding:0 .75em;background:transparent;border:none;outline:none;resize:none;font-family:inherit;font-size:inherit;line-height:inherit;color:transparent;caret-color:var(--shell-fg);white-space:pre;word-wrap:normal;overflow:auto;-moz-tab-size:2;tab-size:2;box-sizing:border-box}.input-layer.svelte-1j4uh1h::selection{background:#61afef40}.hl-keyword{color:#c678dd}.hl-type{color:#e5c07b}.hl-string{color:#98c379}.hl-number,.hl-bool{color:#d19a66}.hl-comment{color:#5c6370;font-style:italic}.hl-key{color:#e06c75}.hl-context{color:#56b6c2}.hl-parent,.hl-ref{color:#61afef}.hl-punct{color:var(--shell-fg-muted)}.hl-code{color:#abb2bf}.hl-heading{color:#e5c07b;font-weight:600}.hl-bold{font-weight:600}.field.svelte-2gtehg{display:grid;grid-template-columns:minmax(4em,12em) 1fr;column-gap:.75em;align-items:center;padding:.15em .5em;font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg)}.label.svelte-2gtehg{color:var(--shell-fg-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.readonly.svelte-2gtehg .value:where(.svelte-2gtehg){color:var(--shell-fg-muted)}.primitive.svelte-1o84d6l{background:var(--shell-bg-sunken);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:2px;padding:.1em .3em;font-family:var(--shell-font-mono);font-size:13px;width:100%;box-sizing:border-box}.primitive.svelte-1o84d6l:focus{outline:1px solid var(--shell-accent, #61afef)}.primitive.svelte-1o84d6l:disabled{color:var(--shell-fg-muted);cursor:default}.walker.svelte-1xvtj10{display:flex;flex-direction:column;gap:.1em;padding:.25em 0}.leaf.svelte-o6duey{font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg-muted)}.inspector-container.svelte-jpxkcf{display:flex;flex-direction:column;height:100%;background:var(--shell-bg-sunken);color:var(--shell-fg);font-family:var(--shell-font-mono);font-size:13px;outline:none}.inspector-body.svelte-jpxkcf{flex:1;overflow:auto;padding:.5em 0}.cp-surface.svelte-7v5dlc{display:flex;flex-direction:column;gap:12px;padding:12px;background:var(--shell-bg-elevated);border-radius:6px;font-family:var(--shell-font-ui);width:fit-content}.cp-surface.disabled.svelte-7v5dlc{opacity:.5;pointer-events:none}.cp-main.svelte-7v5dlc{display:flex;gap:16px}.cp-left.svelte-7v5dlc{display:flex;flex-direction:column;gap:10px}.cp-right.svelte-7v5dlc{display:flex;flex-direction:column;min-width:180px}.cp-body.svelte-7v5dlc{display:flex;gap:8px}.cp-square.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:crosshair}.cp-strip.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-mode.svelte-7v5dlc{display:inline-flex;gap:0}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:3px 10px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);cursor:pointer}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):first-child{border-radius:4px 0 0 4px;border-right:none}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):last-child{border-radius:0 4px 4px 0}.cp-mode.svelte-7v5dlc button.active:where(.svelte-7v5dlc){background:var(--shell-accent, #3a7eff);color:var(--shell-bg)}.cp-sliders.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-label.svelte-7v5dlc{width:14px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-value.svelte-7v5dlc{width:40px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-range.svelte-7v5dlc{flex:1;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:8px;border-radius:4px;background:var(--track-bg, var(--shell-input-bg));outline:none;cursor:pointer}.cp-range.svelte-7v5dlc::-webkit-slider-thumb{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-range.svelte-7v5dlc::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-hex-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-preview.svelte-7v5dlc{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-7v5dlc{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-palette.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-palette-select.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;outline:none}.cp-palette-select.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-swatches.svelte-7v5dlc{display:grid;grid-template-columns:repeat(auto-fill,minmax(24px,1fr));gap:4px}.cp-swatch.svelte-7v5dlc{width:24px;height:24px;border-radius:4px;border:1px solid var(--shell-border);cursor:pointer;padding:0;outline:none}.cp-swatch.active.svelte-7v5dlc{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-palette-actions.svelte-7v5dlc{display:flex;gap:4px}.cp-palette-btn.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-palette-btn.svelte-7v5dlc:hover:not([disabled]){background:var(--shell-bg-sunken)}.cp-palette-btn[disabled].svelte-7v5dlc{opacity:.5;cursor:not-allowed}.cp-save-prompt.svelte-7v5dlc{display:flex;gap:4px;align-items:center}.cp-save-input.svelte-7v5dlc{flex:1;min-width:0;padding:3px 6px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:12px;font-family:inherit;outline:none}.cp.svelte-f5c5rv{display:flex;flex-direction:column;border:1px solid var(--shell-border);border-radius:6px;width:fit-content}.cp.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact.svelte-f5c5rv{position:relative;display:inline-block;font-family:var(--shell-font-ui)}.cp-compact.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact-row.svelte-f5c5rv{display:flex;align-items:center;gap:6px}.cp-compact-preview.svelte-f5c5rv{width:20px;height:20px;cursor:pointer;border:1px solid var(--shell-border);border-radius:4px;flex-shrink:0;outline:none}.cp-compact-preview.svelte-f5c5rv:focus-visible{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-preview.svelte-f5c5rv{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-f5c5rv{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-f5c5rv:focus{border-color:var(--shell-accent, #3a7eff)}.cp-compact-hex.svelte-f5c5rv{width:90px;font-size:12px}.cp-leaf-fallback.svelte-1tdr2l8{font-family:var(--shell-font-mono, monospace);color:var(--shell-text-dim)}.section.svelte-18qjjuf{padding-bottom:var(--shell-pad-md);margin-bottom:var(--shell-pad-md);border-bottom:1px solid var(--shell-border)}.section.svelte-18qjjuf:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0}.section-label.svelte-18qjjuf{margin:0 0 var(--shell-pad-sm);font-size:11px;font-weight:600;color:var(--shell-accent);text-transform:uppercase;letter-spacing:.08em;font-family:var(--shell-font-ui)}.rows.svelte-18qjjuf{display:flex;flex-direction:column}.row.svelte-1rh69ln{display:grid;grid-template-columns:200px 1fr;column-gap:var(--shell-pad-md);align-items:center;padding:var(--shell-pad-sm) 0;font-family:var(--shell-font-ui);font-size:13px;color:var(--shell-fg)}.row.disabled.svelte-1rh69ln{opacity:.5;pointer-events:none}.label.svelte-1rh69ln{color:var(--shell-fg)}.desc.svelte-1rh69ln{font-size:11px;color:var(--shell-fg-muted);margin-top:2px}.control.svelte-1rh69ln{display:flex;align-items:center;gap:var(--shell-pad-sm)}.error.svelte-1rh69ln{grid-column:2;font-size:11px;color:var(--shell-error, #ff7a7a);margin-top:4px}.toggle.svelte-ert2i6{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:34px;height:18px;background:var(--shell-border);border:none;border-radius:9px;position:relative;cursor:pointer;padding:0;transition:background .1s}.toggle.on.svelte-ert2i6{background:var(--shell-accent)}.toggle[disabled].svelte-ert2i6{cursor:not-allowed}.knob.svelte-ert2i6{position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:left .1s}.toggle.on.svelte-ert2i6 .knob:where(.svelte-ert2i6){left:18px}.input.svelte-1jljyjf{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:100%;box-sizing:border-box}.input.svelte-1jljyjf:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1jljyjf{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1jljyjf{cursor:not-allowed}.input.svelte-1be7g0v{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:90px;box-sizing:border-box}.input.svelte-1be7g0v:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1be7g0v{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1be7g0v{cursor:not-allowed}.unit.svelte-1be7g0v{font-size:11px;color:var(--shell-fg-muted)}.slider.svelte-1jyn88{flex:1;accent-color:var(--shell-accent);cursor:pointer}.slider[disabled].svelte-1jyn88{cursor:not-allowed}.slider.error.svelte-1jyn88{accent-color:var(--shell-error, #ff7a7a)}.value.svelte-1jyn88{min-width:56px;text-align:right;font-size:12px;color:var(--shell-accent);font-variant-numeric:tabular-nums}.seg.svelte-iu603z{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.error.svelte-iu603z{border-color:var(--shell-error, #ff7a7a)}.seg.svelte-iu603z button:where(.svelte-iu603z){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 10px;background:var(--shell-bg-sunken);color:var(--shell-fg);border:none;cursor:pointer}.seg.svelte-iu603z button:where(.svelte-iu603z)+button:where(.svelte-iu603z){border-left:1px solid var(--shell-border)}.seg.svelte-iu603z button.active:where(.svelte-iu603z){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-iu603z button:where(.svelte-iu603z):hover:not(.active):not([disabled]){background:var(--shell-bg)}.seg.svelte-iu603z button[disabled]:where(.svelte-iu603z){cursor:not-allowed}.settings.svelte-mrn94a{padding:var(--shell-pad-lg);font-family:var(--shell-font-ui);color:var(--shell-fg);background:var(--shell-bg);min-height:100%;box-sizing:border-box}.title.svelte-mrn94a{margin:0 0 var(--shell-pad-md);font-size:16px;font-weight:600}.empty.svelte-mrn94a{color:var(--shell-fg-muted);font-style:italic;padding:var(--shell-pad-md) 0}";
  document.head.appendChild(s);
})();
var Ht = Object.defineProperty;
var vt = (r) => {
  throw TypeError(r);
};
var Rt = (r, t, n) => t in r ? Ht(r, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : r[t] = n;
var G = (r, t, n) => Rt(r, typeof t != "symbol" ? t + "" : t, n), At = (r, t, n) => t.has(r) || vt("Cannot " + n);
var Ce = (r, t, n) => (At(r, t, "read from private field"), n ? n.call(r) : t.get(r)), Ye = (r, t, n) => t.has(r) ? vt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(r) : t.set(r, n);
import { onMount as Lt, mount as Le, unmount as Oe } from "svelte";
import * as e from "svelte/internal/client";
import "svelte/internal/disclose-version";
import { shell as kt } from "sh3-core";
const Ot = 2, jt = "inline";
function Bt(r, t) {
  return {
    indentUnit: (t == null ? void 0 : t.indentUnit) ?? (r == null ? void 0 : r.indentUnit) ?? Ot,
    braceStyle: (t == null ? void 0 : t.braceStyle) ?? (r == null ? void 0 : r.braceStyle) ?? jt
  };
}
class Vt {
  constructor(t) {
    G(this, "entries", /* @__PURE__ */ new Map());
    G(this, "onClose");
    this.onClose = t;
  }
  open(t, n) {
    if (this.entries.has(t))
      return this.entries.get(t);
    const g = {
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
      prefs: Bt(n.matchingConfig, n.prefs)
    };
    return this.entries.set(t, g), g;
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
var Me;
class qt {
  constructor(t) {
    G(this, "entries", /* @__PURE__ */ new Map());
    Ye(this, Me, e.state(0));
    G(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(Ce(this, Me));
  }
  set version(t) {
    e.set(Ce(this, Me), t, !0);
  }
  open(t, n) {
    const o = this.entries.get(t);
    if (o) return o;
    const g = { value: n.value, meta: n.meta, options: n };
    return this.entries.set(t, g), this.version++, g;
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
Me = new WeakMap();
const Nt = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
function me({ h: r, s: t, v: n }) {
  const o = t / 100, g = n / 100, l = g * o, d = l * (1 - Math.abs(r / 60 % 2 - 1)), b = g - l;
  let a = 0, c = 0, i = 0;
  return r < 60 ? (a = l, c = d) : r < 120 ? (a = d, c = l) : r < 180 ? (c = l, i = d) : r < 240 ? (c = d, i = l) : r < 300 ? (a = d, i = l) : (a = l, i = d), {
    r: Math.round((a + b) * 255),
    g: Math.round((c + b) * 255),
    b: Math.round((i + b) * 255)
  };
}
function Kt({ r, g: t, b: n }) {
  const o = r / 255, g = t / 255, l = n / 255, d = Math.max(o, g, l), b = Math.min(o, g, l), a = d - b;
  let c = 0;
  a !== 0 && (d === o ? c = 60 * ((g - l) / a % 6) : d === g ? c = 60 * ((l - o) / a + 2) : c = 60 * ((o - g) / a + 4)), c < 0 && (c += 360);
  const i = d === 0 ? 0 : a / d * 100, u = d * 100;
  return { h: Math.round(c), s: Math.round(i), v: Math.round(u) };
}
function be({ r, g: t, b: n }) {
  const o = (g) => g.toString(16).padStart(2, "0");
  return `#${o(r)}${o(t)}${o(n)}`;
}
function zt(r) {
  let t = r.replace(/^#/, "");
  t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]);
  const n = parseInt(t, 16);
  return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
}
function Pe(r) {
  return be(me(r));
}
function fe(r) {
  return Kt(zt(r));
}
function Ft(r) {
  return Nt.test(r);
}
function ie(r) {
  if (!Ft(r)) return null;
  let t = r.replace(/^#/, "").toLowerCase();
  return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), `#${t}`;
}
var Te;
class Wt {
  constructor(t) {
    G(this, "entries", /* @__PURE__ */ new Map());
    Ye(this, Te, e.state(0));
    G(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(Ce(this, Te));
  }
  set version(t) {
    e.set(Ce(this, Te), t, !0);
  }
  open(t, n) {
    const o = this.entries.get(t);
    if (o) return o;
    const l = { value: ie(n.value) ?? "#000000", options: n };
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
Te = new WeakMap();
const Gt = 200;
class Xt {
  constructor(t = Gt) {
    G(this, "undoStack", []);
    G(this, "redoStack", []);
    G(this, "maxDepth");
    G(this, "listeners", /* @__PURE__ */ new Set());
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
function je(r) {
  const { setter: t, before: n, after: o, cursorBefore: g, cursorAfter: l, now: d } = r;
  return {
    apply: () => t(o, l),
    revert: () => t(n, g),
    meta: {
      kind: "text-swap",
      timestamp: d,
      snapshot: { before: n, after: o, cursorBefore: g, cursorAfter: l }
    }
  };
}
class Yt {
  constructor() {
    G(this, "engines", /* @__PURE__ */ new Map());
  }
  get(t) {
    let n = this.engines.get(t);
    return n || (n = new Xt(), this.engines.set(t, n)), n;
  }
  release(t) {
    this.engines.delete(t);
  }
  clear() {
    this.engines.clear();
  }
}
class ge {
  constructor() {
    G(this, "listeners", /* @__PURE__ */ new Set());
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
function Jt(r, t, n) {
  const o = r.get(t);
  return {
    push(l) {
      o.push(l), n();
    },
    undo() {
      const l = o.undo();
      return l && n(), l;
    },
    redo() {
      const l = o.redo();
      return l && n(), l;
    },
    peek() {
      return o.peek();
    },
    replaceTop(l) {
      const d = o.replaceTop(l);
      return d && n(), d;
    },
    get canUndo() {
      return o.canUndo;
    },
    get canRedo() {
      return o.canRedo;
    },
    clear() {
      o.clear(), n();
    },
    onChange(l) {
      return o.onChange(l);
    }
  };
}
const Qt = 300;
function Zt(r) {
  const t = new ge(), n = new ge(), o = new ge(), g = new ge(), l = new ge(), d = new ge(), b = new ge(), a = new Yt(), c = new qt((m) => {
    a.release(m);
  }), i = new Wt((m) => {
    a.release(m);
  }), u = /* @__PURE__ */ new Map();
  function p(m) {
    let _ = u.get(m);
    return _ || (_ = Jt(a, m, () => {
      var U;
      if (c.has(m) && l.emit(m, ((U = c.get(m)) == null ? void 0 : U.value) ?? null), i.has(m)) {
        const S = i.get(m);
        S && d.emit(m, S.value);
      }
    }), u.set(m, _)), _;
  }
  function h(m) {
    a.release(m), u.delete(m);
  }
  return { api: {
    getContent(m) {
      const _ = r.get(m);
      return _ ? _.document.content : null;
    },
    isDirty(m) {
      const _ = r.get(m);
      return _ ? _.document.dirty : !1;
    },
    getDocument(m) {
      const _ = r.get(m);
      return _ ? _.document : null;
    },
    listInstances() {
      return r.list();
    },
    openDocument(m, _) {
      r.open(m, _);
    },
    closeDocument(m) {
      r.close(m) && h(m);
    },
    updateContent(m, _, U, S) {
      var X, ce;
      const M = r.get(m);
      if (!M) return;
      const I = M.document, E = I.content;
      if (E === _) return;
      const B = I.cursorStart, z = (de, te) => {
        I.content = de, I.cursorStart = te, I.cursorEnd = te, t.emit(m, de);
      };
      I.content = _, I.cursorStart = U, I.cursorEnd = S;
      const k = p(m), P = Date.now(), A = k.peek(), V = ((X = A == null ? void 0 : A.meta) == null ? void 0 : X.kind) === "text-swap" ? A.meta.snapshot : void 0, q = Math.abs(_.length - E.length) <= 1, J = V && ((ce = A == null ? void 0 : A.meta) == null ? void 0 : ce.timestamp) != null && P - A.meta.timestamp < Qt;
      V && q && J ? k.replaceTop(je({
        setter: z,
        before: V.before,
        after: _,
        cursorBefore: V.cursorBefore,
        cursorAfter: U,
        now: P
      })) : k.push(je({
        setter: z,
        before: E,
        after: _,
        cursorBefore: B,
        cursorAfter: U,
        now: P
      }));
      const H = I.dirty;
      I.dirty = !0, t.emit(m, _), H || n.emit(m, !0);
    },
    markClean(m) {
      const _ = r.get(m);
      _ && _.document.dirty && (_.document.dirty = !1, n.emit(m, !1));
    },
    onContentChange(m) {
      return t.on(m);
    },
    onDirtyChange(m) {
      return n.on(m);
    },
    onSave(m) {
      return o.on(m);
    },
    onPrefsChange(m) {
      return g.on(m);
    },
    openInspector(m, _) {
      c.open(m, _);
    },
    closeInspector(m) {
      c.close(m) && h(m);
    },
    getInspectorValue(m) {
      var _;
      return ((_ = c.get(m)) == null ? void 0 : _.value) ?? null;
    },
    listInspectorInstances() {
      return c.list();
    },
    onInspectorValueChange(m) {
      return l.on(m);
    },
    openColorPicker(m, _) {
      i.open(m, _);
    },
    closeColorPicker(m) {
      i.close(m) && h(m);
    },
    getColorPickerValue(m) {
      var _;
      return ((_ = i.get(m)) == null ? void 0 : _.value) ?? null;
    },
    listColorPickerInstances() {
      return i.list();
    },
    onColorPickerValueChange(m) {
      return d.on(m);
    },
    onColorPickerPrefsChange(m) {
      return b.on(m);
    },
    history: p
  }, internals: {
    emitSave(m) {
      o.emit(m);
    },
    contentChange: t,
    dirtyChange: n,
    saveEvent: o,
    prefsChange: g,
    inspectorValueChange: l,
    colorPickerValueChange: d,
    colorPickerPrefsChange: b,
    history: p,
    inspectors: c,
    colorPickers: i
  }, teardown: () => {
    t.clear(), n.clear(), o.clear(), g.clear(), l.clear(), d.clear(), b.clear(), a.clear(), u.clear(), c.clear(), i.clear();
  } };
}
const Je = "sh3-editor.inspectorRenderer";
let xt = /* @__PURE__ */ new Map();
function ht(r) {
  const t = [...r].sort((o, g) => {
    const l = o.priority ?? 10, d = g.priority ?? 10;
    return l !== d ? d - l : 0;
  }), n = /* @__PURE__ */ new Map();
  for (const o of t)
    n.has(o.type) || n.set(o.type, o);
  xt = n;
}
function $t(r) {
  if (r === null || typeof r != "object") return !1;
  const t = Object.getPrototypeOf(r);
  return t === Object.prototype || t === null;
}
function mt(r) {
  var t;
  return ((t = xt.get(r)) == null ? void 0 : t.component) ?? null;
}
function en(r, t) {
  if (t != null && t.type) {
    const n = mt(t.type);
    if (n) return { kind: "custom", component: n };
  }
  if (r !== null && typeof r == "object" && typeof r.__type == "string") {
    const n = mt(r.__type);
    if (n) return { kind: "custom", component: n };
  }
  return $t(r) || Array.isArray(r) ? { kind: "walker" } : { kind: "leaf" };
}
let wt = null;
function bt(r) {
  wt = r;
}
function tn() {
  return wt;
}
function Y(r) {
  return r.ctrlKey || r.metaKey;
}
function nn(r, t, n, o, g = 2) {
  const l = " ".repeat(g);
  if (t === n && !o)
    return {
      content: r.slice(0, t) + l + r.slice(n),
      selectionStart: t + l.length,
      selectionEnd: t + l.length
    };
  const d = r.lastIndexOf(`
`, t - 1) + 1, b = r.slice(d, n).split(`
`);
  let a = t, c = n;
  const i = b.map((p, h) => {
    var f;
    if (o) {
      const v = ((f = p.match(new RegExp(`^ {1,${g}}`))) == null ? void 0 : f[0].length) ?? 0;
      return h === 0 && (a = Math.max(d, t - v)), c -= v, p.slice(v);
    } else
      return h === 0 && (a = t + l.length), c += l.length, l + p;
  });
  return { content: r.slice(0, d) + i.join(`
`) + r.slice(d + b.join(`
`).length), selectionStart: a, selectionEnd: c };
}
function rn(r, t, n, o, g = 2, l = "inline") {
  if (o === "none") return null;
  const d = r.lastIndexOf(`
`, t - 1) + 1, a = r.slice(d, t).match(/^[ \t]*/)[0], c = " ".repeat(g);
  if (o === "indent") {
    const v = `
` + a;
    return {
      content: r.slice(0, t) + v + r.slice(n),
      selectionStart: t + v.length,
      selectionEnd: t + v.length
    };
  }
  const i = t > 0 ? r[t - 1] : "", u = n < r.length ? r[n] : "", p = i === "{";
  if (p && u === "}") {
    if (l === "inline") {
      const S = `
` + a + c + `
` + a, M = t + 1 + a.length + c.length;
      return {
        content: r.slice(0, t) + S + r.slice(n),
        selectionStart: M,
        selectionEnd: M
      };
    }
    const v = r.slice(0, t - 1), C = r.slice(n), m = `
` + a + `{
` + a + c + `
` + a, _ = v + m + C, U = v.length + (`
` + a + `{
` + a + c).length;
    return { content: _, selectionStart: U, selectionEnd: U };
  }
  if (p) {
    const v = `
` + a + c;
    return {
      content: r.slice(0, t) + v + r.slice(n),
      selectionStart: t + v.length,
      selectionEnd: t + v.length
    };
  }
  const f = `
` + a;
  return {
    content: r.slice(0, t) + f + r.slice(n),
    selectionStart: t + f.length,
    selectionEnd: t + f.length
  };
}
function ln(r, t, n, o = 2) {
  if (t !== n) return null;
  const g = r.lastIndexOf(`
`, t - 1) + 1, l = r.slice(g, t);
  if (!/^[ \t]*$/.test(l)) return null;
  let d = 0, b = -1;
  for (let u = g - 1; u >= 0; u--) {
    const p = r[u];
    if (p === "}") d++;
    else if (p === "{") {
      if (d === 0) {
        b = u;
        break;
      }
      d--;
    }
  }
  let a;
  if (b === -1) {
    const u = Math.max(0, l.length - o);
    a = l.slice(0, u);
  } else {
    const u = r.lastIndexOf(`
`, b - 1) + 1;
    a = r.slice(u, b).match(/^[ \t]*/)[0];
  }
  if (a.length >= l.length) return null;
  const c = r.slice(0, g) + a + "}" + r.slice(n), i = g + a.length + 1;
  return { content: c, selectionStart: i, selectionEnd: i };
}
var an = e.from_html('<span class="toolbar-sep svelte-10sr5yt"></span>'), sn = e.from_html("<button><!> </button>"), on = e.from_html("<!> <!>", 1), cn = e.from_html('<div class="toolbar-spacer svelte-10sr5yt"></div> <span class="toolbar-path svelte-10sr5yt"> </span>', 1), dn = e.from_html('<div class="toolbar svelte-10sr5yt"><!> <!></div>');
function nt(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "filePath", 3, null), o = e.derived(() => {
    const b = [], a = /* @__PURE__ */ new Map();
    for (const c of t.actions) {
      const i = c.group ?? "_default";
      if (!a.has(i)) {
        const u = [];
        a.set(i, u), b.push({ key: i, items: u });
      }
      a.get(i).push(c);
    }
    return b;
  });
  var g = e.comment(), l = e.first_child(g);
  {
    var d = (b) => {
      var a = dn(), c = e.child(a);
      e.each(c, 17, () => e.get(o), e.index, (p, h, f) => {
        var v = on(), C = e.first_child(v);
        {
          var m = (U) => {
            var S = an();
            e.append(U, S);
          };
          e.if(C, (U) => {
            f > 0 && U(m);
          });
        }
        var _ = e.sibling(C, 2);
        e.each(_, 17, () => e.get(h).items, (U) => U.id, (U, S) => {
          var M = sn();
          let I;
          var E = e.child(M);
          {
            var B = (k) => {
              var P = e.text();
              e.template_effect(() => e.set_text(P, e.get(S).icon)), e.append(k, P);
            };
            e.if(E, (k) => {
              e.get(S).icon && k(B);
            });
          }
          var z = e.sibling(E, 1, !0);
          e.reset(M), e.template_effect(() => {
            I = e.set_class(M, 1, "toolbar-btn svelte-10sr5yt", null, I, { "toolbar-accent": e.get(S).accent }), M.disabled = e.get(S).disabled, e.set_attribute(M, "title", e.get(S).shortcut ? `${e.get(S).label} (${e.get(S).shortcut})` : e.get(S).label), e.set_text(z, e.get(S).label);
          }), e.delegated("click", M, function(...k) {
            var P;
            (P = e.get(S).onAction) == null || P.apply(this, k);
          }), e.append(U, M);
        }), e.append(p, v);
      });
      var i = e.sibling(c, 2);
      {
        var u = (p) => {
          var h = cn(), f = e.sibling(e.first_child(h), 2), v = e.child(f, !0);
          e.reset(f), e.template_effect(
            (C) => {
              e.set_attribute(f, "title", n()), e.set_text(v, C);
            },
            [() => n().split(/[/\\]/).pop()]
          ), e.append(p, h);
        };
        e.if(i, (p) => {
          n() && p(u);
        });
      }
      e.reset(a), e.append(b, a);
    };
    e.if(l, (b) => {
      (t.actions.length > 0 || n()) && b(d);
    });
  }
  e.append(r, g), e.pop();
}
e.delegate(["click"]);
var un = e.from_html('<div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Brace style</span> <div class="seg svelte-1etykqv"><button type="button">Inline</button> <button type="button">Allman</button></div></div>'), fn = e.from_html('<div class="body svelte-1etykqv"><h2 class="svelte-1etykqv">Editor settings</h2> <div class="rows svelte-1etykqv"><div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Indent unit</span> <div class="seg svelte-1etykqv"><button type="button">2</button> <button type="button">4</button></div></div> <!></div> <div class="actions svelte-1etykqv"><button type="button" class="secondary svelte-1etykqv">Close</button></div></div>');
function gn(r, t) {
  e.push(t, !0);
  let n = e.proxy({ ...t.prefs });
  function o(m) {
    n.indentUnit = m, t.onChange({ ...n });
  }
  function g(m) {
    n.braceStyle = m, t.onChange({ ...n });
  }
  var l = fn(), d = e.sibling(e.child(l), 2), b = e.child(d), a = e.sibling(e.child(b), 2), c = e.child(a);
  let i;
  var u = e.sibling(c, 2);
  let p;
  e.reset(a), e.reset(b);
  var h = e.sibling(b, 2);
  {
    var f = (m) => {
      var _ = un(), U = e.sibling(e.child(_), 2), S = e.child(U);
      let M;
      var I = e.sibling(S, 2);
      let E;
      e.reset(U), e.reset(_), e.template_effect(() => {
        M = e.set_class(S, 1, "svelte-1etykqv", null, M, { active: (n.braceStyle ?? "inline") === "inline" }), E = e.set_class(I, 1, "svelte-1etykqv", null, E, { active: (n.braceStyle ?? "inline") === "allman" });
      }), e.delegated("click", S, () => g("inline")), e.delegated("click", I, () => g("allman")), e.append(m, _);
    };
    e.if(h, (m) => {
      t.indentType === "brace" && m(f);
    });
  }
  e.reset(d);
  var v = e.sibling(d, 2), C = e.child(v);
  e.reset(v), e.reset(l), e.template_effect(() => {
    i = e.set_class(c, 1, "svelte-1etykqv", null, i, { active: (n.indentUnit ?? 2) === 2 }), p = e.set_class(u, 1, "svelte-1etykqv", null, p, { active: (n.indentUnit ?? 2) === 4 });
  }), e.delegated("click", c, () => o(2)), e.delegated("click", u, () => o(4)), e.delegated("click", C, function(...m) {
    var _;
    (_ = t.close) == null || _.apply(this, m);
  }), e.append(r, l), e.pop();
}
e.delegate(["click"]);
var vn = e.from_html('<div class="line-num svelte-1j4uh1h"> </div>'), hn = e.from_html('<div class="editor-container svelte-1j4uh1h"><!> <div class="editor-wrap svelte-1j4uh1h"><div class="gutter svelte-1j4uh1h"><div class="gutter-inner svelte-1j4uh1h"></div></div> <div class="editor-body svelte-1j4uh1h"><pre class="highlight-layer svelte-1j4uh1h" aria-hidden="true"></pre> <textarea class="input-layer svelte-1j4uh1h" autocapitalize="off"></textarea></div></div></div>');
function mn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "entry", 7), o = e.prop(t, "fontSize", 3, 13), g = e.prop(t, "toolbarActions", 19, () => []), l = e.derived(() => n().document), d = e.state(e.proxy(e.get(l).content)), b = e.derived(() => {
    var x, D;
    return ((x = t.matchingConfig) == null ? void 0 : x.indentType) ?? ((D = t.matchingConfig) != null && D.indentBased ? "indent" : "none");
  }), a = e.derived(() => e.get(b) === "none" ? 0 : e.get(b) === "brace" ? 2 : 1), c = e.derived(() => (t.showSettings ?? !0) && e.get(a) > 0);
  const i = 300, u = (x, D) => {
    e.set(d, x, !0), e.get(l).content = x, e.get(l).cursorStart = D, e.get(l).cursorEnd = D, t.internals.contentChange.emit(e.get(l).id, x), E(D, D);
  };
  function p() {
    kt.modal.open(gn, {
      indentType: e.get(b),
      prefs: n().prefs,
      onChange: f
    });
  }
  let h = e.derived(() => {
    if (!e.get(c)) return g();
    const x = {
      id: "sh3-editor:toolbar",
      label: "Settings",
      icon: "⚙",
      onAction: p,
      group: "_editor_builtin"
    };
    return [...g(), x];
  });
  function f(x) {
    n().prefs = { ...n().prefs, ...x }, t.internals.prefsChange.emit(n().document.id, { ...n().prefs });
  }
  e.user_effect(() => {
    e.set(d, e.get(l).content, !0);
  });
  let v = e.state(void 0), C = e.state(0), m = e.state(0), _ = e.derived(() => t.highlight && e.get(l).language ? t.highlight(e.get(d), e.get(l).language) : M(e.get(d))), U = e.derived(() => e.get(d).split(`
`).length), S = e.derived(() => Array.from({ length: e.get(U) }, (x, D) => D + 1));
  function M(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function I(x, D, N) {
    var _e, ye;
    e.set(d, x, !0);
    const R = e.get(l).id, oe = e.get(l).content;
    if (oe === x) return;
    const pe = e.get(l).cursorStart;
    e.get(l).content = x, e.get(l).cursorStart = D, e.get(l).cursorEnd = N;
    const ne = t.internals.history(R), F = Date.now(), $ = ne.peek(), re = ((_e = $ == null ? void 0 : $.meta) == null ? void 0 : _e.kind) === "text-swap" ? $.meta.snapshot : void 0, le = Math.abs(x.length - oe.length) <= 1, Be = re && ((ye = $ == null ? void 0 : $.meta) == null ? void 0 : ye.timestamp) != null && F - $.meta.timestamp < i;
    re && le && Be ? ne.replaceTop(je({
      setter: u,
      before: re.before,
      after: x,
      cursorBefore: re.cursorBefore,
      cursorAfter: D,
      now: F
    })) : ne.push(je({
      setter: u,
      before: oe,
      after: x,
      cursorBefore: pe,
      cursorAfter: D,
      now: F
    }));
    const Ve = e.get(l).dirty;
    e.get(l).dirty = !0, t.internals.contentChange.emit(R, x), Ve || t.internals.dirtyChange.emit(R, !0);
  }
  function E(x, D) {
    requestAnimationFrame(() => {
      e.get(v) && (e.get(v).selectionStart = x, e.get(v).selectionEnd = D);
    });
  }
  function B(x) {
    var D;
    if (x.key === "s" && Y(x)) {
      x.preventDefault(), t.internals.emitSave(e.get(l).id);
      return;
    }
    if (x.key.toLowerCase() === "z" && Y(x) && !x.shiftKey) {
      x.preventDefault(), t.internals.history(e.get(l).id).undo();
      return;
    }
    if (x.key.toLowerCase() === "y" && Y(x) || x.key.toLowerCase() === "z" && Y(x) && x.shiftKey) {
      x.preventDefault(), t.internals.history(e.get(l).id).redo();
      return;
    }
    if (x.key === "Enter" && !x.shiftKey && !Y(x) && !x.altKey) {
      if (e.get(b) === "none") return;
      const N = x.currentTarget, R = rn(e.get(d), N.selectionStart, N.selectionEnd, e.get(b), n().prefs.indentUnit, n().prefs.braceStyle);
      R && (x.preventDefault(), I(R.content, R.selectionStart, R.selectionEnd), E(R.selectionStart, R.selectionEnd));
      return;
    }
    if (x.key === "}" && e.get(b) === "brace" && !Y(x) && !x.altKey) {
      const N = x.currentTarget, R = ln(e.get(d), N.selectionStart, N.selectionEnd, n().prefs.indentUnit);
      if (R) {
        x.preventDefault(), I(R.content, R.selectionStart, R.selectionEnd), E(R.selectionStart, R.selectionEnd);
        return;
      }
    }
    if (x.key === "Tab") {
      x.preventDefault();
      const N = x.currentTarget, R = nn(e.get(d), N.selectionStart, N.selectionEnd, x.shiftKey, (D = t.matchingConfig) == null ? void 0 : D.indentUnit);
      R && (I(R.content, R.selectionStart, R.selectionEnd), E(R.selectionStart, R.selectionEnd));
      return;
    }
  }
  function z(x) {
    const D = x.currentTarget;
    I(D.value, D.selectionStart, D.selectionEnd);
  }
  function k(x) {
    const D = x.currentTarget;
    e.set(C, D.scrollTop, !0), e.set(m, D.scrollLeft, !0);
  }
  function P() {
    e.get(v) && (e.get(l).cursorStart = e.get(v).selectionStart, e.get(l).cursorEnd = e.get(v).selectionEnd);
  }
  var A = hn(), V = e.child(A);
  nt(V, {
    get actions() {
      return e.get(h);
    },
    get filePath() {
      return e.get(l).filePath;
    }
  });
  var q = e.sibling(V, 2);
  let J;
  var H = e.child(q), X = e.child(H);
  let ce;
  e.each(X, 20, () => e.get(S), (x) => x, (x, D) => {
    var N = vn(), R = e.child(N, !0);
    e.reset(N), e.template_effect(() => e.set_text(R, D)), e.append(x, N);
  }), e.reset(X), e.reset(H);
  var de = e.sibling(H, 2), te = e.child(de);
  let He;
  e.html(te, () => e.get(_) + `
`, !0), e.reset(te);
  var Z = e.sibling(te, 2);
  e.remove_textarea_child(Z), e.set_attribute(Z, "spellcheck", !1), e.bind_this(Z, (x) => e.set(v, x), () => e.get(v)), e.reset(de), e.reset(q), e.reset(A), e.template_effect(() => {
    J = e.set_style(q, "", J, { "--editor-font-size": `${o() ?? ""}px` }), ce = e.set_style(X, "", ce, { transform: `translateY(-${e.get(C) ?? ""}px)` }), He = e.set_style(te, "", He, {
      top: `-${e.get(C) ?? ""}px`,
      left: `-${e.get(m) ?? ""}px`
    }), e.set_value(Z, e.get(d));
  }), e.delegated("keydown", Z, B), e.delegated("input", Z, z), e.event("scroll", Z, k), e.event("select", Z, P), e.append(r, A), e.pop();
}
e.delegate(["keydown", "input"]);
function Ct(r, t, n, o) {
  return r && r(t, n) === !0 ? !0 : (o(), !1);
}
var bn = e.from_html('<div><span class="label svelte-2gtehg"> </span> <span class="value svelte-2gtehg"><!></span></div>');
function Qe(r, t) {
  let n = e.prop(t, "readonly", 3, !1);
  var o = bn();
  let g;
  var l = e.child(o), d = e.child(l, !0);
  e.reset(l);
  var b = e.sibling(l, 2), a = e.child(b);
  e.snippet(a, () => t.children), e.reset(b), e.reset(o), e.template_effect(() => {
    g = e.set_class(o, 1, "field svelte-2gtehg", null, g, { readonly: n() }), e.set_text(d, t.label);
  }), e.append(r, o);
}
var pn = e.from_html('<input type="checkbox"/>'), _n = e.from_html('<input class="primitive svelte-1o84d6l"/>');
function yn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "readonly", 3, !1), o = e.state(e.proxy(g(t.value)));
  e.user_effect(() => {
    e.set(o, g(t.value), !0);
  });
  function g(f) {
    return f === null ? "null" : f === void 0 ? "" : typeof f == "boolean" ? f ? "true" : "false" : String(f);
  }
  function l(f, v) {
    if (v === "boolean") return f === "true";
    if (v === "number") {
      const C = Number(f);
      return Number.isFinite(C) ? C : t.value;
    }
    return f;
  }
  let d = e.derived(() => typeof t.value == "number" ? "number" : typeof t.value == "boolean" ? "boolean" : "string");
  function b() {
    if (n() || !t.onCommit) return;
    const f = l(e.get(o), e.get(d));
    f !== null && f !== t.value && t.onCommit(f);
  }
  function a(f) {
    if (n() || !t.onCommit) return;
    const v = f.target.checked;
    v !== t.value && t.onCommit(v);
  }
  function c(f) {
    f.key === "Enter" ? f.currentTarget.blur() : f.key === "Escape" && (e.set(o, g(t.value), !0), f.currentTarget.blur());
  }
  var i = e.comment(), u = e.first_child(i);
  {
    var p = (f) => {
      var v = pn();
      e.remove_input_defaults(v), e.template_effect(
        (C) => {
          e.set_checked(v, C), v.disabled = n();
        },
        [() => !!t.value]
      ), e.delegated("change", v, a), e.append(f, v);
    }, h = (f) => {
      var v = _n();
      e.remove_input_defaults(v), e.template_effect(() => {
        e.set_attribute(v, "type", e.get(d) === "number" ? "number" : "text"), v.disabled = n();
      }), e.event("blur", v, b), e.delegated("keydown", v, c), e.bind_value(v, () => e.get(o), (C) => e.set(o, C)), e.append(f, v);
    };
    e.if(u, (f) => {
      e.get(d) === "boolean" ? f(p) : f(h, -1);
    });
  }
  e.append(r, i), e.pop();
}
e.delegate(["change", "keydown"]);
var kn = e.from_html('<div class="walker svelte-1xvtj10"></div>');
function xn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "basePath", 19, () => []);
  function o(c) {
    return c == null || typeof c == "string" || typeof c == "number" || typeof c == "boolean";
  }
  function g(c, i, u) {
    const p = c[i], h = {
      apply() {
        c[i] = u;
      },
      revert() {
        c[i] = p;
      },
      meta: { kind: "walker-edit", label: String(i) }
    };
    t.api.push(h), c[i] = u;
  }
  function l(c) {
    return (i) => {
      Ct(t.walkerOnCommit, [...n(), c], i, () => g(t.value, c, i));
    };
  }
  function d(c) {
    return (i) => g(t.value, c, i);
  }
  let b = e.derived(() => Array.isArray(t.value) ? t.value.map((c, i) => {
    var u;
    return { key: i, child: c, fieldMeta: (u = t.meta) == null ? void 0 : u.item };
  }) : t.value && typeof t.value == "object" ? Object.keys(t.value).map((c) => {
    var i, u;
    return {
      key: c,
      child: t.value[c],
      fieldMeta: (u = (i = t.meta) == null ? void 0 : i.fields) == null ? void 0 : u[c]
    };
  }) : []);
  var a = kn();
  e.each(a, 21, () => e.get(b), (c) => c.key, (c, i) => {
    var u = e.comment(), p = e.first_child(u);
    {
      var h = (f) => {
        const v = e.derived(() => {
          var E;
          return ((E = e.get(i).fieldMeta) == null ? void 0 : E.label) ?? (typeof e.get(i).key == "number" ? `[${e.get(i).key}]` : String(e.get(i).key));
        }), C = e.derived(() => {
          var E;
          return (((E = e.get(i).fieldMeta) == null ? void 0 : E.readonly) ?? !1) || t.api.readonly;
        });
        var m = e.comment(), _ = e.first_child(m);
        {
          var U = (E) => {
            Qe(E, {
              get label() {
                return e.get(v);
              },
              get readonly() {
                return e.get(C);
              },
              children: (B, z) => {
                {
                  let k = e.derived(() => e.get(C) ? void 0 : d(e.get(i).key)), P = e.derived(() => [...n(), e.get(i).key]);
                  et(B, {
                    get value() {
                      return e.get(i).child;
                    },
                    get meta() {
                      return e.get(i).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(k);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(P);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, S = (E) => {
            Qe(E, {
              get label() {
                return e.get(v);
              },
              get readonly() {
                return e.get(C);
              },
              children: (B, z) => {
                {
                  let k = e.derived(() => e.get(C) ? void 0 : l(e.get(i).key));
                  yn(B, {
                    get value() {
                      return e.get(i).child;
                    },
                    get readonly() {
                      return e.get(C);
                    },
                    get onCommit() {
                      return e.get(k);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, M = e.derived(() => o(e.get(i).child)), I = (E) => {
            Qe(E, {
              get label() {
                return e.get(v);
              },
              get readonly() {
                return e.get(C);
              },
              children: (B, z) => {
                {
                  let k = e.derived(() => e.get(C) ? void 0 : d(e.get(i).key)), P = e.derived(() => [...n(), e.get(i).key]);
                  et(B, {
                    get value() {
                      return e.get(i).child;
                    },
                    get meta() {
                      return e.get(i).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(k);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(P);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          };
          e.if(_, (E) => {
            var B;
            (B = e.get(i).fieldMeta) != null && B.type ? E(U) : e.get(M) ? E(S, 1) : E(I, -1);
          });
        }
        e.append(f, m);
      };
      e.if(p, (f) => {
        var v;
        (v = e.get(i).fieldMeta) != null && v.hidden || f(h);
      });
    }
    e.append(c, u);
  }), e.reset(a), e.append(r, a), e.pop();
}
var wn = e.from_html('<span class="leaf svelte-o6duey"> </span>');
function Cn(r, t) {
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
  var o = wn(), g = e.child(o, !0);
  e.reset(o), e.template_effect((l) => e.set_text(g, l), [() => n(t.value)]), e.append(r, o);
}
function et(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "basePath", 19, () => []), o = e.derived(() => en(t.value, t.meta)), g = e.derived(() => {
    const u = t.onCommit, p = t.walkerOnCommit;
    if (u !== void 0)
      return p === void 0 ? u : (h) => {
        Ct(p, n(), h, () => u(h));
      };
  });
  var l = e.comment(), d = e.first_child(l);
  {
    var b = (u) => {
    }, a = (u) => {
      const p = e.derived(() => e.get(o).component);
      var h = e.comment(), f = e.first_child(h);
      e.component(f, () => e.get(p), (v, C) => {
        C(v, {
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
            return e.get(g);
          }
        });
      }), e.append(u, h);
    }, c = (u) => {
      xn(u, {
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
    }, i = (u) => {
      Cn(u, {
        get value() {
          return t.value;
        }
      });
    };
    e.if(d, (u) => {
      var p;
      (p = t.meta) != null && p.hidden ? u(b) : e.get(o).kind === "custom" ? u(a, 1) : e.get(o).kind === "walker" ? u(c, 2) : u(i, -1);
    });
  }
  e.append(r, l), e.pop();
}
var Pn = e.from_html('<div class="inspector-container svelte-jpxkcf" tabindex="-1" role="region" aria-label="Inspector"><!> <div class="inspector-body svelte-jpxkcf"><!></div></div>');
function Sn(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "adHocReadonly", 3, !1), o = e.derived(() => t.internals.inspectors.get(t.instanceId)), g = e.derived(() => e.get(o) ? e.get(o).value : t.adHocValue), l = e.derived(() => e.get(o) ? e.get(o).meta : t.adHocMeta), d = e.derived(() => e.get(o) ? !!e.get(o).options.readonly : n()), b = e.derived(() => e.get(o) ? e.get(o).options.onCommit : void 0), a = e.derived(() => {
    var _;
    return ((_ = e.get(o)) == null ? void 0 : _.options.toolbarActions) ?? [];
  });
  const c = t.internals.history(t.instanceId), i = {
    push(_) {
      e.get(d) || (c.push(_), t.internals.inspectorValueChange.emit(t.instanceId, e.get(g)));
    },
    get readonly() {
      return e.get(d);
    },
    history: c
  };
  e.user_effect(() => {
    const _ = c.onChange(() => {
      t.internals.inspectorValueChange.emit(t.instanceId, e.get(g));
    });
    return () => _();
  });
  let u = e.state(void 0);
  function p(_) {
    if (_.key.toLowerCase() === "z" && Y(_) && !_.shiftKey) {
      _.preventDefault(), c.undo();
      return;
    }
    if (_.key.toLowerCase() === "y" && Y(_) || _.key.toLowerCase() === "z" && Y(_) && _.shiftKey) {
      _.preventDefault(), c.redo();
      return;
    }
  }
  var h = Pn(), f = e.child(h);
  {
    var v = (_) => {
      nt(_, {
        get actions() {
          return e.get(a);
        },
        filePath: null
      });
    };
    e.if(f, (_) => {
      e.get(a).length > 0 && _(v);
    });
  }
  var C = e.sibling(f, 2), m = e.child(C);
  et(m, {
    get value() {
      return e.get(g);
    },
    get meta() {
      return e.get(l);
    },
    get api() {
      return i;
    },
    get walkerOnCommit() {
      return e.get(b);
    },
    basePath: []
  }), e.reset(C), e.reset(h), e.bind_this(h, (_) => e.set(u, _), () => e.get(u)), e.delegated("keydown", h, p), e.append(r, h), e.pop();
}
e.delegate(["keydown"]);
const Ze = [
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
var En = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">H</span> <input type="range" min="0" max="360" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">S</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">V</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), In = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">R</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">G</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">B</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), Dn = e.from_html("<option> </option>"), Mn = e.from_html('<button type="button"></button>'), Tn = e.from_html('<div class="cp-save-prompt svelte-7v5dlc"><input type="text" class="cp-save-input svelte-7v5dlc" placeholder="Palette name"/> <button type="button" class="cp-palette-btn svelte-7v5dlc">OK</button> <button type="button" class="cp-palette-btn svelte-7v5dlc">Cancel</button></div>'), Un = e.from_html('<div role="group" aria-label="Color picker"><div class="cp-main svelte-7v5dlc"><div class="cp-left svelte-7v5dlc"><div class="cp-body svelte-7v5dlc"><canvas class="cp-square svelte-7v5dlc" role="slider" aria-label="Saturation and value"></canvas> <canvas class="cp-strip svelte-7v5dlc" role="slider" aria-label="Hue"></canvas></div> <div class="cp-mode svelte-7v5dlc"><button type="button">HSV</button> <button type="button">RGB</button></div> <!> <div class="cp-hex-row svelte-7v5dlc"><div class="cp-preview svelte-7v5dlc"></div> <input type="text" class="cp-hex-input svelte-7v5dlc" aria-label="Hex value"/></div></div> <div class="cp-right svelte-7v5dlc"><div class="cp-palette svelte-7v5dlc"><select class="cp-palette-select svelte-7v5dlc" aria-label="Palette"></select> <div class="cp-swatches svelte-7v5dlc"></div> <div class="cp-palette-actions svelte-7v5dlc"><button type="button" class="cp-palette-btn svelte-7v5dlc" title="Save current color to a palette">+ Save</button> <button type="button" class="cp-palette-btn cp-delete svelte-7v5dlc">Delete</button></div> <!></div></div></div></div>');
function pt(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "readonly", 3, !1), o = e.prop(t, "initialMode", 3, "hsv"), g = e.prop(t, "userPalettes", 19, () => []);
  const l = 180, d = 20, b = ie(t.value) ?? "#000000";
  let a = e.state(e.proxy(fe(b))), c = b, i = e.state(e.proxy(o()));
  e.user_effect(() => {
    const s = ie(t.value) ?? "#000000";
    s !== c && (e.set(a, fe(s), !0), c = s, e.set(D, s.toUpperCase(), !0));
  });
  function u(s) {
    const y = ie(s);
    y && y !== c && (c = y, t.onChange(y));
  }
  function p() {
    u(Pe(e.get(a)));
  }
  let h = e.state(void 0), f = e.state(void 0);
  const v = typeof window < "u" && window.devicePixelRatio || 1;
  function C() {
    if (!e.get(h)) return;
    const s = l, y = l;
    e.get(h).width = s * v, e.get(h).height = y * v, e.get(h).style.width = s + "px", e.get(h).style.height = y + "px";
    const w = e.get(h).getContext("2d"), T = w.createImageData(s * v, y * v), L = T.data;
    for (let O = 0; O < y * v; O++)
      for (let K = 0; K < s * v; K++) {
        const j = K / v / s * 100, Q = (1 - O / v / y) * 100, W = me({ h: e.get(a).h, s: j, v: Q }), ae = (O * s * v + K) * 4;
        L[ae] = W.r, L[ae + 1] = W.g, L[ae + 2] = W.b, L[ae + 3] = 255;
      }
    w.putImageData(T, 0, 0), m();
  }
  function m() {
    if (!e.get(h)) return;
    const s = e.get(h).getContext("2d"), y = e.get(a).s / 100 * l, w = (1 - e.get(a).v / 100) * l;
    s.save(), s.scale(v, v), s.beginPath(), s.arc(y, w, 6, 0, Math.PI * 2), s.strokeStyle = "#ffffff", s.lineWidth = 2, s.stroke(), s.beginPath(), s.arc(y, w, 7, 0, Math.PI * 2), s.strokeStyle = "#000000", s.lineWidth = 1, s.stroke(), s.restore();
  }
  function _() {
    if (!e.get(f)) return;
    const s = d, y = l;
    e.get(f).width = s * v, e.get(f).height = y * v, e.get(f).style.width = s + "px", e.get(f).style.height = y + "px";
    const w = e.get(f).getContext("2d"), T = w.createImageData(s * v, y * v), L = T.data;
    for (let O = 0; O < y * v; O++) {
      const K = O / (y * v) * 360, j = me({ h: K, s: 100, v: 100 });
      for (let Q = 0; Q < s * v; Q++) {
        const W = (O * s * v + Q) * 4;
        L[W] = j.r, L[W + 1] = j.g, L[W + 2] = j.b, L[W + 3] = 255;
      }
    }
    w.putImageData(T, 0, 0), U();
  }
  function U() {
    if (!e.get(f)) return;
    const s = e.get(f).getContext("2d"), y = e.get(a).h / 360 * l;
    s.save(), s.scale(v, v), s.beginPath(), s.moveTo(0, y), s.lineTo(d, y), s.strokeStyle = "#ffffff", s.lineWidth = 2, s.stroke(), s.beginPath(), s.moveTo(0, y), s.lineTo(d, y), s.strokeStyle = "#000000", s.lineWidth = 1, s.stroke(), s.restore();
  }
  Lt(() => {
    C(), _();
  });
  let S = e.state(e.proxy(e.get(a).h));
  e.user_effect(() => {
    e.get(a).h !== e.get(S) ? (e.set(S, e.get(a).h, !0), C(), _()) : C();
  });
  let M = e.state(!1), I = e.state(!1);
  function E(s) {
    if (n() || !e.get(h)) return;
    const y = e.get(h).getBoundingClientRect(), w = Math.max(0, Math.min(l, s.clientX - y.left)), T = Math.max(0, Math.min(l, s.clientY - y.top)), L = w / l * 100, O = (1 - T / l) * 100;
    e.set(a, { h: e.get(a).h, s: Math.round(L), v: Math.round(O) }, !0);
  }
  function B(s) {
    if (n() || !e.get(f)) return;
    const y = e.get(f).getBoundingClientRect(), T = Math.max(0, Math.min(l, s.clientY - y.top)) / l * 360;
    e.set(a, { h: Math.round(T), s: e.get(a).s, v: e.get(a).v }, !0);
  }
  function z(s) {
    n() || (e.set(M, !0), E(s), window.addEventListener("mousemove", P), window.addEventListener("mouseup", A));
  }
  function k(s) {
    n() || (e.set(I, !0), B(s), window.addEventListener("mousemove", P), window.addEventListener("mouseup", A));
  }
  function P(s) {
    e.get(M) ? E(s) : e.get(I) && B(s);
  }
  function A() {
    (e.get(M) || e.get(I)) && u(Pe(e.get(a))), e.set(M, !1), e.set(I, !1), window.removeEventListener("mousemove", P), window.removeEventListener("mouseup", A);
  }
  const V = "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)", q = e.derived(() => `linear-gradient(to right, #ffffff, ${be(me({ h: e.get(a).h, s: 100, v: e.get(a).v }))})`), J = e.derived(() => `linear-gradient(to right, #000000, ${be(me({ h: e.get(a).h, s: e.get(a).s, v: 100 }))})`), H = e.derived(() => me(e.get(a)));
  function X(s) {
    e.set(a, { ...e.get(a), h: +s.target.value }, !0);
  }
  function ce(s) {
    e.set(a, { ...e.get(a), s: +s.target.value }, !0);
  }
  function de(s) {
    e.set(a, { ...e.get(a), v: +s.target.value }, !0);
  }
  function te(s) {
    const y = +s.target.value;
    e.set(a, fe(be({ r: y, g: e.get(H).g, b: e.get(H).b })), !0);
  }
  function He(s) {
    const y = +s.target.value;
    e.set(a, fe(be({ r: e.get(H).r, g: y, b: e.get(H).b })), !0);
  }
  function Z(s) {
    const y = +s.target.value;
    e.set(a, fe(be({ r: e.get(H).r, g: e.get(H).g, b: y })), !0);
  }
  function x(s) {
    var y;
    e.get(i) !== s && (e.set(i, s, !0), (y = t.onModeChange) == null || y.call(t, s));
  }
  let D = e.state(e.proxy(b.toUpperCase()));
  e.user_effect(() => {
    e.set(D, Pe(e.get(a)).toUpperCase(), !0);
  });
  function N() {
    if (n()) return;
    const s = e.get(D).trim(), y = ie(s);
    if (!y) {
      e.set(D, Pe(e.get(a)).toUpperCase(), !0);
      return;
    }
    e.set(a, fe(y), !0), u(y);
  }
  function R(s) {
    s.key === "Enter" && (s.preventDefault(), s.currentTarget.blur());
  }
  const oe = e.derived(() => Pe(e.get(a))), pe = e.derived(() => [...Ze, ...g()]);
  let ne = e.state(e.proxy(Ze[0].id));
  const F = e.derived(() => e.get(pe).find((s) => s.id === e.get(ne)) ?? e.get(pe)[0]);
  function $(s) {
    if (n()) return;
    const y = ie(s);
    y && (e.set(a, fe(y), !0), u(y));
  }
  let re = e.state(!1), le = e.state("");
  function Be() {
    return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "u-" + Math.random().toString(36).slice(2, 10);
  }
  function Ve() {
    var y, w;
    if (n()) return;
    if ((y = e.get(F)) != null && y.builtin) {
      e.set(le, ""), e.set(re, !0);
      return;
    }
    if (!e.get(F)) return;
    const s = {
      ...e.get(F),
      colors: [...e.get(F).colors, e.get(oe)]
    };
    (w = t.onSaveUserPalette) == null || w.call(t, s);
  }
  function _e() {
    var w;
    if (n()) return;
    const s = e.get(le).trim();
    if (!s) return;
    const y = { id: "user-" + Be(), label: s, colors: [e.get(oe)] };
    (w = t.onSaveUserPalette) == null || w.call(t, y), e.set(ne, y.id, !0), e.set(re, !1), e.set(le, "");
  }
  function ye() {
    e.set(re, !1), e.set(le, "");
  }
  function St() {
    var y;
    if (n() || !e.get(F) || e.get(F).builtin) return;
    const s = e.get(F).id;
    (y = t.onDeleteUserPalette) == null || y.call(t, s), e.set(ne, Ze[0].id, !0);
  }
  function Et(s) {
    const y = s.target, w = s.shiftKey ? 10 : 1;
    if (y === e.get(h)) {
      if (s.key === "ArrowLeft") {
        s.preventDefault(), e.set(a, { ...e.get(a), s: Math.max(0, e.get(a).s - w) }, !0), p();
        return;
      }
      if (s.key === "ArrowRight") {
        s.preventDefault(), e.set(a, { ...e.get(a), s: Math.min(100, e.get(a).s + w) }, !0), p();
        return;
      }
      if (s.key === "ArrowUp") {
        s.preventDefault(), e.set(a, { ...e.get(a), v: Math.min(100, e.get(a).v + w) }, !0), p();
        return;
      }
      if (s.key === "ArrowDown") {
        s.preventDefault(), e.set(a, { ...e.get(a), v: Math.max(0, e.get(a).v - w) }, !0), p();
        return;
      }
    } else if (y === e.get(f)) {
      if (s.key === "ArrowUp") {
        s.preventDefault(), e.set(a, { ...e.get(a), h: Math.max(0, e.get(a).h - w) }, !0), p();
        return;
      }
      if (s.key === "ArrowDown") {
        s.preventDefault(), e.set(a, { ...e.get(a), h: Math.min(360, e.get(a).h + w) }, !0), p();
        return;
      }
    }
  }
  var ke = Un();
  let rt;
  var lt = e.child(ke), qe = e.child(lt), Ne = e.child(qe), ue = e.child(Ne);
  e.set_attribute(ue, "aria-valuemin", 0), e.set_attribute(ue, "aria-valuemax", 100), e.bind_this(ue, (s) => e.set(h, s), () => e.get(h));
  var he = e.sibling(ue, 2);
  e.set_attribute(he, "aria-valuemin", 0), e.set_attribute(he, "aria-valuemax", 360), e.bind_this(he, (s) => e.set(f, s), () => e.get(f)), e.reset(Ne);
  var Ke = e.sibling(Ne, 2), Re = e.child(Ke);
  let at;
  var ze = e.sibling(Re, 2);
  let st;
  e.reset(Ke);
  var it = e.sibling(Ke, 2);
  {
    var It = (s) => {
      var y = En(), w = e.child(y), T = e.sibling(e.child(w), 2);
      e.remove_input_defaults(T), e.set_style(T, "", {}, { "--track-bg": V });
      var L = e.sibling(T, 2), O = e.child(L);
      e.reset(L), e.reset(w);
      var K = e.sibling(w, 2), j = e.sibling(e.child(K), 2);
      e.remove_input_defaults(j);
      let Q;
      var W = e.sibling(j, 2), ae = e.child(W);
      e.reset(W), e.reset(K);
      var se = e.sibling(K, 2), ee = e.sibling(e.child(se), 2);
      e.remove_input_defaults(ee);
      let Ae;
      var gt = e.sibling(ee, 2), Ut = e.child(gt);
      e.reset(gt), e.reset(se), e.reset(y), e.template_effect(() => {
        e.set_value(T, e.get(a).h), T.disabled = n(), e.set_text(O, `${e.get(a).h ?? ""}°`), e.set_value(j, e.get(a).s), j.disabled = n(), Q = e.set_style(j, "", Q, { "--track-bg": e.get(q) }), e.set_text(ae, `${e.get(a).s ?? ""}%`), e.set_value(ee, e.get(a).v), ee.disabled = n(), Ae = e.set_style(ee, "", Ae, { "--track-bg": e.get(J) }), e.set_text(Ut, `${e.get(a).v ?? ""}%`);
      }), e.delegated("input", T, X), e.delegated("change", T, p), e.delegated("input", j, ce), e.delegated("change", j, p), e.delegated("input", ee, de), e.delegated("change", ee, p), e.append(s, y);
    }, Dt = (s) => {
      var y = In(), w = e.child(y), T = e.sibling(e.child(w), 2);
      e.remove_input_defaults(T);
      var L = e.sibling(T, 2), O = e.child(L, !0);
      e.reset(L), e.reset(w);
      var K = e.sibling(w, 2), j = e.sibling(e.child(K), 2);
      e.remove_input_defaults(j);
      var Q = e.sibling(j, 2), W = e.child(Q, !0);
      e.reset(Q), e.reset(K);
      var ae = e.sibling(K, 2), se = e.sibling(e.child(ae), 2);
      e.remove_input_defaults(se);
      var ee = e.sibling(se, 2), Ae = e.child(ee, !0);
      e.reset(ee), e.reset(ae), e.reset(y), e.template_effect(() => {
        e.set_value(T, e.get(H).r), T.disabled = n(), e.set_text(O, e.get(H).r), e.set_value(j, e.get(H).g), j.disabled = n(), e.set_text(W, e.get(H).g), e.set_value(se, e.get(H).b), se.disabled = n(), e.set_text(Ae, e.get(H).b);
      }), e.delegated("input", T, te), e.delegated("change", T, p), e.delegated("input", j, He), e.delegated("change", j, p), e.delegated("input", se, Z), e.delegated("change", se, p), e.append(s, y);
    };
    e.if(it, (s) => {
      e.get(i) === "hsv" ? s(It) : s(Dt, -1);
    });
  }
  var ot = e.sibling(it, 2), ct = e.child(ot);
  let dt;
  var xe = e.sibling(ct, 2);
  e.remove_input_defaults(xe), e.reset(ot), e.reset(qe);
  var ut = e.sibling(qe, 2), ft = e.child(ut), we = e.child(ft);
  e.each(we, 21, () => e.get(pe), (s) => s.id, (s, y) => {
    var w = Dn(), T = e.child(w);
    e.reset(w);
    var L = {};
    e.template_effect(() => {
      e.set_text(T, `${e.get(y).label ?? ""}${e.get(y).builtin ? "" : " (user)"}`), L !== (L = e.get(y).id) && (w.value = (w.__value = e.get(y).id) ?? "");
    }), e.append(s, w);
  }), e.reset(we);
  var Fe = e.sibling(we, 2);
  e.each(Fe, 21, () => {
    var s;
    return ((s = e.get(F)) == null ? void 0 : s.colors) ?? [];
  }, e.index, (s, y) => {
    var w = Mn();
    let T, L;
    e.template_effect(
      (O, K, j) => {
        T = e.set_class(w, 1, "cp-swatch svelte-7v5dlc", null, T, O), e.set_attribute(w, "title", K), e.set_attribute(w, "aria-label", j), w.disabled = n(), L = e.set_style(w, "", L, { "background-color": e.get(y) });
      },
      [
        () => ({
          active: e.get(y).toLowerCase() === e.get(oe).toLowerCase()
        }),
        () => e.get(y).toUpperCase(),
        () => e.get(y).toUpperCase()
      ]
    ), e.delegated("click", w, () => $(e.get(y))), e.append(s, w);
  }), e.reset(Fe);
  var We = e.sibling(Fe, 2), Ge = e.child(We), Xe = e.sibling(Ge, 2);
  e.reset(We);
  var Mt = e.sibling(We, 2);
  {
    var Tt = (s) => {
      var y = Tn(), w = e.child(y);
      e.remove_input_defaults(w);
      var T = e.sibling(w, 2), L = e.sibling(T, 2);
      e.reset(y), e.template_effect((O) => T.disabled = O, [() => !e.get(le).trim()]), e.delegated("keydown", w, (O) => {
        O.key === "Enter" && _e(), O.key === "Escape" && ye();
      }), e.bind_value(w, () => e.get(le), (O) => e.set(le, O)), e.delegated("click", T, _e), e.delegated("click", L, ye), e.append(s, y);
    };
    e.if(Mt, (s) => {
      e.get(re) && s(Tt);
    });
  }
  e.reset(ft), e.reset(ut), e.reset(lt), e.reset(ke), e.template_effect(() => {
    var s, y;
    rt = e.set_class(ke, 1, "cp-surface svelte-7v5dlc", null, rt, { disabled: n() }), e.set_attribute(ue, "aria-valuenow", e.get(a).v), e.set_attribute(ue, "tabindex", n() ? -1 : 0), e.set_attribute(he, "aria-valuenow", e.get(a).h), e.set_attribute(he, "tabindex", n() ? -1 : 0), Re.disabled = n(), at = e.set_class(Re, 1, "svelte-7v5dlc", null, at, { active: e.get(i) === "hsv" }), ze.disabled = n(), st = e.set_class(ze, 1, "svelte-7v5dlc", null, st, { active: e.get(i) === "rgb" }), dt = e.set_style(ct, "", dt, { "background-color": e.get(oe) }), xe.disabled = n(), we.disabled = n(), Ge.disabled = n(), Xe.disabled = n() || (((s = e.get(F)) == null ? void 0 : s.builtin) ?? !0), e.set_attribute(Xe, "title", (y = e.get(F)) != null && y.builtin ? "Built-in palettes cannot be deleted" : "Delete palette");
  }), e.delegated("keydown", ke, Et), e.delegated("mousedown", ue, z), e.delegated("mousedown", he, k), e.delegated("click", Re, () => x("hsv")), e.delegated("click", ze, () => x("rgb")), e.event("blur", xe, N), e.delegated("keydown", xe, R), e.bind_value(xe, () => e.get(D), (s) => e.set(D, s)), e.bind_select_value(we, () => e.get(ne), (s) => e.set(ne, s)), e.delegated("click", Ge, Ve), e.delegated("click", Xe, St), e.append(r, ke), e.pop();
}
e.delegate(["keydown", "mousedown", "click", "input", "change"]);
var Hn = e.from_html('<div role="region" aria-label="Color picker"><div class="cp-compact-row svelte-f5c5rv"><div class="cp-preview cp-compact-preview svelte-f5c5rv" role="button" aria-label="Open full color picker" aria-haspopup="true"></div> <input type="text" class="cp-hex-input cp-compact-hex svelte-f5c5rv" aria-label="Hex value"/></div></div>'), Rn = e.from_html('<div tabindex="-1" role="region" aria-label="Color picker"><!> <!></div>');
function Pt(r, t) {
  e.push(t, !0);
  let n = e.prop(t, "adHocReadonly", 3, !1), o = e.prop(t, "userPalettes", 19, () => []), g = e.prop(t, "prefs", 19, () => ({ mode: "hsv" })), l = e.prop(t, "compact", 3, !1), d = e.derived(() => t.internals.colorPickers.get(t.instanceId)), b = e.derived(() => {
    var k;
    return ((k = e.get(d)) == null ? void 0 : k.options.toolbarActions) ?? [];
  }), a = e.derived(() => e.get(d) ? e.get(d).value : ie(t.adHocValue ?? "") ?? "#000000"), c = e.derived(() => e.get(d) ? !!e.get(d).options.readonly : n());
  const i = t.internals.history(t.instanceId);
  function u(k) {
    if (e.get(c)) return;
    const P = ie(k);
    if (!P) return;
    if (t.onExternalCommit) {
      t.onExternalCommit(P);
      return;
    }
    const A = e.get(a);
    if (A === P) return;
    const V = (q) => {
      e.get(d) && (e.get(d).value = q);
    };
    i.push({
      apply: () => V(P),
      revert: () => V(A),
      meta: { kind: "color", timestamp: Date.now() }
    }), V(P), t.internals.colorPickerValueChange.emit(t.instanceId, P);
  }
  e.user_effect(() => {
    const k = i.onChange(() => {
      t.internals.colorPickerValueChange.emit(t.instanceId, e.get(a));
    });
    return () => k();
  });
  function p(k) {
    t.internals.colorPickerPrefsChange.emit(t.instanceId, { mode: k });
  }
  const h = e.derived(() => /^#[0-9a-f]{6}$/i.test(e.get(a)) ? e.get(a).toUpperCase() : e.get(a));
  let f = e.state(e.proxy(e.get(h)));
  e.user_effect(() => {
    e.set(f, e.get(h), !0);
  });
  function v() {
    if (e.get(c)) return;
    const k = ie(e.get(f).trim());
    if (!k) {
      e.set(f, e.get(h), !0);
      return;
    }
    u(k);
  }
  function C(k) {
    k.key === "Enter" && (k.preventDefault(), k.currentTarget.blur());
  }
  let m = e.state(void 0);
  function _() {
    e.get(c) || !e.get(m) || kt.popup.show(pt, { anchor: e.get(m) }, {
      value: e.get(a),
      readonly: e.get(c),
      initialMode: g().mode,
      userPalettes: o(),
      onChange: (k) => u(k),
      onModeChange: p,
      onSaveUserPalette: t.onSaveUserPalette,
      onDeleteUserPalette: t.onDeleteUserPalette
    });
  }
  function U(k) {
    (k.key === "Enter" || k.key === " ") && (k.preventDefault(), _());
  }
  let S = e.state(void 0);
  function M(k) {
    if (k.key.toLowerCase() === "z" && Y(k) && !k.shiftKey) {
      k.preventDefault(), i.undo();
      return;
    }
    if (k.key.toLowerCase() === "y" && Y(k) || k.key.toLowerCase() === "z" && Y(k) && k.shiftKey) {
      k.preventDefault(), i.redo();
      return;
    }
  }
  var I = e.comment(), E = e.first_child(I);
  {
    var B = (k) => {
      var P = Hn();
      let A;
      var V = e.child(P), q = e.child(V);
      let J;
      e.bind_this(q, (X) => e.set(m, X), () => e.get(m));
      var H = e.sibling(q, 2);
      e.remove_input_defaults(H), e.reset(V), e.reset(P), e.template_effect(() => {
        A = e.set_class(P, 1, "cp-compact svelte-f5c5rv", null, A, { disabled: e.get(c) }), e.set_attribute(q, "tabindex", e.get(c) ? -1 : 0), J = e.set_style(q, "", J, { "background-color": e.get(a) }), H.disabled = e.get(c);
      }), e.delegated("click", q, _), e.delegated("keydown", q, U), e.event("blur", H, v), e.delegated("keydown", H, C), e.bind_value(H, () => e.get(f), (X) => e.set(f, X)), e.append(k, P);
    }, z = (k) => {
      var P = Rn();
      let A;
      var V = e.child(P);
      {
        var q = (H) => {
          nt(H, {
            get actions() {
              return e.get(b);
            },
            filePath: null
          });
        };
        e.if(V, (H) => {
          e.get(b).length > 0 && H(q);
        });
      }
      var J = e.sibling(V, 2);
      pt(J, {
        get value() {
          return e.get(a);
        },
        get readonly() {
          return e.get(c);
        },
        get initialMode() {
          return g().mode;
        },
        get userPalettes() {
          return o();
        },
        onChange: u,
        onModeChange: p,
        get onSaveUserPalette() {
          return t.onSaveUserPalette;
        },
        get onDeleteUserPalette() {
          return t.onDeleteUserPalette;
        }
      }), e.reset(P), e.bind_this(P, (H) => e.set(S, H), () => e.get(S)), e.template_effect(() => A = e.set_class(P, 1, "cp svelte-f5c5rv", null, A, { disabled: e.get(c) })), e.delegated("keydown", P, M), e.append(k, P);
    };
    e.if(E, (k) => {
      l() ? k(B) : k(z, -1);
    });
  }
  e.append(r, I), e.pop();
}
e.delegate(["click", "keydown"]);
var An = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>'), Ln = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>');
function On(r, t) {
  e.push(t, !0);
  const n = tn();
  let o = e.derived(() => typeof t.value == "string" ? t.value : null);
  var g = e.comment(), l = e.first_child(g);
  {
    var d = (c) => {
      var i = An(), u = e.child(i, !0);
      e.reset(i), e.template_effect((p) => e.set_text(u, p), [() => String(t.value)]), e.append(c, i);
    }, b = (c) => {
      var i = Ln(), u = e.child(i, !0);
      e.reset(i), e.template_effect(() => e.set_text(u, e.get(o))), e.append(c, i);
    }, a = (c) => {
      Pt(c, {
        instanceId: "inspector-color",
        get internals() {
          return n.internals;
        },
        compact: !0,
        get adHocValue() {
          return e.get(o);
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
        onExternalCommit: (i) => {
          var u;
          return (u = t.onCommit) == null ? void 0 : u.call(t, i);
        }
      });
    };
    e.if(l, (c) => {
      e.get(o) === null ? c(d) : n ? c(a, -1) : c(b, 1);
    });
  }
  e.append(r, g), e.pop();
}
const $e = "sh3-editor.settings";
function _t(r, t, n, o) {
  const g = { ...r[t] ?? {} };
  return o === void 0 ? delete g[n] : g[n] = o, { ...r, [t]: g };
}
function jn(r, t) {
  const n = Object.keys(r);
  if (n.length === 0) return r;
  const o = new Set(t);
  let g = !1;
  for (const d of n)
    if (!o.has(d)) {
      g = !0;
      break;
    }
  if (!g) return r;
  const l = {};
  for (const d of n)
    o.has(d) && (l[d] = r[d]);
  return l;
}
var Bn = e.from_html('<h3 class="section-label svelte-18qjjuf"> </h3>'), Vn = e.from_html('<section class="section svelte-18qjjuf"><!> <div class="rows svelte-18qjjuf"><!></div></section>');
function qn(r, t) {
  var n = Vn(), o = e.child(n);
  {
    var g = (b) => {
      var a = Bn(), c = e.child(a, !0);
      e.reset(a), e.template_effect(() => e.set_text(c, t.label)), e.append(b, a);
    };
    e.if(o, (b) => {
      t.showHeader && b(g);
    });
  }
  var l = e.sibling(o, 2), d = e.child(l);
  e.snippet(d, () => t.children), e.reset(l), e.reset(n), e.append(r, n);
}
var Nn = e.from_html('<div class="desc svelte-1rh69ln"> </div>'), Kn = e.from_html('<div class="error svelte-1rh69ln"> </div>'), zn = e.from_html('<div><div class="label-col"><div class="label svelte-1rh69ln"> </div> <!></div> <div class="control svelte-1rh69ln"><!></div> <!></div>');
function Ue(r, t) {
  let n = e.prop(t, "disabled", 3, !1);
  var o = zn();
  let g;
  var l = e.child(o), d = e.child(l), b = e.child(d, !0);
  e.reset(d);
  var a = e.sibling(d, 2);
  {
    var c = (f) => {
      var v = Nn(), C = e.child(v, !0);
      e.reset(v), e.template_effect(() => e.set_text(C, t.description)), e.append(f, v);
    };
    e.if(a, (f) => {
      t.description && f(c);
    });
  }
  e.reset(l);
  var i = e.sibling(l, 2), u = e.child(i);
  e.snippet(u, () => t.children), e.reset(i);
  var p = e.sibling(i, 2);
  {
    var h = (f) => {
      var v = Kn(), C = e.child(v, !0);
      e.reset(v), e.template_effect(() => e.set_text(C, t.error)), e.append(f, v);
    };
    e.if(p, (f) => {
      t.error && f(h);
    });
  }
  e.reset(o), e.template_effect(() => {
    g = e.set_class(o, 1, "row svelte-1rh69ln", null, g, { disabled: n() }), e.set_text(b, t.label);
  }), e.append(r, o);
}
var Fn = e.from_html('<button type="button"><span class="knob svelte-ert2i6"></span></button>');
function Wn(r, t) {
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
    children: (o, g) => {
      var l = Fn();
      let d;
      e.template_effect(() => {
        d = e.set_class(l, 1, "toggle svelte-ert2i6", null, d, { on: e.get(n) }), l.disabled = t.field.disabled, e.set_attribute(l, "aria-pressed", e.get(n)), e.set_attribute(l, "aria-label", t.field.label);
      }), e.delegated("click", l, () => t.onEdit(!e.get(n))), e.append(o, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
var Gn = e.from_html('<input type="text"/>');
function Xn(r, t) {
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
    children: (o, g) => {
      var l = Gn();
      e.remove_input_defaults(l);
      let d;
      e.template_effect(() => {
        d = e.set_class(l, 1, "input svelte-1jljyjf", null, d, { error: !!t.error }), e.set_attribute(l, "placeholder", t.field.placeholder ?? ""), l.disabled = t.field.disabled, e.set_value(l, e.get(n));
      }), e.delegated("change", l, (b) => t.onEdit(b.currentTarget.value)), e.append(o, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var Yn = e.from_html('<span class="unit svelte-1be7g0v"> </span>'), Jn = e.from_html('<input type="number"/> <!>', 1);
function Qn(r, t) {
  e.push(t, !0);
  const n = e.derived(() => typeof t.value == "number" ? String(t.value) : "");
  function o(g) {
    const l = g.currentTarget.value, d = Number(l);
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
    children: (g, l) => {
      var d = Jn(), b = e.first_child(d);
      e.remove_input_defaults(b);
      let a;
      var c = e.sibling(b, 2);
      {
        var i = (u) => {
          var p = Yn(), h = e.child(p, !0);
          e.reset(p), e.template_effect(() => e.set_text(h, t.field.unit)), e.append(u, p);
        };
        e.if(c, (u) => {
          t.field.unit && u(i);
        });
      }
      e.template_effect(() => {
        a = e.set_class(b, 1, "input svelte-1be7g0v", null, a, { error: !!t.error }), e.set_attribute(b, "min", t.field.min), e.set_attribute(b, "max", t.field.max), e.set_attribute(b, "step", t.field.step ?? 1), b.disabled = t.field.disabled, e.set_value(b, e.get(n));
      }), e.delegated("change", b, o), e.append(g, d);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var Zn = e.from_html('<input type="range"/> <span class="value svelte-1jyn88"> </span>', 1);
function $n(r, t) {
  e.push(t, !0);
  const n = e.derived(() => o(typeof t.value == "number" ? t.value : t.field.min, t.field.min, t.field.max));
  function o(l, d, b) {
    return Math.min(b, Math.max(d, l));
  }
  function g(l) {
    const d = Number(l.currentTarget.value);
    Number.isNaN(d) || t.onEdit(o(d, t.field.min, t.field.max));
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
      var b = Zn(), a = e.first_child(b);
      e.remove_input_defaults(a);
      let c;
      var i = e.sibling(a, 2), u = e.child(i);
      e.reset(i), e.template_effect(() => {
        c = e.set_class(a, 1, "slider svelte-1jyn88", null, c, { error: !!t.error }), e.set_attribute(a, "min", t.field.min), e.set_attribute(a, "max", t.field.max), e.set_attribute(a, "step", t.field.step ?? 1), a.disabled = t.field.disabled, e.set_value(a, e.get(n)), e.set_text(u, `${e.get(n) ?? ""}${t.field.unit ? ` ${t.field.unit}` : ""}`);
      }), e.delegated("input", a, g), e.append(l, b);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["input"]);
var er = e.from_html('<button type="button"> </button>'), tr = e.from_html("<div></div>");
function nr(r, t) {
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
    children: (o, g) => {
      var l = tr();
      let d;
      e.each(l, 21, () => t.field.options, (b) => b.value, (b, a) => {
        var c = er();
        let i;
        var u = e.child(c, !0);
        e.reset(c), e.template_effect(() => {
          c.disabled = t.field.disabled, i = e.set_class(c, 1, "svelte-iu603z", null, i, { active: e.get(n) === e.get(a).value }), e.set_text(u, e.get(a).label);
        }), e.delegated("click", c, () => t.onEdit(e.get(a).value)), e.append(b, c);
      }), e.reset(l), e.template_effect(() => d = e.set_class(l, 1, "seg svelte-iu603z", null, d, { error: !!t.error })), e.append(o, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
const rr = {
  boolean: Wn,
  string: Xn,
  number: Qn,
  "number-range": $n,
  enum: nr
};
var lr = e.from_html('<p class="empty svelte-mrn94a">No settings available.</p>'), ar = e.from_html('<div class="settings svelte-mrn94a"><h2 class="title svelte-mrn94a">Settings</h2> <!></div>');
function sr(r, t) {
  e.push(t, !0);
  let n = e.state(e.proxy(t.ctx.contributions.list($e))), o = e.state(e.proxy({})), g = e.state(e.proxy({}));
  e.user_effect(() => t.ctx.contributions.onChange($e, () => {
    e.set(n, t.ctx.contributions.list($e), !0);
  })), e.user_effect(() => {
    var p;
    const i = [], u = {};
    for (const h of e.get(n)) {
      u[h.shardId] = h.getValues();
      const f = (p = h.subscribe) == null ? void 0 : p.call(h, () => {
        e.set(o, { ...e.get(o), [h.shardId]: h.getValues() }, !0);
      });
      f && i.push(f);
    }
    return e.set(o, u, !0), e.set(g, jn(e.get(g), e.get(n).map((h) => h.shardId)), !0), () => i.forEach((h) => h());
  });
  async function l(i, u, p) {
    try {
      await i.onEdit(u, p), e.set(g, _t(e.get(g), i.shardId, u, void 0), !0);
    } catch (h) {
      e.set(g, _t(e.get(g), i.shardId, u, h.message || "Invalid value"), !0);
    } finally {
      e.set(o, { ...e.get(o), [i.shardId]: i.getValues() }, !0);
    }
  }
  var d = ar(), b = e.sibling(e.child(d), 2);
  {
    var a = (i) => {
      var u = lr();
      e.append(i, u);
    }, c = (i) => {
      var u = e.comment(), p = e.first_child(u);
      e.each(p, 17, () => e.get(n), (h) => h.shardId, (h, f) => {
        {
          let v = e.derived(() => e.get(n).length > 1);
          qn(h, {
            get label() {
              return e.get(f).label;
            },
            get showHeader() {
              return e.get(v);
            },
            children: (C, m) => {
              var _ = e.comment(), U = e.first_child(_);
              e.each(U, 17, () => e.get(f).schema, (S) => S.key, (S, M) => {
                var I = e.comment(), E = e.first_child(I);
                {
                  let B = e.derived(() => {
                    var k;
                    return (k = e.get(o)[e.get(f).shardId]) == null ? void 0 : k[e.get(M).key];
                  }), z = e.derived(() => {
                    var k;
                    return (k = e.get(g)[e.get(f).shardId]) == null ? void 0 : k[e.get(M).key];
                  });
                  e.component(E, () => rr[e.get(M).type], (k, P) => {
                    P(k, {
                      get field() {
                        return e.get(M);
                      },
                      get value() {
                        return e.get(B);
                      },
                      get error() {
                        return e.get(z);
                      },
                      onEdit: (A) => l(e.get(f), e.get(M).key, A)
                    });
                  });
                }
                e.append(S, I);
              }), e.append(C, _);
            }
          });
        }
      }), e.append(i, u);
    };
    e.if(b, (i) => {
      e.get(n).length === 0 ? i(a) : i(c, -1);
    });
  }
  e.reset(d), e.append(r, d), e.pop();
}
let ve = null, tt = null, Se = null, Ee = null, Ie = null, De = null;
function ur() {
  return tt;
}
const yt = {
  manifest: {
    id: "sh3-editor",
    label: "Editor",
    views: [
      { id: "sh3-editor:editor", label: "Editor", standalone: !0 },
      { id: "sh3-editor:inspector", label: "Inspector", standalone: !0 },
      { id: "sh3-editor:color-picker", label: "Color Picker", standalone: !0 },
      { id: "sh3-editor:settings", label: "Settings", standalone: !0 }
    ]
  },
  activate(r) {
    ve = new Vt();
    const { api: t, internals: n, teardown: o } = Zt(ve);
    tt = t, Se = n, Ee = o, yt.api = t;
    const g = () => {
      ht(r.contributions.list(Je));
    };
    g(), Ie = r.contributions.onChange(Je, g);
    const l = r.state({
      user: { colorPickerPalettes: [] }
    });
    function d(i) {
      const u = l.user.colorPickerPalettes, p = u.findIndex((h) => h.id === i.id);
      p === -1 ? u.push(i) : u[p] = i;
    }
    function b(i) {
      const u = l.user.colorPickerPalettes, p = u.findIndex((h) => h.id === i);
      p !== -1 && u.splice(p, 1);
    }
    bt({
      internals: n,
      userPalettes: l.user.colorPickerPalettes,
      onSaveUserPalette: d,
      onDeleteUserPalette: b
    });
    const a = {
      id: "sh3-editor:color",
      type: "color",
      component: On,
      priority: 10
    };
    De = r.contributions.register(Je, a);
    const c = {};
    r.registerView("sh3-editor:editor", {
      mount(i, u) {
        const p = u.slotId, h = ve.get(p), f = (h == null ? void 0 : h.options) || c, v = Le(mn, {
          target: i,
          props: {
            entry: h,
            internals: Se,
            highlight: f.highlight,
            matchingConfig: f.matchingConfig,
            fontSize: f.fontSize,
            toolbarActions: f.toolbarActions,
            showSettings: f.showSettings
          }
        });
        return {
          closable: !0,
          unmount() {
            Oe(v);
          }
        };
      }
    }), r.registerView("sh3-editor:inspector", {
      mount(i, u) {
        const p = u.slotId, h = u.meta, f = Le(Sn, {
          target: i,
          props: {
            instanceId: p,
            adHocValue: h == null ? void 0 : h.value,
            adHocMeta: h == null ? void 0 : h.meta,
            adHocReadonly: (h == null ? void 0 : h.readonly) ?? !1,
            internals: Se
          }
        });
        return {
          closable: !0,
          unmount() {
            Oe(f);
          }
        };
      }
    }), r.registerView("sh3-editor:color-picker", {
      mount(i, u) {
        const p = u.slotId, h = n.colorPickers.get(p), f = u.meta, v = Le(Pt, {
          target: i,
          props: {
            instanceId: p,
            adHocValue: f == null ? void 0 : f.value,
            adHocReadonly: (f == null ? void 0 : f.readonly) ?? !1,
            internals: Se,
            prefs: (h == null ? void 0 : h.options.prefs) ?? { mode: "hsv" },
            compact: (h == null ? void 0 : h.options.compact) ?? !1,
            userPalettes: l.user.colorPickerPalettes,
            onSaveUserPalette: d,
            onDeleteUserPalette: b
          }
        });
        return {
          closable: !0,
          unmount() {
            Oe(v);
          }
        };
      }
    }), r.registerView("sh3-editor:settings", {
      mount(i) {
        const u = Le(sr, {
          target: i,
          props: { ctx: r }
        });
        return {
          closable: !0,
          unmount() {
            Oe(u);
          }
        };
      }
    });
  },
  deactivate() {
    De == null || De(), De = null, bt(null), Ie == null || Ie(), Ie = null, Ee == null || Ee(), ve == null || ve.clear(), ht([]), ve = null, tt = null, Se = null, Ee = null, yt.api = null;
  }
};
export {
  ur as getApi,
  yt as shard
};
