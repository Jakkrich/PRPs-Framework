# PRPs Dashboard (Lite)

An Electron-based Kanban dashboard for managing PRPs Framework tasks.

## Features
- **Kanban Board**: Visualize tasks by status (Pending, Planning, In Progress, Review, Done).
- **Task Details**: Detailed view with Overview, Spec, Plan, QA Report, and Files involved.
- **Auto-Sync**: Reads directly from `.auto-claude/specs/` directory.
- **Oscura Theme**: Beautiful dark mode design system inspired by Auto-Claude.

## Setup
```bash
cd apps/frontend
npm install
```

## Running Development
```bash
npm run dev
```

## Building for Production
```bash
npm run build
# To package: (requires electron-builder)
# npm install -D electron-builder
# npm run package
```

## Architecture
- **Main Process**: `src/main/` - Handles window creation and IPC for filesystem access.
- **Preload**: `src/preload/` - Exposes `specsAPI` context bridge.
- **Renderer**: `src/renderer/` - React application with Vite.
  - `components/ui/`: Reusable UI components (shadcn-like).
  - `hooks/`: Custom hooks for data fetching.
  - `types/`: TypeScript definitions.

## E2E Testing
Planned for future iteration using Playwright.
See `e2e/` for draft specs.
