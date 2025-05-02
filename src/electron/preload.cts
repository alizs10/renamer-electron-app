const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: () => electron.ipcRenderer.invoke('select-folder'),
    getFiles: (folderPath: string) => electron.ipcRenderer.invoke('get-files', folderPath),
} satisfies Window['electronAPI']);