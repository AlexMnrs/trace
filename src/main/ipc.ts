import { existsSync } from 'node:fs';
import { isAbsolute } from 'node:path';

import { ipcMain, shell } from 'electron';

import {
  IPC_CHANNELS,
  SEARCH_RESULT_LIMIT,
  type ActionResponse,
  type SearchResponse,
} from '../shared/contracts';
import { SearchBackendError, type SearchBackend } from './search-backend';

const invalidPathResponse: ActionResponse = {
  ok: false,
  message: 'The selected file path is not valid.',
};

export function registerIpcHandlers(searchBackend: SearchBackend): void {
  ipcMain.handle(
    IPC_CHANNELS.searchFiles,
    async (_event, query: unknown): Promise<SearchResponse> => {
      if (typeof query !== 'string' || query.trim().length === 0) {
        return { ok: true, results: [] };
      }

      try {
        const results = await searchBackend.search(
          query.slice(0, 256),
          SEARCH_RESULT_LIMIT,
        );
        return { ok: true, results };
      } catch (error) {
        if (error instanceof SearchBackendError) {
          return { ok: false, code: error.code, message: error.message };
        }

        return {
          ok: false,
          code: 'search_failed',
          message: 'Trace could not complete the file search.',
        };
      }
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.openFile,
    async (_event, path: unknown): Promise<ActionResponse> => {
      if (typeof path !== 'string' || !isAbsolute(path)) {
        return invalidPathResponse;
      }

      try {
        const errorMessage = await shell.openPath(path);
        return errorMessage
          ? { ok: false, message: errorMessage }
          : { ok: true };
      } catch {
        return { ok: false, message: 'Trace could not open the file.' };
      }
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.showInFolder,
    async (_event, path: unknown): Promise<ActionResponse> => {
      if (typeof path !== 'string' || !isAbsolute(path) || !existsSync(path)) {
        return {
          ok: false,
          message: 'The selected file no longer exists.',
        };
      }

      try {
        shell.showItemInFolder(path);
        return { ok: true };
      } catch {
        return {
          ok: false,
          message: 'Trace could not show the file location.',
        };
      }
    },
  );
}
