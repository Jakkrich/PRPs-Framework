
import json
import logging
import argparse
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')

class JsonPlanner:
    """
    Helper class to generate and manage implementation_plan.json
    """
    
    def __init__(self, spec_path: Path):
        self.spec_path = Path(spec_path).resolve()
        if self.spec_path.name == "implementation_plan.json":
             self.plan_path = self.spec_path
             self.spec_dir = self.plan_path.parent
        else:
             self.spec_dir = self.spec_path.parent
             self.plan_path = self.spec_dir / "implementation_plan.json"
        
    def create_plan_template(self, feature_name: str, description: str) -> None:
        """
        Create a new implementation_plan.json with initial state.
        """
        if self.plan_path.exists():
            logging.warning(f"Plan already exists at {self.plan_path}")
            return

        initial_plan = {
            "feature": feature_name,
            "description": description,
            "status": "planning",
            "planStatus": "planning",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "phases": [],
            "xstateState": "planning",
            "executionPhase": "planning"
        }
        
        self._save_plan(initial_plan)
        logging.info(f"Created Implementation Plan at {self.plan_path}")

    def add_phase(self, name: str, subtasks: List[Dict[str, Any]]) -> None:
        """
        Add a new phase to the plan.
        """
        if not self.plan_path.exists():
             raise FileNotFoundError(f"Plan not found at {self.plan_path}")
             
        plan = self._load_plan()
        new_phase = {
            "name": name,
            "subtasks": subtasks
        }
        plan["phases"].append(new_phase)
        plan["updated_at"] = datetime.now().isoformat()
        self._save_plan(plan)
        logging.info(f"Added phase '{name}' to plan")

    def _load_plan(self) -> Dict[str, Any]:
        with open(self.plan_path, 'r', encoding='utf-8') as f:
            return json.load(f)
            
    def _save_plan(self, plan: Dict[str, Any]) -> None:
        with open(self.plan_path, 'w', encoding='utf-8') as f:
            json.dump(plan, f, indent=2, ensure_ascii=False)

def main():
    parser = argparse.ArgumentParser(description="Manage implementation_plan.json")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Create command
    create_parser = subparsers.add_parser("create", help="Create a new plan")
    create_parser.add_argument("spec_path", help="Path to the spec file or directory")
    create_parser.add_argument("--feature", required=True, help="Feature name")
    create_parser.add_argument("--desc", required=True, help="Feature description")

    # Add Phase command (basic implementation)
    phase_parser = subparsers.add_parser("add-phase", help="Add a phase to the plan")
    phase_parser.add_argument("plan_path", help="Path to implementation_plan.json")
    phase_parser.add_argument("--name", required=True, help="Phase name")
    
    args = parser.parse_args()
    
    if args.command == "create":
        planner = JsonPlanner(Path(args.spec_path))
        planner.create_plan_template(args.feature, args.desc)
    elif args.command == "add-phase":
        planner = JsonPlanner(Path(args.plan_path))
        # For CLI usage, we might act differently or accept JSON string for subtasks
        # For now, just add an empty phase or example
        planner.add_phase(args.name, [])
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
