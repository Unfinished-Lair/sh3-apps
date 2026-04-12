/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".body.svelte-vo8k5v{padding:var(--shell-pad-lg);display:flex;flex-direction:column;gap:var(--shell-pad-md)}h2.svelte-vo8k5v{margin:0;font-size:16px;color:var(--shell-fg)}p.svelte-vo8k5v{margin:0;color:var(--shell-fg-muted);font-size:13px;line-height:1.5}kbd.svelte-vo8k5v{font-family:var(--shell-font-mono);font-size:11px;padding:1px 4px;border:1px solid var(--shell-border-strong);border-radius:2px;background:var(--shell-bg-sunken)}.row.svelte-vo8k5v{display:flex;gap:var(--shell-pad-sm)}button.svelte-vo8k5v{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:3px;cursor:pointer}button.svelte-vo8k5v:hover{background:var(--shell-accent)}button.secondary.svelte-vo8k5v{background:transparent}button.secondary.svelte-vo8k5v:hover{background:var(--shell-bg-sunken)}.menu.svelte-1oeec1a{list-style:none;margin:0;padding:4px;display:flex;flex-direction:column;min-width:160px}.menu.svelte-1oeec1a button:where(.svelte-1oeec1a){width:100%;text-align:left;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:transparent;color:var(--shell-fg);border:none;font:inherit;font-size:12px;padding:4px 8px;border-radius:2px;cursor:pointer}.menu.svelte-1oeec1a button:where(.svelte-1oeec1a):hover{background:var(--shell-accent-muted)}.mock-panel.svelte-32yf5q{display:flex;flex-direction:column;width:100%;height:100%;background:var(--shell-bg);color:var(--shell-fg);font-family:var(--shell-font-ui)}.mock-header.svelte-32yf5q{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-bg-elevated);border-bottom:1px solid var(--shell-border);font-size:11px}.mock-title.svelte-32yf5q{color:var(--shell-accent);font-family:var(--shell-font-mono)}.mock-slot-id.svelte-32yf5q{color:var(--shell-fg-muted);font-family:var(--shell-font-mono)}.mock-body.svelte-32yf5q{flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--shell-pad-md);padding:var(--shell-pad-lg);min-height:0;min-width:0}.mock-counter.svelte-32yf5q{font-size:48px;font-family:var(--shell-font-mono);color:var(--shell-fg);line-height:1}.mock-actions.svelte-32yf5q{display:flex;gap:var(--shell-pad-sm)}.mock-actions.svelte-32yf5q button:where(.svelte-32yf5q){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:3px;cursor:pointer}.mock-actions.svelte-32yf5q button:where(.svelte-32yf5q):hover{background:var(--shell-accent)}.mock-actions.svelte-32yf5q button.secondary:where(.svelte-32yf5q){background:transparent}.mock-actions.svelte-32yf5q button.secondary:where(.svelte-32yf5q):hover{background:var(--shell-bg-elevated)}.mock-hint.svelte-32yf5q{color:var(--shell-fg-subtle);font-size:11px}.mock-overlays.svelte-32yf5q{display:flex;gap:var(--shell-pad-sm);margin-top:var(--shell-pad-sm)}.mock-overlays.svelte-32yf5q .overlay:where(.svelte-32yf5q){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:2px var(--shell-pad-sm);background:var(--shell-bg-sunken);color:var(--shell-fg-muted);border:1px solid var(--shell-border);border-radius:2px;cursor:pointer}.mock-overlays.svelte-32yf5q .overlay:where(.svelte-32yf5q):hover{color:var(--shell-fg);border-color:var(--shell-accent-muted)}.mock-focus.svelte-32yf5q,.mock-context.svelte-32yf5q{display:flex;flex-direction:column;align-items:center;gap:4px}.mock-section-label.svelte-32yf5q{font-size:10px;color:var(--shell-fg-subtle);text-transform:uppercase;letter-spacing:.5px}.mock-focus-buttons.svelte-32yf5q{display:flex;gap:var(--shell-pad-sm)}.mock-focus-buttons.svelte-32yf5q button:where(.svelte-32yf5q){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:2px var(--shell-pad-sm);background:var(--shell-bg-sunken);color:var(--shell-fg-muted);border:1px solid var(--shell-border);border-radius:2px;cursor:pointer}.mock-focus-buttons.svelte-32yf5q button:where(.svelte-32yf5q):hover{color:var(--shell-fg);border-color:var(--shell-accent-muted)}.mock-context.svelte-32yf5q code:where(.svelte-32yf5q){font-family:var(--shell-font-mono);font-size:10px;color:var(--shell-accent)}.mock-footer.svelte-32yf5q{flex:0 0 auto;padding:var(--shell-pad-xs) var(--shell-pad-md);background:var(--shell-bg-sunken);border-top:1px solid var(--shell-border);color:var(--shell-fg-subtle);font-family:var(--shell-font-mono);font-size:10px;text-align:right}";
  document.head.appendChild(s);
})();
import * as t from "svelte/internal/client";
import { mount as V, unmount as X } from "svelte";
import "svelte/internal/disclose-version";
import { shell as b, focusTab as G, spliceIntoActiveLayout as j } from "sh3-core";
const nt = {
  manifest: {
    id: "mock-app",
    label: "Mock App",
    requiredShards: ["mock"],
    layoutVersion: 2
  },
  initialLayout: {
    type: "split",
    direction: "horizontal",
    sizes: [200, 2, 1],
    pinned: ["px", "fr", "fr"],
    children: [
      { type: "slot", slotId: "main.sidebar", viewId: "mock:panel" },
      {
        type: "tabs",
        activeTab: 0,
        persistent: !0,
        tabs: [
          { slotId: "main.center.a", viewId: "mock:panel", label: "Panel A" },
          { slotId: "main.center.b", viewId: "mock:panel", label: "Panel B" },
          { slotId: "main.center.c", viewId: "mock:panel", label: "Panel C" }
        ]
      },
      { type: "slot", slotId: "main.inspector", viewId: "mock:panel" }
    ]
  }
}, J = 260, K = 580, O = 140, Q = 440, p = 24;
function h(s, e) {
  return Math.round(s + Math.random() * (e - s));
}
function D() {
  const s = h(J, K), e = h(O, Q), r = window.innerWidth, a = window.innerHeight, l = Math.max(p, r - s - p), c = Math.max(p, a - e - p), o = h(p, l);
  return `position: absolute; top: ${h(p, c)}px; left: ${o}px; width: ${s}px; height: ${e}px; min-width: 0; max-width: none; max-height: none;`;
}
var U = t.from_html(`<div class="body svelte-vo8k5v"><h2 class="svelte-vo8k5v"> </h2> <p class="svelte-vo8k5v">This modal was opened by the phase-5 overlay manager.
    Press <kbd class="svelte-vo8k5v">Escape</kbd> to dismiss the topmost modal, or use the buttons.</p> <div class="row svelte-vo8k5v"><button type="button" class="svelte-vo8k5v">Stack another modal</button> <button type="button" class="secondary svelte-vo8k5v">Close this one</button></div></div>`);
