# Human Actions

Perform explicit human actions on a task, such as approving, rejecting, or providing feedback.

## Usage

```
/10-Human [Action] {ID} [Message]
```

Example: `/10-Human Approve 003`
Example: `/10-Human Reject 003 "Needs better error handling"`
Example: `/10-Human Feedback 003 "เพิ่ม validation สำหรับ email format ด้วย"`

## Arguments

- **Action**:
  - `Approve`: Mark task as DONE ✅
  - `Reject`: ส่งงานกลับไปแก้ไข → วนกลับเข้า `/03-Code` 🔄
  - `Review`: Mark task as REVIEW NEEDED.
  - `Feedback`: เพิ่ม feedback note → วนกลับเข้า `/03-Code` 🔄
- **ID**: Task ID (e.g., `003`).
- **Message**: เหตุผลหรือ feedback (บังคับสำหรับ Reject/Feedback)

---

## Process

### Step 1: Locate Task
ค้นหาโฟลเดอร์ `.auto-claude/specs/{ID}-*/` และอ่าน `implementation_plan.json`

### Step 2: Execute Action

#### ✅ Approve (Mark as DONE)
```powershell
python PRPs-Framework/apps/tools/json_executor.py set-status {plan_path} done
```
- Status → `done`
- **End of lifecycle** — งานเสร็จสมบูรณ์

#### 🔄 Reject (ส่งกลับแก้ไข)
```powershell
python PRPs-Framework/apps/tools/json_executor.py set-status {plan_path} in_progress
```
- Status → `in_progress`
- **บันทึก Rejection** ใน `qa_report.md` ต่อท้ายหัวข้อ `## Rejection History`:
  ```markdown
  ## Rejection History
  ### Round 1 — {Date}
  - **Reviewer**: Human
  - **Reason**: {Message}
  - **Action Items**:
    - [ ] {สิ่งที่ต้องแก้ 1}
    - [ ] {สิ่งที่ต้องแก้ 2}
  ```
- **แนะนำ Next Step**: _"รัน `/03-Code {ID}` เพื่อแก้ไขตาม Feedback"_

> ⚠️ **สำคัญ**: Agent ที่รัน `/03-Code` ครั้งถัดไปต้องอ่าน Rejection History ก่อน เพื่อแก้ปัญหาที่คนชี้ไว้

#### 📝 Feedback (เพิ่ม Note แล้ววนกลับ)
```powershell
python PRPs-Framework/apps/tools/json_executor.py set-status {plan_path} in_progress
```
- Status → `in_progress`
- **บันทึก Feedback** ใน `qa_report.md` ต่อท้ายหัวข้อ `## Feedback History`:
  ```markdown
  ## Feedback History
  ### Round 1 — {Date}
  - **From**: Human
  - **Feedback**: {Message}
  - **Action Items**:
    - [ ] {สิ่งที่ต้องเพิ่ม/ปรับ}
  ```
- **แนะนำ Next Step**: _"รัน `/03-Code {ID}` เพื่อปรับปรุงตาม Feedback"_

#### 👀 Review (ขอรีวิวเพิ่ม)
```powershell
python PRPs-Framework/apps/tools/json_executor.py set-status {plan_path} human_review
```
- Status → `human_review`
- ใช้เมื่อต้องการให้คนอื่นมารีวิวเพิ่มเติม

### Step 3: Notify
แสดงสรุปให้ผู้ใช้:

```
📋 Human Action: {Action} on Task {ID}
📌 Status: {new_status}
📌 Next Step: {recommendation}
```

---

## Workflow Diagram

```
/03-Code {ID}
    ↓
/04-Verify {ID} (QA Report + Manual Guide)
    ↓
Status: human_review
    ↓
Human ตรวจสอบตาม Manual Verification Guide
    ↓
    ├── /10-Human Approve {ID}  → ✅ Done (จบ)
    ├── /10-Human Reject {ID}   → 🔄 in_progress → /03-Code (วนกลับ)
    └── /10-Human Feedback {ID} → 🔄 in_progress → /03-Code (วนกลับ)
```

> **Reject/Feedback Loop**: จะวนไปเรื่อยๆ จนกว่าจะ Approve
> ทุกรอบจะมี Round number เพิ่มขึ้น (Round 1, Round 2, ...)

---

## Output
- **Updated Files**: `implementation_plan.json` (status), `qa_report.md` (rejection/feedback history)
