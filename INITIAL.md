## Project Context Index

ใช้ไฟล์นี้เป็น "หน้ารวมภาพรวมโปรเจกต์" และดัชนีลิงก์ไปหา PRPs, references, และ documentation อื่น ๆ  
ข้อควรระวัง: ก่อนเปลี่ยนโครงสร้างใหญ่ ๆ ควรเก็บ snapshot ไว้ด้วย Git commit

### Project Overview
- **Platform/Stack**: Generic / PRPs-Framework
- **Description**: Framework สำหรับการทำ Context Engineering และ Agent-based Development เพื่อช่วยให้ SA/BA และ DEV ทำงานร่วมกับ AI ได้อย่างเป็นระบบ

### System Requirements Summary (for Rebuild)
- **Workflow**: รองรับการเริ่มงานจาก ISSUE → ISSUE Spec → PRP (Plan) → Execute → QA.
- **Organization**: ใช้โครงสร้างโฟลเดอร์แยกตาม Issue ID เพื่อจัดเก็บ Spec, PRP และผลการรันงานรวมกัน.
- **Traceability**: บังคับใช้ External Ref ID เป็น prefix สำหรับชื่อไฟล์และ branch เพื่อให้ trace กลับไปยังระบบจัดการงาน (Jira/GitHub) ได้.
- **Execution**: AI ต้องทำตาม Plan/Subtasks ใน PRP และรัน Validation Loop เพื่อยืนยันความถูกต้อง.

### File & Directory Index
- `INITIAL.md`: ไฟล์สารบัญโครงการ (หน้าปัจจุบัน)
- `PRPs-Framework/`: โฟลเดอร์หลักของ Framework
  - `templates/`: เทมเพลตมาตรฐาน (`prp_base.md`, `initial_base.md`, `tasks_base.md`)
  - `issues/`: โฟลเดอร์เก็บงานแยกตาม ID (เช่น `EXAMPLE-001/`)
  - `PRPs/`: ไฟล์ PRP (Legacy หรือพื้นที่เก็บรวม)
  - `references/`: โค้ดตัวอย่างและแพทเทิร์นสำหรับ AI ใช้แบบ dynamic
  - `apps/`: Core Engine (Backend & Frontend)
  - `apps/backend/`: Backend tools and prompts (replacing legacy `_tools`)


### Project Context (Auto-Synced)
- **Detected Stack**: python, javascript
- **Allowed Commands**: `python`, `pip`, `npm`, `node`, `git`, `gh`, `fd`, `rg`, `ls`, `grep`, `cat`, etc.
- **Guideline Agent**: `/00-Coach` (สำหรับโหมดสอนใช้งานทีละ Step และ mentor แนะนำเนื้องาน)
- **Tools Venv**: `.\.cursor\.venv\`
- **Last Sync**: 2026-02-19 17:22 (Local Time)

### Features
- [EXAMPLE-001] Implement Issue-Based Folders - PRP: `PRPs-Framework/issues/EXAMPLE-001/prp.md`

### Bugs / Issues
- (ยังไม่มีรายการ)

### Changes / Refactors
- [PRPS-001] Align PRPs-Framework with Git Naming Conventions - PRP: `PRPs-Framework/issues/PRPS-001_align-git-conventions/prp.md`
- [PRPS-002] Move .auto-claude-ui to Global AppData - Spec: `.auto-claude/specs/003-move-ui-to-global/spec.md`
- [PRPS-003] Create Root README for framework users - Spec: `.auto-claude/specs/001-create-root-readme/spec.md`

### Examples
- [Project References] - `PRPs-Framework/references/`

### Documentation
- [README (Root)] - `README.md`
- [README (Core)] - `PRPs-Framework/README.md`


### Other Considerations (Global Gotchas)
- **External Ref ID**: ตรวจสอบ External Ref ID ทุกครั้งก่อนสร้างไฟล์หรือแตก branch ใหม่.
- **Index Refresh**: สามารถรันคำสั่ง `/init-sync` ซ้ำได้เพื่ออัปเดตไฟล์นี้ให้เป็นปัจจุบัน.
