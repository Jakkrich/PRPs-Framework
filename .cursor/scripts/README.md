# 📜 Specialist Scripts

โฟลเดอร์นี้รวบรวม Script เสริมภายนอกที่ช่วยให้ Agent สามารถโต้ตอบกับระบบอื่นๆ ได้ (Specialist Tools)

---

## 📁 โครงสร้างโฟลเดอร์

### [redmine/](./redmine/)
ชุดคำสั่งสำหรับเชื่อมต่อกับระบบ **Redmine** เพื่อช่วยให้ Agent สามารถอ่านและเขียน Issue ได้โดยตรง
- `get_issue.py`: ดึงรายละเอียดข้อมูล Issue
- `search_issues.py`: ค้นหา Issue ตามเงื่อนไข
- `update_issue_note.py`: เพิ่ม Note หรือบันทึกความคืบหน้าลงใน Issue
- `sync_description.py`: ซิงค์ข้อมูลจาก `spec.md` กลับไปยัง Redmine Description
- `upload_to_issue.py`: อัปโหลดเอกสารหรือหลักฐานการ QA ขึ้นระบบ

---

## 🛠 วิธีการใช้งาน (สำหรับ Developer)

Script เหล่านี้ถูกออกแบบมาเพื่อให้ Agent เรียกใช้ผ่าน `run_command` แต่หากต้องการรันเอง:

1. **Setup Environment**:
   ```powershell
   cd .cursor/scripts/redmine
   pip install -r requirements.txt
   ```

2. **Configuration**:
   คัดลอกไฟล์ `.env.example` เป็น `.env` และติดตั้งค่า API Key สำหรับ Redmine

---

## 🤖 สำหรับ Agent
Agent จะมองเห็นว่ามี Tool เสริมเหล่านี้ และจะเลือกใช้เมื่อได้รับโจทย์ที่เกี่ยวกับ "Redmine" หรือ "Issue Tracking" โดยอัตโนมัติ
