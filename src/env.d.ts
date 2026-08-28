/// <reference types="vite/client" />

import type { TraceBridge } from './shared/contracts';

declare global {
  const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
  const MAIN_WINDOW_VITE_NAME: string;

  interface Window {
    trace: TraceBridge;
  }
}

export {};
