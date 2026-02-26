# PRPs-Framework 🧠

**Context Engineering Framework for System-Agentic Development.**

Framework นี้ถูกออกแบบมาเพื่อให้การทำงานระหว่าง **SA/BA** และ **DEV** มีประสิทธิภาพสูงสุดเมื่อทำงานร่วมกับ AI (Agentic Workflow) โดยเปลี่ยนจากระบบที่คุยกันด้วยคำพูด/เอกสารที่กระจัดกระจาย มาเป็น **JSON & Issue-Based Structure** ที่ AI สามารถอ่าน เข้าใจ และลงมือทำได้อย่างแม่นยำ

---

## 🛠 การติดตั้งสำหรับโปรเจกต์ของคุณ (Installation Guide)

หากคุณต้องการนำ Framework นี้ไปใช้ในโปรเจกต์ของคุณเอง (เช่น Odoo, FastAPI, PHP) ให้ทำตามขั้นตอนดังนี้:

### 📥 1. คัดลอกไฟล์ที่จำเป็น
Copy โฟลเดอร์และไฟล์เหล่านี้ไปวางที่ **Root Directory** ของโปรเจกต์คุณ:
- `.cursor/` (ระบบสั่งการของ Agent)
- `.auto-claude/` (โฟลเดอร์เก็บสถานะงาน - *ถ้าเป็นโปรเจกต์ใหม่ให้สร้างโฟลเดอร์ว่างไว้*)

### 📂 2. การวางโครงสร้าง (2 รูปแบบ)

#### **Case 1: โปรเจกต์เดี่ยว (Single Project)**
วางทุกอย่างไว้ที่ Root ของโปรเจกต์:
```text
your-project/
├── .cursor/
└── .auto-claude/  <-- เก็บ Spec ทั้งหมดของโปรเจกต์ที่นี่
```

#### **Case 2: หลายโมดูล/หลายโปรเจกต์ (Multi-Project เช่น Odoo)**
วางชุดคำสั่งไว้ที่ Root แต่แยกโฟลเดอร์งานตาม Module:
```text
odoo-workspace/
├── .cursor/       <-- วางไว้ที่ Root ครั้งเดียว
├── odoo8/module1/
│   └── .auto-claude/ <-- เก็บ Spec เฉพาะของ module1
└── odoo13/module2/
    └── .auto-claude/ <-- เก็บ Spec เฉพาะของ module2
```

### ⚡ 3. เริ่มต้นใช้งาน
หลังจากวางไฟล์เสร็จ ให้เปิด Cursor Chat แล้วรันคำสั่งเพื่อ Sync ข้อมูล:

- **สำหรับ Case 1**: รัน `/00-Init`
- **สำหรับ Case 2**: รัน `/00-Init @ชื่อโฟลเดอร์โมดูล` (เช่น `/00-Init @module1`)

---

## 🚀 Quick Start (สำหรับผู้เริ่มต้น)

### ⚡ เริ่มต้นใช้งานครั้งแรก
เพื่อให้ Agent รู้จักโครงสร้างโปรเจกต์และสร้างไฟล์สารบัญหลัก (`INITIAL.md`) ให้รันคำสั่งนี้ในช่อง Chat ของ Cursor:
```text
/00-Init
```
> **Tip**: คำสั่งนี้จะทำการ Sync ข้อมูลงานทั้งหมดที่มี และเตรียมความพร้อมสำหรับ Agent ในการเริ่มงานใหม่

### 📊 Dashboard & Monitoring (Kanban Board)
คุณสามารถดูภาพรวมงานทั้งหมดผ่าน **PRPs Dashboard** (Kanban Board) โดยการเปิด Application Dashboard และ Browse ไปที่ Folder โปรเจกต์นี้
- **Auto-Sync**: ข้อมูลจะถูกดึงจากไฟล์ JSON ใน `.auto-claude/specs/` โดยอัตโนมัติ
- **Timeline Logs**: ดูความคืบหน้าการทำงานของ AI ได้แบบ Real-time ใน Tab "Logs"

---

