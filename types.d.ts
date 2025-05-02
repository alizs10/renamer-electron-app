// src/types/electron.d.ts
interface ElectronAPI {
    selectFolder: () => Promise<string | null>;
    getFiles: (folderPath: string) => Promise<string[]>;
    renameFiles: (
        folderPath: string,
        renames: { oldName: string; newName: string }[]
    ) => Promise<{ success: boolean; error?: string }>;
    getFileIcon: (filePath: string) => Promise<string>;
}

interface Window {
    electronAPI: ElectronAPI;
}
