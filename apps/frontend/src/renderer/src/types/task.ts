export type TaskStatus =
    | 'pending'
    | 'planning'
    | 'in_progress'
    | 'queue'
    | 'human_review'
    | 'ai_review'
    | 'done'
    | 'rejected';

// Subtask inside phases
export interface Subtask {
    id: string;
    description: string;
    status: string; // 'pending' | 'completed' | 'skipped' | 'failed' | '✅' | '⏳' etc.
    files?: string[];
    verification?: string;
}

// Phase inside implementation plan
export interface Phase {
    name: string;
    description?: string;
    subtasks: Subtask[];
}

// Base Task interface (for List View)
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    category?: string; // feat, fix, chore
    priority?: string; // high, medium, low
    complexity?: string; // high, medium, low
    impact?: string; // high, medium, low
    phases_total: number;
    phases_completed: number;
    progress: number; // 0-100
    subtasks?: Subtask[];
    created_at?: string;
    updated_at?: string;
}

// Detailed Task interface (for Detail Modal)
export interface TaskDetail extends Task {
    description: string;
    spec_content?: string;      // Markdown content from spec.md
    qa_report_content?: string; // Markdown content from qa_report.md
    phases: Phase[];           // Full phases from implementation_plan.json
    files_involved: {
        path: string;
        phase: string;
        status: 'modified' | 'created' | 'deleted' | 'read';
    }[];
}

// IPC API definition
export interface SpecsAPI {
    listTasks: () => Promise<Task[]>;
    getTaskDetail: (id: string) => Promise<TaskDetail | null>;
}

declare global {
    interface Window {
        specsAPI: SpecsAPI;
    }
}
