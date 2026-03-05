# 📋 PRPs Task JSON Schema & Structure Guide

เอกสารนี้สรุปโครงสร้างไฟล์ JSON ที่ใช้ในระบบ PRPs-Framework สำหรับการแสดงผลบน Dashboard (Kanban Board) และการเก็บข้อมูลของ AI Agents

---

## 🏗️ 1. implementation_plan.json (The Hub)
**Path**: `.auto-claude/specs/{ID}/implementation_plan.json`
ไฟล์หลักที่ใช้แสดงสถานะบน Kanban และ Progress Bar

### Schema Example:
```json
{
  "feature": "DEMO-001: ระบบตัวอย่าง",
  "description": "คำอธิบายงานแบบ Markdown...",
  "status": "in_progress",
  "planStatus": "approved",
  "xstateState": "coding",
  "updated_at": "2026-03-05T15:00:00Z",
  "phases": [
    {
      "phase": 1,
      "name": "Infrastructure Setup",
      "type": "infrastructure",
      "subtasks": [
        {
          "id": "1.1",
          "description": "Create base directory structure",
          "status": "completed",
          "verification": {
            "type": "command",
            "run": "ls -R",
            "scenario": "Verify folders exist"
          }
        }
      ]
    }
  ]
}
```

**Allowed Statuses:**
- `backlog`: งานที่รอดำเนินการ
- `queue`: งานที่อยู่ในคิวเตรียมทำ
- `in_progress`: กำลังดำเนินการ
- `ai_review`: อยู่ระหว่างการตรวจสอบโดย AI
- `human_review`: รอการตรวจสอบโดยมนุษย์
- `done`: เสร็จสมบูรณ์
- `error`: เกิดข้อผิดพลาด

---

## 🕒 2. task_logs.json (Timeline)
**Path**: `.auto-claude/specs/{ID}/task_logs.json`
เก็บประวัติการทำงานและ Timeline ของ Task

### Schema Example:
```json
{
  "spec_id": "DEMO-001",
  "created_at": "2026-03-05T14:00:00Z",
  "updated_at": "2026-03-05T15:00:00Z",
  "phases": {
    "planning": {
      "phase": "planning",
      "status": "completed",
      "entries": [
        {
          "timestamp": "2026-03-05T14:05:00Z",
          "type": "phase_start",
          "content": "Starting planning phase",
          "phase": "planning"
        }
      ]
    }
  }
}
```

---

## 🛠️ 3. Formal JSON Schema

### implementation_plan.schema.json
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "feature": { "type": "string" },
    "description": { "type": "string" },
    "status": { "type": "string", "enum": ["backlog", "queue", "in_progress", "ai_review", "human_review", "done", "error"] },
    "planStatus": { "type": "string", "enum": ["planning", "approved", "rejected"] },
    "xstateState": { "type": "string", "enum": ["planning", "coding", "validation", "human_review"] },
    "updated_at": { "type": "string", "format": "date-time" },
    "phases": { "type": "array" }
  }
}
```

---

## � Demo Data Location
ตัวอย่างไฟล์ JSON สำหรับทุก Case ถูกสร้างไว้ที่:
`D:\wsl\PRPs-Framework\.auto-claude\specs\DEMO-*`

- **Backlog**: `DEMO-001-Backlog`
- **In Progress**: `DEMO-003-In-Progress`
- **Success (Done)**: `DEMO-006-Completed`
- **Error (Failed)**: `DEMO-007-Error-Failed`
