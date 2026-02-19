# 004-create-onboarding-script: Create Onboarding Script

## Overview
สร้าง Single-command Setup Script ที่ทำให้ Developer ใหม่สามารถ Clone โปรเจกต์มาแล้วเริ่มทำงานได้ภายใน 1 นาที โดยไม่ต้องอ่านเอกสารหลายหน้า

## Git Context
- **Proposed Branch**: feat/004-create-onboarding-script
- **Commit Pattern**: feat: add single-command onboarding for new developers

## Context
- **ปัจจุบัน**: Dev ใหม่ต้องรันหลายคำสั่ง: `setup-venv.py` → `init-sync` → อ่าน README → ทดลองสร้าง Task
- **มีสคริปต์แยกอยู่แล้ว**: `setup-venv.py`, `update_initial.py`, `create-task.py`
- **Coach (`/00-Coach`)**: มี Health Check อยู่แล้ว แต่ต้องรันแยก
- **Prerequisites**: Python 3.8+, Git

## Problem / Goal
1. **ปัญหาปัจจุบัน**: Developer ใหม่ต้องทำ 4-5 ขั้นตอนก่อนเริ่มงานแรก ทำให้เสียเวลาและอาจพลาดขั้นตอน
2. **เป้าหมาย**: สร้างสคริปต์เดียวที่ทำทุกอย่างให้จบ:
   - ✅ สร้าง `.cursor/.venv/` + ติดตั้ง Dependencies
   - ✅ รัน `init-sync` (สร้าง `INITIAL.md` + Security Profile)
   - ✅ ตรวจสอบ Health Check (เหมือน Coach Phase A)
   - ✅ สร้าง Hello World Task เพื่อทดสอบ
   - ✅ แสดง Welcome message + Quick Start Guide

## Details
- **Target**: สร้างไฟล์ `.cursor/scripts/onboarding.py` (หรือ `setup.py`)
- **Cross-platform**: ต้องรองรับทั้ง Windows (PowerShell) และ Mac/Linux
- **Idempotent**: รันซ้ำได้โดยไม่ทำลายข้อมูลเดิม (skip ถ้ามีอยู่แล้ว)
- **Output**: แสดง Progress bar หรือ Step-by-step output ให้ Dev เห็นว่าทำอะไรอยู่

## Steps to Reproduce / High-level Requirements
1. Dev ใหม่ Clone โปรเจกต์
2. รัน: `python .cursor/scripts/onboarding.py`
3. สคริปต์ทำ:
   - Step 1: Check Python version
   - Step 2: Create .venv & install deps
   - Step 3: Run init-sync
   - Step 4: Health check (all components)
   - Step 5: Display welcome message + available commands
4. **Bonus**: เพิ่ม shortcut ใน root README:
   ```
   ## Quick Start
   python .cursor/scripts/onboarding.py
   ```

## Impact / Priority
- Impact: High (Every new developer's first experience)
- Priority: High (ลด Onboarding time จาก 10 นาที เหลือ 1 นาที)

## Related Files
- `.cursor/scripts/setup-venv.py` — สคริปต์สร้าง venv (จะถูกเรียกภายใน)
- `PRPs-Framework/apps/extensions/update_initial.py` — สคริปต์ init-sync
- `.cursor/commands/00-Coach.md` — Health Check reference
- `PRPs-Framework/README.md` — ต้องเพิ่ม Quick Start section

## Related PRPs (if known)
- `.auto-claude/specs/001-create-root-readme/spec.md`
