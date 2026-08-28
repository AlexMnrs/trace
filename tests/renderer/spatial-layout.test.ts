import { describe, expect, it } from 'vitest';

import type { FileSearchResult } from '../../src/shared/contracts';
import { computeSpatialLayout } from '../../src/renderer/spatial-layout';

const results: FileSearchResult[] = Array.from({ length: 24 }, (_, index) => ({
  id: `/home/lex/file-${index}.txt`,
  name: `file-${index}.txt`,
  path: `/home/lex/file-${index}.txt`,
}));

function rectanglesOverlap(
  left: ReturnType<typeof computeSpatialLayout>[number],
  right: ReturnType<typeof computeSpatialLayout>[number],
): boolean {
  return !(
    left.x + left.width <= right.x ||
    right.x + right.width <= left.x ||
    left.y + left.height <= right.y ||
    right.y + right.height <= left.y
  );
}

describe('computeSpatialLayout', () => {
  it('is deterministic for the same files and viewport', () => {
    const bounds = { width: 1000, height: 498 };

    expect(computeSpatialLayout(results, bounds)).toEqual(
      computeSpatialLayout([...results].reverse(), bounds),
    );
  });

  it('keeps 24 cards inside the minimum supported stage without overlap', () => {
    const bounds = { width: 1000, height: 498 };
    const placements = computeSpatialLayout(results, bounds);

    expect(placements).toHaveLength(24);
    for (const placement of placements) {
      expect(placement.x).toBeGreaterThanOrEqual(0);
      expect(placement.y).toBeGreaterThanOrEqual(0);
      expect(placement.x + placement.width).toBeLessThanOrEqual(bounds.width);
      expect(placement.y + placement.height).toBeLessThanOrEqual(bounds.height);
    }

    for (let left = 0; left < placements.length; left += 1) {
      for (let right = left + 1; right < placements.length; right += 1) {
        expect(rectanglesOverlap(placements[left], placements[right])).toBe(
          false,
        );
      }
    }
  });

  it('changes the composition when the viewport changes', () => {
    expect(
      computeSpatialLayout(results, { width: 1000, height: 498 }),
    ).not.toEqual(computeSpatialLayout(results, { width: 1200, height: 608 }));
  });
});
