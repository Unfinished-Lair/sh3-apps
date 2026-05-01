/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".cp-surface.svelte-7v5dlc{display:flex;flex-direction:column;gap:12px;padding:12px;background:var(--shell-bg-elevated);border-radius:6px;font-family:var(--shell-font-ui);width:fit-content}.cp-surface.disabled.svelte-7v5dlc{opacity:.5;pointer-events:none}.cp-main.svelte-7v5dlc{display:flex;gap:16px}.cp-left.svelte-7v5dlc{display:flex;flex-direction:column;gap:10px}.cp-right.svelte-7v5dlc{display:flex;flex-direction:column;min-width:180px}.cp-body.svelte-7v5dlc{display:flex;gap:8px}.cp-square.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:crosshair}.cp-strip.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-mode.svelte-7v5dlc{display:inline-flex;gap:0}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:3px 10px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);cursor:pointer}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):first-child{border-radius:4px 0 0 4px;border-right:none}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):last-child{border-radius:0 4px 4px 0}.cp-mode.svelte-7v5dlc button.active:where(.svelte-7v5dlc){background:var(--shell-accent, #3a7eff);color:var(--shell-bg)}.cp-sliders.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-label.svelte-7v5dlc{width:14px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-value.svelte-7v5dlc{width:40px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-range.svelte-7v5dlc{flex:1;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:8px;border-radius:4px;background:var(--track-bg, var(--shell-input-bg));outline:none;cursor:pointer}.cp-range.svelte-7v5dlc::-webkit-slider-thumb{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-range.svelte-7v5dlc::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-hex-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-preview.svelte-7v5dlc{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-7v5dlc{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-palette.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-palette-select.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;outline:none}.cp-palette-select.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-swatches.svelte-7v5dlc{display:grid;grid-template-columns:repeat(auto-fill,minmax(24px,1fr));gap:4px}.cp-swatch.svelte-7v5dlc{width:24px;height:24px;border-radius:4px;border:1px solid var(--shell-border);cursor:pointer;padding:0;outline:none}.cp-swatch.active.svelte-7v5dlc{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-palette-actions.svelte-7v5dlc{display:flex;gap:4px}.cp-palette-btn.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-palette-btn.svelte-7v5dlc:hover:not([disabled]){background:var(--shell-bg-sunken)}.cp-palette-btn[disabled].svelte-7v5dlc{opacity:.5;cursor:not-allowed}.cp-save-prompt.svelte-7v5dlc{display:flex;gap:4px;align-items:center}.cp-save-input.svelte-7v5dlc{flex:1;min-width:0;padding:3px 6px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:12px;font-family:inherit;outline:none}.cp-pick-title.svelte-1n3y1cm{font:var(--shell-font-ui);color:var(--shell-text-dim);padding:4px 8px;border-bottom:1px solid var(--shell-border-subtle, rgba(255, 255, 255, .1))}.toolbar.svelte-10sr5yt{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid var(--shell-border);background:var(--shell-bg-raised);font-family:var(--shell-font-ui);font-size:12px;flex-shrink:0}.toolbar-btn.svelte-10sr5yt{padding:2px 8px;border:1px solid var(--shell-border);border-radius:3px;background:var(--shell-bg);color:var(--shell-fg);font-size:11px;cursor:pointer;white-space:nowrap}.toolbar-btn.svelte-10sr5yt:hover:not(:disabled){background:var(--shell-bg-sunken)}.toolbar-btn.svelte-10sr5yt:disabled{opacity:.4;cursor:default}.toolbar-accent.svelte-10sr5yt{color:var(--shell-accent)}.toolbar-spacer.svelte-10sr5yt{flex:1}.toolbar-sep.svelte-10sr5yt{width:1px;height:16px;background:var(--shell-border)}.toolbar-path.svelte-10sr5yt{color:var(--shell-fg-muted);font-family:var(--shell-font-mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body.svelte-1etykqv{padding:var(--shell-pad-lg);display:flex;flex-direction:column;gap:var(--shell-pad-md);min-width:320px;font-family:var(--shell-font-ui)}h2.svelte-1etykqv{margin:0;font-size:16px;color:var(--shell-fg)}.rows.svelte-1etykqv{display:flex;flex-direction:column;gap:var(--shell-pad-sm)}.row.svelte-1etykqv{display:flex;align-items:center;justify-content:space-between;gap:var(--shell-pad-md);font-size:13px}.label.svelte-1etykqv{color:var(--shell-fg-muted)}.seg.svelte-1etykqv{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;padding:4px 10px;background:var(--shell-bg);color:var(--shell-fg);border:none;font-size:12px;cursor:pointer}.seg.svelte-1etykqv button:where(.svelte-1etykqv)+button:where(.svelte-1etykqv){border-left:1px solid var(--shell-border)}.seg.svelte-1etykqv button.active:where(.svelte-1etykqv){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-1etykqv button:where(.svelte-1etykqv):hover:not(.active){background:var(--shell-bg-sunken)}.actions.svelte-1etykqv{display:flex;justify-content:flex-end;gap:var(--shell-pad-sm)}.actions.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:var(--shell-radius-sm);cursor:pointer}.actions.svelte-1etykqv button:where(.svelte-1etykqv):hover{background:var(--shell-accent)}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv){background:transparent}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv):hover{background:var(--shell-bg-sunken)}.editor-container.svelte-1j4uh1h{display:flex;flex-direction:column;height:100%;position:relative}.editor-wrap.svelte-1j4uh1h{display:flex;height:100%;overflow:hidden;background:var(--shell-bg-sunken);font-family:var(--shell-font-mono);font-size:var(--editor-font-size, 13px);line-height:1.6;color:var(--shell-fg)}.gutter.svelte-1j4uh1h{flex-shrink:0;width:3.5em;background:var(--shell-bg-sunken);border-right:1px solid var(--shell-border);overflow:hidden;color:var(--shell-fg-muted);font-size:inherit;line-height:inherit;-webkit-user-select:none;user-select:none}.gutter-inner.svelte-1j4uh1h{text-align:right;padding:0 .5em 0 0}.line-num.svelte-1j4uh1h{font-size:.85em;height:1lh;line-height:1lh}.editor-body.svelte-1j4uh1h{position:relative;flex:1;overflow:hidden}.highlight-layer.svelte-1j4uh1h{position:absolute;top:0;left:0;margin:0;padding:0 .75em;white-space:pre;word-wrap:normal;overflow:visible;pointer-events:none;font-family:inherit;font-size:inherit;line-height:inherit;color:var(--shell-fg);-moz-tab-size:2;tab-size:2}.input-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:0;padding:0 .75em;background:transparent;border:none;outline:none;resize:none;font-family:inherit;font-size:inherit;line-height:inherit;color:transparent;caret-color:var(--shell-fg);white-space:pre;word-wrap:normal;overflow:auto;-moz-tab-size:2;tab-size:2;box-sizing:border-box}.input-layer.svelte-1j4uh1h::selection{background:#61afef40}.hl-keyword{color:#c678dd}.hl-type{color:#e5c07b}.hl-string{color:#98c379}.hl-number,.hl-bool{color:#d19a66}.hl-comment{color:#5c6370;font-style:italic}.hl-key{color:#e06c75}.hl-context{color:#56b6c2}.hl-parent,.hl-ref{color:#61afef}.hl-punct{color:var(--shell-fg-muted)}.hl-code{color:#abb2bf}.hl-heading{color:#e5c07b;font-weight:600}.hl-bold{font-weight:600}.field.svelte-2gtehg{display:grid;grid-template-columns:minmax(4em,12em) 1fr;column-gap:.75em;align-items:center;padding:.15em .5em;font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg)}.label.svelte-2gtehg{color:var(--shell-fg-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.readonly.svelte-2gtehg .value:where(.svelte-2gtehg){color:var(--shell-fg-muted)}.primitive.svelte-1o84d6l{background:var(--shell-bg-sunken);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:2px;padding:.1em .3em;font-family:var(--shell-font-mono);font-size:13px;width:100%;box-sizing:border-box}.primitive.svelte-1o84d6l:focus{outline:1px solid var(--shell-accent, #61afef)}.primitive.svelte-1o84d6l:disabled{color:var(--shell-fg-muted);cursor:default}.walker.svelte-1xvtj10{display:flex;flex-direction:column;gap:.1em;padding:.25em 0}.leaf.svelte-o6duey{font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg-muted)}.inspector-container.svelte-jpxkcf{display:flex;flex-direction:column;height:100%;background:var(--shell-bg-sunken);color:var(--shell-fg);font-family:var(--shell-font-mono);font-size:13px;outline:none}.inspector-body.svelte-jpxkcf{flex:1;overflow:auto;padding:.5em 0}.cp.svelte-f5c5rv{display:flex;flex-direction:column;border:1px solid var(--shell-border);border-radius:6px;width:fit-content}.cp.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact.svelte-f5c5rv{position:relative;display:inline-block;font-family:var(--shell-font-ui)}.cp-compact.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact-row.svelte-f5c5rv{display:flex;align-items:center;gap:6px}.cp-compact-preview.svelte-f5c5rv{width:20px;height:20px;cursor:pointer;border:1px solid var(--shell-border);border-radius:4px;flex-shrink:0;outline:none}.cp-compact-preview.svelte-f5c5rv:focus-visible{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-preview.svelte-f5c5rv{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-f5c5rv{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-f5c5rv:focus{border-color:var(--shell-accent, #3a7eff)}.cp-compact-hex.svelte-f5c5rv{width:90px;font-size:12px}.cp-leaf-fallback.svelte-1tdr2l8{font-family:var(--shell-font-mono, monospace);color:var(--shell-text-dim)}.section.svelte-18qjjuf{padding-bottom:var(--shell-pad-md);margin-bottom:var(--shell-pad-md);border-bottom:1px solid var(--shell-border)}.section.svelte-18qjjuf:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0}.section-label.svelte-18qjjuf{margin:0 0 var(--shell-pad-sm);font-size:11px;font-weight:600;color:var(--shell-accent);text-transform:uppercase;letter-spacing:.08em;font-family:var(--shell-font-ui)}.rows.svelte-18qjjuf{display:flex;flex-direction:column}.row.svelte-1rh69ln{display:grid;grid-template-columns:200px 1fr;column-gap:var(--shell-pad-md);align-items:center;padding:var(--shell-pad-sm) 0;font-family:var(--shell-font-ui);font-size:13px;color:var(--shell-fg)}.row.disabled.svelte-1rh69ln{opacity:.5;pointer-events:none}.label.svelte-1rh69ln{color:var(--shell-fg)}.desc.svelte-1rh69ln{font-size:11px;color:var(--shell-fg-muted);margin-top:2px}.control.svelte-1rh69ln{display:flex;align-items:center;gap:var(--shell-pad-sm)}.error.svelte-1rh69ln{grid-column:2;font-size:11px;color:var(--shell-error, #ff7a7a);margin-top:4px}.toggle.svelte-ert2i6{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:34px;height:18px;background:var(--shell-border);border:none;border-radius:9px;position:relative;cursor:pointer;padding:0;transition:background .1s}.toggle.on.svelte-ert2i6{background:var(--shell-accent)}.toggle[disabled].svelte-ert2i6{cursor:not-allowed}.knob.svelte-ert2i6{position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:left .1s}.toggle.on.svelte-ert2i6 .knob:where(.svelte-ert2i6){left:18px}.input.svelte-1jljyjf{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:100%;box-sizing:border-box}.input.svelte-1jljyjf:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1jljyjf{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1jljyjf{cursor:not-allowed}.input.svelte-1be7g0v{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:90px;box-sizing:border-box}.input.svelte-1be7g0v:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1be7g0v{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1be7g0v{cursor:not-allowed}.unit.svelte-1be7g0v{font-size:11px;color:var(--shell-fg-muted)}.slider.svelte-1jyn88{flex:1;accent-color:var(--shell-accent);cursor:pointer}.slider[disabled].svelte-1jyn88{cursor:not-allowed}.slider.error.svelte-1jyn88{accent-color:var(--shell-error, #ff7a7a)}.value.svelte-1jyn88{min-width:56px;text-align:right;font-size:12px;color:var(--shell-accent);font-variant-numeric:tabular-nums}.seg.svelte-iu603z{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.error.svelte-iu603z{border-color:var(--shell-error, #ff7a7a)}.seg.svelte-iu603z button:where(.svelte-iu603z){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 10px;background:var(--shell-bg-sunken);color:var(--shell-fg);border:none;cursor:pointer}.seg.svelte-iu603z button:where(.svelte-iu603z)+button:where(.svelte-iu603z){border-left:1px solid var(--shell-border)}.seg.svelte-iu603z button.active:where(.svelte-iu603z){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-iu603z button:where(.svelte-iu603z):hover:not(.active):not([disabled]){background:var(--shell-bg)}.seg.svelte-iu603z button[disabled]:where(.svelte-iu603z){cursor:not-allowed}.settings.svelte-mrn94a{padding:var(--shell-pad-lg);font-family:var(--shell-font-ui);color:var(--shell-fg);background:var(--shell-bg);min-height:100%;box-sizing:border-box}.title.svelte-mrn94a{margin:0 0 var(--shell-pad-md);font-size:16px;font-weight:600}.empty.svelte-mrn94a{color:var(--shell-fg-muted);font-style:italic;padding:var(--shell-pad-md) 0}.hotkeys-tab.svelte-151qe3m{padding:12px 16px;color:var(--shell-fg)}.ctx.svelte-151qe3m{font-size:12px;opacity:.8;margin-bottom:12px}.ctx.svelte-151qe3m code:where(.svelte-151qe3m){font-family:var(--shell-mono, monospace)}.group.svelte-151qe3m{margin-bottom:16px}.group-title.svelte-151qe3m{font-size:13px;font-weight:600;margin:0 0 6px;opacity:.9}.list.svelte-151qe3m{list-style:none;margin:0;padding:0}.row.svelte-151qe3m{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;padding:4px 0;border-bottom:1px solid var(--shell-border, #2a2a2a)}.row.disabled.svelte-151qe3m{opacity:.5}.label.svelte-151qe3m{font-size:13px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kbd.svelte-151qe3m{font-family:var(--shell-mono, monospace);font-size:12px;padding:2px 6px;border-radius:3px;background:var(--shell-surface-2, #2a2a2a)}.badge.svelte-151qe3m{font-size:11px;opacity:.6;font-family:var(--shell-mono, monospace)}.empty.svelte-151qe3m{opacity:.6;padding:16px 0}.help-root.svelte-udgkd3{display:flex;flex-direction:column;height:100%;min-height:320px;background:var(--shell-surface, #1a1a1a);color:var(--shell-fg)}.modal-surface.svelte-udgkd3{width:640px;max-width:90vw;height:480px;max-height:80vh}.help-header.svelte-udgkd3{display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid var(--shell-border, #2a2a2a)}.title.svelte-udgkd3{font-weight:600;flex:1}.close-btn.svelte-udgkd3{background:none;border:none;color:var(--shell-fg);font-size:18px;cursor:pointer;padding:0 8px;line-height:1}.tab-strip.svelte-udgkd3{display:flex;gap:2px;padding:6px 8px 0;border-bottom:1px solid var(--shell-border, #2a2a2a);background:var(--shell-surface-2, transparent)}.tab-btn.svelte-udgkd3{background:transparent;border:none;color:var(--shell-fg);padding:6px 12px;cursor:pointer;font-size:13px;border-bottom:2px solid transparent;display:inline-flex;gap:4px;align-items:center}.tab-btn.svelte-udgkd3:hover{background:var(--shell-hover, rgba(255,255,255,.05))}.tab-btn.active.svelte-udgkd3{border-bottom-color:var(--shell-accent, #3ba3ff);font-weight:600}.tab-icon.svelte-udgkd3{font-size:14px}.tab-bodies.svelte-udgkd3{flex:1;overflow:hidden;position:relative}.tab-body.svelte-udgkd3{position:absolute;top:0;right:0;bottom:0;left:0;overflow-y:auto;overflow-x:hidden;display:none}.tab-body.active.svelte-udgkd3{display:block}.loading.svelte-udgkd3{padding:16px;opacity:.6}.graph-node.svelte-y92dsd{position:absolute;background:var(--sh3-surface-1, #1f1f1f);border:1px solid var(--border-color);border-radius:4px;color:var(--text-color);-webkit-user-select:none;user-select:none;box-shadow:0 2px 4px #0000004d;pointer-events:auto}.graph-node.selected.svelte-y92dsd{outline:2px solid var(--sh3-accent, #4a9eff);outline-offset:1px}.header.svelte-y92dsd{padding:4px 8px;cursor:grab;font-weight:600;border-bottom:1px solid var(--border-color);display:flex;gap:6px;align-items:center}.header.svelte-y92dsd:active{cursor:grabbing}.ports.svelte-y92dsd{display:flex;justify-content:space-between;padding:6px 0}.ports-col.svelte-y92dsd{display:flex;flex-direction:column;gap:4px;min-width:50%}.ports-col.inputs.svelte-y92dsd{align-items:flex-start}.ports-col.outputs.svelte-y92dsd{align-items:flex-end}.port.svelte-y92dsd{display:flex;align-items:center;gap:4px;padding:0 4px;font-size:.85em;cursor:crosshair}.port-marker.svelte-y92dsd{width:10px;height:10px;border-radius:50%;background:var(--border-color);border:1px solid rgba(255,255,255,.4)}.input.svelte-y92dsd .port-marker:where(.svelte-y92dsd){margin-left:-10px}.output.svelte-y92dsd .port-marker:where(.svelte-y92dsd){margin-right:-10px}.edge.svelte-1rehop2{cursor:pointer}.line.svelte-1rehop2{fill:none;stroke-width:2}.halo.svelte-1rehop2{fill:none;stroke:var(--sh3-accent, #4a9eff);stroke-width:6;opacity:.4}.selected.svelte-1rehop2 .line:where(.svelte-1rehop2){stroke-width:3}.palette.svelte-lpiq26{position:absolute;z-index:10;background:var(--sh3-surface-2, #2a2a2a);border:1px solid var(--sh3-border, #444);border-radius:4px;padding:4px;width:240px;max-height:320px;display:flex;flex-direction:column;box-shadow:0 4px 12px #0006}.search.svelte-lpiq26{padding:4px;border:1px solid var(--sh3-border, #444);border-radius:3px;background:var(--sh3-surface-1, #1f1f1f);color:var(--sh3-text-primary, #ddd)}.lists.svelte-lpiq26{overflow-y:auto;margin-top:4px}.cat-name.svelte-lpiq26{padding:4px 6px 2px;font-size:.75em;text-transform:uppercase;opacity:.6}.item.svelte-lpiq26{display:block;width:100%;text-align:left;padding:4px 6px;background:transparent;border:0;color:var(--sh3-text-primary, #ddd);cursor:pointer}.item.svelte-lpiq26:hover{background:var(--sh3-hover, #333)}.toolbar.svelte-ypcyd2{position:absolute;top:8px;right:8px;z-index:5;display:flex;gap:2px;background:var(--sh3-surface-1, #1f1f1f);border:1px solid var(--sh3-border, #444);border-radius:4px;padding:2px;box-shadow:0 2px 6px #00000059}button.svelte-ypcyd2{min-width:24px;height:24px;padding:0 6px;background:transparent;color:var(--sh3-text-primary, #ddd);border:0;border-radius:3px;cursor:pointer;font-size:.85em;line-height:1}button.svelte-ypcyd2:hover{background:var(--sh3-hover, #333)}.zoom-label.svelte-ypcyd2{min-width:44px;font-variant-numeric:tabular-nums}.graph-canvas.svelte-x16tu1{position:relative;width:100%;height:100%;overflow:hidden;background:var(--sh3-surface-0, #161616);background-image:linear-gradient(var(--sh3-grid, #2a2a2a) 1px,transparent 1px),linear-gradient(90deg,var(--sh3-grid, #2a2a2a) 1px,transparent 1px);background-size:20px 20px;outline:none}.edge-overlay.svelte-x16tu1{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none}.edge-overlay.svelte-x16tu1 g.edge{pointer-events:stroke}.viewport.svelte-x16tu1{position:absolute;top:0;right:0;bottom:0;left:0;transform-origin:0 0;pointer-events:none}.graph-empty.svelte-1dbihe0{padding:1.5rem;color:var(--sh3-text-secondary, #888);font-family:var(--sh3-font-ui, system-ui)}h2.svelte-1dbihe0{margin:0 0 .5rem;color:var(--sh3-text-primary, #ddd)}h3.svelte-1dbihe0{margin:1.5rem 0 .5rem;font-size:.9rem;text-transform:uppercase;letter-spacing:.06em}.hint.svelte-1dbihe0{margin:0 0 .5rem}.domain-list.svelte-1dbihe0{list-style:none;padding:0;margin:0}.domain-list.svelte-1dbihe0 li:where(.svelte-1dbihe0){padding:.25rem 0;font-size:.9rem}.domain-list.svelte-1dbihe0 code:where(.svelte-1dbihe0){color:var(--sh3-text-primary, #ddd)}.dash.svelte-1dbihe0{margin:0 .5em;opacity:.6}.label.svelte-1dbihe0{color:var(--sh3-text-secondary, #aaa)}.warn.svelte-1dbihe0{color:var(--sh3-warn, #d6a13a)}.graph-error.svelte-39j3n{padding:1.5rem;color:var(--sh3-warn, #d6a13a);font-family:var(--sh3-font-ui, system-ui)}.graph-error.svelte-39j3n h2:where(.svelte-39j3n){margin:0 0 .5rem}";
  document.head.appendChild(s);
})();
var Si = Object.defineProperty;
var Pi = Object.getPrototypeOf;
var Ei = Reflect.get;
var xr = (n) => {
  throw TypeError(n);
};
var Ti = (n, t, r) => t in n ? Si(n, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[t] = r;
var ae = (n, t, r) => Ti(n, typeof t != "symbol" ? t + "" : t, r), Hn = (n, t, r) => t.has(n) || xr("Cannot " + r);
var x = (n, t, r) => (Hn(n, t, "read from private field"), r ? r.call(n) : t.get(n)), K = (n, t, r) => t.has(n) ? xr("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(n) : t.set(n, r), St = (n, t, r, i) => (Hn(n, t, "write to private field"), i ? i.call(n, r) : t.set(n, r), r), ne = (n, t, r) => (Hn(n, t, "access private method"), r);
var Cr = (n, t, r) => Ei(Pi(n), r, t);
import { shell as on, getActiveApp as Ai, COLOR_PICKER_POINT as Di } from "sh3-core";
import { onMount as Dn, onDestroy as jr, mount as mt, unmount as st } from "svelte";
import * as e from "svelte/internal/client";
const Mi = 2, Ri = "inline";
function Ni(n, t) {
  return {
    indentUnit: (t == null ? void 0 : t.indentUnit) ?? (n == null ? void 0 : n.indentUnit) ?? Mi,
    braceStyle: (t == null ? void 0 : t.braceStyle) ?? (n == null ? void 0 : n.braceStyle) ?? Ri
  };
}
class Oi {
  constructor(t) {
    ae(this, "entries", /* @__PURE__ */ new Map());
    ae(this, "onClose");
    this.onClose = t;
  }
  open(t, r) {
    if (this.entries.has(t))
      return this.entries.get(t);
    const s = {
      document: e.proxy({
        id: t,
        content: r.content,
        filePath: r.filePath ?? null,
        cursorStart: 0,
        cursorEnd: 0,
        scrollTop: 0,
        scrollLeft: 0,
        dirty: !1,
        language: r.language ?? null
      }),
      options: r,
      prefs: Ni(r.matchingConfig, r.prefs)
    };
    return this.entries.set(t, s), s;
  }
  close(t) {
    const r = this.entries.delete(t);
    return r && this.onClose && this.onClose(t), r;
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
    if (this.entries.clear(), this.onClose) for (const r of t) this.onClose(r);
  }
}
var rn;
class zi {
  constructor(t) {
    ae(this, "entries", /* @__PURE__ */ new Map());
    K(this, rn, e.state(0));
    ae(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(x(this, rn));
  }
  set version(t) {
    e.set(x(this, rn), t, !0);
  }
  open(t, r) {
    const i = this.entries.get(t);
    if (i) return i;
    const s = { value: r.value, meta: r.meta, options: r };
    return this.entries.set(t, s), this.version++, s;
  }
  close(t) {
    const r = this.entries.delete(t);
    return r && (this.version++, this.onClose && this.onClose(t)), r;
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
    if (this.entries.clear(), t.length > 0 && this.version++, this.onClose) for (const r of t) this.onClose(r);
  }
}
rn = new WeakMap();
const Hi = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
function Et({ h: n, s: t, v: r }) {
  const i = t / 100, s = r / 100, l = s * i, a = l * (1 - Math.abs(n / 60 % 2 - 1)), d = s - l;
  let c = 0, o = 0, u = 0;
  return n < 60 ? (c = l, o = a) : n < 120 ? (c = a, o = l) : n < 180 ? (o = l, u = a) : n < 240 ? (o = a, u = l) : n < 300 ? (c = a, u = l) : (c = l, u = a), {
    r: Math.round((c + d) * 255),
    g: Math.round((o + d) * 255),
    b: Math.round((u + d) * 255)
  };
}
function Ui({ r: n, g: t, b: r }) {
  const i = n / 255, s = t / 255, l = r / 255, a = Math.max(i, s, l), d = Math.min(i, s, l), c = a - d;
  let o = 0;
  c !== 0 && (a === i ? o = 60 * ((s - l) / c % 6) : a === s ? o = 60 * ((l - i) / c + 2) : o = 60 * ((i - s) / c + 4)), o < 0 && (o += 360);
  const u = a === 0 ? 0 : c / a * 100, p = a * 100;
  return { h: Math.round(o), s: Math.round(u), v: Math.round(p) };
}
function Tt({ r: n, g: t, b: r }) {
  const i = (s) => s.toString(16).padStart(2, "0");
  return `#${i(n)}${i(t)}${i(r)}`;
}
function Li(n) {
  let t = n.replace(/^#/, "");
  t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]);
  const r = parseInt(t, 16);
  return { r: r >> 16 & 255, g: r >> 8 & 255, b: r & 255 };
}
function jt(n) {
  return Tt(Et(n));
}
function gt(n) {
  return Ui(Li(n));
}
function Vi(n) {
  return Hi.test(n);
}
function Ue(n) {
  if (!Vi(n)) return null;
  let t = n.replace(/^#/, "").toLowerCase();
  return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), `#${t}`;
}
var sn;
class Fi {
  constructor(t) {
    ae(this, "entries", /* @__PURE__ */ new Map());
    K(this, sn, e.state(0));
    ae(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(x(this, sn));
  }
  set version(t) {
    e.set(x(this, sn), t, !0);
  }
  open(t, r) {
    const i = this.entries.get(t);
    if (i) return i;
    const l = { value: Ue(r.value) ?? "#000000", options: r };
    return this.entries.set(t, l), this.version++, l;
  }
  close(t) {
    const r = this.entries.delete(t);
    return r && (this.version++, this.onClose && this.onClose(t)), r;
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
    if (this.entries.clear(), t.length > 0 && this.version++, this.onClose) for (const r of t) this.onClose(r);
  }
}
sn = new WeakMap();
const Bi = 200;
class qi {
  constructor(t = Bi) {
    ae(this, "undoStack", []);
    ae(this, "redoStack", []);
    ae(this, "maxDepth");
    ae(this, "listeners", /* @__PURE__ */ new Set());
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
function wn(n) {
  const { setter: t, before: r, after: i, cursorBefore: s, cursorAfter: l, now: a } = n;
  return {
    apply: () => t(i, l),
    revert: () => t(r, s),
    meta: {
      kind: "text-swap",
      timestamp: a,
      snapshot: { before: r, after: i, cursorBefore: s, cursorAfter: l }
    }
  };
}
class ji {
  constructor() {
    ae(this, "engines", /* @__PURE__ */ new Map());
  }
  get(t) {
    let r = this.engines.get(t);
    return r || (r = new qi(), this.engines.set(t, r)), r;
  }
  release(t) {
    this.engines.delete(t);
  }
  clear() {
    this.engines.clear();
  }
}
class vt {
  constructor() {
    ae(this, "listeners", /* @__PURE__ */ new Set());
  }
  on(t) {
    return this.listeners.add(t), () => {
      this.listeners.delete(t);
    };
  }
  emit(...t) {
    for (const r of this.listeners) r(...t);
  }
  clear() {
    this.listeners.clear();
  }
}
function Gi(n, t, r) {
  const i = n.get(t);
  return {
    push(l) {
      i.push(l), r();
    },
    undo() {
      const l = i.undo();
      return l && r(), l;
    },
    redo() {
      const l = i.redo();
      return l && r(), l;
    },
    peek() {
      return i.peek();
    },
    replaceTop(l) {
      const a = i.replaceTop(l);
      return a && r(), a;
    },
    get canUndo() {
      return i.canUndo;
    },
    get canRedo() {
      return i.canRedo;
    },
    clear() {
      i.clear(), r();
    },
    onChange(l) {
      return i.onChange(l);
    }
  };
}
const Ki = 300;
function Wi(n) {
  const t = new vt(), r = new vt(), i = new vt(), s = new vt(), l = new vt(), a = new vt(), d = new vt(), c = new ji(), o = new zi((h) => {
    c.release(h);
  }), u = new Fi((h) => {
    c.release(h);
  }), p = /* @__PURE__ */ new Map();
  function y(h) {
    let m = p.get(h);
    return m || (m = Gi(c, h, () => {
      var k;
      if (o.has(h) && l.emit(h, ((k = o.get(h)) == null ? void 0 : k.value) ?? null), u.has(h)) {
        const C = u.get(h);
        C && a.emit(h, C.value);
      }
    }), p.set(h, m)), m;
  }
  function g(h) {
    c.release(h), p.delete(h);
  }
  return { api: {
    getContent(h) {
      const m = n.get(h);
      return m ? m.document.content : null;
    },
    isDirty(h) {
      const m = n.get(h);
      return m ? m.document.dirty : !1;
    },
    getDocument(h) {
      const m = n.get(h);
      return m ? m.document : null;
    },
    listInstances() {
      return n.list();
    },
    openDocument(h, m) {
      n.open(h, m);
    },
    closeDocument(h) {
      n.close(h) && g(h);
    },
    updateContent(h, m, k, C) {
      var Y, re;
      const P = n.get(h);
      if (!P) return;
      const A = P.document, E = A.content;
      if (E === m) return;
      const R = A.cursorStart, U = (X, de) => {
        A.content = X, A.cursorStart = de, A.cursorEnd = de, t.emit(h, X);
      };
      A.content = m, A.cursorStart = k, A.cursorEnd = C;
      const O = y(h), B = Date.now(), G = O.peek(), D = ((Y = G == null ? void 0 : G.meta) == null ? void 0 : Y.kind) === "text-swap" ? G.meta.snapshot : void 0, z = Math.abs(m.length - E.length) <= 1, W = D && ((re = G == null ? void 0 : G.meta) == null ? void 0 : re.timestamp) != null && B - G.meta.timestamp < Ki;
      D && z && W ? O.replaceTop(wn({
        setter: U,
        before: D.before,
        after: m,
        cursorBefore: D.cursorBefore,
        cursorAfter: k,
        now: B
      })) : O.push(wn({
        setter: U,
        before: E,
        after: m,
        cursorBefore: R,
        cursorAfter: k,
        now: B
      }));
      const V = A.dirty;
      A.dirty = !0, t.emit(h, m), V || r.emit(h, !0);
    },
    markClean(h) {
      const m = n.get(h);
      m && m.document.dirty && (m.document.dirty = !1, r.emit(h, !1));
    },
    onContentChange(h) {
      return t.on(h);
    },
    onDirtyChange(h) {
      return r.on(h);
    },
    onSave(h) {
      return i.on(h);
    },
    onPrefsChange(h) {
      return s.on(h);
    },
    openInspector(h, m) {
      o.open(h, m);
    },
    closeInspector(h) {
      o.close(h) && g(h);
    },
    getInspectorValue(h) {
      var m;
      return ((m = o.get(h)) == null ? void 0 : m.value) ?? null;
    },
    listInspectorInstances() {
      return o.list();
    },
    onInspectorValueChange(h) {
      return l.on(h);
    },
    openColorPicker(h, m) {
      u.open(h, m);
    },
    closeColorPicker(h) {
      u.close(h) && g(h);
    },
    getColorPickerValue(h) {
      var m;
      return ((m = u.get(h)) == null ? void 0 : m.value) ?? null;
    },
    listColorPickerInstances() {
      return u.list();
    },
    onColorPickerValueChange(h) {
      return a.on(h);
    },
    onColorPickerPrefsChange(h) {
      return d.on(h);
    },
    history: y
  }, internals: {
    emitSave(h) {
      i.emit(h);
    },
    contentChange: t,
    dirtyChange: r,
    saveEvent: i,
    prefsChange: s,
    inspectorValueChange: l,
    colorPickerValueChange: a,
    colorPickerPrefsChange: d,
    history: y,
    inspectors: o,
    colorPickers: u
  }, teardown: () => {
    t.clear(), r.clear(), i.clear(), s.clear(), l.clear(), a.clear(), d.clear(), c.clear(), p.clear(), o.clear(), u.clear();
  } };
}
const Un = "sh3-editor.inspectorRenderer", Yi = "5";
var qr;
typeof window < "u" && ((qr = window.__svelte ?? (window.__svelte = {})).v ?? (qr.v = /* @__PURE__ */ new Set())).add(Yi);
const Ln = [
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
var Xi = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">H</span> <input type="range" min="0" max="360" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">S</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">V</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), Zi = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">R</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">G</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">B</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), Ji = e.from_html("<option> </option>"), Qi = e.from_html('<button type="button"></button>'), $i = e.from_html('<div class="cp-save-prompt svelte-7v5dlc"><input type="text" class="cp-save-input svelte-7v5dlc" placeholder="Palette name"/> <button type="button" class="cp-palette-btn svelte-7v5dlc">OK</button> <button type="button" class="cp-palette-btn svelte-7v5dlc">Cancel</button></div>'), es = e.from_html('<div role="group" aria-label="Color picker"><div class="cp-main svelte-7v5dlc"><div class="cp-left svelte-7v5dlc"><div class="cp-body svelte-7v5dlc"><canvas class="cp-square svelte-7v5dlc" role="slider" aria-label="Saturation and value"></canvas> <canvas class="cp-strip svelte-7v5dlc" role="slider" aria-label="Hue"></canvas></div> <div class="cp-mode svelte-7v5dlc"><button type="button">HSV</button> <button type="button">RGB</button></div> <!> <div class="cp-hex-row svelte-7v5dlc"><div class="cp-preview svelte-7v5dlc"></div> <input type="text" class="cp-hex-input svelte-7v5dlc" aria-label="Hex value"/></div></div> <div class="cp-right svelte-7v5dlc"><div class="cp-palette svelte-7v5dlc"><select class="cp-palette-select svelte-7v5dlc" aria-label="Palette"></select> <div class="cp-swatches svelte-7v5dlc"></div> <div class="cp-palette-actions svelte-7v5dlc"><button type="button" class="cp-palette-btn svelte-7v5dlc" title="Save current color to a palette">+ Save</button> <button type="button" class="cp-palette-btn cp-delete svelte-7v5dlc">Delete</button></div> <!></div></div></div></div>');
function Gn(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "readonly", 3, !1), i = e.prop(t, "initialMode", 3, "hsv"), s = e.prop(t, "userPalettes", 19, () => []);
  const l = 180, a = 20, d = Ue(t.value) ?? "#000000";
  let c = e.state(e.proxy(gt(d))), o = d, u = e.state(e.proxy(i()));
  e.user_effect(() => {
    const b = Ue(t.value) ?? "#000000";
    b !== o && (e.set(c, gt(b), !0), o = b, e.set(L, b.toUpperCase(), !0));
  });
  function p(b) {
    const S = Ue(b);
    S && S !== o && (o = S, t.onChange(S));
  }
  function y() {
    p(jt(e.get(c)));
  }
  let g = e.state(void 0), f = e.state(void 0);
  const v = typeof window < "u" && window.devicePixelRatio || 1;
  function _() {
    if (!e.get(g)) return;
    const b = l, S = l;
    e.get(g).width = b * v, e.get(g).height = S * v, e.get(g).style.width = b + "px", e.get(g).style.height = S + "px";
    const N = e.get(g).getContext("2d"), F = N.createImageData(b * v, S * v), Q = F.data;
    for (let $ = 0; $ < S * v; $++)
      for (let pe = 0; pe < b * v; pe++) {
        const te = pe / v / b * 100, Oe = (1 - $ / v / S) * 100, Ie = Et({ h: e.get(c).h, s: te, v: Oe }), Je = ($ * b * v + pe) * 4;
        Q[Je] = Ie.r, Q[Je + 1] = Ie.g, Q[Je + 2] = Ie.b, Q[Je + 3] = 255;
      }
    N.putImageData(F, 0, 0), h();
  }
  function h() {
    if (!e.get(g)) return;
    const b = e.get(g).getContext("2d"), S = e.get(c).s / 100 * l, N = (1 - e.get(c).v / 100) * l;
    b.save(), b.scale(v, v), b.beginPath(), b.arc(S, N, 6, 0, Math.PI * 2), b.strokeStyle = "#ffffff", b.lineWidth = 2, b.stroke(), b.beginPath(), b.arc(S, N, 7, 0, Math.PI * 2), b.strokeStyle = "#000000", b.lineWidth = 1, b.stroke(), b.restore();
  }
  function m() {
    if (!e.get(f)) return;
    const b = a, S = l;
    e.get(f).width = b * v, e.get(f).height = S * v, e.get(f).style.width = b + "px", e.get(f).style.height = S + "px";
    const N = e.get(f).getContext("2d"), F = N.createImageData(b * v, S * v), Q = F.data;
    for (let $ = 0; $ < S * v; $++) {
      const pe = $ / (S * v) * 360, te = Et({ h: pe, s: 100, v: 100 });
      for (let Oe = 0; Oe < b * v; Oe++) {
        const Ie = ($ * b * v + Oe) * 4;
        Q[Ie] = te.r, Q[Ie + 1] = te.g, Q[Ie + 2] = te.b, Q[Ie + 3] = 255;
      }
    }
    N.putImageData(F, 0, 0), k();
  }
  function k() {
    if (!e.get(f)) return;
    const b = e.get(f).getContext("2d"), S = e.get(c).h / 360 * l;
    b.save(), b.scale(v, v), b.beginPath(), b.moveTo(0, S), b.lineTo(a, S), b.strokeStyle = "#ffffff", b.lineWidth = 2, b.stroke(), b.beginPath(), b.moveTo(0, S), b.lineTo(a, S), b.strokeStyle = "#000000", b.lineWidth = 1, b.stroke(), b.restore();
  }
  Dn(() => {
    _(), m();
  });
  let C = e.state(e.proxy(e.get(c).h));
  e.user_effect(() => {
    e.get(c).h !== e.get(C) ? (e.set(C, e.get(c).h, !0), _(), m()) : _();
  });
  let P = e.state(!1), A = e.state(!1);
  function E(b) {
    if (r() || !e.get(g)) return;
    const S = e.get(g).getBoundingClientRect(), N = Math.max(0, Math.min(l, b.clientX - S.left)), F = Math.max(0, Math.min(l, b.clientY - S.top)), Q = N / l * 100, $ = (1 - F / l) * 100;
    e.set(c, { h: e.get(c).h, s: Math.round(Q), v: Math.round($) }, !0);
  }
  function R(b) {
    if (r() || !e.get(f)) return;
    const S = e.get(f).getBoundingClientRect(), F = Math.max(0, Math.min(l, b.clientY - S.top)) / l * 360;
    e.set(c, { h: Math.round(F), s: e.get(c).s, v: e.get(c).v }, !0);
  }
  function U(b) {
    r() || (e.set(P, !0), E(b), window.addEventListener("mousemove", B), window.addEventListener("mouseup", G));
  }
  function O(b) {
    r() || (e.set(A, !0), R(b), window.addEventListener("mousemove", B), window.addEventListener("mouseup", G));
  }
  function B(b) {
    e.get(P) ? E(b) : e.get(A) && R(b);
  }
  function G() {
    (e.get(P) || e.get(A)) && p(jt(e.get(c))), e.set(P, !1), e.set(A, !1), window.removeEventListener("mousemove", B), window.removeEventListener("mouseup", G);
  }
  const D = "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)", z = e.derived(() => `linear-gradient(to right, #ffffff, ${Tt(Et({ h: e.get(c).h, s: 100, v: e.get(c).v }))})`), W = e.derived(() => `linear-gradient(to right, #000000, ${Tt(Et({ h: e.get(c).h, s: e.get(c).s, v: 100 }))})`), V = e.derived(() => Et(e.get(c)));
  function Y(b) {
    e.set(c, { ...e.get(c), h: +b.target.value }, !0);
  }
  function re(b) {
    e.set(c, { ...e.get(c), s: +b.target.value }, !0);
  }
  function X(b) {
    e.set(c, { ...e.get(c), v: +b.target.value }, !0);
  }
  function de(b) {
    const S = +b.target.value;
    e.set(c, gt(Tt({ r: S, g: e.get(V).g, b: e.get(V).b })), !0);
  }
  function dt(b) {
    const S = +b.target.value;
    e.set(c, gt(Tt({ r: e.get(V).r, g: S, b: e.get(V).b })), !0);
  }
  function Ee(b) {
    const S = +b.target.value;
    e.set(c, gt(Tt({ r: e.get(V).r, g: e.get(V).g, b: S })), !0);
  }
  function T(b) {
    var S;
    e.get(u) !== b && (e.set(u, b, !0), (S = t.onModeChange) == null || S.call(t, b));
  }
  let L = e.state(e.proxy(d.toUpperCase()));
  e.user_effect(() => {
    e.set(L, jt(e.get(c)).toUpperCase(), !0);
  });
  function ue() {
    if (r()) return;
    const b = e.get(L).trim(), S = Ue(b);
    if (!S) {
      e.set(L, jt(e.get(c)).toUpperCase(), !0);
      return;
    }
    e.set(c, gt(S), !0), p(S);
  }
  function j(b) {
    b.key === "Enter" && (b.preventDefault(), b.currentTarget.blur());
  }
  const se = e.derived(() => jt(e.get(c))), qe = e.derived(() => [...Ln, ...s()]);
  let Te = e.state(e.proxy(Ln[0].id));
  const fe = e.derived(() => e.get(qe).find((b) => b.id === e.get(Te)) ?? e.get(qe)[0]);
  function Ce(b) {
    if (r()) return;
    const S = Ue(b);
    S && (e.set(c, gt(S), !0), p(S));
  }
  let Re = e.state(!1), Ne = e.state("");
  function Ft() {
    return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "u-" + Math.random().toString(36).slice(2, 10);
  }
  function xt() {
    var S, N;
    if (r()) return;
    if ((S = e.get(fe)) != null && S.builtin) {
      e.set(Ne, ""), e.set(Re, !0);
      return;
    }
    if (!e.get(fe)) return;
    const b = {
      ...e.get(fe),
      colors: [...e.get(fe).colors, e.get(se)]
    };
    (N = t.onSaveUserPalette) == null || N.call(t, b);
  }
  function ut() {
    var N;
    if (r()) return;
    const b = e.get(Ne).trim();
    if (!b) return;
    const S = { id: "user-" + Ft(), label: b, colors: [e.get(se)] };
    (N = t.onSaveUserPalette) == null || N.call(t, S), e.set(Te, S.id, !0), e.set(Re, !1), e.set(Ne, "");
  }
  function ft() {
    e.set(Re, !1), e.set(Ne, "");
  }
  function w() {
    var S;
    if (r() || !e.get(fe) || e.get(fe).builtin) return;
    const b = e.get(fe).id;
    (S = t.onDeleteUserPalette) == null || S.call(t, b), e.set(Te, Ln[0].id, !0);
  }
  function I(b) {
    const S = b.target, N = b.shiftKey ? 10 : 1;
    if (S === e.get(g)) {
      if (b.key === "ArrowLeft") {
        b.preventDefault(), e.set(c, { ...e.get(c), s: Math.max(0, e.get(c).s - N) }, !0), y();
        return;
      }
      if (b.key === "ArrowRight") {
        b.preventDefault(), e.set(c, { ...e.get(c), s: Math.min(100, e.get(c).s + N) }, !0), y();
        return;
      }
      if (b.key === "ArrowUp") {
        b.preventDefault(), e.set(c, { ...e.get(c), v: Math.min(100, e.get(c).v + N) }, !0), y();
        return;
      }
      if (b.key === "ArrowDown") {
        b.preventDefault(), e.set(c, { ...e.get(c), v: Math.max(0, e.get(c).v - N) }, !0), y();
        return;
      }
    } else if (S === e.get(f)) {
      if (b.key === "ArrowUp") {
        b.preventDefault(), e.set(c, { ...e.get(c), h: Math.max(0, e.get(c).h - N) }, !0), y();
        return;
      }
      if (b.key === "ArrowDown") {
        b.preventDefault(), e.set(c, { ...e.get(c), h: Math.min(360, e.get(c).h + N) }, !0), y();
        return;
      }
    }
  }
  var M = es();
  let H;
  var q = e.child(M), J = e.child(q), ie = e.child(J), _e = e.child(ie);
  e.set_attribute(_e, "aria-valuemin", 0), e.set_attribute(_e, "aria-valuemax", 100), e.bind_this(_e, (b) => e.set(g, b), () => e.get(g));
  var rt = e.sibling(_e, 2);
  e.set_attribute(rt, "aria-valuemin", 0), e.set_attribute(rt, "aria-valuemax", 360), e.bind_this(rt, (b) => e.set(f, b), () => e.get(f)), e.reset(ie);
  var Ct = e.sibling(ie, 2), It = e.child(Ct);
  let Mn;
  var Ze = e.sibling(It, 2);
  let hr;
  e.reset(Ct);
  var pr = e.sibling(Ct, 2);
  {
    var wi = (b) => {
      var S = Xi(), N = e.child(S), F = e.sibling(e.child(N), 2);
      e.remove_input_defaults(F), e.set_style(F, "", {}, { "--track-bg": D });
      var Q = e.sibling(F, 2), $ = e.child(Q);
      e.reset(Q), e.reset(N);
      var pe = e.sibling(N, 2), te = e.sibling(e.child(pe), 2);
      e.remove_input_defaults(te);
      let Oe;
      var Ie = e.sibling(te, 2), Je = e.child(Ie);
      e.reset(Ie), e.reset(pe);
      var Qe = e.sibling(pe, 2), je = e.sibling(e.child(Qe), 2);
      e.remove_input_defaults(je);
      let fn;
      var kr = e.sibling(je, 2), Ii = e.child(kr);
      e.reset(kr), e.reset(Qe), e.reset(S), e.template_effect(() => {
        e.set_value(F, e.get(c).h), F.disabled = r(), e.set_text($, `${e.get(c).h ?? ""}°`), e.set_value(te, e.get(c).s), te.disabled = r(), Oe = e.set_style(te, "", Oe, { "--track-bg": e.get(z) }), e.set_text(Je, `${e.get(c).s ?? ""}%`), e.set_value(je, e.get(c).v), je.disabled = r(), fn = e.set_style(je, "", fn, { "--track-bg": e.get(W) }), e.set_text(Ii, `${e.get(c).v ?? ""}%`);
      }), e.delegated("input", F, Y), e.delegated("change", F, y), e.delegated("input", te, re), e.delegated("change", te, y), e.delegated("input", je, X), e.delegated("change", je, y), e.append(b, S);
    }, ki = (b) => {
      var S = Zi(), N = e.child(S), F = e.sibling(e.child(N), 2);
      e.remove_input_defaults(F);
      var Q = e.sibling(F, 2), $ = e.child(Q, !0);
      e.reset(Q), e.reset(N);
      var pe = e.sibling(N, 2), te = e.sibling(e.child(pe), 2);
      e.remove_input_defaults(te);
      var Oe = e.sibling(te, 2), Ie = e.child(Oe, !0);
      e.reset(Oe), e.reset(pe);
      var Je = e.sibling(pe, 2), Qe = e.sibling(e.child(Je), 2);
      e.remove_input_defaults(Qe);
      var je = e.sibling(Qe, 2), fn = e.child(je, !0);
      e.reset(je), e.reset(Je), e.reset(S), e.template_effect(() => {
        e.set_value(F, e.get(V).r), F.disabled = r(), e.set_text($, e.get(V).r), e.set_value(te, e.get(V).g), te.disabled = r(), e.set_text(Ie, e.get(V).g), e.set_value(Qe, e.get(V).b), Qe.disabled = r(), e.set_text(fn, e.get(V).b);
      }), e.delegated("input", F, de), e.delegated("change", F, y), e.delegated("input", te, dt), e.delegated("change", te, y), e.delegated("input", Qe, Ee), e.delegated("change", Qe, y), e.append(b, S);
    };
    e.if(pr, (b) => {
      e.get(u) === "hsv" ? b(wi) : b(ki, -1);
    });
  }
  var mr = e.sibling(pr, 2), _r = e.child(mr);
  let br;
  var Bt = e.sibling(_r, 2);
  e.remove_input_defaults(Bt), e.reset(mr), e.reset(J);
  var yr = e.sibling(J, 2), wr = e.child(yr), qt = e.child(wr);
  e.each(qt, 21, () => e.get(qe), (b) => b.id, (b, S) => {
    var N = Ji(), F = e.child(N);
    e.reset(N);
    var Q = {};
    e.template_effect(() => {
      e.set_text(F, `${e.get(S).label ?? ""}${e.get(S).builtin ? "" : " (user)"}`), Q !== (Q = e.get(S).id) && (N.value = (N.__value = e.get(S).id) ?? "");
    }), e.append(b, N);
  }), e.reset(qt);
  var Rn = e.sibling(qt, 2);
  e.each(Rn, 21, () => {
    var b;
    return ((b = e.get(fe)) == null ? void 0 : b.colors) ?? [];
  }, e.index, (b, S) => {
    var N = Qi();
    let F, Q;
    e.template_effect(
      ($, pe, te) => {
        F = e.set_class(N, 1, "cp-swatch svelte-7v5dlc", null, F, $), e.set_attribute(N, "title", pe), e.set_attribute(N, "aria-label", te), N.disabled = r(), Q = e.set_style(N, "", Q, { "background-color": e.get(S) });
      },
      [
        () => ({
          active: e.get(S).toLowerCase() === e.get(se).toLowerCase()
        }),
        () => e.get(S).toUpperCase(),
        () => e.get(S).toUpperCase()
      ]
    ), e.delegated("click", N, () => Ce(e.get(S))), e.append(b, N);
  }), e.reset(Rn);
  var Nn = e.sibling(Rn, 2), On = e.child(Nn), zn = e.sibling(On, 2);
  e.reset(Nn);
  var xi = e.sibling(Nn, 2);
  {
    var Ci = (b) => {
      var S = $i(), N = e.child(S);
      e.remove_input_defaults(N);
      var F = e.sibling(N, 2), Q = e.sibling(F, 2);
      e.reset(S), e.template_effect(($) => F.disabled = $, [() => !e.get(Ne).trim()]), e.delegated("keydown", N, ($) => {
        $.key === "Enter" && ut(), $.key === "Escape" && ft();
      }), e.bind_value(N, () => e.get(Ne), ($) => e.set(Ne, $)), e.delegated("click", F, ut), e.delegated("click", Q, ft), e.append(b, S);
    };
    e.if(xi, (b) => {
      e.get(Re) && b(Ci);
    });
  }
  e.reset(wr), e.reset(yr), e.reset(q), e.reset(M), e.template_effect(() => {
    var b, S;
    H = e.set_class(M, 1, "cp-surface svelte-7v5dlc", null, H, { disabled: r() }), e.set_attribute(_e, "aria-valuenow", e.get(c).v), e.set_attribute(_e, "tabindex", r() ? -1 : 0), e.set_attribute(rt, "aria-valuenow", e.get(c).h), e.set_attribute(rt, "tabindex", r() ? -1 : 0), It.disabled = r(), Mn = e.set_class(It, 1, "svelte-7v5dlc", null, Mn, { active: e.get(u) === "hsv" }), Ze.disabled = r(), hr = e.set_class(Ze, 1, "svelte-7v5dlc", null, hr, { active: e.get(u) === "rgb" }), br = e.set_style(_r, "", br, { "background-color": e.get(se) }), Bt.disabled = r(), qt.disabled = r(), On.disabled = r(), zn.disabled = r() || (((b = e.get(fe)) == null ? void 0 : b.builtin) ?? !0), e.set_attribute(zn, "title", (S = e.get(fe)) != null && S.builtin ? "Built-in palettes cannot be deleted" : "Delete palette");
  }), e.delegated("keydown", M, I), e.delegated("mousedown", _e, U), e.delegated("mousedown", rt, O), e.delegated("click", It, () => T("hsv")), e.delegated("click", Ze, () => T("rgb")), e.event("blur", Bt, ue), e.delegated("keydown", Bt, j), e.bind_value(Bt, () => e.get(L), (b) => e.set(L, b)), e.bind_select_value(qt, () => e.get(Te), (b) => e.set(Te, b)), e.delegated("click", On, xt), e.delegated("click", zn, w), e.append(n, M), e.pop();
}
e.delegate(["keydown", "mousedown", "click", "input", "change"]);
var ts = e.from_html('<div class="cp-pick-title svelte-1n3y1cm"> </div>'), ns = e.from_html("<!> <!>", 1);
function rs(n, t) {
  e.push(t, !0);
  let r = e.state(e.proxy(t.initial)), i = !1, s = !1, l = !1;
  function a(g) {
    l || (l = !0, t.onResolve(g));
  }
  function d(g) {
    g.key === "Escape" && (i = !0);
  }
  Dn(() => {
    document.addEventListener("keydown", d, !0);
  }), jr(() => {
    document.removeEventListener("keydown", d, !0), a(is({
      escapePressed: i,
      userTouched: s,
      currentValue: e.get(r)
    }));
  });
  function c(g) {
    s = !0, e.set(r, g, !0);
  }
  var o = ns(), u = e.first_child(o);
  {
    var p = (g) => {
      var f = ts(), v = e.child(f, !0);
      e.reset(f), e.template_effect(() => e.set_text(v, t.title)), e.append(g, f);
    };
    e.if(u, (g) => {
      t.title && g(p);
    });
  }
  var y = e.sibling(u, 2);
  Gn(y, {
    get value() {
      return e.get(r);
    },
    initialMode: "hsv",
    get userPalettes() {
      return t.userPalettes;
    },
    onChange: c,
    onModeChange: () => {
    },
    get onSaveUserPalette() {
      return t.onSaveUserPalette;
    },
    get onDeleteUserPalette() {
      return t.onDeleteUserPalette;
    }
  }), e.append(n, o), e.pop();
}
function is(n) {
  return n.escapePressed || !n.userTouched ? null : n.currentValue;
}
function ss(n) {
  return n && /^#[0-9a-f]{6}$/i.test(n) ? n : "#000000";
}
function ls(n, t) {
  return new Promise((r) => {
    const i = n.anchor ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    on.popup.show(
      rs,
      { anchor: i },
      {
        initial: ss(n.initial),
        title: n.title,
        userPalettes: t.userPalettes,
        onSaveUserPalette: t.onSaveUserPalette,
        onDeleteUserPalette: t.onDeleteUserPalette,
        onResolve: r
      }
    );
  });
}
const as = "sh3-editor.color-panel";
function os(n, t, r, i) {
  if (t) return { kind: "entry", entry: t };
  const s = r.find((l) => l.slotId === n);
  return s ? { kind: "descriptor", descriptor: s } : {
    kind: "adhoc",
    adHocValue: i == null ? void 0 : i.value,
    adHocReadonly: (i == null ? void 0 : i.readonly) ?? !1
  };
}
let Gr = /* @__PURE__ */ new Map();
function Ir(n) {
  const t = [...n].sort((i, s) => {
    const l = i.priority ?? 10, a = s.priority ?? 10;
    return l !== a ? a - l : 0;
  }), r = /* @__PURE__ */ new Map();
  for (const i of t)
    r.has(i.type) || r.set(i.type, i);
  Gr = r;
}
function cs(n) {
  if (n === null || typeof n != "object") return !1;
  const t = Object.getPrototypeOf(n);
  return t === Object.prototype || t === null;
}
function Sr(n) {
  var t;
  return ((t = Gr.get(n)) == null ? void 0 : t.component) ?? null;
}
function ds(n, t) {
  if (t != null && t.type) {
    const r = Sr(t.type);
    if (r) return { kind: "custom", component: r };
  }
  if (n !== null && typeof n == "object" && typeof n.__type == "string") {
    const r = Sr(n.__type);
    if (r) return { kind: "custom", component: r };
  }
  return cs(n) || Array.isArray(n) ? { kind: "walker" } : { kind: "leaf" };
}
let Kr = null;
function Pr(n) {
  Kr = n;
}
function us() {
  return Kr;
}
const Wr = "sh3-editor:help.tabs";
function De(n) {
  return n.ctrlKey || n.metaKey;
}
function fs(n, t, r, i, s = 2) {
  const l = " ".repeat(s);
  if (t === r && !i)
    return {
      content: n.slice(0, t) + l + n.slice(r),
      selectionStart: t + l.length,
      selectionEnd: t + l.length
    };
  const a = n.lastIndexOf(`
`, t - 1) + 1, d = n.slice(a, r).split(`
`);
  let c = t, o = r;
  const u = d.map((y, g) => {
    var f;
    if (i) {
      const v = ((f = y.match(new RegExp(`^ {1,${s}}`))) == null ? void 0 : f[0].length) ?? 0;
      return g === 0 && (c = Math.max(a, t - v)), o -= v, y.slice(v);
    } else
      return g === 0 && (c = t + l.length), o += l.length, l + y;
  });
  return { content: n.slice(0, a) + u.join(`
`) + n.slice(a + d.join(`
`).length), selectionStart: c, selectionEnd: o };
}
function gs(n, t, r, i, s = 2, l = "inline") {
  if (i === "none") return null;
  const a = n.lastIndexOf(`
`, t - 1) + 1, c = n.slice(a, t).match(/^[ \t]*/)[0], o = " ".repeat(s);
  if (i === "indent") {
    const v = `
` + c;
    return {
      content: n.slice(0, t) + v + n.slice(r),
      selectionStart: t + v.length,
      selectionEnd: t + v.length
    };
  }
  const u = t > 0 ? n[t - 1] : "", p = r < n.length ? n[r] : "", y = u === "{";
  if (y && p === "}") {
    if (l === "inline") {
      const C = `
` + c + o + `
` + c, P = t + 1 + c.length + o.length;
      return {
        content: n.slice(0, t) + C + n.slice(r),
        selectionStart: P,
        selectionEnd: P
      };
    }
    const v = n.slice(0, t - 1), _ = n.slice(r), h = `
` + c + `{
` + c + o + `
` + c, m = v + h + _, k = v.length + (`
` + c + `{
` + c + o).length;
    return { content: m, selectionStart: k, selectionEnd: k };
  }
  if (y) {
    const v = `
` + c + o;
    return {
      content: n.slice(0, t) + v + n.slice(r),
      selectionStart: t + v.length,
      selectionEnd: t + v.length
    };
  }
  const f = `
` + c;
  return {
    content: n.slice(0, t) + f + n.slice(r),
    selectionStart: t + f.length,
    selectionEnd: t + f.length
  };
}
function vs(n, t, r, i = 2) {
  if (t !== r) return null;
  const s = n.lastIndexOf(`
`, t - 1) + 1, l = n.slice(s, t);
  if (!/^[ \t]*$/.test(l)) return null;
  let a = 0, d = -1;
  for (let p = s - 1; p >= 0; p--) {
    const y = n[p];
    if (y === "}") a++;
    else if (y === "{") {
      if (a === 0) {
        d = p;
        break;
      }
      a--;
    }
  }
  let c;
  if (d === -1) {
    const p = Math.max(0, l.length - i);
    c = l.slice(0, p);
  } else {
    const p = n.lastIndexOf(`
`, d - 1) + 1;
    c = n.slice(p, d).match(/^[ \t]*/)[0];
  }
  if (c.length >= l.length) return null;
  const o = n.slice(0, s) + c + "}" + n.slice(r), u = s + c.length + 1;
  return { content: o, selectionStart: u, selectionEnd: u };
}
var hs = e.from_html('<span class="toolbar-sep svelte-10sr5yt"></span>'), ps = e.from_html("<button><!> </button>"), ms = e.from_html("<!> <!>", 1), _s = e.from_html('<div class="toolbar-spacer svelte-10sr5yt"></div> <span class="toolbar-path svelte-10sr5yt"> </span>', 1), bs = e.from_html('<div class="toolbar svelte-10sr5yt"><!> <!></div>');
function ir(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "filePath", 3, null), i = e.derived(() => {
    const d = [], c = /* @__PURE__ */ new Map();
    for (const o of t.actions) {
      const u = o.group ?? "_default";
      if (!c.has(u)) {
        const p = [];
        c.set(u, p), d.push({ key: u, items: p });
      }
      c.get(u).push(o);
    }
    return d;
  });
  var s = e.comment(), l = e.first_child(s);
  {
    var a = (d) => {
      var c = bs(), o = e.child(c);
      e.each(o, 17, () => e.get(i), e.index, (y, g, f) => {
        var v = ms(), _ = e.first_child(v);
        {
          var h = (k) => {
            var C = hs();
            e.append(k, C);
          };
          e.if(_, (k) => {
            f > 0 && k(h);
          });
        }
        var m = e.sibling(_, 2);
        e.each(m, 17, () => e.get(g).items, (k) => k.id, (k, C) => {
          var P = ps();
          let A;
          var E = e.child(P);
          {
            var R = (O) => {
              var B = e.text();
              e.template_effect(() => e.set_text(B, e.get(C).icon)), e.append(O, B);
            };
            e.if(E, (O) => {
              e.get(C).icon && O(R);
            });
          }
          var U = e.sibling(E, 1, !0);
          e.reset(P), e.template_effect(() => {
            A = e.set_class(P, 1, "toolbar-btn svelte-10sr5yt", null, A, { "toolbar-accent": e.get(C).accent }), P.disabled = e.get(C).disabled, e.set_attribute(P, "title", e.get(C).shortcut ? `${e.get(C).label} (${e.get(C).shortcut})` : e.get(C).label), e.set_text(U, e.get(C).label);
          }), e.delegated("click", P, function(...O) {
            var B;
            (B = e.get(C).onAction) == null || B.apply(this, O);
          }), e.append(k, P);
        }), e.append(y, v);
      });
      var u = e.sibling(o, 2);
      {
        var p = (y) => {
          var g = _s(), f = e.sibling(e.first_child(g), 2), v = e.child(f, !0);
          e.reset(f), e.template_effect(
            (_) => {
              e.set_attribute(f, "title", r()), e.set_text(v, _);
            },
            [() => r().split(/[/\\]/).pop()]
          ), e.append(y, g);
        };
        e.if(u, (y) => {
          r() && y(p);
        });
      }
      e.reset(c), e.append(d, c);
    };
    e.if(l, (d) => {
      (t.actions.length > 0 || r()) && d(a);
    });
  }
  e.append(n, s), e.pop();
}
e.delegate(["click"]);
var ys = e.from_html('<div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Brace style</span> <div class="seg svelte-1etykqv"><button type="button">Inline</button> <button type="button">Allman</button></div></div>'), ws = e.from_html('<div class="body svelte-1etykqv"><h2 class="svelte-1etykqv">Editor settings</h2> <div class="rows svelte-1etykqv"><div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Indent unit</span> <div class="seg svelte-1etykqv"><button type="button">2</button> <button type="button">4</button></div></div> <!></div> <div class="actions svelte-1etykqv"><button type="button" class="secondary svelte-1etykqv">Close</button></div></div>');
function ks(n, t) {
  e.push(t, !0);
  let r = e.proxy({ ...t.prefs });
  function i(h) {
    r.indentUnit = h, t.onChange({ ...r });
  }
  function s(h) {
    r.braceStyle = h, t.onChange({ ...r });
  }
  var l = ws(), a = e.sibling(e.child(l), 2), d = e.child(a), c = e.sibling(e.child(d), 2), o = e.child(c);
  let u;
  var p = e.sibling(o, 2);
  let y;
  e.reset(c), e.reset(d);
  var g = e.sibling(d, 2);
  {
    var f = (h) => {
      var m = ys(), k = e.sibling(e.child(m), 2), C = e.child(k);
      let P;
      var A = e.sibling(C, 2);
      let E;
      e.reset(k), e.reset(m), e.template_effect(() => {
        P = e.set_class(C, 1, "svelte-1etykqv", null, P, { active: (r.braceStyle ?? "inline") === "inline" }), E = e.set_class(A, 1, "svelte-1etykqv", null, E, { active: (r.braceStyle ?? "inline") === "allman" });
      }), e.delegated("click", C, () => s("inline")), e.delegated("click", A, () => s("allman")), e.append(h, m);
    };
    e.if(g, (h) => {
      t.indentType === "brace" && h(f);
    });
  }
  e.reset(a);
  var v = e.sibling(a, 2), _ = e.child(v);
  e.reset(v), e.reset(l), e.template_effect(() => {
    u = e.set_class(o, 1, "svelte-1etykqv", null, u, { active: (r.indentUnit ?? 2) === 2 }), y = e.set_class(p, 1, "svelte-1etykqv", null, y, { active: (r.indentUnit ?? 2) === 4 });
  }), e.delegated("click", o, () => i(2)), e.delegated("click", p, () => i(4)), e.delegated("click", _, function(...h) {
    var m;
    (m = t.close) == null || m.apply(this, h);
  }), e.append(n, l), e.pop();
}
e.delegate(["click"]);
var xs = e.from_html('<div class="line-num svelte-1j4uh1h"> </div>'), Cs = e.from_html('<div class="editor-container svelte-1j4uh1h"><!> <div class="editor-wrap svelte-1j4uh1h"><div class="gutter svelte-1j4uh1h"><div class="gutter-inner svelte-1j4uh1h"></div></div> <div class="editor-body svelte-1j4uh1h"><pre class="highlight-layer svelte-1j4uh1h" aria-hidden="true"></pre> <textarea class="input-layer svelte-1j4uh1h" autocapitalize="off"></textarea></div></div></div>');
function Is(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "entry", 7), i = e.prop(t, "fontSize", 3, 13), s = e.prop(t, "toolbarActions", 19, () => []), l = e.derived(() => r().document), a = e.state(e.proxy(e.get(l).content)), d = e.derived(() => {
    var T, L;
    return ((T = t.matchingConfig) == null ? void 0 : T.indentType) ?? ((L = t.matchingConfig) != null && L.indentBased ? "indent" : "none");
  }), c = e.derived(() => e.get(d) === "none" ? 0 : e.get(d) === "brace" ? 2 : 1), o = e.derived(() => (t.showSettings ?? !0) && e.get(c) > 0);
  const u = 300, p = (T, L) => {
    e.set(a, T, !0), e.get(l).content = T, e.get(l).cursorStart = L, e.get(l).cursorEnd = L, t.internals.contentChange.emit(e.get(l).id, T), E(L, L);
  };
  function y() {
    on.modal.open(ks, {
      indentType: e.get(d),
      prefs: r().prefs,
      onChange: f
    });
  }
  let g = e.derived(() => {
    if (!e.get(o)) return s();
    const T = {
      id: "sh3-editor:toolbar",
      label: "Settings",
      icon: "⚙",
      onAction: y,
      group: "_editor_builtin"
    };
    return [...s(), T];
  });
  function f(T) {
    r().prefs = { ...r().prefs, ...T }, t.internals.prefsChange.emit(r().document.id, { ...r().prefs });
  }
  e.user_effect(() => {
    e.set(a, e.get(l).content, !0);
  });
  let v = e.state(void 0), _ = e.state(0), h = e.state(0), m = e.derived(() => t.highlight && e.get(l).language ? t.highlight(e.get(a), e.get(l).language) : P(e.get(a))), k = e.derived(() => e.get(a).split(`
`).length), C = e.derived(() => Array.from({ length: e.get(k) }, (T, L) => L + 1));
  function P(T) {
    return T.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function A(T, L, ue) {
    var ut, ft;
    e.set(a, T, !0);
    const j = e.get(l).id, se = e.get(l).content;
    if (se === T) return;
    const qe = e.get(l).cursorStart;
    e.get(l).content = T, e.get(l).cursorStart = L, e.get(l).cursorEnd = ue;
    const Te = t.internals.history(j), fe = Date.now(), Ce = Te.peek(), Re = ((ut = Ce == null ? void 0 : Ce.meta) == null ? void 0 : ut.kind) === "text-swap" ? Ce.meta.snapshot : void 0, Ne = Math.abs(T.length - se.length) <= 1, Ft = Re && ((ft = Ce == null ? void 0 : Ce.meta) == null ? void 0 : ft.timestamp) != null && fe - Ce.meta.timestamp < u;
    Re && Ne && Ft ? Te.replaceTop(wn({
      setter: p,
      before: Re.before,
      after: T,
      cursorBefore: Re.cursorBefore,
      cursorAfter: L,
      now: fe
    })) : Te.push(wn({
      setter: p,
      before: se,
      after: T,
      cursorBefore: qe,
      cursorAfter: L,
      now: fe
    }));
    const xt = e.get(l).dirty;
    e.get(l).dirty = !0, t.internals.contentChange.emit(j, T), xt || t.internals.dirtyChange.emit(j, !0);
  }
  function E(T, L) {
    requestAnimationFrame(() => {
      e.get(v) && (e.get(v).selectionStart = T, e.get(v).selectionEnd = L);
    });
  }
  function R(T) {
    var L;
    if (T.key === "s" && De(T)) {
      T.preventDefault(), t.internals.emitSave(e.get(l).id);
      return;
    }
    if (T.key.toLowerCase() === "z" && De(T) && !T.shiftKey) {
      T.preventDefault(), t.internals.history(e.get(l).id).undo();
      return;
    }
    if (T.key.toLowerCase() === "y" && De(T) || T.key.toLowerCase() === "z" && De(T) && T.shiftKey) {
      T.preventDefault(), t.internals.history(e.get(l).id).redo();
      return;
    }
    if (T.key === "Enter" && !T.shiftKey && !De(T) && !T.altKey) {
      if (e.get(d) === "none") return;
      const ue = T.currentTarget, j = gs(e.get(a), ue.selectionStart, ue.selectionEnd, e.get(d), r().prefs.indentUnit, r().prefs.braceStyle);
      j && (T.preventDefault(), A(j.content, j.selectionStart, j.selectionEnd), E(j.selectionStart, j.selectionEnd));
      return;
    }
    if (T.key === "}" && e.get(d) === "brace" && !De(T) && !T.altKey) {
      const ue = T.currentTarget, j = vs(e.get(a), ue.selectionStart, ue.selectionEnd, r().prefs.indentUnit);
      if (j) {
        T.preventDefault(), A(j.content, j.selectionStart, j.selectionEnd), E(j.selectionStart, j.selectionEnd);
        return;
      }
    }
    if (T.key === "Tab") {
      T.preventDefault();
      const ue = T.currentTarget, j = fs(e.get(a), ue.selectionStart, ue.selectionEnd, T.shiftKey, (L = t.matchingConfig) == null ? void 0 : L.indentUnit);
      j && (A(j.content, j.selectionStart, j.selectionEnd), E(j.selectionStart, j.selectionEnd));
      return;
    }
  }
  function U(T) {
    const L = T.currentTarget;
    A(L.value, L.selectionStart, L.selectionEnd);
  }
  function O(T) {
    const L = T.currentTarget;
    e.set(_, L.scrollTop, !0), e.set(h, L.scrollLeft, !0);
  }
  function B() {
    e.get(v) && (e.get(l).cursorStart = e.get(v).selectionStart, e.get(l).cursorEnd = e.get(v).selectionEnd);
  }
  var G = Cs(), D = e.child(G);
  ir(D, {
    get actions() {
      return e.get(g);
    },
    get filePath() {
      return e.get(l).filePath;
    }
  });
  var z = e.sibling(D, 2);
  let W;
  var V = e.child(z), Y = e.child(V);
  let re;
  e.each(Y, 20, () => e.get(C), (T) => T, (T, L) => {
    var ue = xs(), j = e.child(ue, !0);
    e.reset(ue), e.template_effect(() => e.set_text(j, L)), e.append(T, ue);
  }), e.reset(Y), e.reset(V);
  var X = e.sibling(V, 2), de = e.child(X);
  let dt;
  e.html(de, () => e.get(m) + `
`, !0), e.reset(de);
  var Ee = e.sibling(de, 2);
  e.remove_textarea_child(Ee), e.set_attribute(Ee, "spellcheck", !1), e.bind_this(Ee, (T) => e.set(v, T), () => e.get(v)), e.reset(X), e.reset(z), e.reset(G), e.template_effect(() => {
    W = e.set_style(z, "", W, { "--editor-font-size": `${i() ?? ""}px` }), re = e.set_style(Y, "", re, { transform: `translateY(-${e.get(_) ?? ""}px)` }), dt = e.set_style(de, "", dt, {
      top: `-${e.get(_) ?? ""}px`,
      left: `-${e.get(h) ?? ""}px`
    }), e.set_value(Ee, e.get(a));
  }), e.delegated("keydown", Ee, R), e.delegated("input", Ee, U), e.event("scroll", Ee, O), e.event("select", Ee, B), e.append(n, G), e.pop();
}
e.delegate(["keydown", "input"]);
function Yr(n, t, r, i) {
  return n && n(t, r) === !0 ? !0 : (i(), !1);
}
var Ss = e.from_html('<div><span class="label svelte-2gtehg"> </span> <span class="value svelte-2gtehg"><!></span></div>');
function Vn(n, t) {
  let r = e.prop(t, "readonly", 3, !1);
  var i = Ss();
  let s;
  var l = e.child(i), a = e.child(l, !0);
  e.reset(l);
  var d = e.sibling(l, 2), c = e.child(d);
  e.snippet(c, () => t.children), e.reset(d), e.reset(i), e.template_effect(() => {
    s = e.set_class(i, 1, "field svelte-2gtehg", null, s, { readonly: r() }), e.set_text(a, t.label);
  }), e.append(n, i);
}
var Ps = e.from_html('<input type="checkbox"/>'), Es = e.from_html('<input class="primitive svelte-1o84d6l"/>');
function Ts(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "readonly", 3, !1), i = e.state(e.proxy(s(t.value)));
  e.user_effect(() => {
    e.set(i, s(t.value), !0);
  });
  function s(f) {
    return f === null ? "null" : f === void 0 ? "" : typeof f == "boolean" ? f ? "true" : "false" : String(f);
  }
  function l(f, v) {
    if (v === "boolean") return f === "true";
    if (v === "number") {
      const _ = Number(f);
      return Number.isFinite(_) ? _ : t.value;
    }
    return f;
  }
  let a = e.derived(() => typeof t.value == "number" ? "number" : typeof t.value == "boolean" ? "boolean" : "string");
  function d() {
    if (r() || !t.onCommit) return;
    const f = l(e.get(i), e.get(a));
    f !== null && f !== t.value && t.onCommit(f);
  }
  function c(f) {
    if (r() || !t.onCommit) return;
    const v = f.target.checked;
    v !== t.value && t.onCommit(v);
  }
  function o(f) {
    f.key === "Enter" ? f.currentTarget.blur() : f.key === "Escape" && (e.set(i, s(t.value), !0), f.currentTarget.blur());
  }
  var u = e.comment(), p = e.first_child(u);
  {
    var y = (f) => {
      var v = Ps();
      e.remove_input_defaults(v), e.template_effect(
        (_) => {
          e.set_checked(v, _), v.disabled = r();
        },
        [() => !!t.value]
      ), e.delegated("change", v, c), e.append(f, v);
    }, g = (f) => {
      var v = Es();
      e.remove_input_defaults(v), e.template_effect(() => {
        e.set_attribute(v, "type", e.get(a) === "number" ? "number" : "text"), v.disabled = r();
      }), e.event("blur", v, d), e.delegated("keydown", v, o), e.bind_value(v, () => e.get(i), (_) => e.set(i, _)), e.append(f, v);
    };
    e.if(p, (f) => {
      e.get(a) === "boolean" ? f(y) : f(g, -1);
    });
  }
  e.append(n, u), e.pop();
}
e.delegate(["change", "keydown"]);
var As = e.from_html('<div class="walker svelte-1xvtj10"></div>');
function Ds(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "basePath", 19, () => []);
  function i(o) {
    return o == null || typeof o == "string" || typeof o == "number" || typeof o == "boolean";
  }
  function s(o, u, p) {
    const y = o[u], g = {
      apply() {
        o[u] = p;
      },
      revert() {
        o[u] = y;
      },
      meta: { kind: "walker-edit", label: String(u) }
    };
    t.api.push(g), o[u] = p;
  }
  function l(o) {
    return (u) => {
      Yr(t.walkerOnCommit, [...r(), o], u, () => s(t.value, o, u));
    };
  }
  function a(o) {
    return (u) => s(t.value, o, u);
  }
  let d = e.derived(() => Array.isArray(t.value) ? t.value.map((o, u) => {
    var p;
    return { key: u, child: o, fieldMeta: (p = t.meta) == null ? void 0 : p.item };
  }) : t.value && typeof t.value == "object" ? Object.keys(t.value).map((o) => {
    var u, p;
    return {
      key: o,
      child: t.value[o],
      fieldMeta: (p = (u = t.meta) == null ? void 0 : u.fields) == null ? void 0 : p[o]
    };
  }) : []);
  var c = As();
  e.each(c, 21, () => e.get(d), (o) => o.key, (o, u) => {
    var p = e.comment(), y = e.first_child(p);
    {
      var g = (f) => {
        const v = e.derived(() => {
          var E;
          return ((E = e.get(u).fieldMeta) == null ? void 0 : E.label) ?? (typeof e.get(u).key == "number" ? `[${e.get(u).key}]` : String(e.get(u).key));
        }), _ = e.derived(() => {
          var E;
          return (((E = e.get(u).fieldMeta) == null ? void 0 : E.readonly) ?? !1) || t.api.readonly;
        });
        var h = e.comment(), m = e.first_child(h);
        {
          var k = (E) => {
            Vn(E, {
              get label() {
                return e.get(v);
              },
              get readonly() {
                return e.get(_);
              },
              children: (R, U) => {
                {
                  let O = e.derived(() => e.get(_) ? void 0 : a(e.get(u).key)), B = e.derived(() => [...r(), e.get(u).key]);
                  Kn(R, {
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
                      return e.get(O);
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
          }, C = (E) => {
            Vn(E, {
              get label() {
                return e.get(v);
              },
              get readonly() {
                return e.get(_);
              },
              children: (R, U) => {
                {
                  let O = e.derived(() => e.get(_) ? void 0 : l(e.get(u).key));
                  Ts(R, {
                    get value() {
                      return e.get(u).child;
                    },
                    get readonly() {
                      return e.get(_);
                    },
                    get onCommit() {
                      return e.get(O);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, P = e.derived(() => i(e.get(u).child)), A = (E) => {
            Vn(E, {
              get label() {
                return e.get(v);
              },
              get readonly() {
                return e.get(_);
              },
              children: (R, U) => {
                {
                  let O = e.derived(() => e.get(_) ? void 0 : a(e.get(u).key)), B = e.derived(() => [...r(), e.get(u).key]);
                  Kn(R, {
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
                      return e.get(O);
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
          e.if(m, (E) => {
            var R;
            (R = e.get(u).fieldMeta) != null && R.type ? E(k) : e.get(P) ? E(C, 1) : E(A, -1);
          });
        }
        e.append(f, h);
      };
      e.if(y, (f) => {
        var v;
        (v = e.get(u).fieldMeta) != null && v.hidden || f(g);
      });
    }
    e.append(o, p);
  }), e.reset(c), e.append(n, c), e.pop();
}
var Ms = e.from_html('<span class="leaf svelte-o6duey"> </span>');
function Rs(n, t) {
  function r(l) {
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
  var i = Ms(), s = e.child(i, !0);
  e.reset(i), e.template_effect((l) => e.set_text(s, l), [() => r(t.value)]), e.append(n, i);
}
function Kn(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "basePath", 19, () => []), i = e.derived(() => ds(t.value, t.meta)), s = e.derived(() => {
    const p = t.onCommit, y = t.walkerOnCommit;
    if (p !== void 0)
      return y === void 0 ? p : (g) => {
        Yr(y, r(), g, () => p(g));
      };
  });
  var l = e.comment(), a = e.first_child(l);
  {
    var d = (p) => {
    }, c = (p) => {
      const y = e.derived(() => e.get(i).component);
      var g = e.comment(), f = e.first_child(g);
      e.component(f, () => e.get(y), (v, _) => {
        _(v, {
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
            return e.get(s);
          }
        });
      }), e.append(p, g);
    }, o = (p) => {
      Ds(p, {
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
          return r();
        }
      });
    }, u = (p) => {
      Rs(p, {
        get value() {
          return t.value;
        }
      });
    };
    e.if(a, (p) => {
      var y;
      (y = t.meta) != null && y.hidden ? p(d) : e.get(i).kind === "custom" ? p(c, 1) : e.get(i).kind === "walker" ? p(o, 2) : p(u, -1);
    });
  }
  e.append(n, l), e.pop();
}
var Ns = e.from_html('<div class="inspector-container svelte-jpxkcf" tabindex="-1" role="region" aria-label="Inspector"><!> <div class="inspector-body svelte-jpxkcf"><!></div></div>');
function Os(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "adHocReadonly", 3, !1), i = e.derived(() => t.internals.inspectors.get(t.instanceId)), s = e.derived(() => e.get(i) ? e.get(i).value : t.adHocValue), l = e.derived(() => e.get(i) ? e.get(i).meta : t.adHocMeta), a = e.derived(() => e.get(i) ? !!e.get(i).options.readonly : r()), d = e.derived(() => e.get(i) ? e.get(i).options.onCommit : void 0), c = e.derived(() => {
    var m;
    return ((m = e.get(i)) == null ? void 0 : m.options.toolbarActions) ?? [];
  });
  const o = t.internals.history(t.instanceId), u = {
    push(m) {
      e.get(a) || (o.push(m), t.internals.inspectorValueChange.emit(t.instanceId, e.get(s)));
    },
    get readonly() {
      return e.get(a);
    },
    history: o
  };
  e.user_effect(() => {
    const m = o.onChange(() => {
      t.internals.inspectorValueChange.emit(t.instanceId, e.get(s));
    });
    return () => m();
  });
  let p = e.state(void 0);
  function y(m) {
    if (m.key.toLowerCase() === "z" && De(m) && !m.shiftKey) {
      m.preventDefault(), o.undo();
      return;
    }
    if (m.key.toLowerCase() === "y" && De(m) || m.key.toLowerCase() === "z" && De(m) && m.shiftKey) {
      m.preventDefault(), o.redo();
      return;
    }
  }
  var g = Ns(), f = e.child(g);
  {
    var v = (m) => {
      ir(m, {
        get actions() {
          return e.get(c);
        },
        filePath: null
      });
    };
    e.if(f, (m) => {
      e.get(c).length > 0 && m(v);
    });
  }
  var _ = e.sibling(f, 2), h = e.child(_);
  Kn(h, {
    get value() {
      return e.get(s);
    },
    get meta() {
      return e.get(l);
    },
    get api() {
      return u;
    },
    get walkerOnCommit() {
      return e.get(d);
    },
    basePath: []
  }), e.reset(_), e.reset(g), e.bind_this(g, (m) => e.set(p, m), () => e.get(p)), e.delegated("keydown", g, y), e.append(n, g), e.pop();
}
e.delegate(["keydown"]);
var zs = e.from_html('<div role="region" aria-label="Color picker"><div class="cp-compact-row svelte-f5c5rv"><div class="cp-preview cp-compact-preview svelte-f5c5rv" role="button" aria-label="Open full color picker" aria-haspopup="true"></div> <input type="text" class="cp-hex-input cp-compact-hex svelte-f5c5rv" aria-label="Hex value"/></div></div>'), Hs = e.from_html('<div tabindex="-1" role="region" aria-label="Color picker"><!> <!></div>');
function Xr(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "adHocReadonly", 3, !1), i = e.prop(t, "userPalettes", 19, () => []), s = e.prop(t, "prefs", 19, () => ({ mode: "hsv" })), l = e.prop(t, "compact", 3, !1), a = e.derived(() => t.internals.colorPickers.get(t.instanceId)), d = e.derived(() => {
    var D;
    return ((D = e.get(a)) == null ? void 0 : D.options.toolbarActions) ?? [];
  }), c = e.state(e.proxy(t.descriptorBinding ? Ue(t.descriptorBinding.initial) ?? "#000000" : "#000000")), o = e.derived(() => e.get(a) ? e.get(a).value : t.descriptorBinding ? e.get(c) : Ue(t.adHocValue ?? "") ?? "#000000"), u = e.derived(() => e.get(a) ? !!e.get(a).options.readonly : r());
  const p = t.internals.history(t.instanceId);
  function y(D) {
    if (e.get(u)) return;
    const z = Ue(D);
    if (!z) return;
    if (t.onExternalCommit) {
      t.onExternalCommit(z);
      return;
    }
    const W = e.get(o);
    if (W === z) return;
    const V = (Y) => {
      e.get(a) ? e.get(a).value = Y : t.descriptorBinding && e.set(c, Y, !0);
    };
    p.push({
      apply: () => V(z),
      revert: () => V(W),
      meta: { kind: "color", timestamp: Date.now() }
    }), V(z), t.internals.colorPickerValueChange.emit(t.instanceId, z), t.descriptorBinding && !e.get(a) && t.descriptorBinding.onChange(z);
  }
  e.user_effect(() => {
    const D = p.onChange(() => {
      t.internals.colorPickerValueChange.emit(t.instanceId, e.get(o)), t.descriptorBinding && !e.get(a) && t.descriptorBinding.onChange(e.get(o));
    });
    return () => D();
  });
  function g(D) {
    t.internals.colorPickerPrefsChange.emit(t.instanceId, { mode: D });
  }
  const f = e.derived(() => /^#[0-9a-f]{6}$/i.test(e.get(o)) ? e.get(o).toUpperCase() : e.get(o));
  let v = e.state(e.proxy(e.get(f)));
  e.user_effect(() => {
    e.set(v, e.get(f), !0);
  });
  function _() {
    if (e.get(u)) return;
    const D = Ue(e.get(v).trim());
    if (!D) {
      e.set(v, e.get(f), !0);
      return;
    }
    y(D);
  }
  function h(D) {
    D.key === "Enter" && (D.preventDefault(), D.currentTarget.blur());
  }
  let m = e.state(void 0);
  function k() {
    e.get(u) || !e.get(m) || on.popup.show(Gn, { anchor: e.get(m) }, {
      value: e.get(o),
      readonly: e.get(u),
      initialMode: s().mode,
      userPalettes: i(),
      onChange: (D) => y(D),
      onModeChange: g,
      onSaveUserPalette: t.onSaveUserPalette,
      onDeleteUserPalette: t.onDeleteUserPalette
    });
  }
  function C(D) {
    (D.key === "Enter" || D.key === " ") && (D.preventDefault(), k());
  }
  let P = e.state(void 0);
  function A(D) {
    if (D.key.toLowerCase() === "z" && De(D) && !D.shiftKey) {
      D.preventDefault(), p.undo();
      return;
    }
    if (D.key.toLowerCase() === "y" && De(D) || D.key.toLowerCase() === "z" && De(D) && D.shiftKey) {
      D.preventDefault(), p.redo();
      return;
    }
  }
  let E = !1;
  function R(D) {
    if (E || !t.descriptorBinding || e.get(
      a
      // descriptor mode only
    )) return;
    const z = Ue(D) ?? "#000000", W = e.get(c);
    W !== z && (p.push({
      apply: () => {
        e.set(c, z, !0);
      },
      revert: () => {
        e.set(c, W, !0);
      },
      meta: { kind: "color", timestamp: Date.now(), source: "controller" }
    }), e.set(c, z, !0));
  }
  Dn(() => {
    var D, z;
    if (t.descriptorBinding)
      return (z = (D = t.descriptorBinding).bind) == null || z.call(D, { setValue: R }), () => {
        E = !0;
      };
  });
  var U = e.comment(), O = e.first_child(U);
  {
    var B = (D) => {
      var z = zs();
      let W;
      var V = e.child(z), Y = e.child(V);
      let re;
      e.bind_this(Y, (de) => e.set(m, de), () => e.get(m));
      var X = e.sibling(Y, 2);
      e.remove_input_defaults(X), e.reset(V), e.reset(z), e.template_effect(() => {
        W = e.set_class(z, 1, "cp-compact svelte-f5c5rv", null, W, { disabled: e.get(u) }), e.set_attribute(Y, "tabindex", e.get(u) ? -1 : 0), re = e.set_style(Y, "", re, { "background-color": e.get(o) }), X.disabled = e.get(u);
      }), e.delegated("click", Y, k), e.delegated("keydown", Y, C), e.event("blur", X, _), e.delegated("keydown", X, h), e.bind_value(X, () => e.get(v), (de) => e.set(v, de)), e.append(D, z);
    }, G = (D) => {
      var z = Hs();
      let W;
      var V = e.child(z);
      {
        var Y = (X) => {
          ir(X, {
            get actions() {
              return e.get(d);
            },
            filePath: null
          });
        };
        e.if(V, (X) => {
          e.get(d).length > 0 && X(Y);
        });
      }
      var re = e.sibling(V, 2);
      Gn(re, {
        get value() {
          return e.get(o);
        },
        get readonly() {
          return e.get(u);
        },
        get initialMode() {
          return s().mode;
        },
        get userPalettes() {
          return i();
        },
        onChange: y,
        onModeChange: g,
        get onSaveUserPalette() {
          return t.onSaveUserPalette;
        },
        get onDeleteUserPalette() {
          return t.onDeleteUserPalette;
        }
      }), e.reset(z), e.bind_this(z, (X) => e.set(P, X), () => e.get(P)), e.template_effect(() => W = e.set_class(z, 1, "cp svelte-f5c5rv", null, W, { disabled: e.get(u) })), e.delegated("keydown", z, A), e.append(D, z);
    };
    e.if(O, (D) => {
      l() ? D(B) : D(G, -1);
    });
  }
  e.append(n, U), e.pop();
}
e.delegate(["click", "keydown"]);
var Us = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>'), Ls = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>');
function Vs(n, t) {
  e.push(t, !0);
  const r = us();
  let i = e.derived(() => typeof t.value == "string" ? t.value : null);
  var s = e.comment(), l = e.first_child(s);
  {
    var a = (o) => {
      var u = Us(), p = e.child(u, !0);
      e.reset(u), e.template_effect((y) => e.set_text(p, y), [() => String(t.value)]), e.append(o, u);
    }, d = (o) => {
      var u = Ls(), p = e.child(u, !0);
      e.reset(u), e.template_effect(() => e.set_text(p, e.get(i))), e.append(o, u);
    }, c = (o) => {
      Xr(o, {
        instanceId: "inspector-color",
        get internals() {
          return r.internals;
        },
        compact: !0,
        get adHocValue() {
          return e.get(i);
        },
        get adHocReadonly() {
          return t.api.readonly;
        },
        get userPalettes() {
          return r.userPalettes;
        },
        get onSaveUserPalette() {
          return r.onSaveUserPalette;
        },
        get onDeleteUserPalette() {
          return r.onDeleteUserPalette;
        },
        onExternalCommit: (u) => {
          var p;
          return (p = t.onCommit) == null ? void 0 : p.call(t, u);
        }
      });
    };
    e.if(l, (o) => {
      e.get(i) === null ? o(a) : r ? o(c, -1) : o(d, 1);
    });
  }
  e.append(n, s), e.pop();
}
const Fn = "sh3-editor.settings";
function Er(n, t, r, i) {
  const s = { ...n[t] ?? {} };
  return i === void 0 ? delete s[r] : s[r] = i, { ...n, [t]: s };
}
function Fs(n, t) {
  const r = Object.keys(n);
  if (r.length === 0) return n;
  const i = new Set(t);
  let s = !1;
  for (const a of r)
    if (!i.has(a)) {
      s = !0;
      break;
    }
  if (!s) return n;
  const l = {};
  for (const a of r)
    i.has(a) && (l[a] = n[a]);
  return l;
}
var Bs = e.from_html('<h3 class="section-label svelte-18qjjuf"> </h3>'), qs = e.from_html('<section class="section svelte-18qjjuf"><!> <div class="rows svelte-18qjjuf"><!></div></section>');
function js(n, t) {
  var r = qs(), i = e.child(r);
  {
    var s = (d) => {
      var c = Bs(), o = e.child(c, !0);
      e.reset(c), e.template_effect(() => e.set_text(o, t.label)), e.append(d, c);
    };
    e.if(i, (d) => {
      t.showHeader && d(s);
    });
  }
  var l = e.sibling(i, 2), a = e.child(l);
  e.snippet(a, () => t.children), e.reset(l), e.reset(r), e.append(n, r);
}
var Gs = e.from_html('<div class="desc svelte-1rh69ln"> </div>'), Ks = e.from_html('<div class="error svelte-1rh69ln"> </div>'), Ws = e.from_html('<div><div class="label-col"><div class="label svelte-1rh69ln"> </div> <!></div> <div class="control svelte-1rh69ln"><!></div> <!></div>');
function cn(n, t) {
  let r = e.prop(t, "disabled", 3, !1);
  var i = Ws();
  let s;
  var l = e.child(i), a = e.child(l), d = e.child(a, !0);
  e.reset(a);
  var c = e.sibling(a, 2);
  {
    var o = (f) => {
      var v = Gs(), _ = e.child(v, !0);
      e.reset(v), e.template_effect(() => e.set_text(_, t.description)), e.append(f, v);
    };
    e.if(c, (f) => {
      t.description && f(o);
    });
  }
  e.reset(l);
  var u = e.sibling(l, 2), p = e.child(u);
  e.snippet(p, () => t.children), e.reset(u);
  var y = e.sibling(u, 2);
  {
    var g = (f) => {
      var v = Ks(), _ = e.child(v, !0);
      e.reset(v), e.template_effect(() => e.set_text(_, t.error)), e.append(f, v);
    };
    e.if(y, (f) => {
      t.error && f(g);
    });
  }
  e.reset(i), e.template_effect(() => {
    s = e.set_class(i, 1, "row svelte-1rh69ln", null, s, { disabled: r() }), e.set_text(d, t.label);
  }), e.append(n, i);
}
var Ys = e.from_html('<button type="button"><span class="knob svelte-ert2i6"></span></button>');
function Xs(n, t) {
  e.push(t, !0);
  const r = e.derived(() => !!t.value);
  cn(n, {
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
    children: (i, s) => {
      var l = Ys();
      let a;
      e.template_effect(() => {
        a = e.set_class(l, 1, "toggle svelte-ert2i6", null, a, { on: e.get(r) }), l.disabled = t.field.disabled, e.set_attribute(l, "aria-pressed", e.get(r)), e.set_attribute(l, "aria-label", t.field.label);
      }), e.delegated("click", l, () => t.onEdit(!e.get(r))), e.append(i, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
var Zs = e.from_html('<input type="text"/>');
function Js(n, t) {
  e.push(t, !0);
  const r = e.derived(() => t.value == null ? "" : String(t.value));
  cn(n, {
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
    children: (i, s) => {
      var l = Zs();
      e.remove_input_defaults(l);
      let a;
      e.template_effect(() => {
        a = e.set_class(l, 1, "input svelte-1jljyjf", null, a, { error: !!t.error }), e.set_attribute(l, "placeholder", t.field.placeholder ?? ""), l.disabled = t.field.disabled, e.set_value(l, e.get(r));
      }), e.delegated("change", l, (d) => t.onEdit(d.currentTarget.value)), e.append(i, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var Qs = e.from_html('<span class="unit svelte-1be7g0v"> </span>'), $s = e.from_html('<input type="number"/> <!>', 1);
function el(n, t) {
  e.push(t, !0);
  const r = e.derived(() => typeof t.value == "number" ? String(t.value) : "");
  function i(s) {
    const l = s.currentTarget.value, a = Number(l);
    l === "" || Number.isNaN(a) || t.onEdit(a);
  }
  cn(n, {
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
    children: (s, l) => {
      var a = $s(), d = e.first_child(a);
      e.remove_input_defaults(d);
      let c;
      var o = e.sibling(d, 2);
      {
        var u = (p) => {
          var y = Qs(), g = e.child(y, !0);
          e.reset(y), e.template_effect(() => e.set_text(g, t.field.unit)), e.append(p, y);
        };
        e.if(o, (p) => {
          t.field.unit && p(u);
        });
      }
      e.template_effect(() => {
        c = e.set_class(d, 1, "input svelte-1be7g0v", null, c, { error: !!t.error }), e.set_attribute(d, "min", t.field.min), e.set_attribute(d, "max", t.field.max), e.set_attribute(d, "step", t.field.step ?? 1), d.disabled = t.field.disabled, e.set_value(d, e.get(r));
      }), e.delegated("change", d, i), e.append(s, a);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var tl = e.from_html('<input type="range"/> <span class="value svelte-1jyn88"> </span>', 1);
function nl(n, t) {
  e.push(t, !0);
  const r = e.derived(() => i(typeof t.value == "number" ? t.value : t.field.min, t.field.min, t.field.max));
  function i(l, a, d) {
    return Math.min(d, Math.max(a, l));
  }
  function s(l) {
    const a = Number(l.currentTarget.value);
    Number.isNaN(a) || t.onEdit(i(a, t.field.min, t.field.max));
  }
  cn(n, {
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
    children: (l, a) => {
      var d = tl(), c = e.first_child(d);
      e.remove_input_defaults(c);
      let o;
      var u = e.sibling(c, 2), p = e.child(u);
      e.reset(u), e.template_effect(() => {
        o = e.set_class(c, 1, "slider svelte-1jyn88", null, o, { error: !!t.error }), e.set_attribute(c, "min", t.field.min), e.set_attribute(c, "max", t.field.max), e.set_attribute(c, "step", t.field.step ?? 1), c.disabled = t.field.disabled, e.set_value(c, e.get(r)), e.set_text(p, `${e.get(r) ?? ""}${t.field.unit ? ` ${t.field.unit}` : ""}`);
      }), e.delegated("input", c, s), e.append(l, d);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["input"]);
var rl = e.from_html('<button type="button"> </button>'), il = e.from_html("<div></div>");
function sl(n, t) {
  e.push(t, !0);
  const r = e.derived(() => typeof t.value == "string" ? t.value : "");
  cn(n, {
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
    children: (i, s) => {
      var l = il();
      let a;
      e.each(l, 21, () => t.field.options, (d) => d.value, (d, c) => {
        var o = rl();
        let u;
        var p = e.child(o, !0);
        e.reset(o), e.template_effect(() => {
          o.disabled = t.field.disabled, u = e.set_class(o, 1, "svelte-iu603z", null, u, { active: e.get(r) === e.get(c).value }), e.set_text(p, e.get(c).label);
        }), e.delegated("click", o, () => t.onEdit(e.get(c).value)), e.append(d, o);
      }), e.reset(l), e.template_effect(() => a = e.set_class(l, 1, "seg svelte-iu603z", null, a, { error: !!t.error })), e.append(i, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
const ll = {
  boolean: Xs,
  string: Js,
  number: el,
  "number-range": nl,
  enum: sl
};
var al = e.from_html('<p class="empty svelte-mrn94a">No settings available.</p>'), ol = e.from_html('<div class="settings svelte-mrn94a"><h2 class="title svelte-mrn94a">Settings</h2> <!></div>');
function cl(n, t) {
  e.push(t, !0);
  let r = e.state(e.proxy(t.ctx.contributions.list(Fn))), i = e.state(e.proxy({})), s = e.state(e.proxy({}));
  e.user_effect(() => t.ctx.contributions.onChange(Fn, () => {
    e.set(r, t.ctx.contributions.list(Fn), !0);
  })), e.user_effect(() => {
    var y;
    const u = [], p = {};
    for (const g of e.get(r)) {
      p[g.shardId] = g.getValues();
      const f = (y = g.subscribe) == null ? void 0 : y.call(g, () => {
        e.set(i, { ...e.get(i), [g.shardId]: g.getValues() }, !0);
      });
      f && u.push(f);
    }
    return e.set(i, p, !0), e.set(s, Fs(e.get(s), e.get(r).map((g) => g.shardId)), !0), () => u.forEach((g) => g());
  });
  async function l(u, p, y) {
    try {
      await u.onEdit(p, y), e.set(s, Er(e.get(s), u.shardId, p, void 0), !0);
    } catch (g) {
      e.set(s, Er(e.get(s), u.shardId, p, g.message || "Invalid value"), !0);
    } finally {
      e.set(i, { ...e.get(i), [u.shardId]: u.getValues() }, !0);
    }
  }
  var a = ol(), d = e.sibling(e.child(a), 2);
  {
    var c = (u) => {
      var p = al();
      e.append(u, p);
    }, o = (u) => {
      var p = e.comment(), y = e.first_child(p);
      e.each(y, 17, () => e.get(r), (g) => g.shardId, (g, f) => {
        {
          let v = e.derived(() => e.get(r).length > 1);
          js(g, {
            get label() {
              return e.get(f).label;
            },
            get showHeader() {
              return e.get(v);
            },
            children: (_, h) => {
              var m = e.comment(), k = e.first_child(m);
              e.each(k, 17, () => e.get(f).schema, (C) => C.key, (C, P) => {
                var A = e.comment(), E = e.first_child(A);
                {
                  let R = e.derived(() => {
                    var O;
                    return (O = e.get(i)[e.get(f).shardId]) == null ? void 0 : O[e.get(P).key];
                  }), U = e.derived(() => {
                    var O;
                    return (O = e.get(s)[e.get(f).shardId]) == null ? void 0 : O[e.get(P).key];
                  });
                  e.component(E, () => ll[e.get(P).type], (O, B) => {
                    B(O, {
                      get field() {
                        return e.get(P);
                      },
                      get value() {
                        return e.get(R);
                      },
                      get error() {
                        return e.get(U);
                      },
                      onEdit: (G) => l(e.get(f), e.get(P).key, G)
                    });
                  });
                }
                e.append(C, A);
              }), e.append(_, m);
            }
          });
        }
      }), e.append(u, p);
    };
    e.if(d, (u) => {
      e.get(r).length === 0 ? u(c) : u(o, -1);
    });
  }
  e.reset(a), e.append(n, a), e.pop();
}
function dl(n, t = {}) {
  const r = t.warn ?? ((l) => console.warn(l)), i = /* @__PURE__ */ new Set(), s = [];
  for (let l = 0; l < n.length; l++) {
    const a = n[l];
    if (i.has(a.id)) {
      r(`[sh3-editor] duplicate help tab id "${a.id}" — first registration kept, this one ignored.`);
      continue;
    }
    i.add(a.id), s.push({ c: a, i: l });
  }
  return s.sort((l, a) => {
    const d = l.c.priority ?? 100, c = a.c.priority ?? 100;
    return d !== c ? d - c : l.i - a.i;
  }), s.map((l) => l.c);
}
function ul(n) {
  return {
    activeAppId: n.getActiveApp(),
    focusedViewId: n.readFocusedViewId(),
    mountedViewIds: [...n.listMountedViewIds()],
    selection: n.getSelection(),
    capturedAt: n.now()
  };
}
function fl(n) {
  const t = n.doc ?? (typeof document < "u" ? document : void 0);
  return {
    getActiveApp: () => n.getActiveAppId(),
    listMountedViewIds: () => {
      if (!t) return [];
      const r = t.querySelectorAll("[data-sh3-view]"), i = /* @__PURE__ */ new Set();
      return r.forEach((s) => {
        const l = s.getAttribute("data-sh3-view");
        l && i.add(l);
      }), [...i];
    },
    readFocusedViewId: () => {
      if (!t || !t.activeElement) return null;
      const r = t.activeElement.closest("[data-sh3-view]");
      return (r == null ? void 0 : r.getAttribute("data-sh3-view")) ?? null;
    },
    getSelection: () => n.getSelection(),
    now: () => Date.now()
  };
}
const gl = {
  Meta: "⌘",
  Ctrl: "⌃",
  Alt: "⌥",
  Shift: "⇧"
};
function vl(n, t) {
  if (!n) return "—";
  const r = n.split("+");
  if (t === "mac") {
    let i = "";
    for (let s = 0; s < r.length; s++) {
      const l = r[s];
      i += gl[l] ?? l;
    }
    return i;
  }
  return n;
}
function hl() {
  return typeof navigator > "u" ? "other" : (navigator.platform || navigator.userAgent || "").includes("Mac") ? "mac" : "other";
}
var pl = e.from_html('<span>App: <code class="svelte-151qe3m"> </code></span>'), ml = e.from_html('<span>Focused view: <code class="svelte-151qe3m"> </code></span>'), _l = e.from_html('<header class="ctx svelte-151qe3m"><!> <!> <!></header>'), bl = e.from_html('<p class="empty svelte-151qe3m">No hotkeys active in this context.</p>'), yl = e.from_html('<span class="badge svelte-151qe3m"> </span>'), wl = e.from_html('<li><span class="label svelte-151qe3m"> </span> <kbd class="kbd svelte-151qe3m"> </kbd> <!></li>'), kl = e.from_html('<section class="group svelte-151qe3m"><h3 class="group-title svelte-151qe3m"> </h3> <ul class="list svelte-151qe3m"></ul></section>'), xl = e.from_html('<div class="hotkeys-tab svelte-151qe3m"><!> <!></div>');
function Cl(n, t) {
  e.push(t, !0);
  const r = hl(), i = {
    home: "Global",
    app: "App",
    view: "View",
    focus: "Focus",
    element: "Selection"
  };
  function s(v) {
    if (v.scope === "home") return "home";
    if (v.scope === "app") return "app";
    if (typeof v.scope == "string") {
      if (v.scope.startsWith("view:")) return "view";
      if (v.scope.startsWith("focus:")) return "focus";
    }
    return "element";
  }
  const l = ["home", "app", "view", "focus", "element"], a = e.derived(() => {
    const v = /* @__PURE__ */ new Map();
    for (const _ of t.actions) {
      const h = s(_), m = v.get(h) ?? [];
      m.push(_), v.set(h, m);
    }
    for (const _ of v.values())
      _.sort((h, m) => {
        const k = h.group ?? "", C = m.group ?? "";
        return k !== C ? k.localeCompare(C) : h.label.localeCompare(m.label);
      });
    return l.map((_) => ({ tier: _, label: i[_], items: v.get(_) ?? [] })).filter((_) => _.items.length > 0);
  }), { snapshot: d } = t.tabCtx, c = d.activeAppId !== null || d.focusedViewId !== null;
  var o = xl(), u = e.child(o);
  {
    var p = (v) => {
      var _ = _l(), h = e.child(_);
      {
        var m = (E) => {
          var R = pl(), U = e.sibling(e.child(R)), O = e.child(U, !0);
          e.reset(U), e.reset(R), e.template_effect(() => e.set_text(O, d.activeAppId)), e.append(E, R);
        };
        e.if(h, (E) => {
          d.activeAppId && E(m);
        });
      }
      var k = e.sibling(h, 2);
      {
        var C = (E) => {
          var R = e.text("·");
          e.append(E, R);
        };
        e.if(k, (E) => {
          d.activeAppId && d.focusedViewId && E(C);
        });
      }
      var P = e.sibling(k, 2);
      {
        var A = (E) => {
          var R = ml(), U = e.sibling(e.child(R)), O = e.child(U, !0);
          e.reset(U), e.reset(R), e.template_effect(() => e.set_text(O, d.focusedViewId)), e.append(E, R);
        };
        e.if(P, (E) => {
          d.focusedViewId && E(A);
        });
      }
      e.reset(_), e.append(v, _);
    };
    e.if(u, (v) => {
      c && v(p);
    });
  }
  var y = e.sibling(u, 2);
  {
    var g = (v) => {
      var _ = bl();
      e.append(v, _);
    }, f = (v) => {
      var _ = e.comment(), h = e.first_child(_);
      e.each(h, 17, () => e.get(a), (m) => m.tier, (m, k) => {
        var C = kl(), P = e.child(C), A = e.child(P, !0);
        e.reset(P);
        var E = e.sibling(P, 2);
        e.each(E, 21, () => e.get(k).items, (R) => R.id, (R, U) => {
          var O = wl();
          let B;
          var G = e.child(O), D = e.child(G, !0);
          e.reset(G);
          var z = e.sibling(G, 2), W = e.child(z, !0);
          e.reset(z);
          var V = e.sibling(z, 2);
          {
            var Y = (re) => {
              var X = yl(), de = e.child(X, !0);
              e.reset(X), e.template_effect(() => e.set_text(de, e.get(U).scopeBadge)), e.append(re, X);
            };
            e.if(V, (re) => {
              e.get(U).scopeBadge && re(Y);
            });
          }
          e.reset(O), e.template_effect(
            (re) => {
              B = e.set_class(O, 1, "row svelte-151qe3m", null, B, { disabled: e.get(U).effectiveShortcut === null }), e.set_text(D, e.get(U).label), e.set_text(W, re);
            },
            [
              () => vl(e.get(U).effectiveShortcut, r)
            ]
          ), e.append(R, O);
        }), e.reset(E), e.reset(C), e.template_effect(() => e.set_text(A, e.get(k).label)), e.append(m, C);
      }), e.append(v, _);
    };
    e.if(y, (v) => {
      e.get(a).length === 0 ? v(g) : v(f, -1);
    });
  }
  e.reset(o), e.append(n, o), e.pop();
}
var Il = e.from_html('<button class="close-btn svelte-udgkd3" aria-label="Close help">×</button>'), Sl = e.from_html('<header class="help-header svelte-udgkd3"><span class="title svelte-udgkd3">Help</span> <!></header>'), Pl = e.from_html('<span class="tab-icon svelte-udgkd3"> </span>'), El = e.from_html('<button role="tab"><!> <span> </span></button>'), Tl = e.from_html('<div role="tabpanel"></div>'), Al = e.from_html('<div class="tab-strip svelte-udgkd3" role="tablist"></div> <div class="tab-bodies svelte-udgkd3"></div>', 1), Dl = e.from_html('<p class="loading svelte-udgkd3">Loading…</p>'), Ml = e.from_html('<div data-sh3-view="sh3-editor:help"><!> <!></div>');
function Tr(n, t) {
  e.push(t, !0);
  let r = e.state(null), i = e.state([]), s = [], l = e.state(0);
  const a = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
  function c(h) {
    if (a.has(h.id)) return;
    const m = d.get(h.id);
    if (!m || !e.get(r)) return;
    const k = {
      surface: t.surface,
      snapshot: e.get(r),
      close: t.surface === "modal" ? t.close : void 0
    };
    if (h.id === "sh3-editor:help-tab:hotkeys") {
      const C = mt(Cl, {
        target: m,
        props: { tabCtx: k, actions: s }
      });
      a.set(h.id, { unmount: () => st(C) });
    } else
      a.set(h.id, h.mount(m, k));
  }
  Dn(() => {
    const h = Ai(), m = fl({
      getActiveAppId: () => (h == null ? void 0 : h.id) ?? null,
      getSelection: () => t.ctx.actions.selection.get()
    });
    e.set(r, ul(m)), s = on.actions.listActive();
    const k = t.ctx.contributions.list(Wr);
    e.set(i, dl(k));
  }), jr(() => {
    var h;
    for (const m of a.values())
      try {
        m.unmount();
      } catch (k) {
        console.warn("[sh3-editor] Help tab unmount error:", k);
      }
    a.clear(), d.clear(), (h = t.onClose) == null || h.call(t);
  }), e.user_effect(() => {
    if (!e.get(r)) return;
    const h = e.get(i)[e.get(l)];
    h && queueMicrotask(() => c(h));
  });
  function o(h, m) {
    d.set(m, h);
    const k = e.get(i)[e.get(l)];
    return k && k.id === m && e.get(r) && c(k), {
      destroy() {
        d.delete(m);
      }
    };
  }
  var u = Ml();
  let p;
  var y = e.child(u);
  {
    var g = (h) => {
      var m = Sl(), k = e.sibling(e.child(m), 2);
      {
        var C = (P) => {
          var A = Il();
          e.delegated("click", A, function(...E) {
            var R;
            (R = t.close) == null || R.apply(this, E);
          }), e.append(P, A);
        };
        e.if(k, (P) => {
          t.close && P(C);
        });
      }
      e.reset(m), e.append(h, m);
    };
    e.if(y, (h) => {
      t.surface === "modal" && h(g);
    });
  }
  var f = e.sibling(y, 2);
  {
    var v = (h) => {
      var m = Al(), k = e.first_child(m);
      e.each(k, 23, () => e.get(i), (P) => P.id, (P, A, E) => {
        var R = El();
        let U;
        var O = e.child(R);
        {
          var B = (z) => {
            var W = Pl(), V = e.child(W, !0);
            e.reset(W), e.template_effect(() => e.set_text(V, e.get(A).icon)), e.append(z, W);
          };
          e.if(O, (z) => {
            e.get(A).icon && z(B);
          });
        }
        var G = e.sibling(O, 2), D = e.child(G, !0);
        e.reset(G), e.reset(R), e.template_effect(() => {
          U = e.set_class(R, 1, "tab-btn svelte-udgkd3", null, U, { active: e.get(E) === e.get(l) }), e.set_attribute(R, "aria-selected", e.get(E) === e.get(l)), e.set_text(D, e.get(A).label);
        }), e.delegated("click", R, () => e.set(l, e.get(E), !0)), e.append(P, R);
      }), e.reset(k);
      var C = e.sibling(k, 2);
      e.each(C, 23, () => e.get(i), (P) => P.id, (P, A, E) => {
        var R = Tl();
        let U;
        e.action(R, (O, B) => o == null ? void 0 : o(O, B), () => e.get(A).id), e.template_effect(() => U = e.set_class(R, 1, "tab-body svelte-udgkd3", null, U, { active: e.get(E) === e.get(l) })), e.append(P, R);
      }), e.reset(C), e.append(h, m);
    }, _ = (h) => {
      var m = Dl();
      e.append(h, m);
    };
    e.if(f, (h) => {
      e.get(i).length > 0 ? h(v) : h(_, -1);
    });
  }
  e.reset(u), e.template_effect(() => p = e.set_class(u, 1, "help-root svelte-udgkd3", null, p, { "modal-surface": t.surface === "modal" })), e.append(n, u), e.pop();
}
e.delegate(["click"]);
var Rl = e.from_html('<span class="icon"> </span>'), Nl = e.from_html('<div class="port input svelte-y92dsd"><span class="port-marker svelte-y92dsd"></span> <span class="port-label"> </span></div>'), Ol = e.from_html('<div class="port output svelte-y92dsd"><span class="port-label"> </span> <span class="port-marker svelte-y92dsd"></span></div>'), zl = e.from_html('<div role="button" tabindex="0"><div class="header svelte-y92dsd"><!> <span class="label"> </span></div> <div class="ports svelte-y92dsd"><div class="ports-col inputs svelte-y92dsd"></div> <div class="ports-col outputs svelte-y92dsd"></div></div></div>');
function Hl(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => t.node.ports.filter((v) => v.direction === "input")), i = e.derived(() => t.node.ports.filter((v) => v.direction === "output"));
  var s = zl();
  let l, a;
  var d = e.child(s), c = e.child(d);
  {
    var o = (v) => {
      var _ = Rl(), h = e.child(_, !0);
      e.reset(_), e.template_effect(() => e.set_text(h, t.visuals.icon)), e.append(v, _);
    };
    e.if(c, (v) => {
      t.visuals.icon && v(o);
    });
  }
  var u = e.sibling(c, 2), p = e.child(u, !0);
  e.reset(u), e.reset(d);
  var y = e.sibling(d, 2), g = e.child(y);
  e.each(g, 21, () => e.get(r), (v) => v.shortId, (v, _) => {
    var h = Nl(), m = e.sibling(e.child(h), 2), k = e.child(m, !0);
    e.reset(m), e.reset(h), e.template_effect(() => {
      e.set_attribute(h, "data-port-id", e.get(_).shortId), e.set_attribute(h, "data-data-type", e.get(_).dataType ?? ""), e.set_text(k, e.get(_).label);
    }), e.delegated("pointerdown", h, (C) => {
      var P;
      return (P = t.onPortPointerDown) == null ? void 0 : P.call(t, e.get(_), C);
    }), e.delegated("pointerup", h, (C) => {
      var P;
      return (P = t.onPortPointerUp) == null ? void 0 : P.call(t, e.get(_), C);
    }), e.append(v, h);
  }), e.reset(g);
  var f = e.sibling(g, 2);
  e.each(f, 21, () => e.get(i), (v) => v.shortId, (v, _) => {
    var h = Ol(), m = e.child(h), k = e.child(m, !0);
    e.reset(m), e.next(2), e.reset(h), e.template_effect(() => {
      e.set_attribute(h, "data-port-id", e.get(_).shortId), e.set_attribute(h, "data-data-type", e.get(_).dataType ?? ""), e.set_text(k, e.get(_).label);
    }), e.delegated("pointerdown", h, (C) => {
      var P;
      return (P = t.onPortPointerDown) == null ? void 0 : P.call(t, e.get(_), C);
    }), e.delegated("pointerup", h, (C) => {
      var P;
      return (P = t.onPortPointerUp) == null ? void 0 : P.call(t, e.get(_), C);
    }), e.append(v, h);
  }), e.reset(f), e.reset(y), e.reset(s), e.template_effect(() => {
    l = e.set_class(s, 1, "graph-node svelte-y92dsd", null, l, { selected: t.selected }), e.set_attribute(s, "data-node-id", t.node.id), a = e.set_style(s, "", a, {
      left: `${t.node.position.x ?? ""}px`,
      top: `${t.node.position.y ?? ""}px`,
      width: `${t.node.width ?? ""}px`,
      "min-height": `${t.node.height ?? ""}px`,
      "--border-color": t.visuals.borderColor,
      "--text-color": t.visuals.textColor ?? "var(--sh3-text-primary, #ddd)"
    }), e.set_text(p, t.node.label);
  }), e.delegated("click", s, (v) => {
    var _;
    return (_ = t.onSelectClick) == null ? void 0 : _.call(t, v);
  }), e.delegated("pointerdown", d, (v) => {
    var _;
    return (_ = t.onHeaderPointerDown) == null ? void 0 : _.call(t, v);
  }), e.append(n, s), e.pop();
}
e.delegate(["click", "pointerdown", "pointerup"]);
function Ul(n, t) {
  const r = Math.abs(t.x - n.x), i = Math.max(40, Math.min(160, r * 0.5)), s = { x: n.x + i, y: n.y }, l = { x: t.x - i, y: t.y };
  return `M ${n.x} ${n.y} C ${s.x} ${s.y} ${l.x} ${l.y} ${t.x} ${t.y}`;
}
var Ll = e.from_svg('<path class="halo svelte-1rehop2"></path>'), Vl = e.from_svg('<defs><marker markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z"></path></marker></defs>'), Fl = e.from_svg('<g role="presentation"><!><path class="line svelte-1rehop2"></path><!></g>');
function Bl(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => Ul(t.source, t.target));
  var i = Fl();
  let s;
  var l = e.child(i);
  {
    var a = (u) => {
      var p = Ll();
      e.template_effect(() => e.set_attribute(p, "d", e.get(r))), e.append(u, p);
    };
    e.if(l, (u) => {
      t.selected && u(a);
    });
  }
  var d = e.sibling(l), c = e.sibling(d);
  {
    var o = (u) => {
      var p = Vl(), y = e.child(p), g = e.child(y);
      e.reset(y), e.reset(p), e.template_effect(() => {
        e.set_attribute(y, "id", `arrow-${t.id ?? ""}`), e.set_attribute(g, "fill", t.color);
      }), e.append(u, p);
    };
    e.if(c, (u) => {
      t.oriented && u(o);
    });
  }
  e.reset(i), e.template_effect(() => {
    s = e.set_class(i, 0, "edge svelte-1rehop2", null, s, { selected: t.selected }), e.set_attribute(d, "d", e.get(r)), e.set_attribute(d, "stroke", t.color), e.set_attribute(d, "marker-end", t.oriented ? `url(#arrow-${t.id})` : null);
  }), e.delegated("click", i, (u) => {
    var p;
    return (p = t.onClick) == null ? void 0 : p.call(t, u);
  }), e.append(n, i), e.pop();
}
e.delegate(["click"]);
var ql = e.from_html('<button class="item svelte-lpiq26"> </button>'), jl = e.from_html('<div class="cat"><div class="cat-name svelte-lpiq26"> </div> <!></div>'), Gl = e.from_html('<div class="palette svelte-lpiq26"><input class="search svelte-lpiq26" type="text" placeholder="Search node types…"/> <div class="lists svelte-lpiq26"></div></div>');
function Kl(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  let r = e.state("");
  const i = e.derived(() => {
    if (!e.get(r)) return t.byCategory;
    const c = e.get(r).toLowerCase(), o = /* @__PURE__ */ new Map();
    for (const [u, p] of t.byCategory) {
      const y = p.filter((g) => g.label.toLowerCase().includes(c) || g.type.toLowerCase().includes(c));
      y.length > 0 && o.set(u, y);
    }
    return o;
  });
  var s = Gl();
  let l;
  var a = e.child(s);
  e.remove_input_defaults(a), e.autofocus(a, !0);
  var d = e.sibling(a, 2);
  e.each(d, 21, () => [...e.get(i)], ([c, o]) => c, (c, o) => {
    var u = e.derived(() => e.to_array(e.get(o), 2));
    let p = () => e.get(u)[0], y = () => e.get(u)[1];
    var g = jl(), f = e.child(g), v = e.child(f, !0);
    e.reset(f);
    var _ = e.sibling(f, 2);
    e.each(_, 17, y, (h) => h.type, (h, m) => {
      var k = ql(), C = e.child(k, !0);
      e.reset(k), e.template_effect(() => e.set_text(C, e.get(m).label)), e.delegated("click", k, () => t.onPick(e.get(m))), e.append(h, k);
    }), e.reset(g), e.template_effect(() => e.set_text(v, p())), e.append(c, g);
  }), e.reset(d), e.reset(s), e.template_effect(() => l = e.set_style(s, "", l, { left: `${t.x ?? ""}px`, top: `${t.y ?? ""}px` })), e.bind_value(a, () => e.get(r), (c) => e.set(r, c)), e.append(n, s), e.pop();
}
e.delegate(["click"]);
var Wl = e.from_html('<div class="toolbar svelte-ypcyd2" role="toolbar" aria-label="Graph viewport"><button type="button" title="Zoom out (Mod+-)" class="svelte-ypcyd2">−</button> <button type="button" title="Reset zoom (Mod+0)" class="zoom-label svelte-ypcyd2"> </button> <button type="button" title="Zoom in (Mod+=)" class="svelte-ypcyd2">+</button> <button type="button" title="Fit content (Shift+1)" class="svelte-ypcyd2">⤢</button></div>');
function Yl(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => `${Math.round(t.zoom * 100)}%`);
  var i = Wl(), s = e.child(i), l = e.sibling(s, 2), a = e.child(l, !0);
  e.reset(l);
  var d = e.sibling(l, 2), c = e.sibling(d, 2);
  e.reset(i), e.template_effect(() => e.set_text(a, e.get(r))), e.delegated("click", s, () => t.onZoomOut()), e.delegated("click", l, () => t.onZoomReset()), e.delegated("click", d, () => t.onZoomIn()), e.delegated("click", c, () => t.onFit()), e.append(n, i), e.pop();
}
e.delegate(["click"]);
const me = Symbol(), Xl = !1;
var Zl = Array.isArray, Jl = Array.prototype.indexOf, zt = Array.prototype.includes, Bn = Object.getOwnPropertyDescriptor, Ql = Object.prototype, $l = Array.prototype, ea = Object.getPrototypeOf;
const ta = () => {
};
function na(n) {
  for (var t = 0; t < n.length; t++)
    n[t]();
}
function ra() {
  var n, t, r = new Promise((i, s) => {
    n = i, t = s;
  });
  return { promise: r, resolve: n, reject: t };
}
const be = 2, Wn = 4, ia = 8, Zr = 1 << 24, yt = 16, Ht = 32, $t = 64, sa = 128, Fe = 512, he = 1024, ke = 2048, Xe = 4096, Qt = 8192, ct = 16384, dn = 32768, Ar = 1 << 25, Yn = 1 << 17, la = 1 << 18, kt = 65536, Xn = 1 << 21, kn = 1 << 22, en = 1 << 23, qn = Symbol("$state"), sr = new class extends Error {
  constructor() {
    super(...arguments);
    ae(this, "name", "StaleReactionError");
    ae(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
function aa() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function oa() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ca() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function da() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ua(n) {
  return n === this.v;
}
let fa = !1;
function Jr() {
  return !0;
}
let At = [];
function ga() {
  var n = At;
  At = [], na(n);
}
function Dr(n) {
  if (At.length === 0) {
    var t = At;
    queueMicrotask(() => {
      t === At && ga();
    });
  }
  At.push(n);
}
function va(n) {
  var t = xe;
  if (t === null)
    return Z.f |= en, n;
  if ((t.f & dn) === 0 && (t.f & Wn) === 0)
    throw n;
  Qr(n, t);
}
function Qr(n, t) {
  for (; t !== null; ) {
    if ((t.f & sa) !== 0) {
      if ((t.f & dn) === 0)
        throw n;
      try {
        t.b.error(n);
        return;
      } catch (r) {
        n = r;
      }
    }
    t = t.parent;
  }
  throw n;
}
const ha = -7169;
function ce(n, t) {
  n.f = n.f & ha | t;
}
function lr(n) {
  (n.f & Fe) !== 0 || n.deps === null ? ce(n, he) : ce(n, Xe);
}
function $r(n) {
  if (n !== null)
    for (const t of n)
      (t.f & be) === 0 || (t.f & kt) === 0 || (t.f ^= kt, $r(
        /** @type {Derived} */
        t.deps
      ));
}
function pa(n, t, r) {
  (n.f & ke) !== 0 ? t.add(n) : (n.f & Xe) !== 0 && r.add(n), $r(n.deps), ce(n, he);
}
const ht = /* @__PURE__ */ new Set();
let ee = null, ge = null, Zn = null, jn = !1, gn = null, vn = null;
var Mr = 0;
let ma = 1;
var Dt, Mt, et, Ge, ln, Pe, an, lt, tt, Ke, Rt, Nt, bt, le, hn, ei, pn, Qn, mn, _a;
const Pn = class Pn {
  constructor() {
    K(this, le);
    ae(this, "id", ma++);
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    ae(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    ae(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    K(this, Dt, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    K(this, Mt, /* @__PURE__ */ new Set());
    /**
     * Async effects that are currently in flight
     * @type {Map<Effect, number>}
     */
    K(this, et, /* @__PURE__ */ new Map());
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    K(this, Ge, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    K(this, ln, null);
    /**
     * The root effects that need to be flushed
     * @type {Effect[]}
     */
    K(this, Pe, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    K(this, an, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    K(this, lt, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    K(this, tt, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    K(this, Ke, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    K(this, Rt, /* @__PURE__ */ new Set());
    ae(this, "is_fork", !1);
    K(this, Nt, !1);
    /** @type {Set<Batch>} */
    K(this, bt, /* @__PURE__ */ new Set());
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    x(this, Ke).has(t) || x(this, Ke).set(t, { d: [], m: [] }), x(this, Rt).delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, r = (i) => this.schedule(i)) {
    var i = x(this, Ke).get(t);
    if (i) {
      x(this, Ke).delete(t);
      for (var s of i.d)
        ce(s, ke), r(s);
      for (s of i.m)
        ce(s, Xe), r(s);
    }
    x(this, Rt).add(t);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, r, i = !1) {
    t.v !== me && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & en) === 0 && (this.current.set(t, [r, i]), ge == null || ge.set(t, r)), this.is_fork || (t.v = r);
  }
  activate() {
    ee = this;
  }
  deactivate() {
    ee = null, ge = null;
  }
  flush() {
    try {
      jn = !0, ee = this, ne(this, le, pn).call(this);
    } finally {
      Mr = 0, Zn = null, gn = null, vn = null, jn = !1, ee = null, ge = null, wt.clear();
    }
  }
  discard() {
    for (const t of x(this, Mt)) t(this);
    x(this, Mt).clear(), ht.delete(this);
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    x(this, an).push(t);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, r) {
    let i = x(this, et).get(r) ?? 0;
    if (x(this, et).set(r, i + 1), t) {
      let s = x(this, Ge).get(r) ?? 0;
      x(this, Ge).set(r, s + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   * @param {boolean} skip - whether to skip updates (because this is triggered by a stale reaction)
   */
  decrement(t, r, i) {
    let s = x(this, et).get(r) ?? 0;
    if (s === 1 ? x(this, et).delete(r) : x(this, et).set(r, s - 1), t) {
      let l = x(this, Ge).get(r) ?? 0;
      l === 1 ? x(this, Ge).delete(r) : x(this, Ge).set(r, l - 1);
    }
    x(this, Nt) || i || (St(this, Nt, !0), Dr(() => {
      St(this, Nt, !1), this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, r) {
    for (const i of t)
      x(this, lt).add(i);
    for (const i of r)
      x(this, tt).add(i);
    t.clear(), r.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    x(this, Dt).add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    x(this, Mt).add(t);
  }
  settled() {
    return (x(this, ln) ?? St(this, ln, ra())).promise;
  }
  static ensure() {
    if (ee === null) {
      const t = ee = new Pn();
      jn || (ht.add(ee), Dr(() => {
        ee === t && t.flush();
      }));
    }
    return ee;
  }
  apply() {
    {
      ge = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    var s;
    if (Zn = t, (s = t.b) != null && s.is_pending && (t.f & (Wn | ia | Zr)) !== 0 && (t.f & dn) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var r = t; r.parent !== null; ) {
      r = r.parent;
      var i = r.f;
      if (gn !== null && r === xe && (Z === null || (Z.f & be) === 0))
        return;
      if ((i & ($t | Ht)) !== 0) {
        if ((i & he) === 0)
          return;
        r.f ^= he;
      }
    }
    x(this, Pe).push(r);
  }
};
Dt = new WeakMap(), Mt = new WeakMap(), et = new WeakMap(), Ge = new WeakMap(), ln = new WeakMap(), Pe = new WeakMap(), an = new WeakMap(), lt = new WeakMap(), tt = new WeakMap(), Ke = new WeakMap(), Rt = new WeakMap(), Nt = new WeakMap(), bt = new WeakMap(), le = new WeakSet(), hn = function() {
  return this.is_fork || x(this, Ge).size > 0;
}, ei = function() {
  for (const i of x(this, bt))
    for (const s of x(i, Ge).keys()) {
      for (var t = !1, r = s; r.parent !== null; ) {
        if (x(this, Ke).has(r)) {
          t = !0;
          break;
        }
        r = r.parent;
      }
      if (!t)
        return !0;
    }
  return !1;
}, pn = function() {
  var d, c;
  if (Mr++ > 1e3 && (ht.delete(this), ba()), !ne(this, le, hn).call(this)) {
    for (const o of x(this, lt))
      x(this, tt).delete(o), ce(o, ke), this.schedule(o);
    for (const o of x(this, tt))
      ce(o, Xe), this.schedule(o);
  }
  const t = x(this, Pe);
  St(this, Pe, []), this.apply();
  var r = gn = [], i = [], s = vn = [];
  for (const o of t)
    try {
      ne(this, le, Qn).call(this, o, r, i);
    } catch (u) {
      throw ri(o), u;
    }
  if (ee = null, s.length > 0) {
    var l = Pn.ensure();
    for (const o of s)
      l.schedule(o);
  }
  if (gn = null, vn = null, ne(this, le, hn).call(this) || ne(this, le, ei).call(this)) {
    ne(this, le, mn).call(this, i), ne(this, le, mn).call(this, r);
    for (const [o, u] of x(this, Ke))
      ni(o, u);
  } else {
    x(this, et).size === 0 && ht.delete(this), x(this, lt).clear(), x(this, tt).clear();
    for (const o of x(this, Dt)) o(this);
    x(this, Dt).clear(), Rr(i), Rr(r), (d = x(this, ln)) == null || d.resolve();
  }
  var a = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    ee
  );
  if (x(this, Pe).length > 0) {
    const o = a ?? (a = this);
    x(o, Pe).push(...x(this, Pe).filter((u) => !x(o, Pe).includes(u)));
  }
  a !== null && (ht.add(a), ne(c = a, le, pn).call(c));
}, /**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 * @param {Effect[]} effects
 * @param {Effect[]} render_effects
 */
Qn = function(t, r, i) {
  t.f ^= he;
  for (var s = t.first; s !== null; ) {
    var l = s.f, a = (l & (Ht | $t)) !== 0, d = a && (l & he) !== 0, c = d || (l & Qt) !== 0 || x(this, Ke).has(s);
    if (!c && s.fn !== null) {
      a ? s.f ^= he : (l & Wn) !== 0 ? r.push(s) : un(s) && ((l & yt) !== 0 && x(this, tt).add(s), nn(s));
      var o = s.first;
      if (o !== null) {
        s = o;
        continue;
      }
    }
    for (; s !== null; ) {
      var u = s.next;
      if (u !== null) {
        s = u;
        break;
      }
      s = s.parent;
    }
  }
}, /**
 * @param {Effect[]} effects
 */
mn = function(t) {
  for (var r = 0; r < t.length; r += 1)
    pa(t[r], x(this, lt), x(this, tt));
}, _a = function() {
  var u, p, y;
  for (const g of ht) {
    var t = g.id < this.id, r = [];
    for (const [f, [v, _]] of this.current) {
      if (g.current.has(f)) {
        var i = (
          /** @type {[any, boolean]} */
          g.current.get(f)[0]
        );
        if (t && v !== i)
          g.current.set(f, [v, _]);
        else
          continue;
      }
      r.push(f);
    }
    var s = [...g.current.keys()].filter((f) => !this.current.has(f));
    if (s.length === 0)
      t && g.discard();
    else if (r.length > 0) {
      if (t)
        for (const f of x(this, Rt))
          g.unskip_effect(f, (v) => {
            var _;
            (v.f & (yt | kn)) !== 0 ? g.schedule(v) : ne(_ = g, le, mn).call(_, [v]);
          });
      g.activate();
      var l = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
      for (var d of r)
        ti(d, s, l, a);
      a = /* @__PURE__ */ new Map();
      var c = [...g.current.keys()].filter(
        (f) => this.current.has(f) ? (
          /** @type {[any, boolean]} */
          this.current.get(f)[0] !== f
        ) : !0
      );
      for (const f of x(this, an))
        (f.f & (ct | Qt | Yn)) === 0 && ar(f, c, a) && ((f.f & (kn | yt)) !== 0 ? (ce(f, ke), g.schedule(f)) : x(g, lt).add(f));
      if (x(g, Pe).length > 0) {
        g.apply();
        for (var o of x(g, Pe))
          ne(u = g, le, Qn).call(u, o, [], []);
        St(g, Pe, []);
      }
      g.deactivate();
    }
  }
  for (const g of ht)
    x(g, bt).has(this) && (x(g, bt).delete(this), x(g, bt).size === 0 && !ne(p = g, le, hn).call(p) && (g.activate(), ne(y = g, le, pn).call(y)));
};
let Jn = Pn;
function ba() {
  try {
    aa();
  } catch (n) {
    Qr(n, Zn);
  }
}
let ze = null;
function Rr(n) {
  var t = n.length;
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var i = n[r++];
      if ((i.f & (ct | Qt)) === 0 && un(i) && (ze = /* @__PURE__ */ new Set(), nn(i), i.deps === null && i.first === null && i.nodes === null && i.teardown === null && i.ac === null && ui(i), (ze == null ? void 0 : ze.size) > 0)) {
        wt.clear();
        for (const s of ze) {
          if ((s.f & (ct | Qt)) !== 0) continue;
          const l = [s];
          let a = s.parent;
          for (; a !== null; )
            ze.has(a) && (ze.delete(a), l.push(a)), a = a.parent;
          for (let d = l.length - 1; d >= 0; d--) {
            const c = l[d];
            (c.f & (ct | Qt)) === 0 && nn(c);
          }
        }
        ze.clear();
      }
    }
    ze = null;
  }
}
function ti(n, t, r, i) {
  if (!r.has(n) && (r.add(n), n.reactions !== null))
    for (const s of n.reactions) {
      const l = s.f;
      (l & be) !== 0 ? ti(
        /** @type {Derived} */
        s,
        t,
        r,
        i
      ) : (l & (kn | yt)) !== 0 && (l & ke) === 0 && ar(s, t, i) && (ce(s, ke), or(
        /** @type {Effect} */
        s
      ));
    }
}
function ar(n, t, r) {
  const i = r.get(n);
  if (i !== void 0) return i;
  if (n.deps !== null)
    for (const s of n.deps) {
      if (zt.call(t, s))
        return !0;
      if ((s.f & be) !== 0 && ar(
        /** @type {Derived} */
        s,
        t,
        r
      ))
        return r.set(
          /** @type {Derived} */
          s,
          !0
        ), !0;
    }
  return r.set(n, !1), !1;
}
function or(n) {
  ee.schedule(n);
}
function ni(n, t) {
  if (!((n.f & Ht) !== 0 && (n.f & he) !== 0)) {
    (n.f & ke) !== 0 ? t.d.push(n) : (n.f & Xe) !== 0 && t.m.push(n), ce(n, he);
    for (var r = n.first; r !== null; )
      ni(r, t), r = r.next;
  }
}
function ri(n) {
  ce(n, he);
  for (var t = n.first; t !== null; )
    ri(t), t = t.next;
}
function ya(n) {
  var t = n.effects;
  if (t !== null) {
    n.effects = null;
    for (var r = 0; r < t.length; r += 1)
      fr(
        /** @type {Effect} */
        t[r]
      );
  }
}
function wa(n) {
  for (var t = n.parent; t !== null; ) {
    if ((t.f & be) === 0)
      return (t.f & ct) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function cr(n) {
  var t, r = xe;
  xn(wa(n));
  try {
    n.f &= ~kt, ya(n), t = hi(n);
  } finally {
    xn(r);
  }
  return t;
}
function ii(n) {
  var t = cr(n);
  if (!n.equals(t) && (n.wv = gi(), (!(ee != null && ee.is_fork) || n.deps === null) && (ee !== null ? ee.capture(n, t, !0) : n.v = t, n.deps === null))) {
    ce(n, he);
    return;
  }
  Ut || (ge !== null ? (ci() || ee != null && ee.is_fork) && ge.set(n, t) : lr(n));
}
function ka(n) {
  var t, r;
  if (n.effects !== null)
    for (const i of n.effects)
      (i.teardown || i.ac) && ((t = i.teardown) == null || t.call(i), (r = i.ac) == null || r.abort(sr), i.teardown = ta, i.ac = null, tn(i, 0), ur(i));
}
function si(n) {
  if (n.effects !== null)
    for (const t of n.effects)
      t.teardown && nn(t);
}
let $n = /* @__PURE__ */ new Set();
const wt = /* @__PURE__ */ new Map();
let li = !1;
function dr(n, t) {
  var r = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: n,
    reactions: null,
    equals: ua,
    rv: 0,
    wv: 0
  };
  return r;
}
// @__NO_SIDE_EFFECTS__
function ye(n, t) {
  const r = dr(n);
  return Ta(r), r;
}
function ve(n, t, r = !1) {
  Z !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!ot || (Z.f & Yn) !== 0) && Jr() && (Z.f & (be | yt | kn | Yn)) !== 0 && (Me === null || !zt.call(Me, n)) && da();
  let i = r ? Zt(t) : t;
  return xa(n, i, vn);
}
function xa(n, t, r = null) {
  if (!n.equals(t)) {
    wt.set(n, Ut ? t : n.v);
    var i = Jn.ensure();
    if (i.capture(n, t), (n.f & be) !== 0) {
      const s = (
        /** @type {Derived} */
        n
      );
      (n.f & ke) !== 0 && cr(s), ge === null && lr(s);
    }
    n.wv = gi(), ai(n, ke, r), xe !== null && (xe.f & he) !== 0 && (xe.f & (Ht | $t)) === 0 && (Ae === null ? Aa([n]) : Ae.push(n)), !i.is_fork && $n.size > 0 && !li && Ca();
  }
  return t;
}
function Ca() {
  li = !1;
  for (const n of $n)
    (n.f & he) !== 0 && ce(n, Xe), un(n) && nn(n);
  $n.clear();
}
function Le(n) {
  ve(n, n.v + 1);
}
function ai(n, t, r) {
  var i = n.reactions;
  if (i !== null)
    for (var s = i.length, l = 0; l < s; l++) {
      var a = i[l], d = a.f, c = (d & ke) === 0;
      if (c && ce(a, t), (d & be) !== 0) {
        var o = (
          /** @type {Derived} */
          a
        );
        ge == null || ge.delete(o), (d & kt) === 0 && (d & Fe && (a.f |= kt), ai(o, Xe, r));
      } else if (c) {
        var u = (
          /** @type {Effect} */
          a
        );
        (d & yt) !== 0 && ze !== null && ze.add(u), r !== null ? r.push(u) : or(u);
      }
    }
}
function Zt(n) {
  if (typeof n != "object" || n === null || qn in n)
    return n;
  const t = ea(n);
  if (t !== Ql && t !== $l)
    return n;
  var r = /* @__PURE__ */ new Map(), i = Zl(n), s = /* @__PURE__ */ ye(0), l = Be, a = (d) => {
    if (Be === l)
      return d();
    var c = Z, o = Be;
    Lt(null), Or(l);
    var u = d();
    return Lt(c), Or(o), u;
  };
  return i && r.set("length", /* @__PURE__ */ ye(
    /** @type {any[]} */
    n.length
  )), new Proxy(
    /** @type {any} */
    n,
    {
      defineProperty(d, c, o) {
        (!("value" in o) || o.configurable === !1 || o.enumerable === !1 || o.writable === !1) && oa();
        var u = r.get(c);
        return u === void 0 ? a(() => {
          var p = /* @__PURE__ */ ye(o.value);
          return r.set(c, p), p;
        }) : ve(u, o.value, !0), !0;
      },
      deleteProperty(d, c) {
        var o = r.get(c);
        if (o === void 0) {
          if (c in d) {
            const u = a(() => /* @__PURE__ */ ye(me));
            r.set(c, u), Le(s);
          }
        } else
          ve(o, me), Le(s);
        return !0;
      },
      get(d, c, o) {
        var g;
        if (c === qn)
          return n;
        var u = r.get(c), p = c in d;
        if (u === void 0 && (!p || (g = Bn(d, c)) != null && g.writable) && (u = a(() => {
          var f = Zt(p ? d[c] : me), v = /* @__PURE__ */ ye(f);
          return v;
        }), r.set(c, u)), u !== void 0) {
          var y = oe(u);
          return y === me ? void 0 : y;
        }
        return Reflect.get(d, c, o);
      },
      getOwnPropertyDescriptor(d, c) {
        var o = Reflect.getOwnPropertyDescriptor(d, c);
        if (o && "value" in o) {
          var u = r.get(c);
          u && (o.value = oe(u));
        } else if (o === void 0) {
          var p = r.get(c), y = p == null ? void 0 : p.v;
          if (p !== void 0 && y !== me)
            return {
              enumerable: !0,
              configurable: !0,
              value: y,
              writable: !0
            };
        }
        return o;
      },
      has(d, c) {
        var y;
        if (c === qn)
          return !0;
        var o = r.get(c), u = o !== void 0 && o.v !== me || Reflect.has(d, c);
        if (o !== void 0 || xe !== null && (!u || (y = Bn(d, c)) != null && y.writable)) {
          o === void 0 && (o = a(() => {
            var g = u ? Zt(d[c]) : me, f = /* @__PURE__ */ ye(g);
            return f;
          }), r.set(c, o));
          var p = oe(o);
          if (p === me)
            return !1;
        }
        return u;
      },
      set(d, c, o, u) {
        var k;
        var p = r.get(c), y = c in d;
        if (i && c === "length")
          for (var g = o; g < /** @type {Source<number>} */
          p.v; g += 1) {
            var f = r.get(g + "");
            f !== void 0 ? ve(f, me) : g in d && (f = a(() => /* @__PURE__ */ ye(me)), r.set(g + "", f));
          }
        if (p === void 0)
          (!y || (k = Bn(d, c)) != null && k.writable) && (p = a(() => /* @__PURE__ */ ye(void 0)), ve(p, Zt(o)), r.set(c, p));
        else {
          y = p.v !== me;
          var v = a(() => Zt(o));
          ve(p, v);
        }
        var _ = Reflect.getOwnPropertyDescriptor(d, c);
        if (_ != null && _.set && _.set.call(u, o), !y) {
          if (i && typeof c == "string") {
            var h = (
              /** @type {Source<number>} */
              r.get("length")
            ), m = Number(c);
            Number.isInteger(m) && m >= h.v && ve(h, m + 1);
          }
          Le(s);
        }
        return !0;
      },
      ownKeys(d) {
        oe(s);
        var c = Reflect.ownKeys(d).filter((p) => {
          var y = r.get(p);
          return y === void 0 || y.v !== me;
        });
        for (var [o, u] of r)
          u.v !== me && !(o in d) && c.push(o);
        return c;
      },
      setPrototypeOf() {
        ca();
      }
    }
  );
}
var Ia;
// @__NO_SIDE_EFFECTS__
function Sa(n) {
  return (
    /** @type {TemplateNode | null} */
    Ia.call(n)
  );
}
function oi(n) {
  var t = Z, r = xe;
  Lt(null), xn(null);
  try {
    return n();
  } finally {
    Lt(t), xn(r);
  }
}
function ci() {
  return Z !== null && !ot;
}
function di(n) {
  var t = n.teardown;
  if (t !== null) {
    const r = Ut, i = Z;
    Nr(!0), Lt(null);
    try {
      t.call(null);
    } finally {
      Nr(r), Lt(i);
    }
  }
}
function ur(n, t = !1) {
  var r = n.first;
  for (n.first = n.last = null; r !== null; ) {
    const s = r.ac;
    s !== null && oi(() => {
      s.abort(sr);
    });
    var i = r.next;
    (r.f & $t) !== 0 ? r.parent = null : fr(r, t), r = i;
  }
}
function Pa(n) {
  for (var t = n.first; t !== null; ) {
    var r = t.next;
    (t.f & Ht) === 0 && fr(t), t = r;
  }
}
function fr(n, t = !0) {
  var r = !1;
  (t || (n.f & la) !== 0) && n.nodes !== null && n.nodes.end !== null && (Ea(
    n.nodes.start,
    /** @type {TemplateNode} */
    n.nodes.end
  ), r = !0), ce(n, Ar), ur(n, t && !r), tn(n, 0);
  var i = n.nodes && n.nodes.t;
  if (i !== null)
    for (const l of i)
      l.stop();
  di(n), n.f ^= Ar, n.f |= ct;
  var s = n.parent;
  s !== null && s.first !== null && ui(n), n.next = n.prev = n.teardown = n.ctx = n.deps = n.fn = n.nodes = n.ac = n.b = null;
}
function Ea(n, t) {
  for (; n !== null; ) {
    var r = n === t ? null : /* @__PURE__ */ Sa(n);
    n.remove(), n = r;
  }
}
function ui(n) {
  var t = n.parent, r = n.prev, i = n.next;
  r !== null && (r.next = i), i !== null && (i.prev = r), t !== null && (t.first === n && (t.first = i), t.last === n && (t.last = r));
}
let _n = !1, Ut = !1;
function Nr(n) {
  Ut = n;
}
let Z = null, ot = !1;
function Lt(n) {
  Z = n;
}
let xe = null;
function xn(n) {
  xe = n;
}
let Me = null;
function Ta(n) {
  Z !== null && (Me === null ? Me = [n] : Me.push(n));
}
let we = null, Se = 0, Ae = null;
function Aa(n) {
  Ae = n;
}
let fi = 1, _t = 0, Be = _t;
function Or(n) {
  Be = n;
}
function gi() {
  return ++fi;
}
function un(n) {
  var t = n.f;
  if ((t & ke) !== 0)
    return !0;
  if (t & be && (n.f &= ~kt), (t & Xe) !== 0) {
    for (var r = (
      /** @type {Value[]} */
      n.deps
    ), i = r.length, s = 0; s < i; s++) {
      var l = r[s];
      if (un(
        /** @type {Derived} */
        l
      ) && ii(
        /** @type {Derived} */
        l
      ), l.wv > n.wv)
        return !0;
    }
    (t & Fe) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    ge === null && ce(n, he);
  }
  return !1;
}
function vi(n, t, r = !0) {
  var i = n.reactions;
  if (i !== null && !(Me !== null && zt.call(Me, n)))
    for (var s = 0; s < i.length; s++) {
      var l = i[s];
      (l.f & be) !== 0 ? vi(
        /** @type {Derived} */
        l,
        t,
        !1
      ) : t === l && (r ? ce(l, ke) : (l.f & he) !== 0 && ce(l, Xe), or(
        /** @type {Effect} */
        l
      ));
    }
}
function hi(n) {
  var f;
  var t = we, r = Se, i = Ae, s = Z, l = Me, a = ot, d = Be, c = n.f;
  we = /** @type {null | Value[]} */
  null, Se = 0, Ae = null, Z = (c & (Ht | $t)) === 0 ? n : null, Me = null, n.ctx, ot = !1, Be = ++_t, n.ac !== null && (oi(() => {
    n.ac.abort(sr);
  }), n.ac = null);
  try {
    n.f |= Xn;
    var o = (
      /** @type {Function} */
      n.fn
    ), u = o();
    n.f |= dn;
    var p = n.deps, y = ee == null ? void 0 : ee.is_fork;
    if (we !== null) {
      var g;
      if (y || tn(n, Se), p !== null && Se > 0)
        for (p.length = Se + we.length, g = 0; g < we.length; g++)
          p[Se + g] = we[g];
      else
        n.deps = p = we;
      if (ci() && (n.f & Fe) !== 0)
        for (g = Se; g < p.length; g++)
          ((f = p[g]).reactions ?? (f.reactions = [])).push(n);
    } else !y && p !== null && Se < p.length && (tn(n, Se), p.length = Se);
    if (Jr() && Ae !== null && !ot && p !== null && (n.f & (be | Xe | ke)) === 0)
      for (g = 0; g < /** @type {Source[]} */
      Ae.length; g++)
        vi(
          Ae[g],
          /** @type {Effect} */
          n
        );
    if (s !== null && s !== n) {
      if (_t++, s.deps !== null)
        for (let v = 0; v < r; v += 1)
          s.deps[v].rv = _t;
      if (t !== null)
        for (const v of t)
          v.rv = _t;
      Ae !== null && (i === null ? i = Ae : i.push(.../** @type {Source[]} */
      Ae));
    }
    return (n.f & en) !== 0 && (n.f ^= en), u;
  } catch (v) {
    return va(v);
  } finally {
    n.f ^= Xn, we = t, Se = r, Ae = i, Z = s, Me = l, ot = a, Be = d;
  }
}
function Da(n, t) {
  let r = t.reactions;
  if (r !== null) {
    var i = Jl.call(r, n);
    if (i !== -1) {
      var s = r.length - 1;
      s === 0 ? r = t.reactions = null : (r[i] = r[s], r.pop());
    }
  }
  if (r === null && (t.f & be) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (we === null || !zt.call(we, t))) {
    var l = (
      /** @type {Derived} */
      t
    );
    (l.f & Fe) !== 0 && (l.f ^= Fe, l.f &= ~kt), l.v !== me && lr(l), ka(l), tn(l, 0);
  }
}
function tn(n, t) {
  var r = n.deps;
  if (r !== null)
    for (var i = t; i < r.length; i++)
      Da(n, r[i]);
}
function nn(n) {
  var t = n.f;
  if ((t & ct) === 0) {
    ce(n, he);
    var r = xe, i = _n;
    xe = n, _n = !0;
    try {
      (t & (yt | Zr)) !== 0 ? Pa(n) : ur(n), di(n);
      var s = hi(n);
      n.teardown = typeof s == "function" ? s : null, n.wv = fi;
      var l;
      Xl && fa && (n.f & ke) !== 0 && n.deps;
    } finally {
      _n = i, xe = r;
    }
  }
}
function oe(n) {
  var t = n.f, r = (t & be) !== 0;
  if (Z !== null && !ot) {
    var i = xe !== null && (xe.f & ct) !== 0;
    if (!i && (Me === null || !zt.call(Me, n))) {
      var s = Z.deps;
      if ((Z.f & Xn) !== 0)
        n.rv < _t && (n.rv = _t, we === null && s !== null && s[Se] === n ? Se++ : we === null ? we = [n] : we.push(n));
      else {
        (Z.deps ?? (Z.deps = [])).push(n);
        var l = n.reactions;
        l === null ? n.reactions = [Z] : zt.call(l, Z) || l.push(Z);
      }
    }
  }
  if (Ut && wt.has(n))
    return wt.get(n);
  if (r) {
    var a = (
      /** @type {Derived} */
      n
    );
    if (Ut) {
      var d = a.v;
      return ((a.f & he) === 0 && a.reactions !== null || mi(a)) && (d = cr(a)), wt.set(a, d), d;
    }
    var c = (a.f & Fe) === 0 && !ot && Z !== null && (_n || (Z.f & Fe) !== 0), o = (a.f & dn) === 0;
    un(a) && (c && (a.f |= Fe), ii(a)), c && !o && (si(a), pi(a));
  }
  if (ge != null && ge.has(n))
    return ge.get(n);
  if ((n.f & en) !== 0)
    throw n.v;
  return n.v;
}
function pi(n) {
  if (n.f |= Fe, n.deps !== null)
    for (const t of n.deps)
      (t.reactions ?? (t.reactions = [])).push(n), (t.f & be) !== 0 && (t.f & Fe) === 0 && (si(
        /** @type {Derived} */
        t
      ), pi(
        /** @type {Derived} */
        t
      ));
}
function mi(n) {
  if (n.v === me) return !0;
  if (n.deps === null) return !1;
  for (const t of n.deps)
    if (wt.has(t) || (t.f & be) !== 0 && mi(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
var Ma = ["forEach", "isDisjointFrom", "isSubsetOf", "isSupersetOf"], Ra = ["difference", "intersection", "symmetricDifference", "union"], zr = !1, Ot, He, at, En, Vt, _i, bi;
const Tn = class Tn extends Set {
  /**
   * @param {Iterable<T> | null | undefined} [value]
   */
  constructor(r) {
    super();
    K(this, Vt);
    /** @type {Map<T, Source<boolean>>} */
    K(this, Ot, /* @__PURE__ */ new Map());
    K(this, He, /* @__PURE__ */ ye(0));
    K(this, at, /* @__PURE__ */ ye(0));
    K(this, En, Be || -1);
    if (r) {
      for (var i of r)
        super.add(i);
      x(this, at).v = super.size;
    }
    zr || ne(this, Vt, bi).call(this);
  }
  /** @param {T} value */
  has(r) {
    var i = super.has(r), s = x(this, Ot), l = s.get(r);
    if (l === void 0) {
      if (!i)
        return oe(x(this, He)), !1;
      l = ne(this, Vt, _i).call(this, !0), s.set(r, l);
    }
    return oe(l), i;
  }
  /** @param {T} value */
  add(r) {
    return super.has(r) || (super.add(r), ve(x(this, at), super.size), Le(x(this, He))), this;
  }
  /** @param {T} value */
  delete(r) {
    var i = super.delete(r), s = x(this, Ot), l = s.get(r);
    return l !== void 0 && (s.delete(r), ve(l, !1)), i && (ve(x(this, at), super.size), Le(x(this, He))), i;
  }
  clear() {
    if (super.size !== 0) {
      super.clear();
      var r = x(this, Ot);
      for (var i of r.values())
        ve(i, !1);
      r.clear(), ve(x(this, at), 0), Le(x(this, He));
    }
  }
  keys() {
    return this.values();
  }
  values() {
    return oe(x(this, He)), super.values();
  }
  entries() {
    return oe(x(this, He)), super.entries();
  }
  [Symbol.iterator]() {
    return this.keys();
  }
  get size() {
    return oe(x(this, at));
  }
};
Ot = new WeakMap(), He = new WeakMap(), at = new WeakMap(), En = new WeakMap(), Vt = new WeakSet(), /**
 * If the source is being created inside the same reaction as the SvelteSet instance,
 * we use `state` so that it will not be a dependency of the reaction. Otherwise we
 * use `source` so it will be.
 *
 * @template T
 * @param {T} value
 * @returns {Source<T>}
 */
_i = function(r) {
  return Be === x(this, En) ? /* @__PURE__ */ ye(r) : dr(r);
}, // We init as part of the first instance so that we can treeshake this class
bi = function() {
  zr = !0;
  var r = Tn.prototype, i = Set.prototype;
  for (const s of Ma)
    r[s] = function(...l) {
      return oe(x(this, He)), i[s].apply(this, l);
    };
  for (const s of Ra)
    r[s] = function(...l) {
      oe(x(this, He));
      var a = (
        /** @type {Set<T>} */
        i[s].apply(this, l)
      );
      return new Tn(a);
    };
};
let er = Tn;
var We, Ye, nt, An, Ve, Jt, bn;
const vr = class vr extends Map {
  /**
   * @param {Iterable<readonly [K, V]> | null | undefined} [value]
   */
  constructor(r) {
    super();
    K(this, Ve);
    /** @type {Map<K, Source<number>>} */
    K(this, We, /* @__PURE__ */ new Map());
    K(this, Ye, /* @__PURE__ */ ye(0));
    K(this, nt, /* @__PURE__ */ ye(0));
    K(this, An, Be || -1);
    if (r) {
      for (var [i, s] of r)
        super.set(i, s);
      x(this, nt).v = super.size;
    }
  }
  /** @param {K} key */
  has(r) {
    var i = x(this, We), s = i.get(r);
    if (s === void 0)
      if (super.has(r))
        s = ne(this, Ve, Jt).call(this, 0), i.set(r, s);
      else
        return oe(x(this, Ye)), !1;
    return oe(s), !0;
  }
  /**
   * @param {(value: V, key: K, map: Map<K, V>) => void} callbackfn
   * @param {any} [this_arg]
   */
  forEach(r, i) {
    ne(this, Ve, bn).call(this), super.forEach(r, i);
  }
  /** @param {K} key */
  get(r) {
    var i = x(this, We), s = i.get(r);
    if (s === void 0)
      if (super.has(r))
        s = ne(this, Ve, Jt).call(this, 0), i.set(r, s);
      else {
        oe(x(this, Ye));
        return;
      }
    return oe(s), super.get(r);
  }
  /**
   * @param {K} key
   * @param {V} value
   * */
  set(r, i) {
    var p;
    var s = x(this, We), l = s.get(r), a = super.get(r), d = super.set(r, i), c = x(this, Ye);
    if (l === void 0)
      l = ne(this, Ve, Jt).call(this, 0), s.set(r, l), ve(x(this, nt), super.size), Le(c);
    else if (a !== i) {
      Le(l);
      var o = c.reactions === null ? null : new Set(c.reactions), u = o === null || !((p = l.reactions) != null && p.every(
        (y) => (
          /** @type {NonNullable<typeof v_reactions>} */
          o.has(y)
        )
      ));
      u && Le(c);
    }
    return d;
  }
  /** @param {K} key */
  delete(r) {
    var i = x(this, We), s = i.get(r), l = super.delete(r);
    return s !== void 0 && (i.delete(r), ve(s, -1)), l && (ve(x(this, nt), super.size), Le(x(this, Ye))), l;
  }
  clear() {
    if (super.size !== 0) {
      super.clear();
      var r = x(this, We);
      ve(x(this, nt), 0);
      for (var i of r.values())
        ve(i, -1);
      Le(x(this, Ye)), r.clear();
    }
  }
  keys() {
    return oe(x(this, Ye)), super.keys();
  }
  values() {
    return ne(this, Ve, bn).call(this), super.values();
  }
  entries() {
    return ne(this, Ve, bn).call(this), super.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get size() {
    return oe(x(this, nt)), super.size;
  }
};
We = new WeakMap(), Ye = new WeakMap(), nt = new WeakMap(), An = new WeakMap(), Ve = new WeakSet(), /**
 * If the source is being created inside the same reaction as the SvelteMap instance,
 * we use `state` so that it will not be a dependency of the reaction. Otherwise we
 * use `source` so it will be.
 *
 * @template T
 * @param {T} value
 * @returns {Source<T>}
 */
Jt = function(r) {
  return Be === x(this, An) ? /* @__PURE__ */ ye(r) : dr(r);
}, bn = function() {
  oe(x(this, Ye));
  var r = x(this, We);
  if (x(this, nt).v !== r.size) {
    for (var i of Cr(vr.prototype, this, "keys").call(this))
      if (!r.has(i)) {
        var s = ne(this, Ve, Jt).call(this, 0);
        r.set(i, s);
      }
  }
  for ([, s] of x(this, We))
    oe(s);
};
let Cn = vr;
function yn(n, t) {
  const r = `${n}_`;
  return t.startsWith(r) ? t.slice(r.length) : t;
}
function Na(n, t, r) {
  const i = t.getNodeVisuals(n.type), s = n.ports.map((d) => ({
    ...d,
    shortId: yn(n.id, d.id)
  })), l = t.getTemplates().find((d) => d.type === n.type), a = l ? gr(l, n.config, r) : [];
  return {
    id: n.id,
    type: n.type,
    label: t.resolveLabel(n.type, n.config),
    ports: s,
    config: { ...n.config },
    configFields: a,
    position: { ...n.position },
    width: i.defaultWidth ?? t.defaultNodeWidth,
    height: i.defaultHeight ?? t.defaultNodeHeight
  };
}
function tr(n, t) {
  const r = /* @__PURE__ */ new Map();
  for (const a of n.nodes)
    r.set(a.id, new Set(a.ports.map((d) => d.id)));
  const i = /* @__PURE__ */ new Map();
  for (const a of n.edges) {
    const d = r.get(a.targetNodeId), c = r.get(a.sourceNodeId);
    if (!(d != null && d.has(a.targetPortId)) || !(c != null && c.has(a.sourcePortId))) continue;
    let o = i.get(a.targetNodeId);
    o || (o = /* @__PURE__ */ new Set(), i.set(a.targetNodeId, o)), o.add(yn(a.targetNodeId, a.targetPortId));
  }
  const s = new Cn();
  for (const a of n.nodes) {
    const d = i.get(a.id) ?? /* @__PURE__ */ new Set();
    s.set(a.id, Na(a, t, d));
  }
  const l = new Cn();
  for (const a of n.edges) {
    const d = r.get(a.targetNodeId), c = r.get(a.sourceNodeId);
    if (!(d != null && d.has(a.targetPortId)) || !(c != null && c.has(a.sourcePortId))) {
      console.warn(`graph: dropping edge ${a.id} with missing endpoint`, a);
      continue;
    }
    l.set(a.id, {
      id: a.id,
      sourceNodeId: a.sourceNodeId,
      sourcePortId: yn(a.sourceNodeId, a.sourcePortId),
      targetNodeId: a.targetNodeId,
      targetPortId: yn(a.targetNodeId, a.targetPortId)
    });
  }
  return {
    id: n.id,
    domainId: n.domain,
    name: n.name,
    version: n.version,
    nodes: s,
    edges: l,
    metadata: { ...n.metadata ?? {} },
    readonly: !1,
    selection: new er()
  };
}
const Oa = {
  number: "number",
  boolean: "boolean",
  string: "string"
};
function gr(n, t, r) {
  const i = [], s = /* @__PURE__ */ new Set();
  for (const l of n.configSchema ?? []) {
    s.add(l.key);
    const a = {
      key: l.key,
      label: l.label,
      type: l.type
    };
    l.options && (a.options = l.options), l.rendererHint && (a.rendererHint = l.rendererHint), r.has(l.key) && (a.disabled = !0), i.push(a);
  }
  for (const l of n.ports) {
    if (l.direction !== "input" || s.has(l.id)) continue;
    const a = l.dataType ? Oa[l.dataType] : void 0;
    a && i.push({
      key: l.id,
      label: l.label,
      type: a,
      disabled: r.has(l.id)
    });
  }
  return i;
}
function Hr(n, t) {
  return t.startsWith(`${n}_`) ? t : `${n}_${t}`;
}
function yi(n) {
  const t = [];
  for (const s of n.nodes.values())
    t.push({
      id: s.id,
      type: s.type,
      position: { ...s.position },
      config: { ...s.config },
      ports: s.ports.map((l) => ({
        id: l.id,
        // already in full form (asset → state preserves p.id)
        label: l.label,
        direction: l.direction,
        ...l.dataType !== void 0 ? { dataType: l.dataType } : {}
      }))
    });
  const r = [];
  for (const s of n.edges.values())
    r.push({
      id: s.id,
      sourceNodeId: s.sourceNodeId,
      sourcePortId: Hr(s.sourceNodeId, s.sourcePortId),
      targetNodeId: s.targetNodeId,
      targetPortId: Hr(s.targetNodeId, s.targetPortId)
    });
  const i = {
    id: n.id,
    name: n.name,
    domain: n.domainId,
    version: n.version,
    nodes: t,
    edges: r
  };
  return Object.keys(n.metadata).length > 0 && (i.metadata = { ...n.metadata }), i;
}
function za(n, t) {
  const r = `${n}_`;
  return t.startsWith(r) ? t.slice(r.length) : t;
}
function Ha(n, t, r) {
  const i = t.getNodeVisuals(n.type), s = n.ports.map((a) => ({ ...a, shortId: za(n.id, a.id) })), l = t.getTemplates().find((a) => a.type === n.type);
  return {
    id: n.id,
    type: n.type,
    label: t.resolveLabel(n.type, n.config),
    ports: s,
    config: { ...n.config },
    configFields: l ? gr(l, n.config, r) : [],
    position: { ...n.position },
    width: i.defaultWidth ?? t.defaultNodeWidth,
    height: i.defaultHeight ?? t.defaultNodeHeight
  };
}
function In(n, t, r) {
  const i = n.nodes.get(r);
  if (!i) return;
  const s = /* @__PURE__ */ new Set();
  for (const c of n.edges.values())
    c.targetNodeId === r && s.add(c.targetPortId);
  const l = t.getTemplates().find((c) => c.type === i.type), a = l ? gr(l, i.config, s) : [], d = t.resolveLabel(i.type, i.config);
  n.nodes.set(r, { ...i, configFields: a, label: d });
}
function Ur(n, t, r) {
  return {
    meta: { kind: "add-node" },
    apply() {
      n.nodes.set(r.id, Ha(r, t, /* @__PURE__ */ new Set()));
    },
    revert() {
      n.nodes.delete(r.id), n.selection.delete(r.id);
    }
  };
}
function Ua(n, t, r, i) {
  return {
    meta: { kind: "move-node" },
    apply() {
      const s = n.nodes.get(t);
      s && n.nodes.set(t, { ...s, position: { ...i } });
    },
    revert() {
      const s = n.nodes.get(t);
      s && n.nodes.set(t, { ...s, position: { ...r } });
    }
  };
}
function La(n, t, r, i, s, l) {
  function a(d, c) {
    if (i.length === 0) return d;
    const o = structuredClone(d.config);
    let u = o;
    for (let p = 0; p < i.length - 1; p++) u = u[i[p]];
    return u[i[i.length - 1]] = c, { ...d, config: o };
  }
  return {
    meta: { kind: "set-node-config" },
    apply() {
      const d = n.nodes.get(r);
      d && (n.nodes.set(r, a(d, l)), In(n, t, r));
    },
    revert() {
      const d = n.nodes.get(r);
      d && (n.nodes.set(r, a(d, s)), In(n, t, r));
    }
  };
}
function Va(n, t) {
  return {
    meta: { kind: "add-edge" },
    apply() {
      n.edges.set(t.id, { ...t });
    },
    revert() {
      n.edges.delete(t.id), n.selection.delete(t.id);
    }
  };
}
function Fa(n, t, r) {
  let i = [], s = [];
  return {
    meta: { kind: "remove-selection" },
    apply() {
      i = [], s = [];
      const l = new Set(r);
      for (const a of l) {
        const d = n.edges.get(a);
        d && (s.push(d), n.edges.delete(a));
      }
      for (const a of l) {
        const d = n.nodes.get(a);
        if (d) {
          for (const [c, o] of n.edges)
            (o.sourceNodeId === a || o.targetNodeId === a) && (s.push(o), n.edges.delete(c));
          i.push(d), n.nodes.delete(a);
        }
      }
      n.selection.clear();
      for (const a of s) In(n, t, a.targetNodeId);
    },
    revert() {
      for (const l of i) n.nodes.set(l.id, l);
      for (const l of s) n.edges.set(l.id, l);
      for (const l of s) In(n, t, l.targetNodeId);
    }
  };
}
function Ba(n, t, r) {
  let i = null;
  return {
    meta: { kind: "replace-asset" },
    apply() {
      i = yi(n);
      const s = tr(r, t);
      n.id = s.id, n.domainId = s.domainId, n.name = s.name, n.version = s.version, n.metadata = s.metadata, n.nodes.clear();
      for (const [l, a] of s.nodes) n.nodes.set(l, a);
      n.edges.clear();
      for (const [l, a] of s.edges) n.edges.set(l, a);
      n.selection.clear();
    },
    revert() {
      if (!i) return;
      const s = tr(i, t);
      n.id = s.id, n.domainId = s.domainId, n.name = s.name, n.version = s.version, n.metadata = s.metadata, n.nodes.clear();
      for (const [l, a] of s.nodes) n.nodes.set(l, a);
      n.edges.clear();
      for (const [l, a] of s.edges) n.edges.set(l, a);
      n.selection.clear();
    }
  };
}
let Sn = null;
function qa(n) {
  Sn = n;
}
function $e() {
  return Sn;
}
function ja(n) {
  Sn === n && (Sn = null);
}
function nr(n) {
  return Math.min(3, Math.max(0.2, n));
}
function Lr(n, t, r) {
  const i = n.x - t.left, s = n.y - t.top;
  return {
    x: (i - r.x) / r.zoom,
    y: (s - r.y) / r.zoom
  };
}
function Ga(n, t, r = 80) {
  const i = Array.from(n);
  if (i.length === 0) return { x: 0, y: 0, zoom: 1 };
  let s = 1 / 0, l = 1 / 0, a = -1 / 0, d = -1 / 0;
  for (const _ of i)
    _.position.x < s && (s = _.position.x), _.position.y < l && (l = _.position.y), _.position.x + _.width > a && (a = _.position.x + _.width), _.position.y + _.height > d && (d = _.position.y + _.height);
  const c = a - s, o = d - l, u = Math.max(1, t.w - 2 * r), p = Math.max(1, t.h - 2 * r), y = Math.min(u / c, p / o, 1), g = nr(y), f = (s + a) / 2, v = (l + d) / 2;
  return {
    x: t.w / 2 - f * g,
    y: t.h / 2 - v * g,
    zoom: g
  };
}
var Ka = e.from_svg('<path class="edge-ghost" stroke="var(--sh3-accent, #4a9eff)" fill="none" stroke-dasharray="4 3"></path>'), Wa = e.from_html('<div class="graph-canvas svelte-x16tu1" tabindex="0"><div class="viewport svelte-x16tu1"><svg class="edge-overlay svelte-x16tu1"><!><!></svg> <!></div> <!> <!></div>');
function Ya(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  function r(w) {
    return t.domain.getNodeVisuals(w.type);
  }
  function i(w, I, M) {
    const H = w.ports.find((Ze) => Ze.shortId === I);
    if (!H) return { x: w.position.x, y: w.position.y };
    const q = w.ports.filter((Ze) => Ze.direction === "input"), J = w.ports.filter((Ze) => Ze.direction === "output"), _e = (M === "input" ? q : J).indexOf(H), rt = 26, Ct = 22, It = w.position.y + rt + 8 + _e * Ct + Ct / 2;
    return { x: M === "output" ? w.position.x + w.width : w.position.x, y: It };
  }
  function s(w) {
    const I = t.state.nodes.get(w.sourceNodeId);
    return I ? i(I, w.sourcePortId, "output") : { x: 0, y: 0 };
  }
  function l(w) {
    const I = t.state.nodes.get(w.targetNodeId);
    return I ? i(I, w.targetPortId, "input") : { x: 0, y: 0 };
  }
  function a(w) {
    var H;
    const I = t.state.nodes.get(w.sourceNodeId);
    if (!I) return "#888";
    const M = I.ports.find((q) => q.shortId === w.sourcePortId);
    return M != null && M.dataType ? ((H = r(I).portColors) == null ? void 0 : H[M.dataType]) ?? "#888" : "#888";
  }
  function d(w, I) {
    var M;
    I ? t.state.selection.has(w) ? t.state.selection.delete(w) : t.state.selection.add(w) : (t.state.selection.clear(), t.state.selection.add(w)), (M = t.onSelectionChange) == null || M.call(t, Array.from(t.state.selection));
  }
  function c() {
    var w;
    t.state.selection.size !== 0 && (t.state.selection.clear(), (w = t.onSelectionChange) == null || w.call(t, []));
  }
  let o = e.state(null);
  function u(w, I) {
    t.state.readonly || (I.stopPropagation(), I.currentTarget.setPointerCapture(I.pointerId), e.set(
      o,
      {
        nodeId: w.id,
        start: { x: I.clientX, y: I.clientY },
        origin: { ...w.position }
      },
      !0
    ));
  }
  function p(w) {
    if (!e.get(o)) return;
    const I = t.state.nodes.get(e.get(o).nodeId);
    if (!I) return;
    const M = (w.clientX - e.get(o).start.x) / e.get(k).zoom, H = (w.clientY - e.get(o).start.y) / e.get(k).zoom;
    t.state.nodes.set(e.get(o).nodeId, {
      ...I,
      position: {
        x: e.get(o).origin.x + M,
        y: e.get(o).origin.y + H
      }
    });
  }
  function y(w) {
    var M;
    if (!e.get(o)) return;
    const I = t.state.nodes.get(e.get(o).nodeId);
    if (I && (I.position.x !== e.get(o).origin.x || I.position.y !== e.get(o).origin.y)) {
      const H = Ua(t.state, e.get(o).nodeId, e.get(o).origin, { ...I.position });
      t.history.push(H), (M = t.onAssetChanged) == null || M.call(t);
    }
    e.set(o, null);
  }
  let g = e.state(null);
  function f(w, I, M) {
    t.state.readonly || (M.stopPropagation(), M.currentTarget.setPointerCapture(M.pointerId), e.set(
      g,
      {
        source: {
          nodeId: w.id,
          portId: I.shortId,
          direction: I.direction,
          dataType: I.dataType
        },
        cursor: { x: M.clientX, y: M.clientY }
      },
      !0
    ));
  }
  function v(w) {
    if (p(w), e.get(g) && e.get(C)) {
      const I = e.get(C).getBoundingClientRect();
      e.get(g).cursor = Lr({ x: w.clientX, y: w.clientY }, I, e.get(k));
    }
    if (e.get(A) && e.get(A).pointerId === w.pointerId) {
      const I = w.clientX - e.get(A).startX, M = w.clientY - e.get(A).startY;
      !e.get(A).panning && Math.abs(I) + Math.abs(M) > P && (e.get(A).panning = !0), e.get(A).panning && e.set(
        k,
        {
          ...e.get(k),
          x: e.get(A).originVx + I,
          y: e.get(A).originVy + M
        },
        !0
      );
    }
  }
  function _(w, I, M) {
    var ie;
    if (!e.get(g)) return;
    M.stopPropagation();
    const H = e.get(g).source;
    if (e.set(g, null), I.direction !== "input" || t.domain.edgeSemantics === "oriented" && H.direction !== "output" || H.nodeId === w.id || t.domain.canConnect && !t.domain.canConnect(
      {
        nodeId: H.nodeId,
        portId: H.portId,
        direction: H.direction,
        dataType: H.dataType
      },
      {
        nodeId: w.id,
        portId: I.shortId,
        direction: I.direction,
        dataType: I.dataType
      }
    )) return;
    const q = `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, J = Va(t.state, {
      id: q,
      sourceNodeId: H.nodeId,
      sourcePortId: H.portId,
      targetNodeId: w.id,
      targetPortId: I.shortId
    });
    J.apply(), t.history.push(J), (ie = t.onAssetChanged) == null || ie.call(t);
  }
  function h(w) {
    if (y(), e.set(g, null), e.get(A) && e.get(A).pointerId === w.pointerId) {
      const I = e.get(A).panning;
      e.set(A, null), I && e.set(E, !0);
    }
  }
  let m = e.state(null), k = e.state(e.proxy({ x: 0, y: 0, zoom: 1 })), C = e.state(null);
  const P = 4;
  let A = e.state(null), E = e.state(!1);
  function R(w) {
    w.target === w.currentTarget && w.button === 0 && (w.currentTarget.setPointerCapture(w.pointerId), e.set(
      A,
      {
        pointerId: w.pointerId,
        startX: w.clientX,
        startY: w.clientY,
        originVx: e.get(k).x,
        originVy: e.get(k).y,
        panning: !1
      },
      !0
    ));
  }
  function U(w) {
    if (e.get(E)) {
      e.set(E, !1);
      return;
    }
    if (t.state.readonly || w.target !== w.currentTarget) return;
    const I = w.currentTarget.getBoundingClientRect(), M = Lr({ x: w.clientX, y: w.clientY }, I, e.get(k));
    t.domain.useNodePalette ? (e.set(m, { x: w.clientX - I.left, y: w.clientY - I.top }, !0), e.set(O, M, !0)) : B(M);
  }
  let O = e.state(null);
  function B(w) {
    var q;
    const M = {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: "",
      position: { x: w.x, y: w.y },
      config: {},
      ports: []
    }, H = Ur(t.state, t.domain, M);
    H.apply(), t.history.push(H), (q = t.onAssetChanged) == null || q.call(t);
  }
  function G(w) {
    var ie;
    const I = e.get(O);
    if (!I) return;
    const M = `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, H = w.ports.map((_e) => ({ ..._e, id: `${M}_${_e.id}` })), q = {
      id: M,
      type: w.type,
      position: { ...I },
      config: { ...w.defaultConfig },
      ports: H
    }, J = Ur(t.state, t.domain, q);
    J.apply(), t.history.push(J), (ie = t.onAssetChanged) == null || ie.call(t), e.set(m, null), e.set(O, null);
  }
  const D = e.derived(() => Array.from(t.state.nodes.values())), z = e.derived(() => Array.from(t.state.edges.values())), W = e.derived(() => t.domain.edgeSemantics === "oriented"), V = 1.2;
  function Y(w, I) {
    const M = nr(w), H = I ?? (e.get(C) ? {
      x: e.get(C).clientWidth / 2,
      y: e.get(C).clientHeight / 2
    } : { x: 0, y: 0 }), q = (H.x - e.get(k).x) / e.get(k).zoom, J = (H.y - e.get(k).y) / e.get(k).zoom;
    e.set(k, { x: H.x - q * M, y: H.y - J * M, zoom: M }, !0);
  }
  function re(w) {
    Y(e.get(k).zoom * V, w);
  }
  function X(w) {
    Y(e.get(k).zoom / V, w);
  }
  function de() {
    Y(1);
  }
  function dt() {
    if (!e.get(C)) return;
    const w = Ga(Array.from(t.state.nodes.values()), {
      w: e.get(C).clientWidth,
      h: e.get(C).clientHeight
    });
    e.set(k, w, !0);
  }
  function Ee() {
    e.set(m, null), e.set(O, null);
  }
  const T = {
    get state() {
      return t.state;
    },
    get domain() {
      return t.domain;
    },
    get history() {
      return t.history;
    },
    onAssetChanged: () => {
      var w;
      return (w = t.onAssetChanged) == null ? void 0 : w.call(t);
    },
    onSelectionChange: (w) => {
      var I;
      return (I = t.onSelectionChange) == null ? void 0 : I.call(t, w);
    },
    zoomIn: (w) => re(w),
    zoomOut: (w) => X(w),
    zoomReset: () => de(),
    fitContent: () => dt(),
    dismissPalette: () => Ee()
  };
  e.user_effect(() => () => ja(T));
  function L() {
    qa(T);
  }
  function ue(w) {
    w.currentTarget.focus({ preventScroll: !0 });
  }
  function j(w) {
    if (!e.get(C)) return;
    w.preventDefault();
    const I = e.get(C).getBoundingClientRect(), M = w.clientX - I.left, H = w.clientY - I.top, q = (M - e.get(k).x) / e.get(k).zoom, J = (H - e.get(k).y) / e.get(k).zoom, ie = nr(e.get(k).zoom * (1 - w.deltaY * 1e-3));
    e.set(k, { x: M - q * ie, y: H - J * ie, zoom: ie }, !0);
  }
  e.user_effect(() => {
    if (!e.get(C)) return;
    const w = e.get(C), I = (M) => j(M);
    return w.addEventListener("wheel", I, { passive: !1 }), () => w.removeEventListener("wheel", I);
  });
  var se = Wa(), qe = e.child(se);
  let Te;
  var fe = e.child(qe), Ce = e.child(fe);
  e.each(Ce, 17, () => e.get(z), (w) => w.id, (w, I) => {
    {
      let M = e.derived(() => s(e.get(I))), H = e.derived(() => l(e.get(I))), q = e.derived(() => a(e.get(I))), J = e.derived(() => t.state.selection.has(e.get(I).id));
      Bl(w, {
        get id() {
          return e.get(I).id;
        },
        get source() {
          return e.get(M);
        },
        get target() {
          return e.get(H);
        },
        get color() {
          return e.get(q);
        },
        get oriented() {
          return e.get(W);
        },
        get selected() {
          return e.get(J);
        },
        onClick: (ie) => {
          ie.stopPropagation(), d(e.get(I).id, ie.ctrlKey || ie.metaKey);
        }
      });
    }
  });
  var Re = e.sibling(Ce);
  {
    var Ne = (w) => {
      const I = e.derived(() => t.state.nodes.get(e.get(g).source.nodeId));
      var M = e.comment(), H = e.first_child(M);
      {
        var q = (J) => {
          const ie = e.derived(() => i(e.get(I), e.get(g).source.portId, e.get(g).source.direction === "output" ? "output" : "input"));
          var _e = Ka();
          e.template_effect(() => e.set_attribute(_e, "d", `M ${e.get(ie).x} ${e.get(ie).y} L ${e.get(g).cursor.x} ${e.get(g).cursor.y}`)), e.append(J, _e);
        };
        e.if(H, (J) => {
          e.get(I) && J(q);
        });
      }
      e.append(w, M);
    };
    e.if(Re, (w) => {
      e.get(g) && w(Ne);
    });
  }
  e.reset(fe);
  var Ft = e.sibling(fe, 2);
  e.each(Ft, 17, () => e.get(D), (w) => w.id, (w, I) => {
    {
      let M = e.derived(() => r(e.get(I))), H = e.derived(() => t.state.selection.has(e.get(I).id));
      Hl(w, {
        get node() {
          return e.get(I);
        },
        get visuals() {
          return e.get(M);
        },
        get selected() {
          return e.get(H);
        },
        onSelectClick: (q) => {
          q.stopPropagation(), d(e.get(I).id, q.ctrlKey || q.metaKey);
        },
        onHeaderPointerDown: (q) => u(e.get(I), q),
        onPortPointerDown: (q, J) => f(e.get(I), q, J),
        onPortPointerUp: (q, J) => _(e.get(I), q, J)
      });
    }
  }), e.reset(qe);
  var xt = e.sibling(qe, 2);
  {
    var ut = (w) => {
      {
        let I = e.derived(() => t.domain.getTemplatesByCategory());
        Kl(w, {
          get byCategory() {
            return e.get(I);
          },
          get x() {
            return e.get(m).x;
          },
          get y() {
            return e.get(m).y;
          },
          onPick: G,
          onClose: () => e.set(m, null)
        });
      }
    };
    e.if(xt, (w) => {
      e.get(m) && w(ut);
    });
  }
  var ft = e.sibling(xt, 2);
  Yl(ft, {
    get zoom() {
      return e.get(k).zoom;
    },
    onZoomIn: () => re(),
    onZoomOut: () => X(),
    onZoomReset: () => de(),
    onFit: () => dt()
  }), e.reset(se), e.bind_this(se, (w) => e.set(C, w), () => e.get(C)), e.template_effect(() => Te = e.set_style(qe, "", Te, {
    transform: `translate(${e.get(k).x ?? ""}px, ${e.get(k).y ?? ""}px) scale(${e.get(k).zoom ?? ""})`,
    "transform-origin": "0 0"
  })), e.delegated("focusin", se, L), e.event("pointerdown", se, ue, !0), e.delegated("pointerdown", se, R), e.delegated("pointermove", se, v), e.delegated("pointerup", se, h), e.event("pointercancel", se, h), e.delegated("click", se, (w) => {
    w.target === w.currentTarget && (c(), e.get(m) ? (e.set(m, null), e.set(O, null)) : U(w));
  }), e.append(n, se), e.pop();
}
e.delegate([
  "focusin",
  "pointerdown",
  "pointermove",
  "pointerup",
  "click"
]);
var Xa = e.from_html('<li class="svelte-1dbihe0"><code class="svelte-1dbihe0"> </code><span class="dash svelte-1dbihe0">—</span><span class="label svelte-1dbihe0"> </span></li>'), Za = e.from_html('<h3 class="svelte-1dbihe0">Registered domains</h3> <ul class="domain-list svelte-1dbihe0"></ul>', 1), Ja = e.from_html('<p class="warn svelte-1dbihe0">No graph domains registered. Install or activate a shard that provides one.</p>'), Qa = e.from_html('<div class="graph-empty svelte-1dbihe0"><h2 class="svelte-1dbihe0">No graph open</h2> <p class="hint svelte-1dbihe0">A consumer shard binds a graph by registering a <code>GraphViewDescriptor</code> at <code>sh3-editor.graph-view</code>.</p> <!></div>');
function $a(n, t) {
  e.push(t, !0);
  var r = Qa(), i = e.sibling(e.child(r), 4);
  {
    var s = (a) => {
      var d = Za(), c = e.sibling(e.first_child(d), 2);
      e.each(c, 21, () => t.domains, (o) => o.id, (o, u) => {
        var p = Xa(), y = e.child(p), g = e.child(y, !0);
        e.reset(y);
        var f = e.sibling(y, 2), v = e.child(f, !0);
        e.reset(f), e.reset(p), e.template_effect(() => {
          e.set_text(g, e.get(u).id), e.set_text(v, e.get(u).label);
        }), e.append(o, p);
      }), e.reset(c), e.append(a, d);
    }, l = (a) => {
      var d = Ja();
      e.append(a, d);
    };
    e.if(i, (a) => {
      t.domains.length > 0 ? a(s) : a(l, -1);
    });
  }
  e.reset(r), e.append(n, r), e.pop();
}
function eo(n, t, r) {
  const i = r.filter((s) => s.slotId === n);
  return i.length > 1 && console.warn(`graph: multiple GraphViewDescriptor matches for slot ${n}; using first`, i), i.length >= 1 ? { kind: "descriptor", descriptor: i[0] } : t && t.asset && t.domainId ? {
    kind: "meta",
    asset: t.asset,
    domainId: t.domainId,
    onChange: t.onChange,
    readonly: t.readonly
  } : { kind: "empty" };
}
function to(n) {
  const t = { fields: {} };
  for (const r of n) {
    const i = { label: r.label };
    r.rendererHint && (i.type = r.rendererHint), r.disabled && (i.readonly = !0), t.fields[r.key] = i;
  }
  return t;
}
function no(n, t) {
  let r = n;
  for (const i of t) r = r == null ? void 0 : r[i];
  return r;
}
function ro(n, t, r, i, s, l) {
  return (a, d) => {
    if ((s == null ? void 0 : s(n, a, d)) === !0) return !0;
    const o = t.nodes.get(n);
    if (!o) return !0;
    const u = no(o.config, a);
    if (u === d) return !0;
    const p = La(t, r, n, a, u, d);
    return p.apply(), i.push(p), l(), !0;
  };
}
function io() {
  const n = [], t = [], r = /* @__PURE__ */ new Set();
  function i() {
    for (const s of r) s();
  }
  return {
    push(s) {
      n.push(s), t.length = 0, i();
    },
    undo() {
      const s = n.pop();
      return s ? (s.revert(), t.push(s), i(), !0) : !1;
    },
    redo() {
      const s = t.pop();
      return s ? (s.apply(), n.push(s), i(), !0) : !1;
    },
    peek() {
      return n[n.length - 1] ?? null;
    },
    replaceTop(s) {
      return n.length === 0 ? !1 : (n[n.length - 1] = s, i(), !0);
    },
    get canUndo() {
      return n.length > 0;
    },
    get canRedo() {
      return t.length > 0;
    },
    clear() {
      n.length = 0, t.length = 0, i();
    },
    onChange(s) {
      return r.add(s), () => r.delete(s);
    }
  };
}
function so(n, t, r, i, s) {
  const l = io();
  let a = !0;
  const d = /* @__PURE__ */ new Set();
  function c() {
    const o = Array.from(n.selection);
    for (const u of d) u(o);
  }
  return {
    setAsset(o) {
      if (!a) return;
      const u = Ba(n, t, o);
      u.apply(), l.push(u);
    },
    getAsset() {
      return yi(n);
    },
    select(o) {
      if (a) {
        n.selection.clear();
        for (const u of o) n.selection.add(u);
        c();
      }
    },
    clearSelection() {
      if (a) {
        if (n.selection.size === 0) {
          c();
          return;
        }
        n.selection.clear(), c();
      }
    },
    focus(o) {
    },
    fitToContent() {
    },
    history: l,
    onSelectionChange(o) {
      return d.add(o), () => d.delete(o);
    },
    getSelectedInspectorBinding() {
      if (!a) return null;
      const o = Array.from(n.selection);
      if (o.length !== 1) return null;
      const u = o[0], p = n.nodes.get(u);
      return p ? {
        value: p.config,
        meta: to(p.configFields),
        onCommit: ro(
          p.id,
          n,
          t,
          l,
          r == null ? void 0 : r.onCommit,
          i
        )
      } : null;
    },
    _isAlive() {
      return a;
    },
    _kill() {
      a = !1;
    }
  };
}
var lo = e.from_html('<div class="graph-error svelte-39j3n"><h2 class="svelte-39j3n">Graph error</h2> <p> </p></div>');
function ao(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => eo(t.slotId, t.meta, t.descriptors));
  let i = e.state(null), s = e.state(null), l = e.state(null), a = e.state(null);
  e.user_effect(() => {
    var g, f, v;
    if (e.get(r).kind === "descriptor" || e.get(r).kind === "meta") {
      const _ = e.get(r).kind === "descriptor" ? e.get(r).descriptor.domainId : e.get(r).domainId, h = t.domains.get(_);
      if (!h) {
        e.set(a, `Domain "${_}" is not registered. Install or activate the shard that provides it.`), e.set(i, null), e.set(s, null), e.set(l, null);
        return;
      }
      e.set(a, null), e.set(s, h, !0);
      const m = e.get(r).kind === "descriptor" ? e.get(r).descriptor.initial : e.get(r).asset, k = tr(m, h);
      e.set(i, k, !0);
      const C = () => {
        var E, R;
        if (e.get(r).kind === "descriptor")
          try {
            e.get(r).descriptor.onChange(e.get(l).getAsset());
          } catch (U) {
            console.warn("graph: onChange threw", U);
          }
        else e.get(r).kind === "meta" && ((R = (E = e.get(r)).onChange) == null || R.call(E, e.get(l).getAsset()));
      }, P = e.get(r).kind === "descriptor" ? e.get(r).descriptor : void 0, A = so(k, h, P, C);
      if (e.set(l, A, !0), e.get(r).kind === "descriptor")
        try {
          (f = (g = e.get(r).descriptor).bind) == null || f.call(g, A);
        } catch (E) {
          console.warn("graph: descriptor.bind threw", E);
        }
      (v = t.onControllerReady) == null || v.call(t, A);
    } else
      e.set(i, null), e.set(s, null), e.set(l, null), e.set(a, null);
    return () => {
      var _;
      (_ = e.get(l)) == null || _._kill(), e.set(l, null);
    };
  });
  const d = e.derived(() => {
    const g = e.get(l);
    return g ? g.history : null;
  });
  var c = e.comment(), o = e.first_child(c);
  {
    var u = (g) => {
      var f = lo(), v = e.sibling(e.child(f), 2), _ = e.child(v, !0);
      e.reset(v), e.reset(f), e.template_effect(() => e.set_text(_, e.get(a))), e.append(g, f);
    }, p = (g) => {
      {
        let f = e.derived(() => t.domains.list());
        $a(g, {
          get domains() {
            return e.get(f);
          }
        });
      }
    }, y = (g) => {
      Ya(g, {
        get state() {
          return e.get(i);
        },
        get domain() {
          return e.get(s);
        },
        get history() {
          return e.get(d);
        },
        onSelectionChange: () => {
        }
      });
    };
    e.if(o, (g) => {
      e.get(a) ? g(u) : e.get(r).kind === "empty" ? g(p, 1) : e.get(i) && e.get(s) && e.get(d) && g(y, 2);
    });
  }
  e.append(n, c), e.pop();
}
function oo(n) {
  return {
    log: (t, r, ...i) => {
      (t === "debug" ? console.debug : t === "info" ? console.info : t === "warn" ? console.warn : console.error)(`[graph:${n}] ${r}`, ...i);
    }
  };
}
function co() {
  const n = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  return {
    register(r) {
      n.set(r.id, r.factory);
    },
    unregister(r) {
      n.delete(r), t.delete(r);
    },
    get(r) {
      const i = t.get(r);
      if (i) return i;
      const s = n.get(r);
      if (!s) return null;
      const l = s(oo(r));
      return t.set(r, l), l;
    },
    list() {
      return Array.from(n.keys()).map((r) => ({ id: r, label: r }));
    },
    clear() {
      n.clear(), t.clear();
    }
  };
}
const Vr = "sh3-editor.graph-domain", Fr = "sh3-editor.graph-view", uo = "sh3-editor.document";
function fo(n) {
  const {
    slotId: t,
    contributions: r,
    registry: i,
    internals: s,
    defaultOptions: l,
    warn: a = console.warn
  } = n, c = r.list(uo).filter((g) => g.slotId === t);
  c.length > 1 && a(
    `[sh3-editor] Multiple EditorDocumentContribution descriptors registered for slotId="${t}"; using the first registered.`
  );
  const o = c[0], u = o ? vo(o.seed) : l, p = i.get(t) ?? i.open(t, u), y = [];
  if (o != null && o.bind) {
    const g = go(t, p, s), f = o.bind(g);
    typeof f == "function" && y.push(f);
  }
  return o != null && o.onContentChange && y.push(s.contentChange.on((g, f) => {
    g === t && o.onContentChange(f);
  })), o != null && o.onDirtyChange && y.push(s.dirtyChange.on((g, f) => {
    g === t && o.onDirtyChange(f);
  })), o != null && o.onSave && y.push(s.saveEvent.on((g) => {
    g === t && o.onSave();
  })), o != null && o.onPrefsChange && y.push(s.prefsChange.on((g, f) => {
    g === t && o.onPrefsChange(f);
  })), {
    entry: p,
    cleanup() {
      for (const g of y)
        try {
          g();
        } catch (f) {
          console.warn("[sh3-editor] bindDocument cleanup error", f);
        }
      y.length = 0;
    }
  };
}
function go(n, t, r) {
  return (i) => {
    i.content !== void 0 && i.content !== t.document.content && (t.document.content = i.content, t.document.cursorStart = 0, t.document.cursorEnd = 0, t.document.dirty = !1, r.history(n).clear(), r.contentChange.emit(n, i.content), r.dirtyChange.emit(n, !1)), i.filePath !== void 0 && (t.document.filePath = i.filePath), i.language !== void 0 && (t.document.language = i.language), i.matchingConfig !== void 0 && (t.options.matchingConfig = i.matchingConfig), i.prefs !== void 0 && (t.prefs = { ...t.prefs, ...i.prefs }), i.fontSize !== void 0 && (t.options.fontSize = i.fontSize), i.showSettings !== void 0 && (t.options.showSettings = i.showSettings), i.toolbarActions !== void 0 && (t.options.toolbarActions = i.toolbarActions), i.highlight !== void 0 && (t.options.highlight = i.highlight);
  };
}
function vo(n) {
  const t = { content: n.content };
  return n.filePath !== void 0 && n.filePath !== null && (t.filePath = n.filePath), n.language !== void 0 && n.language !== null && (t.language = n.language), n.matchingConfig !== void 0 && (t.matchingConfig = n.matchingConfig), n.prefs !== void 0 && (t.prefs = n.prefs), n.fontSize !== void 0 && (t.fontSize = n.fontSize), n.showSettings !== void 0 && (t.showSettings = n.showSettings), n.toolbarActions !== void 0 && (t.toolbarActions = n.toolbarActions), n.highlight !== void 0 && (t.highlight = n.highlight), t;
}
let pt = null, rr = null, Pt = null, Gt = null, Kt = null, Wt = null, Yt = null, it = null, Xt = null;
function bo() {
  return rr;
}
const Br = {
  manifest: {
    id: "sh3-editor",
    label: "Editor",
    views: [
      { id: "sh3-editor:editor", label: "Editor", standalone: !0 },
      { id: "sh3-editor:inspector", label: "Inspector", standalone: !0 },
      { id: "sh3-editor:color-picker", label: "Color Picker", standalone: !0 },
      { id: "sh3-editor:settings", label: "Settings", standalone: !0 },
      { id: "sh3-editor:help", label: "Help", standalone: !0 },
      { id: "sh3-editor:graph", label: "Graph", standalone: !0 }
    ]
  },
  activate(n) {
    pt = new Oi();
    const { api: t, internals: r, teardown: i } = Wi(pt);
    rr = t, Pt = r, Gt = i, Br.api = t;
    const s = () => {
      Ir(n.contributions.list(Un));
    };
    s(), Kt = n.contributions.onChange(Un, s);
    const l = n.state({
      user: { colorPickerPalettes: [] }
    });
    function a(f) {
      const v = l.user.colorPickerPalettes, _ = v.findIndex((h) => h.id === f.id);
      _ === -1 ? v.push(f) : v[_] = f;
    }
    function d(f) {
      const v = l.user.colorPickerPalettes, _ = v.findIndex((h) => h.id === f);
      _ !== -1 && v.splice(_, 1);
    }
    Pr({
      internals: r,
      userPalettes: l.user.colorPickerPalettes,
      onSaveUserPalette: a,
      onDeleteUserPalette: d
    });
    const c = {
      id: "sh3-editor:color",
      type: "color",
      component: Vs,
      priority: 10
    };
    Wt = n.contributions.register(Un, c);
    const o = {
      id: "sh3-editor:color-picker",
      priority: 10,
      open: (f) => ls(f, {
        userPalettes: l.user.colorPickerPalettes,
        onSaveUserPalette: a,
        onDeleteUserPalette: d
      })
    };
    Yt = n.contributions.register(Di, o);
    const u = {
      content: "Hello, World"
    };
    n.registerView("sh3-editor:editor", {
      mount(f, v) {
        const _ = v.slotId, { entry: h, cleanup: m } = fo({
          slotId: _,
          contributions: n.contributions,
          registry: pt,
          internals: Pt,
          defaultOptions: u
        }), k = h.options, C = mt(Is, {
          target: f,
          props: {
            entry: h,
            internals: Pt,
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
            m(), st(C);
          }
        };
      }
    }), n.registerView("sh3-editor:inspector", {
      mount(f, v) {
        const _ = v.slotId, h = v.meta, m = mt(Os, {
          target: f,
          props: {
            instanceId: _,
            adHocValue: h == null ? void 0 : h.value,
            adHocMeta: h == null ? void 0 : h.meta,
            adHocReadonly: (h == null ? void 0 : h.readonly) ?? !1,
            internals: Pt
          }
        });
        return {
          closable: !0,
          unmount() {
            st(m);
          }
        };
      }
    }), n.registerView("sh3-editor:color-picker", {
      mount(f, v) {
        const _ = v.slotId, h = r.colorPickers.get(_), m = v.meta, k = n.contributions.list(as), C = os(_, h, k, m), P = mt(Xr, {
          target: f,
          props: {
            instanceId: _,
            adHocValue: C.kind === "adhoc" ? C.adHocValue : void 0,
            adHocReadonly: C.kind === "adhoc" ? C.adHocReadonly : !1,
            internals: Pt,
            prefs: (h == null ? void 0 : h.options.prefs) ?? { mode: "hsv" },
            compact: (h == null ? void 0 : h.options.compact) ?? !1,
            userPalettes: l.user.colorPickerPalettes,
            onSaveUserPalette: a,
            onDeleteUserPalette: d,
            descriptorBinding: C.kind === "descriptor" ? C.descriptor : void 0
          }
        });
        return {
          closable: !0,
          unmount() {
            st(P);
          }
        };
      }
    }), it = co();
    const p = () => {
      it.clear();
      const f = n.contributions.list(Vr);
      for (const v of f) it.register(v);
    };
    p(), Xt = n.contributions.onChange(Vr, p), n.registerView("sh3-editor:graph", {
      mount(f, v) {
        const _ = v.slotId, h = v.meta;
        let m = null;
        const k = () => {
          m && (st(m), m = null);
          const P = n.contributions.list(Fr);
          m = mt(ao, {
            target: f,
            props: {
              slotId: _,
              meta: h,
              descriptors: P,
              domains: it
            }
          });
        };
        k();
        const C = n.contributions.onChange(Fr, k);
        return {
          closable: !0,
          unmount() {
            C(), m && (st(m), m = null);
          }
        };
      }
    }), n.registerView("sh3-editor:settings", {
      mount(f) {
        const v = mt(cl, {
          target: f,
          props: { ctx: n }
        });
        return {
          closable: !0,
          unmount() {
            st(v);
          }
        };
      }
    }), n.registerView("sh3-editor:help", {
      mount(f) {
        const v = mt(Tr, {
          target: f,
          props: { surface: "view", ctx: n }
        });
        return {
          closable: !0,
          unmount() {
            st(v);
          }
        };
      }
    });
    const y = {
      id: "sh3-editor:help-tab:hotkeys",
      label: "Hotkeys",
      priority: 0,
      mount() {
        return { unmount() {
        } };
      }
    };
    n.contributions.register(
      Wr,
      y
    );
    let g = !1;
    n.actions.register({
      id: "sh3-editor:help.open",
      label: "Open Help",
      scope: ["home", "app"],
      defaultShortcut: "F1",
      allowInInputs: !0,
      paletteItem: !0,
      contextItem: !1,
      group: "Help",
      run() {
        g || (g = !0, on.modal.open(
          Tr,
          { surface: "modal", ctx: n, onClose: () => {
            g = !1;
          } },
          { dismissOnBackdrop: !0 }
        ));
      }
    }), n.actions.register({
      id: "sh3-editor:settings.open",
      label: "Open Editor Settings",
      scope: "view:sh3-editor:settings",
      paletteItem: !0,
      contextItem: !1,
      group: "Editor",
      run() {
      }
    }), n.actions.register({
      id: "sh3-editor:graph.delete-selection",
      label: "Delete Selection",
      scope: "focus:sh3-editor:graph",
      defaultShortcut: "Delete",
      paletteItem: !0,
      contextItem: !0,
      group: "Graph",
      run() {
        const f = $e();
        if (!f || f.state.readonly || f.state.selection.size === 0) return;
        const v = Array.from(f.state.selection), _ = Fa(f.state, f.domain, v);
        _.apply(), f.history.push(_), f.onSelectionChange([]), f.onAssetChanged();
      }
    }), n.actions.register({
      id: "sh3-editor:graph.undo",
      label: "Undo",
      scope: "focus:sh3-editor:graph",
      defaultShortcut: "Mod+Z",
      paletteItem: !0,
      contextItem: !1,
      group: "Graph",
      run() {
        const f = $e();
        !f || f.state.readonly || f.history.undo() && f.onAssetChanged();
      }
    }), n.actions.register({
      id: "sh3-editor:graph.redo",
      label: "Redo",
      scope: "focus:sh3-editor:graph",
      defaultShortcut: "Mod+Shift+Z",
      paletteItem: !0,
      contextItem: !1,
      group: "Graph",
      run() {
        const f = $e();
        !f || f.state.readonly || f.history.redo() && f.onAssetChanged();
      }
    }), n.actions.register({
      id: "sh3-editor:graph.redo-alt",
      label: "Redo",
      scope: "focus:sh3-editor:graph",
      defaultShortcut: "Mod+Y",
      paletteItem: !1,
      contextItem: !1,
      run() {
        const f = $e();
        !f || f.state.readonly || f.history.redo() && f.onAssetChanged();
      }
    }), n.actions.register({
      id: "sh3-editor:graph.zoom-in",
      label: "Zoom In",
      scope: "focus:sh3-editor:graph",
      defaultShortcut: "Mod+=",
      paletteItem: !0,
      contextItem: !1,
      group: "Graph",
      run() {
        var f;
        (f = $e()) == null || f.zoomIn();
      }
    }), n.actions.register({
      id: "sh3-editor:graph.zoom-out",
      label: "Zoom Out",
      scope: "focus:sh3-editor:graph",
      defaultShortcut: "Mod+-",
      paletteItem: !0,
      contextItem: !1,
      group: "Graph",
      run() {
        var f;
        (f = $e()) == null || f.zoomOut();
      }
    }), n.actions.register({
      id: "sh3-editor:graph.zoom-reset",
      label: "Reset Zoom",
      scope: "focus:sh3-editor:graph",
      defaultShortcut: "Mod+0",
      paletteItem: !0,
      contextItem: !1,
      group: "Graph",
      run() {
        var f;
        (f = $e()) == null || f.zoomReset();
      }
    }), n.actions.register({
      id: "sh3-editor:graph.fit-content",
      label: "Fit Content",
      scope: "focus:sh3-editor:graph",
      defaultShortcut: "Shift+1",
      paletteItem: !0,
      contextItem: !1,
      group: "Graph",
      run() {
        var f;
        (f = $e()) == null || f.fitContent();
      }
    }), n.actions.register({
      id: "sh3-editor:graph.dismiss-palette",
      label: "Dismiss Palette",
      scope: "focus:sh3-editor:graph",
      defaultShortcut: "Escape",
      allowInInputs: !0,
      paletteItem: !1,
      contextItem: !1,
      group: "Graph",
      run() {
        var f;
        (f = $e()) == null || f.dismissPalette();
      }
    });
  },
  deactivate() {
    Xt == null || Xt(), Xt = null, it == null || it.clear(), it = null, Wt == null || Wt(), Wt = null, Yt == null || Yt(), Yt = null, Pr(null), Kt == null || Kt(), Kt = null, Gt == null || Gt(), pt == null || pt.clear(), Ir([]), pt = null, rr = null, Pt = null, Gt = null, Br.api = null;
  }
};
export {
  bo as getApi,
  Br as shard
};
