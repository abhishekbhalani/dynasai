import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  envPrefix: ['VITE_', 'PUBLIC_'],
  envDir: fileURLToPath(new URL('..', import.meta.url)),
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: '/admin-app/',
  publicDir: false,
  build: {
    outDir: fileURLToPath(new URL('../dist/admin-app', import.meta.url)),
    emptyOutDir: true,
    sourcemap: false,
  },
});
