# 🤖 Cursor Specialist Agents

รวมรายชื่อและหน้าที่ของ AI Agents เฉพาะทาง (Personas) ที่ใช้ในโปรเจกต์นี้ เพื่อถอดบทบาทให้ AI ทำงานได้แม่นตรงตามวัตถุประสงค์

## 📋 วิธีใช้งาน
คุณสามารถเรียกใช้ Agent เหล่านี้ผ่านคำสั่ง:
```text
/11-Agent {AGENT_NAME} {TARGET_FILE/DIR}
```
*ตัวอย่าง: `/11-Agent discuss-spec .auto-claude/specs/007/spec.md`*

---

## 🏗️ Requirements & Planning
| Agent Name | Role | หน้าที่หลัก |
|:---|:---|:---|
| **`discuss-spec`** | Requirement Engineer | ท้าทายและปรับจูน `spec.md` ให้เคลียร์ 360 องศาก่อนเริ่มงาน |
| **`web-researcher`** | Researcher | ค้นหาข้อมูลเชิงลึกจากภายนอก (API, Best Practices) พร้อมระบุแหล่งอ้างอิง |

## 🔍 Exploration & Analysis
| Agent Name | Role | หน้าที่หลัก |
|:---|:---|:---|
| **`codebase-explorer`** | Explorer | ค้นหาว่า Code อยู่ที่ไหน และหา Pattern ที่มีอยู่แล้วเพื่อนำมาใช้ซ้ำ |
| **`codebase-analyst`** | Analyst | วิเคราะห์ Flow ของข้อมูลและการทำงานร่วมกันของ Module ต่างๆ |
| **`silent-failure-hunter`**| Bug Hunter | ตามล่าหาจุดเสี่ยงที่ Error อาจถูกกลืน (Swallowed) หรือไม่มี Log |

## 🛠️ Implementation & Review
| Agent Name | Role | หน้าที่หลัก |
|:---|:---|:---|
| **`code-reviewer`** | Senior Reviewer | ตรวจสอบคุณภาพ Code ตามมาตรฐานโปรเจกต์และความปลอดภัย |
| **`code-simplifier`** | Refactor Expert | ปรับปรุง Code ให้สะอาดและอ่านง่ายขึ้น โดยไม่เปลี่ยน Logic |
| **`type-design-analyzer`**| Architect | ตรวจสอบการออกแบบ Type และ Interface ให้สอดคล้องกันทั่วโปรเจกต์ |
| **`comment-analyzer`** | Auditor | ตรวจสอบ Comment ว่าล้าสมัยหรือขาดข้อมูลสำคัญหรือไม่ |

## 🛡️ PRP Core Engine (Legacy & Orchestration)
| Agent Name | Role | หน้าที่หลัก |
|:---|:---|:---|
| **`prp-core-planner`** | Senior Architect | วางแผนการลงมือทำแบบละเอียด (Deep Analysis) ตามมาตรฐานเดิม |
| **`prp-core-coder`** | Systematic Developer | ลงมือเขียนโค้ดตามแผนงาน พร้อม Validation Loop ตลอดเวลา |
| **`prp-core-debugger`** | RCA Specialist | หาสาเหตุที่แท้จริงของบั๊กด้วยเทคนิค 5 Whys |
| **`prp-core-prd-architect`** | Product Architect | ร่างเอกสารความต้องการ (PRD) จากไอเดียร์เริ่มต้น |
| **`prp-core-codebase-assistant`** | Code Assistant | ตอบคำถามเกี่ยวกับโครงสร้างและตรรกะของโปรเจกต์ |
| **`prp-core-git-committer`** | Git Specialist | ช่วย Stage ไฟล์และสร้าง Commit Message แบบมาตรฐาน |
| **`prp-core-git-pr-maker`** | PR Specialist | รวบรวมข้อมูลและสร้าง Pull Request ที่สมบูรณ์ |

---

## 🧪 Documentation & Testing
| Agent Name | Role | หน้าที่หลัก |
|:---|:---|:---|
| **`docs-impact-agent`** | Docs Manager | วิเคราะห์ว่าการแก้ไข Code กระทบกับเอกสารส่วนไหนบ้าง |
| **`pr-test-analyzer`** | QA Engineer | วิเคราะห์ว่า Pull Request มี Test ครอบคลุมเคสสำคัญครบหรือยัง |


---

## 📘 Guidelines (Reference Only)
*   **`coach-guideline.md`**: ไฟล์คัมภีร์หลักสำหรับ `/99-Coach` (ไม่ใช่ Agent ที่เรียกใช้โดยตรง แต่เป็นกฎที่ Coach ต้องทำตาม)

---

## 🏛️ Legacy Agents (Deprecated)
*ย้ายไปเก็บที่โฟลเดอร์ `legacy/` เพื่อลดความสับสน เนื่องจากเป็นสถาปัตยกรรมรุ่นเก่า*

| Agent Name | Role | สถานะ / หมายเหตุ |
|:---|:---|:---|
| **`prp-core-issue-investigator`** | Task Investigator | [Legacy] ถูกแทนที่ด้วย `/02-Plan` และ `/06-Debug` |
| **`prp-core-issue-fixer`** | Fixer | [Legacy] ถูกแทนที่ด้วย `/03-Code` |
| **`prp-core-reviewer`** | QA Reviewer | [Legacy] ถูกแทนที่ด้วย `auto-qa-expert` ใน `/04-Verify` |
| **`prp-core-review-orchestrator`**| Orchestrator | [Legacy] ระบบจัดการรีวิวแบบเดิม |
| **`prp-core-ralph`** | Autonomous Loop | [Legacy] ระบบลูปอัตโนมัติรุ่นแรก |
| **`prp-core-ralph-canceller`** | Canceller | [Legacy] ใช้สำหรับยกเลิก Ralph Loop |

---
*หมายเหตุ: ทุก Agent ถูกออกแบบมาให้ทำงานแบบ **Pure Agentic** โดยจะใช้เครื่องมือมาตรฐานของ Cursor ในการอ่านและแก้ไขไฟล์*
