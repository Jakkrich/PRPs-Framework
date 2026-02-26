# PRP: Init Context Auto-Sync

คำสั่งนี้คือกระดูกสันหลังของ Framework ใช้สำหรับ **สร้างหรืออัปเดตบริบทโครงการ (Project Context)** โดยการรวมพลังระหว่างการสแกนโครงสร้างโปรเจกต์ (IDE Context) และการวิเคราะห์ทางเทคนิคผ่าน Backend Tools (`_tools`)

## การใช้งาน

รันคำสั่งโดยพิมพ์:
```
/00-Init
```
## วัตถุประสงค์

1.  **AI Analysis**: วิเคราะห์ Stack, Dependencies และเตรียมบริบทโครงการโดยใช้เครื่องมือของ Agent เอง
2.  **IDE Context Setup**: สร้างหรืออัปเดต `INITIAL.md` เพื่อเป็น "หน้าแรก" ของงาน ให้ AI เข้าใจโครงสร้างและแผนงานปัจจุบัน
3.  **Requirements Summary**: รวบรวมสรุปเป้าหมายจากงานใน `.auto-claude/` ทั้งหมด

## ขั้นตอนการทำงาน (Process)

### 1. Execute AI-Powered Sync & Project Detection

**การระบุโปรเจกต์ (Project Identification)**:
1. **Handle `@module`**: หากผู้ใช้ระบุ `@module` (เช่น `/00-Init @module1`) ให้ AI ค้นหาโฟลเดอร์ที่มีชื่อนั้นและมีโฟลเดอร์ `.auto-claude` อยู่ภายใน
2. **Auto-Detection**: หากไม่ระบุ `@module`:
   - ตรวจสอบไฟล์ที่เปิดอยู่ใน Editor ปัจจุบัน ว่าอยู่ใน Sub-folder ที่มี `.auto-claude` หรือไม่
   - หากไม่พบ ให้ Scan หา `.auto-claude` ทั้งหมดใน Workspace
   - หากพบที่เดียว ให้ใช้ที่นั่น หากพบหลายที่ ให้ถามผู้ใช้หรือเลือกที่ Root เป็นค่าเริ่มต้น
3. **Set Active Project**: บันทึก Path ของโปรเจกต์ที่เลือกใน `INITIAL.md` ภายใต้หัวข้อ `Active Project`

### 2. Identify Stack & Framework
- วิเคราะห์ภาษาและ framework ที่ใช้ใน `Active Project` (เช่น Odoo 8, Python, JS)
- ตรวจสอบไฟล์สำคัญใน Path นั้น ๆ
3. **Generate/Update .cursorrules**: 
   - ตรวจสอบ Stack ที่พบ แล้วเลือก Template ที่ตรงกันจาก `.cursor/rules-templates/`
   - ใช้ `write_to_file` เพื่อนำเนื้อหาจาก Template มาสร้างหรืออัปเดตไฟล์ `.cursorrules` ที่ root
4. **Update INITIAL.md**: ใช้ `replace_file_content` หรือ `write_to_file` เพื่ออัปเดตข้อมูลใน `INITIAL.md`:
   - เติมรายชื่อ specs ที่พบใน `.auto-claude/specs/`
   - อัปเดต **Last Sync** เป็นวันเวลาปัจจุบัน
   - สรุป **Project Overview** ตามที่ตรวจพบ

### 2. Project Structure & Requirements Scanning
ทำความเข้าใจโปรเจกต์เชิงลึก:
- **Project Structure**: ค้นหาโฟลเดอร์สำคัญ (src, tests, docs, config)
- **Task Indexing**: สแกนโฟลเดอร์ `.auto-claude/specs/` และ `.auto-claude/issues/` เพื่อหางานที่เสร็จแล้วหรือกำลังทำอยู่
- **Goal Summary**: อ่านหัวข้อ Goal จากงานแต่ละตัวเพื่อสรุปความต้องการของระบบ

### 3. Update INITIAL.md & .cursorrules (The Source of Truth)
สร้างหรืออัปเดตไฟล์สำคัญ:
- **.cursorrules**: กฎเหล็กของโปรเจกต์ที่สอดคล้องกับ Tech Stack
- **INITIAL.md**: สารบัญและบริบทโครงการ
   - **Project Overview**: ประเภทโปรเจกต์และ Stack หลัก
   - **Project Context (Auto-Synced)**: รายการ Allowed Commands และสถานะ Sync ล่าสุด
   - **Last Sync**: เวลาที่ทำการ Sync ล่าสุด

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
