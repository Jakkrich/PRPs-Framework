# Utility

General utilities for insights and fixes.

## Usage

```
/09-Utils [tool] {ID}
```

## Arguments

- **tool**:
  - `insight`: Extract insights from task execution.
  - `qa-fixer`: Auto-fix common QA issues.
  - `val-fixer`: Fix validation script errors.
- **ID**: Task ID or path.

## Process

1.  **Locate Task**
    - Find `.auto-claude/specs/{ID}-{slug}/`.

2.  **Execute Utility**
    - **Insight**: Append to `qa_report.md` or separate log.
    - **Fixers**: Modify code or config files directly.

## Output

- **Modified Files**: Source code, config, or reports in task directory.
