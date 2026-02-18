# Plan Task

Create a detailed implementation plan for a task in the `.auto-claude` system.

## Usage

```
/02-Plan {ID}
```

Example: `/02-Plan 003`

## Input

- **Spec File**: `.auto-claude/specs/{ID}-{slug}/spec.md`
- **Current Plan**: `.auto-claude/specs/{ID}-{slug}/implementation_plan.json` (if exists)

## Process

1.  **Analyze & Research**
    - Read `spec.md` to understand requirements.
    - Research codebase and external docs.
    - Formulate a strategy.

2.  **Generate Plan JSON**
    - Create/Update `implementation_plan.json` with the following structure:

    ```json
    {
      "feature": "{TITLE}",
      "description": "{DESCRIPTION}",
      "status": "planned", // Update status to 'planned'
      "planStatus": "approved", // or 'review_needed' if unsure
      "created_at": "{ISO_DATE}",
      "updated_at": "{ISO_DATE}",
      "phases": [
        {
          "name": "Phase 1: {PHASE_NAME}",
          "subtasks": [
            {
              "id": "{UUID or Unique String}",
              "description": "{SUBTASK_DESCRIPTION}",
              "status": "pending", // pending, in_progress, completed
              "files": ["{TARGET_FILE_1}", "{TARGET_FILE_2}"],
              "verification": "{VERIFICATION_COMMAND}"
            }
          ]
        },
        {
            "name": "Phase 2: {PHASE_NAME} (Validation)",
            "subtasks": [...]
        }
      ]
    }
    ```

3.  **Review (Optional)**
    - If user review is needed, set `planStatus` to `review_needed`.

## Output

- **Updated File**: `.auto-claude/specs/{ID}-{slug}/implementation_plan.json`
- **Next Step**: Prompt user to run `/03-Code {ID}` to start execution.
