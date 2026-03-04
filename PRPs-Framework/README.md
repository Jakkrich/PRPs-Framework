# PRP Framework & Context Engineering (คู่มือการใช้งาน)

Framework นี้ออกแบบมาเพื่อช่วยทั้ง **SA/BA** และ **DEV** ให้ทำงานร่วมกับ AI (เช่น Cursor/Claude Code) ได้อย่างเป็นระบบ ตั้งแต่การเก็บ requirement ไปจนถึงการเขียนแผน (Plan) การ Implement และการทำ QA โดยใช้ระบบ **Stateful Implementation Plan**

**หลังติดตั้ง Framework:** รันคำสั่ง **`/init-sync`** (หรือ `/00-prp-init-context`) เป็นครั้งแรก เพื่อสร้างหน้าดัชนีโครงการ `INITIAL.md` (Project Index) และ Security Profile — รันซ้ำได้ทุกครั้งที่โปรเจกต์มีการเปลี่ยนแปลงโครงสร้างใหญ่ๆ

---

## โครงสร้างโปรเจกต์หลัก

```text
INITIAL.md                 # Project Index (สรุปภาพรวม + สถานะงานปัจจุบัน)
README.md                  # คู่มือ Onboarding สำหรับผู้ใช้ใหม่ (Root)

.auto-claude/
  └── specs/               # พื้นที่จัดการงาน (Tasks) แยกตามโฟลเดอร์ {ID}-{slug}
      └── 001-feat-login/
          ├── spec.md      # ISSUE Spec (Requirements)
          ├── plan.md      # Readable Plan (แผนที่ AI วางไว้)
          ├── implementation_plan.json # Source of Truth (Task State & Subtasks)
          ├── qa_report.md # ผลการทำ QA/Verify
          └── ...          # ไฟล์อื่นๆ ที่เกี่ยวข้องกับงานนี้

PRPs-Framework/
  ├── apps/                # Core Engine (Analyzer, Planner, Executor)
  ├── templates/           # Blueprints สำหรับงานประเภทต่างๆ
  └── README.md            # [คุณอยู่ที่นี่] คู่มือฉบับเต็มของ Framework
```

---

## กติกาการตั้งชื่อ (External Ref ID: บังคับ)

เพื่อให้ trace งานกลับไปหา Jira/GitHub/Redmine/CRM ได้ตรงกันทั้ง repo:

- **ID Prefix ต้องเป็นชื่อโฟลเดอร์หลักของงาน**
- **มาตรฐานการตั้งชื่อ**:
  - **Task Directory**: `.auto-claude/specs/{ID}-{slug}/`
  - **Branch name**: `{type}/{id}-{slug}`
  - ตัวอย่าง:
    - `.auto-claude/specs/012-fix-auth-bug/`
    - `fix/012-fix-auth-bug`

## บทบาทของแต่ละไฟล์

- `INITIAL.md` (Project Index)
  - ทำหน้าที่เป็น **สารบัญโครงการ** ที่อัปเดตอัตโนมัติเมื่อใช้ `/init-sync`
  - รวบรวมข้อมูล Stack, Security และสถานะงานทั้งหมดในเครื่อง

- `.auto-claude/specs/{ID}-{slug}/implementation_plan.json`
  - **Single Source of Truth** สำหรับการทำงานแบบก้าวหน้า (Stateful)
  - เก็บรายการ Subtasks, ผลการรัน และ Metadata ทั้งหมด

- `PRPs-Framework/apps/`
  - บรรจุเครื่องมือหลักที่ AI เรียกใช้เบื้องหลัง (เช่น `json_planner.py`, `json_executor.py`)
  - โฟลเดอร์ `apps/backend/` ทำหน้าที่วิเคราะห์ codebase เชิงลึก

---

## Agent-based Development Flow

Framework นี้รองรับ **Agent-based Development Flow** ที่ช่วยให้คุณทำงานร่วมกับ AI ได้อย่างเป็นระบบ ตั้งแต่การกำหนด tasks ไปจนถึงการ implement และ validation

