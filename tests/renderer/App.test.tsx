import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '../../src/renderer/App';
import type {
  FileSearchResult,
  SearchResponse,
  TraceBridge,
} from '../../src/shared/contracts';

const result: FileSearchResult = {
  id: '/home/lex/project-plan.md',
  name: 'project-plan.md',
  path: '/home/lex/project-plan.md',
};

function waitForDebounce(): Promise<void> {
  return act(
    () => new Promise((resolve) => setTimeout(resolve, 220)),
  ) as Promise<void>;
}

describe('App', () => {
  let bridge: TraceBridge;

  beforeEach(() => {
    bridge = {
      searchFiles: vi.fn().mockResolvedValue({ ok: true, results: [result] }),
      openFile: vi.fn().mockResolvedValue({ ok: true }),
      showInFolder: vi.fn().mockResolvedValue({ ok: true }),
    };
    window.trace = bridge;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('searches, selects a result, and runs both file actions', async () => {
    render(<App />);

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'project' },
    });
    await waitForDebounce();

    const card = await screen.findByRole('button', {
      name: /project-plan\.md/,
    });
    fireEvent.click(card);
    fireEvent.click(screen.getByRole('button', { name: 'OPEN' }));
    fireEvent.click(screen.getByRole('button', { name: 'SHOW LOCATION' }));

    expect(bridge.searchFiles).toHaveBeenCalledWith('project');
    expect(bridge.openFile).toHaveBeenCalledWith(result.path);
    expect(bridge.showInFolder).toHaveBeenCalledWith(result.path);
  });

  it('does not let an older response replace a newer search', async () => {
    let resolveFirst: (response: SearchResponse) => void = () => undefined;
    let resolveSecond: (response: SearchResponse) => void = () => undefined;
    const firstResponse = new Promise<SearchResponse>((resolve) => {
      resolveFirst = resolve;
    });
    const secondResponse = new Promise<SearchResponse>((resolve) => {
      resolveSecond = resolve;
    });
    vi.mocked(bridge.searchFiles)
      .mockReturnValueOnce(firstResponse)
      .mockReturnValueOnce(secondResponse);
    render(<App />);

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'first' },
    });
    await waitForDebounce();
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'second' },
    });
    await waitForDebounce();

    await act(async () => {
      resolveSecond({
        ok: true,
        results: [
          { id: '/second.txt', name: 'second.txt', path: '/second.txt' },
        ],
      });
    });
    await screen.findByRole('button', { name: /second\.txt/ });

    await act(async () => {
      resolveFirst({
        ok: true,
        results: [{ id: '/first.txt', name: 'first.txt', path: '/first.txt' }],
      });
    });

    expect(screen.queryByRole('button', { name: /first\.txt/ })).toBeNull();
    expect(screen.getByRole('button', { name: /second\.txt/ })).toBeVisible();
  });
});
