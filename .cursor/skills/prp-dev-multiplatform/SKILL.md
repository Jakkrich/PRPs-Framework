---
name: prp-dev-multiplatform
description: Intelligent platform router for PRP development. Automatically detects whether the project is FastAPI, Odoo, or PHP and provides guidance on which specific skill to use.
---

# 🚦 PRP Dev – Platform Router (Pure Agentic)

Skill นี้ทำหน้าที่เป็น **"พนักงานต้อนรับอัจฉริยะ"** ที่จะช่วยตรวจจับว่าโปรเจกต์ที่คุณกำลังทำงานอยู่นั้นใช้เทคโนโลยีอะไร และแนะนำให้ AI ตัวอื่นๆ (หรือตัวผมเอง) ใช้ Skill เฉพาะทางที่ถูกต้องในการทำงาน

## 🔍 Platform Detection Logic

เมื่อเริ่มงานใหม่หรือเมื่อสภาพแวดล้อมยังไม่ชัดเจน ผมจะทำการสแกนไฟล์ดังนี้:

### 1. 🐍 FastAPI
- **Check**: `main.py`, `app.py` ที่มี `from fastapi import FastAPI` หรือไฟล์ `requirements.txt` ที่ระบุ `fastapi`
- **Recommended Skill**: `prp-dev-fastapi`

### 2. 📦 Odoo (ERP)
- **Check**: โฟลเดอร์ `addons/`, ไฟล์ `__manifest__.py` (13+) หรือ `__openerp__.py` (8)
- **Recommended Skill**: `prp-dev-odoo`

### 3. 🐘 PHP (CI/Yii)
- **Check**: โฟลเดอร์ `application/` (CodeIgniter) หรือ `vendor/yiisoft/` (Yii)
- **Recommended Skill**: `prp-dev-php`

---

## 🛠️ Action Flow

เมื่อตรวจพบ Platform แล้ว:
1. **แจ้งผล**: บอกให้คุณทราบว่าตรวจพบ Stack อะไร (เช่น "Detected: Odoo 13 module")
2. **เปลี่ยนโหมด**: ผมจะดึงความรู้จาก Skill เฉพาะทางนั้นๆ มาใช้ในการวางแผน (/02-Plan) และเขียนโค้ด (/03-Code) ทันที
3. **Fallback**: หากไม่พบ Stack ที่คุ้นเคย ผมจะขอให้คุณระบุรายละเอียด หรือใช้มาตรฐาน **Generic Python/JS** แทน

---
*Developed for PRPs-Framework — Hybrid Development Support*
