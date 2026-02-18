# Ideate

Run an ideation session to brainstorm improvements and generate ideas.

## Usage

```
/06-Ideate [type] [context]
```

## Arguments

- **type**:
  - `quality`: Code Quality
  - `security`: Security Audit
  - `ui`: UI/UX
  - `perf`: Performance
  - `docs`: Documentation
  - `improvements`: General
- **context**: Optional file or folder path.

## Process

1.  **Initialize**
    - Ensure `.auto-claude/ideation/` directory exists.

2.  **Execute Brainstorming**
    - Load relevant prompts.
    - Generate ideas based on type and context.

3.  **Generate Artifacts**
    - Create/Update `.auto-claude/ideation/ideation.json` with the new ideas.
    - Store context in `.auto-claude/ideation/ideation_context.json`.

## Output

- **Artifacts**: JSON files in `.auto-claude/ideation/`.
