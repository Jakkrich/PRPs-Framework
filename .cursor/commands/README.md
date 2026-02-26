# 🤖 Cursor Commands (Agentic Workflows)

ไฟล์ Markdown ในโฟลเดอร์นี้คือ **Custom Commands** สำหรับใช้งานใน Cursor Chat โดยออกแบบตามหลักการ **Context Engineering** และ **System-Agentic Development** เพื่อให้ AI สามารถทำงานที่ซับซ้อนได้อย่างเป็นระบบ

---

## 🚀 Core Workflow Commands (หลักการทำงาน 4 ขั้นตอน)

ลำดับขั้นตอนมาตรฐานในการพัฒนาฟีเจอร์หรือแก้ไขบั๊ก:

### 1️⃣ **/01-New-Task**
*   **หน้าที่:** เริ่มต้นงานใหม่ สร้างพื้นที่เก็บข้อมูล (Workspace)
*   **Input:** `{ID} {Title} ["Description"]` (เช่น `/01-New-Task 007 "Add Login Page"`)
*   **Output:** 
    *   โฟลเดอร์ `.auto-claude/specs/{ID}-{slug}/`
    *   ไฟล์ `spec.md`, `task_metadata.json`, `requirements.json`, `implementation_plan.json`

### 2️⃣ **/02-Plan**
*   **หน้าที่:** วิเคราะห์โค้ดเชิงลึกและวางแผนการลงมือทำ
*   **Input:** `{ID}` (เช่น `/02-Plan 007`)
*   **Output:** 
    *   `implementation_plan.json` (อัปเดตขั้นตอนย่อย/Subtasks)
    *   `plan.md` (สรุปแผนงานสำหรับมนุษย์อ่าน)
    *   `context.json`, `task_logs.json`

### 3️⃣ **/03-Code**
*   **หน้าที่:** ลงมือเขียนโค้ดตามแผนพร้อมตรวจสอบความถูกต้อง (Validation Loop)
*   **Input:** `{ID}` (เช่น `/03-Code 007`)
*   **Output:** 
    *   Source Code (ไฟล์ที่ถูกแก้ไขจริง)
    *   อัปเดตสถานะ Subtasks ใน `implementation_plan.json` และบันทึก Logs ใน `task_logs.json`

### 4️⃣ **/04-Verify**
*   **หน้าที่:** ตรวจสอบคุณภาพงาน (Senior Review) และสรุปผลการทดสอบ
*   **Input:** `{ID}` (เช่น `/04-Verify 007`)
*   **Output:** 
    *   `qa_report.md` (รายงานผลการรัน Test/Lint/Build และเกณฑ์การตรวจรับ)
    *   อัปเดตสถานะเป็น `human_review` ใน `implementation_plan.json`

---

## 🛠️ Advanced & Utility Commands

| Command | Input | Output | Description |
| :--- | :--- | :--- | :--- |
| **05-PRD** | `{Idea}` | `*.prd.md` | สร้างเอกสารความต้องการแบบระดับกลยุทธ์ |
| **06-Debug** | `{Error/Symptom}` | `rca-*.md` | สืบสวนหาสาเหตุของบั๊กด้วย 5 Whys (Root Cause Analysis) |
| **07-Commit** | `[Target]` | Git Commit | Stage ไฟล์และเขียน Commit Message อัตโนมัติ |
| **08-PR** | `[Base Branch]` | GitHub PR | Push branch และสร้าง Pull Request บน GitHub |
| **09-Research** | `{Topic}` | `research-*.md` | สำรวจ Pattern และโครงสร้างโค้ดที่มีอยู่เดิม |
| **10-Human** | `{Action} {ID}` | Updated Status | มนุษย์สั่ง Approve ✅ หรือ Reject ❌ เพื่อวนคิวงาน |
| **11-Agent** | `{Agent} {Target}` | Report/Code | เรียกใช้ผู้เชี่ยวชาญเฉพาะทาง (เช่น `code-simplifier`) |
| **99-Coach** | `{Question}` | Advice/Note | ปรึกษาแนวทางและบทเรียนจาก Knowledge Base |

---

## 📝 ตัวอย่างการใช้งาน (Usage Examples)

### สถานการณ์ 1: เริ่มฟีเจอร์ใหม่ตั้งแต่ต้น
1. `/01-New-Task 008 "Dark Mode Support"` (สร้างงาน)
2. `/02-Plan 008` (วิเคราะห์ว่าจะเพิ่ม CSS ตัวไหน)
3. `/03-Code 008` (AI ลงมือแก้สี)
4. `/04-Verify 008` (AI ตรวจงาน)
5. `/10-Human Approve 008` (มนุษย์ตรวจแล้วโอเค ปิดงาน)

### สถานการณ์ 2: เจอบั๊กแล้วต้องการแก้
1. `/06-Debug "Uncaught TypeError: cannot read property 'id' of null"` (หาสาเหตุ)
2. เมื่อได้ RCA แล้ว รัน `/01-New-Task 009 "Fix Login null ID"`
3. รันตามลำดับ `/02-Plan` -> `/03-Code` -> `/04-Verify`

### สถานการณ์ 3: ต้องการสำรวจโค้ดก่อนเริ่มงาน
1. `/09-Research "How is authentication handled in this project?"`
2. AI จะสรุปไฟล์ที่เกี่ยวข้องและลำดับการทำงานมาให้ในโฟลเดอร์ research

