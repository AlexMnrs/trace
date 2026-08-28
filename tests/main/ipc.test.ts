import { ipcMain, shell, type IpcMainInvokeEvent } from 'electron';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { registerIpcHandlers } from '../../src/main/ipc';
import type { SearchBackend } from '../../src/main/search-backend';
import { IPC_CHANNELS } from '../../src/shared/contracts';

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
  },
  shell: {
    openPath: vi.fn(),
    showItemInFolder: vi.fn(),
  },
}));

describe('registerIpcHandlers', () => {
  const event = {} as IpcMainInvokeEvent;
  const search = vi.fn();
  const backend: SearchBackend = { search };

  beforeEach(() => {
    vi.clearAllMocks();
    registerIpcHandlers(backend);
  });

  function handlerFor(channel: string) {
    const registration = vi
      .mocked(ipcMain.handle)
      .mock.calls.find(([registeredChannel]) => registeredChannel === channel);

    if (!registration) {
      throw new Error(`Missing IPC handler for ${channel}`);
    }

    return registration[1];
  }

  it('forwards search queries to the backend with the visible result limit', async () => {
    search.mockResolvedValueOnce([]);

    await handlerFor(IPC_CHANNELS.searchFiles)(event, 'notes');

    expect(search).toHaveBeenCalledWith('notes', 24);
  });

  it('opens an existing absolute file through Electron', async () => {
    vi.mocked(shell.openPath).mockResolvedValueOnce('');

    const result = await handlerFor(IPC_CHANNELS.openFile)(
      event,
      '/tmp/trace-note.txt',
    );

    expect(shell.openPath).toHaveBeenCalledWith('/tmp/trace-note.txt');
    expect(result).toEqual({ ok: true });
  });

  it('reveals an existing absolute file through Electron', async () => {
    const result = await handlerFor(IPC_CHANNELS.showInFolder)(event, '/tmp');

    expect(shell.showItemInFolder).toHaveBeenCalledWith('/tmp');
    expect(result).toEqual({ ok: true });
  });
});
