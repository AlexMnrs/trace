import { join } from 'node:path';

import { app, BrowserWindow } from 'electron';

import { registerIpcHandlers } from './main/ipc';
import { PlocateSearchBackend } from './main/plocate-search-backend';

registerIpcHandlers(new PlocateSearchBackend());

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 1000,
    minHeight: 650,
    useContentSize: true,
    title: 'Trace',
    backgroundColor: '#0b0d10',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(
      join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
