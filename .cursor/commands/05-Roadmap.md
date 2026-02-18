# Strategic Roadmap

Perform high-level analysis and roadmap planning for the project.

## Usage

```
/05-Roadmap [type]
```

## Arguments

- **type**:
  - `competitor`: Competitor Analysis (generates `.auto-claude/roadmap/competitor_analysis.json`)
  - `roadmap-features`: Feature Roadmap (generates `.auto-claude/roadmap/roadmap.json`)
  - `roadmap-discovery`: Discovery Phase (generates `.auto-claude/roadmap/discovery.json`)

## Process

1.  **Initialize**
    - Ensure `.auto-claude/roadmap/` directory exists.

2.  **Execute Analysis**
    - Load the corresponding system prompt.
    - Analyze project context and external data (if available).

3.  **Generate Artifacts**
    - Create or update the target JSON file in `.auto-claude/roadmap/`.
    - Format should align with the backend's roadmap schema.

## Output

- **Artifacts**: JSON files in `.auto-claude/roadmap/`.
