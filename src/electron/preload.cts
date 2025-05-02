const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: () => electron.ipcRenderer.invoke('select-folder'),
    getFiles: (folderPath: string) => electron.ipcRenderer.invoke('get-files', folderPath),
    renameFiles: (folderPath: string, renames: { oldName: string; newName: string }[]) =>
        electron.ipcRenderer.invoke("renameFiles", folderPath, renames),
    getFileIcon: (filePath: string) => electron.ipcRenderer.invoke('get-file-icon', filePath),
} satisfies Window['electronAPI']);