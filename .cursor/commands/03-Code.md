# Implement Code

Execute the implementation plan for a task in the `.auto-claude` system.

## Usage

```
/03-Code {ID}
```

Where `{ID}` is the numeric prefix of the task (e.g., `012`).

---

## Internal Process & AI Agent Instructions

### Step 0: Load & Validate Context

ก่อนเริ่มเขียนโค้ด Agent **ต้อง**:

1. **Locate Task**: ค้นหาโฟลเดอร์ `.auto-claude/specs/{ID}-*/`
2. **Read Plan**: อ่าน `implementation_plan.json` เพื่อรับ Phases & Subtasks
3. **Read Spec**: อ่าน `spec.md` เพื่อรับ Requirements & Context
4. **Read Metadata**: อ่าน `task_metadata.json` เพื่อรับ priority/complexity
5. **Validate Readiness**: ตรวจสอบว่า:
   - `implementation_plan.json` มี `phases` ที่ไม่ว่าง
   - `status` ไม่ใช่ `done` (ยังไม่เสร็จ)
   - ถ้า `status` ยังเป็น `pending` → ให้แนะนำผู้ใช้รัน `/02-Plan {ID}` ก่อน
6. **Check for Rejection/Feedback** (Re-entry Detection):
   - ตรวจว่ามีไฟล์ `qa_report.md` อยู่หรือไม่
   - ถ้ามี → อ่าน `## Rejection History` หรือ `## Feedback History` เพื่อหา Action Items ที่ยังไม่ได้แก้
   - ถ้ามี Action Items → **เข้าโหมด Fix Mode** (ดูด้านล่าง)
   - ถ้าไม่มี → ทำ Subtask Loop ปกติ

---

### Step 0.5: Fix Mode (Reject/Feedback Re-entry) 🔄

> ถูก Trigger เมื่อ `/03-Code` ตรวจพบว่ามี Rejection/Feedback History ใน `qa_report.md`

เมื่อเข้า Fix Mode:
1. **อ่าน Action Items** จาก `qa_report.md` (ส่วน Rejection/Feedback History)
2. **แสดงสรุปให้ User**:
   ```
   🔄 Re-entry Mode: Task {ID} ถูก Reject/Feedback
   📋 Action Items ที่ต้องแก้:
     - [ ] Item 1
     - [ ] Item 2
   
   🔧 เริ่มแก้ไขตาม Feedback...
   ```
3. **แก้ไขตาม Action Items** — Focus เฉพาะสิ่งที่คนชี้ไว้
4. **อัปเดต Action Items** ใน `qa_report.md` ให้เป็น `[x]` เมื่อแก้เสร็จ
5. **เสร็จแล้ว → Auto-trigger `/04-Verify {ID}`** (วนต่อ)

```
🔄 Feedback Loop:
/03-Code → /04-Verify → Human Review
    ↑                        ↓
    └── Reject/Feedback ←────┘
```

---

### Step 1: Initialize Execution

```powershell
python PRPs-Framework/apps/tools/json_executor.py set-status {plan_path} in_progress
```

---

### Step 2: Execute Subtasks (Loop)

```
While True:
  1. Get Next Task:
     python PRPs-Framework/apps/tools/json_executor.py next {plan_path}
  
  2. If output is "NO_PENDING_TASKS" → Break loop
  
  3. Parse output: TASK_ID, DESCRIPTION, FILES
  
  4. Context: Read spec.md and relevant files
  
  5. Action: Implement changes for the task description
  
  6. Verification: Run verification command specified in subtask
  
  7. Complete:
     python PRPs-Framework/apps/tools/json_executor.py complete {plan_path} {TASK_ID} --files {touched_files}
  
  8. Checkpoint (if Git): git add -A && git commit -m "checkpoint: {TASK_ID} - {short_desc}"
```

### Validation Guidelines

ระหว่างทำงานแต่ละ Subtask ให้ Agent:
- **Lint Check**: รันคำสั่ง lint ของโปรเจกต์ (ถ้ามี)
- **Type Check**: รัน type checker (ถ้ามี)
- **Test**: รัน tests ที่เกี่ยวข้อง (ถ้ามี)
- **Fix immediately**: ถ้า validation fail ให้แก้ไขทันทีก่อนไปทำ Subtask ถัดไป
- **Golden Rule**: อย่าสะสม broken state — แก้ให้ผ่านก่อนไปต่อ

---

### Step 3: Phase Transition

เมื่อ Loop จบ (ไม่มี Pending Tasks):
- ตรวจสอบว่ายังมี Phase ถัดไปหรือไม่
- ถ้ามี → เริ่ม Loop ใหม่สำหรับ Phase ถัดไป
- ถ้าไม่มี → ไปที่ Step 4

---

### Step 4: Completion & Transition to QA

เมื่อทุก Phase เสร็จสมบูรณ์:
1. **Final Verification**: รันการตรวจสอบรวมทั้งหมด
2. **Auto-Trigger QA**: Agent ต้องรันคำสั่ง `/04-Verify {ID}` ทันที (ไม่ต้องรอผู้ใช้สั่ง)
3. **Status Update**: `json_executor.py` จะอัปเดตสถานะเป็น `ai_review` อัตโนมัติ

---

## Output

- **Updated File**: `.auto-claude/specs/{ID}/implementation_plan.json` with progress and final status.
- **Git Commits**: Checkpoint commits สำหรับทุก Subtask ที่เสร็จสิ้น (ถ้าใช้ Git)
- **Auto-QA**: QA Report จะถูกสร้างอัตโนมัติโดย `/04-Verify`
