# 005-cleanup-commands-05-11: Cleanup Commands 05-11

## Overview
ตรวจสอบคำสั่ง 05-Roadmap ถึง 11-Agent ที่มีอยู่ในโปรเจกต์ ตัดสินใจว่าจะพัฒนาต่อ, รวมเข้ากับคำสั่งอื่น, หรือลบทิ้ง เพื่อลดความสับสนของ Developer ที่เข้ามาใหม่

## Git Context
- **Proposed Branch**: refactor/005-cleanup-commands-05-11
- **Commit Pattern**: refactor: cleanup and consolidate commands 05-11

## Context
- **Core Workflow ที่พร้อมใช้แล้ว**: `99-Coach`, `01-New-Task`, `02-Plan`, `03-Code`, `04-Verify`
- **คำสั่ง 05-11 ปัจจุบัน**: เป็น Skeleton (โครง) ที่มีเพียง Usage + Process คร่าวๆ ยังไม่มี AI Agent Instructions หรือ Encoding Protection เหมือนคำสั่ง 00-04
- **Agent Files**: มี 12 agents ใน `.cursor/agents/` ที่ `11-Agent` อ้างอิง

## Problem / Goal
1. **ปัญหาปัจจุบัน**: Dev ที่ Clone มาจะเห็นคำสั่ง 12 ตัว แต่ใช้ได้จริงแค่ 5 ตัว (00-04) ทำให้สับสนว่าอะไรใช้ได้/ไม่ได้
2. **เป้าหมาย**: ทุกคำสั่งที่อยู่ในโปรเจกต์ต้อง "พร้อมใช้งาน" หรือ ถูกลบออก

## Audit: Current State of Commands 05-11

| # | Command | เนื้อหาปัจจุบัน | คำแนะนำเบื้องต้น |
|---|---------|----------------|-----------------|
| 05 | **Roadmap** | Skeleton — Competitor Analysis, Feature Roadmap, Discovery | 🟡 **รวมเข้า Coach** — Coach สามารถทำ Roadmap ได้ในโหมด Read-Only |
| 06 | **Ideate** | Skeleton — Brainstorm Quality/Security/UI/Perf/Docs | 🟡 **รวมเข้า Coach** — เป็น Discovery phase ของ Coach อยู่แล้ว |
| 07 | **Spec** | Skeleton — Interactive spec generator via Python script | 🔴 **ลบ** — ซ้ำซ้อนกับ `/01-New-Task` ที่ทำหน้าที่เดียวกัน |
| 08 | **Manage** | Skeleton — Complexity estimate + follow-up planning | 🟡 **พัฒนาต่อ** — Task Dashboard สำหรับดูสถานะรวม |
| 09 | **Utils** | Skeleton — Insight extractor + QA fixer | 🔴 **ลบ** — คลุมเครือเกินไป ฟังก์ชันย่อยควรรวมเข้า 03/04 |
| 10 | **Human** | ✅ มีเนื้อหาดี — Approve/Reject/Review/Feedback | ✅ **เก็บไว้ + ปรับปรุง** — จำเป็นสำหรับ Human-in-the-loop workflow |
| 11 | **Agent** | มีเนื้อหาพอใช้ — Invoke specialist agents | 🟡 **เก็บไว้ + ปรับปรุง** — แก้ path จาก `.auto-claude/agents/` เป็น `.cursor/agents/` |

> ⚠️ **หมายเหตุ**: คำแนะนำข้างต้นเป็นการประเมินเบื้องต้น ทีมควรรีวิวและตัดสินใจร่วมกัน

## Steps / High-level Requirements
1. **Audit**: ตรวจสอบเนื้อหาทุกคำสั่ง (ทำแล้วในตารางข้างบน)
2. **Decide**: ตัดสินใจแต่ละคำสั่ง: Keep / Merge / Remove
3. **Execute**:
   - ลบไฟล์ที่ตัดสินใจลบ
   - รวมเนื้อหาที่ต้องการ merge เข้าคำสั่งหลัก
   - ปรับปรุงคำสั่งที่เก็บไว้ให้มีคุณภาพเท่ากับ 00-04
4. **Update README**: อัปเดต Commands section ใน README ให้ตรงกับความจริง
5. **Update INITIAL.md**: รัน init-sync ใหม่เพื่ออัปเดต Context

## Impact / Priority
- Impact: Medium (ลดความสับสนของ Dev ใหม่)
- Priority: Medium (ไม่ urgent แต่ปรับปรุง Developer Experience)

## Related Files
- `.cursor/commands/05-Roadmap.md` (34 lines, skeleton)
- `.cursor/commands/06-Ideate.md` (38 lines, skeleton)
- `.cursor/commands/07-Spec.md` (29 lines, skeleton — ซ้ำกับ 01-New-Task)
- `.cursor/commands/08-Manage.md` (30 lines, skeleton)
- `.cursor/commands/09-Utils.md` (31 lines, skeleton)
- `.cursor/commands/10-Human.md` (50 lines, มีเนื้อหาดี)
- `.cursor/commands/11-Agent.md` (42 lines, มีเนื้อหาพอใช้)
- `.cursor/agents/` (12 agent files — อ้างอิงโดย 11-Agent)
- `PRPs-Framework/README.md` — ต้องอัปเดตหลังจาก Cleanup

## Related PRPs (if known)
- `.auto-claude/specs/004-create-onboarding-script/spec.md` (Onboarding ต้องรู้ว่ามีคำสั่งอะไรบ้าง)
