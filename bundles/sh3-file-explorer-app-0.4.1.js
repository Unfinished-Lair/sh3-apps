/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".sh3-fe-tree.svelte-gk9ydj,.sh3-fe-tree.svelte-gk9ydj ul:where(.svelte-gk9ydj){list-style:none;padding:0;margin:0}.sh3-fe-node.svelte-gk9ydj{background:none;border:0;color:var(--shell-fg);cursor:pointer;padding:2px 4px;text-align:left;width:100%;font:inherit}.sh3-fe-node.svelte-gk9ydj:hover{background:var(--shell-bg-elevated)}.sh3-fe-node.selected.svelte-gk9ydj{background:var(--shell-accent-muted)}.sh3-fe-empty.svelte-gk9ydj{color:var(--shell-fg-muted);padding:8px}.sh3-fe-panel__empty.svelte-1vm0wsq{color:var(--shell-fg-muted)}.sh3-fe-panel__header.svelte-1vm0wsq{border-bottom:1px solid var(--shell-border);padding-bottom:6px;margin-bottom:8px;color:var(--shell-fg)}.sh3-fe-panel__path.svelte-1vm0wsq{font-weight:600}.sh3-fe-panel__shard.svelte-1vm0wsq{font-size:.85em;color:var(--shell-fg-muted)}.sh3-fe-panel__actions.svelte-1vm0wsq{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.sh3-fe-panel__action.svelte-1vm0wsq{background:var(--shell-bg-elevated);color:var(--shell-fg);border:1px solid var(--shell-border);padding:4px 10px;font:inherit;cursor:pointer;border-radius:var(--shell-radius-sm)}.sh3-fe-panel__action.svelte-1vm0wsq:hover{background:var(--shell-accent-muted)}.sh3-fe-panel__action.primary.svelte-1vm0wsq{border-color:var(--shell-accent)}.sh3-fe-panel__action[disabled].svelte-1vm0wsq{opacity:.5;cursor:progress}.sh3-fe-browser.svelte-sykudp{display:grid;grid-template-columns:minmax(240px,1fr) minmax(260px,1fr);height:100%;gap:1px;background:var(--shell-border)}.sh3-fe-browser__tree.svelte-sykudp,.sh3-fe-browser__panel.svelte-sykudp{background:var(--shell-bg);color:var(--shell-fg);overflow:auto;padding:8px}";
  document.head.appendChild(s);
})();
import { mount as A, unmount as M } from "svelte";
import * as e from "svelte/internal/client";
import "svelte/internal/disclose-version";
const se = {
  manifest: {
    id: "sh3-file-explorer-app",
    label: "File Explorer",
    requiredShards: ["sh3-file-explorer"],
    layoutVersion: 2,
    permissions: ["documents:browse"]
  },
  initialLayout: {
    type: "slot",
    slotId: "sh3-file-explorer.files",
    viewId: "sh3-file-explorer-browser"
  }
};
class O extends Error {
  constructor() {
    super("sh3-file-explorer requires the documents:browse permission.");
  }
}
function P(u) {
  if (!u.browse)
    return { ctx: u, ready: !1, error: new O() };
  const t = u.browse;
  let v = e.state(null);
  const i = e.proxy({});
  let _ = e.state(e.proxy([]));
  function I(m) {
    e.set(v, m, !0);
  }
  function b(m) {
    i[m] ? delete i[m] : i[m] = !0;
  }
  function w(m) {
    return i[m] === !0;
  }
  async function E() {
    e.set(_, await t.listDocuments(), !0);
  }
  function q() {
    return t.watchDocuments((m) => {
      E();
    });
  }
  return {
    ctx: u,
    ready: !0,
    browse: t,
    get selection() {
      return e.get(v);
    },
    get documents() {
      return e.get(_);
    },
    setSelection: I,
    toggleExpanded: b,
    isExpanded: w,
    refreshDocuments: E,
    startWatch: q
  };
}
var V = e.from_html('<ul class="svelte-gk9ydj"></ul>'), B = e.from_html('<button class="sh3-fe-node svelte-gk9ydj"> </button> <!>', 1), W = e.from_html("<button> </button>"), z = e.from_html("<li><!></li>"), G = e.from_html('<p class="sh3-fe-empty svelte-gk9ydj"> </p>'), H = e.from_html('<p class="sh3-fe-empty svelte-gk9ydj">No documents in this tenant.</p>'), J = e.from_html('<ul class="sh3-fe-tree svelte-gk9ydj"></ul>');
function K(u, t) {
  e.push(t, !0);
  const v = (r, s = e.noop, a = e.noop) => {
    var o = z(), d = e.child(o);
    {
      var p = (f) => {
        var l = B(), h = e.first_child(l), g = e.child(h);
        e.reset(h);
        var S = e.sibling(h, 2);
        {
          var j = (T) => {
            var C = V();
            e.each(C, 21, () => s().children, (D) => w(D), (D, L) => {
              v(D, () => e.get(L), () => a() + 1);
            }), e.reset(C), e.append(T, C);
          }, F = e.derived(() => t.store.ready && t.store.isExpanded(w(s())));
          e.if(S, (T) => {
            e.get(F) && T(j);
          });
        }
        e.template_effect((T) => e.set_text(g, `${T ?? ""} ${(s().name || "(root)") ?? ""}/`), [
          () => t.store.ready && t.store.isExpanded(w(s())) ? "▾" : "▸"
        ]), e.delegated("click", h, () => E(s())), e.append(f, l);
      }, x = (f) => {
        var l = W();
        let h;
        var g = e.child(l, !0);
        e.reset(l), e.template_effect(() => {
          var S, j;
          h = e.set_class(l, 1, "sh3-fe-node sh3-fe-node--file svelte-gk9ydj", null, h, {
            selected: t.store.ready && ((S = t.store.selection) == null ? void 0 : S.shardId) === s().shardId && ((j = t.store.selection) == null ? void 0 : j.path) === s().path
          }), e.set_text(g, s().name);
        }), e.delegated("click", l, () => q(s())), e.append(f, l);
      };
      e.if(d, (f) => {
        s().kind === "folder" ? f(p) : f(x, -1);
      });
    }
    e.reset(o), e.template_effect(() => e.set_style(o, `padding-left: ${a() * 12}px`)), e.append(r, o);
  };
  function i() {
    return { folders: /* @__PURE__ */ new Map(), files: [] };
  }
  function _(r) {
    const s = [...r.folders.values()].map(({ node: o, state: d }) => (o.children = _(d), o));
    s.sort((o, d) => o.name.localeCompare(d.name));
    const a = [...r.files].sort((o, d) => o.name.localeCompare(d.name));
    return [...s, ...a];
  }
  function I(r, s) {
    const a = i();
    for (const o of s) {
      const d = o.path.split("/").filter(Boolean);
      if (d.length === 0) continue;
      let p = a, x = "";
      for (let f = 0; f < d.length; f++) {
        const l = d[f];
        if (x = x ? `${x}/${l}` : l, f === d.length - 1)
          p.files.push({ kind: "file", name: l, path: o.path, shardId: r });
        else {
          let g = p.folders.get(l);
          g || (g = {
            node: { kind: "folder", name: l, path: x, shardId: r, children: [] },
            state: i()
          }, p.folders.set(l, g)), p = g.state;
        }
      }
    }
    return _(a);
  }
  const b = e.derived(() => {
    if (!t.store.ready) return [];
    const r = /* @__PURE__ */ new Map();
    for (const a of t.store.documents) {
      const o = r.get(a.shardId) ?? [];
      o.push(a), r.set(a.shardId, o);
    }
    const s = [];
    for (const [a, o] of [...r.entries()].sort(([d], [p]) => d.localeCompare(p)))
      s.push({
        kind: "folder",
        name: a,
        path: "",
        shardId: a,
        children: I(a, o)
      });
    return s;
  });
  function w(r) {
    return `${r.shardId}:${r.path}`;
  }
  function E(r) {
    r.kind === "folder" && t.store.toggleExpanded(w(r));
  }
  function q(r) {
    t.store.ready && t.store.setSelection({ shardId: r.shardId, path: r.path });
  }
  var m = e.comment(), n = e.first_child(m);
  {
    var c = (r) => {
      var s = G(), a = e.child(s, !0);
      e.reset(s), e.template_effect(() => e.set_text(a, t.store.error.message)), e.append(r, s);
    }, k = (r) => {
      var s = H();
      e.append(r, s);
    }, y = (r) => {
      var s = J();
      e.each(s, 21, () => e.get(b), (a) => w(a), (a, o) => {
        v(a, () => e.get(o), () => 0);
      }), e.reset(s), e.append(r, s);
    };
    e.if(n, (r) => {
      t.store.ready ? e.get(b).length === 0 ? r(k, 1) : r(y, -1) : r(c);
    });
  }
  e.append(u, m), e.pop();
}
e.delegate(["click"]);
const N = "sh3-file-explorer.selectionAction";
var Q = e.from_html('<p class="sh3-fe-panel__empty svelte-1vm0wsq"> </p>'), R = e.from_html('<p class="sh3-fe-panel__empty svelte-1vm0wsq">Select a file or folder to see details.</p>'), U = e.from_html("<button> </button>"), X = e.from_html('<div class="sh3-fe-panel__actions svelte-1vm0wsq"></div>'), Y = e.from_html('<header class="sh3-fe-panel__header svelte-1vm0wsq"><div class="sh3-fe-panel__path svelte-1vm0wsq"> </div> <div class="sh3-fe-panel__shard svelte-1vm0wsq"> </div></header> <!>', 1);
function Z(u, t) {
  e.push(t, !0);
  let v = e.state(0);
  e.user_effect(() => t.store.ctx.contributions.onChange(N, () => {
    e.update(v);
  }));
  const i = e.derived(() => {
    if (e.get(v), !t.store.ready || !t.store.selection) return [];
    const n = t.store.selection;
    return t.store.ctx.contributions.list(N).filter((c) => !c.appliesTo || c.appliesTo(n));
  });
  let _ = e.proxy({});
  async function I(n, c) {
    if (!t.store.ready || !t.store.selection) return;
    const k = t.store.selection;
    _[n] = !0;
    try {
      await c(k);
    } catch (y) {
      console.error(`[sh3-file-explorer] action "${n}" threw:`, y), alert(`Action "${n}" failed: ${y instanceof Error ? y.message : String(y)}`);
    } finally {
      _[n] = !1;
    }
  }
  var b = e.comment(), w = e.first_child(b);
  {
    var E = (n) => {
      var c = Q(), k = e.child(c, !0);
      e.reset(c), e.template_effect(() => e.set_text(k, t.store.error.message)), e.append(n, c);
    }, q = (n) => {
      var c = R();
      e.append(n, c);
    }, m = (n) => {
      var c = Y(), k = e.first_child(c), y = e.child(k), r = e.child(y, !0);
      e.reset(y);
      var s = e.sibling(y, 2), a = e.child(s, !0);
      e.reset(s), e.reset(k);
      var o = e.sibling(k, 2);
      {
        var d = (p) => {
          var x = X();
          e.each(x, 21, () => e.get(i), (f) => f.id, (f, l) => {
            var h = U();
            let g;
            var S = e.child(h, !0);
            e.reset(h), e.template_effect(() => {
              g = e.set_class(h, 1, "sh3-fe-panel__action svelte-1vm0wsq", null, g, { primary: e.get(l).kind === "primary" }), h.disabled = _[e.get(l).id], e.set_text(S, _[e.get(l).id] ? "…" : e.get(l).label);
            }), e.delegated("click", h, () => I(e.get(l).id, e.get(l).onInvoke)), e.append(f, h);
          }), e.reset(x), e.append(p, x);
        };
        e.if(o, (p) => {
          e.get(i).length > 0 && p(d);
        });
      }
      e.template_effect(() => {
        e.set_text(r, t.store.selection.path || "(shard root)"), e.set_text(a, t.store.selection.shardId);
      }), e.append(n, c);
    };
    e.if(w, (n) => {
      t.store.ready ? t.store.selection ? n(m, -1) : n(q, 1) : n(E);
    });
  }
  e.append(u, b), e.pop();
}
e.delegate(["click"]);
var $ = e.from_html('<div class="sh3-fe-browser svelte-sykudp"><div class="sh3-fe-browser__tree svelte-sykudp"><!></div> <div class="sh3-fe-browser__panel svelte-sykudp"><!></div></div>');
function ee(u, t) {
  var v = $(), i = e.child(v), _ = e.child(i);
  K(_, {
    get store() {
      return t.store;
    }
  }), e.reset(i);
  var I = e.sibling(i, 2), b = e.child(I);
  Z(b, {
    get store() {
      return t.store;
    }
  }), e.reset(I), e.reset(v), e.append(u, v);
}
const ae = {
  manifest: {
    id: "sh3-file-explorer",
    label: "File Explorer",
    views: [
      { id: "sh3-file-explorer-browser", label: "Files", standalone: !0 }
    ],
    permissions: ["documents:browse"]
  },
  activate(u) {
    const t = P(u);
    t.ready && (t.refreshDocuments(), t.startWatch()), u.registerView("sh3-file-explorer-browser", {
      mount(v) {
        const i = A(ee, { target: v, props: { store: t } });
        return { unmount() {
          M(i);
        } };
      }
    });
  }
};
export {
  N as SELECTION_ACTION_POINT,
  se as app,
  ae as shard
};
