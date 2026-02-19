import os
import re
from pathlib import Path

def fix_duplicates(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                path = Path(root) / file
                content = path.read_text(encoding="utf-8")
                
                # Fix double/triple prefixes in slash commands and file paths
                new_content = content
                
                # Fix /prp-core/prp-core/ -> /prp-core/
                while "prp-core/prp-core/" in new_content:
                    new_content = new_content.replace("prp-core/prp-core/", "prp-core/")
                
                # Also fix backslashes if any
                while "prp-core\\prp-core\\" in new_content:
                    new_content = new_content.replace("prp-core\\prp-core\\", "prp-core\\")

                if content != new_content:
                    print(f"Fixing {path}")
                    path.write_text(new_content, encoding="utf-8")

if __name__ == "__main__":
    fix_duplicates(".cursor/commands")