### สถานการณ์ 4: การรีวิวงานและให้ Feedback/Reject
1. หลังจาก AI รัน `/04-Verify 010` เสร็จ และงานอยู่ในสถานะ `human_review`
2. มนุษย์ตรวจโค้ดแล้วพบจุดที่ต้องแก้: `/10-Human Feedback 010 "เปลี่ยนชื่อตัวแปรจาก data เป็น userData ให้สื่อความหมายขึ้น"`
3. หรือถ้างานผิดพลาดมาก: `/10-Human Reject 010 "Logic การคำนวณภาษีผิดพลาด รบกวนตรวจสอบแผนงานใหม่อีกครั้ง"`
4. เมื่องานได้รับการแก้ไขและตรวจสอบจนพอใจ: `/10-Human Approve 010` (งานจะเปลี่ยนเป็น `done`)

#### 📊 ตารางเปรียบเทียบ: Feedback vs Reject

| หัวข้อเปรียบเทียบ | 🟡 Feedback (แนะนำ) | 🔴 Reject (ปฏิเสธ) |
| :--- | :--- | :--- |
| **ความหมาย** | งาน "ผ่าน" แต่ต้องการการปรับปรุง/ขัดเกลา | งาน "ไม่ผ่าน" เนื่องจากผิดพลาดหรือไม่ได้เกณฑ์ |
| **ความรุนแรง** | ต่ำ - เป็นการจูนสไตล์หรือความสวยงาม | สูง - เป็นเรื่องความถูกต้อง (Correctness/Logic) |
| **การบันทึก** | ลงใน `## Feedback History` ใน QA Report | ลงใน `## Rejection History` พร้อมต้องมี Action Items |
| **ผลต่อ Agent** | เรียนรู้สไตล์ที่มนุษย์ชอบ (Preference) | รับรู้ถึงความผิดพลาดและต้องระวังในการวางแผนใหม่ |
| **ตัวอย่าง** | "เปลี่ยนชื่อตัวแปร", "เพิ่ม Comment ตรงนี้" | "รันแล้ว Crash", "คำนวณเลขผิด", "ทำผิด Spec" |

#### 📈 การวิเคราะห์คุณภาพงาน (Quality Analysis)
เราใช้สถิติจากคำสั่งเหล่านี้เพื่อพัฒนาประสิทธิภาพของทีมและ Agent:
*   **หากจำนวน Rejects สูง**: มักบ่งบอกว่า **"แผนงานไม่ดี"** หรือ **"Agent ไม่เข้าใจโจทย์"** ควรกลับไปรีวิวขั้นตอน `/01-New-Task` และ `/02-Plan` ให้เข้มข้นขึ้น
*   **หากจำนวน Feedback สูง**: มักบ่งบอกถึง **"ความละเอียดรอบคอบ"** ของผู้ตรวจ หรือ **"Coding Style"** ที่ AI ยังเรียนรู้ไม่ทันใจมนุษย์ ควรบันทึกบทเรียนไว้ใน [`.auto-claude/lessons.md`](../.auto-claude/lessons.md) (อ้างอิง Template จาก [`.cursor/PRPs/templates/lessons.template.md`](../.cursor/PRPs/templates/lessons.template.md))

---

## 📂 โครงสร้างภายในโฟลเดอร์
- `*.md`: ไฟล์คำสั่งหลักที่ปรากฏขึ้นเมื่อพิมพ์ `/` ในช่องแชท
- ทุกคำสั่งในที่นี้ทำหน้าที่เป็น **Orchestrator** เพื่อเรียกใช้งาน Specialized Agents ในโฟลเดอร์ `.cursor/agents/`


---

---

## 📂 โครงสร้างการจัดเก็บข้อมูล (Directory & Storage Map)

เพื่อให้การทำงานเป็นระบบและตรวจสอบย้อนหลังได้ ข้อมูลจะถูกเก็บไว้ในโฟลเดอร์ `.auto-claude/` โดยแบ่งตามประเภทงานดังนี้:

| ประเภทข้อมูล | โฟลเดอร์ที่จัดเก็บ | คำสั่งที่สร้าง | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| **Tasks (Active)** | `.auto-claude/specs/` | `/01-New-Task` | เก็บงานที่กำลังดำเนินการ (JSON, Markdown) |
| **Issue Staging** | `.auto-claude/issues/` | `/01-New-Task` | เก็บงานที่รอนำเข้าหรือเป็นกึ่งสำเร็จรูป |
| **Product Needs** | `.auto-claude/prds/` | `/05-PRD` | เอกสาร Requirement ระดับกลยุทธ์/ไอเดีย |
| **Root Causas** | `.auto-claude/debug/` | `/06-Debug` | บันทึกการวิเคราะห์สาเหตุของบั๊ก (RCA) |
| **Research Logs** | `.auto-claude/research/` | `/09-Research` | บันทึกความรู้จากการสำรวจโค้ดหรือเทคโนโลยี |
| **Lessons Learned** | `.auto-claude/lessons.md` | `/10-Human` | บันทึกบทเรียนและสไตล์การเขียนโค้ดที่มนุษย์ชอบ |
| **Agent Reports** | `.auto-claude/reports/` | `/11-Agent` | รายงานผลการทำงานจากผู้เชี่ยวชาญเฉพาะทาง |
| **Templates** | `.cursor/PRPs/templates/` | `Internal` | ไฟล์ต้นแบบโครงสร้างข้อมูล (JSON, Markdown) |

---

## 💡 วิธีใช้งานให้มีประสิทธิภาพ
1. **ใช้เลข ID เสมอ**: เพื่อให้ Agent เข้าถึงข้อมูลใน `.auto-claude/specs/` ได้ถูกต้อง
2. **Sequential Flow**: รันตามลำดับเลขเพื่อรักษาบริบท (Context) ของงาน
3. **Review Output**: ทุกครั้งที่ AI ทำงานเสร็จ ควรเปิดไฟล์ในโฟลเดอร์งานเพื่อตรวจสอบความคืบหน้า

---
*Generated by Antigravity AI for PRPs-Framework*
