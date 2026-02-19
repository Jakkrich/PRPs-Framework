#!/usr/bin/env python3
import os
import sys
import json
import re
import argparse
import subprocess
from datetime import datetime
from pathlib import Path

# --- VENV BOOTSTRAP START ---
def find_project_root():
    """
    Locates the project root by looking for .auto-claude or following the script path.
    """
    # 1. Try from CWD
    current_dir = Path.cwd()
    root = current_dir
    while not (root / ".auto-claude").exists() and root.parent != root:
        root = root.parent
    
    if (root / ".auto-claude").exists():
        return root

    # 2. Try from script path
    script_path = Path(__file__).resolve()
    # .cursor/scripts/create-task.py -> .cursor/scripts -> .cursor -> root
    root = script_path.parent.parent.parent
    if (root / ".auto-claude").exists():
        return root

    # Fallback to current directory if not found (though this usually means an error later)
    return current_dir

def ensure_venv_and_restart():
    """
    Ensures the script is running inside a virtual environment (.venv).
    If not, it creates the venv (if missing), triggers pip install (if needed),
    and restarts the script using the venv's python executable.
    """
    
    # 1. Detect project root and venv path
    project_root = find_project_root()
    venv_dir = project_root / ".cursor" / ".venv"
    
    # 2. Check if already in venv
    # sys.prefix vs sys.base_prefix is the standard check
    in_venv = sys.prefix != sys.base_prefix
    
    if in_venv:
        return

    # Determine executables
    if os.name == "nt":
        python_exe = venv_dir / "Scripts" / "python.exe"
        pip_exe = venv_dir / "Scripts" / "pip.exe"
    else:
        python_exe = venv_dir / "bin" / "python"
        pip_exe = venv_dir / "bin" / "pip"

    # 3. Create venv if it doesn't exist
    just_created = False
    if not venv_dir.exists():
        print(f"[create-task] Creating virtual environment at {venv_dir}...")
        try:
            subprocess.check_call([sys.executable, "-m", "venv", str(venv_dir)])
            just_created = True
        except subprocess.CalledProcessError as e:
            print(f"[create-task] Failed to create venv: {e}")
            sys.exit(1)
            
    # 4. Install requirements if newly created or if we want to ensure sync
    if just_created or not (venv_dir / "installed.flag").exists():
        print("[create-task] Setting up dependencies...")
        try:
            subprocess.check_call([str(python_exe), "-m", "pip", "install", "--upgrade", "pip"])
        except subprocess.CalledProcessError:
            print("[create-task] Warning: Failed to upgrade pip.")

        requirements_file = project_root / "PRPs-Framework" / "apps" / "backend" / "requirements.txt"
        if requirements_file.exists():
            print(f"[create-task] Installing dependencies from {requirements_file}...")
            try:
                subprocess.check_call([str(pip_exe), "install", "-r", str(requirements_file)])
                # Mark as installed
                with open(venv_dir / "installed.flag", "w") as f:
                    f.write(datetime.now().isoformat())
            except subprocess.CalledProcessError as e:
                print(f"[create-task] Error during installation: {e}")
        else:
            print(f"[create-task] Warning: requirements.txt not found at {requirements_file}")

    # 5. Restart script within venv
    if not python_exe.exists():
         print(f"[create-task] Error: Python executable not found at {python_exe}")
         sys.exit(1)

    print(f"[create-task] Restarting script in venv: {venv_dir}")
    args = [str(python_exe), __file__] + sys.argv[1:]
    
    try:
        if os.name == "nt":
            # On Windows, os.execv can be flakey with stdout capture in some shells
            sys.exit(subprocess.call(args))
        else:
            os.execv(str(python_exe), args)
    except Exception as e:
        print(f"[create-task] Failed to restart script: {e}")
        sys.exit(1)

# Run bootstrap before anything else
ensure_venv_and_restart()

# --- VENV BOOTSTRAP END ---

# Paths relative to project root
SPECS_DIR = Path(".auto-claude/specs")

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text[:50]

