import os
import sys
import subprocess
from pathlib import Path
from datetime import datetime

def find_project_root():
    current_dir = Path.cwd()
    root = current_dir
    while not (root / ".auto-claude").exists() and root.parent != root:
        root = root.parent
    if (root / ".auto-claude").exists():
        return root
    script_path = Path(__file__).resolve()
    root = script_path.parent.parent.parent
    if (root / ".auto-claude").exists():
        return root
    return current_dir

def setup_venv():
    project_root = find_project_root()
    venv_dir = project_root / ".cursor" / ".venv"
    
    # Check if already installed
    if (venv_dir / "installed.flag").exists():
        print(f"[setup-venv] Project venv already exists and is initialized.")
        return

    print(f"[setup-venv] Virtual environment not found or uninitialized at {venv_dir}")
    
    if not venv_dir.exists():
        print(f"[setup-venv] Creating virtual environment...")
        try:
            subprocess.check_call([sys.executable, "-m", "venv", str(venv_dir)])
        except Exception as e:
            print(f"[setup-venv] Error creating venv: {e}")
            sys.exit(1)

    # Determine executables
    if os.name == "nt":
        python_exe = venv_dir / "Scripts" / "python.exe"
        pip_exe = venv_dir / "Scripts" / "pip.exe"
    else:
        python_exe = venv_dir / "bin" / "python"
        pip_exe = venv_dir / "bin" / "pip"

    print("[setup-venv] Installing/Syncing dependencies from backend requirements.txt...")
    try:
        subprocess.check_call([str(python_exe), "-m", "pip", "install", "--upgrade", "pip"])
        
        req_file = project_root / "PRPs-Framework" / "apps" / "backend" / "requirements.txt"
        if req_file.exists():
            subprocess.check_call([str(pip_exe), "install", "-r", str(req_file)])
            
            # Mark as installed
            with open(venv_dir / "installed.flag", "w") as f:
                f.write(datetime.now().isoformat())
            print("[setup-venv] Dependencies installed successfully.")
        else:
            print(f"[setup-venv] Warning: {req_file} not found.")
    except Exception as e:
        print(f"[setup-venv] Error installing dependencies: {e}")
        sys.exit(1)

if __name__ == "__main__":
    setup_venv()
