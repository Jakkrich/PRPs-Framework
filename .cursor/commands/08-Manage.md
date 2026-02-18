# Manage Project

Assess task complexity and plan follow-ups.

## Usage

```
/08-Manage [tool] {ID}
```

## Arguments

- **tool**:
  - `complexity`: Estimate task complexity.
  - `followup`: Plan next steps after task completion.
- **ID**: Task ID or path.

## Process

1.  **Locate Task**
    - Find `.auto-claude/specs/{ID}-{slug}/`.

2.  **Execute Analysis**
    - **Complexity**: Update `task_metadata.json` with complexity score/reasoning.
    - **Followup**: Create new task drafts or update `implementation_plan.json`.

## Output

- **Updated Files**: `task_metadata.json`, `implementation_plan.json`.
