import type {
  FileSearchResult,
  SpatialPlacement,
} from '../../shared/contracts';

interface FileCardProps {
  file: FileSearchResult;
  placement: SpatialPlacement;
  selected: boolean;
  onSelect(id: string): void;
}

export function FileCard({
  file,
  placement,
  selected,
  onSelect,
}: FileCardProps) {
  return (
    <button
      aria-pressed={selected}
      className={`file-card${selected ? ' file-card--selected' : ''}`}
      onClick={() => onSelect(file.id)}
      style={{
        height: placement.height,
        left: placement.x,
        top: placement.y,
        width: placement.width,
      }}
      title={file.path}
      type="button"
    >
      <span className="file-card__name">{file.name}</span>
      <span className="file-card__path">{file.path}</span>
    </button>
  );
}
