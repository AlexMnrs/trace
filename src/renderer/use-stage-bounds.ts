import { useEffect, useRef, useState } from 'react';

import type { LayoutBounds } from './spatial-layout';

const RESIZE_DEBOUNCE_MS = 100;

export function useStageBounds<T extends HTMLElement>(): {
  bounds: LayoutBounds;
  stageRef: React.RefObject<T | null>;
} {
  const stageRef = useRef<T>(null);
  const [bounds, setBounds] = useState<LayoutBounds>({ width: 0, height: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const updateBounds = (width: number, height: number): void => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setBounds({
          width: Math.round(width),
          height: Math.round(height),
        });
      }, RESIZE_DEBOUNCE_MS);
    };

    const initialBounds = stage.getBoundingClientRect();
    updateBounds(initialBounds.width, initialBounds.height);

    const observer = new ResizeObserver(([entry]) => {
      updateBounds(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(stage);

    return () => {
      clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, []);

  return { bounds, stageRef };
}
