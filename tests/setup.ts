import '@testing-library/jest-dom/vitest';

class TestResizeObserver implements ResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}

  disconnect(): void {}

  observe(target: Element): void {
    this.callback(
      [
        {
          borderBoxSize: [],
          contentBoxSize: [],
          contentRect: {
            bottom: 498,
            height: 498,
            left: 0,
            right: 1000,
            top: 0,
            width: 1000,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          },
          devicePixelContentBoxSize: [],
          target,
        },
      ],
      this,
    );
  }

  unobserve(): void {}
}

globalThis.ResizeObserver = TestResizeObserver;
