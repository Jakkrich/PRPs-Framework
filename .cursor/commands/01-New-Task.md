# 🎯 Create New Task (Structured Entry)

Create a task directory, `spec.md`, and initial metadata for any work item (feat, fix, refactor, doc).

## Usage

```
/01-New-Task {ID} {Title} ["Description"]
```
*Note: If ID is not provided, AI will automatically detect the next available ID (e.g., 007).*

---

## 🛠️ Internal Process (ZERO-SCRIPT MODE)

### Step 1: Identity & Classification
1. **ID Detection**: สแกนโฟลเดอร์ใน `.auto-claude/specs/` เพื่อหา ID ลำดับถัดไป
2. **Slug Generation**: สร้าง kebab-case slug จาก Title (เช่น `user-auth-fix`)
3. **Classification**: วิเคราะห์ Category, Priority, และ Complexity จากข้อมูลเบื้องต้น

### Step 2: Workspace Creation
สร้างโฟลเดอร์ `.auto-claude/specs/{ID}-{slug}/` และไฟล์ดังนี้:

#### 1. `task_metadata.json`
```json
{
  "sourceType": "manual",
  "category": "{feat|bug_fix|refactoring|documentation|testing}",
  "priority": "{low|medium|high|urgent}",
  "complexity": "{trivial|small|medium|large|complex}",
  "impact": "medium",
  "status": "todo",
  "created_at": "{TIMESTAMP}"
}
```

#### 2. `spec.md` (Requirement Spec)
สร้างรายละเอียดงานที่ประกอบด้วย:
- **Goal**: เป้าหมายสูงสุดของงานนี้
- **Context**: ภูมิหลังหรือปัญหาที่เจอ
- **Acceptance Criteria**: เงื่อนไขที่จะบอกว่างานนี้ "เสร็จ" (ต้องวัดผลได้)
- **Technical Constraints**: ข้อจำกัดทางเทคนิค (ถ้ามี)

#### 2. `requirements.json` (Detail Specification)
ถอดรายละเอียดจากผู้ใช้ออกมาเป็นโครงสร้างตาม [.cursor/PRPs/templates/requirements.template.json](../PRPs/templates/requirements.template.json) เพื่อให้ Dashboard แสดงรายละเอียดงานได้ครบถ้วน

#### 3. `implementation_plan.json` (Dashboard Hub)
**CRITICAL**: ต้องปฏิบัติตามมาตรฐานใน [.cursor/PRPs/templates/README.md](../PRPs/templates/README.md) อย่างเคร่งครัด
```json
{
  "feature": "{ID}: {Title}",
  "description": "{Description}",
  "workflow_type": "standard",
  "status": "in_progress",
  "planStatus": "planning",
  "xstateState": "planning",
  "created_at": "{ISO_TIMESTAMP}",
  "updated_at": "{ISO_TIMESTAMP}",
  "spec_file": ".auto-claude/specs/{ID}-{slug}/spec.md",
  "phases": [],
  "final_acceptance": []
}
```

### Step 3: Initialization Summary
แจ้งผลการสร้างงานให้ผู้ใช้ทราบ พร้อมแนะนำขั้นตอนถัดไป

---

## 🛡️ Best Practices
- **Define "Done"**: เขียน Acceptance Criteria ให้ชัดเจนที่สุด เพื่อให้ AI ในขั้นตอน `/04-Verify` ตรวจสอบได้แม่นยำ
- **Keep it Simple**: หากงานใหญ่เกินไป แนะนำให้แยกเป็นหลาย Task

📌 **Next Step**: Run `/02-Plan {ID}` to generate a deep implementation plan.
