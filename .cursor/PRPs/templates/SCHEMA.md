# 📋 Dashboard JSON Schema Standard

เอกสารนี้คือ **Source of Truth** สำหรับโครงสร้างไฟล์ JSON ทั้งหมดที่ Dashboard (`Auto-Claude`) ต้องการ ข้อมูลนี้ถูกดึงมาจาก Frontend Source Code (`shared/types/task.ts`) เพื่อให้ AI สามารถสร้างไฟล์ได้ถูกต้องแม้ไม่มี Folder Frontend อยู่ในโปรเจกต์

---

## 🏗️ 1. implementation_plan.json (The Hub)
**Path**: `.auto-claude/specs/{ID}/implementation_plan.json`
ไฟล์หลักที่ Dashboard ใช้แสดงผลบน Kanban และ Progress Bar

| Key | Type | Allowed Values / Pattern | Description |
| :--- | :--- | :--- | :--- |
| `feature` | string | `{ID}: {Title}` | ชื่อหัวข้อที่จะแสดงบน Card |
| `description` | string | Markdown string | คำอธิบายสั้นๆ (แสดงใต้ชื่อ Card) |
| `status` | string | `backlog`, `queue`, `in_progress`, `ai_review`, `human_review`, `done`, `error` | **Kanban Column Location** |
| `planStatus` | string | `planning`, `approved`, `rejected` | สถานะของแผนงาน |
| `xstateState` | string | `planning`, `coding`, `validation`, `human_review` | สถานะของ State Machine (ใช้ Resume งาน) |
| `updated_at` | string | ISO 8601 (UTC) | ใช้คัดกรองงานที่เพิ่งอัปเดต |
| `phases` | array | `PhaseObject[]` | รายละเอียดขั้นตอนงาน (ดูด้านล่าง) |

### 🔹 PhaseObject Structure
```json
{
  "phase": 1,
  "name": "Phase Name",
  "type": "infrastructure|ui|logic|testing",
  "subtasks": [
    {
      "id": "1.1",
      "description": "Task description",
      "status": "pending|in_progress|completed|failed",
      "verification": {
        "type": "command|browser",
        "run": "npm run test:target",
        "scenario": "describe test steps"
      }
    }
  ]
}
```

---

## 🏷️ 2. task_metadata.json (Badges & Settings)
**Path**: `.auto-claude/specs/{ID}/task_metadata.json`

| Key | Type | Allowed Values |
| :--- | :--- | :--- |
| `category` | string | `feat`, `bug_fix`, `refactoring`, `documentation`, `security`, `performance`, `ui_ux`, `infrastructure`, `testing` |
| `priority` | string | `low`, `medium`, `high`, `urgent` |
| `complexity` | string | `trivial`, `small`, `medium`, `large`, `complex` |
| `impact` | string | `low`, `medium`, `high`, `critical` |
| `acceptanceCriteria` | string[] | รายการเงื่อนไขความสำเร็จ |
| `dependencies` | string[] | รายการงานที่ต้องทำก่อน (ID หรือชื่อ) |

---

## 📝 3. requirements.json (Content Fallback)
**Path**: `.auto-claude/specs/{ID}/requirements.json`
ใช้เป็นที่เก็บรายละเอียดเริ่มต้น และเป็นชุดข้อมูลให้ Spec Writer

| Key | Type | Description |
| :--- | :--- | :--- |
| `task_description` | string | **Fallbackหลัก** ของ Description หากไฟล์อื่นไม่มี |
| `user_goal` | string | จุดประสงค์ของผู้ใช้ |
| `workflow_type` | string | `feature`, `bugfix`, `refactor`, `docs`, `test` |

---

## 🕒 4. task_logs.json (Timeline)
**Path**: `.auto-claude/specs/{ID}/task_logs.json`

### 🔹 EntryObject Structure
```json
{
  "timestamp": "ISO_TIMESTAMP",
  "type": "text|tool_start|tool_end|phase_start|phase_end|error|success|info",
  "content": "Message to display",
  "phase": "planning|coding|validation",
  "tool_name": "run_command",
  "tool_input": "input string"
}
```

---

## 🧠 5. context.json (RAG Intelligence)
**Path**: `.auto-claude/specs/{ID}/context.json`

| Key | Type | Description |
| :--- | :--- | :--- |
| `files_to_modify` | string[] | paths (relative) |
| `files_to_reference` | string[] | paths (relative) |
| `patterns` | string[] | snippets หรือคำอธิบาย pattern |
