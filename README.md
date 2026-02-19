# PRPs-Framework 🧠

**Context Engineering Framework for System-Agentic Development.**

Framework นี้ถูกออกแบบมาเพื่อให้การทำงานระหว่าง **SA/BA** และ **DEV** มีประสิทธิภาพสูงสุดเมื่อทำงานร่วมกับ AI (Agentic Workflow) โดยเปลี่ยนจากระบบที่คุยกันด้วยคำพูด/เอกสารที่กระจัดกระจาย มาเป็น **Issue-Based Structure** ที่ AI สามารถอ่าน เข้าใจ และลงมือทำได้อย่างแม่นยำ

---

## 🚀 Quick Start (สำหรับผู้เริ่มต้น)

### 1. การติดตั้ง (Integration)
ทีมพัฒนาสามารถนำ Framework นี้ไปใช้ในโปรเจกต์ของตนเองได้ง่ายๆ:
- **Clone/Copy**: คัดลอกโฟลเดอร์ `PRPs-Framework/` และ `.cursor/` ไปวางไว้ที่ Root ของโปรเจกต์คุณ

### 2. เตรียมสภาพแวดล้อม (Setup)
รันคำสั่งเพื่อสร้าง Virtual Environment และติดตั้ง Tooling สำหรับ Agent:
```powershell
python .cursor/scripts/setup-venv.py
```

### 3. เบิกเนตร AI (Init Context)
รันคำสั่งแรกเพื่อให้ Agent รู้จักโครงสร้างโปรเจกต์ของคุณ:
```text
/00-prp-init-context
```
*คำสั่งนี้จะสร้างไฟล์ `INITIAL.md` ซึ่งเป็นสารบัญหลักที่ Agent ทุกตัวจะใช้อัปเดตสถานะงาน*

---

## 🛠 Core Workflow (1-2-3-4)

เราทำงานกันเป็นรอบวงจร (Cycle) ดังนี้:

| Step | Command | Action | Output |
| :--- | :--- | :--- | :--- |
| **1. Create** | `/01-New-Task` | สร้างโจทย์ (Issue Spec) | `spec.md` ในโฟลเดอร์งาน |
| **2. Plan** | `/02-Plan` | AI วางแผนการเขียนโค้ดละเอียด | `plan.md` และ JSON Plan |
| **3. Execute** | `/03-Code` | AI ลงมือเขียนโค้ดตามแผน | โค้ดที่ใช้งานได้จริง |
| **4. Verify** | `/04-Verify` | AI รัน QA และตรวจสอบคุณภาพ | `qa_report.md` |

---

## 📚 โครงสร้างไฟล์ที่สำคัญ

- `INITIAL.md`: หน้ารวมภาพรวมโปรเจกต์ (สารบัญงานทั้งหมด)
- `.auto-claude/specs/`: โฟลเดอร์เก็บลู่การทำงานแยกตาม Issue (Spec, Plan, QA)
- `PRPs-Framework/`: Core Engine, Templates และคู่มือฉบับเต็ม

---

## 🔍 ข้อมูลเพิ่มเติม
สามารถอ่านคู่มือภาษาไทยฉบับละเอียด รวมถึงเทคนิคการทำ Context Engineering ได้ที่:
👉 [PRPs-Framework/README.md](./PRPs-Framework/README.md)

---
*Developed by Antigravity Team for Agent-Ready Repositories*
