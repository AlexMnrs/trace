# Trace

Trace is an experimental spatial file search application for Linux. Its first
vertical searches real filenames through `plocate`, distributes the results
deterministically across the window, and lets the user open a file or reveal
its location.

## Requirements

- Linux
- Node.js 22 or newer
- npm 12 or newer
- `plocate` with an initialized database

Trace does not install `plocate` or run `updatedb`. Install and initialize them
with the package and service tools provided by your Linux distribution.

Electron Forge currently pins its `@electron/node-gyp` fork to a Git commit.
The dependency is declared directly in `package.json`, so npm can authorize
only that root Git dependency during installation:

```sh
npm install --allow-git=root
```

## Commands

```sh
npm start          # Run the Electron application in development
npm test           # Run the automated test suite
npm run verify     # Typecheck, lint, check formatting, and test
npm run package    # Build a local Linux application package
```

The packaged application is written under `out/`.

## Current scope

The first vertical includes filename search, deterministic spatial placement,
selection, opening files, and revealing their locations. Ranking, previews,
advanced metadata, animation, zoom, pan, and a custom index remain outside the
current scope.
