import { useState } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { useTasks } from './hooks/useTasks';
import { TaskDetailModal } from './components/task-detail/TaskDetailModal';

function App(): JSX.Element {
    const { tasks, loading, refetch } = useTasks();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    return (
        <div className="flex h-screen flex-col bg-background text-foreground font-sans">
            <Header tasks={tasks} onRefetch={refetch} loading={loading} />
            <div className="flex-1 overflow-hidden">
                <KanbanBoard tasks={tasks} onTaskClick={setSelectedTaskId} />
            </div>

            {selectedTaskId && (
                <TaskDetailModal
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                />
            )}
        </div>
    );
}

export default App;
