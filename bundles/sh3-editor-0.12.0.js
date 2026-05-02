/* sh3-css-inline: injected styles */
(function(){
  const s=document.createElement("style");
  s.textContent=".cp-surface.svelte-7v5dlc{display:flex;flex-direction:column;gap:12px;padding:12px;background:var(--shell-bg-elevated);border-radius:6px;font-family:var(--shell-font-ui);width:fit-content}.cp-surface.disabled.svelte-7v5dlc{opacity:.5;pointer-events:none}.cp-main.svelte-7v5dlc{display:flex;gap:16px}.cp-left.svelte-7v5dlc{display:flex;flex-direction:column;gap:10px}.cp-right.svelte-7v5dlc{display:flex;flex-direction:column;min-width:180px}.cp-body.svelte-7v5dlc{display:flex;gap:8px}.cp-square.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:crosshair}.cp-strip.svelte-7v5dlc{border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-mode.svelte-7v5dlc{display:inline-flex;gap:0}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:3px 10px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);cursor:pointer}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):first-child{border-radius:4px 0 0 4px;border-right:none}.cp-mode.svelte-7v5dlc button:where(.svelte-7v5dlc):last-child{border-radius:0 4px 4px 0}.cp-mode.svelte-7v5dlc button.active:where(.svelte-7v5dlc){background:var(--shell-accent, #3a7eff);color:var(--shell-bg)}.cp-sliders.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-label.svelte-7v5dlc{width:14px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-value.svelte-7v5dlc{width:40px;font-size:11px;color:var(--shell-fg-muted);text-align:right}.cp-range.svelte-7v5dlc{flex:1;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:8px;border-radius:4px;background:var(--track-bg, var(--shell-input-bg));outline:none;cursor:pointer}.cp-range.svelte-7v5dlc::-webkit-slider-thumb{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-range.svelte-7v5dlc::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--shell-fg);border:2px solid var(--shell-border);cursor:pointer}.cp-hex-row.svelte-7v5dlc{display:flex;align-items:center;gap:8px}.cp-preview.svelte-7v5dlc{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-7v5dlc{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-palette.svelte-7v5dlc{display:flex;flex-direction:column;gap:6px}.cp-palette-select.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;outline:none}.cp-palette-select.svelte-7v5dlc:focus{border-color:var(--shell-accent, #3a7eff)}.cp-swatches.svelte-7v5dlc{display:grid;grid-template-columns:repeat(auto-fill,minmax(24px,1fr));gap:4px}.cp-swatch.svelte-7v5dlc{width:24px;height:24px;border-radius:4px;border:1px solid var(--shell-border);cursor:pointer;padding:0;outline:none}.cp-swatch.active.svelte-7v5dlc{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-palette-actions.svelte-7v5dlc{display:flex;gap:4px}.cp-palette-btn.svelte-7v5dlc{-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:11px;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;cursor:pointer}.cp-palette-btn.svelte-7v5dlc:hover:not([disabled]){background:var(--shell-bg-sunken)}.cp-palette-btn[disabled].svelte-7v5dlc{opacity:.5;cursor:not-allowed}.cp-save-prompt.svelte-7v5dlc{display:flex;gap:4px;align-items:center}.cp-save-input.svelte-7v5dlc{flex:1;min-width:0;padding:3px 6px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:12px;font-family:inherit;outline:none}.cp-pick-title.svelte-1n3y1cm{font:var(--shell-font-ui);color:var(--shell-text-dim);padding:4px 8px;border-bottom:1px solid var(--shell-border-subtle, rgba(255, 255, 255, .1))}.toolbar.svelte-10sr5yt{display:flex;align-items:center;gap:6px;padding:4px 8px;border-bottom:1px solid var(--shell-border);background:var(--shell-bg-raised);font-family:var(--shell-font-ui);font-size:12px;flex-shrink:0}.toolbar-btn.svelte-10sr5yt{padding:2px 8px;border:1px solid var(--shell-border);border-radius:3px;background:var(--shell-bg);color:var(--shell-fg);font-size:11px;cursor:pointer;white-space:nowrap}.toolbar-btn.svelte-10sr5yt:hover:not(:disabled){background:var(--shell-bg-sunken)}.toolbar-btn.svelte-10sr5yt:disabled{opacity:.4;cursor:default}.toolbar-accent.svelte-10sr5yt{color:var(--shell-accent)}.toolbar-spacer.svelte-10sr5yt{flex:1}.toolbar-sep.svelte-10sr5yt{width:1px;height:16px;background:var(--shell-border)}.toolbar-path.svelte-10sr5yt{color:var(--shell-fg-muted);font-family:var(--shell-font-mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.body.svelte-1etykqv{padding:var(--shell-pad-lg);display:flex;flex-direction:column;gap:var(--shell-pad-md);min-width:320px;font-family:var(--shell-font-ui)}h2.svelte-1etykqv{margin:0;font-size:16px;color:var(--shell-fg)}.rows.svelte-1etykqv{display:flex;flex-direction:column;gap:var(--shell-pad-sm)}.row.svelte-1etykqv{display:flex;align-items:center;justify-content:space-between;gap:var(--shell-pad-md);font-size:13px}.label.svelte-1etykqv{color:var(--shell-fg-muted)}.seg.svelte-1etykqv{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;padding:4px 10px;background:var(--shell-bg);color:var(--shell-fg);border:none;font-size:12px;cursor:pointer}.seg.svelte-1etykqv button:where(.svelte-1etykqv)+button:where(.svelte-1etykqv){border-left:1px solid var(--shell-border)}.seg.svelte-1etykqv button.active:where(.svelte-1etykqv){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-1etykqv button:where(.svelte-1etykqv):hover:not(.active){background:var(--shell-bg-sunken)}.actions.svelte-1etykqv{display:flex;justify-content:flex-end;gap:var(--shell-pad-sm)}.actions.svelte-1etykqv button:where(.svelte-1etykqv){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:var(--shell-pad-sm) var(--shell-pad-md);background:var(--shell-accent-muted);color:var(--shell-fg);border:1px solid var(--shell-border-strong);border-radius:var(--shell-radius-sm);cursor:pointer}.actions.svelte-1etykqv button:where(.svelte-1etykqv):hover{background:var(--shell-accent)}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv){background:transparent}.actions.svelte-1etykqv button.secondary:where(.svelte-1etykqv):hover{background:var(--shell-bg-sunken)}.preview-root.svelte-1whghyg{flex:1;overflow:auto;padding:12px 16px;background:var(--shell-bg);color:var(--shell-fg);font-family:var(--shell-font-ui);font-size:13px;line-height:1.55}.preview-root.svelte-1whghyg h1,.preview-root.svelte-1whghyg h2,.preview-root.svelte-1whghyg h3,.preview-root.svelte-1whghyg h4,.preview-root.svelte-1whghyg h5,.preview-root.svelte-1whghyg h6{margin:1em 0 .4em;line-height:1.25}.preview-root.svelte-1whghyg h1{font-size:1.6em;border-bottom:1px solid var(--shell-border);padding-bottom:.2em}.preview-root.svelte-1whghyg h2{font-size:1.35em;border-bottom:1px solid var(--shell-border);padding-bottom:.15em}.preview-root.svelte-1whghyg h3{font-size:1.15em}.preview-root.svelte-1whghyg p{margin:.6em 0}.preview-root.svelte-1whghyg a{color:var(--shell-accent);text-decoration:none}.preview-root.svelte-1whghyg a:hover{text-decoration:underline}.preview-root.svelte-1whghyg code{font-family:var(--shell-font-mono);font-size:.92em;background:var(--shell-bg-sunken);padding:.1em .35em;border-radius:3px}.preview-root.svelte-1whghyg pre{background:var(--shell-bg-sunken);padding:8px 12px;border-radius:4px;overflow-x:auto}.preview-root.svelte-1whghyg pre code{background:transparent;padding:0}.preview-root.svelte-1whghyg blockquote{border-left:3px solid var(--shell-border);margin:.6em 0;padding:.2em 1em;color:var(--shell-fg-muted)}.preview-root.svelte-1whghyg ul,.preview-root.svelte-1whghyg ol{padding-left:1.5em;margin:.4em 0}.editor-container.svelte-1j4uh1h{display:flex;flex-direction:column;height:100%;position:relative}.editor-wrap.svelte-1j4uh1h{display:flex;height:100%;overflow:hidden;background:var(--shell-bg-sunken);font-family:var(--shell-font-mono);font-size:var(--editor-font-size, 13px);line-height:1.6;color:var(--shell-fg)}.gutter.svelte-1j4uh1h{flex-shrink:0;width:3.5em;background:var(--shell-bg-sunken);border-right:1px solid var(--shell-border);overflow:hidden;color:var(--shell-fg-muted);font-size:inherit;line-height:inherit;-webkit-user-select:none;user-select:none}.gutter-inner.svelte-1j4uh1h{text-align:right;padding:0 .5em 0 0}.line-num.svelte-1j4uh1h{font-size:.85em;height:1lh;line-height:1lh}.editor-body.svelte-1j4uh1h{position:relative;flex:1;overflow:hidden}.highlight-layer.svelte-1j4uh1h{position:absolute;top:0;left:0;margin:0;padding:0 .75em;white-space:pre;word-wrap:normal;overflow:visible;pointer-events:none;font-family:inherit;font-size:inherit;line-height:inherit;color:var(--shell-fg);-moz-tab-size:2;tab-size:2}.input-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:0;padding:0 .75em;background:transparent;border:none;outline:none;resize:none;font-family:inherit;font-size:inherit;line-height:inherit;color:transparent;caret-color:var(--shell-fg);white-space:pre;word-wrap:normal;overflow:auto;-moz-tab-size:2;tab-size:2;box-sizing:border-box}.input-layer.svelte-1j4uh1h::selection{background:#61afef40}.layer-hidden.svelte-1j4uh1h,.gutter-hidden.svelte-1j4uh1h{display:none}.preview-layer.svelte-1j4uh1h{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;overflow:hidden}.hl-keyword{color:#c678dd}.hl-type{color:#e5c07b}.hl-string{color:#98c379}.hl-number,.hl-bool{color:#d19a66}.hl-comment{color:#5c6370;font-style:italic}.hl-key{color:#e06c75}.hl-context{color:#56b6c2}.hl-parent,.hl-ref{color:#61afef}.hl-punct{color:var(--shell-fg-muted)}.hl-code{color:#abb2bf}.hl-heading{color:#e5c07b;font-weight:600}.hl-bold{font-weight:600}.reader-container.svelte-jsdqlf{display:flex;flex-direction:column;height:100%;background:var(--shell-bg)}.reader-body.svelte-jsdqlf{flex:1;display:flex;overflow:hidden}.field.svelte-2gtehg{display:grid;grid-template-columns:minmax(4em,12em) 1fr;column-gap:.75em;align-items:center;padding:.15em .5em;font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg)}.label.svelte-2gtehg{color:var(--shell-fg-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.readonly.svelte-2gtehg .value:where(.svelte-2gtehg){color:var(--shell-fg-muted)}.primitive.svelte-1o84d6l{background:var(--shell-bg-sunken);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:2px;padding:.1em .3em;font-family:var(--shell-font-mono);font-size:13px;width:100%;box-sizing:border-box}.primitive.svelte-1o84d6l:focus{outline:1px solid var(--shell-accent, #61afef)}.primitive.svelte-1o84d6l:disabled{color:var(--shell-fg-muted);cursor:default}.walker.svelte-1xvtj10{display:flex;flex-direction:column;gap:.1em;padding:.25em 0}.leaf.svelte-o6duey{font-family:var(--shell-font-mono);font-size:13px;color:var(--shell-fg-muted)}.inspector-container.svelte-jpxkcf{display:flex;flex-direction:column;height:100%;background:var(--shell-bg-sunken);color:var(--shell-fg);font-family:var(--shell-font-mono);font-size:13px;outline:none}.inspector-body.svelte-jpxkcf{flex:1;overflow:auto;padding:.5em 0}.cp.svelte-f5c5rv{display:flex;flex-direction:column;border:1px solid var(--shell-border);border-radius:6px;width:fit-content}.cp.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact.svelte-f5c5rv{position:relative;display:inline-block;font-family:var(--shell-font-ui)}.cp-compact.disabled.svelte-f5c5rv{opacity:.5;pointer-events:none}.cp-compact-row.svelte-f5c5rv{display:flex;align-items:center;gap:6px}.cp-compact-preview.svelte-f5c5rv{width:20px;height:20px;cursor:pointer;border:1px solid var(--shell-border);border-radius:4px;flex-shrink:0;outline:none}.cp-compact-preview.svelte-f5c5rv:focus-visible{box-shadow:0 0 0 2px var(--shell-accent, #3a7eff)}.cp-preview.svelte-f5c5rv{width:28px;height:28px;border-radius:4px;border:1px solid var(--shell-border);flex-shrink:0}.cp-hex-input.svelte-f5c5rv{flex:1;padding:4px 8px;background:var(--shell-input-bg);color:var(--shell-fg);border:1px solid var(--shell-border);border-radius:4px;font-size:var(--font-size);font-family:inherit;outline:none}.cp-hex-input.svelte-f5c5rv:focus{border-color:var(--shell-accent, #3a7eff)}.cp-compact-hex.svelte-f5c5rv{width:90px;font-size:12px}.cp-leaf-fallback.svelte-1tdr2l8{font-family:var(--shell-font-mono, monospace);color:var(--shell-text-dim)}.section.svelte-18qjjuf{padding-bottom:var(--shell-pad-md);margin-bottom:var(--shell-pad-md);border-bottom:1px solid var(--shell-border)}.section.svelte-18qjjuf:last-child{border-bottom:none;padding-bottom:0;margin-bottom:0}.section-label.svelte-18qjjuf{margin:0 0 var(--shell-pad-sm);font-size:11px;font-weight:600;color:var(--shell-accent);text-transform:uppercase;letter-spacing:.08em;font-family:var(--shell-font-ui)}.rows.svelte-18qjjuf{display:flex;flex-direction:column}.row.svelte-1rh69ln{display:grid;grid-template-columns:200px 1fr;column-gap:var(--shell-pad-md);align-items:center;padding:var(--shell-pad-sm) 0;font-family:var(--shell-font-ui);font-size:13px;color:var(--shell-fg)}.row.disabled.svelte-1rh69ln{opacity:.5;pointer-events:none}.label.svelte-1rh69ln{color:var(--shell-fg)}.desc.svelte-1rh69ln{font-size:11px;color:var(--shell-fg-muted);margin-top:2px}.control.svelte-1rh69ln{display:flex;align-items:center;gap:var(--shell-pad-sm)}.error.svelte-1rh69ln{grid-column:2;font-size:11px;color:var(--shell-error, #ff7a7a);margin-top:4px}.toggle.svelte-ert2i6{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:34px;height:18px;background:var(--shell-border);border:none;border-radius:9px;position:relative;cursor:pointer;padding:0;transition:background .1s}.toggle.on.svelte-ert2i6{background:var(--shell-accent)}.toggle[disabled].svelte-ert2i6{cursor:not-allowed}.knob.svelte-ert2i6{position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:left .1s}.toggle.on.svelte-ert2i6 .knob:where(.svelte-ert2i6){left:18px}.input.svelte-1jljyjf{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:100%;box-sizing:border-box}.input.svelte-1jljyjf:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1jljyjf{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1jljyjf{cursor:not-allowed}.input.svelte-1be7g0v{background:var(--shell-bg-sunken);border:1px solid var(--shell-border);color:var(--shell-fg);padding:5px 8px;border-radius:var(--shell-radius-sm);font:inherit;font-size:12px;width:90px;box-sizing:border-box}.input.svelte-1be7g0v:focus{outline:none;border-color:var(--shell-accent)}.input.error.svelte-1be7g0v{border-color:var(--shell-error, #ff7a7a)}.input[disabled].svelte-1be7g0v{cursor:not-allowed}.unit.svelte-1be7g0v{font-size:11px;color:var(--shell-fg-muted)}.slider.svelte-1jyn88{flex:1;accent-color:var(--shell-accent);cursor:pointer}.slider[disabled].svelte-1jyn88{cursor:not-allowed}.slider.error.svelte-1jyn88{accent-color:var(--shell-error, #ff7a7a)}.value.svelte-1jyn88{min-width:56px;text-align:right;font-size:12px;color:var(--shell-accent);font-variant-numeric:tabular-nums}.seg.svelte-iu603z{display:inline-flex;border:1px solid var(--shell-border);border-radius:var(--shell-radius-sm);overflow:hidden}.seg.error.svelte-iu603z{border-color:var(--shell-error, #ff7a7a)}.seg.svelte-iu603z button:where(.svelte-iu603z){-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;font-size:12px;padding:4px 10px;background:var(--shell-bg-sunken);color:var(--shell-fg);border:none;cursor:pointer}.seg.svelte-iu603z button:where(.svelte-iu603z)+button:where(.svelte-iu603z){border-left:1px solid var(--shell-border)}.seg.svelte-iu603z button.active:where(.svelte-iu603z){background:var(--shell-accent);color:var(--shell-bg)}.seg.svelte-iu603z button:where(.svelte-iu603z):hover:not(.active):not([disabled]){background:var(--shell-bg)}.seg.svelte-iu603z button[disabled]:where(.svelte-iu603z){cursor:not-allowed}.settings.svelte-mrn94a{padding:var(--shell-pad-lg);font-family:var(--shell-font-ui);color:var(--shell-fg);background:var(--shell-bg);min-height:100%;box-sizing:border-box}.title.svelte-mrn94a{margin:0 0 var(--shell-pad-md);font-size:16px;font-weight:600}.empty.svelte-mrn94a{color:var(--shell-fg-muted);font-style:italic;padding:var(--shell-pad-md) 0}.hotkeys-tab.svelte-151qe3m{padding:12px 16px;color:var(--shell-fg)}.ctx.svelte-151qe3m{font-size:12px;opacity:.8;margin-bottom:12px}.ctx.svelte-151qe3m code:where(.svelte-151qe3m){font-family:var(--shell-mono, monospace)}.group.svelte-151qe3m{margin-bottom:16px}.group-title.svelte-151qe3m{font-size:13px;font-weight:600;margin:0 0 6px;opacity:.9}.list.svelte-151qe3m{list-style:none;margin:0;padding:0}.row.svelte-151qe3m{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:center;padding:4px 0;border-bottom:1px solid var(--shell-border, #2a2a2a)}.row.disabled.svelte-151qe3m{opacity:.5}.label.svelte-151qe3m{font-size:13px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kbd.svelte-151qe3m{font-family:var(--shell-mono, monospace);font-size:12px;padding:2px 6px;border-radius:3px;background:var(--shell-surface-2, #2a2a2a)}.badge.svelte-151qe3m{font-size:11px;opacity:.6;font-family:var(--shell-mono, monospace)}.empty.svelte-151qe3m{opacity:.6;padding:16px 0}.help-root.svelte-udgkd3{display:flex;flex-direction:column;height:100%;min-height:320px;background:var(--shell-surface, #1a1a1a);color:var(--shell-fg)}.modal-surface.svelte-udgkd3{width:640px;max-width:90vw;height:480px;max-height:80vh}.help-header.svelte-udgkd3{display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid var(--shell-border, #2a2a2a)}.title.svelte-udgkd3{font-weight:600;flex:1}.close-btn.svelte-udgkd3{background:none;border:none;color:var(--shell-fg);font-size:18px;cursor:pointer;padding:0 8px;line-height:1}.tab-strip.svelte-udgkd3{display:flex;gap:2px;padding:6px 8px 0;border-bottom:1px solid var(--shell-border, #2a2a2a);background:var(--shell-surface-2, transparent)}.tab-btn.svelte-udgkd3{background:transparent;border:none;color:var(--shell-fg);padding:6px 12px;cursor:pointer;font-size:13px;border-bottom:2px solid transparent;display:inline-flex;gap:4px;align-items:center}.tab-btn.svelte-udgkd3:hover{background:var(--shell-hover, rgba(255,255,255,.05))}.tab-btn.active.svelte-udgkd3{border-bottom-color:var(--shell-accent, #3ba3ff);font-weight:600}.tab-icon.svelte-udgkd3{font-size:14px}.tab-bodies.svelte-udgkd3{flex:1;overflow:hidden;position:relative}.tab-body.svelte-udgkd3{position:absolute;top:0;right:0;bottom:0;left:0;overflow-y:auto;overflow-x:hidden;display:none}.tab-body.active.svelte-udgkd3{display:block}.loading.svelte-udgkd3{padding:16px;opacity:.6}.graph-node.svelte-y92dsd{position:absolute;background:var(--sh3-surface-1, #1f1f1f);border:1px solid var(--border-color);border-radius:4px;color:var(--text-color);-webkit-user-select:none;user-select:none;box-shadow:0 2px 4px #0000004d;pointer-events:auto}.graph-node.selected.svelte-y92dsd{outline:2px solid var(--sh3-accent, #4a9eff);outline-offset:1px}.header.svelte-y92dsd{padding:4px 8px;cursor:grab;font-weight:600;border-bottom:1px solid var(--border-color);display:flex;gap:6px;align-items:center}.header.svelte-y92dsd:active{cursor:grabbing}.ports.svelte-y92dsd{display:flex;justify-content:space-between;padding:6px 0}.ports-col.svelte-y92dsd{display:flex;flex-direction:column;gap:4px;min-width:50%}.ports-col.inputs.svelte-y92dsd{align-items:flex-start}.ports-col.outputs.svelte-y92dsd{align-items:flex-end}.port.svelte-y92dsd{display:flex;align-items:center;gap:4px;padding:0 4px;font-size:.85em;cursor:crosshair}.port-marker.svelte-y92dsd{width:10px;height:10px;border-radius:50%;background:var(--border-color);border:1px solid rgba(255,255,255,.4)}.input.svelte-y92dsd .port-marker:where(.svelte-y92dsd){margin-left:-10px}.output.svelte-y92dsd .port-marker:where(.svelte-y92dsd){margin-right:-10px}.edge.svelte-1rehop2{cursor:pointer}.line.svelte-1rehop2{fill:none;stroke-width:2}.halo.svelte-1rehop2{fill:none;stroke:var(--sh3-accent, #4a9eff);stroke-width:6;opacity:.4}.selected.svelte-1rehop2 .line:where(.svelte-1rehop2){stroke-width:3}.palette.svelte-lpiq26{position:absolute;z-index:10;background:var(--sh3-surface-2, #2a2a2a);border:1px solid var(--sh3-border, #444);border-radius:4px;padding:4px;width:240px;max-height:320px;display:flex;flex-direction:column;box-shadow:0 4px 12px #0006}.search.svelte-lpiq26{padding:4px;border:1px solid var(--sh3-border, #444);border-radius:3px;background:var(--sh3-surface-1, #1f1f1f);color:var(--sh3-text-primary, #ddd)}.lists.svelte-lpiq26{overflow-y:auto;margin-top:4px}.cat-name.svelte-lpiq26{padding:4px 6px 2px;font-size:.75em;text-transform:uppercase;opacity:.6}.item.svelte-lpiq26{display:block;width:100%;text-align:left;padding:4px 6px;background:transparent;border:0;color:var(--sh3-text-primary, #ddd);cursor:pointer}.item.svelte-lpiq26:hover{background:var(--sh3-hover, #333)}.toolbar.svelte-ypcyd2{position:absolute;top:8px;right:8px;z-index:5;display:flex;gap:2px;background:var(--sh3-surface-1, #1f1f1f);border:1px solid var(--sh3-border, #444);border-radius:4px;padding:2px;box-shadow:0 2px 6px #00000059}button.svelte-ypcyd2{min-width:24px;height:24px;padding:0 6px;background:transparent;color:var(--sh3-text-primary, #ddd);border:0;border-radius:3px;cursor:pointer;font-size:.85em;line-height:1}button.svelte-ypcyd2:hover{background:var(--sh3-hover, #333)}.zoom-label.svelte-ypcyd2{min-width:44px;font-variant-numeric:tabular-nums}.graph-canvas.svelte-x16tu1{position:relative;width:100%;height:100%;overflow:hidden;background:var(--sh3-surface-0, #161616);background-image:linear-gradient(var(--sh3-grid, #2a2a2a) 1px,transparent 1px),linear-gradient(90deg,var(--sh3-grid, #2a2a2a) 1px,transparent 1px);background-size:20px 20px;outline:none}.edge-overlay.svelte-x16tu1{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;pointer-events:none}.edge-overlay.svelte-x16tu1 g.edge{pointer-events:stroke}.viewport.svelte-x16tu1{position:absolute;top:0;right:0;bottom:0;left:0;transform-origin:0 0;pointer-events:none}.graph-empty.svelte-1dbihe0{padding:1.5rem;color:var(--sh3-text-secondary, #888);font-family:var(--sh3-font-ui, system-ui)}h2.svelte-1dbihe0{margin:0 0 .5rem;color:var(--sh3-text-primary, #ddd)}h3.svelte-1dbihe0{margin:1.5rem 0 .5rem;font-size:.9rem;text-transform:uppercase;letter-spacing:.06em}.hint.svelte-1dbihe0{margin:0 0 .5rem}.domain-list.svelte-1dbihe0{list-style:none;padding:0;margin:0}.domain-list.svelte-1dbihe0 li:where(.svelte-1dbihe0){padding:.25rem 0;font-size:.9rem}.domain-list.svelte-1dbihe0 code:where(.svelte-1dbihe0){color:var(--sh3-text-primary, #ddd)}.dash.svelte-1dbihe0{margin:0 .5em;opacity:.6}.label.svelte-1dbihe0{color:var(--sh3-text-secondary, #aaa)}.warn.svelte-1dbihe0{color:var(--sh3-warn, #d6a13a)}.graph-error.svelte-39j3n{padding:1.5rem;color:var(--sh3-warn, #d6a13a);font-family:var(--sh3-font-ui, system-ui)}.graph-error.svelte-39j3n h2:where(.svelte-39j3n){margin:0 0 .5rem}";
  document.head.appendChild(s);
})();
var Ps = Object.defineProperty;
var Ts = Object.getPrototypeOf;
var Rs = Reflect.get;
var ni = (n) => {
  throw TypeError(n);
};
var As = (n, t, r) => t in n ? Ps(n, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[t] = r;
var N = (n, t, r) => As(n, typeof t != "symbol" ? t + "" : t, r), rr = (n, t, r) => t.has(n) || ni("Cannot " + r);
var C = (n, t, r) => (rr(n, t, "read from private field"), r ? r.call(n) : t.get(n)), Y = (n, t, r) => t.has(n) ? ni("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(n) : t.set(n, r), Nt = (n, t, r, i) => (rr(n, t, "write to private field"), i ? i.call(n, r) : t.set(n, r), r), le = (n, t, r) => (rr(n, t, "access private method"), r);
var ri = (n, t, r) => Rs(Ts(n), r, t);
import { shell as Xt, getActiveApp as Es, COLOR_PICKER_POINT as zs } from "sh3-core";
import { onMount as Yn, onDestroy as Ai, mount as vt, unmount as lt } from "svelte";
import * as e from "svelte/internal/client";
const Ds = 2, Ms = "inline";
function Ls(n, t) {
  return {
    indentUnit: (t == null ? void 0 : t.indentUnit) ?? (n == null ? void 0 : n.indentUnit) ?? Ds,
    braceStyle: (t == null ? void 0 : t.braceStyle) ?? (n == null ? void 0 : n.braceStyle) ?? Ms
  };
}
class Ns {
  constructor(t) {
    N(this, "entries", /* @__PURE__ */ new Map());
    N(this, "onClose");
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
      prefs: Ls(r.matchingConfig, r.prefs)
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
var mn;
class Os {
  constructor(t) {
    N(this, "entries", /* @__PURE__ */ new Map());
    Y(this, mn, e.state(0));
    N(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(C(this, mn));
  }
  set version(t) {
    e.set(C(this, mn), t, !0);
  }
  open(t, r) {
    const i = this.entries.get(t);
    if (i) return i;
    const s = e.proxy({ value: r.value, meta: r.meta, options: r });
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
  /** Force consumers of `get` / `has` / `list` to re-evaluate without changing
   *  the stored entries. Used by external mutators (bindInspector's replace
   *  closure) for swap operations whose visible effect is on `entry.value` /
   *  `entry.meta` — the $state fields handle most consumers, but anyone keying
   *  off `reg.get(id)` identity needs a nudge. */
  bumpVersion() {
    this.version++;
  }
  clear() {
    const t = [...this.entries.keys()];
    if (this.entries.clear(), t.length > 0 && this.version++, this.onClose) for (const r of t) this.onClose(r);
  }
}
mn = new WeakMap();
const Bs = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
function Ot({ h: n, s: t, v: r }) {
  const i = t / 100, s = r / 100, l = s * i, a = l * (1 - Math.abs(n / 60 % 2 - 1)), c = s - l;
  let u = 0, o = 0, d = 0;
  return n < 60 ? (u = l, o = a) : n < 120 ? (u = a, o = l) : n < 180 ? (o = l, d = a) : n < 240 ? (o = a, d = l) : n < 300 ? (u = a, d = l) : (u = l, d = a), {
    r: Math.round((u + c) * 255),
    g: Math.round((o + c) * 255),
    b: Math.round((d + c) * 255)
  };
}
function Hs({ r: n, g: t, b: r }) {
  const i = n / 255, s = t / 255, l = r / 255, a = Math.max(i, s, l), c = Math.min(i, s, l), u = a - c;
  let o = 0;
  u !== 0 && (a === i ? o = 60 * ((s - l) / u % 6) : a === s ? o = 60 * ((l - i) / u + 2) : o = 60 * ((i - s) / u + 4)), o < 0 && (o += 360);
  const d = a === 0 ? 0 : u / a * 100, h = a * 100;
  return { h: Math.round(o), s: Math.round(d), v: Math.round(h) };
}
function Bt({ r: n, g: t, b: r }) {
  const i = (s) => s.toString(16).padStart(2, "0");
  return `#${i(n)}${i(t)}${i(r)}`;
}
function qs(n) {
  let t = n.replace(/^#/, "");
  t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]);
  const r = parseInt(t, 16);
  return { r: r >> 16 & 255, g: r >> 8 & 255, b: r & 255 };
}
function en(n) {
  return Bt(Ot(n));
}
function xt(n) {
  return Hs(qs(n));
}
function Us(n) {
  return Bs.test(n);
}
function qe(n) {
  if (!Us(n)) return null;
  let t = n.replace(/^#/, "").toLowerCase();
  return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), `#${t}`;
}
var bn;
class Vs {
  constructor(t) {
    N(this, "entries", /* @__PURE__ */ new Map());
    Y(this, bn, e.state(0));
    N(this, "onClose");
    this.onClose = t;
  }
  get version() {
    return e.get(C(this, bn));
  }
  set version(t) {
    e.set(C(this, bn), t, !0);
  }
  open(t, r) {
    const i = this.entries.get(t);
    if (i) return i;
    const l = { value: qe(r.value) ?? "#000000", options: r };
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
bn = new WeakMap();
const Fs = 200;
class js {
  constructor(t = Fs) {
    N(this, "undoStack", []);
    N(this, "redoStack", []);
    N(this, "maxDepth");
    N(this, "listeners", /* @__PURE__ */ new Set());
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
function Nn(n) {
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
class Gs {
  constructor() {
    N(this, "engines", /* @__PURE__ */ new Map());
  }
  get(t) {
    let r = this.engines.get(t);
    return r || (r = new js(), this.engines.set(t, r)), r;
  }
  release(t) {
    this.engines.delete(t);
  }
  clear() {
    this.engines.clear();
  }
}
class Ct {
  constructor() {
    N(this, "listeners", /* @__PURE__ */ new Set());
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
function Zs(n, t, r) {
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
const Ws = 300;
function Ks(n) {
  const t = new Ct(), r = new Ct(), i = new Ct(), s = new Ct(), l = new Ct(), a = new Ct(), c = new Ct(), u = new Gs(), o = new Os((m) => {
    u.release(m);
  }), d = new Vs((m) => {
    u.release(m);
  }), h = /* @__PURE__ */ new Map();
  function v(m) {
    let b = h.get(m);
    return b || (b = Zs(u, m, () => {
      var w;
      if (o.has(m) && l.emit(m, ((w = o.get(m)) == null ? void 0 : w.value) ?? null), d.has(m)) {
        const x = d.get(m);
        x && a.emit(m, x.value);
      }
    }), h.set(m, b)), b;
  }
  function g(m) {
    u.release(m), h.delete(m);
  }
  return { api: {
    getContent(m) {
      const b = n.get(m);
      return b ? b.document.content : null;
    },
    isDirty(m) {
      const b = n.get(m);
      return b ? b.document.dirty : !1;
    },
    getDocument(m) {
      const b = n.get(m);
      return b ? b.document : null;
    },
    listInstances() {
      return n.list();
    },
    openDocument(m, b) {
      n.open(m, b);
    },
    closeDocument(m) {
      n.close(m) && g(m);
    },
    updateContent(m, b, w, x) {
      var te, ie;
      const I = n.get(m);
      if (!I) return;
      const A = I.document, R = A.content;
      if (R === b) return;
      const D = A.cursorStart, q = (X, fe) => {
        A.content = X, A.cursorStart = fe, A.cursorEnd = fe, t.emit(m, X);
      };
      A.content = b, A.cursorStart = w, A.cursorEnd = x;
      const L = v(m), G = Date.now(), Z = L.peek(), E = ((te = Z == null ? void 0 : Z.meta) == null ? void 0 : te.kind) === "text-swap" ? Z.meta.snapshot : void 0, B = Math.abs(b.length - R.length) <= 1, $ = E && ((ie = Z == null ? void 0 : Z.meta) == null ? void 0 : ie.timestamp) != null && G - Z.meta.timestamp < Ws;
      E && B && $ ? L.replaceTop(Nn({
        setter: q,
        before: E.before,
        after: b,
        cursorBefore: E.cursorBefore,
        cursorAfter: w,
        now: G
      })) : L.push(Nn({
        setter: q,
        before: R,
        after: b,
        cursorBefore: D,
        cursorAfter: w,
        now: G
      }));
      const F = A.dirty;
      A.dirty = !0, t.emit(m, b), F || r.emit(m, !0);
    },
    markClean(m) {
      const b = n.get(m);
      b && b.document.dirty && (b.document.dirty = !1, r.emit(m, !1));
    },
    onContentChange(m) {
      return t.on(m);
    },
    onDirtyChange(m) {
      return r.on(m);
    },
    onSave(m) {
      return i.on(m);
    },
    onPrefsChange(m) {
      return s.on(m);
    },
    openInspector(m, b) {
      o.open(m, b);
    },
    closeInspector(m) {
      o.close(m) && g(m);
    },
    getInspectorValue(m) {
      var b;
      return ((b = o.get(m)) == null ? void 0 : b.value) ?? null;
    },
    listInspectorInstances() {
      return o.list();
    },
    onInspectorValueChange(m) {
      return l.on(m);
    },
    openColorPicker(m, b) {
      d.open(m, b);
    },
    closeColorPicker(m) {
      d.close(m) && g(m);
    },
    getColorPickerValue(m) {
      var b;
      return ((b = d.get(m)) == null ? void 0 : b.value) ?? null;
    },
    listColorPickerInstances() {
      return d.list();
    },
    onColorPickerValueChange(m) {
      return a.on(m);
    },
    onColorPickerPrefsChange(m) {
      return c.on(m);
    },
    history: v
  }, internals: {
    emitSave(m) {
      i.emit(m);
    },
    contentChange: t,
    dirtyChange: r,
    saveEvent: i,
    prefsChange: s,
    inspectorValueChange: l,
    colorPickerValueChange: a,
    colorPickerPrefsChange: c,
    history: v,
    inspectors: o,
    colorPickers: d
  }, teardown: () => {
    t.clear(), r.clear(), i.clear(), s.clear(), l.clear(), a.clear(), c.clear(), u.clear(), h.clear(), o.clear(), d.clear();
  } };
}
const ir = "sh3-editor.inspectorRenderer", Ys = "sh3-editor.inspectorInstance", Xs = "5";
var Ri;
typeof window < "u" && ((Ri = window.__svelte ?? (window.__svelte = {})).v ?? (Ri.v = /* @__PURE__ */ new Set())).add(Xs);
const sr = [
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
var Qs = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">H</span> <input type="range" min="0" max="360" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">S</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">V</span> <input type="range" min="0" max="100" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), Js = e.from_html('<div class="cp-sliders svelte-7v5dlc"><label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">R</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">G</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label> <label class="cp-row svelte-7v5dlc"><span class="cp-label svelte-7v5dlc">B</span> <input type="range" min="0" max="255" class="cp-range svelte-7v5dlc"/> <span class="cp-value svelte-7v5dlc"> </span></label></div>'), $s = e.from_html("<option> </option>"), el = e.from_html('<button type="button"></button>'), tl = e.from_html('<div class="cp-save-prompt svelte-7v5dlc"><input type="text" class="cp-save-input svelte-7v5dlc" placeholder="Palette name"/> <button type="button" class="cp-palette-btn svelte-7v5dlc">OK</button> <button type="button" class="cp-palette-btn svelte-7v5dlc">Cancel</button></div>'), nl = e.from_html('<div role="group" aria-label="Color picker"><div class="cp-main svelte-7v5dlc"><div class="cp-left svelte-7v5dlc"><div class="cp-body svelte-7v5dlc"><canvas class="cp-square svelte-7v5dlc" role="slider" aria-label="Saturation and value"></canvas> <canvas class="cp-strip svelte-7v5dlc" role="slider" aria-label="Hue"></canvas></div> <div class="cp-mode svelte-7v5dlc"><button type="button">HSV</button> <button type="button">RGB</button></div> <!> <div class="cp-hex-row svelte-7v5dlc"><div class="cp-preview svelte-7v5dlc"></div> <input type="text" class="cp-hex-input svelte-7v5dlc" aria-label="Hex value"/></div></div> <div class="cp-right svelte-7v5dlc"><div class="cp-palette svelte-7v5dlc"><select class="cp-palette-select svelte-7v5dlc" aria-label="Palette"></select> <div class="cp-swatches svelte-7v5dlc"></div> <div class="cp-palette-actions svelte-7v5dlc"><button type="button" class="cp-palette-btn svelte-7v5dlc" title="Save current color to a palette">+ Save</button> <button type="button" class="cp-palette-btn cp-delete svelte-7v5dlc">Delete</button></div> <!></div></div></div></div>');
function hr(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "readonly", 3, !1), i = e.prop(t, "initialMode", 3, "hsv"), s = e.prop(t, "userPalettes", 19, () => []);
  const l = 180, a = 20, c = qe(t.value) ?? "#000000";
  let u = e.state(e.proxy(xt(c))), o = c, d = e.state(e.proxy(i()));
  e.user_effect(() => {
    const k = qe(t.value) ?? "#000000";
    k !== o && (e.set(u, xt(k), !0), o = k, e.set(Me, k.toUpperCase(), !0));
  });
  function h(k) {
    const P = qe(k);
    P && P !== o && (o = P, t.onChange(P));
  }
  function v() {
    h(en(e.get(u)));
  }
  let g = e.state(void 0), f = e.state(void 0);
  const p = typeof window < "u" && window.devicePixelRatio || 1;
  function y() {
    if (!e.get(g)) return;
    const k = l, P = l;
    e.get(g).width = k * p, e.get(g).height = P * p, e.get(g).style.width = k + "px", e.get(g).style.height = P + "px";
    const M = e.get(g).getContext("2d"), j = M.createImageData(k * p, P * p), ee = j.data;
    for (let ne = 0; ne < P * p; ne++)
      for (let be = 0; be < k * p; be++) {
        const se = be / p / k * 100, Oe = (1 - ne / p / P) * 100, Te = Ot({ h: e.get(u).h, s: se, v: Oe }), rt = (ne * k * p + be) * 4;
        ee[rt] = Te.r, ee[rt + 1] = Te.g, ee[rt + 2] = Te.b, ee[rt + 3] = 255;
      }
    M.putImageData(j, 0, 0), m();
  }
  function m() {
    if (!e.get(g)) return;
    const k = e.get(g).getContext("2d"), P = e.get(u).s / 100 * l, M = (1 - e.get(u).v / 100) * l;
    k.save(), k.scale(p, p), k.beginPath(), k.arc(P, M, 6, 0, Math.PI * 2), k.strokeStyle = "#ffffff", k.lineWidth = 2, k.stroke(), k.beginPath(), k.arc(P, M, 7, 0, Math.PI * 2), k.strokeStyle = "#000000", k.lineWidth = 1, k.stroke(), k.restore();
  }
  function b() {
    if (!e.get(f)) return;
    const k = a, P = l;
    e.get(f).width = k * p, e.get(f).height = P * p, e.get(f).style.width = k + "px", e.get(f).style.height = P + "px";
    const M = e.get(f).getContext("2d"), j = M.createImageData(k * p, P * p), ee = j.data;
    for (let ne = 0; ne < P * p; ne++) {
      const be = ne / (P * p) * 360, se = Ot({ h: be, s: 100, v: 100 });
      for (let Oe = 0; Oe < k * p; Oe++) {
        const Te = (ne * k * p + Oe) * 4;
        ee[Te] = se.r, ee[Te + 1] = se.g, ee[Te + 2] = se.b, ee[Te + 3] = 255;
      }
    }
    M.putImageData(j, 0, 0), w();
  }
  function w() {
    if (!e.get(f)) return;
    const k = e.get(f).getContext("2d"), P = e.get(u).h / 360 * l;
    k.save(), k.scale(p, p), k.beginPath(), k.moveTo(0, P), k.lineTo(a, P), k.strokeStyle = "#ffffff", k.lineWidth = 2, k.stroke(), k.beginPath(), k.moveTo(0, P), k.lineTo(a, P), k.strokeStyle = "#000000", k.lineWidth = 1, k.stroke(), k.restore();
  }
  Yn(() => {
    y(), b();
  });
  let x = e.state(e.proxy(e.get(u).h));
  e.user_effect(() => {
    e.get(u).h !== e.get(x) ? (e.set(x, e.get(u).h, !0), y(), b()) : y();
  });
  let I = e.state(!1), A = e.state(!1);
  function R(k) {
    if (r() || !e.get(g)) return;
    const P = e.get(g).getBoundingClientRect(), M = Math.max(0, Math.min(l, k.clientX - P.left)), j = Math.max(0, Math.min(l, k.clientY - P.top)), ee = M / l * 100, ne = (1 - j / l) * 100;
    e.set(u, { h: e.get(u).h, s: Math.round(ee), v: Math.round(ne) }, !0);
  }
  function D(k) {
    if (r() || !e.get(f)) return;
    const P = e.get(f).getBoundingClientRect(), j = Math.max(0, Math.min(l, k.clientY - P.top)) / l * 360;
    e.set(u, { h: Math.round(j), s: e.get(u).s, v: e.get(u).v }, !0);
  }
  function q(k) {
    r() || (e.set(I, !0), R(k), window.addEventListener("mousemove", G), window.addEventListener("mouseup", Z));
  }
  function L(k) {
    r() || (e.set(A, !0), D(k), window.addEventListener("mousemove", G), window.addEventListener("mouseup", Z));
  }
  function G(k) {
    e.get(I) ? R(k) : e.get(A) && D(k);
  }
  function Z() {
    (e.get(I) || e.get(A)) && h(en(e.get(u))), e.set(I, !1), e.set(A, !1), window.removeEventListener("mousemove", G), window.removeEventListener("mouseup", Z);
  }
  const E = "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)", B = e.derived(() => `linear-gradient(to right, #ffffff, ${Bt(Ot({ h: e.get(u).h, s: 100, v: e.get(u).v }))})`), $ = e.derived(() => `linear-gradient(to right, #000000, ${Bt(Ot({ h: e.get(u).h, s: e.get(u).s, v: 100 }))})`), F = e.derived(() => Ot(e.get(u)));
  function te(k) {
    e.set(u, { ...e.get(u), h: +k.target.value }, !0);
  }
  function ie(k) {
    e.set(u, { ...e.get(u), s: +k.target.value }, !0);
  }
  function X(k) {
    e.set(u, { ...e.get(u), v: +k.target.value }, !0);
  }
  function fe(k) {
    const P = +k.target.value;
    e.set(u, xt(Bt({ r: P, g: e.get(F).g, b: e.get(F).b })), !0);
  }
  function kt(k) {
    const P = +k.target.value;
    e.set(u, xt(Bt({ r: e.get(F).r, g: P, b: e.get(F).b })), !0);
  }
  function Dt(k) {
    const P = +k.target.value;
    e.set(u, xt(Bt({ r: e.get(F).r, g: e.get(F).g, b: P })), !0);
  }
  function Ge(k) {
    var P;
    e.get(d) !== k && (e.set(d, k, !0), (P = t.onModeChange) == null || P.call(t, k));
  }
  let Me = e.state(e.proxy(c.toUpperCase()));
  e.user_effect(() => {
    e.set(Me, en(e.get(u)).toUpperCase(), !0);
  });
  function wt() {
    if (r()) return;
    const k = e.get(Me).trim(), P = qe(k);
    if (!P) {
      e.set(Me, en(e.get(u)).toUpperCase(), !0);
      return;
    }
    e.set(u, xt(P), !0), h(P);
  }
  function Mt(k) {
    k.key === "Enter" && (k.preventDefault(), k.currentTarget.blur());
  }
  const ce = e.derived(() => en(e.get(u))), xe = e.derived(() => [...sr, ...s()]);
  let Le = e.state(e.proxy(sr[0].id));
  const he = e.derived(() => e.get(xe).find((k) => k.id === e.get(Le)) ?? e.get(xe)[0]);
  function ye(k) {
    if (r()) return;
    const P = qe(k);
    P && (e.set(u, xt(P), !0), h(P));
  }
  let et = e.state(!1), Ne = e.state("");
  function Qt() {
    return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "u-" + Math.random().toString(36).slice(2, 10);
  }
  function T() {
    var P, M;
    if (r()) return;
    if ((P = e.get(he)) != null && P.builtin) {
      e.set(Ne, ""), e.set(et, !0);
      return;
    }
    if (!e.get(he)) return;
    const k = {
      ...e.get(he),
      colors: [...e.get(he).colors, e.get(ce)]
    };
    (M = t.onSaveUserPalette) == null || M.call(t, k);
  }
  function H() {
    var M;
    if (r()) return;
    const k = e.get(Ne).trim();
    if (!k) return;
    const P = { id: "user-" + Qt(), label: k, colors: [e.get(ce)] };
    (M = t.onSaveUserPalette) == null || M.call(t, P), e.set(Le, P.id, !0), e.set(et, !1), e.set(Ne, "");
  }
  function ae() {
    e.set(et, !1), e.set(Ne, "");
  }
  function _() {
    var P;
    if (r() || !e.get(he) || e.get(he).builtin) return;
    const k = e.get(he).id;
    (P = t.onDeleteUserPalette) == null || P.call(t, k), e.set(Le, sr[0].id, !0);
  }
  function S(k) {
    const P = k.target, M = k.shiftKey ? 10 : 1;
    if (P === e.get(g)) {
      if (k.key === "ArrowLeft") {
        k.preventDefault(), e.set(u, { ...e.get(u), s: Math.max(0, e.get(u).s - M) }, !0), v();
        return;
      }
      if (k.key === "ArrowRight") {
        k.preventDefault(), e.set(u, { ...e.get(u), s: Math.min(100, e.get(u).s + M) }, !0), v();
        return;
      }
      if (k.key === "ArrowUp") {
        k.preventDefault(), e.set(u, { ...e.get(u), v: Math.min(100, e.get(u).v + M) }, !0), v();
        return;
      }
      if (k.key === "ArrowDown") {
        k.preventDefault(), e.set(u, { ...e.get(u), v: Math.max(0, e.get(u).v - M) }, !0), v();
        return;
      }
    } else if (P === e.get(f)) {
      if (k.key === "ArrowUp") {
        k.preventDefault(), e.set(u, { ...e.get(u), h: Math.max(0, e.get(u).h - M) }, !0), v();
        return;
      }
      if (k.key === "ArrowDown") {
        k.preventDefault(), e.set(u, { ...e.get(u), h: Math.min(360, e.get(u).h + M) }, !0), v();
        return;
      }
    }
  }
  var z = nl();
  let O;
  var U = e.child(z), V = e.child(U), Q = e.child(V), ge = e.child(Q);
  e.set_attribute(ge, "aria-valuemin", 0), e.set_attribute(ge, "aria-valuemax", 100), e.bind_this(ge, (k) => e.set(g, k), () => e.get(g));
  var Ze = e.sibling(ge, 2);
  e.set_attribute(Ze, "aria-valuemin", 0), e.set_attribute(Ze, "aria-valuemax", 360), e.bind_this(Ze, (k) => e.set(f, k), () => e.get(f)), e.reset(Q);
  var ft = e.sibling(Q, 2), tt = e.child(ft);
  let Lt;
  var nt = e.sibling(tt, 2);
  let Kr;
  e.reset(ft);
  var Yr = e.sibling(ft, 2);
  {
    var ws = (k) => {
      var P = Qs(), M = e.child(P), j = e.sibling(e.child(M), 2);
      e.remove_input_defaults(j), e.set_style(j, "", {}, { "--track-bg": E });
      var ee = e.sibling(j, 2), ne = e.child(ee);
      e.reset(ee), e.reset(M);
      var be = e.sibling(M, 2), se = e.sibling(e.child(be), 2);
      e.remove_input_defaults(se);
      let Oe;
      var Te = e.sibling(se, 2), rt = e.child(Te);
      e.reset(Te), e.reset(be);
      var it = e.sibling(be, 2), We = e.sibling(e.child(it), 2);
      e.remove_input_defaults(We);
      let Sn;
      var ti = e.sibling(We, 2), Is = e.child(ti);
      e.reset(ti), e.reset(it), e.reset(P), e.template_effect(() => {
        e.set_value(j, e.get(u).h), j.disabled = r(), e.set_text(ne, `${e.get(u).h ?? ""}°`), e.set_value(se, e.get(u).s), se.disabled = r(), Oe = e.set_style(se, "", Oe, { "--track-bg": e.get(B) }), e.set_text(rt, `${e.get(u).s ?? ""}%`), e.set_value(We, e.get(u).v), We.disabled = r(), Sn = e.set_style(We, "", Sn, { "--track-bg": e.get($) }), e.set_text(Is, `${e.get(u).v ?? ""}%`);
      }), e.delegated("input", j, te), e.delegated("change", j, v), e.delegated("input", se, ie), e.delegated("change", se, v), e.delegated("input", We, X), e.delegated("change", We, v), e.append(k, P);
    }, xs = (k) => {
      var P = Js(), M = e.child(P), j = e.sibling(e.child(M), 2);
      e.remove_input_defaults(j);
      var ee = e.sibling(j, 2), ne = e.child(ee, !0);
      e.reset(ee), e.reset(M);
      var be = e.sibling(M, 2), se = e.sibling(e.child(be), 2);
      e.remove_input_defaults(se);
      var Oe = e.sibling(se, 2), Te = e.child(Oe, !0);
      e.reset(Oe), e.reset(be);
      var rt = e.sibling(be, 2), it = e.sibling(e.child(rt), 2);
      e.remove_input_defaults(it);
      var We = e.sibling(it, 2), Sn = e.child(We, !0);
      e.reset(We), e.reset(rt), e.reset(P), e.template_effect(() => {
        e.set_value(j, e.get(F).r), j.disabled = r(), e.set_text(ne, e.get(F).r), e.set_value(se, e.get(F).g), se.disabled = r(), e.set_text(Te, e.get(F).g), e.set_value(it, e.get(F).b), it.disabled = r(), e.set_text(Sn, e.get(F).b);
      }), e.delegated("input", j, fe), e.delegated("change", j, v), e.delegated("input", se, kt), e.delegated("change", se, v), e.delegated("input", it, Dt), e.delegated("change", it, v), e.append(k, P);
    };
    e.if(Yr, (k) => {
      e.get(d) === "hsv" ? k(ws) : k(xs, -1);
    });
  }
  var Xr = e.sibling(Yr, 2), Qr = e.child(Xr);
  let Jr;
  var Jt = e.sibling(Qr, 2);
  e.remove_input_defaults(Jt), e.reset(Xr), e.reset(V);
  var $r = e.sibling(V, 2), ei = e.child($r), $t = e.child(ei);
  e.each($t, 21, () => e.get(xe), (k) => k.id, (k, P) => {
    var M = $s(), j = e.child(M);
    e.reset(M);
    var ee = {};
    e.template_effect(() => {
      e.set_text(j, `${e.get(P).label ?? ""}${e.get(P).builtin ? "" : " (user)"}`), ee !== (ee = e.get(P).id) && (M.value = (M.__value = e.get(P).id) ?? "");
    }), e.append(k, M);
  }), e.reset($t);
  var $n = e.sibling($t, 2);
  e.each($n, 21, () => {
    var k;
    return ((k = e.get(he)) == null ? void 0 : k.colors) ?? [];
  }, e.index, (k, P) => {
    var M = el();
    let j, ee;
    e.template_effect(
      (ne, be, se) => {
        j = e.set_class(M, 1, "cp-swatch svelte-7v5dlc", null, j, ne), e.set_attribute(M, "title", be), e.set_attribute(M, "aria-label", se), M.disabled = r(), ee = e.set_style(M, "", ee, { "background-color": e.get(P) });
      },
      [
        () => ({
          active: e.get(P).toLowerCase() === e.get(ce).toLowerCase()
        }),
        () => e.get(P).toUpperCase(),
        () => e.get(P).toUpperCase()
      ]
    ), e.delegated("click", M, () => ye(e.get(P))), e.append(k, M);
  }), e.reset($n);
  var er = e.sibling($n, 2), tr = e.child(er), nr = e.sibling(tr, 2);
  e.reset(er);
  var Cs = e.sibling(er, 2);
  {
    var Ss = (k) => {
      var P = tl(), M = e.child(P);
      e.remove_input_defaults(M);
      var j = e.sibling(M, 2), ee = e.sibling(j, 2);
      e.reset(P), e.template_effect((ne) => j.disabled = ne, [() => !e.get(Ne).trim()]), e.delegated("keydown", M, (ne) => {
        ne.key === "Enter" && H(), ne.key === "Escape" && ae();
      }), e.bind_value(M, () => e.get(Ne), (ne) => e.set(Ne, ne)), e.delegated("click", j, H), e.delegated("click", ee, ae), e.append(k, P);
    };
    e.if(Cs, (k) => {
      e.get(et) && k(Ss);
    });
  }
  e.reset(ei), e.reset($r), e.reset(U), e.reset(z), e.template_effect(() => {
    var k, P;
    O = e.set_class(z, 1, "cp-surface svelte-7v5dlc", null, O, { disabled: r() }), e.set_attribute(ge, "aria-valuenow", e.get(u).v), e.set_attribute(ge, "tabindex", r() ? -1 : 0), e.set_attribute(Ze, "aria-valuenow", e.get(u).h), e.set_attribute(Ze, "tabindex", r() ? -1 : 0), tt.disabled = r(), Lt = e.set_class(tt, 1, "svelte-7v5dlc", null, Lt, { active: e.get(d) === "hsv" }), nt.disabled = r(), Kr = e.set_class(nt, 1, "svelte-7v5dlc", null, Kr, { active: e.get(d) === "rgb" }), Jr = e.set_style(Qr, "", Jr, { "background-color": e.get(ce) }), Jt.disabled = r(), $t.disabled = r(), tr.disabled = r(), nr.disabled = r() || (((k = e.get(he)) == null ? void 0 : k.builtin) ?? !0), e.set_attribute(nr, "title", (P = e.get(he)) != null && P.builtin ? "Built-in palettes cannot be deleted" : "Delete palette");
  }), e.delegated("keydown", z, S), e.delegated("mousedown", ge, q), e.delegated("mousedown", Ze, L), e.delegated("click", tt, () => Ge("hsv")), e.delegated("click", nt, () => Ge("rgb")), e.event("blur", Jt, wt), e.delegated("keydown", Jt, Mt), e.bind_value(Jt, () => e.get(Me), (k) => e.set(Me, k)), e.bind_select_value($t, () => e.get(Le), (k) => e.set(Le, k)), e.delegated("click", tr, T), e.delegated("click", nr, _), e.append(n, z), e.pop();
}
e.delegate(["keydown", "mousedown", "click", "input", "change"]);
var rl = e.from_html('<div class="cp-pick-title svelte-1n3y1cm"> </div>'), il = e.from_html("<!> <!>", 1);
function sl(n, t) {
  e.push(t, !0);
  let r = e.state(e.proxy(t.initial)), i = !1, s = !1, l = !1;
  function a(g) {
    l || (l = !0, t.onResolve(g));
  }
  function c(g) {
    g.key === "Escape" && (i = !0);
  }
  Yn(() => {
    document.addEventListener("keydown", c, !0);
  }), Ai(() => {
    document.removeEventListener("keydown", c, !0), a(ll({
      escapePressed: i,
      userTouched: s,
      currentValue: e.get(r)
    }));
  });
  function u(g) {
    s = !0, e.set(r, g, !0);
  }
  var o = il(), d = e.first_child(o);
  {
    var h = (g) => {
      var f = rl(), p = e.child(f, !0);
      e.reset(f), e.template_effect(() => e.set_text(p, t.title)), e.append(g, f);
    };
    e.if(d, (g) => {
      t.title && g(h);
    });
  }
  var v = e.sibling(d, 2);
  hr(v, {
    get value() {
      return e.get(r);
    },
    initialMode: "hsv",
    get userPalettes() {
      return t.userPalettes;
    },
    onChange: u,
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
function ll(n) {
  return n.escapePressed || !n.userTouched ? null : n.currentValue;
}
function al(n) {
  return n && /^#[0-9a-f]{6}$/i.test(n) ? n : "#000000";
}
function ol(n, t) {
  return new Promise((r) => {
    const i = n.anchor ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    Xt.popup.show(
      sl,
      { anchor: i },
      {
        initial: al(n.initial),
        title: n.title,
        userPalettes: t.userPalettes,
        onSaveUserPalette: t.onSaveUserPalette,
        onDeleteUserPalette: t.onDeleteUserPalette,
        onResolve: r
      }
    );
  });
}
const cl = "sh3-editor.color-panel";
function ul(n, t, r, i) {
  if (t) return { kind: "entry", entry: t };
  const s = r.find((l) => l.slotId === n);
  return s ? { kind: "descriptor", descriptor: s } : {
    kind: "adhoc",
    adHocValue: i == null ? void 0 : i.value,
    adHocReadonly: (i == null ? void 0 : i.readonly) ?? !1
  };
}
let Ei = /* @__PURE__ */ new Map();
function ii(n) {
  const t = [...n].sort((i, s) => {
    const l = i.priority ?? 10, a = s.priority ?? 10;
    return l !== a ? a - l : 0;
  }), r = /* @__PURE__ */ new Map();
  for (const i of t)
    r.has(i.type) || r.set(i.type, i);
  Ei = r;
}
function dl(n) {
  if (n === null || typeof n != "object") return !1;
  const t = Object.getPrototypeOf(n);
  return t === Object.prototype || t === null;
}
function si(n) {
  var t;
  return ((t = Ei.get(n)) == null ? void 0 : t.component) ?? null;
}
function fl(n, t) {
  if (t != null && t.type) {
    const r = si(t.type);
    if (r) return { kind: "custom", component: r };
  }
  if (n !== null && typeof n == "object" && typeof n.__type == "string") {
    const r = si(n.__type);
    if (r) return { kind: "custom", component: r };
  }
  return dl(n) || Array.isArray(n) ? { kind: "walker" } : { kind: "leaf" };
}
let zi = null;
function li(n) {
  zi = n;
}
function hl() {
  return zi;
}
const Di = "sh3-editor:help.tabs";
function Ee(n) {
  return n.ctrlKey || n.metaKey;
}
function gl(n, t, r, i, s = 2) {
  const l = " ".repeat(s);
  if (t === r && !i)
    return {
      content: n.slice(0, t) + l + n.slice(r),
      selectionStart: t + l.length,
      selectionEnd: t + l.length
    };
  const a = n.lastIndexOf(`
`, t - 1) + 1, c = n.slice(a, r).split(`
`);
  let u = t, o = r;
  const d = c.map((v, g) => {
    var f;
    if (i) {
      const p = ((f = v.match(new RegExp(`^ {1,${s}}`))) == null ? void 0 : f[0].length) ?? 0;
      return g === 0 && (u = Math.max(a, t - p)), o -= p, v.slice(p);
    } else
      return g === 0 && (u = t + l.length), o += l.length, l + v;
  });
  return { content: n.slice(0, a) + d.join(`
`) + n.slice(a + c.join(`
`).length), selectionStart: u, selectionEnd: o };
}
function pl(n, t, r, i, s = 2, l = "inline") {
  if (i === "none") return null;
  const a = n.lastIndexOf(`
`, t - 1) + 1, u = n.slice(a, t).match(/^[ \t]*/)[0], o = " ".repeat(s);
  if (i === "indent") {
    const p = `
` + u;
    return {
      content: n.slice(0, t) + p + n.slice(r),
      selectionStart: t + p.length,
      selectionEnd: t + p.length
    };
  }
  const d = t > 0 ? n[t - 1] : "", h = r < n.length ? n[r] : "", v = d === "{";
  if (v && h === "}") {
    if (l === "inline") {
      const x = `
` + u + o + `
` + u, I = t + 1 + u.length + o.length;
      return {
        content: n.slice(0, t) + x + n.slice(r),
        selectionStart: I,
        selectionEnd: I
      };
    }
    const p = n.slice(0, t - 1), y = n.slice(r), m = `
` + u + `{
` + u + o + `
` + u, b = p + m + y, w = p.length + (`
` + u + `{
` + u + o).length;
    return { content: b, selectionStart: w, selectionEnd: w };
  }
  if (v) {
    const p = `
` + u + o;
    return {
      content: n.slice(0, t) + p + n.slice(r),
      selectionStart: t + p.length,
      selectionEnd: t + p.length
    };
  }
  const f = `
` + u;
  return {
    content: n.slice(0, t) + f + n.slice(r),
    selectionStart: t + f.length,
    selectionEnd: t + f.length
  };
}
function vl(n, t, r, i = 2) {
  if (t !== r) return null;
  const s = n.lastIndexOf(`
`, t - 1) + 1, l = n.slice(s, t);
  if (!/^[ \t]*$/.test(l)) return null;
  let a = 0, c = -1;
  for (let h = s - 1; h >= 0; h--) {
    const v = n[h];
    if (v === "}") a++;
    else if (v === "{") {
      if (a === 0) {
        c = h;
        break;
      }
      a--;
    }
  }
  let u;
  if (c === -1) {
    const h = Math.max(0, l.length - i);
    u = l.slice(0, h);
  } else {
    const h = n.lastIndexOf(`
`, c - 1) + 1;
    u = n.slice(h, c).match(/^[ \t]*/)[0];
  }
  if (u.length >= l.length) return null;
  const o = n.slice(0, s) + u + "}" + n.slice(r), d = s + u.length + 1;
  return { content: o, selectionStart: d, selectionEnd: d };
}
var ml = e.from_html('<span class="toolbar-sep svelte-10sr5yt"></span>'), bl = e.from_html("<button><!> </button>"), _l = e.from_html("<!> <!>", 1), yl = e.from_html('<div class="toolbar-spacer svelte-10sr5yt"></div> <span class="toolbar-path svelte-10sr5yt"> </span>', 1), kl = e.from_html('<div class="toolbar svelte-10sr5yt"><!> <!></div>');
function Xn(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "filePath", 3, null), i = e.derived(() => {
    const c = [], u = /* @__PURE__ */ new Map();
    for (const o of t.actions) {
      const d = o.group ?? "_default";
      if (!u.has(d)) {
        const h = [];
        u.set(d, h), c.push({ key: d, items: h });
      }
      u.get(d).push(o);
    }
    return c;
  });
  var s = e.comment(), l = e.first_child(s);
  {
    var a = (c) => {
      var u = kl(), o = e.child(u);
      e.each(o, 17, () => e.get(i), e.index, (v, g, f) => {
        var p = _l(), y = e.first_child(p);
        {
          var m = (w) => {
            var x = ml();
            e.append(w, x);
          };
          e.if(y, (w) => {
            f > 0 && w(m);
          });
        }
        var b = e.sibling(y, 2);
        e.each(b, 17, () => e.get(g).items, (w) => w.id, (w, x) => {
          var I = bl();
          let A;
          var R = e.child(I);
          {
            var D = (L) => {
              var G = e.text();
              e.template_effect(() => e.set_text(G, e.get(x).icon)), e.append(L, G);
            };
            e.if(R, (L) => {
              e.get(x).icon && L(D);
            });
          }
          var q = e.sibling(R, 1, !0);
          e.reset(I), e.template_effect(() => {
            A = e.set_class(I, 1, "toolbar-btn svelte-10sr5yt", null, A, { "toolbar-accent": e.get(x).accent }), I.disabled = e.get(x).disabled, e.set_attribute(I, "title", e.get(x).shortcut ? `${e.get(x).label} (${e.get(x).shortcut})` : e.get(x).label), e.set_text(q, e.get(x).label);
          }), e.delegated("click", I, function(...L) {
            var G;
            (G = e.get(x).onAction) == null || G.apply(this, L);
          }), e.append(w, I);
        }), e.append(v, p);
      });
      var d = e.sibling(o, 2);
      {
        var h = (v) => {
          var g = yl(), f = e.sibling(e.first_child(g), 2), p = e.child(f, !0);
          e.reset(f), e.template_effect(
            (y) => {
              e.set_attribute(f, "title", r()), e.set_text(p, y);
            },
            [() => r().split(/[/\\]/).pop()]
          ), e.append(v, g);
        };
        e.if(d, (v) => {
          r() && v(h);
        });
      }
      e.reset(u), e.append(c, u);
    };
    e.if(l, (c) => {
      (t.actions.length > 0 || r()) && c(a);
    });
  }
  e.append(n, s), e.pop();
}
e.delegate(["click"]);
var wl = e.from_html('<div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Brace style</span> <div class="seg svelte-1etykqv"><button type="button">Inline</button> <button type="button">Allman</button></div></div>'), xl = e.from_html('<div class="body svelte-1etykqv"><h2 class="svelte-1etykqv">Editor settings</h2> <div class="rows svelte-1etykqv"><div class="row svelte-1etykqv"><span class="label svelte-1etykqv">Indent unit</span> <div class="seg svelte-1etykqv"><button type="button">2</button> <button type="button">4</button></div></div> <!></div> <div class="actions svelte-1etykqv"><button type="button" class="secondary svelte-1etykqv">Close</button></div></div>');
function Cl(n, t) {
  e.push(t, !0);
  let r = e.proxy({ ...t.prefs });
  function i(m) {
    r.indentUnit = m, t.onChange({ ...r });
  }
  function s(m) {
    r.braceStyle = m, t.onChange({ ...r });
  }
  var l = xl(), a = e.sibling(e.child(l), 2), c = e.child(a), u = e.sibling(e.child(c), 2), o = e.child(u);
  let d;
  var h = e.sibling(o, 2);
  let v;
  e.reset(u), e.reset(c);
  var g = e.sibling(c, 2);
  {
    var f = (m) => {
      var b = wl(), w = e.sibling(e.child(b), 2), x = e.child(w);
      let I;
      var A = e.sibling(x, 2);
      let R;
      e.reset(w), e.reset(b), e.template_effect(() => {
        I = e.set_class(x, 1, "svelte-1etykqv", null, I, { active: (r.braceStyle ?? "inline") === "inline" }), R = e.set_class(A, 1, "svelte-1etykqv", null, R, { active: (r.braceStyle ?? "inline") === "allman" });
      }), e.delegated("click", x, () => s("inline")), e.delegated("click", A, () => s("allman")), e.append(m, b);
    };
    e.if(g, (m) => {
      t.indentType === "brace" && m(f);
    });
  }
  e.reset(a);
  var p = e.sibling(a, 2), y = e.child(p);
  e.reset(p), e.reset(l), e.template_effect(() => {
    d = e.set_class(o, 1, "svelte-1etykqv", null, d, { active: (r.indentUnit ?? 2) === 2 }), v = e.set_class(h, 1, "svelte-1etykqv", null, v, { active: (r.indentUnit ?? 2) === 4 });
  }), e.delegated("click", o, () => i(2)), e.delegated("click", h, () => i(4)), e.delegated("click", y, function(...m) {
    var b;
    (b = t.close) == null || b.apply(this, m);
  }), e.append(n, l), e.pop();
}
e.delegate(["click"]);
function Sl(n) {
  if (!n || !(n instanceof Element)) return null;
  const t = n.closest("a[href]");
  if (!t) return null;
  const r = t.getAttribute("href");
  return r == null ? null : { anchor: t, href: r };
}
const Il = /^[a-z][a-z0-9+.\-]*:/i;
function Pl(n) {
  return n.startsWith("#") ? "anchor" : Il.test(n) ? "external" : "internal";
}
var Tl = e.from_html('<div class="preview-root svelte-1whghyg" role="document"></div>');
function Mi(n, t) {
  e.push(t, !0);
  let r = e.state(void 0);
  function i(l) {
    var d, h, v;
    const a = Sl(l.target);
    if (!a) return;
    l.preventDefault();
    const c = Pl(a.href), u = { href: a.href, kind: c, event: l, slotId: t.slotId };
    if (((d = t.onLinkClick) == null ? void 0 : d.call(t, u)) !== "handled") {
      if (c === "anchor") {
        const g = a.href.slice(1);
        if (!g) return;
        const f = (h = e.get(r)) == null ? void 0 : h.querySelector(`#${CSS.escape(g)}`);
        f && f.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (c === "external") {
        const g = (v = Xt) == null ? void 0 : v.openExternal;
        typeof g == "function" ? g(a.href) : window.open(a.href, "_blank", "noopener,noreferrer");
        return;
      }
    }
  }
  var s = Tl();
  e.html(s, () => t.html, !0), e.reset(s), e.bind_this(s, (l) => e.set(r, l), () => e.get(r)), e.delegated("click", s, i), e.append(n, s), e.pop();
}
e.delegate(["click"]);
function Rr() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var zt = Rr();
function Li(n) {
  zt = n;
}
var dn = { exec: () => null };
function W(n, t = "") {
  let r = typeof n == "string" ? n : n.source;
  const i = {
    replace: (s, l) => {
      let a = typeof l == "string" ? l : l.source;
      return a = a.replace(ke.caret, "$1"), r = r.replace(s, a), i;
    },
    getRegex: () => new RegExp(r, t)
  };
  return i;
}
var ke = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}#`),
  htmlBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)`, "i")
}, Rl = /^(?:[ \t]*(?:\n|$))+/, Al = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, El = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, kn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, zl = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ar = /(?:[*+-]|\d{1,9}[.)])/, Ni = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Oi = W(Ni).replace(/bull/g, Ar).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Dl = W(Ni).replace(/bull/g, Ar).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Er = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ml = /^[^\n]+/, zr = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Ll = W(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", zr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Nl = W(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ar).getRegex(), Qn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Dr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ol = W(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Dr).replace("tag", Qn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Bi = W(Er).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Qn).getRegex(), Bl = W(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Bi).getRegex(), Mr = {
  blockquote: Bl,
  code: Al,
  def: Ll,
  fences: El,
  heading: zl,
  hr: kn,
  html: Ol,
  lheading: Oi,
  list: Nl,
  newline: Rl,
  paragraph: Bi,
  table: dn,
  text: Ml
}, ai = W(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Qn).getRegex(), Hl = {
  ...Mr,
  lheading: Dl,
  table: ai,
  paragraph: W(Er).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ai).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Qn).getRegex()
}, ql = {
  ...Mr,
  html: W(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Dr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: dn,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: W(Er).replace("hr", kn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Oi).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Ul = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Vl = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Hi = /^( {2,}|\\)\n(?!\s*$)/, Fl = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Jn = /[\p{P}\p{S}]/u, Lr = /[\s\p{P}\p{S}]/u, qi = /[^\s\p{P}\p{S}]/u, jl = W(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Lr).getRegex(), Ui = /(?!~)[\p{P}\p{S}]/u, Gl = /(?!~)[\s\p{P}\p{S}]/u, Zl = /(?:[^\s\p{P}\p{S}]|~)/u, Wl = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Vi = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Kl = W(Vi, "u").replace(/punct/g, Jn).getRegex(), Yl = W(Vi, "u").replace(/punct/g, Ui).getRegex(), Fi = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Xl = W(Fi, "gu").replace(/notPunctSpace/g, qi).replace(/punctSpace/g, Lr).replace(/punct/g, Jn).getRegex(), Ql = W(Fi, "gu").replace(/notPunctSpace/g, Zl).replace(/punctSpace/g, Gl).replace(/punct/g, Ui).getRegex(), Jl = W(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, qi).replace(/punctSpace/g, Lr).replace(/punct/g, Jn).getRegex(), $l = W(/\\(punct)/, "gu").replace(/punct/g, Jn).getRegex(), ea = W(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ta = W(Dr).replace("(?:-->|$)", "-->").getRegex(), na = W(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", ta).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), On = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, ra = W(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", On).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ji = W(/^!?\[(label)\]\[(ref)\]/).replace("label", On).replace("ref", zr).getRegex(), Gi = W(/^!?\[(ref)\](?:\[\])?/).replace("ref", zr).getRegex(), ia = W("reflink|nolink(?!\\()", "g").replace("reflink", ji).replace("nolink", Gi).getRegex(), Nr = {
  _backpedal: dn,
  // only used for GFM url
  anyPunctuation: $l,
  autolink: ea,
  blockSkip: Wl,
  br: Hi,
  code: Vl,
  del: dn,
  emStrongLDelim: Kl,
  emStrongRDelimAst: Xl,
  emStrongRDelimUnd: Jl,
  escape: Ul,
  link: ra,
  nolink: Gi,
  punctuation: jl,
  reflink: ji,
  reflinkSearch: ia,
  tag: na,
  text: Fl,
  url: dn
}, sa = {
  ...Nr,
  link: W(/^!?\[(label)\]\((.*?)\)/).replace("label", On).getRegex(),
  reflink: W(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", On).getRegex()
}, gr = {
  ...Nr,
  emStrongRDelimAst: Ql,
  emStrongLDelim: Yl,
  url: W(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, la = {
  ...gr,
  br: W(Hi).replace("{2,}", "*").getRegex(),
  text: W(gr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, In = {
  normal: Mr,
  gfm: Hl,
  pedantic: ql
}, tn = {
  normal: Nr,
  gfm: gr,
  breaks: la,
  pedantic: sa
}, aa = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, oi = (n) => aa[n];
function Ke(n, t) {
  if (t) {
    if (ke.escapeTest.test(n))
      return n.replace(ke.escapeReplace, oi);
  } else if (ke.escapeTestNoEncode.test(n))
    return n.replace(ke.escapeReplaceNoEncode, oi);
  return n;
}
function ci(n) {
  try {
    n = encodeURI(n).replace(ke.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function ui(n, t) {
  var l;
  const r = n.replace(ke.findPipe, (a, c, u) => {
    let o = !1, d = c;
    for (; --d >= 0 && u[d] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = r.split(ke.splitPipe);
  let s = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !((l = i.at(-1)) != null && l.trim()) && i.pop(), t)
    if (i.length > t)
      i.splice(t);
    else
      for (; i.length < t; ) i.push("");
  for (; s < i.length; s++)
    i[s] = i[s].trim().replace(ke.slashPipe, "|");
  return i;
}
function nn(n, t, r) {
  const i = n.length;
  if (i === 0)
    return "";
  let s = 0;
  for (; s < i && n.charAt(i - s - 1) === t; )
    s++;
  return n.slice(0, i - s);
}
function oa(n, t) {
  if (n.indexOf(t[1]) === -1)
    return -1;
  let r = 0;
  for (let i = 0; i < n.length; i++)
    if (n[i] === "\\")
      i++;
    else if (n[i] === t[0])
      r++;
    else if (n[i] === t[1] && (r--, r < 0))
      return i;
  return r > 0 ? -2 : -1;
}
function di(n, t, r, i, s) {
  const l = t.href, a = t.title || null, c = n[1].replace(s.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  const u = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: r,
    href: l,
    title: a,
    text: c,
    tokens: i.inlineTokens(c)
  };
  return i.state.inLink = !1, u;
}
function ca(n, t, r) {
  const i = n.match(r.other.indentCodeCompensation);
  if (i === null)
    return t;
  const s = i[1];
  return t.split(`
`).map((l) => {
    const a = l.match(r.other.beginningSpace);
    if (a === null)
      return l;
    const [c] = a;
    return c.length >= s.length ? l.slice(s.length) : l;
  }).join(`
`);
}
var Bn = class {
  // set by the lexer
  constructor(n) {
    N(this, "options");
    N(this, "rules");
    // set by the lexer
    N(this, "lexer");
    this.options = n || zt;
  }
  space(n) {
    const t = this.rules.block.newline.exec(n);
    if (t && t[0].length > 0)
      return {
        type: "space",
        raw: t[0]
      };
  }
  code(n) {
    const t = this.rules.block.code.exec(n);
    if (t) {
      const r = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: t[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? r : nn(r, `
`)
      };
    }
  }
  fences(n) {
    const t = this.rules.block.fences.exec(n);
    if (t) {
      const r = t[0], i = ca(r, t[3] || "", this.rules);
      return {
        type: "code",
        raw: r,
        lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
        text: i
      };
    }
  }
  heading(n) {
    const t = this.rules.block.heading.exec(n);
    if (t) {
      let r = t[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        const i = nn(r, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (r = i.trim());
      }
      return {
        type: "heading",
        raw: t[0],
        depth: t[1].length,
        text: r,
        tokens: this.lexer.inline(r)
      };
    }
  }
  hr(n) {
    const t = this.rules.block.hr.exec(n);
    if (t)
      return {
        type: "hr",
        raw: nn(t[0], `
`)
      };
  }
  blockquote(n) {
    const t = this.rules.block.blockquote.exec(n);
    if (t) {
      let r = nn(t[0], `
`).split(`
`), i = "", s = "";
      const l = [];
      for (; r.length > 0; ) {
        let a = !1;
        const c = [];
        let u;
        for (u = 0; u < r.length; u++)
          if (this.rules.other.blockquoteStart.test(r[u]))
            c.push(r[u]), a = !0;
          else if (!a)
            c.push(r[u]);
          else
            break;
        r = r.slice(u);
        const o = c.join(`
`), d = o.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${o}` : o, s = s ? `${s}
${d}` : d;
        const h = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(d, l, !0), this.lexer.state.top = h, r.length === 0)
          break;
        const v = l.at(-1);
        if ((v == null ? void 0 : v.type) === "code")
          break;
        if ((v == null ? void 0 : v.type) === "blockquote") {
          const g = v, f = g.raw + `
` + r.join(`
`), p = this.blockquote(f);
          l[l.length - 1] = p, i = i.substring(0, i.length - g.raw.length) + p.raw, s = s.substring(0, s.length - g.text.length) + p.text;
          break;
        } else if ((v == null ? void 0 : v.type) === "list") {
          const g = v, f = g.raw + `
` + r.join(`
`), p = this.list(f);
          l[l.length - 1] = p, i = i.substring(0, i.length - v.raw.length) + p.raw, s = s.substring(0, s.length - g.raw.length) + p.raw, r = f.substring(l.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: i,
        tokens: l,
        text: s
      };
    }
  }
  list(n) {
    let t = this.rules.block.list.exec(n);
    if (t) {
      let r = t[1].trim();
      const i = r.length > 1, s = {
        type: "list",
        raw: "",
        ordered: i,
        start: i ? +r.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      r = i ? `\\d{1,9}\\${r.slice(-1)}` : `\\${r}`, this.options.pedantic && (r = i ? r : "[*+-]");
      const l = this.rules.other.listItemRegex(r);
      let a = !1;
      for (; n; ) {
        let u = !1, o = "", d = "";
        if (!(t = l.exec(n)) || this.rules.block.hr.test(n))
          break;
        o = t[0], n = n.substring(o.length);
        let h = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (m) => " ".repeat(3 * m.length)), v = n.split(`
`, 1)[0], g = !h.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, d = h.trimStart()) : g ? f = t[1].length + 1 : (f = t[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, d = h.slice(f), f += t[1].length), g && this.rules.other.blankLine.test(v) && (o += v + `
`, n = n.substring(v.length + 1), u = !0), !u) {
          const m = this.rules.other.nextBulletRegex(f), b = this.rules.other.hrRegex(f), w = this.rules.other.fencesBeginRegex(f), x = this.rules.other.headingBeginRegex(f), I = this.rules.other.htmlBeginRegex(f);
          for (; n; ) {
            const A = n.split(`
`, 1)[0];
            let R;
            if (v = A, this.options.pedantic ? (v = v.replace(this.rules.other.listReplaceNesting, "  "), R = v) : R = v.replace(this.rules.other.tabCharGlobal, "    "), w.test(v) || x.test(v) || I.test(v) || m.test(v) || b.test(v))
              break;
            if (R.search(this.rules.other.nonSpaceChar) >= f || !v.trim())
              d += `
` + R.slice(f);
            else {
              if (g || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || w.test(h) || x.test(h) || b.test(h))
                break;
              d += `
` + v;
            }
            !g && !v.trim() && (g = !0), o += A + `
`, n = n.substring(A.length + 1), h = R.slice(f);
          }
        }
        s.loose || (a ? s.loose = !0 : this.rules.other.doubleBlankLine.test(o) && (a = !0));
        let p = null, y;
        this.options.gfm && (p = this.rules.other.listIsTask.exec(d), p && (y = p[0] !== "[ ] ", d = d.replace(this.rules.other.listReplaceTask, ""))), s.items.push({
          type: "list_item",
          raw: o,
          task: !!p,
          checked: y,
          loose: !1,
          text: d,
          tokens: []
        }), s.raw += o;
      }
      const c = s.items.at(-1);
      if (c)
        c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else
        return;
      s.raw = s.raw.trimEnd();
      for (let u = 0; u < s.items.length; u++)
        if (this.lexer.state.top = !1, s.items[u].tokens = this.lexer.blockTokens(s.items[u].text, []), !s.loose) {
          const o = s.items[u].tokens.filter((h) => h.type === "space"), d = o.length > 0 && o.some((h) => this.rules.other.anyLine.test(h.raw));
          s.loose = d;
        }
      if (s.loose)
        for (let u = 0; u < s.items.length; u++)
          s.items[u].loose = !0;
      return s;
    }
  }
  html(n) {
    const t = this.rules.block.html.exec(n);
    if (t)
      return {
        type: "html",
        block: !0,
        raw: t[0],
        pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
        text: t[0]
      };
  }
  def(n) {
    const t = this.rules.block.def.exec(n);
    if (t) {
      const r = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return {
        type: "def",
        tag: r,
        raw: t[0],
        href: i,
        title: s
      };
    }
  }
  table(n) {
    var a;
    const t = this.rules.block.table.exec(n);
    if (!t || !this.rules.other.tableDelimiter.test(t[2]))
      return;
    const r = ui(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (a = t[3]) != null && a.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = {
      type: "table",
      raw: t[0],
      header: [],
      align: [],
      rows: []
    };
    if (r.length === i.length) {
      for (const c of i)
        this.rules.other.tableAlignRight.test(c) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(c) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(c) ? l.align.push("left") : l.align.push(null);
      for (let c = 0; c < r.length; c++)
        l.header.push({
          text: r[c],
          tokens: this.lexer.inline(r[c]),
          header: !0,
          align: l.align[c]
        });
      for (const c of s)
        l.rows.push(ui(c, l.header.length).map((u, o) => ({
          text: u,
          tokens: this.lexer.inline(u),
          header: !1,
          align: l.align[o]
        })));
      return l;
    }
  }
  lheading(n) {
    const t = this.rules.block.lheading.exec(n);
    if (t)
      return {
        type: "heading",
        raw: t[0],
        depth: t[2].charAt(0) === "=" ? 1 : 2,
        text: t[1],
        tokens: this.lexer.inline(t[1])
      };
  }
  paragraph(n) {
    const t = this.rules.block.paragraph.exec(n);
    if (t) {
      const r = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return {
        type: "paragraph",
        raw: t[0],
        text: r,
        tokens: this.lexer.inline(r)
      };
    }
  }
  text(n) {
    const t = this.rules.block.text.exec(n);
    if (t)
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        tokens: this.lexer.inline(t[0])
      };
  }
  escape(n) {
    const t = this.rules.inline.escape.exec(n);
    if (t)
      return {
        type: "escape",
        raw: t[0],
        text: t[1]
      };
  }
  tag(n) {
    const t = this.rules.inline.tag.exec(n);
    if (t)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: t[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: t[0]
      };
  }
  link(n) {
    const t = this.rules.inline.link.exec(n);
    if (t) {
      const r = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r))
          return;
        const l = nn(r.slice(0, -1), "\\");
        if ((r.length - l.length) % 2 === 0)
          return;
      } else {
        const l = oa(t[2], "()");
        if (l === -2)
          return;
        if (l > -1) {
          const c = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + l;
          t[2] = t[2].substring(0, l), t[0] = t[0].substring(0, c).trim(), t[3] = "";
        }
      }
      let i = t[2], s = "";
      if (this.options.pedantic) {
        const l = this.rules.other.pedanticHrefTitle.exec(i);
        l && (i = l[1], s = l[3]);
      } else
        s = t[3] ? t[3].slice(1, -1) : "";
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), di(t, {
        href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
        title: s && s.replace(this.rules.inline.anyPunctuation, "$1")
      }, t[0], this.lexer, this.rules);
    }
  }
  reflink(n, t) {
    let r;
    if ((r = this.rules.inline.reflink.exec(n)) || (r = this.rules.inline.nolink.exec(n))) {
      const i = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = t[i.toLowerCase()];
      if (!s) {
        const l = r[0].charAt(0);
        return {
          type: "text",
          raw: l,
          text: l
        };
      }
      return di(r, s, r[0], this.lexer, this.rules);
    }
  }
  emStrong(n, t, r = "") {
    let i = this.rules.inline.emStrongLDelim.exec(n);
    if (!i || i[3] && r.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(i[1] || i[2] || "") || !r || this.rules.inline.punctuation.exec(r)) {
      const l = [...i[0]].length - 1;
      let a, c, u = l, o = 0;
      const d = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (d.lastIndex = 0, t = t.slice(-1 * n.length + l); (i = d.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a) continue;
        if (c = [...a].length, i[3] || i[4]) {
          u += c;
          continue;
        } else if ((i[5] || i[6]) && l % 3 && !((l + c) % 3)) {
          o += c;
          continue;
        }
        if (u -= c, u > 0) continue;
        c = Math.min(c, c + u + o);
        const h = [...i[0]][0].length, v = n.slice(0, l + i.index + h + c);
        if (Math.min(l, c) % 2) {
          const f = v.slice(1, -1);
          return {
            type: "em",
            raw: v,
            text: f,
            tokens: this.lexer.inlineTokens(f)
          };
        }
        const g = v.slice(2, -2);
        return {
          type: "strong",
          raw: v,
          text: g,
          tokens: this.lexer.inlineTokens(g)
        };
      }
    }
  }
  codespan(n) {
    const t = this.rules.inline.code.exec(n);
    if (t) {
      let r = t[2].replace(this.rules.other.newLineCharGlobal, " ");
      const i = this.rules.other.nonSpaceChar.test(r), s = this.rules.other.startingSpaceChar.test(r) && this.rules.other.endingSpaceChar.test(r);
      return i && s && (r = r.substring(1, r.length - 1)), {
        type: "codespan",
        raw: t[0],
        text: r
      };
    }
  }
  br(n) {
    const t = this.rules.inline.br.exec(n);
    if (t)
      return {
        type: "br",
        raw: t[0]
      };
  }
  del(n) {
    const t = this.rules.inline.del.exec(n);
    if (t)
      return {
        type: "del",
        raw: t[0],
        text: t[2],
        tokens: this.lexer.inlineTokens(t[2])
      };
  }
  autolink(n) {
    const t = this.rules.inline.autolink.exec(n);
    if (t) {
      let r, i;
      return t[2] === "@" ? (r = t[1], i = "mailto:" + r) : (r = t[1], i = r), {
        type: "link",
        raw: t[0],
        text: r,
        href: i,
        tokens: [
          {
            type: "text",
            raw: r,
            text: r
          }
        ]
      };
    }
  }
  url(n) {
    var r;
    let t;
    if (t = this.rules.inline.url.exec(n)) {
      let i, s;
      if (t[2] === "@")
        i = t[0], s = "mailto:" + i;
      else {
        let l;
        do
          l = t[0], t[0] = ((r = this.rules.inline._backpedal.exec(t[0])) == null ? void 0 : r[0]) ?? "";
        while (l !== t[0]);
        i = t[0], t[1] === "www." ? s = "http://" + t[0] : s = t[0];
      }
      return {
        type: "link",
        raw: t[0],
        text: i,
        href: s,
        tokens: [
          {
            type: "text",
            raw: i,
            text: i
          }
        ]
      };
    }
  }
  inlineText(n) {
    const t = this.rules.inline.text.exec(n);
    if (t) {
      const r = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        escaped: r
      };
    }
  }
}, ut = class pr {
  constructor(t) {
    N(this, "tokens");
    N(this, "options");
    N(this, "state");
    N(this, "tokenizer");
    N(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || zt, this.options.tokenizer = this.options.tokenizer || new Bn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const r = {
      other: ke,
      block: In.normal,
      inline: tn.normal
    };
    this.options.pedantic ? (r.block = In.pedantic, r.inline = tn.pedantic) : this.options.gfm && (r.block = In.gfm, this.options.breaks ? r.inline = tn.breaks : r.inline = tn.gfm), this.tokenizer.rules = r;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: In,
      inline: tn
    };
  }
  /**
   * Static Lex Method
   */
  static lex(t, r) {
    return new pr(r).lex(t);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(t, r) {
    return new pr(r).inlineTokens(t);
  }
  /**
   * Preprocessing
   */
  lex(t) {
    t = t.replace(ke.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      const i = this.inlineQueue[r];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, r = [], i = !1) {
    var s, l, a;
    for (this.options.pedantic && (t = t.replace(ke.tabCharGlobal, "    ").replace(ke.spaceLine, "")); t; ) {
      let c;
      if ((l = (s = this.options.extensions) == null ? void 0 : s.block) != null && l.some((o) => (c = o.call({ lexer: this }, t, r)) ? (t = t.substring(c.raw.length), r.push(c), !0) : !1))
        continue;
      if (c = this.tokenizer.space(t)) {
        t = t.substring(c.raw.length);
        const o = r.at(-1);
        c.raw.length === 1 && o !== void 0 ? o.raw += `
` : r.push(c);
        continue;
      }
      if (c = this.tokenizer.code(t)) {
        t = t.substring(c.raw.length);
        const o = r.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += `
` + c.raw, o.text += `
` + c.text, this.inlineQueue.at(-1).src = o.text) : r.push(c);
        continue;
      }
      if (c = this.tokenizer.fences(t)) {
        t = t.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.heading(t)) {
        t = t.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.hr(t)) {
        t = t.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.blockquote(t)) {
        t = t.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.list(t)) {
        t = t.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.html(t)) {
        t = t.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.def(t)) {
        t = t.substring(c.raw.length);
        const o = r.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += `
` + c.raw, o.text += `
` + c.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[c.tag] || (this.tokens.links[c.tag] = {
          href: c.href,
          title: c.title
        });
        continue;
      }
      if (c = this.tokenizer.table(t)) {
        t = t.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.lheading(t)) {
        t = t.substring(c.raw.length), r.push(c);
        continue;
      }
      let u = t;
      if ((a = this.options.extensions) != null && a.startBlock) {
        let o = 1 / 0;
        const d = t.slice(1);
        let h;
        this.options.extensions.startBlock.forEach((v) => {
          h = v.call({ lexer: this }, d), typeof h == "number" && h >= 0 && (o = Math.min(o, h));
        }), o < 1 / 0 && o >= 0 && (u = t.substring(0, o + 1));
      }
      if (this.state.top && (c = this.tokenizer.paragraph(u))) {
        const o = r.at(-1);
        i && (o == null ? void 0 : o.type) === "paragraph" ? (o.raw += `
` + c.raw, o.text += `
` + c.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : r.push(c), i = u.length !== t.length, t = t.substring(c.raw.length);
        continue;
      }
      if (c = this.tokenizer.text(t)) {
        t = t.substring(c.raw.length);
        const o = r.at(-1);
        (o == null ? void 0 : o.type) === "text" ? (o.raw += `
` + c.raw, o.text += `
` + c.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : r.push(c);
        continue;
      }
      if (t) {
        const o = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(o);
          break;
        } else
          throw new Error(o);
      }
    }
    return this.state.top = !0, r;
  }
  inline(t, r = []) {
    return this.inlineQueue.push({ src: t, tokens: r }), r;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(t, r = []) {
    var c, u, o;
    let i = t, s = null;
    if (this.tokens.links) {
      const d = Object.keys(this.tokens.links);
      if (d.length > 0)
        for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; )
          d.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; )
      i = i.slice(0, s.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; )
      i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let l = !1, a = "";
    for (; t; ) {
      l || (a = ""), l = !1;
      let d;
      if ((u = (c = this.options.extensions) == null ? void 0 : c.inline) != null && u.some((v) => (d = v.call({ lexer: this }, t, r)) ? (t = t.substring(d.raw.length), r.push(d), !0) : !1))
        continue;
      if (d = this.tokenizer.escape(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.tag(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.link(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(d.raw.length);
        const v = r.at(-1);
        d.type === "text" && (v == null ? void 0 : v.type) === "text" ? (v.raw += d.raw, v.text += d.text) : r.push(d);
        continue;
      }
      if (d = this.tokenizer.emStrong(t, i, a)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.codespan(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.br(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.del(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.autolink(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (!this.state.inLink && (d = this.tokenizer.url(t))) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      let h = t;
      if ((o = this.options.extensions) != null && o.startInline) {
        let v = 1 / 0;
        const g = t.slice(1);
        let f;
        this.options.extensions.startInline.forEach((p) => {
          f = p.call({ lexer: this }, g), typeof f == "number" && f >= 0 && (v = Math.min(v, f));
        }), v < 1 / 0 && v >= 0 && (h = t.substring(0, v + 1));
      }
      if (d = this.tokenizer.inlineText(h)) {
        t = t.substring(d.raw.length), d.raw.slice(-1) !== "_" && (a = d.raw.slice(-1)), l = !0;
        const v = r.at(-1);
        (v == null ? void 0 : v.type) === "text" ? (v.raw += d.raw, v.text += d.text) : r.push(d);
        continue;
      }
      if (t) {
        const v = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(v);
          break;
        } else
          throw new Error(v);
      }
    }
    return r;
  }
}, Hn = class {
  // set by the parser
  constructor(n) {
    N(this, "options");
    N(this, "parser");
    this.options = n || zt;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: t, escaped: r }) {
    var l;
    const i = (l = (t || "").match(ke.notSpaceStart)) == null ? void 0 : l[0], s = n.replace(ke.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + Ke(i) + '">' + (r ? s : Ke(s, !0)) + `</code></pre>
` : "<pre><code>" + (r ? s : Ke(s, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: n }) {
    return `<blockquote>
${this.parser.parse(n)}</blockquote>
`;
  }
  html({ text: n }) {
    return n;
  }
  heading({ tokens: n, depth: t }) {
    return `<h${t}>${this.parser.parseInline(n)}</h${t}>
`;
  }
  hr(n) {
    return `<hr>
`;
  }
  list(n) {
    const t = n.ordered, r = n.start;
    let i = "";
    for (let a = 0; a < n.items.length; a++) {
      const c = n.items[a];
      i += this.listitem(c);
    }
    const s = t ? "ol" : "ul", l = t && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + s + l + `>
` + i + "</" + s + `>
`;
  }
  listitem(n) {
    var r;
    let t = "";
    if (n.task) {
      const i = this.checkbox({ checked: !!n.checked });
      n.loose ? ((r = n.tokens[0]) == null ? void 0 : r.type) === "paragraph" ? (n.tokens[0].text = i + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = i + " " + Ke(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
        type: "text",
        raw: i + " ",
        text: i + " ",
        escaped: !0
      }) : t += i + " ";
    }
    return t += this.parser.parse(n.tokens, !!n.loose), `<li>${t}</li>
`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: n }) {
    return `<p>${this.parser.parseInline(n)}</p>
`;
  }
  table(n) {
    let t = "", r = "";
    for (let s = 0; s < n.header.length; s++)
      r += this.tablecell(n.header[s]);
    t += this.tablerow({ text: r });
    let i = "";
    for (let s = 0; s < n.rows.length; s++) {
      const l = n.rows[s];
      r = "";
      for (let a = 0; a < l.length; a++)
        r += this.tablecell(l[a]);
      i += this.tablerow({ text: r });
    }
    return i && (i = `<tbody>${i}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + i + `</table>
`;
  }
  tablerow({ text: n }) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n) {
    const t = this.parser.parseInline(n.tokens), r = n.header ? "th" : "td";
    return (n.align ? `<${r} align="${n.align}">` : `<${r}>`) + t + `</${r}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: n }) {
    return `<strong>${this.parser.parseInline(n)}</strong>`;
  }
  em({ tokens: n }) {
    return `<em>${this.parser.parseInline(n)}</em>`;
  }
  codespan({ text: n }) {
    return `<code>${Ke(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: t, tokens: r }) {
    const i = this.parser.parseInline(r), s = ci(n);
    if (s === null)
      return i;
    n = s;
    let l = '<a href="' + n + '"';
    return t && (l += ' title="' + Ke(t) + '"'), l += ">" + i + "</a>", l;
  }
  image({ href: n, title: t, text: r, tokens: i }) {
    i && (r = this.parser.parseInline(i, this.parser.textRenderer));
    const s = ci(n);
    if (s === null)
      return Ke(r);
    n = s;
    let l = `<img src="${n}" alt="${r}"`;
    return t && (l += ` title="${Ke(t)}"`), l += ">", l;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : Ke(n.text);
  }
}, Or = class {
  // no need for block level renderers
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
}, dt = class vr {
  constructor(t) {
    N(this, "options");
    N(this, "renderer");
    N(this, "textRenderer");
    this.options = t || zt, this.options.renderer = this.options.renderer || new Hn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Or();
  }
  /**
   * Static Parse Method
   */
  static parse(t, r) {
    return new vr(r).parse(t);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(t, r) {
    return new vr(r).parseInline(t);
  }
  /**
   * Parse Loop
   */
  parse(t, r = !0) {
    var s, l;
    let i = "";
    for (let a = 0; a < t.length; a++) {
      const c = t[a];
      if ((l = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && l[c.type]) {
        const o = c, d = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (d !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(o.type)) {
          i += d || "";
          continue;
        }
      }
      const u = c;
      switch (u.type) {
        case "space": {
          i += this.renderer.space(u);
          continue;
        }
        case "hr": {
          i += this.renderer.hr(u);
          continue;
        }
        case "heading": {
          i += this.renderer.heading(u);
          continue;
        }
        case "code": {
          i += this.renderer.code(u);
          continue;
        }
        case "table": {
          i += this.renderer.table(u);
          continue;
        }
        case "blockquote": {
          i += this.renderer.blockquote(u);
          continue;
        }
        case "list": {
          i += this.renderer.list(u);
          continue;
        }
        case "html": {
          i += this.renderer.html(u);
          continue;
        }
        case "paragraph": {
          i += this.renderer.paragraph(u);
          continue;
        }
        case "text": {
          let o = u, d = this.renderer.text(o);
          for (; a + 1 < t.length && t[a + 1].type === "text"; )
            o = t[++a], d += `
` + this.renderer.text(o);
          r ? i += this.renderer.paragraph({
            type: "paragraph",
            raw: d,
            text: d,
            tokens: [{ type: "text", raw: d, text: d, escaped: !0 }]
          }) : i += d;
          continue;
        }
        default: {
          const o = 'Token with "' + u.type + '" type was not found.';
          if (this.options.silent)
            return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return i;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(t, r = this.renderer) {
    var s, l;
    let i = "";
    for (let a = 0; a < t.length; a++) {
      const c = t[a];
      if ((l = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && l[c.type]) {
        const o = this.options.extensions.renderers[c.type].call({ parser: this }, c);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(c.type)) {
          i += o || "";
          continue;
        }
      }
      const u = c;
      switch (u.type) {
        case "escape": {
          i += r.text(u);
          break;
        }
        case "html": {
          i += r.html(u);
          break;
        }
        case "link": {
          i += r.link(u);
          break;
        }
        case "image": {
          i += r.image(u);
          break;
        }
        case "strong": {
          i += r.strong(u);
          break;
        }
        case "em": {
          i += r.em(u);
          break;
        }
        case "codespan": {
          i += r.codespan(u);
          break;
        }
        case "br": {
          i += r.br(u);
          break;
        }
        case "del": {
          i += r.del(u);
          break;
        }
        case "text": {
          i += r.text(u);
          break;
        }
        default: {
          const o = 'Token with "' + u.type + '" type was not found.';
          if (this.options.silent)
            return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return i;
  }
}, fr, Tn = (fr = class {
  constructor(n) {
    N(this, "options");
    N(this, "block");
    this.options = n || zt;
  }
  /**
   * Process markdown before marked
   */
  preprocess(n) {
    return n;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(n) {
    return n;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(n) {
    return n;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? ut.lex : ut.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? dt.parse : dt.parseInline;
  }
}, N(fr, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), fr), Zi = class {
  constructor(...n) {
    N(this, "defaults", Rr());
    N(this, "options", this.setOptions);
    N(this, "parse", this.parseMarkdown(!0));
    N(this, "parseInline", this.parseMarkdown(!1));
    N(this, "Parser", dt);
    N(this, "Renderer", Hn);
    N(this, "TextRenderer", Or);
    N(this, "Lexer", ut);
    N(this, "Tokenizer", Bn);
    N(this, "Hooks", Tn);
    this.use(...n);
  }
  /**
   * Run callback for every token
   */
  walkTokens(n, t) {
    var i, s;
    let r = [];
    for (const l of n)
      switch (r = r.concat(t.call(this, l)), l.type) {
        case "table": {
          const a = l;
          for (const c of a.header)
            r = r.concat(this.walkTokens(c.tokens, t));
          for (const c of a.rows)
            for (const u of c)
              r = r.concat(this.walkTokens(u.tokens, t));
          break;
        }
        case "list": {
          const a = l;
          r = r.concat(this.walkTokens(a.items, t));
          break;
        }
        default: {
          const a = l;
          (s = (i = this.defaults.extensions) == null ? void 0 : i.childTokens) != null && s[a.type] ? this.defaults.extensions.childTokens[a.type].forEach((c) => {
            const u = a[c].flat(1 / 0);
            r = r.concat(this.walkTokens(u, t));
          }) : a.tokens && (r = r.concat(this.walkTokens(a.tokens, t)));
        }
      }
    return r;
  }
  use(...n) {
    const t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((r) => {
      const i = { ...r };
      if (i.async = this.defaults.async || i.async || !1, r.extensions && (r.extensions.forEach((s) => {
        if (!s.name)
          throw new Error("extension name required");
        if ("renderer" in s) {
          const l = t.renderers[s.name];
          l ? t.renderers[s.name] = function(...a) {
            let c = s.renderer.apply(this, a);
            return c === !1 && (c = l.apply(this, a)), c;
          } : t.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const l = t[s.level];
          l ? l.unshift(s.tokenizer) : t[s.level] = [s.tokenizer], s.start && (s.level === "block" ? t.startBlock ? t.startBlock.push(s.start) : t.startBlock = [s.start] : s.level === "inline" && (t.startInline ? t.startInline.push(s.start) : t.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (t.childTokens[s.name] = s.childTokens);
      }), i.extensions = t), r.renderer) {
        const s = this.defaults.renderer || new Hn(this.defaults);
        for (const l in r.renderer) {
          if (!(l in s))
            throw new Error(`renderer '${l}' does not exist`);
          if (["options", "parser"].includes(l))
            continue;
          const a = l, c = r.renderer[a], u = s[a];
          s[a] = (...o) => {
            let d = c.apply(s, o);
            return d === !1 && (d = u.apply(s, o)), d || "";
          };
        }
        i.renderer = s;
      }
      if (r.tokenizer) {
        const s = this.defaults.tokenizer || new Bn(this.defaults);
        for (const l in r.tokenizer) {
          if (!(l in s))
            throw new Error(`tokenizer '${l}' does not exist`);
          if (["options", "rules", "lexer"].includes(l))
            continue;
          const a = l, c = r.tokenizer[a], u = s[a];
          s[a] = (...o) => {
            let d = c.apply(s, o);
            return d === !1 && (d = u.apply(s, o)), d;
          };
        }
        i.tokenizer = s;
      }
      if (r.hooks) {
        const s = this.defaults.hooks || new Tn();
        for (const l in r.hooks) {
          if (!(l in s))
            throw new Error(`hook '${l}' does not exist`);
          if (["options", "block"].includes(l))
            continue;
          const a = l, c = r.hooks[a], u = s[a];
          Tn.passThroughHooks.has(l) ? s[a] = (o) => {
            if (this.defaults.async)
              return Promise.resolve(c.call(s, o)).then((h) => u.call(s, h));
            const d = c.call(s, o);
            return u.call(s, d);
          } : s[a] = (...o) => {
            let d = c.apply(s, o);
            return d === !1 && (d = u.apply(s, o)), d;
          };
        }
        i.hooks = s;
      }
      if (r.walkTokens) {
        const s = this.defaults.walkTokens, l = r.walkTokens;
        i.walkTokens = function(a) {
          let c = [];
          return c.push(l.call(this, a)), s && (c = c.concat(s.call(this, a))), c;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, t) {
    return ut.lex(n, t ?? this.defaults);
  }
  parser(n, t) {
    return dt.parse(n, t ?? this.defaults);
  }
  parseMarkdown(n) {
    return (r, i) => {
      const s = { ...i }, l = { ...this.defaults, ...s }, a = this.onError(!!l.silent, !!l.async);
      if (this.defaults.async === !0 && s.async === !1)
        return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof r > "u" || r === null)
        return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof r != "string")
        return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(r) + ", string expected"));
      l.hooks && (l.hooks.options = l, l.hooks.block = n);
      const c = l.hooks ? l.hooks.provideLexer() : n ? ut.lex : ut.lexInline, u = l.hooks ? l.hooks.provideParser() : n ? dt.parse : dt.parseInline;
      if (l.async)
        return Promise.resolve(l.hooks ? l.hooks.preprocess(r) : r).then((o) => c(o, l)).then((o) => l.hooks ? l.hooks.processAllTokens(o) : o).then((o) => l.walkTokens ? Promise.all(this.walkTokens(o, l.walkTokens)).then(() => o) : o).then((o) => u(o, l)).then((o) => l.hooks ? l.hooks.postprocess(o) : o).catch(a);
      try {
        l.hooks && (r = l.hooks.preprocess(r));
        let o = c(r, l);
        l.hooks && (o = l.hooks.processAllTokens(o)), l.walkTokens && this.walkTokens(o, l.walkTokens);
        let d = u(o, l);
        return l.hooks && (d = l.hooks.postprocess(d)), d;
      } catch (o) {
        return a(o);
      }
    };
  }
  onError(n, t) {
    return (r) => {
      if (r.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        const i = "<p>An error occurred:</p><pre>" + Ke(r.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t)
        return Promise.reject(r);
      throw r;
    };
  }
}, At = new Zi();
function K(n, t) {
  return At.parse(n, t);
}
K.options = K.setOptions = function(n) {
  return At.setOptions(n), K.defaults = At.defaults, Li(K.defaults), K;
};
K.getDefaults = Rr;
K.defaults = zt;
K.use = function(...n) {
  return At.use(...n), K.defaults = At.defaults, Li(K.defaults), K;
};
K.walkTokens = function(n, t) {
  return At.walkTokens(n, t);
};
K.parseInline = At.parseInline;
K.Parser = dt;
K.parser = dt.parse;
K.Renderer = Hn;
K.TextRenderer = Or;
K.Lexer = ut;
K.lexer = ut.lex;
K.Tokenizer = Bn;
K.Hooks = Tn;
K.parse = K;
K.options;
K.setOptions;
K.use;
K.walkTokens;
K.parseInline;
dt.parse;
ut.lex;
function ua(n) {
  return n.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function lr(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
const da = /^\s*(javascript|vbscript|data):/i;
function fa(n) {
  return n ? da.test(n) ? "#" : n : "";
}
const Wi = new Zi({ gfm: !0, breaks: !1 });
Wi.use({
  renderer: {
    html(n) {
      const t = typeof n == "string" ? n : (n == null ? void 0 : n.text) ?? (n == null ? void 0 : n.raw) ?? "";
      return lr(t);
    },
    link(n) {
      var s;
      const t = fa(n.href), r = n.title ? ` title="${lr(n.title)}"` : "", i = (s = this.parser) != null && s.parseInline ? this.parser.parseInline(n.tokens) : lr(n.text ?? "");
      return `<a href="${t}"${r}>${i}</a>`;
    }
  }
});
function ha(n) {
  if (!n) return "";
  let t = Wi.parse(n);
  return t = t.replace(/<h([1-6])>(.+?)<\/h\1>/g, (r, i, s) => {
    const l = s.replace(/<[^>]+>/g, "");
    return `<h${i} id="${ua(l)}">${s}</h${i}>`;
  }), t;
}
function ga(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const pa = (n) => `<pre>${ga(n)}</pre>`, fi = (n) => ha(n);
function va(n) {
  return n.render ? n.render : n.language === "markdown" || n.language == null && typeof n.filePath == "string" && n.filePath.endsWith(".md") ? fi : pa;
}
function Ki(n) {
  const t = va(n), r = n.transform;
  return r ? (i, s) => t(r(i, s), s) : t;
}
var ma = e.from_html('<div class="line-num svelte-1j4uh1h"> </div>'), ba = e.from_html('<div class="preview-layer svelte-1j4uh1h"><!></div>'), _a = e.from_html('<div class="editor-container svelte-1j4uh1h"><!> <div><div><div class="gutter-inner svelte-1j4uh1h"></div></div> <div class="editor-body svelte-1j4uh1h"><pre aria-hidden="true"></pre> <textarea autocapitalize="off"></textarea> <!></div></div></div>');
function ya(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "entry", 7), i = e.prop(t, "fontSize", 3, 13), s = e.prop(t, "toolbarActions", 19, () => []), l = e.prop(t, "startInPreview", 3, !1), a = e.derived(() => r().document), c = e.state(e.proxy(e.get(a).content)), u = e.state(e.proxy(l())), o = e.derived(() => Ki({
    render: t.render,
    transform: t.transform,
    language: e.get(a).language,
    filePath: e.get(a).filePath
  })), d = e.derived(() => e.get(u) ? e.get(o)(e.get(c), e.get(a).language) : ""), h = e.derived(() => !!t.render || e.get(a).language === "markdown" || e.get(a).language == null && typeof e.get(a).filePath == "string" && e.get(a).filePath.endsWith(".md")), v = e.derived(() => {
    var T, H;
    return ((T = t.matchingConfig) == null ? void 0 : T.indentType) ?? ((H = t.matchingConfig) != null && H.indentBased ? "indent" : "none");
  }), g = e.derived(() => e.get(v) === "none" ? 0 : e.get(v) === "brace" ? 2 : 1), f = e.derived(() => (t.showSettings ?? !0) && e.get(g) > 0);
  const p = 300, y = (T, H) => {
    e.set(c, T, !0), e.get(a).content = T, e.get(a).cursorStart = H, e.get(a).cursorEnd = H, t.internals.contentChange.emit(e.get(a).id, T), E(H, H);
  };
  function m() {
    Xt.modal.open(Cl, {
      indentType: e.get(v),
      prefs: r().prefs,
      onChange: x
    });
  }
  let b = e.derived(() => {
    const T = [...s()];
    if (e.get(h)) {
      const H = {
        id: "sh3-editor:preview-toggle",
        label: e.get(u) ? "Edit" : "Preview",
        icon: e.get(u) ? "✎" : "👁",
        shortcut: "Ctrl+Shift+V",
        onAction: w,
        accent: e.get(u),
        group: "_editor_builtin"
      };
      T.push(H);
    }
    if (e.get(f)) {
      const H = {
        id: "sh3-editor:toolbar",
        label: "Settings",
        icon: "⚙",
        onAction: m,
        group: "_editor_builtin"
      };
      T.push(H);
    }
    return T;
  });
  function w() {
    e.set(u, !e.get(u)), e.get(u) || requestAnimationFrame(() => {
      var T;
      return (T = e.get(I)) == null ? void 0 : T.focus();
    });
  }
  function x(T) {
    r().prefs = { ...r().prefs, ...T }, t.internals.prefsChange.emit(r().document.id, { ...r().prefs });
  }
  e.user_effect(() => {
    e.set(c, e.get(a).content, !0);
  });
  let I = e.state(void 0), A = e.state(0), R = e.state(0), D = e.derived(() => t.highlight && e.get(a).language ? t.highlight(e.get(c), e.get(a).language) : G(e.get(c))), q = e.derived(() => e.get(c).split(`
`).length), L = e.derived(() => Array.from({ length: e.get(q) }, (T, H) => H + 1));
  function G(T) {
    return T.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function Z(T, H, ae) {
    var tt, Lt;
    e.set(c, T, !0);
    const _ = e.get(a).id, S = e.get(a).content;
    if (S === T) return;
    const z = e.get(a).cursorStart;
    e.get(a).content = T, e.get(a).cursorStart = H, e.get(a).cursorEnd = ae;
    const O = t.internals.history(_), U = Date.now(), V = O.peek(), Q = ((tt = V == null ? void 0 : V.meta) == null ? void 0 : tt.kind) === "text-swap" ? V.meta.snapshot : void 0, ge = Math.abs(T.length - S.length) <= 1, Ze = Q && ((Lt = V == null ? void 0 : V.meta) == null ? void 0 : Lt.timestamp) != null && U - V.meta.timestamp < p;
    Q && ge && Ze ? O.replaceTop(Nn({
      setter: y,
      before: Q.before,
      after: T,
      cursorBefore: Q.cursorBefore,
      cursorAfter: H,
      now: U
    })) : O.push(Nn({
      setter: y,
      before: S,
      after: T,
      cursorBefore: z,
      cursorAfter: H,
      now: U
    }));
    const ft = e.get(a).dirty;
    e.get(a).dirty = !0, t.internals.contentChange.emit(_, T), ft || t.internals.dirtyChange.emit(_, !0);
  }
  function E(T, H) {
    requestAnimationFrame(() => {
      e.get(I) && (e.get(I).selectionStart = T, e.get(I).selectionEnd = H);
    });
  }
  function B(T) {
    var H;
    if (T.key.toLowerCase() === "v" && Ee(T) && T.shiftKey) {
      if (!e.get(h)) return;
      T.preventDefault(), w();
      return;
    }
    if (T.key === "s" && Ee(T)) {
      T.preventDefault(), t.internals.emitSave(e.get(a).id);
      return;
    }
    if (T.key.toLowerCase() === "z" && Ee(T) && !T.shiftKey) {
      T.preventDefault(), t.internals.history(e.get(a).id).undo();
      return;
    }
    if (T.key.toLowerCase() === "y" && Ee(T) || T.key.toLowerCase() === "z" && Ee(T) && T.shiftKey) {
      T.preventDefault(), t.internals.history(e.get(a).id).redo();
      return;
    }
    if (T.key === "Enter" && !T.shiftKey && !Ee(T) && !T.altKey) {
      if (e.get(v) === "none") return;
      const ae = T.currentTarget, _ = pl(e.get(c), ae.selectionStart, ae.selectionEnd, e.get(v), r().prefs.indentUnit, r().prefs.braceStyle);
      _ && (T.preventDefault(), Z(_.content, _.selectionStart, _.selectionEnd), E(_.selectionStart, _.selectionEnd));
      return;
    }
    if (T.key === "}" && e.get(v) === "brace" && !Ee(T) && !T.altKey) {
      const ae = T.currentTarget, _ = vl(e.get(c), ae.selectionStart, ae.selectionEnd, r().prefs.indentUnit);
      if (_) {
        T.preventDefault(), Z(_.content, _.selectionStart, _.selectionEnd), E(_.selectionStart, _.selectionEnd);
        return;
      }
    }
    if (T.key === "Tab") {
      T.preventDefault();
      const ae = T.currentTarget, _ = gl(e.get(c), ae.selectionStart, ae.selectionEnd, T.shiftKey, (H = t.matchingConfig) == null ? void 0 : H.indentUnit);
      _ && (Z(_.content, _.selectionStart, _.selectionEnd), E(_.selectionStart, _.selectionEnd));
      return;
    }
  }
  function $(T) {
    const H = T.currentTarget;
    Z(H.value, H.selectionStart, H.selectionEnd);
  }
  function F(T) {
    const H = T.currentTarget;
    e.set(A, H.scrollTop, !0), e.set(R, H.scrollLeft, !0);
  }
  function te() {
    e.get(I) && (e.get(a).cursorStart = e.get(I).selectionStart, e.get(a).cursorEnd = e.get(I).selectionEnd);
  }
  var ie = _a(), X = e.child(ie);
  Xn(X, {
    get actions() {
      return e.get(b);
    },
    get filePath() {
      return e.get(a).filePath;
    }
  });
  var fe = e.sibling(X, 2);
  let kt, Dt;
  var Ge = e.child(fe);
  let Me;
  var wt = e.child(Ge);
  let Mt;
  e.each(wt, 20, () => e.get(L), (T) => T, (T, H) => {
    var ae = ma(), _ = e.child(ae, !0);
    e.reset(ae), e.template_effect(() => e.set_text(_, H)), e.append(T, ae);
  }), e.reset(wt), e.reset(Ge);
  var ce = e.sibling(Ge, 2), xe = e.child(ce);
  let Le, he;
  e.html(xe, () => e.get(D) + `
`, !0), e.reset(xe);
  var ye = e.sibling(xe, 2);
  e.remove_textarea_child(ye);
  let et;
  e.set_attribute(ye, "spellcheck", !1), e.bind_this(ye, (T) => e.set(I, T), () => e.get(I));
  var Ne = e.sibling(ye, 2);
  {
    var Qt = (T) => {
      var H = ba(), ae = e.child(H);
      Mi(ae, {
        get html() {
          return e.get(d);
        },
        get slotId() {
          return e.get(a).id;
        },
        get onLinkClick() {
          return t.onLinkClick;
        }
      }), e.reset(H), e.append(T, H);
    };
    e.if(Ne, (T) => {
      e.get(u) && T(Qt);
    });
  }
  e.reset(ce), e.reset(fe), e.reset(ie), e.template_effect(() => {
    kt = e.set_class(fe, 1, "editor-wrap svelte-1j4uh1h", null, kt, { "preview-mode": e.get(u) }), Dt = e.set_style(fe, "", Dt, { "--editor-font-size": `${i() ?? ""}px` }), Me = e.set_class(Ge, 1, "gutter svelte-1j4uh1h", null, Me, { "gutter-hidden": e.get(u) }), Mt = e.set_style(wt, "", Mt, { transform: `translateY(-${e.get(A) ?? ""}px)` }), Le = e.set_class(xe, 1, "highlight-layer svelte-1j4uh1h", null, Le, { "layer-hidden": e.get(u) }), he = e.set_style(xe, "", he, {
      top: `-${e.get(A) ?? ""}px`,
      left: `-${e.get(R) ?? ""}px`
    }), et = e.set_class(ye, 1, "input-layer svelte-1j4uh1h", null, et, { "layer-hidden": e.get(u) }), e.set_value(ye, e.get(c));
  }), e.delegated("keydown", ye, B), e.delegated("input", ye, $), e.event("scroll", ye, F), e.event("select", ye, te), e.append(n, ie), e.pop();
}
e.delegate(["keydown", "input"]);
var ka = e.from_html('<div class="reader-container svelte-jsdqlf"><!> <div class="reader-body svelte-jsdqlf"><!></div></div>');
function wa(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "toolbarActions", 19, () => []), i = e.derived(() => t.entry.document), s = e.derived(() => Ki({
    render: t.render,
    transform: t.transform,
    language: e.get(i).language,
    filePath: e.get(i).filePath
  })), l = e.derived(() => e.get(s)(e.get(i).content, e.get(i).language));
  var a = ka(), c = e.child(a);
  Xn(c, {
    get actions() {
      return r();
    },
    get filePath() {
      return e.get(i).filePath;
    }
  });
  var u = e.sibling(c, 2), o = e.child(u);
  Mi(o, {
    get html() {
      return e.get(l);
    },
    get slotId() {
      return e.get(i).id;
    },
    get onLinkClick() {
      return t.onLinkClick;
    }
  }), e.reset(u), e.reset(a), e.append(n, a), e.pop();
}
function Yi(n, t, r, i) {
  return n && n(t, r) === !0 ? !0 : (i(), !1);
}
var xa = e.from_html('<div><span class="label svelte-2gtehg"> </span> <span class="value svelte-2gtehg"><!></span></div>');
function ar(n, t) {
  let r = e.prop(t, "readonly", 3, !1);
  var i = xa();
  let s;
  var l = e.child(i), a = e.child(l, !0);
  e.reset(l);
  var c = e.sibling(l, 2), u = e.child(c);
  e.snippet(u, () => t.children), e.reset(c), e.reset(i), e.template_effect(() => {
    s = e.set_class(i, 1, "field svelte-2gtehg", null, s, { readonly: r() }), e.set_text(a, t.label);
  }), e.append(n, i);
}
var Ca = e.from_html('<input type="checkbox"/>'), Sa = e.from_html('<input class="primitive svelte-1o84d6l"/>');
function Ia(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "readonly", 3, !1), i = e.state(e.proxy(s(t.value)));
  e.user_effect(() => {
    e.set(i, s(t.value), !0);
  });
  function s(f) {
    return f === null ? "null" : f === void 0 ? "" : typeof f == "boolean" ? f ? "true" : "false" : String(f);
  }
  function l(f, p) {
    if (p === "boolean") return f === "true";
    if (p === "number") {
      const y = Number(f);
      return Number.isFinite(y) ? y : t.value;
    }
    return f;
  }
  let a = e.derived(() => typeof t.value == "number" ? "number" : typeof t.value == "boolean" ? "boolean" : "string");
  function c() {
    if (r() || !t.onCommit) return;
    const f = l(e.get(i), e.get(a));
    f !== null && f !== t.value && t.onCommit(f);
  }
  function u(f) {
    if (r() || !t.onCommit) return;
    const p = f.target.checked;
    p !== t.value && t.onCommit(p);
  }
  function o(f) {
    f.key === "Enter" ? f.currentTarget.blur() : f.key === "Escape" && (e.set(i, s(t.value), !0), f.currentTarget.blur());
  }
  var d = e.comment(), h = e.first_child(d);
  {
    var v = (f) => {
      var p = Ca();
      e.remove_input_defaults(p), e.template_effect(
        (y) => {
          e.set_checked(p, y), p.disabled = r();
        },
        [() => !!t.value]
      ), e.delegated("change", p, u), e.append(f, p);
    }, g = (f) => {
      var p = Sa();
      e.remove_input_defaults(p), e.template_effect(() => {
        e.set_attribute(p, "type", e.get(a) === "number" ? "number" : "text"), p.disabled = r();
      }), e.event("blur", p, c), e.delegated("keydown", p, o), e.bind_value(p, () => e.get(i), (y) => e.set(i, y)), e.append(f, p);
    };
    e.if(h, (f) => {
      e.get(a) === "boolean" ? f(v) : f(g, -1);
    });
  }
  e.append(n, d), e.pop();
}
e.delegate(["change", "keydown"]);
var Pa = e.from_html('<div class="walker svelte-1xvtj10"></div>');
function Ta(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "basePath", 19, () => []);
  function i(o) {
    return o == null || typeof o == "string" || typeof o == "number" || typeof o == "boolean";
  }
  function s(o, d, h) {
    const v = o[d], g = {
      apply() {
        o[d] = h;
      },
      revert() {
        o[d] = v;
      },
      meta: { kind: "walker-edit", label: String(d) }
    };
    t.api.push(g), o[d] = h;
  }
  function l(o) {
    return (d) => {
      Yi(t.walkerOnCommit, [...r(), o], d, () => s(t.value, o, d));
    };
  }
  function a(o) {
    return (d) => s(t.value, o, d);
  }
  let c = e.derived(() => Array.isArray(t.value) ? t.value.map((o, d) => {
    var h;
    return { key: d, child: o, fieldMeta: (h = t.meta) == null ? void 0 : h.item };
  }) : t.value && typeof t.value == "object" ? Object.keys(t.value).map((o) => {
    var d, h;
    return {
      key: o,
      child: t.value[o],
      fieldMeta: (h = (d = t.meta) == null ? void 0 : d.fields) == null ? void 0 : h[o]
    };
  }) : []);
  var u = Pa();
  e.each(u, 21, () => e.get(c), (o) => o.key, (o, d) => {
    var h = e.comment(), v = e.first_child(h);
    {
      var g = (f) => {
        const p = e.derived(() => {
          var R;
          return ((R = e.get(d).fieldMeta) == null ? void 0 : R.label) ?? (typeof e.get(d).key == "number" ? `[${e.get(d).key}]` : String(e.get(d).key));
        }), y = e.derived(() => {
          var R;
          return (((R = e.get(d).fieldMeta) == null ? void 0 : R.readonly) ?? !1) || t.api.readonly;
        });
        var m = e.comment(), b = e.first_child(m);
        {
          var w = (R) => {
            ar(R, {
              get label() {
                return e.get(p);
              },
              get readonly() {
                return e.get(y);
              },
              children: (D, q) => {
                {
                  let L = e.derived(() => e.get(y) ? void 0 : a(e.get(d).key)), G = e.derived(() => [...r(), e.get(d).key]);
                  mr(D, {
                    get value() {
                      return e.get(d).child;
                    },
                    get meta() {
                      return e.get(d).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(L);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(G);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, x = (R) => {
            ar(R, {
              get label() {
                return e.get(p);
              },
              get readonly() {
                return e.get(y);
              },
              children: (D, q) => {
                {
                  let L = e.derived(() => e.get(y) ? void 0 : l(e.get(d).key));
                  Ia(D, {
                    get value() {
                      return e.get(d).child;
                    },
                    get readonly() {
                      return e.get(y);
                    },
                    get onCommit() {
                      return e.get(L);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          }, I = e.derived(() => i(e.get(d).child)), A = (R) => {
            ar(R, {
              get label() {
                return e.get(p);
              },
              get readonly() {
                return e.get(y);
              },
              children: (D, q) => {
                {
                  let L = e.derived(() => e.get(y) ? void 0 : a(e.get(d).key)), G = e.derived(() => [...r(), e.get(d).key]);
                  mr(D, {
                    get value() {
                      return e.get(d).child;
                    },
                    get meta() {
                      return e.get(d).fieldMeta;
                    },
                    get api() {
                      return t.api;
                    },
                    get onCommit() {
                      return e.get(L);
                    },
                    get walkerOnCommit() {
                      return t.walkerOnCommit;
                    },
                    get basePath() {
                      return e.get(G);
                    }
                  });
                }
              },
              $$slots: { default: !0 }
            });
          };
          e.if(b, (R) => {
            var D;
            (D = e.get(d).fieldMeta) != null && D.type ? R(w) : e.get(I) ? R(x, 1) : R(A, -1);
          });
        }
        e.append(f, m);
      };
      e.if(v, (f) => {
        var p;
        (p = e.get(d).fieldMeta) != null && p.hidden || f(g);
      });
    }
    e.append(o, h);
  }), e.reset(u), e.append(n, u), e.pop();
}
var Ra = e.from_html('<span class="leaf svelte-o6duey"> </span>');
function Aa(n, t) {
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
  var i = Ra(), s = e.child(i, !0);
  e.reset(i), e.template_effect((l) => e.set_text(s, l), [() => r(t.value)]), e.append(n, i);
}
function mr(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "basePath", 19, () => []), i = e.derived(() => fl(t.value, t.meta)), s = e.derived(() => {
    const h = t.onCommit, v = t.walkerOnCommit;
    if (h !== void 0)
      return v === void 0 ? h : (g) => {
        Yi(v, r(), g, () => h(g));
      };
  });
  var l = e.comment(), a = e.first_child(l);
  {
    var c = (h) => {
    }, u = (h) => {
      const v = e.derived(() => e.get(i).component);
      var g = e.comment(), f = e.first_child(g);
      e.component(f, () => e.get(v), (p, y) => {
        y(p, {
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
      }), e.append(h, g);
    }, o = (h) => {
      Ta(h, {
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
    }, d = (h) => {
      Aa(h, {
        get value() {
          return t.value;
        }
      });
    };
    e.if(a, (h) => {
      var v;
      (v = t.meta) != null && v.hidden ? h(c) : e.get(i).kind === "custom" ? h(u, 1) : e.get(i).kind === "walker" ? h(o, 2) : h(d, -1);
    });
  }
  e.append(n, l), e.pop();
}
var Ea = e.from_html('<div class="inspector-container svelte-jpxkcf" tabindex="-1" role="region" aria-label="Inspector"><!> <div class="inspector-body svelte-jpxkcf"><!></div></div>');
function za(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "adHocReadonly", 3, !1), i = e.derived(() => t.internals.inspectors.get(t.instanceId)), s = e.derived(() => e.get(i) ? e.get(i).value : t.adHocValue), l = e.derived(() => e.get(i) ? e.get(i).meta : t.adHocMeta), a = e.derived(() => e.get(i) ? !!e.get(i).options.readonly : r()), c = e.derived(() => e.get(i) ? e.get(i).options.onCommit : void 0), u = e.derived(() => {
    var b;
    return ((b = e.get(i)) == null ? void 0 : b.options.toolbarActions) ?? [];
  });
  const o = t.internals.history(t.instanceId), d = {
    push(b) {
      e.get(a) || (o.push(b), t.internals.inspectorValueChange.emit(t.instanceId, e.get(s)));
    },
    get readonly() {
      return e.get(a);
    },
    history: o
  };
  e.user_effect(() => {
    const b = o.onChange(() => {
      t.internals.inspectorValueChange.emit(t.instanceId, e.get(s));
    });
    return () => b();
  });
  let h = e.state(void 0);
  function v(b) {
    if (b.key.toLowerCase() === "z" && Ee(b) && !b.shiftKey) {
      b.preventDefault(), o.undo();
      return;
    }
    if (b.key.toLowerCase() === "y" && Ee(b) || b.key.toLowerCase() === "z" && Ee(b) && b.shiftKey) {
      b.preventDefault(), o.redo();
      return;
    }
  }
  var g = Ea(), f = e.child(g);
  {
    var p = (b) => {
      Xn(b, {
        get actions() {
          return e.get(u);
        },
        filePath: null
      });
    };
    e.if(f, (b) => {
      e.get(u).length > 0 && b(p);
    });
  }
  var y = e.sibling(f, 2), m = e.child(y);
  mr(m, {
    get value() {
      return e.get(s);
    },
    get meta() {
      return e.get(l);
    },
    get api() {
      return d;
    },
    get walkerOnCommit() {
      return e.get(c);
    },
    basePath: []
  }), e.reset(y), e.reset(g), e.bind_this(g, (b) => e.set(h, b), () => e.get(h)), e.delegated("keydown", g, v), e.append(n, g), e.pop();
}
e.delegate(["keydown"]);
var Da = e.from_html('<div role="region" aria-label="Color picker"><div class="cp-compact-row svelte-f5c5rv"><div class="cp-preview cp-compact-preview svelte-f5c5rv" role="button" aria-label="Open full color picker" aria-haspopup="true"></div> <input type="text" class="cp-hex-input cp-compact-hex svelte-f5c5rv" aria-label="Hex value"/></div></div>'), Ma = e.from_html('<div tabindex="-1" role="region" aria-label="Color picker"><!> <!></div>');
function Xi(n, t) {
  e.push(t, !0);
  let r = e.prop(t, "adHocReadonly", 3, !1), i = e.prop(t, "userPalettes", 19, () => []), s = e.prop(t, "prefs", 19, () => ({ mode: "hsv" })), l = e.prop(t, "compact", 3, !1), a = e.derived(() => t.internals.colorPickers.get(t.instanceId)), c = e.derived(() => {
    var E;
    return ((E = e.get(a)) == null ? void 0 : E.options.toolbarActions) ?? [];
  }), u = e.state(e.proxy(t.descriptorBinding ? qe(t.descriptorBinding.initial) ?? "#000000" : "#000000")), o = e.derived(() => e.get(a) ? e.get(a).value : t.descriptorBinding ? e.get(u) : qe(t.adHocValue ?? "") ?? "#000000"), d = e.derived(() => e.get(a) ? !!e.get(a).options.readonly : r());
  const h = t.internals.history(t.instanceId);
  function v(E) {
    if (e.get(d)) return;
    const B = qe(E);
    if (!B) return;
    if (t.onExternalCommit) {
      t.onExternalCommit(B);
      return;
    }
    const $ = e.get(o);
    if ($ === B) return;
    const F = (te) => {
      e.get(a) ? e.get(a).value = te : t.descriptorBinding && e.set(u, te, !0);
    };
    h.push({
      apply: () => F(B),
      revert: () => F($),
      meta: { kind: "color", timestamp: Date.now() }
    }), F(B), t.internals.colorPickerValueChange.emit(t.instanceId, B), t.descriptorBinding && !e.get(a) && t.descriptorBinding.onChange(B);
  }
  e.user_effect(() => {
    const E = h.onChange(() => {
      t.internals.colorPickerValueChange.emit(t.instanceId, e.get(o)), t.descriptorBinding && !e.get(a) && t.descriptorBinding.onChange(e.get(o));
    });
    return () => E();
  });
  function g(E) {
    t.internals.colorPickerPrefsChange.emit(t.instanceId, { mode: E });
  }
  const f = e.derived(() => /^#[0-9a-f]{6}$/i.test(e.get(o)) ? e.get(o).toUpperCase() : e.get(o));
  let p = e.state(e.proxy(e.get(f)));
  e.user_effect(() => {
    e.set(p, e.get(f), !0);
  });
  function y() {
    if (e.get(d)) return;
    const E = qe(e.get(p).trim());
    if (!E) {
      e.set(p, e.get(f), !0);
      return;
    }
    v(E);
  }
  function m(E) {
    E.key === "Enter" && (E.preventDefault(), E.currentTarget.blur());
  }
  let b = e.state(void 0);
  function w() {
    e.get(d) || !e.get(b) || Xt.popup.show(hr, { anchor: e.get(b) }, {
      value: e.get(o),
      readonly: e.get(d),
      initialMode: s().mode,
      userPalettes: i(),
      onChange: (E) => v(E),
      onModeChange: g,
      onSaveUserPalette: t.onSaveUserPalette,
      onDeleteUserPalette: t.onDeleteUserPalette
    });
  }
  function x(E) {
    (E.key === "Enter" || E.key === " ") && (E.preventDefault(), w());
  }
  let I = e.state(void 0);
  function A(E) {
    if (E.key.toLowerCase() === "z" && Ee(E) && !E.shiftKey) {
      E.preventDefault(), h.undo();
      return;
    }
    if (E.key.toLowerCase() === "y" && Ee(E) || E.key.toLowerCase() === "z" && Ee(E) && E.shiftKey) {
      E.preventDefault(), h.redo();
      return;
    }
  }
  let R = !1;
  function D(E) {
    if (R || !t.descriptorBinding || e.get(
      a
      // descriptor mode only
    )) return;
    const B = qe(E) ?? "#000000", $ = e.get(u);
    $ !== B && (h.push({
      apply: () => {
        e.set(u, B, !0);
      },
      revert: () => {
        e.set(u, $, !0);
      },
      meta: { kind: "color", timestamp: Date.now(), source: "controller" }
    }), e.set(u, B, !0));
  }
  Yn(() => {
    var E, B;
    if (t.descriptorBinding)
      return (B = (E = t.descriptorBinding).bind) == null || B.call(E, { setValue: D }), () => {
        R = !0;
      };
  });
  var q = e.comment(), L = e.first_child(q);
  {
    var G = (E) => {
      var B = Da();
      let $;
      var F = e.child(B), te = e.child(F);
      let ie;
      e.bind_this(te, (fe) => e.set(b, fe), () => e.get(b));
      var X = e.sibling(te, 2);
      e.remove_input_defaults(X), e.reset(F), e.reset(B), e.template_effect(() => {
        $ = e.set_class(B, 1, "cp-compact svelte-f5c5rv", null, $, { disabled: e.get(d) }), e.set_attribute(te, "tabindex", e.get(d) ? -1 : 0), ie = e.set_style(te, "", ie, { "background-color": e.get(o) }), X.disabled = e.get(d);
      }), e.delegated("click", te, w), e.delegated("keydown", te, x), e.event("blur", X, y), e.delegated("keydown", X, m), e.bind_value(X, () => e.get(p), (fe) => e.set(p, fe)), e.append(E, B);
    }, Z = (E) => {
      var B = Ma();
      let $;
      var F = e.child(B);
      {
        var te = (X) => {
          Xn(X, {
            get actions() {
              return e.get(c);
            },
            filePath: null
          });
        };
        e.if(F, (X) => {
          e.get(c).length > 0 && X(te);
        });
      }
      var ie = e.sibling(F, 2);
      hr(ie, {
        get value() {
          return e.get(o);
        },
        get readonly() {
          return e.get(d);
        },
        get initialMode() {
          return s().mode;
        },
        get userPalettes() {
          return i();
        },
        onChange: v,
        onModeChange: g,
        get onSaveUserPalette() {
          return t.onSaveUserPalette;
        },
        get onDeleteUserPalette() {
          return t.onDeleteUserPalette;
        }
      }), e.reset(B), e.bind_this(B, (X) => e.set(I, X), () => e.get(I)), e.template_effect(() => $ = e.set_class(B, 1, "cp svelte-f5c5rv", null, $, { disabled: e.get(d) })), e.delegated("keydown", B, A), e.append(E, B);
    };
    e.if(L, (E) => {
      l() ? E(G) : E(Z, -1);
    });
  }
  e.append(n, q), e.pop();
}
e.delegate(["click", "keydown"]);
var La = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>'), Na = e.from_html('<span class="cp-leaf-fallback svelte-1tdr2l8"> </span>');
function Oa(n, t) {
  e.push(t, !0);
  const r = hl();
  let i = e.derived(() => typeof t.value == "string" ? t.value : null);
  var s = e.comment(), l = e.first_child(s);
  {
    var a = (o) => {
      var d = La(), h = e.child(d, !0);
      e.reset(d), e.template_effect((v) => e.set_text(h, v), [() => String(t.value)]), e.append(o, d);
    }, c = (o) => {
      var d = Na(), h = e.child(d, !0);
      e.reset(d), e.template_effect(() => e.set_text(h, e.get(i))), e.append(o, d);
    }, u = (o) => {
      Xi(o, {
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
        onExternalCommit: (d) => {
          var h;
          return (h = t.onCommit) == null ? void 0 : h.call(t, d);
        }
      });
    };
    e.if(l, (o) => {
      e.get(i) === null ? o(a) : r ? o(u, -1) : o(c, 1);
    });
  }
  e.append(n, s), e.pop();
}
const or = "sh3-editor.settings";
function hi(n, t, r, i) {
  const s = { ...n[t] ?? {} };
  return i === void 0 ? delete s[r] : s[r] = i, { ...n, [t]: s };
}
function Ba(n, t) {
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
var Ha = e.from_html('<h3 class="section-label svelte-18qjjuf"> </h3>'), qa = e.from_html('<section class="section svelte-18qjjuf"><!> <div class="rows svelte-18qjjuf"><!></div></section>');
function Ua(n, t) {
  var r = qa(), i = e.child(r);
  {
    var s = (c) => {
      var u = Ha(), o = e.child(u, !0);
      e.reset(u), e.template_effect(() => e.set_text(o, t.label)), e.append(c, u);
    };
    e.if(i, (c) => {
      t.showHeader && c(s);
    });
  }
  var l = e.sibling(i, 2), a = e.child(l);
  e.snippet(a, () => t.children), e.reset(l), e.reset(r), e.append(n, r);
}
var Va = e.from_html('<div class="desc svelte-1rh69ln"> </div>'), Fa = e.from_html('<div class="error svelte-1rh69ln"> </div>'), ja = e.from_html('<div><div class="label-col"><div class="label svelte-1rh69ln"> </div> <!></div> <div class="control svelte-1rh69ln"><!></div> <!></div>');
function wn(n, t) {
  let r = e.prop(t, "disabled", 3, !1);
  var i = ja();
  let s;
  var l = e.child(i), a = e.child(l), c = e.child(a, !0);
  e.reset(a);
  var u = e.sibling(a, 2);
  {
    var o = (f) => {
      var p = Va(), y = e.child(p, !0);
      e.reset(p), e.template_effect(() => e.set_text(y, t.description)), e.append(f, p);
    };
    e.if(u, (f) => {
      t.description && f(o);
    });
  }
  e.reset(l);
  var d = e.sibling(l, 2), h = e.child(d);
  e.snippet(h, () => t.children), e.reset(d);
  var v = e.sibling(d, 2);
  {
    var g = (f) => {
      var p = Fa(), y = e.child(p, !0);
      e.reset(p), e.template_effect(() => e.set_text(y, t.error)), e.append(f, p);
    };
    e.if(v, (f) => {
      t.error && f(g);
    });
  }
  e.reset(i), e.template_effect(() => {
    s = e.set_class(i, 1, "row svelte-1rh69ln", null, s, { disabled: r() }), e.set_text(c, t.label);
  }), e.append(n, i);
}
var Ga = e.from_html('<button type="button"><span class="knob svelte-ert2i6"></span></button>');
function Za(n, t) {
  e.push(t, !0);
  const r = e.derived(() => !!t.value);
  wn(n, {
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
      var l = Ga();
      let a;
      e.template_effect(() => {
        a = e.set_class(l, 1, "toggle svelte-ert2i6", null, a, { on: e.get(r) }), l.disabled = t.field.disabled, e.set_attribute(l, "aria-pressed", e.get(r)), e.set_attribute(l, "aria-label", t.field.label);
      }), e.delegated("click", l, () => t.onEdit(!e.get(r))), e.append(i, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
var Wa = e.from_html('<input type="text"/>');
function Ka(n, t) {
  e.push(t, !0);
  const r = e.derived(() => t.value == null ? "" : String(t.value));
  wn(n, {
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
      var l = Wa();
      e.remove_input_defaults(l);
      let a;
      e.template_effect(() => {
        a = e.set_class(l, 1, "input svelte-1jljyjf", null, a, { error: !!t.error }), e.set_attribute(l, "placeholder", t.field.placeholder ?? ""), l.disabled = t.field.disabled, e.set_value(l, e.get(r));
      }), e.delegated("change", l, (c) => t.onEdit(c.currentTarget.value)), e.append(i, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var Ya = e.from_html('<span class="unit svelte-1be7g0v"> </span>'), Xa = e.from_html('<input type="number"/> <!>', 1);
function Qa(n, t) {
  e.push(t, !0);
  const r = e.derived(() => typeof t.value == "number" ? String(t.value) : "");
  function i(s) {
    const l = s.currentTarget.value, a = Number(l);
    l === "" || Number.isNaN(a) || t.onEdit(a);
  }
  wn(n, {
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
      var a = Xa(), c = e.first_child(a);
      e.remove_input_defaults(c);
      let u;
      var o = e.sibling(c, 2);
      {
        var d = (h) => {
          var v = Ya(), g = e.child(v, !0);
          e.reset(v), e.template_effect(() => e.set_text(g, t.field.unit)), e.append(h, v);
        };
        e.if(o, (h) => {
          t.field.unit && h(d);
        });
      }
      e.template_effect(() => {
        u = e.set_class(c, 1, "input svelte-1be7g0v", null, u, { error: !!t.error }), e.set_attribute(c, "min", t.field.min), e.set_attribute(c, "max", t.field.max), e.set_attribute(c, "step", t.field.step ?? 1), c.disabled = t.field.disabled, e.set_value(c, e.get(r));
      }), e.delegated("change", c, i), e.append(s, a);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["change"]);
var Ja = e.from_html('<input type="range"/> <span class="value svelte-1jyn88"> </span>', 1);
function $a(n, t) {
  e.push(t, !0);
  const r = e.derived(() => i(typeof t.value == "number" ? t.value : t.field.min, t.field.min, t.field.max));
  function i(l, a, c) {
    return Math.min(c, Math.max(a, l));
  }
  function s(l) {
    const a = Number(l.currentTarget.value);
    Number.isNaN(a) || t.onEdit(i(a, t.field.min, t.field.max));
  }
  wn(n, {
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
      var c = Ja(), u = e.first_child(c);
      e.remove_input_defaults(u);
      let o;
      var d = e.sibling(u, 2), h = e.child(d);
      e.reset(d), e.template_effect(() => {
        o = e.set_class(u, 1, "slider svelte-1jyn88", null, o, { error: !!t.error }), e.set_attribute(u, "min", t.field.min), e.set_attribute(u, "max", t.field.max), e.set_attribute(u, "step", t.field.step ?? 1), u.disabled = t.field.disabled, e.set_value(u, e.get(r)), e.set_text(h, `${e.get(r) ?? ""}${t.field.unit ? ` ${t.field.unit}` : ""}`);
      }), e.delegated("input", u, s), e.append(l, c);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["input"]);
var eo = e.from_html('<button type="button"> </button>'), to = e.from_html("<div></div>");
function no(n, t) {
  e.push(t, !0);
  const r = e.derived(() => typeof t.value == "string" ? t.value : "");
  wn(n, {
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
      var l = to();
      let a;
      e.each(l, 21, () => t.field.options, (c) => c.value, (c, u) => {
        var o = eo();
        let d;
        var h = e.child(o, !0);
        e.reset(o), e.template_effect(() => {
          o.disabled = t.field.disabled, d = e.set_class(o, 1, "svelte-iu603z", null, d, { active: e.get(r) === e.get(u).value }), e.set_text(h, e.get(u).label);
        }), e.delegated("click", o, () => t.onEdit(e.get(u).value)), e.append(c, o);
      }), e.reset(l), e.template_effect(() => a = e.set_class(l, 1, "seg svelte-iu603z", null, a, { error: !!t.error })), e.append(i, l);
    },
    $$slots: { default: !0 }
  }), e.pop();
}
e.delegate(["click"]);
const ro = {
  boolean: Za,
  string: Ka,
  number: Qa,
  "number-range": $a,
  enum: no
};
var io = e.from_html('<p class="empty svelte-mrn94a">No settings available.</p>'), so = e.from_html('<div class="settings svelte-mrn94a"><h2 class="title svelte-mrn94a">Settings</h2> <!></div>');
function lo(n, t) {
  e.push(t, !0);
  let r = e.state(e.proxy(t.ctx.contributions.list(or))), i = e.state(e.proxy({})), s = e.state(e.proxy({}));
  e.user_effect(() => t.ctx.contributions.onChange(or, () => {
    e.set(r, t.ctx.contributions.list(or), !0);
  })), e.user_effect(() => {
    var v;
    const d = [], h = {};
    for (const g of e.get(r)) {
      h[g.shardId] = g.getValues();
      const f = (v = g.subscribe) == null ? void 0 : v.call(g, () => {
        e.set(i, { ...e.get(i), [g.shardId]: g.getValues() }, !0);
      });
      f && d.push(f);
    }
    return e.set(i, h, !0), e.set(s, Ba(e.get(s), e.get(r).map((g) => g.shardId)), !0), () => d.forEach((g) => g());
  });
  async function l(d, h, v) {
    try {
      await d.onEdit(h, v), e.set(s, hi(e.get(s), d.shardId, h, void 0), !0);
    } catch (g) {
      e.set(s, hi(e.get(s), d.shardId, h, g.message || "Invalid value"), !0);
    } finally {
      e.set(i, { ...e.get(i), [d.shardId]: d.getValues() }, !0);
    }
  }
  var a = so(), c = e.sibling(e.child(a), 2);
  {
    var u = (d) => {
      var h = io();
      e.append(d, h);
    }, o = (d) => {
      var h = e.comment(), v = e.first_child(h);
      e.each(v, 17, () => e.get(r), (g) => g.shardId, (g, f) => {
        {
          let p = e.derived(() => e.get(r).length > 1);
          Ua(g, {
            get label() {
              return e.get(f).label;
            },
            get showHeader() {
              return e.get(p);
            },
            children: (y, m) => {
              var b = e.comment(), w = e.first_child(b);
              e.each(w, 17, () => e.get(f).schema, (x) => x.key, (x, I) => {
                var A = e.comment(), R = e.first_child(A);
                {
                  let D = e.derived(() => {
                    var L;
                    return (L = e.get(i)[e.get(f).shardId]) == null ? void 0 : L[e.get(I).key];
                  }), q = e.derived(() => {
                    var L;
                    return (L = e.get(s)[e.get(f).shardId]) == null ? void 0 : L[e.get(I).key];
                  });
                  e.component(R, () => ro[e.get(I).type], (L, G) => {
                    G(L, {
                      get field() {
                        return e.get(I);
                      },
                      get value() {
                        return e.get(D);
                      },
                      get error() {
                        return e.get(q);
                      },
                      onEdit: (Z) => l(e.get(f), e.get(I).key, Z)
                    });
                  });
                }
                e.append(x, A);
              }), e.append(y, b);
            }
          });
        }
      }), e.append(d, h);
    };
    e.if(c, (d) => {
      e.get(r).length === 0 ? d(u) : d(o, -1);
    });
  }
  e.reset(a), e.append(n, a), e.pop();
}
function ao(n, t = {}) {
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
    const c = l.c.priority ?? 100, u = a.c.priority ?? 100;
    return c !== u ? c - u : l.i - a.i;
  }), s.map((l) => l.c);
}
function oo(n) {
  return {
    activeAppId: n.getActiveApp(),
    focusedViewId: n.readFocusedViewId(),
    mountedViewIds: [...n.listMountedViewIds()],
    selection: n.getSelection(),
    capturedAt: n.now()
  };
}
function co(n) {
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
const uo = {
  Meta: "⌘",
  Ctrl: "⌃",
  Alt: "⌥",
  Shift: "⇧"
};
function fo(n, t) {
  if (!n) return "—";
  const r = n.split("+");
  if (t === "mac") {
    let i = "";
    for (let s = 0; s < r.length; s++) {
      const l = r[s];
      i += uo[l] ?? l;
    }
    return i;
  }
  return n;
}
function ho() {
  return typeof navigator > "u" ? "other" : (navigator.platform || navigator.userAgent || "").includes("Mac") ? "mac" : "other";
}
var go = e.from_html('<span>App: <code class="svelte-151qe3m"> </code></span>'), po = e.from_html('<span>Focused view: <code class="svelte-151qe3m"> </code></span>'), vo = e.from_html('<header class="ctx svelte-151qe3m"><!> <!> <!></header>'), mo = e.from_html('<p class="empty svelte-151qe3m">No hotkeys active in this context.</p>'), bo = e.from_html('<span class="badge svelte-151qe3m"> </span>'), _o = e.from_html('<li><span class="label svelte-151qe3m"> </span> <kbd class="kbd svelte-151qe3m"> </kbd> <!></li>'), yo = e.from_html('<section class="group svelte-151qe3m"><h3 class="group-title svelte-151qe3m"> </h3> <ul class="list svelte-151qe3m"></ul></section>'), ko = e.from_html('<div class="hotkeys-tab svelte-151qe3m"><!> <!></div>');
function wo(n, t) {
  e.push(t, !0);
  const r = ho(), i = {
    home: "Global",
    app: "App",
    view: "View",
    focus: "Focus",
    element: "Selection"
  };
  function s(p) {
    if (p.scope === "home") return "home";
    if (p.scope === "app") return "app";
    if (typeof p.scope == "string") {
      if (p.scope.startsWith("view:")) return "view";
      if (p.scope.startsWith("focus:")) return "focus";
    }
    return "element";
  }
  const l = ["home", "app", "view", "focus", "element"], a = e.derived(() => {
    const p = /* @__PURE__ */ new Map();
    for (const y of t.actions) {
      const m = s(y), b = p.get(m) ?? [];
      b.push(y), p.set(m, b);
    }
    for (const y of p.values())
      y.sort((m, b) => {
        const w = m.group ?? "", x = b.group ?? "";
        return w !== x ? w.localeCompare(x) : m.label.localeCompare(b.label);
      });
    return l.map((y) => ({ tier: y, label: i[y], items: p.get(y) ?? [] })).filter((y) => y.items.length > 0);
  }), { snapshot: c } = t.tabCtx, u = c.activeAppId !== null || c.focusedViewId !== null;
  var o = ko(), d = e.child(o);
  {
    var h = (p) => {
      var y = vo(), m = e.child(y);
      {
        var b = (R) => {
          var D = go(), q = e.sibling(e.child(D)), L = e.child(q, !0);
          e.reset(q), e.reset(D), e.template_effect(() => e.set_text(L, c.activeAppId)), e.append(R, D);
        };
        e.if(m, (R) => {
          c.activeAppId && R(b);
        });
      }
      var w = e.sibling(m, 2);
      {
        var x = (R) => {
          var D = e.text("·");
          e.append(R, D);
        };
        e.if(w, (R) => {
          c.activeAppId && c.focusedViewId && R(x);
        });
      }
      var I = e.sibling(w, 2);
      {
        var A = (R) => {
          var D = po(), q = e.sibling(e.child(D)), L = e.child(q, !0);
          e.reset(q), e.reset(D), e.template_effect(() => e.set_text(L, c.focusedViewId)), e.append(R, D);
        };
        e.if(I, (R) => {
          c.focusedViewId && R(A);
        });
      }
      e.reset(y), e.append(p, y);
    };
    e.if(d, (p) => {
      u && p(h);
    });
  }
  var v = e.sibling(d, 2);
  {
    var g = (p) => {
      var y = mo();
      e.append(p, y);
    }, f = (p) => {
      var y = e.comment(), m = e.first_child(y);
      e.each(m, 17, () => e.get(a), (b) => b.tier, (b, w) => {
        var x = yo(), I = e.child(x), A = e.child(I, !0);
        e.reset(I);
        var R = e.sibling(I, 2);
        e.each(R, 21, () => e.get(w).items, (D) => D.id, (D, q) => {
          var L = _o();
          let G;
          var Z = e.child(L), E = e.child(Z, !0);
          e.reset(Z);
          var B = e.sibling(Z, 2), $ = e.child(B, !0);
          e.reset(B);
          var F = e.sibling(B, 2);
          {
            var te = (ie) => {
              var X = bo(), fe = e.child(X, !0);
              e.reset(X), e.template_effect(() => e.set_text(fe, e.get(q).scopeBadge)), e.append(ie, X);
            };
            e.if(F, (ie) => {
              e.get(q).scopeBadge && ie(te);
            });
          }
          e.reset(L), e.template_effect(
            (ie) => {
              G = e.set_class(L, 1, "row svelte-151qe3m", null, G, { disabled: e.get(q).effectiveShortcut === null }), e.set_text(E, e.get(q).label), e.set_text($, ie);
            },
            [
              () => fo(e.get(q).effectiveShortcut, r)
            ]
          ), e.append(D, L);
        }), e.reset(R), e.reset(x), e.template_effect(() => e.set_text(A, e.get(w).label)), e.append(b, x);
      }), e.append(p, y);
    };
    e.if(v, (p) => {
      e.get(a).length === 0 ? p(g) : p(f, -1);
    });
  }
  e.reset(o), e.append(n, o), e.pop();
}
var xo = e.from_html('<button class="close-btn svelte-udgkd3" aria-label="Close help">×</button>'), Co = e.from_html('<header class="help-header svelte-udgkd3"><span class="title svelte-udgkd3">Help</span> <!></header>'), So = e.from_html('<span class="tab-icon svelte-udgkd3"> </span>'), Io = e.from_html('<button role="tab"><!> <span> </span></button>'), Po = e.from_html('<div role="tabpanel"></div>'), To = e.from_html('<div class="tab-strip svelte-udgkd3" role="tablist"></div> <div class="tab-bodies svelte-udgkd3"></div>', 1), Ro = e.from_html('<p class="loading svelte-udgkd3">Loading…</p>'), Ao = e.from_html('<div data-sh3-view="sh3-editor:help"><!> <!></div>');
function gi(n, t) {
  e.push(t, !0);
  let r = e.state(null), i = e.state([]), s = [], l = e.state(0);
  const a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  function u(m) {
    if (a.has(m.id)) return;
    const b = c.get(m.id);
    if (!b || !e.get(r)) return;
    const w = {
      surface: t.surface,
      snapshot: e.get(r),
      close: t.surface === "modal" ? t.close : void 0
    };
    if (m.id === "sh3-editor:help-tab:hotkeys") {
      const x = vt(wo, {
        target: b,
        props: { tabCtx: w, actions: s }
      });
      a.set(m.id, { unmount: () => lt(x) });
    } else
      a.set(m.id, m.mount(b, w));
  }
  Yn(() => {
    const m = Es(), b = co({
      getActiveAppId: () => (m == null ? void 0 : m.id) ?? null,
      getSelection: () => t.ctx.actions.selection.get()
    });
    e.set(r, oo(b)), s = Xt.actions.listActive();
    const w = t.ctx.contributions.list(Di);
    e.set(i, ao(w));
  }), Ai(() => {
    var m;
    for (const b of a.values())
      try {
        b.unmount();
      } catch (w) {
        console.warn("[sh3-editor] Help tab unmount error:", w);
      }
    a.clear(), c.clear(), (m = t.onClose) == null || m.call(t);
  }), e.user_effect(() => {
    if (!e.get(r)) return;
    const m = e.get(i)[e.get(l)];
    m && queueMicrotask(() => u(m));
  });
  function o(m, b) {
    c.set(b, m);
    const w = e.get(i)[e.get(l)];
    return w && w.id === b && e.get(r) && u(w), {
      destroy() {
        c.delete(b);
      }
    };
  }
  var d = Ao();
  let h;
  var v = e.child(d);
  {
    var g = (m) => {
      var b = Co(), w = e.sibling(e.child(b), 2);
      {
        var x = (I) => {
          var A = xo();
          e.delegated("click", A, function(...R) {
            var D;
            (D = t.close) == null || D.apply(this, R);
          }), e.append(I, A);
        };
        e.if(w, (I) => {
          t.close && I(x);
        });
      }
      e.reset(b), e.append(m, b);
    };
    e.if(v, (m) => {
      t.surface === "modal" && m(g);
    });
  }
  var f = e.sibling(v, 2);
  {
    var p = (m) => {
      var b = To(), w = e.first_child(b);
      e.each(w, 23, () => e.get(i), (I) => I.id, (I, A, R) => {
        var D = Io();
        let q;
        var L = e.child(D);
        {
          var G = (B) => {
            var $ = So(), F = e.child($, !0);
            e.reset($), e.template_effect(() => e.set_text(F, e.get(A).icon)), e.append(B, $);
          };
          e.if(L, (B) => {
            e.get(A).icon && B(G);
          });
        }
        var Z = e.sibling(L, 2), E = e.child(Z, !0);
        e.reset(Z), e.reset(D), e.template_effect(() => {
          q = e.set_class(D, 1, "tab-btn svelte-udgkd3", null, q, { active: e.get(R) === e.get(l) }), e.set_attribute(D, "aria-selected", e.get(R) === e.get(l)), e.set_text(E, e.get(A).label);
        }), e.delegated("click", D, () => e.set(l, e.get(R), !0)), e.append(I, D);
      }), e.reset(w);
      var x = e.sibling(w, 2);
      e.each(x, 23, () => e.get(i), (I) => I.id, (I, A, R) => {
        var D = Po();
        let q;
        e.action(D, (L, G) => o == null ? void 0 : o(L, G), () => e.get(A).id), e.template_effect(() => q = e.set_class(D, 1, "tab-body svelte-udgkd3", null, q, { active: e.get(R) === e.get(l) })), e.append(I, D);
      }), e.reset(x), e.append(m, b);
    }, y = (m) => {
      var b = Ro();
      e.append(m, b);
    };
    e.if(f, (m) => {
      e.get(i).length > 0 ? m(p) : m(y, -1);
    });
  }
  e.reset(d), e.template_effect(() => h = e.set_class(d, 1, "help-root svelte-udgkd3", null, h, { "modal-surface": t.surface === "modal" })), e.append(n, d), e.pop();
}
e.delegate(["click"]);
var Eo = e.from_html('<span class="icon"> </span>'), zo = e.from_html('<div class="port input svelte-y92dsd"><span class="port-marker svelte-y92dsd"></span> <span class="port-label"> </span></div>'), Do = e.from_html('<div class="port output svelte-y92dsd"><span class="port-label"> </span> <span class="port-marker svelte-y92dsd"></span></div>'), Mo = e.from_html('<div role="button" tabindex="0"><div class="header svelte-y92dsd"><!> <span class="label"> </span></div> <div class="ports svelte-y92dsd"><div class="ports-col inputs svelte-y92dsd"></div> <div class="ports-col outputs svelte-y92dsd"></div></div></div>');
function Lo(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => t.node.ports.filter((p) => p.direction === "input")), i = e.derived(() => t.node.ports.filter((p) => p.direction === "output"));
  var s = Mo();
  let l, a;
  var c = e.child(s), u = e.child(c);
  {
    var o = (p) => {
      var y = Eo(), m = e.child(y, !0);
      e.reset(y), e.template_effect(() => e.set_text(m, t.visuals.icon)), e.append(p, y);
    };
    e.if(u, (p) => {
      t.visuals.icon && p(o);
    });
  }
  var d = e.sibling(u, 2), h = e.child(d, !0);
  e.reset(d), e.reset(c);
  var v = e.sibling(c, 2), g = e.child(v);
  e.each(g, 21, () => e.get(r), (p) => p.shortId, (p, y) => {
    var m = zo(), b = e.sibling(e.child(m), 2), w = e.child(b, !0);
    e.reset(b), e.reset(m), e.template_effect(() => {
      e.set_attribute(m, "data-port-id", e.get(y).shortId), e.set_attribute(m, "data-data-type", e.get(y).dataType ?? ""), e.set_text(w, e.get(y).label);
    }), e.delegated("pointerdown", m, (x) => {
      var I;
      return (I = t.onPortPointerDown) == null ? void 0 : I.call(t, e.get(y), x);
    }), e.delegated("pointerup", m, (x) => {
      var I;
      return (I = t.onPortPointerUp) == null ? void 0 : I.call(t, e.get(y), x);
    }), e.append(p, m);
  }), e.reset(g);
  var f = e.sibling(g, 2);
  e.each(f, 21, () => e.get(i), (p) => p.shortId, (p, y) => {
    var m = Do(), b = e.child(m), w = e.child(b, !0);
    e.reset(b), e.next(2), e.reset(m), e.template_effect(() => {
      e.set_attribute(m, "data-port-id", e.get(y).shortId), e.set_attribute(m, "data-data-type", e.get(y).dataType ?? ""), e.set_text(w, e.get(y).label);
    }), e.delegated("pointerdown", m, (x) => {
      var I;
      return (I = t.onPortPointerDown) == null ? void 0 : I.call(t, e.get(y), x);
    }), e.delegated("pointerup", m, (x) => {
      var I;
      return (I = t.onPortPointerUp) == null ? void 0 : I.call(t, e.get(y), x);
    }), e.append(p, m);
  }), e.reset(f), e.reset(v), e.reset(s), e.template_effect(() => {
    l = e.set_class(s, 1, "graph-node svelte-y92dsd", null, l, { selected: t.selected }), e.set_attribute(s, "data-node-id", t.node.id), a = e.set_style(s, "", a, {
      left: `${t.node.position.x ?? ""}px`,
      top: `${t.node.position.y ?? ""}px`,
      width: `${t.node.width ?? ""}px`,
      "min-height": `${t.node.height ?? ""}px`,
      "--border-color": t.visuals.borderColor,
      "--text-color": t.visuals.textColor ?? "var(--sh3-text-primary, #ddd)"
    }), e.set_text(h, t.node.label);
  }), e.delegated("click", s, (p) => {
    var y;
    return (y = t.onSelectClick) == null ? void 0 : y.call(t, p);
  }), e.delegated("pointerdown", c, (p) => {
    var y;
    return (y = t.onHeaderPointerDown) == null ? void 0 : y.call(t, p);
  }), e.append(n, s), e.pop();
}
e.delegate(["click", "pointerdown", "pointerup"]);
function No(n, t) {
  const r = Math.abs(t.x - n.x), i = Math.max(40, Math.min(160, r * 0.5)), s = { x: n.x + i, y: n.y }, l = { x: t.x - i, y: t.y };
  return `M ${n.x} ${n.y} C ${s.x} ${s.y} ${l.x} ${l.y} ${t.x} ${t.y}`;
}
var Oo = e.from_svg('<path class="halo svelte-1rehop2"></path>'), Bo = e.from_svg('<defs><marker markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z"></path></marker></defs>'), Ho = e.from_svg('<g role="presentation"><!><path class="line svelte-1rehop2"></path><!></g>');
function qo(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => No(t.source, t.target));
  var i = Ho();
  let s;
  var l = e.child(i);
  {
    var a = (d) => {
      var h = Oo();
      e.template_effect(() => e.set_attribute(h, "d", e.get(r))), e.append(d, h);
    };
    e.if(l, (d) => {
      t.selected && d(a);
    });
  }
  var c = e.sibling(l), u = e.sibling(c);
  {
    var o = (d) => {
      var h = Bo(), v = e.child(h), g = e.child(v);
      e.reset(v), e.reset(h), e.template_effect(() => {
        e.set_attribute(v, "id", `arrow-${t.id ?? ""}`), e.set_attribute(g, "fill", t.color);
      }), e.append(d, h);
    };
    e.if(u, (d) => {
      t.oriented && d(o);
    });
  }
  e.reset(i), e.template_effect(() => {
    s = e.set_class(i, 0, "edge svelte-1rehop2", null, s, { selected: t.selected }), e.set_attribute(c, "d", e.get(r)), e.set_attribute(c, "stroke", t.color), e.set_attribute(c, "marker-end", t.oriented ? `url(#arrow-${t.id})` : null);
  }), e.delegated("click", i, (d) => {
    var h;
    return (h = t.onClick) == null ? void 0 : h.call(t, d);
  }), e.append(n, i), e.pop();
}
e.delegate(["click"]);
var Uo = e.from_html('<button class="item svelte-lpiq26"> </button>'), Vo = e.from_html('<div class="cat"><div class="cat-name svelte-lpiq26"> </div> <!></div>'), Fo = e.from_html('<div class="palette svelte-lpiq26"><input class="search svelte-lpiq26" type="text" placeholder="Search node types…"/> <div class="lists svelte-lpiq26"></div></div>');
function jo(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  let r = e.state("");
  const i = e.derived(() => {
    if (!e.get(r)) return t.byCategory;
    const u = e.get(r).toLowerCase(), o = /* @__PURE__ */ new Map();
    for (const [d, h] of t.byCategory) {
      const v = h.filter((g) => g.label.toLowerCase().includes(u) || g.type.toLowerCase().includes(u));
      v.length > 0 && o.set(d, v);
    }
    return o;
  });
  var s = Fo();
  let l;
  var a = e.child(s);
  e.remove_input_defaults(a), e.autofocus(a, !0);
  var c = e.sibling(a, 2);
  e.each(c, 21, () => [...e.get(i)], ([u, o]) => u, (u, o) => {
    var d = e.derived(() => e.to_array(e.get(o), 2));
    let h = () => e.get(d)[0], v = () => e.get(d)[1];
    var g = Vo(), f = e.child(g), p = e.child(f, !0);
    e.reset(f);
    var y = e.sibling(f, 2);
    e.each(y, 17, v, (m) => m.type, (m, b) => {
      var w = Uo(), x = e.child(w, !0);
      e.reset(w), e.template_effect(() => e.set_text(x, e.get(b).label)), e.delegated("click", w, () => t.onPick(e.get(b))), e.append(m, w);
    }), e.reset(g), e.template_effect(() => e.set_text(p, h())), e.append(u, g);
  }), e.reset(c), e.reset(s), e.template_effect(() => l = e.set_style(s, "", l, { left: `${t.x ?? ""}px`, top: `${t.y ?? ""}px` })), e.bind_value(a, () => e.get(r), (u) => e.set(r, u)), e.append(n, s), e.pop();
}
e.delegate(["click"]);
var Go = e.from_html('<div class="toolbar svelte-ypcyd2" role="toolbar" aria-label="Graph viewport"><button type="button" title="Zoom out (Mod+-)" class="svelte-ypcyd2">−</button> <button type="button" title="Reset zoom (Mod+0)" class="zoom-label svelte-ypcyd2"> </button> <button type="button" title="Zoom in (Mod+=)" class="svelte-ypcyd2">+</button> <button type="button" title="Fit content (Shift+1)" class="svelte-ypcyd2">⤢</button></div>');
function Zo(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => `${Math.round(t.zoom * 100)}%`);
  var i = Go(), s = e.child(i), l = e.sibling(s, 2), a = e.child(l, !0);
  e.reset(l);
  var c = e.sibling(l, 2), u = e.sibling(c, 2);
  e.reset(i), e.template_effect(() => e.set_text(a, e.get(r))), e.delegated("click", s, () => t.onZoomOut()), e.delegated("click", l, () => t.onZoomReset()), e.delegated("click", c, () => t.onZoomIn()), e.delegated("click", u, () => t.onFit()), e.append(n, i), e.pop();
}
e.delegate(["click"]);
const _e = Symbol(), Wo = !1;
var Ko = Array.isArray, Yo = Array.prototype.indexOf, Gt = Array.prototype.includes, cr = Object.getOwnPropertyDescriptor, Xo = Object.prototype, Qo = Array.prototype, Jo = Object.getPrototypeOf;
const $o = () => {
};
function ec(n) {
  for (var t = 0; t < n.length; t++)
    n[t]();
}
function tc() {
  var n, t, r = new Promise((i, s) => {
    n = i, t = s;
  });
  return { promise: r, resolve: n, reject: t };
}
const we = 2, br = 4, nc = 8, Qi = 1 << 24, Tt = 16, Zt = 32, hn = 64, rc = 128, Fe = 512, me = 1024, Ie = 2048, $e = 4096, fn = 8192, yt = 16384, xn = 32768, pi = 1 << 25, _r = 1 << 17, ic = 1 << 18, Et = 65536, yr = 1 << 21, qn = 1 << 22, gn = 1 << 23, ur = Symbol("$state"), Br = new class extends Error {
  constructor() {
    super(...arguments);
    N(this, "name", "StaleReactionError");
    N(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
function sc() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function lc() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ac() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function oc() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function cc(n) {
  return n === this.v;
}
let uc = !1;
function Ji() {
  return !0;
}
let Ht = [];
function dc() {
  var n = Ht;
  Ht = [], ec(n);
}
function vi(n) {
  if (Ht.length === 0) {
    var t = Ht;
    queueMicrotask(() => {
      t === Ht && dc();
    });
  }
  Ht.push(n);
}
function fc(n) {
  var t = Pe;
  if (t === null)
    return J.f |= gn, n;
  if ((t.f & xn) === 0 && (t.f & br) === 0)
    throw n;
  $i(n, t);
}
function $i(n, t) {
  for (; t !== null; ) {
    if ((t.f & rc) !== 0) {
      if ((t.f & xn) === 0)
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
const hc = -7169;
function de(n, t) {
  n.f = n.f & hc | t;
}
function Hr(n) {
  (n.f & Fe) !== 0 || n.deps === null ? de(n, me) : de(n, $e);
}
function es(n) {
  if (n !== null)
    for (const t of n)
      (t.f & we) === 0 || (t.f & Et) === 0 || (t.f ^= Et, es(
        /** @type {Derived} */
        t.deps
      ));
}
function gc(n, t, r) {
  (n.f & Ie) !== 0 ? t.add(n) : (n.f & $e) !== 0 && r.add(n), es(n.deps), de(n, me);
}
const St = /* @__PURE__ */ new Set();
let re = null, pe = null, kr = null, dr = !1, Pn = null, Rn = null;
var mi = 0;
let pc = 1;
var qt, Ut, at, Ye, _n, Ae, yn, mt, ot, Xe, Vt, Ft, Pt, oe, An, ts, En, xr, zn, vc;
const Gn = class Gn {
  constructor() {
    Y(this, oe);
    N(this, "id", pc++);
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    N(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    N(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    Y(this, qt, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    Y(this, Ut, /* @__PURE__ */ new Set());
    /**
     * Async effects that are currently in flight
     * @type {Map<Effect, number>}
     */
    Y(this, at, /* @__PURE__ */ new Map());
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    Y(this, Ye, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    Y(this, _n, null);
    /**
     * The root effects that need to be flushed
     * @type {Effect[]}
     */
    Y(this, Ae, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    Y(this, yn, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    Y(this, mt, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    Y(this, ot, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    Y(this, Xe, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    Y(this, Vt, /* @__PURE__ */ new Set());
    N(this, "is_fork", !1);
    Y(this, Ft, !1);
    /** @type {Set<Batch>} */
    Y(this, Pt, /* @__PURE__ */ new Set());
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    C(this, Xe).has(t) || C(this, Xe).set(t, { d: [], m: [] }), C(this, Vt).delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, r = (i) => this.schedule(i)) {
    var i = C(this, Xe).get(t);
    if (i) {
      C(this, Xe).delete(t);
      for (var s of i.d)
        de(s, Ie), r(s);
      for (s of i.m)
        de(s, $e), r(s);
    }
    C(this, Vt).add(t);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, r, i = !1) {
    t.v !== _e && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & gn) === 0 && (this.current.set(t, [r, i]), pe == null || pe.set(t, r)), this.is_fork || (t.v = r);
  }
  activate() {
    re = this;
  }
  deactivate() {
    re = null, pe = null;
  }
  flush() {
    try {
      dr = !0, re = this, le(this, oe, En).call(this);
    } finally {
      mi = 0, kr = null, Pn = null, Rn = null, dr = !1, re = null, pe = null, Rt.clear();
    }
  }
  discard() {
    for (const t of C(this, Ut)) t(this);
    C(this, Ut).clear(), St.delete(this);
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    C(this, yn).push(t);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, r) {
    let i = C(this, at).get(r) ?? 0;
    if (C(this, at).set(r, i + 1), t) {
      let s = C(this, Ye).get(r) ?? 0;
      C(this, Ye).set(r, s + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   * @param {boolean} skip - whether to skip updates (because this is triggered by a stale reaction)
   */
  decrement(t, r, i) {
    let s = C(this, at).get(r) ?? 0;
    if (s === 1 ? C(this, at).delete(r) : C(this, at).set(r, s - 1), t) {
      let l = C(this, Ye).get(r) ?? 0;
      l === 1 ? C(this, Ye).delete(r) : C(this, Ye).set(r, l - 1);
    }
    C(this, Ft) || i || (Nt(this, Ft, !0), vi(() => {
      Nt(this, Ft, !1), this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, r) {
    for (const i of t)
      C(this, mt).add(i);
    for (const i of r)
      C(this, ot).add(i);
    t.clear(), r.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    C(this, qt).add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    C(this, Ut).add(t);
  }
  settled() {
    return (C(this, _n) ?? Nt(this, _n, tc())).promise;
  }
  static ensure() {
    if (re === null) {
      const t = re = new Gn();
      dr || (St.add(re), vi(() => {
        re === t && t.flush();
      }));
    }
    return re;
  }
  apply() {
    {
      pe = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    var s;
    if (kr = t, (s = t.b) != null && s.is_pending && (t.f & (br | nc | Qi)) !== 0 && (t.f & xn) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var r = t; r.parent !== null; ) {
      r = r.parent;
      var i = r.f;
      if (Pn !== null && r === Pe && (J === null || (J.f & we) === 0))
        return;
      if ((i & (hn | Zt)) !== 0) {
        if ((i & me) === 0)
          return;
        r.f ^= me;
      }
    }
    C(this, Ae).push(r);
  }
};
qt = new WeakMap(), Ut = new WeakMap(), at = new WeakMap(), Ye = new WeakMap(), _n = new WeakMap(), Ae = new WeakMap(), yn = new WeakMap(), mt = new WeakMap(), ot = new WeakMap(), Xe = new WeakMap(), Vt = new WeakMap(), Ft = new WeakMap(), Pt = new WeakMap(), oe = new WeakSet(), An = function() {
  return this.is_fork || C(this, Ye).size > 0;
}, ts = function() {
  for (const i of C(this, Pt))
    for (const s of C(i, Ye).keys()) {
      for (var t = !1, r = s; r.parent !== null; ) {
        if (C(this, Xe).has(r)) {
          t = !0;
          break;
        }
        r = r.parent;
      }
      if (!t)
        return !0;
    }
  return !1;
}, En = function() {
  var c, u;
  if (mi++ > 1e3 && (St.delete(this), mc()), !le(this, oe, An).call(this)) {
    for (const o of C(this, mt))
      C(this, ot).delete(o), de(o, Ie), this.schedule(o);
    for (const o of C(this, ot))
      de(o, $e), this.schedule(o);
  }
  const t = C(this, Ae);
  Nt(this, Ae, []), this.apply();
  var r = Pn = [], i = [], s = Rn = [];
  for (const o of t)
    try {
      le(this, oe, xr).call(this, o, r, i);
    } catch (d) {
      throw is(o), d;
    }
  if (re = null, s.length > 0) {
    var l = Gn.ensure();
    for (const o of s)
      l.schedule(o);
  }
  if (Pn = null, Rn = null, le(this, oe, An).call(this) || le(this, oe, ts).call(this)) {
    le(this, oe, zn).call(this, i), le(this, oe, zn).call(this, r);
    for (const [o, d] of C(this, Xe))
      rs(o, d);
  } else {
    C(this, at).size === 0 && St.delete(this), C(this, mt).clear(), C(this, ot).clear();
    for (const o of C(this, qt)) o(this);
    C(this, qt).clear(), bi(i), bi(r), (c = C(this, _n)) == null || c.resolve();
  }
  var a = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    re
  );
  if (C(this, Ae).length > 0) {
    const o = a ?? (a = this);
    C(o, Ae).push(...C(this, Ae).filter((d) => !C(o, Ae).includes(d)));
  }
  a !== null && (St.add(a), le(u = a, oe, En).call(u));
}, /**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 * @param {Effect[]} effects
 * @param {Effect[]} render_effects
 */
xr = function(t, r, i) {
  t.f ^= me;
  for (var s = t.first; s !== null; ) {
    var l = s.f, a = (l & (Zt | hn)) !== 0, c = a && (l & me) !== 0, u = c || (l & fn) !== 0 || C(this, Xe).has(s);
    if (!u && s.fn !== null) {
      a ? s.f ^= me : (l & br) !== 0 ? r.push(s) : Cn(s) && ((l & Tt) !== 0 && C(this, ot).add(s), vn(s));
      var o = s.first;
      if (o !== null) {
        s = o;
        continue;
      }
    }
    for (; s !== null; ) {
      var d = s.next;
      if (d !== null) {
        s = d;
        break;
      }
      s = s.parent;
    }
  }
}, /**
 * @param {Effect[]} effects
 */
zn = function(t) {
  for (var r = 0; r < t.length; r += 1)
    gc(t[r], C(this, mt), C(this, ot));
}, vc = function() {
  var d, h, v;
  for (const g of St) {
    var t = g.id < this.id, r = [];
    for (const [f, [p, y]] of this.current) {
      if (g.current.has(f)) {
        var i = (
          /** @type {[any, boolean]} */
          g.current.get(f)[0]
        );
        if (t && p !== i)
          g.current.set(f, [p, y]);
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
        for (const f of C(this, Vt))
          g.unskip_effect(f, (p) => {
            var y;
            (p.f & (Tt | qn)) !== 0 ? g.schedule(p) : le(y = g, oe, zn).call(y, [p]);
          });
      g.activate();
      var l = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
      for (var c of r)
        ns(c, s, l, a);
      a = /* @__PURE__ */ new Map();
      var u = [...g.current.keys()].filter(
        (f) => this.current.has(f) ? (
          /** @type {[any, boolean]} */
          this.current.get(f)[0] !== f
        ) : !0
      );
      for (const f of C(this, yn))
        (f.f & (yt | fn | _r)) === 0 && qr(f, u, a) && ((f.f & (qn | Tt)) !== 0 ? (de(f, Ie), g.schedule(f)) : C(g, mt).add(f));
      if (C(g, Ae).length > 0) {
        g.apply();
        for (var o of C(g, Ae))
          le(d = g, oe, xr).call(d, o, [], []);
        Nt(g, Ae, []);
      }
      g.deactivate();
    }
  }
  for (const g of St)
    C(g, Pt).has(this) && (C(g, Pt).delete(this), C(g, Pt).size === 0 && !le(h = g, oe, An).call(h) && (g.activate(), le(v = g, oe, En).call(v)));
};
let wr = Gn;
function mc() {
  try {
    sc();
  } catch (n) {
    $i(n, kr);
  }
}
let Be = null;
function bi(n) {
  var t = n.length;
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var i = n[r++];
      if ((i.f & (yt | fn)) === 0 && Cn(i) && (Be = /* @__PURE__ */ new Set(), vn(i), i.deps === null && i.first === null && i.nodes === null && i.teardown === null && i.ac === null && fs(i), (Be == null ? void 0 : Be.size) > 0)) {
        Rt.clear();
        for (const s of Be) {
          if ((s.f & (yt | fn)) !== 0) continue;
          const l = [s];
          let a = s.parent;
          for (; a !== null; )
            Be.has(a) && (Be.delete(a), l.push(a)), a = a.parent;
          for (let c = l.length - 1; c >= 0; c--) {
            const u = l[c];
            (u.f & (yt | fn)) === 0 && vn(u);
          }
        }
        Be.clear();
      }
    }
    Be = null;
  }
}
function ns(n, t, r, i) {
  if (!r.has(n) && (r.add(n), n.reactions !== null))
    for (const s of n.reactions) {
      const l = s.f;
      (l & we) !== 0 ? ns(
        /** @type {Derived} */
        s,
        t,
        r,
        i
      ) : (l & (qn | Tt)) !== 0 && (l & Ie) === 0 && qr(s, t, i) && (de(s, Ie), Ur(
        /** @type {Effect} */
        s
      ));
    }
}
function qr(n, t, r) {
  const i = r.get(n);
  if (i !== void 0) return i;
  if (n.deps !== null)
    for (const s of n.deps) {
      if (Gt.call(t, s))
        return !0;
      if ((s.f & we) !== 0 && qr(
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
function Ur(n) {
  re.schedule(n);
}
function rs(n, t) {
  if (!((n.f & Zt) !== 0 && (n.f & me) !== 0)) {
    (n.f & Ie) !== 0 ? t.d.push(n) : (n.f & $e) !== 0 && t.m.push(n), de(n, me);
    for (var r = n.first; r !== null; )
      rs(r, t), r = r.next;
  }
}
function is(n) {
  de(n, me);
  for (var t = n.first; t !== null; )
    is(t), t = t.next;
}
function bc(n) {
  var t = n.effects;
  if (t !== null) {
    n.effects = null;
    for (var r = 0; r < t.length; r += 1)
      Gr(
        /** @type {Effect} */
        t[r]
      );
  }
}
function _c(n) {
  for (var t = n.parent; t !== null; ) {
    if ((t.f & we) === 0)
      return (t.f & yt) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function Vr(n) {
  var t, r = Pe;
  Un(_c(n));
  try {
    n.f &= ~Et, bc(n), t = vs(n);
  } finally {
    Un(r);
  }
  return t;
}
function ss(n) {
  var t = Vr(n);
  if (!n.equals(t) && (n.wv = gs(), (!(re != null && re.is_fork) || n.deps === null) && (re !== null ? re.capture(n, t, !0) : n.v = t, n.deps === null))) {
    de(n, me);
    return;
  }
  Wt || (pe !== null ? (us() || re != null && re.is_fork) && pe.set(n, t) : Hr(n));
}
function yc(n) {
  var t, r;
  if (n.effects !== null)
    for (const i of n.effects)
      (i.teardown || i.ac) && ((t = i.teardown) == null || t.call(i), (r = i.ac) == null || r.abort(Br), i.teardown = $o, i.ac = null, pn(i, 0), jr(i));
}
function ls(n) {
  if (n.effects !== null)
    for (const t of n.effects)
      t.teardown && vn(t);
}
let Cr = /* @__PURE__ */ new Set();
const Rt = /* @__PURE__ */ new Map();
let as = !1;
function Fr(n, t) {
  var r = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: n,
    reactions: null,
    equals: cc,
    rv: 0,
    wv: 0
  };
  return r;
}
// @__NO_SIDE_EFFECTS__
function Ce(n, t) {
  const r = Fr(n);
  return Pc(r), r;
}
function ve(n, t, r = !1) {
  J !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!_t || (J.f & _r) !== 0) && Ji() && (J.f & (we | Tt | qn | _r)) !== 0 && (De === null || !Gt.call(De, n)) && oc();
  let i = r ? cn(t) : t;
  return kc(n, i, Rn);
}
function kc(n, t, r = null) {
  if (!n.equals(t)) {
    Rt.set(n, Wt ? t : n.v);
    var i = wr.ensure();
    if (i.capture(n, t), (n.f & we) !== 0) {
      const s = (
        /** @type {Derived} */
        n
      );
      (n.f & Ie) !== 0 && Vr(s), pe === null && Hr(s);
    }
    n.wv = gs(), os(n, Ie, r), Pe !== null && (Pe.f & me) !== 0 && (Pe.f & (Zt | hn)) === 0 && (ze === null ? Tc([n]) : ze.push(n)), !i.is_fork && Cr.size > 0 && !as && wc();
  }
  return t;
}
function wc() {
  as = !1;
  for (const n of Cr)
    (n.f & me) !== 0 && de(n, $e), Cn(n) && vn(n);
  Cr.clear();
}
function Ue(n) {
  ve(n, n.v + 1);
}
function os(n, t, r) {
  var i = n.reactions;
  if (i !== null)
    for (var s = i.length, l = 0; l < s; l++) {
      var a = i[l], c = a.f, u = (c & Ie) === 0;
      if (u && de(a, t), (c & we) !== 0) {
        var o = (
          /** @type {Derived} */
          a
        );
        pe == null || pe.delete(o), (c & Et) === 0 && (c & Fe && (a.f |= Et), os(o, $e, r));
      } else if (u) {
        var d = (
          /** @type {Effect} */
          a
        );
        (c & Tt) !== 0 && Be !== null && Be.add(d), r !== null ? r.push(d) : Ur(d);
      }
    }
}
function cn(n) {
  if (typeof n != "object" || n === null || ur in n)
    return n;
  const t = Jo(n);
  if (t !== Xo && t !== Qo)
    return n;
  var r = /* @__PURE__ */ new Map(), i = Ko(n), s = /* @__PURE__ */ Ce(0), l = je, a = (c) => {
    if (je === l)
      return c();
    var u = J, o = je;
    Kt(null), yi(l);
    var d = c();
    return Kt(u), yi(o), d;
  };
  return i && r.set("length", /* @__PURE__ */ Ce(
    /** @type {any[]} */
    n.length
  )), new Proxy(
    /** @type {any} */
    n,
    {
      defineProperty(c, u, o) {
        (!("value" in o) || o.configurable === !1 || o.enumerable === !1 || o.writable === !1) && lc();
        var d = r.get(u);
        return d === void 0 ? a(() => {
          var h = /* @__PURE__ */ Ce(o.value);
          return r.set(u, h), h;
        }) : ve(d, o.value, !0), !0;
      },
      deleteProperty(c, u) {
        var o = r.get(u);
        if (o === void 0) {
          if (u in c) {
            const d = a(() => /* @__PURE__ */ Ce(_e));
            r.set(u, d), Ue(s);
          }
        } else
          ve(o, _e), Ue(s);
        return !0;
      },
      get(c, u, o) {
        var g;
        if (u === ur)
          return n;
        var d = r.get(u), h = u in c;
        if (d === void 0 && (!h || (g = cr(c, u)) != null && g.writable) && (d = a(() => {
          var f = cn(h ? c[u] : _e), p = /* @__PURE__ */ Ce(f);
          return p;
        }), r.set(u, d)), d !== void 0) {
          var v = ue(d);
          return v === _e ? void 0 : v;
        }
        return Reflect.get(c, u, o);
      },
      getOwnPropertyDescriptor(c, u) {
        var o = Reflect.getOwnPropertyDescriptor(c, u);
        if (o && "value" in o) {
          var d = r.get(u);
          d && (o.value = ue(d));
        } else if (o === void 0) {
          var h = r.get(u), v = h == null ? void 0 : h.v;
          if (h !== void 0 && v !== _e)
            return {
              enumerable: !0,
              configurable: !0,
              value: v,
              writable: !0
            };
        }
        return o;
      },
      has(c, u) {
        var v;
        if (u === ur)
          return !0;
        var o = r.get(u), d = o !== void 0 && o.v !== _e || Reflect.has(c, u);
        if (o !== void 0 || Pe !== null && (!d || (v = cr(c, u)) != null && v.writable)) {
          o === void 0 && (o = a(() => {
            var g = d ? cn(c[u]) : _e, f = /* @__PURE__ */ Ce(g);
            return f;
          }), r.set(u, o));
          var h = ue(o);
          if (h === _e)
            return !1;
        }
        return d;
      },
      set(c, u, o, d) {
        var w;
        var h = r.get(u), v = u in c;
        if (i && u === "length")
          for (var g = o; g < /** @type {Source<number>} */
          h.v; g += 1) {
            var f = r.get(g + "");
            f !== void 0 ? ve(f, _e) : g in c && (f = a(() => /* @__PURE__ */ Ce(_e)), r.set(g + "", f));
          }
        if (h === void 0)
          (!v || (w = cr(c, u)) != null && w.writable) && (h = a(() => /* @__PURE__ */ Ce(void 0)), ve(h, cn(o)), r.set(u, h));
        else {
          v = h.v !== _e;
          var p = a(() => cn(o));
          ve(h, p);
        }
        var y = Reflect.getOwnPropertyDescriptor(c, u);
        if (y != null && y.set && y.set.call(d, o), !v) {
          if (i && typeof u == "string") {
            var m = (
              /** @type {Source<number>} */
              r.get("length")
            ), b = Number(u);
            Number.isInteger(b) && b >= m.v && ve(m, b + 1);
          }
          Ue(s);
        }
        return !0;
      },
      ownKeys(c) {
        ue(s);
        var u = Reflect.ownKeys(c).filter((h) => {
          var v = r.get(h);
          return v === void 0 || v.v !== _e;
        });
        for (var [o, d] of r)
          d.v !== _e && !(o in c) && u.push(o);
        return u;
      },
      setPrototypeOf() {
        ac();
      }
    }
  );
}
var xc;
// @__NO_SIDE_EFFECTS__
function Cc(n) {
  return (
    /** @type {TemplateNode | null} */
    xc.call(n)
  );
}
function cs(n) {
  var t = J, r = Pe;
  Kt(null), Un(null);
  try {
    return n();
  } finally {
    Kt(t), Un(r);
  }
}
function us() {
  return J !== null && !_t;
}
function ds(n) {
  var t = n.teardown;
  if (t !== null) {
    const r = Wt, i = J;
    _i(!0), Kt(null);
    try {
      t.call(null);
    } finally {
      _i(r), Kt(i);
    }
  }
}
function jr(n, t = !1) {
  var r = n.first;
  for (n.first = n.last = null; r !== null; ) {
    const s = r.ac;
    s !== null && cs(() => {
      s.abort(Br);
    });
    var i = r.next;
    (r.f & hn) !== 0 ? r.parent = null : Gr(r, t), r = i;
  }
}
function Sc(n) {
  for (var t = n.first; t !== null; ) {
    var r = t.next;
    (t.f & Zt) === 0 && Gr(t), t = r;
  }
}
function Gr(n, t = !0) {
  var r = !1;
  (t || (n.f & ic) !== 0) && n.nodes !== null && n.nodes.end !== null && (Ic(
    n.nodes.start,
    /** @type {TemplateNode} */
    n.nodes.end
  ), r = !0), de(n, pi), jr(n, t && !r), pn(n, 0);
  var i = n.nodes && n.nodes.t;
  if (i !== null)
    for (const l of i)
      l.stop();
  ds(n), n.f ^= pi, n.f |= yt;
  var s = n.parent;
  s !== null && s.first !== null && fs(n), n.next = n.prev = n.teardown = n.ctx = n.deps = n.fn = n.nodes = n.ac = n.b = null;
}
function Ic(n, t) {
  for (; n !== null; ) {
    var r = n === t ? null : /* @__PURE__ */ Cc(n);
    n.remove(), n = r;
  }
}
function fs(n) {
  var t = n.parent, r = n.prev, i = n.next;
  r !== null && (r.next = i), i !== null && (i.prev = r), t !== null && (t.first === n && (t.first = i), t.last === n && (t.last = r));
}
let Dn = !1, Wt = !1;
function _i(n) {
  Wt = n;
}
let J = null, _t = !1;
function Kt(n) {
  J = n;
}
let Pe = null;
function Un(n) {
  Pe = n;
}
let De = null;
function Pc(n) {
  J !== null && (De === null ? De = [n] : De.push(n));
}
let Se = null, Re = 0, ze = null;
function Tc(n) {
  ze = n;
}
let hs = 1, It = 0, je = It;
function yi(n) {
  je = n;
}
function gs() {
  return ++hs;
}
function Cn(n) {
  var t = n.f;
  if ((t & Ie) !== 0)
    return !0;
  if (t & we && (n.f &= ~Et), (t & $e) !== 0) {
    for (var r = (
      /** @type {Value[]} */
      n.deps
    ), i = r.length, s = 0; s < i; s++) {
      var l = r[s];
      if (Cn(
        /** @type {Derived} */
        l
      ) && ss(
        /** @type {Derived} */
        l
      ), l.wv > n.wv)
        return !0;
    }
    (t & Fe) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    pe === null && de(n, me);
  }
  return !1;
}
function ps(n, t, r = !0) {
  var i = n.reactions;
  if (i !== null && !(De !== null && Gt.call(De, n)))
    for (var s = 0; s < i.length; s++) {
      var l = i[s];
      (l.f & we) !== 0 ? ps(
        /** @type {Derived} */
        l,
        t,
        !1
      ) : t === l && (r ? de(l, Ie) : (l.f & me) !== 0 && de(l, $e), Ur(
        /** @type {Effect} */
        l
      ));
    }
}
function vs(n) {
  var f;
  var t = Se, r = Re, i = ze, s = J, l = De, a = _t, c = je, u = n.f;
  Se = /** @type {null | Value[]} */
  null, Re = 0, ze = null, J = (u & (Zt | hn)) === 0 ? n : null, De = null, n.ctx, _t = !1, je = ++It, n.ac !== null && (cs(() => {
    n.ac.abort(Br);
  }), n.ac = null);
  try {
    n.f |= yr;
    var o = (
      /** @type {Function} */
      n.fn
    ), d = o();
    n.f |= xn;
    var h = n.deps, v = re == null ? void 0 : re.is_fork;
    if (Se !== null) {
      var g;
      if (v || pn(n, Re), h !== null && Re > 0)
        for (h.length = Re + Se.length, g = 0; g < Se.length; g++)
          h[Re + g] = Se[g];
      else
        n.deps = h = Se;
      if (us() && (n.f & Fe) !== 0)
        for (g = Re; g < h.length; g++)
          ((f = h[g]).reactions ?? (f.reactions = [])).push(n);
    } else !v && h !== null && Re < h.length && (pn(n, Re), h.length = Re);
    if (Ji() && ze !== null && !_t && h !== null && (n.f & (we | $e | Ie)) === 0)
      for (g = 0; g < /** @type {Source[]} */
      ze.length; g++)
        ps(
          ze[g],
          /** @type {Effect} */
          n
        );
    if (s !== null && s !== n) {
      if (It++, s.deps !== null)
        for (let p = 0; p < r; p += 1)
          s.deps[p].rv = It;
      if (t !== null)
        for (const p of t)
          p.rv = It;
      ze !== null && (i === null ? i = ze : i.push(.../** @type {Source[]} */
      ze));
    }
    return (n.f & gn) !== 0 && (n.f ^= gn), d;
  } catch (p) {
    return fc(p);
  } finally {
    n.f ^= yr, Se = t, Re = r, ze = i, J = s, De = l, _t = a, je = c;
  }
}
function Rc(n, t) {
  let r = t.reactions;
  if (r !== null) {
    var i = Yo.call(r, n);
    if (i !== -1) {
      var s = r.length - 1;
      s === 0 ? r = t.reactions = null : (r[i] = r[s], r.pop());
    }
  }
  if (r === null && (t.f & we) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (Se === null || !Gt.call(Se, t))) {
    var l = (
      /** @type {Derived} */
      t
    );
    (l.f & Fe) !== 0 && (l.f ^= Fe, l.f &= ~Et), l.v !== _e && Hr(l), yc(l), pn(l, 0);
  }
}
function pn(n, t) {
  var r = n.deps;
  if (r !== null)
    for (var i = t; i < r.length; i++)
      Rc(n, r[i]);
}
function vn(n) {
  var t = n.f;
  if ((t & yt) === 0) {
    de(n, me);
    var r = Pe, i = Dn;
    Pe = n, Dn = !0;
    try {
      (t & (Tt | Qi)) !== 0 ? Sc(n) : jr(n), ds(n);
      var s = vs(n);
      n.teardown = typeof s == "function" ? s : null, n.wv = hs;
      var l;
      Wo && uc && (n.f & Ie) !== 0 && n.deps;
    } finally {
      Dn = i, Pe = r;
    }
  }
}
function ue(n) {
  var t = n.f, r = (t & we) !== 0;
  if (J !== null && !_t) {
    var i = Pe !== null && (Pe.f & yt) !== 0;
    if (!i && (De === null || !Gt.call(De, n))) {
      var s = J.deps;
      if ((J.f & yr) !== 0)
        n.rv < It && (n.rv = It, Se === null && s !== null && s[Re] === n ? Re++ : Se === null ? Se = [n] : Se.push(n));
      else {
        (J.deps ?? (J.deps = [])).push(n);
        var l = n.reactions;
        l === null ? n.reactions = [J] : Gt.call(l, J) || l.push(J);
      }
    }
  }
  if (Wt && Rt.has(n))
    return Rt.get(n);
  if (r) {
    var a = (
      /** @type {Derived} */
      n
    );
    if (Wt) {
      var c = a.v;
      return ((a.f & me) === 0 && a.reactions !== null || bs(a)) && (c = Vr(a)), Rt.set(a, c), c;
    }
    var u = (a.f & Fe) === 0 && !_t && J !== null && (Dn || (J.f & Fe) !== 0), o = (a.f & xn) === 0;
    Cn(a) && (u && (a.f |= Fe), ss(a)), u && !o && (ls(a), ms(a));
  }
  if (pe != null && pe.has(n))
    return pe.get(n);
  if ((n.f & gn) !== 0)
    throw n.v;
  return n.v;
}
function ms(n) {
  if (n.f |= Fe, n.deps !== null)
    for (const t of n.deps)
      (t.reactions ?? (t.reactions = [])).push(n), (t.f & we) !== 0 && (t.f & Fe) === 0 && (ls(
        /** @type {Derived} */
        t
      ), ms(
        /** @type {Derived} */
        t
      ));
}
function bs(n) {
  if (n.v === _e) return !0;
  if (n.deps === null) return !1;
  for (const t of n.deps)
    if (Rt.has(t) || (t.f & we) !== 0 && bs(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
var Ac = ["forEach", "isDisjointFrom", "isSubsetOf", "isSupersetOf"], Ec = ["difference", "intersection", "symmetricDifference", "union"], ki = !1, jt, He, bt, Zn, Yt, _s, ys;
const Wn = class Wn extends Set {
  /**
   * @param {Iterable<T> | null | undefined} [value]
   */
  constructor(r) {
    super();
    Y(this, Yt);
    /** @type {Map<T, Source<boolean>>} */
    Y(this, jt, /* @__PURE__ */ new Map());
    Y(this, He, /* @__PURE__ */ Ce(0));
    Y(this, bt, /* @__PURE__ */ Ce(0));
    Y(this, Zn, je || -1);
    if (r) {
      for (var i of r)
        super.add(i);
      C(this, bt).v = super.size;
    }
    ki || le(this, Yt, ys).call(this);
  }
  /** @param {T} value */
  has(r) {
    var i = super.has(r), s = C(this, jt), l = s.get(r);
    if (l === void 0) {
      if (!i)
        return ue(C(this, He)), !1;
      l = le(this, Yt, _s).call(this, !0), s.set(r, l);
    }
    return ue(l), i;
  }
  /** @param {T} value */
  add(r) {
    return super.has(r) || (super.add(r), ve(C(this, bt), super.size), Ue(C(this, He))), this;
  }
  /** @param {T} value */
  delete(r) {
    var i = super.delete(r), s = C(this, jt), l = s.get(r);
    return l !== void 0 && (s.delete(r), ve(l, !1)), i && (ve(C(this, bt), super.size), Ue(C(this, He))), i;
  }
  clear() {
    if (super.size !== 0) {
      super.clear();
      var r = C(this, jt);
      for (var i of r.values())
        ve(i, !1);
      r.clear(), ve(C(this, bt), 0), Ue(C(this, He));
    }
  }
  keys() {
    return this.values();
  }
  values() {
    return ue(C(this, He)), super.values();
  }
  entries() {
    return ue(C(this, He)), super.entries();
  }
  [Symbol.iterator]() {
    return this.keys();
  }
  get size() {
    return ue(C(this, bt));
  }
};
jt = new WeakMap(), He = new WeakMap(), bt = new WeakMap(), Zn = new WeakMap(), Yt = new WeakSet(), /**
 * If the source is being created inside the same reaction as the SvelteSet instance,
 * we use `state` so that it will not be a dependency of the reaction. Otherwise we
 * use `source` so it will be.
 *
 * @template T
 * @param {T} value
 * @returns {Source<T>}
 */
_s = function(r) {
  return je === C(this, Zn) ? /* @__PURE__ */ Ce(r) : Fr(r);
}, // We init as part of the first instance so that we can treeshake this class
ys = function() {
  ki = !0;
  var r = Wn.prototype, i = Set.prototype;
  for (const s of Ac)
    r[s] = function(...l) {
      return ue(C(this, He)), i[s].apply(this, l);
    };
  for (const s of Ec)
    r[s] = function(...l) {
      ue(C(this, He));
      var a = (
        /** @type {Set<T>} */
        i[s].apply(this, l)
      );
      return new Wn(a);
    };
};
let Sr = Wn;
var Qe, Je, ct, Kn, Ve, un, Mn;
const Wr = class Wr extends Map {
  /**
   * @param {Iterable<readonly [K, V]> | null | undefined} [value]
   */
  constructor(r) {
    super();
    Y(this, Ve);
    /** @type {Map<K, Source<number>>} */
    Y(this, Qe, /* @__PURE__ */ new Map());
    Y(this, Je, /* @__PURE__ */ Ce(0));
    Y(this, ct, /* @__PURE__ */ Ce(0));
    Y(this, Kn, je || -1);
    if (r) {
      for (var [i, s] of r)
        super.set(i, s);
      C(this, ct).v = super.size;
    }
  }
  /** @param {K} key */
  has(r) {
    var i = C(this, Qe), s = i.get(r);
    if (s === void 0)
      if (super.has(r))
        s = le(this, Ve, un).call(this, 0), i.set(r, s);
      else
        return ue(C(this, Je)), !1;
    return ue(s), !0;
  }
  /**
   * @param {(value: V, key: K, map: Map<K, V>) => void} callbackfn
   * @param {any} [this_arg]
   */
  forEach(r, i) {
    le(this, Ve, Mn).call(this), super.forEach(r, i);
  }
  /** @param {K} key */
  get(r) {
    var i = C(this, Qe), s = i.get(r);
    if (s === void 0)
      if (super.has(r))
        s = le(this, Ve, un).call(this, 0), i.set(r, s);
      else {
        ue(C(this, Je));
        return;
      }
    return ue(s), super.get(r);
  }
  /**
   * @param {K} key
   * @param {V} value
   * */
  set(r, i) {
    var h;
    var s = C(this, Qe), l = s.get(r), a = super.get(r), c = super.set(r, i), u = C(this, Je);
    if (l === void 0)
      l = le(this, Ve, un).call(this, 0), s.set(r, l), ve(C(this, ct), super.size), Ue(u);
    else if (a !== i) {
      Ue(l);
      var o = u.reactions === null ? null : new Set(u.reactions), d = o === null || !((h = l.reactions) != null && h.every(
        (v) => (
          /** @type {NonNullable<typeof v_reactions>} */
          o.has(v)
        )
      ));
      d && Ue(u);
    }
    return c;
  }
  /** @param {K} key */
  delete(r) {
    var i = C(this, Qe), s = i.get(r), l = super.delete(r);
    return s !== void 0 && (i.delete(r), ve(s, -1)), l && (ve(C(this, ct), super.size), Ue(C(this, Je))), l;
  }
  clear() {
    if (super.size !== 0) {
      super.clear();
      var r = C(this, Qe);
      ve(C(this, ct), 0);
      for (var i of r.values())
        ve(i, -1);
      Ue(C(this, Je)), r.clear();
    }
  }
  keys() {
    return ue(C(this, Je)), super.keys();
  }
  values() {
    return le(this, Ve, Mn).call(this), super.values();
  }
  entries() {
    return le(this, Ve, Mn).call(this), super.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get size() {
    return ue(C(this, ct)), super.size;
  }
};
Qe = new WeakMap(), Je = new WeakMap(), ct = new WeakMap(), Kn = new WeakMap(), Ve = new WeakSet(), /**
 * If the source is being created inside the same reaction as the SvelteMap instance,
 * we use `state` so that it will not be a dependency of the reaction. Otherwise we
 * use `source` so it will be.
 *
 * @template T
 * @param {T} value
 * @returns {Source<T>}
 */
un = function(r) {
  return je === C(this, Kn) ? /* @__PURE__ */ Ce(r) : Fr(r);
}, Mn = function() {
  ue(C(this, Je));
  var r = C(this, Qe);
  if (C(this, ct).v !== r.size) {
    for (var i of ri(Wr.prototype, this, "keys").call(this))
      if (!r.has(i)) {
        var s = le(this, Ve, un).call(this, 0);
        r.set(i, s);
      }
  }
  for ([, s] of C(this, Qe))
    ue(s);
};
let Vn = Wr;
function Ln(n, t) {
  const r = `${n}_`;
  return t.startsWith(r) ? t.slice(r.length) : t;
}
function zc(n, t, r) {
  const i = t.getNodeVisuals(n.type), s = n.ports.map((c) => ({
    ...c,
    shortId: Ln(n.id, c.id)
  })), l = t.getTemplates().find((c) => c.type === n.type), a = l ? Zr(l, n.config, r) : [];
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
function Ir(n, t) {
  const r = /* @__PURE__ */ new Map();
  for (const a of n.nodes)
    r.set(a.id, new Set(a.ports.map((c) => c.id)));
  const i = /* @__PURE__ */ new Map();
  for (const a of n.edges) {
    const c = r.get(a.targetNodeId), u = r.get(a.sourceNodeId);
    if (!(c != null && c.has(a.targetPortId)) || !(u != null && u.has(a.sourcePortId))) continue;
    let o = i.get(a.targetNodeId);
    o || (o = /* @__PURE__ */ new Set(), i.set(a.targetNodeId, o)), o.add(Ln(a.targetNodeId, a.targetPortId));
  }
  const s = new Vn();
  for (const a of n.nodes) {
    const c = i.get(a.id) ?? /* @__PURE__ */ new Set();
    s.set(a.id, zc(a, t, c));
  }
  const l = new Vn();
  for (const a of n.edges) {
    const c = r.get(a.targetNodeId), u = r.get(a.sourceNodeId);
    if (!(c != null && c.has(a.targetPortId)) || !(u != null && u.has(a.sourcePortId))) {
      console.warn(`graph: dropping edge ${a.id} with missing endpoint`, a);
      continue;
    }
    l.set(a.id, {
      id: a.id,
      sourceNodeId: a.sourceNodeId,
      sourcePortId: Ln(a.sourceNodeId, a.sourcePortId),
      targetNodeId: a.targetNodeId,
      targetPortId: Ln(a.targetNodeId, a.targetPortId)
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
    selection: new Sr()
  };
}
const Dc = {
  number: "number",
  boolean: "boolean",
  string: "string"
};
function Zr(n, t, r) {
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
    const a = l.dataType ? Dc[l.dataType] : void 0;
    a && i.push({
      key: l.id,
      label: l.label,
      type: a,
      disabled: r.has(l.id)
    });
  }
  return i;
}
function wi(n, t) {
  return t.startsWith(`${n}_`) ? t : `${n}_${t}`;
}
function ks(n) {
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
      sourcePortId: wi(s.sourceNodeId, s.sourcePortId),
      targetNodeId: s.targetNodeId,
      targetPortId: wi(s.targetNodeId, s.targetPortId)
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
function Mc(n, t) {
  const r = `${n}_`;
  return t.startsWith(r) ? t.slice(r.length) : t;
}
function Lc(n, t, r) {
  const i = t.getNodeVisuals(n.type), s = n.ports.map((a) => ({ ...a, shortId: Mc(n.id, a.id) })), l = t.getTemplates().find((a) => a.type === n.type);
  return {
    id: n.id,
    type: n.type,
    label: t.resolveLabel(n.type, n.config),
    ports: s,
    config: { ...n.config },
    configFields: l ? Zr(l, n.config, r) : [],
    position: { ...n.position },
    width: i.defaultWidth ?? t.defaultNodeWidth,
    height: i.defaultHeight ?? t.defaultNodeHeight
  };
}
function Fn(n, t, r) {
  const i = n.nodes.get(r);
  if (!i) return;
  const s = /* @__PURE__ */ new Set();
  for (const u of n.edges.values())
    u.targetNodeId === r && s.add(u.targetPortId);
  const l = t.getTemplates().find((u) => u.type === i.type), a = l ? Zr(l, i.config, s) : [], c = t.resolveLabel(i.type, i.config);
  n.nodes.set(r, { ...i, configFields: a, label: c });
}
function xi(n, t, r) {
  return {
    meta: { kind: "add-node" },
    apply() {
      n.nodes.set(r.id, Lc(r, t, /* @__PURE__ */ new Set()));
    },
    revert() {
      n.nodes.delete(r.id), n.selection.delete(r.id);
    }
  };
}
function Nc(n, t, r, i) {
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
function Oc(n, t, r, i, s, l) {
  function a(c, u) {
    if (i.length === 0) return c;
    const o = structuredClone(c.config);
    let d = o;
    for (let h = 0; h < i.length - 1; h++) d = d[i[h]];
    return d[i[i.length - 1]] = u, { ...c, config: o };
  }
  return {
    meta: { kind: "set-node-config" },
    apply() {
      const c = n.nodes.get(r);
      c && (n.nodes.set(r, a(c, l)), Fn(n, t, r));
    },
    revert() {
      const c = n.nodes.get(r);
      c && (n.nodes.set(r, a(c, s)), Fn(n, t, r));
    }
  };
}
function Bc(n, t) {
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
function Hc(n, t, r) {
  let i = [], s = [];
  return {
    meta: { kind: "remove-selection" },
    apply() {
      i = [], s = [];
      const l = new Set(r);
      for (const a of l) {
        const c = n.edges.get(a);
        c && (s.push(c), n.edges.delete(a));
      }
      for (const a of l) {
        const c = n.nodes.get(a);
        if (c) {
          for (const [u, o] of n.edges)
            (o.sourceNodeId === a || o.targetNodeId === a) && (s.push(o), n.edges.delete(u));
          i.push(c), n.nodes.delete(a);
        }
      }
      n.selection.clear();
      for (const a of s) Fn(n, t, a.targetNodeId);
    },
    revert() {
      for (const l of i) n.nodes.set(l.id, l);
      for (const l of s) n.edges.set(l.id, l);
      for (const l of s) Fn(n, t, l.targetNodeId);
    }
  };
}
function qc(n, t, r) {
  let i = null;
  return {
    meta: { kind: "replace-asset" },
    apply() {
      i = ks(n);
      const s = Ir(r, t);
      n.id = s.id, n.domainId = s.domainId, n.name = s.name, n.version = s.version, n.metadata = s.metadata, n.nodes.clear();
      for (const [l, a] of s.nodes) n.nodes.set(l, a);
      n.edges.clear();
      for (const [l, a] of s.edges) n.edges.set(l, a);
      n.selection.clear();
    },
    revert() {
      if (!i) return;
      const s = Ir(i, t);
      n.id = s.id, n.domainId = s.domainId, n.name = s.name, n.version = s.version, n.metadata = s.metadata, n.nodes.clear();
      for (const [l, a] of s.nodes) n.nodes.set(l, a);
      n.edges.clear();
      for (const [l, a] of s.edges) n.edges.set(l, a);
      n.selection.clear();
    }
  };
}
let jn = null;
function Uc(n) {
  jn = n;
}
function st() {
  return jn;
}
function Vc(n) {
  jn === n && (jn = null);
}
function Pr(n) {
  return Math.min(3, Math.max(0.2, n));
}
function Ci(n, t, r) {
  const i = n.x - t.left, s = n.y - t.top;
  return {
    x: (i - r.x) / r.zoom,
    y: (s - r.y) / r.zoom
  };
}
function Fc(n, t, r = 80) {
  const i = Array.from(n);
  if (i.length === 0) return { x: 0, y: 0, zoom: 1 };
  let s = 1 / 0, l = 1 / 0, a = -1 / 0, c = -1 / 0;
  for (const y of i)
    y.position.x < s && (s = y.position.x), y.position.y < l && (l = y.position.y), y.position.x + y.width > a && (a = y.position.x + y.width), y.position.y + y.height > c && (c = y.position.y + y.height);
  const u = a - s, o = c - l, d = Math.max(1, t.w - 2 * r), h = Math.max(1, t.h - 2 * r), v = Math.min(d / u, h / o, 1), g = Pr(v), f = (s + a) / 2, p = (l + c) / 2;
  return {
    x: t.w / 2 - f * g,
    y: t.h / 2 - p * g,
    zoom: g
  };
}
var jc = e.from_svg('<path class="edge-ghost" stroke="var(--sh3-accent, #4a9eff)" fill="none" stroke-dasharray="4 3"></path>'), Gc = e.from_html('<div class="graph-canvas svelte-x16tu1" tabindex="0"><div class="viewport svelte-x16tu1"><svg class="edge-overlay svelte-x16tu1"><!><!></svg> <!></div> <!> <!></div>');
function Zc(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  function r(_) {
    return t.domain.getNodeVisuals(_.type);
  }
  function i(_, S, z) {
    const O = _.ports.find((nt) => nt.shortId === S);
    if (!O) return { x: _.position.x, y: _.position.y };
    const U = _.ports.filter((nt) => nt.direction === "input"), V = _.ports.filter((nt) => nt.direction === "output"), ge = (z === "input" ? U : V).indexOf(O), Ze = 26, ft = 22, tt = _.position.y + Ze + 8 + ge * ft + ft / 2;
    return { x: z === "output" ? _.position.x + _.width : _.position.x, y: tt };
  }
  function s(_) {
    const S = t.state.nodes.get(_.sourceNodeId);
    return S ? i(S, _.sourcePortId, "output") : { x: 0, y: 0 };
  }
  function l(_) {
    const S = t.state.nodes.get(_.targetNodeId);
    return S ? i(S, _.targetPortId, "input") : { x: 0, y: 0 };
  }
  function a(_) {
    var O;
    const S = t.state.nodes.get(_.sourceNodeId);
    if (!S) return "#888";
    const z = S.ports.find((U) => U.shortId === _.sourcePortId);
    return z != null && z.dataType ? ((O = r(S).portColors) == null ? void 0 : O[z.dataType]) ?? "#888" : "#888";
  }
  function c(_, S) {
    var z;
    S ? t.state.selection.has(_) ? t.state.selection.delete(_) : t.state.selection.add(_) : (t.state.selection.clear(), t.state.selection.add(_)), (z = t.onSelectionChange) == null || z.call(t, Array.from(t.state.selection));
  }
  function u() {
    var _;
    t.state.selection.size !== 0 && (t.state.selection.clear(), (_ = t.onSelectionChange) == null || _.call(t, []));
  }
  let o = e.state(null);
  function d(_, S) {
    t.state.readonly || (S.stopPropagation(), S.currentTarget.setPointerCapture(S.pointerId), e.set(
      o,
      {
        nodeId: _.id,
        start: { x: S.clientX, y: S.clientY },
        origin: { ..._.position }
      },
      !0
    ));
  }
  function h(_) {
    if (!e.get(o)) return;
    const S = t.state.nodes.get(e.get(o).nodeId);
    if (!S) return;
    const z = (_.clientX - e.get(o).start.x) / e.get(w).zoom, O = (_.clientY - e.get(o).start.y) / e.get(w).zoom;
    t.state.nodes.set(e.get(o).nodeId, {
      ...S,
      position: {
        x: e.get(o).origin.x + z,
        y: e.get(o).origin.y + O
      }
    });
  }
  function v(_) {
    var z;
    if (!e.get(o)) return;
    const S = t.state.nodes.get(e.get(o).nodeId);
    if (S && (S.position.x !== e.get(o).origin.x || S.position.y !== e.get(o).origin.y)) {
      const O = Nc(t.state, e.get(o).nodeId, e.get(o).origin, { ...S.position });
      t.history.push(O), (z = t.onAssetChanged) == null || z.call(t);
    }
    e.set(o, null);
  }
  let g = e.state(null);
  function f(_, S, z) {
    t.state.readonly || (z.stopPropagation(), z.currentTarget.setPointerCapture(z.pointerId), e.set(
      g,
      {
        source: {
          nodeId: _.id,
          portId: S.shortId,
          direction: S.direction,
          dataType: S.dataType
        },
        cursor: { x: z.clientX, y: z.clientY }
      },
      !0
    ));
  }
  function p(_) {
    if (h(_), e.get(g) && e.get(x)) {
      const S = e.get(x).getBoundingClientRect();
      e.get(g).cursor = Ci({ x: _.clientX, y: _.clientY }, S, e.get(w));
    }
    if (e.get(A) && e.get(A).pointerId === _.pointerId) {
      const S = _.clientX - e.get(A).startX, z = _.clientY - e.get(A).startY;
      !e.get(A).panning && Math.abs(S) + Math.abs(z) > I && (e.get(A).panning = !0), e.get(A).panning && e.set(
        w,
        {
          ...e.get(w),
          x: e.get(A).originVx + S,
          y: e.get(A).originVy + z
        },
        !0
      );
    }
  }
  function y(_, S, z) {
    var Q;
    if (!e.get(g)) return;
    z.stopPropagation();
    const O = e.get(g).source;
    if (e.set(g, null), S.direction !== "input" || t.domain.edgeSemantics === "oriented" && O.direction !== "output" || O.nodeId === _.id || t.domain.canConnect && !t.domain.canConnect(
      {
        nodeId: O.nodeId,
        portId: O.portId,
        direction: O.direction,
        dataType: O.dataType
      },
      {
        nodeId: _.id,
        portId: S.shortId,
        direction: S.direction,
        dataType: S.dataType
      }
    )) return;
    const U = `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, V = Bc(t.state, {
      id: U,
      sourceNodeId: O.nodeId,
      sourcePortId: O.portId,
      targetNodeId: _.id,
      targetPortId: S.shortId
    });
    V.apply(), t.history.push(V), (Q = t.onAssetChanged) == null || Q.call(t);
  }
  function m(_) {
    if (v(), e.set(g, null), e.get(A) && e.get(A).pointerId === _.pointerId) {
      const S = e.get(A).panning;
      e.set(A, null), S && e.set(R, !0);
    }
  }
  let b = e.state(null), w = e.state(e.proxy({ x: 0, y: 0, zoom: 1 })), x = e.state(null);
  const I = 4;
  let A = e.state(null), R = e.state(!1);
  function D(_) {
    _.target === _.currentTarget && _.button === 0 && (_.currentTarget.setPointerCapture(_.pointerId), e.set(
      A,
      {
        pointerId: _.pointerId,
        startX: _.clientX,
        startY: _.clientY,
        originVx: e.get(w).x,
        originVy: e.get(w).y,
        panning: !1
      },
      !0
    ));
  }
  function q(_) {
    if (e.get(R)) {
      e.set(R, !1);
      return;
    }
    if (t.state.readonly || _.target !== _.currentTarget) return;
    const S = _.currentTarget.getBoundingClientRect(), z = Ci({ x: _.clientX, y: _.clientY }, S, e.get(w));
    t.domain.useNodePalette ? (e.set(b, { x: _.clientX - S.left, y: _.clientY - S.top }, !0), e.set(L, z, !0)) : G(z);
  }
  let L = e.state(null);
  function G(_) {
    var U;
    const z = {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: "",
      position: { x: _.x, y: _.y },
      config: {},
      ports: []
    }, O = xi(t.state, t.domain, z);
    O.apply(), t.history.push(O), (U = t.onAssetChanged) == null || U.call(t);
  }
  function Z(_) {
    var Q;
    const S = e.get(L);
    if (!S) return;
    const z = `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, O = _.ports.map((ge) => ({ ...ge, id: `${z}_${ge.id}` })), U = {
      id: z,
      type: _.type,
      position: { ...S },
      config: { ..._.defaultConfig },
      ports: O
    }, V = xi(t.state, t.domain, U);
    V.apply(), t.history.push(V), (Q = t.onAssetChanged) == null || Q.call(t), e.set(b, null), e.set(L, null);
  }
  const E = e.derived(() => Array.from(t.state.nodes.values())), B = e.derived(() => Array.from(t.state.edges.values())), $ = e.derived(() => t.domain.edgeSemantics === "oriented"), F = 1.2;
  function te(_, S) {
    const z = Pr(_), O = S ?? (e.get(x) ? {
      x: e.get(x).clientWidth / 2,
      y: e.get(x).clientHeight / 2
    } : { x: 0, y: 0 }), U = (O.x - e.get(w).x) / e.get(w).zoom, V = (O.y - e.get(w).y) / e.get(w).zoom;
    e.set(w, { x: O.x - U * z, y: O.y - V * z, zoom: z }, !0);
  }
  function ie(_) {
    te(e.get(w).zoom * F, _);
  }
  function X(_) {
    te(e.get(w).zoom / F, _);
  }
  function fe() {
    te(1);
  }
  function kt() {
    if (!e.get(x)) return;
    const _ = Fc(Array.from(t.state.nodes.values()), {
      w: e.get(x).clientWidth,
      h: e.get(x).clientHeight
    });
    e.set(w, _, !0);
  }
  function Dt() {
    e.set(b, null), e.set(L, null);
  }
  const Ge = {
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
      var _;
      return (_ = t.onAssetChanged) == null ? void 0 : _.call(t);
    },
    onSelectionChange: (_) => {
      var S;
      return (S = t.onSelectionChange) == null ? void 0 : S.call(t, _);
    },
    zoomIn: (_) => ie(_),
    zoomOut: (_) => X(_),
    zoomReset: () => fe(),
    fitContent: () => kt(),
    dismissPalette: () => Dt()
  };
  e.user_effect(() => () => Vc(Ge));
  function Me() {
    Uc(Ge);
  }
  function wt(_) {
    _.currentTarget.focus({ preventScroll: !0 });
  }
  function Mt(_) {
    if (!e.get(x)) return;
    _.preventDefault();
    const S = e.get(x).getBoundingClientRect(), z = _.clientX - S.left, O = _.clientY - S.top, U = (z - e.get(w).x) / e.get(w).zoom, V = (O - e.get(w).y) / e.get(w).zoom, Q = Pr(e.get(w).zoom * (1 - _.deltaY * 1e-3));
    e.set(w, { x: z - U * Q, y: O - V * Q, zoom: Q }, !0);
  }
  e.user_effect(() => {
    if (!e.get(x)) return;
    const _ = e.get(x), S = (z) => Mt(z);
    return _.addEventListener("wheel", S, { passive: !1 }), () => _.removeEventListener("wheel", S);
  });
  var ce = Gc(), xe = e.child(ce);
  let Le;
  var he = e.child(xe), ye = e.child(he);
  e.each(ye, 17, () => e.get(B), (_) => _.id, (_, S) => {
    {
      let z = e.derived(() => s(e.get(S))), O = e.derived(() => l(e.get(S))), U = e.derived(() => a(e.get(S))), V = e.derived(() => t.state.selection.has(e.get(S).id));
      qo(_, {
        get id() {
          return e.get(S).id;
        },
        get source() {
          return e.get(z);
        },
        get target() {
          return e.get(O);
        },
        get color() {
          return e.get(U);
        },
        get oriented() {
          return e.get($);
        },
        get selected() {
          return e.get(V);
        },
        onClick: (Q) => {
          Q.stopPropagation(), c(e.get(S).id, Q.ctrlKey || Q.metaKey);
        }
      });
    }
  });
  var et = e.sibling(ye);
  {
    var Ne = (_) => {
      const S = e.derived(() => t.state.nodes.get(e.get(g).source.nodeId));
      var z = e.comment(), O = e.first_child(z);
      {
        var U = (V) => {
          const Q = e.derived(() => i(e.get(S), e.get(g).source.portId, e.get(g).source.direction === "output" ? "output" : "input"));
          var ge = jc();
          e.template_effect(() => e.set_attribute(ge, "d", `M ${e.get(Q).x} ${e.get(Q).y} L ${e.get(g).cursor.x} ${e.get(g).cursor.y}`)), e.append(V, ge);
        };
        e.if(O, (V) => {
          e.get(S) && V(U);
        });
      }
      e.append(_, z);
    };
    e.if(et, (_) => {
      e.get(g) && _(Ne);
    });
  }
  e.reset(he);
  var Qt = e.sibling(he, 2);
  e.each(Qt, 17, () => e.get(E), (_) => _.id, (_, S) => {
    {
      let z = e.derived(() => r(e.get(S))), O = e.derived(() => t.state.selection.has(e.get(S).id));
      Lo(_, {
        get node() {
          return e.get(S);
        },
        get visuals() {
          return e.get(z);
        },
        get selected() {
          return e.get(O);
        },
        onSelectClick: (U) => {
          U.stopPropagation(), c(e.get(S).id, U.ctrlKey || U.metaKey);
        },
        onHeaderPointerDown: (U) => d(e.get(S), U),
        onPortPointerDown: (U, V) => f(e.get(S), U, V),
        onPortPointerUp: (U, V) => y(e.get(S), U, V)
      });
    }
  }), e.reset(xe);
  var T = e.sibling(xe, 2);
  {
    var H = (_) => {
      {
        let S = e.derived(() => t.domain.getTemplatesByCategory());
        jo(_, {
          get byCategory() {
            return e.get(S);
          },
          get x() {
            return e.get(b).x;
          },
          get y() {
            return e.get(b).y;
          },
          onPick: Z,
          onClose: () => e.set(b, null)
        });
      }
    };
    e.if(T, (_) => {
      e.get(b) && _(H);
    });
  }
  var ae = e.sibling(T, 2);
  Zo(ae, {
    get zoom() {
      return e.get(w).zoom;
    },
    onZoomIn: () => ie(),
    onZoomOut: () => X(),
    onZoomReset: () => fe(),
    onFit: () => kt()
  }), e.reset(ce), e.bind_this(ce, (_) => e.set(x, _), () => e.get(x)), e.template_effect(() => Le = e.set_style(xe, "", Le, {
    transform: `translate(${e.get(w).x ?? ""}px, ${e.get(w).y ?? ""}px) scale(${e.get(w).zoom ?? ""})`,
    "transform-origin": "0 0"
  })), e.delegated("focusin", ce, Me), e.event("pointerdown", ce, wt, !0), e.delegated("pointerdown", ce, D), e.delegated("pointermove", ce, p), e.delegated("pointerup", ce, m), e.event("pointercancel", ce, m), e.delegated("click", ce, (_) => {
    _.target === _.currentTarget && (u(), e.get(b) ? (e.set(b, null), e.set(L, null)) : q(_));
  }), e.append(n, ce), e.pop();
}
e.delegate([
  "focusin",
  "pointerdown",
  "pointermove",
  "pointerup",
  "click"
]);
var Wc = e.from_html('<li class="svelte-1dbihe0"><code class="svelte-1dbihe0"> </code><span class="dash svelte-1dbihe0">—</span><span class="label svelte-1dbihe0"> </span></li>'), Kc = e.from_html('<h3 class="svelte-1dbihe0">Registered domains</h3> <ul class="domain-list svelte-1dbihe0"></ul>', 1), Yc = e.from_html('<p class="warn svelte-1dbihe0">No graph domains registered. Install or activate a shard that provides one.</p>'), Xc = e.from_html('<div class="graph-empty svelte-1dbihe0"><h2 class="svelte-1dbihe0">No graph open</h2> <p class="hint svelte-1dbihe0">A consumer shard binds a graph by registering a <code>GraphViewDescriptor</code> at <code>sh3-editor.graph-view</code>.</p> <!></div>');
function Qc(n, t) {
  e.push(t, !0);
  var r = Xc(), i = e.sibling(e.child(r), 4);
  {
    var s = (a) => {
      var c = Kc(), u = e.sibling(e.first_child(c), 2);
      e.each(u, 21, () => t.domains, (o) => o.id, (o, d) => {
        var h = Wc(), v = e.child(h), g = e.child(v, !0);
        e.reset(v);
        var f = e.sibling(v, 2), p = e.child(f, !0);
        e.reset(f), e.reset(h), e.template_effect(() => {
          e.set_text(g, e.get(d).id), e.set_text(p, e.get(d).label);
        }), e.append(o, h);
      }), e.reset(u), e.append(a, c);
    }, l = (a) => {
      var c = Yc();
      e.append(a, c);
    };
    e.if(i, (a) => {
      t.domains.length > 0 ? a(s) : a(l, -1);
    });
  }
  e.reset(r), e.append(n, r), e.pop();
}
function Jc(n, t, r) {
  const i = r.filter((s) => s.slotId === n);
  return i.length > 1 && console.warn(`graph: multiple GraphViewDescriptor matches for slot ${n}; using first`, i), i.length >= 1 ? { kind: "descriptor", descriptor: i[0] } : t && t.asset && t.domainId ? {
    kind: "meta",
    asset: t.asset,
    domainId: t.domainId,
    onChange: t.onChange,
    readonly: t.readonly
  } : { kind: "empty" };
}
function $c(n) {
  const t = { fields: {} };
  for (const r of n) {
    const i = { label: r.label };
    r.rendererHint && (i.type = r.rendererHint), r.disabled && (i.readonly = !0), t.fields[r.key] = i;
  }
  return t;
}
function eu(n, t) {
  let r = n;
  for (const i of t) r = r == null ? void 0 : r[i];
  return r;
}
function tu(n, t, r, i, s, l) {
  return (a, c) => {
    if ((s == null ? void 0 : s(n, a, c)) === !0) return !0;
    const o = t.nodes.get(n);
    if (!o) return !0;
    const d = eu(o.config, a);
    if (d === c) return !0;
    const h = Oc(t, r, n, a, d, c);
    return h.apply(), i.push(h), l(), !0;
  };
}
function nu() {
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
function ru(n, t, r, i, s) {
  const l = nu();
  let a = !0;
  const c = /* @__PURE__ */ new Set();
  function u() {
    const o = Array.from(n.selection);
    for (const d of c) d(o);
  }
  return {
    setAsset(o) {
      if (!a) return;
      const d = qc(n, t, o);
      d.apply(), l.push(d);
    },
    getAsset() {
      return ks(n);
    },
    select(o) {
      if (a) {
        n.selection.clear();
        for (const d of o) n.selection.add(d);
        u();
      }
    },
    clearSelection() {
      if (a) {
        if (n.selection.size === 0) {
          u();
          return;
        }
        n.selection.clear(), u();
      }
    },
    focus(o) {
    },
    fitToContent() {
    },
    history: l,
    onSelectionChange(o) {
      return c.add(o), () => c.delete(o);
    },
    getSelectedInspectorBinding() {
      if (!a) return null;
      const o = Array.from(n.selection);
      if (o.length !== 1) return null;
      const d = o[0], h = n.nodes.get(d);
      return h ? {
        value: h.config,
        meta: $c(h.configFields),
        onCommit: tu(
          h.id,
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
var iu = e.from_html('<div class="graph-error svelte-39j3n"><h2 class="svelte-39j3n">Graph error</h2> <p> </p></div>');
function su(n, t) {
  e.push(t, !0), e.rest_props(t, ["$$slots", "$$events", "$$legacy"]);
  const r = e.derived(() => Jc(t.slotId, t.meta, t.descriptors));
  let i = e.state(null), s = e.state(null), l = e.state(null), a = e.state(null);
  e.user_effect(() => {
    var g, f, p;
    if (e.get(r).kind === "descriptor" || e.get(r).kind === "meta") {
      const y = e.get(r).kind === "descriptor" ? e.get(r).descriptor.domainId : e.get(r).domainId, m = t.domains.get(y);
      if (!m) {
        e.set(a, `Domain "${y}" is not registered. Install or activate the shard that provides it.`), e.set(i, null), e.set(s, null), e.set(l, null);
        return;
      }
      e.set(a, null), e.set(s, m, !0);
      const b = e.get(r).kind === "descriptor" ? e.get(r).descriptor.initial : e.get(r).asset, w = Ir(b, m);
      e.set(i, w, !0);
      const x = () => {
        var R, D;
        if (e.get(r).kind === "descriptor")
          try {
            e.get(r).descriptor.onChange(e.get(l).getAsset());
          } catch (q) {
            console.warn("graph: onChange threw", q);
          }
        else e.get(r).kind === "meta" && ((D = (R = e.get(r)).onChange) == null || D.call(R, e.get(l).getAsset()));
      }, I = e.get(r).kind === "descriptor" ? e.get(r).descriptor : void 0, A = ru(w, m, I, x);
      if (e.set(l, A, !0), e.get(r).kind === "descriptor")
        try {
          (f = (g = e.get(r).descriptor).bind) == null || f.call(g, A);
        } catch (R) {
          console.warn("graph: descriptor.bind threw", R);
        }
      (p = t.onControllerReady) == null || p.call(t, A);
    } else
      e.set(i, null), e.set(s, null), e.set(l, null), e.set(a, null);
    return () => {
      var y;
      (y = e.get(l)) == null || y._kill(), e.set(l, null);
    };
  });
  const c = e.derived(() => {
    const g = e.get(l);
    return g ? g.history : null;
  });
  var u = e.comment(), o = e.first_child(u);
  {
    var d = (g) => {
      var f = iu(), p = e.sibling(e.child(f), 2), y = e.child(p, !0);
      e.reset(p), e.reset(f), e.template_effect(() => e.set_text(y, e.get(a))), e.append(g, f);
    }, h = (g) => {
      {
        let f = e.derived(() => t.domains.list());
        Qc(g, {
          get domains() {
            return e.get(f);
          }
        });
      }
    }, v = (g) => {
      Zc(g, {
        get state() {
          return e.get(i);
        },
        get domain() {
          return e.get(s);
        },
        get history() {
          return e.get(c);
        },
        onSelectionChange: () => {
        }
      });
    };
    e.if(o, (g) => {
      e.get(a) ? g(d) : e.get(r).kind === "empty" ? g(h, 1) : e.get(i) && e.get(s) && e.get(c) && g(v, 2);
    });
  }
  e.append(n, u), e.pop();
}
function lu(n) {
  return {
    log: (t, r, ...i) => {
      (t === "debug" ? console.debug : t === "info" ? console.info : t === "warn" ? console.warn : console.error)(`[graph:${n}] ${r}`, ...i);
    }
  };
}
function au() {
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
      const l = s(lu(r));
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
const Si = "sh3-editor.graph-domain", Ii = "sh3-editor.graph-view", ou = "sh3-editor.document";
function Pi(n) {
  const {
    slotId: t,
    contributions: r,
    registry: i,
    internals: s,
    defaultOptions: l,
    warn: a = console.warn
  } = n, u = r.list(ou).filter((g) => g.slotId === t);
  u.length > 1 && a(
    `[sh3-editor] Multiple EditorDocumentContribution descriptors registered for slotId="${t}"; using the first registered.`
  );
  const o = u[0], d = o ? uu(o.seed) : l, h = i.get(t) ?? i.open(t, d), v = [];
  if (o != null && o.bind) {
    const g = cu(t, h, s), f = o.bind(g);
    typeof f == "function" && v.push(f);
  }
  return o != null && o.onContentChange && v.push(s.contentChange.on((g, f) => {
    g === t && o.onContentChange(f);
  })), o != null && o.onDirtyChange && v.push(s.dirtyChange.on((g, f) => {
    g === t && o.onDirtyChange(f);
  })), o != null && o.onSave && v.push(s.saveEvent.on((g) => {
    g === t && o.onSave();
  })), o != null && o.onPrefsChange && v.push(s.prefsChange.on((g, f) => {
    g === t && o.onPrefsChange(f);
  })), {
    entry: h,
    cleanup() {
      for (const g of v)
        try {
          g();
        } catch (f) {
          console.warn("[sh3-editor] bindDocument cleanup error", f);
        }
      v.length = 0;
    },
    onLinkClick: o == null ? void 0 : o.onLinkClick
  };
}
function cu(n, t, r) {
  return (i) => {
    i.content !== void 0 && i.content !== t.document.content && (t.document.content = i.content, t.document.cursorStart = 0, t.document.cursorEnd = 0, t.document.dirty = !1, r.history(n).clear(), r.contentChange.emit(n, i.content), r.dirtyChange.emit(n, !1)), i.filePath !== void 0 && (t.document.filePath = i.filePath), i.language !== void 0 && (t.document.language = i.language), i.matchingConfig !== void 0 && (t.options.matchingConfig = i.matchingConfig), i.prefs !== void 0 && (t.prefs = { ...t.prefs, ...i.prefs }), i.fontSize !== void 0 && (t.options.fontSize = i.fontSize), i.showSettings !== void 0 && (t.options.showSettings = i.showSettings), i.toolbarActions !== void 0 && (t.options.toolbarActions = i.toolbarActions), i.highlight !== void 0 && (t.options.highlight = i.highlight), i.render !== void 0 && (t.options.render = i.render), i.transform !== void 0 && (t.options.transform = i.transform), i.startInPreview !== void 0 && (t.options.startInPreview = i.startInPreview);
  };
}
function uu(n) {
  const t = { content: n.content };
  return n.filePath !== void 0 && n.filePath !== null && (t.filePath = n.filePath), n.language !== void 0 && n.language !== null && (t.language = n.language), n.matchingConfig !== void 0 && (t.matchingConfig = n.matchingConfig), n.prefs !== void 0 && (t.prefs = n.prefs), n.fontSize !== void 0 && (t.fontSize = n.fontSize), n.showSettings !== void 0 && (t.showSettings = n.showSettings), n.toolbarActions !== void 0 && (t.toolbarActions = n.toolbarActions), n.highlight !== void 0 && (t.highlight = n.highlight), n.render !== void 0 && (t.render = n.render), n.transform !== void 0 && (t.transform = n.transform), n.startInPreview !== void 0 && (t.startInPreview = n.startInPreview), t;
}
function du(n) {
  const {
    slotId: t,
    contributions: r,
    internals: i,
    warn: s = console.warn
  } = n, a = r.list(Ys).filter((d) => d.slotId === t);
  a.length > 1 && s(
    `[sh3-editor] Multiple InspectorInstanceContribution descriptors registered for slotId="${t}"; using the first registered.`
  );
  const c = a[0], u = c ? i.inspectors.get(t) ?? i.inspectors.open(t, hu(c.seed, c.onCommit)) : i.inspectors.get(t), o = [];
  if (c != null && c.bind && u) {
    const d = {
      replace: fu(t, u, i),
      history: i.history(t)
    }, h = c.bind(d);
    typeof h == "function" && o.push(h);
  }
  return c != null && c.onValueChange && o.push(i.inspectorValueChange.on((d, h) => {
    d === t && c.onValueChange(h);
  })), {
    entry: u,
    cleanup() {
      for (const d of o)
        try {
          d();
        } catch (h) {
          console.warn("[sh3-editor] bindInspector cleanup error", h);
        }
      o.length = 0;
    }
  };
}
function fu(n, t, r) {
  return (i) => {
    "value" in i && i.value !== t.value && (t.value = i.value, r.inspectors.bumpVersion(), r.history(n).clear(), r.inspectorValueChange.emit(n, i.value)), "meta" in i && (t.meta = i.meta), "readonly" in i && (t.options.readonly = i.readonly ?? !1), "toolbarActions" in i && (t.options.toolbarActions = i.toolbarActions ?? []);
  };
}
function hu(n, t) {
  const r = { value: n.value };
  return n.meta !== void 0 && (r.meta = n.meta), n.readonly !== void 0 && (r.readonly = n.readonly), n.toolbarActions !== void 0 && (r.toolbarActions = n.toolbarActions), t !== void 0 && (r.onCommit = t), r;
}
let ht = null, Tr = null, gt = null, rn = null, sn = null, ln = null, an = null, pt = null, on = null;
function bu() {
  return Tr;
}
const Ti = {
  manifest: {
    id: "sh3-editor",
    label: "Editor",
    views: [
      { id: "sh3-editor:editor", label: "Editor", standalone: !0 },
      { id: "sh3-editor:reader", label: "Reader", standalone: !0 },
      { id: "sh3-editor:inspector", label: "Inspector", standalone: !0 },
      { id: "sh3-editor:color-picker", label: "Color Picker", standalone: !0 },
      { id: "sh3-editor:settings", label: "Settings", standalone: !0 },
      { id: "sh3-editor:help", label: "Help", standalone: !0 },
      { id: "sh3-editor:graph", label: "Graph", standalone: !0 }
    ]
  },
  activate(n) {
    ht = new Ns();
    const { api: t, internals: r, teardown: i } = Ks(ht);
    Tr = t, gt = r, rn = i, Ti.api = t;
    const s = () => {
      ii(n.contributions.list(ir));
    };
    s(), sn = n.contributions.onChange(ir, s);
    const l = n.state({
      user: { colorPickerPalettes: [] }
    });
    function a(f) {
      const p = l.user.colorPickerPalettes, y = p.findIndex((m) => m.id === f.id);
      y === -1 ? p.push(f) : p[y] = f;
    }
    function c(f) {
      const p = l.user.colorPickerPalettes, y = p.findIndex((m) => m.id === f);
      y !== -1 && p.splice(y, 1);
    }
    li({
      internals: r,
      userPalettes: l.user.colorPickerPalettes,
      onSaveUserPalette: a,
      onDeleteUserPalette: c
    });
    const u = {
      id: "sh3-editor:color",
      type: "color",
      component: Oa,
      priority: 10
    };
    ln = n.contributions.register(ir, u);
    const o = {
      id: "sh3-editor:color-picker",
      priority: 10,
      open: (f) => ol(f, {
        userPalettes: l.user.colorPickerPalettes,
        onSaveUserPalette: a,
        onDeleteUserPalette: c
      })
    };
    an = n.contributions.register(zs, o);
    const d = {
      content: "Hello, World"
    };
    n.registerView("sh3-editor:editor", {
      mount(f, p) {
        const y = p.slotId, m = Pi({
          slotId: y,
          contributions: n.contributions,
          registry: ht,
          internals: gt,
          defaultOptions: d
        }), { entry: b, cleanup: w } = m, x = b.options, I = vt(ya, {
          target: f,
          props: {
            entry: b,
            internals: gt,
            highlight: x.highlight,
            matchingConfig: x.matchingConfig,
            fontSize: x.fontSize,
            toolbarActions: x.toolbarActions,
            showSettings: x.showSettings,
            render: x.render,
            transform: x.transform,
            startInPreview: x.startInPreview,
            onLinkClick: m.onLinkClick
          }
        });
        return {
          closable: !0,
          unmount() {
            w(), lt(I);
          }
        };
      }
    }), n.registerView("sh3-editor:reader", {
      mount(f, p) {
        const y = p.slotId, m = Pi({
          slotId: y,
          contributions: n.contributions,
          registry: ht,
          internals: gt,
          defaultOptions: d
        }), { entry: b, cleanup: w } = m, x = b.options, I = vt(wa, {
          target: f,
          props: {
            entry: b,
            toolbarActions: x.toolbarActions,
            render: x.render,
            transform: x.transform,
            onLinkClick: m.onLinkClick
          }
        });
        return {
          closable: !0,
          unmount() {
            w(), lt(I);
          }
        };
      }
    }), n.registerView("sh3-editor:inspector", {
      mount(f, p) {
        const y = p.slotId, m = du({
          slotId: y,
          contributions: n.contributions,
          internals: gt
        }), b = p.meta, w = vt(za, {
          target: f,
          props: {
            instanceId: y,
            adHocValue: b == null ? void 0 : b.value,
            adHocMeta: b == null ? void 0 : b.meta,
            adHocReadonly: (b == null ? void 0 : b.readonly) ?? !1,
            internals: gt
          }
        });
        return {
          closable: !0,
          unmount() {
            m.cleanup(), lt(w);
          }
        };
      }
    }), n.registerView("sh3-editor:color-picker", {
      mount(f, p) {
        const y = p.slotId, m = r.colorPickers.get(y), b = p.meta, w = n.contributions.list(cl), x = ul(y, m, w, b), I = vt(Xi, {
          target: f,
          props: {
            instanceId: y,
            adHocValue: x.kind === "adhoc" ? x.adHocValue : void 0,
            adHocReadonly: x.kind === "adhoc" ? x.adHocReadonly : !1,
            internals: gt,
            prefs: (m == null ? void 0 : m.options.prefs) ?? { mode: "hsv" },
            compact: (m == null ? void 0 : m.options.compact) ?? !1,
            userPalettes: l.user.colorPickerPalettes,
            onSaveUserPalette: a,
            onDeleteUserPalette: c,
            descriptorBinding: x.kind === "descriptor" ? x.descriptor : void 0
          }
        });
        return {
          closable: !0,
          unmount() {
            lt(I);
          }
        };
      }
    }), pt = au();
    const h = () => {
      pt.clear();
      const f = n.contributions.list(Si);
      for (const p of f) pt.register(p);
    };
    h(), on = n.contributions.onChange(Si, h), n.registerView("sh3-editor:graph", {
      mount(f, p) {
        const y = p.slotId, m = p.meta;
        let b = null;
        const w = () => {
          b && (lt(b), b = null);
          const I = n.contributions.list(Ii);
          b = vt(su, {
            target: f,
            props: {
              slotId: y,
              meta: m,
              descriptors: I,
              domains: pt
            }
          });
        };
        w();
        const x = n.contributions.onChange(Ii, w);
        return {
          closable: !0,
          unmount() {
            x(), b && (lt(b), b = null);
          }
        };
      }
    }), n.registerView("sh3-editor:settings", {
      mount(f) {
        const p = vt(lo, {
          target: f,
          props: { ctx: n }
        });
        return {
          closable: !0,
          unmount() {
            lt(p);
          }
        };
      }
    }), n.registerView("sh3-editor:help", {
      mount(f) {
        const p = vt(gi, {
          target: f,
          props: { surface: "view", ctx: n }
        });
        return {
          closable: !0,
          unmount() {
            lt(p);
          }
        };
      }
    });
    const v = {
      id: "sh3-editor:help-tab:hotkeys",
      label: "Hotkeys",
      priority: 0,
      mount() {
        return { unmount() {
        } };
      }
    };
    n.contributions.register(
      Di,
      v
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
        g || (g = !0, Xt.modal.open(
          gi,
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
        const f = st();
        if (!f || f.state.readonly || f.state.selection.size === 0) return;
        const p = Array.from(f.state.selection), y = Hc(f.state, f.domain, p);
        y.apply(), f.history.push(y), f.onSelectionChange([]), f.onAssetChanged();
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
        const f = st();
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
        const f = st();
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
        const f = st();
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
        (f = st()) == null || f.zoomIn();
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
        (f = st()) == null || f.zoomOut();
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
        (f = st()) == null || f.zoomReset();
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
        (f = st()) == null || f.fitContent();
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
        (f = st()) == null || f.dismissPalette();
      }
    });
  },
  deactivate() {
    on == null || on(), on = null, pt == null || pt.clear(), pt = null, ln == null || ln(), ln = null, an == null || an(), an = null, li(null), sn == null || sn(), sn = null, rn == null || rn(), ht == null || ht.clear(), ii([]), ht = null, Tr = null, gt = null, rn = null, Ti.api = null;
  }
};
export {
  bu as getApi,
  Ti as shard
};
