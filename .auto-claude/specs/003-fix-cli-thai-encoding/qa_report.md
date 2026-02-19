# QA Report: Fix CLI Thai Encoding
- Date: 2026-02-19
- Task ID: 003-fix-cli-thai-encoding
- Status: **PASS** ✅

## AI Analysis Summary
- Category: fix
- Priority: critical
- Complexity: medium

## Results

### Requirements Coverage
| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1 | `ensure_ascii=False` ทุก `json.dump()` | ✅ | แก้ครบ 3 จุด (บรรทัด 169, 198, 206) |
| 2 | `--file` input mode | ✅ | รองรับ JSON UTF-8 input file |
| 3 | Backward compatibility (CLI args) | ✅ | `--help` ยังแสดง positional args |
| 4 | `datetime.utcnow()` deprecation | ✅ | เปลี่ยนเป็น `datetime.now(timezone.utc)` |
| 5 | Error handling for `--file` mode | ✅ | FileNotFound, JSONDecodeError, UnicodeDecodeError, Missing title |
| 6 | Documentation update | ✅ | `01-New-Task.md` อัปเดตแสดง 2 modes |
| 7 | Example file | ✅ | `.cursor/scripts/examples/task-input-example.json` |

### Validation Results
| Level | Check | Result | Details |
|-------|-------|--------|---------|
| L1 | Syntax | ✅ | สคริปต์รันได้ไม่มี SyntaxError |
| L2 | E2E Test (Thai) | ✅ | สร้าง Task ด้วย `--file` ภาษาไทย สระครบ ไม่มี `\uXXXX` |
| L3 | E2E Test (English CLI) | ✅ | สร้าง Task 003-005 ด้วย CLI args ทำงานปกติ |
| L4 | DeprecationWarning | ✅ | ไม่มี warning จาก datetime |

### Files Modified
- `.cursor/scripts/create-task.py` — เพิ่ม `ensure_ascii=False`, `--file` mode, `load_input_from_file()`, แก้ deprecation
- `.cursor/commands/01-New-Task.md` — เพิ่ม Mode 2 (File Input) documentation
- `.cursor/scripts/examples/task-input-example.json` — ไฟล์ตัวอย่าง (สร้างใหม่)

### Issues Found
- ไม่พบปัญหา ✅

---

## 🧑‍💻 Manual Verification Guide (สำหรับ Human Reviewer)

> ทำตามขั้นตอนนี้เพื่อตรวจสอบด้วยตัวเอง ใช้เวลาประมาณ 3-5 นาที

### Test 1: ตรวจสอบ `--file` mode ด้วยภาษาไทย

1. **สร้างไฟล์ input** (หรือใช้ตัวอย่างที่มี):
   ```powershell
   # ใช้ตัวอย่างที่เตรียมไว้
   copy .cursor\scripts\examples\task-input-example.json test-verify.json
   ```

2. **รันสคริปต์ด้วย `--file` mode**:
   ```powershell
   python .cursor/scripts/create-task.py --file test-verify.json
   ```

3. **ตรวจผลลัพธ์** — เปิดไฟล์ที่สร้าง แล้วตรวจว่า:
   - [ ] `implementation_plan.json` → field `feature` และ `description` เป็นภาษาไทยที่อ่านออก (ไม่มี `\u0e1b...`)
   - [ ] `requirements.json` → field `task_description` เป็นภาษาไทยที่อ่านออก
   - [ ] `spec.md` → Title และ Overview เป็นภาษาไทยครบถ้วน (สระไม่หาย)

4. **ลบ Task ทดสอบ** หลังตรวจเสร็จ:
   ```powershell
   Remove-Item -Recurse -Force .auto-claude\specs\0XX-*
   Remove-Item test-verify.json
   ```

### Test 2: ตรวจสอบ CLI mode (ภาษาอังกฤษ) — Backward Compatibility

1. **รัน**:
   ```powershell
   python .cursor/scripts/create-task.py "Test English Title" "Test English Description"
   ```

2. **ตรวจผลลัพธ์**:
   - [ ] สร้าง Task สำเร็จ ไม่มี Error
   - [ ] ไฟล์ทุกตัวมีเนื้อหาภาษาอังกฤษถูกต้อง

3. **ลบ Task ทดสอบ** หลังตรวจเสร็จ

### Test 3: ตรวจสอบ Error Handling

1. **File Not Found**:
   ```powershell
   python .cursor/scripts/create-task.py --file does-not-exist.json
   ```
   - [ ] ต้องแสดง Error: `Input file not found` (ไม่ crash)

2. **Invalid JSON**:
   ```powershell
   echo "not json" > bad.json
   python .cursor/scripts/create-task.py --file bad.json
   del bad.json
   ```
   - [ ] ต้องแสดง Error: `Invalid JSON` (ไม่ crash)

3. **No Arguments**:
   ```powershell
   python .cursor/scripts/create-task.py
   ```
   - [ ] ต้องแสดง Help message + Error (ไม่ crash)

### Test 4: ตรวจสอบ Code ด้วยสายตา

เปิด `.cursor/scripts/create-task.py` แล้วตรวจ:
- [ ] บรรทัด ~169: `json.dump(plan, f, indent=2, ensure_ascii=False)` ← มี `ensure_ascii=False`
- [ ] บรรทัด ~198: `json.dump(metadata, f, indent=2, ensure_ascii=False)` ← มี `ensure_ascii=False`
- [ ] บรรทัด ~206: `json.dump(requirements, f, indent=2, ensure_ascii=False)` ← มี `ensure_ascii=False`
- [ ] บรรทัด ~156: `datetime.now(timezone.utc)` ← ไม่ใช้ `datetime.utcnow()`

### Test 5: ตรวจสอบ Documentation

เปิด `.cursor/commands/01-New-Task.md` แล้วตรวจ:
- [ ] มี **Mode 1** (CLI Arguments) พร้อมตัวอย่าง
- [ ] มี **Mode 2** (File Input / `--file`) พร้อมตัวอย่าง JSON format
- [ ] มี ⚠️ Encoding Warning ที่แนะนำ `--file` mode สำหรับภาษาไทย

---

## ✅ Approval Checklist

| # | สิ่งที่ต้องผ่าน | ผ่าน? |
|---|---------------|------|
| 1 | `--file` mode สร้าง Task ภาษาไทยได้ถูกต้อง | ☐ |
| 2 | CLI mode ยังทำงานได้ปกติ (backward compatible) | ☐ |
| 3 | Error handling ไม่ crash ในทุกกรณี | ☐ |
| 4 | `ensure_ascii=False` ครบทุกจุด | ☐ |
| 5 | Documentation อัปเดตแล้ว | ☐ |

> เมื่อตรวจครบแล้ว รัน: `/10-Human Approve 003`
> หรือถ้ามีปัญหา: `/10-Human Reject 003 "เหตุผล"`

---

## Recommendation
**APPROVE** — งานเสร็จสมบูรณ์ครบทุก Requirement, ผ่าน E2E Test ด้วยภาษาไทย
