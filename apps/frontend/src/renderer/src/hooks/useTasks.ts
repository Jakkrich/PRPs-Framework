import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types/task';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            setError(null);
            // @ts-ignore
            const data = await window.specsAPI.listTasks();
            setTasks(data);
        } catch (err: any) {
            console.error(err);
            if (!isBackground) setError(err.message || 'Failed to fetch tasks');
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks(); // Initial load

        const interval = setInterval(() => {
            fetchTasks(true); // Silent background refresh
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchTasks]);

    return { tasks, loading, error, refetch: fetchTasks };
}
