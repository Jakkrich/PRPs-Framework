# Implement Code

Execute the implementation plan for a task in the `.auto-claude` system.

## Usage

```
/03-Code {ID} [--auto-qa]
```

Example: `/03-Code 003`

## Input

- **Plan File**: `.auto-claude/specs/{ID}-{slug}/implementation_plan.json`
- **Spec File**: `.auto-claude/specs/{ID}-{slug}/spec.md` (for reference)

## Process

1.  **Initialize Execution**
    - Read `implementation_plan.json`.
    - Set task `status` to `in_progress` in the JSON file.
    - **Update Spec**: Update `Status` in `spec.md` to `IN PROGRESS`.
    - Identify current phase and subtasks.

2.  **Execute Subtasks**
    - Iterate through pending subtasks in the current phase.
    - For each subtask:
      - **Context**: Read `spec.md` and relevant files.
      - **Action**: Implement changes (code, config, etc.).
      - **Verification**: Run the verification command specified in the subtask (or infer one).
      - **Update JSON**:
        - Mark subtask status as `completed`.
        - Update `phaseProgress` (0-100%).
        - Save `implementation_plan.json` after each subtask.

3.  **Phase Transition**
    - When all subtasks in a phase are done:
      - Move to the next phase.
      - Update `executionPhase` in JSON.

4.  **Completion & AI Review**
    - When all phases are complete:
      - Run final full verification.
      - Set task `status` to `ai_review` in `implementation_plan.json`.
      - **Update Spec**: Update `Status` in `spec.md` to `AI REVIEW`.
      - **Auto-Trigger**: Run command `/04-Verify {ID}` immediately to generate QA report.

## Output

- **Updated File**: `.auto-claude/specs/{ID}-{slug}/implementation_plan.json` with progress and final status.