### Flow Overview (Workflow หลัก - ISSUE → Code)

```text
ISSUE (GitHub/Jira/Stakeholder)
    ↓
/01-New-Task "Login fails"
    ↓
.auto-claude/specs/012-login-fails/spec.md
    ↓
/02-Plan 012
    ↓
.auto-claude/specs/012-login-fails/implementation_plan.json (Ready to work)
    ↓
/03-Code 012 [--auto-qa]
    ↓
[AI ทำทีละ subtask, รัน validation อัตโนมัติ, อัปเดตสถานะจนครบทุก Phase]
    ↓
✅ Complete (Ready for Human Review)
```

### Commands หลัก (The Core Four)

| Command | ใช้เมื่อ | Syntax | ผลลัพธ์ที่ได้ |
|---------|---------|--------|-------------|
| `/init-sync` | **เริ่มต้น / Sync** | `/init-sync` | อัปเดต `INITIAL.md` และ Security Profile |
| `/01-New-Task` | **เปิดงานใหม่** | `/01-New-Task "Title" "Desc"` | สร้างโฟลเดอร์งาน + `spec.md` |
| `/02-Plan` | **วางแผนงาน** | `/02-Plan {ID}` | สร้าง `implementation_plan.json` และ `plan.md` |
| `/03-Code` | **ลงมือทำโค้ด** | `/03-Code {ID}` | รัน Loop แก้ไขงานทีละชิ้นจนเสร็จ |
| `/04-Verify` | **ตรวจสอบคุณภาพ** | `/04-Verify {ID}` | สร้าง `qa_report.md` สรุปผลการทดสอบ |
| `/10-Human` | **ตัดสินใจ/รีวิว** | `/10-Human Approve {ID}` | ปิดงานสถานะ DONE |

### ตัวอย่างการใช้งาน (Workflow หลัก - ISSUE → Subtasks)

**Phase 1: ISSUE → ISSUE Spec → PRP**
```bash
# 1. สร้าง ISSUE Spec จาก ISSUE (GitHub/Jira/Stakeholder)
/01-Draft-New-Task BUG CRM-1023 Login fails after password reset
# → สร้าง PRPs-Framework/issues/ISSUE_EXAMPLE-001.md

# 2. เติมรายละเอียดใน ISSUE Spec (Context, Problem, Steps, Impact)

# 3. สร้าง PRP พร้อม Plan/Subtasks
/02-Plan-Implementation PRPs-Framework/issues/ISSUE_EXAMPLE-001.md
# → สร้าง PRPs-Framework/PRPs/PRPs_BUG-EXAMPLE-001_prp.md พร้อม Plan/Subtasks (T1, T2, T3...)
```

### ตัวอย่างการใช้งาน (Manual Mode - สำหรับงานซับซ้อน)

**สำหรับ Workflow หลัก (ISSUE → Subtasks):**
```bash
# 1. สร้าง ISSUE Spec (รวมถึงสร้าง Folder งาน)
/01-Draft-New-Task BUG 456 Login fails
# → สร้าง PRPs-Framework/issues/456_login-fails/spec.md

# 2. เติมรายละเอียด และให้ AI สร้าง PRP
/02-Plan-Implementation PRPs-Framework/issues/456_login-fails/spec.md
# → สร้าง PRPs-Framework/issues/456_login-fails/prp.md

# 3. Build & QA
/03-Implement-Code PRPs-Framework/issues/456_login-fails/prp.md --auto-qa
```

### คู่มือการใช้งานแบบละเอียด

ดูคู่มือการใช้งานแบบละเอียดได้ที่ [AGENT_FLOW.md](AGENT_FLOW.md)

---

## คำสั่งสำคัญ (Cursor Commands)

### สถานะของการจัดการงาน (Status Symbols)
ในระหว่างการทำงาน AI และผู้ใช้จะใช้สัญลักษณ์เหล่านี้เพื่อบอกสถานะของแต่ละ Task:
- `[OK]` - **Complete**: งานเสร็จสมบูรณ์
- `[..]` - **In Progress**: กำลังดำเนินการ
- `[--]` - **Initialized**: เริ่มต้นสร้าง (ยังไม่ได้เริ่มทำ)
- `[  ]` - **Pending**: รอกำลังดำเนินการ

