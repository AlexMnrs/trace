import { spawn } from 'node:child_process';
import { basename } from 'node:path';

import type { FileSearchResult } from '../shared/contracts';
import { SearchBackendError, type SearchBackend } from './search-backend';

export interface CommandResult {
  stdout: Buffer;
  stderr: Buffer;
  exitCode: number;
}

export type CommandRunner = (
  command: string,
  args: readonly string[],
) => Promise<CommandResult>;

export const runCommand: CommandRunner = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];

    child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk));
    child.once('error', reject);
    child.once('close', (exitCode) => {
      resolve({
        stdout: Buffer.concat(stdout),
        stderr: Buffer.concat(stderr),
        exitCode: exitCode ?? 1,
      });
    });
  });

export class PlocateSearchBackend implements SearchBackend {
  constructor(private readonly commandRunner: CommandRunner = runCommand) {}

  async search(query: string, limit: number): Promise<FileSearchResult[]> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return [];
    }

    let commandResult: CommandResult;
    try {
      commandResult = await this.commandRunner('plocate', [
        '--basename',
        '--ignore-case',
        '--existing',
        '--limit',
        String(limit),
        '--null',
        normalizedQuery,
      ]);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new SearchBackendError(
          'backend_unavailable',
          'plocate is not installed or is not available on PATH.',
          { cause: error },
        );
      }

      throw new SearchBackendError(
        'search_failed',
        'Trace could not start the file search.',
        { cause: error },
      );
    }

    const { exitCode, stderr, stdout } = commandResult;
    if (exitCode === 1 && stdout.length === 0 && stderr.length === 0) {
      return [];
    }
    if (exitCode !== 0) {
      const detail = stderr.toString('utf8').trim();
      throw new SearchBackendError(
        'search_failed',
        detail || 'plocate returned an unexpected error.',
      );
    }

    const uniquePaths = new Set(
      stdout
        .toString('utf8')
        .split('\0')
        .filter((path) => path.length > 0),
    );

    return [...uniquePaths].slice(0, limit).map((path) => ({
      id: path,
      name: basename(path),
      path,
    }));
  }
}
