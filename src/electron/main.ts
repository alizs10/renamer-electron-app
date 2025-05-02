import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { isDev } from './util.js';
import path from 'path'
import fs from 'fs/promises'
import { getPreloadPath } from './pathResolver.js';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: getPreloadPath(), // Preload script for contextBridge
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123')
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'))
    }
}

// IPC handler for folder selection
ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });

    if (result.canceled) {
        return null;
    }

    return result.filePaths[0]; // Return the selected folder path
});

// IPC handler for reading files in a folder
ipcMain.handle('get-files', async (_event, folderPath: string) => {
    try {
        const files = await fs.readdir(folderPath);
        return files; // Return list of file names
    } catch (error) {
        console.error('Error reading files:', error);
        return [];
    }
});

ipcMain.handle(
    "renameFiles",
    async (_event, folderPath: string, renames: { oldName: string; newName: string }[]): Promise<{ success: boolean; error?: string }> => {
        try {
            for (const { oldName, newName } of renames) {
                const oldPath = path.join(folderPath, oldName);
                const newPath = path.join(folderPath, newName);
                await fs.rename(oldPath, newPath);
            }
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
);

app.on('ready', () => {
    createWindow();
})

//   app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//       app.quit();
//     }
//   });