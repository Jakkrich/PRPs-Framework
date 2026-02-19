"""
PRPs-Framework Onboarding Script
================================
Single-command setup for new developers.

Usage:
    python .cursor/scripts/onboarding.py

This script will:
  1. Check Python version (>= 3.8)
  2. Create virtual environment & install dependencies
  3. Run init-sync (create INITIAL.md)
  4. Run health check on all components
  5. Display welcome message & available commands
"""

import os
import sys
import subprocess
import platform
from pathlib import Path
from datetime import datetime, timezone

# Fix Windows console encoding for emoji/Unicode output
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass  # Fallback: some terminals don't support reconfigure


# ============================================================
# Constants
# ============================================================

REQUIRED_PYTHON = (3, 8)

COMMANDS = [
    ('00-Coach',    'Mentor & Advisor (Read-Only Analysis)'),
    ('01-New-Task', 'Create a new task with spec & plan scaffold'),
    ('02-Plan',     'AI-powered implementation planning'),
    ('03-Code',     'Execute implementation plan (subtask loop)'),
    ('04-Verify',   'QA validation & generate QA report'),
    ('10-Human',    'Human actions: Approve / Reject / Feedback'),
    ('11-Agent',    'Invoke specialist agent personas'),
]


# ============================================================
# Utilities
# ============================================================

def find_project_root():
    """Find the project root by looking for .auto-claude directory."""
    current = Path.cwd()
    root = current
    while not (root / '.auto-claude').exists() and root.parent != root:
        root = root.parent
    if (root / '.auto-claude').exists():
        return root

    # Fallback: relative to script location
    script_dir = Path(__file__).resolve().parent
    root = script_dir.parent.parent
    if (root / '.auto-claude').exists():
        return root

    return current


def get_python_exe(venv_dir):
    """Get the Python executable path for the venv."""
    if os.name == 'nt':
        return venv_dir / 'Scripts' / 'python.exe'
    return venv_dir / 'bin' / 'python'


def get_pip_exe(venv_dir):
    """Get the pip executable path for the venv."""
    if os.name == 'nt':
        return venv_dir / 'Scripts' / 'pip.exe'
    return venv_dir / 'bin' / 'pip'


def print_banner():
    """Display the welcome banner."""
    print()
    print('=' * 60)
    print('  PRPs-Framework — Developer Onboarding')
    print('=' * 60)
    print(f'  Platform : {platform.system()} {platform.release()}')
    print(f'  Python   : {sys.version.split()[0]}')
    print(f'  Time     : {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")}')
    print('=' * 60)
    print()


def print_step(step_num, total, title, status='...'):
    """Print a formatted step line."""
    icon = {
        '...': '⏳',
        'ok': '✅',
        'skip': '⏭️',
        'fail': '❌',
    }.get(status, '⏳')
    print(f'  [{step_num}/{total}] {icon} {title}')


def print_substep(msg):
    """Print a sub-step message."""
    print(f'        → {msg}')


# ============================================================
# Step 1: Check Prerequisites
# ============================================================

def step_check_prerequisites(project_root):
    """Check Python version and project root."""
    errors = []

    # Check Python version
    if sys.version_info < REQUIRED_PYTHON:
        errors.append(
            f'Python {REQUIRED_PYTHON[0]}.{REQUIRED_PYTHON[1]}+ required, '
            f'found {sys.version_info.major}.{sys.version_info.minor}'
        )

    # Check project root
    if not (project_root / '.auto-claude').exists():
        errors.append(
            'Not in a PRPs-Framework project root (missing .auto-claude/). '
            'Please cd to your project directory first.'
        )

    if errors:
        for err in errors:
            print_substep(f'ERROR: {err}')
        return False

    print_substep(f'Python {sys.version_info.major}.{sys.version_info.minor} — OK')
    print_substep(f'Project root: {project_root}')
    return True


# ============================================================
# Step 2: Setup Virtual Environment
# ============================================================

def step_setup_venv(project_root):
    """Create venv and install dependencies (idempotent)."""
    venv_dir = project_root / '.cursor' / '.venv'
    flag_file = venv_dir / 'installed.flag'

    # Idempotent: skip if already done
    if flag_file.exists():
        print_substep('Virtual environment already exists — skipped')
        return True

    # Create venv
    if not venv_dir.exists():
        print_substep('Creating virtual environment...')
        try:
            subprocess.check_call(
                [sys.executable, '-m', 'venv', str(venv_dir)],
                stdout=subprocess.DEVNULL, stderr=subprocess.PIPE
            )
        except Exception as e:
            print_substep(f'ERROR creating venv: {e}')
            return False

    python_exe = get_python_exe(venv_dir)
    pip_exe = get_pip_exe(venv_dir)

    # Upgrade pip
    print_substep('Upgrading pip...')
    try:
        subprocess.check_call(
            [str(python_exe), '-m', 'pip', 'install', '--upgrade', 'pip'],
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE
        )
    except Exception as e:
        print_substep(f'WARNING: pip upgrade failed: {e}')

    # Install requirements
    req_file = project_root / 'PRPs-Framework' / 'apps' / 'backend' / 'requirements.txt'
    if req_file.exists():
        print_substep('Installing dependencies...')
        try:
            subprocess.check_call(
                [str(pip_exe), 'install', '-r', str(req_file)],
                stdout=subprocess.DEVNULL, stderr=subprocess.PIPE
            )
        except Exception as e:
            print_substep(f'ERROR installing deps: {e}')
            return False
    else:
        print_substep(f'WARNING: {req_file} not found — skipping deps install')

    # Mark as complete
    flag_file.parent.mkdir(parents=True, exist_ok=True)
    with open(flag_file, 'w') as f:
        f.write(datetime.now(timezone.utc).isoformat())

    print_substep('Virtual environment ready')
    return True


