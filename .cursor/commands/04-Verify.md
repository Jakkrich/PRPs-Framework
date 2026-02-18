# Verify Quality

Run comprehensive quality assurance checks on the implemented task.

## Usage

```
/04-Verify {ID}
```

Example: `/04-Verify 003`

## Input

- **Spec File**: `.auto-claude/specs/{ID}-{slug}/spec.md`
- **Plan File**: `.auto-claude/specs/{ID}-{slug}/implementation_plan.json`

## Process

1.  **Identify Verification Steps**
    - Read `implementation_plan.json` to find verification commands defined in subtasks.
    - Inspect codebase to identify standard tests (unit, integration, linting).

2.  **Execute Validation Loop**
    - **Step 1: Syntax & Linting**: Run project linters/formatters.
    - **Step 2: Core Logic**: Run specific tests related to the changed files.
    - **Step 3: Integration**: Run broader tests if applicable.
    - **Step 4: Deep Code Analysis**:
        - Load persona from `.auto-claude/agents/code-reviewer.md` and review changes.
        - Load persona from `.auto-claude/agents/silent-failure-hunter.md` and check for error handling issues.

3.  **Generate Report**
    - Create `qa_report.md` in `.auto-claude/specs/{ID}-{slug}/`.
    - Format:
      ```markdown
      # QA Report: {TASK_TITLE}

      ## Summary
      - **Status**: PASS / FAIL
      - **Date**: {ISO_DATE}

      ## Automated Checks
      - **Linting**: P/F - {DETAILS}
      - **Unit Tests**: P/F - {DETAILS}
      - **Integration**: P/F - {DETAILS}

      ## Agent Analysis
      ### Code Reviewer
      {OUTPUT_FROM_CODE_REVIEWER}

      ### Silent Failure Hunter
      {OUTPUT_FROM_SILENT_FAILURE_HUNTER}

      ## Issues Found
      - [ ] {ISSUE_DESCRIPTION}
      ```

4.  **Update Task Status**
    - If **PASS**: Update `status` in `implementation_plan.json` to `human_review`.
    - **Update Spec**: If PASS, update `Status` in `spec.md` to `REVIEW NEEDED` (or `VERIFIED`).
    - If **FAIL**: Update `status` in `implementation_plan.json` to `qa_fixing` (or `error`).

## Output

- **Report**: `.auto-claude/specs/{ID}-{slug}/qa_report.md`
- **Updated Status**: `implementation_plan.json`
- **Next Step**: User reviews the report. If satisfied, User manually updates status to `DONE` (or merges PR).
