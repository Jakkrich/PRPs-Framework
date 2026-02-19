import { Task } from '../types/task';
import { TaskCard } from './TaskCard';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import {
    CircleDashed,
    ClipboardList,
    Loader2,
    Eye,
    CheckCircle2,
    Brain,
    UserCheck
} from 'lucide-react';

interface KanbanBoardProps {
    tasks: Task[];
    taskDetail?: any;
    onTaskClick: (taskId: string) => void;
    isTaskLoading?: boolean;
}

const getColumnColor = (id: string) => {
    switch (id) {
        case 'done': return 'text-success border-success/30 bg-success/5';
        case 'in_progress': return 'text-warning border-warning/30 bg-warning/5';
        case 'queue': return 'text-orange-400 border-orange-500/30 bg-orange-500/5';
        case 'human_review': return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
        case 'ai_review': return 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/5';
        case 'planning': return 'text-info border-info/30 bg-info/5';
        default: return 'text-muted-foreground border-border/40 bg-secondary/20';
    }
};

export function KanbanBoard({ tasks, onTaskClick, isTaskLoading = false }: KanbanBoardProps) {
    const columns = [
        { id: 'planning', title: 'Planning', icon: ClipboardList, status: ['planning'] },
        { id: 'queue', title: 'Queue', icon: CircleDashed, status: ['pending', 'queue'] },
        { id: 'in_progress', title: 'In Progress', icon: Loader2, status: ['in_progress'] },
        { id: 'ai_review', title: 'AI Review', icon: Brain, status: ['ai_review'] },
        { id: 'human_review', title: 'Human Review', icon: UserCheck, status: ['human_review'] },
        { id: 'done', title: 'Done', icon: CheckCircle2, status: ['done'] },
    ];

    const getColumnTasks = (statusList: string[]) => {
        return tasks.filter(t => statusList.includes(t.status));
    };

    return (
        <ScrollArea className="h-full w-full bg-background" viewportClassName="h-full">
            <div className="flex h-full gap-4 p-6 min-w-max">
                {columns.map((col) => {
                    const colTasks = getColumnTasks(col.status);

                    return (
                        <div key={col.id} className="w-[320px] shrink-0 flex flex-col h-full snap-start group">
                            <div className="flex flex-1 flex-col rounded-2xl border border-white/5 bg-gradient-to-b from-secondary/30 to-transparent backdrop-blur-sm transition-all duration-300">
                                {/* Column Header */}
                                <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
                                    <div className="flex items-center gap-2.5">
                                        <col.icon className={cn("h-4 w-4 opacity-70", col.id === 'in_progress' ? 'animate-spin-slow' : '')} />
                                        <h2 className="font-semibold text-sm tracking-tight opacity-90">{col.title}</h2>
                                        <Badge variant="secondary" className="bg-background/40 backdrop-blur-md border-white/10 text-foreground/70 font-mono text-[10px] h-5 min-w-[1.5rem] justify-center shadow-sm">
                                            {colTasks.length}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Removed Plus button as requested */}
                                    </div>
                                </div>

                                {/* Task List */}
                                <div className="flex-1 min-h-0 relative">
                                    <ScrollArea className="h-full px-3 pb-3 pt-2 absolute inset-0" viewportClassName="h-full">
                                        <div className="space-y-2.5 min-h-full flex flex-col">
                                            {isTaskLoading && colTasks.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/40 gap-3 h-full flex-1">
                                                    <Loader2 className="h-6 w-6 animate-spin" />
                                                    <span className="text-xs">Loading tasks...</span>
                                                </div>
                                            ) : colTasks.length > 0 ? (
                                                <>
                                                    {colTasks.map(task => (
                                                        <div key={task.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards shrink-0">
                                                            <TaskCard task={task} onClick={() => onTaskClick(task.id)} />
                                                        </div>
                                                    ))}
                                                    <div className="flex-1" /> {/* Spacer to push content up if needed */}
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/20 gap-3 h-full flex-1">
                                                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                                                        <col.icon className="h-5 w-5 opacity-40" />
                                                    </div>
                                                    <span className="text-[10px] font-medium uppercase tracking-widest opacity-50">Empty</span>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
