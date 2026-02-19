# PRP: Master Orchestrator (The Architect)

## 1. Goal (Objectives)
[Describe the high-level goal you want to achieve. Be specific about the end state.]
Example: "Migrate the legacy authentication system to use Clerk, including frontend components and backend middleware."

## 2. Context & Constraints
- **Global Context**: `./INITIAL.md` (Read this first for project overview)
- **Target Directory**: `.auto-claude/specs/` (Specs, NOT implementation plans)
- **Known Constraints**:
  - Must follow the project's existing coding style (see `.cursorrules` or `CLAUDE.md`).
  - Do not modify files in `[Restricted Paths]` unless absolutely necessary.

## 3. Work Breakdown Strategy (AI Instructions)
**Role**: You are the **System Architect**. Your job is to analyze the Goal and break it down into smaller, actionable **Specifications** (Specs) that act as inputs for the detailed planning phase.

**Rules for Breakdown**:
1.  **Scope**: Each spec defines "WHAT" needs to be done, not "HOW" (Technical details belong in the Plan).
2.  **Atomicity**: Each spec should represent a single logical unit of work (e.g., "Create Login API", "Update User Model").
3.  **Output Format**: Create a folder for each spec: `.auto-claude/specs/{ID}-{kebab-case-name}/spec.md`.

## 4. Spec Generation Output
For each identified task, generate a Markdown file in `.auto-claude/specs/{ID}-{kebab-case-name}/spec.md`.

**Format for `spec.md`:**

```markdown
# Spec: {Task Name}
- **Reference ID**: {TASK-ID} (e.g., FEAT-001-01)
- **Parent Goal**: [Link to this PRP]
- **Status**: TODO
- **Type**: FEATURE | BUG | REFACTOR

## Description (The "What" and "Why")
{Context-rich description of the requirement. Explain the business value and user impact.}

## Acceptance Criteria (Definition of Done)
1. {Criteria 1}
2. {Criteria 2}
...

## Technical Scope (High Level)
- **Target Area**: [e.g., Backend API, Frontend Component]
- **Key Files**: [List main files involved, if known]
- **Dependencies**: [Other specs required before this one]

## Next Step
To generate a detailed Implementation Plan for this spec, run:
`/prp-plan .auto-claude/specs/{ID}-{name}/spec.md`
```

---

## 5. Execution Dashboard (Manual Tracking)
*After generating specs, fill this table to track progress.*

| ID | Spec Name | Status | Dependencies | Next Action |
|----|-----------|--------|--------------|-------------|
| 01 | 001-setup-auth-base | Queue | - | `/prp-plan` |
| 02 | 002-login-api | Queue | 01 | - |
