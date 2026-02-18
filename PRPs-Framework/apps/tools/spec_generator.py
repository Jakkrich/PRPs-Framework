#!/usr/bin/env python3
import argparse
import sys
import os
from pathlib import Path
from datetime import datetime

# --- Constants & Configuration ---
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
SPECS_DIR = ROOT_DIR.parent / ".auto-claude" / "specs"

SPEC_TEMPLATE = """# Task: {title}

- **Reference ID**: {ref_id}
- **Type**: {type}
- **Priority**: {priority}
- **Status**: OPEN

## Description
{goal}

## Context
**Why**: {why}

## Implementation Plan
{implementation}

## References
{references}
"""

class SpecGenerator:
    def __init__(self):
        self.data = {}
        self.context_files = []

    def ask(self, prompt, default=None, required=True):
        """Ask a question via CLI."""
        suffix = f" [{default}]" if default else ""
        while True:
            try:
                response = input(f"{prompt}{suffix}: ").strip()
            except EOFError:
                sys.exit(0)
            
            if not response and default:
                return default
            if not response and not required:
                return ""
            if response:
                return response
            print("Response required.")

    def ask_questions(self):
        print("\n--- Spec Generator: Smart Form ---")
        self.data['ref_id'] = self.ask("Task ID (e.g. 005)", required=True)
        self.data['slug'] = self.ask("Slug (e.g. new-feature)", required=True)
        self.data['type'] = self.ask("Type (FEATURE/BUG/REFACTOR)", default="FEATURE").upper()
        self.data['priority'] = self.ask("Priority (P0/P1/P2)", default="P1").upper()
        self.data['title'] = self.ask("Title", required=True)
        self.data['goal'] = self.ask("Goal (What are we building?)", required=True)
        self.data['why'] = self.ask("Why (Business value/Context)?", required=True)
        self.data['implementation'] = self.ask("Implementation Details (Rough plan)", required=True)

    def gather_context(self):
        print("\n--- Context Gathering ---")
        keywords = self.ask("Enter keywords to search for context files (comma separated, or Enter to skip)", required=False)
        if not keywords:
            return

        keyword_list = [k.strip().lower() for k in keywords.split(',') if k.strip()]
        matches = []
        
        # Simple file walk
        print(f"Searching in {ROOT_DIR}...")
        for root, _, files in os.walk(ROOT_DIR):
            for file in files:
                if file.endswith(('.md', '.py', '.ts', '.js', '.json')):
                    path = Path(root) / file
                    try:
                        # Check path or content match? For speed, just path match first
                        if any(k in str(path).lower() for k in keyword_list):
                            matches.append(path)
                    except Exception as e:
                        print(f"[warn] Skipping {path}: {e}", file=sys.stderr)
        
        if not matches:
            print("No matches found.")
            return

        print("\nFound matches:")
        for i, match in enumerate(matches):
            try:
                rel_path = match.relative_to(ROOT_DIR)
                print(f"[{i}] {rel_path}")
            except ValueError:
                print(f"[{i}] {match}")

        selection = self.ask("Enter indices to include (comma separated, e.g. 0,2)", required=False)
        if selection:
            indices = [int(i.strip()) for i in selection.split(',') if i.strip().isdigit()]
            for idx in indices:
                if 0 <= idx < len(matches):
                    self.context_files.append(matches[idx])

    def generate(self):
        # Format references
        refs = []
        for f in self.context_files:
            try:
                path_str = str(f.relative_to(ROOT_DIR)).replace('\\', '/')
                refs.append(f"- `PRPs-Framework/{path_str}`")
            except ValueError:
                refs.append(f"- `{f}`")
        
        ref_text = "\n".join(refs) if refs else "- (None)"

        content = SPEC_TEMPLATE.format(
            title=self.data['title'],
            ref_id=self.data['ref_id'],
            type=self.data['type'],
            priority=self.data['priority'],
            goal=self.data['goal'],
            why=self.data['why'],
            implementation=self.data['implementation'],
            references=ref_text
        )

        # Output path
        task_dir_name = f"{self.data['ref_id']}-{self.data['slug']}"
        output_dir = SPECS_DIR / task_dir_name
        output_file = output_dir / "spec.md"

        print(f"\nGeneratig spec at: {output_file}")
        
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file.write_text(content, encoding='utf-8')
        
        # Also create empty requirements.json and implementation_plan.json
        (output_dir / "requirements.json").write_text("{}", encoding='utf-8')
        (output_dir / "implementation_plan.json").write_text("{}", encoding='utf-8')

        print("✅ Spec created successfully!")

if __name__ == "__main__":
    generator = SpecGenerator()
    try:
        generator.ask_questions()
        generator.gather_context()
        generator.generate()
    except KeyboardInterrupt:
        print("\nCancelled.")
        sys.exit(1)
