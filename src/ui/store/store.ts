import { create } from 'zustand';

export type File = {
    id: number;
    name: string;
};

export type FolderPath = string | null;

export type AppStatus = 'ready' | 'processing' | 'error';

export type RenamingType = 'numeric' | 'date' | 'custom';

interface AppState {

    // states
    files: File[];
    setFiles: (files: File[]) => void;
    folderPath: FolderPath;
    setFolderPath: (path: FolderPath) => void;
    renamingType: RenamingType;
    setRenamingType: (type: RenamingType) => void;
    appStatus: AppStatus;
    setAppStatus: (status: AppStatus) => void;
    error: string | null;
    setError: (error: string | null) => void;

    // actions
    deleteFile: (id: number) => void;
    appReset: () => void;

    // modals
    selectedFilesModalVis: boolean;
    setSelectedFilesModalVis: (vis: boolean) => void;
}

const useAppStore = create<AppState>((set) => ({

    // states
    files: [],
    setFiles: (files: File[]) => set(() => ({ files })),
    folderPath: '',
    setFolderPath: (path: FolderPath) => set(() => ({ folderPath: path })),
    renamingType: 'numeric',
    setRenamingType: (type: RenamingType) => set(() => ({ renamingType: type })),
    appStatus: 'ready',
    setAppStatus: (status: AppStatus) => set(() => ({ appStatus: status })),
    error: null,
    setError: (error: string | null) => set(() => ({ error })),

    // actions
    deleteFile: (id: number) => set((state) => ({ files: state.files.filter(file => file.id !== id) })),
    appReset: () => set(() => ({
        files: [],
        folderPath: null,
        appStatus: 'ready',
        error: null,
        renamingType: 'numeric',
    })),

    // modals
    selectedFilesModalVis: false,
    setSelectedFilesModalVis: (vis: boolean) => set(() => ({ selectedFilesModalVis: vis })),
}));

export default useAppStore;