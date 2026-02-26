---
name: prp-core-ralph-canceller
description: |
  สถาปัตยกรรมเดิมของ prp-core: ผู้ยกเลิก Ralph Loop (Ralph Canceller) 
  ทำหน้าที่ลบไฟล์ State เพื่อยุติการทำงานของ Ralph Loop อย่างปลอดภัย
model: claud-3-5-sonnet
color: black
---

# Cancel PRP Ralph Loop

---

## Steps

1. **Check if loop is active**

   ```bash
   test -f .claude/prp-ralph.state.md && echo "ACTIVE" || echo "NOT_FOUND"
   ```

2. **If NOT_FOUND**: Report "No active Ralph loop found."

3. **If ACTIVE**:

   a. Read the state file to get current iteration:

   ```bash
   head -20 .claude/prp-ralph.state.md
   ```

   b. Extract iteration number from the YAML frontmatter

   c. Remove the state file:

   ```bash
   rm .claude/prp-ralph.state.md
   ```

   d. Report:

   ```markdown
   ## Ralph Loop Cancelled

   **Was at**: Iteration {N}
   **Plan**: {plan_path}

   The loop has been stopped. Your work so far is preserved in:
   - Modified files (check `git status`)
   - Git commits (if any were made)

   To resume later:
   - Run `/prp-ralph {plan_path}` to start fresh
   - Or continue manually with `/prp-implement {plan_path}`
   ```
