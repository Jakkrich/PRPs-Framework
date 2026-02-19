# Create New Task

Create an ISSUE spec directory and initial plan files for any kind of work item (bug, feature, change, refactor, etc.).

## Usage

```
/01-New-Task {Title} ["Description"]
```

---

## Internal Process & AI Agent Instructions

### Step 1: Execute Creation Script
Run the script to scaffold the task folder structure:

```powershell
python .cursor/scripts/create-task.py "{Title}" "{Description}"
```

> ⚠️ **Encoding Warning**: หากคำอธิบาย (Description) เป็นภาษาไทย ให้ Agent ใช้ `write_to_file` หรือ `replace_file_content` เพื่ออัปเดตเนื้อหาภาษาไทยลงในไฟล์โดยตรง **ห้ามส่ง String ภาษาไทยผ่าน CLI Arguments** เพราะจะทำให้สระหายบน Windows

**สคริปต์จะสร้าง:**
- `.auto-claude/specs/{ID}-{slug}/`
  - `implementation_plan.json` (Status: `pending`)
  - `task_metadata.json` (Default values - จะถูกอัปเดตใน Step 2)
  - `requirements.json`
  - `spec.md` (Template)

---

### Step 2: AI Intelligent Analysis (MANDATORY)

> 🧠 **ขั้นตอนนี้บังคับ** — Agent ต้องทำทันทีหลัง Step 1 โดยไม่ต้องรอคำสั่งเพิ่มจากผู้ใช้

#### 2.1 — Analyze & Classify Task

จากเนื้อหาของ Title และ Description ให้ Agent วิเคราะห์และประเมินค่าต่อไปนี้:

| Field        | ตัวเลือก                                     | วิธีตัดสิน                                         |
|--------------|----------------------------------------------|-----------------------------------------------------|
| `category`   | `fix`, `feat`, `refactor`, `docs`, `chore`   | ดูจาก keyword เช่น bug→fix, add/new→feat, update docs→docs |
| `priority`   | `low`, `medium`, `high`, `critical`          | ผลกระทบต่อผู้ใช้/ระบบมากแค่ไหน                       |
| `complexity` | `low`, `medium`, `high`                      | จำนวนไฟล์/ระบบที่ต้องแก้ไข                           |
| `impact`     | `low`, `medium`, `high`                      | ส่งผลต่อผู้ใช้งานกี่คน / กี่ feature                   |

#### 2.2 — Update `task_metadata.json`

นำค่าที่วิเคราะห์ได้ไปอัปเดตทับค่า Default ในไฟล์ `task_metadata.json`:

```json
{
  "category": "<analyzed>",
  "priority": "<analyzed>",
  "complexity": "<analyzed>",
  "impact": "<analyzed>"
}
```

#### 2.3 — Enrich `spec.md`

ทำการ Research เบื้องต้นใน Codebase เพื่อ:
- หาไฟล์ที่เกี่ยวข้อง → เติมในส่วน `## Context`
- หา Related Tasks ที่มีอยู่แล้ว → เติมในส่วน `## Related PRPs`
- ปรับ `## Impact / Priority` ให้ตรงกับการวิเคราะห์ (แทนที่ค่า Medium ทั้งหมด)
- ถ้า Description เป็นภาษาไทย ให้ใช้ `replace_file_content` เพื่อเขียนทับข้อมูลที่ถูกต้องลงไป

#### 2.4 — Fix Thai Encoding (ถ้าจำเป็น)

ถ้าพบว่าไฟล์ `spec.md`, `implementation_plan.json`, หรือ `requirements.json` มีสระหาย/ตัวอักษรผิดเพี้ยน (จากปัญหา Windows CLI Encoding) ให้ Agent ใช้ `replace_file_content` เขียนค่าที่ถูกต้องทับทันที

---

### Step 3: Output Summary

สรุปให้ผู้ใช้ทราบในรูปแบบ:

```
✅ Task Created: {ID}-{slug}
📁 Path: .auto-claude/specs/{ID}-{slug}/

🧠 AI Analysis:
- Category: {analyzed_category}
- Priority: {analyzed_priority}
- Complexity: {analyzed_complexity}
- Impact: {analyzed_impact}

📌 Next Step: Run `/02-Plan {ID}` to generate the Implementation Plan.
```

---

## Git Context (Reference)

Branch naming follows `PRPs-Framework/_notes/git-branch-naming-conventions.md`:
- `fix/`: Bugs
- `feat/`: Features/Changes
- `refactor/`: Refactoring
- `docs/`: Documentation

## Output
- **New Spec Directory** created under `.auto-claude/specs/{ID}-{slug}/`.
- **Enriched Metadata** with AI-analyzed category, priority, complexity, and impact.
- **Next Step**: Run `/02-Plan {ID}` to generate the full Implementation Plan using AI research.
