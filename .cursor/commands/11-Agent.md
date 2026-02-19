# Invoke Agent

Run a specific specialist agent persona on the codebase or a specific file.

## Usage

```
/11-Agent {AGENT_NAME} {TARGET}
```

Example: `/11-Agent code-simplifier src/utils.ts`
Example: `/11-Agent silent-failure-hunter src/services/`

## Available Agents

Located in `.cursor/agents/`:

| Agent | Description |
|-------|-------------|
| `code-reviewer` | Reviews code for guidelines, bugs, and quality |
| `code-simplifier` | Refactors code to be cleaner without changing logic |
| `codebase-analyst` | Analyzes the codebase structure and patterns |
| `codebase-explorer` | Explores the codebase to answer questions |
| `comment-analyzer` | Analyzes comments for outdated or missing info |
| `docs-impact-agent` | Checks if changes require documentation updates |
| `gpui-researcher` | Researches GPUI specific patterns (if applicable) |
| `pr-test-analyzer` | Analyzes PRs for missing tests |
| `silent-failure-hunter` | Finds swallowed errors and missing logs |
| `type-design-analyzer` | Reviews type definitions and hierarchy |
| `web-researcher` | Performs web research for specific topics |

> **Note**: `coach-guideline.md` is a guideline file, not an invocable agent.

## Process

1.  **Load Persona**
    - Read the content of `.cursor/agents/{AGENT_NAME}.md`.
    - Adopt the persona, tone, and strict rules defined in that file.

2.  **Execute Task**
    - Apply the agent's logic to the `{TARGET}` (file, directory, or concept).
    - If `{TARGET}` is not specified, run on the current active file or recent changes.

3.  **Output**
    - Generate a report or code changes as specified by the agent's instructions.
    - If the agent produces a report, save it to `.auto-claude/reports/{AGENT_NAME}_{TIMESTAMP}.md` (or print to chat if short).
