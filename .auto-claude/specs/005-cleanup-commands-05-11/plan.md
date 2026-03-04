# Plan: 005-cleanup-commands-05-11

## Goal
ลบ Skeleton commands ที่ไม่มีเนื้อหาจริง แก้ไข 11-Agent ให้ถูกต้อง และอัปเดตเอกสาร

---

## Decision Matrix

| # | Command | Decision | เหตุผล |
|---|---------|----------|--------|
| 05 | Roadmap | 🔴 **ลบ** | Coach ทำ Roadmap ได้แล้ว + ไม่มี backend script |
| 06 | Ideate | 🔴 **ลบ** | Coach ครอบคลุม Discovery/Ideation |
| 07 | Spec | 🔴 **ลบ** | ซ้ำซ้อน `/01-New-Task` 100% |
| 08 | Manage | 🔴 **ลบ** | Coach ทำ Task Dashboard ได้แล้ว |
| 09 | Utils | 🔴 **ลบ** | คลุมเครือ ฟังก์ชันย่อยอยู่ใน 03/04 |
| 10 | Human | ✅ **เก็บ** | เพิ่ง Rewrite ใหม่ — Feedback Loop สมบูรณ์ |
| 11 | Agent | 🟡 **แก้ไข** | แก้ path + อัปเดตรายชื่อ Agent |

## Result: Commands หลัง Cleanup

```
.cursor/commands/
  ├── 00-Coach.md          ← Mentor & Advisor (Read-Only)
  ├── 01-New-Task.md       ← สร้าง Task ใหม่
  ├── 02-Plan.md           ← วางแผน Implementation
  ├── 03-Code.md           ← Implement Code
  ├── 04-Verify.md         ← QA & Verification
  ├── 10-Human.md          ← Human Actions (Approve/Reject/Feedback)
  ├── 11-Agent.md          ← Invoke Specialist Agents
  └── prp-core/            ← Core PRP commands
```

**ก่อน**: 12 commands (7 skeleton)
**หลัง**: 7 commands + prp-core/ (ทุกตัวพร้อมใช้งาน)

---

## Phases

### Phase 1: Remove Skeleton Commands 🗑️
- ลบ 5 ไฟล์: 05, 06, 07, 08, 09

### Phase 2: Fix 11-Agent.md 🔧
- แก้ path จาก `.auto-claude/agents/` → `.cursor/agents/`
- อัปเดตรายชื่อ Agent ให้ตรงกับไฟล์จริง

### Phase 3: Update Documentation 📝
- อัปเดต README.md
- อัปเดต Coach ให้ไม่อ้างอิงคำสั่งที่ลบ

### Phase 4: Verification ✅
- Grep search ทั้ง codebase ว่าไม่มี stale references

---

## Risks

| Risk | Mitigation |
|------|-----------|
| คำสั่งที่ลบถูกอ้างอิงใน README | Phase 3 จัดการ |
| Agent อ้างอิงคำสั่งที่ลบ | Phase 4 ตรวจสอบ |

## Success Criteria
- [ ] เหลือเฉพาะคำสั่งที่พร้อมใช้งาน (00-04, 10, 11)
- [ ] 11-Agent path ถูกต้อง
- [ ] ไม่มี stale references ใน codebase
- [ ] README อัปเดตแล้ว
