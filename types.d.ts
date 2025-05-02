// src/types/electron.d.ts
interface ElectronAPI {
    selectFolder: () => Promise<string | null>;
    getFiles: (folderPath: string) => Promise<string[]>;
}

interface Window {
    electronAPI: ElectronAPI;
}
