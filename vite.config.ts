import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: '/AI_Bridge/',

  plugins: [
    react(),
    tailwindcss(),
    process.env.ANALYZE === '1' &&
      visualizer({
        filename: 'dist/stats.json',
        template: 'raw-data',
        gzipSize: true,
        brotliSize: true,
      }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: true,
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
