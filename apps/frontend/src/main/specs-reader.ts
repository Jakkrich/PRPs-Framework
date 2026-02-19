import { readdir, readFile, stat } from 'fs/promises';
import { join, basename } from 'path';

// Define minimal interfaces for reading JSON
interface ImplementationPlan {
    feature?: string;
    description?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
    phases?: {
        name: string;
        subtasks?: {
            description?: string;
            status: string;
            files?: string[];
        }[];
    }[];
}

// ... (TaskMetadata interface remains same)
interface TaskMetadata {
    category?: string;
    priority?: string;
    complexity?: string;
    impact?: string;
}

export async function listTasks(specsDir: string): Promise<any[]> {
    try {
        const entries = await readdir(specsDir, { withFileTypes: true });

        // Filter directories starting with NNN-
        const taskDirs = entries.filter(e => e.isDirectory() && /^\d{3}-/.test(e.name)); // e.g., 003-xxx

        const tasks = await Promise.all(taskDirs.map(async (dir) => {
            const dirPath = join(specsDir, dir.name);
            const id = dir.name.split('-')[0]; // 003

            // Read implementation_plan.json
            let plan: ImplementationPlan = {};
            try {
                const planContent = await readFile(join(dirPath, 'implementation_plan.json'), 'utf-8');
                plan = JSON.parse(planContent);
            } catch (e) {
                // file missing or invalid
            }

            // Read task_metadata.json
            let meta: TaskMetadata = {};
            try {
                const metaContent = await readFile(join(dirPath, 'task_metadata.json'), 'utf-8');
                meta = JSON.parse(metaContent);
            } catch (e) {
                // file missing
            }

            // Calculate progress & Collect subtasks
            const phases = plan.phases || [];
            let totalSubtasks = 0;
            let completedSubtasks = 0;
            const allSubtasks: any[] = [];

            phases.forEach(phase => {
                const subs = phase.subtasks || [];
                totalSubtasks += subs.length;
                subs.forEach(s => {
                    allSubtasks.push({
                        description: s.description || '',
                        status: s.status
                    });
                    if (s.status === 'completed' || s.status === 'done' || s.status === '✅') {
                        completedSubtasks++;
                    }
                });
            });

            const progress = totalSubtasks > 0
                ? Math.round((completedSubtasks / totalSubtasks) * 100)
                : 0;

            return {
                id,
                title: (plan.feature || dir.name).replace(/^\d{3}[-:]\s*/, ''),
                description: plan.description || '',
                status: plan.status || 'pending',
                category: meta.category || 'feat',
                priority: meta.priority || 'medium',
                complexity: meta.complexity,
                impact: meta.impact,
                phases_total: phases.length,
                phases_completed: phases.filter(p => !p.subtasks || p.subtasks.every(s => s.status === 'done' || s.status === 'completed')).length, // rough estimate
                progress,
                subtasks: allSubtasks,
                created_at: plan.created_at,
                updated_at: plan.updated_at
            };
        }));

        // Sort by ID desc
        return tasks.sort((a, b) => b.id.localeCompare(a.id));

    } catch (error) {
        console.error('Error listing tasks:', error);
        return [];
    }
}

export async function getTaskDetail(specsDir: string, id: string): Promise<any | null> {
    try {
        const entries = await readdir(specsDir, { withFileTypes: true });
        // Find directory starting with ID
        const taskDir = entries.find(e => e.isDirectory() && e.name.startsWith(id + '-'));

        if (!taskDir) return null;

        const dirPath = join(specsDir, taskDir.name);

        // Read files
        const planPath = join(dirPath, 'implementation_plan.json');
        const specPath = join(dirPath, 'spec.md');
        const qaPath = join(dirPath, 'qa_report.md');
        const metaPath = join(dirPath, 'task_metadata.json');

        const [planContent, specContent, qaContent, metaContent] = await Promise.all([
            readFile(planPath, 'utf-8').catch(() => '{}'),
            readFile(specPath, 'utf-8').catch(() => ''),
            readFile(qaPath, 'utf-8').catch(() => ''),
            readFile(metaPath, 'utf-8').catch(() => '{}')
        ]);

        const plan: ImplementationPlan = JSON.parse(planContent);
        const meta: TaskMetadata = JSON.parse(metaContent);

        // Extract files involved
        const filesInvolved: any[] = [];
        const phases = plan.phases || [];

        phases.forEach(phase => {
            const subs = phase.subtasks || [];
            subs.forEach(sub => {
                if (sub.files) {
                    sub.files.forEach(f => {
                        // Avoid duplicates? Or show per phase?
                        // Let's show per phase
                        filesInvolved.push({
                            path: f,
                            phase: phase.name,
                            status: 'modified' // simplified
                        });
                    });
                }
            });
        });

        // Reuse list logic for base props (simplified here)
        // ... logic duplicated for brevity, but could be shared
        let totalSubtasks = 0;
        let completedSubtasks = 0;

        phases.forEach(phase => {
            const subs = phase.subtasks || [];
            totalSubtasks += subs.length;
            completedSubtasks += subs.filter(s =>
                s.status === 'completed' || s.status === 'done' || s.status === '✅'
            ).length;
        });

        const progress = totalSubtasks > 0
            ? Math.round((completedSubtasks / totalSubtasks) * 100)
            : 0;

        return {
            id,
            title: (plan.feature || taskDir.name).replace(/^\d{3}[-:]\s*/, ''),
            description: plan.description || '',
            status: plan.status || 'pending',
            category: meta.category || 'feat',
            priority: meta.priority || 'medium',
            complexity: meta.complexity,
            impact: meta.impact,
            phases_total: phases.length,
            phases_completed: phases.filter(p => !p.subtasks || p.subtasks.every(s => s.status === 'done' || s.status === 'completed')).length,
            progress,
            created_at: plan.created_at,
            updated_at: plan.updated_at,

            // Detail specific
            spec_content: specContent,
            qa_report_content: qaContent,
            plan_content: planContent, // if needed raw
            phases: phases,
            files_involved: filesInvolved
        };

    } catch (error) {
        console.error(`Error getting task detail for ${id}:`, error);
        return null;
    }
}
