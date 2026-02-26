## Project Context Index

ใช้ไฟล์นี้เป็น "หน้ารวมภาพรวมโปรเจกต์" และดัชนีลิงก์ไปหา PRPs, references, และ documentation อื่น ๆ  
ข้อควรระวัง: ก่อนเปลี่ยนโครงสร้างใหญ่ ๆ ควรเก็บ snapshot ไว้ด้วย Git commit

### Project Overview
- **Platform/Stack**: Generic / PRPs-Framework
- **Description**: Framework สำหรับการทำ Context Engineering และ Agent-based Development เพื่อช่วยให้ SA/BA และ DEV ทำงานร่วมกับ AI ได้อย่างเป็นระบบ

### System Requirements Summary (for Rebuild)
- **Workflow**: 4-Step Cycle (JSON-Driven): Create (/01-New-Task) → Plan (/02-Plan) → Execute (/03-Code) → Verify (/04-Verify).
- **Organization**: ใช้โครงสร้างโฟลเดอร์แยกตาม Issue ID เพื่อจัดเก็บ Spec, PRP และผลการรันงานรวมกัน.
- **Traceability**: บังคับใช้ External Ref ID เป็น prefix สำหรับชื่อไฟล์และ branch เพื่อให้ trace กลับไปยังระบบจัดการงานได้.
- **Execution**: AI ต้องทำตาม Plan/Subtasks ใน PRP และรัน Validation Loop เพื่อยืนยันความถูกต้อง.

### File & Directory Index
- `INITIAL.md`: ไฟล์สารบัญโครงการ (หน้าปัจจุบัน)
- `.auto-claude/`: พื้นที่เก็บสถานะงาน
  - `specs/`: รายการ Task ที่ผ่านการ Process แล้ว
  - `issues/`: Staging Area สำหรับงานที่รอตั้งต้น
### 🛠️ Core Commands (Zero-Script Mode)
ใช้คำสั่งเหล่านี้ใน Chat เพื่อควบคุม Workflow:
- `/00-Init` : (Init) วิเคราะห์โปรเจกต์และเซ็ตอัป `.cursorrules` จาก Template
- `/01-New-Task` : (New Task) สร้างโฟลเดอร์งานและเขียน Spec เบื้องต้น
- `/02-Plan` : (Plan) วิเคราะห์โค้ดเชิงลึกและวางแผนงานทีละขั้นตอน
- `/03-Code` : (Implement) ลงมือเขียนโค้ดพร้อมรัน Validation Loop ตลอดเวลา
- `/04-Verify` : (Verify) ตรวจสอบคุณภาพโค้ด (Senior Review) และสรุป QA Report
- `/05-PRD` : (Strategic) สร้าง Product Requirements แบบ Hypothesis-driven
- `/06-Debug` : (Debug) สืบสวนหาสาเหตุที่แท้จริง (Root Cause Analyis) ด้วย 5 Whys
- `/07-Commit` : (Git) บันทึกงานพร้อมเขียนข้อความ Commit ที่สื่อสารชัดเจน
- `/08-PR` : (Git) สร้าง Pull Request ที่มีมาตรฐาน พร้อมสรุปสิ่งที่เปลี่ยนแปลง
- `/09-Research` : (Explorer) สำรวจและวาดแผนที่โครงสร้างโค้ด (Cartography)
- `/99-Coach` : (Coach) ปรึกษาแนวทางและบทเรียนที่เคยบันทึกไว้

### Project Context (Auto-Synced)
- **Detected Stack**: Generic / PRPs-Framework
- **Active Project**: `./` (Root)
- **Project Path**: `D:/wsl/prp-auto-dev/`
- **Mode**: Pure Agentic (Zero-Script)
- **Standard**: Follows `.cursorrules` (Multi-project aware)
- **Last Sync**: 2026-02-26 13:15 (Local Time)

### Active Specs & Tasks
- 000-hello-world

### Incoming Issues (Staging Area)
- 11569
### Documentation
- [README (Root)] - `README.md`


### Other Considerations (Global Gotchas)
- **External Ref ID**: ตรวจสอบ External Ref ID ทุกครั้งก่อนสร้างไฟล์หรือแตก branch ใหม่.
- **Index Refresh**: สามารถรันคำสั่ง `/00-Init` ซ้ำได้เพื่ออัปเดตไฟล์นี้ให้เป็นปัจจุบัน.
