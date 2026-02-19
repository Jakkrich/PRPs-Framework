import { Task } from '../types/task';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
    tasks: Task[];
    onRefetch: () => void;
    loading: boolean;
}

export function Header({ tasks, onRefetch, loading }: HeaderProps) {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-tight text-foreground">PRPs Dashboard</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-4">
                    <div className="h-4 w-[1px] bg-border mr-2"></div>
                    <span className="font-medium text-foreground">{total} Tasks</span>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="text-success">{done} Done</span>
                    <span className="text-muted-foreground/30">•</span>
                    <span>{progress}% Complete</span>
                </div>
            </div>
            <div>
                <Button variant="outline" size="sm" onClick={onRefetch} disabled={loading}>
                    <RotateCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
        </header>
    );
}
