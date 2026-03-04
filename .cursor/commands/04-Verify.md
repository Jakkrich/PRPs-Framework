# Verify Quality

## Spec Folder: $ARGUMENTS

Run validation on the feature and generate a QA report.

## Usage

```
/04-Verify {ID}
```

Where `{ID}` is the numeric prefix of the task (e.g., `012`).

---

## Internal Process & AI Agent Instructions

### Step 0: Load Context

1. **Locate Task**: ค้นหาโฟลเดอร์ `.auto-claude/specs/{ID}-*/`
2. **Read Plan**: อ่าน `implementation_plan.json` เพื่อรับ:
   - ไฟล์ที่ถูกแก้ไข (จาก `files` ใน completed tasks)
   - ตรวจสอบว่า Subtasks ทั้งหมดเป็น `completed`
3. **Read Spec**: อ่าน `spec.md` เพื่อเปรียบเทียบ Requirements กับผลลัพธ์
4. **Read Metadata**: อ่าน `task_metadata.json` เพื่อพิจารณาระดับความเข้มข้นของ QA

---

### Step 1: Analysis & Validation

#### Level 1: Syntax & Style
- รันคำสั่ง Lint ของโปรเจกต์ (ถ้ามี)
- ตรวจสอบ Code formatting

#### Level 2: Unit Tests
- รัน Test suite ที่เกี่ยวข้อง (ถ้ามี)
- ตรวจสอบ Test coverage

#### Level 3: Integration (Context-Dependent)
- ทำ Smoke test ของ Feature ที่สร้างขึ้น
- ตรวจสอบว่าไม่มี Regression

#### Level 4: Requirements Match
- ตรวจสอบว่าทุก Requirement ใน `spec.md` ถูก Implement แล้ว
- ระบุ Requirement ที่ยังไม่ครบ (ถ้ามี)

---

### Step 2: Generate QA Report

สร้างไฟล์ `qa_report.md` ใน `.auto-claude/specs/{ID}/`:

```markdown
# QA Report: {Feature Name}
- Date: {YYYY-MM-DD}
- Task ID: {ID}-{slug}
- Status: PASS / FAIL / PARTIAL

## AI Analysis Summary
- Category: {from metadata}
- Priority: {from metadata}
- Complexity: {from metadata}

## Results

### Requirements Coverage
| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1 | ...         | ✅/❌  | ...   |

### Validation Results
| Level | Check | Result | Details |
|-------|-------|--------|---------|
| L1    | Lint  | ✅/❌  | ...     |
| L2    | Tests | ✅/❌  | ...     |

### Files Modified
- `path/to/file.ts` (added/modified/deleted)

## Issues Found
- [ ] Issue 1: ...
- [ ] Issue 2: ...

---

## 🧑‍💻 Manual Verification Guide (บังคับ)

> ⚠️ **ส่วนนี้ต้องมีทุกครั้ง** — เขียนให้ Human Reviewer ทดสอบเองได้โดยไม่ต้องถาม AI

### หลักการเขียน:
1. **Copy-pasteable** — คำสั่งทุกอันต้อง copy ไปรันใน terminal ได้เลย
2. **Checklist** — ใช้ `- [ ]` สำหรับทุกจุดที่ต้องตรวจ
3. **Cleanup** — แนะนำวิธีลบ test data หลังตรวจเสร็จ
4. **ครอบคลุม** — ต้องครอบคลุมอย่างน้อย:
   - ✅ Happy path (ทำงานปกติ)
   - ❌ Error cases (ใส่ข้อมูลผิด → ไม่ crash)
   - 👀 Code review (ชี้บรรทัดที่ต้องตรวจ)
   - 📝 Documentation (ตรวจเอกสารที่อัปเดต)

### ตัวอย่าง:
```
### Test 1: Happy Path
1. **รัน**: `คำสั่ง copy-paste ได้`
2. **ตรวจ**:
   - [ ] ผลลัพธ์ A เป็นอย่างที่คาด
   - [ ] ผลลัพธ์ B ไม่มี error
3. **Cleanup**: `คำสั่งลบ test data`

### Test 2: Error Handling
1. **รัน**: `คำสั่งที่ทำให้เกิด error`
   - [ ] ต้องแสดง error message ที่ชัดเจน (ไม่ crash)
```

---

## ✅ Approval Checklist (บังคับ)

| # | สิ่งที่ต้องผ่าน | ผ่าน? |
|---|---------------|------|
| 1 | [ข้อที่ 1 จาก requirements] | ☐ |
| 2 | [ข้อที่ 2 จาก requirements] | ☐ |
| N | ... | ☐ |

> เมื่อตรวจครบแล้ว รัน: `/10-Human Approve {ID}`
> หรือถ้ามีปัญหา: `/10-Human Reject {ID} "เหตุผล"`

---

## Recommendation
APPROVE / NEEDS_FIX / NEEDS_REVIEW
```

---

### Step 3: Update Plan Status

| QA Result    | New Status     | Action                         |
|-------------|----------------|--------------------------------|
| PASS        | `human_review` | พร้อมให้คนรีวิว                  |
| FAIL        | `in_progress`  | กลับไปแก้ไข (แนะนำรัน `/03-Code`) |
| PARTIAL     | `ai_review`    | AI ต้องตรวจเพิ่มเติม             |

```powershell
python PRPs-Framework/apps/tools/json_executor.py set-status {plan_path} {new_status}
```

---

### Step 4: Output Summary

สรุปให้ผู้ใช้:

```
📋 QA Report: {ID}-{slug}
🔍 Status: {PASS/FAIL/PARTIAL}
📊 Requirements: {N}/{M} covered
🧪 Tests: {result}

📌 Next Step: /10-Human Approve {ID}  (ถ้า PASS)
📌 Next Step: /03-Code {ID}           (ถ้า FAIL — Auto-fix)
```

---

## Workflow Lifecycle

```
/03-Code {ID}
    ↓
/04-Verify {ID} ← คุณอยู่ตรงนี้
    ↓
QA Report + Manual Verification Guide
    ↓
Status: human_review
    ↓
Human ตรวจสอบตาม Guide
    ↓
    ├── /10-Human Approve {ID}   → ✅ Done (จบ)
    ├── /10-Human Reject {ID}    → 🔄 /03-Code (Fix Mode)
    └── /10-Human Feedback {ID}  → 🔄 /03-Code (Fix Mode)
                                        ↓
                                   /04-Verify (วนกลับมาตรงนี้)
```

> **Note**: Reject/Feedback จะวนไปเรื่อยๆ จนกว่า Human จะ Approve
> ทุกรอบจะมี Round number เพิ่มขึ้นใน QA Report

---

## Output
- **QA Report**: `.auto-claude/specs/{ID}/qa_report.md` (รวม Manual Verification Guide + Approval Checklist)
- **Updated Status**: `.auto-claude/specs/{ID}/implementation_plan.json`
