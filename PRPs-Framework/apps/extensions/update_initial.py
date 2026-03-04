
"""
Update INITIAL.md Script
========================

This script automatically scans the project using the CustomProjectAnalyzer and updates:
1. 'Project Overview' section
2. 'Detected Stack' line
3. 'Last Sync' timestamp
in the INITIAL.md file.

Usage: python PRPs-Framework/apps/extensions/update_initial.py [project_dir]
"""

import sys
import re
from pathlib import Path
from datetime import datetime

# Setup path to import core and custom modules
EXTENSION_DIR = Path(__file__).parent # .../PRPs-Framework/apps/extensions
APPS_PARENT_DIR = EXTENSION_DIR.parent.parent # .../PRPs-Framework (the one containing apps/)

# Add the directory containing 'apps' to path
if str(APPS_PARENT_DIR) not in sys.path:
    sys.path.insert(0, str(APPS_PARENT_DIR))

# Also add the project root (one level up from framework root if nested)
PROJECT_ROOT = APPS_PARENT_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Import CustomProjectAnalyzer
try:
    from apps.extensions.custom_analyzer import CustomProjectAnalyzer
    from apps.backend.project.models import SecurityProfile
except ImportError as e:
    print(f"Error importing modules from {APPS_PARENT_DIR}: {e}")
    # print(f"Current Sys.path: {sys.path}")
    sys.exit(1)


def update_initial_md(project_dir: Path):
    """
    Run analysis and update INITIAL.md content.
    """
    print(f"Checking project at: {project_dir}")
    analyzer = CustomProjectAnalyzer(project_dir, spec_dir=None)
    try:
        profile: SecurityProfile = analyzer.analyze(force=True)
    except Exception as e:
        print(f"Analysis failed: {e}")
        return

    initial_path = project_dir / "INITIAL.md"
    if not initial_path.exists():
        print(f"INITIAL.md not found at {initial_path}. Creating from template...")
        try:
             # Try to find template
             template_path = project_dir / "PRPs-Framework" / "templates" / "initial_base.md"
             if template_path.exists():
                 content = template_path.read_text(encoding="utf-8")
                 initial_path.write_text(content, encoding="utf-8")
             else:
                 print("Template not found. Skipping.")
                 return
        except Exception as e:
            print(f"Could not create INITIAL.md: {e}")
            return

    content = initial_path.read_text(encoding="utf-8")
    
    # 1. Prepare Detected Stack String
    stack = profile.detected_stack
    detected_parts = []
    
    # Priority Frameworks
    priority_frameworks_list = ["odoo", "odoo-8", "django", "laravel", "nextjs", "yii", "codeigniter", "flutter", "react-native"]
    priority_frameworks = [f for f in stack.frameworks if f in priority_frameworks_list]
    other_frameworks = [f for f in stack.frameworks if f not in priority_frameworks_list]
    
    if priority_frameworks:
        detected_parts.extend(priority_frameworks)
    
    if stack.languages:
        # Filter common languages if framework implies them (e.g. Django -> Python)
        # But keeping it simple: just list main langs
        main_langs = [l for l in stack.languages if l in ["python", "javascript", "typescript", "php", "ruby", "go", "java", "dart"]]
        detected_parts.extend(main_langs)
        
    if stack.databases:
        detected_parts.extend(stack.databases[:2])  # Top 2 DBs

    # Add other frameworks if space permits or if priority list empty
    if not priority_frameworks and other_frameworks:
        detected_parts.extend(other_frameworks[:2])

    detected_str = ", ".join(list(dict.fromkeys(detected_parts)))  # Unique, preserve order
    if not detected_str:
        detected_str = "Generic"

    print(f"Detected Stack to write: {detected_str}")

    # 2. Update 'Detected Stack' line
    # Regex: - **Detected Stack**: .*
    if re.search(r"-\s*\*\*Detected Stack\*\*:", content):
        new_stack_line = f"- **Detected Stack**: {detected_str}"
        content = re.sub(
            r"-\s*\*\*Detected Stack\*\*:\s*.*", 
            new_stack_line, 
            content
        )
    else:
        # If line doesn't exist, try to insert it under Project Context
        if "### Project Context (Auto-Synced)" in content:
            content = content.replace("### Project Context (Auto-Synced)", f"### Project Context (Auto-Synced)\n- **Detected Stack**: {detected_str}")

    # 3. Update 'Project Overview' placeholder
    # Placeholder: - [ประเภทโปรเจกต์: FastAPI / Odoo / PHP / Generic ...]
    
    placeholder_pattern = r"- \[ประเภทโปรเจกต์:.*?\]"
    if re.search(placeholder_pattern, content):
        overview_text = f"- **Platform/Stack**: {detected_str}\n- **Description**: Project based on {detected_str} stack."
        content = re.sub(placeholder_pattern, overview_text, content)
    
    # Update existing Platform/Stack line if found and placeholder gone
    elif re.search(r"-\s*\*\*Platform/Stack\*\*:\s*", content):
         # Only update if it looks generic or we have better info?
         # For now, let's append / Update
         pass 

    # 4. Update Timestamp
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    if re.search(r"-\s*\*\*Last Sync\*\*:", content):
        content = re.sub(
            r"-\s*\*\*Last Sync\*\*:\s*.*",
            f"- **Last Sync**: {now_str} (Local Time)",
            content
        )
    else:
         if "### Project Context (Auto-Synced)" in content:
            content = content.replace("### Project Context (Auto-Synced)", f"### Project Context (Auto-Synced)\n- **Last Sync**: {now_str} (Local Time)")


    # Write back
    initial_path.write_text(content, encoding="utf-8")
    print(f"Successfully updated INITIAL.md")

if __name__ == "__main__":
    target_dir = Path.cwd()
    if len(sys.argv) > 1:
        target_dir = Path(sys.argv[1])
    
    update_initial_md(target_dir)
