import os
import re
from pathlib import Path

def update_refs(directory):
    commands_to_move = [
        "prp-codebase-question", "prp-commit", "prp-debug", "prp-implement",
        "prp-issue-fix", "prp-issue-investigate", "prp-plan", "prp-pr",
        "prp-prd", "prp-ralph-cancel", "prp-ralph", "prp-review-agents", "prp-review"
    ]
    
    # 1. Update Slash Commands: /prp-xxx -> /prp-core/prp-xxx
    pattern_slash = r'/(' + '|'.join(commands_to_move) + r')(?!\w)'
    replacement_slash = r'/prp-core/\1'

    # 2. Update Filename references: prp-xxx.md -> prp-core/prp-xxx.md
    # Avoid replacing if it already has prp-core/
    pattern_file = r'(?<!prp-core/|prp-core\\)(' + '|'.join(commands_to_move) + r')\.md'
    replacement_file = r'prp-core/\1.md'

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                path = Path(root) / file
                content = path.read_text(encoding="utf-8")
                
                # Check if we are inside prp-core dir, if so, relative references to siblings don't need prp-core/ prefix
                is_in_core = "prp-core" in str(path.parent)
                
                new_content = re.sub(pattern_slash, replacement_slash, content)
                
                if not is_in_core:
                    new_content = re.sub(pattern_file, replacement_file, new_content)
                else:
                    # If in core, we might still want to fix full paths if they exist
                    # but usually they are just filenames.
                    pass
                
                if content != new_content:
                    print(f"Updating {path}")
                    path.write_text(new_content, encoding="utf-8")

if __name__ == "__main__":
    update_refs(".cursor/commands")
