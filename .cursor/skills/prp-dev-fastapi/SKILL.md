---
name: prp-dev-fastapi
description: Comprehensive skill for FastAPI development following the PRP Pure Agentic workflow. Includes project templates, async/await patterns, Pydantic validation, repository/service architecture, and automated validation loops. Use when designing, implementation, or refactoring FastAPI applications.
---

# 🚀 PRP Dev – FastAPI (Pure Agentic)

Skill นี้ใช้เพื่อช่วยให้ AI Agent พัฒนาฟีเจอร์บน **FastAPI** ได้อย่างเป็นระบบตามมาตรฐาน PRP Framework โดยเน้นความถูกต้องของสถาปัตยกรรม (Architecture) ความคลีนของโค้ด และการทำ Validation Loop อัตโนมัติ

## 🎯 Scope ของงาน
ใช้ Skill นี้เมื่อ:
- **Design**: ออกแบบโครงสร้าง API หรือ Database Schema
- **Implementation**: เขียนโค้ด FastAPI, Pydantic Models, หรือ Service Layer
- **Refactor**: ปรับปรุงโค้ดเดิมให้เป็นระเบียบหรือรองรับ Async เต็มรูปแบบ
- **Workflow**: เมื่อทำงานใน Task ที่เกี่ยวข้องกับ Backend API (ตั้งแต่วางแผนจนถึง Verify)

---

## 1. 🔍 Platform & Stack Detection
ตรวจสอบสภาพแวดล้อมก่อนเริ่มทำงานเสมอ:
1. **Indicators**: หา `FastAPI` ใน `main.py`, `requirements.txt` หรือ decorators `@app.get()`
2. **Database/ORM**: ระบุว่าใช้ `SQLAlchemy` (Async/Sync), `SQLModel`, หรือ `Tortoise`
3. **Pydantic**: ตรวจสอบว่าเป็น Version 1.x หรือ 2.x (เพื่อการใช้ Syntax ที่ถูกต้อง)
4. **Project Type**: วิเคราะห์โครงสร้างว่าเป็นแบบ Monolithic (Small) หรือ Modular (Production-Ready)

---

## 2. 🏗️ Architecture & Organization
ยึดโครงสร้างระดับ Production-Ready (พยายามอย่าให้ไฟล์ใหญ่เกิน 500 บรรทัด):

```text
app/
├── api/                    # API route handlers
├── core/                   # config, security, database setup
├── models/                 # Database models (ORM)
├── schemas/                # Pydantic schemas (Request/Response)
├── services/               # Business logic layer
├── repositories/           # Data access layer (CRUD)
├── utils/                  # Utility functions
└── main.py                 # Application entry
```

### Naming Conventions
- **Files**: `snake_case` (e.g., `auth_service.py`)
- **Classes**: `PascalCase` (e.g., `UserUpdate`)
- **Functions**: `snake_case` (e.g., `get_active_users`)
- **Endpoints**: `kebab-case` (e.g., `/api/v1/user-profiles`)

---

## 3. 🛡️ Implementation Patterns (Best Practices)

### 3.1 Async All The Way
- ใช้ `async def` สำหรับ Endpoint เสมอ
- ใช้ `await` กับทุก I/O (Database, API Call, File System)
- **ห้าม** ใช้ Blocking code ใน Async function (เช่น `time.sleep`, `requests.get`) ให้ใช้ `asyncio.sleep` หรือ `httpx` แทน

### 3.2 Dependency Injection (FastAPI `Depends`)
ใช้ `Depends` ในการจัดการ Shared resources:
```python
@router.post("/", response_model=Item)
async def create_item(
    item_in: ItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await service.create(db, obj_in=item_in, user=current_user)
```

### 3.3 CRUD Repository Pattern
แยก Logic การจัดการ Data ออกจาก Business Logic:
```python
# repositories/base.py
class BaseRepository(Generic[ModelType, CreateSchema, UpdateSchema]):
    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalars().first()
```

---

## 4. 🔄 PRP Workflow Integration (Pure Agentic)
ในการทำงานแต่ละ Task ให้ Agent ยึดหลักการดังนี้:

### Phase: Planning (/02-Plan)
- ระบุไฟล์ที่ต้องสร้าง/แก้ไขใน `File & Directory Index`
- กำหนด `Validation Loop` ให้ครอบคลุม:
    - **Step 1**: Lint & Type Check (`ruff`, `mypy`)
    - **Step 2**: Unit Test (`pytest`)
    - **Step 3**: Integration Test (เปิด server แล้ว `curl` หรือใช้ `httpx`)

### Phase: Code (/03-Code)
- ทำงานทีละ Subtask และอัปเดตสถานะใน `implementation_plan.json` ทันที
- เมื่อสร้าง Endpoint ใหม่ ต้องสร้าง Pydantic Schema และ Test ไปพร้อมกันเสมอ

### Phase: Verify (/04-Verify)
- รันคำสั่งที่ระบุไว้ใน `Validation Loop` ทั้งหมด
- หาก Error ให้ AI วิเคราะห์และแก้ทันที (Fix-Forward)

---

## 🧪 Testing & Validation
- **Framework**: ใช้ `pytest` ร่วมกับ `pytest-asyncio`
- **Mocking**: ใช้ `unittest.mock` หรือ `pytest-mock` สำหรับ External services
- **Async Client**: ใช้ `httpx.AsyncClient` ในการส่ง Request หา FastAPI
- **Evidence**: บันทึกผลลัพธ์ที่ผ่านลงใน `qa_report.md` เพื่อสร้างความมั่นใจให้มนุษย์รีวิว

---

## ⚡ Quick Reference: Common Gotchas
- **Pydantic v2**: ใช้ `model_dump()` แทน `dict()` และ `model_validate()` แทน `from_orm()`
- **SQLAlchemy Async**: ต้องใช้สกีมา `postgresql+asyncpg://` และต้องมี `await session.commit()`
- **FastAPI Middleware**: ระวังเรื่องลำดับการใส่ Middleware (CORS ควรอยู่ท้ายๆ หรือขึ้นอยู่กับความต้องการเรื่อง Auth)
- **Token Efficiency**: หากไฟล์ยาวเกินไป ให้แนะนำการ Split module ตั้งแต่ขั้นตอน Planning
