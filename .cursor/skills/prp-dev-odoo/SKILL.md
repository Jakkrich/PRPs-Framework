---
name: prp-dev-odoo
description: Comprehensive skill for Odoo development following the PRP Pure Agentic workflow. Supports Odoo 8 and Odoo 13+ patterns, model/view/controller architecture, and automated validation in a Zero-Script environment.
---

# 📦 PRP Dev – Odoo (Pure Agentic)

Skill นี้ใช้เพื่อช่วยพัฒนาฟีเจอร์บน **Odoo** (ERP) ตามมาตรฐาน PRP Framework โดยครอบคลุมทั้งเวอร์ชัน Legacy (Odoo 8) และ Modern (Odoo 13+) เน้นความถูกต้องของการสืบทอด (Inheritance) และความปลอดภัย (Security)

## 🎯 Scope ของงาน
ใช้ Skill นี้เมื่อ:
- **Module Dev**: สร้างหรือแก้ไข Odoo Module (Models, Views, Controllers, Wizards)
- **Migration/Fix**: แก้ไข Bug หรือปรับปรุงฟีเจอร์ใน Odoo 8 และ 13+
- **Security**: จัดการ Access Rights (CSV) และ Record Rules (XML)
- **Workflow**: เมื่อทำงานใน Task ที่เกี่ยวข้องกับ Odoo

---

## 1. 🔍 Platform & Version Detection
ตรวจสอบสภาพแวดล้อม Odoo ก่อนเริ่มทำงาน:
1. **Odoo 8**: ค้นหา `__openerp__.py` หรือ `openerp` namespace
2. **Odoo 13+**: ค้นหา `__manifest__.py` หรือ `odoo` namespace
3. **Module Structure**: ตรวจสอบโฟลเดอร์ `addons/` หรือ `models/`, `views/`

---

## 2. 🧱 Implementation Guidelines

### Naming Conventions
- **Module/Model**: `snake_case` (e.g., `sale_order_line`)
- **Class**: `PascalCase` (e.g., `SaleOrderLine`)
- **Fields**: `snake_case`

### Persistence Patterns (Inheritance)
- **Model**: ใช้ `_inherit` เพื่อขยายความสามารถโมเดลเดิม
- **View**: ใช้ `<xpath expr="..." position="...">` เพื่อแก้ไข UI เดิมเสมอ เพื่อลดการ conflict

### Security (Mandatory)
ทุกครั้งที่สร้าง Model ใหม่ ต้องมี:
1. `security/ir.model.access.csv`: สิทธิ์การเข้าถึงรายกลุ่ม
2. `security/ir.rule.xml`: (ถ้าจำเป็น) ข้อกำหนดการมองเห็น Record (เช่น เห็นเฉพาะของตัวเอง)

---

## 3. 🛡️ Pattern References

| Version | Root Header | Namespace | Decorators |
|:---|:---|:---|:---|
| **Odoo 8** | `<openerp>` | `from openerp import ...` | `@api.one`, `@api.multi` |
| **Odoo 13+** | `<odoo>` | `from odoo import ...` | `@api.model`, `@api.depends` |

---

## 🔄 PRP Workflow Integration (Zero-Script)
ในการทำงานแต่ละ Task ให้ Agent ยึดหลักการดังนี้:

### Phase: Planning (/02-Plan)
- ระบุไฟล์ที่ต้องสร้าง/แก้ไขใน `File & Directory Index`
- กำหนด `Validation Loop`:
    - **Step 1**: Lint (flake8/pylint-odoo)
    - **Step 2**: Odoo Test (`--test-enable` / `--init` module)

### Phase: Code (/03-Code)
- ทำงานทีละ Subtask และอัปเดตสถานะใน `implementation_plan.json`
- **Gotcha**: ระวังเรื่องการ Cache ของ Odoo หลังแก้ไข Python ต้อง Restart service และอัปเดต Module เสมอ

---

## 🧪 Testing & Validation
- **Common Case**: ใช้ `TransactionCase` สำหรับการรัน Business Logic Test
- **UI Check**: ให้คำแนะนำการตรวจสอบผ่าน Browser (Manual Verification Guide) ใน `qa_report.md`
