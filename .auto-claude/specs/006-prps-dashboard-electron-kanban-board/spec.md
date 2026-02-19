# 006: PRPs Dashboard — Electron Kanban Board

## Overview
สร้าง Electron Desktop App (Lite version ของ Auto-Claude UI) สำหรับแสดง Task Dashboard แบบ Kanban Board อ่านข้อมูลจาก `.auto-claude/specs/` โดย Reuse design system, UI components, และ architecture patterns จาก Auto-Claude

## Git Context
- **Proposed Branch**: feat/006-prps-dashboard
- **Commit Pattern**: feat: add PRPs Dashboard Electron app

## Context
- **Reference**: Auto-Claude frontend (`d:\wsl\Auto-Claude\apps\frontend`) — Electron + React + Tailwind v4
- **Design System**: Oscura Midnight theme (design.json 950 lines)
- **Reuse Components**: UI primitives (badge, button, card, dialog, tabs, progress), KanbanBoard pattern, TaskDetailModal pattern
- **Target Location**: `PRPs-Framework/apps/frontend/`

## Problem / Goal
1. **ปัจจุบัน**: Developer ต้องดูสถานะ Tasks ผ่าน CLI หรือเปิดไฟล์ JSON ด้วยมือ
2. **เป้าหมาย**: มี Visual Dashboard ที่ Dev สามารถ:
   - เห็น Tasks ทั้งหมดเป็น Kanban Board (จัดกลุ่มตาม status)
   - คลิกดู Task Detail: Overview, Spec, Plan, QA Report, Files
   - มี UI/UX สวยงามตาม Oscura Midnight theme

## Technical Stack

### Core
| Technology | Version | เหตุผล |
|-----------|---------|--------|
| Electron | ~40.x | Desktop app, filesystem access |
| electron-vite | ^5.x | Dev server + build |
| React | ^19.x | UI framework |
| TypeScript | ^5.x | Type safety |
| Tailwind CSS | ^4.x | Styling (reuse from Auto-Claude) |

### UI Libraries (Reuse from Auto-Claude)
| Library | ใช้ทำอะไร |
|---------|----------|
| lucide-react | Icons |
| class-variance-authority | Component variants |
| clsx + tailwind-merge | Class merging |
| react-markdown + remark-gfm | Render markdown (spec.md, qa_report.md) |

### NOT Needed (ไม่มีใน V1)
| Library | เหตุผล |
|---------|--------|
| xstate / zustand | Simple state ใช้ useState/useReducer |
| @dnd-kit | No drag-and-drop (read-only board) |
| @xterm/xterm | No terminal |
| @anthropic-ai/sdk | No AI integration |
| electron-updater | No auto-update |
| @sentry | No error tracking |

## Architecture

### Folder Structure
```
PRPs-Framework/apps/frontend/
├── electron.vite.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.cjs
├── resources/
│   └── icon.ico
├── src/
│   ├── main/
│   │   ├── index.ts            ← Electron main process
│   │   ├── ipc-handlers.ts     ← IPC: read specs from filesystem
│   │   └── specs-reader.ts     ← Read .auto-claude/specs/* → JSON
│   ├── preload/
│   │   └── index.ts            ← Expose IPC to renderer
│   └── renderer/
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx             ← Single page app
│       ├── styles/
│       │   └── globals.css     ← Oscura theme (adapted from Auto-Claude)
│       ├── components/
│       │   ├── ui/             ← Reused primitives from Auto-Claude
│       │   │   ├── badge.tsx
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── progress.tsx
│       │   │   ├── separator.tsx
│       │   │   ├── tabs.tsx
│       │   │   └── scroll-area.tsx
│       │   ├── KanbanBoard.tsx     ← Simplified kanban (read-only)
│       │   ├── TaskCard.tsx        ← Card in kanban column
│       │   ├── Header.tsx          ← App header + stats
│       │   └── task-detail/
│       │       ├── TaskDetailModal.tsx  ← Modal wrapper
│       │       ├── TaskOverview.tsx     ← Status, dates, metadata
│       │       ├── TaskSpec.tsx         ← Render spec.md
│       │       ├── TaskPlan.tsx         ← Phases + subtasks
│       │       ├── TaskQAReport.tsx     ← Render qa_report.md
│       │       └── TaskFiles.tsx        ← List of modified files
│       ├── hooks/
│       │   └── useTasks.ts         ← Fetch tasks from IPC
│       ├── lib/
│       │   └── utils.ts            ← cn() helper
│       └── types/
│           └── task.ts             ← Task type definitions
```

