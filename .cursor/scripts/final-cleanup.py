import os
import re
from pathlib import Path

def cleanup(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                path = Path(root) / file
                content = path.read_text(encoding="utf-8")
                
                new_content = content
                
                # Fix double prefixes again just in case
                new_content = re.sub(r'prp-core/prp-core/', r'prp-core/', new_content)
                
                # Fix accidental prefixes in state files / auto-claude / etc.
                new_content = re.sub(r'\.claude/prp-core/', r'.claude/', new_content)
                new_content = re.sub(r'\.auto-claude/prp-core/', r'.auto-claude/', new_content)
                new_content = re.sub(r'\.claude\\prp-core\\', r'.claude\\', new_content)
                new_content = re.sub(r'\.auto-claude\\prp-core\\', r'.auto-claude\\', new_content)

                if content != new_content:
                    print(f"Cleaning {path}")
                    path.write_text(new_content, encoding="utf-8")

if __name__ == "__main__":
    cleanup(".cursor/commands")
