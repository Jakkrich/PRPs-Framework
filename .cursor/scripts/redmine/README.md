# 🔴 Redmine Integration Scripts

ชุด Script สำหรับให้ AI Agent เชื่อมต่อกับ Redmine API เพื่อทำหน้าที่เป็น **Redmine Specialist Agent**

## 🛠 Prerequisites
- Python 3.10+
- `pip install -r requirements.txt`

## 🔑 Configuration
คัดลอกไฟล์ `.env.example` เป็น `.env` และระบุข้อมูล:
- `REDMINE_URL`: URL ของระบบ Redmine
- `REDMINE_API_KEY`: API Key ส่วนตัว (ดึงได้จาก My Account ใน Redmine)

## 📋 Available Commands
| Script | Description |
| :--- | :--- |
| `get_issue.py` | ดึงข้อมูล Issue (ID, Subject, Description, Notes) |
| `search_issues.py` | ค้นหา Issue (Title, assigned_to, author) |
| `update_issue_note.py` | เพิ่ม Note/Comment ลงใน Issue |
| `sync_description.py` | ซิงค์ `spec.md` สู่ Redmine Description |
| `upload_to_issue.py` | แนบไฟล์ขึ้น Issue (เช่น QA Reports) |
| `get_my_context.py` | ตรวจสอบสิทธิ์และงานที่ได้รับมอบหมายของ User |

## 🛡 Security Rules
- Script จะอนุญาตให้แก้ไขเฉพาะ Issue ที่ User เป็น **Author** หรือ **Assignee** เท่านั้น เพื่อป้องกันการแก้ไขงานของผู้อื่นโดยไม่ได้ตั้งใจ
