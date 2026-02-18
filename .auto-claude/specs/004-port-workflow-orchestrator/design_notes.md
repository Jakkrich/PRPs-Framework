# Design Notes for Spec Generator Tool

## Analysis of Source
The original "interactive interview" in `PRPs-agentic-eng` is driven by a Markdown Prompt (`prp-prd.md`) executed by Claude. It forces potential hallucinations or "creative" filling of gaps.
For `PRPs-Framework`, we want a deterministic "Smart Form" in Python that ensures the user provides key information.

## Logic to Port (from prp-prd.md)
We will port the "Phase 2: FOUNDATION" questions into a CLI interview.

### Questions
1. **Title/Slug**: What is the short name for this task? (e.g., `move-ui-to-global`)
2. **Type**: FEATURE, BUG, REFACTOR, etc.
3. **Priority**: P0, P1, P2
4. **Goal**: What are we building?
5. **Why**: Why is this valueable/needed?
6. **Implementation Details**: Rough steps or specific requirements.

### Context Gathering (New Feature)
The tool will help finding relevant files.
- Ask: "Enter keywords to search for context (or press Enter to skip):"
- Action: Run `find_by_name` logic (using `fd` or `glob`).
- Display results.
- Ask: "Enter file indices to include (comma separated):"
- Result: Add selected file paths to a `Context` section in the spec.

## Input/Output Contract

**Command Line Interface:**
```bash
python apps/tools/spec_generator.py [output_dir] [--interactive]
```

**Output:**
A file `spec.md` inside `output_dir` (e.g., `.auto-claude/specs/005-new-task/spec.md`).

**Template (Standard PRPs-Framework):**
```markdown
# Task: {Title}

- **Reference ID**: {Auto-Generated or Prompted}
- **Type**: {Type}
- **Priority**: {Priority}
- **Status**: OPEN

## Description
{Goal}

## Context
**Why**: {Why}

## Implementation Plan
{Implementation Details}

## References
- {File Path 1}
- {File Path 2}
```

## Implementation Strategy
- Use `rich` library (if available) or standard `input()` for the UI.
- Use `pathlib` for file handling.
- Ensure the script is standalone and doesn't import heavy backend modules.
