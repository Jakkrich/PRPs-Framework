import { ipcMain } from 'electron';
import { listTasks, getTaskDetail } from './specs-reader';

export function registerIpcHandlers(specsDir: string) {
    ipcMain.handle('specs:list', async () => {
        // console.log('Handling specs:list from', specsDir);
        const tasks = await listTasks(specsDir);
        // console.log('Found', tasks.length, 'tasks');
        return tasks;
    });

    ipcMain.handle('specs:detail', async (_, id: string) => {
        // console.log('Handling specs:detail for', id);
        const detail = await getTaskDetail(specsDir, id);
        return detail;
    });
}
