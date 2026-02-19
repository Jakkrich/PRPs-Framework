import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const specsAPI = {
    listTasks: () => ipcRenderer.invoke('specs:list'),
    getTaskDetail: (id: string) => ipcRenderer.invoke('specs:detail', id)
}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('specsAPI', specsAPI)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.specsAPI = specsAPI
}
