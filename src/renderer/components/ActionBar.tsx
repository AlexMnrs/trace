import type { FileSearchResult } from '../../shared/contracts';

interface ActionBarProps {
  selectedFile: FileSearchResult | undefined;
  actionError: string | undefined;
  onOpen(): void;
  onShowLocation(): void;
}

export function ActionBar({
  selectedFile,
  actionError,
  onOpen,
  onShowLocation,
}: ActionBarProps) {
  return (
    <footer className="action-bar">
      <div className="selection-status" aria-live="polite">
        {actionError
          ? actionError
          : selectedFile
            ? '1 ITEM SELECTED'
            : 'NO ITEM SELECTED'}
      </div>
      <div className="action-bar__controls">
        <button disabled={!selectedFile} onClick={onOpen} type="button">
          OPEN
        </button>
        <button disabled={!selectedFile} onClick={onShowLocation} type="button">
          SHOW LOCATION
        </button>
      </div>
    </footer>
  );
}