## 🛠 Core Workflow (JSON-Driven)

เราทำงานกันเป็นรอบวงจร (Cycle) โดยใช้ JSON เป็น "Source of Truth" เพื่อความแม่นยำสูงสุด:

| Step | Command | Description | Inputs (Required) | Outputs (Source of Truth) | Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Create** | `/01-New-Task` | นิยามโจทย์และตั้งค่าพื้นฐาน | User Request | `requirements.json`, `task_metadata.json`, `spec.md` | ข้ามไป Step 2 เพื่อวางแผน |
| **2. Plan** | `/02-Plan` | AI วิเคราะห์โค้ดและวางขั้นตอน | `requirements.json`, `spec.md`, `project_index.json` | `implementation_plan.json`, `context.json`, `task_logs.json` | ข้ามไป Step 3 เพื่อเขียนโค้ด |
| **3. Execute** | `/03-Code` | AI ลงมือเขียนโค้ดตามแผน | `implementation_plan.json`, `context.json`, `task_metadata.json` | Source Code, `task_logs.json` (updated) | ข้ามไป Step 4 เพื่อตรวจงาน |
| **4. Verify** | `/04-Verify` | ตรวจสอบคุณภาพและปิดงาน | `implementation_plan.json`, `source code` | `qa_report.md`, `task_logs.json` (done), Status: `done` | งานเสร็จสมบูรณ์ (Sign-off) |

> 📚 **ต้องการใช้งานอย่างละเอียด?**: อ่านคู่มือการใช้งานชุดคำสั่ง (Commands Guide) พร้อมตัวอย่างและจุดเก็บไฟล์ได้ที่ 👉 [.cursor/commands/README.md](.cursor/commands/README.md)

---

## 📚 โครงสร้างไฟล์และมาตรฐาน

- `INITIAL.md`: หน้ารวมภาพรวมโปรเจกต์ (สารบัญงานทั้งหมด)
- `.auto-claude/specs/`: โฟลเดอร์เก็บลู่การทำงานแยกตามงาน (JSON & Markdown)
- `.cursor/PRPs/templates/`: **Source of Truth** ของโครงสร้าง JSON ทั้งหมด (อ่าน `SCHEMA.md` ในนั้นเพื่อดูสเปก)
- `PRPs-Framework/`: Core Engine, Templates และคู่มือฉบับเต็ม

---

## 🔌 VS Code Extension & Dashboard

สำหรับการใช้งานที่สะดวกขึ้น คุณสามารถติดตั้ง Extension และเปิด Dashboard ได้ดังนี้:

### 📥 การติดตั้ง Extension (.vsix)
1. ไปที่แถบ **Extensions** (`Ctrl+Shift+X`) ใน VS Code
2. คลิกที่ไอคอน **...** (More Actions) บริเวณมุมขวาบนของเมนู Extension
3. เลือก **Install from VSIX...**
4. เลือกไฟล์: `.cursor/PRPs/extension/auto-claude-explorer-0.0.1.vsix`

### 🖥️ การเปิด Dashboard (2 ทางเลือก)
คุณสามารถเข้าถึงหน้า Dashboard เพื่อดูสถานะงานแบบรวมศูนย์ได้ 2 วิธี:
1. **ผ่าน Browser:** เปิดไฟล์ `.cursor/PRPs/html/dashboard.html` ด้วย Browser (แนะนำ Chrome หรือ Edge)
2. **ผ่าน extension:** เมื่อติดตั้งตามขั้นตอนข้างบนแล้ว คุณสามารถเปิดดู Dashboard และจัดการ Task ได้โดยตรงจาก Sidebar **Auto-Claude** ใน VS Code

---

## 🔍 ข้อมูลเพิ่มเติม
- **คู่มือการใช้คำสั่ง (Commands Guide):** [.cursor/commands/README.md](.cursor/commands/README.md)
- **เทคนิคการทำ Context Engineering:** [PRPs-Framework/README.md](./PRPs-Framework/README.md) (หากมี)

---
*Developed by Antigravity Team for Agent-Ready Repositories*
