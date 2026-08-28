# Initial Technical Decisions

## Application stack

Trace V1 uses TypeScript, React, Electron, Vite, and Electron Forge. The stack
prioritizes rapid visual experimentation and a consistent rendering engine over
minimal package size or fully native desktop widgets.

The renderer is isolated from Node.js. A preload bridge exposes only filename
search, file opening, and file location actions. System access stays in the
Electron main process.

Electron Forge's Vite plugin emits the main and preload entry points as
CommonJS. The package intentionally does not declare `"type": "module"`, so
Electron interprets those generated `.js` files consistently. The renderer is
still built as a browser bundle and does not share the main process's module
loader.

## Search backend

The initial backend is `plocate`, invoked directly without a shell. The backend
is hidden behind `SearchBackend` so it can later be replaced by LocalSearch or a
custom index without changing the renderer.

Trace requests existing, case-insensitive basename matches and limits each
query to 24 paths. It treats a missing executable separately from a general
search failure. Installation and index updates remain the user's responsibility.

## Spatial layout

The renderer uses a pure deterministic layout function. It sorts results by
path, generates seeded positions, and rejects collisions. When a dense viewport
cannot accommodate the scattered candidates, it falls back to deterministically
shuffled cells with small seeded offsets. All cards have equal visual weight;
ranking is intentionally deferred.

## Known limitations

- The `plocate` index can be stale or omit configured paths.
- Revealing a file can behave differently across Linux file managers.
- The minimum viewport uses a more regular fallback composition for 24 cards.
- Electron Forge's development-only dependency tree currently reports npm audit
  advisories. Production dependencies should be audited separately with
  `npm audit --omit=dev`.
