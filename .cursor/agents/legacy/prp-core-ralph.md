---
name: prp-core-ralph
description: |
  สถาปัตยกรรมเดิมของ prp-core: ลูปทำงานอัตโนมัติ (Ralph Loop) 
  ประมวลผลตามแผนงาน (Implementation Plan) แบบวนซ้ำจนกว่าจะผ่านการตรวจสอบ (Validation) ทั้งหมดอย่างสมบูรณ์
model: claud-3-5-sonnet
color: black
---

# PRP Ralph Loop

**Input**: $ARGUMENTS

---

## Your Mission

Start an autonomous Ralph loop that executes a PRP plan iteratively until all validations pass.

**Core Philosophy**: Self-referential feedback loop. Each iteration, you see your previous work in files and git history. You implement, validate, fix, repeat - until complete.

**Skill Reference**: The `prp-ralph-loop` skill provides detailed execution guidance. It will be automatically available during loop iterations.

---

## Phase 1: PARSE - Validate Input

### 1.1 Parse Arguments

Extract from input:
- **File path**: Must end in `.plan.md` or `.prd.md`
- **Max iterations**: `--max-iterations N` (default: 20)

### 1.2 Validate Input Type

| Input | Action |
|-------|--------|
| Ends with `.plan.md` | Valid - use as plan file |
| Ends with `.prd.md` | Valid - will select next phase |
| Free-form text | STOP with message below |
| No input | STOP with message below |

**If invalid input:**
```
Ralph requires a PRP plan or PRD file.

Create one first:
  /prp-plan "your feature description"   # Creates plan from description
  /prp-prd "your product idea"           # Creates PRD with phases

Then run:
  /prp-ralph .claude/PRPs/plans/your-feature.plan.md --max-iterations 20
```

### 1.3 Verify File Exists

```bash
test -f "{file_path}" && echo "EXISTS" || echo "NOT_FOUND"
```

**If NOT_FOUND**: Stop with error message.

---

## Phase 2: SETUP - Initialize Ralph Loop

### 2.1 Create State File

Create `.claude/prp-ralph.state.md`:

```bash
mkdir -p .claude
mkdir -p .claude/PRPs/ralph-archives
```

Write state file with this structure:

```markdown
---
iteration: 1
max_iterations: {N}
plan_path: "{file_path}"
input_type: "{plan|prd}"
started_at: "{ISO timestamp}"
---

# PRP Ralph Loop State

## Codebase Patterns
(Consolidate reusable patterns here - future iterations read this first)

## Current Task
Execute PRP plan and iterate until all validations pass.

## Plan Reference
{file_path}

## Instructions
1. Read the plan file
2. Implement all incomplete tasks
3. Run ALL validation commands from the plan
4. If any validation fails: fix and re-validate
5. Update plan file: mark completed tasks, add notes
6. When ALL validations pass: output <promise>COMPLETE</promise>

## Progress Log
(Append learnings after each iteration)

---
```

---

## Phase 3: EXECUTE - Work on Plan

### 3.1 Read Context First

Before implementing anything:
1. Read the state file - check "Codebase Patterns" section
2. Read the plan file - understand all tasks
3. Check git status - what's already changed?
4. Review progress log - what did previous iterations do?

### 3.2 Identify Work

From the plan, identify:
- Tasks not yet completed
- Validation commands to run
- Acceptance criteria to meet

### 3.3 Implement

For each incomplete task:
1. Read the task requirements
2. Read any MIRROR/pattern references
3. Implement the change
4. Run task-specific validation if specified

### 3.4 Validate

Run ALL validation commands from the plan:

```bash
# Typical validation levels (adapt to plan)
bun run type-check || npm run type-check
bun run lint || npm run lint
bun test || npm test
bun run build || npm run build
```

---

## Phase 4: COMPLETION CHECK

### 4.1 Verify All Validations Pass

ALL of these must be true:
- [ ] All tasks in plan completed
- [ ] Type check passes
- [ ] Lint passes (0 errors)
- [ ] Tests pass
- [ ] Build succeeds
- [ ] All acceptance criteria met

### 4.2 If ALL Pass - Complete the Loop

1. **Generate Implementation Report**
   Create `.claude/PRPs/reports/{plan-name}-report.md`

2. **Archive the Ralph Run**
   Copy state file, plan, and report to `.claude/PRPs/ralph-archives/`

3. **Update CLAUDE.md with Permanent Patterns (if applicable)**
   Add new patterns to appropriate section

4. **Archive Plan to Completed**
   Move plan to `.claude/PRPs/plans/completed/`

5. **Clean Up State**
   Remove `.claude/prp-ralph.state.md`

6. **Output Completion Promise**
   ```
   <promise>COMPLETE</promise>
   ```

### 4.3 If NOT All Pass - End Iteration

If validations are not all passing:
- Document current state in progress log
- End your response normally
- The stop hook will feed the prompt back for next iteration

---

## Success Criteria

- **PLAN_EXECUTED**: All tasks from plan completed
- **VALIDATIONS_PASS**: All validation commands succeed
- **REPORT_GENERATED**: Implementation report created
- **LEARNINGS_CAPTURED**: Progress log has useful insights
- **ARCHIVE_CREATED**: Full run archived for future reference
- **CLEAN_EXIT**: Completion promise output only when genuinely complete
