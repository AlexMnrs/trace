# Repository Guidelines

## Project Structure & Module Organization

The project definition lives in `docs/project-brief.md`, and the initial technical decisions are recorded in `docs/technical-decisions.md`. The application keeps Electron system access, the React renderer, shared contracts, search adaptation, and spatial layout separated by responsibility:

- `src/main/` — search adaptation and privileged desktop operations.
- `src/renderer/` — React UI and deterministic spatial layout.
- `src/shared/` — typed contracts shared across Electron boundaries.
- `tests/` — unit and renderer tests mirroring `src/`.
- `docs/` — product and technical decisions.

Keep the search backend behind an interface so it can later be replaced without changing the UI.

## Build, Test, and Development Commands

- `npm start` — run Trace in Electron development mode.
- `npm test` — run the Vitest suite once.
- `npm run verify` — typecheck, lint, check formatting, and test.
- `npm run package` — build a local Linux package under `out/`.

Install dependencies with `npm install --allow-git=root`; Electron Forge pins its
`@electron/node-gyp` fork to the Git commit declared in `package.json`.

## Coding Style & Naming Conventions

Use the selected stack’s formatter and linter. Use clear English names for code symbols, files, and comments. Prefer modules such as `search`, `ranking`, `metadata`, `preview`, and `spatial_layout`; keep domain logic independent of UI widgets.

## Testing Guidelines

Vitest and Testing Library cover backend adaptation, preload exposure, layout determinism, and the main search-to-selection flow. Name tests after observable behavior (for example, `exact_filename_match_ranks_first`). Add tests for ranking, metadata, previews, and richer system-action errors as those capabilities are introduced.

## Commit & Pull Request Guidelines

The history contains only `Initialize Trace project`, so no established convention can be inferred. Use concise, imperative subjects, optionally scoped by area (for example, `Add filename ranking`). Keep commits focused and explain non-obvious decisions in the body.

Pull requests should include a summary, validation commands and results, screenshots or recordings for UI changes, and links to related planning or issue documents. Call out Linux assumptions and known limitations.

## Technical Decision Gate

The initial gate is closed: Trace V1 uses Electron, React, TypeScript, and `plocate`. Revisit the decision only if measured limitations block spatial-interface experiments.
