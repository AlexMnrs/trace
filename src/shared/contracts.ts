export const SEARCH_RESULT_LIMIT = 24;

export const IPC_CHANNELS = {
  searchFiles: 'trace:search-files',
  openFile: 'trace:open-file',
  showInFolder: 'trace:show-in-folder',
} as const;

export interface FileSearchResult {
  id: string;
  name: string;
  path: string;
}

export interface SpatialPlacement {
  resultId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SearchErrorCode = 'backend_unavailable' | 'search_failed';

export type SearchResponse =
  | { ok: true; results: FileSearchResult[] }
  | { ok: false; code: SearchErrorCode; message: string };

export type ActionResponse = { ok: true } | { ok: false; message: string };

export interface TraceBridge {
  searchFiles(query: string): Promise<SearchResponse>;
  openFile(path: string): Promise<ActionResponse>;
  showInFolder(path: string): Promise<ActionResponse>;
}
