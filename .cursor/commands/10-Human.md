# Human Actions
2: 
3: Perform explicit human actions on a task, such as approving, rejecting, or providing feedback.
4: 
5: ## Usage
6: 
7: ```
8: /10-Human [Action] {ID} [Message]
9: ```
10: 
11: Example: `/10-Human Approve 003`
12: Example: `/10-Human Reject 003 "Needs better error handling"`
13: 
14: ## Arguments
15: 
16: - **Action**:
17:   - `Approve`: Mark task as DONE.
18:   - `Reject`: Mark task as REJECTED (or move back to IN PROGRESS).
19:   - `Review`: Mark task as REVIEW NEEDED.
20:   - `Feedback`: Add a feedback note to the task.
21: - **ID**: Task ID (e.g., `003`).
22: - **Message**: Optional message or reason.
23: 
24: ## Process
25: 
26: 1.  **Analyze Action**
27:     - Determine the target status based on the action.
28: 
29: 2.  **Update Artifacts**
30:     - **Approve**:
31:       - status -> `done` (in `implementation_plan.json`)
32:       - Status -> `DONE` (in `spec.md`)
33:     - **Reject**:
          - status -> `in_progress` (if fixing) or `backlog` (if resetting)
35:       - Status -> `REJECTED` or `NEEDS WORK`
36:       - Add rejection reason to `implementation_plan.json`.
37:     - **Review**:
38:       - status -> `human_review`
39:       - Status -> `REVIEW NEEDED`
40:     - **Feedback**:
41:       - Append feedback to `spec.md` or a new `feedback.md` file.
42: 
43: 3.  **Notify**
44:     - Log the action and result.
45: 
46: ## Output
47: 
48: - **Updated Files**: `spec.md`, `implementation_plan.json`
49:
