# 003-fix-cli-thai-encoding: Fix CLI Thai Encoding

## Overview
เพิ่ม `--file` input mode ให้กับ `create-task.py` เพื่อป้องกันปัญหาตัวอักษรภาษาไทยเสียหาย (สระหาย, ตัวอักษรผิดเพี้ยน) เมื่อส่งผ่าน CLI Arguments บน Windows

## Git Context
- **Proposed Branch**: fix/003-fix-cli-thai-encoding
- **Commit Pattern**: fix: add --file input mode to prevent Thai encoding corruption

## Context
- **Root Cause**: Windows PowerShell/CMD มีปัญหา Default Encoding เมื่อส่ง String ที่ไม่ใช่ ASCII (เช่น ภาษาไทย, emoji) ผ่าน CLI Arguments ทำให้สระหลุดหรือตัวอักษรผิดเพี้ยน
- **Existing Workaround**: คำสั่ง `01-New-Task.md` ได้ใส่คำเตือนให้ Agent ใช้ `replace_file_content` แทน CLI Arguments แล้ว แต่สคริปต์เองยังไม่มี Native solution
- **Documented In**: Lesson #32 (Windows CLI Encoding) และ Lesson #33 (JSON Encoding & Unicode)

## Problem / Goal
1. **ปัญหาปัจจุบัน**: `create-task.py` รับ Title และ Description ผ่าน `argparse` เท่านั้น ซึ่งเสี่ยงต่อ Encoding corruption บน Windows
2. **เป้าหมาย**: เพิ่ม `--file <path>` option ที่อ่าน JSON input จากไฟล์ UTF-8 เพื่อ Bypass ปัญหา Shell Encoding

## Details
- สคริปต์ปัจจุบัน: `.cursor/scripts/create-task.py` (266 บรรทัด)
- JSON output ใช้ `ensure_ascii=False` อยู่แล้ว (บรรทัด 168-169) แต่ยังขาด `ensure_ascii=False` ที่บรรทัด 197-198
- ต้องรองรับทั้ง 2 mode: CLI Arguments (เดิม) และ File Input (ใหม่)

## Steps to Reproduce / High-level Requirements
1. รัน: `python .cursor/scripts/create-task.py "สร้างระบบ Auth" "เพิ่มระบบล็อกอินด้วย OAuth"`
2. ตรวจดู `spec.md` → จะเจอสระหายหรือตัวอักษรผิดเพี้ยน
3. **Expected**: เพิ่ม mode ใหม่:
   ```powershell
   python .cursor/scripts/create-task.py --file input.json
   ```
   โดย `input.json` มีรูปแบบ:
   ```json
   {
     "title": "สร้างระบบ Auth",
     "description": "เพิ่มระบบล็อกอินด้วย OAuth"
   }
   ```
4. แก้ไข `json.dump()` ทุกจุดให้มี `ensure_ascii=False`

## Impact / Priority
- Impact: High (ส่งผลต่อ Dev ทุกคนที่ใช้ภาษาไทย)
- Priority: Critical (Bug ที่เจอตั้งแต่ครั้งแรกที่ใช้งาน)

## Related Files
- `.cursor/scripts/create-task.py` — ไฟล์หลักที่ต้องแก้ไข
- `.cursor/commands/01-New-Task.md` — คำสั่งที่เรียกใช้สคริปต์
- `.auto-claude/specs/001-create-root-readme/` — ตัวอย่างงานที่ได้รับผลกระทบ
- `.auto-claude/specs/002-update-core-readme/` — ตัวอย่างงานที่ได้รับผลกระทบ

## Related PRPs (if known)
- `.auto-claude/specs/002-update-core-readme/spec.md` (งานที่เจอปัญหานี้ครั้งแรก)
