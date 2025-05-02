import { FileIcon, TrashIcon, XIcon } from 'lucide-react';
import { createPortal } from 'react-dom'
import { useState } from 'react';
import useAppStore, { File } from '../store/store';

type FilesModalProps = {
    files: File[]
}

type FileItemProps = {
    file: File;
}

function FileItem({ file }: FileItemProps) {

    const { deleteFile } = useAppStore()
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className='relative overflow-hidden col-span-1 flex flex-col gap-y-2 rounded-xl justify-center items-center aspect-square bg-gray-600'>
            <FileIcon className='size-10 text-gray-800' />
            <span className='text-xs text-wrap break-words max-w-[80%] line-clamp-2 text-center text-white'>{file.name}</span>

            {isHovered && (
                <div
                    onClick={() => deleteFile(file.id)}
                    className="cursor-pointer absolute inset-0 bg-black/70 flex justify-center items-center">
                    <TrashIcon className='size-7 text-red-500' />
                </div>
            )}

        </div>
    )
}

export default function FilesModal({ files }: FilesModalProps) {

    const { setSelectedFilesModalVis } = useAppStore()

    const onClose = () => {
        setSelectedFilesModalVis(false)
    }

    return createPortal((
        <div
            onClick={onClose}
            className='fixed inset-0 bg-black/50 flex justify-center items-center'>
            <div
                onClick={e => e.stopPropagation()}
                className="w-[80%] h-full flex max-h-[70%] overflow-y-scroll flex-col gap-y-4 rounded-xl bg-gray-800">

                <div className="p-3 flex flex-row justify-between items-center border-b border-gray-500 sticky z-50 top-0 bg-gray-800">
                    <h1 className='text-3xl text-white'>Selected Files</h1>
                    <button
                        onClick={onClose}
                        className='app_button'>
                        <XIcon className='size-5' />
                    </button>
                </div>


                <div className="grid grid-cols-5 gap-2 p-3">
                    {files.map((file) => <FileItem key={file.id} file={file} />)}
                </div>



            </div>
        </div>
    ), document.getElementById('modal-portal')!)
}
