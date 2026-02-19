# Plan: 006 — PRPs Dashboard (Electron Kanban Board)

## Goal
สร้าง Electron Desktop App แสดง Task Kanban Board + Detail Modal อ่านจาก `.auto-claude/specs/`

---

## Architecture Overview

```
PRPs-Framework/apps/frontend/
├── src/
│   ├── main/                    ← Electron Main Process
│   │   ├── index.ts             ← BrowserWindow + IPC registration
│   │   ├── ipc-handlers.ts      ← IPC: specs:list, specs:detail
│   │   └── specs-reader.ts      ← Read filesystem → structured data
│   ├── preload/
│   │   └── index.ts             ← contextBridge: window.specsAPI
│   └── renderer/                ← React SPA
│       ├── App.tsx              ← Main layout: Header + KanbanBoard
│       ├── components/
│       │   ├── ui/              ← 8 reused primitives from Auto-Claude
│       │   ├── Header.tsx       ← Title + stats + progress
│       │   ├── TaskCard.tsx     ← Kanban card
│       │   ├── KanbanBoard.tsx  ← 5-column layout
│       │   └── task-detail/     ← Modal with 5 tabs
│       ├── hooks/               ← useTasks, useTaskDetail
│       ├── lib/utils.ts         ← cn(), formatRelativeTime()
│       ├── types/task.ts        ← TypeScript interfaces
│       └── styles/globals.css   ← Oscura Midnight theme
```

## Data Flow

```
.auto-claude/specs/*
       ↓ (fs.readdir + fs.readFile)
Main Process (specs-reader.ts)
       ↓ (IPC: specs:list / specs:detail)
Preload (contextBridge)
       ↓ (window.specsAPI)
Renderer (useTasks / useTaskDetail hooks)
       ↓
React Components (KanbanBoard → TaskCard → TaskDetailModal)
```

## Reuse Strategy from Auto-Claude

| Source File | How to Reuse |
|-------------|-------------|
| `design.json` | Reference for theme values (not copied) |
| `globals.css` | Adapt core theme section (~200 lines from 42K) |
| `ui/card.tsx` | Copy as-is ✅ |
| `ui/badge.tsx` | Copy as-is ✅ |
| `ui/button.tsx` | Copy as-is ✅ |
| `ui/dialog.tsx` | Copy as-is ✅ |
| `ui/tabs.tsx` | Copy as-is ✅ |
| `ui/progress.tsx` | Copy as-is ✅ |
| `ui/separator.tsx` | Copy as-is ✅ |
| `ui/scroll-area.tsx` | Copy as-is ✅ |
| `lib/utils.ts` | Copy cn(), calculateProgress(), formatRelativeTime() ✅ |
| `KanbanBoard.tsx` | **Simplify** (remove DnD, remove xstate, keep column layout) |
| `TaskCard.tsx` | **Simplify** (remove terminal integration, keep card design) |
| `task-detail/` | **Simplify** (remove logs/terminal, keep tabs pattern) |
| `electron.vite.config.ts` | **Simplify** (remove sentry, dotenv, node-pty) |
| `preload/index.ts` | **Simplify** (only expose specsAPI) |

## Kanban Columns

| Column | Statuses Mapped | Color | Icon |
|--------|----------------|-------|------|
| Pending | `pending` | `#868F97` | 📋 |
| Planning | `planning` | `#479FFA` | 📝 |
| In Progress | `in_progress`, `queue` | `#D6D876` | ⚡ |
| Review | `human_review`, `ai_review` | `#A78BFA` | 👁️ |
| Done | `done` | `#4EBE96` | ✅ |

## Phases Summary

| Phase | Scope | Subtasks |
|-------|-------|----------|
| 1 | Electron + Vite scaffold | 5 |
| 2 | Design system + UI primitives | 3 |
| 3 | Backend IPC (read specs) | 3 |
| 4 | Kanban Board + TaskCard | 5 |
| 5 | Task Detail Modal (5 tabs) | 7 |
| 6 | Polish + E2E | 2 |
| **Total** | | **25** |

## Dependency Chain

```
Phase 1 (scaffold)
  └→ Phase 2 (theme + ui) ─────────────┐
  └→ Phase 3 (backend IPC) ────────────┤
                                        └→ Phase 4 (kanban + card)
                                              └→ Phase 5 (detail modal)
                                                    └→ Phase 6 (polish)
```

## Risks

| Risk | Probability | Mitigation |
|------|------------|-----------|
| Tailwind v4 breaking changes vs Auto-Claude | Medium | Pin exact version ที่ Auto-Claude ใช้ |
| Electron version mismatch | Low | ใช้ electron ~40.x เหมือน Auto-Claude |
| globals.css too large to adapt | Medium | Extract เฉพาะ core theme (~200 lines) |
| Radix UI dialog ต้อง setup | Low | Copy exact versions จาก Auto-Claude |

## Success Criteria
- [ ] `npm run dev` เปิด Electron + แสดง Kanban Board
- [ ] Tasks จัดกลุ่มตาม status ใน 5 columns
- [ ] Click card → Detail Modal (5 tabs)
- [ ] Markdown render สวยงาม (Spec + QA)
- [ ] Plan tab แสดง phases + subtasks
- [ ] Oscura Midnight theme ถูกต้อง
