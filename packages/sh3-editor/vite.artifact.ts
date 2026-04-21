import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sh3CssInline, sh3Artifact } from 'sh3-core/build';

export default defineConfig({
  plugins: [svelte(), sh3CssInline(), sh3Artifact()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'sh3-editor',
    },
    outDir: 'dist/artifact',
    rollupOptions: {
      // Keep svelte + its internal runtime external (the SH3 host provides them
      // via its import map). svelte/reactivity is INTENTIONALLY bundled — the
      // host doesn't map that subpath, so SvelteMap has to ride along. Its own
      // imports of svelte/internal/client stay external, so the reactive signal
      // graph is still the host's.
      external: [
        'sh3-core',
        /^sh3-core\//,
        'svelte',
        /^svelte\/internal/,
      ],
    },
  },
});
