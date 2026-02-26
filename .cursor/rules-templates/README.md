# 📋 Cursor Rules Templates

รวม "แม่พิมพ์กฎเหล็ก" (Standardization) สำหรับควบคุมคุณภาพโค้ดและการทำงานของ AI ในแต่ละภาษาหรือ Framework เพื่อให้โปรเจกต์คงมาตรฐานเดียวกันเสมอ

## 📑 รายการ Template
- **`rules.template-base-fastapi`**: กฎสำหรับ Python/FastAPI (Async, Pydantic, Code modularity)
- **`rules.template-base-odoo`**: กฎสำหรับ Odoo ERP (Models, Views, Security, Version detection)
- **`rules.template-base-php`**: กฎสำหรับ PHP/CI/Yii (MVC patterns, Security, SQL injection prevention)

---

## 🚀 วิธีการใช้งาน
### 1. ใช้งานผ่านคำสั่ง `/00-Init` (แนะนำ)
เมื่อคุณรันคำสั่ง `/00-Init`, AI จะทำการ:
1. **Auto-Detect**: ตรวจสอบ Codebase ว่าใช้เทคโนโลยีอะไร
2. **Auto-Apply**: คัดลอกกฎจาก Template ที่ตรงกันไปสร้าง/อัปเดตไฟล์ `.cursorrules` ที่ Root ของโปรเจกต์โดยอัตโนมัติ

### 2. ใช้งานแบบ Manual
คุณสามารถคัดลอกเนื้อหาในไฟล์ Template ที่ต้องการ ไปวางไว้ในไฟล์ `.cursorrules` เพื่อเปิดใช้งานกฎเหล่านั้นใน Chat หรือ Composer ได้ทันที

---

## 🛠️ การเพิ่ม Template ใหม่
หากคุณมี Stack ใหม่ (เช่น Node.js, React, Go):
1. สร้างไฟล์ใหม่โดยใช้ format `rules.template-base-{stack_name}`
2. กำหนดกฎที่สำคัญ เช่น Naming convention, File size limit, และ AI behavior
3. อัปเดตเงื่อนไขในคำสั่ง `/00-Init` เพื่อให้รองรับการตรวจจับ Stack ใหม่นี้

---
*หมายเหตุ: ไฟล์เหล่านี้คือ "มาตรฐานกลาง" ของทีม การเปลี่ยนแปลงใดๆ ควรได้รับการพิจารณาถึงผลกระทบในวงกว้าง*
