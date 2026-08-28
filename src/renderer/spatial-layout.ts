import type { FileSearchResult, SpatialPlacement } from '../shared/contracts';

export interface LayoutBounds {
  width: number;
  height: number;
}

export const CARD_WIDTH = 196;
export const CARD_HEIGHT = 68;

const EDGE_PADDING = 12;
const CARD_GAP = 12;
const RANDOM_ATTEMPTS_PER_CARD = 160;

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createRandom(seed: number): () => number {
  let state = seed || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function overlaps(candidate: Rectangle, placed: Rectangle[]): boolean {
  return placed.some(
    (rectangle) =>
      candidate.x < rectangle.x + rectangle.width + CARD_GAP &&
      candidate.x + candidate.width + CARD_GAP > rectangle.x &&
      candidate.y < rectangle.y + rectangle.height + CARD_GAP &&
      candidate.y + candidate.height + CARD_GAP > rectangle.y,
  );
}

function tryScatteredLayout(
  results: FileSearchResult[],
  bounds: LayoutBounds,
): SpatialPlacement[] | null {
  const maxX = bounds.width - EDGE_PADDING - CARD_WIDTH;
  const maxY = bounds.height - EDGE_PADDING - CARD_HEIGHT;
  if (maxX < EDGE_PADDING || maxY < EDGE_PADDING) {
    return null;
  }

  const rectangles: Rectangle[] = [];
  const placements: SpatialPlacement[] = [];

  for (const result of results) {
    const random = createRandom(hashString(result.path));
    let placement: SpatialPlacement | undefined;

    for (let attempt = 0; attempt < RANDOM_ATTEMPTS_PER_CARD; attempt += 1) {
      const candidate: Rectangle = {
        x: Math.round(EDGE_PADDING + random() * (maxX - EDGE_PADDING)),
        y: Math.round(EDGE_PADDING + random() * (maxY - EDGE_PADDING)),
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      };

      if (!overlaps(candidate, rectangles)) {
        placement = { resultId: result.id, ...candidate };
        break;
      }
    }

    if (!placement) {
      return null;
    }

    placements.push(placement);
    rectangles.push(placement);
  }

  return placements;
}

function createShuffledSlots(count: number, seed: number): number[] {
  const slots = Array.from({ length: count }, (_, index) => index);
  const random = createRandom(seed);

  for (let index = slots.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [slots[index], slots[swapIndex]] = [slots[swapIndex], slots[index]];
  }

  return slots;
}

function createFallbackLayout(
  results: FileSearchResult[],
  bounds: LayoutBounds,
): SpatialPlacement[] {
  const availableWidth = Math.max(0, bounds.width - EDGE_PADDING * 2);
  const availableHeight = Math.max(0, bounds.height - EDGE_PADDING * 2);
  const maxColumns = Math.max(
    1,
    Math.floor((availableWidth + CARD_GAP) / (CARD_WIDTH + CARD_GAP)),
  );
  const maxRows = Math.max(
    1,
    Math.floor((availableHeight + CARD_GAP) / (CARD_HEIGHT + CARD_GAP)),
  );
  const columns = Math.min(maxColumns, Math.ceil(results.length / maxRows));
  const rows = Math.max(1, Math.ceil(results.length / columns));
  const cellWidth = availableWidth / columns;
  const cellHeight = availableHeight / rows;
  const slotOrder = createShuffledSlots(
    columns * rows,
    hashString(
      `${results.map((result) => result.path).join('\0')}:${bounds.width}x${bounds.height}`,
    ),
  );

  return results.map((result, index) => {
    const slot = slotOrder[index];
    const column = slot % columns;
    const row = Math.floor(slot / columns);
    const random = createRandom(hashString(`${result.path}:fallback`));
    const horizontalRoom = Math.max(0, cellWidth - CARD_WIDTH);
    const verticalRoom = Math.max(0, cellHeight - CARD_HEIGHT);

    return {
      resultId: result.id,
      x: Math.round(
        EDGE_PADDING + column * cellWidth + random() * horizontalRoom,
      ),
      y: Math.round(EDGE_PADDING + row * cellHeight + random() * verticalRoom),
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    };
  });
}

export function computeSpatialLayout(
  results: FileSearchResult[],
  bounds: LayoutBounds,
): SpatialPlacement[] {
  if (results.length === 0 || bounds.width <= 0 || bounds.height <= 0) {
    return [];
  }

  const sortedResults = [...results].sort((left, right) =>
    left.path.localeCompare(right.path),
  );

  return (
    tryScatteredLayout(sortedResults, bounds) ??
    createFallbackLayout(sortedResults, bounds)
  );
}
