# Plan: 003-fix-cli-thai-encoding

## Goal
แก้ไข `create-task.py` ให้รองรับภาษาไทยอย่างสมบูรณ์ ทั้งผ่าน CLI Arguments และผ่านไฟล์ JSON Input

---

## Architecture

```
create-task.py
│
├── main()
│   ├── argparse
│   │   ├── title (positional, optional)
│   │   ├── description (positional, optional)
│   │   └── --file <path> (new option)
│   │
│   ├── if --file provided:
│   │   └── load_input_from_file(path)
│   │       ├── open(file, 'r', encoding='utf-8')
│   │       ├── json.load()
│   │       ├── validate: title (required)
│   │       └── return title, description
│   │
│   └── else:
│       └── use positional args (existing behavior)
│
└── create_task(title, description, project_root)
    ├── json.dump(..., ensure_ascii=False)  ← FIX 1
    ├── json.dump(..., ensure_ascii=False)  ← FIX 2
    └── json.dump(..., ensure_ascii=False)  ← FIX 3
```

---

## Phases

### Phase 1: Fix JSON Encoding (ensure_ascii) 🔧
- **What**: แก้ `json.dump()` ทั้ง 3 จุดให้มี `ensure_ascii=False`
- **Why**: ป้องกันไม่ให้ภาษาไทยถูกแปลงเป็น `\uXXXX`
- **Bonus**: แก้ `datetime.utcnow()` deprecation warning

### Phase 2: Add --file Input Mode 📄
- **What**: เพิ่ม `--file` argument ให้อ่านจาก JSON file
- **Why**: Bypass ปัญหา Shell Encoding ของ Windows
- **Design**: รองรับทั้ง 2 mode (backward compatible)
- **Input Format**:
  ```json
  {
    "title": "สร้างระบบ Auth",
    "description": "เพิ่มระบบล็อกอินด้วย OAuth"
  }
  ```

### Phase 3: Documentation & Integration 📝
- **What**: อัปเดต `01-New-Task.md` + สร้างไฟล์ตัวอย่าง
- **Why**: ให้ Dev รู้ว่ามี `--file` mode ใหม่

### Phase 4: End-to-End Verification ✅
- **What**: ทดสอบ Full Flow ด้วยภาษาไทย
- **Expected**: ไฟล์ output ทุกตัวมีภาษาไทยที่อ่านออก

---

## Risks & Considerations

| Risk | Mitigation |
|------|-----------|
| Backward Compatibility | ทั้ง 2 mode ต้องทำงานได้ (CLI args ยังใช้ได้) |
| File Not Found (--file) | Validate path + แสดง error message ที่ชัดเจน |
| Invalid JSON format | Validate structure + แสดง expected format |
| Windows Path | ใช้ `pathlib.Path` สำหรับ cross-platform |

---

## Success Criteria
- [ ] `json.dump()` ทุกจุดมี `ensure_ascii=False`
- [ ] `--file` mode ทำงานได้กับ JSON ที่มีภาษาไทย
- [ ] CLI arguments mode ยังทำงานได้ปกติ (backward compatible)
- [ ] ไม่มี DeprecationWarning จาก `datetime.utcnow()`
- [ ] Documentation อัปเดตแล้ว
