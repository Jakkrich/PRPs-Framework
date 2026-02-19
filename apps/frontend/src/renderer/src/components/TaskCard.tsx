import { Task } from '../types/task';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';
import { formatRelativeTime } from '../lib/utils';
import { Clock, Layers } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
}

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'purple' }> = {
    pending: { label: 'Pending', variant: 'secondary' },
    planning: { label: 'Planning', variant: 'info' },
    in_progress: { label: 'In Progress', variant: 'warning' },
    queue: { label: 'Queue', variant: 'warning' }, // Using warning for active/queue
    human_review: { label: 'Review', variant: 'purple' },
    ai_review: { label: 'AI Review', variant: 'purple' },
    done: { label: 'Done', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'destructive' },
};

export function TaskCard({ task, onClick }: TaskCardProps) {
    const statusConfig = statusMap[task.status] || { label: task.status, variant: 'secondary' as const };

    // Calculate segments for progress (10 segments)
    const totalSegments = 10;
    const filledSegments = Math.round((task.progress / 100) * totalSegments);

    return (
        <Card
            className="cursor-pointer hover:border-primary/50 hover:bg-accent/5 transition-all group relative overflow-hidden rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm"
            onClick={onClick}
        >
            <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity",
                task.status === 'done' ? 'bg-success' :
                    task.status === 'in_progress' ? 'bg-warning' :
                        task.status === 'planning' ? 'bg-info' :
                            task.status === 'human_review' ? 'bg-purple-500' :
                                'bg-primary'
            )} />

            <CardHeader className="p-3 pb-3 space-y-1.5">
                <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] text-muted-foreground/60 tracking-wider">#{task.id}</span>
                    {/* Status Indicator Dot - High Visibility */}
                    <div className={cn(
                        "h-2.5 w-2.5 rounded-full shrink-0 ring-1 ring-black/50 transition-all duration-500",
                        task.status === 'in_progress' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse' :
                            task.status === 'done' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' :
                                task.status === 'planning' ? 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.5)]' :
                                    task.status === 'human_review' || task.status === 'ai_review' ? 'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.5)]' :
                                        'bg-white/30'
                    )} />
                </div>
                <CardTitle className="text-sm font-medium leading-relaxed line-clamp-2 text-foreground/90">
                    {task.title}
                </CardTitle>

                {/* Description */}
                {task.description && (
                    <p className="text-[10px] text-muted-foreground/80 line-clamp-2 mt-0.5 mb-1 leading-relaxed font-sans">
                        {task.description}
                    </p>
                )}

                {/* Categories / Tags - High Contrast Pills */}
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {task.category && (
                        <span className={cn(
                            "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase",
                            task.category === 'feat' || task.category === 'feature' ? 'bg-[#D946EF] text-white shadow-sm' :
                                task.category === 'fix' || task.category === 'bug' ? 'bg-[#FF5C5C] text-black shadow-sm' :
                                    task.category === 'refactor' ? 'bg-[#479FFA] text-white shadow-sm' :
                                        task.category === 'doc' || task.category === 'docs' ? 'bg-zinc-600 text-white shadow-sm' :
                                            'bg-secondary text-secondary-foreground'
                        )}>
                            {task.category}
                        </span>
                    )}
                    {task.priority && (
                        <span className={cn(
                            "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase",
                            task.priority === 'critical' || task.priority === 'high' ? 'bg-[#D2D714] text-black shadow-[0_2px_8px_rgba(210,215,20,0.2)]' :
                                task.priority === 'medium' ? 'bg-secondary text-secondary-foreground border border-border' :
                                    'bg-[#4EBE96] text-black'
                        )}>
                            {task.priority}
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-3 pt-0 pb-2 space-y-2">
                {/* Circular Progress Dots */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-semibold text-muted-foreground/80">
                        <span>PROGRESS</span>
                        <span>{task.progress}%</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {task.subtasks && task.subtasks.length > 0 ? (
                            task.subtasks.map((sub, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1.5 w-1.5 rounded-full transition-all duration-300",
                                        // Check if subtask is completed
                                        (sub.status === 'done' || sub.status === 'completed' || sub.status === '✅' || sub.status === 'checked')
                                            ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]"
                                            : "bg-white/20 border-transparent"
                                    )}
                                    title={sub.description}
                                />
                            ))
                        ) : (
                            // Fallback: Use phases if available, otherwise 5 dots
                            Array.from({ length: task.phases_total > 0 ? task.phases_total : 5 }).map((_, i) => {
                                const total = task.phases_total > 0 ? task.phases_total : 5;
                                const completed = task.phases_total > 0
                                    ? task.phases_completed
                                    : Math.round((task.progress / 100) * 5);

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full transition-all duration-300",
                                            i < completed
                                                ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]"
                                                : "bg-white/20 border-transparent"
                                        )}
                                        title={task.phases_total > 0 ? `Phase ${i + 1}` : `Progress part ${i + 1}`}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-3 pt-0 text-[9px] text-muted-foreground flex justify-between items-center">
                <div className="flex items-center gap-1.5 opacity-70">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{formatRelativeTime(task.updated_at || task.created_at || '')}</span>
                </div>

                <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/50 hover:bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-[9px] font-medium flex items-center gap-1">
                    Details <Layers className="h-2.5 w-2.5" />
                </button>
            </CardFooter>
        </Card >
    );
}
