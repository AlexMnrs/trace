interface SearchHeaderProps {
  query: string;
  resultCount: number;
  status: 'idle' | 'searching' | 'ready' | 'empty' | 'error';
  onQueryChange(value: string): void;
}

export function SearchHeader({
  query,
  resultCount,
  status,
  onQueryChange,
}: SearchHeaderProps) {
  const resultLabel =
    status === 'searching'
      ? 'SEARCHING'
      : status === 'ready'
        ? `${resultCount} ${resultCount === 1 ? 'RESULT' : 'RESULTS'}`
        : 'TRACE';

  return (
    <header className="search-header">
      <label className="search-field">
        <span className="visually-hidden">Search files by name</span>
        <input
          autoFocus
          maxLength={256}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search files by name"
          spellCheck={false}
          type="search"
          value={query}
        />
      </label>
      <output className="result-count" aria-live="polite">
        {resultLabel}
      </output>
    </header>
  );
}
