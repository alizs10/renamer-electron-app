import { useState } from "react";
import FilesModal from "./components/FilesModal";
import { BanIcon, EyeIcon, FilesIcon, FolderInputIcon, PlayIcon, RotateCcw } from "lucide-react";

export default function App() {

  const [filesModalVis, setFilesModalVis] = useState(false)
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  const firstFileExt = files[0]?.split('.').pop() ?? '';

  const [renamingType, setRenamingType] = useState<"numeric" | "date" | "custom">("numeric");

  function handleRenamingTypeChange(type: "numeric" | "custom" | "date") {
    setRenamingType(type);
  }

  function toggleFilesModal() {
    setFilesModalVis(prev => !prev)
  }

  const handleSelectFolder = async () => {
    const path = await window.electronAPI.selectFolder();
    if (path) {
      setFolderPath(path);
      const fileList = await window.electronAPI.getFiles(path);
      setFiles(fileList);
    }
  };

  return (
    <div className="relative bg-black text-white min-h-screen">
      <div className="p-3 flex justify-between items-center">
        <h1 className="text-white text-3xl">
          Renamer <span className="text-xs">version: 0.0.0</span>
        </h1>
      </div>


      <div className="p-3 flex flex-col gap-y-2">
        <label className="text-gray-300">Select Directory</label>
        <div className="flex flex-row gap-x-2">
          <input
            className="bg-gray-800 flex-1 focus:outline-none pointer-events-none select-none rounded-xl px-3 py-2  text-xl"
            type="text"
            value={folderPath ?? ""}
            readOnly />

          <button

            onClick={handleSelectFolder}
            className="app_button relative">
            <FolderInputIcon className="size-7" />
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-y-2">
        <label className="text-gray-300">Select Renaming Type</label>
        <div className="grid grid-cols-3 gap-x-2">
          <button
            onClick={() => handleRenamingTypeChange('numeric')}
            className={`col-span-1 ${renamingType === 'numeric' ? 'app_button_active' : 'app_button'}`}>Numeric</button>
          <button
            onClick={() => handleRenamingTypeChange('date')}
            className={`col-span-1 ${renamingType === 'date' ? 'app_button_active' : 'app_button'}`}>Date</button>
          <button
            onClick={() => handleRenamingTypeChange('custom')}
            className={`col-span-1 ${renamingType === 'custom' ? 'app_button_active' : 'app_button'}`}>Custom</button>
        </div>
      </div>



      {renamingType === 'custom' && (
        <div className="p-3 flex flex-col gap-y-2">
          <label className="text-gray-300">Custom Name Format</label>
          <input
            className="bg-gray-800 rounded-xl px-3 py-2 focus:outline-none text-xl"
            placeholder="example: File_{number}"
            type="text" />
        </div>
      )}



      <div className="absolute inset-3 bottom-5 top-auto  flex flex-col gap-y-2">
        {files.length > 0 && (
          <div className="p-3 rounded-xl flex justify-between items-center bg-gray-800">
            <span>First File Preview: </span>
            <span>{renamingType === 'numeric' ? '1' : new Date().toLocaleDateString() + '_' + new Date().toLocaleTimeString()}.{firstFileExt}</span>
          </div>
        )}


        <div className="flex flex-row items-center gap-x-2">
          <div className="flex flex-row gap-x-2 justify-center items-center">
            <button className="app_button">
              <PlayIcon className="size-7 text-emerald-400" />
            </button>
            <button className="app_button">
              <RotateCcw className="size-7 text-gray-400" />
            </button>
            <button className="app_button">
              <EyeIcon className="size-7 text-sky-400" />
            </button>
            <button
              onClick={toggleFilesModal}
              className="relative app_button">
              <FilesIcon className="size-7" />
              {files.length > 0 && (

                <span className="absolute bg-yellow-400 text-black bottom-1 right-1 size-5 rounded-full flex justify-center items-center text-xs">
                  {files.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 p-3 rounded-lg bg-gray-600 text-white flex justify-center items-center">
            <span className="h-7 text-lg">{files.length === 0 ? 'No files selected' : `0/${files.length} Files`}</span>
          </div>
          <button className="app_button">
            <BanIcon className="size-7 text-red-400" />
          </button>

          <div className="min-w-12 mt-auto h-full">
            <div className="mt-auto flex flex-row gap-x-2 justify-end items-center">
              <span className="size-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-white">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {filesModalVis && <FilesModal onClose={toggleFilesModal} files={files} />}
    </div>
  )
}
