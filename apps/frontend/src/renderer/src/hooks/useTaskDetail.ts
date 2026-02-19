import { useState, useEffect, useCallback } from 'react';
import type { TaskDetail } from '../types/task';

export function useTaskDetail(id: string | null) {
    const [detail, setDetail] = useState<TaskDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDetail = useCallback(async () => {
        if (!id) {
            setDetail(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            // @ts-ignore
            const data = await window.specsAPI.getTaskDetail(id);
            setDetail(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to fetch task detail');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    return { detail, loading, error, refetch: fetchDetail };
}
