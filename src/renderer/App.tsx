import { useEffect, useMemo, useRef, useState } from 'react';

import type { FileSearchResult } from '../shared/contracts';
import { ActionBar } from './components/ActionBar';
import { FileCard } from './components/FileCard';
import { SearchHeader } from './components/SearchHeader';
import { computeSpatialLayout } from './spatial-layout';
import { useStageBounds } from './use-stage-bounds';

type SearchStatus = 'idle' | 'searching' | 'ready' | 'empty' | 'error';

const SEARCH_DEBOUNCE_MS = 200;

const errorCopy = {
  backend_unavailable:
    'PLOCATE IS NOT AVAILABLE. INSTALL IT AND BUILD ITS INDEX TO SEARCH.',
  search_failed: 'THE FILE SEARCH COULD NOT BE COMPLETED.',
} as const;

export function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FileSearchResult[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [searchError, setSearchError] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const [actionError, setActionError] = useState<string>();
  const requestIdRef = useRef(0);
  const { bounds, stageRef } = useStageBounds<HTMLDivElement>();

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return undefined;
    }

    const requestId = requestIdRef.current;
    const timer = setTimeout(() => {
      setStatus('searching');
      setSearchError(undefined);

      void window.trace.searchFiles(normalizedQuery).then((response) => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        if (!response.ok) {
          setResults([]);
          setStatus('error');
          setSearchError(errorCopy[response.code] ?? response.message);
          return;
        }

        setResults(response.results);
        setStatus(response.results.length > 0 ? 'ready' : 'empty');
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const placements = useMemo(
    () => computeSpatialLayout(results, bounds),
    [bounds, results],
  );
  const placementByResultId = useMemo(
    () =>
      new Map(placements.map((placement) => [placement.resultId, placement])),
    [placements],
  );
  const selectedFile = results.find((result) => result.id === selectedId);

  const handleQueryChange = (value: string): void => {
    requestIdRef.current += 1;
    setQuery(value);
    setSelectedId(undefined);
    setActionError(undefined);

    if (!value.trim()) {
      setResults([]);
      setStatus('idle');
      setSearchError(undefined);
    }
  };

  const runAction = async (
    action: (
      path: string,
    ) => Promise<{ ok: true } | { ok: false; message: string }>,
  ): Promise<void> => {
    if (!selectedFile) {
      return;
    }

    setActionError(undefined);
    const response = await action(selectedFile.path);
    if (!response.ok) {
      setActionError(response.message);
    }
  };

  return (
    <main className="app-shell">
      <SearchHeader
        onQueryChange={handleQueryChange}
        query={query}
        resultCount={results.length}
        status={status}
      />

      <section
        className="spatial-stage"
        ref={stageRef}
        aria-label="Search results"
      >
        {status === 'idle' ? (
          <p className="stage-message">TYPE A FILE NAME TO START TRACING.</p>
        ) : null}
        {status === 'empty' ? (
          <p className="stage-message">NO MATCHING FILES FOUND.</p>
        ) : null}
        {status === 'error' ? (
          <p className="stage-message stage-message--error">{searchError}</p>
        ) : null}

        {results.map((file) => {
          const placement = placementByResultId.get(file.id);
          return placement ? (
            <FileCard
              file={file}
              key={file.id}
              onSelect={(id) => {
                setSelectedId(id);
                setActionError(undefined);
              }}
              placement={placement}
              selected={file.id === selectedId}
            />
          ) : null;
        })}
      </section>

      <ActionBar
        actionError={actionError}
        onOpen={() => void runAction(window.trace.openFile)}
        onShowLocation={() => void runAction(window.trace.showInFolder)}
        selectedFile={selectedFile}
      />
    </main>
  );
}
