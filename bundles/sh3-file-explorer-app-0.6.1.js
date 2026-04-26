/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".sh3-fe-tree.svelte-gk9ydj,.sh3-fe-tree.svelte-gk9ydj ul:where(.svelte-gk9ydj){list-style:none;padding:0;margin:0}.sh3-fe-node.svelte-gk9ydj{background:none;border:0;color:var(--shell-fg);cursor:pointer;padding:2px 4px;text-align:left;width:100%;font:inherit}.sh3-fe-node.svelte-gk9ydj:hover{background:var(--shell-bg-elevated)}.sh3-fe-node.selected.svelte-gk9ydj{background:var(--shell-accent-muted)}.sh3-fe-empty.svelte-gk9ydj{color:var(--shell-fg-muted);padding:8px}.sh3-fe-row.svelte-gk9ydj{display:flex;align-items:center;gap:2px}.sh3-fe-twisty.svelte-gk9ydj{background:none;border:0;color:var(--shell-fg-muted);cursor:pointer;padding:2px 4px;font:inherit;width:1.4em;flex:0 0 auto}.sh3-fe-twisty.svelte-gk9ydj:hover{color:var(--shell-fg)}.sh3-fe-node--folder.svelte-gk9ydj,.sh3-fe-node--file.svelte-gk9ydj{flex:1 1 auto}.sh3-fe-badge.svelte-gk9ydj{display:inline-block;padding:0 4px;margin-left:6px;font-size:.85em;border-radius:var(--shell-radius-sm, 3px);flex:0 0 auto;cursor:default}.sh3-fe-badge--ok.svelte-gk9ydj{color:var(--shell-accent, #4a90e2)}.sh3-fe-badge--warn.svelte-gk9ydj{color:#e6a23c}.sh3-fe-badge--muted.svelte-gk9ydj{color:var(--shell-fg-muted, #888)}.sh3-fe-panel__empty.svelte-1vm0wsq{color:var(--shell-fg-muted)}.sh3-fe-panel__header.svelte-1vm0wsq{border-bottom:1px solid var(--shell-border);padding-bottom:6px;margin-bottom:8px;color:var(--shell-fg)}.sh3-fe-panel__path.svelte-1vm0wsq{font-weight:600}.sh3-fe-panel__shard.svelte-1vm0wsq{font-size:.85em;color:var(--shell-fg-muted)}.sh3-fe-panel__actions.svelte-1vm0wsq{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.sh3-fe-panel__action.svelte-1vm0wsq{background:var(--shell-bg-elevated);color:var(--shell-fg);border:1px solid var(--shell-border);padding:4px 10px;font:inherit;cursor:pointer;border-radius:var(--shell-radius-sm)}.sh3-fe-panel__action.svelte-1vm0wsq:hover{background:var(--shell-accent-muted)}.sh3-fe-panel__action.primary.svelte-1vm0wsq{border-color:var(--shell-accent)}.sh3-fe-panel__action[disabled].svelte-1vm0wsq{opacity:.5;cursor:progress}.sh3-fe-panel__badges.svelte-1vm0wsq{list-style:none;padding:0;margin:8px 0 0;display:flex;flex-direction:column;gap:4px}.sh3-fe-panel__badge.svelte-1vm0wsq{display:flex;gap:8px;padding:4px 8px;background:var(--shell-bg-elevated, #2a2a2a);border-radius:var(--shell-radius-sm, 3px)}.sh3-fe-panel__badge--ok.svelte-1vm0wsq{color:var(--shell-accent, #4a90e2)}.sh3-fe-panel__badge--warn.svelte-1vm0wsq{color:#e6a23c}.sh3-fe-panel__badge--muted.svelte-1vm0wsq{color:var(--shell-fg-muted, #888)}.sh3-fe-panel__badge-icon.svelte-1vm0wsq{flex:0 0 auto}.sh3-fe-panel__badge-text.svelte-1vm0wsq{display:flex;flex-direction:column}.sh3-fe-panel__badge-label.svelte-1vm0wsq{color:var(--shell-fg);font-weight:500}.sh3-fe-panel__badge-detail.svelte-1vm0wsq{color:var(--shell-fg-muted, #888);font-size:.85em}.sh3-fe-browser.svelte-sykudp{display:grid;grid-template-columns:minmax(240px,1fr) minmax(260px,1fr);height:100%;gap:1px;background:var(--shell-border)}.sh3-fe-browser__tree.svelte-sykudp,.sh3-fe-browser__panel.svelte-sykudp{background:var(--shell-bg);color:var(--shell-fg);overflow:auto;padding:8px}";
  document.head.appendChild(s);
})();
import { mount as X, unmount as Y } from "svelte";
import * as e from "svelte/internal/client";
import "svelte/internal/disclose-version";
const Ie = {
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
}, Q = "sh3-file-explorer.selectionAction", K = "sh3-file-explorer.documentBadge";
function Z(h, t, m = () => {
}) {
  const v = [];
  for (const x of h) {
    let w;
    try {
      w = x.getBadge(t);
    } catch (I) {
      m(x.id, I);
      continue;
    }
    w && v.push({ providerId: x.id, badge: w });
  }
  return v;
}
class $ extends Error {
  constructor() {
    super("sh3-file-explorer requires the documents:browse permission.");
  }
}
function ee(h) {
  if (!h.browse)
    return {
      ctx: h,
      ready: !1,
      error: new $(),
      dispose: () => {
      }
    };
  const t = h.browse;
  let m = e.state(null);
  const v = e.proxy({});
  let x = e.state(e.proxy([]));
  function w(i) {
    e.set(m, i, !0);
  }
  function I(i) {
    v[i] ? delete v[i] : v[i] = !0;
  }
  function O(i) {
    return v[i] === !0;
  }
  let E = e.state(0), A = e.state(0);
  const V = e.effect_root(() => {
    e.user_effect(() => h.contributions.onChange(K, () => {
      e.update(A), e.update(E);
    })), e.user_effect(() => {
      e.get(A);
      const c = h.contributions.list(K).map((r) => {
        var s;
        return ((s = r.onChange) == null ? void 0 : s.call(r, () => {
          e.update(E);
        })) ?? (() => {
        });
      });
      return () => {
        for (const r of c) r();
      };
    });
  });
  function W(i) {
    e.get(E);
    const c = h.contributions.list(K);
    return Z(c, i, (r, s) => {
      console.error(`[sh3-file-explorer] badge provider "${r}" threw:`, s);
    });
  }
  function L() {
    V();
  }
  async function a() {
    e.set(x, await t.listDocuments(), !0);
  }
  function u() {
    return t.watchDocuments((i) => {
      a();
    });
  }
  return {
    ctx: h,
    ready: !0,
    browse: t,
    get selection() {
      return e.get(m);
    },
    get documents() {
      return e.get(x);
    },
    setSelection: w,
    toggleExpanded: I,
    isExpanded: O,
    refreshDocuments: a,
    startWatch: u,
    getBadgesFor: W,
    dispose: L
  };
}
var te = e.from_html("<span> </span>"), se = e.from_html('<ul class="svelte-gk9ydj"></ul>'), re = e.from_html('<div class="sh3-fe-row svelte-gk9ydj"><button class="sh3-fe-twisty svelte-gk9ydj"> </button> <button> </button> <!></div> <!>', 1), ae = e.from_html("<span> </span>"), le = e.from_html('<div class="sh3-fe-row svelte-gk9ydj"><button> </button> <!></div>'), ne = e.from_html("<li><!></li>"), oe = e.from_html('<p class="sh3-fe-empty svelte-gk9ydj"> </p>'), ie = e.from_html('<p class="sh3-fe-empty svelte-gk9ydj">No documents in this tenant.</p>'), de = e.from_html('<ul class="sh3-fe-tree svelte-gk9ydj"></ul>');
function ce(h, t) {
  e.push(t, !0);
  const m = (r, s = e.noop, l = e.noop) => {
    var n = ne(), b = e.child(n);
    {
      var C = (_) => {
        var f = re(), o = e.first_child(f), p = e.child(o), d = e.child(p, !0);
        e.reset(p);
        var y = e.sibling(p, 2);
        let q;
        var S = e.child(y);
        e.reset(y);
        var T = e.sibling(y, 2);
        {
          var j = (g) => {
            var k = e.comment(), B = e.first_child(k);
            e.each(
              B,
              17,
              () => t.store.getBadgesFor({
                shardId: s().shardId,
                path: s().path,
                kind: "folder",
                descendantCount: s().descendantCount
              }),
              ({ providerId: D, badge: z }) => D,
              (D, z) => {
                let H = () => e.get(z).badge;
                var G = te(), R = e.child(G, !0);
                e.reset(G), e.template_effect(() => {
                  e.set_class(G, 1, `sh3-fe-badge sh3-fe-badge--${H().tone ?? "ok" ?? ""}`, "svelte-gk9ydj"), e.set_attribute(G, "title", H().tooltip ?? H().label ?? ""), e.set_text(R, H().icon);
                }), e.append(D, G);
              }
            ), e.append(g, k);
          };
          e.if(T, (g) => {
            t.store.ready && g(j);
          });
        }
        e.reset(o);
        var N = e.sibling(o, 2);
        {
          var P = (g) => {
            var k = se();
            e.each(k, 21, () => s().children, (B) => E(B), (B, D) => {
              m(B, () => e.get(D), () => l() + 1);
            }), e.reset(k), e.append(g, k);
          }, M = e.derived(() => t.store.ready && t.store.isExpanded(E(s())));
          e.if(N, (g) => {
            e.get(M) && g(P);
          });
        }
        e.template_effect(
          (g, k) => {
            var B, D, z;
            e.set_style(o, `padding-left: ${l() * 12}px`), e.set_attribute(p, "aria-label", g), e.set_text(d, k), q = e.set_class(y, 1, "sh3-fe-node sh3-fe-node--folder svelte-gk9ydj", null, q, {
              selected: t.store.ready && ((B = t.store.selection) == null ? void 0 : B.shardId) === s().shardId && ((D = t.store.selection) == null ? void 0 : D.path) === s().path && ((z = t.store.selection) == null ? void 0 : z.kind) === "folder"
            }), e.set_text(S, `${(s().name || "(root)") ?? ""}/`);
          },
          [
            () => t.store.ready && t.store.isExpanded(E(s())) ? "Collapse" : "Expand",
            () => t.store.ready && t.store.isExpanded(E(s())) ? "▾" : "▸"
          ]
        ), e.delegated("click", p, () => A(s())), e.delegated("click", y, () => W(s())), e.append(_, f);
      }, F = (_) => {
        var f = le(), o = e.child(f);
        let p;
        var d = e.child(o, !0);
        e.reset(o);
        var y = e.sibling(o, 2);
        {
          var q = (S) => {
            var T = e.comment(), j = e.first_child(T);
            e.each(
              j,
              17,
              () => t.store.getBadgesFor({
                shardId: s().shardId,
                path: s().path,
                kind: "file",
                lastModified: s().lastModified
              }),
              ({ providerId: N, badge: P }) => N,
              (N, P) => {
                let M = () => e.get(P).badge;
                var g = ae(), k = e.child(g, !0);
                e.reset(g), e.template_effect(() => {
                  e.set_class(g, 1, `sh3-fe-badge sh3-fe-badge--${M().tone ?? "ok" ?? ""}`, "svelte-gk9ydj"), e.set_attribute(g, "title", M().tooltip ?? M().label ?? ""), e.set_text(k, M().icon);
                }), e.append(N, g);
              }
            ), e.append(S, T);
          };
          e.if(y, (S) => {
            t.store.ready && S(q);
          });
        }
        e.reset(f), e.template_effect(() => {
          var S, T, j;
          e.set_style(f, `padding-left: ${l() * 12}px`), p = e.set_class(o, 1, "sh3-fe-node sh3-fe-node--file svelte-gk9ydj", null, p, {
            selected: t.store.ready && ((S = t.store.selection) == null ? void 0 : S.shardId) === s().shardId && ((T = t.store.selection) == null ? void 0 : T.path) === s().path && ((j = t.store.selection) == null ? void 0 : j.kind) === "file"
          }), e.set_text(d, s().name);
        }), e.delegated("click", o, () => V(s())), e.append(_, f);
      };
      e.if(b, (_) => {
        s().kind === "folder" ? _(C) : _(F, -1);
      });
    }
    e.reset(n), e.append(r, n);
  };
  function v() {
    return { folders: /* @__PURE__ */ new Map(), files: [] };
  }
  function x(r) {
    const s = [...r.folders.values()].map(({ node: n, state: b }) => (n.children = x(b), n));
    s.sort((n, b) => n.name.localeCompare(b.name));
    const l = [...r.files].sort((n, b) => n.name.localeCompare(b.name));
    return [...s, ...l];
  }
  function w(r, s) {
    const l = v();
    for (const b of s) {
      const C = b.path.split("/").filter(Boolean);
      if (C.length === 0) continue;
      let F = l, _ = "";
      for (let f = 0; f < C.length; f++) {
        const o = C[f];
        if (_ = _ ? `${_}/${o}` : o, f === C.length - 1)
          F.files.push({
            kind: "file",
            name: o,
            path: b.path,
            shardId: r,
            lastModified: b.lastModified
          });
        else {
          let d = F.folders.get(o);
          d || (d = {
            node: {
              kind: "folder",
              name: o,
              path: _,
              shardId: r,
              descendantCount: 0,
              children: []
            },
            state: v()
          }, F.folders.set(o, d)), F = d.state;
        }
      }
    }
    const n = x(l);
    return I(n), n;
  }
  function I(r) {
    let s = 0;
    for (const l of r)
      if (l.kind === "folder") {
        const n = I(l.children);
        l.descendantCount = n, s += n;
      } else
        s += 1;
    return s;
  }
  const O = e.derived(() => {
    if (!t.store.ready) return [];
    const r = /* @__PURE__ */ new Map();
    for (const l of t.store.documents) {
      const n = r.get(l.shardId) ?? [];
      n.push(l), r.set(l.shardId, n);
    }
    const s = [];
    for (const [l, n] of [...r.entries()].sort(([b], [C]) => b.localeCompare(C)))
      s.push({
        kind: "folder",
        name: l,
        path: "",
        shardId: l,
        descendantCount: n.length,
        children: w(l, n)
      });
    return s;
  });
  function E(r) {
    return `${r.shardId}:${r.path}`;
  }
  function A(r) {
    r.kind === "folder" && t.store.toggleExpanded(E(r));
  }
  function V(r) {
    t.store.ready && t.store.setSelection({ shardId: r.shardId, path: r.path, kind: "file" });
  }
  function W(r) {
    t.store.ready && t.store.setSelection({ shardId: r.shardId, path: r.path, kind: "folder" });
  }
  var L = e.comment(), a = e.first_child(L);
  {
    var u = (r) => {
      var s = oe(), l = e.child(s, !0);
      e.reset(s), e.template_effect(() => e.set_text(l, t.store.error.message)), e.append(r, s);
    }, i = (r) => {
      var s = ie();
      e.append(r, s);
    }, c = (r) => {
      var s = de();
      e.each(s, 21, () => e.get(O), (l) => E(l), (l, n) => {
        m(l, () => e.get(n), () => 0);
      }), e.reset(s), e.append(r, s);
    };
    e.if(a, (r) => {
      t.store.ready ? e.get(O).length === 0 ? r(i, 1) : r(c, -1) : r(u);
    });
  }
  e.append(h, L), e.pop();
}
e.delegate(["click"]);
var fe = e.from_html('<p class="sh3-fe-panel__empty svelte-1vm0wsq"> </p>'), he = e.from_html('<p class="sh3-fe-panel__empty svelte-1vm0wsq">Select a file or folder to see details.</p>'), ve = e.from_html('<span class="sh3-fe-panel__badge-detail svelte-1vm0wsq"> </span>'), ue = e.from_html('<li><span class="sh3-fe-panel__badge-icon svelte-1vm0wsq"> </span> <span class="sh3-fe-panel__badge-text svelte-1vm0wsq"><span class="sh3-fe-panel__badge-label svelte-1vm0wsq"> </span> <!></span></li>'), _e = e.from_html('<ul class="sh3-fe-panel__badges svelte-1vm0wsq"></ul>'), pe = e.from_html("<button> </button>"), ge = e.from_html('<div class="sh3-fe-panel__actions svelte-1vm0wsq"></div>'), me = e.from_html('<header class="sh3-fe-panel__header svelte-1vm0wsq"><div class="sh3-fe-panel__path svelte-1vm0wsq"> </div> <div class="sh3-fe-panel__shard svelte-1vm0wsq"> </div></header> <!> <!>', 1);
function be(h, t) {
  e.push(t, !0);
  let m = e.state(0);
  e.user_effect(() => t.store.ctx.contributions.onChange(Q, () => {
    e.update(m);
  }));
  const v = e.derived(() => {
    if (e.get(m), !t.store.ready || !t.store.selection) return [];
    const a = t.store.selection;
    return t.store.ctx.contributions.list(Q).filter((u) => !u.appliesTo || u.appliesTo(a));
  }), x = e.derived(() => {
    if (!t.store.ready || !t.store.selection) return null;
    const a = t.store.selection;
    if (a.kind === "file") {
      const c = t.store.documents.find((r) => r.shardId === a.shardId && r.path === a.path);
      return {
        shardId: a.shardId,
        path: a.path,
        kind: "file",
        lastModified: c == null ? void 0 : c.lastModified
      };
    }
    const u = a.path ? `${a.path}/` : "";
    let i = 0;
    for (const c of t.store.documents)
      c.shardId === a.shardId && (a.path === "" || c.path.startsWith(u)) && i++;
    return {
      shardId: a.shardId,
      path: a.path,
      kind: "folder",
      descendantCount: i
    };
  }), w = e.derived(() => t.store.ready && e.get(x) ? t.store.getBadgesFor(e.get(x)) : []);
  let I = e.proxy({});
  async function O(a, u) {
    if (!t.store.ready || !t.store.selection) return;
    const i = t.store.selection;
    I[a] = !0;
    try {
      await u(i);
    } catch (c) {
      console.error(`[sh3-file-explorer] action "${a}" threw:`, c), alert(`Action "${a}" failed: ${c instanceof Error ? c.message : String(c)}`);
    } finally {
      I[a] = !1;
    }
  }
  var E = e.comment(), A = e.first_child(E);
  {
    var V = (a) => {
      var u = fe(), i = e.child(u, !0);
      e.reset(u), e.template_effect(() => e.set_text(i, t.store.error.message)), e.append(a, u);
    }, W = (a) => {
      var u = he();
      e.append(a, u);
    }, L = (a) => {
      var u = me(), i = e.first_child(u), c = e.child(i), r = e.child(c, !0);
      e.reset(c);
      var s = e.sibling(c, 2), l = e.child(s, !0);
      e.reset(s), e.reset(i);
      var n = e.sibling(i, 2);
      {
        var b = (_) => {
          var f = _e();
          e.each(f, 21, () => e.get(w), ({ providerId: o, badge: p }) => o, (o, p) => {
            let d = () => e.get(p).badge;
            var y = ue(), q = e.child(y), S = e.child(q, !0);
            e.reset(q);
            var T = e.sibling(q, 2), j = e.child(T), N = e.child(j, !0);
            e.reset(j);
            var P = e.sibling(j, 2);
            {
              var M = (g) => {
                var k = ve(), B = e.child(k, !0);
                e.reset(k), e.template_effect(() => e.set_text(B, d().detail)), e.append(g, k);
              };
              e.if(P, (g) => {
                d().detail && g(M);
              });
            }
            e.reset(T), e.reset(y), e.template_effect(() => {
              e.set_class(y, 1, `sh3-fe-panel__badge sh3-fe-panel__badge--${d().tone ?? "ok" ?? ""}`, "svelte-1vm0wsq"), e.set_text(S, d().icon), e.set_text(N, d().label ?? d().tooltip ?? "");
            }), e.append(o, y);
          }), e.reset(f), e.append(_, f);
        };
        e.if(n, (_) => {
          e.get(w).length > 0 && _(b);
        });
      }
      var C = e.sibling(n, 2);
      {
        var F = (_) => {
          var f = ge();
          e.each(f, 21, () => e.get(v), (o) => o.id, (o, p) => {
            var d = pe();
            let y;
            var q = e.child(d, !0);
            e.reset(d), e.template_effect(() => {
              y = e.set_class(d, 1, "sh3-fe-panel__action svelte-1vm0wsq", null, y, { primary: e.get(p).kind === "primary" }), d.disabled = I[e.get(p).id], e.set_text(q, I[e.get(p).id] ? "…" : e.get(p).label);
            }), e.delegated("click", d, () => O(e.get(p).id, e.get(p).onInvoke)), e.append(o, d);
          }), e.reset(f), e.append(_, f);
        };
        e.if(C, (_) => {
          e.get(v).length > 0 && _(F);
        });
      }
      e.template_effect(() => {
        e.set_text(r, t.store.selection.path || "(shard root)"), e.set_text(l, t.store.selection.shardId);
      }), e.append(a, u);
    };
    e.if(A, (a) => {
      t.store.ready ? t.store.selection ? a(L, -1) : a(W, 1) : a(V);
    });
  }
  e.append(h, E), e.pop();
}
e.delegate(["click"]);
var ye = e.from_html('<div class="sh3-fe-browser svelte-sykudp"><div class="sh3-fe-browser__tree svelte-sykudp"><!></div> <div class="sh3-fe-browser__panel svelte-sykudp"><!></div></div>');
function xe(h, t) {
  var m = ye(), v = e.child(m), x = e.child(v);
  ce(x, {
    get store() {
      return t.store;
    }
  }), e.reset(v);
  var w = e.sibling(v, 2), I = e.child(w);
  be(I, {
    get store() {
      return t.store;
    }
  }), e.reset(w), e.reset(m), e.append(h, m);
}
let U = null, J = null;
const Ee = {
  manifest: {
    id: "sh3-file-explorer",
    label: "File Explorer",
    views: [
      { id: "sh3-file-explorer-browser", label: "Files", standalone: !0 }
    ],
    permissions: ["documents:browse"]
  },
  activate(h) {
    const t = ee(h);
    U = t, t.ready && (t.refreshDocuments(), J = t.startWatch()), h.registerView("sh3-file-explorer-browser", {
      mount(m) {
        const v = X(xe, { target: m, props: { store: t } });
        return { unmount() {
          Y(v);
        } };
      }
    });
  },
  deactivate() {
    J && (J(), J = null), U == null || U.dispose(), U = null;
  }
};
export {
  K as DOCUMENT_BADGE_POINT,
  Q as SELECTION_ACTION_POINT,
  Ie as app,
  Ee as shard
};