### Data Flow
```
.auto-claude/specs/
    ├── 003-fix-cli-thai-encoding/
    │   ├── implementation_plan.json  ← status, phases, subtasks
    │   ├── spec.md                   ← markdown content
    │   ├── qa_report.md              ← markdown content
    │   └── task_metadata.json        ← category, priority
    └── ...

        ↓ (Electron main process reads filesystem)

IPC Channel: 'tasks:list' → Task[]
IPC Channel: 'tasks:detail' → TaskDetail (with file contents)

        ↓ (Preload bridge)

React App → useTasks() hook → KanbanBoard → TaskCard
                                              ↓ (click)
                                    TaskDetailModal
                                    ├── Overview tab
                                    ├── Spec tab
                                    ├── Plan tab
                                    ├── QA Report tab
                                    └── Files tab
```

## Kanban Columns

| Column | Status Values | Color |
|--------|--------------|-------|
| 📋 Pending | `pending` | Gray `#868F97` |
| 📝 Planning | `planning` | Blue `#479FFA` |
| ⚡ In Progress | `in_progress`, `queue` | Yellow `#D6D876` |
| 👁️ Review | `human_review`, `ai_review` | Purple `#A78BFA` |
| ✅ Done | `done` | Green `#4EBE96` |

## Task Card Design

```
┌─────────────────────────────────────┐
│  #003                    🟢 done    │  ← ID (mono) + status badge
│  Fix CLI Thai Encoding              │  ← Title
│  ───────────────────────────────    │
│  fix · high · 4 phases              │  ← category · priority · phases
│  ████████████████████ 100%          │  ← Progress bar
│  Feb 19, 2026                       │  ← Date
└─────────────────────────────────────┘
```

## Task Detail Modal — Tabs

### Tab 1: Overview
- Title, Description, Status badge
- Category, Priority, Complexity, Impact badges
- Created/Updated dates
- Phase progress (visual)

### Tab 2: Spec
- Render `spec.md` as formatted Markdown
- Support GFM (tables, code blocks, checkboxes)

### Tab 3: Plan
- Phase list with expand/collapse
- Subtask list per phase with ✅/⏳ status
- Files affected per subtask

### Tab 4: QA Report
- Render `qa_report.md` as formatted Markdown
- Show "No QA report yet" if file doesn't exist

### Tab 5: Files
- List all files referenced in implementation_plan.json
- Group by phase
- Show file status (created/modified/deleted)

## UI Design Reference

### From Auto-Claude design.json
- **Theme**: Oscura Midnight (dark-first)
- **Background**: `#0B0B0F` primary, `#121216` cards
- **Accent**: `#D6D876` (warm yellow)
- **Text**: `#E6E6E6` primary, `#868F97` secondary
- **Border**: `#232323` subtle
- **Font**: Inter + JetBrains Mono
- **Radius**: 16px cards, 8px buttons, 9999px badges
- **Animations**: Subtle 250ms transitions

### Reusable Patterns from Auto-Claude
1. `globals.css` — Theme variables (adapt, don't copy all)
2. `ui/` components — badge, button, card, dialog, tabs, progress
3. `KanbanBoard.tsx` — Column layout pattern (simplify heavily)
4. `TaskCard.tsx` — Card design pattern
5. `task-detail/` — Modal with tabs pattern
6. `lib/utils.ts` — `cn()` helper function

## Related Files
- `d:\wsl\Auto-Claude\apps\frontend\` — Reference implementation
- `d:\wsl\Auto-Claude\apps\frontend\design.json` — Design system spec
- `d:\wsl\Auto-Claude\apps\frontend\src\renderer\styles\globals.css` — Theme CSS
- `d:\wsl\Auto-Claude\apps\frontend\src\renderer\components\ui\` — UI primitives
- `d:\wsl\Auto-Claude\apps\frontend\src\renderer\components\KanbanBoard.tsx` — Kanban reference
- `d:\wsl\Auto-Claude\apps\frontend\src\renderer\components\TaskCard.tsx` — Card reference
- `d:\wsl\Auto-Claude\apps\frontend\src\renderer\components\task-detail\` — Detail modal reference

## Impact / Priority
- Impact: High (Visual Dashboard สำหรับทุก Developer)
- Priority: Medium (เป็น Enhancement ไม่ใช่ Critical)

## Success Criteria
- [ ] Electron app เปิดได้ แสดง Kanban Board
- [ ] อ่านข้อมูลจาก .auto-claude/specs/ ถูกต้อง
- [ ] Tasks แสดงในคอลัมน์ถูกต้องตาม status
- [ ] คลิก Task → เปิด Detail Modal (5 tabs)
- [ ] Spec/QA tab render markdown ได้สวยงาม
- [ ] Plan tab แสดง phases + subtasks ครบ
- [ ] UI ตรงตาม Oscura Midnight theme
- [ ] `npm run dev` รันได้สำเร็จ

## Complexity Estimate
- **Estimated effort**: Large (Electron setup + React + Tailwind + 10+ components)
- **Phases**: ~5 phases, ~15-20 subtasks
- **Dependencies**: Node.js >= 20, npm >= 10

## Related PRPs
- `.auto-claude/specs/004-create-onboarding-script/spec.md` — onboarding อาจ integrate กับ dashboard
