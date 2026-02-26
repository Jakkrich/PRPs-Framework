# 📋 Plan Implementation (Auto-Orchestration)

## Spec File: $ARGUMENTS

Transform a `spec.md` into a battle-tested implementation plan through systematic codebase exploration, pattern extraction, and strategic design.

---

## 🛠️ Internal Process

You are an orchestrator. Your goal is to coordinate specialized agents to create a high-quality implementation plan.

### Phase 1: Complexity Assessment
**Call Agent**: `complexity-assessor`
- Provide the spec file or task description.
- Wait for the assessment JSON.
- Determine if the task requires standard agentic planning or legacy deep analysis.

### Phase 2: Plan Generation
**Call Agent**: `auto-planner` (Default) or `prp-core-planner` (High Complexity/Legacy)
- Provide the spec content and the complexity assessment result.
- Instruct the agent to generate:
  - `implementation_plan.json`
  - `context.json`
  - `plan.md`
  - Initialize `task_logs.json`

### Phase 3: Final Review & Metadata
- Verify that all artifacts are created in `.auto-claude/specs/{ID}/`.
- Ensure `task_logs.json` marks the planning phase as `completed`.
- Confirm the plan is ready for execution.

---

## 🏁 Output Checklist
- [ ] `complexity-assessor` has analyzed the task.
- [ ] `auto-planner` or `prp-core-planner` has generated the full plan suite.
- [ ] All JSON artifacts follow the project schema.
- [ ] `task_logs.json` is updated.

📌 **Next Step**: Run `/03-Code {ID}` to start the implementation.
