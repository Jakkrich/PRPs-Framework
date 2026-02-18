# Task: Port Workflow Orchestrator Script (Green Zone Only)

- **Reference ID**: PRPS-003
- **Type**: FEATURE
- **Priority**: P1
- **Status**: DONE

## Description
Port the interactive "Workflow Orchestrator" script from `PRPs-agentic-eng` to `PRPs-Framework`.
The goal is to create a "Smart Form" interface that interviews the user to generate high-quality `spec.md` files (Standardized Input).

## Goals (Green Zone)
- **Interactive Interview**: Script asks the user for Goal, Why, What, and Context.
- **Context Injection**: Automatically finds and suggests relevant files to include in the spec context.
- **Standardized Output**: Generates a valid `spec.md` in the target `.auto-claude/specs/{ID}/` directory.
- **Client-Side Only**: Runs as a standalone tool/script initiated by the user, WITHOUT interfering with the backend's core logic or state machine (No "Red Zone" overlap).

## Constraints (Avoid Red Zone)
- **No Autonomous Loops**: Do not implement the "Ralph Loop" or self-correction logic in this task.
- **No Global State Conflict**: The script must not manage project-level state; it only outputs a static markdown file.
- **No Backend Logic Override**: The script must validly exit after creating the file, handing control back to the standard PRP workflow.

## Source Reference
- Source Script: `c:\Users\User\Downloads\PRPs-agentic-eng\.claude\PRPs\scripts\prp_workflow.py`
