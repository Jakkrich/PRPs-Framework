# New Task

Create a new task in the `.auto-claude` system. This initializes the task artifacts required for the backend engine.

## Usage:

```
/01-New-Task $ARGUMENTS
```

The arguments should describe the task at a high level:
- Optional type: `BUG`, `FEAT`, etc.
- Short title
- Description (optional)

Example: `FEAT Add dark mode support`

## Process

1.  **Analyze Request**
    - Identify the specific goal and type of the task.

2.  **Generate Task ID & Path**
    - Scan `.auto-claude/specs/` for existing numeric, 3-digit IDs (e.g., `001`, `002`).
    - Determine the next available ID (e.g., `003`).
    - Generate a slug from the title (e.g., `add-dark-mode`).
    - **Target Directory**: `.auto-claude/specs/{ID}-{slug}/` (e.g., `.auto-claude/specs/003-add-dark-mode/`).

3.  **Create Artifacts**
    - Create the target directory.
    - Create the following files:

    **`spec.md`** (The User Requirement)
    ```markdown
    # {ID}: {TITLE}

    ## Overview
    {DESCRIPTION}

    ## Requirements
    - [ ] ...
    ```

    **`requirements.json`** (Backend Metadata)
    ```json
    {
      "task_description": "{DESCRIPTION}",
      "workflow_type": "feature" // or "bug", "chore", etc.
    }
    ```

    **`implementation_plan.json`** (Task State - Initial)
    ```json
    {
      "feature": "{TITLE}",
      "description": "{DESCRIPTION}",
      "status": "backlog",
      "planStatus": "pending",
      "phases": [],
      "created_at": "{ISO_DATE}",
      "updated_at": "{ISO_DATE}"
    }
    ```

    **`task_metadata.json`** (Agent Config - Optional defaults)
    ```json
    {
      "thinkingLevel": "high",
      "sourceType": "manual"
    }
    ```

4.  **Confirm**
    - Output the path of the created task.
    - Prompt user to run `/02-Plan {ID}` to proceed.
    - > 💡 **Tip**: For a more detailed spec, run `/07-Spec` after this step.

## Output

- **New Directory**: `.auto-claude/specs/{ID}-{slug}/`
- **Files**: `spec.md`, `requirements.json`, `implementation_plan.json`, `task_metadata.json`
