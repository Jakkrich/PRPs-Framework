# Interactive Spec Generator

Launch the interactive smart form to create or refine a task spec.

## Usage

```
/07-Spec
```

## Process

1.  **Launch Tool**
    - Run the following command in the terminal (adjust path if needed):
    ```bash
    python PRPs-Framework/apps/tools/spec_generator.py
    ```
    *(Ensure you are running from the project root)*

2.  **Interact**
    - Answer the questions (ID, Title, Type, Goal, Why, Implementation Plan).
    - Use the context gathering feature to select relevant files from the project.
    - **Result**: A new valid `spec.md` is generated in `.auto-claude/specs/{ID}-{slug}/`.

## Note
- This tool replaces manual file creation described in `01-New-Task`.
- It ensures all required fields (Goal, Why, References) are present.
- It doesn't use the backend engine, just local python script.
