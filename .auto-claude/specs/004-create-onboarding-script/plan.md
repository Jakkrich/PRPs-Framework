# Plan: 004-create-onboarding-script

## Goal
สร้าง Single-command Setup Script ให้ Dev ใหม่เริ่มงานได้ภายใน 1 นาที

---

## Architecture

```
python .cursor/scripts/onboarding.py
    │
    ├── Step 1: Check Prerequisites
    │     └── Python >= 3.8, Project root detected
    │
    ├── Step 2: Setup Virtual Environment
    │     └── เรียก setup-venv.py logic (idempotent)
    │
    ├── Step 3: Init Sync
    │     └── เรียก update_initial.py (idempotent)
    │
    ├── Step 4: Health Check
    │     └── .venv ✅, INITIAL.md ✅, specs/ ✅, tools ✅
    │
    └── Step 5: Welcome Message
          └── Quick Start Guide + Available Commands
```

## Key Design Decisions

| Decision | เหตุผล |
|----------|--------|
| Python script (ไม่ใช่ shell) | Cross-platform: Windows + Mac/Linux |
| Idempotent | รันซ้ำได้โดยไม่ทำลายข้อมูลเดิม |
| เรียก subprocess แทน import | แยก concern ง่ายต่อการ debug |
| Step-by-step output | Dev เห็นว่าทำอะไรอยู่ ไม่ต้องรอนาน |

## Commands ที่แสดงใน Welcome (หลัง Cleanup 005)

```
99-Coach      — Mentor & Advisor (Read-Only)
01-New-Task   — สร้าง Task ใหม่
02-Plan       — วางแผน Implementation
03-Code       — Implement Code
04-Verify     — QA & Verification
10-Human      — Human Actions (Approve/Reject)
11-Agent      — Invoke Specialist Agents
```

---

## Phases

### Phase 1: Core Script (6 subtasks)
- โครงสร้าง + Prerequisites + venv + init-sync + Health check + Welcome

### Phase 2: Documentation
- เพิ่ม Quick Start ใน README.md

### Phase 3: E2E Test
- ทดสอบ first run + second run (idempotent)

---

## Risks

| Risk | Mitigation |
|------|-----------|
| update_initial.py อาจมี dependency ที่ยังไม่ติดตั้ง | Step 2 ติดตั้ง deps ก่อน |
| Cross-platform path issues | ใช้ pathlib ทั้งหมด |
| Script ล้มเหลวกลางทาง | ทำ try-except แต่ละ Step + แสดง error ชัดเจน |

## Success Criteria
- [ ] Dev ใหม่รันคำสั่งเดียว → พร้อมทำงาน
- [ ] รันซ้ำได้ไม่พัง (idempotent)
- [ ] รองรับ Windows + Mac/Linux
- [ ] แสดงคำสั่งที่ใช้ได้ครบ 7 ตัว
