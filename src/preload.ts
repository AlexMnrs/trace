import { contextBridge, ipcRenderer } from 'electron';

import {
  IPC_CHANNELS,
  type ActionResponse,
  type SearchResponse,
  type TraceBridge,
} from './shared/contracts';

const traceBridge: TraceBridge = {
  searchFiles: (query: string) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.searchFiles,
      query,
    ) as Promise<SearchResponse>,
  openFile: (path: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.openFile, path) as Promise<ActionResponse>,
  showInFolder: (path: string) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.showInFolder,
      path,
    ) as Promise<ActionResponse>,
};

contextBridge.exposeInMainWorld('trace', traceBridge);
