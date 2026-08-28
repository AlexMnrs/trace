import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IPC_CHANNELS } from '../src/shared/contracts';

const exposeInMainWorld = vi.fn();
const invoke = vi.fn();

vi.mock('electron', () => ({
  contextBridge: { exposeInMainWorld },
  ipcRenderer: { invoke },
}));

describe('preload bridge', () => {
  beforeEach(async () => {
    vi.resetModules();
    exposeInMainWorld.mockClear();
    invoke.mockClear();
    await import('../src/preload');
  });

  it('exposes only the three approved operations', () => {
    expect(exposeInMainWorld).toHaveBeenCalledOnce();
    const [namespace, bridge] = exposeInMainWorld.mock.calls[0] as [
      string,
      Record<string, unknown>,
    ];

    expect(namespace).toBe('trace');
    expect(Object.keys(bridge).sort()).toEqual([
      'openFile',
      'searchFiles',
      'showInFolder',
    ]);
  });

  it('routes bridge calls to the expected IPC channels', async () => {
    const bridge = exposeInMainWorld.mock.calls[0][1] as {
      searchFiles(query: string): Promise<unknown>;
      openFile(path: string): Promise<unknown>;
      showInFolder(path: string): Promise<unknown>;
    };

    await bridge.searchFiles('project');
    await bridge.openFile('/tmp/project.txt');
    await bridge.showInFolder('/tmp/project.txt');

    expect(invoke.mock.calls).toEqual([
      [IPC_CHANNELS.searchFiles, 'project'],
      [IPC_CHANNELS.openFile, '/tmp/project.txt'],
      [IPC_CHANNELS.showInFolder, '/tmp/project.txt'],
    ]);
  });
});