---

### 0. `/init-sync` – คำสั่งแรกหลังติดตั้ง
ใช้เมื่อต้องการให้ AI สแกนโปรเจกต์และสร้างหรืออัปเดตไฟล์ `INITIAL.md` (Project Index) และ Security Profile เพื่อเป็นบริบทเริ่มต้นในการทำงาน

---

### 1. `/01-New-Task` – สร้างโจทย์ (Issue Spec)
ใช้เมื่อมีงานใหม่ ไม่ว่าจะเป็น BUG, FEATURE หรือ REFACTOR เพื่อสร้างโฟลเดอร์งานเตรียมไว้

**ตัวอย่าง:**
```text
/01-New-Task "Refactor Auth System" "ปรับปรุงระบบ Login ให้รองรับ MFA"
```

**ผลลัพธ์:**
- สร้างโฟลเดอร์ `.auto-claude/specs/{ID}-refactor-auth-system/`
- ภายในมีไฟล์ `spec.md` สำหรับระบุรายละเอียดความต้องการ (Requirements)

---

### 2. `/02-Plan` – วางแผนแบบ Agentic
AI จะทำการวิเคราะห์ Codebase, ค้นหา Pattern ที่เกี่ยวข้อง และวางแผนการ Implement เป็นขั้นตอน (Subtasks)

**ตัวอย่าง:**
```text
/02-Plan 012
```

**ผลลัพธ์:**
- **`implementation_plan.json`**: ไฟล์สถานะงานแบบละเอียด (Source of Truth)
- **`plan.md`**: สรุปแผนงาน สถาปัตยกรรม และ UX ในรูปแบบที่คุยกับคนได้ง่าย

---

### 3. `/03-Code` – ลงมือสร้างโค้ดอัตโนมัติ
AI จะอ่านแผนจาก JSON และไล่ทำทีละ Subtask โดยมีการรัน Validation Loop (Type Check, Lint) ในทุกก้าว

**ตัวอย่าง:**
```text
/03-Code 012
```

**คุณสมบัติ:**
- **Checkpointing**: การ Commit งานเป็นระยะ (ถ้าใช้ Git)
- **Auto-Verification**: ตรวจสอบผลลัพธ์ทันทีที่เขียนโค้ดเสร็จ
- **State Persistence**: สามารถหยุดและทำต่อได้ตลอดเวลาโดยไม่เสียบริบท

---

### 4. `/04-Verify` – สรุปรายงานการตรวจสอบ
ใช้หลังจาก Implement เสร็จสิ้น เพื่อให้ AI รัน QA Review แบบเข้มข้นและสร้างรายงานสรุป

**ผลลัพธ์:**
- **`qa_report.md`**: สรุปผลการทดสอบ, Coverage และจุดเสี่ยงที่พบ

---

## 🎯 สรุปแนวคิด Stateful Implementation
เราเปลี่ยนจากยุคที่ AI เขียนโค้ดรวดเดียวแล้วพัง มาเป็นระบบ **Stateful Loop**:
1. **Spec**: กำหนดสิ่งที่ "อยากได้" (What)
2. **Plan**: กำหนด "วิธีทำ" (How) และย่อยเป็นงานเล็กๆ (Subtasks)
3. **Execution**: ทำงานทีละก้าว (Subtask) และตรวจเช็ค (Validate) ทันที
4. **State**: สถานะถูกเก็บไว้ใน JSON ทำให้ทั้งคนและ AI รู้เสมอว่าเราอยู่ตรงไหนของแผน

---

## 🔗 อ้างอิง (Reference)
- [Project Documentation Index](./INITIAL.md)
- [Context Engineering Guide](https://github.com/coleam00/context-engineering-intro)

---
*Last Updated: 2026-02-19*