function F(s, e) {
  t.push(e, !0);
  function r() {
    b.modal.open(F, { depth: e.depth + 1 }, { boxStyle: D() });
  }
  var a = U(), l = t.child(a), c = t.child(l);
  t.reset(l);
  var o = t.sibling(l, 4), v = t.child(o), d = t.sibling(v, 2);
  t.reset(o), t.reset(a), t.template_effect(() => t.set_text(c, `Modal #${e.depth ?? ""}`)), t.delegated("click", v, r), t.delegated("click", d, function(...n) {
    var i;
    (i = e.close) == null || i.apply(this, n);
  }), t.append(s, a), t.pop();
}
t.delegate(["click"]);
var Y = t.from_html('<li role="none"><button type="button" role="menuitem" class="svelte-1oeec1a"> </button></li>'), Z = t.from_html('<ul class="menu svelte-1oeec1a" role="menu"></ul>');
function $(s, e) {
  t.push(e, !0);
  const r = [
    { label: "Info toast", level: "info" },
    { label: "Success toast", level: "success" },
    { label: "Warning toast", level: "warn" },
    { label: "Error toast", level: "error" }
  ];
  function a(c, o) {
    e.close(), b.toast.notify(`${c} from popup`, { level: o });
  }
  var l = Z();
  t.each(l, 21, () => r, ({ label: c, level: o }) => c, (c, o) => {
    let v = () => t.get(o).label, d = () => t.get(o).level;
    var n = Y(), i = t.child(n), u = t.child(i, !0);
    t.reset(i), t.reset(n), t.template_effect(() => t.set_text(u, v())), t.delegated("click", i, () => a(v(), d())), t.append(c, n);
  }), t.reset(l), t.append(s, l), t.pop();
}
t.delegate(["click"]);
var tt = t.from_html('<div class="mock-panel svelte-32yf5q"><header class="mock-header svelte-32yf5q"><span class="mock-title svelte-32yf5q">mock:panel</span> <span class="mock-slot-id svelte-32yf5q"> </span></header> <div class="mock-body svelte-32yf5q"><div class="mock-counter svelte-32yf5q"> </div> <div class="mock-actions svelte-32yf5q"><button type="button" class="svelte-32yf5q">+ increment</button> <button type="button" class="secondary svelte-32yf5q">reset</button></div> <div class="mock-hint svelte-32yf5q">counter persists per slot across reload</div> <div class="mock-overlays svelte-32yf5q"><button type="button" class="overlay svelte-32yf5q">Modal</button> <button type="button" class="overlay svelte-32yf5q">Menu ▾</button> <button type="button" class="overlay svelte-32yf5q">Toast</button></div> <div class="mock-focus svelte-32yf5q"><span class="mock-section-label svelte-32yf5q">focusTab API</span> <div class="mock-focus-buttons svelte-32yf5q"><button type="button" class="overlay svelte-32yf5q">Focus A</button> <button type="button" class="overlay svelte-32yf5q">Focus B</button> <button type="button" class="overlay svelte-32yf5q">Focus C</button></div></div> <div class="mock-context svelte-32yf5q"><span class="mock-section-label svelte-32yf5q">MountContext</span> <code class="svelte-32yf5q"> </code></div></div> <footer class="mock-footer svelte-32yf5q"> </footer></div>');
function et(s, e) {
  t.push(e, !0);
  let r = t.prop(e, "workspace", 7);
  const a = t.derived(() => r().countersBySlot[e.slotId] ?? 0);
  function l() {
    r().countersBySlot[e.slotId] = t.get(a) + 1;
  }
  function c() {
    r().countersBySlot[e.slotId] = 0;
  }
  function o() {
    b.modal.open(F, { depth: 1 }, { boxStyle: D() });
  }
  function v(m) {
    const x = m.currentTarget;
    b.popup.show($, { anchor: x });
  }
  function d() {
    b.toast.notify(`hello from ${e.slotId}`, { level: "info" });
  }
  function n(m, x) {
    G(m) || j({ slotId: m, viewId: "mock:panel", label: x });
  }
  var i = tt(), u = t.child(i), w = t.sibling(t.child(u), 2), W = t.child(w, !0);
  t.reset(w), t.reset(u);
  var f = t.sibling(u, 2), y = t.child(f), z = t.child(y, !0);
  t.reset(y);
  var k = t.sibling(y, 2), I = t.child(k), E = t.sibling(I, 2);
  t.reset(k);
  var g = t.sibling(k, 4), q = t.child(g), M = t.sibling(q, 2), H = t.sibling(M, 2);
  t.reset(g);
  var _ = t.sibling(g, 2), A = t.sibling(t.child(_), 2), P = t.child(A), T = t.sibling(P, 2), L = t.sibling(T, 2);
  t.reset(A), t.reset(_);
  var S = t.sibling(_, 2), B = t.sibling(t.child(S), 2), N = t.child(B);
  t.reset(B), t.reset(S), t.reset(f);
  var C = t.sibling(f, 2), R = t.child(C);
  t.reset(C), t.reset(i), t.template_effect(() => {
    t.set_text(W, e.slotId), t.set_text(z, t.get(a)), t.set_text(N, `${e.context.viewId ?? ""} @ ${e.context.label ?? ""}`), t.set_text(R, `${e.dims.width ?? ""} × ${e.dims.height ?? ""}`);
  }), t.delegated("click", I, l), t.delegated("click", E, c), t.delegated("click", q, o), t.delegated("click", M, v), t.delegated("click", H, d), t.delegated("click", P, () => n("main.center.a", "Panel A")), t.delegated("click", T, () => n("main.center.b", "Panel B")), t.delegated("click", L, () => n("main.center.c", "Panel C")), t.append(s, i), t.pop();
}
t.delegate(["click"]);
const at = {
  manifest: {
    id: "mock",
    label: "Mock",
    views: [{ id: "mock:panel", label: "Mock Panel" }]
  },
  activate(s) {
    const e = s.state({ workspace: { countersBySlot: {} } }), r = {
      mount(a, l) {
        const c = l.slotId, o = t.proxy({ width: 0, height: 0 }), v = V(et, {
          target: a,
          props: { slotId: c, context: l, workspace: e.workspace, dims: o }
        }), d = document.createElement("button");
        d.textContent = "Toggle dirty", d.style.cssText = "margin-top: 8px; padding: 4px 8px; cursor: pointer;";
        let n = !1;
        return d.onclick = () => {
          n = !n, l.setDirty(n), d.textContent = n ? "Mark clean" : "Toggle dirty";
        }, a.appendChild(d), {
          unmount() {
            X(v);
          },
          onResize(i, u) {
            o.width = i, o.height = u;
          },
          closable: !0
        };
      }
    };
    s.registerView("mock:panel", r);
  }
};
export {
  nt as app,
  at as default
};
