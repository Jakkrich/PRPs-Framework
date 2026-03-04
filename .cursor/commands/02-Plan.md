# Plan Implementation

## Spec File: $ARGUMENTS

Generate a complete Implementation Plan through thorough codebase analysis and research.

## Usage

```
/02-Plan {ID}
```

Where `{ID}` is the numeric prefix of the task (e.g., `012`).

---

## Internal Process & AI Agent Instructions

### Step 0: Locate Task

ค้นหาโฟลเดอร์งานจาก ID ที่ได้รับ:
- ค้นหาใน `.auto-claude/specs/` หาโฟลเดอร์ที่ขึ้นต้นด้วย `{ID}-`
- อ่าน `spec.md` และ `implementation_plan.json`
- อ่าน `task_metadata.json` เพื่อรับค่า category, priority, complexity

---

### Step 1: AI Context Analysis (MANDATORY)

> 🧠 **ขั้นตอนนี้บังคับ** — Agent ต้องทำการวิเคราะห์ก่อน Populate Plan

#### 1.1 — Read & Understand Spec
- อ่าน `spec.md` เพื่อทำความเข้าใจ Goal และ Requirements
- อ่าน `task_metadata.json` เพื่อรับ context ด้าน priority/complexity

#### 1.2 — Codebase Research
- ค้นหาไฟล์ที่เกี่ยวข้องใน Codebase
- หา Pattern ที่มีอยู่แล้ว (เพื่อ Reuse ไม่ใช่สร้างใหม่)
- สแกน `PRPs-Framework/references/` เพื่อดึงตัวอย่างที่เกี่ยวข้อง

#### 1.3 — External Research (ถ้าจำเป็น)
- Web search สำหรับ docs, best practices, หรือ API reference

---

### Step 2: Design Solution Architecture

จาก Research ข้างต้น ให้ออกแบบ:
- **Architecture**: โครงสร้างที่จะสร้าง/แก้ไข
- **Phases**: แบ่งงานเป็นกลุ่ม (Phase 1: Foundation, Phase 2: Core Logic, etc.)
- **Subtasks**: ภายใน Phase แต่ละตัว ให้ย่อยเป็น Subtask ที่ทำได้ทีละก้าว
- **Verification**: แต่ละ Subtask ต้องมีวิธีตรวจสอบว่าเสร็จจริง

---

### Step 3: Populate Implementation Plan

#### 3.1 — Update `implementation_plan.json`

ใช้เครื่องมือ:
```powershell
python PRPs-Framework/apps/tools/json_planner.py create {spec_path} --feature "{Feature Name}" --desc "{Description}"
```

> ⚠️ **Encoding Warning**: ถ้า Description เป็นภาษาไทย ให้ใช้ `replace_file_content` เพื่ออัปเดต JSON โดยตรง ห้ามส่ง String ภาษาไทยผ่าน CLI

จากนั้นเพิ่ม Phases & Subtasks ลงใน JSON:

```json
{
  "phases": [
    {
      "name": "Phase 1: <Name>",
      "subtasks": [
        {
          "id": "1.1",
          "description": "<What to do>",
          "status": "pending",
          "files": ["<expected files>"],
          "verification": "<How to verify>"
        }
      ]
    }
  ]
}
```

#### 3.2 — Create `plan.md`

สร้างไฟล์ Markdown ที่อ่านง่ายสำหรับคน ประกอบด้วย:
- **Goal**: สรุปเป้าหมาย
- **Architecture**: แผนภาพ/คำอธิบายโครงสร้าง
- **Phases & Tasks**: สรุปลำดับงาน
- **Risks & Considerations**: ข้อควรระวัง

---

### Step 4: Validate Metadata Consistency

> 🧠 **ขั้นตอนนี้บังคับ** — ตรวจสอบ Metadata อีกครั้งหลังจากวิเคราะห์แผนงาน

- **Re-evaluate** `task_metadata.json` ด้วยข้อมูลใหม่ที่ได้จากการ Research
  - Complexity อาจเปลี่ยนหลังจากเจอ Codebase จริง
  - Priority อาจเปลี่ยนหลังจากเข้าใจ Impact ที่แท้จริง
- **Update** ถ้าค่าเปลี่ยน (อัปเดตทั้ง `task_metadata.json` และ `spec.md`)
- **Report**: แจ้งผู้ใช้ว่ามีการปรับ Metadata จากค่าเดิมอย่างไร (ถ้ามี)

---

### Step 5: Finalize Plan

- อัปเดตสถานะเป็น `queue`:
  ```powershell
  python PRPs-Framework/apps/tools/json_executor.py set-status {plan_path} queue
  ```

- สรุปให้ผู้ใช้:
  ```
  ✅ Plan Ready: {ID}-{slug}
  📋 Phases: {N} phases, {M} subtasks
  🧠 Metadata: Category={cat}, Priority={pri}, Complexity={comp}
  
  📌 Next Step: Run `/03-Code {ID}` to start implementation.
  ```

---

## Quality Checklist
- [ ] All necessary context included in plan
- [ ] Validation gates are executable by AI
- [ ] References existing patterns OR documentation
- [ ] Clear implementation path (subtasks are small & atomic)
- [ ] Error handling documented
- [ ] Metadata reflects actual analysis (not defaults)

## Output
- **Implementation Plan (JSON)**: `.auto-claude/specs/{ID}/implementation_plan.json`
- **Human Readable Plan (Markdown)**: `.auto-claude/specs/{ID}/plan.md`
- **Updated Metadata**: `.auto-claude/specs/{ID}/task_metadata.json` (re-validated)
