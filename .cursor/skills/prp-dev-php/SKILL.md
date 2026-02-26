---
name: prp-dev-php
description: Comprehensive skill for PHP development following the PRP Pure Agentic workflow. Supports CodeIgniter 3 and Yii 2, with MVC patterns and automated validation loops in a Zero-Script environment.
---

# 🐘 PRP Dev – PHP (Pure Agentic)

Skill นี้ใช้เพื่อช่วยพัฒนาฟีเจอร์บน **PHP** ตามมาตรฐาน PRP Framework โดยเน้นเฟรมเวิร์ก CodeIgniter 3 (Legacy) และ Yii Framework 2 (Modern) ครอบคลุมการทำงานแบบ MVC และการป้องกันความปลอดภัยพื้นฐาน

## 🎯 Scope ของงาน
ใช้ Skill นี้เมื่อ:
- **Framework Dev**: สร้างหรือแก้ไข Controllers, Models และ Views
- **Legacy Support**: ปรุงโค้ด CodeIgniter 3 ให้ปลอดภัยและเป็นระเบียบ
- **Modern PHP**: พัฒนา Yii 2 ด้วย ActiveRecord และ Dependency Injection
- **Workflow**: เมื่อทำงานใน Task ที่เกี่ยวข้องกับ PHP Apps

---

## 1. 🔍 Framework Detection
ตรวจสอบสภาพแวดล้อมก่อนเริ่มทำงาน:
1. **CodeIgniter 3**: มองหา `application/config/config.php` หรือ `system/`
2. **Yii 2**: มองหา `vendor/yiisoft/yii2` หรือ `config/web.php`
3. **Composer**: ตรวจสอบ `composer.json` เพื่อดูเวอร์ชัน PHP และ Dependencies

---

## 2. 🏛️ Implementation Patterns

### CodeIgniter 3 (The Singleton Pattern)
- **Namespacing**: มักจะไม่มี namespace (ใช้ Global)
- **Loading**: ใช้ `$this->load->model('...')` หรือ `$this->load->view('...')`
- **Security**: บังคับเช็ก `defined('BASEPATH') OR exit('...');` ที่หัวไฟล์เสมอ

### Yii Framework 2 (The Component Pattern)
- **ActiveRecord**: ใช้การ Query ผ่าน Model Class (เช่น `User::find()`)
- **Namespacing**: ใช้ PSR-4 Namespacing เต็มรูปแบบ
- **Views**: ใช้ `Html::encode()` และ `$this->render()`

---

## 🛡️ Security Best Practices
- **Prepared Statements**: บังคับใช้ Query Builder หรือ ORM ห้ามเขียน Raw SQL ที่รับ Variable ตรงๆ
- **Input Validation**: ใช้ Framework Validation (CI Form Validation / Yii Rules)
- **Output Escaping**: ป้องกัน XSS ด้วยการ Encode ข้อมูลก่อนแสดงผลบน HTML

---

## 🔄 PRP Workflow Integration (Zero-Script)
ในการทำงานแต่ละ Task ให้ Agent ยึดหลักการดังนี้:

### Phase: Planning (/02-Plan)
- ระบุไฟล์ที่จะแก้ไข และวิธี Validate (เช่นรัน `phpunit`)

### Phase: Code (/03-Code)
- ทำงานทีละ Subtask และเปลี่ยนสถานะใน `implementation_plan.json`
- บันทึกการแก้ไขลงในไฟล์ `qa_report.md`

---

## 🧪 Testing & Validation
- **Unit Testing**: ใช้ `PHPUnit` หรือเฟรมเวิร์กเทสที่โปรเจกต์ติดตั้งไว้
- **Command Line**: มักจะรันเทสผ่าน `./vendor/bin/phpunit` หรือคำสั่งเฉพาะของเฟรมเวิร์ก
- **Manual Check**: ระบุขั้นตอนการเปิดหน้าเว็บเพื่อเช็กความถูกต้องลงใน `qa_report.md`
