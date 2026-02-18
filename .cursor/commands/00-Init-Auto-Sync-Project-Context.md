# Init & Auto-Sync Project Context

คำสั่งนี้คือกระดูกสันหลังของ Framework ใช้สำหรับ **สร้างหรืออัปเดตบริบทโครงการ (Project Context)** โดยการรวมพลังระหว่างการสแกนโครงสร้างโปรเจกต์ (IDE Context) และการวิเคราะห์ทางเทคนิคผ่าน Backend Tools (`_tools`)

## การใช้งาน

รันคำสั่งโดยพิมพ์:
```
/init-sync
```
หรือหากต้องการใช้ชื่อเต็ม: `/00-Init-Auto-Sync-Project-Context`

## วัตถุประสงค์

1.  **Backend Sync**: เรียกใช้ `project_analyzer.py` เพื่อตรวจสอบ Stack, Dependencies และสร้าง Security Profile (`.auto-claude-security.json`)
2.  **IDE Context Setup**: สร้างหรืออัปเดต `INITIAL.md` เพื่อเป็น "หน้าแรก" ของงาน ให้ AI เข้าใจโครงสร้างและแผนงานปัจจุบัน
3.  **Requirements Summary**: รวบรวมสรุปเป้าหมายจาก PRP ทุกตัว เพื่อให้พร้อมสำหรับการ Build หรือ Rebuild ระบบใหม่ได้ทันที

## ขั้นตอนการทำงาน (Process)

### 1. Execute Backend Analyzer
รันสคริปต์วิเคราะห์โปรเจกต์โดยใช้ Python venv:
- **Command**: `.\PRPs-Framework\apps\backend\venv\Scripts\python.exe .\PRPs-Framework\apps\backend\project_analyzer.py . --force`
- **Output**: สร้าง/อัปเดต Security Profile และรายการคำสั่งที่อนุญาต (Allowed Commands)

### 2. Project Structure & Requirements Scanning
ทำความเข้าใจโปรเจกต์เชิงลึก:
- **Project Structure**: ค้นหาโฟลเดอร์สำคัญ (src, tests, docs, config)
- **PRP Indexing**: สแกนโฟลเดอร์ `PRPs-Framework/issues/` เพื่อหา PRP ที่เสร็จแล้วหรือกำลังทำอยู่
- **Goal Summary**: อ่านหัวข้อ Goal/Why/What จาก PRP แต่ละตัวเพื่อสรุปความต้องการของระบบ (System Requirements Summary)

### 3. Update INITIAL.md (The Source of Truth)
สร้างหรืออัปเดตไฟล์ `INITIAL.md` โดยใช้ข้อมูลจากข้อ 1 และ 2:
- **Project Overview**: ประเภทโปรเจกต์และ Stack หลัก (ตรวจพบโดย Backend)
- **Project Context (Auto-Synced)**: รายการ Allowed Commands และสถานะ Sync ล่าสุด
- **File & Directory Index**: ลิงก์ไปยังส่วนสำคัญของโปรเจกต์
- **Work Status**: แยกหมวดหมู่ Features, Bugs, และ Changes พร้อมลิงก์ไปยังไฟล์ PRP

### 4. Verify & Signal Readiness
- ตรวจสอบว่า `INITIAL.md` มีข้อมูลครบถ้วนและพร้อมเป็นบริบทให้ AI ตัวอื่น
- สรุปผลให้ผู้ใช้งานทราบว่า "โปรเจกต์พร้อมสำหรับการทำงานแบบ Agentic แล้ว"

## ประโยชน์ (Benefits)
- **Consistency**: ข้อมูลใน IDE ตรงกับสิ่งที่ Backend ตรวจพบ 100%
- **Token Efficiency**: AI ไม่ต้องเสีย Token สแกนไฟล์เองทั้งหมด เพราะทุกอย่างสรุปไว้ใน `INITIAL.md` แล้ว
- **Traceability**: เชื่อมโยงทุกปัญหากับสเปค แผนงาน และโค้ดเข้าด้วยกัน

## System Prompt / Persona
- **Context Engineer**: เน้นการสร้างโครงสร้างบริบทที่ AI อ่านง่ายและทำงานได้ทันที
- **Automation Expert**: ทำหน้าที่เป็นสะพานเชื่อมระหว่าง Python Scripts และ Cursor IDE