# ============================================================
# Step 3: Init Sync
# ============================================================

def step_init_sync(project_root):
    """Run update_initial.py to create INITIAL.md (idempotent)."""
    initial_md = project_root / 'INITIAL.md'

    # Idempotent: skip if already exists
    if initial_md.exists():
        print_substep('INITIAL.md already exists — skipped')
        return True

    update_script = project_root / 'PRPs-Framework' / 'apps' / 'extensions' / 'update_initial.py'
    if not update_script.exists():
        print_substep(f'WARNING: {update_script} not found — skipping')
        return True

    venv_dir = project_root / '.cursor' / '.venv'
    python_exe = get_python_exe(venv_dir)

    print_substep('Running init-sync (creating INITIAL.md)...')
    try:
        subprocess.check_call(
            [str(python_exe), str(update_script)],
            cwd=str(project_root),
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE
        )
    except Exception as e:
        print_substep(f'WARNING: init-sync failed: {e}')
        print_substep('You can run it manually later: /00-prp-init-context')
        return True  # Non-fatal

    print_substep('INITIAL.md created')
    return True


# ============================================================
# Step 4: Health Check
# ============================================================

def step_health_check(project_root):
    """Check all components are in place."""
    checks = [
        ('.cursor/.venv/installed.flag', 'Virtual Environment'),
        ('INITIAL.md', 'Project Context (INITIAL.md)'),
        ('.auto-claude/specs', 'Specs Directory'),
        ('PRPs-Framework/apps/tools/json_planner.py', 'Backend: json_planner.py'),
        ('PRPs-Framework/apps/tools/json_executor.py', 'Backend: json_executor.py'),
        ('.cursor/commands/00-Coach.md', 'Commands: Coach'),
        ('.cursor/commands/01-New-Task.md', 'Commands: New Task'),
    ]

    all_ok = True
    for path_str, label in checks:
        path = project_root / path_str
        if path.exists():
            print_substep(f'✅ {label}')
        else:
            print_substep(f'❌ {label} — missing: {path_str}')
            all_ok = False

    return all_ok


# ============================================================
# Step 5: Welcome Message
# ============================================================

def step_welcome(project_root):
    """Display available commands and next steps."""
    print()
    print('  ' + '─' * 56)
    print('  🎉 Onboarding Complete! You are ready to go.')
    print('  ' + '─' * 56)
    print()
    print('  Available Commands:')
    print()
    for cmd, desc in COMMANDS:
        print(f'    /{cmd:<14s} {desc}')
    print()
    print('  ' + '─' * 56)
    print('  🚀 Suggested First Steps:')
    print()
    print('    1. Run /00-Coach to get a project overview')
    print('    2. Run /01-New-Task to create your first task')
    print('    3. Run /02-Plan {ID} to plan the implementation')
    print('    4. Run /03-Code {ID} to implement it')
    print()
    print('  ' + '─' * 56)
    print()
    return True


# ============================================================
# Main
# ============================================================

def main():
    """Run all onboarding steps."""
    project_root = find_project_root()

    print_banner()

    total_steps = 5
    results = []

    # Step 1: Prerequisites
    print_step(1, total_steps, 'Checking prerequisites')
    ok = step_check_prerequisites(project_root)
    results.append(('Prerequisites', ok))
    if not ok:
        print()
        print('  ❌ Prerequisites check failed. Please fix the issues above and try again.')
        sys.exit(1)

    # Step 2: Virtual Environment
    venv_dir = project_root / '.cursor' / '.venv'
    is_skip = (venv_dir / 'installed.flag').exists()
    print_step(2, total_steps, 'Setting up virtual environment',
               'skip' if is_skip else '...')
    ok = step_setup_venv(project_root)
    results.append(('Virtual Environment', ok))

    # Step 3: Init Sync
    initial_md = project_root / 'INITIAL.md'
    is_skip = initial_md.exists()
    print_step(3, total_steps, 'Running init-sync',
               'skip' if is_skip else '...')
    ok = step_init_sync(project_root)
    results.append(('Init Sync', ok))

    # Step 4: Health Check
    print_step(4, total_steps, 'Running health check')
    ok = step_health_check(project_root)
    results.append(('Health Check', ok))

    # Step 5: Welcome
    print_step(5, total_steps, 'Welcome', 'ok')
    step_welcome(project_root)

    # Summary
    failed = [name for name, ok in results if not ok]
    if failed:
        print(f'  ⚠️  Some steps had issues: {", ".join(failed)}')
        print('  The setup is mostly complete, but please check the warnings above.')
    else:
        print('  ✅ All steps completed successfully!')

    print()


if __name__ == '__main__':
    main()
