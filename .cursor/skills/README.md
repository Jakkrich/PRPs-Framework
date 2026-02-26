# 📚 Cursor Skills (Knowledge Banks)

รวมชุดความรู้และแนวทางการพัฒนาโค้ด (Skills) ที่ปรับแต่งมาเป็นพิเศษสำหรับโปรเจกต์นี้ เพื่อให้ AI ทำงานได้สอดคล้องกับโครงสร้างและเทคโนโลยีที่คุณใช้

## 📋 รายการ Skills ทั้งหมด

| Skill Name | Tech Stack | หน้าที่หลัก |
|:---|:---|:---|
| **`prp-sa-ba`** | Requirement Analysis | ช่วยวิเคราะห์โจทย์, สร้าง Spec, และสรุปแผนงานเบื้องต้น |
| **`prp-dev-fastapi`**| Python / FastAPI | พัฒนา API ด้วย FastAPI, Pydantic, และ Async patterns |
| **`prp-dev-odoo`** | Python / Odoo ERP | พัฒนา Odoo Module (8 & 13+) เน้นโครงสร้าง Models/Views |
| **`prp-dev-php`** | PHP (CI/Yii) | พัฒนา PHP Apps ด้วย CodeIgniter 3 หรือ Yii Framework 2 |
| **`prp-dev-multiplatform`**| Router Agent | ช่วยตรวจจับ Stack อัตโนมัติและแนะนำ Skill ที่เหมาะสม |

---

## 🛠️ วิธีที่ AI ใช้ Skills
AI (Cursor) จะดึงข้อมูลจากไฟล์ `SKILL.md` ในโฟลเดอร์เหล่านี้มาใช้โดยอัตโนมัติเมื่อ:
1. **Context Match**: เมื่อคุณพิมพ์คำสั่งหรือถามเรื่องที่สอดคล้องกับ Tech Stack นั้นๆ
2. **Explicit Instruction**: เมื่อคุณบอกให้ AI "ใช้ Skill [ชื่อ]" ในการแก้ปัญหา
3. **Workflow Start**: เมื่อเริ่มรันคำสั่งหลัก `/01-New-Task` หรือ `/02-Plan`

---

## 🛡️ มาตรฐาน Pure Agentic
ทุก Skill ถูกออกแบบมาให้ทำงานในโหมด **Zero-Script** ซึ่งหมายถึง:
- AI จะอ่านและแก้ไขไฟล์ JSON/Markdown โดยตรงโดยไม่พึ่งพาสคริปต์ภายนอก
- เน้นการทำ **Validation Loop** เพื่อตรวจสอบความถูกต้องของโค้ดด้วยตัวเอง
- อ้างอิงตำแหน่งไฟล์งานในโฟลเดอร์ `.auto-claude/specs/` เสมอ

---
*Developed for PRPs-Framework — Pure Agentic Mode*