def get_next_spec_number(specs_path):
    if not specs_path.exists():
        return 1
    
    max_num = 0
    for item in specs_path.iterdir():
        if item.is_dir():
            match = re.match(r'^(\d+)', item.name)
            if match:
                num = int(match.group(1))
                if num > max_num:
                    max_num = num
    return max_num + 1

def create_task(title, description, project_root):
    specs_path = project_root / SPECS_DIR
    specs_path.mkdir(parents=True, exist_ok=True)

    spec_number = get_next_spec_number(specs_path)
    slug = slugify(title)
    spec_id = f"{spec_number:03d}-{slug}"
    spec_dir = specs_path / spec_id
    
    if spec_dir.exists():
        print(f"Error: Spec directory {spec_dir} already exists.")
        sys.exit(1)

    spec_dir.mkdir(parents=True)
    print(f"Created task directory: {spec_dir}")

    # Create implementation_plan.json
    now = datetime.utcnow().isoformat() + "Z"
    plan = {
        "feature": f"{spec_number:03d}: {title}",
        "description": description,
        "created_at": now,
        "updated_at": now,
        "status": "pending",  # Match Auto-Claude UI behavior
        "planStatus": "pending",
        "xstateState": "pending",
        "phases": []
    }
    
    with open(spec_dir / "implementation_plan.json", "w", encoding="utf-8") as f:
        json.dump(plan, f, indent=2)
    
    # Create task_metadata.json with UI defaults
    metadata = {
        "sourceType": "manual",
        "model": "opus",
        "thinkingLevel": "high",
        "isAutoProfile": True,
        "phaseModels": {
            "spec": "opus",
            "planning": "opus",
            "coding": "opus",
            "qa": "opus"
        },
        "phaseThinking": {
            "spec": "high",
            "planning": "high",
            "coding": "low",
            "qa": "low"
        },
        "requireReviewBeforeCoding": True,
        "baseBranch": "main",  # Default, could detect
        "fastMode": False,
        "category": "feature",
        "priority": "medium",
        "complexity": "medium",
        "impact": "medium"
    }
    with open(spec_dir / "task_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    # Create requirements.json
    requirements = {
        "task_description": description,
        "workflow_type": "feature"
    }
    with open(spec_dir / "requirements.json", "w", encoding="utf-8") as f:
        json.dump(requirements, f, indent=2)

    # Create spec.md (compatibility with existing workflows)
    spec_content = f"""# {spec_id}: {title}

## Overview
{description}

## Git Context
- **Proposed Branch**: feat/{spec_id}
- **Commit Pattern**: feat: {title}

## Context
- [Background, related systems, related PRPs]

## Problem / Goal
- [Description of the issue or goal]

## Details
- [Any relevant notes from users, stakeholders, or logs]

## Steps to Reproduce / High-level Requirements
- [Step or requirement 1]
- [Step or requirement 2]

## Impact / Priority
- Impact: Medium
- Priority: Medium

## Related PRPs (if known)
- [.auto-claude/specs/REF_slug/spec.md]
"""
    with open(spec_dir / "spec.md", "w", encoding="utf-8") as f:
        f.write(spec_content)

    print(f"Task created successfully: {spec_id}")
    return spec_id

def main():
    parser = argparse.ArgumentParser(description="Create a new task in .auto-claude/specs")
    parser.add_argument("title", help="Title of the task")
    parser.add_argument("description", nargs="?", default=None, help="Description of the task")
    
    args = parser.parse_args()

    # If description is missing, use title
    description = args.description if args.description else args.title
    
    project_root = find_project_root()
    
    if not (project_root / ".auto-claude").exists():
        print("Error: Could not find project root (containing .auto-claude)")
        sys.exit(1)

    spec_id = create_task(args.title, description, project_root)
    print(f"\n[create-task] Success! Created task: {spec_id}")
    print(f"[create-task] Path: {project_root / '.auto-claude' / 'specs' / spec_id}")

if __name__ == "__main__":
    main()
