import { describe, expect, it, vi } from 'vitest';

import {
  PlocateSearchBackend,
  type CommandRunner,
} from '../../src/main/plocate-search-backend';
import { SearchBackendError } from '../../src/main/search-backend';

describe('PlocateSearchBackend', () => {
  it('runs plocate without a shell and maps NUL-delimited paths', async () => {
    const runner = vi.fn<CommandRunner>().mockResolvedValue({
      exitCode: 0,
      stderr: Buffer.alloc(0),
      stdout: Buffer.from(
        '/home/lex/project-plan.md\0/home/lex/project notes.txt\0',
      ),
    });
    const backend = new PlocateSearchBackend(runner);

    await expect(backend.search('project', 24)).resolves.toEqual([
      {
        id: '/home/lex/project-plan.md',
        name: 'project-plan.md',
        path: '/home/lex/project-plan.md',
      },
      {
        id: '/home/lex/project notes.txt',
        name: 'project notes.txt',
        path: '/home/lex/project notes.txt',
      },
    ]);
    expect(runner).toHaveBeenCalledWith('plocate', [
      '--basename',
      '--ignore-case',
      '--existing',
      '--limit',
      '24',
      '--null',
      'project',
    ]);
  });

  it('treats an empty plocate result as no matches', async () => {
    const runner = vi.fn<CommandRunner>().mockResolvedValue({
      exitCode: 1,
      stderr: Buffer.alloc(0),
      stdout: Buffer.alloc(0),
    });

    await expect(
      new PlocateSearchBackend(runner).search('missing', 24),
    ).resolves.toEqual([]);
  });

  it('reports a missing plocate executable', async () => {
    const missingExecutable = Object.assign(new Error('not found'), {
      code: 'ENOENT',
    });
    const runner = vi.fn<CommandRunner>().mockRejectedValue(missingExecutable);

    await expect(
      new PlocateSearchBackend(runner).search('project', 24),
    ).rejects.toMatchObject({
      code: 'backend_unavailable',
    } satisfies Partial<SearchBackendError>);
  });

  it('reports an unexpected plocate failure', async () => {
    const runner = vi.fn<CommandRunner>().mockResolvedValue({
      exitCode: 2,
      stderr: Buffer.from('database is unavailable'),
      stdout: Buffer.alloc(0),
    });

    await expect(
      new PlocateSearchBackend(runner).search('project', 24),
    ).rejects.toMatchObject({
      code: 'search_failed',
      message: 'database is unavailable',
    } satisfies Partial<SearchBackendError>);
  });
});
