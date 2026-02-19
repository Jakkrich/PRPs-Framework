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

📌 Next Step: {recommendation}
```

---

## Output
- **QA Report**: `.auto-claude/specs/{ID}/qa_report.md`
- **Updated Status**: `.auto-claude/specs/{ID}/implementation_plan.json`
