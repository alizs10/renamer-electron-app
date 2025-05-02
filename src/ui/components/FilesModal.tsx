import { FileIcon, XIcon } from 'lucide-react';
import { createPortal } from 'react-dom'

type FilesModalProps = {
    onClose: () => void;
    files: string[]
}

function FileItem({ file }: { file: string }) {
    return (
        <div className='col-span-1 flex flex-col gap-y-2 rounded-xl justify-center items-center aspect-square bg-gray-600'>
            <FileIcon className='size-10 text-gray-800' />
            <span className='text-xs text-wrap break-words max-w-[80%] line-clamp-2 text-center text-white'>{file}</span>
        </div>
    )
}

export default function FilesModal({ onClose, files }: FilesModalProps) {
    return createPortal((
        <div
            onClick={onClose}
            className='fixed inset-0 bg-black/50 flex justify-center items-center'>
            <div
                onClick={e => e.stopPropagation()}
                className="w-[80%] h-full flex max-h-[70%] overflow-y-scroll flex-col gap-y-4 rounded-xl bg-gray-800">

                <div className="p-3 flex flex-row justify-between items-center border-b border-gray-500 sticky top-0 bg-gray-800">
                    <h1 className='text-3xl text-white'>Selected Files</h1>
                    <button
                        onClick={onClose}
                        className='app_button'>
                        <XIcon className='size-5' />
                    </button>
                </div>


                <div className="grid grid-cols-5 gap-2 p-3">

                    {files.map((file, index) => <FileItem key={index} file={file} />)}

                </div>



            </div>
        </div>
    ), document.getElementById('modal-portal')!)
}
