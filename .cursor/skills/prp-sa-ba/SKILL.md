---
name: prp-sa-ba
description: Assist SA/BA in this PRP-based Pure Agentic project with requirement analysis, spec refinement, and maintaining INITIAL.md. Use whenever the user is acting as SA/BA, defining tasks, or discussing project overview.
---

# 📋 PRP SA/BA Workflow (Pure Agentic)

Skill นี้ใช้เพื่อช่วยให้ผู้ใช้รับบทบาทเป็น **SA/BA/PO** รวบรวมความต้องการและเตรียมสเปคให้ AI ทำงานต่อได้อย่างแม่นยำตามมาตรฐาน Pure Agentic Framework

## 🎯 Scope ของงาน
ใช้ Skill นี้เมื่อ:
- **Requirement Analysis**: แปลงความต้องการดิบ (Raw requirement) ให้เป็นแผนงาน
- **Spec Refinement**: สร้างหรือปรับแต่ง `spec.md` ในโฟลเดอร์งาน
- **Project Indexing**: ดูแลและอัปเดต `INITIAL.md` ให้เป็นสารบัญที่ทันสมัย
- **Flow Coordination**: แนะนำขั้นตอนถัดไปใน Workflow (Issue -> Spec -> Plan -> Code -> Verify)

---

## 1. 📂 Staging to Spec (Phase: New Task)
เมื่อเริ่มงานใหม่:
1. **Pickup from Staging**: มองหาไฟล์ใน `.auto-claude/issues/` (Staging Area)
2. **Standardize**: ใช้ข้อมูลจาก Issue สร้างเป็นโฟลเดอร์งานใน `.auto-claude/specs/{ID}-{slug}/`
3. **Core Files**: สร้างไฟล์พื้นฐานที่ AI ต้องการ:
   - `spec.md`: รายละเอียดเทคนิคและยอมรับงาน (Acceptance Criteria)
   - `task_metadata.json`: ข้อมูลหมวดหมู่ ความสำคัญ และความซับซ้อน

---

## 2. 🧠 Requirement Refining
ช่วย SA/BA วิเคราะห์ความต้องการให้ "จบ" ก่อนเริ่มเขียน Code:
- **Dimension 360**: ตั้งคำถามเรื่อง Edge Cases, UX, Security และ Technical Impact
- **Measurable Goals**: ปรับ Acceptance Criteria ให้วัดผลได้จริง (เลี่ยงคำว่า "ทำให้ดี")
- **Metadata Tuning**: ปรับ Complexity และ Priority ให้สอดคล้องกับเนื้องานจริง

---

## 3. 📑 Maintaining INITIAL.md
ดูแล "หน้าแรกของโปรเจกต์" ให้เป็น Source of Truth เสมอ:
- **Indexing**: เมื่อมี Task ใหม่หรือเสร็จสิ้น ให้เพิ่มลิงก์เข้าไปในหัวข้อ `Active Specs & Tasks`
- **Stack Status**: อัปเดตข้อมูล Technical Stack หากมีการเปลี่ยนแปลง
- **allowed Commands**: ช่วยตรวจสอบและอัปเดตรายการคำสั่งที่ AI สามารถรันได้

---

## 🔄 Workflow Guidance (Next Steps)
แนะนำคำสั่งที่เหมาะสมตามลำดับงาน:
1. **วางแผน**: เมื่อ Spec พร้อมแล้ว แนะนำรัน `/02-Plan {ID}`
2. **ลงมือ**: เมื่อแผนพร้อมแล้ว แนะนำรัน `/03-Code {ID}`
3. **รีวิว**: เมื่อคนตรวจสอบแล้ว แนะนำรันคำสั่งกลุ่ม `/10-Human`

---
*หมายเหตุ: Skill นี้ทำงานร่วมกับ Agent Persona `discuss-spec` ได้อย่างมีประสิทธิภาพสูงสุด*
