import { useState } from "react";
import FilesModal from "./components/FilesModal";
import { BanIcon, EyeIcon, FilesIcon, FolderInputIcon, PlayIcon, RotateCcw } from "lucide-react";
import useAppStore from "./store/store";

export default function App() {

  const {
    appStatus,
    setAppStatus,
    appReset,
    files,
    setFiles,
    renamingType,
    setRenamingType,
    folderPath,
    setFolderPath,
    selectedFilesModalVis,
    setSelectedFilesModalVis
  } = useAppStore()


  const firstFileExt = files[0]?.name.split('.').pop() ?? '';
  const hasFiles = files.length > 0;

  function handleRenamingTypeChange(type: "numeric" | "custom" | "date") {
    setRenamingType(type);
  }

  function toggleFilesModal() {
    setSelectedFilesModalVis(!selectedFilesModalVis);
  }

  const handleSelectFolder = async () => {
    setAppStatus('processing');
    const path = await window.electronAPI.selectFolder();
    if (path) {
      setFolderPath(path);
      const fileList = await window.electronAPI.getFiles(path);
      const filesWithIds = fileList.map((file, index) => ({ id: index + 1, name: file }));
      setFiles(filesWithIds);
    }

    setAppStatus('ready');

  };

  // Handle renaming
  const handleRename = async () => {
    if (!hasFiles || !folderPath || appStatus === "processing") return;
    setAppStatus("processing");

    try {
      const newNames = files.map((file, index) => {
        const ext = file.name.split(".").pop() || "";
        let newName = "";
        if (renamingType === "numeric") {
          newName = `${index + 1}.${ext}`;
        } else if (renamingType === "date") {
          const now = new Date();
          const dateStr = now
            .toISOString()
            .slice(0, 19) // Get YYYY-MM-DDTHH:mm:ss
            .replace(/T/, "_")
            .replace(/:/g, "-"); // Replace colons with hyphens
          newName = `${dateStr}_${index + 1}.${ext}`; // Add index to avoid conflicts
        }
        return { id: file.id, oldName: file.name, newName };
      });

      // Send renaming request to Electron backend
      const result = await window.electronAPI.renameFiles(
        folderPath,
        newNames.map((item) => ({ oldName: item.oldName, newName: item.newName }))
      );

      if (result.success) {
        // Update files in store with new names
        setFiles(newNames.map((item, index) => ({ id: index + 1, name: item.newName })));
        setAppStatus("ready");
      } else {
        setAppStatus("error");
        alert(`Error renaming files: ${result.error || "Unknown error"}`);
      }
    } catch (error: any) {
      setAppStatus("error");
      alert(`Error: ${error.message || "Unknown error"}`);
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
            <button
              onClick={handleRename}
              className={`${hasFiles ? 'app_button' : 'app_button_disabled'}`}>
              <PlayIcon className="size-7 text-emerald-400" />
            </button>
            <button
              onClick={appReset}
              className={`app_button`}>
              <RotateCcw className="size-7 text-gray-400" />
            </button>
            <button className={`${hasFiles ? 'app_button' : 'app_button_disabled'}`}>
              <EyeIcon className="size-7 text-sky-400" />
            </button>
            <button
              onClick={toggleFilesModal}
              className={`relative ${hasFiles ? 'app_button' : 'app_button_disabled'}`}>
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
          <button className={`${hasFiles ? 'app_button' : 'app_button_disabled'}`}>
            <BanIcon className="size-7 text-red-400" />
          </button>

          <div className="min-w-12 mt-auto h-full">
            <div className="mt-auto flex flex-row gap-x-2 justify-end items-center">
              <span className={`size-2 rounded-full ${appStatus === 'ready' ? 'bg-green-500' : appStatus === 'error' ? 'bg-red-400' : 'bg-sky-400'}`}></span>
              <span className={`text-xs text-white`}>{appStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {selectedFilesModalVis &&
        <FilesModal
          files={files}
        />}
    </div>
  )
}
