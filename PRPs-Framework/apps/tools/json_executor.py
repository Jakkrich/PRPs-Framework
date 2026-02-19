
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional, Tuple
import argparse
import sys

class JsonExecutor:
    """
    Helper class to read and update implementation_plan.json during execution.
    """
    
    def __init__(self, plan_path: Path):
        self.plan_path = Path(plan_path).resolve()
        if not self.plan_path.exists():
             raise FileNotFoundError(f"Plan not found at {self.plan_path}")
    
    def get_next_pending_task(self) -> Optional[Tuple[str, str, Dict[str, Any]]]:
        """
        Finds the first pending subtask.
        Returns: (Phase Name, Task ID, Task Object) or None
        """
        plan = self._load_plan()
        
        for phase in plan.get("phases", []):
            for task in phase.get("subtasks", []):
                if task.get("status") == "pending":
                    return phase["name"], task["id"], task
                    
        return None

    def mark_task_complete(self, task_id: str, files_touched: list = None) -> None:
        """
        Marks a specific task as completed.
        """
        plan = self._load_plan()
        found = False
        
        for phase in plan.get("phases", []):
            for task in phase.get("subtasks", []):
                if task["id"] == task_id:
                    task["status"] = "completed"
                    if files_touched:
                        # Append new files if not present
                        existing_files = set(task.get("files", []))
                        existing_files.update(files_touched)
                        task["files"] = list(existing_files)
                    found = True
                    break
            if found:
                break
                
        if found:
            plan["updated_at"] = datetime.now().isoformat()
            # Check if all tasks done?
            all_done = True
            for phase in plan.get("phases", []):
                for task in phase.get("subtasks", []):
                     if task.get("status") != "completed":
                         all_done = False
                         break
            if all_done:
                plan["status"] = "ai_review"
                plan["xstateState"] = "ai_review"

                
            self._save_plan(plan)
            logging.info(f"Marked task {task_id} as completed.")
        else:
            logging.warning(f"Task {task_id} not found.")

    def set_status(self, status: str) -> None:
        """
        Manually trigger a status update.
        """
        plan = self._load_plan()
        plan["status"] = status
        # Sync xstateState for known states
        known_states = ["planning", "queue", "in_progress", "ai_review", "human_review", "done"]
        if status in known_states:
             plan["xstateState"] = status
        
        # Sync planStatus with status
        plan["planStatus"] = status
        
        plan["updated_at"] = datetime.now().isoformat()
        self._save_plan(plan)
        logging.info(f"Updated status to {status}")

    def _load_plan(self) -> Dict[str, Any]:

        with open(self.plan_path, 'r', encoding='utf-8') as f:
            return json.load(f)
            
    def _save_plan(self, plan: Dict[str, Any]) -> None:
        with open(self.plan_path, 'w', encoding='utf-8') as f:
            json.dump(plan, f, indent=2, ensure_ascii=False)


def main():
    parser = argparse.ArgumentParser(description="Execute implementation_plan.json")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Next Task command
    next_parser = subparsers.add_parser("next", help="Get next pending task")
    next_parser.add_argument("plan_path", help="Path to implementation_plan.json")
    
    # Complete Task command
    complete_parser = subparsers.add_parser("complete", help="Mark task as complete")
    complete_parser.add_argument("plan_path", help="Path to implementation_plan.json")
    complete_parser.add_argument("task_id", help="Task ID to complete")
    complete_parser.add_argument("--files", nargs="*", help="Files touched")
    
    # Set Status command
    status_parser = subparsers.add_parser("set-status", help="Set plan status")
    status_parser.add_argument("plan_path", help="Path to implementation_plan.json")
    status_parser.add_argument("status", help="New status")

    args = parser.parse_args()
    
    if args.command == "next":
        executor = JsonExecutor(Path(args.plan_path))
        task = executor.get_next_pending_task()
        if task:
            phase_name, task_id, task_data = task
            print(f"PHASE: {phase_name}")
            print(f"TASK_ID: {task_id}")
            print(f"DESCRIPTION: {task_data['description']}")
            print(f"FILES: {', '.join(task_data.get('files', []))}")
        else:
            print("NO_PENDING_TASKS")
            
    elif args.command == "complete":
        executor = JsonExecutor(Path(args.plan_path))
        executor.mark_task_complete(args.task_id, args.files)
        print(f"Task {args.task_id} completed.")
        
    elif args.command == "set-status":
        executor = JsonExecutor(Path(args.plan_path))
        executor.set_status(args.status)
        print(f"Status set to {args.status}")
        
    else:
        parser.print_help()

if __name__ == "__main__":
    main()

