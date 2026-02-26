# 🔍 Root Cause Analysis (Debug Orchestration)

## Issue: $ARGUMENTS

Find the actual origin of an issue, not just the symptoms. Follow the "5 Whys" principle to identify the root cause.

---

## 🛠️ Internal Process

You are an orchestrator. Your goal is to call the specialized Deep Debugging agent to perform a Root Cause Analysis (RCA).

### Phase 1: Symptom Classification
**Call Agent**: `prp-core-debugger`
- Provide the error message, stack trace, or symptom description.
- Ensure the agent restates the symptom clearly before diving in.

### Phase 2: Hypothesis & Investigation
- Facilitate the agent's work through the **5 Whys** protocol.
- Ensure every "Because" step is backed by **Concrete Evidence** (file:line, command output).
- In deep mode, ensure the agent checks Git History to understand when/why the bug was introduced.

### Phase 3: Validation & RCA Report
- Verify that the agent confirms the root cause via the **Three Tests** (Causation, Necessity, Sufficiency).
- Ensure the agent generates the RCA report in `.auto-claude/debug/rca-{slug}.md`.
- Capture the **Fix Specification** and **Verification Plan**.

### Phase 4: Knowledge Capture
- If the bug reveals a systemic misunderstanding or a new pattern, ensure it is recorded in `.auto-claude/lessons.md`.

---

📌 **Next Step**: Once the cause is found, run `/01-New-Task` to plan the fix systematically.
