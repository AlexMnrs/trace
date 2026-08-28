import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    // Vite resolves outDir from root; keep Forge's packaged renderer at the
    // repository-level .vite path expected by the Electron main process.
    outDir: '../.vite/renderer/main_window',
  },
  plugins: [react()],
});
