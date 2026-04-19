import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node20',
    ssr: true,
    outDir: 'dist/server',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['sh3-core', /^sh3-core\//, 'sh3-server', /^sh3-server\//, 'hono', /^hono\//, /^node:/],
    },
    minify: false,
  },
  ssr: {
    noExternal: [],
  },
});
