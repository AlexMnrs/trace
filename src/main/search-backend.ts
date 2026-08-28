import type { FileSearchResult, SearchErrorCode } from '../shared/contracts';

export interface SearchBackend {
  search(query: string, limit: number): Promise<FileSearchResult[]>;
}

export class SearchBackendError extends Error {
  constructor(
    readonly code: SearchErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'SearchBackendError';
  }
}
